import { useState } from 'react'
import { Button } from '#/components/ui/button'
import type { LearningLesson } from '#/lib/kidilearn/library'
import { QuestionVisual } from './visual'
import { DiscoveryLab } from './discovery-lab'
import { SourcePractice } from './source-practice'

export function LearningActivity({
  subject,
  lesson,
}: {
  subject: string
  lesson: LearningLesson
}) {
  return (
    <section className="rounded-3xl border border-amber-200 bg-[#fff9e9] p-4 sm:p-6">
      <p className="text-xs font-bold tracking-wider text-amber-800 uppercase">
        Try it yourself
      </p>
      {lesson.content.sourceLesson ? (
        <SourcePractice key={lesson.id} lesson={lesson} />
      ) : lesson.content.visualGuide ? (
        <DiscoveryLab key={lesson.id} lesson={lesson} />
      ) : subject === 'mathematics' ? (
        <NumberLab
          kind={lesson.content.kind}
          level={lesson.content.level ?? 'b3'}
        />
      ) : subject === 'english' ? (
        <WordLab lesson={lesson} />
      ) : (
        <ScienceLab lesson={lesson} />
      )}
    </section>
  )
}

function Slider({
  label,
  value,
  min = 0,
  max,
  onChange,
}: {
  label: string
  value: number
  min?: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <label className="block space-y-2 text-sm font-semibold">
      <span>
        {label}: {value}
      </span>
      <input
        className="block h-8 w-full accent-teal-700"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  )
}

function NumberLab({ kind, level }: { kind: string; level: string }) {
  const limit =
    (
      {
        b1: 100,
        b2: 1000,
        b3: 10000,
        b4: 100000,
        b5: 1000000,
        b6: 1000000,
      } as Record<string, number>
    )[level] ?? 10000
  const digits = String(limit).length
  const initial = ['unitfrac', 'setfrac', 'fraccompare'].includes(kind)
    ? 'fractions'
    : ['multiply', 'array', 'share', 'repeated', 'inverse'].includes(kind)
      ? 'arrays'
      : kind === 'time'
        ? 'clock'
        : ['place', 'chart', 'compare'].includes(kind)
          ? 'place'
          : 'jumps'
  const [mode, setMode] = useState(initial)
  const [number, setNumber] = useState(Math.min(1234, limit - 1))
  const [parts, setParts] = useState(4)
  const [filled, setFilled] = useState(1)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(4)
  const [start, setStart] = useState(0)
  const [jump, setJump] = useState(
    level === 'b1' ? 2 : level === 'b2' ? 10 : 100,
  )
  const [hour, setHour] = useState(3)
  return (
    <div className="mt-3 space-y-5">
      <h3 className="text-xl font-black">Number playground</h3>
      <p className="text-sm text-slate-600">
        Change the model. Predict what will happen, then explain what you
        notice.
      </p>
      <label className="block text-sm font-bold">
        Choose a model
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="mt-2 block h-11 w-full min-w-0 rounded-xl border bg-white px-3"
        >
          {[
            ['jumps', 'Counting in jumps'],
            ['place', 'Place value'],
            ['fractions', 'Equal parts'],
            ['arrays', 'Rows and columns'],
            ['clock', 'Clock hours'],
          ].map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {mode === 'place' && (
        <>
          <Slider
            label="Build a number"
            value={number}
            max={limit}
            onChange={setNumber}
          />
          <QuestionVisual visual={{ type: 'place4', n: number, digits }} />
          <p className="text-center text-lg font-bold">
            {number.toLocaleString()} ={' '}
            {Array.from(
              { length: digits },
              (_, i) =>
                (Math.floor(number / 10 ** (digits - i - 1)) % 10) *
                10 ** (digits - i - 1),
            ).join(' + ')}
          </p>
        </>
      )}
      {mode === 'fractions' && (
        <>
          <Slider
            label="Equal parts"
            value={parts}
            min={2}
            max={12}
            onChange={(n) => {
              setParts(n)
              setFilled(Math.min(filled, n))
            }}
          />
          <Slider
            label="Shaded parts"
            value={filled}
            max={parts}
            onChange={setFilled}
          />
          <QuestionVisual visual={{ type: 'fraction', parts, filled }} />
          <p className="text-center text-2xl font-bold">
            {filled} / {parts}
          </p>
          <p className="text-sm">
            The whole stays the same size. More equal parts make each part
            smaller.
          </p>
        </>
      )}
      {mode === 'arrays' && (
        <>
          <Slider
            label="Rows"
            value={rows}
            min={1}
            max={10}
            onChange={setRows}
          />
          <Slider
            label="Columns"
            value={cols}
            min={1}
            max={10}
            onChange={setCols}
          />
          <QuestionVisual visual={{ type: 'array', rows, cols }} />
          <p className="text-center text-2xl font-bold">
            {rows} × {cols} = {rows * cols}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setRows(cols)
              setCols(rows)
            }}
          >
            Swap rows and columns
          </Button>
        </>
      )}
      {mode === 'clock' && (
        <>
          <Slider
            label="Hour"
            value={hour}
            min={1}
            max={12}
            onChange={setHour}
          />
          <QuestionVisual visual={{ type: 'clock', hour }} />
          <p className="text-center font-bold">{hour} o'clock</p>
        </>
      )}
      {mode === 'jumps' && (
        <>
          <label className="block text-sm font-bold">
            Jump size
            <select
              className="mt-2 block h-11 w-full rounded-xl border bg-white px-3"
              value={jump}
              onChange={(e) => {
                setJump(Number(e.target.value))
                setStart(0)
              }}
            >
              {[1, 2, 5, 10, 50, 100, 500, 1000, 10000, 100000]
                .filter((n) => n * 3 <= limit)
                .map((n) => (
                  <option key={n}>{n}</option>
                ))}
            </select>
          </label>
          <QuestionVisual
            visual={{
              type: 'sequence',
              nums: [start, start + jump, start + jump * 2, start + jump * 3],
            }}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={start < jump}
              onClick={() => setStart(start - jump)}
            >
              ← Back {jump}
            </Button>
            <Button
              variant="outline"
              disabled={start + jump * 4 > limit}
              onClick={() => setStart(start + jump)}
            >
              Forward {jump} →
            </Button>
            <Button variant="ghost" onClick={() => setStart(0)}>
              Reset
            </Button>
          </div>
          <p className="text-sm">
            Each step adds {jump}. Try saying the next number before moving
            forward.
          </p>
        </>
      )}
    </div>
  )
}

function WordLab({ lesson }: { lesson: LearningLesson }) {
  const sentences =
    (lesson.content.passage || lesson.content.notes[0] || '')
      .match(/[^.!?]+[.!?]?/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? []
  const [round, setRound] = useState(0)
  const [chosen, setChosen] = useState<Array<number>>([])
  const [checked, setChecked] = useState(false)
  const sentence =
    sentences[round % Math.max(1, sentences.length)] ??
    'Learning helps us grow.'
  const wordMode = lesson.strand === 'Reading'
  const target = wordMode
    ? (sentence.match(/[A-Za-z]{4,10}/)?.[0] ?? 'learn')
    : sentence
  const tiles = wordMode ? target.split('') : target.split(/\s+/)
  const answer = chosen.map((i) => tiles[i]).join(wordMode ? '' : ' ')
  const order = tiles.map((_, i) => i).reverse()
  return (
    <div className="mt-3 space-y-4">
      <h3 className="text-xl font-black">
        {wordMode ? 'Word builder' : 'Sentence builder'}
      </h3>
      <p className="text-sm">
        {wordMode
          ? `Build “${target}” using the letter tiles.`
          : 'Put the words in order. Use the capital letter and punctuation as clues.'}
      </p>
      <div
        aria-live="polite"
        className="min-h-20 rounded-2xl border-2 border-dashed border-amber-300 bg-white p-4 text-lg font-semibold break-words"
      >
        {answer || 'Your creation goes here…'}
      </div>
      <div className="flex flex-wrap gap-2">
        {order.map((i) => (
          <button
            type="button"
            key={i}
            disabled={chosen.includes(i)}
            className="min-h-11 max-w-full rounded-xl border border-amber-300 bg-white px-3 py-2 font-bold break-words disabled:opacity-30"
            onClick={() => {
              setChosen([...chosen, i])
              setChecked(false)
            }}
          >
            {tiles[i]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setChecked(true)}
          disabled={chosen.length !== tiles.length}
        >
          Check my creation
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setChosen(chosen.slice(0, -1))
            setChecked(false)
          }}
        >
          Undo
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setChosen([])
            setChecked(false)
          }}
        >
          Reset
        </Button>
      </div>
      {checked && (
        <p role="status" className="font-semibold">
          {answer === target
            ? 'Well done! Read your creation aloud.'
            : 'Try another order. You can look at the reading passage for a clue.'}
        </p>
      )}
      <Button
        variant="outline"
        onClick={() => {
          setRound(round + 1)
          setChosen([])
          setChecked(false)
        }}
      >
        Next creation →
      </Button>
    </div>
  )
}

function ScienceLab({ lesson }: { lesson: LearningLesson }) {
  const [step, setStep] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [state, setState] = useState(0)
  const living = lesson.title === 'Classifying Living Things'
  const changing = lesson.title === 'Changing States of Matter'
  const items = [
    { name: 'Mango tree', group: 'Plant' },
    { name: 'Goat', group: 'Animal' },
    { name: 'Grass', group: 'Plant' },
    { name: 'Chicken', group: 'Animal' },
    { name: 'Bean seedling', group: 'Plant' },
    { name: 'Dog', group: 'Animal' },
  ]
  return (
    <div className="mt-3 space-y-4">
      <h3 className="text-xl font-black">
        {living
          ? 'Living things sorting lab'
          : changing
            ? 'Matter explorer'
            : 'My discovery steps'}
      </h3>
      {living ? (
        <>
          <p className="text-sm">
            Sort each living thing into its group. A rooted tree is alive too.
          </p>
          <div className="rounded-2xl bg-white p-6 text-center">
            <p className="text-xs text-slate-500">
              Object {step + 1} of {items.length}
            </p>
            <p className="mt-2 text-2xl font-black">{items[step]!.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Plant', 'Animal'].map((group) => (
              <Button
                key={group}
                variant="outline"
                onClick={() =>
                  setFeedback(
                    group === items[step]!.group
                      ? `Correct! ${items[step]!.name} is a ${group.toLowerCase()}.`
                      : 'Look again. Does it grow roots and leaves, or is it an animal?',
                  )
                }
              >
                {group}
              </Button>
            ))}
          </div>
          <p role="status">{feedback}</p>
          <Button
            onClick={() => {
              setStep((step + 1) % items.length)
              setFeedback('')
            }}
          >
            Next living thing →
          </Button>
        </>
      ) : changing ? (
        <>
          <p className="text-sm">
            Explore what heating and cooling can do to water. This model shows
            states, not a real-time experiment.
          </p>
          <div className="rounded-2xl bg-white p-5 text-center">
            <span className="text-5xl" aria-hidden="true">
              {['🧊', '💧', '☁️'][state]}
            </span>
            <h4 className="mt-3 text-xl font-black">
              {['Solid · ice', 'Liquid · water', 'Gas · water vapour'][state]}
            </h4>
            <p className="mt-2 text-sm">
              {
                [
                  'Ice keeps its shape.',
                  'Liquid water takes the shape of its container.',
                  'Water vapour is invisible and spreads through the air. The cloud symbol represents it.',
                ][state]
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={state === 0}
              onClick={() => setState(state - 1)}
            >
              Cool down
            </Button>
            <Button
              variant="outline"
              disabled={state === 2}
              onClick={() => setState(state + 1)}
            >
              Add heat
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm">
            Follow the activity with a trusted adult. Pause at each step and
            share what you notice.
          </p>
          <ol className="space-y-3">
            {[
              'Predict: what do you think will happen?',
              'Observe: what can you see or notice?',
              'Explain: how does it connect to today’s lesson?',
            ].map((label, i) => (
              <li key={label}>
                <label className="flex items-start gap-3 rounded-xl bg-white p-3 text-sm">
                  <input
                    className="mt-1 size-4 accent-teal-700"
                    type="checkbox"
                  />
                  {i + 1}. {label}
                </label>
              </li>
            ))}
          </ol>
        </>
      )}
      {lesson.content.safety && (
        <p className="rounded-xl bg-amber-100 p-3 text-sm font-semibold">
          {lesson.content.safety}
        </p>
      )}
    </div>
  )
}
