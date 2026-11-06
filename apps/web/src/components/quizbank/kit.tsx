// Shared Quizbank UI that stays light: course cards, badges and the slide-down
// panel. Anything showing a question lives in question-kit.tsx, because it pulls
// in the maths renderer, which pages that only list courses shouldn't download.
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpenCheck, Crown, Layers, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { asset } from "#/lib/asset";
import { formatMoney } from "#/lib/money";
import { QB_DIFFICULTY, QB_LEVELS } from "#/lib/quizbank";
import type { QbDifficulty, QbMark, QbPublicQuestion } from "#/lib/quizbank";
import { Img } from "#/components/site/kit";

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
  fee: number | null; // null when free
  subscribed: boolean;
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

// Counts a course page view for admin analytics, once per course per browser session.
export function recordCourseView(courseId: number) {
  try {
    const key = `qb-viewed-${courseId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // Storage is blocked: it may count more than once, which beats not counting.
  }
  void api.post(`/learn/quizbank/courses/${courseId}/view`).catch(() => undefined);
}

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
        {/* Without a cover, the Capevars mark as a watermark glowing through the gradient. */}
        {!c.coverUrl && (
          <>
            <div className="absolute -right-2 -bottom-10 size-32 rounded-full bg-amber-300/25 blur-2xl" aria-hidden="true" />
            <img
              src={asset("logo-mark-light.png")}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -top-3 -right-8 h-32 w-auto -rotate-12 opacity-20 mix-blend-screen transition duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110 group-hover:opacity-30"
            />
          </>
        )}
        {c.fee !== null && (
          <span className={cn("absolute top-2.5 left-4 flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold", c.subscribed ? "bg-emerald-100 text-emerald-800" : "bg-amber-300 text-[#041d40]")}>
            <Crown className="size-3" /> {c.subscribed ? "Subscribed" : formatMoney(c.fee)}
          </span>
        )}
        <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2">
          <LevelBadge level={c.level} />
          {c.code && <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-bold text-white", c.coverUrl ? "bg-[#041d40]/80 ring-2 ring-white/25" : "bg-white/15 ring-1 ring-white/25")}>{c.code}</span>}
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
