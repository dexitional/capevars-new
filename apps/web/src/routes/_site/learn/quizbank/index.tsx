import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, BookOpenCheck, Brain, Crown, Flame, GraduationCap, Hash, LayoutDashboard, Loader2, Search, Settings2, Tags, Timer, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { QB_LEVELS, QB_LEVEL_IDS } from "#/lib/quizbank";
import { breadcrumbJsonLd, pageSeo } from "#/lib/seo";
import type { QbLevel } from "#/lib/quizbank";
import { useMember } from "#/hooks/useMember";
import { CardGridSkeleton, Container, EmptyState, Pager, SectionHeader } from "#/components/site/kit";
import { LevelBadge, QbCourseTile, percent } from "#/components/quizbank/kit";
import type { QbCourseCard } from "#/components/quizbank/kit";
import { ExamSettingsDialog, useStartExam } from "#/components/quizbank/exam-settings";
import { StudySets } from "#/components/quizbank/topics";
import { BookmarksBar } from "#/components/quizbank/bookmarks";
import { Button } from "#/components/ui/button";

const search = z.object({
  q: z.string().optional().catch(undefined),
  level: z.enum(QB_LEVEL_IDS).optional().catch(undefined),
  tag: z.string().optional().catch(undefined),
  page: z.coerce.number().optional().catch(undefined),
});
type S = z.infer<typeof search>;

type BoardItem = QbCourseCard & { settings: { examQuestions: number; examMinutes: number }; topics: Array<{ id: number; name: string }>; matching: number; studyPosition: number; examsTaken: number; best: number | null; last: number | null };
type Home = { levels: Partial<Record<QbLevel, { courses: number; questions: number }>>; tags: Array<{ name: string; slug: string; count: number }>; popular: Array<{ slug: string; code: string; title: string; level: QbLevel; questionCount: number }>; boardCount: number };

const homeQuery = { queryKey: ["qb-home"], queryFn: () => api.get<Home>("/learn/quizbank/home"), staleTime: 60_000 };
const coursesQuery = (s: S) => ({
  queryKey: ["qb-courses", s],
  queryFn: () => api.get<{ items: Array<QbCourseCard>; total: number }>("/learn/quizbank/courses", { ...s, page: s.page ?? 1, pageSize: 24 }),
  staleTime: 30_000,
});

export const Route = createFileRoute("/_site/learn/quizbank/")({
  validateSearch: search,
  loaderDeps: ({ search: s }) => s,
  // On the server, so the courses arrive with the page: for visitors with no wait, and for search engines to see at all.
  loader: async ({ context, deps }) => {
    await Promise.all([context.queryClient.prefetchQuery(homeQuery), context.queryClient.prefetchQuery(coursesQuery(deps))]);
  },
  head: () =>
    pageSeo({
      title: "Quizbank: Past Questions & Practice Exams for BECE, WASSCE and University | Capevars",
      description: "Practise past and practice questions for JHS, SHS, TVET, NVTI and tertiary courses in Ghana. Sit timed mock exams or study each question with hints, answers and clear explanations.",
      path: "/learn/quizbank",
      jsonLd: [breadcrumbJsonLd([["OpenLearn", "/learn"], ["Quizbank", "/learn/quizbank"]])],
    }),
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
                  {c.fee !== null && !c.subscribed ? (
                    <Button asChild size="sm" className="flex-1">
                      <Link to="/learn/quizbank/c/$slug" params={{ slug: c.slug }}>
                        <Crown /> Subscribe
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" className="flex-1" disabled={start.isPending} onClick={() => start.mutate({ courseId: c.id })}>
                        {start.isPending && start.variables.courseId === c.id ? <Loader2 className="animate-spin" /> : <Timer />} Exam
                      </Button>
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link to="/learn/quizbank/c/$slug/study" params={{ slug: c.slug }}>
                          <Brain /> Study
                        </Link>
                      </Button>
                    </>
                  )}
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

/**
 * Moves a sideways-scrolling row along one item every few seconds, reversing direction at either end.
 * It holds still while the row is hovered or focused, for a while after the visitor scrolls it themselves,
 * and entirely for visitors who prefer reduced motion.
 */
function useStepScroll(ref: RefObject<HTMLElement | null>, items: number, every = 2500, holdAfterTouch = 8000) {
  useEffect(() => {
    const row = ref.current;
    if (!row || !items || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let hovered = false;
    let heldUntil = 0;
    const hold = () => (heldUntil = Date.now() + holdAfterTouch);
    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    let forward = true;
    const tick = () => {
      if (hovered || document.hidden || Date.now() < heldUntil || row.contains(document.activeElement)) return;
      if (row.scrollWidth <= row.clientWidth) return;
      if (forward && row.scrollLeft + row.clientWidth >= row.scrollWidth - 2) forward = false;
      else if (!forward && row.scrollLeft <= 1) forward = true;
      const children = Array.from(row.children as HTMLCollectionOf<HTMLElement>);
      const next = forward ? children.find((c) => c.offsetLeft > row.scrollLeft + 1) : [...children].reverse().find((c) => c.offsetLeft < row.scrollLeft - 1);
      row.scrollTo({ left: next?.offsetLeft ?? 0, behavior: "smooth" });
    };
    const timer = window.setInterval(tick, every);
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    row.addEventListener("wheel", hold, { passive: true });
    row.addEventListener("touchstart", hold, { passive: true });
    return () => {
      window.clearInterval(timer);
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
      row.removeEventListener("wheel", hold);
      row.removeEventListener("touchstart", hold);
    };
  }, [ref, items, every, holdAfterTouch]);
}

function QuizbankHome() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const goToCourse = useNavigate();
  const set = (patch: Partial<S>) => void navigate({ search: (p) => ({ ...p, page: undefined, ...patch }) });
  const member = useMember();
  const [q, setQ] = useState(s.q ?? "");
  const page = s.page ?? 1;
  const { data: home } = useQuery(homeQuery);
  const tagRow = useRef<HTMLDivElement>(null);
  useStepScroll(tagRow, home?.tags.length ?? 0);
  const popularRow = useRef<HTMLDivElement>(null);
  useStepScroll(popularRow, home?.popular.length ?? 0);
  const { data, isFetching } = useQuery({ ...coursesQuery(s), placeholderData: keepPreviousData });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const resultsSection = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const term = q.trim();
  // Filters without a new history entry or moving the page, so typing feels like one search.
  const sentTerm = useRef(s.q);
  const applySearch = (value: string) => {
    sentTerm.current = value || undefined;
    void navigate({ search: (p) => ({ ...p, page: undefined, q: value || undefined }), replace: true, resetScroll: false });
  };
  // Runs on each keystroke, once the visitor pauses.
  useEffect(() => {
    if (term === (s.q ?? "")) return;
    const timer = window.setTimeout(() => applySearch(term), 250);
    return () => window.clearTimeout(timer);
  }, [q]);
  // The address changed some other way (a link, or Back), so the box follows it.
  useEffect(() => {
    if (s.q === sentTerm.current) return;
    sentTerm.current = s.q;
    setQ(s.q ?? "");
  }, [s.q]);
  const settled = term === (s.q ?? "") && !isFetching;
  const suggestions = data?.items.slice(0, 6) ?? [];
  // Brings the whole list into view, keeping the box clear of the sticky header.
  useEffect(() => {
    if (!open || !term || !panel.current || !input.current) return;
    const below = panel.current.getBoundingClientRect().bottom + 16 - (window.visualViewport?.height ?? window.innerHeight);
    const room = input.current.getBoundingClientRect().top - (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) - 16;
    if (below > 0 && room > 0) window.scrollBy({ top: Math.min(below, room), behavior: "smooth" });
  }, [open, Boolean(term), suggestions.length]);
  const showAll = () => {
    if (term !== (s.q ?? "")) applySearch(term);
    setOpen(false);
    resultsSection.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") setOpen(false);
    else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && term && suggestions.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (e.key === "ArrowDown" ? (i + 1) % suggestions.length : (Math.max(i, 0) + suggestions.length - 1) % suggestions.length));
    } else if (e.key === "Enter" && open && suggestions[active]) {
      e.preventDefault();
      void goToCourse({ to: "/learn/quizbank/c/$slug", params: { slug: suggestions[active].slug } });
    }
  };
  const totals = Object.values(home?.levels ?? {}).reduce((t, l) => ({ courses: t.courses + l.courses, questions: t.questions + l.questions }), { courses: 0, questions: 0 });
  return (
    <div className="pb-16">
      {/* Not overflow-hidden, and stacked above what follows: the live search results hang out of the bottom of the band. */}
      <section className="relative z-10 bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-10 py-14 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">OpenLearn · Quizbank</p>
            <h1 className="mt-3 font-hero text-4xl leading-tight font-bold sm:text-5xl">
              Practise until it <span className="text-amber-300">clicks.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              Past and practice questions for Tertiary, SHS, JHS, TVET and NVTI — sit timed exam simulations, or study each question with hints and clear explanations.
            </p>
            <div
              className="relative mt-7 max-w-xl"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showAll();
                }}
                className="flex items-center gap-2 rounded-2xl bg-white p-2"
              >
                <Search className="ml-3 size-5 shrink-0 text-muted-foreground" />
                <input
                  ref={input}
                  value={q}
                  maxLength={100}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setOpen(true);
                    setActive(-1);
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={onSearchKey}
                  placeholder="Search a course, e.g. Core Maths, ECON 101"
                  role="combobox"
                  aria-expanded={open && Boolean(term)}
                  aria-controls="qb-search-results"
                  aria-activedescendant={open && suggestions[active] ? `qb-search-${suggestions[active].id}` : undefined}
                  aria-label="Search courses"
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-foreground outline-none"
                />
                {q && (
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      input.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-primary"
                  >
                    <X className="size-4" />
                  </button>
                )}
                <button className="shrink-0 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-[#041d40]">Search</button>
              </form>
              {open && term && (
                // Keeps focus in the box while clicking here, so its blur doesn't close the list before the click lands.
                <div ref={panel} className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border bg-white text-foreground shadow-xl" onMouseDown={(e) => e.preventDefault()}>
                  {suggestions.length > 0 ? (
                    <ul id="qb-search-results" role="listbox" aria-label="Matching courses" className={cn("max-h-[50vh] divide-y overflow-y-auto transition-opacity", !settled && "opacity-60")}>
                      {suggestions.map((c, i) => (
                        <li key={c.id} id={`qb-search-${c.id}`} role="option" aria-selected={i === active}>
                          <Link to="/learn/quizbank/c/$slug" params={{ slug: c.slug }} tabIndex={-1} className={cn("flex items-center gap-3 px-4 py-2.5 hover:bg-secondary/60", i === active && "bg-secondary/60")}>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-primary">{c.title}</span>
                              <span className="block truncate text-xs text-muted-foreground">
                                {c.code && <span className="font-mono font-bold">{c.code} · </span>}
                                {c.questionCount.toLocaleString()} question{c.questionCount === 1 ? "" : "s"}
                              </span>
                            </span>
                            <LevelBadge level={c.level} className="shrink-0" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : settled ? (
                    <p id="qb-search-results" className="px-4 py-4 text-sm text-muted-foreground">
                      No courses match “{term}”{s.level || s.tag ? " with the level or tag you've picked" : ""}.
                    </p>
                  ) : (
                    <p id="qb-search-results" className="flex items-center gap-2 px-4 py-4 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Searching…
                    </p>
                  )}
                  {suggestions.length > 0 && data && (
                    <button type="button" onClick={showAll} className="flex w-full items-center justify-between gap-2 border-t bg-secondary/40 px-4 py-2.5 text-xs font-bold text-primary hover:bg-secondary">
                      <span>
                        {data.total > suggestions.length ? `See all ${data.total.toLocaleString()} results` : `${data.total.toLocaleString()} result${data.total === 1 ? "" : "s"}`}
                        {s.level && ` in ${QB_LEVELS[s.level]}`}
                      </span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
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

      {home && home.popular.length > 0 && (
        <Container className="mt-6">
          <h2 className="mb-2 flex items-center gap-1.5 text-sm font-black text-primary">
            <Flame className="size-4 text-amber-500" aria-hidden="true" /> Popular course codes
          </h2>
          {/* One row that scrolls sideways on its own (useStepScroll), so the scrollbar is hidden. */}
          <div ref={popularRow} className="relative flex gap-2 no-scrollbar overflow-x-auto py-0.5">
            {home.popular.map((c) => (
              <Link
                key={c.slug}
                to="/learn/quizbank/c/$slug"
                params={{ slug: c.slug }}
                title={c.title}
                className="w-40 shrink-0 rounded-xl border bg-white px-3 py-2 transition-colors hover:border-primary/40 hover:bg-secondary/40"
              >
                <span className="block truncate font-mono text-xs font-bold text-primary">{c.code}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{c.title}</span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {member && (
        <Container className="mt-10">
          <SectionHeader title="My Study Board" />
          <StudyBoard />
        </Container>
      )}
      {member && (
        <Container className="mt-10">
          <BookmarksBar />
        </Container>
      )}
      {member && (
        <Container className="mt-10">
          <StudySets />
        </Container>
      )}

      <Container className="mt-10">
        <div ref={resultsSection} className="scroll-mt-40" aria-hidden="true" />
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
          <div className="mt-4 flex items-center gap-1.5">
            <Hash className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            {/* One row that scrolls sideways on its own (useStepScroll), so the scrollbar is hidden. */}
            <div ref={tagRow} className="relative flex min-w-0 flex-1 gap-1.5 no-scrollbar overflow-x-auto">
              {home.tags.map((t) => (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => set({ tag: s.tag === t.slug ? undefined : t.slug })}
                  aria-pressed={s.tag === t.slug}
                  className={cn("shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold", s.tag === t.slug ? "bg-amber-400 text-[#041d40]" : "bg-secondary text-primary hover:bg-accent")}
                >
                  {t.name} <span className="opacity-60">{t.count}</span>
                </button>
              ))}
            </div>
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
