import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Check as Tick, Eye, Loader2, RotateCcw, Volume2, X } from 'lucide-react'
import { ANSWER_SHOWN } from '#/lib/kidilearn/storyboard'
import type { Band, Check } from '#/lib/kidilearn/storyboard'

export type ServerVerdict = {
  correct: boolean
  correctIndex: number
  explanation: string
}
export type Marker = (
  questionId: number,
  optionIndex: number,
) => Promise<ServerVerdict>

type Props = {
  check: Check
  band: Band
  canReteach: boolean
  marker?: Marker
  onSpeak: (text: string, lang?: 'en' | 'fr') => void
  // `correct` is null for a self-marked task, which cannot fail.
  onDone: (result: { correct: boolean | null; tries: number }) => void
  onReteach: () => void
}

const button =
  'th-answer min-h-12 rounded-2xl border-2 border-[var(--th-line)] bg-[var(--th-panel)] px-4 py-3 text-left text-base font-semibold text-[var(--th-ink)] transition hover:border-[var(--th-accent)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--th-accent)] disabled:cursor-default sm:text-lg'
const primary =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--th-accent)] px-5 py-2.5 text-base font-bold text-[var(--th-accent-ink)] transition hover:brightness-110 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--th-accent)] disabled:opacity-50'
const quiet =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--th-line)] bg-[var(--th-panel)] px-5 py-2.5 text-base font-semibold text-[var(--th-ink)] hover:border-[var(--th-accent)]'

// The same picture answered twice in the same order teaches the position, so
// shuffle, but steadily: a re-render must not move the answers under a finger.
function shuffled<T>(items: Array<T>, seed: string) {
  let hash = 7
  for (const c of seed) hash = (hash * 31 + c.charCodeAt(0)) >>> 0
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) >>> 0
    const j = hash % (i + 1)
    ;[out[i], out[j]] = [out[j]!, out[i]!]
  }
  return out
}

export function CheckPanel(props: Props) {
  const { check, onSpeak } = props
  const prompt = check.prompt
  useEffect(() => {
    onSpeak(prompt)
  }, [prompt])
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label="Answer to continue"
      className="border-t-4 border-[var(--th-accent)] bg-[var(--th-bg)] p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <p className="min-w-0 flex-1 text-lg font-bold sm:text-xl">{prompt}</p>
        <button
          type="button"
          onClick={() => onSpeak(prompt)}
          aria-label="Read the question again"
          className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--th-panel)] text-[var(--th-ink)]"
        >
          <Volume2 className="size-5" />
        </button>
      </div>
      <div className="mt-3">
        {check.type === 'choice' && <Choice {...props} check={check} />}
        {check.type === 'tap' && <Tap {...props} check={check} />}
        {check.type === 'line' && <Line {...props} check={check} />}
        {check.type === 'order' && <Order {...props} check={check} />}
        {check.type === 'sort' && <Sort {...props} check={check} />}
        {check.type === 'number' && <NumberEntry {...props} check={check} />}
        {check.type === 'reveal' && <Reveal {...props} check={check} />}
        {check.type === 'say' && <Say {...props} check={check} />}
      </div>
    </motion.section>
  )
}

type Verdict =
  | { state: 'idle' }
  | { state: 'wrong'; why?: string }
  | { state: 'right'; why?: string }
  | { state: 'shown'; why?: string }

// Two tries, then the lesson shows the answer and moves on without a penalty.
function useTries(props: Props, why?: string) {
  const [tries, setTries] = useState(0)
  const [verdict, setVerdict] = useState<Verdict>({ state: 'idle' })
  const mark = (correct: boolean, explanation = why) => {
    const next = tries + 1
    setTries(next)
    const read =
      props.check.type === 'choice' && props.check.mute ? undefined : explanation
    if (correct) {
      setVerdict({ state: 'right', why: explanation })
      props.onSpeak(read ? `Yes! ${read}` : 'Yes! Well done.')
    } else if (next >= 2) {
      setVerdict({ state: 'shown', why: explanation })
      props.onSpeak(read ?? ANSWER_SHOWN)
    } else {
      setVerdict({ state: 'wrong', why: undefined })
      props.onSpeak('Not yet. Have another look.')
    }
  }
  return {
    tries,
    verdict,
    mark,
    reset: () => setVerdict({ state: 'idle' }),
  }
}

function Outcome({
  verdict,
  tries,
  props,
  onRetry,
}: {
  verdict: Verdict
  tries: number
  props: Props
  onRetry: () => void
}) {
  if (verdict.state === 'idle') return null
  const right = verdict.state === 'right'
  return (
    <div role="status" className="mt-3 space-y-3">
      <p
        className={`flex items-start gap-2 text-base font-semibold ${right ? 'text-[var(--th-good)]' : verdict.state === 'wrong' ? 'text-[var(--th-bad)]' : ''}`}
      >
        {right ? (
          <Tick className="mt-0.5 size-5 shrink-0" />
        ) : verdict.state === 'wrong' ? (
          <X className="mt-0.5 size-5 shrink-0" />
        ) : (
          <Eye className="mt-0.5 size-5 shrink-0" />
        )}
        <span>
          {right
            ? 'Yes! '
            : verdict.state === 'wrong'
              ? 'Not yet. Have another look. '
              : 'Here is the answer. '}
          {verdict.why}
        </span>
      </p>
      <div className="flex flex-wrap gap-2">
        {verdict.state === 'wrong' ? (
          <>
            <button type="button" className={primary} onClick={onRetry}>
              <RotateCcw className="size-4" /> Try again
            </button>
            {props.canReteach && (
              <button type="button" className={quiet} onClick={props.onReteach}>
                <Eye className="size-4" /> Show me again
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            autoFocus
            className={primary}
            onClick={() => props.onDone({ correct: right, tries })}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

function Choice(props: Props & { check: Extract<Check, { type: 'choice' }> }) {
  const { check, marker } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const [picked, setPicked] = useState<number | null>(null)
  const [answer, setAnswer] = useState<number | null>(
    check.questionId ? null : check.answer,
  )
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const order = useMemo(
    () =>
      shuffled(
        check.options.map((_, i) => i),
        check.prompt,
      ),
    [check],
  )
  const done = verdict.state === 'right' || verdict.state === 'shown'
  const pick = async (i: number) => {
    setPicked(i)
    setFailed(false)
    if (check.questionId && marker) {
      setBusy(true)
      try {
        const result = await marker(check.questionId, i)
        setAnswer(result.correctIndex)
        mark(result.correct, result.explanation)
      } catch {
        setFailed(true)
      } finally {
        setBusy(false)
      }
      return
    }
    mark(i === check.answer)
  }
  const wide = check.options.some((o) => o.length > 28)
  return (
    <>
      <div className={`grid gap-2 ${wide ? '' : 'sm:grid-cols-2'}`}>
        {order.map((i) => {
          const isAnswer = done && answer === i
          const isWrong = picked === i && verdict.state !== 'idle' && answer !== i
          return (
            <button
              key={i}
              type="button"
              disabled={busy || done || verdict.state === 'wrong'}
              onClick={() => pick(i)}
              className={`${button} ${isAnswer ? '!border-[var(--th-good)] !bg-[var(--th-second-soft)]' : isWrong ? '!border-[var(--th-bad)]' : ''}`}
            >
              {busy && picked === i && (
                <Loader2 className="mr-2 inline size-4 animate-spin" />
              )}
              {check.options[i]}
            </button>
          )
        })}
      </div>
      {failed && (
        <p role="alert" className="mt-2 text-sm font-semibold">
          That answer could not be checked. Please try again.
        </p>
      )}
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={() => {
          setPicked(null)
          reset()
        }}
      />
    </>
  )
}

function Tap(props: Props & { check: Extract<Check, { type: 'tap' }> }) {
  const { check } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const [on, setOn] = useState<Array<number>>([])
  const done = verdict.state === 'right' || verdict.state === 'shown'
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: check.show }, (_, i) => {
          const active = on.includes(i) || (done && i < check.total)
          return (
            <motion.button
              key={i}
              type="button"
              disabled={done}
              whileTap={{ scale: 0.85 }}
              aria-pressed={active}
              aria-label={`${check.icon} ${i + 1}`}
              onClick={() =>
                setOn(active ? on.filter((n) => n !== i) : [...on, i])
              }
              className={`grid size-16 place-items-center rounded-2xl border-4 text-4xl transition sm:size-20 sm:text-5xl ${active ? 'border-[var(--th-accent)] bg-[var(--th-accent-soft)]' : 'border-transparent bg-[var(--th-panel)]'}`}
            >
              {check.icon}
            </motion.button>
          )
        })}
      </div>
      <p className="mt-3 text-center text-2xl font-bold" aria-live="polite">
        {on.length}
      </p>
      {verdict.state === 'idle' && (
        <div className="mt-2 text-center">
          <button
            type="button"
            className={primary}
            disabled={!on.length}
            onClick={() => mark(on.length === check.total)}
          >
            <Tick className="size-5" /> Check
          </button>
        </div>
      )}
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={() => {
          setOn([])
          reset()
        }}
      />
    </>
  )
}

function Line(props: Props & { check: Extract<Check, { type: 'line' }> }) {
  const { check } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const middle = check.min + Math.round((check.max - check.min) / 2)
  const [value, setValue] = useState(middle)
  const done = verdict.state === 'right' || verdict.state === 'shown'
  return (
    <>
      <p className="text-center text-4xl font-bold" aria-live="polite">
        {done ? check.answer : value}
      </p>
      <input
        type="range"
        min={check.min}
        max={check.max}
        step={1}
        value={done ? check.answer : value}
        disabled={done || verdict.state === 'wrong'}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-label="Move to your answer"
        className="mt-2 h-10 w-full accent-[var(--th-accent)]"
      />
      <div className="flex justify-between text-sm font-semibold text-[var(--th-muted)]">
        <span>{check.min}</span>
        <span>{check.max}</span>
      </div>
      {verdict.state === 'idle' && (
        <div className="mt-2 text-center">
          <button
            type="button"
            className={primary}
            onClick={() => mark(value === check.answer)}
          >
            <Tick className="size-5" /> Check
          </button>
        </div>
      )}
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={reset}
      />
    </>
  )
}

function Order(props: Props & { check: Extract<Check, { type: 'order' }> }) {
  const { check } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const [chosen, setChosen] = useState<Array<string>>([])
  const pool = useMemo(
    () => shuffled(check.items, check.prompt),
    [check],
  )
  const done = verdict.state === 'right' || verdict.state === 'shown'
  const shown = done ? check.items : chosen
  return (
    <>
      <ol className="flex min-h-14 flex-wrap gap-2 rounded-2xl border-2 border-dashed border-[var(--th-line)] p-2">
        {shown.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              disabled={verdict.state !== 'idle'}
              className={`${button} !bg-[var(--th-accent-soft)]`}
              aria-label={`Remove ${item}`}
              onClick={() => setChosen(chosen.filter((c) => c !== item))}
            >
              {i + 1}. {item}
            </button>
          </li>
        ))}
      </ol>
      {!done && (
        <div className="mt-2 flex flex-wrap gap-2">
          {pool
            .filter((item) => !chosen.includes(item))
            .map((item) => (
              <button
                key={item}
                type="button"
                disabled={verdict.state !== 'idle'}
                className={button}
                onClick={() => setChosen([...chosen, item])}
              >
                {item}
              </button>
            ))}
        </div>
      )}
      {verdict.state === 'idle' && (
        <div className="mt-3 text-center">
          <button
            type="button"
            className={primary}
            disabled={chosen.length < check.items.length}
            onClick={() =>
              mark(chosen.every((item, i) => item === check.items[i]))
            }
          >
            <Tick className="size-5" /> Check
          </button>
        </div>
      )}
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={() => {
          setChosen([])
          reset()
        }}
      />
    </>
  )
}

function Sort(props: Props & { check: Extract<Check, { type: 'sort' }> }) {
  const { check } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const [placed, setPlaced] = useState<Record<string, 'left' | 'right'>>({})
  const items = useMemo(() => shuffled(check.items, check.prompt), [check])
  const current = items.find((item) => !placed[item.text])
  const done = verdict.state === 'right' || verdict.state === 'shown'
  const wrong = (text: string, side: 'left' | 'right') =>
    verdict.state !== 'idle' &&
    placed[text] === side &&
    check.items.find((i) => i.text === text)?.side !== side
  const column = (side: 'left' | 'right', title: string) => {
    const content = done
      ? check.items.filter((i) => i.side === side).map((i) => i.text)
      : Object.keys(placed).filter((text) => placed[text] === side)
    return (
      <div className="min-h-28 flex-1 rounded-2xl border-2 border-[var(--th-line)] p-2">
        <p className="text-center text-base font-bold">{title}</p>
        <ul className="mt-2 space-y-1">
          {content.map((text) => (
            <li
              key={text}
              className={`rounded-xl px-2 py-1.5 text-center text-sm font-semibold ${wrong(text, side) ? 'bg-[var(--th-panel)] text-[var(--th-bad)] line-through' : 'bg-[var(--th-accent-soft)]'}`}
            >
              {text}
            </li>
          ))}
        </ul>
      </div>
    )
  }
  const check_all = (next: Record<string, 'left' | 'right'>) =>
    mark(check.items.every((item) => next[item.text] === item.side))
  const place = (side: 'left' | 'right') => {
    if (!current) return
    const next = { ...placed, [current.text]: side }
    setPlaced(next)
    if (Object.keys(next).length === check.items.length) check_all(next)
  }
  return (
    <>
      {current && verdict.state === 'idle' && (
        <motion.div
          key={current.text}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-3 text-center"
        >
          <p className="inline-block rounded-2xl bg-[var(--th-accent)] px-5 py-3 text-xl font-bold text-[var(--th-accent-ink)]">
            {current.text}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className={button} onClick={() => place('left')}>
              ← {check.left}
            </button>
            <button type="button" className={`${button} text-right`} onClick={() => place('right')}>
              {check.right} →
            </button>
          </div>
        </motion.div>
      )}
      <div className="flex gap-2">
        {column('left', check.left)}
        {column('right', check.right)}
      </div>
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={() => {
          setPlaced({})
          reset()
        }}
      />
    </>
  )
}

function NumberEntry(
  props: Props & { check: Extract<Check, { type: 'number' }> },
) {
  const { check } = props
  const { verdict, tries, mark, reset } = useTries(props, check.why)
  const [value, setValue] = useState('')
  const done = verdict.state === 'right' || verdict.state === 'shown'
  const parsed = Number(value.replace(/[,\s]/g, '').replace('−', '-'))
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (verdict.state === 'idle' && value.trim() && Number.isFinite(parsed))
          mark(parsed === check.answer)
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <input
          inputMode="text"
          autoComplete="off"
          aria-label="Your answer"
          value={done ? String(check.answer) : value}
          disabled={verdict.state !== 'idle'}
          onChange={(e) => setValue(e.target.value)}
          className="h-14 w-40 rounded-2xl border-2 border-[var(--th-line)] bg-[var(--th-panel)] px-4 text-2xl font-bold text-[var(--th-ink)]"
        />
        {verdict.state === 'idle' && (
          <button type="submit" className={primary} disabled={!value.trim()}>
            <Tick className="size-5" /> Check
          </button>
        )}
      </div>
      <Outcome
        verdict={verdict}
        tries={tries}
        props={props}
        onRetry={() => {
          setValue('')
          reset()
        }}
      />
    </form>
  )
}

function Reveal(props: Props & { check: Extract<Check, { type: 'reveal' }> }) {
  const { check, onSpeak, onDone } = props
  const [shown, setShown] = useState(false)
  return !shown ? (
    <button
      type="button"
      className={primary}
      onClick={() => {
        setShown(true)
        onSpeak(check.answer)
      }}
    >
      <Eye className="size-5" /> I have thought about it. Show the answer
    </button>
  ) : (
    <div role="status" className="space-y-3">
      <p className="rounded-2xl bg-[var(--th-panel)] p-4 text-lg font-semibold">
        {check.answer}
      </p>
      <p className="text-base font-semibold">Did you think of the same idea?</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={primary}
          onClick={() => onDone({ correct: true, tries: 1 })}
        >
          Yes, I did
        </button>
        <button
          type="button"
          className={quiet}
          onClick={() => onDone({ correct: false, tries: 1 })}
        >
          Not quite. I learnt something new
        </button>
      </div>
    </div>
  )
}

function Say(props: Props & { check: Extract<Check, { type: 'say' }> }) {
  const { check, onSpeak, onDone } = props
  // French has a real voice. The others wait for a speaker's recording: an
  // English voice reading Twi would teach the wrong sounds.
  const canHear = check.lang === 'French'
  return (
    <div className="space-y-3 text-center">
      <p className="text-3xl font-bold">{check.phrase}</p>
      {check.meaning && (
        <p className="text-lg text-[var(--th-muted)]">{check.meaning}</p>
      )}
      {check.audio ? (
        <audio controls src={check.audio} className="mx-auto h-10" />
      ) : canHear ? (
        <button
          type="button"
          className={quiet}
          onClick={() => onSpeak(check.phrase, 'fr')}
        >
          <Volume2 className="size-5" /> Hear it
        </button>
      ) : (
        <p className="text-sm font-semibold text-[var(--th-muted)]">
          Ask someone who speaks {check.lang} to say it first, then copy them.
        </p>
      )}
      <div>
        <button
          type="button"
          className={primary}
          onClick={() => onDone({ correct: null, tries: 1 })}
        >
          <Tick className="size-5" /> I said it out loud
        </button>
      </div>
    </div>
  )
}
