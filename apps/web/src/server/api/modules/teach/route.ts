// OpenLearn for instructors (any member): build a course — details,
// sections, lessons of every type, quiz questions — submit it for review
// against the creation guidelines, then manage students, confirm manual
// payments and grade assignments.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { toColumns, updateSql } from "../../lib/columns.js";
import { uniqueSlug } from "../../lib/slug.js";
import { cleanRichText } from "../../lib/rich-text.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { fulfil } from "../../lib/payments.js";
import { DEFAULT_SETTINGS, mergeSetting } from "#/lib/settings";

const list = (max: number) => z.array(z.string().trim().min(1).max(max)).max(20);

const courseSchema = z.object({
  title: z.string().trim().min(5).max(200),
  subtitle: optionalText(255),
  categoryId: z.number().int().positive().nullable().optional(),
  description: optionalText(100_000),
  outcomes: list(200).optional(),
  requirements: list(200).optional(),
  audience: list(200).optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "all"]).optional(),
  language: z.string().trim().min(2).max(40).optional(),
  coverUrl: optionalUrl,
  promoVideoUrl: optionalUrl,
  price: z.number().min(0).max(100_000).optional(),
  compareAtPrice: z.number().min(0).max(100_000).nullable().optional(),
  certificateEnabled: z.boolean().optional(),
});
const COURSE_FIELDS = {
  title: "title",
  subtitle: "subtitle",
  categoryId: "category_id",
  description: "description",
  outcomes: "outcomes",
  requirements: "requirements",
  audience: "audience",
  level: "level",
  language: "language",
  coverUrl: "cover_url",
  promoVideoUrl: "promo_video_url",
  price: "price",
  compareAtPrice: "compare_at_price",
  certificateEnabled: "certificate_enabled",
};

const lessonSchema = z.object({
  title: z.string().trim().min(2).max(200),
  type: z.enum(["video", "article", "infographic", "quiz", "assignment", "resource"]),
  content: optionalText(200_000),
  videoUrl: optionalUrl,
  fileUrl: optionalUrl,
  imageUrl: optionalUrl,
  durationMinutes: z.number().int().min(0).max(1000).optional(),
  passMark: z.number().int().min(1).max(100).optional(),
  isPreview: z.boolean().optional(),
});
const LESSON_FIELDS = {
  title: "title",
  type: "type",
  content: "content",
  videoUrl: "video_url",
  fileUrl: "file_url",
  imageUrl: "image_url",
  durationMinutes: "duration_minutes",
  passMark: "pass_mark",
  isPreview: "is_preview",
};

const questionsSchema = z.object({
  questions: z
    .array(
      z.object({
        question: z.string().trim().min(3).max(1000),
        options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
        correctIndex: z.number().int().min(0).max(5),
        explanation: optionalText(1000),
      }),
    )
    .max(50),
});

async function ownedCourse(c: Context, courseId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM courses WHERE id = ? AND instructor_id = ?", [
    courseId,
    c.get("member").id,
  ]);
  if (!rows[0]) throw new AppError("Course not found.", 404);
  return rows[0];
}

async function ownedBy(c: Context, table: "course_sections" | "course_lessons", id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT x.*, c.status AS course_status FROM ${table} x JOIN courses c ON c.id = x.course_id WHERE x.id = ? AND c.instructor_id = ?`,
    [id, c.get("member").id],
  );
  if (!rows[0]) throw new AppError(table === "course_sections" ? "Section not found." : "Lesson not found.", 404);
  return rows[0];
}

const recount = (courseId: number) =>
  getPool().execute(
    `UPDATE courses SET lesson_count = (SELECT COUNT(*) FROM course_lessons WHERE course_id = ?),
       duration_minutes = (SELECT COALESCE(SUM(duration_minutes), 0) FROM course_lessons WHERE course_id = ?) WHERE id = ?`,
    [courseId, courseId, courseId],
  );

async function learnSettings() {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT value FROM site_settings WHERE setting_key = 'learn'");
  return rows[0] ? mergeSetting("learn", rows[0].value) : DEFAULT_SETTINGS.learn;
}

// The creation guidelines, as checks the builder shows before submitting.
async function readiness(courseId: number) {
  const pool = getPool();
  const settings = await learnSettings();
  const [[course], [lessons], [quizzes]] = await Promise.all([
    pool.execute<RowDataPacket[]>("SELECT * FROM courses WHERE id = ?", [courseId]),
    pool.execute<RowDataPacket[]>(
      "SELECT type, title, video_url, content, file_url, image_url FROM course_lessons WHERE course_id = ?",
      [courseId],
    ),
    pool.execute<RowDataPacket[]>(
      `SELECT l.id, COUNT(q.id) AS n FROM course_lessons l LEFT JOIN quiz_questions q ON q.lesson_id = l.id
       WHERE l.course_id = ? AND l.type = 'quiz' GROUP BY l.id`,
      [courseId],
    ),
  ]);
  const c = course[0]!;
  const outcomes = Array.isArray(c.outcomes) ? c.outcomes.length : 0;
  const empty = lessons.filter(
    (l) =>
      (l.type === "video" && !l.video_url) ||
      (["article", "assignment"].includes(l.type) && !l.content) ||
      (l.type === "infographic" && !l.image_url) ||
      (l.type === "resource" && !l.file_url),
  );
  const checks = [
    { key: "title", label: "A clear title and subtitle", ok: Boolean(c.title && c.subtitle) },
    { key: "category", label: "A category", ok: Boolean(c.category_id) },
    { key: "description", label: "A course description", ok: Boolean(c.description && String(c.description).length > 100) },
    { key: "outcomes", label: "At least 4 learning outcomes", ok: outcomes >= 4 },
    { key: "cover", label: "A cover image", ok: Boolean(c.cover_url) },
    { key: "lessons", label: `At least ${settings.minLessons} lessons`, ok: lessons.length >= settings.minLessons },
    { key: "content", label: "Every lesson has its content", ok: lessons.length > 0 && empty.length === 0, detail: empty.map((l) => l.title) },
    { key: "quiz", label: "Quizzes have at least 3 questions", ok: quizzes.every((q) => Number(q.n) >= 3) },
  ];
  return { checks, ready: checks.every((x) => x.ok) };
}

export const teachRoute = new Hono()
  .use("*", requireMember)
  .get("/guidelines", async (c) => c.json(await learnSettings()))
  .get("/courses", async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT c.*, cat.name AS category_name,
         (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id AND e.status = 'pending_payment') AS pending_payments,
         (SELECT COUNT(*) FROM assignment_submissions s JOIN course_lessons l ON l.id = s.lesson_id WHERE l.course_id = c.id AND s.status = 'submitted') AS to_grade,
         (SELECT COALESCE(SUM(amount_paid), 0) FROM enrollments e WHERE e.course_id = c.id AND e.status IN ('active', 'completed')) AS revenue
       FROM courses c LEFT JOIN course_categories cat ON cat.id = c.category_id WHERE c.instructor_id = ? ORDER BY c.updated_at DESC`,
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .post("/courses", validate("json", z.object({ title: z.string().trim().min(5).max(200), categoryId: z.number().int().positive().nullable().optional() })), async (c) => {
    const input = c.req.valid("json");
    const slug = await uniqueSlug("courses", input.title, null);
    const [res] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO courses (instructor_id, title, slug, category_id, outcomes, requirements, audience) VALUES (?, ?, ?, ?, '[]', '[]', '[]')",
      [c.get("member").id, input.title, slug, input.categoryId ?? null],
    );
    await getPool().execute("INSERT INTO course_sections (course_id, title) VALUES (?, 'Introduction')", [res.insertId]);
    return c.json({ id: res.insertId, slug }, 201);
  })
  .get("/courses/:id", async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    const pool = getPool();
    const [[sections], [lessons], [questions], [categories]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT * FROM course_sections WHERE course_id = ? ORDER BY sort_order, id", [course.id]),
      pool.query<RowDataPacket[]>("SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order, id", [course.id]),
      pool.query<RowDataPacket[]>(
        "SELECT q.* FROM quiz_questions q JOIN course_lessons l ON l.id = q.lesson_id WHERE l.course_id = ? ORDER BY q.sort_order, q.id",
        [course.id],
      ),
      pool.query<RowDataPacket[]>("SELECT id, name FROM course_categories WHERE is_active = 1 ORDER BY sort_order"),
    ]);
    return c.json({
      course,
      sections: sections.map((s) => ({
        ...s,
        lessons: lessons.filter((l) => l.section_id === s.id).map((l) => ({ ...l, questions: questions.filter((q) => q.lesson_id === l.id) })),
      })),
      categories,
      readiness: await readiness(course.id),
    });
  })
  .patch("/courses/:id", validate("json", courseSchema.partial()), async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    const input = c.req.valid("json");
    const { columns, params } = toColumns({ ...input, description: cleanRichText(input.description) }, COURSE_FIELDS);
    if (input.title && input.title !== course.title && course.status === "draft") {
      columns.push("slug");
      params.push(await uniqueSlug("courses", input.title, null, course.id));
    }
    if (columns.length) await getPool().execute(updateSql("courses", columns), [...params, course.id]);
    return c.json({ ok: true });
  })
  .delete("/courses/:id", async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    if (course.enrollment_count > 0) throw new AppError("Courses with learners can't be deleted. Archive it instead.", 409);
    await getPool().execute("DELETE FROM courses WHERE id = ?", [course.id]);
    return c.body(null, 204);
  })
  .post("/courses/:id/submit", async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    if (!["draft", "rejected", "archived"].includes(course.status)) throw new AppError("This course is already submitted or live.", 409);
    const r = await readiness(course.id);
    if (!r.ready) throw new AppError(`Not ready yet: ${r.checks.filter((x) => !x.ok).map((x) => x.label.toLowerCase()).join(", ")}.`, 422);
    // Archived courses that were already approved come straight back.
    const status = course.status === "archived" && course.published_at ? "published" : "in_review";
    await getPool().execute("UPDATE courses SET status = ?, submitted_at = NOW(), review_note = NULL WHERE id = ?", [status, course.id]);
    return c.json({ status });
  })
  .post("/courses/:id/archive", async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    await getPool().execute("UPDATE courses SET status = IF(status = 'in_review', 'draft', 'archived') WHERE id = ?", [course.id]);
    return c.json({ ok: true });
  })
  // ---- Curriculum -------------------------------------------------------------------
  .post("/courses/:id/sections", validate("json", z.object({ title: z.string().trim().min(2).max(200) })), async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    const [res] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO course_sections (course_id, title, sort_order) VALUES (?, ?, (SELECT COALESCE(MAX(s.sort_order), 0) + 1 FROM course_sections s WHERE s.course_id = ?))",
      [course.id, c.req.valid("json").title, course.id],
    );
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/sections/:id", validate("json", z.object({ title: z.string().trim().min(2).max(200) })), async (c) => {
    const section = await ownedBy(c, "course_sections", Number(c.req.param("id")));
    await getPool().execute("UPDATE course_sections SET title = ? WHERE id = ?", [c.req.valid("json").title, section.id]);
    return c.json({ ok: true });
  })
  .delete("/sections/:id", async (c) => {
    const section = await ownedBy(c, "course_sections", Number(c.req.param("id")));
    await getPool().execute("DELETE FROM course_sections WHERE id = ?", [section.id]);
    await recount(section.course_id);
    return c.body(null, 204);
  })
  .post(
    "/courses/:id/reorder",
    validate("json", z.object({ sections: z.array(z.object({ id: z.number().int(), lessons: z.array(z.number().int()) })).max(200) })),
    async (c) => {
      const course = await ownedCourse(c, Number(c.req.param("id")));
      const conn = await getPool().getConnection();
      try {
        await conn.beginTransaction();
        for (const [si, s] of c.req.valid("json").sections.entries()) {
          await conn.execute("UPDATE course_sections SET sort_order = ? WHERE id = ? AND course_id = ?", [si, s.id, course.id]);
          for (const [li, lessonId] of s.lessons.entries()) {
            await conn.execute("UPDATE course_lessons SET sort_order = ?, section_id = ? WHERE id = ? AND course_id = ?", [li, s.id, lessonId, course.id]);
          }
        }
        await conn.commit();
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
      return c.json({ ok: true });
    },
  )
  .post("/sections/:id/lessons", validate("json", lessonSchema), async (c) => {
    const section = await ownedBy(c, "course_sections", Number(c.req.param("id")));
    const input = c.req.valid("json");
    const { columns, params } = toColumns({ ...input, content: cleanRichText(input.content) }, LESSON_FIELDS);
    const [res] = await getPool().execute<ResultSetHeader>(
      `INSERT INTO course_lessons (${[...columns, "course_id", "section_id", "sort_order"].join(", ")})
       VALUES (${columns.map(() => "?").join(", ")}${columns.length ? ", " : ""}?, ?, (SELECT COALESCE(MAX(l.sort_order), 0) + 1 FROM course_lessons l WHERE l.section_id = ?))`,
      [...params, section.course_id, section.id, section.id],
    );
    await recount(section.course_id);
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/lessons/:id", validate("json", lessonSchema.partial()), async (c) => {
    const lesson = await ownedBy(c, "course_lessons", Number(c.req.param("id")));
    const input = c.req.valid("json");
    const { columns, params } = toColumns({ ...input, content: cleanRichText(input.content) }, LESSON_FIELDS);
    if (columns.length) await getPool().execute(updateSql("course_lessons", columns), [...params, lesson.id]);
    await recount(lesson.course_id);
    return c.json({ ok: true });
  })
  .delete("/lessons/:id", async (c) => {
    const lesson = await ownedBy(c, "course_lessons", Number(c.req.param("id")));
    await getPool().execute("DELETE FROM course_lessons WHERE id = ?", [lesson.id]);
    await recount(lesson.course_id);
    return c.body(null, 204);
  })
  .put("/lessons/:id/questions", validate("json", questionsSchema), async (c) => {
    const lesson = await ownedBy(c, "course_lessons", Number(c.req.param("id")));
    if (lesson.type !== "quiz") throw new AppError("Only quiz lessons have questions.", 409);
    const { questions } = c.req.valid("json");
    for (const q of questions) {
      if (q.correctIndex >= q.options.length) throw new AppError(`Pick the correct answer for "${q.question.slice(0, 40)}".`, 422);
    }
    const conn = await getPool().getConnection();
    try {
      await conn.beginTransaction();
      await conn.execute("DELETE FROM quiz_questions WHERE lesson_id = ?", [lesson.id]);
      for (const [i, q] of questions.entries()) {
        await conn.execute(
          "INSERT INTO quiz_questions (lesson_id, question, options, correct_index, explanation, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
          [lesson.id, q.question, JSON.stringify(q.options), q.correctIndex, q.explanation ?? null, i],
        );
      }
      await conn.commit();
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
    return c.json({ ok: true });
  })
  // ---- Students & grading ----------------------------------------------------------------
  .get("/courses/:id/students", async (c) => {
    const course = await ownedCourse(c, Number(c.req.param("id")));
    const pool = getPool();
    const [[students], [submissions]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT e.id, e.status, e.progress_percent, e.amount_paid, e.created_at, e.completed_at, u.full_name, u.username, u.avatar_url, u.email,
           p.reference AS payment_reference, p.status AS payment_status
         FROM enrollments e JOIN users u ON u.id = e.user_id LEFT JOIN payments p ON p.id = e.payment_id
         WHERE e.course_id = ? ORDER BY e.status = 'pending_payment' DESC, e.id DESC`,
        [course.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT s.*, l.title AS lesson_title, u.full_name, u.username, u.avatar_url FROM assignment_submissions s
         JOIN course_lessons l ON l.id = s.lesson_id JOIN users u ON u.id = s.user_id
         WHERE l.course_id = ? ORDER BY s.status = 'submitted' DESC, s.updated_at DESC`,
        [course.id],
      ),
    ]);
    return c.json({ course: { id: course.id, title: course.title, slug: course.slug, price: course.price }, students, submissions });
  })
  .post("/enrollments/:id/confirm", async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>(
      "SELECT e.*, c.title, c.slug FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.id = ? AND c.instructor_id = ?",
      [id, c.get("member").id],
    );
    const e = rows[0];
    if (!e) throw new AppError("Enrolment not found.", 404);
    if (e.status !== "pending_payment") throw new AppError("This learner already has access.", 409);
    await fulfil("enrollment", [id], null);
    notify(e.user_id, { kind: "learn", title: `You're enrolled in ${e.title}`, body: "The instructor confirmed your payment.", link: `/learn/c/${e.slug}/learn` });
    return c.json({ ok: true });
  })
  .patch(
    "/submissions/:id",
    validate("json", z.object({ grade: z.number().int().min(0).max(100).nullable().optional(), feedback: optionalText(2000), status: z.enum(["graded", "resubmit"]) })),
    async (c) => {
      const id = Number(c.req.param("id"));
      const [rows] = await getPool().execute<RowDataPacket[]>(
        `SELECT s.*, l.title, co.slug FROM assignment_submissions s JOIN course_lessons l ON l.id = s.lesson_id
         JOIN courses co ON co.id = l.course_id WHERE s.id = ? AND co.instructor_id = ?`,
        [id, c.get("member").id],
      );
      const s = rows[0];
      if (!s) throw new AppError("Submission not found.", 404);
      const input = c.req.valid("json");
      await getPool().execute("UPDATE assignment_submissions SET grade = ?, feedback = ?, status = ?, graded_at = NOW() WHERE id = ?", [
        input.grade ?? null,
        input.feedback ?? null,
        input.status,
        id,
      ]);
      notify(s.user_id, {
        kind: "learn",
        title: input.status === "graded" ? `Your assignment "${s.title}" was graded` : `Please resubmit "${s.title}"`,
        body: input.feedback ?? null,
        link: `/learn/c/${s.slug}/learn`,
        actorId: c.get("member").id,
      });
      return c.json({ ok: true });
    },
  );
