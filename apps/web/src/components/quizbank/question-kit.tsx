// Quizbank UI that shows questions and answers: the question stem with its
// diagrams, the written-answer box and the lesson. Kept apart from kit.tsx because
// it needs the maths renderer, so only study and exam pages download that.
import { useEffect, useRef, useState } from "react";
import { Expand, Minimize2, Omega } from "lucide-react";
import { cn } from "#/lib/utils";
import { QB_MAX_TEXT_ANSWER, mediaSrc } from "#/lib/quizbank";
import type { QbMark, QbMedia, QbPublicQuestion } from "#/lib/quizbank";
import { DifficultyDots } from "./kit";
import { RichText } from "./rich-text";
import { SymbolPad } from "./symbol-pad";
import type { SymbolInsert } from "./symbol-pad";

function MediaFigure({ m }: { m: QbMedia }) {
  const [zoom, setZoom] = useState(false);
  return (
    <figure className="overflow-hidden rounded-xl border bg-white">
      <button type="button" onClick={() => setZoom(true)} className="block w-full cursor-zoom-in bg-slate-50 p-2" aria-label={`Enlarge ${m.caption ?? "diagram"}`}>
        <img src={mediaSrc(m)} alt={m.caption ?? "Question diagram"} className="mx-auto max-h-80 w-auto object-contain" />
      </button>
      {m.caption && <figcaption className="border-t px-3 py-1.5 text-xs text-muted-foreground">{m.caption}</figcaption>}
      {zoom && (
        <button type="button" onClick={() => setZoom(false)} className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-black/80 p-6" aria-label="Close enlarged diagram">
          <img src={mediaSrc(m)} alt={m.caption ?? "Question diagram"} className="max-h-full max-w-full rounded-lg bg-white object-contain p-3" />
        </button>
      )}
    </figure>
  );
}

export function QuestionStem({ q, number, total }: { q: QbPublicQuestion; number?: number; total?: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-muted-foreground">
        {number !== undefined && (
          <span className="rounded-full bg-primary px-2.5 py-0.5 text-white">
            Question {number}
            {total ? ` of ${total}` : ""}
          </span>
        )}
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-primary">{q.type === "text" ? "Written answer" : "Multiple choice"}</span>
        <DifficultyDots value={q.difficulty} />
        <span>
          {q.marks} mark{q.marks === 1 ? "" : "s"}
        </span>
      </div>
      <RichText text={q.body} className="mt-3 text-lg leading-relaxed font-medium text-primary" />
      {q.media.length > 0 && (
        <div className={cn("mt-4 grid gap-3", q.media.length > 1 && "sm:grid-cols-2")}>
          {q.media.map((m, i) => (
            <MediaFigure key={i} m={m} />
          ))}
        </div>
      )}
    </div>
  );
}

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// A roomy answer box that grows with the text and can expand to full screen, with a
// pad of maths and subject symbols (chosen from `subjects`) that type at the caret.
export function TextAnswer({
  value,
  onChange,
  disabled,
  placeholder,
  subjects,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
  subjects?: Array<string>;
}) {
  const [full, setFull] = useState(false);
  const [symbols, setSymbols] = useState(true);
  const ref = useRef<HTMLTextAreaElement>(null);
  // Replaces the selection; a template like "√()" wraps it and leaves the caret inside.
  const insert = ({ text, back }: SymbolInsert) => {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? start;
    const selected = value.slice(start, end);
    const piece = back ? text.slice(0, text.length - back) + selected + text.slice(text.length - back) : text;
    const next = (value.slice(0, start) + piece + value.slice(end)).slice(0, QB_MAX_TEXT_ANSWER);
    onChange(next);
    const caret = Math.min(start + piece.length - back, next.length);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };
  useEffect(() => {
    const el = ref.current;
    if (!el || full) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 160), 520)}px`;
  }, [value, full]);
  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [full]);
  const box = (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border-2 bg-white transition-colors focus-within:border-primary", full ? "h-full" : "border-border", disabled && "opacity-70")}>
      <div className="flex items-center gap-1 border-b bg-secondary/50 px-4 py-2">
        <span className="text-xs font-bold tracking-wide text-primary uppercase">Your answer</span>
        <span className="ml-auto" />
        <button
          type="button"
          onClick={() => setSymbols(!symbols)}
          className={cn("flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-white", symbols && "bg-white shadow-xs")}
          aria-pressed={symbols}
          title={symbols ? "Hide the symbol pad" : "Show maths and subject symbols"}
        >
          <Omega className="size-3.5" /> Symbols
        </button>
        <button type="button" onClick={() => setFull(!full)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-white" aria-label={full ? "Exit full screen" : "Expand to full screen"}>
          {full ? <Minimize2 className="size-3.5" /> : <Expand className="size-3.5" />} {full ? "Done" : "Expand"}
        </button>
      </div>
      {symbols && <SymbolPad key={subjects?.join("|")} subjects={subjects} onInsert={insert} disabled={disabled} />}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, QB_MAX_TEXT_ANSWER))}
        disabled={disabled}
        placeholder={placeholder ?? "Explain your answer in your own words. Use short paragraphs or points; show working where it helps."}
        className={cn("w-full resize-none px-4 py-3 text-base leading-relaxed outline-none placeholder:text-muted-foreground/70", full && "flex-1")}
        autoFocus={full}
      />
      <div className="flex items-center justify-between border-t px-4 py-1.5 text-[11px] text-muted-foreground">
        <span>Marked on meaning, not exact wording</span>
        <span>
          {wordCount(value)} words · {value.length.toLocaleString()}/{QB_MAX_TEXT_ANSWER.toLocaleString()}
        </span>
      </div>
    </div>
  );
  if (!full) return box;
  return (
    <>
      <div className="h-40 rounded-2xl border-2 border-dashed bg-secondary/40" aria-hidden="true" />
      <div className="fixed inset-0 z-50 bg-black/60 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="Your answer">
        <div className="mx-auto h-full max-w-4xl">{box}</div>
      </div>
    </>
  );
}

export function MarkBadge({ mark }: { mark: QbMark }) {
  const tone = mark.correct ? "bg-emerald-100 text-emerald-800" : mark.score > 0 ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800";
  const label = mark.correct ? "Correct" : mark.score > 0 ? `Partly right · ${Math.round(mark.score * 100)}%` : "Not correct";
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold", tone)}>{label}</span>;
}

export function Lesson({ answer, explanation, title = "The lesson" }: { answer?: string | null; explanation?: string | null; title?: string }) {
  if (!answer && !explanation) return null;
  return (
    <div className="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 to-white p-4">
      <p className="border-b border-indigo-100 pb-3 text-xs font-black tracking-[0.15em] text-indigo-700 uppercase">{title}</p>
      {answer && (
        <div className="mt-4">
          <p className="mb-1.5 text-[11px] font-bold text-muted-foreground uppercase">Answer</p>
          <RichText text={answer} className="rounded-xl border border-emerald-200 bg-white p-3.5 text-sm leading-relaxed text-primary" />
        </div>
      )}
      {explanation && (
        <div className={answer ? "mt-5 border-t border-indigo-100 pt-4" : "mt-4"}>
          <p className="mb-1.5 text-[11px] font-bold text-muted-foreground uppercase">Why</p>
          <RichText text={explanation} className="text-sm leading-relaxed text-primary/90" />
        </div>
      )}
    </div>
  );
}
