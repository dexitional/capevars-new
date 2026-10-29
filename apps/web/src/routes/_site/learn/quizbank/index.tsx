import { useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { BookOpenCheck, Brain, GraduationCap, Hash, LayoutDashboard, Loader2, Search, Settings2, Tags, Timer, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { QB_LEVELS, QB_LEVEL_IDS } from "#/lib/quizbank";
import type { QbLevel } from "#/lib/quizbank";
import { useMember } from "#/hooks/useMember";
import { CardGridSkeleton, Container, EmptyState, Pager, SectionHeader } from "#/components/site/kit";
import { QbCourseTile, percent } from "#/components/quizbank/kit";
import type { QbCourseCard } from "#/components/quizbank/kit";
import { ExamSettingsDialog, useStartExam } from "#/components/quizbank/exam-settings";
import { StudySets } from "#/components/quizbank/topics";
import { Button } from "#/components/ui/button";

const search = z.object({
  q: z.string().optional().catch(undefined),
  level: z.enum(QB_LEVEL_IDS).optional().catch(undefined),
  tag: z.string().optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

type BoardItem = QbCourseCard & { settings: { examQuestions: number; examMinutes: number }; topics: Array<{ id: number; name: string }>; matching: number; studyPosition: number; examsTaken: number; best: number | null; last: number | null };
type Home = { levels: Partial<Record<QbLevel, { courses: number; questions: number }>>; tags: Array<{ name: string; slug: string; count: number }>; boardCount: number };

export const Route = createFileRoute("/_site/learn/quizbank/")({
  validateSearch: search,
  head: () => ({ meta: [{ title: "Quizbank — practise past questions | OpenLearn" }] }),
  component: QuizbankHome,
});

function StudyBoard() {
  const { data, refetch } = useQuery({ queryKey: ["qb-board"], queryFn: () => api.get<{ items: Array<BoardItem> }>("/learn/quizbank/board") });
  const [editing, setEditing] = useState<BoardItem | null>(null);
  const start = useStartExam();
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/learn/quizbank/board/${id}`),
    onSuccess: () => {
      toast.success("Removed from your Study Board");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <CardGridSkeleton count={3} className="mt-4" />;
  if (data.items.length === 0)
    return (
      <EmptyState
        icon={LayoutDashboard}
        title="Your Study Board is empty"
        text="Add the courses you're preparing for. Each one gets an exam simulation and a guided study mode."
        className="py-10"
      />
    );
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((c) => (
          <QbCourseTile
            key={c.id}
            c={c}
            footer={
              <>
                <div className="mb-3 grid grid-cols-3 gap-2 rounded-xl bg-secondary/60 p-2 text-center">
                  <div>
                    <p className="text-sm font-black text-primary">{c.examsTaken}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Exams</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary">{percent(c.best)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">Best</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-primary">
                      {Math.min(c.studyPosition, c.questionCount)}/{c.questionCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">Studied</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1" disabled={start.isPending} onClick={() => start.mutate({ courseId: c.id })}>
                    {start.isPending && start.variables.courseId === c.id ? <Loader2 className="animate-spin" /> : <Timer />} Exam
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/learn/quizbank/c/$slug/study" params={{ slug: c.slug }}>
                      <Brain /> Study
                    </Link>
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing(c)} aria-label={`Study plan for ${c.title}`} title="Topics & exam settings">
                    <Settings2 />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => confirm(`Remove ${c.title} from your Study Board?`) && remove.mutate(c.id)} aria-label={`Remove ${c.title}`} title="Remove">
                    <X />
                  </Button>
                </div>
                <p className="mt-2 flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                  <Tags className="size-3" />
                  {c.topics.length ? (
                    <>
                      {c.topics.map((t) => (
                        <span key={t.id} className="rounded-full bg-indigo-50 px-1.5 font-semibold text-indigo-800">
                          {t.name}
                        </span>
                      ))}
                      <span>
                        · {c.matching} of {c.questionCount} questions
                      </span>
                    </>
                  ) : (
                    <span>All topics</span>
                  )}
                  <span>
                    · exam {c.settings.examQuestions} Qs in {c.settings.examMinutes} min
                  </span>
                </p>
              </>
            }
          />
        ))}
      </div>
      {editing && <ExamSettingsDialog course={editing} value={editing.settings} tagIds={editing.topics.map((t) => t.id)} onClose={() => setEditing(null)} onSaved={() => void refetch()} />}
    </>
  );
}

function QuizbankHome() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const member = useMember();
  const [q, setQ] = useState(s.q ?? "");
  const page = s.page ?? 1;
  const { data: home } = useQuery({ queryKey: ["qb-home"], queryFn: () => api.get<Home>("/learn/quizbank/home"), staleTime: 60_000 });
  const { data, isFetching } = useQuery({
    queryKey: ["qb-courses", s],
    queryFn: () => api.get<{ items: Array<QbCourseCard>; total: number }>("/learn/quizbank/courses", { ...s, page, pageSize: 24 }),
    placeholderData: keepPreviousData,
  });
  const totals = Object.values(home?.levels ?? {}).reduce((t, l) => ({ courses: t.courses + l.courses, questions: t.questions + l.questions }), { courses: 0, questions: 0 });
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 py-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">OpenLearn · Quizbank</p>
            <h1 className="mt-3 font-hero text-4xl leading-tight font-bold sm:text-5xl">
              Practise until it <span className="text-amber-300">clicks.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              Past and practice questions for Tertiary, SHS, JHS, TVET and NVTI — sit timed exam simulations, or study each question with hints and clear explanations.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                set({ q: q || undefined });
              }}
              className="mt-7 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2"
            >
              <Search className="ml-3 size-5 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a course, e.g. Core Maths, ECON 101" className="flex-1 bg-transparent py-2.5 text-foreground outline-none" />
              <button className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#041d40]">Search</button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [GraduationCap, totals.courses.toLocaleString(), "Courses"],
              [BookOpenCheck, totals.questions.toLocaleString(), "Questions"],
              [Timer, "Timed", "Exam simulations"],
              [Brain, "Guided", "Study with hints"],
            ].map(([Icon, value, label]) => {
              const I = Icon as typeof Brain;
              return (
                <div key={label as string} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                  <I className="size-6 text-amber-300" />
                  <p className="mt-3 text-2xl font-black">{value as string}</p>
                  <p className="text-sm text-white/70">{label as string}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {member && (
        <Container className="mt-10">
          <SectionHeader title="My Study Board" />
          <StudyBoard />
        </Container>
      )}
      {member && (
        <Container className="mt-10">
          <StudySets />
        </Container>
      )}

      <Container className="mt-10">
        <SectionHeader title="Find a course" />
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Level">
          {[undefined, ...QB_LEVEL_IDS].map((level) => {
            const count = level ? (home?.levels[level]?.courses ?? 0) : totals.courses;
            return (
              <button
                key={level ?? "all"}
                type="button"
                role="tab"
                aria-selected={s.level === level}
                onClick={() => set({ level })}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-bold transition-colors",
                  s.level === level ? "border-primary bg-primary text-white" : "bg-white text-primary hover:border-primary/40",
                )}
              >
                {level ? QB_LEVELS[level] : "All levels"}
                <span className={cn("ml-2 text-xs font-semibold", s.level === level ? "text-white/70" : "text-muted-foreground")}>{count}</span>
              </button>
            );
          })}
        </div>
        {home && home.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <Hash className="size-4 text-muted-foreground" aria-hidden="true" />
            {home.tags.map((t) => (
              <button
                key={t.slug}
                type="button"
                onClick={() => set({ tag: s.tag === t.slug ? undefined : t.slug })}
                aria-pressed={s.tag === t.slug}
                className={cn("rounded-full px-3 py-1 text-xs font-semibold", s.tag === t.slug ? "bg-amber-400 text-[#041d40]" : "bg-secondary text-primary hover:bg-accent")}
              >
                {t.name} <span className="opacity-60">{t.count}</span>
              </button>
            ))}
          </div>
        )}
        {(s.q || s.tag) && (
          <p className="mt-3 text-sm text-muted-foreground">
            {data?.total ?? 0} result{data?.total === 1 ? "" : "s"}
            {s.q && ` for “${s.q}”`}
            {s.tag && ` tagged #${home?.tags.find((t) => t.slug === s.tag)?.name ?? s.tag}`} ·{" "}
            <button
              type="button"
              className="font-semibold text-primary underline"
              onClick={() => {
                setQ("");
                set({ q: undefined, tag: undefined });
              }}
            >
              clear
            </button>
          </p>
        )}
        <div className={cn("mt-5 transition-opacity", isFetching && "opacity-60")}>
          {!data ? (
            <CardGridSkeleton count={6} />
          ) : data.items.length === 0 ? (
            <EmptyState icon={Search} title="No courses found" text="Try another level, tag or search term." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.items.map((c) => (
                <QbCourseTile key={c.id} c={c} />
              ))}
            </div>
          )}
        </div>
        {data && <Pager page={page} pageSize={24} total={data.total} onPage={(p) => void navigate({ search: (prev) => ({ ...prev, page: p }) })} />}
      </Container>
    </div>
  );
}
