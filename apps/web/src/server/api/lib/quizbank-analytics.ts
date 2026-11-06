// Quizbank analytics for admins, over a period: course views (signed-in and
// guest) and exam simulations, overall, for every course, and for one course
// with the members behind the numbers.
//
// Views come from qb_course_daily_views and qb_course_member_views. Exams come
// from qb_attempts, counted by the day they were started, so the completion
// rate is the share of that period's exams that were submitted. An exam on a
// study set mixing several courses has no course, so it isn't counted here.
import { getPool } from "@cv/db";
import type { RowDataPacket } from "mysql2";
import { analyticsQuerySchema } from "./product-analytics.js";

export const qbAnalyticsQuerySchema = analyticsQuerySchema.pick({ days: true });

const num = (v: unknown) => Number(v ?? 0) || 0;
const nullable = (v: unknown) => (v === null || v === undefined ? null : Number(v));
const ymd = (d: Date) => d.toISOString().slice(0, 10);

// Day boundaries in UTC: [from, until) is this period, [prevFrom, from) the one before.
function period(days: number) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const from = new Date(today.getTime() - (days - 1) * 86_400_000);
  return { days, start: from, today: ymd(today), from: ymd(from), prevFrom: ymd(new Date(from.getTime() - days * 86_400_000)), until: ymd(new Date(today.getTime() + 86_400_000)) };
}
type Period = ReturnType<typeof period>;

const EXAM_COLUMNS = `COUNT(*) AS started, COALESCE(SUM(a.status = 'submitted'), 0) AS completed,
  COUNT(DISTINCT CASE WHEN a.status = 'submitted' THEN a.user_id END) AS takers,
  AVG(CASE WHEN a.status = 'submitted' THEN a.score / NULLIF(a.max_score, 0) END) AS avg_score,
  MAX(CASE WHEN a.status = 'submitted' THEN a.score / NULLIF(a.max_score, 0) END) AS best_score,
  AVG(CASE WHEN a.status = 'submitted' THEN TIMESTAMPDIFF(SECOND, a.started_at, a.submitted_at) END) AS avg_seconds`;

function examStats(row: RowDataPacket | undefined) {
  const started = num(row?.started);
  const completed = num(row?.completed);
  const seconds = nullable(row?.avg_seconds);
  return {
    started,
    completed,
    takers: num(row?.takers),
    completionRate: started ? completed / started : null,
    avgScore: nullable(row?.avg_score),
    bestScore: nullable(row?.best_score),
    avgMinutes: seconds === null ? null : seconds / 60,
  };
}

// Headline numbers and a zero-filled daily trend, for every course or just one.
async function totals(p: Period, courseId?: number) {
  const pool = getPool();
  const one = courseId ? [courseId] : [];
  const viewsAnd = courseId ? " AND course_id = ?" : "";
  const examsAnd = courseId ? " AND a.course_id = ?" : "";
  const [[views], [viewers], [exams], [prevExams], [viewsDaily], [examsDaily]] = await Promise.all([
    pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(CASE WHEN day >= ? THEN views END), 0) AS views, COALESCE(SUM(CASE WHEN day >= ? THEN guest_views END), 0) AS guest_views,
              COALESCE(SUM(CASE WHEN day < ? THEN views END), 0) AS prev_views
       FROM qb_course_daily_views WHERE day >= ? AND day < ?${viewsAnd}`,
      [p.from, p.from, p.from, p.prevFrom, p.until, ...one],
    ),
    pool.query<RowDataPacket[]>(`SELECT COUNT(DISTINCT user_id) AS viewers FROM qb_course_member_views WHERE day >= ? AND day < ?${viewsAnd}`, [p.from, p.until, ...one]),
    pool.query<RowDataPacket[]>(`SELECT ${EXAM_COLUMNS} FROM qb_attempts a WHERE a.course_id IS NOT NULL AND a.started_at >= ? AND a.started_at < ?${examsAnd}`, [p.from, p.until, ...one]),
    pool.query<RowDataPacket[]>(
      `SELECT COALESCE(SUM(a.status = 'submitted'), 0) AS completed FROM qb_attempts a WHERE a.course_id IS NOT NULL AND a.started_at >= ? AND a.started_at < ?${examsAnd}`,
      [p.prevFrom, p.from, ...one],
    ),
    pool.query<RowDataPacket[]>(`SELECT DATE_FORMAT(day, '%Y-%m-%d') AS day, SUM(views) AS views, SUM(guest_views) AS guest_views FROM qb_course_daily_views WHERE day >= ? AND day < ?${viewsAnd} GROUP BY day`, [p.from, p.until, ...one]),
    pool.query<RowDataPacket[]>(
      `SELECT DATE_FORMAT(a.started_at, '%Y-%m-%d') AS day, COUNT(*) AS started, COALESCE(SUM(a.status = 'submitted'), 0) AS completed
       FROM qb_attempts a WHERE a.course_id IS NOT NULL AND a.started_at >= ? AND a.started_at < ?${examsAnd} GROUP BY day`,
      [p.from, p.until, ...one],
    ),
  ]);
  const viewsBy = new Map(viewsDaily.map((r) => [String(r.day), r]));
  const examsBy = new Map(examsDaily.map((r) => [String(r.day), r]));
  const daily = Array.from({ length: p.days }, (_, i) => {
    const day = ymd(new Date(p.start.getTime() + i * 86_400_000));
    const v = viewsBy.get(day);
    const e = examsBy.get(day);
    return { day, views: num(v?.views), guestViews: num(v?.guest_views), started: num(e?.started), completed: num(e?.completed) };
  });
  return {
    range: { from: p.from, to: p.today, days: p.days },
    summary: {
      views: num(views[0]?.views),
      guestViews: num(views[0]?.guest_views),
      viewers: num(viewers[0]?.viewers),
      ...examStats(exams[0]),
      previous: { views: num(views[0]?.prev_views), completed: num(prevExams[0]?.completed) },
    },
    daily,
  };
}

// Every course, including those with no activity yet.
export async function qbAnalytics(days: number) {
  const p = period(days);
  const pool = getPool();
  const [overall, [courses], [views], [viewers], [exams]] = await Promise.all([
    totals(p),
    pool.query<RowDataPacket[]>("SELECT id, slug, title, code, level, status, question_count FROM qb_courses LIMIT 500"),
    pool.query<RowDataPacket[]>("SELECT course_id, SUM(views) AS views, SUM(guest_views) AS guest_views FROM qb_course_daily_views WHERE day >= ? AND day < ? GROUP BY course_id", [p.from, p.until]),
    pool.query<RowDataPacket[]>("SELECT course_id, COUNT(DISTINCT user_id) AS viewers FROM qb_course_member_views WHERE day >= ? AND day < ? GROUP BY course_id", [p.from, p.until]),
    pool.query<RowDataPacket[]>(`SELECT a.course_id, ${EXAM_COLUMNS} FROM qb_attempts a WHERE a.course_id IS NOT NULL AND a.started_at >= ? AND a.started_at < ? GROUP BY a.course_id`, [p.from, p.until]),
  ]);
  const viewsBy = new Map(views.map((r) => [r.course_id as number, r]));
  const viewersBy = new Map(viewers.map((r) => [r.course_id as number, num(r.viewers)]));
  const examsBy = new Map(exams.map((r) => [r.course_id as number, r]));
  return {
    ...overall,
    courses: courses.map((c) => ({
      id: c.id as number,
      slug: c.slug as string,
      title: c.title as string,
      code: c.code as string | null,
      level: c.level as string,
      status: c.status as string,
      questionCount: num(c.question_count),
      views: num(viewsBy.get(c.id)?.views),
      guestViews: num(viewsBy.get(c.id)?.guest_views),
      viewers: viewersBy.get(c.id) ?? 0,
      ...examStats(examsBy.get(c.id)),
    })),
  };
}

// One course: its numbers, and the members who viewed it or sat its exams.
export async function qbCourseAnalytics(courseId: number, days: number) {
  const p = period(days);
  const pool = getPool();
  const [overall, [viewers], [takers]] = await Promise.all([
    totals(p, courseId),
    pool.query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.email, SUM(v.views) AS views, DATE_FORMAT(MAX(v.day), '%Y-%m-%d') AS last_day
       FROM qb_course_member_views v JOIN users u ON u.id = v.user_id
       WHERE v.course_id = ? AND v.day >= ? AND v.day < ? GROUP BY u.id ORDER BY views DESC, last_day DESC, u.id LIMIT 50`,
      [courseId, p.from, p.until],
    ),
    pool.query<RowDataPacket[]>(
      `SELECT u.id, u.full_name, u.email, ${EXAM_COLUMNS}, MAX(a.started_at) AS last_at
       FROM qb_attempts a JOIN users u ON u.id = a.user_id
       WHERE a.course_id = ? AND a.started_at >= ? AND a.started_at < ? GROUP BY u.id ORDER BY completed DESC, best_score DESC, u.id LIMIT 50`,
      [courseId, p.from, p.until],
    ),
  ]);
  return {
    ...overall,
    viewers: viewers.map((r) => ({ id: r.id as number, name: r.full_name as string, email: r.email as string, views: num(r.views), lastDay: r.last_day as string })),
    takers: takers.map((r) => ({ id: r.id as number, name: r.full_name as string, email: r.email as string, lastAt: r.last_at as string, ...examStats(r) })),
  };
}
