import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b4-pe'

const all = Object.entries(guides)

// Indicators in the NaCCA Physical Education curriculum, Basic 4.
// Misprinted codes are given as the sequence requires (see b4-pe.ts).
const CURRICULUM = new Set([
  'B4.1.1.1.1',
  'B4.1.1.1.2',
  'B4.1.2.1.1',
  'B4.1.2.1.2',
  'B4.1.2.1.3',
  'B4.1.2.1.4',
  'B4.1.2.1.5',
  'B4.1.2.1.6',
  'B4.1.2.1.7',
  'B4.1.2.1.8',
  'B4.1.2.1.9',
  'B4.1.2.1.10',
  'B4.1.2.1.11',
  'B4.1.3.1.1',
  'B4.2.1.2.1',
  'B4.2.2.2.1',
  'B4.2.3.2.1',
  'B4.2.4.2.1',
  'B4.2.5.2.1',
  'B4.3.1.3.1',
  'B4.3.2.3.1',
  'B4.3.3.3.1',
  'B4.3.4.3.1',
  'B4.3.5.3.2',
  'B4.4.1.4.1',
  'B4.4.1.4.2',
  'B4.4.2.4.1',
  'B4.4.3.4.1',
  'B4.4.4.4.1',
  'B4.4.5.4.1',
  'B4.5.1.5.1',
  'B4.5.2.5.2',
  'B4.5.3.5.1',
  'B4.5.4.5.1',
])

test('covers each Basic 4 PE lesson once, with a real curriculum indicator', () => {
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

test('keeps the curriculum’s errors and labels out of the lessons', () => {
  // Mistakes are left out: they state wrong ideas on purpose.
  const text = JSON.stringify(
    all.map(([, g]) => ({ ...g, mistakes: g.mistakes.map((m) => m.right) })),
  )
  assert.doesNotMatch(text, /75%|75 per ?cent/i)
  assert.doesNotMatch(text, /madness/i)
  // Push-ups work the triceps, not the biceps as the curriculum says.
  assert.doesNotMatch(
    text,
    /push-ups? (mainly )?(strengthens?|works?) the biceps/i,
  )
})

// Chains such as 20 + 15 + 30 = 65 are checked whole.
test('every written calculation is correct', () => {
  const num = String.raw`\d+`
  const side = String.raw`${num}(?:\s*[+−×]\s*${num})*`
  const chain = new RegExp(
    String.raw`(?<![\d.]|[+−×÷/]\s*)${side}(?:\s*=\s*${side})+(?!\d|\.\d|\s*[+−×÷/])`,
    'g',
  )
  const value = (text: string) =>
    Function(
      `return (${text.replace(/×/g, '*').replace(/−/g, '-')})`,
    )() as number
  for (const [key, g] of all)
    for (const [written] of JSON.stringify(g).matchAll(chain)) {
      const [first, ...rest] = written.split('=').map(value)
      for (const other of rest) assert.equal(other, first, `${key}: ${written}`)
    }
})
