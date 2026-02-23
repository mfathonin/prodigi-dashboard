import { randomBytes, createHash, randomUUID } from "crypto";
import { execute, query, queryOne, withTransaction } from "@/lib/db/utils";
import { hashPassword, verifyPassword } from "./password";
import { createSession, destroySession, getSessionUser } from "./session";
import type { AppUser, SessionUser } from "./types";

const DUMMY_PASSWORD_HASH = hashPassword("__dummy_password__");

function sha256(v: string) {
  return createHash("sha256").update(v).digest("hex");
}

function tokenTtl(hours: number) {
  return new Date(Date.now() + hours * 3600 * 1000).toISOString();
}

export async function signInWithPassword(email: string, password: string) {
  const row = await queryOne<AppUser & { password_hash: string }>(
    `select id, email, created_at, updated_at, last_sign_in_at, password_hash from users where lower(email)=lower(?)`,
    [email]
  );
  const hashToVerify = row?.password_hash ?? DUMMY_PASSWORD_HASH;
  const valid = verifyPassword(password, hashToVerify);
  if (!row || !valid) {
    return { user: null, error: new Error("Invalid credentials") };
  }

  const now = new Date().toISOString();
  await execute(`update users set last_sign_in_at = ?, updated_at = ? where id = ?`, [
    now,
    now,
    row.id,
  ]);
  await createSession(row.id);

  const user: AppUser = {
    id: row.id,
    email: row.email,
    created_at: row.created_at,
    updated_at: now,
    last_sign_in_at: now,
  };

  return { user, error: null };
}

export async function signOut() {
  await destroySession();
  return { error: null };
}

export async function currentUserWithRoles(): Promise<SessionUser | null> {
  const user = await getSessionUser();
  if (!user) return null;
  const roles = await query<{ id: string; role: string }>(
    `select id, role from user_roles where id = ?`,
    [user.id]
  );
  return { ...user, user_roles: roles };
}

export async function isAdmin(userId: string) {
  const role = await queryOne<{ role: string }>(
    `select role from user_roles where id = ? and role = 'admin'`,
    [userId]
  );
  return Boolean(role);
}

export async function requestPasswordReset(email: string) {
  const user = await queryOne<{ id: string }>(`select id from users where lower(email)=lower(?)`, [email]);
  if (!user) return { token: null };

  const token = randomBytes(32).toString("hex");
  await execute(
    `insert into password_reset_tokens (token_hash, user_id, expires_at, created_at) values (?, ?, ?, ?)
     on conflict(token_hash) do update set user_id = excluded.user_id, expires_at = excluded.expires_at`,
    [sha256(token), user.id, tokenTtl(1), new Date().toISOString()]
  );
  return { token };
}

export async function consumePasswordResetToken(token: string, newPassword: string) {
  const tokenHash = sha256(token);
  const userId = await withTransaction(async (db) => {
    const row = await db.queryOne<{ user_id: string; expires_at: string }>(
      `select user_id, expires_at from password_reset_tokens where token_hash = ?`,
      [tokenHash]
    );
    if (!row) throw new Error("Invalid token");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Token expired");

    const now = new Date().toISOString();
    await db.execute(`update users set password_hash = ?, updated_at = ? where id = ?`, [
      hashPassword(newPassword),
      now,
      row.user_id,
    ]);
    const deleted = await db.execute(
      `delete from password_reset_tokens where token_hash = ?`,
      [tokenHash]
    );
    if (deleted.rowsAffected === 0) throw new Error("Invalid token");

    return row.user_id;
  });

  try {
    await createSession(userId);
  } catch (error) {
    console.error("[auth/service] failed to create session after password reset", {
      userId,
      error,
    });
    throw new Error("Session setup failed");
  }
}

export async function updatePasswordForCurrentUser(newPassword: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  await execute(`update users set password_hash = ?, updated_at = ? where id = ?`, [
    hashPassword(newPassword),
    new Date().toISOString(),
    user.id,
  ]);
}

export async function deleteUserById(userId: string) {
  await withTransaction(async (db) => {
    await db.execute(`delete from sessions where user_id = ?`, [userId]);
    await db.execute(`delete from user_roles where id = ?`, [userId]);
    await db.execute(`delete from users where id = ?`, [userId]);
  });
}

export async function inviteUserByEmail(email: string) {
  const token = randomBytes(32).toString("hex");
  await execute(
    `insert into invite_tokens (token_hash, email, expires_at, created_at) values (?, ?, ?, ?)
     on conflict(token_hash) do update set email = excluded.email, expires_at = excluded.expires_at`,
    [sha256(token), email, tokenTtl(72), new Date().toISOString()]
  );
  return { token, email };
}

export async function consumeInviteToken(token: string, password: string) {
  const tokenHash = sha256(token);
  const userId = await withTransaction(async (db) => {
    const row = await db.queryOne<{ email: string; expires_at: string }>(
      `select email, expires_at from invite_tokens where token_hash = ?`,
      [tokenHash]
    );
    if (!row) throw new Error("Invalid invite token");
    if (new Date(row.expires_at).getTime() < Date.now()) throw new Error("Invite token expired");

    const existing = await db.queryOne<{ id: string }>(
      `select id from users where lower(email)=lower(?)`,
      [row.email]
    );
    const nextUserId = existing?.id ?? randomUUID();
    const now = new Date().toISOString();

    if (existing) {
      await db.execute(`update users set password_hash = ?, updated_at = ? where id = ?`, [
        hashPassword(password),
        now,
        nextUserId,
      ]);
    } else {
      await db.execute(
        `insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)`,
        [nextUserId, row.email, hashPassword(password), now, now]
      );
    }

    await db.execute(`insert or ignore into user_roles (id, role, created_at) values (?, 'user', ?)`, [
      nextUserId,
      now,
    ]);
    const deleted = await db.execute(
      `delete from invite_tokens where token_hash = ?`,
      [tokenHash]
    );
    if (deleted.rowsAffected === 0) throw new Error("Invalid invite token");

    return nextUserId;
  });

  try {
    await createSession(userId);
  } catch (error) {
    console.error("[auth/service] failed to create session after invite consume", {
      userId,
      error,
    });
    throw new Error("Session setup failed");
  }
}
