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
  `create table if not exists books (
    id integer primary key autoincrement,
    uuid text not null unique,
    firestore_id text,
    title text not null,
    created_at text not null,
    updated_at text not null,
    deleted_at text
  )`,
  `create table if not exists attributes (
    id integer primary key autoincrement,
    uuid text not null unique,
    key text not null,
    value text not null,
    unique(key, value)
  )`,
  `create table if not exists books_attributes (
    id integer primary key autoincrement,
    book_id text not null,
    attribute_id text not null
  )`,
  `create table if not exists link (
    id integer primary key autoincrement,
    uuid text not null unique,
    path text not null,
    target_url text not null
  )`,
  `create table if not exists contents (
    id integer primary key autoincrement,
    uuid text not null unique,
    title text not null,
    firestore_id text,
    link_id text not null,
    book_id text not null,
    type text not null,
    created_at text not null,
    updated_at text not null,
    deleted_at text
  )`,
  `create table if not exists banner (
    id integer primary key autoincrement,
    uuid text not null unique,
    image text not null,
    url text not null
  )`,
  `create table if not exists answer_sheets (
    id integer primary key autoincrement,
    uuid text not null unique,
    book_id text not null,
    counts integer not null,
    answers text not null,
    points text not null,
    n_options text not null,
    created_at text not null,
    updated_at text not null
  )`,
  `create table if not exists questions (
    id integer primary key autoincrement,
    uuid text not null unique,
    content text not null,
    options text not null,
    correct_answer integer not null,
    explanation text,
    media_url text,
    created_at text not null,
    updated_at text not null,
    deleted_at text
  )`,
  `create table if not exists exercises (
    id integer primary key autoincrement,
    uuid text not null unique,
    book_id text,
    created_at text not null,
    updated_at text not null
  )`,
  `create table if not exists exercise_questions (
    id integer primary key autoincrement,
    exercise_id text not null,
    question_id text not null,
    "order" integer not null default 0,
    point integer not null default 1,
    created_at text not null,
    updated_at text not null,
    unique(exercise_id, question_id),
    unique(exercise_id, "order")
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
