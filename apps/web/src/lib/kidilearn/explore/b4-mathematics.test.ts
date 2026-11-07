import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b4-mathematics'

const all = Object.entries(guides)

// Indicators in the NaCCA Mathematics curriculum, Basic 4, that lessons use.
const CURRICULUM = new Set([
  'B4.1.1.1.1',
  'B4.1.1.1.3',
  'B4.1.1.1.5',
  'B4.1.1.2.1',
  'B4.1.1.3.1',
  'B4.1.1.3.3',
  'B4.1.1.3.5',
  'B4.1.1.4.1',
  'B4.1.2.1.1',
  'B4.1.2.2.1',
  'B4.1.2.3.1',
  'B4.1.2.4.1',
  'B4.1.2.5.1',
  'B4.1.2.6.1',
  'B4.1.3.1.1',
  'B4.1.3.1.3',
  'B4.1.3.2.1',
  'B4.1.4.1.1',
  'B4.1.4.1.3',
  'B4.1.5.1.1',
  'B4.2.1.1.1',
  'B4.2.1.1.3',
  'B4.2.1.2.1',
  'B4.2.1.3.1',
  'B4.2.2.1.1',
  'B4.2.2.2.1',
  'B4.2.2.2.3',
  'B4.2.2.2.5',
  'B4.2.2.2.7',
  'B4.3.1.1.1',
  'B4.3.2.1.1',
  'B4.3.3.1.1',
  'B4.3.3.1.3',
  'B4.3.3.2.1',
  'B4.3.3.2.3',
  'B4.3.3.2.5',
  'B4.3.3.3.1',
  'B4.3.3.3.3',
  'B4.4.1.1.1',
  'B4.4.1.1.3',
  'B4.4.1.2.1',
])

test('covers each Basic 4 Mathematics lesson once, with a real indicator', () => {
  assert.equal(all.length, 41)
  const codes = all.map(([, g]) => g.indicator.code)
  assert.equal(new Set(codes).size, 41)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
})

// Every calculation written must be true, including decimals, fractions and
// chains that mix operations.
test('every calculation written is correct', () => {
  const num = String.raw`−?\d+(?:\.\d+)?`
  const side = String.raw`${num}(?:\s*[+−×÷/]\s*${num})*`
  // Sentences with an unknown (☐ + 7 = 15, n + 4 = 10) are left out.
  const chain = new RegExp(
    String.raw`(?<![\d.]|[+−×÷/]\s*)${side}(?:\s*=\s*${side})+(?!\d|\.\d|\s*[+−×÷/])`,
    'g',
  )
  const value = (text: string) => {
    const expr = text.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    assert.match(expr, /^[\d\s.+\-*/]+$/)
    return Function(`return (${expr})`)() as number
  }
  let checked = 0
  for (const [key, g] of all) {
    const text = JSON.stringify({
      ...g,
      mistakes: g.mistakes.map((m) => m.right),
    }).replace(/(\d),(\d{3})/g, '$1$2')
    for (const [written] of text.matchAll(chain)) {
      const [first, ...rest] = written.split('=').map(value)
      for (const other of rest)
        assert.ok(Math.abs(other - first!) < 1e-9, `${key}: ${written}`)
      checked++
    }
  }
  assert.ok(checked > 80, `checked ${checked} calculations`)
})

test('stays in the Basic 4 scope', () => {
  const text = JSON.stringify(guides)
  for (const [, a, b] of text.matchAll(/(\d+)\s*×\s*(\d+)\s*=/g))
    assert.ok(
      Math.min(Number(a), Number(b)) <= 12 ||
        Number(a) % 10 === 0 ||
        Number(b) % 10 === 0,
      `${a} × ${b}`,
    )
  assert.doesNotMatch(text, /\bXXX[IVX]/)
})
