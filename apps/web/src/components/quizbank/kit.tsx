// Shared Quizbank UI: course cards, the question stem with its diagrams, the
// slide-down panel used for hints and lessons, and the written-answer box.
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpenCheck, Expand, Layers, Minimize2, Users } from "lucide-react";
import { cn } from "#/lib/utils";
import { asset } from "#/lib/asset";
import { QB_DIFFICULTY, QB_LEVELS, QB_MAX_TEXT_ANSWER, mediaSrc } from "#/lib/quizbank";
import type { QbDifficulty, QbMark, QbMedia, QbPublicQuestion } from "#/lib/quizbank";
import { Img, TextBlock } from "#/components/site/kit";

export interface QbCourseCard {
  id: number;
  slug: string;
  title: string;
  code: string | null;
  level: keyof typeof QB_LEVELS;
  description: string | null;
  coverUrl: string | null;
  questionCount: number;
  boardCount: number;
  examQuestions: number;
  examMinutes: number;
  tags: Array<{ name: string; slug: string }>;
  onBoard: boolean;
}

export interface QbKey {
  correctIndex: number | null;
  answer: string | null;
  explanation: string | null;
  optionHints: Array<string | null>;
}

export type QbReviewQuestion = QbPublicQuestion & { key?: QbKey; mark?: QbMark | null };

export const LEVEL_STYLE: Record<keyof typeof QB_LEVELS, string> = {
  tertiary: "bg-indigo-100 text-indigo-800",
  shs: "bg-sky-100 text-sky-800",
  jhs: "bg-emerald-100 text-emerald-800",
  tvet: "bg-amber-100 text-amber-900",
  nvti: "bg-rose-100 text-rose-800",
};

export const LETTERS = "ABCDEFGH";
export const percent = (fraction: number | null | undefined) => (fraction === null || fraction === undefined ? "—" : `${Math.round(fraction * 100)}%`);

export function LevelBadge({ level, className }: { level: keyof typeof QB_LEVELS; className?: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase", LEVEL_STYLE[level], className)}>{QB_LEVELS[level]}</span>;
}

export function DifficultyDots({ value }: { value: QbDifficulty }) {
  const n = { easy: 1, medium: 2, hard: 3 }[value];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground" title={`${QB_DIFFICULTY[value]} question`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={cn("size-1.5 rounded-full", i <= n ? "bg-amber-500" : "bg-slate-200")} />
      ))}
      {QB_DIFFICULTY[value]}
    </span>
  );
}

export function QbCourseTile({ c, footer }: { c: QbCourseCard; footer?: React.ReactNode }) {
  return (
    <div className="group card-hover relative flex flex-col overflow-hidden rounded-2xl border bg-white">
      <div className="relative h-24 overflow-hidden bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95]">
        {c.coverUrl && <Img src={c.coverUrl} className="absolute inset-0 size-full opacity-40" />}
        <div className="dot-grid absolute inset-0 opacity-30" aria-hidden="true" />
        {/* The Capevars mark as a watermark glowing through the gradient. */}
        <div className="absolute -right-2 -bottom-10 size-32 rounded-full bg-amber-300/25 blur-2xl" aria-hidden="true" />
        <img
          src={asset("logo-mark-light.png")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 -right-8 h-32 w-auto -rotate-12 opacity-20 mix-blend-screen transition duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-30"
        />
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2">
          <LevelBadge level={c.level} />
          {c.code && <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs font-bold text-white ring-1 ring-white/25">{c.code}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Link to="/learn/quizbank/c/$slug" params={{ slug: c.slug }} className="line-clamp-2 font-bold text-primary after:absolute after:inset-0 hover:underline">
          {c.title}
        </Link>
        {c.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {c.tags.slice(0, 4).map((t) => (
              <span key={t.slug} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-primary/80">
                #{t.name}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Layers className="size-3.5" /> {c.questionCount.toLocaleString()} question{c.questionCount === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" /> {c.boardCount.toLocaleString()}
          </span>
          {c.onBoard && (
            <span className="ml-auto flex items-center gap-1 font-semibold text-emerald-700">
              <BookOpenCheck className="size-3.5" /> On board
            </span>
          )}
        </div>
        {footer && <div className="relative z-10 mt-3">{footer}</div>}
      </div>
    </div>
  );
}

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
      <TextBlock text={q.body} className="mt-3 text-lg leading-relaxed font-medium text-primary" />
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

// Animates open by growing its grid row from 0fr to 1fr.
export function SlideDown({ open, children, className }: { open: boolean; children: React.ReactNode; className?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(open));
    return () => cancelAnimationFrame(id);
  }, [open]);
  return (
    <div className={cn("grid transition-[grid-template-rows,opacity] duration-300 ease-out", shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")} aria-hidden={!shown}>
      <div className="overflow-hidden">
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// A roomy answer box that grows with the text and can expand to full screen.
export function TextAnswer({ value, onChange, disabled, placeholder }: { value: string; onChange: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  const [full, setFull] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
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
      <div className="flex items-center justify-between border-b bg-secondary/50 px-4 py-2">
        <span className="text-xs font-bold tracking-wide text-primary uppercase">Your answer</span>
        <button type="button" onClick={() => setFull(!full)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-white" aria-label={full ? "Exit full screen" : "Expand to full screen"}>
          {full ? <Minimize2 className="size-3.5" /> : <Expand className="size-3.5" />} {full ? "Done" : "Expand"}
        </button>
      </div>
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
      <p className="text-xs font-black tracking-[0.15em] text-indigo-700 uppercase">{title}</p>
      {answer && (
        <div className="mt-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Answer</p>
          <TextBlock text={answer} className="text-sm font-semibold text-primary" />
        </div>
      )}
      {explanation && (
        <div className="mt-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Why</p>
          <TextBlock text={explanation} className="text-sm leading-relaxed text-primary/90" />
        </div>
      )}
    </div>
  );
}
