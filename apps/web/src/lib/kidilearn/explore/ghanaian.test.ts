import assert from 'node:assert/strict'
import test from 'node:test'
import { buildBoard } from '../board-builder'
import type { LearningLesson } from '../library'
import { GA, guidesFor, MFANTSE, TWI } from './ghanaian'
import type { Language } from './ghanaian'

const LANGUAGES: Array<Language> = [TWI, GA, MFANTSE]
const LEVELS = [1, 2, 3, 4, 5, 6]

// The words of the language that a guide may use: only its lessons' own phrases.
const allowed = (L: Language) => new Set(L.phrases.map((p) => p.phrase))

test('every lesson at every level has a guide with a KidiLearn goal', () => {
  for (const L of LANGUAGES)
    for (const level of LEVELS) {
      const guides = guidesFor(L, level)
      assert.equal(Object.keys(guides).length, 12, `${L.name} b${level}`)
      for (const [key, g] of Object.entries(guides)) {
        assert.ok(key.startsWith(`${L.subject}-`), key)
        assert.equal(g.indicator.source, 'kidilearn', key)
      }
    }
})

test('guides use no words of the language beyond the lessons’ own phrases', () => {
  for (const L of LANGUAGES) {
    const ok = allowed(L)
    for (const level of LEVELS)
      for (const [key, g] of Object.entries(guidesFor(L, level))) {
        const where = `${L.name} b${level} ${key}`
        for (const m of JSON.stringify(g).matchAll(/«([^»]*)»/g))
          assert.ok(ok.has(m[1]!), `${where}: «${m[1]}»`)
        for (const w of g.words)
          assert.ok(ok.has(w.term), `${where}: ${w.term}`)
        for (const q of g.quiz ?? [])
          for (const o of q.options) assert.ok(ok.has(o), `${where}: ${o}`)
        assert.ok(ok.has(g.sayIt!.phrase), where)
        if (g.art.kind === 'dialogue')
          for (const line of g.art.lines)
            assert.ok(ok.has(line.text), `${where}: ${line.text}`)
        if (g.art.kind === 'cards')
          for (const item of g.art.items)
            assert.ok(ok.has(item.label), `${where}: ${item.label}`)
      }
  }
})

test('the English around a phrase never contains the language', () => {
  for (const L of LANGUAGES) {
    const words = new Set(
      L.phrases
        .flatMap((p) => p.phrase.toLowerCase().split(/[^\p{L}']+/u))
        .filter((w) => w.length > 2),
    )
    for (const level of LEVELS)
      for (const [key, g] of Object.entries(guidesFor(L, level))) {
        const english = [
          g.hook,
          ...g.explain,
          g.artCaption,
          ...g.examples.flatMap((e) => [e.situation, ...e.steps, e.answer]),
          ...g.mistakes.map((m) => m.right),
          ...g.tryIt.steps,
          ...(g.quiz ?? []).flatMap((q) => [q.prompt, q.why ?? '']),
        ]
        for (const text of english) {
          const plain = text.replace(/«[^»]*»/g, ' ')
          assert.match(plain, /^[ -~’‘“”—–…]*$/, `${key}: ${text}`)
          for (const w of plain.toLowerCase().split(/[^a-z']+/))
            assert.ok(!words.has(w), `${L.name} ${key}: "${w}" in ${text}`)
        }
      }
  }
})

test('no voice reads a phrase, and each lesson ends with a phrase to say', () => {
  for (const L of LANGUAGES)
    for (const level of [1, 6])
      for (const [key, g] of Object.entries(guidesFor(L, level))) {
        const lesson = {
          id: 1,
          title: key,
          strand: L.name,
          completed: [],
          challenge: [],
          play: [],
          content: {
            key,
            kind: L.name,
            level: `b${level}`,
            goals: [],
            notes: ['Practise the phrase with a speaker.'],
            passage: '',
            examples: [],
            activities: [],
            home: '',
            safety: '',
            scenes: [],
            video: '',
            pdf: '',
            epub: '',
            sourceLesson: { lang: L.name },
          },
        } as unknown as LearningLesson
        const board = buildBoard(lesson, `b${level}`, L.subject, g)!
        for (const beat of board.scenes.flatMap((s) => s.beats)) {
          assert.equal(beat.lang, undefined, `${key}: ${beat.say}`)
          for (const p of L.phrases)
            assert.ok(
              !beat.say.includes(p.phrase),
              `${L.name} ${key}: ${beat.say}`,
            )
        }
        const checks = board.scenes.flatMap((s) => (s.check ? [s.check] : []))
        const last = checks.at(-1)!
        assert.equal(last.type, 'say', key)
        assert.equal(last.type === 'say' && last.lang, L.name, key)
      }
})
