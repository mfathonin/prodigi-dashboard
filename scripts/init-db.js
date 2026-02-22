const { createClient } = require("@libsql/client");

const driver = process.env.DATABASE_DRIVER || "sqlite-file";
const url =
  driver === "libsql"
    ? process.env.LIBSQL_URL
    : process.env.DATABASE_URL || "file:./dev.db";

if (!url) throw new Error("Database URL is required");

const db = createClient({ url, authToken: process.env.LIBSQL_AUTH_TOKEN });

const statements = [
  `create table if not exists users (
    id text primary key,
    email text not null unique,
    password_hash text not null,
    created_at text not null,
    updated_at text not null,
    last_sign_in_at text
  )`,
  `create table if not exists user_roles (
    id text primary key,
    role text not null,
    created_at text not null
  )`,
  `create table if not exists sessions (
    token_hash text primary key,
    user_id text not null,
    expires_at text not null,
    created_at text not null
  )`,
  `create table if not exists password_reset_tokens (
    token_hash text primary key,
    user_id text not null,
    expires_at text not null,
    created_at text not null
  )`,
  `create table if not exists invite_tokens (
    token_hash text primary key,
    email text not null,
    expires_at text not null,
    created_at text not null
  )`,
  `create table if not exists banner (
    id integer primary key autoincrement,
    uuid text not null unique,
    image text not null,
    url text not null
  )`,
];

async function main() {
  for (const sql of statements) {
    await db.execute(sql);
  }
  console.log("Database initialized");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
