import { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Lightbulb,
  MapPin,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react'
import type { ExploreGuide, WorkedExample } from '#/lib/kidilearn/explore/types'
import { ExploreArt } from './explore-art'

function Example({
  example,
  index,
}: {
  example: WorkedExample
  index: number
}) {
  const [shown, setShown] = useState(false)
  return (
    <article className="min-w-0 rounded-2xl border bg-white p-4">
      <h5 className="font-black text-primary">
        Example {index + 1}: {example.title}
      </h5>
      {example.art && (
        <ExploreArt
          art={example.art}
          alt={`Picture for ${example.title}`}
          className="mt-3 w-full rounded-xl"
        />
      )}
      <p className="mt-3 text-base leading-7">{example.situation}</p>
      {shown ? (
        <>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-base leading-7">
            {example.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 p-3 font-bold text-emerald-900">
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" /> {example.answer}
          </p>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setShown(true)}
          className="mt-3 min-h-11 rounded-xl border-2 border-teal-700 px-4 py-2 text-sm font-bold text-teal-900"
        >
          I have thought about it. Show me how
        </button>
      )}
    </article>
  )
}

// The written lesson: what the idea means, how to work with it and where it is met.
export function LessonGuide({ guide }: { guide: ExploreGuide }) {
  return (
    <div className="mt-4 space-y-6">
      <p className="rounded-2xl bg-amber-50 p-4 text-lg leading-8 font-semibold text-amber-950">
        {guide.hook}
      </p>
      <div>
        <ExploreArt art={guide.art} alt={guide.artCaption} />
        <p className="mt-2 text-center text-sm font-semibold text-slate-600">
          {guide.artCaption}
        </p>
      </div>
      <div className="space-y-3 text-base leading-8">
        {guide.explain.map((text) => (
          <p key={text}>{text}</p>
        ))}
      </div>
      <section>
        <h4 className="flex items-center gap-2 font-black">
          <BookOpen className="size-5 text-teal-700" /> Words to know
        </h4>
        <dl className="mt-3 grid gap-2 sm:grid-cols-2">
          {guide.words.map((word) => (
            <div key={word.term} className="rounded-xl bg-teal-50 p-3">
              <dt className="font-bold text-teal-950">{word.term}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed">{word.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section>
        <h4 className="flex items-center gap-2 font-black">
          <Lightbulb className="size-5 text-amber-600" /> Let’s work it out
        </h4>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {guide.examples.map((example, i) => (
            <Example key={example.title} example={example} index={i} />
          ))}
        </div>
      </section>
      <section>
        <h4 className="flex items-center gap-2 font-black">
          <TriangleAlert className="size-5 text-rose-600" /> Watch out
        </h4>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          {guide.mistakes.map((m) => (
            <li key={m.wrong} className="rounded-xl bg-rose-50 p-3">
              <span className="font-semibold text-rose-900">
                Not quite: {m.wrong}
              </span>
              <span className="mt-1 block text-emerald-900">
                Better: {m.right}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h4 className="flex items-center gap-2 font-black">
          <MapPin className="size-5 text-teal-700" /> Where you meet this
        </h4>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base leading-7">
          {guide.realLife.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </section>
      {guide.safety && (
        <section className="rounded-2xl bg-sky-50 p-4">
          <h4 className="flex items-center gap-2 font-black text-sky-950">
            <ShieldCheck className="size-5" /> Stay safe
          </h4>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-base leading-7">
            {guide.safety.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </section>
      )}
      <section className="rounded-2xl border-2 border-dashed border-teal-300 p-4">
        <h4 className="font-black">Try it yourself</h4>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          You need: {guide.tryIt.need}
        </p>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-base leading-7">
          {guide.tryIt.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
      <p className="text-xs text-slate-500">
        {guide.indicator.source === 'kidilearn'
          ? `KidiLearn goal: ${guide.indicator.text}`
          : `NaCCA curriculum ${guide.indicator.code}: ${guide.indicator.text}`}
      </p>
    </div>
  )
}
