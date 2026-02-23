import { getDbClient } from "./client";

type RawRow = Record<string, unknown>;
type DbLike = {
  execute: (stmt: { sql: string; args?: any }) => Promise<any>;
};

function toPlainObject<T extends object>(row: Record<string, unknown>): T {
  return Object.fromEntries(Object.entries(row)) as T;
}

function createDbAccess(db: DbLike) {
  const query = async <T extends object = Record<string, unknown>>(
    sql: string,
    args?: unknown[]
  ) => {
    const res = await db.execute({ sql, args: args as any });
    const rows = (res.rows ?? []) as RawRow[];
    return rows.map((row) => toPlainObject<T>(row));
  };

  return {
    query,
    async queryOne<T extends object = Record<string, unknown>>(
      sql: string,
      args?: unknown[]
    ) {
      const rows = await query<T>(sql, args);
      return rows[0];
    },
    async execute(sql: string, args?: unknown[]) {
      return db.execute({ sql, args: args as any });
    },
  };
}

export type DbAccess = ReturnType<typeof createDbAccess>;

export async function query<T extends object = Record<string, unknown>>(
  sql: string,
  args?: unknown[]
) {
  const db = createDbAccess(getDbClient() as unknown as DbLike);
  return db.query<T>(sql, args);
}

export async function queryOne<
  T extends object = Record<string, unknown>
>(
  sql: string,
  args?: unknown[]
) {
  const db = createDbAccess(getDbClient() as unknown as DbLike);
  return db.queryOne<T>(sql, args);
}

export async function execute(sql: string, args?: unknown[]) {
  const db = createDbAccess(getDbClient() as unknown as DbLike);
  await db.execute(sql, args);
}

export async function withTransaction<T>(
  callback: (db: DbAccess) => Promise<T>
) {
  const db = getDbClient();
  const tx = await db.transaction("write");
  let committed = false;

  try {
    const txDb = createDbAccess(tx as unknown as DbLike);
    const result = await callback(txDb);
    await tx.commit();
    committed = true;
    return result;
  } catch (error) {
    if (!committed) {
      try {
        await tx.rollback();
      } catch {
        // no-op
      }
    }
    throw error;
  } finally {
    tx.close();
  }
}

export function nowIso() {
  return new Date().toISOString();
}
