import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Gamepad2,
  Loader2,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import type {
  LearningLesson,
  LearningQuestion,
  LearningResult,
  Phase,
  SubjectLibrary,
} from '#/lib/kidilearn/library'
import { LEVELS, SUBJECTS } from '#/lib/kidilearn/catalog'
import type { SubjectId } from '#/lib/kidilearn/catalog'
import { api } from '#/lib/api-client'
import { cn } from '#/lib/utils'
import { Container } from '#/components/site/kit'
import { Button } from '#/components/ui/button'
import { LearningActivity } from './activities'
import { QuestionVisual } from './visual'
import { PlayInteractionView } from './play-interaction'
import { LessonVideo } from './lesson-video'
import { VisualStory } from './discovery-lab'
import { SourceDetails } from './source-practice'

const phases = [
  { id: 'explore', title: 'Explore', icon: BookOpen },
  { id: 'play', title: 'Play', icon: Gamepad2 },
  { id: 'challenge', title: 'Challenge', icon: Trophy },
] as const
const panel = 'min-w-0 rounded-3xl border bg-white p-4 sm:p-6'

export function SubjectPlayer({
  level,
  subject,
  selectedId,
  onSelect,
}: {
  level: string
  subject: string
  selectedId?: number
  onSelect: (id: number) => void
}) {
  const library = useQuery({
    queryKey: ['kidilearn', 'library', level, subject],
    queryFn: () =>
      api.get<SubjectLibrary>(
        `/learn/kidilearn/library/${encodeURIComponent(level)}/${encodeURIComponent(subject)}`,
      ),
  })
  const data = library.data
  const currentId = selectedId ?? data?.resumeId ?? data?.lessons[0]?.id
  const current = data?.lessons.find((l) => l.id === currentId)
  const lesson = useQuery({
    queryKey: ['kidilearn', 'lesson', currentId],
    queryFn: () =>
      api.get<LearningLesson>(`/learn/kidilearn/lessons/${currentId}`),
    enabled: Boolean(current),
  })
  const title = Object.hasOwn(SUBJECTS, subject)
    ? SUBJECTS[subject as SubjectId].name
    : 'My subject'
  const levelName = LEVELS.find((l) => l.id === level)?.label ?? level
  const index = data?.lessons.findIndex((l) => l.id === currentId) ?? -1
  return (
    <div className="min-h-[70vh] bg-[#f5f9f6] pb-12">
      <Container className="space-y-6 py-6">
        <Link
          to="/learn/kidilearn"
          className="inline-flex items-center gap-2 text-sm font-bold text-teal-800"
        >
          <ArrowLeft className="size-4" /> My study plan
        </Link>
        <header className="rounded-3xl bg-[#073e49] p-5 text-white sm:p-8">
          <p className="text-sm font-bold text-amber-200">
            kidiLearn · {levelName}
          </p>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-2 text-sm text-white/80">
            Explore a little. Try it yourself. See how much you’ve learned.
          </p>
          {data && (
            <div className="mt-5 max-w-lg">
              <div className="mb-2 flex flex-wrap justify-between gap-2 text-xs">
                <span>{data.lessons.length} lessons · 3 steps each</span>
                <span>{data.progress}% complete</span>
              </div>
              <div
                role="progressbar"
                aria-label="Subject progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={data.progress}
                className="h-2 overflow-hidden rounded-full bg-white/20"
              >
                <div
                  className="h-full rounded-full bg-amber-300"
                  style={{ width: `${data.progress}%` }}
                />
              </div>
            </div>
          )}
        </header>
        {library.isPending ? (
          <Loading />
        ) : library.isError ? (
          <ErrorPanel
            message={library.error.message}
            retry={() => void library.refetch()}
          />
        ) : (
          data && (
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[270px_minmax(0,1fr)]">
              <aside className={panel}>
                <label
                  className="block text-sm font-bold"
                  htmlFor="kidi-lesson"
                >
                  Your lesson map
                </label>
                <select
                  id="kidi-lesson"
                  className="mt-3 h-12 w-full min-w-0 rounded-xl border bg-white px-2 text-sm"
                  value={current?.id ?? ''}
                  onChange={(e) => onSelect(Number(e.target.value))}
                >
                  {!current && (
                    <option value="" disabled>
                      Choose a lesson
                    </option>
                  )}
                  {[...new Set(data.lessons.map((l) => l.strand))].map(
                    (strand) => (
                      <optgroup key={strand} label={strand}>
                        {data.lessons
                          .filter((l) => l.strand === strand)
                          .map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.completed.length === 3 ? '✓ ' : ''}
                              {data.lessons.indexOf(l) + 1}. {l.title}
                            </option>
                          ))}
                      </optgroup>
                    ),
                  )}
                </select>
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer py-2 font-semibold text-teal-800">
                    View all lessons
                  </summary>
                  <nav
                    className="mt-3 max-h-[60vh] space-y-2 overflow-y-auto"
                    aria-label="Lessons"
                  >
                    {data.lessons.map((l, i) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => onSelect(l.id)}
                        className={cn(
                          'flex w-full gap-3 rounded-xl p-3 text-left text-xs leading-relaxed',
                          currentId === l.id
                            ? 'bg-teal-100 text-teal-950'
                            : 'hover:bg-slate-50',
                        )}
                      >
                        <span className="font-bold">
                          {l.completed.length === 3 ? '✓' : i + 1}
                        </span>
                        <span className="min-w-0">
                          {l.title}
                          <span className="mt-1 block text-[10px] text-slate-500">
                            {l.completed.length}/3 steps complete
                          </span>
                        </span>
                      </button>
                    ))}
                  </nav>
                </details>
              </aside>
              <div className="min-w-0 space-y-5">
                {!current ? (
                  <ErrorPanel
                    message="This lesson is not in the selected subject."
                    retry={() => onSelect(data.lessons[0]!.id)}
                  />
                ) : lesson.isPending ? (
                  <Loading />
                ) : lesson.isError ? (
                  <ErrorPanel
                    message={lesson.error.message}
                    retry={() => void lesson.refetch()}
                  />
                ) : (
                  <LessonPlayer
                    key={lesson.data.id}
                    lesson={lesson.data}
                    subject={subject}
                  />
                )}
                <div className="flex flex-wrap justify-between gap-3">
                  <Button
                    variant="outline"
                    disabled={index <= 0}
                    onClick={() => onSelect(data.lessons[index - 1]!.id)}
                  >
                    <ChevronLeft className="size-4" /> Previous lesson
                  </Button>
                  <Button
                    variant="outline"
                    disabled={index < 0 || index >= data.lessons.length - 1}
                    onClick={() => onSelect(data.lessons[index + 1]!.id)}
                  >
                    Next lesson <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </Container>
    </div>
  )
}

function LessonPlayer({
  lesson,
  subject,
}: {
  lesson: LearningLesson
  subject: string
}) {
  const [phase, setPhase] = useState<Phase>('explore')
  const queryClient = useQueryClient()
  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['kidilearn', 'library'] }),
      queryClient.invalidateQueries({
        queryKey: ['kidilearn', 'lesson', lesson.id],
      }),
      queryClient.invalidateQueries({ queryKey: ['kidilearn', 'dashboard'] }),
    ])
  }
  const explore = useMutation({
    mutationFn: () => api.post(`/learn/kidilearn/lessons/${lesson.id}/explore`),
    onSuccess: async () => {
      await refresh()
      setPhase('play')
      toast.success('Explore step saved. Let’s practise!')
    },
    onError: (e) => toast.error(e.message),
  })
  const content = lesson.content
  return (
    <>
      <div>
        <p className="text-xs font-bold tracking-wider text-teal-700 uppercase">
          {lesson.strand}
        </p>
        <h2 className="mt-2 text-2xl leading-snug font-black break-words text-primary">
          {lesson.title}
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2" aria-label="Lesson steps">
        {phases.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={phase === p.id}
            onClick={() => setPhase(p.id)}
            className={cn(
              'flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-3 text-xs font-bold sm:flex-row sm:gap-2 sm:text-sm',
              phase === p.id
                ? 'border-teal-700 bg-teal-700 text-white'
                : 'bg-white text-teal-950',
            )}
          >
            <p.icon className="size-4" />
            <span>
              {p.title}
              {lesson.completed.includes(p.id) ? ' ✓' : ''}
            </span>
          </button>
        ))}
      </div>
      {phase === 'explore' ? (
        <div className="space-y-5">
          <section className={panel}>
            <h3 className="flex items-center gap-2 font-black">
              <Sparkles className="size-5 text-amber-600" /> Today I can…
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {content.goals.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </section>
          <section className={panel}>
            <h3 className="font-black">Watch and notice</h3>
            <LessonVideo
              key={content.video}
              title={lesson.title}
              video={content.video}
              scenes={content.scenes}
              source={content.sourceVideo}
            />
          </section>
          <section className={panel}>
            <h3 className="font-black">Let’s discover</h3>
            {content.visualGuide ? (
              <VisualStory key={lesson.id} lesson={lesson} />
            ) : (
              content.illustration && (
                <img
                  src={content.illustration}
                  alt={`Illustrated model for ${lesson.title}`}
                  loading="lazy"
                  className="mt-4 max-h-96 w-full rounded-2xl object-contain"
                />
              )
            )}
            <div className="mt-3 space-y-3 text-sm leading-7">
              {content.notes.map((note, i) => (
                <p key={i}>{note}</p>
              ))}
            </div>
            {content.passage && (
              <blockquote className="mt-5 rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-4 text-base leading-8">
                {content.passage}
              </blockquote>
            )}
            {content.examples.length > 0 && (
              <div className="mt-5 space-y-3">
                <h4 className="text-sm font-bold">Think it through</h4>
                {content.examples.map((e, i) => (
                  <details
                    key={i}
                    className="rounded-xl bg-slate-50 p-3 text-sm"
                  >
                    <summary className="cursor-pointer font-semibold leading-relaxed">
                      {e.question}
                    </summary>
                    <p className="mt-3 leading-relaxed text-teal-800">
                      {e.answer}
                    </p>
                  </details>
                ))}
              </div>
            )}
            {content.sourceLesson && <SourceDetails lesson={lesson} />}
          </section>
          <LearningActivity subject={subject} lesson={lesson} />
          <section className={panel}>
            <h3 className="font-black">Away from the screen</h3>
            <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-relaxed">
              {content.activities.filter(Boolean).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            {content.home && (
              <p className="mt-4 text-sm leading-relaxed">{content.home}</p>
            )}
            {subject === 'english' && (
              <p className="mt-4 text-xs text-slate-500">
                Practise reading, speaking and writing with a parent or teacher
                too.
              </p>
            )}
          </section>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              className="h-auto min-h-11 whitespace-normal"
              disabled={explore.isPending}
              onClick={() => explore.mutate()}
            >
              {explore.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}{' '}
              Save Explore & start Play
            </Button>
            <a
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-teal-800"
              href={content.pdf}
              target="_blank"
              rel="noreferrer"
            >
              <Download className="size-4" /> Learner guide (PDF)
            </a>
            <a
              className="inline-flex min-h-11 items-center text-sm font-semibold text-teal-800"
              href={content.epub}
              download
            >
              EPUB
            </a>
          </div>
        </div>
      ) : (
        <QuestionSession
          key={`${lesson.id}-${phase}`}
          lessonId={lesson.id}
          phase={phase}
          questions={lesson[phase]}
          onSaved={refresh}
          onContinue={() =>
            setPhase(phase === 'play' ? 'challenge' : 'explore')
          }
        />
      )}
    </>
  )
}

function QuestionSession({
  lessonId,
  phase,
  questions,
  onSaved,
  onContinue,
}: {
  lessonId: number
  phase: 'play' | 'challenge'
  questions: Array<LearningQuestion>
  onSaved: () => Promise<void>
  onContinue: () => void
}) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [feedback, setFeedback] = useState<
    Record<
      number,
      { correct: boolean; correctIndex: number; explanation: string }
    >
  >({})
  const [result, setResult] = useState<LearningResult | null>(null)
  const q = questions[index]
  const checked = q ? feedback[q.id] : undefined
  const check = useMutation({
    mutationFn: ({
      questionId,
      optionIndex,
    }: {
      questionId: number
      optionIndex: number
    }) =>
      api.post<{ correct: boolean; correctIndex: number; explanation: string }>(
        `/learn/kidilearn/lessons/${lessonId}/check`,
        { questionId, optionIndex },
      ),
    onSuccess: (r, answer) =>
      setFeedback((previous) => ({ ...previous, [answer.questionId]: r })),
    onError: (e) => toast.error(e.message),
  })
  const submit = useMutation({
    mutationFn: () =>
      api.post<LearningResult>(`/learn/kidilearn/lessons/${lessonId}/submit`, {
        phase,
        answers: questions.map((question) => ({
          questionId: question.id,
          optionIndex: answers[question.id],
        })),
      }),
    onSuccess: async (r) => {
      setResult(r)
      if (r.passed) await onSaved()
    },
    onError: (e) => toast.error(e.message),
  })
  const answered = Object.keys(answers).length
  if (!q)
    return (
      <div role="alert" className={panel}>
        This activity has no questions yet. Try another lesson.
      </div>
    )
  if (result)
    return (
      <section className={panel}>
        <Trophy className="size-10 text-amber-600" />
        <h3 className="mt-3 text-2xl font-black">
          {result.passed ? 'You did it!' : 'Keep exploring. You’re learning.'}
        </h3>
        <p className="mt-3 text-lg font-bold">
          {result.correct} of {result.total} correct · {result.score}%
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {result.passed
            ? 'This step is complete and your progress is saved.'
            : 'Aim for 70% to complete this step. Review the explanations and try again.'}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={onContinue}>
            {phase === 'play' ? 'Try the challenge' : 'Back to Explore'}{' '}
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({})
              setFeedback({})
              setResult(null)
              setIndex(0)
            }}
          >
            Try again
          </Button>
        </div>
        <details className="mt-6">
          <summary className="cursor-pointer text-sm font-bold">
            Review my answers
          </summary>
          <ol className="mt-4 space-y-4">
            {result.results.map((r, i) => (
              <li
                key={r.questionId}
                className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed"
              >
                <p className="font-semibold">
                  {r.correct ? '✓' : '↻'} {i + 1}. {questions[i]!.question}
                </p>
                <p className="mt-2 text-teal-800">
                  Answer: {questions[i]!.options[r.correctIndex]}
                </p>
                <p className="mt-1">{r.explanation}</p>
              </li>
            ))}
          </ol>
        </details>
      </section>
    )
  return (
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-teal-800">
        <span>
          {phase === 'play' ? 'Practice with feedback' : 'Show what you know'}
        </span>
        <span>
          Question {index + 1} of {questions.length}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        {phase === 'play'
          ? 'Choose an answer, then check it. Finish with 70% to save this step.'
          : 'Answer all questions. Your score and explanations appear when you finish.'}
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-teal-600"
          style={{ width: `${(answered / questions.length) * 100}%` }}
        />
      </div>
      <fieldset
        disabled={
          submit.isPending ||
          check.isPending ||
          (phase === 'play' && Boolean(checked))
        }
        className="mt-6 min-w-0"
      >
        <legend className="w-full text-lg leading-relaxed font-normal whitespace-pre-line break-words">
          {q.question}
        </legend>
        <QuestionVisual visual={q.visual} />
        <div className="mt-4 space-y-3">
          {q.interaction ? (
            <PlayInteractionView
              key={q.id}
              question={q}
              answerIndex={answers[q.id]}
              onAnswer={(value) =>
                setAnswers((previous) => {
                  const next = { ...previous }
                  if (value === undefined) delete next[q.id]
                  else next[q.id] = value
                  return next
                })
              }
            />
          ) : (
            q.options.map((option, i) => (
              <label
                key={i}
                className={cn(
                  'flex min-h-12 cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 text-sm leading-relaxed',
                  answers[q.id] === i
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-slate-100 bg-white',
                )}
              >
                <input
                  type="radio"
                  className="mt-1 size-4 shrink-0 accent-teal-700"
                  name={`question-${q.id}`}
                  checked={answers[q.id] === i}
                  onChange={() =>
                    setAnswers((previous) => ({ ...previous, [q.id]: i }))
                  }
                />
                <span className="min-w-0 break-words">{option}</span>
              </label>
            ))
          )}
        </div>
      </fieldset>
      {phase === 'play' && (
        <div className="mt-4">
          {checked ? (
            <div
              role="status"
              className={cn(
                'rounded-xl p-4 text-sm leading-relaxed',
                checked.correct
                  ? 'bg-teal-50 text-teal-950'
                  : 'bg-amber-50 text-amber-950',
              )}
            >
              <p className="font-bold">
                {checked.correct
                  ? 'That’s right!'
                  : 'Good try. Let’s learn from it.'}
              </p>
              <p className="mt-1">{checked.explanation}</p>
              {!checked.correct && (
                <p className="mt-2">
                  Answer: {q.options[checked.correctIndex]}
                </p>
              )}
            </div>
          ) : (
            <Button
              disabled={answers[q.id] === undefined || check.isPending}
              onClick={() =>
                check.mutate({ questionId: q.id, optionIndex: answers[q.id]! })
              }
            >
              {check.isPending && <Loader2 className="size-4 animate-spin" />}{' '}
              Check my answer
            </Button>
          )}
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Button
          variant="outline"
          disabled={index === 0 || submit.isPending || check.isPending}
          onClick={() => setIndex(index - 1)}
        >
          <ChevronLeft className="size-4" /> Back
        </Button>
        {index < questions.length - 1 ? (
          <Button
            disabled={
              answers[q.id] === undefined ||
              submit.isPending ||
              check.isPending ||
              (phase === 'play' && !checked)
            }
            onClick={() => setIndex(index + 1)}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        ) : (
          <Button
            disabled={
              answered !== questions.length ||
              submit.isPending ||
              check.isPending ||
              (phase === 'play' && !checked)
            }
            onClick={() => submit.mutate()}
          >
            {submit.isPending && <Loader2 className="size-4 animate-spin" />}{' '}
            Finish {phase === 'play' ? 'Play' : 'challenge'}
          </Button>
        )}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {answered} of {questions.length} answered
      </p>
    </section>
  )
}

function Loading() {
  return (
    <div
      role="status"
      className="flex min-h-40 items-center justify-center gap-3"
    >
      <Loader2 className="size-5 animate-spin" /> Loading your learning
      adventure…
    </div>
  )
}
function ErrorPanel({
  message,
  retry,
}: {
  message: string
  retry: () => void
}) {
  return (
    <div role="alert" className={panel}>
      <p className="text-sm">{message}</p>
      <Button variant="outline" className="mt-4" onClick={retry}>
        Try again
      </Button>
    </div>
  )
}
