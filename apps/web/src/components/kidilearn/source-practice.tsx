import { useState } from 'react'
import type { LearningLesson } from '#/lib/kidilearn/library'
import { Button } from '#/components/ui/button'

export function SourcePractice({ lesson }: { lesson: LearningLesson }) {
  const source = lesson.content.sourceLesson!
  const [done, setDone] = useState<Array<number>>([])
  const [revealed, setRevealed] = useState(false)
  const [phrase, setPhrase] = useState('')
  const [checked, setChecked] = useState(false)
  const matches =
    phrase.normalize('NFC').trim().toLocaleLowerCase() ===
    source.local_example?.normalize('NFC').trim().toLocaleLowerCase()
  return (
    <div className="mt-3 space-y-5 text-sm leading-relaxed">
      <h3 className="text-xl text-primary">Practise, make and share</h3>
      {lesson.content.level?.startsWith('kg') && (
        <p className="rounded-xl bg-white p-4">
          Learn together with a parent or teacher. Talk, play and try the
          activity in your home language too. An adult can read the questions
          aloud and help you explore the choices.
        </p>
      )}
      {source.local_example && source.translation && (
        <div className="min-w-0 space-y-4 rounded-2xl bg-white p-4">
          <p className="text-xs font-semibold text-teal-800">
            Your {source.lang} phrase
          </p>
          <p className="break-words text-3xl text-primary">
            {source.local_example}
          </p>
          <Button
            variant="outline"
            aria-expanded={revealed}
            onClick={() => setRevealed(!revealed)}
          >
            {revealed ? 'Hide meaning' : 'Show meaning'}
          </Button>
          {revealed && (
            <p className="rounded-xl bg-teal-50 p-3">{source.translation}</p>
          )}
          <label className="block space-y-2">
            <span>
              Copy the phrase, then try saying it with a fluent speaker.
            </span>
            <input
              value={phrase}
              onChange={(e) => {
                setPhrase(e.target.value)
                setChecked(false)
              }}
              className="block w-full min-w-0 rounded-xl border px-3 py-3 text-base"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <Button disabled={!phrase.trim()} onClick={() => setChecked(true)}>
            Check my copy
          </Button>
          {checked && (
            <p role="status">
              {matches
                ? 'Your written phrase matches. Practise its pronunciation with a fluent speaker.'
                : 'Compare each letter and accent with the phrase above, then try again.'}
            </p>
          )}
          <p className="text-xs text-slate-600">
            The video has English guidance. Ask a qualified speaker to model{' '}
            {source.lang} pronunciation and tone.
          </p>
        </div>
      )}
      <p>
        Follow the steps with a parent, teacher or learning partner. Tick each
        one after you try it.
      </p>
      <div className="space-y-3">
        {source.steps.map((step, i) => (
          <label
            key={i}
            className="flex items-start gap-3 rounded-xl bg-white p-4"
          >
            <input
              type="checkbox"
              checked={done.includes(i)}
              onChange={(e) =>
                setDone(
                  e.target.checked ? [...done, i] : done.filter((n) => n !== i),
                )
              }
              className="mt-1 size-5 shrink-0 accent-teal-700"
            />
            <span>
              <span className="font-semibold">{i + 1}. </span>
              {step}
            </span>
          </label>
        ))}
      </div>
      <p role="status" className="text-xs text-slate-600">
        {done.length} of {source.steps.length} steps tried this visit. Use “Save
        Explore & start Play” below to save your lesson progress.
      </p>
      {source.product && (
        <p>
          <strong>What you’ll make: </strong>
          {source.product}
        </p>
      )}
      {source.evidence && (
        <p>
          <strong>Show what you learned: </strong>
          {source.evidence}
        </p>
      )}
      {source.reflection && (
        <p className="rounded-xl border border-amber-200 p-4">
          <strong>Think and share: </strong>
          {source.reflection}
        </p>
      )}
      {lesson.content.safety && (
        <p className="rounded-xl bg-white p-4">
          <strong>Take care: </strong>
          {lesson.content.safety}
        </p>
      )}
    </div>
  )
}

export function SourceDetails({ lesson }: { lesson: LearningLesson }) {
  const source = lesson.content.sourceLesson!
  const page = source.source_page ?? source.source_pdf_page
  return (
    <div className="mt-5 space-y-4 text-sm leading-relaxed">
      {(source.materials ||
        source.resource ||
        lesson.content.visualGuide?.context) && (
        <div className="rounded-2xl bg-sky-50 p-4">
          <h4 className="font-semibold text-primary">Get ready</h4>
          {source.materials && (
            <p className="mt-2">
              <strong>Materials: </strong>
              {source.materials}
            </p>
          )}
          {source.resource && (
            <p className="mt-2">
              <strong>Learning resources: </strong>
              {source.resource}
            </p>
          )}
          {lesson.content.visualGuide?.context && (
            <p className="mt-2">{lesson.content.visualGuide.context}</p>
          )}
        </div>
      )}
      <details className="rounded-2xl border p-4">
        <summary className="cursor-pointer font-semibold">
          Parent and teacher notes
        </summary>
        <div className="mt-3 space-y-2">
          {source.teacher_assessment && (
            <p className="whitespace-pre-line">{source.teacher_assessment}</p>
          )}
          {source.term && <p>Term {source.term}</p>}
          {source.ref && <p>{source.ref}</p>}
          {source.original_indicator && <p>{source.original_indicator}</p>}
          {source.indicator && (
            <p>
              Curriculum reference: {source.indicator}
              {page ? ` · Source page ${page}` : ''}
            </p>
          )}
          {source.source && <p>{source.source}</p>}
          {source.curriculum_source && (
            <p className="break-words">Source: {source.curriculum_source}</p>
          )}
          {source.supplementary && <p>Supplementary practice activity.</p>}
          {lesson.content.sourceScope && <p>{lesson.content.sourceScope}</p>}
        </div>
      </details>
    </div>
  )
}
