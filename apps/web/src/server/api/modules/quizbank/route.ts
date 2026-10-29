// OpenLearn Quizbank for members: browse courses by level and tag, pin them to
// the Study Board (each narrowed to chosen topic tags), build study sets that
// mix courses and topics, sit timed exam simulations (marked on submit,
// written answers by Claude), study question by question with hints and
// explanations, and discuss each question.
import { Hono } from "hono";
import { z } from "zod";
import { getPool } from "@cv/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { memberOrNull, optionalMember, requireMember } from "#/server/member-session-core";
import { QB_DISCUSSION_KINDS, QB_EXAM, QB_LEVEL_IDS, QB_MAX_TEXT_ANSWER, qbVariationSchema } from "#/lib/quizbank";
import type { QbDiscussionKind, QbMark } from "#/lib/quizbank";
import { validate } from "../../lib/validate.js";
import { likePattern, pageQuerySchema, paging } from "../../lib/query.js";
import { AppError } from "../../middleware/error-handler.js";
import {
  countQuestions,
  json,
  markAll,
  markResponse,
  pickQuestionIds,
  publicQuestion,
  questionKey,
  tagsFor,
  topicsFor,
  validTopicIds,
} from "../../lib/quizbank.js";
import type { Response } from "../../lib/quizbank.js";

const SUBMIT_GRACE_MS = 60_000;
const PUBLISHED_QUESTION = "q.status = 'published'";

const responseSchema = z.object({
  questionId: z.number().int().positive(),
  optionIndex: z.number().int().min(0).max(7).nullish(),
  text: z.string().max(QB_MAX_TEXT_ANSWER).nullish(),
});
const answersSchema = z.object({ answers: z.array(responseSchema).max(QB_EXAM.maxQuestions) });
const settingsSchema = z.object({
  examQuestions: z.number().int().min(QB_EXAM.minQuestions).max(QB_EXAM.maxQuestions).nullable().optional(),
  examMinutes: z.number().int().min(QB_EXAM.minMinutes).max(QB_EXAM.maxMinutes).nullable().optional(),
  // Topic tags to draw from; empty means every question in the course.
  tagIds: z.array(z.number().int().positive()).max(50).optional(),
});
const tagList = (raw: unknown) => json<Array<number>>(raw, []);

const utc = (s: string) => Date.parse(`${s.replace(" ", "T")}Z`);
const sqlUtc = (ms: number) => new Date(ms).toISOString().slice(0, 19).replace("T", " ");

async function publishedCourse(by: "id" | "slug", value: string | number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(`SELECT * FROM qb_courses WHERE ${by} = ? AND status = 'published'`, [value]);
  if (!rows[0]) throw new AppError("Course not found.", 404);
  return rows[0];
}

// A published question that sits in at least one published course.
async function liveQuestion(id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT q.* FROM qb_questions q WHERE q.id = ? AND ${PUBLISHED_QUESTION}
       AND EXISTS (SELECT 1 FROM qb_course_questions cq JOIN qb_courses c ON c.id = cq.course_id WHERE cq.question_id = q.id AND c.status = 'published')`,
    [id],
  );
  if (!rows[0]) throw new AppError("Question not found.", 404);
  return rows[0];
}

async function questionsByIds(ids: Array<number>) {
  if (!ids.length) return [];
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT * FROM qb_questions WHERE id IN (?)", [ids]);
  const byId = new Map(rows.map((r) => [r.id as number, r]));
  return ids.map((id) => byId.get(id)).filter((r): r is RowDataPacket => Boolean(r));
}

function courseCard(row: RowDataPacket, tags: Map<number, Array<{ name: string; slug: string }>>) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    code: row.code,
    level: row.level,
    description: row.description,
    coverUrl: row.cover_url,
    questionCount: row.question_count,
    boardCount: row.board_count,
    examQuestions: row.exam_questions,
    examMinutes: row.exam_minutes,
    tags: tags.get(row.id) ?? [],
    onBoard: Boolean(row.on_board),
  };
}

async function tagNames(ids: Array<number>) {
  if (!ids.length) return new Map<number, string>();
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT id, name FROM qb_tags WHERE id IN (?)", [ids]);
  return new Map(rows.map((r) => [r.id as number, r.name as string]));
}

// Creates a timed attempt from already-picked questions.
async function startAttempt(userId: number, source: { courseId: number | null; variationId: number | null; title: string }, questionIds: Array<number>, minutes: number) {
  if (!questionIds.length) throw new AppError("No questions match. Pick more topics, or another course.", 409);
  const now = Date.now();
  const [res] = await getPool().execute<ResultSetHeader>(
    "INSERT INTO qb_attempts (user_id, course_id, variation_id, title, question_ids, answers, minutes, started_at, ends_at) VALUES (?, ?, ?, ?, ?, '[]', ?, ?, ?)",
    [userId, source.courseId, source.variationId, source.title.slice(0, 200), JSON.stringify(questionIds), minutes, sqlUtc(now), sqlUtc(now + minutes * 60_000)],
  );
  return res.insertId;
}

const withTopics = (title: string, names: Array<string>) => (names.length ? `${title} · ${names.join(", ")}` : title);

async function loadAttempt(userId: number, id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT a.*, c.title AS course_title, c.slug AS course_slug, v.name AS variation_name
     FROM qb_attempts a LEFT JOIN qb_courses c ON c.id = a.course_id LEFT JOIN qb_variations v ON v.id = a.variation_id
     WHERE a.id = ? AND a.user_id = ?`,
    [id, userId],
  );
  if (!rows[0]) throw new AppError("Exam not found.", 404);
  return rows[0];
}

async function attemptResponse(row: RowDataPacket) {
  const questions = await questionsByIds(json<Array<number>>(row.question_ids, []));
  const submitted = row.status === "submitted";
  const results = json<Array<QbMark>>(row.results, []);
  const marks = new Map(results.map((m) => [m.questionId, m]));
  return {
    id: row.id,
    title: row.title ?? row.variation_name ?? row.course_title ?? "Exam",
    // Where to retake or study it again: the study set, else the course.
    source: row.variation_id
      ? { kind: "variation" as const, id: row.variation_id as number, name: row.variation_name as string }
      : row.course_id && row.course_slug
        ? { kind: "course" as const, id: row.course_id as number, slug: row.course_slug as string, title: row.course_title as string }
        : null,
    status: row.status,
    minutes: row.minutes,
    startedAt: row.started_at,
    endsAt: row.ends_at,
    remainingSeconds: Math.max(0, Math.round((utc(row.ends_at) - Date.now()) / 1000)),
    submittedAt: row.submitted_at,
    score: row.score === null ? null : Number(row.score),
    maxScore: row.max_score === null ? null : Number(row.max_score),
    answers: json<Array<Response>>(row.answers, []),
    questions: questions.map((q) => ({
      ...publicQuestion(q),
      ...(submitted ? { key: questionKey(q), mark: marks.get(q.id) ?? null } : {}),
    })),
  };
}

const MAX_VARIATIONS = 30;

// Of these course ids, the published ones, in the given order.
async function publishedCourseIds(ids: Array<number>) {
  if (!ids.length) return [];
  const [rows] = await getPool().query<RowDataPacket[]>("SELECT id FROM qb_courses WHERE id IN (?) AND status = 'published'", [ids]);
  const live = new Set(rows.map((r) => r.id as number));
  return ids.filter((id) => live.has(id));
}

async function cleanVariation(input: z.output<typeof qbVariationSchema>) {
  const courseIds = await publishedCourseIds([...new Set(input.courseIds)]);
  if (!courseIds.length) throw new AppError("Pick at least one published course.", 422);
  const tagIds = await validTopicIds(courseIds, input.tagIds);
  if (!(await countQuestions(courseIds, tagIds))) throw new AppError("No questions match these courses and topics yet.", 422);
  return { ...input, courseIds, tagIds };
}

async function ownVariation(userId: number, id: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>("SELECT * FROM qb_variations WHERE id = ? AND user_id = ?", [id, userId]);
  if (!rows[0]) throw new AppError("Study set not found.", 404);
  return rows[0];
}

async function variationList(userId: number) {
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT v.*,
       (SELECT COUNT(*) FROM qb_attempts a WHERE a.variation_id = v.id AND a.status = 'submitted') AS exams_taken,
       (SELECT MAX(a.score / NULLIF(a.max_score, 0)) FROM qb_attempts a WHERE a.variation_id = v.id AND a.status = 'submitted') AS best
     FROM qb_variations v WHERE v.user_id = ? ORDER BY v.updated_at DESC`,
    [userId],
  );
  const allCourses = [...new Set(rows.flatMap((r) => tagList(r.course_ids)))];
  const [courses] = allCourses.length
    ? await getPool().query<RowDataPacket[]>("SELECT id, slug, title, level, status FROM qb_courses WHERE id IN (?)", [allCourses])
    : [[] as Array<RowDataPacket>];
  const byId = new Map(courses.map((r) => [r.id as number, r]));
  const names = await tagNames([...new Set(rows.flatMap((r) => tagList(r.tag_ids)))]);
  return Promise.all(
    rows.map(async (v) => {
      const live = tagList(v.course_ids).filter((id) => byId.get(id)?.status === "published");
      return {
        id: v.id,
        name: v.name,
        courses: live.map((id) => {
          const c = byId.get(id)!;
          return { id, slug: c.slug, title: c.title, level: c.level };
        }),
        topics: tagList(v.tag_ids).map((id) => ({ id, name: names.get(id) ?? "" })).filter((t) => t.name),
        examQuestions: v.exam_questions,
        examMinutes: v.exam_minutes,
        studyPosition: v.study_position,
        questionCount: await countQuestions(live, tagList(v.tag_ids)),
        examsTaken: Number(v.exams_taken),
        best: v.best === null ? null : Number(v.best),
        updatedAt: v.updated_at,
      };
    }),
  );
}

export const quizbankRoute = new Hono()
  .use("*", optionalMember)
  // ---- Browse ----------------------------------------------------------------------------------
  .get("/home", async (c) => {
    const member = memberOrNull(c);
    const pool = getPool();
    const [[levels], [tags]] = await Promise.all([
      pool.query<RowDataPacket[]>("SELECT level, COUNT(*) AS courses, SUM(question_count) AS questions FROM qb_courses WHERE status = 'published' GROUP BY level"),
      pool.query<RowDataPacket[]>(
        `SELECT t.name, t.slug, COUNT(*) AS n FROM qb_tags t JOIN qb_course_tags ct ON ct.tag_id = t.id JOIN qb_courses c ON c.id = ct.course_id AND c.status = 'published'
         GROUP BY t.id ORDER BY n DESC, t.name LIMIT 60`,
      ),
    ]);
    let boardCount = 0;
    if (member) {
      const [b] = await pool.execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM qb_board b JOIN qb_courses c ON c.id = b.course_id AND c.status = 'published' WHERE b.user_id = ?", [member.id]);
      boardCount = Number(b[0]?.n ?? 0);
    }
    return c.json({
      levels: Object.fromEntries(levels.map((l) => [l.level, { courses: Number(l.courses), questions: Number(l.questions ?? 0) }])),
      tags: tags.map((t) => ({ name: t.name, slug: t.slug, count: Number(t.n) })),
      boardCount,
    });
  })
  .get(
    "/courses",
    validate("query", pageQuerySchema.extend({ level: z.enum(QB_LEVEL_IDS).optional().catch(undefined), tag: z.string().max(70).optional() })),
    async (c) => {
      const q = c.req.valid("query");
      const member = memberOrNull(c);
      const where = ["c.status = 'published'"];
      const params: Array<string | number> = [];
      if (q.level) {
        where.push("c.level = ?");
        params.push(q.level);
      }
      if (q.tag) {
        where.push("EXISTS (SELECT 1 FROM qb_course_tags ct JOIN qb_tags t ON t.id = ct.tag_id WHERE ct.course_id = c.id AND t.slug = ?)");
        params.push(q.tag);
      }
      if (q.q) {
        where.push("(c.title LIKE ? OR c.code LIKE ? OR c.description LIKE ?)");
        params.push(likePattern(q.q), likePattern(q.q), likePattern(q.q));
      }
      const { limit, offset } = paging(q.page, q.pageSize);
      const pool = getPool();
      const [[items], [count]] = await Promise.all([
        pool.query<RowDataPacket[]>(
          `SELECT c.*, ${member ? "EXISTS (SELECT 1 FROM qb_board b WHERE b.course_id = c.id AND b.user_id = ?)" : "0"} AS on_board
           FROM qb_courses c WHERE ${where.join(" AND ")} ORDER BY c.board_count DESC, c.title LIMIT ? OFFSET ?`,
          [...(member ? [member.id] : []), ...params, limit, offset],
        ),
        pool.query<RowDataPacket[]>(`SELECT COUNT(*) AS n FROM qb_courses c WHERE ${where.join(" AND ")}`, params),
      ]);
      const tags = await tagsFor(items.map((r) => r.id as number));
      return c.json({ items: items.map((r) => courseCard(r, tags)), total: Number(count[0]?.n ?? 0) });
    },
  )
  .get("/courses/:slug", async (c) => {
    const course = await publishedCourse("slug", c.req.param("slug"));
    const member = memberOrNull(c);
    const tags = await tagsFor([course.id]);
    let board: RowDataPacket | null = null;
    let attempts: Array<RowDataPacket> = [];
    if (member) {
      const [[b], [a]] = await Promise.all([
        getPool().execute<RowDataPacket[]>("SELECT * FROM qb_board WHERE user_id = ? AND course_id = ?", [member.id, course.id]),
        getPool().execute<RowDataPacket[]>(
          "SELECT id, title, status, score, max_score, minutes, started_at, submitted_at, JSON_LENGTH(question_ids) AS questions FROM qb_attempts WHERE user_id = ? AND course_id = ? ORDER BY id DESC LIMIT 10",
          [member.id, course.id],
        ),
      ]);
      board = b[0] ?? null;
      attempts = a;
    }
    const [[types], topics] = await Promise.all([
      getPool().execute<RowDataPacket[]>(
        `SELECT q.type, COUNT(*) AS n FROM qb_course_questions cq JOIN qb_questions q ON q.id = cq.question_id AND ${PUBLISHED_QUESTION} WHERE cq.course_id = ? GROUP BY q.type`,
        [course.id],
      ),
      topicsFor([course.id]),
    ]);
    return c.json({
      course: { ...courseCard({ ...course, on_board: Boolean(board) }, tags), questionTypes: Object.fromEntries(types.map((t) => [t.type, Number(t.n)])) },
      topics,
      board: board && {
        examQuestions: board.exam_questions ?? course.exam_questions,
        examMinutes: board.exam_minutes ?? course.exam_minutes,
        tagIds: tagList(board.tag_ids),
        studyPosition: board.study_position,
        custom: board.exam_questions !== null || board.exam_minutes !== null,
      },
      attempts: attempts.map((a) => ({
        id: a.id,
        title: a.title,
        status: a.status,
        score: a.score === null ? null : Number(a.score),
        maxScore: a.max_score === null ? null : Number(a.max_score),
        minutes: a.minutes,
        questions: Number(a.questions),
        startedAt: a.started_at,
        submittedAt: a.submitted_at,
      })),
    });
  })
  // ---- Study Board -----------------------------------------------------------------------------
  .get("/board", requireMember, async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT c.*, 1 AS on_board, b.exam_questions AS my_questions, b.exam_minutes AS my_minutes, b.tag_ids, b.study_position, b.added_at,
         (SELECT COUNT(*) FROM qb_attempts a WHERE a.user_id = b.user_id AND a.course_id = c.id AND a.status = 'submitted') AS exams_taken,
         (SELECT MAX(a.score / NULLIF(a.max_score, 0)) FROM qb_attempts a WHERE a.user_id = b.user_id AND a.course_id = c.id AND a.status = 'submitted') AS best,
         (SELECT a.score / NULLIF(a.max_score, 0) FROM qb_attempts a WHERE a.user_id = b.user_id AND a.course_id = c.id AND a.status = 'submitted' ORDER BY a.id DESC LIMIT 1) AS last
       FROM qb_board b JOIN qb_courses c ON c.id = b.course_id AND c.status = 'published'
       WHERE b.user_id = ? ORDER BY b.added_at DESC`,
      [c.get("member").id],
    );
    const tags = await tagsFor(rows.map((r) => r.id as number));
    const names = await tagNames([...new Set(rows.flatMap((r) => tagList(r.tag_ids)))]);
    const matching = await Promise.all(rows.map((r) => (tagList(r.tag_ids).length ? countQuestions([r.id], tagList(r.tag_ids)) : Promise.resolve(Number(r.question_count)))));
    return c.json({
      items: rows.map((r, i) => ({
        ...courseCard(r, tags),
        settings: { examQuestions: r.my_questions ?? r.exam_questions, examMinutes: r.my_minutes ?? r.exam_minutes },
        topics: tagList(r.tag_ids).map((id) => ({ id, name: names.get(id) ?? "" })).filter((t) => t.name),
        matching: matching[i] ?? 0,
        studyPosition: r.study_position,
        examsTaken: Number(r.exams_taken),
        best: r.best === null ? null : Number(r.best),
        last: r.last === null ? null : Number(r.last),
        addedAt: r.added_at,
      })),
    });
  })
  .post("/board/:courseId", requireMember, async (c) => {
    const course = await publishedCourse("id", Number(c.req.param("courseId")));
    const [res] = await getPool().execute<ResultSetHeader>("INSERT IGNORE INTO qb_board (user_id, course_id) VALUES (?, ?)", [c.get("member").id, course.id]);
    if (res.affectedRows) await getPool().execute("UPDATE qb_courses SET board_count = board_count + 1 WHERE id = ?", [course.id]);
    return c.json({ ok: true });
  })
  .patch("/board/:courseId", requireMember, validate("json", settingsSchema), async (c) => {
    const input = c.req.valid("json");
    const sets: Array<string> = [];
    const values: Array<number | null> = [];
    if (input.examQuestions !== undefined) {
      sets.push("exam_questions = ?");
      values.push(input.examQuestions);
    }
    if (input.examMinutes !== undefined) {
      sets.push("exam_minutes = ?");
      values.push(input.examMinutes);
    }
    const courseId = Number(c.req.param("courseId"));
    let tagJson: string | null = null;
    if (input.tagIds !== undefined) {
      sets.push("tag_ids = ?");
      tagJson = JSON.stringify(await validTopicIds([courseId], input.tagIds));
    }
    if (!sets.length) return c.json({ ok: true });
    const [res] = await getPool().execute<ResultSetHeader>(`UPDATE qb_board SET ${sets.join(", ")} WHERE user_id = ? AND course_id = ?`, [
      ...values,
      ...(input.tagIds !== undefined ? [tagJson] : []),
      c.get("member").id,
      courseId,
    ]);
    if (!res.affectedRows) throw new AppError("Add this course to your Study Board first.", 404);
    return c.json({ ok: true });
  })
  .delete("/board/:courseId", requireMember, async (c) => {
    const courseId = Number(c.req.param("courseId"));
    const [res] = await getPool().execute<ResultSetHeader>("DELETE FROM qb_board WHERE user_id = ? AND course_id = ?", [c.get("member").id, courseId]);
    if (res.affectedRows) await getPool().execute("UPDATE qb_courses SET board_count = GREATEST(board_count, 1) - 1 WHERE id = ?", [courseId]);
    return c.json({ ok: true });
  })
  // ---- Exam mode -------------------------------------------------------------------------------
  .post("/courses/:id/exam", requireMember, validate("json", settingsSchema), async (c) => {
    const member = c.get("member");
    const course = await publishedCourse("id", Number(c.req.param("id")));
    const input = c.req.valid("json");
    const [board] = await getPool().execute<RowDataPacket[]>("SELECT * FROM qb_board WHERE user_id = ? AND course_id = ?", [member.id, course.id]);
    const count = input.examQuestions ?? board[0]?.exam_questions ?? course.exam_questions;
    const minutes = input.examMinutes ?? board[0]?.exam_minutes ?? course.exam_minutes;
    const tagIds = await validTopicIds([course.id], input.tagIds ?? tagList(board[0]?.tag_ids));
    const names = await tagNames(tagIds);
    const picked = await pickQuestionIds([course.id], tagIds, "random", count);
    const id = await startAttempt(member.id, { courseId: course.id, variationId: null, title: withTopics(course.title, tagIds.map((t) => names.get(t) ?? "").filter(Boolean)) }, picked, minutes);
    return c.json({ id }, 201);
  })
  .get("/attempts/:id", requireMember, async (c) => c.json({ attempt: await attemptResponse(await loadAttempt(c.get("member").id, Number(c.req.param("id")))) }))
  // Autosave, so a refresh or a dropped connection doesn't lose answers.
  .put("/attempts/:id/answers", requireMember, validate("json", answersSchema), async (c) => {
    const row = await loadAttempt(c.get("member").id, Number(c.req.param("id")));
    if (row.status !== "in_progress") throw new AppError("This exam has already been submitted.", 409);
    if (Date.now() > utc(row.ends_at) + SUBMIT_GRACE_MS) throw new AppError("Time is up for this exam.", 409);
    await getPool().execute("UPDATE qb_attempts SET answers = ? WHERE id = ? AND status = 'in_progress'", [JSON.stringify(c.req.valid("json").answers), row.id]);
    return c.json({ ok: true });
  })
  .post("/attempts/:id/submit", requireMember, validate("json", answersSchema), async (c) => {
    const row = await loadAttempt(c.get("member").id, Number(c.req.param("id")));
    if (row.status !== "in_progress") return c.json({ attempt: await attemptResponse(row) });
    // Answers sent long after the deadline don't count; the last autosave does.
    const late = Date.now() > utc(row.ends_at) + SUBMIT_GRACE_MS;
    const answers = late ? json<Array<Response>>(row.answers, []) : c.req.valid("json").answers;
    const [claim] = await getPool().execute<ResultSetHeader>("UPDATE qb_attempts SET status = 'marking', answers = ? WHERE id = ? AND status = 'in_progress'", [
      JSON.stringify(answers),
      row.id,
    ]);
    if (!claim.affectedRows) return c.json({ attempt: await attemptResponse(await loadAttempt(row.user_id, row.id)) });
    try {
      const questions = await questionsByIds(json<Array<number>>(row.question_ids, []));
      const marks = await markAll(questions, answers);
      const score = questions.reduce((n, q, i) => n + (marks[i]?.score ?? 0) * Number(q.marks), 0);
      const max = questions.reduce((n, q) => n + Number(q.marks), 0);
      await getPool().execute("UPDATE qb_attempts SET status = 'submitted', results = ?, score = ?, max_score = ?, submitted_at = UTC_TIMESTAMP() WHERE id = ?", [
        JSON.stringify(marks),
        Math.round(score * 100) / 100,
        max,
        row.id,
      ]);
    } catch (err) {
      await getPool().execute("UPDATE qb_attempts SET status = 'in_progress' WHERE id = ?", [row.id]);
      throw err;
    }
    return c.json({ attempt: await attemptResponse(await loadAttempt(row.user_id, row.id)) });
  })
  // ---- Study mode ------------------------------------------------------------------------------
  // Questions in the board's chosen topics, unless `?tags=1,2` picks others.
  .get("/courses/:id/study", requireMember, async (c) => {
    const course = await publishedCourse("id", Number(c.req.param("id")));
    const [board] = await getPool().execute<RowDataPacket[]>("SELECT study_position, tag_ids FROM qb_board WHERE user_id = ? AND course_id = ?", [c.get("member").id, course.id]);
    const asked = c.req.query("tags");
    const wanted = asked !== undefined ? asked.split(",").map(Number).filter((n) => Number.isInteger(n) && n > 0) : tagList(board[0]?.tag_ids);
    const tagIds = await validTopicIds([course.id], wanted);
    const [questions, names] = await Promise.all([questionsByIds(await pickQuestionIds([course.id], tagIds, "course")), tagNames(tagIds)]);
    return c.json({
      course: { id: course.id, slug: course.slug, title: course.title, level: course.level },
      topics: tagIds.map((id) => names.get(id) ?? "").filter(Boolean),
      position: asked !== undefined ? 0 : Math.min(board[0]?.study_position ?? 0, Math.max(0, questions.length - 1)),
      questions: questions.map(publicQuestion),
    });
  })
  .post("/courses/:id/study/position", requireMember, validate("json", z.object({ position: z.number().int().min(0).max(100_000) })), async (c) => {
    await getPool().execute("UPDATE qb_board SET study_position = ? WHERE user_id = ? AND course_id = ?", [c.req.valid("json").position, c.get("member").id, Number(c.req.param("id"))]);
    return c.json({ ok: true });
  })
  // ---- Study sets (variations) -------------------------------------------------------------------
  .get("/topics", async (c) => {
    const ids = (c.req.query("courses") ?? "")
      .split(",")
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0)
      .slice(0, 20);
    const tagIds = (c.req.query("tags") ?? "")
      .split(",")
      .map(Number)
      .filter((n) => Number.isInteger(n) && n > 0);
    const courses = await publishedCourseIds(ids);
    const [topics, matching] = await Promise.all([topicsFor(courses), countQuestions(courses, tagIds)]);
    return c.json({ ...topics, matching });
  })
  .get("/variations", requireMember, async (c) => c.json({ items: await variationList(c.get("member").id) }))
  .post("/variations", requireMember, validate("json", qbVariationSchema), async (c) => {
    const member = c.get("member");
    const [count] = await getPool().execute<RowDataPacket[]>("SELECT COUNT(*) AS n FROM qb_variations WHERE user_id = ?", [member.id]);
    if (Number(count[0]?.n) >= MAX_VARIATIONS) throw new AppError(`You can keep up to ${MAX_VARIATIONS} study sets. Delete one first.`, 409);
    const v = await cleanVariation(c.req.valid("json"));
    const [res] = await getPool().execute<ResultSetHeader>(
      "INSERT INTO qb_variations (user_id, name, course_ids, tag_ids, exam_questions, exam_minutes) VALUES (?, ?, ?, ?, ?, ?)",
      [member.id, v.name, JSON.stringify(v.courseIds), JSON.stringify(v.tagIds), v.examQuestions, v.examMinutes],
    );
    return c.json({ id: res.insertId }, 201);
  })
  .patch("/variations/:id", requireMember, validate("json", qbVariationSchema), async (c) => {
    const v = await cleanVariation(c.req.valid("json"));
    const [res] = await getPool().execute<ResultSetHeader>(
      "UPDATE qb_variations SET name = ?, course_ids = ?, tag_ids = ?, exam_questions = ?, exam_minutes = ?, study_position = 0 WHERE id = ? AND user_id = ?",
      [v.name, JSON.stringify(v.courseIds), JSON.stringify(v.tagIds), v.examQuestions, v.examMinutes, Number(c.req.param("id")), c.get("member").id],
    );
    if (!res.affectedRows) throw new AppError("Study set not found.", 404);
    return c.json({ ok: true });
  })
  .delete("/variations/:id", requireMember, async (c) => {
    await getPool().execute("DELETE FROM qb_variations WHERE id = ? AND user_id = ?", [Number(c.req.param("id")), c.get("member").id]);
    return c.json({ ok: true });
  })
  .post("/variations/:id/exam", requireMember, validate("json", settingsSchema), async (c) => {
    const member = c.get("member");
    const v = await ownVariation(member.id, Number(c.req.param("id")));
    const input = c.req.valid("json");
    const courses = await publishedCourseIds(tagList(v.course_ids));
    const picked = await pickQuestionIds(courses, tagList(v.tag_ids), "random", input.examQuestions ?? v.exam_questions);
    const id = await startAttempt(member.id, { courseId: courses.length === 1 ? (courses[0] ?? null) : null, variationId: v.id, title: v.name }, picked, input.examMinutes ?? v.exam_minutes);
    return c.json({ id }, 201);
  })
  .get("/variations/:id/study", requireMember, async (c) => {
    const v = await ownVariation(c.get("member").id, Number(c.req.param("id")));
    const courses = await publishedCourseIds(tagList(v.course_ids));
    const [questions, names] = await Promise.all([questionsByIds(await pickQuestionIds(courses, tagList(v.tag_ids), "course")), tagNames(tagList(v.tag_ids))]);
    return c.json({
      variation: { id: v.id, name: v.name },
      topics: tagList(v.tag_ids).map((id) => names.get(id) ?? "").filter(Boolean),
      position: Math.min(v.study_position, Math.max(0, questions.length - 1)),
      questions: questions.map(publicQuestion),
    });
  })
  .post("/variations/:id/study/position", requireMember, validate("json", z.object({ position: z.number().int().min(0).max(100_000) })), async (c) => {
    await getPool().execute("UPDATE qb_variations SET study_position = ? WHERE id = ? AND user_id = ?", [c.req.valid("json").position, Number(c.req.param("id")), c.get("member").id]);
    return c.json({ ok: true });
  })
  // A wrong option reveals only that option's hint; the right one (or a written
  // answer, once marked) also reveals the answer and the lesson behind it.
  .post("/questions/:id/check", requireMember, validate("json", responseSchema.omit({ questionId: true })), async (c) => {
    const q = await liveQuestion(Number(c.req.param("id")));
    const input = c.req.valid("json");
    const mark = await markResponse(q, { questionId: q.id, ...input });
    const key = questionKey(q);
    const chosenHint = input.optionIndex !== null && input.optionIndex !== undefined ? (key.optionHints[input.optionIndex] ?? null) : null;
    const reveal = mark.correct || q.type === "text";
    return c.json({
      mark,
      hint: chosenHint,
      ...(reveal ? { correctIndex: key.correctIndex, answer: key.answer, explanation: key.explanation } : {}),
    });
  })
  // Gives up on a choice question: shows the answer and the lesson.
  .post("/questions/:id/reveal", requireMember, async (c) => {
    const q = await liveQuestion(Number(c.req.param("id")));
    const key = questionKey(q);
    return c.json({ correctIndex: key.correctIndex, answer: key.answer, explanation: key.explanation });
  })
  // ---- Discussion ------------------------------------------------------------------------------
  .get("/questions/:id/discussion", async (c) => {
    const q = await liveQuestion(Number(c.req.param("id")));
    const member = memberOrNull(c);
    const [rows] = await getPool().query<RowDataPacket[]>(
      `SELECT d.id, d.kind, d.body, d.helpful_count, d.created_at, d.user_id, u.full_name, u.username, u.avatar_url,
         ${member ? "EXISTS (SELECT 1 FROM qb_discussion_votes v WHERE v.discussion_id = d.id AND v.user_id = ?)" : "0"} AS voted
       FROM qb_discussions d JOIN users u ON u.id = d.user_id
       WHERE d.question_id = ? AND d.status = 'visible' ORDER BY d.helpful_count DESC, d.id DESC LIMIT 100`,
      [...(member ? [member.id] : []), q.id],
    );
    return c.json({
      items: rows.map((r) => ({
        id: r.id,
        kind: r.kind as QbDiscussionKind,
        body: r.body,
        helpful: Number(r.helpful_count),
        voted: Boolean(r.voted),
        mine: member?.id === r.user_id,
        createdAt: r.created_at,
        author: { name: r.full_name, username: r.username, avatarUrl: r.avatar_url },
      })),
    });
  })
  .post(
    "/questions/:id/discussion",
    requireMember,
    validate("json", z.object({ kind: z.enum(Object.keys(QB_DISCUSSION_KINDS) as [QbDiscussionKind, ...Array<QbDiscussionKind>]), body: z.string().trim().min(3).max(4000) })),
    async (c) => {
      const q = await liveQuestion(Number(c.req.param("id")));
      const input = c.req.valid("json");
      const [res] = await getPool().execute<ResultSetHeader>("INSERT INTO qb_discussions (question_id, user_id, kind, body) VALUES (?, ?, ?, ?)", [
        q.id,
        c.get("member").id,
        input.kind,
        input.body,
      ]);
      await getPool().execute("UPDATE qb_questions SET discussion_count = discussion_count + 1 WHERE id = ?", [q.id]);
      return c.json({ id: res.insertId }, 201);
    },
  )
  .post("/discussion/:id/helpful", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const userId = c.get("member").id;
    const [ins] = await getPool().execute<ResultSetHeader>(
      "INSERT IGNORE INTO qb_discussion_votes (discussion_id, user_id) SELECT id, ? FROM qb_discussions WHERE id = ? AND status = 'visible' AND user_id <> ?",
      [userId, id, userId],
    );
    let voted = true;
    if (!ins.affectedRows) {
      const [del] = await getPool().execute<ResultSetHeader>("DELETE FROM qb_discussion_votes WHERE discussion_id = ? AND user_id = ?", [id, userId]);
      voted = false;
      if (!del.affectedRows) throw new AppError("You can't vote on this.", 409);
    }
    await getPool().execute("UPDATE qb_discussions SET helpful_count = (SELECT COUNT(*) FROM qb_discussion_votes WHERE discussion_id = ?) WHERE id = ?", [id, id]);
    return c.json({ voted });
  })
  .delete("/discussion/:id", requireMember, async (c) => {
    const id = Number(c.req.param("id"));
    const [rows] = await getPool().execute<RowDataPacket[]>("SELECT question_id FROM qb_discussions WHERE id = ? AND user_id = ?", [id, c.get("member").id]);
    if (!rows[0]) throw new AppError("Comment not found.", 404);
    await getPool().execute("DELETE FROM qb_discussions WHERE id = ?", [id]);
    await getPool().execute("UPDATE qb_questions SET discussion_count = GREATEST(discussion_count, 1) - 1 WHERE id = ?", [rows[0].question_id]);
    return c.json({ ok: true });
  });
