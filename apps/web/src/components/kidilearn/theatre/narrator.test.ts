import assert from 'node:assert/strict'
import { afterEach, beforeEach, mock, test } from 'node:test'
import { Narrator } from './narrator'

type Fake = {
  text: string
  onstart?: () => void
  onend?: () => void
  onerror?: (e: { error: string }) => void
}
let spoken: Array<Fake> = []
let cancels = 0

beforeEach(() => {
  mock.timers.enable({ apis: ['setTimeout'] })
  spoken = []
  cancels = 0
  Object.assign(globalThis, {
    speechSynthesis: {
      getVoices: () => [{ lang: 'en-GB', name: 'Test', localService: true }],
      speak: (u: Fake) => spoken.push(u),
      cancel: () => cancels++,
    },
    SpeechSynthesisUtterance: class {
      constructor(public text: string) {}
    },
  })
})
afterEach(() => mock.timers.reset())

const say = (narrator: Narrator, text: string, onEnd = () => {}) =>
  narrator.speak({ text, band: 'lower', onEnd })
const words = () => spoken.map((u) => u.text)

test('a line asked for twice at once is read once, and not cancelled', () => {
  const narrator = new Narrator()
  narrator.stop()
  say(narrator, 'Which other example helps?')
  narrator.stop()
  say(narrator, 'Which other example helps?')
  mock.timers.tick(100)
  assert.deepEqual(words(), ['Which other example helps?'])
  assert.equal(cancels, 0)
})

test('does not cancel a line that has already finished', () => {
  const narrator = new Narrator()
  say(narrator, 'Now it is your turn.')
  mock.timers.tick(100)
  spoken[0]!.onstart?.()
  spoken[0]!.onend?.()
  narrator.stop()
  assert.equal(cancels, 0)
})

test('reads a line again if something else cut it off', () => {
  const narrator = new Narrator()
  say(narrator, 'Which other example helps?')
  mock.timers.tick(100)
  spoken[0]!.onerror?.({ error: 'interrupted' })
  mock.timers.tick(200)
  assert.equal(spoken.length, 2)
  assert.equal(spoken[1]!.text, 'Which other example helps?')
})

test('tries again when a line never starts, then moves on without a voice', () => {
  let ended = false
  const narrator = new Narrator()
  say(narrator, 'Hello there.', () => (ended = true))
  mock.timers.tick(100)
  mock.timers.tick(2500)
  mock.timers.tick(200)
  assert.equal(spoken.length, 2)
  mock.timers.tick(2500)
  assert.equal(spoken.length, 2)
  mock.timers.tick(10_000)
  assert.ok(ended, 'the lesson still moves on')
})

test('a line stopped straight away is never sent to the voice', () => {
  const narrator = new Narrator()
  say(narrator, 'Hello there.')
  narrator.stop()
  mock.timers.tick(1000)
  assert.equal(spoken.length, 0)
})
