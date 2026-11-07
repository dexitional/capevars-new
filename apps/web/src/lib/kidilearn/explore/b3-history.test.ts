import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b3-history'

const all = Object.entries(guides)

// Indicators the NaCCA History curriculum gives for Basic 3.
const CURRICULUM = new Set([
  'B3.2.1.1.1',
  'B3.2.2.1.1',
  'B3.2.2.1.2',
  'B3.2.2.1.3',
  'B3.2.4.1.1',
  'B3.2.5.1.1',
  'B3.3.1.1.1',
])

test('covers each Basic 3 History lesson with a curriculum indicator', () => {
  assert.equal(all.length, 20)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
})

test('lessons sharing an indicator each teach something different', () => {
  const byCode = new Map<string, Array<string>>()
  for (const [, g] of all)
    byCode.set(g.indicator.code, [
      ...(byCode.get(g.indicator.code) ?? []),
      g.hook,
    ])
  for (const [code, hooks] of byCode)
    assert.equal(new Set(hooks).size, hooks.length, code)
})

// Eight-year-olds read these, so sentences stay short.
test('keeps explanations in short sentences', () => {
  for (const [key, g] of all)
    for (const sentence of g.explain.join(' ').split(/(?<=[.!?])\s+/))
      assert.ok(sentence.split(/\s+/).length <= 32, `${key}: ${sentence}`)
})

// Origins are traditions, so they must be told as traditions.
test('tells origins as traditions, not settled fact', () => {
  for (const key of ['history-01', 'history-08'])
    assert.match(
      guides[key]!.explain.join(' '),
      /traditions? (say|tell)|story says|said to/,
    )
})

test('every written calculation is correct', () => {
  for (const [key, g] of all)
    for (const [written, a, sign, b, total] of JSON.stringify(g).matchAll(
      /(\d+)\s*([+−])\s*(\d+)\s*=\s*(\d+)/g,
    )) {
      const value = sign === '+' ? Number(a) + Number(b) : Number(a) - Number(b)
      assert.equal(value, Number(total), `${key}: ${written}`)
    }
})
