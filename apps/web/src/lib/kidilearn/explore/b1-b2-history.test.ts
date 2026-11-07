import assert from 'node:assert/strict'
import test from 'node:test'
import { guides as basic1 } from './b1-history'
import { guides as basic2 } from './b2-history'

// Indicators the NaCCA History curriculum gives for Basic 1 and Basic 2.
const CURRICULUM = {
  b1: new Set([
    'B1.1.1.1.1',
    'B1.1.1.1.2',
    'B1.1.4.2.1',
    'B1.2.3.1.1',
    'B1.2.3.1.2',
    'B1.2.5.1.1',
    'B1.3.1.1.1',
    'B1.6.1.1.1',
  ]),
  b2: new Set(['B2.2.1.1.1', 'B2.2.4.1.1', 'B2.2.5.1.1', 'B2.3.2.1.1']),
}

for (const [level, guides] of [
  ['b1', basic1],
  ['b2', basic2],
] as const) {
  const all = Object.entries(guides)

  test(`${level}: covers each lesson with a curriculum indicator`, () => {
    assert.equal(all.length, 20)
    for (const [key, g] of all)
      assert.ok(
        CURRICULUM[level].has(g.indicator.code),
        `${key}: ${g.indicator.code}`,
      )
  })

  test(`${level}: lessons sharing an indicator each teach something different`, () => {
    const byCode = new Map<string, Array<string>>()
    for (const [, g] of all)
      byCode.set(g.indicator.code, [
        ...(byCode.get(g.indicator.code) ?? []),
        g.hook,
      ])
    for (const [code, hooks] of byCode)
      assert.equal(new Set(hooks).size, hooks.length, code)
  })

  // Six- and seven-year-olds read these, so sentences stay very short.
  test(`${level}: keeps explanations in very short sentences`, () => {
    for (const [key, g] of all)
      for (const sentence of g.explain.join(' ').split(/(?<=[.!?])\s+/))
        assert.ok(sentence.split(/\s+/).length <= 22, `${key}: ${sentence}`)
  })

  test(`${level}: every written calculation is correct`, () => {
    for (const [key, g] of all)
      for (const [written, a, sign, b, total] of JSON.stringify(g).matchAll(
        /(\d+)\s*([+−])\s*(\d+)\s*=\s*(\d+)/g,
      )) {
        const value =
          sign === '+' ? Number(a) + Number(b) : Number(a) - Number(b)
        assert.equal(value, Number(total), `${key}: ${written}`)
      }
  })
}

test('b1: names Ghana’s Presidents in order, up to 2025', () => {
  const text = basic1['history-08']!.explain.join(' ')
  const order = [
    'Kwame Nkrumah',
    'Edward Akufo-Addo',
    'Hilla Limann',
    'Jerry John Rawlings',
    'John Agyekum Kufuor',
    'John Evans Atta Mills',
    'John Dramani Mahama',
    'Nana Addo Dankwa Akufo-Addo',
    'again in 2025',
  ]
  let at = -1
  for (const name of order) {
    const next = text.indexOf(name, at + 1)
    assert.ok(next > at, name)
    at = next
  }
})
