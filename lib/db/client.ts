import { createClient } from "@libsql/client";

let singleton: ReturnType<typeof createClient> | null = null;

export function getDbClient() {
  if (singleton) return singleton;

  const driver = process.env.DATABASE_DRIVER || "sqlite-file";

  if (driver === "libsql") {
    const url = process.env.LIBSQL_URL;
    if (!url) throw new Error("LIBSQL_URL is required when DATABASE_DRIVER=libsql");
    singleton = createClient({
      url,
      authToken: process.env.LIBSQL_AUTH_TOKEN,
    });
    return singleton;
  }

  const url = process.env.DATABASE_URL || "file:./dev.db";
  singleton = createClient({ url });
  return singleton;
}
