import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Loader2,
  Shuffle,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '#/lib/api-client'
import { LEVELS, SUBJECTS } from '#/lib/kidilearn/catalog'
import type { QuizAttempt } from '#/lib/kidilearn/catalog'
import { Container, EmptyState, Loading } from '#/components/site/kit'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/_site/learn/kidilearn/quiz/$id')({
  component: FinalQuiz,
})

function FinalQuiz() {
  const { id } = Route.useParams()
  const query = useQuery({
    queryKey: ['kidilearn', 'quiz', id],
    queryFn: () => api.get<QuizAttempt>(`/learn/kidilearn/quizzes/${id}`),
    retry: false,
  })
  return (
    <Container className="max-w-3xl space-y-5 py-8">
      <Link
        to="/learn/kidilearn"
        className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700"
      >
        <ArrowLeft className="size-4" /> Back to my learning space
      </Link>
      {query.data ? (
        <QuizForm key={id} attempt={query.data} />
      ) : query.error ? (
        <div role="alert">
          <EmptyState
            icon={AlertTriangle}
            title="We couldn't open this quiz"
            text={query.error.message}
            action={
              <Button
                disabled={query.isFetching}
                onClick={() => void query.refetch()}
              >
                Try again
              </Button>
            }
          />
        </div>
      ) : (
        <Loading />
      )}
    </Container>
  )
}

function QuizForm({ attempt }: { attempt: QuizAttempt }) {
  const queryClient = useQueryClient()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const subject = SUBJECTS[attempt.subjectId]
  const submit = useMutation({
    mutationFn: () =>
      api.post<NonNullable<QuizAttempt['result']>>(
        `/learn/kidilearn/quizzes/${attempt.id}/submit`,
        {
          answers: attempt.questions.map((q) => ({
            questionId: q.id,
            optionIndex: answers[q.id],
          })),
        },
      ),
    onSuccess: (result) => {
      queryClient.setQueryData(['kidilearn', 'quiz', attempt.id], {
        ...attempt,
        result,
      })
      void queryClient.invalidateQueries({
        queryKey: ['kidilearn', 'dashboard'],
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    onError: (error) => toast.error(error.message),
  })
  if (attempt.result)
    return (
      <section
        className="rounded-3xl border bg-white p-6 text-center sm:p-10"
        aria-live="polite"
      >
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <Trophy className="size-10" />
        </span>
        <h1 className="mt-5 text-2xl font-black text-primary">
          {attempt.result.passed
            ? 'You reached your target!'
            : 'Every try helps you grow.'}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {subject.name} · {LEVELS.find((l) => l.id === attempt.level)?.label}
        </p>
        <p className="my-6 text-5xl font-black text-teal-700">
          {attempt.result.score}%
        </p>
        <p className="text-sm text-muted-foreground">
          {attempt.result.correct} of {attempt.result.total} correct · Your
          target: {attempt.passMark}%
        </p>
        <p className="mt-4 text-sm">
          {attempt.result.passed
            ? 'Celebrate your progress, then explore your next subject.'
            : 'Revisit your lessons and come back for a fresh set of questions.'}
        </p>
        <Button
          asChild
          className="mt-6 rounded-xl bg-teal-700 hover:bg-teal-800"
        >
          <Link to="/learn/kidilearn">Back to my learning space</Link>
        </Button>
      </section>
    )
  const answered = attempt.questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault()
        if (answered === attempt.questions.length) submit.mutate()
      }}
    >
      <div className="rounded-3xl bg-[#073e49] p-6 text-white">
        <p className="flex items-center gap-2 text-xs font-semibold text-amber-200">
          <Shuffle className="size-4" /> kidiLearn final quiz
        </p>
        <h1 className="mt-2 text-2xl font-black">{subject.name}</h1>
        <p className="mt-2 text-sm text-white/75">
          Take your time. Read each question and choose one answer.
        </p>
        <p className="mt-4 text-xs font-semibold">
          {attempt.questions.length} questions · Target {attempt.passMark}% ·{' '}
          {answered} answered
        </p>
      </div>
      <fieldset disabled={submit.isPending} className="min-w-0 space-y-4">
        {attempt.questions.map((q, index) => (
          <fieldset
            key={q.id}
            className="min-w-0 rounded-3xl border bg-white p-5 [overflow-wrap:anywhere]"
          >
            <legend className="sr-only">
              Question {index + 1}: {q.question}
            </legend>
            <p className="mb-2 text-xs font-bold text-teal-700">
              Question {index + 1}
            </p>
            <p className="text-lg font-normal leading-relaxed text-primary">
              {q.question}
            </p>
            <div className="mt-4 space-y-2">
              {q.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm',
                    answers[q.id] === optionIndex
                      ? 'border-teal-600 bg-teal-50'
                      : 'hover:bg-slate-50',
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={optionIndex}
                    checked={answers[q.id] === optionIndex}
                    onChange={() =>
                      setAnswers((previous) => ({
                        ...previous,
                        [q.id]: optionIndex,
                      }))
                    }
                    className="mt-0.5 size-4 shrink-0 accent-teal-700"
                    required
                  />
                  <span className="min-w-0">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
          <p className="text-sm text-muted-foreground">
            {answered} of {attempt.questions.length} answered
          </p>
          <Button
            type="submit"
            disabled={answered !== attempt.questions.length || submit.isPending}
            className="rounded-xl bg-teal-700 hover:bg-teal-800"
          >
            {submit.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Check />
            )}{' '}
            Finish my quiz
          </Button>
        </div>
      </fieldset>
    </form>
  )
}
