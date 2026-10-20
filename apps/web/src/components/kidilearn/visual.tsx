import type { Visual } from '#/lib/kidilearn/library'

const tile =
  'rounded-xl border border-teal-200 bg-white px-3 py-2 text-center font-bold text-teal-950'

/** Native, responsive diagrams; never render executable markup from the archive. */
export function QuestionVisual({ visual: v }: { visual: Visual | null }) {
  if (!v) return null
  let drawing
  if (v.type === 'shape') {
    const polygons: Record<string, string> = {
      rectangle: '35,40 185,40 185,125 35,125',
      square: '65,30 155,30 155,120 65,120',
      rhombus: '110,15 180,80 110,145 40,80',
      parallelogram: '70,35 195,35 150,125 25,125',
      trapezoid: '75,35 145,35 190,125 30,125',
      triangle: '110,20 190,130 30,130',
    }
    drawing = (
      <svg
        viewBox="0 0 220 160"
        role="img"
        aria-label="Geometric model matching the question"
        className="mx-auto w-56 max-w-full"
        fill="#ccfbf1"
        stroke="#0f766e"
        strokeWidth="3"
        strokeLinejoin="round"
      >
        {polygons[v.name ?? ''] ? (
          <polygon points={polygons[v.name ?? '']} />
        ) : v.name === 'sphere' ? (
          <>
            <circle cx="110" cy="80" r="55" />
            <ellipse
              cx="110"
              cy="80"
              rx="55"
              ry="18"
              fill="none"
              strokeDasharray="5 4"
            />
          </>
        ) : v.name === 'cylinder' ? (
          <>
            <path d="M60 40V120C60 145 160 145 160 120V40" />
            <ellipse cx="110" cy="40" rx="50" ry="18" />
          </>
        ) : v.name === 'cone' ? (
          <>
            <path d="M110 20L55 125Q110 155 165 125Z" />
            <ellipse cx="110" cy="125" rx="55" ry="17" fill="none" />
          </>
        ) : v.name === 'square pyramid' ? (
          <>
            <path d="M110 15L35 115L115 145L185 105Z" />
            <path
              d="M110 15L115 145M35 115L100 85L185 105M110 15L100 85"
              fill="none"
              strokeDasharray="4 3"
            />
          </>
        ) : (
          <>
            <path d="M40 50L85 20L180 20L180 110L135 140L40 140Z" />
            <path d="M40 50H135V140M135 50L180 20" fill="none" />
          </>
        )}
      </svg>
    )
  }
  if (v.type === 'sequence')
    drawing = (
      <div className="flex flex-wrap justify-center gap-2">
        {v.nums?.map((n, i) => (
          <span key={i} className={tile}>
            {n ?? '?'}
          </span>
        ))}
      </div>
    )
  if (v.type === 'array')
    drawing = (
      <div
        className="mx-auto grid w-fit max-w-full gap-1"
        style={{ gridTemplateColumns: `repeat(${v.cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: (v.rows ?? 1) * (v.cols ?? 1) }, (_, i) => (
          <span key={i} className="size-4 rounded-full bg-teal-500 sm:size-6" />
        ))}
      </div>
    )
  if (v.type === 'fraction')
    drawing = (
      <div className="flex h-16 gap-1">
        {Array.from({ length: v.parts ?? 4 }, (_, i) => (
          <span
            key={i}
            className={`min-w-0 flex-1 rounded-lg border-2 border-teal-600 ${i < (v.filled ?? 1) ? 'bg-teal-500' : 'bg-white'}`}
          />
        ))}
      </div>
    )
  if (['bars', 'graph'].includes(v.type))
    drawing = (
      <div className="space-y-2">
        {v.vals?.map((n, i) => (
          <div
            key={i}
            className="rounded-r-xl bg-teal-600 px-2 py-2 font-bold text-white"
            style={{
              width: `${Math.max(15, (n / Math.max(1, ...v.vals!)) * 100)}%`,
            }}
          >
            {n}
          </div>
        ))}
      </div>
    )
  if (v.type === 'place4' || v.type === 'place')
    drawing = (
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          'Millions',
          'Hundred thousands',
          'Ten thousands',
          'Thousands',
          'Hundreds',
          'Tens',
          'Ones',
        ]
          .slice(-(v.digits ?? (v.type === 'place' ? 3 : 4)))
          .map((label, i, labels) => (
            <div key={label} className={tile}>
              <span className="block text-xs font-normal">{label}</span>
              {Math.floor((v.n ?? 0) / 10 ** (labels.length - 1 - i)) % 10}
            </div>
          ))}
      </div>
    )
  if (v.type === 'money')
    drawing = (
      <div className="flex flex-wrap justify-center gap-2">
        {v.vals?.map((n, i) => (
          <span key={i} className={tile}>
            GH₵{n}
          </span>
        ))}
      </div>
    )
  if (v.type === 'clock')
    drawing = (
      <svg
        viewBox="0 0 160 160"
        className="mx-auto w-44 max-w-full"
        role="img"
        aria-label={`Clock with hour hand at ${v.hour} and minute hand at twelve`}
      >
        <circle
          cx="80"
          cy="80"
          r="74"
          fill="white"
          stroke="#0f766e"
          strokeWidth="4"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const a = ((i + 1) * Math.PI) / 6 - Math.PI / 2
          return (
            <text
              key={i}
              x={80 + 59 * Math.cos(a)}
              y={85 + 59 * Math.sin(a)}
              textAnchor="middle"
              fontSize="14"
            >
              {i + 1}
            </text>
          )
        })}
        <line
          x1="80"
          y1="80"
          x2="80"
          y2="33"
          stroke="#e77938"
          strokeWidth="4"
        />
        <line
          x1="80"
          y1="80"
          x2={80 + 36 * Math.cos(((v.hour ?? 3) * Math.PI) / 6 - Math.PI / 2)}
          y2={80 + 36 * Math.sin(((v.hour ?? 3) * Math.PI) / 6 - Math.PI / 2)}
          stroke="#134e4a"
          strokeWidth="6"
        />
        <circle cx="80" cy="80" r="5" fill="#134e4a" />
      </svg>
    )
  if (v.type === 'angle')
    drawing = (
      <svg
        viewBox="0 0 220 150"
        className="mx-auto w-56 max-w-full"
        role="img"
        aria-label={`${v.degrees} degree angle`}
      >
        <path
          d={`M 190 115 L 110 115 L ${110 + 80 * Math.cos(((v.degrees ?? 90) * Math.PI) / 180)} ${115 - 80 * Math.sin(((v.degrees ?? 90) * Math.PI) / 180)}`}
          fill="none"
          stroke="#0f766e"
          strokeWidth="5"
        />
        <text x="110" y="145" textAnchor="middle" fontSize="18">
          {v.degrees}°
        </text>
      </svg>
    )
  if (v.type === 'rect')
    drawing = (
      <div className="mx-auto flex h-24 max-w-64 items-center justify-center rounded-lg border-4 border-teal-600 bg-white font-bold">
        {v.a} cm × {v.b} cm
      </div>
    )
  if (v.type === 'tally')
    drawing = (
      <div className="flex flex-wrap justify-center gap-3 font-mono text-2xl font-bold">
        {Array.from({ length: Math.ceil((v.n ?? 0) / 5) }, (_, i) => {
          const n = Math.min(5, (v.n ?? 0) - i * 5)
          return (
            <span
              key={i}
              className={n === 5 ? 'line-through decoration-2' : ''}
            >
              {'Ⅰ'.repeat(n === 5 ? 4 : n)}
            </span>
          )
        })}
      </div>
    )
  if (v.type === 'chart')
    drawing = (
      <div className="grid grid-cols-10 gap-0.5 text-center text-[9px] sm:text-xs">
        {Array.from({ length: 30 }, (_, i) => (
          <span key={i} className="rounded bg-white py-2">
            {(v.base ?? 0) + i}
          </span>
        ))}
      </div>
    )
  if (!drawing) return null // The accompanying question includes equivalent text for every diagram.
  return (
    <div className="my-4 min-w-0 rounded-2xl bg-teal-50 p-3 sm:p-5">
      {drawing}
    </div>
  )
}
