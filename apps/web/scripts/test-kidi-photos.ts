import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise'
import { sign } from 'hono/jwt'
import sharp from 'sharp'

// Run against the local development app and its configured database.
process.chdir(fileURLToPath(new URL('../', import.meta.url)))
const origin = process.env.KIDI_TEST_ORIGIN || 'http://localhost:3000'
const db = await mysql.createConnection(process.env.DATABASE_URL!)
const users: number[] = [],
  files: { key: string; url: string }[] = [],
  codes: string[] = []
const parents: string[] = []
let checks = 0
let adminId: number | undefined
let adminCookie = ''
const removeFile = async (file: { key: string; url: string }) => {
  const [rows] = await db.execute<RowDataPacket[]>(
    'SELECT id FROM media_assets WHERE file_key=?',
    [file.key],
  )
  let id = rows[0]?.id
  if (!id) {
    const [r] = await db.execute<ResultSetHeader>(
      'INSERT INTO media_assets(file_key,url,filename,mime_type,size_bytes) VALUES (?,?,?,?,?)',
      [file.key, file.url, 'kidi-photo-qa.png', 'image/png', 1],
    )
    id = r.insertId
  }
  const res = await fetch(origin + '/api/admin/media/' + id, {
    method: 'DELETE',
    headers: { cookie: adminCookie },
  })
  assert.equal(res.status, 204, 'remove test upload')
}
const call = async (
  path: string,
  cookie: string,
  method = 'GET',
  body?: unknown,
  expected = 200,
) => {
  const res = await fetch(origin + '/api' + path, {
    method,
    headers: {
      cookie,
      'Content-Type': 'application/json',
      'x-real-ip': 'photo-qa-' + users[0],
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await res.json()
  assert.equal(res.status, expected, path + ': ' + JSON.stringify(data))
  checks++
  return { data, res }
}
const api = async (
  path: string,
  cookie: string,
  method = 'GET',
  body?: unknown,
  expected = 200,
) =>
  (await call('/learn/kidilearn' + path, cookie, method, body, expected)).data
const upload = async (cookie: string, color: string, folder = 'avatars') => {
  const png = await sharp({
    create: { width: 64, height: 64, channels: 3, background: color },
  })
    .png()
    .toBuffer()
  const input = {
    filename: 'kidi-photo-qa.png',
    contentType: 'image/png',
    size: png.length,
    folder,
  }
  const grant = (await call('/me/uploads/presign', cookie, 'POST', input)).data
  files.push({ key: grant.key, url: grant.publicUrl })
  const put = await fetch(new URL(grant.uploadUrl, origin), {
    method: 'PUT',
    headers: { 'Content-Type': 'image/png' },
    body: new Uint8Array(png),
  })
  assert.ok(put.ok, 'photo upload completed')
  const registered = (
    await call(
      '/me/uploads',
      cookie,
      'POST',
      { ...input, key: grant.key, width: 64, height: 64 },
      201,
    )
  ).data.asset
  assert.equal((await fetch(new URL(registered.url, origin))).status, 200)
  return registered.url as string
}
try {
  const [admin] = await db.execute<ResultSetHeader>(
    'INSERT INTO admins(full_name,email,role,password_hash) VALUES (?,?,?,?)',
    [
      'Photo upload QA',
      'kidi_photo_qa_' + Date.now() + '@example.test',
      'editor',
      'test-account-no-password-login',
    ],
  )
  adminId = admin.insertId
  adminCookie =
    'cv_admin_session=' +
    (await sign(
      {
        sub: adminId,
        role: 'editor',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      process.env.ADMIN_SESSION_SECRET!,
      'HS256',
    ))
  for (let i = 0; i < 2; i++) {
    const username = 'kidi_photo_qa_' + Date.now() + '_' + i
    const [r] = await db.execute<ResultSetHeader>(
      'INSERT INTO users(full_name,username,email) VALUES (?,?,?)',
      ['Photo QA', username, username + '@example.test'],
    )
    users.push(r.insertId)
    const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
      .update('capevars:member-session:v1')
      .digest('hex')
    parents.push(
      'cv_session=' +
        (await sign(
          {
            sub: r.insertId,
            aud: 'member',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
          },
          key,
          'HS256',
        )),
    )
  }
  const first = await upload(parents[0]!, '#fbbf24'),
    replacement = await upload(parents[0]!, '#041d40'),
    foreign = await upload(parents[1]!, '#008080'),
    wrongFolder = await upload(parents[0]!, '#ff0000', 'posts')
  const input = {
    name: 'Photo learner QA',
    level: 'b3',
    avatar: 'sun',
    photoUrl: first,
  }
  const child = await api('/family', parents[0]!, 'POST', input, 201)
  codes.push(child.code)
  const profile = async () =>
    (await api('/family', parents[0]!)).children.find(
      (c: { id: number }) => c.id === child.id,
    )
  assert.equal((await profile()).photoUrl, first)
  assert.equal(
    (await api('/family/' + child.id + '/report', parents[0]!)).child.photoUrl,
    first,
  )
  await api(
    '/family',
    parents[0]!,
    'POST',
    { ...input, photoUrl: foreign },
    422,
  )
  assert.equal(
    (await api('/family', parents[0]!)).children.length,
    1,
    'failed photo creation rolls back child profile',
  )
  await api(
    '/family/' + child.id,
    parents[1]!,
    'PATCH',
    { ...input, active: true },
    404,
  )
  for (const bad of [
    foreign,
    wrongFolder,
    'https://example.test/not-owned.png',
  ]) {
    await api(
      '/family/' + child.id,
      parents[0]!,
      'PATCH',
      { ...input, name: 'Should roll back', active: true, photoUrl: bad },
      422,
    )
    assert.equal((await profile()).name, input.name)
    assert.equal((await profile()).photoUrl, first)
  }
  const login = await call('/learn/kidilearn/child/login', '', 'POST', {
    code: child.code,
  })
  const cookie = login.res.headers
    .getSetCookie()
    .find((s: string) => s.startsWith('cv_kidi_child='))!
    .split(';')[0]!
  assert.equal((await api('/session', cookie)).photoUrl, first)
  await api(
    '/family/' + child.id,
    cookie,
    'PATCH',
    { ...input, active: true, photoUrl: replacement },
    403,
  )
  await call(
    '/me/uploads/presign',
    cookie,
    'POST',
    {
      filename: 'photo.png',
      contentType: 'image/png',
      size: 100,
      folder: 'avatars',
    },
    401,
  )
  await api('/family/' + child.id, parents[0]!, 'PATCH', {
    ...input,
    active: true,
    photoUrl: replacement,
  })
  assert.equal((await api('/session', cookie)).photoUrl, replacement)
  await api('/family/' + child.id, parents[0]!, 'PATCH', {
    name: input.name,
    level: 'b3',
    avatar: 'sun',
    active: true,
  })
  assert.equal(
    (await profile()).photoUrl,
    replacement,
    'omitted photo preserves existing upload',
  )
  await api('/family/' + child.id, parents[0]!, 'PATCH', {
    ...input,
    active: true,
    photoUrl: null,
  })
  assert.equal((await profile()).photoUrl, null)
  assert.equal((await api('/session', cookie)).photoUrl, null)
  await api('/family/' + child.id, parents[0]!, 'PATCH', {
    ...input,
    active: true,
  })
  await removeFile(files.find((file) => file.url === first)!)
  assert.equal(
    (await profile()).photoUrl,
    null,
    'deleted media restores avatar fallback',
  )
  console.log(
    'PASS: ' +
      checks +
      ' photo API checks: real uploads, ownership, transaction rollback, create/replace/remove, report/session display, child restrictions and deletion fallback.',
  )
} finally {
  if (users.length) {
    const limitKey = createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
      .update('capevars:kidilearn:login-limit:v1')
      .digest('hex')
    for (const scope of [
      'ip:photo-qa-' + users[0],
      ...codes.map((code) => 'code:' + code),
    ])
      await db.execute('DELETE FROM kidi_login_limits WHERE bucket_key=?', [
        createHmac('sha256', limitKey).update(scope).digest('hex'),
      ])
    await db.query('DELETE FROM users WHERE id IN (?) AND username LIKE ?', [
      users,
      'kidi_photo_qa_%',
    ])
    for (const file of files) {
      await removeFile(file)
    }
  }
  if (adminId) {
    await db.execute('DELETE FROM activity_log WHERE admin_id=?', [adminId])
    await db.execute('DELETE FROM admins WHERE id=?', [adminId])
  }
  await db.end()
}
