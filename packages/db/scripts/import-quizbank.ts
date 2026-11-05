// Imports Quizbank question files (files/quizbank/*.json, the same shape as the
// admin JSON import) into courses described by a manifest. Courses are matched
// by code and created if missing; questions already in a course (same body,
// options and media) are skipped, so a re-run only adds what is new.
//
//   npm run db:import-quizbank -- ../../files/quizbank/import-2026-11.json
import "dotenv/config";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import mysql from "mysql2/promise";
import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type Manifest = {
  courses: Array<{
    code: string;
    title: string;
    level: "tertiary" | "shs" | "jhs" | "tvet" | "nvti";
    description?: string;
    updateDescription?: boolean; // also replace an existing course's description
    examQuestions?: number;
    examMinutes?: number;
    tags?: Array<string>;
    files: Array<string>; // relative to the manifest
  }>;
};
type Question = {
  type: "choice" | "text";
  body: string;
  media?: Array<unknown>;
  options?: Array<{ text: string; hint?: string; imageUrl?: string }>;
  correctIndex?: number | null;
  answer?: string;
  explanation?: string;
  hint?: string;
  difficulty?: "easy" | "medium" | "hard";
  marks?: number;
  tags?: Array<string>;
};

const manifestPath = path.resolve(process.argv[2] ?? "");
const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as Manifest;

function slugify(input: string) {
  return (
    input
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 150) || "item"
  );
}

// MySQL's JSON type reorders object keys, so compare with keys sorted.
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((k) => [k, canonical((value as Record<string, unknown>)[k])]));
  }
  return value;
}

// Same identity for a file question and a stored row: body, options and media.
function fingerprint(body: string, options: unknown, media: unknown) {
  return createHash("sha1").update(JSON.stringify(canonical([body.trim(), options ?? null, media ?? []]))).digest("hex");
}

function json<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  return (typeof value === "string" ? JSON.parse(value) : value) as T;
}

async function tagIds(conn: PoolConnection, names: Array<string>) {
  const wanted = new Map<string, string>();
  for (const name of names) {
    const slug = slugify(name).slice(0, 70);
    if (slug && !wanted.has(slug)) wanted.set(slug, name.trim());
  }
  const ids: Array<number> = [];
  for (const [slug, name] of wanted) {
    const [res] = await conn.execute<ResultSetHeader>("INSERT INTO qb_tags (name, slug) VALUES (?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)", [name, slug]);
    ids.push(res.insertId);
  }
  return ids;
}

async function uniqueCourseSlug(conn: PoolConnection, base: string) {
  const root = slugify(base);
  const [rows] = await conn.query<RowDataPacket[]>("SELECT slug FROM qb_courses WHERE slug = ? OR slug LIKE ?", [root, `${root}-%`]);
  const taken = new Set(rows.map((r) => r.slug as string));
  if (!taken.has(root)) return root;
  for (let n = 2; ; n++) if (!taken.has(`${root}-${n}`)) return `${root}-${n}`;
}

const pool = mysql.createPool({ uri: process.env.DATABASE_URL!, connectionLimit: 2 });
const [[admin]] = await pool.query<RowDataPacket[]>("SELECT id FROM admins ORDER BY id LIMIT 1");
if (!admin) throw new Error("No admin found to own the imported rows; run db:seed first.");

try {
  for (const course of manifest.courses) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [found] = await conn.query<RowDataPacket[]>("SELECT id FROM qb_courses WHERE code = ?", [course.code]);
      let courseId = found[0]?.id as number | undefined;
      if (courseId) {
        if (course.updateDescription && course.description) {
          await conn.execute("UPDATE qb_courses SET description = ? WHERE id = ?", [course.description, courseId]);
        }
      } else {
        const slug = await uniqueCourseSlug(conn, `${course.code} ${course.title}`);
        const [res] = await conn.execute<ResultSetHeader>(
          `INSERT INTO qb_courses (slug, title, code, level, description, exam_questions, exam_minutes, status, created_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
          [slug, course.title, course.code, course.level, course.description ?? null, course.examQuestions ?? 20, course.examMinutes ?? 60, admin.id],
        );
        courseId = res.insertId;
      }
      for (const id of await tagIds(conn, course.tags ?? [])) {
        await conn.execute("INSERT IGNORE INTO qb_course_tags (course_id, tag_id) VALUES (?, ?)", [courseId, id]);
      }

      const [existing] = await conn.query<RowDataPacket[]>(
        "SELECT q.body, q.options, q.media FROM qb_course_questions cq JOIN qb_questions q ON q.id = cq.question_id WHERE cq.course_id = ?",
        [courseId],
      );
      const have = new Set(existing.map((r) => fingerprint(r.body, json(r.options, null), json(r.media, []))));
      const [posRows] = await conn.query<RowDataPacket[]>("SELECT COALESCE(MAX(position), 0) AS pos FROM qb_course_questions WHERE course_id = ?", [courseId]);
      let position = Number(posRows[0]?.pos ?? 0);
      let added = 0;
      let skipped = 0;

      for (const file of course.files) {
        const questions = JSON.parse(await readFile(path.resolve(path.dirname(manifestPath), file), "utf8")) as Array<Question>;
        for (const q of questions) {
          const options = q.type === "choice" ? (q.options ?? []) : null;
          const key = fingerprint(q.body, options, q.media ?? []);
          if (have.has(key)) {
            skipped++;
            continue;
          }
          have.add(key);
          const [res] = await conn.execute<ResultSetHeader>(
            `INSERT INTO qb_questions (type, body, media, options, correct_index, answer, explanation, hint, difficulty, marks, status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)`,
            [
              q.type,
              q.body.trim(),
              JSON.stringify(q.media ?? []),
              options ? JSON.stringify(options) : null,
              q.type === "choice" ? (q.correctIndex ?? null) : null,
              q.answer?.trim() || null,
              q.explanation?.trim() || null,
              q.hint?.trim() || null,
              q.difficulty ?? "medium",
              q.marks ?? 1,
              admin.id,
            ],
          );
          await conn.execute("INSERT INTO qb_course_questions (course_id, question_id, position) VALUES (?, ?, ?)", [courseId, res.insertId, ++position]);
          // Topic tags go on the question and its course, as setQuestionTags does.
          for (const id of await tagIds(conn, q.tags ?? [])) {
            await conn.execute("INSERT IGNORE INTO qb_question_tags (question_id, tag_id) VALUES (?, ?)", [res.insertId, id]);
            await conn.execute("INSERT IGNORE INTO qb_course_tags (course_id, tag_id) VALUES (?, ?)", [courseId, id]);
          }
          added++;
        }
      }

      await conn.execute(
        `UPDATE qb_courses SET question_count = (
           SELECT COUNT(*) FROM qb_course_questions cq JOIN qb_questions q ON q.id = cq.question_id WHERE cq.course_id = ? AND q.status = 'published')
         WHERE id = ?`,
        [courseId, courseId],
      );
      await conn.commit();
      console.log(`${course.code} (#${courseId}): ${added} added, ${skipped} already present`);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
} finally {
  await pool.end();
}
