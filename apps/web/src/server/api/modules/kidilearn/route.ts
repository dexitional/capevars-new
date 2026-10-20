import { randomUUID } from 'node:crypto'
import { Hono } from 'hono'
import { z } from 'zod'
import type { RowDataPacket } from 'mysql2/promise'
import { getPool } from '@cv/db'
import { learnerStorage, requireLearner } from './session'
import { kidiFamilyRoute } from './family'
import {
  LEVEL_IDS,
  planSchema,
  SUBJECTS,
  subjectsForLevel,
} from '#/lib/kidilearn/catalog'
import type {
  LevelId,
  SavedPlan,
  SubjectId,
  SubjectPlan,
} from '#/lib/kidilearn/catalog'
import { validate } from '../../lib/validate'
import { withTransaction } from '../../lib/tx'
import { AppError } from '../../middleware/error-handler'
import { gradeQuiz, prepareQuestions, publicQuestions } from './quiz'
import type { Answer, StoredQuestion } from './quiz'
import { kidiLibraryRoute } from './library'

function json<T>(value: unknown): T {
  return (typeof value === 'string' ? JSON.parse(value) : value) as T
}
function savedPlan(row: RowDataPacket): SavedPlan {
  return {
    level: row.level_key,
    days: json(row.study_days),
    minutesPerSession: row.minutes_per_session,
    subjects: json(row.subjects),
    updatedAt: row.updated_at,
  }
}
function attemptResponse(row: RowDataPacket) {
  const questions = json<Array<StoredQuestion>>(row.questions)
  return {
    id: row.id,
    level: row.level_key,
    subjectId: row.subject_key,
    passMark: row.pass_mark,
    questions: publicQuestions(questions),
    result: row.submitted_at
      ? gradeQuiz(questions, json<Array<Answer>>(row.answers), row.pass_mark)
      : null,
  }
}
const startSchema = z.object({
  level: z.enum(LEVEL_IDS),
  subjectId: z.string().max(32),
})
const answersSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        optionIndex: z.number().int().min(0).max(7),
      }),
    )
    .min(1)
    .max(20),
})

export const kidiLearnRoute = new Hono()
  .route('/', kidiFamilyRoute)
  .use('*', requireLearner)
  .route('/', kidiLibraryRoute)
  .get('/dashboard', async (c) => {
    const learner = c.get('kidiLearner')
    const userId = learner.userId
    const storage = learnerStorage(learner)
    const pool = getPool()
    const [[plans], [courses], [attempts]] = await Promise.all([
      pool.execute<RowDataPacket[]>(
        `SELECT * FROM ${storage.plans} WHERE ${storage.owner} = ? ORDER BY updated_at DESC, id DESC`,
        [storage.id],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT k.level_key, k.subject_key, c.title, c.slug, c.lesson_count,
          (SELECT COUNT(*) FROM kidi_lessons kl WHERE kl.course_id = c.id) AS interactive_lessons,
          (SELECT COUNT(*) FROM quiz_questions q JOIN course_lessons l ON l.id = q.lesson_id WHERE l.course_id = c.id AND l.type = 'quiz' AND NOT EXISTS (SELECT 1 FROM kidi_lessons kl WHERE kl.play_id = l.id)) AS question_count,
          (e.status IS NULL OR e.status != 'revoked') AND (c.price = 0 OR e.status IN ('active', 'completed')) AS can_quiz,
          CASE WHEN ? IS NOT NULL THEN COALESCE((SELECT COUNT(*) * 100 DIV NULLIF((SELECT COUNT(*) * 3 FROM kidi_lessons kl WHERE kl.course_id = c.id), 0) FROM kidi_child_progress p JOIN course_lessons cl ON cl.id = p.lesson_id WHERE p.child_id = ? AND cl.course_id = c.id), 0) WHEN e.status IN ('active', 'completed') THEN e.progress_percent ELSE 0 END AS progress
         FROM kidi_course_links k JOIN courses c ON c.id = k.course_id
         LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ?
         WHERE k.is_active = 1 AND c.status = 'published'`,
        [learner.childId, learner.childId, userId],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT id, level_key, subject_key, score, passed, JSON_LENGTH(questions) AS question_count, submitted_at FROM ${storage.attempts} WHERE ${storage.owner} = ? ORDER BY created_at DESC LIMIT 50`,
        [storage.id],
      ),
    ])
    return c.json({
      preferredLevel: learner.level,
      plans: plans.map(savedPlan),
      courses: courses
        .filter(
          (r) =>
            LEVEL_IDS.includes(r.level_key) &&
            subjectsForLevel(r.level_key as LevelId).includes(
              r.subject_key as SubjectId,
            ),
        )
        .map((r) => ({
          level: r.level_key,
          subjectId: r.subject_key,
          title: r.title,
          slug: r.slug,
          lessons: Number(r.interactive_lessons || r.lesson_count),
          interactive: Number(r.interactive_lessons) > 0,
          questionCount: Number(r.question_count),
          canQuiz: Boolean(r.can_quiz),
          progress: Number(r.progress),
        })),
      attempts: attempts.map((r) => ({
        id: r.id,
        level: r.level_key,
        subjectId: r.subject_key,
        score: r.score,
        passed: r.passed === null ? null : Boolean(r.passed),
        questionCount: Number(r.question_count),
        submittedAt: r.submitted_at,
      })),
    })
  })
  .put('/plan', validate('json', planSchema), async (c) => {
    const plan = c.req.valid('json')
    const storage = learnerStorage(c.get('kidiLearner'))
    await getPool().execute(
      `INSERT INTO ${storage.plans} (${storage.owner}, level_key, study_days, minutes_per_session, subjects) VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE study_days = VALUES(study_days), minutes_per_session = VALUES(minutes_per_session), subjects = VALUES(subjects), updated_at = CURRENT_TIMESTAMP`,
      [
        storage.id,
        plan.level,
        JSON.stringify(plan.days),
        plan.minutesPerSession,
        JSON.stringify(plan.subjects),
      ],
    )
    const learner = c.get('kidiLearner')
    if (learner.childId)
      await getPool().execute(
        'UPDATE kidi_children SET level_key = ? WHERE id = ?',
        [plan.level, learner.childId],
      )
    return c.json({ ok: true })
  })
  .post('/quizzes', validate('json', startSchema), async (c) => {
    const { level, subjectId } = c.req.valid('json')
    const learner = c.get('kidiLearner')
    const userId = learner.userId
    const storage = learnerStorage(learner)
    const [plans] = await getPool().execute<RowDataPacket[]>(
      `SELECT subjects FROM ${storage.plans} WHERE ${storage.owner} = ? AND level_key = ?`,
      [storage.id, level],
    )
    const subject =
      plans[0] &&
      json<Array<SubjectPlan>>(plans[0].subjects).find(
        (s) => s.subjectId === subjectId,
      )
    if (!subject?.quizEnabled)
      throw new AppError(
        'Add this subject and enable its final quiz in your study plan first.',
        422,
      )
    const [bank] = await getPool().execute<RowDataPacket[]>(
      `SELECT q.id, q.question, q.options, q.correct_index
       FROM kidi_course_links k JOIN courses c ON c.id = k.course_id
       JOIN course_lessons l ON l.course_id = c.id AND l.type = 'quiz'
       JOIN quiz_questions q ON q.lesson_id = l.id
       WHERE k.level_key = ? AND k.subject_key = ? AND k.is_active = 1 AND c.status = 'published'
         AND NOT EXISTS (SELECT 1 FROM kidi_lessons kl WHERE kl.play_id = l.id)
         AND NOT EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = ? AND e.status = 'revoked')
         AND (c.price = 0 OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = c.id AND e.user_id = ? AND e.status IN ('active', 'completed')))`,
      [level, subjectId, userId, userId],
    )
    let questions: Array<StoredQuestion>
    try {
      questions = prepareQuestions(
        bank.map((q) => ({
          id: q.id,
          question: q.question,
          options: json(q.options),
          correctIndex: q.correct_index,
        })),
        subject.questionCount,
      )
    } catch {
      throw new AppError(
        `The final quiz for ${SUBJECTS[subject.subjectId].name} isn't ready yet. It needs ${subject.questionCount} available questions.`,
        409,
      )
    }
    const id = randomUUID()
    await getPool().execute(
      `INSERT INTO ${storage.attempts} (id, ${storage.owner}, level_key, subject_key, questions, pass_mark) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        storage.id,
        level,
        subjectId,
        JSON.stringify(questions),
        subject.passMark,
      ],
    )
    return c.json({ id }, 201)
  })
  .get('/quizzes/:id', async (c) => {
    const storage = learnerStorage(c.get('kidiLearner'))
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT * FROM ${storage.attempts} WHERE id = ? AND ${storage.owner} = ?`,
      [c.req.param('id'), storage.id],
    )
    if (!rows[0]) throw new AppError('Quiz not found.', 404)
    return c.json(attemptResponse(rows[0]))
  })
  .post('/quizzes/:id/submit', validate('json', answersSchema), async (c) => {
    const { answers } = c.req.valid('json')
    const storage = learnerStorage(c.get('kidiLearner'))
    const result = await withTransaction(async (conn) => {
      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT * FROM ${storage.attempts} WHERE id = ? AND ${storage.owner} = ? FOR UPDATE`,
        [c.req.param('id'), storage.id],
      )
      const attempt = rows[0]
      if (!attempt) throw new AppError('Quiz not found.', 404)
      if (attempt.submitted_at) return attemptResponse(attempt).result
      let grade
      try {
        grade = gradeQuiz(
          json<Array<StoredQuestion>>(attempt.questions),
          answers,
          attempt.pass_mark,
        )
      } catch {
        throw new AppError(
          'Answer every question once before finishing your quiz.',
          422,
        )
      }
      await conn.execute(
        `UPDATE ${storage.attempts} SET answers = ?, score = ?, passed = ?, submitted_at = NOW() WHERE id = ?`,
        [JSON.stringify(answers), grade.score, grade.passed, attempt.id],
      )
      return grade
    })
    return c.json(result)
  })
