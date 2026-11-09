import { useId } from 'react'
import type {
  Art,
  Figure,
  Good,
  HistorySource,
  Motif,
  Pose,
  Shape,
  Solid,
  ThenNow,
} from '#/lib/kidilearn/explore/types'

// Pictures drawn from code, so they stay sharp on any screen and a small phone
// downloads text rather than images. Light, shading and shadow make each object
// look like the thing a child can pick up.

const INK = '#22303c'
const CAP_COLOURS = ['#d9412f', '#e8a317', '#1f8a70', '#2b6cb0']

type P = { id: string }

function Defs({ id }: P) {
  return (
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fdf8ee" />
        <stop offset="1" stopColor="#f3e7d2" />
      </linearGradient>
      <linearGradient id={`${id}wood`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c58b52" />
        <stop offset="1" stopColor="#8f5a2c" />
      </linearGradient>
      <linearGradient id={`${id}crust`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e2a65a" />
        <stop offset=".55" stopColor="#c47f33" />
        <stop offset="1" stopColor="#8d5420" />
      </linearGradient>
      <radialGradient id={`${id}crumb`} cx=".4" cy=".35" r=".8">
        <stop offset="0" stopColor="#fff5df" />
        <stop offset="1" stopColor="#f0d6a6" />
      </radialGradient>
      <radialGradient id={`${id}cream`} cx=".4" cy=".3" r=".9">
        <stop offset="0" stopColor="#fffdf8" />
        <stop offset="1" stopColor="#f2dfc9" />
      </radialGradient>
      <radialGradient id={`${id}berry`} cx=".4" cy=".3" r=".9">
        <stop offset="0" stopColor="#f58aa0" />
        <stop offset="1" stopColor="#c93a5c" />
      </radialGradient>
      {CAP_COLOURS.map((c, i) => (
        <radialGradient key={c} id={`${id}cap${i}`} cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#fff" stopOpacity=".85" />
          <stop offset=".3" stopColor={c} />
          <stop offset="1" stopColor={c} stopOpacity=".78" />
        </radialGradient>
      ))}
      <linearGradient id={`${id}metal`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fbfdff" />
        <stop offset=".5" stopColor="#c7d2dc" />
        <stop offset="1" stopColor="#8b99a7" />
      </linearGradient>
      <linearGradient id={`${id}glass`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a9d6e8" stopOpacity=".55" />
        <stop offset=".22" stopColor="#f2fbff" stopOpacity=".9" />
        <stop offset=".6" stopColor="#b7deee" stopOpacity=".5" />
        <stop offset="1" stopColor="#7fb6cf" stopOpacity=".75" />
      </linearGradient>
      <linearGradient id={`${id}water`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6fc3e6" />
        <stop offset="1" stopColor="#2a7fb5" />
      </linearGradient>
      {SKINS.map((c, i) => (
        <radialGradient key={c} id={`${id}skin${i}`} cx=".38" cy=".32" r=".8">
          <stop offset="0" stopColor={`color-mix(in srgb, ${c} 70%, white)`} />
          <stop offset="1" stopColor={c} />
        </radialGradient>
      ))}
      <filter id={`${id}shadow`} x="-20%" y="-20%" width="140%" height="150%">
        <feDropShadow
          dx="0"
          dy="4"
          stdDeviation="4"
          floodColor="#3b2a14"
          floodOpacity=".32"
        />
      </filter>
      <filter id={`${id}soft`} x="-30%" y="-80%" width="160%" height="260%">
        <feGaussianBlur stdDeviation="7" />
      </filter>
    </defs>
  )
}

// A label on a light card, so it stays readable over wood or a busy picture.
const Caption = ({ text, y = 340 }: { text?: string; y?: number }) =>
  text ? (
    <g>
      <rect
        x={320 - Math.min(text.length * 6.4 + 18, 310)}
        y={y - 25}
        width={Math.min(text.length * 12.8 + 36, 620)}
        height="36"
        rx="18"
        fill="#fffdf8"
        opacity=".94"
      />
      <text
        x="320"
        y={y}
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill={INK}
      >
        {text}
      </text>
    </g>
  ) : null

// The total of a side such as "8 + 5".
const sideValue = (side: string) =>
  side.split('+').reduce((sum, part) => sum + Number(part.trim() || 0), 0)

// A table top in soft light, for objects to sit on.
function Table({ id, y = 250 }: P & { y?: number }) {
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <rect y={y} width="640" height={360 - y} fill={`url(#${id}wood)`} />
      <rect y={y} width="640" height="4" fill="#fff" opacity=".22" />
      {[0.25, 0.55, 0.8].map((f) => (
        <path
          key={f}
          d={`M0 ${y + (360 - y) * f}C200 ${y + (360 - y) * f - 7} 430 ${y + (360 - y) * f + 8} 640 ${y + (360 - y) * f}`}
          fill="none"
          stroke="#6d4120"
          strokeOpacity=".22"
          strokeWidth="2"
        />
      ))}
    </>
  )
}

function Paper({ id }: P) {
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <rect
        x="18"
        y="14"
        width="604"
        height="332"
        rx="14"
        fill="#fff"
        filter={`url(#${id}shadow)`}
      />
    </>
  )
}

function Cap({
  id,
  x,
  y,
  r = 9,
  tone = 0,
}: P & { x: number; y: number; r?: number; tone?: number }) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={`url(#${id}cap${tone % CAP_COLOURS.length})`}
        stroke="#00000033"
      />
      <circle
        cx={x}
        cy={y}
        r={r * 0.62}
        fill="none"
        stroke="#ffffff66"
        strokeWidth="1.2"
      />
    </g>
  )
}

function Loaf({ id, art }: P & { art: Extract<Art, { kind: 'loaf' }> }) {
  const bounds = art.unequal
    ? [0, 0.72, 1]
    : Array.from({ length: art.cuts + 1 }, (_, i) => i / art.cuts)
  const gap = art.cuts === 1 ? 0 : 14
  const total = 500 - gap * (bounds.length - 2)
  let x = 70
  return (
    <>
      <Table id={id} />
      <ellipse
        cx="320"
        cy="252"
        rx="280"
        ry="14"
        fill="#2a1a0a"
        opacity=".45"
        filter={`url(#${id}soft)`}
      />
      {bounds.slice(1).map((end, i) => {
        const w = (end - bounds[i]!) * total
        const left = x
        x += w + gap
        const picked = art.picked === i
        return (
          <g
            key={i}
            transform={picked ? 'translate(0 -18)' : undefined}
            filter={`url(#${id}shadow)`}
          >
            <rect
              x={left}
              y="118"
              width={w}
              height="130"
              rx={i === 0 || i === bounds.length - 2 ? 38 : 14}
              fill={`url(#${id}crust)`}
              stroke={picked ? '#d9412f' : '#00000022'}
              strokeWidth={picked ? 5 : 1}
            />
            <rect
              x={left + 12}
              y="132"
              width={Math.max(w - 24, 6)}
              height="10"
              rx="5"
              fill="#fff"
              opacity=".22"
            />
            {i > 0 && (
              <rect
                x={left}
                y="124"
                width="9"
                height="118"
                rx="4"
                fill={`url(#${id}crumb)`}
              />
            )}
          </g>
        )
      })}
      <Caption text={art.label} y={320} />
    </>
  )
}

function polar(cx: number, cy: number, r: number, turn: number) {
  const a = turn * 2 * Math.PI - Math.PI / 2
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

function Cake({ id, art }: P & { art: Extract<Art, { kind: 'cake' }> }) {
  const cx = 320
  const cy = 165
  const r = 118
  return (
    <>
      <Table id={id} y={150} />
      <ellipse
        cx={cx}
        cy={cy + 10}
        rx={r + 26}
        ry={r + 16}
        fill="#2a1a0a"
        opacity=".35"
        filter={`url(#${id}soft)`}
      />
      <circle cx={cx} cy={cy} r={r + 16} fill={`url(#${id}metal)`} />
      {Array.from({ length: art.parts }, (_, i) => {
        const [x1, y1] = polar(cx, cy, r, i / art.parts)
        const [x2, y2] = polar(cx, cy, r, (i + 1) / art.parts)
        const on = i < art.picked
        const [dx, dy] = polar(0, 0, on ? 12 : 0, (i + 0.5) / art.parts)
        return (
          <path
            key={i}
            transform={`translate(${dx} ${dy})`}
            d={
              art.parts === 1
                ? `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`
                : `M${cx} ${cy}L${x1} ${y1}A${r} ${r} 0 ${art.parts <= 2 ? 1 : 0} 1 ${x2} ${y2}Z`
            }
            fill={`url(#${id}${on ? 'berry' : 'cream'})`}
            stroke="#a9825a"
            strokeWidth="2.5"
          />
        )
      })}
      <Caption text={art.label} y={336} />
    </>
  )
}

function Caps({ id, art }: P & { art: Extract<Art, { kind: 'caps' }> }) {
  const columns: Array<React.ReactNode> = []
  let x = 40
  for (let h = 0; h < art.hundreds; h++) {
    const left = x
    columns.push(
      <g key={`h${h}`} filter={`url(#${id}shadow)`}>
        <rect
          x={left - 5}
          y="34"
          width="146"
          height="206"
          rx="8"
          fill="#fff8ea"
          stroke="#c9b48c"
        />
        {Array.from({ length: 100 }, (_, i) => (
          <Cap
            key={i}
            id={id}
            x={left + 7 + (i % 10) * 13.6}
            y={46 + Math.floor(i / 10) * 20}
            r={5.8}
            tone={0}
          />
        ))}
      </g>,
    )
    x += 160
  }
  for (let t = 0; t < art.tens; t++) {
    const left = x
    columns.push(
      <g key={`t${t}`} filter={`url(#${id}shadow)`}>
        <line
          x1={left}
          x2={left}
          y1="28"
          y2="240"
          stroke="#7a5a33"
          strokeWidth="2.5"
        />
        {Array.from({ length: 10 }, (_, i) => (
          <Cap key={i} id={id} x={left} y={42 + i * 20.5} tone={2} />
        ))}
      </g>,
    )
    x += 26
  }
  x += 8
  for (let o = 0; o < art.ones; o++)
    columns.push(
      <Cap
        key={`o${o}`}
        id={id}
        x={x + (o % 3) * 22}
        y={218 - Math.floor(o / 3) * 24}
        r={10}
        tone={1}
      />,
    )
  return (
    <>
      <Table id={id} />
      {columns}
      <Caption
        text={
          art.label ??
          `${art.hundreds} hundreds, ${art.tens} tens, ${art.ones} ones`
        }
        y={320}
      />
    </>
  )
}

function Groups({ id, art }: P & { art: Extract<Art, { kind: 'groups' }> }) {
  const left = art.left ?? 0
  // A single group sits alone in the middle.
  const perRow =
    art.groups === 1 && !left
      ? 1
      : Math.ceil(Math.sqrt(art.groups + (left ? 1 : 0)) * 1.6)
  const cell = 600 / perRow
  const rows = Math.ceil((art.groups + (left ? 1 : 0)) / perRow)
  const height = 240 / rows
  const place = (i: number) =>
    [20 + (i % perRow) * cell, 14 + Math.floor(i / perRow) * height] as const
  const items = (x: number, y: number, n: number, tone: number) => {
    const across = Math.ceil(Math.sqrt(n))
    const r = Math.min(
      (cell - 24) / across / 2.3,
      (height - 26) / Math.ceil(n / across) / 2.3,
      12,
    )
    return Array.from({ length: n }, (_, i) => (
      <Cap
        key={i}
        id={id}
        x={x + cell / 2 - ((across - 1) * r * 2.3) / 2 + (i % across) * r * 2.3}
        y={
          y +
          height / 2 -
          ((Math.ceil(n / across) - 1) * r * 2.3) / 2 +
          Math.floor(i / across) * r * 2.3 -
          3
        }
        r={r}
        tone={tone}
      />
    ))
  }
  return (
    <>
      <Table id={id} y={40} />
      {Array.from({ length: art.groups }, (_, g) => {
        const [x, y] = place(g)
        return (
          <g key={g}>
            <rect
              x={x + 5}
              y={y + 4}
              width={cell - 10}
              height={height - 10}
              rx="16"
              fill="#fbf1dc"
              stroke="#d3bb91"
              strokeWidth="2.5"
              filter={`url(#${id}shadow)`}
            />
            {items(x, y, art.each, g)}
          </g>
        )
      })}
      {left > 0 && <g>{items(...place(art.groups), left, 1)}</g>}
      <Caption text={art.label} y={330} />
    </>
  )
}

function Chart({ id, art }: P & { art: Extract<Art, { kind: 'chart' }> }) {
  const focus = art.focus ?? Number.NaN
  const near = new Set([focus - 10, focus + 10, focus - 1, focus + 1])
  const marked = new Set(art.marked)
  return (
    <>
      <Paper id={id} />
      {Array.from({ length: 50 }, (_, i) => {
        const n = art.start + i
        const x = 44 + (i % 10) * 56
        const y = 30 + Math.floor(i / 10) * 60
        const focus = n === art.focus
        const by = near.has(n) || marked.has(n)
        return (
          <g key={n}>
            <rect
              x={x}
              y={y}
              width="52"
              height="56"
              rx="7"
              fill={focus ? '#d9412f' : by ? '#ffe7a8' : '#f3f6f8'}
              stroke={by || focus ? '#b9791b' : '#d6dee5'}
              strokeWidth="1.5"
            />
            <text
              x={x + 26}
              y={y + 36}
              textAnchor="middle"
              fontSize="20"
              fontWeight={focus || by ? 700 : 500}
              fill={focus ? '#fff' : INK}
            >
              {n}
            </text>
          </g>
        )
      })}
    </>
  )
}

function Compare({ id, art }: P & { art: Extract<Art, { kind: 'compare' }> }) {
  const stack = (n: number, x: number) => {
    const tens = Math.floor(n / 10)
    return (
      <g>
        {Array.from({ length: tens }, (_, t) =>
          Array.from({ length: 10 }, (_unused, i) => (
            <Cap
              key={`${t}${i}`}
              id={id}
              x={x + t * 19}
              y={40 + i * 17}
              r={7.6}
              tone={2}
            />
          )),
        )}
        {Array.from({ length: n % 10 }, (_, i) => (
          <Cap
            key={i}
            id={id}
            x={x + tens * 19 + 4}
            y={40 + i * 17}
            r={7.6}
            tone={1}
          />
        ))}
        <text
          x={x + 62}
          y="256"
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
          fill={INK}
        >
          {n}
        </text>
        <text x={x + 62} y="284" textAnchor="middle" fontSize="16" fill={INK}>
          {tens} tens, {n % 10} ones
        </text>
      </g>
    )
  }
  const sign = art.a > art.b ? '>' : art.a < art.b ? '<' : '='
  return (
    <>
      <Paper id={id} />
      {stack(art.a, 60)}
      <text
        x="320"
        y="180"
        textAnchor="middle"
        fontSize="88"
        fontWeight="800"
        fill="#d9412f"
      >
        {sign}
      </text>
      {stack(art.b, 400)}
    </>
  )
}

function Balance({ id, art }: P & { art: Extract<Art, { kind: 'balance' }> }) {
  // The heavier side goes down, as it would on a real scale.
  const heavier =
    art.heavier ??
    (sideValue(art.left) > sideValue(art.right) ? 'left' : 'right')
  const tilt = art.equal ? 0 : heavier === 'left' ? -7 : 7
  return (
    <>
      <Table id={id} y={290} />
      <rect x="312" y="96" width="16" height="196" fill={`url(#${id}metal)`} />
      <path
        d="M262 292h116l-20-20h-76Z"
        fill={`url(#${id}metal)`}
        filter={`url(#${id}shadow)`}
      />
      <g transform={`rotate(${tilt} 320 96)`}>
        <rect
          x="88"
          y="90"
          width="464"
          height="11"
          rx="5"
          fill={`url(#${id}metal)`}
          filter={`url(#${id}shadow)`}
        />
        {[
          [110, art.left],
          [530, art.right],
        ].map(([x, label]) => (
          <g key={x as number} transform={`rotate(${-tilt} ${x} 96)`}>
            <path
              d={`M${x} 96l-70 96M${x} 96l70 96`}
              stroke="#6e7b87"
              strokeWidth="2"
            />
            <path
              d={`M${(x as number) - 86} 192h172c-8 34-36 40-86 40s-78-6-86-40Z`}
              fill={`url(#${id}metal)`}
              filter={`url(#${id}shadow)`}
            />
            <text
              x={x as number}
              y="222"
              textAnchor="middle"
              fontSize="28"
              fontWeight="800"
              fill={INK}
            >
              {label}
            </text>
          </g>
        ))}
      </g>
      <circle
        cx="320"
        cy="96"
        r="13"
        fill={`url(#${id}metal)`}
        stroke="#6e7b87"
      />
      <text
        x="320"
        y="60"
        textAnchor="middle"
        fontSize="54"
        fontWeight="800"
        fill={art.equal ? '#1f8a70' : '#d9412f'}
      >
        {art.equal ? '=' : '≠'}
      </text>
    </>
  )
}

function TenFrame({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'tenframe' }> }) {
  return (
    <>
      <Paper id={id} />
      {[0, 1].map((f) => (
        <g key={f}>
          <rect
            x="60"
            y={38 + f * 136}
            width="520"
            height="124"
            rx="8"
            fill="#fbf6ea"
            stroke="#8a6a3a"
            strokeWidth="4"
          />
          {Array.from({ length: 10 }, (_, i) => {
            const n = f * 10 + i
            const x = 60 + (i % 5) * 104
            const y = 38 + f * 136 + Math.floor(i / 5) * 62
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width="104"
                  height="62"
                  fill="none"
                  stroke="#8a6a3a"
                  strokeWidth="2"
                />
                {n < art.first + art.second && (
                  <Cap
                    id={id}
                    x={x + 52}
                    y={y + 31}
                    r={23}
                    tone={n < art.first ? 0 : 3}
                  />
                )}
              </g>
            )
          })}
        </g>
      ))}
      <Caption text={art.label} y={330} />
    </>
  )
}

function Frame({ id, art }: P & { art: Extract<Art, { kind: 'frame' }> }) {
  const row = (r: [number, number], y: number, bold = false) => (
    <g
      key={y}
      fontSize="46"
      fontWeight={bold ? 800 : 600}
      textAnchor="middle"
      fill={bold ? '#d9412f' : INK}
    >
      <text x="285" y={y}>
        {r[0] || ''}
      </text>
      <text x="415" y={y}>
        {r[1]}
      </text>
    </g>
  )
  const last = 92 + art.rows.length * 58
  return (
    <>
      <Paper id={id} />
      <rect x="220" y="28" width="130" height="50" fill="#d6eef0" />
      <rect x="350" y="28" width="130" height="50" fill="#fdeec3" />
      <text
        x="285"
        y="62"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill={INK}
      >
        Tens
      </text>
      <text
        x="415"
        y="62"
        textAnchor="middle"
        fontSize="24"
        fontWeight="700"
        fill={INK}
      >
        Ones
      </text>
      <path d="M350 28v290" stroke="#8a9aa8" strokeWidth="2.5" />
      <rect
        x="220"
        y="28"
        width="260"
        height="290"
        rx="4"
        fill="none"
        stroke="#8a9aa8"
        strokeWidth="2.5"
      />
      {art.rows.map((r, i) => row(r, 124 + i * 58))}
      <text
        x="180"
        y={124 + (art.rows.length - 1) * 58}
        textAnchor="middle"
        fontSize="50"
        fontWeight="800"
        fill={INK}
      >
        {art.sign}
      </text>
      <path d={`M170 ${last - 10}h310`} stroke={INK} strokeWidth="4" />
      {art.answer && row(art.answer, last + 44, true)}
    </>
  )
}

function Jumps({ id, art }: P & { art: Extract<Art, { kind: 'jumps' }> }) {
  const stops = art.jumps.reduce<Array<number>>(
    (all, j) => [...all, all.at(-1)! + j],
    [art.start],
  )
  const low = Math.min(...stops)
  const high = Math.max(...stops)
  const span = Math.max(high - low, 1)
  const at = (n: number) => 60 + ((n - low) / span) * 520
  return (
    <>
      <Paper id={id} />
      <path
        d="M30 230H610"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {stops.slice(1).map((n, i) => {
        const a = at(stops[i]!)
        const b = at(n)
        const h = 60 + Math.min(Math.abs(b - a) * 0.5, 80)
        const j = art.jumps[i]!
        return (
          <g key={i}>
            <path
              d={`M${a} 222Q${(a + b) / 2} ${222 - h} ${b} 222`}
              fill="none"
              stroke={j < 0 ? '#d9412f' : '#1f8a70'}
              strokeWidth="5"
            />
            <text
              x={(a + b) / 2}
              y={222 - h / 2 - 12}
              textAnchor="middle"
              fontSize="23"
              fontWeight="800"
              fill={j < 0 ? '#d9412f' : '#1f8a70'}
            >
              {j > 0 ? `+${j}` : `−${-j}`}
            </text>
          </g>
        )
      })}
      {stops.map((n, i) => {
        // Numbers close together take turns on two lines, so they do not touch.
        const crowded = i > 0 && Math.abs(at(n) - at(stops[i - 1]!)) < 44
        return (
          <g key={i}>
            <circle
              cx={at(n)}
              cy="230"
              r="9"
              fill={
                i === 0 ? '#2b6cb0' : i === stops.length - 1 ? '#d9412f' : INK
              }
            />
            <text
              x={at(n)}
              y={crowded ? 292 : 268}
              textAnchor="middle"
              fontSize="24"
              fontWeight="700"
              fill={INK}
            >
              {n}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={334} />
    </>
  )
}

const NOTE: Record<number, [string, string]> = {
  1: ['#a8c97f', '#5d8238'],
  2: ['#a7cfe6', '#3d7ea6'],
  5: ['#e7a9a1', '#a84d43'],
  10: ['#f2ca76', '#b5842a'],
  20: ['#c7a8dc', '#7c55a0'],
  50: ['#9fd8c6', '#38806b'],
}

// Plain money for counting, marked so it can never be mistaken for real notes.
function Cedis({ id, art }: P & { art: Extract<Art, { kind: 'cedis' }> }) {
  const across = Math.min(art.notes.length, 3)
  const w = Math.min(560 / across - 14, 178)
  return (
    <>
      <Table id={id} y={40} />
      {art.notes.map((value, i) => {
        const x = (640 - across * (w + 14)) / 2 + (i % 3) * (w + 14) + 7
        const y =
          24 + Math.floor(i / 3) * 124 + (art.notes.length <= 3 ? 56 : 0)
        const [light, dark] = NOTE[value] ?? NOTE[1]!
        return (
          <g key={i} filter={`url(#${id}shadow)`}>
            <rect
              x={x}
              y={y}
              width={w}
              height="108"
              rx="7"
              fill={light}
              stroke={dark}
              strokeWidth="2.5"
            />
            <rect
              x={x + 8}
              y={y + 8}
              width={w - 16}
              height="92"
              rx="4"
              fill="none"
              stroke={dark}
              strokeWidth="1.2"
            />
            <circle
              cx={x + w / 2}
              cy={y + 54}
              r="33"
              fill="#ffffff55"
              stroke={dark}
            />
            <text
              x={x + w / 2}
              y={y + 68}
              textAnchor="middle"
              fontSize="38"
              fontWeight="800"
              fill={dark}
            >
              {value}
            </text>
            <text
              x={x + 14}
              y={y + 28}
              fontSize="14"
              fontWeight="700"
              fill={dark}
            >
              GH₵
            </text>
            <text
              x={x + w - 14}
              y={y + 96}
              textAnchor="end"
              fontSize="11"
              fill={dark}
            >
              practice
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={334} />
    </>
  )
}

function Pattern({ id, art }: P & { art: Extract<Art, { kind: 'pattern' }> }) {
  const w = Math.min(560 / art.terms.length, 100)
  const left = 320 - (art.terms.length * w) / 2
  // Long numbers shrink to stay inside their ball.
  const size = (n: number | null) =>
    Math.min(33, (w * 0.72) / (String(n ?? '?').length * 0.62))
  return (
    <>
      <Paper id={id} />
      {art.terms.map((n, i) => (
        <g key={i}>
          <circle
            cx={left + w * (i + 0.5)}
            cy="166"
            r={w * 0.42}
            fill={n === null ? '#fff' : `url(#${id}cap${i % 4})`}
            stroke={n === null ? '#d9412f' : '#00000033'}
            strokeWidth={n === null ? 4 : 1}
            strokeDasharray={n === null ? '8 6' : undefined}
          />
          <text
            x={left + w * (i + 0.5)}
            y={166 + size(n) * 0.36}
            textAnchor="middle"
            fontSize={size(n)}
            fontWeight="800"
            fill={n === null ? '#d9412f' : '#fff'}
            stroke={n === null ? undefined : '#00000055'}
            strokeWidth=".6"
          >
            {n ?? '?'}
          </text>
          {i > 0 && (
            <path
              d={`M${left + w * (i - 0.5) + 6} ${166 - w * 0.5}Q${left + w * i} ${166 - w * 0.95} ${left + w * (i + 0.5) - 6} ${166 - w * 0.5}`}
              fill="none"
              stroke="#8a9aa8"
              strokeWidth="3"
            />
          )}
        </g>
      ))}
      <Caption text={art.rule} y={290} />
    </>
  )
}

function SolidArt({ id, name, x }: P & { name: Solid; x: number }) {
  const y = 210
  const label = {
    cube: 'Cube',
    sphere: 'Sphere',
    cylinder: 'Cylinder',
    cone: 'Cone',
    pyramid: 'Pyramid',
    box: 'Cuboid',
    prism: 'Triangular prism',
  }[name]
  const c = {
    cube: ['#f0b64a', '#d9962b', '#b07418'],
    box: ['#d8b07a', '#b98d55', '#9a7040'],
    prism: ['#8fbfdf', '#5b95bd', '#3f7aa3'],
    sphere: ['#e45d4b'],
    cylinder: ['#5aa9d6', '#2f7cab', '#a6d4ec'],
    cone: ['#7bc08a', '#3b8b52'],
    pyramid: ['#c9a06a', '#a47c47', '#7f5d31'],
  }[name]
  return (
    <g filter={`url(#${id}shadow)`}>
      {name === 'cube' && (
        <>
          <path d={`M${x - 48} ${y - 76}l48 -24 48 24 -48 24Z`} fill={c[0]} />
          <path d={`M${x - 48} ${y - 76}v76l48 24v-76Z`} fill={c[1]} />
          <path d={`M${x + 48} ${y - 76}v76l-48 24v-76Z`} fill={c[2]} />
        </>
      )}
      {name === 'box' && (
        <>
          <path d={`M${x - 66} ${y - 60}l30 -20h96l-30 20Z`} fill={c[0]} />
          <path d={`M${x - 66} ${y - 60}h96v74h-96Z`} fill={c[1]} />
          <path d={`M${x + 30} ${y - 60}l30 -20v74l-30 20Z`} fill={c[2]} />
        </>
      )}
      {name === 'prism' && (
        <>
          <path d={`M${x - 52} ${y + 10}l40 -86l40 86Z`} fill={c[1]} />
          <path d={`M${x - 12} ${y - 76}l54 -14l40 86l-54 14Z`} fill={c[0]} />
          <path
            d={`M${x + 28} ${y + 10}l54 -14`}
            stroke={c[2]}
            strokeWidth="2"
          />
        </>
      )}
      {name === 'sphere' && (
        <>
          <radialGradient id={`${id}ball`} cx=".35" cy=".3" r=".8">
            <stop offset="0" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".25" stopColor={c[0]} />
            <stop offset="1" stopColor="#7c1f15" />
          </radialGradient>
          <circle cx={x} cy={y - 42} r="58" fill={`url(#${id}ball)`} />
        </>
      )}
      {name === 'cylinder' && (
        <>
          <linearGradient id={`${id}can`} x1="0" x2="1">
            <stop offset="0" stopColor={c[1]} />
            <stop offset=".35" stopColor={c[2]} />
            <stop offset="1" stopColor={c[1]} />
          </linearGradient>
          <path
            d={`M${x - 46} ${y - 92}v96c0 26 92 26 92 0v-96Z`}
            fill={`url(#${id}can)`}
          />
          <ellipse
            cx={x}
            cy={y - 92}
            rx="46"
            ry="15"
            fill={c[2]}
            stroke={c[1]}
          />
        </>
      )}
      {name === 'cone' && (
        <>
          <linearGradient id={`${id}cone`} x1="0" x2="1">
            <stop offset="0" stopColor={c[1]} />
            <stop offset=".4" stopColor={c[0]} />
            <stop offset="1" stopColor="#245c35" />
          </linearGradient>
          <path
            d={`M${x} ${y - 104}L${x - 54} ${y + 2}c0 24 108 24 108 0Z`}
            fill={`url(#${id}cone)`}
          />
        </>
      )}
      {name === 'pyramid' && (
        <>
          <path
            d={`M${x} ${y - 104}L${x - 58} ${y - 6}L${x + 12} ${y + 22}Z`}
            fill={c[0]}
          />
          <path
            d={`M${x} ${y - 104}L${x + 12} ${y + 22}L${x + 60} ${y - 10}Z`}
            fill={c[2]}
          />
        </>
      )}
      <text
        x={x}
        y={y + 76}
        textAnchor="middle"
        fontSize="23"
        fontWeight="700"
        fill="#fff"
        stroke="#00000055"
        strokeWidth=".5"
      >
        {label}
      </text>
    </g>
  )
}

function SmallShape({
  name,
  x,
  y,
  r,
  tone,
}: {
  name: Shape
  x: number
  y: number
  r: number
  tone: string
}) {
  const regular = (sides: number) =>
    Array.from({ length: sides }, (_, i) =>
      polar(x, y, r, i / sides).join(','),
    ).join(' ')
  const style = {
    fill: tone,
    stroke: '#00000044',
    strokeWidth: 2.5,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'circle') return <circle cx={x} cy={y} r={r} {...style} />
  if (name === 'square')
    return (
      <rect
        x={x - r * 0.85}
        y={y - r * 0.85}
        width={r * 1.7}
        height={r * 1.7}
        {...style}
      />
    )
  if (name === 'parallelogram')
    return (
      <polygon
        points={`${x - r * 0.75},${y - r * 0.55} ${x + r * 1.15},${y - r * 0.55} ${x + r * 0.75},${y + r * 0.55} ${x - r * 1.15},${y + r * 0.55}`}
        {...style}
      />
    )
  if (name === 'trapezoid')
    return (
      <polygon
        points={`${x - r * 0.55},${y - r * 0.55} ${x + r * 0.55},${y - r * 0.55} ${x + r * 1.1},${y + r * 0.55} ${x - r * 1.1},${y + r * 0.55}`}
        {...style}
      />
    )
  if (name === 'rhombus')
    return (
      <polygon
        points={`${x},${y - r} ${x + r * 0.75},${y} ${x},${y + r} ${x - r * 0.75},${y}`}
        {...style}
      />
    )
  if (name === 'rectangle')
    return (
      <rect
        x={x - r * 1.15}
        y={y - r * 0.62}
        width={r * 2.3}
        height={r * 1.24}
        {...style}
      />
    )
  const sides = { triangle: 3, pentagon: 5, hexagon: 6 }[name]
  return <polygon points={regular(sides)} {...style} />
}

const SHAPE_TONES = [
  '#e45d4b',
  '#f0b64a',
  '#3f9e7c',
  '#3f86c1',
  '#8c63b5',
  '#d9628e',
]
const SIDES: Record<Shape, string> = {
  parallelogram: 'Opposite sides parallel',
  trapezoid: 'One pair of parallel sides',
  rhombus: '4 equal sides, slanted',
  square: '4 equal sides',
  rectangle: '4 sides',
  triangle: '3 sides',
  circle: 'No corners',
  pentagon: '5 sides',
  hexagon: '6 sides',
}

function Shapes({ id, art }: P & { art: Extract<Art, { kind: 'shapes' }> }) {
  const across = Math.min(art.names.length, 3)
  const rows = Math.ceil(art.names.length / 3)
  const w = 600 / across
  const h = 320 / rows
  return (
    <>
      <Paper id={id} />
      {art.names.map((name, i) => {
        const x = 20 + (i % 3) * w + w / 2
        const y = 28 + Math.floor(i / 3) * h + h / 2 - 24
        return (
          <g key={name} filter={`url(#${id}shadow)`}>
            <SmallShape
              name={name}
              x={x}
              y={y}
              r={Math.min(h * 0.28, 62)}
              tone={SHAPE_TONES[i % 6]!}
            />
            {art.labelled !== false && (
              <>
                <text
                  x={x}
                  y={y + Math.min(h * 0.28, 62) + 24}
                  textAnchor="middle"
                  fontSize="20"
                  fontWeight="700"
                  fill={INK}
                  style={{ textTransform: 'capitalize' }}
                >
                  {name}
                </text>
                <text
                  x={x}
                  y={y + Math.min(h * 0.28, 62) + 44}
                  textAnchor="middle"
                  fontSize="14"
                  fill={INK}
                >
                  {SIDES[name]}
                </text>
              </>
            )}
          </g>
        )
      })}
    </>
  )
}

const STICK_LENGTH = 265

// Drawn as rectangles: a shadow filter hides a perfectly level or upright line.
function Stick({
  id,
  x,
  y,
  turn = 0,
}: P & { x: number; y: number; turn?: number }) {
  return (
    <g transform={`rotate(${turn} ${x} ${y})`} filter={`url(#${id}shadow)`}>
      <rect
        x={x}
        y={y - 8}
        width={STICK_LENGTH}
        height="16"
        rx="8"
        fill="#8b5a2b"
      />
      <rect
        x={x + 3}
        y={y - 5}
        width={STICK_LENGTH - 6}
        height="6"
        rx="3"
        fill="#d4a56c"
      />
    </g>
  )
}

function Sticks({ id, art }: P & { art: Extract<Art, { kind: 'sticks' }> }) {
  return (
    <>
      <Table id={id} y={0} />
      {art.together ? (
        [70, 140, 210].map((y) => <Stick key={y} id={id} x={188} y={y} />)
      ) : (
        <>
          <Stick id={id} x={50} y={40} turn={28} />
          <Stick id={id} x={560} y={22} turn={90} />
          <Stick id={id} x={120} y={268} />
        </>
      )}
      <rect x="0" y="296" width="640" height="64" fill="#00000033" />
      <text
        x="320"
        y="336"
        textAnchor="middle"
        fontSize="23"
        fontWeight="700"
        fill="#fff"
      >
        {art.together
          ? 'Side by side, all the same length'
          : 'Which stick is the longest?'}
      </text>
    </>
  )
}

function Measure({ id, art }: P & { art: Extract<Art, { kind: 'measure' }> }) {
  const unitW = 520 / art.count
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <rect
        x="60"
        y="130"
        width="520"
        height="40"
        rx="5"
        fill={`url(#${id}crust)`}
        filter={`url(#${id}shadow)`}
      />
      <rect
        x="60"
        y="130"
        width="520"
        height="8"
        rx="4"
        fill="#fff"
        opacity=".2"
      />
      {Array.from({ length: art.count }, (_, i) => {
        const x = 60 + i * unitW
        return (
          <g key={i} filter={`url(#${id}shadow)`}>
            {art.unit === 'hand' ? (
              <g fill={i % 2 ? '#a9744a' : '#8d5b37'}>
                <rect x={x + 4} y="196" width={unitW - 8} height="34" rx="14" />
                {[0, 1, 2, 3].map((f) => (
                  <rect
                    key={f}
                    x={x + 6 + f * ((unitW - 12) / 4)}
                    y="174"
                    width={(unitW - 12) / 4 - 2}
                    height="34"
                    rx="6"
                  />
                ))}
              </g>
            ) : art.unit === 'stick' ? (
              <rect
                x={x + 3}
                y="190"
                width={unitW - 6}
                height="13"
                rx="6"
                fill={i % 2 ? '#c8965a' : '#a7743f'}
              />
            ) : (
              <rect
                x={x + 3}
                y="190"
                width={unitW - 6}
                height="13"
                rx="6"
                fill="none"
                stroke={`url(#${id}metal)`}
                strokeWidth="4"
              />
            )}
            <text
              x={x + unitW / 2}
              y="254"
              textAnchor="middle"
              fontSize="19"
              fontWeight="700"
              fill={INK}
            >
              {i + 1}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={320} />
    </>
  )
}

function Bottle({ id, x, height }: P & { x: number; height: number }) {
  const bottom = 268
  const top = bottom - height
  const shoulder = top + 34
  return (
    <g filter={`url(#${id}shadow)`}>
      <path
        d={`M${x - 12} ${top}h24v28q18 14 18 34V${bottom - 6}q0 6-6 6h-48q-6 0-6-6V${shoulder + 28}q0-20 18-34Z`}
        fill={`url(#${id}glass)`}
        stroke="#6fa6bd"
        strokeWidth="1.5"
      />
      <rect
        x={x - 14}
        y={top - 10}
        width="28"
        height="13"
        rx="3"
        fill={`url(#${id}cap0)`}
      />
    </g>
  )
}

function Bottles({ id, art }: P & { art: Extract<Art, { kind: 'bottles' }> }) {
  const w = 560 / art.heights.length
  return (
    <>
      <Table id={id} y={262} />
      {art.heights.map((h, i) => (
        <Bottle key={i} id={id} x={40 + w * (i + 0.5)} height={h} />
      ))}
      <Caption text={art.label} y={330} />
    </>
  )
}

function Fill({ id, art }: P & { art: Extract<Art, { kind: 'fill' }> }) {
  return (
    <>
      <Table id={id} y={232} />
      <g filter={`url(#${id}shadow)`}>
        <path
          d="M60 74h190l-22 170h-146Z"
          fill={`url(#${id}metal)`}
          stroke="#6e7b87"
          strokeWidth="2"
        />
        <path
          d="M66 120h178l-17 124h-144Z"
          fill={`url(#${id}water)`}
          opacity=".85"
        />
        <ellipse
          cx="155"
          cy="74"
          rx="95"
          ry="14"
          fill="#dfe7ee"
          stroke="#6e7b87"
          strokeWidth="2"
        />
      </g>
      {Array.from({ length: art.cups }, (_, i) => {
        const x = 300 + (i % 6) * 54
        const y = 170 - Math.floor(i / 6) * 66
        return (
          <g key={i} filter={`url(#${id}shadow)`}>
            <path
              d={`M${x} ${y}h40l-5 56h-30Z`}
              fill={`url(#${id}cap${i % 4})`}
              stroke="#00000033"
            />
            <text
              x={x + 20}
              y={y + 35}
              textAnchor="middle"
              fontSize="19"
              fontWeight="800"
              fill="#fff"
            >
              {i + 1}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={315} />
    </>
  )
}

// One wall height measured by two different hands.
function Hands({ id, art }: P & { art: Extract<Art, { kind: 'hands' }> }) {
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      {art.counts.map((count, c) => {
        const x = 110 + c * 280
        const size = 230 / count
        return (
          <g key={c}>
            <rect
              x={x}
              y="40"
              width="130"
              height="230"
              rx="4"
              fill={`url(#${id}crust)`}
              filter={`url(#${id}shadow)`}
            />
            {Array.from({ length: count }, (_, i) => (
              <rect
                key={i}
                x={x + 150}
                y={40 + i * size + 2}
                width="60"
                height={size - 4}
                rx={Math.min(size / 3, 13)}
                fill={i % 2 ? '#a9744a' : '#8d5b37'}
              />
            ))}
            <text
              x={x + 90}
              y="306"
              textAnchor="middle"
              fontSize="23"
              fontWeight="800"
              fill={INK}
            >
              {count} hand spans
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={345} />
    </>
  )
}

function Calendar({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'calendar' }> }) {
  const heads = art.heads ?? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return (
    <>
      <Paper id={id} />
      <rect x="18" y="14" width="604" height="48" rx="12" fill="#d9412f" />
      <text
        x="320"
        y="48"
        textAnchor="middle"
        fontSize="27"
        fontWeight="800"
        fill="#fff"
      >
        {art.month}
      </text>
      {heads.map((h, i) => (
        <text
          key={h}
          x={70 + i * 83}
          y="88"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill="#5b6b78"
        >
          {h}
        </text>
      ))}
      {Array.from({ length: art.days }, (_, i) => {
        const cell = i + art.startsOn
        const x = 70 + (cell % 7) * 83
        const y = 122 + Math.floor(cell / 7) * 44
        const focus = art.focus === i + 1
        return (
          <g key={i}>
            {focus && <circle cx={x} cy={y - 7} r="20" fill="#f6c343" />}
            <text
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="21"
              fontWeight={focus ? 800 : 500}
              fill={INK}
            >
              {i + 1}
            </text>
          </g>
        )
      })}
    </>
  )
}

const ROMAN = [
  'I',
  'II',
  'III',
  'IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X',
  'XI',
  'XII',
]

function Clock({ id, art }: P & { art: Extract<Art, { kind: 'clock' }> }) {
  const cx = 320
  const cy = 160
  const minute = art.minute ?? 0
  const [hx, hy] = polar(cx, cy, 72, ((art.hour % 12) + minute / 60) / 12)
  const [mx, my] = polar(cx, cy, 82, minute / 60)
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <circle
        cx={cx}
        cy={cy}
        r="142"
        fill={`url(#${id}metal)`}
        filter={`url(#${id}shadow)`}
      />
      <circle cx={cx} cy={cy} r="126" fill="#fffdf8" stroke="#8b99a7" />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = polar(cx, cy, 102, (i + 1) / 12)
        return (
          <text
            key={i}
            x={x}
            y={y + 10}
            textAnchor="middle"
            fontSize={art.roman ? 21 : 28}
            fontWeight="700"
            fill={INK}
          >
            {art.roman ? ROMAN[i] : i + 1}
          </text>
        )
      })}
      <line
        x1={cx}
        y1={cy}
        x2={hx}
        y2={hy}
        stroke={INK}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={mx}
        y2={my}
        stroke={INK}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="9" fill="#d9412f" />
      <Caption text={art.label} y={340} />
    </>
  )
}

function Tally({ id, art }: P & { art: Extract<Art, { kind: 'tally' }> }) {
  return (
    <>
      <Paper id={id} />
      {art.rows.map(([name, count], r) => {
        const y = 52 + r * (280 / art.rows.length)
        return (
          <g key={name}>
            <text x="44" y={y + 34} fontSize="25" fontWeight="700" fill={INK}>
              {name}
            </text>
            {Array.from({ length: count }, (_, i) => {
              const group = Math.floor(i / 5)
              const x = 210 + group * 74 + (i % 5) * 12
              return i % 5 === 4 ? (
                <line
                  key={i}
                  x1={210 + group * 74 - 8}
                  y1={y + 42}
                  x2={210 + group * 74 + 48}
                  y2={y + 2}
                  stroke="#d9412f"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              ) : (
                <line
                  key={i}
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={y + 44}
                  stroke={INK}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                />
              )
            })}
            <text
              x="590"
              y={y + 34}
              textAnchor="end"
              fontSize="29"
              fontWeight="800"
              fill="#1f8a70"
            >
              {count}
            </text>
          </g>
        )
      })}
    </>
  )
}

function Picto({ id, art }: P & { art: Extract<Art, { kind: 'picto' }> }) {
  return (
    <>
      <Paper id={id} />
      {art.rows.map(([name, count], r) => {
        const y = 40 + r * (290 / art.rows.length)
        return (
          <g key={name}>
            <text x="44" y={y + 32} fontSize="23" fontWeight="700" fill={INK}>
              {name}
            </text>
            {Array.from({ length: count }, (_, i) => {
              const x = 170 + i * 50
              if (art.item === 'child')
                return (
                  <g key={i} filter={`url(#${id}shadow)`}>
                    <circle
                      cx={x + 19}
                      cy={y + 10}
                      r="9"
                      fill={`url(#${id}skin1)`}
                    />
                    <path
                      d={`M${x + 6} ${y + 46}q0-26 13-26t13 26Z`}
                      fill={name.startsWith('B') ? '#2b6cb0' : '#d9628e'}
                    />
                  </g>
                )
              return art.item === 'mango' ? (
                <g key={i} filter={`url(#${id}shadow)`}>
                  <ellipse
                    cx={x + 18}
                    cy={y + 24}
                    rx="20"
                    ry="24"
                    fill={`url(#${id}cap1)`}
                    transform={`rotate(24 ${x + 18} ${y + 24})`}
                  />
                  <path
                    d={`M${x + 12} ${y + 2}q10-12 18-4`}
                    stroke="#3b8b52"
                    strokeWidth="4"
                    fill="none"
                  />
                </g>
              ) : (
                <g key={i} filter={`url(#${id}shadow)`}>
                  <rect
                    x={x}
                    y={y + 2}
                    width="38"
                    height="46"
                    rx="3"
                    fill={`url(#${id}cap3)`}
                  />
                  <rect
                    x={x + 5}
                    y={y + 2}
                    width="3"
                    height="46"
                    fill="#ffffff66"
                  />
                </g>
              )
            })}
          </g>
        )
      })}
    </>
  )
}

// People drawn from joint angles. Each limb's angle is measured from straight
// down, positive towards the way the figure faces; the torso leans from upright.
type Joints = {
  lean: number
  legs: [number, number, number, number]
  arms: [number, number, number, number]
  air?: number
}
const POSES: Record<Pose, Joints> = {
  stand: { lean: 0, legs: [-3, -3, 3, 3], arms: [-8, -4, 8, 4] },
  walk: { lean: 3, legs: [-20, -32, 22, 8], arms: [24, 42, -22, -10] },
  beam: { lean: 0, legs: [-12, -20, 14, 6], arms: [-80, -84, 80, 84] },
  run: {
    lean: 14,
    legs: [-45, -100, 62, 8],
    arms: [60, 125, -50, -10],
    air: 8,
  },
  skip: { lean: 6, legs: [-8, -16, 80, 2], arms: [60, 100, -40, -20], air: 16 },
  leap: {
    lean: 12,
    legs: [-70, -80, 78, 84],
    arms: [75, 95, -65, -45],
    air: 42,
  },
  tiptoe: { lean: 0, legs: [-2, -2, 2, 2], arms: [168, 172, 170, 176], air: 5 },
  reach: { lean: 0, legs: [-2, -2, 2, 2], arms: [76, 82, 84, 88], air: 6 },
  lean: { lean: -14, legs: [6, 10, 12, 16], arms: [72, 74, 80, 84] },
  throw: { lean: -8, legs: [-30, -32, 26, 14], arms: [-125, -165, 62, 72] },
  catch: { lean: 14, legs: [-28, -38, 34, 16], arms: [48, 72, 54, 80] },
  forehand: { lean: 6, legs: [-24, -28, 26, 14], arms: [-40, -28, 82, 96] },
  backhand: { lean: 4, legs: [-24, -28, 26, 14], arms: [-30, -20, 70, 112] },
  trap: { lean: 2, legs: [-4, -4, 26, 12], arms: [-40, -30, 42, 52] },
  kick: { lean: 6, legs: [-8, -12, 68, 44], arms: [62, 84, -54, -40] },
  volley: { lean: -4, legs: [-6, -8, 84, 74], arms: [72, 92, -64, -34] },
  dance: { lean: 22, legs: [-28, -52, 34, 4], arms: [118, 62, -100, -140] },
  jumpUp: {
    lean: 0,
    legs: [-6, -6, 6, 6],
    arms: [148, 158, 144, 156],
    air: 30,
  },
  crouch: { lean: 34, legs: [64, -24, 70, -18], arms: [-30, -18, -22, -8] },
  land: { lean: 18, legs: [48, -14, 54, -8], arms: [78, 88, 84, 94] },
  pushUp: { lean: 78, legs: [-78, -78, -78, -78], arms: [0, 0, 2, 2] },
  pushDown: { lean: 86, legs: [-86, -86, -86, -86], arms: [-52, 30, -48, 34] },
  drink: { lean: -4, legs: [-3, -3, 3, 3], arms: [-8, -4, 95, 232] },
  liftGood: { lean: 22, legs: [78, -16, 82, -10], arms: [12, 14, 16, 18] },
  liftBad: { lean: 82, legs: [-2, -2, 3, 3], arms: [-4, -2, 2, 4] },
  raise: { lean: 0, legs: [-3, -3, 3, 3], arms: [-8, -4, 172, 178] },
  pulse: { lean: 0, legs: [-3, -3, 3, 3], arms: [62, 132, 56, 96] },
  // Seated poses keep the feet level with the hips, so both rest on the ground.
  sitUp: { lean: -40, legs: [135, 40, 138, 38], arms: [72, 88, 80, 96] },
  twist: { lean: -6, legs: [90, 90, 118, 62], arms: [-30, -22, 74, 128] },
  hockey: { lean: 38, legs: [-22, -28, 30, 12], arms: [30, 44, 40, 52] },
  // Sitting with straight legs, palms pressing the floor to lift the hips.
  seatLift: {
    lean: -8,
    legs: [88, 90, 92, 90],
    arms: [-10, -6, -8, -4],
    air: 6,
  },
}
const SKINS = ['#6b3d24', '#8a5634', '#4f2c1a', '#7a4a2b']
const KITS: Array<[string, string]> = [
  ['#d9412f', '#1f2a44'],
  ['#1f8a70', '#f4f1e8'],
  ['#e8a317', '#1f2a44'],
  ['#2b6cb0', '#f4f1e8'],
]
const GROUND_Y = 300
const LIMB = { torso: 80, thigh: 52, shin: 52, upper: 40, fore: 37 }

function limb(
  from: readonly [number, number],
  angle: number,
  length: number,
  facing: number,
) {
  const r = (angle * Math.PI) / 180
  return [
    from[0] + Math.sin(r) * length * facing,
    from[1] + Math.cos(r) * length,
  ] as const
}

function Person({ id, figure }: P & { figure: Figure }) {
  const f = figure.facing ?? 1
  const j = POSES[figure.pose]
  const build = figure.build ?? 1
  const tone = (figure.kit ?? 0) % 4
  const skin = SKINS[tone]!
  const [shirt, shorts] = KITS[tone]!
  const lean = (j.lean * Math.PI) / 180
  // Work out the body at the origin, then stand it on the ground.
  const hip = [0, 0] as const
  const neck = [
    Math.sin(lean) * LIMB.torso * f,
    -Math.cos(lean) * LIMB.torso,
  ] as const
  const head = [
    neck[0] + Math.sin(lean) * 23 * f,
    neck[1] - Math.cos(lean) * 23,
  ] as const
  const knees = [
    limb(hip, j.legs[0], LIMB.thigh, f),
    limb(hip, j.legs[2], LIMB.thigh, f),
  ]
  const feet = [
    limb(knees[0]!, j.legs[1], LIMB.shin, f),
    limb(knees[1]!, j.legs[3], LIMB.shin, f),
  ]
  const elbows = [
    limb(neck, j.arms[0], LIMB.upper, f),
    limb(neck, j.arms[2], LIMB.upper, f),
  ]
  const hands = [
    limb(elbows[0]!, j.arms[1], LIMB.fore, f),
    limb(elbows[1]!, j.arms[3], LIMB.fore, f),
  ]
  const lowest = Math.max(
    ...feet.map((p) => p[1]),
    ...(figure.pose.startsWith('push') ? hands.map((p) => p[1]) : []),
  )
  const dx = figure.x
  const dy = GROUND_Y - lowest - (j.air ?? 0) - 6
  const at = (p: readonly [number, number]) => [p[0] + dx, p[1] + dy] as const
  const seg = (
    a: readonly [number, number],
    b: readonly [number, number],
    color: string,
    width: number,
  ) => (
    <line
      x1={at(a)[0]}
      y1={at(a)[1]}
      x2={at(b)[0]}
      y2={at(b)[1]}
      stroke={color}
      strokeWidth={width * build}
      strokeLinecap="round"
    />
  )
  const dim = (c: string) => `color-mix(in srgb, ${c} 78%, black)`
  const leg = (i: number, back: boolean) => (
    <g>
      {seg(hip, knees[i]!, back ? dim(shorts) : shorts, 19)}
      {seg(knees[i]!, feet[i]!, back ? dim(skin) : skin, 15)}
      <circle
        cx={at(feet[i]!)[0] + 4 * f}
        cy={at(feet[i]!)[1] + 2}
        r={7 * build}
        fill={back ? '#222' : '#333'}
      />
    </g>
  )
  const arm = (i: number, back: boolean) => (
    <g>
      {seg(neck, elbows[i]!, back ? dim(shirt) : shirt, 15)}
      {seg(elbows[i]!, hands[i]!, back ? dim(skin) : skin, 12)}
      <circle
        cx={at(hands[i]!)[0]}
        cy={at(hands[i]!)[1]}
        r={5.5 * build}
        fill={back ? dim(skin) : skin}
      />
    </g>
  )
  const hand = at(hands[1]!)
  const foot = at(feet[1]!)
  return (
    <g>
      <ellipse
        cx={dx + (feet[0]![0] + feet[1]![0]) / 2}
        cy={GROUND_Y - 2}
        rx={34 + (j.air ?? 0) * 0.2}
        ry="7"
        fill="#000"
        opacity={0.22 - Math.min(j.air ?? 0, 50) * 0.002}
        filter={`url(#${id}soft)`}
      />
      {arm(0, true)}
      {leg(0, true)}
      {seg(hip, neck, shirt, 36)}
      {seg(
        [hip[0], hip[1]],
        [hip[0] + Math.sin(lean) * 14 * f, hip[1] - Math.cos(lean) * 14],
        shorts,
        36,
      )}
      {leg(1, false)}
      <circle
        cx={at(head)[0]}
        cy={at(head)[1]}
        r={17}
        fill={`url(#${id}skin${tone})`}
      />
      <path
        d={`M${at(head)[0] - 17} ${at(head)[1] - 2}a17 17 0 0 1 34 0q-17-10-34 0Z`}
        fill="#1b1410"
        transform={`rotate(${j.lean * f} ${at(head)[0]} ${at(head)[1]})`}
      />
      <circle
        cx={at(head)[0] + 7 * f}
        cy={at(head)[1] + 1}
        r="1.9"
        fill="#1b1410"
      />
      {figure.holds === 'racket' && (
        <g
          transform={`rotate(${(j.arms[3] - 180) * -f} ${hand[0]} ${hand[1]})`}
        >
          <line
            x1={hand[0]}
            y1={hand[1]}
            x2={hand[0]}
            y2={hand[1] - 34}
            stroke="#3a3a3a"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <ellipse
            cx={hand[0]}
            cy={hand[1] - 52}
            rx="15"
            ry="20"
            fill="#f6e7c8"
            stroke="#3a3a3a"
            strokeWidth="4"
          />
        </g>
      )}
      {figure.holds === 'box' && (
        <rect
          x={(at(hands[0]!)[0] + hand[0]) / 2 - 26}
          y={hand[1] - 10}
          width="52"
          height="40"
          rx="4"
          fill={`url(#${id}crust)`}
          stroke="#00000044"
        />
      )}
      {figure.holds === 'bottle' && (
        <rect
          x={hand[0] - 6}
          y={hand[1] - 30}
          width="12"
          height="34"
          rx="4"
          fill={`url(#${id}glass)`}
          stroke="#6fa6bd"
          transform={`rotate(${-40 * f} ${hand[0]} ${hand[1]})`}
        />
      )}
      {figure.holds === 'lime' && (
        <g>
          <line
            x1={hand[0]}
            y1={hand[1]}
            x2={hand[0] + 26 * f}
            y2={hand[1] - 4}
            stroke={`url(#${id}metal)`}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle
            cx={hand[0] + 32 * f}
            cy={hand[1] - 9}
            r="7"
            fill="#8bc34a"
            stroke="#4f7d22"
          />
        </g>
      )}
      {figure.holds === 'stick' && (
        <path
          d={`M${hand[0]} ${hand[1]}L${hand[0] + 34 * f} ${GROUND_Y - 10}q${6 * f} 8 ${16 * f} 2`}
          fill="none"
          stroke="#6b4a2b"
          strokeWidth="6"
          strokeLinecap="round"
        />
      )}
      {figure.holds === 'ball' && (
        <circle
          cx={hand[0] + 10 * f}
          cy={hand[1] - 8}
          r="11"
          fill={`url(#${id}cap0)`}
        />
      )}
      {figure.mark && (
        <text
          x={at(head)[0]}
          y={at(head)[1] - 30}
          textAnchor="middle"
          fontSize="38"
          fontWeight="900"
          fill={figure.mark === 'good' ? '#1f8a70' : '#d9412f'}
        >
          {figure.mark === 'good' ? '✓' : '✗'}
        </text>
      )}
      {figure.pose === 'trap' && (
        <Ball id={id} x={foot[0] + 4 * f} y={GROUND_Y - 13} />
      )}
    </g>
  )
}

function Ball({ id, x, y }: P & { x: number; y: number }) {
  return (
    <g filter={`url(#${id}shadow)`}>
      <circle cx={x} cy={y} r="13" fill="#fafafa" stroke="#555" />
      <path d={`M${x - 5} ${y - 4}l5-4 5 4-2 6h-6Z`} fill="#222" />
    </g>
  )
}

function Ground({
  id,
  kind,
}: P & { kind: Extract<Art, { kind: 'people' }>['ground'] }) {
  const colours = {
    grass: ['#8cc66b', '#4f8f3a'],
    track: ['#c9654a', '#8f3f2c'],
    floor: ['#d6a56c', '#9a6a3a'],
    compound: ['#c98b5a', '#93582f'],
  }[kind]
  return (
    <>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe3f5" />
        <stop offset="1" stopColor="#f3f9fc" />
      </linearGradient>
      <linearGradient id={`${id}ground`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={colours[0]} />
        <stop offset="1" stopColor={colours[1]} />
      </linearGradient>
      <rect
        width="640"
        height="360"
        fill={kind === 'floor' ? `url(#${id}wall)` : `url(#${id}sky)`}
      />
      <rect
        y={GROUND_Y - 22}
        width="640"
        height={360 - GROUND_Y + 22}
        fill={`url(#${id}ground)`}
      />
      {kind === 'track' &&
        [GROUND_Y - 8, GROUND_Y + 22].map((y) => (
          <rect key={y} y={y} width="640" height="3" fill="#fff" opacity=".8" />
        ))}
      {kind === 'grass' && (
        <rect
          y={GROUND_Y + 10}
          width="640"
          height="3"
          fill="#fff"
          opacity=".7"
        />
      )}
    </>
  )
}

function People({ id, art }: P & { art: Extract<Art, { kind: 'people' }> }) {
  return (
    <>
      <Ground id={id} kind={art.ground} />
      {art.sun && (
        <g>
          <circle cx="570" cy="60" r="30" fill="#ffd34d" />
          <circle cx="570" cy="60" r="44" fill="#ffd34d" opacity=".25" />
        </g>
      )}
      {art.cones?.map((x) => (
        <path
          key={x}
          d={`M${x - 13} ${GROUND_Y + 4}l13-34 13 34Z`}
          fill="#f07b22"
          stroke="#b04e0b"
          filter={`url(#${id}shadow)`}
        />
      ))}
      {art.people.map((figure, i) => (
        <Person key={i} id={id} figure={figure} />
      ))}
      {art.balls?.map(([x, y]) => (
        <Ball key={`${x}${y}`} id={id} x={x} y={y} />
      ))}
      <Caption text={art.label} y={346} />
    </>
  )
}

// A field seen from above, with the path to follow.
function Course({ id, art }: P & { art: Extract<Art, { kind: 'course' }> }) {
  const cones = art.path === 'zigzag' ? [110, 210, 310, 410, 510] : []
  const route =
    art.path === 'line'
      ? 'M80 180H560'
      : `M60 180${cones.map((x, i) => `Q${x} ${i % 2 ? 260 : 100} ${x + 50} 180`).join('')}`
  return (
    <>
      <rect width="640" height="360" fill="#7fbf63" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect
          key={i}
          x={i * 80}
          width="40"
          height="360"
          fill="#ffffff"
          opacity=".06"
        />
      ))}
      <path
        d={route}
        fill="none"
        stroke="#fff"
        strokeWidth={art.path === 'line' ? 10 : 5}
        strokeDasharray={art.path === 'line' ? undefined : '14 10'}
        strokeLinecap="round"
      />
      {cones.map((x) => (
        <g key={x} filter={`url(#${id}shadow)`}>
          <circle cx={x + 25} cy="180" r="17" fill="#f07b22" />
          <circle cx={x + 25} cy="180" r="7" fill="#ffd2a8" />
        </g>
      ))}
      {art.path === 'line' &&
        Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx={110 + i * 58}
            cy={i % 2 ? 172 : 188}
            rx="15"
            ry="7"
            fill="#5a3a22"
            opacity=".55"
          />
        ))}
      {art.ball && <Ball id={id} x={62} y={180} />}
      <Caption text={art.label} y={336} />
    </>
  )
}

// Two fingers on the thumb side of the wrist, and a stopwatch.
function Pulse({ id, art }: P & { art: Extract<Art, { kind: 'pulse' }> }) {
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <g filter={`url(#${id}shadow)`}>
        <rect x="40" y="150" width="330" height="76" rx="38" fill="#8a5634" />
        <rect x="330" y="140" width="96" height="96" rx="40" fill="#8a5634" />
        <ellipse cx="196" cy="74" rx="46" ry="34" fill="#6b3d24" />
        <line
          x1="210"
          y1="92"
          x2="246"
          y2="160"
          stroke="#7a4a2b"
          strokeWidth="19"
          strokeLinecap="round"
        />
        <line
          x1="232"
          y1="88"
          x2="268"
          y2="158"
          stroke="#6b3d24"
          strokeWidth="19"
          strokeLinecap="round"
        />
      </g>
      <path
        d="M224 196q10-14 20 0t20 0 20 0"
        stroke="#e45d4b"
        strokeWidth="4"
        fill="none"
      />
      <g filter={`url(#${id}shadow)`}>
        <circle cx="520" cy="170" r="72" fill={`url(#${id}metal)`} />
        <circle cx="520" cy="170" r="60" fill="#fffdf8" />
        <rect
          x="508"
          y="86"
          width="24"
          height="16"
          rx="4"
          fill={`url(#${id}metal)`}
        />
        <path
          d="M520 170V120A50 50 0 0 1 570 170Z"
          fill="#e45d4b"
          opacity=".85"
        />
        <text
          x="520"
          y="210"
          textAnchor="middle"
          fontSize="22"
          fontWeight="800"
          fill={INK}
        >
          15 s
        </text>
      </g>
      <text x="60" y="272" fontSize="19" fontWeight="700" fill={INK}>
        Two fingers on the thumb side of the wrist
      </text>
      <Caption text={art.label} y={320} />
    </>
  )
}

// Events in order along a line, the newest on the right.
function Timeline({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'timeline' }> }) {
  const n = art.events.length
  // Inset from the edges, so the first and last labels are never cut off.
  const step = 440 / Math.max(n - 1, 1)
  return (
    <>
      <Paper id={id} />
      <path
        d="M40 180H600"
        stroke={INK}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M600 180l-16-10v20Z" fill={INK} />
      {art.events.map(([when, what], i) => {
        const x = 100 + (n === 1 ? 220 : i * step)
        const up = i % 2 === 0
        const focus = art.focus === i
        const words = what.split(' ')
        const lines = words.reduce<Array<string>>((all, w) => {
          const last = all.at(-1)
          if (last !== undefined && (last + ' ' + w).length <= 16)
            all[all.length - 1] = last + ' ' + w
          else all.push(w)
          return all
        }, [])
        return (
          <g key={i}>
            <circle
              cx={x}
              cy="180"
              r={focus ? 13 : 10}
              fill={focus ? '#d9412f' : '#e8a317'}
              stroke="#fff"
              strokeWidth="3"
            />
            <path
              d={`M${x} ${up ? 168 : 192}V${up ? 132 : 228}`}
              stroke="#8a9aa8"
              strokeWidth="2"
            />
            <text
              x={x}
              y={up ? 120 : 252}
              textAnchor="middle"
              fontSize="21"
              fontWeight="800"
              fill={focus ? '#d9412f' : INK}
            >
              {when}
            </text>
            {lines.slice(0, 3).map((line, l) => (
              <text
                key={l}
                x={x}
                y={
                  up ? 120 - 24 * (lines.slice(0, 3).length - l) : 276 + 20 * l
                }
                textAnchor="middle"
                fontSize="15"
                fill={INK}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </>
  )
}

const SOURCE_NAMES: Record<HistorySource, string> = {
  coin: 'Old coin',
  letter: 'Old letter',
  photo: 'Old photograph',
  pot: 'Clay pot from a dig',
  drum: 'Talking drum',
  newspaper: 'Old newspaper',
  brochure: 'Funeral brochure',
  painting: 'Wall painting',
}

function SourceItem({
  id,
  item,
  x,
  y,
}: P & { item: HistorySource; x: number; y: number }) {
  const shadow = `url(#${id}shadow)`
  switch (item) {
    case 'coin':
      return (
        <g filter={shadow}>
          <circle
            cx={x}
            cy={y}
            r="40"
            fill={`url(#${id}cap1)`}
            stroke="#9a6b12"
            strokeWidth="3"
          />
          <circle
            cx={x}
            cy={y}
            r="30"
            fill="none"
            stroke="#9a6b12"
            strokeDasharray="3 4"
          />
          <text
            x={x}
            y={y + 8}
            textAnchor="middle"
            fontSize="22"
            fontWeight="800"
            fill="#7a520c"
          >
            1
          </text>
        </g>
      )
    case 'letter':
    case 'newspaper':
    case 'brochure':
      return (
        <g
          filter={shadow}
          transform={`rotate(${item === 'letter' ? -6 : item === 'newspaper' ? 4 : -2} ${x} ${y})`}
        >
          <rect
            x={x - 46}
            y={y - 56}
            width="92"
            height="112"
            rx="3"
            fill={
              item === 'letter'
                ? '#f3e2bd'
                : item === 'brochure'
                  ? '#2a2a2a'
                  : '#f2efe6'
            }
          />
          {item === 'brochure' && (
            <rect x={x - 26} y={y - 40} width="52" height="44" fill="#d8d0c0" />
          )}
          {item === 'newspaper' && (
            <rect x={x - 38} y={y - 48} width="76" height="12" fill="#3a3a3a" />
          )}
          {Array.from({ length: item === 'brochure' ? 3 : 6 }, (_, i) => (
            <rect
              key={i}
              x={x - 36}
              y={
                y -
                (item === 'newspaper' ? 28 : item === 'brochure' ? -12 : 40) +
                i * 13
              }
              width={i % 3 === 2 ? 46 : 72}
              height="4"
              rx="2"
              fill={item === 'brochure' ? '#cfc6b4' : '#7c6a52'}
              opacity=".7"
            />
          ))}
        </g>
      )
    case 'photo':
      return (
        <g filter={shadow} transform={`rotate(5 ${x} ${y})`}>
          <rect x={x - 48} y={y - 42} width="96" height="84" fill="#f7f1e3" />
          <rect x={x - 40} y={y - 34} width="80" height="60" fill="#8f8270" />
          <circle cx={x - 12} cy={y - 10} r="9" fill="#5e5446" />
          <circle cx={x + 14} cy={y - 8} r="9" fill="#5e5446" />
          <rect x={x - 22} y={y + 1} width="20" height="24" fill="#5e5446" />
          <rect x={x + 4} y={y + 3} width="20" height="22" fill="#5e5446" />
        </g>
      )
    case 'pot':
      return (
        <g filter={shadow}>
          <path
            d={`M${x - 22} ${y - 46}h44l-6 12c34 10 40 46 18 70-12 12-56 12-68 0-22-24-16-60 18-70Z`}
            fill={`url(#${id}crust)`}
          />
          <path
            d={`M${x - 34} ${y}h68`}
            stroke="#6d4120"
            strokeWidth="3"
            strokeDasharray="6 5"
          />
        </g>
      )
    case 'drum':
      return (
        <g filter={shadow}>
          <path d={`M${x - 28} ${y - 50}h56l-10 100h-36Z`} fill="#8d5b37" />
          <ellipse
            cx={x}
            cy={y - 50}
            rx="28"
            ry="8"
            fill="#e7d3ad"
            stroke="#6d4120"
          />
          <path
            d={`M${x - 25} ${y - 40}L${x + 18} ${y + 40}M${x + 25} ${y - 40}L${x - 18} ${y + 40}`}
            stroke="#e7d3ad"
            strokeWidth="2"
          />
        </g>
      )
    case 'painting':
      return (
        <g filter={shadow}>
          <rect x={x - 54} y={y - 46} width="108" height="92" fill="#c98b5a" />
          <path
            d={`M${x - 40} ${y + 20}l18-30 14 22 12-14 24 22`}
            stroke="#3b2414"
            strokeWidth="4"
            fill="none"
          />
          <circle cx={x + 26} cy={y - 22} r="9" fill="#f6efe2" />
          <path
            d={`M${x - 36} ${y - 28}h30M${x - 36} ${y - 18}h20`}
            stroke="#f6efe2"
            strokeWidth="5"
          />
        </g>
      )
  }
}

function Sources({ id, art }: P & { art: Extract<Art, { kind: 'sources' }> }) {
  const across = Math.min(art.items.length, 4)
  const rows = Math.ceil(art.items.length / 4)
  const w = 600 / across
  const h = 330 / rows
  return (
    <>
      <Table id={id} y={0} />
      {art.items.map((item, i) => {
        const x = 20 + (i % 4) * w + w / 2
        const y = 12 + Math.floor(i / 4) * h + h / 2 - 22
        return (
          <g key={item}>
            <SourceItem id={id} item={item} x={x} y={y} />
            <rect
              x={x - Math.min(w / 2 - 6, 74)}
              y={y + 66}
              width={Math.min(w - 12, 148)}
              height="26"
              rx="13"
              fill="#fffdf8"
              opacity=".95"
            />
            <text
              x={x}
              y={y + 84}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={INK}
            >
              {SOURCE_NAMES[item]}
            </text>
          </g>
        )
      })}
    </>
  )
}

function Building({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'building' }> }) {
  const shadow = `url(#${id}shadow)`
  const sea =
    art.coast ?? (art.building === 'fort' || art.building === 'lighthouse')
  return (
    <>
      <linearGradient id={`${id}sky2`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9fd3ef" />
        <stop offset="1" stopColor="#eaf6fb" />
      </linearGradient>
      <rect width="640" height="360" fill={`url(#${id}sky2)`} />
      {sea ? (
        <>
          <rect y="268" width="640" height="92" fill={`url(#${id}water)`} />
          <path
            d="M0 268h640"
            stroke="#fff"
            strokeOpacity=".6"
            strokeWidth="3"
          />
        </>
      ) : (
        <rect y="268" width="640" height="92" fill="#c98b5a" />
      )}
      {art.building === 'fort' && (
        <g filter={shadow}>
          <rect x="120" y="150" width="400" height="120" fill="#f4f1ea" />
          {Array.from({ length: 13 }, (_, i) => (
            <rect
              key={i}
              x={120 + i * 31}
              y="134"
              width="18"
              height="18"
              fill="#f4f1ea"
            />
          ))}
          <rect x="250" y="88" width="140" height="64" fill="#ece7dc" />
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              x={250 + i * 25}
              y="74"
              width="14"
              height="16"
              fill="#ece7dc"
            />
          ))}
          <path d="M296 270v-56a24 24 0 0 1 48 0v56Z" fill="#5a4632" />
          {[160, 210, 430, 480].map((x) => (
            <rect key={x} x={x} y="190" width="18" height="26" fill="#8b6c4c" />
          ))}
          <rect x="150" y="160" width="40" height="7" rx="3" fill="#3a3a3a" />
          <rect x="450" y="160" width="40" height="7" rx="3" fill="#3a3a3a" />
        </g>
      )}
      {art.building === 'lighthouse' && (
        <g filter={shadow}>
          <rect x="230" y="240" width="180" height="30" fill="#ddd6c8" />
          <path d="M282 240l14-170h48l14 170Z" fill="#f4f1ea" />
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${284 + i * 4.3} ${218 - i * 56}l3-28h${66 - i * 8.6}l3 28Z`}
              fill="#d9412f"
            />
          ))}
          <rect
            x="288"
            y="46"
            width="64"
            height="26"
            fill="#f9e7a1"
            stroke="#3a3a3a"
            strokeWidth="3"
          />
          <path d="M282 46h76l-38-24Z" fill="#3a3a3a" />
        </g>
      )}
      {art.building === 'mosque' && (
        <g filter={shadow}>
          <rect x="140" y="176" width="360" height="94" fill="#f2ead8" />
          {[
            [180, 104],
            [440, 120],
          ].map(([x, top]) => (
            <g key={x}>
              <path
                d={`M${x! - 34} 270V${top! + 40}l34-${40}l34 40V270Z`}
                fill="#efe6d2"
              />
              {Array.from({ length: 4 }, (_, i) =>
                [-1, 1].map((side) => (
                  <line
                    key={`${i}${side}`}
                    x1={x! + side * 34}
                    y1={top! + 60 + i * 34}
                    x2={x! + side * 48}
                    y2={top! + 60 + i * 34}
                    stroke="#5a3a22"
                    strokeWidth="4"
                  />
                )),
              )}
            </g>
          ))}
          <path d="M296 270v-46a24 24 0 0 1 48 0v46Z" fill="#5a3a22" />
          <path d="M140 176h360" stroke="#d8ccb2" strokeWidth="4" />
        </g>
      )}
      {art.building === 'palace' && (
        <g filter={shadow}>
          {[150, 320, 490].map((x, i) => (
            <g key={x}>
              <rect
                x={x - 70}
                y={190 - (i === 1 ? 20 : 0)}
                width="140"
                height={80 + (i === 1 ? 20 : 0)}
                rx={i === 1 ? 4 : 50}
                fill="#c98b5a"
              />
              <path
                d={`M${x - 84} ${194 - (i === 1 ? 20 : 0)}L${x} ${110 - (i === 1 ? 30 : 0)}L${x + 84} ${194 - (i === 1 ? 20 : 0)}Z`}
                fill="#c8a24f"
              />
              <path
                d={`M${x - 16} 270v-38a16 16 0 0 1 32 0v38Z`}
                fill="#4a2e1a"
              />
            </g>
          ))}
        </g>
      )}
      {art.building === 'hospital' && (
        <g filter={shadow}>
          <rect x="110" y="120" width="420" height="150" fill="#f6f4ee" />
          <rect x="110" y="110" width="420" height="14" fill="#7d8b97" />
          {[0, 1].map((r) =>
            [150, 210, 270, 370, 430, 490].map((x) => (
              <rect
                key={`${r}${x}`}
                x={x - 16}
                y={140 + r * 52}
                width="32"
                height="30"
                fill="#9fcde0"
                stroke="#fff"
                strokeWidth="3"
              />
            )),
          )}
          <rect x="300" y="196" width="40" height="74" fill="#5c7080" />
          <rect x="296" y="128" width="48" height="48" rx="6" fill="#1f8a70" />
          <text
            x="320"
            y="164"
            textAnchor="middle"
            fontSize="34"
            fontWeight="900"
            fill="#fff"
          >
            H
          </text>
        </g>
      )}
      {art.building === 'school' && (
        <g filter={shadow}>
          <rect x="130" y="150" width="380" height="120" fill="#f1e3c4" />
          <path d="M110 154L320 70L530 154Z" fill="#a8432f" />
          {[170, 250, 390, 470].map((x) => (
            <rect
              key={x}
              x={x - 20}
              y="186"
              width="40"
              height="40"
              fill="#7fb6cf"
              stroke="#fff"
              strokeWidth="3"
            />
          ))}
          <rect x="296" y="196" width="48" height="74" fill="#5a3a22" />
          <path d="M320 70V30" stroke="#5a3a22" strokeWidth="4" />
          <path d="M306 30h28v10h-28Z" fill="#8a7a6a" />
        </g>
      )}
      <Caption text={art.label} y={330} />
    </>
  )
}

function Scroll({ id, art }: P & { art: Extract<Art, { kind: 'scroll' }> }) {
  return (
    <>
      <Table id={id} y={0} />
      <g filter={`url(#${id}shadow)`}>
        <rect x="110" y="28" width="420" height="300" rx="6" fill="#f3e2bd" />
        <rect x="96" y="20" width="448" height="22" rx="11" fill="#d9bf8a" />
        <rect x="96" y="316" width="448" height="22" rx="11" fill="#d9bf8a" />
      </g>
      <text
        x="320"
        y="84"
        textAnchor="middle"
        fontSize="27"
        fontWeight="800"
        fill="#4a3216"
      >
        {art.title}
      </text>
      {art.date && (
        <text
          x="320"
          y="110"
          textAnchor="middle"
          fontSize="16"
          fontStyle="italic"
          fill="#6d4f2a"
        >
          {art.date}
        </text>
      )}
      {art.lines.slice(0, 5).map((line, i) => (
        <text key={i} x="140" y={150 + i * 32} fontSize="17" fill="#4a3216">
          {art.plain ? line : `${i + 1}. ${line}`}
        </text>
      ))}
      <circle cx="470" cy="286" r="22" fill="#a8322a" />
      <circle
        cx="470"
        cy="286"
        r="13"
        fill="none"
        stroke="#e08b80"
        strokeWidth="2"
      />
    </>
  )
}

function Family({ id, art }: P & { art: Extract<Art, { kind: 'family' }> }) {
  const rows = art.rows.length
  const rowY = (r: number) => 50 + r * (250 / Math.max(rows - 1, 1))
  // Each box fits its words, and a row is centred as a whole.
  const width = (name: string) => Math.max(132, name.length * 10.5 + 28)
  const centres = (row: Array<string>) => {
    const total =
      row.reduce((sum, n) => sum + width(n), 0) + 20 * (row.length - 1)
    let left = 320 - total / 2
    return row.map((n) => {
      const x = left + width(n) / 2
      left += width(n) + 20
      return x
    })
  }
  return (
    <>
      <Paper id={id} />
      {art.rows.map((row, r) =>
        row.map((name, i) => {
          const x = centres(row)[i]!
          return (
            <g key={`${r}${i}`}>
              {r > 0 && (
                <path
                  d={`M${x} ${rowY(r) - 26}V${rowY(r) - 50}H320V${rowY(r - 1) + 26}`}
                  fill="none"
                  stroke="#8a9aa8"
                  strokeWidth="2.5"
                />
              )}
              <rect
                x={x - width(name) / 2}
                y={rowY(r) - 24}
                width={width(name)}
                height="48"
                rx="24"
                fill={r === rows - 1 ? '#fdeec3' : '#d6eef0'}
                stroke="#8a9aa8"
              />
              <text
                x={x}
                y={rowY(r) + 7}
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill={INK}
              >
                {name}
              </text>
            </g>
          )
        }),
      )}
    </>
  )
}

// Red, gold and green, with the black star at the centre.
function Flag({ id, art }: P & { art: Extract<Art, { kind: 'flag' }> }) {
  const star = Array.from({ length: 10 }, (_, i) =>
    polar(320, 158, i % 2 ? 19 : 48, i / 10).join(','),
  ).join(' ')
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <rect
        x="96"
        y="40"
        width="10"
        height="290"
        rx="4"
        fill={`url(#${id}metal)`}
      />
      <g filter={`url(#${id}shadow)`}>
        <rect x="106" y="56" width="430" height="68" fill="#ce1126" />
        <rect x="106" y="124" width="430" height="68" fill="#fcd116" />
        <rect x="106" y="192" width="430" height="68" fill="#006b3f" />
        <polygon points={star} fill="#000" />
      </g>
      <Caption text={art.label} y={318} />
    </>
  )
}

// The country from north to south, as three belts. A diagram, not a map.
function Belts({ id, art }: P & { art: Extract<Art, { kind: 'belts' }> }) {
  const tones = ['#e9c98a', '#7fb36a', '#7fc0d9']
  const h = 300 / art.belts.length
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <text
        x="320"
        y="30"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#5b6b78"
      >
        North
      </text>
      {art.belts.map((belt, i) => (
        <g key={belt.name}>
          <rect
            x="30"
            y={40 + i * h}
            width="580"
            height={h - 6}
            rx="12"
            fill={tones[i % 3]}
          />
          <text
            x="52"
            y={40 + i * h + 34}
            fontSize="21"
            fontWeight="800"
            fill={INK}
          >
            {belt.name}
          </text>
          <text x="52" y={40 + i * h + 62} fontSize="16" fill={INK}>
            {belt.places.join(' · ')}
          </text>
        </g>
      ))}
      <text
        x="320"
        y="354"
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill="#5b6b78"
      >
        South (the sea)
      </text>
    </>
  )
}

// Small pictures of everyday life, long ago and today.
function LifeIcon({
  id,
  what,
  past,
  x,
  y,
}: P & { what: ThenNow; past: boolean; x: number; y: number }) {
  const shadow = `url(#${id}shadow)`
  if (what === 'home')
    return past ? (
      <g filter={shadow}>
        <ellipse cx={x} cy={y + 20} rx="42" ry="26" fill="#b9774a" />
        <rect x={x - 42} y={y - 6} width="84" height="26" fill="#b9774a" />
        <path
          d={`M${x - 54} ${y - 2}L${x} ${y - 48}L${x + 54} ${y - 2}Z`}
          fill="#d1b06a"
        />
        <path
          d={`M${x - 10} ${y + 40}v-26a10 10 0 0 1 20 0v26Z`}
          fill="#4a2e1a"
        />
      </g>
    ) : (
      <g filter={shadow}>
        <rect x={x - 50} y={y - 14} width="100" height="58" fill="#f1e3c4" />
        <path
          d={`M${x - 58} ${y - 12}L${x} ${y - 46}L${x + 58} ${y - 12}Z`}
          fill="#8a9aa8"
        />
        <rect x={x - 38} y={y} width="22" height="20" fill="#9fcde0" />
        <rect x={x + 16} y={y} width="22" height="20" fill="#9fcde0" />
        <rect x={x - 9} y={y + 12} width="18" height="32" fill="#5a3a22" />
      </g>
    )
  if (what === 'travel')
    return past ? (
      <g filter={shadow}>
        <path d={`M${x - 60} ${y + 10}h120l-14 18h-92Z`} fill="#8d5b37" />
        <path
          d={`M${x + 20} ${y + 10}l20-46`}
          stroke="#5a3a22"
          strokeWidth="4"
        />
        <path
          d={`M${x - 70} ${y + 30}q35-8 70 0t70 0`}
          stroke={`url(#${id}water)`}
          strokeWidth="6"
          fill="none"
        />
      </g>
    ) : (
      <g filter={shadow}>
        <rect
          x={x - 58}
          y={y - 6}
          width="116"
          height="30"
          rx="10"
          fill="#d9412f"
        />
        <path d={`M${x - 36} ${y - 6}l14-22h44l14 22Z`} fill="#c0392b" />
        <rect x={x - 28} y={y - 24} width="22" height="16" fill="#9fcde0" />
        <rect x={x + 4} y={y - 24} width="22" height="16" fill="#9fcde0" />
        <circle cx={x - 32} cy={y + 26} r="11" fill="#2a2a2a" />
        <circle cx={x + 32} cy={y + 26} r="11" fill="#2a2a2a" />
      </g>
    )
  if (what === 'message')
    return past ? (
      <SourceItem id={id} item="drum" x={x} y={y + 6} />
    ) : (
      <g filter={shadow}>
        <rect
          x={x - 22}
          y={y - 40}
          width="44"
          height="82"
          rx="8"
          fill="#2a2a2a"
        />
        <rect
          x={x - 17}
          y={y - 32}
          width="34"
          height="62"
          rx="3"
          fill="#7fb6cf"
        />
        <circle cx={x} cy={y + 36} r="3" fill="#888" />
      </g>
    )
  return past ? (
    <g filter={shadow}>
      {Array.from({ length: 6 }, (_, i) => (
        <ellipse
          key={i}
          cx={x - 30 + (i % 3) * 30}
          cy={y - 8 + Math.floor(i / 3) * 26}
          rx="12"
          ry="9"
          fill="#f4ecd8"
          stroke="#bfae8a"
        />
      ))}
    </g>
  ) : (
    <g filter={shadow}>
      <rect
        x={x - 50}
        y={y - 24}
        width="100"
        height="52"
        rx="5"
        fill={NOTE[10]![0]}
        stroke={NOTE[10]![1]}
        strokeWidth="2.5"
      />
      <text
        x={x}
        y={y + 10}
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        fill={NOTE[10]![1]}
      >
        GH₵
      </text>
    </g>
  )
}

const LIFE_NAMES: Record<ThenNow, [string, string]> = {
  home: ['Mud and thatch', 'Block and roofing sheets'],
  travel: ['On foot and by canoe', 'By car and trotro'],
  message: ['Talking drums', 'Mobile phones'],
  money: ['Cowries and gold dust', 'Cedi notes and coins'],
}

function ThenNowArt({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'thenNow' }> }) {
  const h = 290 / art.rows.length
  return (
    <>
      <rect width="640" height="360" fill={`url(#${id}wall)`} />
      <rect x="20" y="16" width="290" height="328" rx="14" fill="#f1dfbf" />
      <rect x="330" y="16" width="290" height="328" rx="14" fill="#d6eef0" />
      <text
        x="165"
        y="44"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill={INK}
      >
        Long ago
      </text>
      <text
        x="475"
        y="44"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill={INK}
      >
        Today
      </text>
      {art.rows.map((what, i) => {
        const y = 56 + i * h + h / 2 - 8
        return (
          <g key={what}>
            {[false, true].map((now) => (
              <g key={String(now)}>
                {/* Icons are drawn about 100px tall; fit them to the row. */}
                <g
                  transform={`translate(${now ? 420 : 110} ${y}) scale(${Math.min(1, (h - 8) / 104)}) translate(${now ? -420 : -110} ${-y})`}
                >
                  <LifeIcon
                    id={id}
                    what={what}
                    past={!now}
                    x={now ? 420 : 110}
                    y={y}
                  />
                </g>
                <text
                  x={now ? 540 : 230}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="700"
                  fill={INK}
                >
                  {LIFE_NAMES[what][now ? 1 : 0]
                    .split(' and ')
                    .map((part, k, all) => (
                      <tspan key={k} x={now ? 540 : 230} dy={k ? 17 : 0}>
                        {part}
                        {k < all.length - 1 ? ' and' : ''}
                      </tspan>
                    ))}
                </text>
              </g>
            ))}
          </g>
        )
      })}
    </>
  )
}

// The three sides of the Trans-Atlantic trade, as a diagram rather than a map.
function Triangle({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'triangle' }> }) {
  const places = [
    { name: 'Europe', x: 320, y: 64 },
    { name: 'The Americas', x: 112, y: 262 },
    { name: 'West Africa', x: 528, y: 262 },
  ]
  const legs = [
    { from: 0, to: 2, text: 'Guns, cloth, alcohol' },
    { from: 2, to: 1, text: 'Enslaved Africans' },
    { from: 1, to: 0, text: 'Sugar, cotton, tobacco' },
  ]
  return (
    <>
      <Paper id={id} />
      <defs>
        <marker
          id={`${id}arrow`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0L10 5L0 10Z" fill="#5b6b78" />
        </marker>
      </defs>
      {legs.map((leg) => {
        const a = places[leg.from]!
        const b = places[leg.to]!
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        const middle = leg.from === 2
        return (
          <g key={leg.text}>
            <line
              x1={a.x + (b.x - a.x) * 0.22}
              y1={a.y + (b.y - a.y) * 0.22}
              x2={a.x + (b.x - a.x) * 0.78}
              y2={a.y + (b.y - a.y) * 0.78}
              stroke={middle ? '#a8322a' : '#5b6b78'}
              strokeWidth={middle ? 5 : 3.5}
              markerEnd={`url(#${id}arrow)`}
            />
            <text
              x={mx}
              y={my + (middle ? 34 : -10)}
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill={middle ? '#a8322a' : INK}
            >
              {leg.text}
            </text>
          </g>
        )
      })}
      {places.map((p) => (
        <g key={p.name}>
          <rect
            x={p.x - 74}
            y={p.y - 20}
            width="148"
            height="40"
            rx="20"
            fill="#fdeec3"
            stroke="#b9791b"
          />
          <text
            x={p.x}
            y={p.y + 7}
            textAnchor="middle"
            fontSize="18"
            fontWeight="800"
            fill={INK}
          >
            {p.name}
          </text>
        </g>
      ))}
      <Caption text={art.label} y={330} />
    </>
  )
}

function Cocoa({ id, art }: P & { art: Extract<Art, { kind: 'cocoa' }> }) {
  return (
    <>
      <Table id={id} y={230} />
      <linearGradient id={`${id}pod`} x1="0" x2="1">
        <stop offset="0" stopColor="#c46a1c" />
        <stop offset=".45" stopColor="#f0a33a" />
        <stop offset="1" stopColor="#a8551a" />
      </linearGradient>
      <g filter={`url(#${id}shadow)`}>
        <path
          d="M70 160C110 92 350 92 390 160C350 228 110 228 70 160Z"
          fill={`url(#${id}pod)`}
          transform="rotate(-24 230 160)"
        />
        {[-36, -12, 12, 36].map((dy) => (
          <path
            key={dy}
            d={`M84 160C150 ${160 + dy * 1.5} 310 ${160 + dy * 1.5} 376 160`}
            stroke="#9a4c14"
            strokeOpacity=".4"
            strokeWidth="3"
            fill="none"
            transform="rotate(-24 230 160)"
          />
        ))}
        <path
          d="M386 62l24-18"
          stroke="#5a3a22"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={i}
          cx={420 + (i % 3) * 52}
          cy={150 + Math.floor(i / 3) * 40}
          rx="22"
          ry="14"
          fill="#6b3d24"
          stroke="#4a2716"
          transform={`rotate(${((i * 37) % 50) - 25} ${420 + (i % 3) * 52} ${150 + Math.floor(i / 3) * 40})`}
          filter={`url(#${id}shadow)`}
        />
      ))}
      <Caption text={art.label} y={318} />
    </>
  )
}

// A ballot box, and a ballot paper marked with an inked thumb.
function Ballot({ id, art }: P & { art: Extract<Art, { kind: 'ballot' }> }) {
  return (
    <>
      <Table id={id} y={250} />
      <g filter={`url(#${id}shadow)`}>
        <rect
          x="120"
          y="110"
          width="220"
          height="150"
          rx="6"
          fill="#e9eef2"
          stroke="#9aa8b4"
          strokeWidth="3"
        />
        <rect x="120" y="96" width="220" height="22" rx="4" fill="#cfd8df" />
        <rect x="186" y="102" width="88" height="8" rx="4" fill="#3a3a3a" />
        <text
          x="230"
          y="196"
          textAnchor="middle"
          fontSize="20"
          fontWeight="800"
          fill="#5b6b78"
        >
          BALLOT BOX
        </text>
      </g>
      <g filter={`url(#${id}shadow)`} transform="rotate(8 470 170)">
        <rect x="390" y="70" width="160" height="200" rx="4" fill="#fffdf8" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="406"
              y={92 + i * 58}
              width="84"
              height="40"
              rx="3"
              fill="#eef1f4"
            />
            <rect
              x="500"
              y={92 + i * 58}
              width="36"
              height="40"
              rx="3"
              fill="none"
              stroke="#9aa8b4"
              strokeWidth="2"
            />
          </g>
        ))}
        <ellipse
          cx="518"
          cy="170"
          rx="12"
          ry="15"
          fill="#2b4a8b"
          opacity=".85"
        />
      </g>
      <Caption text={art.label} y={322} />
    </>
  )
}

const GOOD_NAMES: Record<Good, string> = {
  salt: 'Salt',
  fish: 'Dried fish',
  gold: 'Gold',
  kola: 'Kola nuts',
  shea: 'Shea butter',
  pot: 'Clay pots',
  cloth: 'Woven cloth',
  iron: 'Iron tools',
  cowries: 'Cowrie shells',
  jar: 'Jam and marmalade',
  wax: 'Wax print cloth',
}

function GoodItem({
  id,
  good,
  x,
  y,
}: P & { good: Good; x: number; y: number }) {
  const shadow = `url(#${id}shadow)`
  switch (good) {
    case 'salt':
      return (
        <path
          d={`M${x - 46} ${y + 30}Q${x} ${y - 50} ${x + 46} ${y + 30}Z`}
          fill="#f7f7f2"
          stroke="#d8d8cc"
          filter={shadow}
        />
      )
    case 'fish':
      return (
        <g filter={shadow}>
          {[-14, 10].map((dy) => (
            <g key={dy}>
              <ellipse cx={x - 6} cy={y + dy} rx="34" ry="11" fill="#8a6a42" />
              <path d={`M${x + 24} ${y + dy}l18-11v22Z`} fill="#6d5233" />
              <circle cx={x - 30} cy={y + dy - 2} r="2.5" fill="#2a2a2a" />
            </g>
          ))}
        </g>
      )
    case 'gold':
      return (
        <g filter={shadow}>
          {[
            [-18, 10, 14],
            [10, 14, 11],
            [0, -8, 13],
            [22, -6, 9],
          ].map(([dx, dy, r]) => (
            <circle
              key={`${dx}${dy}`}
              cx={x + dx!}
              cy={y + dy!}
              r={r}
              fill={`url(#${id}cap1)`}
            />
          ))}
        </g>
      )
    case 'kola':
      return (
        <g filter={shadow}>
          {[
            [-20, 6],
            [6, 12],
            [-4, -12],
            [22, -4],
          ].map(([dx, dy]) => (
            <ellipse
              key={`${dx}${dy}`}
              cx={x + dx!}
              cy={y + dy!}
              rx="15"
              ry="12"
              fill={dx! > 0 ? '#c94a5a' : '#e9c6a8'}
              stroke="#00000022"
            />
          ))}
        </g>
      )
    case 'shea':
      return (
        <g filter={shadow}>
          <path d={`M${x - 42} ${y}a42 34 0 0 0 84 0Z`} fill="#b0773c" />
          <ellipse cx={x} cy={y} rx="42" ry="10" fill="#c48a4f" />
          <ellipse cx={x} cy={y - 6} rx="28" ry="14" fill="#f3e6bf" />
        </g>
      )
    case 'pot':
      return <SourceItem id={id} item="pot" x={x} y={y} />
    case 'cloth':
      return (
        <g filter={shadow}>
          <rect x={x - 46} y={y - 34} width="92" height="68" fill="#e8a317" />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={x - 46 + i * 19}
              y={y - 34}
              width="9"
              height="68"
              fill={i % 2 ? '#1f8a70' : '#d9412f'}
            />
          ))}
          <rect x={x - 46} y={y - 6} width="92" height="10" fill="#1f2a44" />
        </g>
      )
    case 'iron':
      return (
        <g filter={shadow}>
          <path
            d={`M${x - 40} ${y + 30}L${x + 20} ${y - 30}`}
            stroke="#8d5b37"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d={`M${x + 4} ${y - 40}l34 4-6 30-28-8Z`}
            fill={`url(#${id}metal)`}
          />
        </g>
      )
    case 'cowries':
      return (
        <g filter={shadow}>
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <ellipse
                cx={x - 30 + (i % 3) * 30}
                cy={y - 10 + Math.floor(i / 3) * 24}
                rx="13"
                ry="9"
                fill="#f4ecd8"
                stroke="#bfae8a"
              />
              <path
                d={`M${x - 38 + (i % 3) * 30} ${y - 10 + Math.floor(i / 3) * 24}h16`}
                stroke="#9a8a6a"
                strokeWidth="1.5"
              />
            </g>
          ))}
        </g>
      )
    case 'wax':
      return (
        <g filter={shadow}>
          <rect x={x - 46} y={y - 34} width="92" height="68" fill="#1d5fa8" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <g key={`${r}${c}`}>
                <circle
                  cx={x - 34 + c * 23 + (r % 2) * 11}
                  cy={y - 22 + r * 22}
                  r="9"
                  fill="#f2b632"
                />
                <circle
                  cx={x - 34 + c * 23 + (r % 2) * 11}
                  cy={y - 22 + r * 22}
                  r="4"
                  fill="#d9412f"
                />
              </g>
            )),
          )}
        </g>
      )
    case 'jar':
      return (
        <g filter={shadow}>
          {[-26, 26].map((dx) => (
            <g key={dx}>
              <rect
                x={x + dx - 20}
                y={y - 26}
                width="40"
                height="56"
                rx="8"
                fill={dx < 0 ? '#e8742c' : '#c0392b'}
              />
              <rect
                x={x + dx - 22}
                y={y - 36}
                width="44"
                height="12"
                rx="3"
                fill="#d4af37"
              />
              <rect
                x={x + dx - 14}
                y={y - 8}
                width="28"
                height="18"
                rx="2"
                fill="#fffdf8"
              />
            </g>
          ))}
        </g>
      )
  }
}

function Goods({ id, art }: P & { art: Extract<Art, { kind: 'goods' }> }) {
  const across = Math.min(art.items.length, 4)
  const rows = Math.ceil(art.items.length / 4)
  const w = 600 / across
  const h = (art.label ? 290 : 330) / rows
  return (
    <>
      <Table id={id} y={0} />
      {art.items.map((good, i) => {
        const x = 20 + (i % 4) * w + w / 2
        const y = 16 + Math.floor(i / 4) * h + h / 2 - 18
        return (
          <g key={good}>
            <GoodItem id={id} good={good} x={x} y={y} />
            <rect
              x={x - Math.max(62, GOOD_NAMES[good].length * 3.9 + 14)}
              y={y + 50}
              width={Math.max(124, GOOD_NAMES[good].length * 7.8 + 28)}
              height="26"
              rx="13"
              fill="#fffdf8"
              opacity=".95"
            />
            <text
              x={x}
              y={y + 68}
              textAnchor="middle"
              fontSize="14"
              fontWeight="700"
              fill={INK}
            >
              {GOOD_NAMES[good]}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={340} />
    </>
  )
}

// Ghana's coins, drawn plainly by value.
function CoinArt({
  id,
  value,
  x,
  y,
}: P & { value: number; x: number; y: number }) {
  const cedi = value >= 100
  const r = cedi ? 54 : 30 + Math.min(value, 50) * 0.36
  return (
    <g filter={`url(#${id}shadow)`}>
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={cedi ? `url(#${id}cap1)` : `url(#${id}metal)`}
        stroke={cedi ? '#9a6b12' : '#6e7b87'}
        strokeWidth="2.5"
      />
      {cedi && (
        <circle
          cx={x}
          cy={y}
          r={r - 9}
          fill="none"
          stroke="#c8ccd2"
          strokeWidth="6"
        />
      )}
      <circle
        cx={x}
        cy={y}
        r={r - 5}
        fill="none"
        stroke="#00000022"
        strokeDasharray="3 4"
      />
      <text
        x={x}
        y={y + 8}
        textAnchor="middle"
        fontSize={cedi ? 24 : 21}
        fontWeight="800"
        fill="#3a3a3a"
      >
        {cedi ? 'GH₵1' : `${value}p`}
      </text>
    </g>
  )
}

function Coins({ id, art }: P & { art: Extract<Art, { kind: 'coins' }> }) {
  const across = Math.min(art.coins.length, 6)
  const rows = Math.ceil(art.coins.length / 6)
  const w = 600 / across
  const h = (art.label ? 280 : 320) / rows
  return (
    <>
      <Table id={id} y={0} />
      {art.coins.map((value, i) => (
        <CoinArt
          key={i}
          id={id}
          value={value}
          x={20 + (i % 6) * w + w / 2}
          y={24 + Math.floor(i / 6) * h + h / 2}
        />
      ))}
      <Caption text={art.label} y={334} />
    </>
  )
}

const MOTIF_TONES: Record<Motif, string> = {
  star: '#e8a317',
  circle: '#1f8a70',
  square: '#d9412f',
  triangle: '#2b6cb0',
  clap: '#8d5b37',
  snap: '#7955aa',
}

function MotifArt({
  motif,
  x,
  y,
}: {
  motif: Motif | null
  x: number
  y: number
}) {
  if (motif === null)
    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="30"
          fill="#fff"
          stroke="#d9412f"
          strokeWidth="4"
          strokeDasharray="8 6"
        />
        <text
          x={x}
          y={y + 12}
          textAnchor="middle"
          fontSize="34"
          fontWeight="800"
          fill="#d9412f"
        >
          ?
        </text>
      </g>
    )
  const tone = MOTIF_TONES[motif]
  if (motif === 'star')
    return (
      <polygon
        points={Array.from({ length: 10 }, (_, i) =>
          polar(x, y, i % 2 ? 13 : 32, i / 10).join(','),
        ).join(' ')}
        fill={tone}
      />
    )
  if (motif === 'circle') return <circle cx={x} cy={y} r="28" fill={tone} />
  if (motif === 'square')
    return <rect x={x - 26} y={y - 26} width="52" height="52" fill={tone} />
  if (motif === 'triangle')
    return (
      <polygon
        points={`${x},${y - 30} ${x + 30},${y + 24} ${x - 30},${y + 24}`}
        fill={tone}
      />
    )
  return (
    <g>
      <text x={x} y={y + 14} textAnchor="middle" fontSize="40">
        {motif === 'clap' ? '👏' : '🫰'}
      </text>
      <text
        x={x}
        y={y + 50}
        textAnchor="middle"
        fontSize="15"
        fontWeight="700"
        fill={tone}
      >
        {motif}
      </text>
    </g>
  )
}

function Repeat({ id, art }: P & { art: Extract<Art, { kind: 'repeat' }> }) {
  const w = Math.min(560 / art.items.length, 80)
  const left = 320 - (art.items.length * w) / 2
  return (
    <>
      <Paper id={id} />
      {art.items.map((motif, i) => (
        <MotifArt key={i} motif={motif} x={left + w * (i + 0.5)} y={160} />
      ))}
      <Caption text={art.label} y={300} />
    </>
  )
}

// A ball placed in relation to a box, for position words.
function Position({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'position' }> }) {
  const box = { x: 250, y: 170, w: 140, h: 100 }
  const at = {
    above: [320, 120],
    below: [320, 300],
    beside: [440, 240],
    'in front of': [320, 250],
    behind: [372, 150],
    inside: [320, 200],
  }[art.word]
  const back = art.word === 'behind' || art.word === 'inside'
  const ball = <Ball id={id} x={at[0]!} y={at[1]!} />
  return (
    <>
      <Table id={id} y={art.word === 'below' ? 330 : 270} />
      {art.word === 'below' && (
        <rect
          x={box.x - 20}
          y="268"
          width={box.w + 40}
          height="14"
          fill={`url(#${id}wood)`}
        />
      )}
      {back && ball}
      <g filter={`url(#${id}shadow)`}>
        <path
          d={`M${box.x} ${box.y}h${box.w}v${box.h}h-${box.w}Z`}
          fill="#d8b07a"
          stroke="#9a7040"
          strokeWidth="2"
          opacity={art.word === 'inside' ? 0.8 : 1}
        />
        <path
          d={`M${box.x} ${box.y}l24 -22h${box.w}l-24 22Z`}
          fill="#e6c590"
          stroke="#9a7040"
          strokeWidth="2"
        />
        <path
          d={`M${box.x + box.w} ${box.y}l24 -22v${box.h}l-24 22Z`}
          fill="#b98d55"
          stroke="#9a7040"
          strokeWidth="2"
        />
      </g>
      {!back && ball}
      <Caption text={`The ball is ${art.word} the box.`} y={342} />
    </>
  )
}

// Rows and columns of counters: an array for multiplying.
function Grid({ id, art }: P & { art: Extract<Art, { kind: 'grid' }> }) {
  const gap = Math.min(440 / art.cols, 220 / art.rows, 64)
  const left = 320 - ((art.cols - 1) * gap) / 2
  const top = 150 - ((art.rows - 1) * gap) / 2
  return (
    <>
      <Paper id={id} />
      {Array.from({ length: art.rows * art.cols }, (_, i) => (
        <Cap
          key={i}
          id={id}
          x={left + (i % art.cols) * gap}
          y={top + Math.floor(i / art.cols) * gap}
          r={Math.min(gap * 0.36, 20)}
          tone={Math.floor(i / art.cols)}
        />
      ))}
      <Caption text={art.label ?? `${art.rows} rows of ${art.cols}`} y={318} />
    </>
  )
}

// Two arms meeting at a corner; a square marks a right angle.
function Angle({ id, art }: P & { art: Extract<Art, { kind: 'angle' }> }) {
  const cx = 220
  const cy = 250
  const [ex, ey] = polar(cx, cy, 200, 0.25 - art.degrees / 360)
  const right = art.degrees === 90
  return (
    <>
      <Paper id={id} />
      <line
        x1={cx}
        y1={cy}
        x2={cx + 240}
        y2={cy}
        stroke={INK}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={ex}
        y2={ey}
        stroke="#d9412f"
        strokeWidth="7"
        strokeLinecap="round"
      />
      {right ? (
        <path
          d={`M${cx + 34} ${cy}v-34h-34`}
          fill="none"
          stroke="#1f8a70"
          strokeWidth="4"
        />
      ) : (
        <path
          d={`M${cx + 48} ${cy}A48 48 0 0 0 ${polar(cx, cy, 48, 0.25 - art.degrees / 360).join(' ')}`}
          fill="none"
          stroke="#1f8a70"
          strokeWidth="4"
        />
      )}
      <circle cx={cx} cy={cy} r="8" fill={INK} />
      <Caption
        text={
          art.label ??
          (right
            ? 'A right angle (square corner)'
            : art.degrees < 90
              ? 'Smaller than a square corner'
              : 'Bigger than a square corner')
        }
        y={318}
      />
    </>
  )
}

function Ruler({ id, art }: P & { art: Extract<Art, { kind: 'ruler' }> }) {
  const unit = 540 / Math.max(art.cm, 10)
  return (
    <>
      <Table id={id} y={0} />
      <g filter={`url(#${id}shadow)`}>
        <rect
          x="40"
          y="150"
          width={unit * Math.max(art.cm, 10) + 20}
          height="78"
          rx="4"
          fill="#f6e7a6"
          stroke="#b9a35a"
        />
        {Array.from({ length: Math.max(art.cm, 10) + 1 }, (_, i) => (
          <g key={i}>
            <line
              x1={50 + i * unit}
              y1="150"
              x2={50 + i * unit}
              y2={i % 5 === 0 ? 186 : 174}
              stroke="#3a3a3a"
              strokeWidth="2"
            />
            {i % (art.cm > 20 ? 5 : 1) === 0 && (
              <text
                x={50 + i * unit}
                y="208"
                textAnchor="middle"
                fontSize={art.cm > 20 ? 14 : 16}
                fill="#3a3a3a"
              >
                {i}
              </text>
            )}
          </g>
        ))}
      </g>
      <rect
        x="50"
        y="110"
        width={unit * art.cm}
        height="18"
        rx="9"
        fill="#d9412f"
        filter={`url(#${id}shadow)`}
      />
      <Caption text={art.label ?? `${art.cm} cm`} y={300} />
    </>
  )
}

function Compass({ id, art }: P & { art: Extract<Art, { kind: 'compass' }> }) {
  const cx = 320
  const cy = 158
  const points = [
    ['N', 0],
    ['E', 0.25],
    ['S', 0.5],
    ['W', 0.75],
  ] as const
  const between = art.eight
    ? ([
        ['NE', 0.125],
        ['SE', 0.375],
        ['SW', 0.625],
        ['NW', 0.875],
      ] as const)
    : []
  return (
    <>
      <Paper id={id} />
      <circle
        cx={cx}
        cy={cy}
        r="112"
        fill="#f6f1e4"
        stroke="#b9a35a"
        strokeWidth="4"
        filter={`url(#${id}shadow)`}
      />
      {points.map(([name, turn]) => {
        const [x, y] = polar(cx, cy, 92, turn)
        const [lx, ly] = polar(cx, cy, 18, turn + 0.25)
        const [rx, ry] = polar(cx, cy, 18, turn - 0.25)
        const [tx, ty] = polar(cx, cy, 134, turn)
        return (
          <g key={name}>
            <polygon
              points={`${x},${y} ${lx},${ly} ${rx},${ry}`}
              fill={name === 'N' ? '#d9412f' : '#5b6b78'}
            />
            <text
              x={tx}
              y={ty + 9}
              textAnchor="middle"
              fontSize="28"
              fontWeight="800"
              fill={name === 'N' ? '#d9412f' : INK}
            >
              {name}
            </text>
          </g>
        )
      })}
      {between.map(([name, turn]) => {
        const [x, y] = polar(cx, cy, 64, turn)
        const [lx, ly] = polar(cx, cy, 11, turn + 0.25)
        const [rx, ry] = polar(cx, cy, 11, turn - 0.25)
        const [tx, ty] = polar(cx, cy, 136, turn)
        return (
          <g key={name}>
            <polygon
              points={`${x},${y} ${lx},${ly} ${rx},${ry}`}
              fill="#9aa7b2"
            />
            <text
              x={tx}
              y={ty + 7}
              textAnchor="middle"
              fontSize="20"
              fontWeight="800"
              fill="#5b6b78"
            >
              {name}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r="10" fill={INK} />
      <Caption text={art.label} y={336} />
    </>
  )
}

// A shape and its mirror image, either side of a dashed line of symmetry.
function Symmetry({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'symmetry' }> }) {
  const half = {
    butterfly:
      'M320 170C300 90 200 60 180 110C165 150 230 170 320 175C230 185 175 220 200 255C230 290 300 240 320 180Z',
    house: 'M320 90L210 160V280H320Z',
    leaf: 'M320 60C250 110 230 210 320 290Z',
  }[art.shape]
  const tone = { butterfly: '#e8a317', house: '#d9412f', leaf: '#3f9e7c' }[
    art.shape
  ]
  return (
    <>
      <Paper id={id} />
      <g filter={`url(#${id}shadow)`}>
        <path d={half} fill={tone} />
        <path
          d={half}
          fill={tone}
          transform="translate(640 0) scale(-1 1)"
          opacity=".85"
        />
      </g>
      <line
        x1="320"
        y1="36"
        x2="320"
        y2="300"
        stroke={INK}
        strokeWidth="4"
        strokeDasharray="12 9"
      />
      <Caption
        text={art.label ?? 'Fold along the dashed line: both halves match.'}
        y={330}
      />
    </>
  )
}

function Area({ id, art }: P & { art: Extract<Art, { kind: 'area' }> }) {
  const size = Math.min(500 / art.cols, 240 / art.rows, 60)
  const left = 320 - (art.cols * size) / 2
  const top = 150 - (art.rows * size) / 2
  return (
    <>
      <Paper id={id} />
      {Array.from({ length: art.rows * art.cols }, (_, i) => (
        <rect
          key={i}
          x={left + (i % art.cols) * size}
          y={top + Math.floor(i / art.cols) * size}
          width={size}
          height={size}
          fill={
            art.shaded === undefined || i < art.shaded ? '#9fd8c6' : '#ffffff'
          }
          stroke="#38806b"
          strokeWidth={size > 20 ? 2 : 1}
        />
      ))}
      <Caption
        text={
          art.label ??
          `${art.rows} × ${art.cols} = ${art.rows * art.cols} square units`
        }
        y={318}
      />
    </>
  )
}

function FractionLine({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'fractionLine' }> }) {
  const at = (k: number) => 80 + (480 * k) / art.parts
  return (
    <>
      <Paper id={id} />
      <path
        d="M80 180H560"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {Array.from({ length: art.parts + 1 }, (_, k) => (
        <g key={k}>
          <line
            x1={at(k)}
            y1="166"
            x2={at(k)}
            y2="194"
            stroke={INK}
            strokeWidth="3"
          />
          <text
            x={at(k)}
            y="226"
            textAnchor="middle"
            fontSize={k === 0 || k === art.parts ? 24 : 17}
            fontWeight="700"
            fill={INK}
          >
            {k === 0 ? '0' : k === art.parts ? '1' : `${k}/${art.parts}`}
          </text>
        </g>
      ))}
      <circle cx={at(art.mark)} cy="180" r="13" fill="#d9412f" />
      <path
        d={`M80 150H${at(art.mark)}`}
        stroke="#d9412f"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <Caption text={art.label ?? `${art.mark}/${art.parts}`} y={300} />
    </>
  )
}

function Bars({ id, art }: P & { art: Extract<Art, { kind: 'bars' }> }) {
  const most = Math.max(...art.rows.map(([, v]) => v), 1)
  const w = 480 / art.rows.length
  return (
    <>
      <Paper id={id} />
      <path d="M80 40V260H580" fill="none" stroke={INK} strokeWidth="3" />
      {art.rows.map(([name, value], i) => {
        const h = (value / most) * 190
        const x = 90 + i * w + w * 0.18
        return (
          <g key={name}>
            <rect
              x={x}
              y={260 - h}
              width={w * 0.64}
              height={h}
              fill={SHAPE_TONES[i % 6]}
              filter={`url(#${id}shadow)`}
            />
            <text
              x={x + w * 0.32}
              y={252 - h}
              textAnchor="middle"
              fontSize="18"
              fontWeight="800"
              fill={INK}
            >
              {value}
            </text>
            <text
              x={x + w * 0.32}
              y="284"
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill={INK}
            >
              {name}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={330} />
    </>
  )
}

function DoubleBars({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'doubleBars' }> }) {
  const most = Math.max(...art.rows.flatMap(([, a, b]) => [a, b]), 1)
  const w = 460 / art.rows.length
  const tones = ['#e45d4b', '#3f86c1']
  return (
    <>
      <Paper id={id} />
      <path d="M80 70V260H580" fill="none" stroke={INK} strokeWidth="3" />
      {art.keys.map((key, k) => (
        <g key={key}>
          <rect
            x={120 + k * 220}
            y="22"
            width="22"
            height="22"
            rx="4"
            fill={tones[k]}
          />
          <text
            x={150 + k * 220}
            y="40"
            fontSize="18"
            fontWeight="700"
            fill={INK}
          >
            {key}
          </text>
        </g>
      ))}
      {art.rows.map(([name, ...values], i) => (
        <g key={name}>
          {values.map((value, k) => {
            const h = (value / most) * 165
            const x = 96 + i * w + w * 0.12 + k * w * 0.38
            return (
              <g key={k}>
                <rect
                  x={x}
                  y={260 - h}
                  width={w * 0.36}
                  height={h}
                  fill={tones[k]}
                  filter={`url(#${id}shadow)`}
                />
                <text
                  x={x + w * 0.18}
                  y={252 - h}
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="800"
                  fill={INK}
                >
                  {value}
                </text>
              </g>
            )
          })}
          <text
            x={96 + i * w + w * 0.5}
            y="284"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill={INK}
          >
            {name}
          </text>
        </g>
      ))}
      <Caption text={art.label} y={330} />
    </>
  )
}

// A place-value table: headings above, one digit in each column.
function PlaceValue({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'placeValue' }> }) {
  const w = Math.min(540 / art.places.length, 110)
  const left = 320 - (w * art.places.length) / 2
  return (
    <>
      <Paper id={id} />
      {art.places.map(([name, digit], i) => (
        <g key={i}>
          <rect
            x={left + i * w + 3}
            y="60"
            width={w - 6}
            height="56"
            rx="10"
            fill={SHAPE_TONES[i % 6]}
          />
          <text
            x={left + i * w + w / 2}
            y="96"
            textAnchor="middle"
            fontSize={name.length > 5 ? 15 : 20}
            fontWeight="800"
            fill="#fff"
          >
            {name}
          </text>
          <rect
            x={left + i * w + 3}
            y="124"
            width={w - 6}
            height="110"
            rx="10"
            fill="#fffdf8"
            stroke="#d6dee5"
            strokeWidth="2"
          />
          <text
            x={left + i * w + w / 2}
            y="200"
            textAnchor="middle"
            fontSize={digit.length > 2 ? 40 : 58}
            fontWeight="800"
            fill={INK}
          >
            {digit}
          </text>
        </g>
      ))}
      <Caption text={art.label} y={300} />
    </>
  )
}

// Splits off the smallest prime factor at each step, until a prime is left.
function FactorTree({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'factorTree' }> }) {
  const splits: Array<[number, number]> = []
  for (let n = art.n; ;) {
    const p = [2, 3, 5, 7].find((q) => n % q === 0 && n !== q)
    if (!p) break
    splits.push([p, n / p])
    n /= p
  }
  const step = Math.min(64, 215 / Math.max(splits.length, 1))
  const dx = Math.min(62, 260 / Math.max(splits.length, 1))
  const x0 = 320 - (splits.length * dx) / 2
  const primes = [...splits.map(([p]) => p), splits.at(-1)?.[1] ?? art.n]
  const node = (x: number, y: number, n: number, prime: boolean) => (
    <g key={`${x}-${y}`}>
      <circle
        cx={x}
        cy={y}
        r="24"
        fill={prime ? '#d9412f' : '#fffdf8'}
        stroke={prime ? '#a52f22' : '#8b99a7'}
        strokeWidth="3"
      />
      <text
        x={x}
        y={y + 8}
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill={prime ? '#fff' : INK}
      >
        {n}
      </text>
    </g>
  )
  return (
    <>
      <Paper id={id} />
      {splits.map(([p, rest], i) => {
        const x = x0 + i * dx
        const y = 40 + i * step
        const last = i === splits.length - 1
        return (
          <g key={i}>
            <path
              d={`M${x} ${y}L${x - dx} ${y + step}M${x} ${y}L${x + dx} ${y + step}`}
              stroke="#8b99a7"
              strokeWidth="3"
            />
            {node(x - dx, y + step, p, true)}
            {node(x + dx, y + step, rest, last)}
          </g>
        )
      })}
      {node(x0, 40, art.n, splits.length === 0)}
      <Caption text={art.label ?? `${art.n} = ${primes.join(' × ')}`} y={322} />
    </>
  )
}

// A box built from unit cubes, drawn in isometric view.
function Cubes({ id, art }: P & { art: Extract<Art, { kind: 'cubes' }> }) {
  const { length: L, width: W, height: H } = art
  const s = Math.min(500 / ((L + W) * 0.866), 250 / ((L + W) * 0.5 + H), 46)
  const ox = 320 - ((L - W) / 2) * s * 0.866
  const oy = 160 - ((L + W) * 0.5 * s - H * s) / 2
  const at = (a: number, b: number, c: number) =>
    `${ox + (a - b) * s * 0.866},${oy + (a + b) * s * 0.5 - c * s}`
  const cubes = []
  for (let i = 0; i < L; i++)
    for (let j = 0; j < W; j++)
      for (let k = 0; k < H; k++) cubes.push([i, j, k] as const)
  cubes.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]))
  return (
    <>
      <Paper id={id} />
      <g stroke="#2f6f5b" strokeWidth={s > 24 ? 1.5 : 1} strokeLinejoin="round">
        {cubes.map(([i, j, k]) => (
          <g key={`${i}${j}${k}`}>
            <polygon
              points={`${at(i, j, k + 1)} ${at(i + 1, j, k + 1)} ${at(i + 1, j + 1, k + 1)} ${at(i, j + 1, k + 1)}`}
              fill="#c8eadc"
            />
            <polygon
              points={`${at(i + 1, j, k)} ${at(i + 1, j + 1, k)} ${at(i + 1, j + 1, k + 1)} ${at(i + 1, j, k + 1)}`}
              fill="#5aa98f"
            />
            <polygon
              points={`${at(i, j + 1, k)} ${at(i + 1, j + 1, k)} ${at(i + 1, j + 1, k + 1)} ${at(i, j + 1, k + 1)}`}
              fill="#8fcab3"
            />
          </g>
        ))}
      </g>
      <Caption
        text={art.label ?? `${L} × ${W} × ${H} = ${L * W * H} cubes`}
        y={330}
      />
    </>
  )
}

const TONES = {
  red: '#e45d4b',
  blue: '#3f86c1',
  yellow: '#f0b64a',
  green: '#3f9e7c',
}

// A spinner with equal sectors and a pointer.
function Spinner({ id, art }: P & { art: Extract<Art, { kind: 'spinner' }> }) {
  const cx = 320
  const cy = 160
  const r = 120
  const n = art.sectors.length
  return (
    <>
      <Paper id={id} />
      <circle
        cx={cx}
        cy={cy}
        r={r + 8}
        fill="#f6f1e4"
        filter={`url(#${id}shadow)`}
      />
      {art.sectors.map((tone, i) => {
        const [x1, y1] = polar(cx, cy, r, i / n)
        const [x2, y2] = polar(cx, cy, r, (i + 1) / n)
        return (
          <path
            key={i}
            d={`M${cx} ${cy}L${x1} ${y1}A${r} ${r} 0 ${n === 1 ? 1 : 0} 1 ${x2} ${y2}Z`}
            fill={TONES[tone]}
            stroke="#fffdf8"
            strokeWidth="3"
          />
        )
      })}
      {art.numbered &&
        art.sectors.map((_, i) => {
          const [x, y] = polar(cx, cy, r * 0.7, (i + 0.5) / n)
          return (
            <text
              key={i}
              x={x}
              y={y + 10}
              textAnchor="middle"
              fontSize="28"
              fontWeight="800"
              fill="#fff"
              stroke="#00000055"
              strokeWidth=".6"
            >
              {i + 1}
            </text>
          )
        })}
      <line
        x1={cx}
        y1={cy}
        x2={polar(cx, cy, 96, 0.12)[0]}
        y2={polar(cx, cy, 96, 0.12)[1]}
        stroke={INK}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="13" fill={INK} />
      <Caption text={art.label} y={330} />
    </>
  )
}

// A flag shape on squared paper and its mirror image, or the shape slid
// 6 squares right and 1 down.
function Reflect({ id, art }: P & { art: Extract<Art, { kind: 'reflect' }> }) {
  const size = 38
  const left = 320 - 6 * size
  const top = 40
  const slide = art.move === 'translate'
  const image = ([c, r]: [number, number]): [number, number] =>
    slide ? [c + 6, r + 1] : [11 - c, r]
  const cells: Array<[number, number]> = slide
    ? [
        [1, 1],
        [1, 2],
        [2, 2],
        [3, 2],
        [1, 3],
      ]
    : [
        [2, 0],
        [2, 1],
        [3, 1],
        [2, 2],
        [3, 2],
        [4, 2],
        [2, 3],
        [2, 4],
        [2, 5],
      ]
  return (
    <>
      <Paper id={id} />
      {Array.from({ length: 72 }, (_, i) => (
        <rect
          key={i}
          x={left + (i % 12) * size}
          y={top + Math.floor(i / 12) * size}
          width={size}
          height={size}
          fill="#ffffff"
          stroke="#d6dee5"
        />
      ))}
      {cells.map(([c, r]) => (
        <g key={`${c}-${r}`}>
          <rect
            x={left + c * size}
            y={top + r * size}
            width={size}
            height={size}
            fill="#e45d4b"
            stroke="#a52f22"
          />
          <rect
            x={left + image([c, r])[0] * size}
            y={top + image([c, r])[1] * size}
            width={size}
            height={size}
            fill="#3f86c1"
            stroke="#2a5d88"
          />
        </g>
      ))}
      {slide ? (
        <g stroke={INK} strokeWidth="4" fill={INK}>
          <line
            x1={left + 1.5 * size}
            y1={top + 1.5 * size}
            x2={left + 7.5 * size - 14}
            y2={top + 2.5 * size - 2}
          />
          <polygon
            stroke="none"
            points={`${left + 7.5 * size},${top + 2.5 * size} ${left + 7.5 * size - 20},${top + 2.5 * size - 13} ${left + 7.5 * size - 23},${top + 2.5 * size + 6}`}
          />
        </g>
      ) : (
        <line
          x1="320"
          y1={top - 12}
          x2="320"
          y2={top + 6 * size + 12}
          stroke={INK}
          strokeWidth="4"
          strokeDasharray="10 7"
        />
      )}
      <Caption
        text={
          art.label ??
          (slide
            ? '6 squares right, 1 square down'
            : 'The mirror line is dashed')
        }
        y={330}
      />
    </>
  )
}

// Whole numbers from `from` to `to`, with some marked in red.
function NumberLine({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'numberLine' }> }) {
  const span = art.to - art.from
  const at = (n: number) => 60 + ((n - art.from) / span) * 520
  const marks = new Set(art.marks)
  return (
    <>
      <Paper id={id} />
      <path
        d="M44 180H596"
        stroke={INK}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {Array.from({ length: span + 1 }, (_, k) => {
        const n = art.from + k
        const marked = marks.has(n)
        return (
          <g key={n}>
            <line
              x1={at(n)}
              y1="168"
              x2={at(n)}
              y2="192"
              stroke={INK}
              strokeWidth={n === 0 ? 4 : 2.5}
            />
            <text
              x={at(n)}
              y="224"
              textAnchor="middle"
              fontSize={span > 12 ? 15 : 19}
              fontWeight={marked || n === 0 ? 800 : 600}
              fill={marked ? '#d9412f' : INK}
            >
              {n < 0 ? `−${-n}` : n}
            </text>
            {marked && <circle cx={at(n)} cy="180" r="11" fill="#d9412f" />}
          </g>
        )
      })}
      <Caption text={art.label} y={300} />
    </>
  )
}

function LineGraph({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'lineGraph' }> }) {
  const most = Math.max(...art.points.map(([, v]) => v), 1)
  const step = 470 / Math.max(art.points.length - 1, 1)
  const xy = art.points.map(
    ([, v], i) => [100 + i * step, 260 - (v / most) * 190] as const,
  )
  return (
    <>
      <Paper id={id} />
      <path d="M80 40V260H590" fill="none" stroke={INK} strokeWidth="3" />
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1="80"
          y1={260 - f * 190}
          x2="590"
          y2={260 - f * 190}
          stroke="#d6dee5"
        />
      ))}
      <polyline
        points={xy.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none"
        stroke="#3f86c1"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {art.points.map(([name, value], i) => (
        <g key={name}>
          <circle
            cx={xy[i]![0]}
            cy={xy[i]![1]}
            r="8"
            fill="#e45d4b"
            stroke="#fff"
            strokeWidth="2"
          />
          <text
            x={xy[i]![0]}
            y={xy[i]![1] - 16}
            textAnchor="middle"
            fontSize="17"
            fontWeight="800"
            fill={INK}
          >
            {value}
          </text>
          <text
            x={xy[i]![0]}
            y="286"
            textAnchor="middle"
            fontSize="16"
            fontWeight="700"
            fill={INK}
          >
            {name}
          </text>
        </g>
      ))}
      <Caption text={art.label} y={330} />
    </>
  )
}

// The flat pattern that folds into a box or a triangular prism.
function Net({ id, art }: P & { art: Extract<Art, { kind: 'net' }> }) {
  const face = (x: number, y: number, w: number, h: number, i: number) => (
    <rect
      key={`${x}-${y}`}
      x={x}
      y={y}
      width={w}
      height={h}
      fill={SHAPE_TONES[i % 6]}
      fillOpacity=".55"
      stroke={INK}
      strokeWidth="2.5"
    />
  )
  const parts =
    art.solid === 'box'
      ? [
          face(192, 118, 64, 80, 0),
          face(256, 118, 64, 80, 1),
          face(320, 118, 64, 80, 2),
          face(384, 118, 64, 80, 3),
          face(256, 38, 64, 80, 4),
          face(256, 198, 64, 80, 5),
        ]
      : [
          face(200, 99, 80, 110, 0),
          face(280, 99, 80, 110, 1),
          face(360, 99, 80, 110, 2),
          <polygon
            key="top"
            points="280,99 360,99 320,30"
            fill={SHAPE_TONES[3]}
            fillOpacity=".55"
            stroke={INK}
            strokeWidth="2.5"
          />,
          <polygon
            key="bottom"
            points="280,209 360,209 320,278"
            fill={SHAPE_TONES[4]}
            fillOpacity=".55"
            stroke={INK}
            strokeWidth="2.5"
          />,
        ]
  return (
    <>
      <Paper id={id} />
      <g filter={`url(#${id}shadow)`}>{parts}</g>
      <Caption
        text={
          art.label ??
          (art.solid === 'box'
            ? 'A net of a box: 6 rectangles'
            : 'A net of a triangular prism: 3 rectangles, 2 triangles')
        }
        y={326}
      />
    </>
  )
}

function Ratio({ id, art }: P & { art: Extract<Art, { kind: 'ratio' }> }) {
  const gap = 230 / Math.max(art.parts.length, 1)
  const top = 160 - ((art.parts.length - 1) * gap) / 2
  return (
    <>
      <Paper id={id} />
      {art.parts.map(([name, count], i) => (
        <g key={name}>
          <text
            x="60"
            y={top + i * gap + 8}
            fontSize="22"
            fontWeight="800"
            fill={INK}
          >
            {name}
          </text>
          {Array.from({ length: count }, (_, k) => (
            <Cap
              key={k}
              id={id}
              x={210 + k * 42}
              y={top + i * gap}
              r={17}
              tone={i}
            />
          ))}
        </g>
      ))}
      <Caption text={art.label} y={326} />
    </>
  )
}

// The natural world: sky and sun, hills, trees, a river with fish, birds,
// a goat and two people. Used for creation and the environment.
function Nature({ id, art }: P & { art: Extract<Art, { kind: 'nature' }> }) {
  const tree = (x: number, s: number) => (
    <g key={x} transform={`translate(${x} ${200 - 60 * s}) scale(${s})`}>
      <rect x="-6" y="40" width="12" height="60" fill="#7a4a2b" />
      <circle cx="0" cy="30" r="34" fill="#3f9e5a" />
      <circle cx="-22" cy="44" r="22" fill="#4caf63" />
      <circle cx="22" cy="44" r="22" fill="#38914f" />
    </g>
  )
  return (
    <>
      <linearGradient id={`${id}natsky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8ecdf0" />
        <stop offset="1" stopColor="#e9f6fc" />
      </linearGradient>
      <rect width="640" height="360" fill={`url(#${id}natsky)`} />
      <circle cx="540" cy="70" r="38" fill="#f6c443" />
      <circle cx="540" cy="70" r="52" fill="#f6c443" opacity=".25" />
      {(
        [
          [120, 70],
          [160, 58],
          [205, 80],
        ] as Array<[number, number]>
      ).map(([x, y]) => (
        <path
          key={x}
          d={`M${x - 12} ${y}q6 -8 12 0q6 -8 12 0`}
          fill="none"
          stroke="#35505f"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <path d="M0 210Q120 120 250 200T520 180T640 200V360H0Z" fill="#9ccf7a" />
      <path d="M0 240Q160 200 330 236T640 232V360H0Z" fill="#7dbb5c" />
      <path
        d="M0 300Q170 268 330 292T640 284V330Q470 314 330 334T0 336Z"
        fill="#5aa7d8"
      />
      {(
        [
          [210, 304],
          [430, 300],
        ] as Array<[number, number]>
      ).map(([x, y]) => (
        <path
          key={x}
          d={`M${x} ${y}q14 -8 26 0q-12 8 -26 0Zm26 0l8 -6v12Z`}
          fill="#f08a3c"
        />
      ))}
      {tree(70, 1)}
      {tree(470, 0.8)}
      {tree(590, 1.05)}
      <g transform="translate(330 222)">
        <ellipse cx="0" cy="0" rx="28" ry="15" fill="#f4efe6" />
        <circle cx="28" cy="-10" r="10" fill="#f4efe6" />
        <path
          d="M-18 12v14M-6 12v14M8 12v14M18 12v14"
          stroke="#6b5a48"
          strokeWidth="4"
        />
      </g>
      {/* People at a distance, standing on the grass. */}
      <g transform="translate(140 104) scale(0.52)">
        <Person id={id} figure={{ pose: 'walk', x: 0, kit: 1 }} />
        <Person id={id} figure={{ pose: 'stand', x: 80, kit: 3, facing: -1 }} />
      </g>
      <Caption text={art.label} y={350} />
    </>
  )
}

// Three places of worship in Ghana, each with its usual symbol.
function Worship({ id, art }: P & { art: Extract<Art, { kind: 'worship' }> }) {
  const places = [
    ['church', 'Church', 110],
    ['mosque', 'Mosque', 320],
    ['shrine', 'Shrine', 530],
  ] as const
  return (
    <>
      <Paper id={id} />
      <rect y="250" width="640" height="110" fill="#e8d6b8" />
      {places.map(([kind, name, x]) => {
        const lit = !art.focus || art.focus === kind
        return (
          <g key={kind} opacity={lit ? 1 : 0.35} filter={`url(#${id}shadow)`}>
            {kind === 'church' && (
              <g>
                <rect
                  x={x - 60}
                  y="150"
                  width="120"
                  height="100"
                  fill="#f4f1ea"
                  stroke="#c9bfae"
                />
                <path
                  d={`M${x - 70} 152L${x} 104L${x + 70} 152Z`}
                  fill="#b5523b"
                />
                <rect
                  x={x - 16}
                  y="76"
                  width="32"
                  height="40"
                  fill="#f4f1ea"
                  stroke="#c9bfae"
                />
                <path
                  d={`M${x} 46v30M${x - 10} 56h20`}
                  stroke="#8b6b2e"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d={`M${x - 16} 250v-44a16 16 0 0 1 32 0v44Z`}
                  fill="#7a4a2b"
                />
              </g>
            )}
            {kind === 'mosque' && (
              <g>
                <rect
                  x={x - 62}
                  y="160"
                  width="124"
                  height="90"
                  fill="#f4f1ea"
                  stroke="#c9bfae"
                />
                <path d={`M${x - 44} 162a44 44 0 0 1 88 0Z`} fill="#3f9e7c" />
                <rect
                  x={x + 72}
                  y="92"
                  width="18"
                  height="158"
                  fill="#f4f1ea"
                  stroke="#c9bfae"
                />
                <path d={`M${x + 70} 94l11 -18l11 18Z`} fill="#3f9e7c" />
                <path
                  d={`M${x + 86} 62a9 9 0 1 1 -2 -14a7 7 0 1 0 2 14Z`}
                  fill="#d9a520"
                />
                <path
                  d={`M${x - 14} 250v-40a14 14 0 0 1 28 0v40Z`}
                  fill="#7a4a2b"
                />
              </g>
            )}
            {kind === 'shrine' && (
              <g>
                <ellipse cx={x} cy="250" rx="60" ry="6" fill="#00000022" />
                <rect
                  x={x - 46}
                  y="182"
                  width="92"
                  height="68"
                  rx="8"
                  fill="#b9794a"
                />
                <path
                  d={`M${x - 64} 186L${x} 120L${x + 64} 186Z`}
                  fill="#c9a352"
                  stroke="#9c7a33"
                />
                <path
                  d={`M${x - 12} 250v-36a12 12 0 0 1 24 0v36Z`}
                  fill="#5b3a22"
                />
                <path d={`M${x + 48} 250a16 14 0 1 1 30 0Z`} fill="#8a4f2a" />
              </g>
            )}
            <text
              x={x}
              y="292"
              textAnchor="middle"
              fontSize="24"
              fontWeight="800"
              fill={INK}
            >
              {name}
            </text>
          </g>
        )
      })}
      <Caption
        text={art.label ?? 'Christian, Muslim and traditional worship'}
        y={338}
      />
    </>
  )
}

// Two people talking. Each speaks in a bubble on their own side, edged in
// the colour they wear, so a reader can follow who says what.
const BUBBLE_H = 38
function Dialogue({
  id,
  art,
}: P & { art: Extract<Art, { kind: 'dialogue' }> }) {
  const lines = art.lines.slice(0, 4)
  const top = 192 - lines.length * (BUBBLE_H + 8)
  return (
    <>
      <Ground id={id} kind={art.setting ?? 'compound'} />
      {([0, 1] as const).map((who) => (
        <g
          key={who}
          transform={`translate(${who ? 560 : 80} 338) scale(0.62) translate(0 ${-GROUND_Y})`}
        >
          <Person
            id={id}
            figure={{
              pose: 'stand',
              x: 0,
              kit: who ? 2 : 1,
              facing: who ? -1 : 1,
            }}
          />
        </g>
      ))}
      {lines.map((line, i) => {
        const width = Math.min(560, line.text.length * 10.4 + 36)
        const x = line.who ? 620 - width : 20
        const y = top + i * (BUBBLE_H + 8)
        const edge = KITS[line.who ? 2 : 1]![0]
        const tail = line.who ? x + width - 30 : x + 30
        return (
          <g key={i} filter={`url(#${id}shadow)`}>
            <path
              d={`M${tail - 7} ${y + BUBBLE_H - 2}l7 9 7-9Z`}
              fill="#fff"
              stroke={edge}
              strokeWidth="2"
            />
            <rect
              x={x}
              y={y}
              width={width}
              height={BUBBLE_H}
              rx="16"
              fill="#fff"
              stroke={edge}
              strokeWidth="2.5"
            />
            <text
              x={x + width / 2}
              y={y + 26}
              textAnchor="middle"
              fontSize="19"
              fontWeight="600"
              fill="#1f2a44"
            >
              {line.text}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={346} />
    </>
  )
}

// A street of buildings, each with its name on a sign.
const TOWN_COLOURS = ['#f2c48d', '#9fd3c7', '#f4a7a3', '#c3b4e8', '#f7e08a']
function Town({ id, art }: P & { art: Extract<Art, { kind: 'town' }> }) {
  const places = art.places.slice(0, 5)
  const slot = 600 / places.length
  return (
    <>
      <linearGradient id={`${id}townsky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bfe3f5" />
        <stop offset="1" stopColor="#f3f9fc" />
      </linearGradient>
      <rect width="640" height="360" fill={`url(#${id}townsky)`} />
      <rect y="262" width="640" height="14" fill="#c9c2b6" />
      <rect y="276" width="640" height="84" fill="#5d6470" />
      {[40, 160, 280, 400, 520].map((x) => (
        <rect
          key={x}
          x={x}
          y="314"
          width="70"
          height="6"
          rx="3"
          fill="#f4f1e8"
        />
      ))}
      {places.map((name, i) => {
        const w = Math.min(150, slot - 22)
        const h = 120 + (i % 2) * 28
        const x = 20 + i * slot + (slot - w) / 2
        const y = 262 - h
        const lit = art.focus === i
        return (
          <g key={i} filter={`url(#${id}shadow)`}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="4"
              fill={TOWN_COLOURS[i % TOWN_COLOURS.length]}
              stroke={lit ? '#d9412f' : '#7a6a58'}
              strokeWidth={lit ? 5 : 2}
            />
            <path
              d={`M${x - 6} ${y}l${w / 2 + 6} -30 ${w / 2 + 6} 30Z`}
              fill="#8f4a2f"
            />
            <rect
              x={x + w / 2 - 14}
              y={262 - 44}
              width="28"
              height="44"
              rx="3"
              fill="#6b4226"
            />
            <rect
              x={x + 12}
              y={y + 46}
              width="22"
              height="22"
              rx="2"
              fill="#e8f4fb"
            />
            <rect
              x={x + w - 34}
              y={y + 46}
              width="22"
              height="22"
              rx="2"
              fill="#e8f4fb"
            />
            <rect
              x={x + 6}
              y={y + 10}
              width={w - 12}
              height="26"
              rx="5"
              fill="#fff"
            />
            <text
              x={x + w / 2}
              y={y + 29}
              textAnchor="middle"
              fontSize={name.length > 11 ? 13 : 16}
              fontWeight="700"
              fill="#1f2a44"
            >
              {name}
            </text>
          </g>
        )
      })}
      <Caption text={art.label} y={346} />
    </>
  )
}

function Scene({ art, id }: { art: Art; id: string }) {
  switch (art.kind) {
    case 'loaf':
      return <Loaf id={id} art={art} />
    case 'cake':
      return <Cake id={id} art={art} />
    case 'caps':
      return <Caps id={id} art={art} />
    case 'groups':
      return <Groups id={id} art={art} />
    case 'chart':
      return <Chart id={id} art={art} />
    case 'compare':
      return <Compare id={id} art={art} />
    case 'balance':
      return <Balance id={id} art={art} />
    case 'tenframe':
      return <TenFrame id={id} art={art} />
    case 'frame':
      return <Frame id={id} art={art} />
    case 'jumps':
      return <Jumps id={id} art={art} />
    case 'cedis':
      return <Cedis id={id} art={art} />
    case 'pattern':
      return <Pattern id={id} art={art} />
    case 'solids': {
      const w = 600 / art.names.length
      return (
        <>
          <Table id={id} y={190} />
          {art.names.map((name, i) => {
            // Five solids share the table, so each is drawn a little smaller.
            const x = 20 + w * (i + 0.5)
            const scale = art.names.length > 4 ? 0.8 : 1
            return (
              <g
                key={name}
                transform={`translate(${x} 210) scale(${scale}) translate(${-x} -210)`}
              >
                <SolidArt id={id} name={name} x={x} />
              </g>
            )
          })}
        </>
      )
    }
    case 'shapes':
      return <Shapes id={id} art={art} />
    case 'sticks':
      return <Sticks id={id} art={art} />
    case 'measure':
      return <Measure id={id} art={art} />
    case 'fill':
      return <Fill id={id} art={art} />
    case 'bottles':
      return <Bottles id={id} art={art} />
    case 'hands':
      return <Hands id={id} art={art} />
    case 'calendar':
      return <Calendar id={id} art={art} />
    case 'clock':
      return <Clock id={id} art={art} />
    case 'tally':
      return <Tally id={id} art={art} />
    case 'picto':
      return <Picto id={id} art={art} />
    case 'people':
      return <People id={id} art={art} />
    case 'course':
      return <Course id={id} art={art} />
    case 'pulse':
      return <Pulse id={id} art={art} />
    case 'timeline':
      return <Timeline id={id} art={art} />
    case 'sources':
      return <Sources id={id} art={art} />
    case 'building':
      return <Building id={id} art={art} />
    case 'scroll':
      return <Scroll id={id} art={art} />
    case 'family':
      return <Family id={id} art={art} />
    case 'flag':
      return <Flag id={id} art={art} />
    case 'belts':
      return <Belts id={id} art={art} />
    case 'thenNow':
      return <ThenNowArt id={id} art={art} />
    case 'triangle':
      return <Triangle id={id} art={art} />
    case 'cocoa':
      return <Cocoa id={id} art={art} />
    case 'ballot':
      return <Ballot id={id} art={art} />
    case 'goods':
      return <Goods id={id} art={art} />
    case 'coins':
      return <Coins id={id} art={art} />
    case 'grid':
      return <Grid id={id} art={art} />
    case 'angle':
      return <Angle id={id} art={art} />
    case 'ruler':
      return <Ruler id={id} art={art} />
    case 'compass':
      return <Compass id={id} art={art} />
    case 'symmetry':
      return <Symmetry id={id} art={art} />
    case 'area':
      return <Area id={id} art={art} />
    case 'fractionLine':
      return <FractionLine id={id} art={art} />
    case 'bars':
      return <Bars id={id} art={art} />
    case 'repeat':
      return <Repeat id={id} art={art} />
    case 'position':
      return <Position id={id} art={art} />
    case 'doubleBars':
      return <DoubleBars id={id} art={art} />
    case 'placeValue':
      return <PlaceValue id={id} art={art} />
    case 'factorTree':
      return <FactorTree id={id} art={art} />
    case 'cubes':
      return <Cubes id={id} art={art} />
    case 'spinner':
      return <Spinner id={id} art={art} />
    case 'reflect':
      return <Reflect id={id} art={art} />
    case 'numberLine':
      return <NumberLine id={id} art={art} />
    case 'lineGraph':
      return <LineGraph id={id} art={art} />
    case 'net':
      return <Net id={id} art={art} />
    case 'ratio':
      return <Ratio id={id} art={art} />
    case 'nature':
      return <Nature id={id} art={art} />
    case 'worship':
      return <Worship id={id} art={art} />
    case 'dialogue':
      return <Dialogue id={id} art={art} />
    case 'town':
      return <Town id={id} art={art} />
  }
}

export function ExploreArt({
  art,
  alt,
  className,
}: {
  art: Art
  alt: string
  className?: string
}) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg
      viewBox="0 0 640 360"
      role="img"
      aria-label={alt}
      className={className ?? 'w-full rounded-2xl'}
      style={{ fontFamily: 'inherit' }}
    >
      <Defs id={id} />
      <Scene art={art} id={id} />
    </svg>
  )
}
