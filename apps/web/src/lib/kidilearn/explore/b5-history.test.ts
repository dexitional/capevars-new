import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b5-history'

const all = Object.entries(guides)

// Indicators the NaCCA History curriculum gives for Basic 5.
const CURRICULUM = new Set([
  'B5.2.1.1.1',
  'B5.2.1.1.2',
  'B5.2.5.1.1',
  'B5.3.2.1.1',
  'B5.4.2.1.1',
  'B5.4.2.1.2',
  'B5.4.3.2.1',
  'B5.5.1.1.1',
  'B5.5.1.1.2',
  'B5.5.1.1.3',
  'B5.5.1.1.4',
  'B5.5.3.1.1',
])

test('covers each Basic 5 History lesson with a curriculum indicator', () => {
  assert.equal(all.length, 20)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
})

test('a repeated indicator never repeats the same lesson', () => {
  for (let i = 1; i <= 8; i++) {
    const first = guides[`history-${String(i).padStart(2, '0')}`]!
    const again = guides[`history-${String(i + 12).padStart(2, '0')}`]!
    assert.equal(first.indicator.code, again.indicator.code, `pair ${i}`)
    assert.notEqual(first.hook, again.hook)
    assert.notDeepEqual(
      first.words.map((w) => w.term),
      again.words.map((w) => w.term),
    )
  }
})

test('every guide explains, shows and gives something to do', () => {
  for (const [key, g] of all) {
    assert.ok(g.explain.length >= 3, key)
    assert.ok(g.words.length >= 3, key)
    assert.ok(g.examples.length >= 1, key)
    assert.ok(g.tryIt.steps.length >= 3, key)
  }
})

// The slave trade is taught as the history of people, not of “slaves”.
test('speaks of enslaved people, never of “slaves” as people', () => {
  for (const key of ['history-04', 'history-16']) {
    const text = JSON.stringify(guides[key]).replace(
      /slave trade|“slaves”/gi,
      '',
    )
    assert.doesNotMatch(text, /\bslaves?\b/i, key)
  }
})

test('keeps key dates consistent across lessons', () => {
  const text = JSON.stringify(guides)
  assert.match(text, /Achimota[^"]*1927|1927[^"]*Achimota/)
  assert.match(text, /Korle Bu[^"]*1923|1923[^"]*Korle Bu/)
  assert.doesNotMatch(
    text,
    /Achimota[^.]*192[0-68-9]\b|Korle Bu opened in 19(?!23)/,
  )
})
