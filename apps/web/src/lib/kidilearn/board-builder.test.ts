import assert from 'node:assert/strict'
import test from 'node:test'
import { buildBoard } from './board-builder'
import type { LearningLesson, LearningQuestion } from './library'
import type { Storyboard } from './storyboard'

const question = (
  id: number,
  text: string,
  extra: Partial<LearningQuestion> = {},
): LearningQuestion => ({
  id,
  question: text,
  options: ['a', 'b', 'c'],
  visual: null,
  ...extra,
})

const lesson = (
  content: Partial<LearningLesson['content']> = {},
  play: Array<LearningQuestion> = [],
  title = 'Weather Watchers',
): LearningLesson => ({
  id: 7,
  title,
  strand: 'Environment',
  completed: [],
  challenge: [],
  play,
  content: {
    key: 'science-7',
    kind: '',
    level: 'b1',
    goals: ['Describe the weather.'],
    notes: ['Weather is what the air is like. It may be sunny.'],
    passage: '',
    examples: [],
    activities: [],
    home: '',
    safety: '',
    scenes: [],
    video: '/v.mp4',
    pdf: '',
    epub: '',
    ...content,
  },
})

const build = (l: LearningLesson, subject = 'science', level = 'b1') =>
  buildBoard(l, level, subject)!
const spoken = (board: Storyboard) =>
  board.scenes.flatMap((s) => s.beats.filter((b) => !b.lang).map((b) => b.say))
const french = (board: Storyboard) =>
  board.scenes.flatMap((s) =>
    s.beats.filter((b) => b.lang === 'fr').map((b) => b.say),
  )

test('names a board by level, subject and lesson key, for its narration', () => {
  assert.equal(build(lesson()).id, 'b1/science/science-7')
})

test('leaves a lesson with nothing to teach on its video', () => {
  assert.equal(buildBoard(lesson({ notes: [] }), 'b1', 'science'), null)
})

test('breaks a long note into pieces that fit a small stage', () => {
  const long = Array.from({ length: 60 }, (_, i) => `word${i}`).join(' ')
  for (const scene of build(lesson({ notes: [long] })).scenes)
    if (scene.visual.type === 'idea')
      assert.ok(scene.visual.points.join('').length <= 130, scene.id)
})

test('says a repeated line only once', () => {
  const note = 'Plants need water.'
  const board = build(lesson({ notes: [note], activities: [note] }))
  assert.equal(spoken(board).filter((s) => s === note).length, 1)
})

test('lets the server mark Play questions, and skips the unsuitable ones', () => {
  const board = build(
    lesson({}, [
      question(1, 'Weather Watchers: What is this lesson mainly about?'),
      question(2, 'Tap the sun', {
        interaction: { type: 'tap', total: 1 },
      }),
      question(
        3,
        'Weather Watchers — Which weather is wet?\nThe model has rain.',
      ),
    ]),
  )
  const checks = board.scenes.flatMap((s) => (s.check ? [s.check] : []))
  assert.equal(checks.length, 1)
  const [check] = checks
  assert.ok(check?.type === 'choice')
  assert.equal(check.questionId, 3)
  assert.equal(check.prompt, 'Which weather is wet?')
})

test('every question can go back to what it tested', () => {
  const board = build(lesson({}, [question(1, 'Which is wet?')]))
  const check = board.scenes.find((s) => s.check)
  assert.ok(board.scenes.some((s) => s.id === check?.reteach))
})

test('gives safety advice before the activity it protects', () => {
  const { scenes } = build(
    lesson({ safety: 'Stay in shelter.', activities: ['Watch the sky.'] }),
  )
  const at = (chapter: string) => scenes.findIndex((s) => s.chapter === chapter)
  assert.ok(at('Stay safe') >= 0 && at('Stay safe') < at('Try it'))
})

test('never has an English voice read a Ghanaian phrase', () => {
  const phrase = 'Yaaba jogbaŋŋ'
  const board = build(
    lesson(
      {
        goals: [`Use “${phrase}” appropriately for “Goodbye”.`],
        notes: [`The expression “${phrase}” is used for “Goodbye”.`],
        sourceLesson: { lang: 'Ga', steps: [] },
      },
      [
        question(1, `What is the meaning of “${phrase}”?`),
        question(2, 'Which Ga phrase means “Goodbye”?'),
      ],
      'Goodbye',
    ),
    'ghanaian_ga',
  )
  assert.ok(!spoken(board).some((line) => line.includes(phrase)))
  // It stays on the screen, and the learner is asked to say it.
  assert.ok(board.scenes.some((s) => s.visual.type === 'phrase'))
  const checks = board.scenes.flatMap((s) => (s.check ? [s.check] : []))
  assert.ok(checks.some((c) => c.type === 'say' && c.phrase === phrase))
  const asked = checks.filter((c) => c.type === 'choice')
  assert.equal(asked.length, 1)
  assert.equal(asked[0]?.prompt, 'Which Ga phrase means “Goodbye”?')
  assert.equal((asked[0] as { mute?: boolean }).mute, true)
})

test('has French read in French and the rest in English', () => {
  const board = build(
    lesson(
      { notes: ['To introduce yourself, try « Je m’appelle Ama » and smile.'] },
      [],
      'Se présenter',
    ),
    'french',
  )
  assert.ok(
    spoken(board).includes('To introduce yourself, try this phrase and smile.'),
  )
  assert.deepEqual(french(board), ['Je m’appelle Ama'])
  // The screen keeps the French as it was written.
  const idea = board.scenes.find((s) => s.chapter === 'Big idea')
  assert.ok(idea?.visual.type === 'idea')
  assert.ok(idea.visual.points[0]?.includes('Je m’appelle'))
})

test('does not break a line inside a French quotation', () => {
  const board = build(
    lesson({ notes: ['Try « Et toi? » with a friend.'] }, [], 'Bonjour'),
    'french',
  )
  assert.ok(spoken(board).includes('Try this phrase with a friend.'))
})

test('drops a repeated sentence whole, never the end of a new one', () => {
  const board = build(
    lesson({
      notes: [
        'Learners contribute ideas and listen to the ideas of others during cooperative problem-solving activities every week.',
        'Problem-solving activities.',
      ],
      activities: ['Problem-solving activities.'],
    }),
  )
  const text = spoken(board).join(' ')
  assert.ok(text.includes('cooperative'))
  assert.ok(text.includes('every week.'))
  assert.equal(text.split('Problem-solving activities.').length, 2)
})

test('keeps a repeated goal for the closing reminder', () => {
  const board = build(lesson())
  assert.ok(spoken(board).includes("Today's goal: Describe the weather."))
  assert.ok(spoken(board).includes('Remember: Describe the weather.'))
})

test('does not ask the same thing twice', () => {
  const asked = 'How should a learner write a summary?'
  const board = build(
    lesson({ examples: [{ question: asked, answer: 'In their own words.' }] }, [
      question(1, asked),
    ]),
  )
  const checks = board.scenes.flatMap((s) => (s.check ? [s.check] : []))
  assert.deepEqual(
    checks.map((c) => c.type),
    ['choice'],
  )
})

test('reads a Ghanaian phrase quotation naturally', () => {
  const phrase = 'Yaaba jogbaŋŋ'
  const board = build(
    lesson(
      {
        goals: [`Use “${phrase}” appropriately for “Goodbye”.`],
        notes: [`The expression “${phrase}” is used for “Goodbye”.`],
      },
      [],
      'Goodbye',
    ),
    'ghanaian_ga',
  )
  assert.ok(
    spoken(board).includes('The expression this phrase is used for “Goodbye”.'),
  )
})

test('reads a list of French words as a group, and a French goal not at all', () => {
  const goal = 'Écrire pour donner des ordres'
  const board = build(
    lesson(
      {
        goals: [goal],
        notes: ['Family words include « mère », « père » and « sœur ».'],
        visualGuide: {
          panels: [
            {
              title: 'Step',
              text: `Read a model related to: ${goal}.`,
              image: '/a.png',
            },
          ],
          concepts: [],
          steps: [],
          experiment: '',
          context: '',
          reflection: '',
          sourceStatus: '',
        },
      },
      [],
      'Les ordres',
    ),
    'french',
  )
  assert.ok(spoken(board).includes('Family words include these words.'))
  assert.deepEqual(french(board), ['mère', 'père', 'sœur'])
  assert.ok(!spoken(board).join(' ').includes(goal))
})
