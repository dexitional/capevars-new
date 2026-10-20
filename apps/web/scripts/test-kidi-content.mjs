import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { createHmac } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { readFile, access } from 'node:fs/promises'
const root = fileURLToPath(new URL('../../../', import.meta.url)).replace(
  /\/$/,
  '',
)
const require = createRequire(root + '/package.json')
assert.ok(
  process.env.DATABASE_URL && process.env.ADMIN_SESSION_SECRET,
  'Configure the running application database and session secret.',
)
const db = await require('mysql2/promise').createConnection(
  process.env.DATABASE_URL,
)
const username = 'kidi_content_qa_' + Date.now()
const [user] = await db.execute(
  'INSERT INTO users(full_name,username,email) VALUES(?,?,?)',
  ['Content QA', username, username + '@example.test'],
)
const { sign } = require('hono/jwt')
const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
  .update('capevars:member-session:v1')
  .digest('hex')
const f = {
  id: user.insertId,
  token: await sign(
    {
      sub: user.insertId,
      aud: 'member',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    key,
    'HS256',
  ),
}
let checks = 0
let cookie = `cv_session=${f.token}`
let childCode
const api = async (path, method = 'GET', body, status = 200) => {
  const r = await fetch('http://localhost:3000/api/learn/kidilearn' + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      cookie,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const d = await r.json()
  assert.equal(r.status, status, `${path}: ${JSON.stringify(d)}`)
  checks++
  return d
}
try {
  const sources = JSON.parse(
    await readFile(root + '/docs/kidilearn-new-content.json', 'utf8'),
  )
  assert.equal(sources.length, 16)
  assert.equal(
    sources.reduce((n, c) => n + c.lessons.length, 0),
    348,
  )
  const labs = {}
  const assets = new Set()
  let lessons = 0
  for (const c of sources) {
    const lib = await api(`/library/${c.level}/${c.subject}`)
    assert.equal(lib.lessons.length, c.lessons.length)
    for (const summary of lib.lessons) {
      const l = await api('/lessons/' + summary.id)
      lessons++
      assert.equal(l.play.length, 5)
      assert.equal(l.challenge.length, 10)
      assert.ok(!JSON.stringify(l).includes('correctIndex'))
      const guide = l.content.visualGuide
      assert.equal(guide.panels.length, 4)
      assert.ok(guide.concepts.length > 0)
      assert.ok(guide.steps.length >= 3)
      assert.equal(l.content.level, c.level)
      for (const url of [
        l.content.video,
        l.content.illustration,
        l.content.originalIllustration,
        l.content.pdf,
        l.content.epub,
        ...guide.panels.map((p) => p.image),
      ]) {
        await access(root + '/apps/web/public' + url)
        assets.add(url)
      }
      labs[guide.experiment] ??= {
        id: l.id,
        level: c.level,
        subject: c.subject,
        title: l.title,
      }
      if (/gesture/i.test(l.title))
        labs.performance = {
          id: l.id,
          level: c.level,
          subject: c.subject,
          title: l.title,
        }
    }
    const first = await api('/lessons/' + lib.lessons[0].id)
    for (const url of [
      first.content.video,
      first.content.illustration,
      first.content.pdf,
      first.content.epub,
    ])
      assert.equal(
        (await fetch('http://localhost:3000' + url, { method: 'HEAD' })).status,
        200,
      )
    await api('/plan', 'PUT', {
      level: c.level,
      days: ['mon', 'wed'],
      minutesPerSession: 20,
      subjects: [
        {
          subjectId: c.subject,
          quizEnabled: true,
          questionCount: 10,
          passMark: 70,
        },
      ],
    })
    const quiz = await api(
      '/quizzes',
      'POST',
      { level: c.level, subjectId: c.subject },
      201,
    )
    const [rows] = await db.execute(
      'SELECT questions FROM kidi_quiz_attempts WHERE id=?',
      [quiz.id],
    )
    const questions =
      typeof rows[0].questions === 'string'
        ? JSON.parse(rows[0].questions)
        : rows[0].questions
    assert.equal(questions.length, 10)
    const result = await api('/quizzes/' + quiz.id + '/submit', 'POST', {
      answers: questions.map((q) => ({
        questionId: q.id,
        optionIndex: q.correctIndex,
      })),
    })
    assert.equal(result.score, 100)
    await api('/lessons/' + first.id + '/explore', 'POST')
    const [answers] = await db.query(
      'SELECT id AS questionId,correct_index AS optionIndex FROM quiz_questions WHERE id IN (?)',
      [first.play.map((q) => q.id)],
    )
    const practice = await api('/lessons/' + first.id + '/submit', 'POST', {
      phase: 'play',
      answers,
    })
    assert.equal(practice.score, 100)
    console.log(
      `PASS: ${c.level} ${c.subject}: ${lib.lessons.length} lessons, plan, final quiz and lesson progress.`,
    )
  }

  const child = await api(
    '/family',
    'POST',
    { name: 'New courses learner', level: 'b3', avatar: 'sun' },
    201,
  )
  childCode = child.code
  const login = await fetch(
    'http://localhost:3000/api/learn/kidilearn/child/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': `content-qa-${f.id}`,
      },
      body: JSON.stringify({ code: child.code }),
    },
  )
  assert.equal(login.status, 200)
  cookie = login.headers
    .getSetCookie()
    .find((c) => c.startsWith('cv_kidi_child='))
    .split(';')[0]
  const newSubjects = ['computing', 'creative', 'world']
  await api('/plan', 'PUT', {
    level: 'b3',
    days: ['mon', 'wed'],
    minutesPerSession: 20,
    subjects: newSubjects.map((subjectId) => ({
      subjectId,
      quizEnabled: true,
      questionCount: 5,
      passMark: 70,
    })),
  })
  for (const subject of newSubjects) {
    const library = await api(`/library/b3/${subject}`)
    const lesson = await api('/lessons/' + library.lessons[0].id)
    assert.equal(lesson.completed.length, 0)
    await api('/lessons/' + lesson.id + '/explore', 'POST')
    for (const phase of ['play', 'challenge']) {
      const [answers] = await db.query(
        'SELECT id AS questionId,correct_index AS optionIndex FROM quiz_questions WHERE id IN (?)',
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
    const questions =
      typeof rows[0].questions === 'string'
        ? JSON.parse(rows[0].questions)
        : rows[0].questions
    assert.equal(
      (
        await api('/quizzes/' + quiz.id + '/submit', 'POST', {
          answers: questions.map((q) => ({
            questionId: q.id,
            optionIndex: q.correctIndex,
          })),
        })
      ).score,
      100,
    )
  }
  cookie = `cv_session=${f.token}`
  const report = await api('/family/' + child.id + '/report')
  for (const id of newSubjects) {
    const subject = report.subjects.find(
      (s) => s.subjectId === id && s.level === 'b3',
    )
    assert.equal(subject.completedSteps, 3)
    assert.equal(subject.practiceAttempts, 2)
    assert.equal(subject.practiceAverage, 100)
    assert.equal(subject.finalPasses, 1)
    assert.equal(subject.finalAverage, 100)
  }
  console.log(
    'PASS: new subjects work in child mode and appear in parent reports with separate practice and final scores.',
  )
  console.log(
    `PASS: ${checks} API checks; ${lessons} lessons; ${assets.size} distinct assets; ${Object.keys(labs).length} interactive variants.`,
  )
} finally {
  const limitKey = createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
    .update('capevars:kidilearn:login-limit:v1')
    .digest('hex')
  for (const scope of [
    `ip:content-qa-${f.id}`,
    ...(childCode ? [`code:${childCode}`] : []),
  ]) {
    await db.execute('DELETE FROM kidi_login_limits WHERE bucket_key=?', [
      createHmac('sha256', limitKey).update(scope).digest('hex'),
    ])
  }
  const [courses] = await db.execute(
    'SELECT course_id FROM enrollments WHERE user_id=?',
    [f.id],
  )
  await db.execute('DELETE FROM users WHERE id=? AND username=?', [
    f.id,
    username,
  ])
  for (const c of courses)
    await db.execute(
      "UPDATE courses SET enrollment_count=(SELECT COUNT(*) FROM enrollments WHERE course_id=? AND status IN ('active','completed')) WHERE id=?",
      [c.course_id, c.course_id],
    )
  await db.end()
}
