// Study mode: no timer. Picking an option slides its hint open beneath it and the
// right option unveils the lesson behind it; a written question shows its model answer
// and lesson straight away (written answers are only typed and marked in exams).
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Eye, Lightbulb, Loader2, Tags, Timer, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import type { QbMark, QbPublicQuestion } from "#/lib/quizbank";
import { Container } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { LETTERS, Lesson, QuestionStem, SlideDown } from "./kit";
import { RichText } from "./rich-text";
import { DiscussionToggle } from "./discussion";

type Reveal = { correctIndex: number | null; answer: string | null; explanation: string | null };
type Check = { mark: QbMark; hint: string | null } & Partial<Reveal>;
interface QState {
  hints: Record<number, string | null>; // options tried → their hint
  wrong: Array<number>;
  solved?: number;
  reveal?: Reveal;
}

export function Studier({
  header,
  topics,
  questions,
  position,
  positionUrl,
  onExam,
  examPending,
}: {
  header: React.ReactNode;
  topics: Array<string>;
  questions: Array<QbPublicQuestion>;
  position: number;
  positionUrl: string; // where progress is saved; "" for a one-off session
  onExam: () => void;
  examPending: boolean;
}) {
  const [index, setIndex] = useState(position);
  const [states, setStates] = useState<Record<number, QState | undefined>>({});
  const total = questions.length;
  const q = questions[index];
  const state: QState = (q && states[q.id]) || { hints: {}, wrong: [] };
  const update = (id: number, patch: Partial<QState>) => setStates((prev) => ({ ...prev, [id]: { ...(prev[id] ?? { hints: {}, wrong: [] }), ...patch } }));

  const check = useMutation({
    mutationFn: (body: { optionIndex: number }) => api.post<Check>(`/learn/quizbank/questions/${q!.id}/check`, body),
    onSuccess: (r, { optionIndex: oi }) => {
      if (!q) return;
      const hints = { ...state.hints, [oi]: r.hint };
      if (r.mark.correct) update(q.id, { hints, solved: oi, reveal: { correctIndex: r.correctIndex ?? null, answer: r.answer ?? null, explanation: r.explanation ?? null } });
      else update(q.id, { hints, wrong: [...state.wrong, oi] });
    },
    onError: (e) => toast.error(e.message),
  });
  const giveUp = useMutation({
    mutationFn: () => api.post<Reveal>(`/learn/quizbank/questions/${q!.id}/reveal`),
    onSuccess: (r) => q && update(q.id, { reveal: r, solved: r.correctIndex ?? undefined }),
    onError: (e) => toast.error(e.message),
  });
  // A written question's model answer and lesson, loaded as soon as it is shown.
  const lesson = useQuery({
    queryKey: ["qb-lesson", q?.id],
    queryFn: () => api.post<Reveal>(`/learn/quizbank/questions/${q!.id}/reveal`),
    enabled: q?.type === "text",
    staleTime: Infinity,
  });

  const go = (i: number) => {
    setIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (positionUrl) void api.post(positionUrl, { position: i }).catch(() => undefined);
  };

  // A–H pick an option; ← → move between questions.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowRight" && index < total - 1) go(index + 1);
      else if (e.key === "ArrowLeft" && index > 0) go(index - 1);
      else if (q.type === "choice" && state.solved === undefined && !check.isPending) {
        const oi = LETTERS.indexOf(e.key.toUpperCase());
        if (oi >= 0 && oi < q.options.length && !state.wrong.includes(oi)) check.mutate({ optionIndex: oi });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!q) return null;
  const solvedCount = questions.filter((x) => states[x.id]?.solved !== undefined).length;

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="border-b bg-white">
        <Container className="flex flex-wrap items-center gap-3 py-3">
          <div className="min-w-0 flex-1">{header}</div>
          <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">
            <Brain className="size-3.5" /> Study mode · no timer
          </span>
          <Button size="sm" variant="outline" disabled={examPending} onClick={onExam}>
            <Timer /> Take an exam
          </Button>
        </Container>
        {topics.length > 0 && (
          <Container className="flex flex-wrap items-center gap-1.5 pb-3 text-xs">
            <Tags className="size-3.5 text-muted-foreground" aria-hidden="true" />
            <span className="text-muted-foreground">Topics:</span>
            {topics.map((t) => (
              <span key={t} className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-800">
                {t}
              </span>
            ))}
          </Container>
        )}
        <div className="h-1.5 bg-secondary">
          <div className="h-full bg-linear-to-r from-amber-400 to-emerald-500 transition-[width] duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      <Container className="mt-6 max-w-3xl">
        <p className="mb-3 text-right text-xs text-muted-foreground">
          {solvedCount} answered correctly this session · {q.type === "choice" ? `keys A–${LETTERS[q.options.length - 1]} pick, ` : ""}← → move
        </p>
        <article className="rounded-3xl border bg-white p-5 shadow-sm sm:p-8">
          <QuestionStem q={q} number={index + 1} total={total} />
          {q.hint && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Lightbulb className="mt-0.5 size-4 shrink-0" /> <RichText text={q.hint} inline />
            </p>
          )}

          {q.type === "choice" ? (
            <ul className="mt-6 space-y-2.5">
              {q.options.map((o, i) => {
                const tried = i in state.hints;
                const isRight = state.solved === i || state.reveal?.correctIndex === i;
                const isWrong = state.wrong.includes(i);
                const locked = state.solved !== undefined || isWrong;
                const hint = state.hints[i];
                return (
                  <li key={i}>
                    <button
                      type="button"
                      disabled={locked || check.isPending}
                      onClick={() => check.mutate({ optionIndex: i })}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all disabled:cursor-default",
                        isRight ? "border-emerald-500 bg-emerald-50" : isWrong ? "border-red-300 bg-red-50/70" : "border-border hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm",
                        locked && !isRight && !isWrong && "opacity-60",
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-8 flex-none place-items-center rounded-xl text-sm font-black",
                          isRight ? "bg-emerald-500 text-white" : isWrong ? "bg-red-500 text-white" : "bg-secondary text-primary",
                        )}
                      >
                        {check.isPending && check.variables.optionIndex === i ? <Loader2 className="size-4 animate-spin" /> : LETTERS[i]}
                      </span>
                      <span className="flex-1 pt-1">
                        <RichText text={o.text} className="text-[15px] text-primary" />
                        {o.imageUrl && <img src={o.imageUrl} alt="" className="mt-2 max-h-40 rounded-lg border" />}
                      </span>
                      {isRight && <CheckCircle2 className="mt-1 size-5 flex-none text-emerald-600" />}
                      {isWrong && <XCircle className="mt-1 size-5 flex-none text-red-500" />}
                    </button>
                    <SlideDown open={tried} className="px-2 pt-2">
                      <div
                        className={cn(
                          "flex items-start gap-2 rounded-xl border-l-4 px-3 py-2 text-sm",
                          isRight ? "border-emerald-500 bg-emerald-50 text-emerald-950" : "border-red-400 bg-red-50 text-red-950",
                        )}
                      >
                        <Lightbulb className={cn("mt-0.5 size-4 shrink-0", isRight ? "text-emerald-600" : "text-red-500")} />
                        <span>
                          <strong>{isRight ? "Correct. " : "Not quite. "}</strong>
                          <RichText text={hint ?? (isRight ? "Well done." : "Think again about what the question is asking, then try another option.")} inline />
                        </span>
                      </div>
                    </SlideDown>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-6">
              {lesson.data ? (
                <Lesson answer={lesson.data.answer} explanation={lesson.data.explanation} title="Model answer & lesson" />
              ) : lesson.isError ? (
                <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  Couldn't load the model answer.{" "}
                  <button type="button" onClick={() => void lesson.refetch()} className="font-semibold underline">
                    Try again
                  </button>
                </p>
              ) : (
                <p className="flex items-center gap-2 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 text-sm text-indigo-800">
                  <Loader2 className="size-4 animate-spin" /> Loading the model answer…
                </p>
              )}
            </div>
          )}

          {q.type === "choice" && (
            <SlideDown open={Boolean(state.reveal)} className="mt-5">
              <Lesson explanation={state.reveal?.explanation} title="The lesson behind it" />
            </SlideDown>
          )}

          {q.type === "choice" && !state.reveal && state.wrong.length > 0 && (
            <button type="button" onClick={() => giveUp.mutate()} disabled={giveUp.isPending} className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary">
              <Eye className="size-4" /> Show me the answer
            </button>
          )}

          <div className="mt-6">
            <DiscussionToggle questionId={q.id} count={q.discussionCount} />
          </div>
        </article>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button variant="outline" disabled={index === 0} onClick={() => go(index - 1)}>
            <ArrowLeft /> Previous
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">
            {index + 1} / {total}
          </span>
          {index < total - 1 ? (
            <Button onClick={() => go(index + 1)}>
              Next <ArrowRight />
            </Button>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="size-4" /> End of the set
            </span>
          )}
        </div>
      </Container>
    </div>
  );
}
