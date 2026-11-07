import type { Art } from './explore/types'
import type { Visual } from './library'

// A lesson told as data. The browser animates it, so a learner can stop and
// answer inside the lesson, and a small phone downloads text rather than video.

export type Band = 'kg' | 'lower' | 'upper' | 'jhs'
export function bandFor(level?: string | null): Band {
  if (!level || level.startsWith('kg')) return 'kg'
  const n = Number(level.slice(1))
  if (n <= 3) return 'lower'
  if (n <= 6) return 'upper'
  return 'jhs'
}

export type Pose =
  | 'stand'
  | 'ready'
  | 'runLeft'
  | 'runRight'
  | 'jump'
  | 'land'
  | 'balance'
  | 'kick'
  | 'catch'
  | 'throw'
  | 'stretch'
  | 'situp'
  | 'dance'

export type SceneVisual =
  | { type: 'title'; title: string; tagline?: string; icon: string }
  | { type: 'idea'; heading?: string; points: Array<string>; icon?: string }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'art'; art: Art; alt: string }
  | { type: 'count'; icon: string; total: number }
  | {
      type: 'numberline'
      min: number
      max: number
      start: number
      jumps: Array<number>
    }
  | { type: 'array'; rows: number; cols: number; icon?: string }
  | {
      type: 'fraction'
      parts: number
      filled: number
      form?: 'bar' | 'circle'
      // Basic 1 and 2 meet fractions in words; symbols wait for later levels.
      inWords?: boolean
      second?: { parts: number; filled: number }
    }
  | { type: 'place'; value: number }
  | { type: 'compare'; a: number; b: number }
  | { type: 'clock'; hour: number; minute: number }
  | { type: 'equation'; lines: Array<{ text: string; note?: string }> }
  | {
      type: 'words'
      sentences: Array<{ text: string; mark?: string; label?: string }>
    }
  | { type: 'letter'; letters: Array<string>; word: string; icon?: string }
  | {
      type: 'phrase'
      lang: string
      items: Array<{ phrase: string; meaning?: string; audio?: string }>
    }
  | { type: 'timeline'; events: Array<{ when: string; what: string }> }
  | { type: 'cycle'; stages: Array<{ icon: string; label: string }> }
  | { type: 'steps'; steps: Array<{ icon?: string; text: string }> }
  | {
      type: 'columns'
      left: { title: string; items: Array<string> }
      right: { title: string; items: Array<string> }
    }
  | { type: 'terms'; terms: Array<{ term: string; meaning: string }> }
  | { type: 'lab'; lab: 'mixture' | 'plant' }
  | { type: 'legacy'; visual: Visual }
  | { type: 'figure'; poses: Array<Pose>; cue?: Array<string>; ball?: boolean }
  | { type: 'bars'; labels: Array<string>; values: Array<number> }
  | { type: 'thermometer'; start: number; change: number }
  | { type: 'graph'; slope: number; intercept: number; points: Array<number> }
  | { type: 'balance'; left: string; right: string; lines?: Array<string> }

export type Check =
  | {
      type: 'choice'
      prompt: string
      options: Array<string>
      answer: number
      why?: string
      // Set when the Play bank holds the answer, so the server marks it.
      questionId?: number
      // The explanation is shown but not read: it may be in the language taught.
      mute?: boolean
    }
  | {
      type: 'tap'
      prompt: string
      icon: string
      total: number
      show: number
      why?: string
    }
  | {
      type: 'line'
      prompt: string
      min: number
      max: number
      answer: number
      why?: string
    }
  | { type: 'order'; prompt: string; items: Array<string>; why?: string }
  | {
      type: 'sort'
      prompt: string
      left: string
      right: string
      items: Array<{ text: string; side: 'left' | 'right' }>
      why?: string
    }
  | { type: 'number'; prompt: string; answer: number; why?: string }
  | { type: 'reveal'; prompt: string; answer: string }
  | {
      type: 'say'
      phrase: string
      meaning?: string
      lang: string
      audio?: string
      prompt: string
    }

export type Beat = {
  say: string
  // Which step of the picture this line goes with; defaults to the line number.
  show?: number
  // Spoken in this language; only a language a voice can really speak.
  lang?: 'fr'
}
export type SceneKind = 'hook' | 'teach' | 'example' | 'try' | 'check' | 'recap'
export type Scene = {
  id: string
  chapter: string
  kind: SceneKind
  visual: SceneVisual
  beats: Array<Beat>
  check?: Check
  // Scene to show again when a learner needs another look.
  reteach?: string
}
export type Storyboard = {
  id: string
  title: string
  band: Band
  scenes: Array<Scene>
  // A written lesson script rather than one built from the course notes.
  authored?: boolean
}

const FRACTION_WORDS: Record<string, string> = {
  '1/2': 'one half',
  '1/3': 'one third',
  '2/3': 'two thirds',
  '1/4': 'one quarter',
  '3/4': 'three quarters',
  '1/5': 'one fifth',
  '1/8': 'one eighth',
  '1/10': 'one tenth',
}

// What a voice should read, which is not always what the screen shows.
export function speakable(text: string) {
  return text
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/‍|️/g, '')
    .replace(/\b(\d+)\/(\d+)\b/g, (all, a, b) =>
      FRACTION_WORDS[all] ?? `${a} over ${b}`,
    )
    .replace(/GH₵\s?([\d.,]+)/g, '$1 Ghana cedis')
    .replace(/₵\s?([\d.,]+)/g, '$1 Ghana cedis')
    .replace(/(\d)\s*°\s*C\b/g, '$1 degrees Celsius')
    .replace(/(\d)\s*°/g, '$1 degrees')
    .replace(/(\d)\s*%/g, '$1 percent')
    .replace(/\((-?\d+)\)/g, '$1')
    .replace(/_{2,}/g, ' blank ')
    .replace(/(^|[\s(])[-−](?=\d)/g, '$1minus ')
    .replace(/(\w)²/g, '$1 squared')
    .replace(/\s*[×]\s*/g, ' times ')
    .replace(/\s*÷\s*/g, ' divided by ')
    .replace(/(\d)\s*[-−–]\s*(\d)/g, '$1 minus $2')
    .replace(/\s*−\s*/g, ' minus ')
    .replace(/\s*\+\s*/g, ' plus ')
    .replace(/\s*=\s*/g, ' equals ')
    .replace(/\s+<\s+/g, ' is less than ')
    .replace(/\s+>\s+/g, ' is greater than ')
    .replace(/\s*→\s*/g, ', then ')
    .replace(/\s+/g, ' ')
    .trim()
}

// Every line a recorded voice needs, for the narration renderer. The server
// keeps the explanations of its own questions, so a caller passes those in.
export function narrationLines(
  board: Storyboard,
  explanations: Map<number, string> = new Map(),
) {
  const seen = new Set<string>()
  const lines: Array<{ text: string; lang: 'en' | 'fr' }> = []
  const add = (raw: string, lang: 'en' | 'fr') => {
    const text = speakable(raw)
    const id = `${lang}:${text}`
    if (!text || seen.has(id)) return
    seen.add(id)
    lines.push({ text, lang })
  }
  for (const scene of board.scenes) {
    for (const beat of scene.beats) add(beat.say, beat.lang ?? 'en')
    if (scene.check) {
      if (scene.check.type === 'say') {
        add(scene.check.prompt, 'en')
        if (scene.check.lang === 'French') add(scene.check.phrase, 'fr')
      } else add(scene.check.prompt, 'en')
      const why =
        'why' in scene.check
          ? scene.check.why
          : scene.check.type === 'choice' &&
              !scene.check.mute &&
              scene.check.questionId
            ? explanations.get(scene.check.questionId)
            : undefined
      if (why) {
        add(why, 'en')
        add(`Yes! ${why}`, 'en')
      }
      if (scene.check.type === 'reveal') add(scene.check.answer, 'en')
    }
  }
  for (const line of [...PRAISE, ...RETRY, ANSWER_SHOWN]) add(line, 'en')
  return lines
}

export const ANSWER_SHOWN = 'Here is the answer.'
export const PRAISE = ['Yes! Well done.', 'That is right.', 'Great thinking!']
export const RETRY = [
  'Not yet. Have another look.',
  'Good try. Let us look again.',
]

const WORDS_PER_MINUTE: Record<Band, number> = {
  kg: 115,
  lower: 130,
  upper: 145,
  jhs: 155,
}
// A pause after each line, so a child has time to look at the picture.
export function beatSeconds(text: string, band: Band) {
  const words = speakable(text).split(/\s+/).filter(Boolean).length
  return (words * 60) / WORDS_PER_MINUTE[band] + 0.7
}
export function sceneSeconds(scene: Scene, band: Band) {
  return scene.beats.reduce((sum, b) => sum + beatSeconds(b.say, band), 0)
}
export function boardSeconds(board: Storyboard) {
  return board.scenes.reduce((sum, s) => sum + sceneSeconds(s, board.band), 0)
}
export function checkCount(board: Storyboard) {
  return board.scenes.filter((s) => s.check).length
}
