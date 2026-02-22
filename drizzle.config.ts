import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: (
    process.env.DATABASE_DRIVER === "libsql"
      ? {
          url: process.env.LIBSQL_URL || "",
          authToken: process.env.LIBSQL_AUTH_TOKEN,
        }
      : {
          url: process.env.DATABASE_URL || "file:./dev.db",
        }
  ) as any,
});
