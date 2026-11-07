import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b2-mathematics'

const all = Object.entries(guides)

test('covers each Basic 2 Mathematics lesson once, with its own indicator', () => {
  assert.equal(all.length, 29)
  const codes = all.map(([, g]) => g.indicator.code)
  assert.equal(new Set(codes).size, 29)
  for (const code of codes) assert.match(code, /^B2\.\d\.\d\.\d\.\d$/)
})

test('every guide explains, shows and gives something to do', () => {
  for (const [key, g] of all) {
    assert.ok(g.hook && g.explain.length >= 2, `${key} explains the idea`)
    assert.ok(g.words.length >= 2, `${key} teaches its words`)
    assert.ok(g.examples.length >= 1, `${key} works an example`)
    assert.ok(g.mistakes.length >= 1, `${key} warns about a mistake`)
    assert.ok(g.realLife.length >= 3, `${key} links to daily life`)
    assert.ok(g.tryIt.steps.length >= 3, `${key} has a task`)
    for (const e of g.examples)
      assert.ok(e.steps.length > 0, `${key}: ${e.title}`)
  }
})

test('stays in the Basic 2 scope: fractions are never written as symbols', () => {
  for (const [key, g] of all)
    if (g.indicator.code.startsWith('B2.1.3'))
      assert.doesNotMatch(JSON.stringify(g), /\d\/\d|½|¼/, key)
})

// Every sum written out in a guide must be true, including chains like
// 7 + 5 = 7 + 3 + 2 = 12.
test('every written calculation is correct', () => {
  const chain = /\d+(?:\s*[+−]\s*\d+)*(?:\s*=\s*\d+(?:\s*[+−]\s*\d+)*)+/g
  const value = (side: string) =>
    [...side.matchAll(/([+−]?)\s*(\d+)/g)].reduce(
      (sum, [, sign, n]) => sum + (sign === '−' ? -Number(n) : Number(n)),
      0,
    )
  let checked = 0
  for (const [key, g] of all) {
    // A "wrong" entry states a mistake on purpose.
    const text = JSON.stringify({
      ...g,
      mistakes: g.mistakes.map((m) => m.right),
    })
    for (const [written] of text.matchAll(chain)) {
      const [first, ...rest] = written.split('=').map(value)
      for (const other of rest) assert.equal(other, first, `${key}: ${written}`)
      checked++
    }
  }
  assert.ok(checked > 30, `checked ${checked} sums`)
})
