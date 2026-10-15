// Artwork for a bus trip page: a side-view coach driving through a scrolling
// landscape (BusRoadScene), a bird's-eye cabin to pick seats in (SeatMap),
// and a small bus that drives off once seats are booked (BusDeparting).
// Motion lives in styles.css ("Bus trip artwork") and stops for visitors who
// prefer reduced motion. Colours are the brand's: navy, cream, butter, gold.
import { Check } from "lucide-react";
import { cn } from "#/lib/utils";

const NAVY = "#041D40";
const CREAM = "#FFEFAA";
const BUTTER = "#FFE27A";
const GOLD = "#F5B814";

// ---- Side view ---------------------------------------------------------------------

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={112} r={19} fill={NAVY} />
      <g className="bus-wheel">
        <circle cx={cx} cy={112} r={14.5} fill="#0f172a" />
        <circle cx={cx} cy={112} r={8} fill="#e2e8f0" />
        {[0, 72, 144, 216, 288].map((a) => (
          <line
            key={a}
            x1={cx}
            y1={112}
            x2={cx + Math.cos((a * Math.PI) / 180) * 7}
            y2={112 + Math.sin((a * Math.PI) / 180) * 7}
            stroke={NAVY}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        ))}
        <circle cx={cx} cy={112} r={2.5} fill={GOLD} />
      </g>
    </g>
  );
}

// A seated passenger's head and shoulders in a window.
const Passenger = ({ x }: { x: number }) => (
  <g fill="#1d4277">
    <circle cx={x} cy={46} r={5} />
    <path d={`M${x - 9} 62 Q${x - 9} 52 ${x} 52 Q${x + 9} 52 ${x + 9} 62 Z`} />
  </g>
);

export function SideBus({ label, className, passengers = [0, 2, 3] }: { label?: string; className?: string; passengers?: Array<number> }) {
  const windows = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 360 140" className={cn("overflow-visible", className)} aria-hidden="true">
      <defs>
        <linearGradient id="bus-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF8D6" />
          <stop offset="1" stopColor={CREAM} />
        </linearGradient>
        <linearGradient id="bus-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#174a8b" />
          <stop offset="1" stopColor={NAVY} />
        </linearGradient>
        <linearGradient id="bus-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={BUTTER} stopOpacity="0.75" />
          <stop offset="1" stopColor={BUTTER} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="bus-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="bus-windows">
          {windows.map((i) => (
            <rect key={i} x={26 + i * 46} y={32} width={40} height={30} rx={5} />
          ))}
          <path d="M296 30 C308 30 316 35 321 44 L334 66 H296 Z" />
        </clipPath>
      </defs>

      {/* Shadow on the road, and the headlight beam (outside the bobbing body). */}
      <ellipse cx={182} cy={132} rx={168} ry={5} fill="#000" opacity={0.28} />
      <path className="bus-beam" d="M346 86 L470 62 L470 116 Z" fill="url(#bus-beam)" />
      {/* Exhaust puffs from the back. */}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="bus-puff" style={{ animationDelay: `${i * 0.45}s` }} cx={6} cy={106} r={5} fill="#cbd5e1" />
      ))}

      <g className="bus-bob">
        {/* Body with a sloping nose. */}
        <path
          d="M26 20 H288 C304 20 318 27 326 40 L344 68 C347 73 348 78 348 84 V100 C348 107 343 112 336 112 H22 C15 112 10 107 10 100 V36 C10 27 17 20 26 20 Z"
          fill="url(#bus-body)"
          stroke={NAVY}
          strokeWidth={3}
        />
        {/* Livery: gold stripe and a navy skirt. */}
        <rect x={11.5} y={70} width={334} height={7} fill={GOLD} />
        <path d="M11.5 92 H346.5 V100 C346.5 106 342 110.5 336 110.5 H22 C16 110.5 11.5 106 11.5 100 Z" fill={NAVY} />
        {label && (
          <text x={140} y={88} textAnchor="middle" fontSize={10} fontWeight={900} letterSpacing={2} fill={NAVY}>
            {label.toUpperCase()}
          </text>
        )}
        {/* Windows with passengers, the windscreen and the door. */}
        {windows.map((i) => (
          <rect key={i} x={26 + i * 46} y={32} width={40} height={30} rx={5} fill="url(#bus-glass)" />
        ))}
        {passengers.map((i) => (
          <Passenger key={i} x={46 + i * 46} />
        ))}
        <path d="M296 30 C308 30 316 35 321 44 L334 66 H296 Z" fill="url(#bus-glass)" />
        <rect x={258} y={30} width={22} height={60} rx={3} fill="url(#bus-glass)" stroke={NAVY} strokeWidth={1.5} />
        <line x1={269} y1={32} x2={269} y2={88} stroke={NAVY} strokeWidth={1.5} />
        {/* A sweep of light across all the glass. */}
        <g clipPath="url(#bus-windows)">
          <rect className="bus-shine" x={-60} y={20} width={50} height={60} fill="url(#bus-shine)" transform="skewX(-20)" />
        </g>
        {/* Lights and mirror. */}
        <circle className="bus-headlight" cx={343} cy={86} r={4.5} fill={BUTTER} />
        <rect x={10} y={80} width={5} height={10} rx={1.5} fill="#e11d48" />
        <rect x={336} y={24} width={6} height={12} rx={2} fill={NAVY} />
      </g>
      <Wheel cx={76} />
      <Wheel cx={298} />
    </svg>
  );
}

// A strip of scenery that scrolls forever: two identical tiles side by side,
// slid left by one tile width.
function Parallax({ className, duration, children }: { className?: string; duration: number; children: React.ReactNode }) {
  return (
    <div className={cn("absolute inset-x-0 flex w-[200%]", className)}>
      <div className="bus-parallax flex w-full" style={{ animationDuration: `${duration}s` }}>
        <div className="w-1/2 shrink-0">{children}</div>
        <div className="w-1/2 shrink-0">{children}</div>
      </div>
    </div>
  );
}

const Palm = ({ x, h = 1 }: { x: number; h?: number }) => (
  <g transform={`translate(${x} ${60 - 60 * h}) scale(${h})`}>
    <path d="M0 60 C2 40 6 24 4 12" stroke="currentColor" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M4 12 C-6 6 -16 8 -22 14 M4 12 C12 4 24 4 30 10 M4 12 C0 2 -8 -4 -16 -4 M4 12 C10 2 18 -2 26 -1 M4 12 C2 4 4 -6 10 -10" stroke="currentColor" strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
);

export function BusRoadScene({ operator, className }: { operator?: string; className?: string }) {
  return (
    <div className={cn("bus-scene relative h-32 overflow-hidden sm:h-36", className)}>
      {/* Far hills and a skyline, slow. */}
      <Parallax className="bottom-12 text-white/[0.07]" duration={60}>
        <svg viewBox="0 0 800 80" preserveAspectRatio="none" className="h-14 w-full">
          <path d="M0 80 V50 Q60 20 120 44 T240 40 T360 30 T480 46 T600 28 T720 44 T800 40 V80 Z" fill="currentColor" />
          {[60, 180, 420, 640].map((x) => (
            <g key={x} fill="currentColor">
              <rect x={x} y={26} width={14} height={54} />
              <rect x={x + 16} y={14} width={10} height={66} />
              <rect x={x + 28} y={34} width={16} height={46} />
            </g>
          ))}
        </svg>
      </Parallax>
      {/* Palms by the roadside, faster. */}
      <Parallax className="bottom-10 text-white/[0.13]" duration={16}>
        <svg viewBox="0 0 800 60" preserveAspectRatio="xMidYMax meet" className="h-12 w-full">
          {[40, 150, 230, 380, 470, 610, 720].map((x, i) => (
            <Palm key={x} x={x} h={0.6 + ((i * 37) % 40) / 100} />
          ))}
        </svg>
      </Parallax>
      {/* The road, with lane markings rushing past. */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-[#0b2346] to-[#06172f]">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-brand-gold/60" />
        <svg className="absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 100 1" aria-hidden="true">
          <line className="bus-road-dash" x1="0" y1="0.5" x2="100" y2="0.5" stroke={CREAM} strokeOpacity={0.55} strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      {/* Speed lines trailing the bus. */}
      <div className="absolute bottom-16 left-[8%] space-y-2 sm:left-[14%]">
        {[0, 1, 2].map((i) => (
          <span key={i} className="bus-speedline block h-0.5 rounded-full bg-brand-cream/50" style={{ width: `${40 - i * 10}px`, animationDelay: `${i * 0.25}s` }} />
        ))}
      </div>
      {/* The coach drives in, then cruises. */}
      {/* Centred by the drive-in animation's end state (translateX(-50%)), see styles.css. */}
      <div className="bus-drive-in absolute bottom-4 left-1/2 w-[230px] sm:w-[270px]">
        <SideBus label={operator} />
      </div>
    </div>
  );
}

// ---- Bird's-eye seat map -----------------------------------------------------------------

function SeatShape({ state }: { state: "free" | "mine" | "taken" | "driver" }) {
  const back = state === "mine" || state === "driver" ? NAVY : state === "taken" ? "#94a3b8" : "#dbe3ef";
  const cushion = state === "mine" ? GOLD : state === "driver" ? "#1d4277" : state === "taken" ? "#cbd5e1" : "#ffffff";
  const edge = state === "mine" || state === "driver" ? NAVY : state === "taken" ? "#94a3b8" : "#9fb0c8";
  return (
    <svg viewBox="0 0 44 48" className="absolute inset-0 size-full" aria-hidden="true">
      <rect x={1.5} y={18} width={6} height={20} rx={3} fill={back} />
      <rect x={36.5} y={18} width={6} height={20} rx={3} fill={back} />
      <rect x={7} y={2} width={30} height={15} rx={7} fill={back} stroke={edge} strokeWidth={1.5} />
      <rect x={5} y={14} width={34} height={30} rx={8} fill={cushion} stroke={edge} strokeWidth={1.5} />
      {state === "taken" && <path d="M12 22 L32 38 M32 22 L12 38" stroke="#94a3b8" strokeWidth={2} strokeLinecap="round" opacity={0.6} />}
    </svg>
  );
}

function Seat({ n, state, delay, onToggle }: { n: number; state: "free" | "mine" | "taken"; delay: number; onToggle: () => void }) {
  return (
    <button
      type="button"
      disabled={state === "taken"}
      onClick={onToggle}
      aria-label={`Seat ${n}${state === "taken" ? " (taken)" : ""}`}
      aria-pressed={state === "mine"}
      title={state === "taken" ? `Seat ${n} is taken` : `Seat ${n}`}
      className={cn(
        "bus-seat relative h-12 w-11 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
        state === "taken" ? "cursor-not-allowed" : "cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105",
        state === "mine" && "bus-seat-picked",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <SeatShape state={state} />
      <span className={cn("relative top-1.5 text-xs font-black", state === "mine" ? "text-primary" : state === "taken" ? "text-slate-500" : "text-primary/80")}>{n}</span>
      {state === "mine" && (
        <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-brand-cream shadow ring-2 ring-white">
          <Check className="size-2.5" strokeWidth={4} />
        </span>
      )}
    </button>
  );
}

function SteeringWheel() {
  return (
    <svg viewBox="0 0 32 32" className="bus-steer size-8 text-primary" aria-hidden="true">
      <circle cx={16} cy={16} r={13} fill="none" stroke="currentColor" strokeWidth={3} />
      <circle cx={16} cy={16} r={3.5} fill="currentColor" />
      <path d="M16 19.5 V29 M12.6 15 L3.5 13 M19.4 15 L28.5 13" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

// 2 + aisle + 2 rows, numbered left to right from the front. Ghana drives on
// the right, so the driver sits front-left and the door is front-right.
export function SeatMap({
  total,
  taken,
  selected,
  onToggle,
}: {
  total: number;
  taken: Set<number>;
  selected: Array<number>;
  onToggle: (n: number) => void;
}) {
  const rows = Math.ceil(total / 4);
  return (
    <div className="relative mx-auto w-fit px-4">
      {/* Mirrors and wheels outside the shell. */}
      <span className="absolute top-12 -left-0.5 h-7 w-3 rounded-l-md bg-slate-300 shadow-inner" />
      <span className="absolute top-12 -right-0.5 h-7 w-3 rounded-r-md bg-slate-300 shadow-inner" />
      {[
        "top-[17%]",
        "bottom-[13%]",
      ].map((pos) => (
        <span key={pos}>
          <span className={cn("absolute left-1.5 h-16 w-3 rounded-full bg-slate-800 shadow", pos)} />
          <span className={cn("absolute right-1.5 h-16 w-3 rounded-full bg-slate-800 shadow", pos)} />
        </span>
      ))}

      <div className="relative rounded-t-[64px] rounded-b-[30px] bg-gradient-to-b from-white to-slate-50 px-5 pt-4 pb-5 shadow-[0_30px_60px_-28px_rgb(4_29_64/0.45)] ring-[6px] ring-slate-200">
        {/* Headlights. */}
        <span className="bus-cabin-light absolute -top-1.5 left-9 h-2.5 w-7 rounded-full bg-brand-butter" />
        <span className="bus-cabin-light absolute -top-1.5 right-9 h-2.5 w-7 rounded-full bg-brand-butter" />
        {/* Windscreen. */}
        <div className="relative mx-2 h-7 overflow-hidden rounded-t-[48px] rounded-b-md bg-gradient-to-b from-sky-200 to-sky-100">
          <span className="bus-windscreen-glint absolute inset-y-0 w-10 -skew-x-12 bg-white/70" />
        </div>
        {/* Driver (front-left) and door (front-right). */}
        <div className="mt-3 flex items-end justify-between gap-6 border-b-2 border-dashed border-slate-200 pb-3">
          {/* Steering wheel in front of the driver's seat, both on the far left. */}
          <div className="flex flex-col items-center">
            <SteeringWheel />
            <div className="relative mt-1 h-12 w-11">
              <SeatShape state="driver" />
            </div>
            <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Driver</span>
          </div>
          <div className="flex h-12 w-14 flex-col items-center justify-center rounded-lg border-2 border-dashed border-brand-gold/70 bg-brand-cream/40 text-[10px] font-bold tracking-wider text-primary uppercase">
            Door
            <span className="mt-0.5 h-1 w-6 rounded-full bg-brand-gold" />
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex items-center gap-2">
              {[1, 2, 0, 3, 4].map((pos) => {
                if (pos === 0)
                  return (
                    <span key="aisle" className="w-8 text-center text-[9px] font-bold text-slate-300 tabular-nums">
                      {r + 1}
                    </span>
                  );
                const n = r * 4 + pos;
                if (n > total) return <span key={pos} className="h-12 w-11" />;
                const state = taken.has(n) ? "taken" : selected.includes(n) ? "mine" : "free";
                return <Seat key={pos} n={n} state={state} delay={r * 55 + pos * 18} onToggle={() => onToggle(n)} />;
              })}
            </div>
          ))}
        </div>

        {/* Engine grille at the back. */}
        <div className="mt-5 flex justify-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1 w-6 rounded-full bg-slate-200" />
          ))}
        </div>
        <span className="absolute -bottom-1.5 left-8 h-2 w-5 rounded-full bg-rose-500/80" />
        <span className="absolute right-8 -bottom-1.5 h-2 w-5 rounded-full bg-rose-500/80" />
      </div>
    </div>
  );
}

// Booked: a small coach drives across and away.
export function BusDeparting({ operator }: { operator?: string }) {
  return (
    <div className="bus-scene relative h-20 overflow-hidden rounded-xl bg-gradient-to-b from-sky-50 to-white">
      <div className="absolute inset-x-0 bottom-3 h-px bg-slate-300" />
      <div className="bus-depart absolute bottom-3 w-32">
        <SideBus label={operator} passengers={[0, 1, 2, 3, 4]} />
      </div>
    </div>
  );
}
