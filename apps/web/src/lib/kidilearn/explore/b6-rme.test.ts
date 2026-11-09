import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b6-rme'

const all = Object.entries(guides)

// Indicators in the NaCCA RME curriculum, Basic 6.
const CURRICULUM = new Set([
  'B6.1.1.1.1',
  'B6.1.2.1.1',
  'B6.1.2.1.2',
  'B6.2.1.1.1',
  'B6.2.2.1.1',
  'B6.2.2.1.2',
  'B6.2.2.1.3',
  'B6.3.1.1.1',
  'B6.4.1.1.1',
  'B6.4.1.1.2',
  'B6.5.1.1.1',
  'B6.5.1.1.2',
  'B6.5.2.1.1',
])

test('covers each Basic 6 RME lesson once, with a real curriculum indicator', () => {
  assert.equal(all.length, 13)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
  assert.equal(new Set(all.map(([, g]) => g.indicator.code)).size, 13)
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

// The curriculum teaches the three major religions in Ghana side by side.
test('lessons about religion cover all three religions', () => {
  for (const key of ['rme-01', 'rme-03', 'rme-04', 'rme-06', 'rme-08']) {
    const text = JSON.stringify(guides[key])
    assert.match(text, /Christian/, `${key}: Christianity`)
    assert.match(text, /Muslim|Islam/, `${key}: Islam`)
    assert.match(text, /Traditional/, `${key}: African Traditional Religion`)
  }
})

test('describes beliefs without preaching, and shows no religious figure', () => {
  const text = JSON.stringify(guides)
  assert.doesNotMatch(
    text,
    /you must believe|the (only )?true (god|religion)|wrong religion/i,
  )
  assert.notEqual(guides['rme-08']!.art.kind, 'people')
})

test('sentences stay short enough for ten- and eleven-year-olds', () => {
  for (const [key, g] of all)
    for (const line of [g.hook, ...g.explain])
      for (const sentence of line.split(/(?<=[.!?])\s+/))
        assert.ok(sentence.split(/\s+/).length <= 30, `${key}: ${sentence}`)
})
