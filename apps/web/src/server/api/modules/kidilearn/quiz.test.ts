import assert from 'node:assert/strict'
import { test } from 'node:test'
import { planSchema } from '../../../../lib/kidilearn/catalog'
import { gradeQuiz, prepareQuestions, publicQuestions } from './quiz'

const bank = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  question: `Question ${index + 1}`,
  options: ['One', 'Two', 'Three', 'Four'],
  correctIndex: index % 4,
}))

test('random samples preserve answer keys, unique questions and source data', () => {
  const original = structuredClone(bank)
  for (let iteration = 0; iteration < 30; iteration++) {
    const questions = prepareQuestions(bank, 5)
    assert.equal(questions.length, 5)
    assert.equal(new Set(questions.map((q) => q.id)).size, 5)
    for (const question of questions) {
      const source = bank.find((q) => q.id === question.id)!
      assert.equal(
        question.options[question.correctIndex],
        source.options[source.correctIndex],
      )
      assert.deepEqual([...question.options].sort(), [...source.options].sort())
    }
    const answers = questions.map((q) => ({
      questionId: q.id,
      optionIndex: q.correctIndex,
    }))
    assert.deepEqual(gradeQuiz(questions, answers.reverse(), 70), {
      score: 100,
      passed: true,
      correct: 5,
      total: 5,
    })
  }
  assert.deepEqual(bank, original)
})

test('insufficient, malformed and duplicate bank entries cannot create a quiz', () => {
  assert.throws(() => prepareQuestions(bank, 20))
  assert.throws(() => prepareQuestions([bank[0], bank[0]], 2))
  assert.throws(() =>
    prepareQuestions(
      [
        { ...bank[0], correctIndex: 20 },
        { ...bank[1], options: ['Only one'] },
      ],
      1,
    ),
  )
})

test('public quiz questions never expose the stored answer key', () => {
  const questions = publicQuestions(prepareQuestions(bank, 5))
  for (const question of questions)
    assert.deepEqual(Object.keys(question).sort(), [
      'id',
      'options',
      'question',
    ])
})

test('grading rejects missing, duplicate, foreign and invalid option selections', () => {
  const questions = prepareQuestions(bank, 5)
  const answers = questions.map((q) => ({
    questionId: q.id,
    optionIndex: q.correctIndex,
  }))
  assert.throws(() => gradeQuiz(questions, answers.slice(1), 70))
  assert.throws(() =>
    gradeQuiz(questions, [answers[0]!, answers[0]!, ...answers.slice(2)], 70),
  )
  assert.throws(() =>
    gradeQuiz(
      questions,
      [{ questionId: 9999, optionIndex: 0 }, ...answers.slice(1)],
      70,
    ),
  )
  for (const invalid of [-1, 9, 0.5])
    assert.throws(() =>
      gradeQuiz(
        questions,
        [
          { questionId: questions[0]!.id, optionIndex: invalid },
          ...answers.slice(1),
        ],
        70,
      ),
    )
  assert.throws(() => gradeQuiz([], [], 70))
})

test("target scores use the attempt's settings and server-side answers", () => {
  const questions = prepareQuestions(bank, 5)
  const answers = questions.map((q, index) => ({
    questionId: q.id,
    optionIndex:
      index === 0 ? (q.correctIndex + 1) % q.options.length : q.correctIndex,
  }))
  assert.deepEqual(gradeQuiz(questions, answers, 80), {
    score: 80,
    passed: true,
    correct: 4,
    total: 5,
  })
  assert.equal(gradeQuiz(questions, answers, 90).passed, false)
})

test('study plans enforce level subjects, unique selections and quiz bounds', () => {
  const plan = {
    level: 'b4',
    days: ['mon', 'wed'],
    minutesPerSession: 25,
    subjects: [
      {
        subjectId: 'mathematics',
        quizEnabled: true,
        questionCount: 10,
        passMark: 70,
      },
    ],
  }
  assert.equal(planSchema.safeParse(plan).success, true)
  for (const patch of [
    { level: 'b10' },
    { level: 'kg1' },
    { days: [] },
    { days: ['mon', 'mon'] },
    { subjects: [] },
    { subjects: [...plan.subjects, ...plan.subjects] },
    { minutesPerSession: 0 },
    { subjects: [{ ...plan.subjects[0], questionCount: 100 }] },
    { subjects: [{ ...plan.subjects[0], passMark: 101 }] },
  ])
    assert.equal(planSchema.safeParse({ ...plan, ...patch }).success, false)
  assert.equal(
    planSchema.safeParse({
      ...plan,
      level: 'kg1',
      subjects: [{ ...plan.subjects[0], subjectId: 'numeracy' }],
    }).success,
    true,
  )
})
