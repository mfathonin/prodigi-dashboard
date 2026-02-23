const { createClient } = require("@libsql/client");
const { randomUUID, scryptSync, randomBytes } = require("crypto");

const EMAILS_ENV = "SEED_ADMIN_EMAILS";
const PASSWORD_ENV = "SEED_ADMIN_PASSWORD";
const LEGACY_EMAILS_ENV = "DEV_ADMIN_EMAILS";
const LEGACY_PASSWORD_ENV = "DEV_ADMIN_PASSWORD";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function parseAdminEmails(rawEmails) {
  return [...new Set(
    rawEmails
      .split(/[,\n]/)
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  )];
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getSeedConfig() {
  const rawEmails = process.env[EMAILS_ENV] || process.env[LEGACY_EMAILS_ENV] || "";
  const password = process.env[PASSWORD_ENV] || process.env[LEGACY_PASSWORD_ENV] || "";

  if (!rawEmails) {
    throw new Error(
      `Missing admin email list. Set ${EMAILS_ENV} (or legacy ${LEGACY_EMAILS_ENV}) in your env file.`
    );
  }

  if (!password) {
    throw new Error(
      `Missing admin password. Set ${PASSWORD_ENV} (or legacy ${LEGACY_PASSWORD_ENV}) in your env file.`
    );
  }

  if (password.length < 8) {
    throw new Error(`${PASSWORD_ENV} must be at least 8 characters.`);
  }

  const emails = parseAdminEmails(rawEmails);
  if (emails.length === 0) {
    throw new Error(`No valid emails found in ${EMAILS_ENV}.`);
  }

  const invalidEmails = emails.filter((email) => !isValidEmail(email));
  if (invalidEmails.length > 0) {
    throw new Error(`Invalid admin emails: ${invalidEmails.join(", ")}`);
  }

  return { emails, password };
}

function getClient() {
  const driver = process.env.DATABASE_DRIVER || "sqlite-file";
  const url =
    driver === "libsql"
      ? process.env.LIBSQL_URL
      : process.env.DATABASE_URL || "file:./dev.db";

  if (!url) throw new Error("Database URL is required");

  return createClient({
    url,
    authToken: process.env.LIBSQL_AUTH_TOKEN,
  });
}

async function main() {
  const { emails, password } = getSeedConfig();
  const db = getClient();

  let created = 0;
  let updated = 0;

  for (const email of emails) {
    const now = new Date().toISOString();
    const existing = await db.execute({
      sql: `select id from users where lower(email) = lower(?) limit 1`,
      args: [email],
    });

    let userId;
    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
      await db.execute({
        sql: `update users set password_hash = ?, updated_at = ? where id = ?`,
        args: [hashPassword(password), now, userId],
      });
      updated += 1;
    } else {
      userId = randomUUID();
      await db.execute({
        sql: `insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)`,
        args: [userId, email, hashPassword(password), now, now],
      });
      created += 1;
    }

    await db.execute({
      sql: `insert into user_roles (id, role, created_at) values (?, 'admin', ?)
            on conflict(id) do update set role='admin'`,
      args: [userId, now],
    });
  }

  console.log(`Seeded admin users: ${emails.length} (created: ${created}, updated: ${updated})`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
