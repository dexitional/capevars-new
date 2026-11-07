// Applies kidi-source-corrections.json to lessons already imported, so they
// match what extract-kidi-source.py now produces. Only exact old values are
// replaced, so running it again changes nothing. Dry run unless --apply.
//
//   npx tsx scripts/fix-kidi-source.ts [--apply]
import "dotenv/config";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2/promise";

type Fixes = Record<string, [string, string]>;
const { lessons } = JSON.parse(
  await readFile(new URL("./kidi-source-corrections.json", import.meta.url), "utf8"),
) as { lessons: Record<string, Fixes> };
const apply = process.argv.includes("--apply");

// Every string in the payload that is exactly an old value becomes the new one.
function replaceStrings(value: unknown, swaps: Map<string, string>, changes: string[], path: string): unknown {
  if (typeof value === "string") {
    const next = swaps.get(value);
    if (next === undefined) return value;
    changes.push(`  ${path}: ${JSON.stringify(value)} -> ${JSON.stringify(next)}`);
    return next;
  }
  if (Array.isArray(value)) return value.map((v, i) => replaceStrings(v, swaps, changes, `${path}[${i}]`));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, replaceStrings(v, swaps, changes, `${path}.${k}`)]),
    );
  return value;
}

const db = await mysql.createConnection(process.env.DATABASE_URL!);
await db.beginTransaction();
let updated = 0;
try {
  for (const [id, fixes] of Object.entries(lessons)) {
    const [level, subject, index] = id.split("/");
    const key = `${subject}-${index!.padStart(2, "0")}`;
    const [rows] = await db.query<RowDataPacket[]>(
      `SELECT l.id, l.title, l.payload FROM kidi_lessons l
         JOIN kidi_course_links k ON k.course_id = l.course_id
        WHERE k.level_key = ? AND k.subject_key = ? AND JSON_UNQUOTE(JSON_EXTRACT(l.payload, '$.key')) = ?
        FOR UPDATE`,
      [level, subject, key],
    );
    if (rows.length !== 1) throw new Error(`${id}: expected one lesson, found ${rows.length}`);
    const row = rows[0]!;
    const payload = typeof row.payload === "string" ? JSON.parse(row.payload) : row.payload;
    const swaps = new Map(Object.values(fixes));
    const changes: string[] = [];
    const next = replaceStrings(payload, swaps, changes, "payload");
    const title = swaps.get(row.title) ?? row.title;
    if (title !== row.title) changes.unshift(`  title: ${JSON.stringify(row.title)} -> ${JSON.stringify(title)}`);
    if (!changes.length) continue;
    console.log(`${id} (lesson ${row.id})\n${changes.join("\n")}`);
    await db.query("UPDATE kidi_lessons SET title = ?, payload = ? WHERE id = ?", [title, JSON.stringify(next), row.id]);
    updated++;
  }
  if (apply) await db.commit();
  else await db.rollback();
  console.log(`${updated} lesson(s) ${apply ? "updated" : "would change (dry run; pass --apply to save)"}.`);
} catch (err) {
  await db.rollback();
  throw err;
} finally {
  await db.end();
}
