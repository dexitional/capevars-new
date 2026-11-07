import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b6-mathematics'

const all = Object.entries(guides)

// Indicators in the NaCCA curriculum, Basic 6, with misprinted codes given as
// the sequence requires (see b6-mathematics.ts).
const CURRICULUM = new Set([
  'B6.1.1.1.1',
  'B6.1.1.1.2',
  'B6.1.1.1.3',
  'B6.1.1.1.4',
  'B6.1.1.1.5',
  'B6.1.1.1.6',
  'B6.1.1.2.1',
  'B6.1.1.2.2',
  'B6.1.1.3.1',
  'B6.1.2.1.1',
  'B6.1.2.1.2',
  'B6.1.2.2.1',
  'B6.1.2.3.1',
  'B6.1.2.4.1',
  'B6.1.2.5.1',
  'B6.1.2.6.1',
  'B6.1.2.6.2',
  'B6.1.2.6.3',
  'B6.1.3.1.1',
  'B6.1.3.1.2',
  'B6.1.3.1.3',
  'B6.1.4.1.1',
  'B6.1.4.1.2',
  'B6.1.4.2.1',
  'B6.1.4.2.3',
  'B6.2.1.1.4',
  'B6.2.1.1.7',
  'B6.2.1.1.8',
  'B6.2.2.1.1',
  'B6.2.3.1.2',
  'B6.2.3.1.3',
  'B6.3.1.1.1',
  'B6.3.1.1.2',
  'B6.3.3.5.1',
  'B6.3.3.6.1',
  'B6.3.3.6.2',
  'B6.4.1.1.1',
  'B6.4.1.1.2',
  'B6.4.1.1.3',
  'B6.4.1.2.1',
  'B6.4.1.2.2',
  'B6.4.1.2.3',
  'B6.4.2.2.1',
  'B6.4.2.2.2',
  'B6.4.2.2.3',
])

test('covers each Basic 6 Mathematics lesson once, with a real indicator', () => {
  assert.equal(all.length, 48)
  // HCF and LCM share one indicator, as do the three expression lessons.
  const codes = all.map(([, g]) => g.indicator.code)
  assert.equal(new Set(codes).size, 45)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
})

// Every calculation written must be true, including decimals, fractions,
// percents, negative numbers and mixed numbers such as “2 and 1/3”.
test('every calculation written is correct', () => {
  const num = String.raw`−?\d+(?:\.\d+)?`
  const side = String.raw`${num}(?:\s*[+−×÷/]\s*${num})*`
  // Sentences with an unknown (☐ + 5 = −11, p + 9 = 24) are left out.
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
    })
      .replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
      .replace(/(?<![\d/])(\d+) and (\d+)\/(\d+)/g, (_, w, n, d) =>
        String(Number(w) + Number(n) / Number(d)),
      )
      .replace(/(\d+(?:\.\d+)?)%/g, (_, n) => String(Number(n) / 100))
      .replace(/(\d+) : (\d+)/g, '$1/$2')
    for (const [written] of text.matchAll(chain)) {
      const [first, ...rest] = written.split('=').map(value)
      for (const other of rest)
        assert.ok(Math.abs(other - first!) < 1e-9, `${key}: ${written}`)
      checked++
    }
  }
  assert.ok(checked > 120, `checked ${checked} calculations`)
})

test('stays in the Basic 6 scope', () => {
  // Mistakes are left out, since they show wrong answers on purpose.
  const text = JSON.stringify(
    all.map(([, g]) => ({ ...g, mistakes: g.mistakes.map((m) => m.right) })),
  ).replace(/(\d),(\d{3})(?!\d)/g, '$1$2')
  for (const [n] of text.matchAll(/\d+/g))
    assert.ok(Number(n) <= 1_000_000_000, n)
  // Division is by one-digit numbers, apart from known facts to 144 and
  // dividing by multiples of ten.
  for (const [, a, b] of text.matchAll(/(\d+) ÷ (\d+)/g))
    assert.ok(
      Number(b) <= 12 || Number(b) % 10 === 0 || Number(a) / Number(b) <= 12,
      `${a} ÷ ${b}`,
    )
})

test('sentences stay short enough for eleven-year-olds', () => {
  for (const [key, g] of all)
    for (const line of [g.hook, ...g.explain])
      for (const sentence of line.split(/(?<=[.!?])\s+/))
        assert.ok(sentence.split(/\s+/).length <= 32, `${key}: ${sentence}`)
})
