import assert from 'node:assert/strict'
import test from 'node:test'
import { guides } from './b4-rme'

const all = Object.entries(guides)

// Indicators in the NaCCA RME curriculum, Basic 4.
const CURRICULUM = new Set([
  'B4.1.1.1.1',
  'B4.1.1.2.1',
  'B4.2.1.1.1',
  'B4.2.1.1.2',
  'B4.2.1.1.3',
  'B4.2.2.1.1',
  'B4.3.1.1.1',
  'B4.4.1.1.1',
  'B4.4.1.1.2',
  'B4.4.1.1.3',
  'B4.5.1.1.1',
  'B4.5.2.1.1',
])

test('covers each Basic 4 RME lesson once, with a real curriculum indicator', () => {
  assert.equal(all.length, 12)
  for (const [key, g] of all)
    assert.ok(CURRICULUM.has(g.indicator.code), `${key}: ${g.indicator.code}`)
  assert.equal(new Set(all.map(([, g]) => g.indicator.code)).size, 12)
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
  for (const key of [
    'rme-01',
    'rme-02',
    'rme-03',
    'rme-04',
    'rme-05',
    'rme-06',
    'rme-07',
    'rme-08',
    'rme-09',
  ]) {
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
  assert.notEqual(guides['rme-07']!.art.kind, 'people')
})

test('sentences stay short enough for eight- and nine-year-olds', () => {
  for (const [key, g] of all)
    for (const line of [g.hook, ...g.explain])
      for (const sentence of line.split(/(?<=[.!?])\s+/))
        assert.ok(sentence.split(/\s+/).length <= 26, `${key}: ${sentence}`)
})
