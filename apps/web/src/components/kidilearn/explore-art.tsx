import { useId } from 'react'
import type {
  Art,
  Figure,
  Pose,
  Shape,
  Solid,
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
  const perRow = Math.ceil(Math.sqrt(art.groups + (left ? 1 : 0)) * 1.6)
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
  const near = new Map([
    [art.focus - 10, 'above'],
    [art.focus + 10, 'below'],
    [art.focus - 1, 'left'],
    [art.focus + 1, 'right'],
  ])
  return (
    <>
      <Paper id={id} />
      {Array.from({ length: 50 }, (_, i) => {
        const n = art.start + i
        const x = 44 + (i % 10) * 56
        const y = 30 + Math.floor(i / 10) * 60
        const focus = n === art.focus
        const by = near.has(n)
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
  const tilt = art.equal
    ? 0
    : sideValue(art.left) > sideValue(art.right)
      ? -7
      : 7
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
            y="178"
            textAnchor="middle"
            fontSize="33"
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
  }[name]
  const c = {
    cube: ['#f0b64a', '#d9962b', '#b07418'],
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
  const heads = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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

function Clock({ id, art }: P & { art: Extract<Art, { kind: 'clock' }> }) {
  const cx = 320
  const cy = 160
  const [hx, hy] = polar(cx, cy, 72, (art.hour % 12) / 12)
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
            fontSize="28"
            fontWeight="700"
            fill={INK}
          >
            {i + 1}
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
        x2={cx}
        y2={cy - 82}
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
          {art.names.map((name, i) => (
            <SolidArt key={name} id={id} name={name} x={20 + w * (i + 0.5)} />
          ))}
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
