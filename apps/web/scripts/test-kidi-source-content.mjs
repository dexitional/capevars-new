import assert from 'node:assert/strict'
import { createHash, createHmac } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { sign } from 'hono/jwt'

const root = fileURLToPath(new URL('../../../', import.meta.url))
const origin = process.env.KIDI_TEST_ORIGIN ?? 'http://localhost:3000'
assert.ok(process.env.DATABASE_URL && process.env.ADMIN_SESSION_SECRET)
const db = await mysql.createConnection(process.env.DATABASE_URL)
const username = 'kidi_source_qa_' + Date.now()
const [user] = await db.execute(
  'INSERT INTO users(full_name,username,email) VALUES(?,?,?)',
  ['Source content QA', username, username + '@example.test'],
)
const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
  .update('capevars:member-session:v1')
  .digest('hex')
const token = await sign(
  {
    sub: user.insertId,
    aud: 'member',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  },
  key,
  'HS256',
)
let cookie = `cv_session=${token}`
const api = async (path, method = 'GET', body, status = 200) => {
  const response = await fetch(origin + '/api/learn/kidilearn' + path, {
    method,
    headers: { 'Content-Type': 'application/json', cookie },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json()
  assert.equal(response.status, status, path + ': ' + JSON.stringify(data))
  return data
}
const parse = (v) => (typeof v === 'string' ? JSON.parse(v) : v)
let childCode
try {
  const sources = JSON.parse(
    await readFile(root + 'docs/kidilearn-source-content.json', 'utf8'),
  )
  assert.equal(sources.length, 42)
  assert.equal(
    sources.reduce((n, c) => n + c.lessons.length, 0),
    653,
  )
  let assets = 0,
    lessons = 0
  for (const course of sources) {
    const library = await api(`/library/${course.level}/${course.subject}`)
    assert.equal(library.lessons.length, course.lessons.length)
    for (const [index, original] of course.lessons.entries()) {
      const lesson = await api('/lessons/' + library.lessons[index].id)
      assert.equal(lesson.title, original.title)
      for (const field of [
        'sourceLesson',
        'sourceVideo',
        'sourceScope',
        'goals',
        'notes',
        'activities',
        'home',
        'safety',
        'visualGuide',
        'scenes',
        'video',
        'illustration',
      ])
        assert.deepEqual(
          lesson.content[field],
          original[field],
          `${course.level}/${course.subject}/${index}/${field}`,
        )
      assert.equal(lesson.content.pdf, course.pdf)
      assert.equal(lesson.content.epub, course.epub)
      for (const phase of ['play', 'challenge']) {
        assert.deepEqual(
          lesson[phase].map((q) => ({
            question: q.question,
            options: q.options,
          })),
          original[phase].map((q) => ({
            question: q.question,
            options: q.options,
          })),
        )
        assert.ok(
          lesson[phase].every(
            (q) => !('correctIndex' in q) && !('explanation' in q),
          ),
        )
      }
      assert.ok(!('questions' in lesson.content.sourceLesson))
      lessons++
    }
    for (const [name, hash] of Object.entries(course.assetHashes)) {
      const path = `/kidilearn/${course.level}/${course.subject}/v2/${name}`
      const bytes = await readFile(root + 'apps/web/public' + path)
      assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, path)
      assets++
    }
  }
  const child = await api(
    '/family',
    'POST',
    { name: 'Source course learner', level: 'b3', avatar: 'sun' },
    201,
  )
  childCode = child.code
  const login = await fetch(origin + '/api/learn/kidilearn/child/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-real-ip': username },
    body: JSON.stringify({ code: child.code }),
  })
  assert.equal(login.status, 200)
  cookie = login.headers
    .getSetCookie()
    .find((c) => c.startsWith('cv_kidi_child='))
    .split(';')[0]
  const subjects = [
    'ghanaian_ga',
    'ghanaian_mfantse',
    'ghanaian',
    'rme',
    'history',
    'pe',
    'french',
  ]
  await api('/plan', 'PUT', {
    level: 'b3',
    days: ['mon', 'wed'],
    minutesPerSession: 20,
    subjects: subjects.map((subjectId) => ({
      subjectId,
      quizEnabled: true,
      questionCount: 5,
      passMark: 70,
    })),
  })
  for (const subject of subjects) {
    const library = await api(`/library/b3/${subject}`)
    const lesson = await api('/lessons/' + library.lessons[0].id)
    await api('/lessons/' + lesson.id + '/explore', 'POST')
    for (const phase of ['play', 'challenge']) {
      const [answers] = await db.query(
        'SELECT id AS questionId, correct_index AS optionIndex FROM quiz_questions WHERE id IN (?)',
        [lesson[phase].map((q) => q.id)],
      )
      assert.equal(
        (
          await api('/lessons/' + lesson.id + '/submit', 'POST', {
            phase,
            answers,
          })
        ).score,
        100,
      )
    }
    const quiz = await api(
      '/quizzes',
      'POST',
      { level: 'b3', subjectId: subject },
      201,
    )
    const [rows] = await db.execute(
      'SELECT questions FROM kidi_child_quiz_attempts WHERE id=?',
      [quiz.id],
    )
    const answers = parse(rows[0].questions).map((q) => ({
      questionId: q.id,
      optionIndex: q.correctIndex,
    }))
    assert.equal(
      (await api('/quizzes/' + quiz.id + '/submit', 'POST', { answers })).score,
      100,
    )
    assert.equal((await api('/lessons/' + lesson.id)).completed.length, 3)
  }
  cookie = `cv_session=${token}`
  const report = await api('/family/' + child.id + '/report')
  for (const subjectId of subjects) {
    const subject = report.subjects.find(
      (s) => s.subjectId === subjectId && s.level === 'b3',
    )
    assert.equal(subject.completedSteps, 3)
    assert.equal(subject.practiceAttempts, 2)
    assert.equal(subject.finalPasses, 1)
  }
  console.log(
    `PASS: ${sources.length} courses, ${lessons} complete lessons, ${assets} byte-identical assets; child plans, lesson progress and final quizzes for all seven subjects.`,
  )
} finally {
  await db.execute('DELETE FROM users WHERE id=?', [user.insertId])
  const limitKey = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update('capevars:kidilearn:login-limit:v1')
    .digest('hex')
  for (const scope of [
    `ip:${username}`,
    ...(childCode ? [`code:${childCode}`] : []),
  ])
    await db.execute('DELETE FROM kidi_login_limits WHERE bucket_key=?', [
      createHmac('sha256', limitKey).update(scope).digest('hex'),
    ])
  await db.end()
}
