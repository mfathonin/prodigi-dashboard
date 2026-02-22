const { createClient } = require("@libsql/client");
const { randomUUID, scryptSync, randomBytes } = require("crypto");

const EMAIL = "mfathonin+dev@gmail.com";
const PASSWORD = "P@ssw0rd";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
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
  const db = getClient();
  const now = new Date().toISOString();

  const existing = await db.execute({
    sql: `select id from users where lower(email) = lower(?) limit 1`,
    args: [EMAIL],
  });

  let userId;
  if (existing.rows.length > 0) {
    userId = existing.rows[0].id;
    await db.execute({
      sql: `update users set password_hash = ?, updated_at = ? where id = ?`,
      args: [hashPassword(PASSWORD), now, userId],
    });
  } else {
    userId = randomUUID();
    await db.execute({
      sql: `insert into users (id, email, password_hash, created_at, updated_at) values (?, ?, ?, ?, ?)`,
      args: [userId, EMAIL, hashPassword(PASSWORD), now, now],
    });
  }

  await db.execute({
    sql: `insert into user_roles (id, role, created_at) values (?, 'admin', ?)
          on conflict(id) do update set role='admin'`,
    args: [userId, now],
  });

  console.log(`Seeded dev account: ${EMAIL}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
