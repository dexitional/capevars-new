import mysql from "mysql2/promise";

// Kept on globalThis so dev hot reloads reuse one pool instead of opening a
// new one (and orphaning the old connections) every time a module reloads.
const globalForPool = globalThis as typeof globalThis & { __cvPool?: mysql.Pool };

export function getPool(): mysql.Pool {
  if (!globalForPool.__cvPool) {
    const uri = process.env.DATABASE_URL;
    if (!uri) throw new Error("DATABASE_URL is not set.");
    globalForPool.__cvPool = mysql.createPool({
      uri,
      waitForConnections: true,
      connectionLimit: 10,
      // Return DATETIME/TIMESTAMP columns as plain strings instead of JS Date
      // objects, avoiding local-timezone conversion surprises when the app
      // server and MySQL server run in different timezones.
      dateStrings: true,
    });
  }
  return globalForPool.__cvPool;
}

/** Closes the pool so a CLI script can exit (servers never need this). */
export async function closePool() {
  const pool = globalForPool.__cvPool;
  globalForPool.__cvPool = undefined;
  await pool?.end();
}
