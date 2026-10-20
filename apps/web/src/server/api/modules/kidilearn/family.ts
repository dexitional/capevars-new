import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { z } from 'zod'
import { getPool } from '@cv/db'
import type {
  RowDataPacket,
  ResultSetHeader,
  PoolConnection,
} from 'mysql2/promise'
import { endMemberSession } from '#/server/member-session-core'
import { LEVEL_IDS } from '#/lib/kidilearn/catalog'
import { validate } from '../../lib/validate'
import { withTransaction } from '../../lib/tx'
import { AppError } from '../../middleware/error-handler'
import {
  CHILD_COOKIE,
  CHILD_TTL,
  childToken,
  codeHash,
  getLearner,
  limitLogin,
  requireParent,
} from './session'
import { saveWithUniqueCode } from './access-code'

const profileSchema = z.object({
  name: z.string().trim().min(1).max(60),
  level: z.enum(LEVEL_IDS),
  avatar: z.enum(['sun', 'star', 'lion', 'butterfly', 'rocket', 'tree']),
  photoUrl: z.string().trim().min(1).max(1000).nullable().optional(),
})
const profile = (r: RowDataPacket) => ({
  id: r.id,
  name: r.display_name,
  level: r.level_key,
  avatar: r.avatar_key,
  photoUrl: r.photo_url ?? null,
  active: Boolean(r.is_active),
  lastLoginAt: r.last_login_at,
})
const json = <T>(v: unknown): T =>
  (typeof v === 'string' ? JSON.parse(v) : v) as T
const childSelect = `SELECT c.*, m.url AS photo_url FROM kidi_children c
  LEFT JOIN kidi_child_photos p ON p.child_id = c.id
  LEFT JOIN media_assets m ON m.id = p.asset_id`

async function savePhoto(
  conn: PoolConnection,
  childId: number,
  parentId: number,
  url: string | null | undefined,
) {
  // An omitted field preserves the current photo for older clients and access updates.
  if (url === undefined) return
  if (url === null) {
    await conn.execute('DELETE FROM kidi_child_photos WHERE child_id = ?', [
      childId,
    ])
    return
  }
  const [assets] = await conn.execute<RowDataPacket[]>(
    `SELECT id FROM media_assets WHERE user_id = ? AND url = ? AND folder = 'avatars'
     AND mime_type IN ('image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif')
     AND size_bytes > 0 AND size_bytes <= 12582912 LIMIT 1 FOR SHARE`,
    [parentId, url],
  )
  if (!assets[0])
    throw new AppError(
      'Choose a profile picture uploaded from your account.',
      422,
    )
  await conn.execute(
    'INSERT INTO kidi_child_photos (child_id, asset_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE asset_id = VALUES(asset_id)',
    [childId, assets[0].id],
  )
}
async function ownedChild(id: string, parentId: number) {
  if (!/^\d+$/.test(id)) throw new AppError('Learner not found.', 404)
  const [rows] = await getPool().execute<RowDataPacket[]>(
    `${childSelect} WHERE c.id = ? AND c.parent_user_id = ?`,
    [id, parentId],
  )
  if (!rows[0]) throw new AppError('Learner not found.', 404)
  return rows[0]
}

export const kidiFamilyRoute = new Hono()
  .use('*', async (c, next) => {
    c.header('Cache-Control', 'private, no-store')
    await next()
  })
  .get('/session', async (c) => {
    const learner = await getLearner(c)
    return c.json(
      learner
        ? {
            mode: learner.childId ? 'child' : 'parent',
            name: learner.name,
            childId: learner.childId,
            level: learner.level,
            avatar: learner.avatar,
            photoUrl: learner.photoUrl,
          }
        : null,
    )
  })
  .post(
    '/child/login',
    validate('json', z.object({ code: z.string().trim().min(1).max(64) })),
    async (c) => {
      const { code } = c.req.valid('json')
      await limitLogin(c, code)
      const [rows] = await getPool().execute<RowDataPacket[]>(
        `SELECT c.id, c.code_version FROM kidi_children c JOIN users u ON u.id = c.parent_user_id
      WHERE c.code_hash = ? AND c.is_active = 1 AND u.is_active = 1`,
        [codeHash(code)],
      )
      if (!rows[0])
        throw new AppError(
          'That code is not available. Check it or ask your parent for a new one.',
          401,
        )
      // A shared browser must not retain the parent's account while a child uses it.
      endMemberSession(c)
      setCookie(
        c,
        CHILD_COOKIE,
        await childToken(rows[0].id, rows[0].code_version),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Lax',
          path: '/',
          maxAge: CHILD_TTL,
        },
      )
      await getPool().execute(
        'UPDATE kidi_children SET last_login_at = NOW() WHERE id = ?',
        [rows[0].id],
      )
      return c.json({ ok: true })
    },
  )
  .post('/child/logout', (c) => {
    deleteCookie(c, CHILD_COOKIE, { path: '/' })
    return c.json({ ok: true })
  })
  .use('/family', requireParent)
  .use('/family/*', requireParent)
  .get('/family', async (c) => {
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `${childSelect} WHERE c.parent_user_id = ? ORDER BY c.created_at, c.id`,
      [c.get('member').id],
    )
    return c.json({ children: rows.map(profile) })
  })
  .post('/family', validate('json', profileSchema), async (c) => {
    const data = c.req.valid('json'),
      parentId = c.get('member').id
    const { result: id, code } = await withTransaction(async (conn) => {
      await conn.execute('SELECT id FROM users WHERE id = ? FOR UPDATE', [
        parentId,
      ])
      const [count] = await conn.execute<RowDataPacket[]>(
        'SELECT COUNT(*) AS total FROM kidi_children WHERE parent_user_id = ?',
        [parentId],
      )
      if (Number(count[0]!.total) >= 20)
        throw new AppError('This account already has 20 learner profiles.', 422)
      const issued = await saveWithUniqueCode(async (candidate) => {
        const [result] = await conn.execute<ResultSetHeader>(
          'INSERT INTO kidi_children (parent_user_id, display_name, level_key, avatar_key, code_hash) VALUES (?, ?, ?, ?, ?)',
          [parentId, data.name, data.level, data.avatar, codeHash(candidate)],
        )
        return result.insertId
      })
      await savePhoto(conn, issued.result, parentId, data.photoUrl)
      return issued
    })
    return c.json({ id, code }, 201)
  })
  .patch(
    '/family/:id',
    validate('json', profileSchema.extend({ active: z.boolean() })),
    async (c) => {
      const child = await ownedChild(c.req.param('id'), c.get('member').id),
        data = c.req.valid('json')
      await withTransaction(async (conn) => {
        await conn.execute(
          `UPDATE kidi_children SET display_name = ?, level_key = ?, avatar_key = ?, code_version = code_version + IF(is_active = ?, 0, 1), is_active = ? WHERE id = ? AND parent_user_id = ?`,
          [
            data.name,
            data.level,
            data.avatar,
            data.active,
            data.active,
            child.id,
            c.get('member').id,
          ],
        )
        await savePhoto(conn, child.id, c.get('member').id, data.photoUrl)
      })
      return c.json({ ok: true })
    },
  )
  .post('/family/:id/code', async (c) => {
    const child = await ownedChild(c.req.param('id'), c.get('member').id)
    const { code } = await saveWithUniqueCode(async (candidate) => {
      const hash = codeHash(candidate)
      const [result] = await getPool().execute<ResultSetHeader>(
        'UPDATE kidi_children SET code_hash = ?, code_version = code_version + 1 WHERE id = ? AND parent_user_id = ? AND code_hash <> ?',
        [hash, child.id, c.get('member').id, hash],
      )
      return result.affectedRows ? true : null
    })
    return c.json({ code })
  })
  .get('/family/:id/report', async (c) => {
    const child = await ownedChild(c.req.param('id'), c.get('member').id),
      pool = getPool()
    const [[plans], [courses], [weekly], [recent]] = await Promise.all([
      pool.execute<RowDataPacket[]>(
        'SELECT * FROM kidi_child_plans WHERE child_id = ? ORDER BY updated_at DESC',
        [child.id],
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT k.level_key, k.subject_key, c.title,
        (SELECT COUNT(*) FROM kidi_lessons l WHERE l.course_id = c.id) AS lessons,
        (SELECT COUNT(*) FROM kidi_child_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = c.id) AS completed_steps,
        (SELECT MAX(p.completed_at) FROM kidi_child_progress p JOIN course_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = c.id) AS last_completion,
        (SELECT COUNT(*) FROM kidi_child_practice p JOIN kidi_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = c.id) AS practice_attempts,
        (SELECT AVG(p.score) FROM kidi_child_practice p JOIN kidi_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = c.id) AS practice_average,
        (SELECT MAX(p.submitted_at) FROM kidi_child_practice p JOIN kidi_lessons l ON l.id = p.lesson_id WHERE p.child_id = ? AND l.course_id = c.id) AS last_practice,
        (SELECT COUNT(*) FROM kidi_child_quiz_attempts a WHERE a.child_id = ? AND a.level_key = k.level_key AND a.subject_key = k.subject_key AND a.submitted_at IS NOT NULL) AS final_attempts,
        (SELECT AVG(a.score) FROM kidi_child_quiz_attempts a WHERE a.child_id = ? AND a.level_key = k.level_key AND a.subject_key = k.subject_key AND a.submitted_at IS NOT NULL) AS final_average,
        (SELECT COUNT(*) FROM kidi_child_quiz_attempts a WHERE a.child_id = ? AND a.level_key = k.level_key AND a.subject_key = k.subject_key AND a.passed = 1) AS final_passes,
        (SELECT MAX(a.submitted_at) FROM kidi_child_quiz_attempts a WHERE a.child_id = ? AND a.level_key = k.level_key AND a.subject_key = k.subject_key) AS last_final
        FROM kidi_course_links k JOIN courses c ON c.id = k.course_id WHERE k.is_active = 1 AND c.status = 'published'`,
        Array(9).fill(child.id),
      ),
      pool.execute<RowDataPacket[]>(
        `SELECT DATE_FORMAT(submitted_at, '%Y-%m-%d') AS day, COUNT(*) AS submissions FROM (
        SELECT submitted_at FROM kidi_child_practice WHERE child_id = ? AND submitted_at >= CURDATE() - INTERVAL 6 DAY
        UNION ALL SELECT submitted_at FROM kidi_child_quiz_attempts WHERE child_id = ? AND submitted_at >= CURDATE() - INTERVAL 6 DAY
        ) activity GROUP BY day ORDER BY day`,
        [child.id, child.id],
      ),
      pool.execute<RowDataPacket[]>(
        'SELECT id, level_key, subject_key, score, passed, submitted_at FROM kidi_child_quiz_attempts WHERE child_id = ? AND submitted_at IS NOT NULL ORDER BY submitted_at DESC LIMIT 20',
        [child.id],
      ),
    ])
    const parsedPlans = plans.map((p) => ({
      level: p.level_key,
      days: json(p.study_days),
      minutesPerSession: p.minutes_per_session,
      subjects: json<Array<{ subjectId: string }>>(p.subjects),
    }))
    const planned = new Set(
      parsedPlans.flatMap((p) =>
        p.subjects.map((s) => `${p.level}/${s.subjectId}`),
      ),
    )
    return c.json({
      child: profile(child),
      plans: parsedPlans,
      subjects: courses
        .filter(
          (r) =>
            planned.has(`${r.level_key}/${r.subject_key}`) ||
            Number(r.completed_steps) ||
            Number(r.practice_attempts) ||
            Number(r.final_attempts),
        )
        .map((r) => ({
          level: r.level_key,
          subjectId: r.subject_key,
          title: r.title,
          lessons: Number(r.lessons),
          completedSteps: Number(r.completed_steps),
          progress: Number(r.lessons)
            ? Math.min(
                100,
                Math.floor(
                  (Number(r.completed_steps) / (Number(r.lessons) * 3)) * 100,
                ),
              )
            : 0,
          practiceAttempts: Number(r.practice_attempts),
          practiceAverage:
            r.practice_average === null
              ? null
              : Math.round(Number(r.practice_average)),
          finalAttempts: Number(r.final_attempts),
          finalAverage:
            r.final_average === null
              ? null
              : Math.round(Number(r.final_average)),
          finalPasses: Number(r.final_passes),
          lastActivity:
            [r.last_completion, r.last_practice, r.last_final]
              .filter(Boolean)
              .sort(
                (a, b) => new Date(b).getTime() - new Date(a).getTime(),
              )[0] ?? null,
        })),
      weeklyActivity: weekly.map((r) => ({
        date: r.day,
        submissions: Number(r.submissions),
      })),
      recentQuizzes: recent.map((r) => ({
        id: r.id,
        level: r.level_key,
        subjectId: r.subject_key,
        score: r.score,
        passed: Boolean(r.passed),
        submittedAt: r.submitted_at,
      })),
    })
  })
