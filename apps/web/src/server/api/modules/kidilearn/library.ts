import { Hono } from 'hono'
import { z } from 'zod'
import { getPool } from '@cv/db'
import type { RowDataPacket } from 'mysql2/promise'
import type {
  LessonContent,
  Phase,
  PlayInteraction,
  Visual,
} from '#/lib/kidilearn/library'
import type { KidiLearner } from './session'
import { validate } from '../../lib/validate'
import { withTransaction } from '../../lib/tx'
import { AppError } from '../../middleware/error-handler'
import { gradeQuiz } from './quiz'

function json<T>(value: unknown): T {
  return (typeof value === 'string' ? JSON.parse(value) : value) as T
}
const phaseIds = (row: RowDataPacket) => ({
  explore: row.explore_id,
  play: row.play_id,
  challenge: row.challenge_id,
})
const courseSql = `SELECT c.id, c.title, c.price, e.id AS enrollment_id, e.status, e.progress_percent, e.last_lesson_id
 FROM kidi_course_links k JOIN courses c ON c.id = k.course_id
 LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?
 WHERE k.level_key = ? AND k.subject_key = ? AND k.is_active = 1 AND c.status = 'published'`
async function courseFor(learner: KidiLearner, level: string, subject: string) {
  const userId = learner.userId
  const [rows] = await getPool().execute<RowDataPacket[]>(courseSql, [
    userId,
    level,
    subject,
  ])
  const course = rows[0]
  if (!course) throw new AppError('This subject is not available yet.', 404)
  if (
    course.status === 'revoked' ||
    (Number(course.price) > 0 &&
      !['active', 'completed'].includes(course.status))
  )
    throw new AppError('Enrol in this course to continue.', 403)
  if (learner.childId) {
    const [progress] = await getPool().execute<RowDataPacket[]>(
      `SELECT (SELECT COUNT(*) * 3 FROM kidi_lessons WHERE course_id = ?) AS total,
        COUNT(*) AS done, (SELECT p2.lesson_id FROM kidi_child_progress p2 JOIN course_lessons l2 ON l2.id = p2.lesson_id WHERE p2.child_id = ? AND l2.course_id = ? ORDER BY p2.completed_at DESC, p2.lesson_id DESC LIMIT 1) AS last_lesson_id
       FROM kidi_child_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = ?`,
      [course.id, learner.childId, course.id, learner.childId, course.id],
    )
    course.progress_percent = Number(progress[0]!.total)
      ? Math.min(
          100,
          Math.floor(
            (Number(progress[0]!.done) / Number(progress[0]!.total)) * 100,
          ),
        )
      : 0
    course.last_lesson_id = progress[0]!.last_lesson_id
  }
  return course
}
async function lessonFor(learner: KidiLearner, id: number) {
  if (!Number.isSafeInteger(id) || id < 1)
    throw new AppError('Lesson not found.', 404)
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `SELECT l.*, k.level_key, k.subject_key FROM kidi_lessons l JOIN kidi_course_links k ON k.course_id = l.course_id WHERE l.id = ?`,
    [id],
  )
  if (!rows[0]) throw new AppError('Lesson not found.', 404)
  const lesson = rows[0]
  const course = await courseFor(learner, lesson.level_key, lesson.subject_key)
  return { lesson, course }
}
async function completed(
  enrollmentId: number | null | undefined,
  learner: KidiLearner,
) {
  if (learner.childId) {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      'SELECT lesson_id FROM kidi_child_progress WHERE child_id = ?',
      [learner.childId],
    )
    return new Set(rows.map((r) => Number(r.lesson_id)))
  }
  if (!enrollmentId) return new Set<number>()
  const [rows] = await getPool().execute<RowDataPacket[]>(
    'SELECT lesson_id FROM lesson_progress WHERE enrollment_id = ?',
    [enrollmentId],
  )
  return new Set(rows.map((r) => Number(r.lesson_id)))
}
function donePhases(row: RowDataPacket, done: Set<number>) {
  return (Object.entries(phaseIds(row)) as Array<[Phase, number]>)
    .filter(([, id]) => done.has(id))
    .map(([phase]) => phase)
}
async function recordProgress(
  learner: KidiLearner,
  lesson: RowDataPacket,
  phase: Phase,
  score: number | null,
  passed = true,
) {
  const userId = learner.userId
  return withTransaction(async (conn) => {
    // Serialize first enrolment and progress updates for this course.
    const [courses] = await conn.execute<RowDataPacket[]>(
      'SELECT price, status FROM courses WHERE id = ? FOR UPDATE',
      [lesson.course_id],
    )
    const [links] = await conn.execute<RowDataPacket[]>(
      'SELECT id FROM kidi_course_links WHERE course_id = ? AND is_active = 1',
      [lesson.course_id],
    )
    if (courses[0]?.status !== 'published' || !links.length)
      throw new AppError('This subject is not available yet.', 404)
    const [existing] = await conn.execute<RowDataPacket[]>(
      'SELECT id, status FROM enrollments WHERE course_id = ? AND user_id = ? FOR UPDATE',
      [lesson.course_id, userId],
    )
    if (existing[0]?.status === 'revoked')
      throw new AppError('Your access to this course was removed.', 403)
    if (
      Number(courses[0].price) > 0 &&
      !['active', 'completed'].includes(existing[0]?.status)
    )
      throw new AppError('Enrol in this course to continue.', 403)
    if (learner.childId) {
      if (score !== null)
        await conn.execute(
          'INSERT INTO kidi_child_practice (child_id, lesson_id, phase, score, passed) VALUES (?, ?, ?, ?, ?)',
          [learner.childId, lesson.id, phase, score, passed],
        )
      if (passed)
        await conn.execute(
          `INSERT INTO kidi_child_progress (child_id, lesson_id, quiz_score) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE quiz_score = GREATEST(COALESCE(quiz_score, 0), COALESCE(VALUES(quiz_score), 0))`,
          [learner.childId, phaseIds(lesson)[phase], score],
        )
      const [counts] = await conn.execute<RowDataPacket[]>(
        `SELECT
        (SELECT COUNT(*) * 3 FROM kidi_lessons WHERE course_id = ?) AS total,
        (SELECT COUNT(*) FROM kidi_child_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = ?) AS done`,
        [lesson.course_id, learner.childId, lesson.course_id],
      )
      return Number(counts[0]!.total)
        ? Math.min(
            100,
            Math.floor(
              (Number(counts[0]!.done) / Number(counts[0]!.total)) * 100,
            ),
          )
        : 0
    }
    if (!existing[0]) {
      await conn.execute(
        `INSERT INTO enrollments (course_id, user_id, status) VALUES (?, ?, 'active')`,
        [lesson.course_id, userId],
      )
      await conn.execute(
        'UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = ?',
        [lesson.course_id],
      )
    } else if (existing[0].status === 'pending_payment') {
      await conn.execute(
        `UPDATE enrollments SET status = 'active' WHERE id = ?`,
        [existing[0].id],
      )
    }
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT id FROM enrollments WHERE course_id = ? AND user_id = ?',
      [lesson.course_id, userId],
    )
    const enrollmentId = rows[0]!.id
    const lessonId = phaseIds(lesson)[phase]
    await conn.execute(
      `INSERT INTO lesson_progress (enrollment_id, lesson_id, quiz_score) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quiz_score = GREATEST(COALESCE(quiz_score, 0), COALESCE(VALUES(quiz_score), 0))`,
      [enrollmentId, lessonId, score],
    )
    const [counts] = await conn.execute<RowDataPacket[]>(
      `SELECT (SELECT COUNT(*) FROM course_lessons WHERE course_id = ?) AS total, (SELECT COUNT(*) FROM lesson_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.enrollment_id = ? AND l.course_id = ?) AS done`,
      [lesson.course_id, enrollmentId, lesson.course_id],
    )
    const progress = Math.min(
      100,
      Math.floor((Number(counts[0]!.done) / Number(counts[0]!.total)) * 100),
    )
    await conn.execute(
      `UPDATE enrollments SET last_lesson_id = ?, progress_percent = ?, status = ?, completed_at = IF(? = 100, COALESCE(completed_at, NOW()), completed_at) WHERE id = ?`,
      [
        lessonId,
        progress,
        progress === 100 ? 'completed' : 'active',
        progress,
        enrollmentId,
      ],
    )
    return progress
  })
}
const submission = z.object({
  phase: z.enum(['play', 'challenge']),
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        optionIndex: z.number().int().min(0).max(199),
      }),
    )
    .min(1)
    .max(25),
})

export const kidiLibraryRoute = new Hono()
  .get('/library/:level/:subject', async (c) => {
    const course = await courseFor(
      c.get('kidiLearner'),
      c.req.param('level'),
      c.req.param('subject'),
    )
    const [lessons] = await getPool().execute<RowDataPacket[]>(
      'SELECT id, title, strand, explore_id, play_id, challenge_id FROM kidi_lessons WHERE course_id = ? ORDER BY sort_order, id',
      [course.id],
    )
    if (!lessons.length)
      throw new AppError(
        'Interactive lessons are not available for this subject yet.',
        404,
      )
    const done = await completed(course.enrollment_id, c.get('kidiLearner'))
    return c.json({
      title: course.title,
      progress: Number(course.progress_percent ?? 0),
      resumeId:
        lessons.find((l) =>
          Object.values(phaseIds(l)).includes(course.last_lesson_id),
        )?.id ?? null,
      lessons: lessons.map((l) => ({
        id: l.id,
        title: l.title,
        strand: l.strand,
        completed: donePhases(l, done),
      })),
    })
  })
  .get('/lessons/:id', async (c) => {
    const { lesson, course } = await lessonFor(
      c.get('kidiLearner'),
      Number(c.req.param('id')),
    )
    const data = json<
      LessonContent & {
        playVisuals: Array<Visual | null>
        challengeVisuals: Array<Visual | null>
        playInteractions?: Array<PlayInteraction | null>
      }
    >(lesson.payload)
    const { playVisuals, challengeVisuals, playInteractions, ...content } = data
    const [questions] = await getPool().execute<RowDataPacket[]>(
      'SELECT id, lesson_id, question, options, sort_order FROM quiz_questions WHERE lesson_id IN (?, ?) ORDER BY sort_order, id',
      [lesson.play_id, lesson.challenge_id],
    )
    const bank = (id: number, visuals: Array<Visual | null>) =>
      questions
        .filter((q) => q.lesson_id === id)
        .map((q) => ({
          id: q.id,
          question: q.question,
          options: json(q.options),
          visual: visuals[q.sort_order] ?? null,
          interaction:
            id === lesson.play_id
              ? (playInteractions?.[q.sort_order] ?? null)
              : null,
        }))
    return c.json({
      id: lesson.id,
      title: lesson.title,
      strand: lesson.strand,
      completed: donePhases(
        lesson,
        await completed(course.enrollment_id, c.get('kidiLearner')),
      ),
      content,
      play: bank(lesson.play_id, playVisuals),
      challenge: bank(lesson.challenge_id, challengeVisuals),
    })
  })
  .post('/lessons/:id/explore', async (c) => {
    const learner = c.get('kidiLearner')
    const { lesson } = await lessonFor(learner, Number(c.req.param('id')))
    return c.json({
      progress: await recordProgress(learner, lesson, 'explore', null),
    })
  })
  .post(
    '/lessons/:id/check',
    validate(
      'json',
      z.object({
        questionId: z.number().int().positive(),
        optionIndex: z.number().int().min(0).max(199),
      }),
    ),
    async (c) => {
      const { lesson } = await lessonFor(
        c.get('kidiLearner'),
        Number(c.req.param('id')),
      )
      const answer = c.req.valid('json')
      // Immediate feedback is available only for Play, never for the challenge.
      const [rows] = await getPool().execute<RowDataPacket[]>(
        'SELECT correct_index, explanation, options FROM quiz_questions WHERE id = ? AND lesson_id = ?',
        [answer.questionId, lesson.play_id],
      )
      if (!rows[0]) throw new AppError('Practice question not found.', 404)
      if (answer.optionIndex >= json<Array<string>>(rows[0].options).length)
        throw new AppError('Choose an available answer.', 422)
      return c.json({
        correct: answer.optionIndex === rows[0].correct_index,
        correctIndex: rows[0].correct_index,
        explanation: rows[0].explanation,
      })
    },
  )
  .post('/lessons/:id/submit', validate('json', submission), async (c) => {
    const learner = c.get('kidiLearner')
    const { lesson, course } = await lessonFor(
      learner,
      Number(c.req.param('id')),
    )
    const { phase, answers } = c.req.valid('json')
    const [rows] = await getPool().execute<RowDataPacket[]>(
      'SELECT id, question, options, correct_index, explanation FROM quiz_questions WHERE lesson_id = ? ORDER BY sort_order, id',
      [phaseIds(lesson)[phase]],
    )
    const questions = rows.map((q) => ({
      id: q.id,
      question: q.question,
      options: json<Array<string>>(q.options),
      correctIndex: Number(q.correct_index),
    }))
    let grade
    try {
      grade = gradeQuiz(questions, answers, 70)
    } catch {
      throw new AppError('Answer every question once before finishing.', 422)
    }
    const progress =
      grade.passed || learner.childId
        ? await recordProgress(
            learner,
            lesson,
            phase,
            grade.score,
            grade.passed,
          )
        : Number(course.progress_percent ?? 0)
    return c.json({
      ...grade,
      progress,
      results: rows.map((q) => ({
        questionId: q.id,
        correct:
          answers.find((a) => a.questionId === q.id)?.optionIndex ===
          q.correct_index,
        correctIndex: q.correct_index,
        explanation: q.explanation,
      })),
    })
  })
