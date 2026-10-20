import assert from 'node:assert/strict'
import { test } from 'node:test'
import { generateCode, saveWithUniqueCode } from './access-code'

test('codes contain four unambiguous letters or digits', () => {
  for (let i = 0; i < 100; i++)
    assert.match(generateCode(), /^[A-HJ-NP-Z2-9]{4}$/)
})

test('a database collision retries before returning the saved code', async () => {
  let calls = 0
  let saved = ''
  const result = await saveWithUniqueCode(async (code) => {
    if (++calls === 1)
      throw Object.assign(new Error('Duplicate code'), { code: 'ER_DUP_ENTRY' })
    saved = code
    return 42
  })
  assert.equal(calls, 2)
  assert.deepEqual(result, { code: saved, result: 42 })
})

test('a reset cannot reuse the current code', async () => {
  let calls = 0
  await saveWithUniqueCode(async () => (++calls === 1 ? null : true))
  assert.equal(calls, 2)
})

test('unavailable codes have a bounded retry limit', async () => {
  let calls = 0
  await assert.rejects(
    saveWithUniqueCode(async () => {
      calls++
      return null
    }),
    { status: 409 },
  )
  assert.equal(calls, 32)
})

test('unrelated database failures are not retried or hidden', async () => {
  const error = Object.assign(new Error('Connection lost'), {
    code: 'ECONNRESET',
  })
  let calls = 0
  await assert.rejects(
    saveWithUniqueCode(async () => {
      calls++
      throw error
    }),
    (caught) => caught === error,
  )
  assert.equal(calls, 1)
})
