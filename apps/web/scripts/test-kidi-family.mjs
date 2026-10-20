import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../../../', import.meta.url)),
  require = createRequire(root + 'package.json')
const origin = process.env.KIDI_TEST_ORIGIN || 'http://localhost:3000'
assert.ok(
  process.env.DATABASE_URL && process.env.ADMIN_SESSION_SECRET,
  'Configure DATABASE_URL and ADMIN_SESSION_SECRET for the running test application',
)
const mysql = require('mysql2/promise'),
  { sign } = require('hono/jwt')
const db = await mysql.createConnection(process.env.DATABASE_URL)
const password = 'Kidi-Integration-' + Date.now()
const passwordHash = await require('bcryptjs').hash(password, 10)
const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
  .update('capevars:member-session:v1')
  .digest('hex')
let checks = 0
const users = []
const testedCodes = new Set()
const call = async (path, cookie = '', method = 'GET', body, status = 200) => {
  if (path.endsWith('/child/login') && body?.code)
    testedCodes.add(body.code.toUpperCase().replace(/[\s-]/g, ''))
  const res = await fetch(origin + '/api' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      cookie,
      'x-real-ip': 'family-qa-' + users[0],
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json()
  assert.equal(res.status, status, path + ': ' + JSON.stringify(data))
  checks++
  return { data, res }
}
const api = async (path, cookie = '', method = 'GET', body, status = 200) =>
  (await call('/learn/kidilearn' + path, cookie, method, body, status)).data
try {
  const parents = []
  for (let i = 0; i < 2; i++) {
    const username = 'kidi_family_qa_' + Date.now() + '_' + i
    const [r] = await db.execute(
      'INSERT INTO users(full_name,username,email,password_hash) VALUES (?,?,?,?)',
      ['Family QA ' + i, username, username + '@example.test', passwordHash],
    )
    users.push(r.insertId)
    parents.push(
      'cv_session=' +
        (await sign(
          {
            sub: r.insertId,
            aud: 'member',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 14400,
          },
          key,
          'HS256',
        )),
    )
  }
  await api('/family', '', undefined, undefined, 401)
  assert.equal(await api('/session'), null)
  const a = await api(
    '/family',
    parents[0],
    'POST',
    { name: 'Ama QA', level: 'b3', avatar: 'sun' },
    201,
  )
  const b = await api(
    '/family',
    parents[0],
    'POST',
    { name: 'Kofi QA', level: 'b3', avatar: 'lion' },
    201,
  )
  const other = await api(
    '/family',
    parents[1],
    'POST',
    { name: 'Other QA', level: 'b4', avatar: 'star' },
    201,
  )
  assert.match(a.code, /^[A-HJ-NP-Z2-9]{4}$/)
  assert.notEqual(a.code, b.code)
  const [reserved] = await db.execute(
    'SELECT code_hash FROM kidi_children WHERE id=?',
    [a.id],
  )
  await assert.rejects(
    db.execute('UPDATE kidi_children SET code_hash=? WHERE id=?', [
      reserved[0].code_hash,
      b.id,
    ]),
    { code: 'ER_DUP_ENTRY' },
  )
  const list = await api('/family', parents[0])
  assert.equal(list.children.length, 2)
  assert.ok(!JSON.stringify(list).includes('code'))
  await api(
    '/family/' + a.id + '/report',
    parents[1],
    undefined,
    undefined,
    404,
  )
  await api('/family/' + a.id + '/code', parents[1], 'POST', {}, 404)
  const login = async (code, parent = '') => {
    const { res } = await call('/learn/kidilearn/child/login', parent, 'POST', {
      code,
    })
    const cookies = res.headers.getSetCookie()
    assert.ok(cookies.some((c) => c.startsWith('cv_session=;')))
    const token = cookies.find((c) => c.startsWith('cv_kidi_child='))
    assert.ok(token.includes('HttpOnly'))
    return token.split(';')[0]
  }
  let ac = await login(a.code, parents[0]),
    bc = await login(b.code)
  assert.equal((await api('/session', ac)).name, 'Ama QA')
  assert.equal((await api('/dashboard', ac)).preferredLevel, 'b3')
  assert.equal((await api('/dashboard', ac)).plans.length, 0)
  await api('/family', ac, undefined, undefined, 403)
  await api('/family', ac + '; ' + parents[0], undefined, undefined, 403)
  await call('/me', ac, undefined, undefined, 401)
  await call('/me', 'cv_session=' + ac.split('=')[1], undefined, undefined, 401)
  await api(
    '/dashboard',
    'cv_kidi_child=' + parents[0].split('=')[1],
    undefined,
    undefined,
    401,
  )
  const [parentRows] = await db.execute('SELECT email FROM users WHERE id=?', [
    users[0],
  ])
  const memberLogin = await call('/auth/login', ac, 'POST', {
    email: parentRows[0].email,
    password,
  })
  assert.ok(
    memberLogin.res.headers
      .getSetCookie()
      .some((c) => c.startsWith('cv_kidi_child=;')),
  )
  assert.ok(
    memberLogin.res.headers
      .getSetCookie()
      .some(
        (c) => c.startsWith('cv_session=') && !c.startsWith('cv_session=;'),
      ),
  )

  const plan = {
    level: 'b3',
    days: ['mon', 'wed'],
    minutesPerSession: 25,
    subjects: [
      {
        subjectId: 'mathematics',
        quizEnabled: true,
        questionCount: 5,
        passMark: 70,
      },
    ],
  }
  await api('/plan', ac, 'PUT', plan)
  assert.equal((await api('/dashboard', bc)).plans.length, 0)
  assert.equal((await api('/dashboard', parents[0])).plans.length, 0)
  const lib = await api('/library/b3/mathematics', ac)
  const lesson = await api('/lessons/' + lib.lessons[0].id, ac)
  assert.equal(lesson.completed.length, 0)
  await api('/lessons/' + lesson.id + '/explore', ac, 'POST', {})
  const correct = async (qs) => {
    const [rows] = await db.query(
      'SELECT id AS questionId,correct_index AS optionIndex FROM quiz_questions WHERE id IN (?)',
      [qs.map((q) => q.id)],
    )
    return rows
  }
  const pa = await correct(lesson.play)
  const wrong = pa.map((a) => ({
    ...a,
    optionIndex:
      (a.optionIndex + 1) %
      lesson.play.find((q) => q.id === a.questionId).options.length,
  }))
  assert.equal(
    (
      await api('/lessons/' + lesson.id + '/submit', ac, 'POST', {
        phase: 'play',
        answers: wrong,
      })
    ).passed,
    false,
  )
  assert.deepEqual((await api('/lessons/' + lesson.id, ac)).completed, [
    'explore',
  ])
  assert.equal(
    (
      await api('/lessons/' + lesson.id + '/submit', ac, 'POST', {
        phase: 'play',
        answers: pa,
      })
    ).score,
    100,
  )
  await api('/lessons/' + lesson.id + '/submit', ac, 'POST', {
    phase: 'challenge',
    answers: await correct(lesson.challenge),
  })
  assert.deepEqual((await api('/lessons/' + lesson.id, ac)).completed, [
    'explore',
    'play',
    'challenge',
  ])
  assert.equal((await api('/lessons/' + lesson.id, bc)).completed.length, 0)
  assert.equal(
    (await api('/lessons/' + lesson.id, parents[0])).completed.length,
    0,
  )
  const q = await api(
    '/quizzes',
    ac,
    'POST',
    { level: 'b3', subjectId: 'mathematics' },
    201,
  )
  await api('/quizzes/' + q.id, bc, undefined, undefined, 404)
  await api('/quizzes/' + q.id, parents[0], undefined, undefined, 404)
  const [r] = await db.execute(
    'SELECT questions FROM kidi_child_quiz_attempts WHERE id=?',
    [q.id],
  )
  const qs =
    typeof r[0].questions === 'string'
      ? JSON.parse(r[0].questions)
      : r[0].questions
  const qa = qs.map((q) => ({ questionId: q.id, optionIndex: q.correctIndex }))
  assert.equal(
    (await api('/quizzes/' + q.id + '/submit', ac, 'POST', { answers: qa }))
      .score,
    100,
  )
  assert.equal(
    (await api('/quizzes/' + q.id + '/submit', ac, 'POST', { answers: qa }))
      .score,
    100,
  )
  const report = await api('/family/' + a.id + '/report', parents[0])
  assert.equal(report.plans.length, 1)
  const subject = report.subjects.find(
    (s) => s.subjectId === 'mathematics' && s.level === 'b3',
  )
  assert.equal(subject.completedSteps, 3)
  assert.equal(subject.practiceAttempts, 3)
  assert.equal(subject.practiceAverage, 67)
  assert.equal(subject.finalAttempts, 1)
  assert.equal(subject.finalAverage, 100)
  assert.equal(subject.finalPasses, 1)
  assert.equal(
    report.weeklyActivity.reduce((n, r) => n + r.submissions, 0),
    4,
  )
  const rotated = await api('/family/' + a.id + '/code', parents[0], 'POST', {})
  assert.match(rotated.code, /^[A-HJ-NP-Z2-9]{4}$/)
  assert.notEqual(rotated.code, a.code)
  await api('/dashboard', ac, undefined, undefined, 401)
  await api('/child/login', '', 'POST', { code: a.code }, 401)
  ac = await login(rotated.code)
  await api('/family/' + a.id, parents[0], 'PATCH', {
    name: 'Ama QA',
    level: 'b3',
    avatar: 'sun',
    active: false,
  })
  await api('/dashboard', ac, undefined, undefined, 401)
  await api('/child/login', '', 'POST', { code: rotated.code }, 401)
  await api('/family/' + a.id, parents[0], 'PATCH', {
    name: 'Ama QA',
    level: 'b3',
    avatar: 'sun',
    active: true,
  })
  await api('/dashboard', ac, undefined, undefined, 401)
  ac = await login(rotated.code)
  assert.equal((await api('/lessons/' + lesson.id, ac)).completed.length, 3)
  for (let i = 0; i < 10; i++)
    await api(
      '/child/login',
      '',
      'POST',
      { code: 'INVALID-QA-' + users[0] },
      401,
    )
  await api('/child/login', '', 'POST', { code: 'INVALID-QA-' + users[0] }, 429)
  console.log(
    'PASS: ' +
      checks +
      ' family API checks — profiles, unique codes, login boundaries, sibling/parent isolation, grading, reports, reset, pause/resume, rate limits.',
  )
} finally {
  const limitKey = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update('capevars:kidilearn:login-limit:v1')
    .digest('hex')
  const scopes = [
    'ip:family-qa-' + users[0],
    ...[...testedCodes].map((code) => 'code:' + code),
  ]
  if (users.length) {
    // Profile cascades remove plans, attempts, practice and completion records.
    await db.query('DELETE FROM users WHERE id IN (?) AND username LIKE ?', [
      users,
      'kidi_family_qa_%',
    ])
    for (const scope of scopes)
      await db.execute('DELETE FROM kidi_login_limits WHERE bucket_key=?', [
        createHmac('sha256', limitKey).update(scope).digest('hex'),
      ])
  }
  await db.end()
}
