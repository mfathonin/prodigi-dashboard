import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import { execute, queryOne } from "@/lib/db/utils";
import type { AppUser } from "./types";

const COOKIE_NAME = "app_session";
const TTL_DAYS = 14;

function sha256(v: string) {
  return createHash("sha256").update(v).digest("hex");
}

function expiryIso() {
  return new Date(Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const tokenHash = sha256(token);
  await execute(
    `insert into sessions (token_hash, user_id, expires_at, created_at) values (?, ?, ?, ?)
     on conflict(token_hash) do update set user_id=excluded.user_id, expires_at=excluded.expires_at`,
    [tokenHash, userId, expiryIso(), new Date().toISOString()]
  );

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (token) {
    await execute(`delete from sessions where token_hash = ?`, [sha256(token)]);
  }
  cookies().delete(COOKIE_NAME);
}

export async function getSessionUser(): Promise<AppUser | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = await queryOne<{ user_id: string; expires_at: string }>(
    `select user_id, expires_at from sessions where token_hash = ?`,
    [sha256(token)]
  );

  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await execute(`delete from sessions where token_hash = ?`, [sha256(token)]);
    return null;
  }

  const user = await queryOne<AppUser>(
    `select id, email, created_at, updated_at, last_sign_in_at from users where id = ?`,
    [session.user_id]
  );

  return user ?? null;
}
