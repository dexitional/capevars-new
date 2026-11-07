import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b3-mathematics'

const all = Object.entries(guides)

test('covers each Basic 3 Mathematics lesson once, with its own indicator', () => {
  assert.equal(all.length, 39)
  const codes = all.map(([, g]) => g.indicator.code)
  assert.equal(new Set(codes).size, 39)
  for (const code of codes) assert.match(code, /^B3\.\d\.\d\.\d\.\d$/)
})

// Every calculation written out must be true, including chains that mix
// operations, such as 3 × 4 = 4 + 4 + 4 = 12.
test('every calculation written is correct', () => {
  const chain =
    /−?\d+(?:\s*[+−×÷]\s*\d+)*(?:\s*=\s*−?\d+(?:\s*[+−×÷]\s*\d+)*)+/g
  const value = (side: string) => {
    const expr = side.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    assert.match(expr, /^[\d\s+\-*/]+$/)
    return Function(`return (${expr})`)() as number
  }
  let checked = 0
  for (const [key, g] of all) {
    // A “wrong” entry states a mistake on purpose; thousands lose their commas.
    const text = JSON.stringify({
      ...g,
      mistakes: g.mistakes.map((m) => m.right),
    }).replace(/(\d),(\d{3})/g, '$1$2')
    for (const [written] of text.matchAll(chain)) {
      const [first, ...rest] = written.split('=').map(value)
      for (const other of rest) assert.equal(other, first, `${key}: ${written}`)
      checked++
    }
  }
  assert.ok(checked > 50, `checked ${checked} calculations`)
})

test('keeps multiplication within the Basic 3 scope (up to 5 × 5)', () => {
  for (const [key, g] of all)
    for (const [, a, b] of JSON.stringify(g).matchAll(/(\d+)\s*×\s*(\d+)/g))
      assert.ok(Math.min(Number(a), Number(b)) <= 5, `${key}: ${a} × ${b}`)
})
