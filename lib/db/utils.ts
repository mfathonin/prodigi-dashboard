import { getDbClient } from "./client";

function toPlainObject<T extends object>(row: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(row)) as T;
}

export async function query<T extends object = Record<string, unknown>>(
  sql: string,
  args?: unknown[]
) {
  const db = getDbClient();
  const res = await db.execute({ sql, args: args as any });
  return (res.rows as Record<string, unknown>[]).map((row) => toPlainObject<T>(row));
}

export async function queryOne<
  T extends object = Record<string, unknown>
>(
  sql: string,
  args?: unknown[]
) {
  const rows = await query<T>(sql, args);
  return rows[0];
}

export async function execute(sql: string, args?: unknown[]) {
  const db = getDbClient();
  await db.execute({ sql, args: args as any });
}

export function nowIso() {
  return new Date().toISOString();
}
