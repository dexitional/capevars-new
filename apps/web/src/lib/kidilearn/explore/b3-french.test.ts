import assert from 'node:assert/strict'
import test from 'node:test'
import { buildBoard } from '../board-builder'
import type { LearningLesson } from '../library'
import { guides } from './b3-french'

const all = Object.entries(guides)

test('covers each Basic 3 French lesson with a KidiLearn goal, as the curriculum starts at Basic 4', () => {
  assert.equal(all.length, 20)
  for (const [key, guide] of all) {
    assert.equal(guide.indicator.source, 'kidilearn', key)
    assert.equal(guide.indicator.code, '', key)
  }
  assert.equal(new Set(all.map(([, g]) => g.indicator.text)).size, 20)
})

test('explanations are short enough for seven- and eight-year-olds', () => {
  for (const [key, g] of all)
    for (const line of [g.hook, ...g.explain])
      for (const sentence of line
        .replace(/«[^»]*»/g, 'x')
        .split(/(?<=[.!?])\s+/))
        assert.ok(sentence.split(/\s+/).length <= 24, `${key}: ${sentence}`)
})

// English an English voice may read: no accents, no «…», and none of the
// lesson's French words.
const SHARED = [
  'animal',
  'table',
  'radio',
  'orange',
  'football',
  'super',
  'banane',
  'village',
  'plus',
  'violet',
  'cedis',
  'content',
]
const NAMES = ['kwame', 'yaw', 'efua', 'asare', 'akosua', 'ghana', 'kenkey']
const ENGLISH = /^[ -~’‘“”—–…]*$/
const outside = (text: string) => text.replace(/«[^»]*»/g, ' ')

test('the English voice never reads French', () => {
  for (const [key, g] of all) {
    const french = new Set(
      [
        ...g.words.map((w) => w.term),
        ...[...JSON.stringify(g).matchAll(/«([^»]*)»/g)].map((m) => m[1]!),
      ]
        .flatMap((t) => t.toLowerCase().split(/[^\p{L}’-]+/u))
        .filter((w) => w.length > 3),
    )
    // Words spelled the same in both languages, and people's names.
    for (const shared of [...SHARED, ...NAMES]) french.delete(shared)
    const english = [
      g.hook,
      ...g.explain,
      g.artCaption,
      ...g.words.map((w) => w.meaning),
      ...g.examples.flatMap((e) => [e.situation, ...e.steps, e.answer]),
      ...g.mistakes.map((m) => m.right),
      ...g.tryIt.steps,
      ...(g.safety ?? []),
      ...(g.quiz ?? []).flatMap((q) => [q.prompt, q.why ?? '']),
      g.sayIt!.meaning,
    ]
    for (const text of english) {
      const plain = outside(text)
      assert.match(plain, ENGLISH, `${key}: ${text}`)
      for (const word of plain.toLowerCase().split(/[^a-z’-]+/))
        assert.ok(!french.has(word), `${key}: "${word}" in ${text}`)
    }
    for (const q of g.quiz ?? [])
      assert.doesNotMatch(
        `${q.prompt} ${q.why ?? ''}`,
        /«/,
        `${key}: ${q.prompt}`,
      )
  }
})

test('every quotation is closed, and every lesson asks and has a phrase to say', () => {
  for (const [key, g] of all) {
    const text = JSON.stringify(g)
    assert.equal(text.split('«').length, text.split('»').length, key)
    assert.ok(g.quiz?.length, `${key}: quiz`)
    for (const q of g.quiz!) {
      assert.ok(
        q.answer >= 0 && q.answer < q.options.length,
        `${key}: ${q.prompt}`,
      )
      assert.equal(
        new Set(q.options).size,
        q.options.length,
        `${key}: ${q.prompt}`,
      )
    }
    assert.ok(g.sayIt?.phrase, `${key}: phrase`)
  }
})

test('speech bubbles fit the picture', () => {
  for (const [key, g] of all)
    if (g.art.kind === 'dialogue') {
      assert.ok(g.art.lines.length <= 4, key)
      for (const line of g.art.lines)
        assert.ok(line.text.length <= 38, `${key}: ${line.text}`)
    }
})

test('a lesson board reads French in French and asks its own questions', () => {
  const lesson = {
    id: 1020,
    title: 'Saluer et prendre congé',
    strand: 'French',
    completed: [],
    challenge: [],
    play: [],
    content: {
      key: 'french-01',
      kind: 'French',
      level: 'b3',
      goals: [],
      notes: ['Practise short useful expressions with a partner.'],
      passage: '',
      examples: [],
      activities: [],
      home: '',
      safety: '',
      scenes: [],
      video: '',
      pdf: '',
      epub: '',
    },
  } as unknown as LearningLesson
  for (const [key, g] of all) {
    const board = buildBoard(
      { ...lesson, content: { ...lesson.content, key } },
      'b3',
      'french',
      g,
    )!
    const beats = board.scenes.flatMap((s) => s.beats)
    for (const beat of beats.filter((b) => !b.lang))
      assert.doesNotMatch(beat.say, /[«»]/, `${key}: ${beat.say}`)
    assert.ok(
      beats.some((b) => b.lang === 'fr'),
      key,
    )
    const checks = board.scenes.flatMap((s) => (s.check ? [s.check.type] : []))
    assert.equal(checks.at(-1), 'say', key)
    assert.ok(checks.includes('choice'), key)
  }
})
