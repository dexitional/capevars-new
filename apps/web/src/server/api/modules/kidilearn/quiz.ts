import { randomInt } from 'node:crypto'
import { z } from 'zod'
import type { QuizQuestion } from '#/lib/kidilearn/catalog'

export interface StoredQuestion extends QuizQuestion {
  correctIndex: number
}
export interface Answer {
  questionId: number
  optionIndex: number
}

export function shuffle<T>(items: Array<T>): Array<T> {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}

const bankQuestionSchema = z
  .object({
    id: z.number().int().positive(),
    question: z.string().min(1),
    options: z.array(z.string().min(1)).min(2).max(8),
    correctIndex: z.number().int().min(0),
  })
  .refine((q) => q.correctIndex < q.options.length)

export function prepareQuestions(
  bank: Array<unknown>,
  count: number,
): Array<StoredQuestion> {
  const valid = bank.flatMap((q) => {
    const parsed = bankQuestionSchema.safeParse(q)
    return parsed.success ? [parsed.data] : []
  })
  const unique = [...new Map(valid.map((q) => [q.id, q])).values()]
  if (unique.length < count)
    throw new Error(
      `This subject needs ${count} ready questions before its final quiz can start.`,
    )
  return shuffle(unique)
    .slice(0, count)
    .map((q) => {
      const order = shuffle(q.options.map((_, index) => index))
      return {
        id: q.id,
        question: q.question,
        options: order.map((i) => q.options[i]!),
        correctIndex: order.indexOf(q.correctIndex),
      }
    })
}

export function publicQuestions(
  questions: Array<StoredQuestion>,
): Array<QuizQuestion> {
  return questions.map(({ id, question, options }) => ({
    id,
    question,
    options,
  }))
}

export function gradeQuiz(
  questions: Array<StoredQuestion>,
  answers: Array<Answer>,
  passMark: number,
) {
  const byId = new Map(answers.map((a) => [a.questionId, a.optionIndex]))
  if (
    !questions.length ||
    answers.length !== questions.length ||
    byId.size !== questions.length ||
    questions.some((q) => {
      const answer = byId.get(q.id)
      return (
        answer === undefined ||
        !Number.isInteger(answer) ||
        answer < 0 ||
        answer >= q.options.length
      )
    })
  )
    throw new Error('Answer every question once before finishing your quiz.')
  const correct = questions.filter(
    (q) => byId.get(q.id) === q.correctIndex,
  ).length
  const score = Math.round((correct / questions.length) * 100)
  return { score, passed: score >= passMark, correct, total: questions.length }
}
