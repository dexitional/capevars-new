import { getPool } from "@cv/db";
import type { PoolConnection } from "mysql2/promise";

// Runs `fn` in a transaction that is always committed or rolled back before
// the connection returns to the pool — including on early returns. (A
// connection released mid-transaction keeps its locks and silently swallows
// every later query run on it.)
export async function withTransaction<T>(fn: (conn: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback().catch(() => undefined);
    throw err;
  } finally {
    conn.release();
  }
}
