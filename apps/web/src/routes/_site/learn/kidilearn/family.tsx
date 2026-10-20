import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Copy, KeyRound, Loader2, Plus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '#/lib/api-client'
import { CHILD_AVATARS } from '#/lib/kidilearn/family'
import type {
  ChildAvatar,
  ChildProfile,
  ChildReport,
} from '#/lib/kidilearn/family'
import { DAYS, LEVELS, SUBJECTS } from '#/lib/kidilearn/catalog'
import type { SubjectId } from '#/lib/kidilearn/catalog'
import { Container, ImageUpload } from '#/components/site/kit'
import { ChildPicture } from '#/components/kidilearn/child-picture'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/_site/learn/kidilearn/family')({
  component: FamilyPage,
})
const inputClass =
  'mt-2 block h-12 w-full min-w-0 rounded-xl border bg-white px-3 text-base text-primary'
const panel = 'min-w-0 rounded-3xl border bg-white p-5 sm:p-7'
const levelName = (level: string) =>
  LEVELS.find((l) => l.id === level)?.label ?? level
const subjectName = (id: string) =>
  Object.hasOwn(SUBJECTS, id) ? SUBJECTS[id as SubjectId].name : id
const dateLabel = (date: string | null) =>
  date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'No activity yet'

function FamilyPage() {
  const client = useQueryClient()
  const [selected, setSelected] = useState<number>()
  const [issued, setIssued] = useState<{ name: string; code: string } | null>(
    null,
  )
  const [name, setName] = useState('')
  const [level, setLevel] = useState('b3')
  const [avatar, setAvatar] = useState<ChildAvatar>('sun')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const family = useQuery({
    queryKey: ['kidilearn', 'family'],
    queryFn: () =>
      api.get<{ children: Array<ChildProfile> }>('/learn/kidilearn/family'),
  })
  const selectedId = selected ?? family.data?.children[0]?.id
  const child = family.data?.children.find((c) => c.id === selectedId)
  const report = useQuery({
    queryKey: ['kidilearn', 'family', selectedId, 'report'],
    queryFn: () =>
      api.get<ChildReport>(`/learn/kidilearn/family/${selectedId}/report`),
    enabled: Boolean(child),
  })
  const refresh = () =>
    client.invalidateQueries({ queryKey: ['kidilearn', 'family'] })
  const create = useMutation({
    mutationFn: (data: {
      name: string
      level: string
      avatar: ChildAvatar
      photoUrl: string | null
    }) =>
      api.post<{ id: number; code: string }>('/learn/kidilearn/family', data),
    onSuccess: async (result, data) => {
      setIssued({ name: data.name, code: result.code })
      setSelected(result.id)
      setName('')
      setPhotoUrl(null)
      await refresh()
      toast.success('Learner profile created')
    },
    onError: (error) => toast.error(error.message),
  })
  return (
    <div className="bg-gradient-to-b from-blue-50 via-amber-50/50 to-white pb-14">
      <Container className="space-y-6 py-6">
        <header className="rounded-3xl bg-primary p-6 text-white sm:p-9">
          <div className="flex items-center gap-3">
            <Users className="size-9 shrink-0 text-amber-300" aria-hidden="true" />
            <h1 className="min-w-0 text-3xl sm:text-4xl">Growing together</h1>
          </div>
          <p className="mt-3 max-w-2xl text-white/85">
            A learning space for each child. Create their profile, share their
            access code and celebrate their progress.
          </p>
        </header>
        {issued && (
          <section
            className="rounded-3xl border border-amber-300 bg-amber-50 p-5"
            role="status"
          >
            <h3 className="text-2xl text-primary">
              {issued.name}’s access code
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Save this code and share it with your child. It is shown only now;
              you can generate a new one whenever needed.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <code className="max-w-full break-all rounded-xl bg-white p-3 text-lg font-medium tracking-wider text-primary sm:text-2xl">
                {issued.code}
              </code>
              <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(issued.code)
                    toast.success('Code copied')
                  } catch {
                    toast.error('Select the code and copy it manually.')
                  }
                }}
              >
                <Copy className="size-4" /> Copy code
              </Button>
              <button
                className="min-h-11 px-2 text-sm text-primary underline"
                onClick={() => setIssued(null)}
              >
                I’ve saved it
              </button>
            </div>
            <p className="mt-3 text-sm">
              Child sign-in:{' '}
              <Link
                to="/learn/kidilearn/login"
                className="font-medium text-primary underline"
              >
                Open the access-code page
              </Link>
            </p>
          </section>
        )}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)]">
          <aside className="min-w-0 space-y-5">
            <section className={panel}>
              <h3 className="text-2xl text-primary">Your learners</h3>
              {family.isPending ? (
                <p className="mt-3 text-sm">Loading learners…</p>
              ) : family.isError ? (
                <p role="alert" className="mt-3 text-sm">
                  {family.error.message}{' '}
                  <button
                    className="underline"
                    onClick={() => void family.refetch()}
                  >
                    Try again
                  </button>
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {family.data.children.length === 0 && (
                    <p className="text-sm text-slate-600">
                      Add your first learner below.
                    </p>
                  )}
                  {family.data.children.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      aria-pressed={selectedId === c.id}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left ${selectedId === c.id ? 'border-primary bg-blue-50' : 'bg-white'}`}
                    >
                      <ChildPicture
                        name={c.name}
                        photoUrl={c.photoUrl}
                        avatar={c.avatar}
                      />
                      <span className="min-w-0">
                        <span className="block break-words text-lg font-medium text-primary">
                          {c.name}
                        </span>
                        <span className="text-xs text-slate-600">
                          {levelName(c.level)}
                          {!c.active && ' · Access paused'}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </section>
            <section className={panel}>
              <h3 className="text-2xl text-primary">Add a child</h3>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!uploadingPhoto)
                    create.mutate({
                      name: name.trim(),
                      level,
                      avatar,
                      photoUrl,
                    })
                }}
              >
                <label className="block text-sm text-primary">
                  First name or nickname
                  <input
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={60}
                    required
                    autoComplete="off"
                  />
                </label>
                <label className="block text-sm text-primary">
                  Starting level
                  <select
                    className={inputClass}
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    {LEVELS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>
                <PhotoField
                  value={photoUrl}
                  onChange={setPhotoUrl}
                  onUploadingChange={setUploadingPhoto}
                />
                <AvatarPicker value={avatar} onChange={setAvatar} />
                <Button
                  className="h-auto min-h-12 w-full whitespace-normal"
                  disabled={create.isPending || uploadingPhoto || !name.trim()}
                >
                  {create.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}{' '}
                  Create profile & access code
                </Button>
              </form>
            </section>
          </aside>
          <div className="min-w-0 space-y-5">
            {child ? (
              <>
                <ProfileSettings
                  key={`${child.id}-${child.active}-${child.name}-${child.level}-${child.photoUrl}-${child.avatar}`}
                  child={child}
                  refresh={refresh}
                  onCode={(code) => setIssued({ name: child.name, code })}
                />
                {report.isPending ? (
                  <div className={panel}>Loading progress…</div>
                ) : report.isError ? (
                  <div role="alert" className={panel}>
                    {report.error.message}{' '}
                    <Button
                      variant="outline"
                      onClick={() => void report.refetch()}
                    >
                      Try again
                    </Button>
                  </div>
                ) : (
                  <ProgressReport report={report.data} />
                )}
              </>
            ) : (
              <section className={panel}>
                <h3 className="text-2xl text-primary">
                  Every learner has their own journey
                </h3>
                <p className="mt-3 text-slate-600">
                  Their study plans, completed lesson steps and quiz results
                  will appear here. Child access codes open only kidiLearn.
                </p>
              </section>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}

function PhotoField({
  value,
  onChange,
  onUploadingChange,
}: {
  value: string | null
  onChange: (value: string | null) => void
  onUploadingChange: (uploading: boolean) => void
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-primary">Profile picture (optional)</p>
      <ImageUpload
        value={value}
        onChange={onChange}
        onUploadingChange={onUploadingChange}
        folder="avatars"
        aspect="aspect-square"
        className="w-36 max-w-full"
        label="Upload photo"
      />
      <p className="text-xs text-slate-500">
        Your photo appears on the learner’s profile and progress report. Save
        the profile to apply changes.
      </p>
    </div>
  )
}

function AvatarPicker({
  value,
  onChange,
}: {
  value: ChildAvatar
  onChange: (value: ChildAvatar) => void
}) {
  return (
    <fieldset>
      <legend className="text-sm text-primary">Choose a fallback avatar</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {Object.entries(CHILD_AVATARS).map(([key, icon]) => (
          <button
            key={key}
            type="button"
            aria-label={key}
            aria-pressed={value === key}
            onClick={() => onChange(key as ChildAvatar)}
            className={`flex size-11 items-center justify-center rounded-xl border text-2xl ${value === key ? 'border-primary bg-blue-100' : 'bg-white'}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function ProfileSettings({
  child,
  refresh,
  onCode,
}: {
  child: ChildProfile
  refresh: () => Promise<void>
  onCode: (code: string) => void
}) {
  const [name, setName] = useState(child.name),
    [level, setLevel] = useState(child.level),
    [avatar, setAvatar] = useState(child.avatar),
    [photoUrl, setPhotoUrl] = useState(child.photoUrl),
    [uploadingPhoto, setUploadingPhoto] = useState(false)
  const update = useMutation({
    mutationFn: (active: boolean) =>
      api.patch(`/learn/kidilearn/family/${child.id}`, {
        name: name.trim(),
        level,
        avatar,
        active,
        photoUrl,
      }),
    onSuccess: async () => {
      await refresh()
      toast.success('Learner profile updated')
    },
    onError: (error) => toast.error(error.message),
  })
  const reset = useMutation({
    mutationFn: () =>
      api.post<{ code: string }>(`/learn/kidilearn/family/${child.id}/code`),
    onSuccess: (result) => {
      onCode(result.code)
      toast.success(
        'New code created. The previous code and child sessions are closed.',
      )
    },
    onError: (error) => toast.error(error.message),
  })
  return (
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-4">
          <ChildPicture
            name={child.name}
            photoUrl={child.photoUrl}
            avatar={child.avatar}
            className="size-20 text-4xl"
          />
          <div className="min-w-0">
            <h2 className="text-3xl text-primary">{child.name}’s progress</h2>
            <p className="mt-2 text-sm text-slate-600">
              Last sign-in: {dateLabel(child.lastLoginAt)}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-2 text-sm ${child.active ? 'bg-teal-50 text-teal-800' : 'bg-amber-50 text-amber-900'}`}
        >
          {child.active ? 'Access active' : 'Access paused'}
        </span>
      </div>
      <details className="mt-5">
        <summary className="cursor-pointer py-2 text-sm text-primary">
          Profile & access settings
        </summary>
        <form
          className="mt-4 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!uploadingPhoto) update.mutate(child.active)
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Name
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
              />
            </label>
            <label className="text-sm">
              Preferred level
              <select
                className={inputClass}
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <PhotoField
            value={photoUrl}
            onChange={setPhotoUrl}
            onUploadingChange={setUploadingPhoto}
          />
          <AvatarPicker value={avatar} onChange={setAvatar} />
          <Button disabled={update.isPending || uploadingPhoto || !name.trim()}>
            Save profile
          </Button>
        </form>
        <div className="mt-5 border-t pt-4">
          <p className="mb-3 text-sm text-slate-600">
            A new code replaces the old one and signs out this child on all
            devices. Pausing access keeps their saved progress.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={reset.isPending}
              onClick={() => reset.mutate()}
            >
              <KeyRound className="size-4" /> Generate a new code
            </Button>
            <Button
              variant="outline"
              disabled={update.isPending || uploadingPhoto || !name.trim()}
              onClick={() => update.mutate(!child.active)}
            >
              {child.active ? 'Pause child access' : 'Resume child access'}
            </Button>
          </div>
        </div>
      </details>
    </section>
  )
}

function ProgressReport({ report }: { report: ChildReport }) {
  const totalSteps = report.subjects.reduce((sum, s) => sum + s.lessons * 3, 0)
  const completed = report.subjects.reduce(
    (sum, s) => sum + s.completedSteps,
    0,
  )
  const finals = report.subjects.reduce((sum, s) => sum + s.finalAttempts, 0)
  const passes = report.subjects.reduce((sum, s) => sum + s.finalPasses, 0)
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setUTCDate(date.getUTCDate() - 6 + i)
    const key = date.toISOString().slice(0, 10)
    return {
      key,
      label: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      count:
        report.weeklyActivity.find((d) => d.date === key)?.submissions ?? 0,
    }
  })
  const maximum = Math.max(1, ...days.map((d) => d.count))
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ['Lesson steps completed', `${completed} / ${totalSteps}`],
          ['Final quizzes finished', String(finals)],
          ['Final targets reached', String(passes)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border bg-white p-5">
            <p className="text-xs text-slate-600">{label}</p>
            <p className="mt-2 text-3xl font-medium text-primary">{value}</p>
          </div>
        ))}
      </div>
      <section className={panel}>
        <h3 className="text-2xl text-primary">Learning this week</h3>
        <p className="mt-2 text-sm text-slate-600">
          Practice and final-quiz submissions over the last seven days,
          including retries.
        </p>
        <div className="mt-6 grid grid-cols-7 items-end gap-2">
          {days.map((d) => (
            <div
              key={d.key}
              className="text-center"
              aria-label={`${d.label}: ${d.count} submissions`}
            >
              <span className="text-sm text-primary">{d.count}</span>
              <div className="mt-2 flex h-24 items-end rounded-lg bg-blue-50">
                <div
                  className="w-full rounded-lg bg-primary"
                  style={{ height: `${(d.count / maximum) * 100}%` }}
                />
              </div>
              <span className="mt-2 block text-xs text-slate-600">
                {d.label}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className={panel}>
        <h3 className="text-2xl text-primary">Study plans</h3>
        {report.plans.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Your child can choose subjects and save a study plan after signing
            in with their code.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {report.plans.map((plan) => (
              <div key={plan.level} className="rounded-2xl bg-blue-50/60 p-4">
                <h4 className="text-xl text-primary">
                  {levelName(plan.level)}
                </h4>
                <p className="mt-2 text-sm">
                  {plan.days
                    .map((day) => DAYS.find((d) => d.id === day)?.label ?? day)
                    .join(', ')}{' '}
                  · {plan.minutesPerSession} minutes per planned session
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  {plan.subjects.map((s) => (
                    <li key={s.subjectId}>
                      <span className="font-medium text-primary">
                        {subjectName(s.subjectId)}
                      </span>
                      {s.quizEnabled
                        ? ` · ${s.questionCount}-question final · ${s.passMark}% target`
                        : ' · Final quiz off'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className={panel}>
        <h3 className="text-2xl text-primary">Subject progress</h3>
        {report.subjects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            Progress appears when a study plan is saved or a lesson is started.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            {report.subjects.map((s) => (
              <article
                key={`${s.level}/${s.subjectId}`}
                className="rounded-2xl border p-4"
              >
                <div className="flex flex-wrap justify-between gap-2">
                  <h4 className="text-xl text-primary">
                    {subjectName(s.subjectId)}
                  </h4>
                  <span className="text-sm text-slate-600">
                    {levelName(s.level)} · {s.progress}%
                  </span>
                </div>
                <div
                  className="mt-3 h-2 overflow-hidden rounded-full bg-blue-50"
                  role="progressbar"
                  aria-label={`${subjectName(s.subjectId)} progress`}
                  aria-valuenow={s.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${s.progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  {s.completedSteps} of {s.lessons * 3} lesson steps complete ·
                  Last activity: {dateLabel(s.lastActivity)}
                </p>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    Practice: {s.practiceAttempts} submissions · Average{' '}
                    {s.practiceAverage === null ? '—' : `${s.practiceAverage}%`}
                  </p>
                  <p>
                    Final quizzes: {s.finalAttempts} finished · Average{' '}
                    {s.finalAverage === null ? '—' : `${s.finalAverage}%`}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      {report.recentQuizzes.length > 0 && (
        <section className={panel}>
          <h3 className="text-2xl text-primary">Recent final quizzes</h3>
          <ul className="mt-4 divide-y">
            {report.recentQuizzes.map((q) => (
              <li
                key={q.id}
                className="flex flex-wrap justify-between gap-2 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-primary">
                    {subjectName(q.subjectId)} · {levelName(q.level)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {dateLabel(q.submittedAt)}
                  </p>
                </div>
                <p className={q.passed ? 'text-teal-800' : 'text-amber-800'}>
                  {q.score}% · {q.passed ? 'Target reached' : 'Keep practising'}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="px-1 text-xs leading-relaxed text-slate-500">
        Reports show saved lesson steps and submitted quizzes. Planned session
        lengths are study goals, not measured time online.
      </p>
    </>
  )
}
