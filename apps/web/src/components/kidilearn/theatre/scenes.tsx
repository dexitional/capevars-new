import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Pose, SceneVisual } from '#/lib/kidilearn/storyboard'
import { ExploreArt } from '../explore-art'
import { QuestionVisual } from '../visual'

const pop = {
  initial: { opacity: 0, scale: 0.6 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: 'spring', stiffness: 320, damping: 22 },
} as const
const rise = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35 },
} as const

// Draws one picture of a scene. `step` moves on with the narration.
export function SceneView({
  visual,
  step,
}: {
  visual: SceneVisual
  step: number
}) {
  switch (visual.type) {
    case 'title':
      return <TitleScene visual={visual} />
    case 'idea':
      return <IdeaScene visual={visual} step={step} />
    case 'image':
      return <ImageScene visual={visual} />
    case 'art':
      return (
        <div className="flex h-full items-center justify-center p-[1.5cqw]">
          <ExploreArt
            art={visual.art}
            alt={visual.alt}
            className="h-full max-w-full rounded-2xl"
          />
        </div>
      )
    case 'count':
      return <CountScene visual={visual} step={step} />
    case 'numberline':
      return <NumberLineScene visual={visual} step={step} />
    case 'array':
      return <ArrayScene visual={visual} step={step} />
    case 'fraction':
      return <FractionScene visual={visual} step={step} />
    case 'place':
      return <PlaceScene visual={visual} step={step} />
    case 'compare':
      return <CompareScene visual={visual} step={step} />
    case 'clock':
      return <ClockScene visual={visual} step={step} />
    case 'equation':
      return <EquationScene visual={visual} step={step} />
    case 'words':
      return <WordsScene visual={visual} step={step} />
    case 'letter':
      return <LetterScene visual={visual} step={step} />
    case 'phrase':
      return <PhraseScene visual={visual} step={step} />
    case 'timeline':
      return <TimelineScene visual={visual} step={step} />
    case 'cycle':
      return <CycleScene visual={visual} step={step} />
    case 'steps':
      return <StepsScene visual={visual} step={step} />
    case 'columns':
      return <ColumnsScene visual={visual} step={step} />
    case 'terms':
      return <TermsScene visual={visual} step={step} />
    case 'lab':
      return visual.lab === 'mixture' ? (
        <MixtureLab step={step} />
      ) : (
        <PlantLab step={step} />
      )
    case 'figure':
      return <FigureScene visual={visual} step={step} />
    case 'bars':
      return <BarsScene visual={visual} step={step} />
    case 'thermometer':
      return <ThermometerScene visual={visual} step={step} />
    case 'graph':
      return <GraphScene visual={visual} step={step} />
    case 'balance':
      return <BalanceScene visual={visual} step={step} />
    case 'legacy':
      return (
        <div className="flex h-full items-center justify-center overflow-auto p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-4 text-slate-900">
            <QuestionVisual visual={visual.visual} />
          </div>
        </div>
      )
  }
}

type Of<T extends SceneVisual['type']> = Extract<SceneVisual, { type: T }>

function Svg({ children, h = 540 }: { children: React.ReactNode; h?: number }) {
  return (
    <svg
      viewBox={`0 0 960 ${h}`}
      className="th-svg h-full w-full"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function TitleScene({ visual }: { visual: Of<'title'> }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[2cqw] px-[7cqw] text-center">
      <motion.div className="th-huge" {...pop}>
        {visual.icon}
      </motion.div>
      <motion.h3 className="th-h1" {...rise}>
        {visual.title}
      </motion.h3>
      {visual.tagline && (
        <motion.p
          className="th-p text-[var(--th-muted)]"
          {...rise}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          {visual.tagline}
        </motion.p>
      )}
    </div>
  )
}

function IdeaScene({ visual, step }: { visual: Of<'idea'>; step: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-[1.6cqw] px-[6cqw] py-[3cqw]">
      {visual.heading && (
        <h3 className="th-h2 flex items-center gap-3 text-[var(--th-accent)]">
          {visual.icon && <span>{visual.icon}</span>}
          {visual.heading}
        </h3>
      )}
      <ul className="space-y-[1.3cqw]">
        {visual.points.map(
          (point, i) =>
            i <= step && (
              <motion.li
                key={i}
                {...rise}
                className={`th-p rounded-2xl border-2 p-[1.8cqw] ${i === Math.min(step, visual.points.length - 1) ? 'border-[var(--th-accent)] bg-[var(--th-panel)]' : 'border-transparent bg-[var(--th-panel)] opacity-70'}`}
              >
                {point}
              </motion.li>
            ),
        )}
      </ul>
    </div>
  )
}

function ImageScene({ visual }: { visual: Of<'image'> }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[1.2cqw] p-[2.5cqw]">
      {broken ? (
        <div className="th-huge" aria-hidden="true">
          🖼️
        </div>
      ) : (
        <div className="min-h-0 w-full flex-1 overflow-hidden rounded-2xl bg-white">
          <motion.img
            key={visual.src}
            src={visual.src}
            alt={visual.alt}
            onError={() => setBroken(true)}
            className="h-full w-full object-contain"
            initial={{ scale: 1 }}
            animate={{ scale: 1.07 }}
            transition={{ duration: 14, ease: 'linear' }}
          />
        </div>
      )}
      {visual.caption && (
        <motion.p
          key={visual.caption}
          {...rise}
          className="th-p w-full rounded-xl bg-[var(--th-panel)] px-[2cqw] py-[1cqw] text-center"
        >
          {visual.caption}
        </motion.p>
      )}
    </div>
  )
}

function CountScene({ visual, step }: { visual: Of<'count'>; step: number }) {
  const shown = Math.min(step, visual.total)
  return (
    <div className="flex h-full items-center justify-center gap-[5cqw] px-[5cqw]">
      <div className="grid grid-cols-5 gap-[1.6cqw]">
        {Array.from({ length: visual.total }, (_, i) => (
          <div key={i} className="grid size-[9cqw] place-items-center">
            {i < shown && (
              <motion.span
                {...pop}
                style={{ fontSize: 'clamp(1.6rem, 7.5cqw, 4.5rem)' }}
              >
                {visual.icon}
              </motion.span>
            )}
          </div>
        ))}
      </div>
      <motion.div
        key={shown}
        {...pop}
        className="th-huge grid size-[17cqw] shrink-0 place-items-center rounded-full bg-[var(--th-accent)] text-[var(--th-accent-ink)]"
      >
        {shown}
      </motion.div>
    </div>
  )
}

const tickStep = (range: number) => {
  for (const s of [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000])
    if (range / s <= 12) return s
  return Math.ceil(range / 10)
}

function NumberLineScene({
  visual,
  step,
}: {
  visual: Of<'numberline'>
  step: number
}) {
  const { min, max, start, jumps } = visual
  const x = (v: number) => 70 + ((v - min) / (max - min || 1)) * 820
  const gap = tickStep(max - min)
  const first = Math.ceil(min / gap) * gap
  const ticks = Array.from(
    { length: Math.floor((max - first) / gap) + 1 },
    (_, i) => first + i * gap,
  )
  const done = Math.min(step, jumps.length)
  const stops = jumps
    .slice(0, done)
    .reduce((all, jump) => [...all, all[all.length - 1]! + jump], [start])
  const here = stops[stops.length - 1]!
  return (
    <Svg>
      <line
        x1="40"
        x2="920"
        y1="350"
        y2="350"
        stroke="var(--th-ink)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={x(t)}
            x2={x(t)}
            y1="336"
            y2="364"
            stroke="var(--th-ink)"
            strokeWidth={t === 0 ? 6 : 3}
          />
          <text
            x={x(t)}
            y="402"
            textAnchor="middle"
            fontSize={ticks.length > 10 ? 25 : 31}
            fontWeight={t === here ? 700 : 400}
          >
            {t.toLocaleString()}
          </text>
        </g>
      ))}
      {stops.slice(1).map((stop, i) => {
        const from = x(stops[i]!)
        const to = x(stop)
        const lift = Math.min(130, 60 + Math.abs(to - from) / 3)
        return (
          <g key={i}>
            <motion.path
              d={`M${from} 335 Q${(from + to) / 2} ${335 - lift * 2} ${to} 335`}
              fill="none"
              stroke="var(--th-second)"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7 }}
            />
            <text
              x={(from + to) / 2}
              y={335 - lift - 16}
              textAnchor="middle"
              fontSize="31"
              fontWeight="700"
            >
              {jumps[i]! > 0 ? `+${jumps[i]}` : `−${Math.abs(jumps[i]!)}`}
            </text>
          </g>
        )
      })}
      <motion.g
        initial={{ x: x(start) }}
        animate={{ x: x(here) }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        <circle cy="350" r="19" fill="var(--th-accent)" />
        <text y="318" textAnchor="middle" fontSize="42">
          🐸
        </text>
      </motion.g>
    </Svg>
  )
}

function ArrayScene({ visual, step }: { visual: Of<'array'>; step: number }) {
  const shown = Math.min(step + 1, visual.rows)
  return (
    <div className="flex h-full items-center justify-center gap-[5cqw] px-[4cqw]">
      <div
        className="grid gap-[0.8cqw]"
        style={{ gridTemplateColumns: `repeat(${visual.cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: visual.rows * visual.cols }, (_, i) =>
          Math.floor(i / visual.cols) < shown ? (
            <motion.span
              key={i}
              {...pop}
              style={{
                fontSize: `clamp(0.9rem, ${Math.max(2.6, 28 / Math.max(visual.rows + 2, visual.cols))}cqw, 3.6rem)`,
              }}
            >
              {visual.icon ?? '🟠'}
            </motion.span>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
      <div className="shrink-0 text-center">
        <p className="th-h1">
          {shown} × {visual.cols}
        </p>
        <motion.p
          key={shown}
          {...pop}
          className="th-huge text-[var(--th-accent)]"
        >
          {shown * visual.cols}
        </motion.p>
      </div>
    </div>
  )
}

function Pie({
  parts,
  filled,
  cx,
  r,
  cut,
}: {
  parts: number
  filled: number
  cx: number
  r: number
  cut: boolean
}) {
  return (
    <g>
      {Array.from({ length: parts }, (_, i) => {
        const a = (i / parts) * Math.PI * 2 - Math.PI / 2
        const b = ((i + 1) / parts) * Math.PI * 2 - Math.PI / 2
        const big = b - a > Math.PI ? 1 : 0
        const path =
          parts === 1
            ? `M${cx - r} 260a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`
            : `M${cx} 260L${cx + r * Math.cos(a)} ${260 + r * Math.sin(a)}A${r} ${r} 0 ${big} 1 ${cx + r * Math.cos(b)} ${260 + r * Math.sin(b)}Z`
        return (
          <motion.path
            key={i}
            d={path}
            animate={{
              fill: i < filled ? 'var(--th-accent)' : 'var(--th-panel)',
            }}
            stroke="var(--th-ink)"
            strokeWidth={cut ? 4 : 0}
          />
        )
      })}
      <circle
        cx={cx}
        cy="260"
        r={r}
        fill="none"
        stroke="var(--th-ink)"
        strokeWidth="5"
      />
    </g>
  )
}

function Bar({
  parts,
  filled,
  y,
  cut,
}: {
  parts: number
  filled: number
  y: number
  cut: boolean
}) {
  const w = 760 / parts
  return (
    <g>
      {Array.from({ length: parts }, (_, i) => (
        <motion.rect
          key={i}
          x={100 + i * w}
          y={y}
          width={w}
          height="100"
          animate={{
            fill: i < filled ? 'var(--th-accent)' : 'var(--th-panel)',
          }}
          stroke="var(--th-ink)"
          strokeWidth={cut ? 4 : 0}
        />
      ))}
      <rect
        x="100"
        y={y}
        width="760"
        height="100"
        fill="none"
        stroke="var(--th-ink)"
        strokeWidth="5"
      />
    </g>
  )
}

// Line 1 shows the whole, line 2 cuts it, line 3 shades the parts.
function FractionScene({
  visual,
  step,
}: {
  visual: Of<'fraction'>
  step: number
}) {
  const { parts, filled, second } = visual
  const cut = step >= 1
  const shade = step >= 2 ? filled : 0
  const label = (text: string, x: number, y: number) => (
    <motion.text
      key={text}
      x={x}
      y={y}
      textAnchor="middle"
      fontSize="58"
      fontWeight="700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {text}
    </motion.text>
  )
  if (visual.form === 'circle') {
    const both = second && step >= 3
    return (
      <Svg>
        <Pie
          parts={cut ? parts : 1}
          filled={shade && cut ? shade : 0}
          cx={both ? 270 : 480}
          r={170}
          cut={cut}
        />
        {step >= 2 &&
          !visual.inWords &&
          label(`${filled}/${parts}`, both ? 270 : 480, 495)}
        {both && (
          <>
            <Pie
              parts={second.parts}
              filled={second.filled}
              cx={690}
              r={170}
              cut
            />
            {label(`${second.filled}/${second.parts}`, 690, 495)}
          </>
        )}
      </Svg>
    )
  }
  return (
    <Svg>
      <Bar
        parts={cut ? parts : 1}
        filled={shade && cut ? shade : 0}
        y={second && step >= 3 ? 120 : 190}
        cut={cut}
      />
      {step >= 2 &&
        !visual.inWords &&
        !(second && step >= 3) &&
        label(`${filled}/${parts}`, 480, 370)}
      {second && step >= 3 && (
        <>
          <Bar parts={second.parts} filled={second.filled} y={290} cut />
          {label(
            `${filled}/${parts} = ${second.filled}/${second.parts}`,
            480,
            465,
          )}
        </>
      )}
    </Svg>
  )
}

const PLACE_NAMES = [
  'ones',
  'tens',
  'hundreds',
  'thousands',
  'ten thousands',
  'hundred thousands',
  'millions',
]

function PlaceScene({ visual, step }: { visual: Of<'place'>; step: number }) {
  const digits = String(Math.abs(visual.value)).split('')
  const active = Math.min(step, digits.length - 1)
  const name = PLACE_NAMES[digits.length - 1 - active] ?? ''
  const worth =
    Number(digits[active]) * 10 ** (digits.length - 1 - active)
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[3cqw] px-[3cqw]">
      <div className="flex gap-[1cqw]">
        {digits.map((d, i) => (
          <motion.div
            key={i}
            animate={{ y: i === active ? -10 : 0, scale: i === active ? 1.1 : 1 }}
            className={`grid min-h-[17cqw] min-w-[11cqw] place-items-center rounded-2xl border-2 px-[1cqw] ${i === active ? 'border-[var(--th-accent)] bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : 'border-[var(--th-line)] bg-[var(--th-panel)]'}`}
          >
            <span className="th-huge">{d}</span>
          </motion.div>
        ))}
      </div>
      <motion.p key={active} {...rise} className="th-h2 text-center">
        {digits[active]} {name} = {worth.toLocaleString()}
      </motion.p>
    </div>
  )
}

function CompareScene({
  visual,
  step,
}: {
  visual: Of<'compare'>
  step: number
}) {
  const a = String(visual.a)
  const b = String(visual.b)
  const width = Math.max(a.length, b.length)
  const pa = a.padStart(width)
  const pb = b.padStart(width)
  const differ = [...pa].findIndex((c, i) => c !== pb[i])
  const sign = visual.a < visual.b ? '<' : visual.a > visual.b ? '>' : '='
  const row = (text: string) => (
    <div className="flex justify-center gap-[0.6cqw]">
      {[...text].map((c, i) => (
        <motion.span
          key={i}
          animate={{ scale: step >= 1 && i === differ ? 1.14 : 1 }}
          className={`th-h1 grid min-h-[9cqw] min-w-[7cqw] place-items-center rounded-xl ${c === ' ' ? '' : step >= 1 && i === differ ? 'bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : step >= 1 && i < differ ? 'bg-[var(--th-panel)] opacity-60' : 'bg-[var(--th-panel)]'}`}
        >
          {c}
        </motion.span>
      ))}
    </div>
  )
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[1.5cqw]">
      {row(pa)}
      <div className="h-[9cqw]">
        {step >= 2 && (
          <motion.div {...pop} className="th-huge text-[var(--th-second)]">
            {sign}
          </motion.div>
        )}
      </div>
      {row(pb)}
    </div>
  )
}

function ClockScene({ visual, step }: { visual: Of<'clock'>; step: number }) {
  const minute = step >= 1 ? visual.minute : 0
  const hour = (visual.hour % 12) + (step >= 1 ? minute / 60 : 0)
  return (
    <Svg>
      <g transform="translate(480 270)">
        <circle
          r="225"
          fill="var(--th-panel)"
          stroke="var(--th-ink)"
          strokeWidth="9"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2
          return (
            <text
              key={i}
              x={Math.cos(a) * 180}
              y={Math.sin(a) * 180 + 16}
              textAnchor="middle"
              fontSize="44"
              fontWeight="700"
            >
              {i + 1}
            </text>
          )
        })}
        <motion.line
          x1="0"
          y1="0"
          x2="0"
          y2="-110"
          stroke="var(--th-accent)"
          strokeWidth="13"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: hour * 30 }}
          transition={{ duration: 1 }}
          style={{ transformBox: 'view-box', transformOrigin: '0 0' }}
        />
        <motion.line
          x1="0"
          y1="0"
          x2="0"
          y2="-165"
          stroke="var(--th-ink)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ rotate: 0 }}
          animate={{ rotate: minute * 6 }}
          transition={{ duration: 1 }}
          style={{ transformBox: 'view-box', transformOrigin: '0 0' }}
        />
        <circle r="12" fill="var(--th-ink)" />
      </g>
    </Svg>
  )
}

function EquationScene({
  visual,
  step,
}: {
  visual: Of<'equation'>
  step: number
}) {
  return (
    <div className="flex h-full flex-col justify-center gap-[1.2cqw] px-[6cqw]">
      {visual.lines.map(
        (line, i) =>
          i <= step && (
            <motion.div
              key={i}
              {...rise}
              className={`flex flex-wrap items-baseline justify-between gap-x-[3cqw] rounded-xl px-[2cqw] py-[0.8cqw] ${i === Math.min(step, visual.lines.length - 1) ? 'bg-[var(--th-accent-soft)]' : ''}`}
            >
              <span className="th-h1 font-mono">{line.text}</span>
              {line.note && (
                <span className="th-p text-[var(--th-muted)]">{line.note}</span>
              )}
            </motion.div>
          ),
      )}
    </div>
  )
}

function WordsScene({ visual, step }: { visual: Of<'words'>; step: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-[1.6cqw] px-[5cqw]">
      {visual.sentences.map((s, i) => {
        if (i > step) return null
        const parts = s.mark ? s.text.split(s.mark) : [s.text]
        return (
          <motion.div
            key={i}
            {...rise}
            className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--th-panel)] px-[2.4cqw] py-[1.4cqw]"
          >
            <p className="th-h2 font-medium">
              {parts[0]}
              {s.mark && parts.length > 1 && (
                <mark className="rounded-md bg-[var(--th-accent)] px-[0.6cqw] font-bold text-[var(--th-accent-ink)]">
                  {s.mark}
                </mark>
              )}
              {parts.slice(1).join(s.mark)}
            </p>
            {s.label && (
              <span className="th-small rounded-full bg-[var(--th-second-soft)] px-[1.4cqw] py-[0.4cqw] font-semibold">
                {s.label}
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function LetterScene({ visual, step }: { visual: Of<'letter'>; step: number }) {
  const blended = step >= visual.letters.length
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[3cqw] px-[3cqw]">
      <motion.div
        className="flex"
        animate={{ gap: blended ? '0.2cqw' : '2.4cqw' }}
      >
        {visual.letters.map(
          (letter, i) =>
            i <= step && (
              <motion.span
                key={i}
                {...pop}
                className={`th-huge grid min-h-[17cqw] min-w-[13cqw] place-items-center rounded-2xl px-[1cqw] ${i === step && !blended ? 'bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : 'bg-[var(--th-panel)]'}`}
              >
                {letter}
              </motion.span>
            ),
        )}
      </motion.div>
      <div className="h-[9cqw]">
        {blended && (
          <motion.p {...pop} className="th-h1 text-center">
            {visual.icon} {visual.word}
          </motion.p>
        )}
      </div>
    </div>
  )
}

function PhraseScene({ visual, step }: { visual: Of<'phrase'>; step: number }) {
  const index = Math.min(step, visual.items.length - 1)
  const item = visual.items[index]!
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[2cqw] px-[4cqw] text-center">
      <p className="th-small font-semibold tracking-wide text-[var(--th-muted)] uppercase">
        {visual.lang}
      </p>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.phrase}
          initial={{ opacity: 0, rotateX: 50 }}
          animate={{ opacity: 1, rotateX: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[80cqw] rounded-3xl border-4 border-[var(--th-accent)] bg-[var(--th-panel)] px-[3cqw] py-[3cqw]"
        >
          <p className="th-h1">{item.phrase}</p>
          {item.meaning && (
            <p className="th-p mt-[1cqw] text-[var(--th-muted)]">
              {item.meaning}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
      {item.audio && <audio controls src={item.audio} className="h-9" />}
      {visual.items.length > 1 && (
        <div className="flex flex-wrap justify-center gap-[0.8cqw]">
          {visual.items.map((it, i) => (
            <span
              key={it.phrase}
              className={`th-small rounded-full px-[1.4cqw] py-[0.4cqw] font-semibold ${i === index ? 'bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : i < index ? 'bg-[var(--th-accent-soft)]' : 'bg-[var(--th-panel)] text-[var(--th-muted)]'}`}
            >
              {it.phrase}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function TimelineScene({
  visual,
  step,
}: {
  visual: Of<'timeline'>
  step: number
}) {
  const active = Math.min(step, visual.events.length - 1)
  return (
    <div className="flex h-full flex-col justify-center gap-[0.9cqw] px-[4cqw]">
      {visual.events.map((event, i) => (
        <motion.div
          key={event.when}
          animate={{ opacity: i > active ? 0.28 : 1, x: i === active ? 10 : 0 }}
          className={`flex items-center gap-[2cqw] rounded-xl px-[1.6cqw] py-[0.8cqw] ${i === active ? 'bg-[var(--th-accent-soft)]' : ''}`}
        >
          <span
            className={`th-p w-[12cqw] shrink-0 rounded-lg px-[0.5cqw] text-center font-bold ${i <= active ? 'bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : 'bg-[var(--th-panel)]'}`}
          >
            {event.when}
          </span>
          <span className={`th-p ${i === active ? 'font-semibold' : ''}`}>
            {event.what}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function CycleScene({ visual, step }: { visual: Of<'cycle'>; step: number }) {
  const n = visual.stages.length
  const active = step % n
  const at = (i: number) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    return [480 + Math.cos(a) * 300, 270 + Math.sin(a) * 180] as const
  }
  return (
    <Svg>
      <ellipse
        cx="480"
        cy="270"
        rx="300"
        ry="180"
        fill="none"
        stroke="var(--th-line)"
        strokeWidth="6"
        strokeDasharray="14 12"
      />
      {visual.stages.map((stage, i) => {
        const [x, y] = at(i)
        return (
          <motion.g
            key={stage.label}
            animate={{ opacity: i === active ? 1 : 0.55 }}
          >
            <circle
              cx={x}
              cy={y}
              r={i === active ? 62 : 50}
              fill={i === active ? 'var(--th-accent-soft)' : 'var(--th-panel)'}
              stroke={i === active ? 'var(--th-accent)' : 'var(--th-line)'}
              strokeWidth="5"
            />
            <text x={x} y={y + 16} textAnchor="middle" fontSize="48">
              {stage.icon}
            </text>
            <text
              x={x}
              y={y + (i === active ? 92 : 80)}
              textAnchor="middle"
              fontSize="26"
              fontWeight="700"
            >
              {stage.label}
            </text>
          </motion.g>
        )
      })}
    </Svg>
  )
}

function StepsScene({ visual, step }: { visual: Of<'steps'>; step: number }) {
  const active = Math.min(step, visual.steps.length - 1)
  return (
    <div className="flex h-full flex-col justify-center gap-[1.1cqw] px-[4cqw] py-[2cqw]">
      {visual.steps.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: i > active ? 0.3 : 1, scale: i === active ? 1 : 0.97 }}
          className={`flex items-center gap-[2cqw] rounded-2xl border-2 px-[1.8cqw] py-[1cqw] ${i === active ? 'border-[var(--th-accent)] bg-[var(--th-panel)]' : 'border-transparent bg-[var(--th-panel)]'}`}
        >
          <span className="th-h2 grid size-[6cqw] min-h-8 min-w-8 shrink-0 place-items-center rounded-full bg-[var(--th-accent-soft)]">
            {s.icon ?? i + 1}
          </span>
          <span className="th-p">{s.text}</span>
        </motion.div>
      ))}
    </div>
  )
}

function ColumnsScene({
  visual,
  step,
}: {
  visual: Of<'columns'>
  step: number
}) {
  // Items join their columns one at a time, left then right by turn.
  const order: Array<['left' | 'right', number]> = []
  const longest = Math.max(visual.left.items.length, visual.right.items.length)
  for (let i = 0; i < longest; i++) {
    if (i < visual.left.items.length) order.push(['left', i])
    if (i < visual.right.items.length) order.push(['right', i])
  }
  const visible = (side: 'left' | 'right', i: number) =>
    order.findIndex(([s, n]) => s === side && n === i) <= step - 1
  const column = (side: 'left' | 'right', tone: string) => (
    <div className={`flex-1 rounded-2xl p-[1.8cqw] ${tone}`}>
      <h4 className="th-h2 mb-[1cqw] text-center">{visual[side].title}</h4>
      <ul className="space-y-[0.7cqw]">
        {visual[side].items.map(
          (item, i) =>
            visible(side, i) && (
              <motion.li
                key={item}
                {...pop}
                className="th-p rounded-xl bg-[var(--th-panel)] px-[1.4cqw] py-[0.6cqw] text-center"
              >
                {item}
              </motion.li>
            ),
        )}
      </ul>
    </div>
  )
  return (
    <div className="flex h-full items-stretch gap-[2cqw] p-[3cqw]">
      {column('left', 'bg-[var(--th-accent-soft)]')}
      {column('right', 'bg-[var(--th-second-soft)]')}
    </div>
  )
}

function TermsScene({ visual, step }: { visual: Of<'terms'>; step: number }) {
  const index = Math.min(step, visual.terms.length - 1)
  const term = visual.terms[index]!
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[2cqw] px-[5cqw] text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={term.term}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="w-full rounded-3xl bg-[var(--th-panel)] p-[3cqw]"
        >
          <p className="th-h1 text-[var(--th-accent)]">{term.term}</p>
          <p className="th-p mt-[1cqw]">{term.meaning}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap justify-center gap-[0.8cqw]">
        {visual.terms.map((t, i) => (
          <span
            key={t.term}
            className={`th-small rounded-full px-[1.4cqw] py-[0.4cqw] font-semibold ${i === index ? 'bg-[var(--th-accent)] text-[var(--th-accent-ink)]' : 'bg-[var(--th-panel)] text-[var(--th-muted)]'}`}
          >
            {t.term}
          </span>
        ))}
      </div>
    </div>
  )
}

const SAND = Array.from({ length: 34 }, (_, i) => ({
  x: 110 + ((i * 53) % 200),
  y: 230 + ((i * 37) % 190),
  floor: 434 - ((i * 13) % 34),
}))

// 0 water, 1 sand stirred in, 2 sand settles, 3 water through a filter.
function MixtureLab({ step }: { step: number }) {
  const filtering = step >= 3
  return (
    <Svg>
      <motion.g animate={{ x: filtering ? -40 : 240 }}>
        {step >= 1 && (
          <motion.rect
            x="84"
            y="200"
            width="252"
            height="250"
            initial={{ opacity: 0 }}
            animate={{ opacity: step === 1 ? 0.28 : 0 }}
            fill="#b08850"
          />
        )}
        <rect x="84" y="200" width="252" height="250" fill="#6cc4ee" opacity=".55" />
        {step >= 1 &&
          SAND.map((grain, i) => (
            <motion.circle
              key={i}
              r="6"
              fill="#b5863f"
              cx={grain.x}
              initial={{ cy: 120, opacity: 0 }}
              animate={
                step === 1
                  ? {
                      cy: [grain.y, grain.y - 26, grain.y],
                      opacity: 1,
                    }
                  : { cy: grain.floor, opacity: 1 }
              }
              transition={
                step === 1
                  ? { duration: 2.4, repeat: Infinity, delay: i * 0.04 }
                  : { duration: 1.8, delay: i * 0.02 }
              }
            />
          ))}
        <path
          d="M80 130v310a14 14 0 0 0 14 14h232a14 14 0 0 0 14-14V130"
          fill="none"
          stroke="var(--th-ink)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <text x="210" y="510" textAnchor="middle" fontSize="30" fontWeight="700">
          {step === 0
            ? 'clear water'
            : step === 1
              ? 'sand + water mixture'
              : filtering
                ? 'pour gently'
                : 'the sand settles'}
        </text>
      </motion.g>
      {filtering && (
        <motion.g
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <path
            d="M340 180C380 130 420 120 500 150"
            fill="none"
            stroke="#6cc4ee"
            strokeWidth="14"
            strokeLinecap="round"
            opacity=".8"
          />
          <path d="M470 150h220l-90 120h-40Z" fill="var(--th-panel)" stroke="var(--th-ink)" strokeWidth="7" />
          <path d="M490 165h180l-72 90h-36Z" fill="#fff3d6" />
          {SAND.slice(0, 16).map((_, i) => (
            <circle key={i} cx={530 + (i * 17) % 100} cy={205 + (i * 11) % 34} r="5" fill="#b5863f" />
          ))}
          <rect x="560" y="270" width="40" height="30" fill="var(--th-panel)" stroke="var(--th-ink)" strokeWidth="6" />
          {[0, 1, 2].map((i) => (
            <motion.circle
              key={i}
              cx="580"
              r="8"
              fill="#6cc4ee"
              animate={{ cy: [305, 410], opacity: [1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
          <rect x="470" y="370" width="220" height="80" fill="#6cc4ee" opacity=".55" />
          <path
            d="M466 310v130a14 14 0 0 0 14 14h200a14 14 0 0 0 14-14V310"
            fill="none"
            stroke="var(--th-ink)"
            strokeWidth="8"
          />
          <text x="580" y="510" textAnchor="middle" fontSize="30" fontWeight="700">
            clear water passes
          </text>
          <text x="800" y="225" fontSize="28" fontWeight="700" textAnchor="middle">
            filter traps
          </text>
          <text x="800" y="260" fontSize="28" fontWeight="700" textAnchor="middle">
            the sand
          </text>
        </motion.g>
      )}
    </Svg>
  )
}

function Arrow({
  d,
  colour,
  label,
  lx,
  ly,
}: {
  d: string
  colour: string
  label: string
  lx: number
  ly: number
}) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.path
        d={d}
        fill="none"
        stroke={colour}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="4 22"
        animate={{ strokeDashoffset: [52, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <text x={lx} y={ly} fontSize="29" fontWeight="700" textAnchor="middle">
        {label}
      </text>
    </motion.g>
  )
}

// 0 plant, 1 light, 2 water, 3 carbon dioxide, 4 sugar and oxygen.
function PlantLab({ step }: { step: number }) {
  return (
    <Svg>
      <rect x="0" y="430" width="960" height="110" fill="#7c5a3a" />
      <motion.g
        animate={{ rotate: step >= 1 ? 8 : 0 }}
        style={{ transformOrigin: '110px 90px' }}
      >
        <circle cx="110" cy="90" r="58" fill="#fcc419" />
      </motion.g>
      <path d="M480 430C480 340 476 280 480 180" stroke="#2f7d32" strokeWidth="16" fill="none" />
      <path d="M480 300C400 250 340 260 290 300 350 345 420 345 480 300ZM480 240C560 180 620 190 680 230 620 280 545 285 480 240ZM480 180C440 120 450 80 485 40 520 85 525 130 480 180Z" fill={step >= 4 ? '#37b24d' : '#40a045'} stroke="#2b6f2f" strokeWidth="4" />
      <path d="M480 430 440 500M480 430 480 520M480 430 530 505M455 470 410 490M505 470 560 480" stroke="#e9d8b4" strokeWidth="7" fill="none" strokeLinecap="round" />
      {step >= 1 && (
        <Arrow d="M160 130 340 260" colour="#f59f00" label="sunlight" lx={235} ly={235} />
      )}
      {step >= 2 && (
        <Arrow d="M480 505V330" colour="#339af0" label="water from the roots" lx={700} ly={480} />
      )}
      {step >= 3 && (
        <Arrow d="M880 150 650 225" colour="var(--th-muted)" label="carbon dioxide" lx={790} ly={130} />
      )}
      {step >= 4 && (
        <>
          <Arrow d="M340 240 180 330" colour="#51cf66" label="oxygen goes out" lx={160} ly={380} />
          <motion.text
            {...pop}
            x="600"
            y="345"
            fontSize="31"
            fontWeight="700"
            textAnchor="middle"
          >
            sugar is made here
          </motion.text>
        </>
      )}
    </Svg>
  )
}

type Limbs = {
  lean: number
  armL: [number, number]
  armR: [number, number]
  legL: [number, number]
  legR: [number, number]
  x: number
  y: number
}
const POSES: Record<Pose, Limbs> = {
  stand: { lean: 0, armL: [165, 175], armR: [195, 185], legL: [172, 178], legR: [188, 182], x: 0, y: 0 },
  ready: { lean: 8, armL: [150, 100], armR: [210, 250], legL: [155, 195], legR: [205, 170], x: 0, y: 8 },
  runLeft: { lean: -16, armL: [235, 290], armR: [120, 60], legL: [230, 170], legR: [150, 230], x: -230, y: 0 },
  runRight: { lean: 16, armL: [240, 300], armR: [125, 70], legL: [210, 130], legR: [130, 190], x: 230, y: 0 },
  jump: { lean: 0, armL: [40, 20], armR: [320, 340], legL: [200, 130], legR: [160, 230], x: 0, y: -80 },
  land: { lean: 18, armL: [110, 70], armR: [250, 290], legL: [120, 195], legR: [240, 165], x: 0, y: 44 },
  balance: { lean: 0, armL: [100, 95], armR: [260, 265], legL: [180, 180], legR: [110, 200], x: 0, y: 0 },
  kick: { lean: -12, armL: [210, 170], armR: [130, 100], legL: [185, 180], legR: [85, 95], x: 0, y: 0 },
  catch: { lean: 6, armL: [70, 90], armR: [60, 85], legL: [165, 190], legR: [195, 175], x: 0, y: 6 },
  throw: { lean: -10, armL: [80, 95], armR: [300, 20], legL: [150, 180], legR: [205, 180], x: 0, y: 0 },
  stretch: { lean: 0, armL: [25, 15], armR: [335, 345], legL: [165, 170], legR: [195, 190], x: 0, y: 0 },
  situp: { lean: 60, armL: [120, 40], armR: [120, 40], legL: [80, 170], legR: [80, 170], x: 0, y: 92 },
  dance: { lean: 8, armL: [60, 10], armR: [240, 300], legL: [150, 190], legR: [210, 170], x: 0, y: -8 },
}
const LIMB = { upper: 62, lower: 62, torso: 112 }

function polar(x: number, y: number, deg: number, len: number) {
  const rad = (deg * Math.PI) / 180
  return [x + Math.sin(rad) * len, y - Math.cos(rad) * len] as const
}

function FigureScene({ visual, step }: { visual: Of<'figure'>; step: number }) {
  const name = visual.poses[Math.min(step, visual.poses.length - 1)] ?? 'stand'
  const pose = POSES[name]
  const hip = [480 + pose.x, 330 + pose.y] as const
  const neck = polar(hip[0], hip[1], pose.lean, LIMB.torso)
  const head = polar(neck[0], neck[1], pose.lean, 44)
  const limb = (from: readonly [number, number], [a, b]: [number, number]) => {
    const mid = polar(from[0], from[1], a, LIMB.upper)
    const end = polar(mid[0], mid[1], b, LIMB.lower)
    return [mid, end] as const
  }
  const shoulder = polar(hip[0], hip[1], pose.lean, LIMB.torso - 14)
  const parts = [
    [shoulder, ...limb(shoulder, pose.armL), 'var(--th-second)'],
    [shoulder, ...limb(shoulder, pose.armR), 'var(--th-second)'],
    [hip, ...limb(hip, pose.legL), 'var(--th-accent)'],
    [hip, ...limb(hip, pose.legR), 'var(--th-accent)'],
  ] as const
  const spring = { type: 'spring', stiffness: 90, damping: 14 } as const
  const cue = visual.cue?.[Math.min(step, visual.cue.length - 1)]
  return (
    <Svg>
      <line x1="40" x2="920" y1="462" y2="462" stroke="var(--th-line)" strokeWidth="8" />
      {[-290, -90, 90, 290].map((dx) => (
        <path
          key={dx}
          d={`M${480 + dx - 22} 462l22-52 22 52Z`}
          fill="var(--th-second)"
          opacity=".75"
        />
      ))}
      {parts.map(([from, mid, end, colour], i) => (
        <g key={i}>
          <motion.line
            animate={{ x1: from[0], y1: from[1], x2: mid[0], y2: mid[1] }}
            transition={spring}
            stroke={colour}
            strokeWidth="17"
            strokeLinecap="round"
          />
          <motion.line
            animate={{ x1: mid[0], y1: mid[1], x2: end[0], y2: end[1] }}
            transition={spring}
            stroke={colour}
            strokeWidth="15"
            strokeLinecap="round"
          />
        </g>
      ))}
      <motion.line
        animate={{ x1: hip[0], y1: hip[1], x2: neck[0], y2: neck[1] }}
        transition={spring}
        stroke="var(--th-ink)"
        strokeWidth="22"
        strokeLinecap="round"
      />
      <motion.circle
        animate={{ cx: head[0], cy: head[1] }}
        transition={spring}
        r="34"
        fill="#8d5a34"
      />
      {visual.ball && (
        <motion.circle
          animate={{
            cx: parts[3][2][0] + 30,
            cy: Math.min(446, parts[3][2][1] + 6),
          }}
          transition={spring}
          r="18"
          fill="#fcc419"
          stroke="var(--th-ink)"
          strokeWidth="4"
        />
      )}
      {cue && (
        <motion.text
          key={cue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          x="480"
          y="60"
          textAnchor="middle"
          fontSize="38"
          fontWeight="700"
        >
          {cue}
        </motion.text>
      )}
    </Svg>
  )
}

function BarsScene({ visual, step }: { visual: Of<'bars'>; step: number }) {
  const top = Math.max(...visual.values, 1)
  const gap = 760 / visual.values.length
  return (
    <Svg>
      <line x1="90" x2="890" y1="440" y2="440" stroke="var(--th-ink)" strokeWidth="5" />
      {visual.values.map((value, i) => {
        const shown = i <= step
        const h = shown ? (value / top) * 330 : 0
        return (
          <g key={i}>
            <motion.rect
              x={110 + i * gap + gap * 0.18}
              width={gap * 0.64}
              rx="10"
              fill="var(--th-accent)"
              initial={{ y: 440, height: 0 }}
              animate={{ y: 440 - h, height: h }}
              transition={{ duration: 0.6 }}
            />
            {shown && (
              <text
                x={110 + i * gap + gap / 2}
                y={425 - h}
                textAnchor="middle"
                fontSize="34"
                fontWeight="700"
              >
                {value}
              </text>
            )}
            <text
              x={110 + i * gap + gap / 2}
              y="486"
              textAnchor="middle"
              fontSize="28"
            >
              {visual.labels[i]}
            </text>
          </g>
        )
      })}
    </Svg>
  )
}

function ThermometerScene({
  visual,
  step,
}: {
  visual: Of<'thermometer'>
  step: number
}) {
  const end = visual.start + visual.change
  const low = Math.min(visual.start, end, 0) - 5
  const high = Math.max(visual.start, end, 0) + 5
  const y = (v: number) => 470 - ((v - low) / (high - low)) * 410
  const now = step >= 1 ? end : visual.start
  const gap = tickStep(high - low)
  const first = Math.ceil(low / gap) * gap
  const ticks = Array.from(
    { length: Math.floor((high - first) / gap) + 1 },
    (_, i) => first + i * gap,
  )
  return (
    <Svg>
      <rect x="440" y="40" width="80" height="450" rx="40" fill="var(--th-panel)" stroke="var(--th-ink)" strokeWidth="6" />
      <motion.rect
        x="456"
        width="48"
        fill={now < 0 ? '#339af0' : '#f03e3e'}
        initial={{ y: y(visual.start), height: 490 - y(visual.start) }}
        animate={{ y: y(now), height: 480 - y(now) }}
        transition={{ duration: 1.1 }}
        rx="20"
      />
      {ticks.map((t) => (
        <g key={t}>
          <line x1="520" x2={t === 0 ? 570 : 548} y1={y(t)} y2={y(t)} stroke="var(--th-ink)" strokeWidth={t === 0 ? 6 : 3} />
          <text x="585" y={y(t) + 11} fontSize="29" fontWeight={t === 0 ? 700 : 400}>
            {t}°
          </text>
        </g>
      ))}
      <motion.g animate={{ y: y(now) }} initial={{ y: y(visual.start) }} transition={{ duration: 1.1 }}>
        <text x="330" y="14" fontSize="66" fontWeight="700" textAnchor="middle">
          {now}°C
        </text>
      </motion.g>
      {step >= 1 && (
        <motion.text {...pop} x="780" y="270" textAnchor="middle" fontSize="48" fontWeight="700">
          {visual.change > 0 ? `+${visual.change}` : `−${Math.abs(visual.change)}`}
        </motion.text>
      )}
    </Svg>
  )
}

function GraphScene({ visual, step }: { visual: Of<'graph'>; step: number }) {
  const { slope, intercept, points } = visual
  const ys = points.map((p) => slope * p + intercept)
  const maxX = Math.max(...points.map(Math.abs), 1) + 1
  const maxY = Math.max(...ys.map(Math.abs), 1) + 1
  const px = (v: number) => 480 + (v / maxX) * 380
  const py = (v: number) => 270 - (v / maxY) * 225
  const shown = Math.min(step, points.length)
  const whole = step > points.length
  const yLine = (v: number) => slope * v + intercept
  const lx = Math.min(maxX, (maxY - intercept) / (slope || 1))
  const lx0 = Math.max(-maxX, (-maxY - intercept) / (slope || 1))
  const label = (n: number) => (n < 0 ? `−${Math.abs(n)}` : `${n}`)
  return (
    <Svg>
      {Array.from({ length: 2 * maxX + 1 }, (_, i) => i - maxX).map((v) => (
        <line key={`x${v}`} x1={px(v)} x2={px(v)} y1="30" y2="510" stroke="var(--th-line)" strokeWidth="1.5" />
      ))}
      {Array.from({ length: 2 * maxY + 1 }, (_, i) => i - maxY)
        .filter((v) => v % Math.ceil(maxY / 6) === 0)
        .map((v) => (
          <g key={`y${v}`}>
            <line x1="90" x2="870" y1={py(v)} y2={py(v)} stroke="var(--th-line)" strokeWidth="1.5" />
            {v !== 0 && (
              <text x="466" y={py(v) + 8} fontSize="23" textAnchor="end">
                {label(v)}
              </text>
            )}
          </g>
        ))}
      <line x1="90" x2="870" y1={py(0)} y2={py(0)} stroke="var(--th-ink)" strokeWidth="4" />
      <line x1={px(0)} x2={px(0)} y1="30" y2="510" stroke="var(--th-ink)" strokeWidth="4" />
      {whole && (
        <motion.line
          x1={px(lx0)}
          y1={py(yLine(lx0))}
          x2={px(lx)}
          y2={py(yLine(lx))}
          stroke="var(--th-accent)"
          strokeWidth="7"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}
      {points.slice(0, shown).map((p) => (
        <motion.g key={p} {...pop}>
          <circle cx={px(p)} cy={py(yLine(p))} r="13" fill="var(--th-second)" />
          <text x={px(p) + 22} y={py(yLine(p)) - 14} fontSize="28" fontWeight="700">
            ({label(p)}, {label(yLine(p))})
          </text>
        </motion.g>
      ))}
    </Svg>
  )
}

function BalanceScene({
  visual,
  step,
}: {
  visual: Of<'balance'>
  step: number
}) {
  const lines = visual.lines ?? [`${visual.left} = ${visual.right}`]
  const current = lines[Math.min(step, lines.length - 1)]!
  const [left, right] = current.split('=').map((s) => s.trim())
  return (
    <Svg>
      <path d="M480 180v270M400 462h160" stroke="var(--th-ink)" strokeWidth="11" strokeLinecap="round" />
      <line x1="170" x2="790" y1="180" y2="180" stroke="var(--th-ink)" strokeWidth="11" strokeLinecap="round" />
      {[{ x: 170, text: left }, { x: 790, text: right }].map(({ x, text }) => (
        <g key={x}>
          <path d={`M${x} 180l-112 158M${x} 180l112 158`} stroke="var(--th-muted)" strokeWidth="4" />
          <path d={`M${x - 130} 338h260a130 40 0 0 1-260 0Z`} fill="var(--th-accent-soft)" stroke="var(--th-ink)" strokeWidth="5" />
          <motion.text
            key={text}
            x={x}
            y="310"
            textAnchor="middle"
            fontSize="52"
            fontWeight="700"
            initial={{ opacity: 0, y: 270 }}
            animate={{ opacity: 1, y: 310 }}
          >
            {text}
          </motion.text>
        </g>
      ))}
      <text x="480" y="90" textAnchor="middle" fontSize="48" fontWeight="700">
        {current}
      </text>
    </Svg>
  )
}
