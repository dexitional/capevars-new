import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b1-mathematics'

const all = Object.entries(guides)

test('covers each Basic 1 Mathematics lesson once, with its own indicator', () => {
  assert.equal(all.length, 24)
  const codes = all.map(([, g]) => g.indicator.code)
  assert.equal(new Set(codes).size, 24)
  for (const code of codes) assert.match(code, /^B1\.\d\.\d\.\d\.\d$/)
})

test('stays in the Basic 1 scope: halves in words, sums within 20', () => {
  for (const [key, g] of all) {
    if (g.indicator.code.startsWith('B1.1.3'))
      assert.doesNotMatch(JSON.stringify(g), /\d\/\d|½/, key)
    if (g.indicator.code.startsWith('B1.1.2'))
      for (const [, a, , b, total] of JSON.stringify(g).matchAll(
        /(\d+)\s*([+−])\s*(\d+)\s*=\s*(\d+)/g,
      ))
        assert.ok(
          Math.max(Number(a), Number(b), Number(total)) <= 20,
          `${key}: sums within 20`,
        )
  }
})

// Every sum written out must be true, including chains like 8 + 2 + 1 = 11.
test('every written calculation is correct', () => {
  const chain = /\d+(?:\s*[+−]\s*\d+)*(?:\s*=\s*\d+(?:\s*[+−]\s*\d+)*)+/g
  const value = (side: string) =>
    [...side.matchAll(/([+−]?)\s*(\d+)/g)].reduce(
      (sum, [, sign, n]) => sum + (sign === '−' ? -Number(n) : Number(n)),
      0,
    )
  let checked = 0
  for (const [key, g] of all) {
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
  assert.ok(checked > 20, `checked ${checked} sums`)
})

test('keeps explanations in very short sentences', () => {
  for (const [key, g] of all)
    for (const sentence of g.explain.join(' ').split(/(?<=[.!?])\s+/))
      assert.ok(sentence.split(/\s+/).length <= 22, `${key}: ${sentence}`)
})
