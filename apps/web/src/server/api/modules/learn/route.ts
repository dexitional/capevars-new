// OpenLearn for learners: catalog and search, course landing pages, free and
// paid enrolment, the lesson player (videos, articles, infographics,
// resources), server-graded quizzes, assignments, discussions, reviews and
// completion certificates.
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { validate } from "../../lib/validate.js";
import { optionalText, optionalUrl } from "../../lib/fields.js";
import { pageQuerySchema, paging } from "../../lib/query.js";
import { textSearch, money } from "../../lib/search.js";
import { toRichHtml } from "../../lib/rich-text.js";
import { AppError } from "../../middleware/error-handler.js";
import { notify } from "../../lib/notify.js";
import { certificateCode } from "../../lib/codes.js";
import { createPayment, paystackEnabled } from "../../lib/payments.js";
import { userFields } from "../../lib/members.js";

const CARD = `c.id, c.slug, c.title, c.subtitle, c.cover_url, c.level, c.price, c.compare_at_price, c.rating_avg, c.rating_count,
  c.enrollment_count, c.lesson_count, c.duration_minutes, c.is_featured, c.published_at,
  cat.name AS category_name, cat.slug AS category_slug, u.full_name AS instructor_name, u.username AS instructor_username,
  u.avatar_url AS instructor_avatar`;
const FROM = "FROM courses c JOIN users u ON u.id = c.instructor_id LEFT JOIN course_categories cat ON cat.id = c.category_id";

const searchSchema = pageQuerySchema.extend({
  category: z.string().max(120).optional().catch(undefined),
  level: z.enum(["beginner", "intermediate", "advanced", "all"]).optional().catch(undefined),
  price: z.enum(["free", "paid"]).optional().catch(undefined),
  rating: z.coerce.number().min(0).max(5).optional().catch(undefined),
  sort: z.enum(["popular", "newest", "rating", "price_asc", "price_desc"]).catch("popular"),
});

async function enrollmentOf(courseId: number, userId: number | undefined) {
  if (!userId) return null;
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM enrollments WHERE course_id = ? AND user_id = ?", [courseId, userId]);
  return rows[0] ?? null;
}

const hasAccess = (e: RowDataPacket | null) => Boolean(e && ["active", "completed"].includes(e.status));

// Recomputes progress after a lesson is completed; issues the certificate at 100%.
async function refreshProgress(enrollmentId: number) {
  const pool = getPool();
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT e.id, e.user_id, e.status, e.certificate_code, c.id AS course_id, c.title, c.slug, c.certificate_enabled, c.instructor_id,
       (SELECT COUNT(*) FROM course_lessons l WHERE l.course_id = c.id) AS total,
       (SELECT COUNT(*) FROM lesson_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.enrollment_id = e.id) AS done
     FROM enrollments e JOIN courses c ON c.id = e.course_id WHERE e.id = ?`,
    [enrollmentId],
  );
  const e = rows[0];
  if (!e) return 0;
  const percent = e.total ? Math.min(100, Math.round((Number(e.done) / Number(e.total)) * 100)) : 0;
  if (percent >= 100 && e.status === "active") {
    await pool.execute(
      "UPDATE enrollments SET progress_percent = 100, status = 'completed', completed_at = NOW(), certificate_code = ? WHERE id = ?",
      [e.certificate_enabled ? (e.certificate_code ?? certificateCode()) : null, e.id],
    );
    notify(e.user_id, { kind: "learn", title: `You completed ${e.title}! 🎉`, body: e.certificate_enabled ? "Your certificate is ready." : null, link: `/learn/c/${e.slug}/learn` });
    notify(e.instructor_id, { kind: "learn", title: `A learner completed ${e.title}`, link: `/learn/teach` });
  } else {
    await pool.execute("UPDATE enrollments SET progress_percent = ? WHERE id = ?", [percent, e.id]);
  }
  return percent;
}

async function lessonForLearner(c: Context, lessonId: number) {
  const member = c.get("member");
  const [rows] = await getPool().execute<RowDataPacket[]>(
    "SELECT l.*, c.instructor_id, c.status AS course_status FROM course_lessons l JOIN courses c ON c.id = l.course_id WHERE l.id = ?",
    [lessonId],
  );
  const lesson = rows[0];
  if (!lesson) throw new AppError("Lesson not found.", 404);
  const enrollment = await enrollmentOf(lesson.course_id, member.id);
  if (!hasAccess(enrollment)) throw new AppError("Enrol in this course to continue.", 403);
  return { lesson, enrollment: enrollment! };
}

export const learnRoute = new Hono()
  .use("*", optionalMember)
  .get("/home", async (c) => {
    const pool = getPool();
    const live = "c.status = 'published'";
    const [[categories], [featured], [popular], [newest], [free], [instructors]] = await Promise.all([
      pool.query<RowDataPacket[]>(
        `SELECT cat.id, cat.name, cat.slug, cat.icon, (SELECT COUNT(*) FROM courses c WHERE c.category_id = cat.id AND ${live}) AS course_count
         FROM course_categories cat WHERE cat.is_active = 1 ORDER BY cat.sort_order`,
      ),
      pool.query<RowDataPacket[]>(`SELECT ${CARD} ${FROM} WHERE ${live} ORDER BY c.is_featured DESC, c.rating_avg DESC LIMIT 6`),
      pool.query<RowDataPacket[]>(`SELECT ${CARD} ${FROM} WHERE ${live} ORDER BY c.enrollment_count DESC LIMIT 10`),
      pool.query<RowDataPacket[]>(`SELECT ${CARD} ${FROM} WHERE ${live} ORDER BY c.published_at DESC LIMIT 10`),
      pool.query<RowDataPacket[]>(`SELECT ${CARD} ${FROM} WHERE ${live} AND c.price = 0 ORDER BY c.enrollment_count DESC LIMIT 10`),
      pool.query<RowDataPacket[]>(
        `SELECT u.id, u.full_name, u.username, u.avatar_url, u.headline, COUNT(c.id) AS courses, SUM(c.enrollment_count) AS learners
         FROM courses c JOIN users u ON u.id = c.instructor_id WHERE ${live} GROUP BY u.id ORDER BY learners DESC LIMIT 6`,
      ),
    ]);
    const [stats] = await pool.query<RowDataPacket[]>(
      `SELECT (SELECT COUNT(*) FROM courses WHERE status = 'published') AS courses,
         (SELECT COUNT(*) FROM enrollments) AS enrollments,
         (SELECT COUNT(DISTINCT instructor_id) FROM courses WHERE status = 'published') AS instructors`,
    );
    return c.json({ categories, featured, popular, newest, free, instructors, stats: stats[0] });
  })
  .get("/courses", async (c) => {
    const q = searchSchema.parse(c.req.query());
    const where = ["c.status = 'published'"];
    const params: Array<string | number> = [];
    if (q.category) {
      where.push("cat.slug = ?");
      params.push(q.category);
    }
    if (q.level) {
      where.push("c.level = ?");
      params.push(q.level);
    }
    if (q.price === "free") where.push("c.price = 0");
    if (q.price === "paid") where.push("c.price > 0");
    if (q.rating) {
      where.push("c.rating_avg >= ?");
      params.push(q.rating);
    }
    if (q.q) {
      const s = textSearch("c.title, c.subtitle", ["c.title", "u.full_name"], q.q);
      where.push(s.sql);
      params.push(...s.params);
    }
    const order = {
      popular: "c.enrollment_count DESC, c.rating_avg DESC",
      newest: "c.published_at DESC",
      rating: "c.rating_avg IS NULL, c.rating_avg DESC, c.rating_count DESC",
      price_asc: "c.price ASC",
      price_desc: "c.price DESC",
    }[q.sort];
    const { limit, offset } = paging(q.page, q.pageSize);
    const clause = where.join(" AND ");
    const pool = getPool();
    const [[items], [count]] = await Promise.all([
      pool.query<RowDataPacket[]>(`SELECT ${CARD} ${FROM} WHERE ${clause} ORDER BY ${order} LIMIT ? OFFSET ?`, [...params, limit, offset]),
      pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n ${FROM} WHERE ${clause}`, params),
    ]);
    return c.json({ items, total: Number(count[0]?.n ?? 0) });
  })
  .get("/c/:slug", async (c) => {
    const member = memberOrNull(c);
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.*, cat.name AS category_name, cat.slug AS category_slug, ${userFields("u", "instructor")}, u.bio AS instructor_bio
       FROM courses c JOIN users u ON u.id = c.instructor_id LEFT JOIN course_categories cat ON cat.id = c.category_id WHERE c.slug = ?`,
      [(c.req.param("slug") ?? "")],
    );
    const course = rows[0];
    const isInstructor = member?.id === course?.instructor_id;
    if (!course || (course.status !== "published" && !isInstructor)) throw new AppError("Course not found.", 404);
    const [[sections], [lessons], [reviews], [instructorStats], [breakdown]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT id, title FROM course_sections WHERE course_id = ? ORDER BY sort_order, id", [course.id]),
      pool.query<RowDataPacket[]>(
        "SELECT id, section_id, title, type, duration_minutes, is_preview FROM course_lessons WHERE course_id = ? ORDER BY sort_order, id",
        [course.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT r.id, r.rating, r.body, r.created_at, u.full_name, u.username, u.avatar_url FROM course_reviews r
         JOIN users u ON u.id = r.user_id WHERE r.course_id = ? AND r.is_hidden = 0 ORDER BY r.id DESC LIMIT 30`,
        [course.id],
      ),
      pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS courses, COALESCE(SUM(enrollment_count), 0) AS learners, ROUND(AVG(rating_avg), 1) AS rating
         FROM courses WHERE instructor_id = ? AND status = 'published'`,
        [course.instructor_id],
      ),
      pool.query<RowDataPacket[]>("SELECT rating, COUNT(*) AS n FROM course_reviews WHERE course_id = ? AND is_hidden = 0 GROUP BY rating", [course.id]),
    ]);
    const enrollment = await enrollmentOf(course.id, member?.id);
    return c.json({
      course: { ...course, description: toRichHtml(course.description) },
      curriculum: sections.map((s) => ({ ...s, lessons: lessons.filter((l) => l.section_id === s.id) })),
      reviews,
      breakdown: Object.fromEntries(breakdown.map((b) => [b.rating, Number(b.n)])),
      instructorStats: instructorStats[0],
      enrollment: enrollment ? { id: enrollment.id, status: enrollment.status, progress_percent: enrollment.progress_percent } : null,
      isInstructor,
      onlinePayments: paystackEnabled(),
    });
  })
  .post("/c/:id/enroll", requireMember, async (c) => {
    const member = c.get("member");
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>("SELECT * FROM courses WHERE id = ? AND status = 'published'", [Number(c.req.param("id"))]);
    const course = rows[0];
    if (!course) throw new AppError("Course not found.", 404);
    if (course.instructor_id === member.id) throw new AppError("You teach this course.", 409);
    const existing = await enrollmentOf(course.id, member.id);
    if (hasAccess(existing)) return c.json({ status: existing!.status });
    if (existing?.status === "revoked") throw new AppError("Your access to this course was removed.", 403);
    const free = Number(course.price) === 0;
    let enrollmentId = existing?.id as number | undefined;
    if (!existing) {
      const [res] = await pool.execute<ResultSetHeader>(
        "INSERT INTO enrollments (course_id, user_id, status) VALUES (?, ?, ?)",
        [course.id, member.id, free ? "active" : "pending_payment"],
      );
      enrollmentId = res.insertId;
      if (free) {
        await pool.execute("UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = ?", [course.id]);
        notify(course.instructor_id, { kind: "learn", title: `${member.fullName} enrolled in ${course.title}`, link: "/learn/teach", actorId: member.id });
        return c.json({ status: "active" }, 201);
      }
    }
    const payment = await createPayment({
      userId: member.id,
      email: member.email,
      purpose: "enrollment",
      targetIds: [enrollmentId!],
      amount: money(course.price),
      returnPath: `/learn/c/${course.slug}`,
    });
    if (!payment.authorizationUrl) {
      notify(course.instructor_id, {
        kind: "learn",
        title: `${member.fullName} wants to enrol in ${course.title}`,
        body: "Confirm their payment in Teach → Students to give access.",
        link: "/learn/teach",
        actorId: member.id,
      });
    }
    return c.json({ status: "pending_payment", authorizationUrl: payment.authorizationUrl }, 201);
  })
  .get("/my", requireMember, async (c) => {
    const [items] = await getPool().query<RowDataPacket[]>(
      `SELECT e.id AS enrollment_id, e.status, e.progress_percent, e.certificate_code, e.completed_at, e.updated_at AS last_activity,
         ${CARD} ${FROM} JOIN enrollments e ON e.course_id = c.id WHERE e.user_id = ? ORDER BY e.updated_at DESC`,
      [c.get("member").id],
    );
    return c.json({ items });
  })
  .get("/player/:slug", requireMember, async (c) => {
    const member = c.get("member");
    const pool = getPool();
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.id, c.slug, c.title, c.instructor_id, c.certificate_enabled, c.status, u.full_name AS instructor_name, u.username AS instructor_username
       FROM courses c JOIN users u ON u.id = c.instructor_id WHERE c.slug = ?`,
      [(c.req.param("slug") ?? "")],
    );
    const course = rows[0];
    if (!course) throw new AppError("Course not found.", 404);
    const isInstructor = course.instructor_id === member.id;
    const enrollment = await enrollmentOf(course.id, member.id);
    const full = isInstructor || hasAccess(enrollment);
    if (!full && course.status !== "published") throw new AppError("Course not found.", 404);
    const [[sections], [lessons], [questions], [progress], [submissions]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT id, title FROM course_sections WHERE course_id = ? ORDER BY sort_order, id", [course.id]),
      pool.query<RowDataPacket[]>("SELECT * FROM course_lessons WHERE course_id = ? ORDER BY sort_order, id", [course.id]),
      pool.query<RowDataPacket[]>(
        `SELECT q.id, q.lesson_id, q.question, q.options FROM quiz_questions q JOIN course_lessons l ON l.id = q.lesson_id
         WHERE l.course_id = ? ORDER BY q.sort_order, q.id`,
        [course.id],
      ),
      enrollment
        ? pool.query<RowDataPacket[]>("SELECT lesson_id, quiz_score, completed_at FROM lesson_progress WHERE enrollment_id = ?", [enrollment.id])
        : Promise.resolve([[]] as unknown as [Array<RowDataPacket>]),
      pool.query<RowDataPacket[]>(
        `SELECT s.* FROM assignment_submissions s JOIN course_lessons l ON l.id = s.lesson_id WHERE l.course_id = ? AND s.user_id = ?`,
        [course.id, member.id],
      ),
    ]);
    const shaped = lessons.map((l) => {
      const open = full || l.is_preview === 1;
      return {
        id: l.id,
        section_id: l.section_id,
        title: l.title,
        type: l.type,
        duration_minutes: l.duration_minutes,
        is_preview: l.is_preview,
        pass_mark: l.pass_mark,
        locked: !open,
        content: open ? toRichHtml(l.content) : null,
        video_url: open ? l.video_url : null,
        file_url: open ? l.file_url : null,
        image_url: open ? l.image_url : null,
        questions: open ? questions.filter((q) => q.lesson_id === l.id) : [],
        submission: submissions.find((s) => s.lesson_id === l.id) ?? null,
      };
    });
    return c.json({
      course,
      sections: sections.map((s) => ({ ...s, lessons: shaped.filter((l) => l.section_id === s.id) })),
      enrollment: enrollment
        ? {
            id: enrollment.id,
            status: enrollment.status,
            progress_percent: enrollment.progress_percent,
            certificate_code: enrollment.certificate_code,
            last_lesson_id: enrollment.last_lesson_id,
          }
        : null,
      progress,
      isInstructor,
    });
  })
  .post("/lessons/:id/complete", requireMember, async (c) => {
    const { lesson, enrollment } = await lessonForLearner(c, Number(c.req.param("id")));
    if (lesson.type === "quiz") throw new AppError("Pass the quiz to complete this lesson.", 409);
    await getPool().execute("INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id) VALUES (?, ?)", [enrollment.id, lesson.id]);
    await getPool().execute("UPDATE enrollments SET last_lesson_id = ? WHERE id = ?", [lesson.id, enrollment.id]);
    return c.json({ progress: await refreshProgress(enrollment.id) });
  })
  .post("/lessons/:id/visit", requireMember, async (c) => {
    const { lesson, enrollment } = await lessonForLearner(c, Number(c.req.param("id")));
    await getPool().execute("UPDATE enrollments SET last_lesson_id = ? WHERE id = ?", [lesson.id, enrollment.id]);
    return c.json({ ok: true });
  })
  .post("/lessons/:id/quiz", requireMember, validate("json", z.object({ answers: z.array(z.number().int().min(0).max(9)).max(100) })), async (c) => {
    const { lesson, enrollment } = await lessonForLearner(c, Number(c.req.param("id")));
    if (lesson.type !== "quiz") throw new AppError("This lesson isn't a quiz.", 409);
    const [questions] = await getPool().query<RowDataPacket[]>(
      "SELECT id, correct_index, explanation FROM quiz_questions WHERE lesson_id = ? ORDER BY sort_order, id",
      [lesson.id],
    );
    if (!questions.length) throw new AppError("This quiz has no questions yet.", 409);
    const { answers } = c.req.valid("json");
    const results = questions.map((q, i) => ({
      questionId: q.id,
      chosen: answers[i] ?? null,
      correctIndex: q.correct_index as number,
      correct: answers[i] === q.correct_index,
      explanation: q.explanation as string | null,
    }));
    const score = Math.round((results.filter((r) => r.correct).length / questions.length) * 100);
    const passed = score >= lesson.pass_mark;
    if (passed) {
      await getPool().execute(
        `INSERT INTO lesson_progress (enrollment_id, lesson_id, quiz_score) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE quiz_score = GREATEST(COALESCE(quiz_score, 0), VALUES(quiz_score))`,
        [enrollment.id, lesson.id, score],
      );
    }
    const progress = passed ? await refreshProgress(enrollment.id) : enrollment.progress_percent;
    return c.json({ score, passed, passMark: lesson.pass_mark, results, progress });
  })
  .post("/lessons/:id/assignment", requireMember, validate("json", z.object({ body: optionalText(20_000), fileUrl: optionalUrl })), async (c) => {
    const { lesson, enrollment } = await lessonForLearner(c, Number(c.req.param("id")));
    if (lesson.type !== "assignment") throw new AppError("This lesson isn't an assignment.", 409);
    const input = c.req.valid("json");
    if (!input.body && !input.fileUrl) throw new AppError("Write your answer or attach a file.", 422);
    const member = c.get("member");
    await getPool().execute(
      `INSERT INTO assignment_submissions (lesson_id, user_id, body, file_url) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE body = VALUES(body), file_url = VALUES(file_url), status = 'submitted', grade = NULL, graded_at = NULL`,
      [lesson.id, member.id, input.body ?? null, input.fileUrl ?? null],
    );
    // Submitting counts as completing the lesson; grading is feedback.
    await getPool().execute("INSERT IGNORE INTO lesson_progress (enrollment_id, lesson_id) VALUES (?, ?)", [enrollment.id, lesson.id]);
    notify(lesson.instructor_id, { kind: "learn", title: `New assignment submission: ${lesson.title}`, body: member.fullName, link: "/learn/teach", actorId: member.id });
    return c.json({ progress: await refreshProgress(enrollment.id) });
  })
  .get("/c/:id/discussions", async (c) => {
    const courseId = Number(c.req.param("id"));
    const lessonId = Number(c.req.query("lesson")) || 0;
    const pool = getPool();
    const [threads] = await pool.query<RowDataPacket[]>(
      `SELECT d.id, d.lesson_id, d.title, d.body, d.reply_count, d.created_at, l.title AS lesson_title, ${userFields("u", "author")},
         (u.id = c.instructor_id) AS is_instructor
       FROM course_discussions d JOIN users u ON u.id = d.user_id JOIN courses c ON c.id = d.course_id
       LEFT JOIN course_lessons l ON l.id = d.lesson_id
       WHERE d.course_id = ? AND d.parent_id IS NULL AND d.is_hidden = 0 ${lessonId ? "AND d.lesson_id = ?" : ""}
       ORDER BY d.id DESC LIMIT 100`,
      lessonId ? [courseId, lessonId] : [courseId],
    );
    const ids = threads.map((t) => t.id as number);
    const [replies] = ids.length
      ? await pool.query<RowDataPacket[]>(
          `SELECT d.id, d.parent_id, d.body, d.created_at, ${userFields("u", "author")}, (u.id = c.instructor_id) AS is_instructor
           FROM course_discussions d JOIN users u ON u.id = d.user_id JOIN courses c ON c.id = d.course_id
           WHERE d.parent_id IN (?) AND d.is_hidden = 0 ORDER BY d.id`,
          [ids],
        )
      : [[]];
    return c.json({ items: threads.map((t) => ({ ...t, replies: (replies as Array<RowDataPacket>).filter((r) => r.parent_id === t.id) })) });
  })
  .post(
    "/c/:id/discussions",
    requireMember,
    validate(
      "json",
      z.object({
        title: optionalText(200),
        body: z.string().trim().min(1).max(10_000),
        lessonId: z.number().int().positive().optional(),
        parentId: z.number().int().positive().optional(),
      }),
    ),
    async (c) => {
      const courseId = Number(c.req.param("id"));
      const member = c.get("member");
      const pool = getPool();
      const [courses] = await pool.execute<RowDataPacket[]>("SELECT id, title, slug, instructor_id FROM courses WHERE id = ?", [courseId]);
      const course = courses[0];
      if (!course) throw new AppError("Course not found.", 404);
      if (course.instructor_id !== member.id && !hasAccess(await enrollmentOf(courseId, member.id))) {
        throw new AppError("Enrol to join the discussion.", 403);
      }
      const input = c.req.valid("json");
      let parent: RowDataPacket | undefined;
      if (input.parentId) {
        const [p] = await pool.execute<RowDataPacket[]>("SELECT * FROM course_discussions WHERE id = ? AND course_id = ? AND parent_id IS NULL", [
          input.parentId,
          courseId,
        ]);
        parent = p[0];
        if (!parent) throw new AppError("Discussion not found.", 404);
      } else if (!input.title) {
        throw new AppError("Give your question a title.", 422);
      }
      await pool.execute(
        "INSERT INTO course_discussions (course_id, lesson_id, user_id, parent_id, title, body) VALUES (?, ?, ?, ?, ?, ?)",
        [courseId, parent ? parent.lesson_id : (input.lessonId ?? null), member.id, parent?.id ?? null, parent ? null : input.title, input.body],
      );
      if (parent) {
        await pool.execute("UPDATE course_discussions SET reply_count = reply_count + 1 WHERE id = ?", [parent.id]);
        notify(parent.user_id, { kind: "learn", title: `${member.fullName} replied to "${parent.title}"`, link: `/learn/c/${course.slug}/learn`, actorId: member.id });
      } else {
        notify(course.instructor_id, { kind: "learn", title: `New question in ${course.title}`, body: input.title ?? null, link: `/learn/c/${course.slug}/learn`, actorId: member.id });
      }
      return c.json({ ok: true }, 201);
    },
  )
  .post("/c/:id/reviews", requireMember, validate("json", z.object({ rating: z.number().int().min(1).max(5), body: optionalText(2000) })), async (c) => {
    const courseId = Number(c.req.param("id"));
    const member = c.get("member");
    if (!hasAccess(await enrollmentOf(courseId, member.id))) throw new AppError("Enrol to review this course.", 403);
    const input = c.req.valid("json");
    const pool = getPool();
    await pool.execute(
      `INSERT INTO course_reviews (course_id, user_id, rating, body) VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), body = VALUES(body)`,
      [courseId, member.id, input.rating, input.body ?? null],
    );
    await pool.execute(
      `UPDATE courses c SET rating_avg = (SELECT ROUND(AVG(rating), 1) FROM course_reviews WHERE course_id = c.id AND is_hidden = 0),
         rating_count = (SELECT COUNT(*) FROM course_reviews WHERE course_id = c.id AND is_hidden = 0) WHERE c.id = ?`,
      [courseId],
    );
    return c.json({ ok: true });
  })
  .get("/certificate/:code", async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT e.certificate_code, e.completed_at, u.full_name AS learner_name, c.title AS course_title, c.slug AS course_slug,
         c.duration_minutes, c.lesson_count, i.full_name AS instructor_name
       FROM enrollments e JOIN users u ON u.id = e.user_id JOIN courses c ON c.id = e.course_id JOIN users i ON i.id = c.instructor_id
       WHERE e.certificate_code = ? AND e.status = 'completed'`,
      [c.req.param("code").toUpperCase()],
    );
    if (!rows[0]) throw new AppError("Certificate not found.", 404);
    return c.json({ certificate: rows[0] });
  });
