import { createHmac } from 'node:crypto'
import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { sign, verify } from 'hono/jwt'
import { getPool } from '@cv/db'
import type { RowDataPacket } from 'mysql2/promise'
import { getMember } from '#/server/member-session-core'
import { AppError } from '../../middleware/error-handler'

export const CHILD_COOKIE = 'cv_kidi_child'
export const CHILD_TTL = 8 * 60 * 60
export interface KidiLearner {
  userId: number
  childId: number | null
  name: string
  level: string | null
  avatar: string | null
  photoUrl: string | null
}
declare module 'hono' {
  interface ContextVariableMap {
    kidiLearner: KidiLearner
  }
}

function key(purpose: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32)
    throw new Error('Session secret is not configured')
  return createHmac('sha256', secret)
    .update(`capevars:kidilearn:${purpose}:v1`)
    .digest('hex')
}
export const normalizeCode = (code: string) =>
  code.toUpperCase().replace(/[\s-]/g, '')
export const codeHash = (code: string) =>
  createHmac('sha256', key('access-code'))
    .update(normalizeCode(code))
    .digest('hex')
export async function childToken(id: number, version: number) {
  const now = Math.floor(Date.now() / 1000)
  return sign(
    {
      sub: id,
      aud: 'kidilearn-child',
      version,
      iat: now,
      exp: now + CHILD_TTL,
    },
    key('session'),
    'HS256',
  )
}
export async function getLearner(c: Context): Promise<KidiLearner | null> {
  const token = getCookie(c, CHILD_COOKIE)
  if (token) {
    let payload
    try {
      payload = await verify(token, key('session'), 'HS256')
    } catch {
      return null
    }
    if (
      payload.aud !== 'kidilearn-child' ||
      !Number.isSafeInteger(payload.sub) ||
      !Number.isSafeInteger(payload.version)
    )
      return null
    const [rows] = await getPool().execute<RowDataPacket[]>(
      `SELECT c.id, c.parent_user_id, c.display_name, c.level_key, c.avatar_key, m.url AS photo_url
       FROM kidi_children c JOIN users u ON u.id = c.parent_user_id
       LEFT JOIN kidi_child_photos p ON p.child_id = c.id LEFT JOIN media_assets m ON m.id = p.asset_id
       WHERE c.id = ? AND c.code_version = ? AND c.is_active = 1 AND u.is_active = 1`,
      [Number(payload.sub), Number(payload.version)],
    )
    const child = rows[0]
    return child
      ? {
          userId: child.parent_user_id,
          childId: child.id,
          name: child.display_name,
          level: child.level_key,
          avatar: child.avatar_key,
          photoUrl: child.photo_url ?? null,
        }
      : null
  }
  const member = await getMember(c)
  return member
    ? {
        userId: member.id,
        childId: null,
        name: member.fullName,
        level: null,
        avatar: null,
        photoUrl: member.avatarUrl,
      }
    : null
}
export async function requireLearner(c: Context, next: Next) {
  const learner = await getLearner(c)
  if (!learner)
    throw new AppError('Sign in to your learning space to continue.', 401)
  c.set('kidiLearner', learner)
  c.header('Cache-Control', 'private, no-store')
  await next()
}
export async function requireParent(c: Context, next: Next) {
  if (getCookie(c, CHILD_COOKIE))
    throw new AppError('Sign in as a parent to manage child profiles.', 403)
  const member = await getMember(c)
  if (!member) throw new AppError('Sign in as a parent to continue.', 401)
  c.set('member', member)
  c.header('Cache-Control', 'private, no-store')
  await next()
}
export function learnerStorage(learner: KidiLearner) {
  return learner.childId
    ? {
        plans: 'kidi_child_plans',
        attempts: 'kidi_child_quiz_attempts',
        owner: 'child_id',
        id: learner.childId,
      }
    : {
        plans: 'kidi_plans',
        attempts: 'kidi_quiz_attempts',
        owner: 'user_id',
        id: learner.userId,
      }
}
export async function limitLogin(c: Context, code: string) {
  const ip =
    c.req.header('x-real-ip') ??
    c.req.header('x-forwarded-for')?.split(',').at(-1)?.trim() ??
    'direct'
  const pool = getPool()
  await pool.execute(
    'DELETE FROM kidi_login_limits WHERE expires_at < NOW() LIMIT 100',
  )
  for (const [scope, maximum] of [
    [`ip:${ip}`, 30],
    [`code:${normalizeCode(code)}`, 10],
  ] as const) {
    const bucket = createHmac('sha256', key('login-limit'))
      .update(scope)
      .digest('hex')
    await pool.execute(
      `INSERT INTO kidi_login_limits (bucket_key, expires_at) VALUES (?, NOW() + INTERVAL 15 MINUTE)
      ON DUPLICATE KEY UPDATE attempts = LEAST(attempts + 1, 65535)`,
      [bucket],
    )
    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT attempts FROM kidi_login_limits WHERE bucket_key = ?',
      [bucket],
    )
    if (Number(rows[0]!.attempts) > maximum)
      throw new AppError(
        'Too many sign-in attempts. Please try again in 15 minutes.',
        429,
      )
  }
}
