// Builds every lesson's storyboard, checks it, and lists the lines a recorded
// voice needs for render-kidi-theatre.py. Reads the database; writes one file.
//
//   npx tsx scripts/export-theatre-narration.ts [--level b2] [--subject mathematics]
//     [--check] only validate    [--boards <file>] also write the storyboards
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import mysql from 'mysql2/promise'
import type { RowDataPacket } from 'mysql2/promise'
import { buildBoard } from '../src/lib/kidilearn/board-builder'
import { BOARDS, boardFor } from '../src/lib/kidilearn/boards'
import { loadGuides } from '../src/lib/kidilearn/explore'
import {
  boardSeconds,
  checkCount,
  narrationLines,
  speakable,
} from '../src/lib/kidilearn/storyboard'
import type { Storyboard } from '../src/lib/kidilearn/storyboard'
import type { LearningLesson } from '../src/lib/kidilearn/library'

const ROOT = resolve(import.meta.dirname, '../../..')
const OUTPUT = resolve(ROOT, '.cache/kidi-media/theatre-lines.json')

const flag = (name: string) => {
  const at = process.argv.indexOf(`--${name}`)
  return at < 0 ? undefined : process.argv[at + 1]
}
const parsed = <T>(value: unknown) =>
  (typeof value === 'string' ? JSON.parse(value) : value) as T

// A board's faults, as sentences a person can act on.
function faults(board: Storyboard, subject: string) {
  const out: Array<string> = []
  const ids = new Set(board.scenes.map((s) => s.id))
  if (ids.size !== board.scenes.length) out.push('repeated scene id')
  const isLanguage = subject === 'french' || subject.startsWith('ghanaian')
  for (const scene of board.scenes) {
    if (!scene.beats.length) out.push(`${scene.id}: nothing to read`)
    if (scene.reteach && !ids.has(scene.reteach))
      out.push(`${scene.id}: reteaches a missing scene`)
    if (!isLanguage) continue
    // Letters beyond English would be misread by an English voice.
    const read = [
      ...scene.beats.filter((b) => !b.lang).map((b) => b.say),
      ...(scene.check && 'prompt' in scene.check ? [scene.check.prompt] : []),
    ]
    for (const line of read)
      if (/[^ -~’‘“”—–…]/.test(line))
        out.push(`${scene.id}: reads the taught language aloud: ${line}`)
  }
  return out
}

const env = readFileSync(resolve(ROOT, 'apps/web/.env'), 'utf8')
const url =
  process.env.DATABASE_URL ?? /^DATABASE_URL="?([^"\n]+)/m.exec(env)?.[1]
if (!url) throw new Error('DATABASE_URL is not set')
const db = await mysql.createConnection(url)
const [rows] = await db.query<RowDataPacket[]>(
  `SELECT l.id, l.title, l.strand, l.play_id, l.payload, k.level_key, k.subject_key
   FROM kidi_lessons l JOIN kidi_course_links k ON k.course_id = l.course_id
   ORDER BY k.level_key, k.subject_key, l.sort_order`,
)
const [questions] = await db.query<RowDataPacket[]>(
  'SELECT id, lesson_id, question, options, explanation, sort_order FROM quiz_questions ORDER BY sort_order, id',
)
await db.end()

const byLesson = new Map<number, Array<RowDataPacket>>()
for (const q of questions)
  byLesson.set(q.lesson_id, [...(byLesson.get(q.lesson_id) ?? []), q])
const explanations = new Map<number, string>(
  questions.filter((q) => q.explanation).map((q) => [q.id, q.explanation]),
)

const out: Array<{ id: string; lines: ReturnType<typeof narrationLines> }> = []
const boards: Array<Storyboard> = []
const problems: Array<string> = []
const stats = {
  lessons: 0,
  boards: 0,
  none: 0,
  minutes: [] as Array<number>,
  scenes: [] as Array<number>,
  checks: {} as Record<number, number>,
}
for (const row of rows) {
  if (flag('level') && row.level_key !== flag('level')) continue
  if (flag('subject') && row.subject_key !== flag('subject')) continue
  stats.lessons++
  const { playVisuals, challengeVisuals, playInteractions, ...content } =
    parsed<
      LearningLesson['content'] & {
        playVisuals?: Array<LearningLesson['play'][number]['visual']>
        challengeVisuals?: unknown
        playInteractions?: Array<LearningLesson['play'][number]['interaction']>
      }
    >(row.payload)
  const lesson: LearningLesson = {
    id: row.id,
    title: row.title,
    strand: row.strand,
    completed: [],
    content,
    challenge: [],
    play: (byLesson.get(row.play_id) ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: parsed<Array<string>>(q.options),
      visual: playVisuals?.[q.sort_order] ?? null,
      interaction: playInteractions?.[q.sort_order] ?? null,
    })),
  }
  const board =
    boardFor(row.level_key, row.subject_key, row.title) ??
    buildBoard(
      lesson,
      row.level_key,
      row.subject_key,
      content.key
        ? (await loadGuides(row.level_key, row.subject_key))?.[content.key]
        : undefined,
    )
  if (!board) {
    stats.none++
    continue
  }
  stats.boards++
  boards.push(board)
  stats.minutes.push(boardSeconds(board) / 60)
  stats.scenes.push(board.scenes.length)
  const checks = checkCount(board)
  stats.checks[checks] = (stats.checks[checks] ?? 0) + 1
  for (const fault of faults(board, row.subject_key))
    problems.push(`${board.id} (lesson ${row.id}): ${fault}`)
  out.push({ id: board.id, lines: narrationLines(board, explanations) })
}

const unique = new Set(
  out.flatMap((b) => b.lines.map((l) => `${l.lang}:${l.text}`)),
)
const words = [...unique].reduce(
  (sum, l) => sum + speakable(l).split(/\s+/).length,
  0,
)
const pct = (list: Array<number>, p: number) =>
  [...list].sort((a, b) => a - b)[Math.floor((list.length - 1) * p)]?.toFixed(1)
console.log(
  `${stats.boards} boards from ${stats.lessons} lessons (${stats.none} left on video, ${BOARDS.size} written by hand)`,
)
console.log(
  `minutes p50 ${pct(stats.minutes, 0.5)} p90 ${pct(stats.minutes, 0.9)} max ${pct(stats.minutes, 1)}; scenes p50 ${pct(stats.scenes, 0.5)} max ${pct(stats.scenes, 1)}`,
)
console.log(`boards by number of questions: ${JSON.stringify(stats.checks)}`)
console.log(
  `${unique.size} different lines, about ${Math.round((words * 60) / 140 / 3600)} hours of speech`,
)
if (problems.length) {
  console.log(`\n${problems.length} problems:`)
  for (const p of problems.slice(0, Number(flag('show') ?? 40)))
    console.log(`  ${p}`)
  process.exitCode = 1
}
// For reading the scripts, or measuring how they fit a small stage.
if (flag('boards')) writeFileSync(flag('boards')!, JSON.stringify(boards))
if (!process.argv.includes('--check')) {
  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, JSON.stringify(out))
  console.log(`Wrote ${OUTPUT}`)
}
