import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  Clock3,
  GraduationCap,
  Loader2,
  Pencil,
  Plus,
  Shuffle,
  Sparkles,
  Sprout,
  Sun,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { api } from '#/lib/api-client'
import { cn } from '#/lib/utils'
import {
  DAYS,
  LEVELS,
  STAGES,
  SUBJECTS,
  newPlan,
  planSchema,
  subjectsForLevel,
} from '#/lib/kidilearn/catalog'
import type {
  KidiDashboard,
  LevelId,
  StudyPlan,
  SubjectId,
  SubjectPlan,
} from '#/lib/kidilearn/catalog'
import { Container } from '#/components/site/kit'
import { Button } from '#/components/ui/button'

const selectClass =
  'mt-1.5 h-11 w-full min-w-0 rounded-xl border bg-white px-3 text-sm text-primary focus:outline-2 focus:outline-offset-2 focus:outline-cyan-600'

export function KidiDashboardView({ data }: { data: KidiDashboard }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [level, setLevel] = useState<LevelId>(
    data.preferredLevel ??
      data.plans[0]?.level ??
      data.courses.find((c) => c.interactive)?.level ??
      'b1',
  )
  const [editing, setEditing] = useState(false)
  const [drafts, setDrafts] = useState<Partial<Record<LevelId, StudyPlan>>>({})
  const saved = data.plans.find((p) => p.level === level)
  const draft = drafts[level] ?? saved ?? newPlan(level)
  const levelInfo = LEVELS.find((l) => l.id === level)!
  const isEditing = editing || !saved || Boolean(drafts[level])
  const setDraft = (next: StudyPlan) =>
    setDrafts((previous) => ({ ...previous, [level]: next }))
  const save = useMutation({
    mutationFn: (plan: StudyPlan) => api.put('/learn/kidilearn/plan', plan),
    onSuccess: async (_, plan) => {
      await queryClient.invalidateQueries({
        queryKey: ['kidilearn', 'dashboard'],
      })
      setDrafts((previous) => {
        const next = { ...previous }
        delete next[plan.level]
        return next
      })
      setEditing(false)
      toast.success('Your study plan is ready!')
    },
    onError: (error) => toast.error(error.message),
  })
  const startQuiz = useMutation({
    mutationFn: (subjectId: SubjectId) =>
      api.post<{ id: string }>('/learn/kidilearn/quizzes', {
        level,
        subjectId,
      }),
    onSuccess: (result) => {
      void queryClient.invalidateQueries({
        queryKey: ['kidilearn', 'dashboard'],
      })
      void navigate({
        to: '/learn/kidilearn/quiz/$id',
        params: { id: result.id },
      })
    },
    onError: (error) => toast.error(error.message),
  })
  const attempts = data.attempts.filter((a) => a.level === level)
  const courses = data.courses.filter((c) => c.level === level)
  const updateSubject = (id: SubjectId, changes: Partial<SubjectPlan>) =>
    setDraft({
      ...draft,
      subjects: draft.subjects.map((s) =>
        s.subjectId === id ? { ...s, ...changes } : s,
      ),
    })
  const toggleSubject = (subjectId: SubjectId) => {
    const hasSubject = draft.subjects.some((s) => s.subjectId === subjectId)
    setDraft({
      ...draft,
      subjects: hasSubject
        ? draft.subjects.filter((s) => s.subjectId !== subjectId)
        : [
            ...draft.subjects,
            {
              subjectId,
              quizEnabled: true,
              questionCount: level.startsWith('kg') ? 5 : 10,
              passMark: 70,
            },
          ],
    })
  }

  return (
    <div className="bg-gradient-to-b from-[#fff8e7] via-[#f5fbfc] to-white pb-14">
      <Container className="space-y-7 pt-6 sm:pt-9">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#073e49] px-5 py-8 text-white sm:px-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-8 size-56 rounded-full border-[24px] border-white/5"
          />
          <Sun
            aria-hidden="true"
            className="absolute top-8 right-8 hidden size-20 text-brand-gold sm:block"
            strokeWidth={1.3}
          />
          <div className="relative max-w-2xl sm:pr-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold text-amber-100">
              <Sprout className="size-4" /> OpenLearn for young explorers
            </div>
            <p className="text-3xl font-black tracking-tight sm:text-4xl">
              <span className="text-amber-300">kidi</span>Learn
            </p>
            <h1 className="mt-2 text-3xl leading-tight font-black sm:text-4xl">
              Big dreams. Little steps.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
              Your subjects. Your pace. Your learning adventure — from
              kindergarten to Basic 9.
            </p>
          </div>
          <div className="relative mt-6 flex flex-wrap gap-2 text-xs font-semibold">
            {STAGES.map((stage) => (
              <span
                key={stage}
                className={cn(
                  'rounded-full border px-3 py-1.5',
                  stage === levelInfo.stage
                    ? 'border-amber-200 bg-amber-200 text-primary'
                    : 'border-white/20 text-white/75',
                )}
              >
                {stage}
              </span>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="min-w-0 space-y-4 lg:sticky lg:top-40">
            <div className="rounded-3xl border bg-white p-5">
              <span className="mb-3 flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <GraduationCap className="size-6" />
              </span>
              <label
                htmlFor="kidi-level"
                className="text-sm font-bold text-primary"
              >
                My learning level
              </label>
              <select
                id="kidi-level"
                value={level}
                disabled={save.isPending}
                onChange={(e) => {
                  setLevel(e.target.value as LevelId)
                  setEditing(false)
                }}
                className={selectClass}
              >
                {STAGES.map((stage) => (
                  <optgroup label={stage} key={stage}>
                    {LEVELS.filter((l) => l.stage === stage).map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                        {l.stage === 'JHS' ? ` · ${l.detail}` : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Each level has its own study plan. You can come back to your
                saved plans any time.
              </p>
            </div>
            <div className="rounded-3xl border border-teal-100 bg-teal-50 p-5 text-sm text-teal-950">
              <Sparkles className="mb-2 size-5 text-teal-700" />
              <p className="font-bold">A little learning goes a long way.</p>
              <p className="mt-2 text-xs leading-relaxed text-teal-800">
                Pick a few subjects to start. A parent, guardian or teacher can
                help you build a plan that feels right.
              </p>
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-wider text-teal-700 uppercase">
                  {levelInfo.stage} · {levelInfo.label}
                </p>
                <h2 className="mt-1 text-2xl font-black text-primary">
                  {isEditing
                    ? "Let's build your study plan"
                    : 'My learning space'}
                </h2>
              </div>
              {saved && !isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                  className="rounded-full"
                >
                  <Pencil className="size-4" /> Edit my plan
                </Button>
              )}
            </div>

            {isEditing && courses.some((c) => c.interactive) && (
              <section className="rounded-3xl border border-teal-100 bg-teal-50 p-4 sm:p-5">
                <h3 className="font-bold text-teal-950">Ready to explore</h3>
                <p className="mt-1 text-xs leading-relaxed text-teal-800">
                  Try a subject now, or add it to your study plan below.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {courses
                    .filter((c) => c.interactive)
                    .map((course) => (
                      <Link
                        key={course.subjectId}
                        to="/learn/kidilearn/subjects/$level/$subject"
                        params={{ level, subject: course.subjectId }}
                        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs font-bold text-teal-900"
                      >
                        {SUBJECTS[course.subjectId].name} · {course.lessons}{' '}
                        lessons <ArrowRight className="size-3 shrink-0" />
                      </Link>
                    ))}
                </div>
              </section>
            )}

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const parsed = planSchema.safeParse(draft)
                  if (!parsed.success) {
                    toast.error(
                      parsed.error.issues[0]?.message ??
                        'Check your study plan.',
                    )
                    return
                  }
                  save.mutate(parsed.data)
                }}
              >
                <fieldset
                  disabled={save.isPending}
                  className="min-w-0 space-y-5"
                >
                  <section className="rounded-3xl border bg-white p-4 sm:p-6">
                    <StepHeading
                      number="1"
                      title="Choose your subjects"
                      text="Add the things you'd love to learn. You can change these later."
                    />
                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {subjectsForLevel(level).map((id) => {
                        const subject = SUBJECTS[id]
                        const selected = draft.subjects.some(
                          (s) => s.subjectId === id,
                        )
                        return (
                          <label
                            key={id}
                            className={cn(
                              'flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition',
                              selected
                                ? 'border-teal-600 bg-teal-50/60'
                                : 'border-slate-100 hover:border-teal-200',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="mt-1 size-4 shrink-0 accent-teal-700"
                              checked={selected}
                              onChange={() => toggleSubject(id)}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block text-xl font-medium text-primary">
                                {subject.name}
                              </span>
                              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                {subject.description}
                              </span>
                              <span className="mt-2 block text-[11px] font-semibold text-teal-700">
                                {courses.some((c) => c.subjectId === id)
                                  ? 'Course available'
                                  : 'Lessons coming soon'}
                              </span>
                            </span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                'hidden size-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold min-[400px]:flex',
                                subject.tone,
                              )}
                            >
                              {subject.mark}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                    <p className="mt-4 text-xs text-muted-foreground">
                      You can plan now. Lessons and quizzes will unlock as
                      subject courses are added.
                    </p>
                  </section>

                  <section className="rounded-3xl border bg-white p-4 sm:p-6">
                    <StepHeading
                      number="2"
                      title="Make time to learn"
                      text="Choose your study days and how long each subject session should be."
                    />
                    <div
                      className="mt-5 flex flex-wrap gap-2"
                      aria-label="Study days"
                    >
                      {DAYS.map((day) => (
                        <button
                          key={day.id}
                          type="button"
                          aria-pressed={draft.days.includes(day.id)}
                          aria-label={day.label}
                          onClick={() =>
                            setDraft({
                              ...draft,
                              days: draft.days.includes(day.id)
                                ? draft.days.filter((d) => d !== day.id)
                                : DAYS.filter(
                                    (d) =>
                                      draft.days.includes(d.id) ||
                                      d.id === day.id,
                                  ).map((d) => d.id),
                            })
                          }
                          className={cn(
                            'min-h-11 min-w-12 rounded-xl border px-3 text-sm font-semibold',
                            draft.days.includes(day.id)
                              ? 'border-teal-700 bg-teal-700 text-white'
                              : 'border-slate-200 text-primary hover:bg-slate-50',
                          )}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                    <label className="mt-5 block max-w-xs text-sm font-semibold text-primary">
                      Time per subject session
                      <select
                        value={draft.minutesPerSession}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            minutesPerSession: Number(e.target.value),
                          })
                        }
                        className={selectClass}
                      >
                        {[10, 15, 20, 25, 30, 45, 60].map((n) => (
                          <option value={n} key={n}>
                            {n} minutes
                          </option>
                        ))}
                      </select>
                    </label>
                  </section>

                  <section className="rounded-3xl border bg-white p-4 sm:p-6">
                    <StepHeading
                      number="3"
                      title="Set your final quizzes"
                      text="Finish each subject with a fresh mix of questions and shuffled answer choices."
                    />
                    {!draft.subjects.length ? (
                      <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-muted-foreground">
                        Choose a subject above to set up its final quiz.
                      </p>
                    ) : (
                      <div className="mt-5 space-y-4">
                        {draft.subjects.map((s) => (
                          <div
                            key={s.subjectId}
                            className="rounded-2xl border bg-slate-50/60 p-4"
                          >
                            <label className="flex items-start gap-3 text-sm font-bold text-primary">
                              <input
                                type="checkbox"
                                className="mt-0.5 size-4 shrink-0 accent-teal-700"
                                checked={s.quizEnabled}
                                onChange={(e) =>
                                  updateSubject(s.subjectId, {
                                    quizEnabled: e.target.checked,
                                  })
                                }
                              />
                              {SUBJECTS[s.subjectId].name} final quiz
                            </label>
                            {s.quizEnabled && (
                              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <label className="text-xs font-semibold text-muted-foreground">
                                  Number of questions
                                  <select
                                    aria-label={`${SUBJECTS[s.subjectId].name} question count`}
                                    className={selectClass}
                                    value={s.questionCount}
                                    onChange={(e) =>
                                      updateSubject(s.subjectId, {
                                        questionCount: Number(
                                          e.target.value,
                                        ) as SubjectPlan['questionCount'],
                                      })
                                    }
                                  >
                                    {[5, 10, 15, 20].map((n) => (
                                      <option key={n} value={n}>
                                        {n} random questions
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label className="text-xs font-semibold text-muted-foreground">
                                  My target score
                                  <select
                                    aria-label={`${SUBJECTS[s.subjectId].name} target score`}
                                    className={selectClass}
                                    value={s.passMark}
                                    onChange={(e) =>
                                      updateSubject(s.subjectId, {
                                        passMark: Number(e.target.value),
                                      })
                                    }
                                  >
                                    {[50, 60, 70, 80, 90, 100].map((n) => (
                                      <option key={n} value={n}>
                                        {n}%
                                      </option>
                                    ))}
                                  </select>
                                </label>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4">
                    <p className="text-sm font-semibold text-primary">
                      {draft.subjects.length} subjects · {draft.days.length}{' '}
                      study days
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {saved && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setDrafts((previous) => {
                              const next = { ...previous }
                              delete next[level]
                              return next
                            })
                            setEditing(false)
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button
                        type="submit"
                        className="rounded-xl bg-teal-700 hover:bg-teal-800"
                        disabled={
                          !draft.subjects.length ||
                          !draft.days.length ||
                          save.isPending
                        }
                      >
                        {save.isPending ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Check />
                        )}{' '}
                        Save my plan
                      </Button>
                    </div>
                  </div>
                </fieldset>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-3">
                  {[
                    {
                      icon: BookOpen,
                      value: saved.subjects.length,
                      label: 'My subjects',
                    },
                    {
                      icon: Clock3,
                      value: `${saved.minutesPerSession} min`,
                      label: 'Per session',
                    },
                    {
                      icon: Trophy,
                      value: attempts.filter((a) => a.passed).length,
                      label: 'Quizzes passed',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="min-w-0 rounded-2xl border bg-white p-4"
                    >
                      <item.icon className="size-5 text-teal-700" />
                      <p className="mt-3 text-2xl font-black text-primary">
                        {item.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <section className="rounded-3xl border bg-white p-4 sm:p-6">
                  <h3 className="flex items-center gap-2 font-bold text-primary">
                    <CalendarDays className="size-5 text-teal-700" /> My weekly
                    rhythm
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    One session per subject each week, spread across your chosen
                    days.
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {DAYS.filter((d) => saved.days.includes(d.id)).map(
                      (day, index) => {
                        const scheduled = saved.subjects.filter(
                          (_, i) => i % saved.days.length === index,
                        )
                        return (
                          <div
                            key={day.id}
                            className="min-w-0 rounded-2xl bg-[#f4f8ed] p-4"
                          >
                            <h4 className="text-sm font-bold text-primary">
                              {day.label}
                            </h4>
                            {scheduled.length ? (
                              <ul className="mt-2 space-y-2">
                                {scheduled.map((s) => (
                                  <li
                                    key={s.subjectId}
                                    className="text-xs leading-relaxed text-slate-700"
                                  >
                                    {SUBJECTS[s.subjectId].name}
                                    <span className="block text-slate-500">
                                      {saved.minutesPerSession} minutes
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-xs text-slate-600">
                                A little review or extra practice.
                              </p>
                            )}
                          </div>
                        )
                      },
                    )}
                  </div>
                </section>

                <section>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-black text-primary">
                      My subjects
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700"
                    >
                      <Plus className="size-4" /> Add a subject
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {saved.subjects.map((s) => {
                      const subject = SUBJECTS[s.subjectId]
                      const course = courses.find(
                        (c) => c.subjectId === s.subjectId,
                      )
                      const ready = Boolean(
                        course?.canQuiz &&
                        course.questionCount >= s.questionCount,
                      )
                      const pending = attempts.find(
                        (a) => a.subjectId === s.subjectId && !a.submittedAt,
                      )
                      return (
                        <article
                          key={s.subjectId}
                          className="flex min-w-0 flex-col rounded-3xl border bg-white p-5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span
                              aria-hidden="true"
                              className={cn(
                                'flex size-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold',
                                subject.tone,
                              )}
                            >
                              {subject.mark}
                            </span>
                            <span
                              className={cn(
                                'rounded-full px-3 py-2 text-sm font-medium',
                                course
                                  ? 'bg-blue-50 text-primary'
                                  : 'bg-amber-50 text-amber-800',
                              )}
                            >
                              {course
                                ? 'Ready to explore'
                                : 'Lessons coming soon'}
                            </span>
                          </div>
                          <h4 className="mt-4 text-2xl leading-tight font-medium text-primary sm:text-3xl">
                            {subject.name}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                            {subject.description}
                          </p>
                          <div className="mt-4 flex-1">
                            {course ? (
                              <>
                                <p className="text-xs text-muted-foreground">
                                  {course.lessons} lessons · {course.progress}%
                                  complete
                                </p>
                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-teal-600"
                                    style={{
                                      width: `${Math.min(100, course.progress)}%`,
                                    }}
                                  />
                                </div>
                                <Button
                                  asChild
                                  className="mt-4 w-full rounded-xl bg-accent text-accent-foreground hover:bg-background hover:text-foreground"
                                  variant="outline"
                                >
                                  {course.interactive ? (
                                    <Link
                                      to="/learn/kidilearn/subjects/$level/$subject"
                                      params={{ level, subject: s.subjectId }}
                                    >
                                      {course.progress
                                        ? 'Continue learning'
                                        : 'Explore lessons'}
                                      <ArrowRight className="size-4" />
                                    </Link>
                                  ) : (
                                    <Link
                                      to="/learn/c/$slug"
                                      params={{ slug: course.slug }}
                                    >
                                      {course.progress
                                        ? 'Continue learning'
                                        : 'Explore course'}
                                      <ArrowRight className="size-4" />
                                    </Link>
                                  )}
                                </Button>
                              </>
                            ) : (
                              <p className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-muted-foreground">
                                You're all set. Your subject lessons will appear
                                here when they are added.
                              </p>
                            )}
                          </div>
                          {s.quizEnabled ? (
                            <div className="mt-4 border-t pt-4">
                              <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                <Shuffle className="size-3.5" />{' '}
                                {s.questionCount} random questions · Target{' '}
                                {s.passMark}%
                              </p>
                              {pending ? (
                                <Button
                                  asChild
                                  variant="outline"
                                  className="mt-3 w-full rounded-xl"
                                >
                                  <Link
                                    to="/learn/kidilearn/quiz/$id"
                                    params={{ id: pending.id }}
                                  >
                                    Resume final quiz
                                  </Link>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="mt-3 w-full rounded-xl"
                                  disabled={!ready || startQuiz.isPending}
                                  onClick={() => startQuiz.mutate(s.subjectId)}
                                >
                                  {startQuiz.isPending &&
                                  startQuiz.variables === s.subjectId ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <Shuffle />
                                  )}{' '}
                                  {ready
                                    ? 'Start final quiz'
                                    : 'Final quiz not ready yet'}
                                </Button>
                              )}
                              {!ready && !pending && (
                                <p className="mt-2 text-[11px] text-muted-foreground">
                                  {course && !course.canQuiz
                                    ? 'Enrol in the course to unlock its quiz.'
                                    : `Unlocks when ${s.questionCount} subject questions are available.`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="mt-4 border-t pt-4 text-xs text-muted-foreground">
                              Final quiz is off. Turn it on in your plan.
                            </p>
                          )}
                        </article>
                      )
                    })}
                  </div>
                </section>

                {attempts.some((a) => a.submittedAt) && (
                  <section className="rounded-3xl border bg-white p-5">
                    <h3 className="mb-3 font-bold text-primary">
                      My quiz journey
                    </h3>
                    <ul className="divide-y">
                      {attempts
                        .filter((a) => a.submittedAt)
                        .slice(0, 6)
                        .map((a) => (
                          <li key={a.id}>
                            <Link
                              to="/learn/kidilearn/quiz/$id"
                              params={{ id: a.id }}
                              className="flex items-center justify-between gap-3 py-3 text-sm"
                            >
                              <span className="min-w-0 font-medium">
                                {SUBJECTS[a.subjectId].name}
                                <span className="block text-xs text-muted-foreground">
                                  {a.questionCount} questions ·{' '}
                                  {a.passed
                                    ? 'Target reached!'
                                    : 'Keep practising'}
                                </span>
                              </span>
                              <span className="shrink-0 font-black text-teal-700">
                                {a.score}%
                              </span>
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

function StepHeading({
  number,
  title,
  text,
}: {
  number: string
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-black text-amber-900">
        {number}
      </span>
      <div className="min-w-0">
        <h3 className="font-bold text-primary">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {text}
        </p>
      </div>
    </div>
  )
}
