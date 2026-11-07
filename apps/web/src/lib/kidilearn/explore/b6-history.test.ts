import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b6-history'

const all = Object.entries(guides)

// Indicators the NaCCA History curriculum gives for Basic 6.
const CURRICULUM = new Set([
  'B6.3.4.1.1',
  'B6.4.4.1.1',
  'B6.5.2.1.1',
  'B6.5.4.1.1',
  'B6.5.4.1.2',
  'B6.6.1.1.1',
  'B6.6.1.1.2',
  'B6.6.2.1.1',
  'B6.6.2.2.2',
])

test('covers each Basic 6 History lesson with a curriculum indicator', () => {
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

// The governing parties of the Fourth Republic, in order, with their years.
test('lists Fourth Republic governments in the right order', () => {
  const text = guides['history-07']!.explain.join(' ')
  const order = [
    'NDC governed from 1993',
    'NPP governed from 2001',
    'NDC governed from 2009',
    'NPP governed from 2017',
    'NDC returned in January 2025',
  ]
  let at = -1
  for (const step of order) {
    const next = text.indexOf(step)
    assert.ok(next > at, step)
    at = next
  }
})

test('names the four coups and their regimes consistently', () => {
  const text = JSON.stringify(guides)
  for (const regime of [
    'National Liberation Council',
    'National Redemption Council',
    'Armed Forces Revolutionary Council',
    'Provisional National Defence Council',
  ])
    assert.ok(text.includes(regime), regime)
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
