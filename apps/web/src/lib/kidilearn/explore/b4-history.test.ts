import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b4-history'

const all = Object.entries(guides)

// Indicators the NaCCA History curriculum gives for Basic 4, plus the 1948
// riots indicator that the course imported from the Basic 5 section.
const CURRICULUM = new Set([
  'B4.1.1.1.1',
  'B4.1.1.2.1',
  'B4.2.1.1.1',
  'B4.2.1.1.2',
  'B4.1.4.1.1',
  'B4.2.5.1.1',
  'B4.3.3.1.1',
  'B4.4.1.1.1',
  'B4.4.1.2.1',
  'B4.6.1.1.1',
  'B5.5.3.1.2',
])

test('covers each Basic 4 History lesson with a curriculum indicator', () => {
  assert.equal(all.length, 20)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
})

// Lessons 12 to 20 share indicators with 1 to 9, so they must teach something new.
test('a repeated indicator never repeats the same lesson', () => {
  for (let i = 1; i <= 9; i++) {
    const first = guides[`history-${String(i).padStart(2, '0')}`]!
    const again = guides[`history-${String(i + 11).padStart(2, '0')}`]!
    assert.equal(first.indicator.code, again.indicator.code, `pair ${i}`)
    assert.notEqual(first.hook, again.hook)
    assert.notDeepEqual(first.explain, again.explain)
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
    assert.ok(g.mistakes.length >= 1, key)
    assert.ok(g.tryIt.steps.length >= 3, key)
  }
})

// Dates that appear in more than one lesson must agree everywhere.
test('keeps key dates consistent across lessons', () => {
  const text = JSON.stringify(guides)
  for (const [event, year] of [
    ['Feyiase', '1701'],
    ['Republic', '1960'],
    ['Bond of 1844', '1844'],
  ] as const)
    assert.ok(text.includes(event) && text.includes(year), event)
  assert.doesNotMatch(text, /6 March 1958|1 July 1957|Feyiase in 17(?!01)/)
})
