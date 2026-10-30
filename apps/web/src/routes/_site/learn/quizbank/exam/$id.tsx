import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Clock, Flag, Loader2, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatClock } from "#/lib/quizbank";
import type { QbMark } from "#/lib/quizbank";
import { Container, TextBlock } from "#/components/site/kit";
import { LETTERS, Lesson, MarkBadge, QuestionStem, TextAnswer, percent } from "#/components/quizbank/kit";
import { RichText } from "#/components/quizbank/rich-text";
import type { QbReviewQuestion } from "#/components/quizbank/kit";
import { DiscussionToggle } from "#/components/quizbank/discussion";
import { useStartExam } from "#/components/quizbank/exam-settings";
import { Button } from "#/components/ui/button";

type Answer = { questionId: number; optionIndex?: number | null; text?: string | null };
type Attempt = {
  id: number;
  title: string;
  source: { kind: "course"; id: number; slug: string; title: string } | { kind: "variation"; id: number; name: string } | null;
  status: "in_progress" | "marking" | "submitted";
  minutes: number;
  startedAt: string;
  endsAt: string;
  remainingSeconds: number;
  submittedAt: string | null;
  score: number | null;
  maxScore: number | null;
  answers: Array<Answer>;
  questions: Array<QbReviewQuestion>;
};

const attemptQuery = (id: string) => ({ queryKey: ["qb-attempt", id], queryFn: () => api.get<{ attempt: Attempt }>(`/learn/quizbank/attempts/${id}`) });

export const Route = createFileRoute("/_site/learn/quizbank/exam/$id")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(attemptQuery(params.id));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: () => ({ meta: [{ title: "Exam simulation | Quizbank" }, { name: "robots", content: "noindex" }] }),
  component: ExamPage,
});

function ExamPage() {
  const { id } = Route.useParams();
  const { data } = useQuery({ ...attemptQuery(id), refetchInterval: (q) => (q.state.data?.attempt.status === "marking" ? 3000 : false) });
  if (!data) return null;
  const a = data.attempt;
  if (a.status === "submitted") return <Results attempt={a} />;
  if (a.status === "marking")
    return (
      <Container className="py-24 text-center">
        <Loader2 className="mx-auto size-10 animate-spin text-primary" />
        <p className="mt-4 font-bold text-primary">Marking your answers…</p>
      </Container>
    );
  return <Runner attempt={a} />;
}

const toMap = (answers: Array<Answer>) => Object.fromEntries(answers.map((x) => [x.questionId, x])) as Record<number, Answer | undefined>;
const answered = (a: Answer | undefined) => Boolean(a && ((a.optionIndex !== null && a.optionIndex !== undefined) || a.text?.trim()));

function Runner({ attempt }: { attempt: Attempt }) {
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState(() => toMap(attempt.answers));
  const [index, setIndex] = useState(0);
  const deadline = useRef(Date.now() + attempt.remainingSeconds * 1000);
  const [left, setLeft] = useState(attempt.remainingSeconds);
  const dirty = useRef(false);
  const total = attempt.questions.length;
  const list = useCallback(() => Object.values(answers).filter((x): x is Answer => Boolean(x)), [answers]);

  const submit = useMutation({
    mutationFn: () => api.post<{ attempt: Attempt }>(`/learn/quizbank/attempts/${attempt.id}/submit`, { answers: list() }),
    onSuccess: (r) => {
      dirty.current = false;
      queryClient.setQueryData(["qb-attempt", String(attempt.id)], r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onError: (e) => toast.error(e.message),
  });

  // Countdown; at zero the exam submits itself, once.
  const autoSubmitted = useRef(false);
  const submitNow = useRef(submit.mutate);
  submitNow.current = submit.mutate;
  useEffect(() => {
    const tick = () => {
      const s = Math.max(0, Math.round((deadline.current - Date.now()) / 1000));
      setLeft(s);
      if (s === 0 && !autoSubmitted.current) {
        autoSubmitted.current = true;
        toast.info("Time's up — submitting your answers");
        submitNow.current();
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // Autosave a moment after the last change.
  useEffect(() => {
    if (!dirty.current) return;
    const t = setTimeout(() => {
      void api.put(`/learn/quizbank/attempts/${attempt.id}/answers`, { answers: list() }).catch(() => undefined);
    }, 1500);
    return () => clearTimeout(t);
  }, [answers, attempt.id, list]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (!submit.isSuccess) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [submit.isSuccess]);

  const q = attempt.questions[index];
  if (!q) return null;
  const set = (patch: Partial<Answer>) => {
    dirty.current = true;
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], questionId: q.id, ...patch } }));
  };
  const done = attempt.questions.filter((x) => answered(answers[x.id])).length;
  const urgent = left <= 60;
  const warning = left <= 300;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur">
        <Container className="flex flex-wrap items-center gap-3 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-primary">{attempt.title}</p>
            <p className="text-xs text-muted-foreground">
              {done} of {total} answered
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 font-mono text-lg font-black tabular-nums",
              urgent ? "animate-pulse bg-red-600 text-white" : warning ? "bg-amber-400 text-[#041d40]" : "bg-primary text-white",
            )}
            role="timer"
            aria-live={urgent ? "assertive" : "off"}
            aria-label={`Time left ${formatClock(left)}`}
          >
            <Clock className="size-4" /> {formatClock(left)}
          </div>
          <Button
            variant="outline"
            disabled={submit.isPending}
            onClick={() => {
              const missing = total - done;
              if (confirm(missing ? `You have ${missing} unanswered question${missing === 1 ? "" : "s"}. Submit anyway?` : "Submit your exam now?")) submit.mutate();
            }}
          >
            <Flag /> Submit
          </Button>
        </Container>
        <div className="h-1 bg-secondary">
          <div className="h-full bg-amber-400 transition-[width] duration-1000 ease-linear" style={{ width: `${(left / (attempt.minutes * 60)) * 100}%` }} />
        </div>
      </div>

      <Container className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-8">
          <QuestionStem q={q} number={index + 1} total={total} />
          <div className="mt-6">
            {q.type === "choice" ? (
              <ul className="space-y-2.5" role="radiogroup" aria-label="Options">
                {q.options.map((o, i) => {
                  const chosen = answers[q.id]?.optionIndex === i;
                  return (
                    <li key={i}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={chosen}
                        onClick={() => set({ optionIndex: chosen ? null : i })}
                        className={cn(
                          "flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all",
                          chosen ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 hover:bg-secondary/40",
                        )}
                      >
                        <span className={cn("grid size-8 flex-none place-items-center rounded-xl text-sm font-black", chosen ? "bg-primary text-white" : "bg-secondary text-primary")}>{LETTERS[i]}</span>
                        <span className="flex-1 pt-1">
                          <RichText text={o.text} className="text-[15px] text-primary" />
                          {o.imageUrl && <img src={o.imageUrl} alt="" className="mt-2 max-h-40 rounded-lg border" />}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <TextAnswer value={answers[q.id]?.text ?? ""} onChange={(text) => set({ text })} disabled={submit.isPending} subjects={q.subjects} />
            )}
          </div>
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <ArrowLeft /> Previous
            </Button>
            {index < total - 1 ? (
              <Button onClick={() => setIndex(index + 1)}>
                Next <ArrowRight />
              </Button>
            ) : (
              <Button disabled={submit.isPending} onClick={() => confirm("Submit your exam now?") && submit.mutate()}>
                <Flag /> Finish & submit
              </Button>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border bg-white p-4 lg:sticky lg:top-28">
          <p className="mb-3 text-xs font-bold tracking-wide text-muted-foreground uppercase">Questions</p>
          <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {attempt.questions.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Question ${i + 1}${answered(answers[x.id]) ? ", answered" : ""}`}
                aria-current={i === index}
                className={cn(
                  "aspect-square rounded-lg text-xs font-bold transition-colors",
                  i === index ? "ring-2 ring-amber-400 ring-offset-1" : "",
                  answered(answers[x.id]) ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-accent",
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="size-3 rounded bg-primary" /> Answered
            </p>
            <p className="flex items-center gap-2">
              <span className="size-3 rounded bg-secondary" /> Not answered
            </p>
            <p className="pt-2">Answers save as you go. When the timer ends, your exam is submitted automatically.</p>
          </div>
        </aside>
      </Container>

      {submit.isPending && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#041d40]/80 backdrop-blur-sm">
          <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
            <Loader2 className="mx-auto size-10 animate-spin text-primary" />
            <p className="mt-4 text-lg font-black text-primary">Marking your exam…</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">Written answers are read for meaning, so this can take a few seconds.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreRing({ fraction }: { fraction: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const tone = fraction >= 0.7 ? "#22c55e" : fraction >= 0.5 ? "#f5b814" : "#ef4444";
  return (
    <svg viewBox="0 0 120 120" className="size-40" role="img" aria-label={`Score ${percent(fraction)}`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={tone}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - fraction)}
        transform="rotate(-90 60 60)"
        className="transition-[stroke-dashoffset] duration-1000"
      />
      <text x="60" y="66" textAnchor="middle" className="fill-white text-[26px] font-black">
        {percent(fraction)}
      </text>
    </svg>
  );
}

function verdict(f: number) {
  if (f >= 0.85) return ["Excellent work!", "You're exam-ready on this course."];
  if (f >= 0.7) return ["Great job!", "A little more practice on the misses and you're there."];
  if (f >= 0.5) return ["Good effort.", "Review the explanations below, then try study mode on the ones you missed."];
  return ["Keep going.", "Use study mode to learn the ideas behind each question, then retake the exam."];
}

function Results({ attempt }: { attempt: Attempt }) {
  const start = useStartExam();
  const [filter, setFilter] = useState<"all" | "missed">("all");
  const answers = useMemo(() => toMap(attempt.answers), [attempt.answers]);
  const marks = attempt.questions.map((q) => q.mark).filter((m): m is QbMark => Boolean(m));
  const fraction = attempt.maxScore ? (attempt.score ?? 0) / attempt.maxScore : 0;
  const correct = marks.filter((m) => m.correct).length;
  const partial = marks.filter((m) => !m.correct && m.score > 0).length;
  const blank = attempt.questions.filter((q) => !answered(answers[q.id])).length;
  const wrong = attempt.questions.length - correct - partial - blank;
  const usedSeconds = attempt.submittedAt ? Math.min(attempt.minutes * 60, (Date.parse(`${attempt.submittedAt.replace(" ", "T")}Z`) - Date.parse(`${attempt.startedAt.replace(" ", "T")}Z`)) / 1000) : 0;
  const aiMarked = marks.some((m) => m.marker === "ai");
  const basicMarked = marks.some((m) => m.marker === "basic");
  const [title, text] = verdict(fraction);
  const src = attempt.source;
  const shown = attempt.questions.filter((q) => filter === "all" || !q.mark?.correct);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative flex flex-col items-center gap-8 py-10 md:flex-row">
          <ScoreRing fraction={fraction} />
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">Exam result · {attempt.title}</p>
            <h1 className="mt-2 font-hero text-4xl font-bold">{title}</h1>
            <p className="mt-1 text-white/75">{text}</p>
            <p className="mt-3 text-lg font-bold">
              {attempt.score} / {attempt.maxScore} marks
              <span className="ml-3 text-sm font-medium text-white/60">in {formatClock(usedSeconds)} of {attempt.minutes} min</span>
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {src && (
                <Button
                  className="bg-amber-400 text-[#041d40] hover:bg-amber-300"
                  disabled={start.isPending}
                  onClick={() => start.mutate(src.kind === "variation" ? { variationId: src.id } : { courseId: src.id })}
                >
                  {start.isPending ? <Loader2 className="animate-spin" /> : <RotateCcw />} Retake exam
                </Button>
              )}
              {src && (
                <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                  {src.kind === "variation" ? (
                    <Link to="/learn/quizbank/s/$id" params={{ id: String(src.id) }}>
                      Study mode
                    </Link>
                  ) : (
                    <Link to="/learn/quizbank/c/$slug/study" params={{ slug: src.slug }}>
                      Study mode
                    </Link>
                  )}
                </Button>
              )}
              <Button asChild variant="ghost" className="text-white hover:bg-white/10">
                {src?.kind === "course" ? (
                  <Link to="/learn/quizbank/c/$slug" params={{ slug: src.slug }}>
                    Course page
                  </Link>
                ) : (
                  <Link to="/learn/quizbank">Study Board</Link>
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            {[
              ["Correct", correct, "text-emerald-300"],
              ["Partly right", partial, "text-amber-300"],
              ["Wrong", wrong, "text-red-300"],
              ["Unanswered", blank, "text-white/70"],
            ].map(([label, n, tone]) => (
              <div key={label as string} className="rounded-2xl bg-white/10 px-5 py-3 ring-1 ring-white/15">
                <p className={cn("text-2xl font-black", tone as string)}>{n as number}</p>
                <p className="text-[11px] text-white/70 uppercase">{label as string}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="mt-8 max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-black text-primary">Review your answers</h2>
          <div className="flex gap-1 rounded-lg bg-secondary p-1">
            {(["all", "missed"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={cn("rounded-md px-3 py-1 text-sm font-semibold", filter === f ? "bg-white text-primary shadow-sm" : "text-muted-foreground")}>
                {f === "all" ? "All questions" : "Missed only"}
              </button>
            ))}
          </div>
        </div>
        {(aiMarked || basicMarked) && (
          <p className={cn("mt-3 flex items-start gap-2 rounded-xl p-3 text-sm", aiMarked ? "bg-indigo-50 text-indigo-900" : "bg-amber-50 text-amber-900")}>
            {aiMarked ? <Sparkles className="mt-0.5 size-4 shrink-0" /> : <AlertTriangle className="mt-0.5 size-4 shrink-0" />}
            {aiMarked ? "Written answers were marked by Claude on meaning against the model answer." : "Written answers were marked by keyword match because AI marking isn't switched on."}
          </p>
        )}
        <ol className="mt-5 space-y-5">
          {shown.map((q) => {
            const i = attempt.questions.indexOf(q);
            const a = answers[q.id];
            const key = q.key;
            return (
              <li key={q.id} className="rounded-3xl border bg-white p-5 sm:p-6">
                <div className="mb-3 flex justify-end">{q.mark ? <MarkBadge mark={q.mark} /> : null}</div>
                <QuestionStem q={q} number={i + 1} total={attempt.questions.length} />
                {q.type === "choice" ? (
                  <ul className="mt-4 space-y-2">
                    {q.options.map((o, oi) => {
                      const mine = a?.optionIndex === oi;
                      const right = key?.correctIndex === oi;
                      return (
                        <li
                          key={oi}
                          className={cn(
                            "flex items-start gap-3 rounded-xl border-2 p-3",
                            right ? "border-emerald-400 bg-emerald-50" : mine ? "border-red-300 bg-red-50" : "border-transparent bg-secondary/40",
                          )}
                        >
                          <span className={cn("grid size-7 flex-none place-items-center rounded-lg text-xs font-black", right ? "bg-emerald-500 text-white" : mine ? "bg-red-500 text-white" : "bg-white text-primary")}>
                            {LETTERS[oi]}
                          </span>
                          <div className="flex-1">
                            <RichText text={o.text} className="text-sm text-primary" />
                            {o.imageUrl && <img src={o.imageUrl} alt="" className="mt-2 max-h-32 rounded-lg border" />}
                            {(mine || right) && key?.optionHints[oi] && <RichText text={key.optionHints[oi]} className="mt-1 text-xs text-muted-foreground" />}
                          </div>
                          {right && <CheckCircle2 className="size-5 flex-none text-emerald-600" aria-label="Correct answer" />}
                          {mine && !right && <XCircle className="size-5 flex-none text-red-500" aria-label="Your answer" />}
                        </li>
                      );
                    })}
                    {!answered(a) && <li className="text-xs font-semibold text-muted-foreground">You didn't answer this one.</li>}
                  </ul>
                ) : (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl border bg-secondary/30 p-3">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">Your answer</p>
                      <TextBlock text={a?.text?.trim() || "No answer given."} className="mt-1 text-sm text-primary" />
                    </div>
                    {q.mark?.feedback && (
                      <p className="flex items-start gap-2 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-950">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-indigo-600" /> <RichText text={q.mark.feedback} inline />
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-4">
                  <Lesson answer={q.type === "text" ? key?.answer : null} explanation={key?.explanation} />
                </div>
                <div className="mt-4">
                  <DiscussionToggle questionId={q.id} count={q.discussionCount} />
                </div>
              </li>
            );
          })}
        </ol>
        {shown.length === 0 && <p className="mt-6 rounded-2xl bg-emerald-50 p-6 text-center font-semibold text-emerald-800">Nothing missed — every answer was correct.</p>}
      </Container>
    </div>
  );
}
