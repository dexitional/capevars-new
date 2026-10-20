import { useState } from 'react'
import type { LearningQuestion } from '#/lib/kidilearn/library'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function PlayInteractionView({
  question,
  answerIndex,
  onAnswer,
}: {
  question: LearningQuestion
  answerIndex?: number
  onAnswer: (index: number | undefined) => void
}) {
  const game = question.interaction!
  const answer =
    answerIndex === undefined ? undefined : question.options[answerIndex]
  const [selected, setSelected] = useState<Array<number>>(() =>
    Array.from({ length: Number(answer ?? 0) || 0 }, (_, i) => i),
  )
  const [ordered, setOrdered] = useState<Array<number>>(() =>
    game.type === 'order' && answer ? answer.split(' ').map(Number) : [],
  )
  const choose = (value: string) => {
    const i = question.options.indexOf(value)
    onAnswer(i < 0 ? undefined : i)
  }
  const count = Number(
    answer ?? (typeof game.start === 'number' ? game.start : 0),
  )
  const tile =
    'min-h-11 rounded-xl border-2 px-2 py-2 text-center font-bold disabled:opacity-40'
  if (game.type === 'tap' || game.type === 'half')
    return (
      <div className="mt-5 space-y-4">
        <div
          className={cn(
            'grid gap-2',
            game.type === 'half'
              ? 'grid-cols-3 sm:grid-cols-6'
              : 'grid-cols-4 sm:grid-cols-6',
          )}
        >
          {Array.from({ length: game.total ?? 0 }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${game.type === 'half' ? 'Piece' : 'Object'} ${i + 1}`}
              aria-pressed={selected.includes(i)}
              className={cn(
                tile,
                'text-2xl',
                selected.includes(i)
                  ? 'border-teal-600 bg-teal-200'
                  : 'border-slate-200 bg-white',
              )}
              onClick={() => {
                const next = selected.includes(i)
                  ? selected.filter((n) => n !== i)
                  : [...selected, i]
                setSelected(next)
                choose(String(next.length))
              }}
            >
              {game.emoji ?? '▰'}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="text-sm font-bold">
          {selected.length} selected
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSelected([])
            choose('0')
          }}
        >
          Clear selection
        </Button>
      </div>
    )
  if (game.type === 'chart')
    return (
      <div className="mt-5">
        <p className="mb-3 text-sm">Tap your number on the hundred chart.</p>
        <div className="grid grid-cols-10 gap-0.5">
          {question.options.map((n, i) => (
            <button
              key={n}
              type="button"
              aria-pressed={answerIndex === i}
              className={cn(
                'min-h-9 min-w-0 rounded border px-0 text-[10px] font-semibold sm:min-h-11 sm:text-sm',
                answerIndex === i ? 'border-teal-600 bg-teal-200' : 'bg-white',
              )}
              onClick={() => onAnswer(i)}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm" aria-live="polite">
          Your number: {answer ?? 'Choose a square'}
        </p>
      </div>
    )
  if (game.type === 'order')
    return (
      <div className="mt-5 space-y-4">
        <div
          aria-live="polite"
          className="flex min-h-16 flex-wrap gap-2 rounded-xl border-2 border-dashed bg-teal-50 p-3"
        >
          {ordered.length
            ? ordered.map((n) => (
                <span key={n} className={tile}>
                  {n}
                </span>
              ))
            : 'Your ordered cards go here'}
        </div>
        <div className="flex flex-wrap gap-2">
          {game.items?.map((n) => (
            <button
              key={n}
              type="button"
              disabled={ordered.includes(n)}
              className={tile}
              onClick={() => {
                const next = [...ordered, n]
                setOrdered(next)
                choose(next.join(' '))
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setOrdered([])
            onAnswer(undefined)
          }}
        >
          Start again
        </Button>
      </div>
    )
  if (game.type === 'directions') {
    const goal = game.goal ?? [0, 0]
    const start = Array.isArray(game.start) ? game.start : [0, 0]
    const [x, y] = (answer ?? start.join(',')).split(',').map(Number) as [
      number,
      number,
    ]
    const move = (dx: number, dy: number) => choose(`${x + dx},${y + dy}`)
    return (
      <div className="mt-5 space-y-4">
        <div
          className="mx-auto grid max-w-72 grid-cols-4 gap-2"
          role="img"
          aria-label={`Explorer at column ${x + 1}, row ${y + 1}; treasure at column ${(goal[0] ?? 0) + 1}, row ${(goal[1] ?? 0) + 1}`}
        >
          {Array.from({ length: 16 }, (_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-xl border bg-teal-50 text-xl"
            >
              {i % 4 === x && Math.floor(i / 4) === y
                ? '🧍'
                : i % 4 === goal[0] && Math.floor(i / 4) === goal[1]
                  ? '🎁'
                  : '·'}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant="outline"
            aria-label="Move left"
            disabled={x === 0}
            onClick={() => move(-1, 0)}
          >
            ←
          </Button>
          <Button
            variant="outline"
            aria-label="Move up"
            disabled={y === 0}
            onClick={() => move(0, -1)}
          >
            ↑
          </Button>
          <Button
            variant="outline"
            aria-label="Move down"
            disabled={y === 3}
            onClick={() => move(0, 1)}
          >
            ↓
          </Button>
          <Button
            variant="outline"
            aria-label="Move right"
            disabled={x === 3}
            onClick={() => move(1, 0)}
          >
            →
          </Button>
        </div>
      </div>
    )
  }
  const maximum = Number(question.options.at(-1))
  return (
    <div className="mt-5 space-y-4">
      <div
        aria-live="polite"
        className="rounded-2xl bg-teal-50 p-5 text-center"
      >
        <p className="text-3xl font-black">
          {game.type === 'money' ? `GH₵${count}` : count}
        </p>
        <p className="mt-2 text-sm">
          {game.type === 'groups'
            ? `${count} groups × ${game.size} shells = ${count * (game.size ?? 1)} shells`
            : game.type === 'measure'
              ? 'equal units placed end to end'
              : game.type === 'numberline'
                ? `Your position · started at ${game.start}`
                : 'Build the requested amount'}
        </p>
        {game.type === 'groups' && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className="rounded-full border bg-white px-2 py-1 text-xs"
              >
                {'●'.repeat(game.size ?? 1)}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          disabled={count <= 0}
          onClick={() => choose(String(count - 1))}
        >
          {game.type === 'numberline' ? '← Back 1' : 'Remove 1'}
        </Button>
        <Button
          variant="outline"
          disabled={count >= maximum}
          onClick={() => choose(String(count + 1))}
        >
          {game.type === 'numberline'
            ? 'Forward 1 →'
            : game.type === 'groups'
              ? 'Add a group'
              : game.type === 'money'
                ? 'Add GH₵1'
                : 'Add a unit'}
        </Button>
        {game.type === 'money' && (
          <Button
            variant="outline"
            disabled={count + 2 > maximum}
            onClick={() => choose(String(count + 2))}
          >
            Add GH₵2
          </Button>
        )}
        <Button
          variant="ghost"
          onClick={() =>
            choose(String(typeof game.start === 'number' ? game.start : 0))
          }
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
