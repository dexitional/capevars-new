import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b5-pe'

const all = Object.entries(guides)

// Indicators in the NaCCA Physical Education curriculum, Basic 5.
const CURRICULUM = new Set([
  'B5.1.1.1.1',
  'B5.1.1.1.2',
  'B5.1.2.1.1',
  'B5.1.2.1.2',
  'B5.1.2.1.3',
  'B5.1.2.1.4',
  'B5.1.2.1.5',
  'B5.1.2.1.6',
  'B5.1.2.1.7',
  'B5.1.2.1.8',
  'B5.1.2.1.9',
  'B5.1.2.1.10',
  'B5.1.3.1.1',
  'B5.1.3.1.2',
  'B5.1.3.1.3',
  'B5.2.1.2.1',
  'B5.2.2.2.1',
  'B5.2.3.2.1',
  'B5.2.4.2.1',
  'B5.2.5.2.1',
  'B5.3.1.3.1',
  'B5.3.2.3.1',
  'B5.3.3.3.1',
  'B5.3.4.3.1',
  'B5.3.5.3.1',
  'B5.4.1.4.1',
  'B5.4.1.4.2',
  'B5.4.2.4.1',
  'B5.4.3.4.1',
  'B5.4.3.4.2',
  'B5.5.1.5.1',
  'B5.5.2.5.1',
  'B5.5.3.5.1',
  'B5.5.4.5.1',
])

test('covers each Basic 5 PE lesson once, with a real curriculum indicator', () => {
  assert.equal(all.length, 20)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
  assert.equal(new Set(all.map(([, g]) => g.indicator.code)).size, 20)
})

test('every lesson keeps learners safe before asking them to move', () => {
  for (const [key, g] of all)
    assert.ok(g.safety?.length, `${key} has safety advice`)
})

test('every guide explains, shows and gives something to do', () => {
  for (const [key, g] of all) {
    assert.ok(g.explain.length >= 3, key)
    assert.ok(g.words.length >= 2, key)
    assert.ok(g.examples.length >= 1, key)
    assert.ok(g.mistakes.length >= 1, key)
    assert.ok(g.tryIt.steps.length >= 3, key)
  }
})

test('keeps the facts the curriculum got wrong out of the lessons', () => {
  const text = JSON.stringify(guides)
  assert.doesNotMatch(text, /75%|75 per ?cent/i)
})

test('every written calculation is correct', () => {
  for (const [key, g] of all) {
    const text = JSON.stringify(g)
    for (const [written, a, sign, b, total] of text.matchAll(
      /(\d+)\s*([+−×])\s*(\d+)\s*=\s*(\d+)/g,
    )) {
      const x = Number(a)
      const y = Number(b)
      const value = sign === '+' ? x + y : sign === '−' ? x - y : x * y
      assert.equal(value, Number(total), `${key}: ${written}`)
    }
  }
})
