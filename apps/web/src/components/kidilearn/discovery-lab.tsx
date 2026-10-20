import { useEffect, useRef, useState } from 'react'
import type { LearningLesson } from '#/lib/kidilearn/library'

const control =
  'min-h-11 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-[#082449] transition hover:border-teal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-40'
const field =
  'mt-2 block min-h-11 w-full min-w-0 rounded-xl border border-slate-300 bg-white p-3 text-base'
const colours = ['#12345a', '#cf3b50', '#e6ab22', '#168278', '#7955aa']
const colourNames = ['Navy', 'Red', 'Gold', 'Teal', 'Purple']

export function VisualStory({ lesson }: { lesson: LearningLesson }) {
  const [index, setIndex] = useState(0)
  const guide = lesson.content.visualGuide
  const panel = guide?.panels[index]
  if (!guide || !panel) return null
  return (
    <div className="mt-4 space-y-4">
      <div
        className="flex flex-wrap gap-2"
        aria-label="Visual explanation steps"
      >
        {guide.panels.map((p, i) => (
          <button
            key={p.title}
            type="button"
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`${control} ${i === index ? '!border-teal-700 !bg-teal-700 !text-white' : ''}`}
          >
            {i + 1}. {p.title}
          </button>
        ))}
      </div>
      <img
        src={panel.image}
        alt={`Step ${index + 1}: ${panel.title}. Illustrated example for ${lesson.title}.`}
        className="w-full rounded-2xl"
        loading="lazy"
        width={1280}
        height={720}
      />
      <p
        className="rounded-xl bg-teal-50 p-4 text-base leading-7 text-teal-950"
        aria-live="polite"
      >
        {panel.text}
      </p>
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          className={control}
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          ← Previous
        </button>
        <span className="text-sm text-slate-600">
          {index + 1} / {guide.panels.length}
        </span>
        <button
          type="button"
          className={control}
          disabled={index === guide.panels.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next →
        </button>
      </div>
      {lesson.content.originalIllustration && (
        <details className="rounded-xl border p-3 text-sm">
          <summary className="cursor-pointer font-semibold">
            See the original course illustration
          </summary>
          <img
            src={lesson.content.originalIllustration}
            alt={`Original course illustration: ${lesson.title}`}
            loading="lazy"
            className="mt-3 max-h-96 w-full object-contain"
          />
        </details>
      )}
    </div>
  )
}

export function DiscoveryLab({ lesson }: { lesson: LearningLesson }) {
  const guide = lesson.content.visualGuide
  const [checks, setChecks] = useState<Array<number>>([])
  const [reflection, setReflection] = useState('')
  if (!guide) return null
  const mode = guide.experiment
  return (
    <div className="mt-4 min-w-0 space-y-6">
      {mode === 'code' ? (
        <CodeLab />
      ) : mode === 'typing' ? (
        <TypingLab level={lesson.content.level} />
      ) : mode === 'data' ? (
        <DataLab level={lesson.content.level} />
      ) : mode === 'files' ? (
        <FilesLab />
      ) : mode === 'rhythm' ? (
        <RhythmLab />
      ) : mode === 'colour' ? (
        <ColourLab />
      ) : mode === 'pattern' ? (
        <PatternLab />
      ) : mode === 'studio' ? (
        <StudioLab lesson={lesson} />
      ) : mode === 'map' ? (
        <MapLab />
      ) : mode === 'garden' ? (
        <GardenLab />
      ) : (
        <ConceptLab lesson={lesson} />
      )}
      {mode !== 'concepts' && (
        <details className="rounded-2xl border border-amber-200 bg-white p-4">
          <summary className="cursor-pointer font-semibold">
            Explore the lesson’s key ideas
          </summary>
          <div className="mt-4">
            <ConceptLab lesson={lesson} />
          </div>
        </details>
      )}
      <div className="space-y-3">
        <h4 className="text-lg font-bold">My practical challenge</h4>
        <p className="text-sm leading-6">
          {guide.context}. Try these steps, then show or explain your work to a
          parent or teacher.
        </p>
        {guide.steps.map((step, i) => (
          <label
            key={i}
            className="flex min-h-11 items-start gap-3 rounded-xl bg-white p-3 text-sm leading-6"
          >
            <input
              type="checkbox"
              className="mt-1 size-5 shrink-0 accent-teal-700"
              checked={checks.includes(i)}
              onChange={() =>
                setChecks(
                  checks.includes(i)
                    ? checks.filter((n) => n !== i)
                    : [...checks, i],
                )
              }
            />
            <span>{step}</span>
          </label>
        ))}
        <label className="block text-sm font-semibold">
          {guide.reflection}
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            maxLength={600}
            rows={3}
            className={field}
            placeholder="I noticed… I chose… Next time I will…"
          />
        </label>
        <p className="text-xs leading-5 text-slate-600">
          This is a practice space. Your creations and notes reset when you
          leave this activity. Use “Save Explore & start Play” below to record
          your progress.
        </p>
        {lesson.content.safety && (
          <p className="rounded-xl bg-amber-100 p-3 text-sm leading-6">
            {lesson.content.safety}
          </p>
        )}
      </div>
    </div>
  )
}

function ConceptLab({ lesson }: { lesson: LearningLesson }) {
  const concepts = lesson.content.visualGuide?.concepts ?? []
  const [round, setRound] = useState(0)
  const [answer, setAnswer] = useState<number | null>(null)
  const concept = concepts.length
    ? concepts[round % concepts.length]
    : undefined
  if (!concept)
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Connect the idea</h3>
        <p className="text-sm">
          No concepts available for this lesson. Please try a different
          activity.
        </p>
      </div>
    )
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Connect the idea</h3>
      <p className="text-sm">
        Read the clue, then choose the idea it explains. Open a word card
        whenever you need help.
      </p>
      <p className="rounded-2xl bg-white p-5 text-lg leading-7">
        {concept.meaning}
      </p>
      <div className="flex flex-wrap gap-2">
        {concepts
          .map((_, i) => (i + 2) % concepts.length)
          .map((i) => (
            <button
              key={i}
              type="button"
              className={control}
              aria-pressed={answer === i}
              onClick={() => setAnswer(i)}
            >
              {concepts[i]!.term}
            </button>
          ))}
      </div>
      <p role="status" className="text-sm font-semibold">
        {answer === null
          ? 'Choose an idea above.'
          : answer === round % concepts.length
            ? `Yes! ${concept.term}: ${concept.meaning}.`
            : 'Look at the word cards below, then try another idea.'}
      </p>
      <button
        type="button"
        className={control}
        onClick={() => {
          setRound(round + 1)
          setAnswer(null)
        }}
      >
        Next clue →
      </button>
      <div className="grid gap-2 sm:grid-cols-2">
        {concepts.map((c) => (
          <details
            key={c.term}
            className="rounded-xl border border-amber-200 bg-white p-3 text-sm"
          >
            <summary className="min-h-7 cursor-pointer font-semibold">
              {c.term}
            </summary>
            <p className="mt-2 leading-6">{c.meaning}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

const directions = {
  Right: [1, 0],
  Down: [0, 1],
  Left: [-1, 0],
  Up: [0, -1],
} as const
type Direction = keyof typeof directions
function CodeLab() {
  const [commands, setCommands] = useState<Array<Direction>>([])
  const [step, setStep] = useState(0)
  let x = 0,
    y = 0,
    blocked = false
  for (const cmd of commands.slice(0, step)) {
    const [dx, dy] = directions[cmd]
    const nx = x + dx,
      ny = y + dy
    if (nx < 0 || nx > 3 || ny < 0 || ny > 3) blocked = true
    else {
      x = nx
      y = ny
    }
  }
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Build an instruction trail</h3>
      <p className="text-sm leading-6">
        Guide the robot from the top left to the star at the bottom right. Add
        instructions in order. Predict the route before stepping through your
        program.
      </p>
      <div
        className="mx-auto grid max-w-xs grid-cols-4 gap-1 rounded-2xl bg-slate-200 p-2"
        role="img"
        aria-label={`Robot at row ${y + 1}, column ${x + 1}. Goal: row 4, column 4.`}
      >
        {Array.from({ length: 16 }, (_, i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-lg bg-white text-2xl"
            aria-hidden="true"
          >
            {i === y * 4 + x ? '🤖' : i === 15 ? '⭐' : '·'}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(directions) as Array<Direction>).map((dir) => (
          <button
            type="button"
            key={dir}
            className={control}
            disabled={commands.length >= 16}
            onClick={() => {
              setCommands([...commands, dir])
              setStep(0)
            }}
          >
            + {dir}
          </button>
        ))}
      </div>
      <ol
        className="flex min-h-12 flex-wrap gap-2 rounded-xl bg-white p-3"
        aria-label="Your program"
      >
        {commands.map((cmd, i) => (
          <li
            key={i}
            className={`rounded-lg px-2 py-1 text-sm ${i === step - 1 ? 'bg-teal-700 text-white' : 'bg-slate-100'}`}
          >
            {i + 1}. {cmd}
          </li>
        ))}
        {!commands.length && (
          <li className="text-sm text-slate-500">Add up to 16 instructions.</li>
        )}
      </ol>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={control}
          disabled={step >= commands.length}
          onClick={() => setStep(step + 1)}
        >
          Run next step
        </button>
        <button
          type="button"
          className={control}
          disabled={!commands.length}
          onClick={() => {
            setCommands(commands.slice(0, -1))
            setStep(0)
          }}
        >
          Undo instruction
        </button>
        <button type="button" className={control} onClick={() => setStep(0)}>
          Restart robot
        </button>
        <button
          type="button"
          className={control}
          onClick={() => {
            setCommands([])
            setStep(0)
          }}
        >
          Clear program
        </button>
      </div>
      <p role="status" className="text-sm">
        {x === 3 && y === 3
          ? 'You reached the star! Can you find a shorter route?'
          : blocked
            ? 'An instruction reached the edge. The robot stayed still. Debug your route and try again.'
            : `Step ${step} of ${commands.length}. Robot: row ${y + 1}, column ${x + 1}.`}
      </p>
    </div>
  )
}

function TypingLab({ level }: { level?: string }) {
  const target =
    Number(level?.slice(1) ?? 3) <= 2
      ? 'Hello Ghana'
      : 'We learn and create together.'
  const [value, setValue] = useState('')
  const [bold, setBold] = useState(false)
  const [align, setAlign] = useState<'left' | 'center'>('left')
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">My typing desk</h3>
      <p className="text-sm leading-6">
        Copy the sentence. Notice capital letters, spaces and punctuation. Then
        try changing its appearance.
      </p>
      <p className="rounded-xl bg-white p-4 text-lg">{target}</p>
      <label className="block text-sm font-semibold">
        Type the sentence
        <textarea
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={180}
          className={field}
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={control}
          aria-pressed={bold}
          onClick={() => setBold(!bold)}
        >
          Bold {bold ? 'on' : 'off'}
        </button>
        <button
          type="button"
          className={control}
          aria-pressed={align === 'center'}
          onClick={() => setAlign(align === 'left' ? 'center' : 'left')}
        >
          Centre {align === 'center' ? 'on' : 'off'}
        </button>
      </div>
      <p
        className="min-h-16 rounded-xl bg-white p-4 text-xl whitespace-pre-wrap break-words"
        style={{ fontWeight: bold ? 700 : 400, textAlign: align }}
      >
        {value || 'Your document preview'}
      </p>
      <p role="status" className="text-sm">
        {value === target
          ? 'An exact match! Formatting changes how text looks, while the words stay the same.'
          : value
            ? `${Array.from(value).filter((letter, i) => letter === target[i]).length} matching characters in their correct positions. Compare your text with the sentence.`
            : 'Start with a capital letter.'}
      </p>
    </div>
  )
}

function DataLab({ level }: { level?: string }) {
  const [values, setValues] = useState([3, 5, 4])
  const labels = ['Mango', 'Orange', 'Banana']
  const total = values.reduce((a, b) => a + b, 0)
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Turn a survey into a chart</h3>
      <p className="text-sm leading-6">
        These are pretend votes for favourite fruits. Change a count and watch
        the chart update. Each bar uses the same scale: 0 to 10 votes.
      </p>
      {labels.map((label, i) => (
        <label key={label} className="block text-sm font-semibold">
          {label}: {values[i]} votes
          <input
            type="range"
            min={0}
            max={10}
            value={values[i]}
            className="block h-11 w-full accent-teal-700"
            onChange={(e) =>
              setValues(
                values.map((v, j) => (j === i ? Number(e.target.value) : v)),
              )
            }
          />
          <span className="block h-7 overflow-hidden rounded-lg bg-slate-200">
            <span
              className="block h-full rounded-lg bg-teal-700"
              style={{ width: `${values[i]! * 10}%` }}
            />
          </span>
        </label>
      ))}
      <p className="rounded-xl bg-white p-4 text-lg" aria-live="polite">
        Total votes: <strong>{total}</strong>
        {Number(level?.slice(1)) >= 3 && (
          <span className="mt-2 block text-sm">
            Mean votes per fruit: {total} ÷ 3 ={' '}
            {Number.isInteger(total / 3)
              ? total / 3
              : `${(total / 3).toFixed(2)} (rounded)`}
          </span>
        )}
      </p>
      <p className="text-sm">
        Which fruit has the most votes? Can you make a tie? Explain how you
        know.
      </p>
    </div>
  )
}

function FilesLab() {
  const [folder, setFolder] = useState('Classwork')
  const [name, setName] = useState('My story.txt')
  const [deleted, setDeleted] = useState(false)
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Find a home for a file</h3>
      <p className="text-sm leading-6">
        Organise this pretend file. Choose a clear name, move it to a folder, or
        practise restoring it from the bin.
      </p>
      <label className="block text-sm font-semibold">
        File name
        <input
          value={name}
          maxLength={60}
          onChange={(e) => setName(e.target.value)}
          className={field}
          disabled={deleted}
        />
      </label>
      <label className="block text-sm font-semibold">
        Move file to
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          className={field}
          disabled={deleted}
        >
          {['Classwork', 'Stories', 'Pictures'].map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </label>
      <div className="grid gap-2 sm:grid-cols-3">
        {['Classwork', 'Stories', 'Pictures'].map((f) => (
          <div
            key={f}
            className="min-h-24 rounded-xl border bg-white p-3 text-sm"
          >
            <p className="font-semibold">📁 {f}</p>
            {folder === f && !deleted && (
              <p className="mt-3 break-words">
                📄 {name.trim() || 'Untitled.txt'}
              </p>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className={control}
        onClick={() => setDeleted(!deleted)}
      >
        {deleted ? 'Restore from bin' : 'Move file to bin'}
      </button>
      <p role="status" className="text-sm">
        {deleted
          ? `The bin holds ${name.trim() || 'Untitled.txt'}. Restore it to ${folder}.`
          : `File path: My computer / ${folder} / ${name.trim() || 'Untitled.txt'}`}
      </p>
    </div>
  )
}

function RhythmLab() {
  const [beats, setBeats] = useState([
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    false,
  ])
  const [tempo, setTempo] = useState(90)
  const [active, setActive] = useState(-1)
  const [error, setError] = useState('')
  const audioRef = useRef<AudioContext | null>(null)
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([])
  function stop() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const audio = audioRef.current
    audioRef.current = null
    if (audio && audio.state !== 'closed') void audio.close()
    setActive(-1)
  }
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
      const audio = audioRef.current
      if (audio && audio.state !== 'closed') void audio.close()
    },
    [],
  )
  async function play() {
    stop()
    setError('')
    try {
      const context = new AudioContext()
      audioRef.current = context
      await context.resume()
      if (audioRef.current !== context) return
      const beatSeconds = 60 / tempo
      beats.forEach((on, i) => {
        const time = context.currentTime + 0.08 + i * beatSeconds
        if (on) {
          const osc = context.createOscillator(),
            gain = context.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(220, time)
          osc.frequency.exponentialRampToValueAtTime(75, time + 0.12)
          gain.gain.setValueAtTime(0.15, time)
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18)
          osc.connect(gain)
          gain.connect(context.destination)
          osc.start(time)
          osc.stop(time + 0.2)
        }
        timers.current.push(
          setTimeout(() => setActive(i), (i * beatSeconds + 0.08) * 1000),
        )
      })
      timers.current.push(
        setTimeout(stop, (beats.length * beatSeconds + 0.3) * 1000),
      )
    } catch {
      stop()
      setError(
        'Sound is unavailable here. Tap or clap the highlighted pattern yourself.',
      )
    }
  }
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Compose a rhythm</h3>
      <p className="text-sm leading-6">
        Turn beats on or off, then listen and clap along. An empty beat is a
        rest. Try an answering pattern with a friend.
      </p>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {beats.map((on, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Beat ${i + 1}: ${on ? 'sound' : 'rest'}`}
            aria-pressed={on}
            disabled={active !== -1}
            onClick={() => setBeats(beats.map((b, j) => (i === j ? !b : b)))}
            className={`${control} aspect-square ${on ? '!bg-teal-700 !text-white' : ''} ${active === i ? 'ring-4 ring-amber-400' : ''}`}
          >
            <span aria-hidden="true" className="block text-xl">
              {on ? '♪' : '—'}
            </span>
            {i + 1}
          </button>
        ))}
      </div>
      <label className="block text-sm font-semibold">
        Tempo: {tempo} beats per minute
        <input
          type="range"
          min={60}
          max={140}
          step={10}
          value={tempo}
          disabled={active !== -1}
          onChange={(e) => setTempo(Number(e.target.value))}
          className="block h-11 w-full accent-teal-700"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={control}
          onClick={() => void play()}
          disabled={active !== -1}
        >
          Play my rhythm
        </button>
        <button
          type="button"
          className={control}
          onClick={stop}
          disabled={active === -1}
        >
          Stop
        </button>
      </div>
      <p role="status" className="text-sm">
        {error ||
          (active >= 0
            ? `Beat ${active + 1} of 8`
            : 'Sound plays only when you press Play.')}
      </p>
    </div>
  )
}

function ColourLab() {
  const [first, setFirst] = useState('red'),
    [second, setSecond] = useState('yellow')
  const paints: Record<string, string> = {
    red: '#d23e4a',
    yellow: '#f0c932',
    blue: '#3461b8',
    orange: '#e98a38',
    green: '#60934a',
    purple: '#8b5599',
  }
  const pair = [first, second].sort().join('-')
  const result =
    first === second
      ? first
      : (
          {
            'red-yellow': 'orange',
            'blue-yellow': 'green',
            'blue-red': 'purple',
          } as Record<string, string>
        )[pair]!
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Plan a paint mixture</h3>
      <p className="text-sm leading-6">
        Explore a simple red, yellow and blue paint model. Real paints vary with
        the pigments and amounts you use. Predict the result before changing a
        colour.
      </p>
      <div className="grid grid-cols-2 gap-3">
        {[first, second].map((value, i) => (
          <label key={i} className="text-sm font-semibold">
            Paint {i + 1}
            <select
              className={field}
              value={value}
              onChange={(e) => (i === 0 ? setFirst : setSecond)(e.target.value)}
            >
              {['red', 'yellow', 'blue'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div
        className="flex flex-wrap items-center justify-center gap-3 rounded-2xl bg-white p-5"
        aria-live="polite"
      >
        {[first, second, result].map((c, i) => (
          <div key={i} className="text-center">
            <div
              className="mx-auto size-16 rounded-full border border-black/10"
              style={{ backgroundColor: paints[c] }}
            />
            <p className="mt-2 text-sm">{i === 2 ? `Result: ${c}` : c}</p>
          </div>
        ))}
      </div>
      <p className="text-sm">
        Where could you use your chosen colours in today’s artwork?
      </p>
    </div>
  )
}

function Palette({
  colour,
  setColour,
}: {
  colour: number
  setColour: (n: number) => void
}) {
  return (
    <div className="flex flex-wrap gap-2" aria-label="Choose a colour">
      {colours.map((c, i) => (
        <button
          key={c}
          type="button"
          className={`${control} flex items-center gap-2 ${colour === i ? 'ring-2 ring-teal-700' : ''}`}
          aria-pressed={colour === i}
          onClick={() => setColour(i)}
        >
          <span
            className="size-4 rounded-full"
            style={{ backgroundColor: c }}
            aria-hidden="true"
          />
          {colourNames[i]}
        </button>
      ))}
    </div>
  )
}
function PatternLab() {
  const [colour, setColour] = useState(0)
  const [motif, setMotif] = useState([0, 2, 3, 2])
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Design a repeating motif</h3>
      <p className="text-sm leading-6">
        Choose a colour and paint one of the four tiles. Watch your motif
        repeat. This is your own design; it does not represent a named
        traditional cloth pattern.
      </p>
      <Palette colour={colour} setColour={setColour} />
      <div className="grid grid-cols-4 gap-2">
        {motif.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Paint motif tile ${i + 1}, currently ${colourNames[c]}`}
            className="min-h-14 rounded-lg border-2 border-white text-lg font-bold text-white shadow"
            style={{ backgroundColor: colours[c] }}
            onClick={() =>
              setMotif(motif.map((v, j) => (i === j ? colour : v)))
            }
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div
        className="grid grid-cols-8 gap-1 rounded-xl bg-white p-3"
        role="img"
        aria-label={`Repeating pattern: ${motif.map((c) => colourNames[c]).join(', ')}, repeated across four rows.`}
      >
        {Array.from({ length: 32 }, (_, i) => (
          <div
            key={i}
            className="aspect-square rounded-sm"
            style={{ backgroundColor: colours[motif[i % 4]!] }}
          />
        ))}
      </div>
      <p className="text-sm">
        Describe the repeating unit. What changes when you swap two colours?
      </p>
    </div>
  )
}

function StudioLab({ lesson }: { lesson: LearningLesson }) {
  const [colour, setColour] = useState(0)
  const [tiles, setTiles] = useState<Array<number | null>>(Array(16).fill(null))
  const [history, setHistory] = useState<Array<Array<number | null>>>([])
  const performance = /dance|drama|gesture|performance|puppet/i.test(
    lesson.title,
  )
  const [story, setStory] = useState(['', '', ''])
  if (performance)
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Plan a three-part performance</h3>
        <p className="text-sm leading-6">
          Create a short scene for today’s theme. Plan the actions, practise in
          a clear space and invite someone to explain the message they noticed.
        </p>
        {[
          'Beginning: introduce the idea',
          'Middle: show a change',
          'Ending: share your message',
        ].map((label, i) => (
          <label
            key={label}
            className="block rounded-xl bg-white p-3 text-sm font-semibold"
          >
            {i + 1}. {label}
            <textarea
              maxLength={180}
              rows={2}
              className={field}
              value={story[i]}
              onChange={(e) =>
                setStory(story.map((s, j) => (i === j ? e.target.value : s)))
              }
            />
          </label>
        ))}
      </div>
    )
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Sketch a composition</h3>
      <p className="text-sm leading-6">
        Use blocks of colour to plan the arrangement for your artwork. Then make
        the real object or picture using the lesson’s materials.
      </p>
      <Palette colour={colour} setColour={setColour} />
      <div className="mx-auto grid max-w-sm grid-cols-4 gap-1 rounded-xl border bg-white p-3">
        {tiles.map((c, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Canvas row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}: ${c === null ? 'empty' : colourNames[c]}`}
            className="aspect-square min-h-11 rounded border border-slate-300"
            style={{ backgroundColor: c === null ? '#f5f7fa' : colours[c] }}
            onClick={() => {
              setHistory([...history.slice(-29), tiles])
              setTiles(tiles.map((v, j) => (i === j ? colour : v)))
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={control}
          disabled={!history.length}
          onClick={() => {
            setTiles(history[history.length - 1]!)
            setHistory(history.slice(0, -1))
          }}
        >
          Undo
        </button>
        <button
          type="button"
          className={control}
          onClick={() => {
            setHistory([...history.slice(-29), tiles])
            setTiles(Array(16).fill(null))
          }}
        >
          Clear canvas
        </button>
      </div>
      <p className="text-sm">
        Where will the viewer look first? Explain how colour and space help your
        message.
      </p>
    </div>
  )
}

function MapLab() {
  const [place, setPlace] = useState('School')
  const [map, setMap] = useState<Array<string>>(Array(16).fill(''))
  const [message, setMessage] = useState(
    'Choose a place, then select a square.',
  )
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Build a community map</h3>
      <p className="text-sm leading-6">
        Make an imaginary neighbourhood. North is at the top, east at the right,
        south at the bottom and west at the left.
      </p>
      <label className="block text-sm font-semibold">
        Map symbol
        <select
          className={field}
          value={place}
          onChange={(e) => setPlace(e.target.value)}
        >
          {['School', 'Market', 'Clinic', 'Park', 'Road', 'Clear'].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <p className="text-center font-semibold">↑ North</p>
      <div className="grid grid-cols-4 gap-1 rounded-xl bg-white p-2">
        {map.map((p, i) => (
          <button
            key={i}
            type="button"
            className="aspect-square min-h-14 rounded-lg border border-teal-200 bg-teal-50 p-1 text-[10px] font-semibold text-teal-950 sm:text-sm"
            aria-label={`Row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}: ${p || 'empty'}`}
            onClick={() => {
              setMap(
                map.map((v, j) =>
                  i === j ? (place === 'Clear' ? '' : place) : v,
                ),
              )
              setMessage(
                `${place === 'Clear' ? 'Cleared' : `Placed ${place} at`} row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}.`,
              )
            }}
          >
            {p || '+'}
          </button>
        ))}
      </div>
      <p role="status" className="text-sm">
        {message}
      </p>
      <button
        type="button"
        className={control}
        onClick={() => {
          setMap(Array(16).fill(''))
          setMessage('Map cleared.')
        }}
      >
        Clear map
      </button>
      <p className="text-sm">
        Place the market east of the school. Describe a route from the clinic to
        the park using your landmarks.
      </p>
    </div>
  )
}

function GardenLab() {
  const [water, setWater] = useState(1),
    [light, setLight] = useState(1)
  const ready = water === 1 && light === 1
  const message =
    water === 0
      ? 'Without water, a plant can wilt. How could you care for it?'
      : water === 2
        ? 'Waterlogged soil can leave roots short of air. Check drainage.'
        : light === 0
          ? 'A green plant needs suitable light to make its food.'
          : light === 2
            ? 'Very intense sun can stress some plants. Different plants need different light.'
            : 'Suitable light, water and well-drained soil support this model plant.'
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Care for a model garden</h3>
      <p className="text-sm leading-6">
        Change one condition at a time. Predict how it might affect a plant.
        This is a simplified model; real plants have different needs and change
        over time.
      </p>
      <div className="rounded-2xl bg-white p-5 text-center">
        <span className="text-6xl" aria-hidden="true">
          {ready ? '🌱' : '🪴'}
        </span>
        <p className="mt-4 text-sm leading-6" role="status">
          {message}
        </p>
      </div>
      {[
        {
          label: 'Water',
          value: water,
          update: setWater,
          options: ['None', 'Enough', 'Waterlogged'],
        },
        {
          label: 'Light',
          value: light,
          update: setLight,
          options: ['None', 'Suitable', 'Very intense'],
        },
      ].map((row) => (
        <label key={row.label} className="block text-sm font-semibold">
          {row.label}
          <select
            className={field}
            value={row.value}
            onChange={(e) => row.update(Number(e.target.value))}
          >
            {row.options.map((o, i) => (
              <option key={o} value={i}>
                {o}
              </option>
            ))}
          </select>
        </label>
      ))}
      <p className="text-sm">
        Observe a real plant with an adult. Draw it today and compare it again
        in a few days.
      </p>
    </div>
  )
}
