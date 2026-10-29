// Admin authoring for OpenLearn Quizbank: courses (level, tags, exam
// defaults), the question bank (a question can sit in several courses), and
// JSON import of questions into a course.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { PoolConnection } from "mysql2/promise";
import { qbCourseSchema, qbQuestionSchema } from "#/lib/quizbank";
import type { QbMedia } from "#/lib/quizbank";
import { requirePermission } from "../../middleware/require-auth.js";
import { validate } from "../../lib/validate.js";
import { likePattern, pageQuerySchema, paging } from "../../lib/query.js";
import { AppError } from "../../middleware/error-handler.js";
import { logActivity } from "../../lib/activity.js";
import { uniqueSlug } from "../../lib/slug.js";
import { withTransaction } from "../../lib/tx.js";
import { json, options, questionTags, recountCourses, setCourseTags, setQuestionTags, tagsFor } from "../../lib/quizbank.js";

type QuestionInput = z.output<typeof qbQuestionSchema>;

async function courseIdsOf(questionId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT course_id FROM qb_course_questions WHERE question_id = ?", [questionId]);
  return rows.map((r) => r.course_id as number);
}

// Links a question to exactly `courseIds`, appending it to the end of new courses.
async function linkCourses(conn: PoolConnection, questionId: number, courseIds: Array<number>) {
  const ids = [...new Set(courseIds)];
  if (ids.length) {
    const [known] = await conn.query<RowDataPacket[]>("SELECT id FROM qb_courses WHERE id IN (?)", [ids]);
    if (known.length !== ids.length) throw new AppError("One of the chosen courses no longer exists.", 422);
    await conn.query("DELETE FROM qb_course_questions WHERE question_id = ? AND course_id NOT IN (?)", [questionId, ids]);
  } else {
    await conn.execute("DELETE FROM qb_course_questions WHERE question_id = ?", [questionId]);
  }
  for (const id of ids) {
    await conn.execute(
      `INSERT IGNORE INTO qb_course_questions (course_id, question_id, position)
       SELECT ?, ?, COALESCE(MAX(position), 0) + 1 FROM qb_course_questions WHERE course_id = ?`,
      [id, questionId, id],
    );
  }
}

function questionValues(q: QuestionInput) {
  return [
    q.type,
    q.body,
    JSON.stringify(q.media),
    q.type === "choice" ? JSON.stringify(q.options) : null,
    q.type === "choice" ? q.correctIndex : null,
    q.answer ?? null,
    q.explanation ?? null,
    q.hint ?? null,
    q.difficulty,
    q.marks,
    q.status,
  ];
}

async function insertQuestion(conn: PoolConnection, q: QuestionInput, adminId: number) {
  const [res] = await conn.execute<ResultSetHeader>(
    `INSERT INTO qb_questions (type, body, media, options, correct_index, answer, explanation, hint, difficulty, marks, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [...questionValues(q), adminId],
  );
  await linkCourses(conn, res.insertId, q.courseIds);
  await setQuestionTags(conn, res.insertId, q.tags, q.courseIds);
  return res.insertId;
}

function questionDetail(row: RowDataPacket, courseIds: Array<number>, tags: Array<string>) {
  return {
    id: row.id,
    type: row.type,
    body: row.body,
    media: json<Array<QbMedia>>(row.media, []),
    options: options(row),
    correctIndex: row.correct_index,
    answer: row.answer,
    explanation: row.explanation,
    hint: row.hint,
    difficulty: row.difficulty,
    marks: Number(row.marks),
    status: row.status,
    courseIds,
    tags,
  };
}

export const adminQuizbankRoute = new Hono()
  // ---- Courses ---------------------------------------------------------------------------------
  .get("/courses", requirePermission("learn", "view"), async (c) => {
    const q = (c.req.query("q") ?? "").trim();
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT c.*, (SELECT COUNT(*) FROM qb_course_questions cq WHERE cq.course_id = c.id) AS linked FROM qb_courses c
       ${q ? "WHERE c.title LIKE ? OR c.code LIKE ?" : ""} ORDER BY c.level, c.title LIMIT 500`,
      q ? [likePattern(q), likePattern(q)] : [],
    );
    const tags = await tagsFor(rows.map((r) => r.id as number));
    return c.json({ items: rows.map((r) => ({ ...r, tags: (tags.get(r.id) ?? []).map((t) => t.name) })) });
  })
  .get("/tags", requirePermission("learn", "view"), async (c) => {
    const [rows] = await getPool().query<RowDataPacket[]>(
      "SELECT t.id, t.name, t.slug, COUNT(ct.course_id) AS courses FROM qb_tags t LEFT JOIN qb_course_tags ct ON ct.tag_id = t.id GROUP BY t.id ORDER BY t.name",
    );
    return c.json({ items: rows });
  })
  .delete("/tags/:id", requirePermission("learn", "manage"), async (c) => {
    await getPool().execute("DELETE FROM qb_tags WHERE id = ?", [Number(c.req.param("id"))]);
    return c.json({ ok: true });
  })
  .post("/courses", requirePermission("learn", "manage"), validate("json", qbCourseSchema), async (c) => {
    const input = c.req.valid("json");
    const admin = c.get("admin");
    const slug = await uniqueSlug("qb_courses", input.code ? `${input.code} ${input.title}` : input.title, null);
    const id = await withTransaction(async (conn) => {
      const [res] = await conn.execute<ResultSetHeader>(
        `INSERT INTO qb_courses (slug, title, code, level, description, cover_url, exam_questions, exam_minutes, status, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [slug, input.title, input.code ?? null, input.level, input.description ?? null, input.coverUrl ?? null, input.examQuestions, input.examMinutes, input.status, admin.id],
      );
      await setCourseTags(conn, res.insertId, input.tags);
      return res.insertId;
    });
    logActivity(admin.id, "created", "qb_courses", id, `Created Quizbank course "${input.title}"`);
    return c.json({ id, slug }, 201);
  })
  .patch("/courses/:id", requirePermission("learn", "manage"), validate("json", qbCourseSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const input = c.req.valid("json");
    await withTransaction(async (conn) => {
      const [res] = await conn.execute<ResultSetHeader>(
        `UPDATE qb_courses SET title = ?, code = ?, level = ?, description = ?, cover_url = ?, exam_questions = ?, exam_minutes = ?, status = ? WHERE id = ?`,
        [input.title, input.code ?? null, input.level, input.description ?? null, input.coverUrl ?? null, input.examQuestions, input.examMinutes, input.status, id],
      );
      if (!res.affectedRows) throw new AppError("Course not found.", 404);
      await setCourseTags(conn, id, input.tags);
    });
    logActivity(c.get("admin").id, "updated", "qb_courses", id, `Updated Quizbank course "${input.title}"`);
    return c.json({ ok: true });
  })
  .delete("/courses/:id", requirePermission("learn", "manage"), async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT title FROM qb_courses WHERE id = ?", [id]);
    if (!rows[0]) throw new AppError("Course not found.", 404);
    // Questions stay in the bank (and in any other courses they belong to).
    await getPool().execute("DELETE FROM qb_courses WHERE id = ?", [id]);
    logActivity(c.get("admin").id, "deleted", "qb_courses", id, `Deleted Quizbank course "${rows[0].title}"`);
    return c.json({ ok: true });
  })
  .post(
    "/courses/:id/questions",
    requirePermission("learn", "manage"),
    validate("json", z.object({ questionIds: z.array(z.number().int().positive()).min(1).max(500) })),
    async (c) => {
      const id = Number(c.req.param("id"));
      const { questionIds } = c.req.valid("json");
      await withTransaction(async (conn) => {
        for (const qid of questionIds) {
          await conn.execute(
            `INSERT IGNORE INTO qb_course_questions (course_id, question_id, position)
             SELECT ?, q.id, (SELECT COALESCE(MAX(position), 0) + 1 FROM qb_course_questions WHERE course_id = ?) FROM qb_questions q WHERE q.id = ?`,
            [id, id, qid],
          );
        }
      });
      await recountCourses([id]);
      return c.json({ ok: true });
    },
  )
  .delete("/courses/:id/questions/:questionId", requirePermission("learn", "manage"), async (c) => {
    const id = Number(c.req.param("id"));
    await getPool().execute("DELETE FROM qb_course_questions WHERE course_id = ? AND question_id = ?", [id, Number(c.req.param("questionId"))]);
    await recountCourses([id]);
    return c.json({ ok: true });
  })
  // Many questions at once, e.g. exported from a spreadsheet or another bank.
  .post(
    "/courses/:id/import",
    requirePermission("learn", "manage"),
    validate("json", z.object({ questions: z.array(z.unknown()).min(1).max(500) })),
    async (c) => {
      const id = Number(c.req.param("id"));
      const admin = c.get("admin");
      const parsed = c.req.valid("json").questions.map((raw, i) => {
        const r = qbQuestionSchema.safeParse({ ...(raw as object), courseIds: [id] });
        if (!r.success) throw new AppError(`Question ${i + 1}: ${r.error.issues[0]?.message ?? "invalid"}`, 422);
        return r.data;
      });
      await withTransaction(async (conn) => {
        for (const q of parsed) await insertQuestion(conn, q, admin.id);
      });
      await recountCourses([id]);
      logActivity(admin.id, "created", "qb_questions", null, `Imported ${parsed.length} Quizbank questions into course #${id}`);
      return c.json({ imported: parsed.length });
    },
  )
  // ---- Questions -------------------------------------------------------------------------------
  .get(
    "/questions",
    requirePermission("learn", "view"),
    validate("query", pageQuerySchema.extend({ courseId: z.coerce.number().int().positive().optional().catch(undefined), type: z.enum(["choice", "text"]).optional().catch(undefined), tag: z.string().max(70).optional() })),
    async (c) => {
      const q = c.req.valid("query");
      const where: Array<string> = [];
      const params: Array<string | number> = [];
      if (q.courseId) {
        where.push("EXISTS (SELECT 1 FROM qb_course_questions cq WHERE cq.question_id = q.id AND cq.course_id = ?)");
        params.push(q.courseId);
      }
      if (q.type) {
        where.push("q.type = ?");
        params.push(q.type);
      }
      if (q.tag) {
        where.push("EXISTS (SELECT 1 FROM qb_question_tags qt JOIN qb_tags t ON t.id = qt.tag_id WHERE qt.question_id = q.id AND t.slug = ?)");
        params.push(q.tag);
      }
      if (q.q) {
        where.push("(q.body LIKE ? OR q.answer LIKE ?)");
        params.push(likePattern(q.q), likePattern(q.q));
      }
      const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
      const { limit, offset } = paging(q.page, q.pageSize);
      const pool = getPool();
      const [[items], [count]] = await Promise.all([
        pool.query<RowDataPacket[]>(
          `SELECT q.id, q.type, LEFT(q.body, 300) AS body, q.difficulty, q.marks, q.status, q.discussion_count, q.updated_at,
             JSON_LENGTH(q.media) AS media_count,
             (SELECT GROUP_CONCAT(t.name ORDER BY t.name SEPARATOR ', ') FROM qb_question_tags qt JOIN qb_tags t ON t.id = qt.tag_id WHERE qt.question_id = q.id) AS tags,
             (SELECT GROUP_CONCAT(c.title ORDER BY c.title SEPARATOR ' · ') FROM qb_course_questions cq JOIN qb_courses c ON c.id = cq.course_id WHERE cq.question_id = q.id) AS courses
           FROM qb_questions q ${clause} ORDER BY q.id DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset],
        ),
        pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM qb_questions q ${clause}`, params),
      ]);
      return c.json({ items, total: Number(count[0]?.n ?? 0) });
    },
  )
  .get("/questions/:id", requirePermission("learn", "view"), async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM qb_questions WHERE id = ?", [id]);
    if (!rows[0]) throw new AppError("Question not found.", 404);
    return c.json({ question: questionDetail(rows[0], await courseIdsOf(id), (await questionTags([id])).get(id) ?? []) });
  })
  .post("/questions", requirePermission("learn", "manage"), validate("json", qbQuestionSchema), async (c) => {
    const input = c.req.valid("json");
    const admin = c.get("admin");
    const id = await withTransaction((conn) => insertQuestion(conn, input, admin.id));
    await recountCourses(input.courseIds);
    logActivity(admin.id, "created", "qb_questions", id, `Created Quizbank question #${id}`);
    return c.json({ id }, 201);
  })
  .patch("/questions/:id", requirePermission("learn", "manage"), validate("json", qbQuestionSchema), async (c) => {
    const id = Number(c.req.param("id"));
    const input = c.req.valid("json");
    const before = await courseIdsOf(id);
    await withTransaction(async (conn) => {
      const [res] = await conn.execute<ResultSetHeader>(
        `UPDATE qb_questions SET type = ?, body = ?, media = ?, options = ?, correct_index = ?, answer = ?, explanation = ?, hint = ?, difficulty = ?, marks = ?, status = ? WHERE id = ?`,
        [...questionValues(input), id],
      );
      if (!res.affectedRows) throw new AppError("Question not found.", 404);
      await linkCourses(conn, id, input.courseIds);
      await setQuestionTags(conn, id, input.tags, input.courseIds);
    });
    await recountCourses([...new Set([...before, ...input.courseIds])]);
    logActivity(c.get("admin").id, "updated", "qb_questions", id, `Updated Quizbank question #${id}`);
    return c.json({ ok: true });
  })
  .delete("/questions/:id", requirePermission("learn", "manage"), async (c) => {
    const id = Number(c.req.param("id"));
    const before = await courseIdsOf(id);
    await getPool().execute("DELETE FROM qb_questions WHERE id = ?", [id]);
    await recountCourses(before);
    logActivity(c.get("admin").id, "deleted", "qb_questions", id, `Deleted Quizbank question #${id}`);
    return c.json({ ok: true });
  });
