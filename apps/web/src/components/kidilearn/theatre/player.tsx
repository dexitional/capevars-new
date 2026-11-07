import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import {
  Captions,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react'
import {
  boardSeconds,
  checkCount,
  sceneSeconds,
  speakable,
} from '#/lib/kidilearn/storyboard'
import type { Storyboard } from '#/lib/kidilearn/storyboard'
import { CheckPanel } from './checks'
import type { Marker } from './checks'
import { Mascot } from './mascot'
import { Narrator } from './narrator'
import type { VoiceMode } from './narrator'
import { SceneView } from './scenes'
import './theatre.css'

type Status = 'start' | 'playing' | 'paused' | 'check' | 'done'
type Result = { correct: boolean | null; tries: number }
const SPEEDS = [0.75, 1, 1.25, 1.5]

function readSaved(id: string) {
  try {
    const raw = localStorage.getItem(`kidi-theatre:${id}`)
    return raw ? (JSON.parse(raw) as { scene: number }) : null
  } catch {
    return null
  }
}
function writeSaved(id: string, scene: number | null) {
  try {
    if (scene === null) localStorage.removeItem(`kidi-theatre:${id}`)
    else localStorage.setItem(`kidi-theatre:${id}`, JSON.stringify({ scene }))
  } catch {
    // Only a convenience: the lesson still works from the beginning.
  }
}

export function LessonTheatre({
  board,
  marker,
  onFinish,
  finishLabel,
}: {
  board: Storyboard
  marker?: Marker
  onFinish?: () => void
  finishLabel?: string
}) {
  const [status, setStatus] = useState<Status>('start')
  const [sceneIndex, setSceneIndex] = useState(0)
  const [beat, setBeat] = useState(0)
  const [fraction, setFraction] = useState(0)
  const [results, setResults] = useState<Record<string, Result>>({})
  const [returnTo, setReturnTo] = useState<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [captions, setCaptions] = useState(true)
  const [voice, setVoice] = useState<VoiceMode | null>(null)
  const [talking, setTalking] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [saved, setSaved] = useState<number | null>(null)
  const narrator = useRef<Narrator | null>(null)
  const frame = useRef<HTMLDivElement>(null)
  if (!narrator.current && typeof window !== 'undefined')
    narrator.current = new Narrator()
  const scene = board.scenes[sceneIndex]!
  const band = board.band
  const kindBeat = scene.beats[Math.min(beat, scene.beats.length - 1)]!
  const step =
    status === 'check'
      ? 99
      : (kindBeat.show ?? Math.min(beat, scene.beats.length - 1))

  // Recorded narration, where it has been rendered. Otherwise the device reads.
  useEffect(() => {
    let live = true
    const parts = board.id.split('/').map(encodeURIComponent).join('/')
    fetch(`/kidilearn/theatre/${parts}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((manifest) => {
        if (live && manifest?.clips && narrator.current)
          narrator.current.clips = manifest.clips
      })
      .catch(() => undefined)
    const remembered = readSaved(board.id)?.scene
    if (remembered && remembered < board.scenes.length) setSaved(remembered)
    return () => {
      live = false
      narrator.current?.stop()
    }
  }, [board])

  useEffect(() => {
    if (narrator.current) {
      narrator.current.muted = muted
      narrator.current.rate = speed
    }
  }, [muted, speed])

  useEffect(() => {
    if (status === 'playing' && sceneIndex > 0) writeSaved(board.id, sceneIndex)
  }, [board.id, sceneIndex, status])

  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === frame.current)
    document.addEventListener('fullscreenchange', change)
    return () => document.removeEventListener('fullscreenchange', change)
  }, [])

  const goToScene = (index: number) => {
    setSceneIndex(index)
    setBeat(0)
    setFraction(0)
  }

  const nextScene = () => {
    if (sceneIndex + 1 >= board.scenes.length) {
      setStatus('done')
      writeSaved(board.id, null)
    } else goToScene(sceneIndex + 1)
  }

  const advance = () => {
    if (beat + 1 < scene.beats.length) {
      setBeat(beat + 1)
      setFraction(0)
      return
    }
    // After "Show me again", go straight back to the question that sent us.
    if (returnTo !== null) {
      setSceneIndex(returnTo)
      setBeat(board.scenes[returnTo]!.beats.length - 1)
      setReturnTo(null)
      setStatus('check')
      return
    }
    if (scene.check) setStatus('check')
    else nextScene()
  }

  useEffect(() => {
    if (status !== 'playing') {
      setTalking(false)
      return
    }
    setTalking(true)
    narrator.current?.speak({
      text: kindBeat.say,
      lang: kindBeat.lang,
      band,
      onProgress: setFraction,
      onMode: setVoice,
      onEnd: advance,
    })
    return () => narrator.current?.stop()
    // A new line starts only when the position or the settings change.
  }, [status, sceneIndex, beat, muted, speed])

  const speakOnce = (text: string, lang?: 'en' | 'fr') => {
    setTalking(true)
    narrator.current?.speak({
      text,
      lang,
      band,
      onMode: setVoice,
      onEnd: () => setTalking(false),
    })
  }

  const toggle = () => {
    if (status === 'playing') {
      narrator.current?.stop()
      setStatus('paused')
    } else if (status === 'paused' || status === 'start') {
      narrator.current?.unlock()
      setStatus('playing')
    }
    else if (status === 'done') restart()
  }
  const restart = () => {
    setResults({})
    goToScene(0)
    setSaved(null)
    setReturnTo(null)
    writeSaved(board.id, null)
    setStatus('playing')
  }
  const jump = (index: number) => {
    narrator.current?.stop()
    setReturnTo(null)
    goToScene(Math.max(0, Math.min(index, board.scenes.length - 1)))
    if (status === 'check' || status === 'done' || status === 'start')
      setStatus('playing')
  }
  const answered = (result: Result) => {
    narrator.current?.stop()
    setResults((r) => ({ ...r, [scene.id]: result }))
    setStatus('playing')
    nextScene()
  }
  const reteach = () => {
    const target = board.scenes.findIndex((s) => s.id === scene.reteach)
    const index = target >= 0 ? target : Math.max(0, sceneIndex - 1)
    narrator.current?.stop()
    setReturnTo(sceneIndex)
    goToScene(index)
    setStatus('playing')
  }
  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void frame.current?.requestFullscreen()
  }

  const totals = useMemo(() => {
    const secs = boardSeconds(board)
    return {
      minutes: Math.max(1, Math.round(secs / 60)),
      checks: checkCount(board),
      widths: board.scenes.map((s) => sceneSeconds(s, band) / secs),
    }
  }, [board, band])
  const marked = Object.values(results).filter((r) => r.correct !== null)
  const stars = marked.filter((r) => r.correct).length

  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement
    if (/^(INPUT|BUTTON|TEXTAREA|SELECT|A|AUDIO)$/.test(target.tagName)) return
    if (event.key === ' ') {
      event.preventDefault()
      toggle()
    } else if (event.key === 'ArrowRight') jump(sceneIndex + 1)
    else if (event.key === 'ArrowLeft') jump(sceneIndex - 1)
  }

  const canFullscreen =
    typeof document !== 'undefined' && document.fullscreenEnabled
  const words = kindBeat.say.split(/\s+/)
  const spoken = Math.ceil(fraction * words.length)
  const controlButton =
    'grid h-11 w-11 max-w-full place-items-center justify-self-center rounded-full text-white transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40'

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={frame}
        data-band={band}
        onKeyDown={onKeyDown}
        className="theatre th-frame mt-4 overflow-hidden rounded-3xl bg-[var(--th-chrome)] shadow-lg"
      >
        <div className="th-stage relative aspect-[4/3] w-full overflow-hidden sm:aspect-video">
          {status === 'done' ? (
            <Finished
              stars={stars}
              marked={marked.length}
              onAgain={restart}
              onFinish={onFinish}
              finishLabel={finishLabel}
            />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                className="absolute inset-0"
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.28 }}
              >
                <SceneView visual={scene.visual} step={step} />
              </motion.div>
            </AnimatePresence>
          )}
          {band !== 'jhs' && status !== 'done' && (
            <Mascot
              talking={talking}
              className={`pointer-events-none absolute right-[1.5cqw] bottom-[1cqw] ${band === 'kg' ? 'w-[13cqw]' : 'w-[9cqw]'}`}
            />
          )}
          {status === 'start' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1.6cqw] bg-[var(--th-chrome)] px-4 text-center text-white">
              <button
                type="button"
                onClick={() => {
                  narrator.current?.unlock()
                  if (saved) goToScene(saved)
                  setStatus('playing')
                }}
                aria-label={saved ? 'Continue the lesson' : 'Start the lesson'}
                className="grid size-[max(4.5rem,13cqw)] place-items-center rounded-full bg-amber-400 text-[#10243a] shadow-xl transition hover:scale-105 focus-visible:outline-4 focus-visible:outline-white"
              >
                <Play className="size-1/2 translate-x-[6%] fill-current" />
              </button>
              <p className="th-h2">{saved ? 'Carry on learning' : board.title}</p>
              <p className="th-small">
                About {totals.minutes} min
                {totals.checks > 0 &&
                  ` · ${totals.checks} ${totals.checks === 1 ? 'question' : 'questions'} to answer inside`}
              </p>
              {saved && (
                <button
                  type="button"
                  onClick={restart}
                  className="th-small min-h-11 font-semibold underline"
                >
                  Start from the beginning
                </button>
              )}
            </div>
          )}
        </div>

        {status === 'check' && scene.check ? (
          <CheckPanel
            key={scene.id}
            check={scene.check}
            band={band}
            marker={marker}
            canReteach={Boolean(scene.reteach) || sceneIndex > 0}
            onSpeak={speakOnce}
            onDone={answered}
            onReteach={reteach}
          />
        ) : (
          captions &&
          status !== 'start' &&
          status !== 'done' && (
            <p
              aria-live="off"
              className={`min-h-[3.6em] bg-[var(--th-chrome)] px-4 py-2.5 text-center leading-snug text-white ${band === 'kg' ? 'text-xl sm:text-2xl' : 'text-base sm:text-lg'}`}
            >
              {words.map((word, i) => (
                <span
                  key={i}
                  className={
                    voice !== 'silent' && i < spoken ? 'text-amber-300' : ''
                  }
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          )
        )}

        <div className="flex gap-0.5 bg-[var(--th-chrome)] px-3 pt-1">
          {board.scenes.map((s, i) => {
            const fill =
              status === 'done' || i < sceneIndex
                ? 1
                : i === sceneIndex
                  ? (beat + fraction) / s.beats.length
                  : 0
            return (
              <button
                key={s.id}
                type="button"
                title={s.chapter}
                aria-label={`Go to ${s.chapter}`}
                aria-current={i === sceneIndex ? 'step' : undefined}
                onClick={() => jump(i)}
                style={{ flexGrow: Math.max(totals.widths[i]!, 0.04) }}
                className="group relative flex h-7 basis-0 items-center"
              >
                <span className="relative h-2 w-full overflow-hidden rounded-full bg-white/25 transition group-hover:h-3">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-amber-400"
                    style={{ width: `${fill * 100}%` }}
                  />
                </span>
                {s.check && (
                  <span
                    aria-hidden="true"
                    className={`absolute top-0.5 right-0 size-2.5 rounded-full ring-2 ring-[var(--th-chrome)] ${results[s.id]?.correct === true ? 'bg-emerald-400' : results[s.id] ? 'bg-amber-300' : 'bg-white'}`}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div
          className={`grid items-center gap-0.5 bg-[var(--th-chrome)] px-2 pb-2 text-white sm:flex ${canFullscreen ? 'grid-cols-7' : 'grid-cols-6'}`}
        >
          <button
            type="button"
            className={controlButton}
            aria-label="Previous part"
            disabled={sceneIndex === 0}
            onClick={() => jump(sceneIndex - 1)}
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            className={controlButton}
            aria-label={
              status === 'playing'
                ? 'Pause'
                : status === 'done'
                  ? 'Watch again'
                  : 'Play'
            }
            disabled={status === 'check'}
            onClick={toggle}
          >
            {status === 'playing' ? (
              <Pause className="size-6 fill-current" />
            ) : status === 'done' ? (
              <RotateCcw className="size-6" />
            ) : (
              <Play className="size-6 fill-current" />
            )}
          </button>
          <button
            type="button"
            className={controlButton}
            aria-label="Next part"
            disabled={sceneIndex >= board.scenes.length - 1}
            onClick={() => jump(sceneIndex + 1)}
          >
            <ChevronRight className="size-6" />
          </button>
          <p className="col-span-full row-start-1 min-w-0 truncate px-2 text-sm font-semibold sm:ml-1 sm:flex-1 sm:px-0">
            {scene.chapter}
          </p>
          <button
            type="button"
            className={`${controlButton} text-sm font-bold`}
            aria-label={`Speed ${speed} times. Change speed`}
            onClick={() =>
              setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]!)
            }
          >
            {speed}×
          </button>
          <button
            type="button"
            className={controlButton}
            aria-pressed={captions}
            aria-label="Words on screen"
            onClick={() => setCaptions(!captions)}
          >
            <Captions
              className={`size-6 ${captions ? '' : 'opacity-50'}`}
            />
          </button>
          <button
            type="button"
            className={controlButton}
            aria-pressed={muted}
            aria-label={muted ? 'Turn the voice on' : 'Turn the voice off'}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <VolumeX className="size-6" /> : <Volume2 className="size-6" />}
          </button>
          {canFullscreen && (
            <button
              type="button"
              className={controlButton}
              aria-label={fullscreen ? 'Leave full screen' : 'Full screen'}
              onClick={toggleFullscreen}
            >
              {fullscreen ? (
                <Minimize className="size-5" />
              ) : (
                <Maximize className="size-5" />
              )}
            </button>
          )}
        </div>
        {voice === 'silent' && !muted && status === 'playing' && (
          <p className="bg-[var(--th-chrome)] px-4 pb-2 text-center text-xs text-white/80">
            This device has no voice for this line. Read the words on screen.
          </p>
        )}
      </div>

      {voice === 'recorded' && (
        <p className="mt-2 text-xs text-slate-500">AI-narrated lesson.</p>
      )}
      <details className="mt-3 text-sm">
        <summary className="min-h-11 cursor-pointer py-2 font-semibold">
          Read the whole lesson
        </summary>
        <ol className="mt-1 space-y-3">
          {board.scenes.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className="min-h-11 text-left font-bold underline"
                onClick={() => jump(i)}
              >
                {s.chapter}
              </button>
              <p className="leading-relaxed">
                {s.beats.map((b) => speakable(b.say)).join(' ')}
              </p>
            </li>
          ))}
        </ol>
      </details>
    </MotionConfig>
  )
}

function Finished({
  stars,
  marked,
  onAgain,
  onFinish,
  finishLabel,
}: {
  stars: number
  marked: number
  onAgain: () => void
  onFinish?: () => void
  finishLabel?: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[2cqw] px-4 text-center">
      {marked > 0 && (
        <div className="flex gap-1" role="img" aria-label={`${stars} of ${marked} right`}>
          {Array.from({ length: marked }, (_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.18, type: 'spring' }}
            >
              <Star
                className={`size-[max(2.25rem,8cqw)] ${i < stars ? 'fill-amber-400 text-amber-500' : 'text-[var(--th-line)]'}`}
              />
            </motion.span>
          ))}
        </div>
      )}
      <h3 className="th-h1">Lesson finished</h3>
      {marked > 0 && (
        <p className="th-p">
          You got {stars} of {marked} right.
          {stars < marked && ' Watching again can help with the rest.'}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {onFinish && (
          <button
            type="button"
            onClick={onFinish}
            className="min-h-12 rounded-2xl bg-[var(--th-accent)] px-5 py-2.5 text-base font-bold text-[var(--th-accent-ink)]"
          >
            {finishLabel ?? 'Continue'}
          </button>
        )}
        <button
          type="button"
          onClick={onAgain}
          className="min-h-12 rounded-2xl border-2 border-[var(--th-line)] bg-[var(--th-panel)] px-5 py-2.5 text-base font-semibold text-[var(--th-ink)]"
        >
          Watch again
        </button>
      </div>
    </div>
  )
}
