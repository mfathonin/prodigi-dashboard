import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
  updatedAt: text("updated_at").notNull().default("CURRENT_TIMESTAMP"),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  lastSignInAt: text("last_sign_in_at"),
  ...timestamps,
});

export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(),
  role: text("role").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const inviteTokens = sqliteTable("invite_tokens", {
  tokenHash: text("token_hash").primaryKey(),
  email: text("email").notNull(),
  expiresAt: text("expires_at").notNull(),
  createdAt: text("created_at").notNull().default("CURRENT_TIMESTAMP"),
});

export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  firestoreId: text("firestore_id"),
  title: text("title").notNull(),
  deletedAt: text("deleted_at"),
  ...timestamps,
});

export const attributes = sqliteTable(
  "attributes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    uuid: text("uuid").notNull().unique(),
    key: text("key").notNull(),
    value: text("value").notNull(),
  },
  (t) => ({
    keyValue: uniqueIndex("attributes_key_value_idx").on(t.key, t.value),
  })
);

export const booksAttributes = sqliteTable("books_attributes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  bookId: text("book_id").notNull(),
  attributeId: text("attribute_id").notNull(),
});

export const links = sqliteTable("link", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  path: text("path").notNull(),
  targetUrl: text("target_url").notNull(),
});

export const contents = sqliteTable("contents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  title: text("title").notNull(),
  firestoreId: text("firestore_id"),
  linkId: text("link_id").notNull(),
  bookId: text("book_id").notNull(),
  type: text("type").notNull(),
  deletedAt: text("deleted_at"),
  ...timestamps,
});

export const banners = sqliteTable("banner", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  image: text("image").notNull(),
  url: text("url").notNull(),
});

export const answerSheets = sqliteTable("answer_sheets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  bookId: text("book_id").notNull(),
  counts: integer("counts").notNull(),
  answers: text("answers").notNull(),
  points: text("points").notNull(),
  nOptions: text("n_options").notNull(),
  ...timestamps,
});

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  content: text("content").notNull(),
  options: text("options").notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  mediaUrl: text("media_url"),
  deletedAt: text("deleted_at"),
  ...timestamps,
});

export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid").notNull().unique(),
  bookId: text("book_id"),
  ...timestamps,
});

export const exerciseQuestions = sqliteTable("exercise_questions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  exerciseId: text("exercise_id").notNull(),
  questionId: text("question_id").notNull(),
  order: integer("order").notNull().default(0),
  point: integer("point").notNull().default(1),
  ...timestamps,
});
