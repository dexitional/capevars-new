// Topic filtering and study sets: choosing which topic tags a course (or a mix
// of courses) draws questions from, and the member's saved study sets.
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Brain, Check, Layers, Loader2, Pencil, Plus, Search, Tags, Timer, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { qbVariationSchema } from "#/lib/quizbank";
import type { QbLevel, QbTopic, QbVariationInput } from "#/lib/quizbank";
import { Field } from "#/components/admin/ui";
import { EmptyState } from "#/components/site/kit";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { ExamSettingsFields, clampSettings, useStartExam } from "./exam-settings";
import { LevelBadge, percent } from "./kit";
import type { QbCourseCard } from "./kit";

export interface Topics {
  topics: Array<QbTopic>;
  total: number;
  untagged: number;
  matching: number;
}

// Topics of these courses, and how many questions the chosen ones cover.
export function useTopics(courseIds: Array<number>, tagIds: Array<number>, enabled = true) {
  return useQuery({
    queryKey: ["qb-topics", courseIds, tagIds],
    queryFn: () => api.get<Topics>("/learn/quizbank/topics", { courses: courseIds.join(","), tags: tagIds.join(",") }),
    enabled: enabled && courseIds.length > 0,
    placeholderData: keepPreviousData,
  });
}

// Chips to narrow questions to some topics. None chosen means every question;
// each topic added widens the mix.
export function TopicPicker({ data, value, onChange, className }: { data: Topics | undefined; value: Array<number>; onChange: (ids: Array<number>) => void; className?: string }) {
  if (!data) return <p className="text-xs text-muted-foreground">Loading topics…</p>;
  if (!data.topics.length) return <p className={cn("text-xs text-muted-foreground", className)}>No topic tags on these questions yet — every question is included.</p>;
  const chosen = new Set(value);
  const toggle = (id: number) => onChange(chosen.has(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange([])}
          aria-pressed={value.length === 0}
          className={cn("rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset", value.length === 0 ? "bg-primary text-white ring-primary" : "bg-white text-primary ring-border hover:bg-secondary")}
        >
          All topics <span className="opacity-70">{data.total}</span>
        </button>
        {data.topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => toggle(t.id)}
            aria-pressed={chosen.has(t.id)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-colors",
              chosen.has(t.id) ? "bg-indigo-600 text-white ring-indigo-600" : "bg-white text-primary ring-border hover:bg-indigo-50",
            )}
          >
            {chosen.has(t.id) && <Check className="size-3" />}
            {t.name} <span className="opacity-70">{t.count}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {value.length === 0 ? (
          <>All {data.total} questions are in the mix.</>
        ) : (
          <>
            <strong className="text-primary">{data.matching}</strong> of {data.total} questions match {value.length === 1 ? "this topic" : `these ${value.length} topics`}. Add topics for more variety.
          </>
        )}
      </p>
    </div>
  );
}

// ---- Study sets ---------------------------------------------------------------------------------

export interface StudySet {
  id: number;
  name: string;
  courses: Array<{ id: number; slug: string; title: string; level: QbLevel }>;
  topics: Array<{ id: number; name: string }>;
  examQuestions: number;
  examMinutes: number;
  studyPosition: number;
  questionCount: number;
  examsTaken: number;
  best: number | null;
}

type CourseOption = Pick<QbCourseCard, "id" | "title" | "level" | "code">;

function CoursePicker({ value, onChange, known }: { value: Array<number>; onChange: (ids: Array<number>) => void; known: Map<number, CourseOption> }) {
  const [q, setQ] = useState("");
  const { data: board } = useQuery({ queryKey: ["qb-board"], queryFn: () => api.get<{ items: Array<QbCourseCard> }>("/learn/quizbank/board") });
  const { data: found } = useQuery({
    queryKey: ["qb-courses", { q }],
    queryFn: () => api.get<{ items: Array<QbCourseCard> }>("/learn/quizbank/courses", { q, pageSize: 12 }),
    enabled: q.trim().length > 1,
  });
  const options = q.trim().length > 1 ? (found?.items ?? []) : (board?.items ?? []);
  for (const c of [...(board?.items ?? []), ...(found?.items ?? [])]) known.set(c.id, c);
  const chosen = new Set(value);
  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((id) => (
            <span key={id} className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
              {known.get(id)?.title ?? `Course #${id}`}
              <button type="button" onClick={() => onChange(value.filter((x) => x !== id))} aria-label="Remove course" className="opacity-70 hover:opacity-100">
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all courses, or pick from your board below" className="pl-9" />
      </div>
      <div className="grid max-h-44 gap-1 overflow-y-auto rounded-lg border p-1.5 sm:grid-cols-2">
        {options.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onChange(chosen.has(c.id) ? value.filter((x) => x !== c.id) : [...value, c.id])}
            className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm", chosen.has(c.id) ? "bg-primary/10 font-semibold text-primary" : "hover:bg-secondary")}
          >
            <span className={cn("grid size-4 place-items-center rounded border", chosen.has(c.id) ? "border-primary bg-primary text-white" : "border-input")}>{chosen.has(c.id) && <Check className="size-3" />}</span>
            <span className="truncate">{c.title}</span>
            <LevelBadge level={c.level} className="ml-auto shrink-0 px-1.5 text-[9px]" />
          </button>
        ))}
        {options.length === 0 && <p className="p-2 text-xs text-muted-foreground sm:col-span-2">{q.trim().length > 1 ? "No courses match." : "Your Study Board is empty — search for a course."}</p>}
      </div>
    </div>
  );
}

export function StudySetDialog({ initial, id, onClose, onSaved }: { initial: QbVariationInput; id?: number; onClose: () => void; onSaved?: () => void }) {
  const [d, setD] = useState<QbVariationInput>(initial);
  const known = useMemo(() => new Map<number, CourseOption>(), []);
  const topics = useTopics(d.courseIds, d.tagIds ?? []);
  const set = (patch: Partial<QbVariationInput>) => setD((prev) => ({ ...prev, ...patch }));
  // Drop topics that no longer belong to the chosen courses.
  const validTags = (d.tagIds ?? []).filter((t) => !topics.data || topics.data.topics.some((x) => x.id === t));
  const save = useMutation({
    mutationFn: () => {
      const parsed = qbVariationSchema.safeParse({ ...d, tagIds: validTags, ...clampSettings({ examQuestions: d.examQuestions ?? 20, examMinutes: d.examMinutes ?? 30 }, topics.data?.matching ?? 200) });
      if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the form");
      return id ? api.patch(`/learn/quizbank/variations/${id}`, parsed.data) : api.post("/learn/quizbank/variations", parsed.data);
    },
    onSuccess: () => {
      toast.success(id ? "Study set saved" : "Study set created");
      onSaved?.();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{id ? "Edit study set" : "New study set"}</DialogTitle>
          <DialogDescription>Mix questions from one or more courses, narrowed to the topics you choose. Study it or sit it as a timed exam any time.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Name">
            <Input value={d.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Algebra & Geometry revision" required maxLength={120} />
          </Field>
          <Field label="Courses">
            <CoursePicker value={d.courseIds} onChange={(courseIds) => set({ courseIds })} known={known} />
          </Field>
          <Field label="Topics" hint="More topics, more variety. Pick one or two to focus.">
            {d.courseIds.length ? <TopicPicker data={topics.data} value={validTags} onChange={(tagIds) => set({ tagIds })} /> : <p className="text-xs text-muted-foreground">Pick a course first.</p>}
          </Field>
          <Field label="Exam simulation">
            <ExamSettingsFields
              value={{ examQuestions: d.examQuestions ?? 20, examMinutes: d.examMinutes ?? 30 }}
              max={topics.data?.matching ?? 200}
              onChange={(v) => set({ examQuestions: v.examQuestions, examMinutes: v.examMinutes })}
            />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending || !d.courseIds.length || topics.data?.matching === 0}>
              {save.isPending && <Loader2 className="animate-spin" />} {id ? "Save set" : "Create set"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const SET_COLORS = ["from-indigo-600 to-violet-700", "from-sky-600 to-indigo-700", "from-emerald-600 to-teal-700", "from-amber-500 to-orange-600", "from-rose-500 to-fuchsia-700"];

export function StudySets() {
  const { data, refetch } = useQuery({ queryKey: ["qb-variations"], queryFn: () => api.get<{ items: Array<StudySet> }>("/learn/quizbank/variations") });
  const [editing, setEditing] = useState<StudySet | "new" | null>(null);
  const start = useStartExam();
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/learn/quizbank/variations/${id}`),
    onSuccess: () => void refetch(),
    onError: (e) => toast.error(e.message),
  });
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-primary sm:text-2xl">My study sets</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your own mixes of courses and topics — study or simulate them any time.</p>
        </div>
        <Button onClick={() => setEditing("new")}>
          <Plus /> New study set
        </Button>
      </div>
      {!data ? null : data.items.length === 0 ? (
        <EmptyState icon={Layers} title="No study sets yet" text="Combine courses and pick topics — e.g. just Algebra from Core Maths, or Physics across two science courses." className="py-8" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((v, i) => (
            <div key={v.id} className="flex flex-col overflow-hidden rounded-2xl border bg-white">
              <div className={cn("relative bg-linear-to-br p-4 text-white", SET_COLORS[i % SET_COLORS.length])}>
                <div className="dot-grid absolute inset-0 opacity-25" aria-hidden="true" />
                <p className="relative flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-white/75 uppercase">
                  <Layers className="size-3.5" /> Study set · {v.questionCount} questions
                </p>
                <p className="relative mt-1 line-clamp-2 text-lg leading-tight font-black">{v.name}</p>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="line-clamp-2 text-xs text-muted-foreground">{v.courses.map((c) => c.title).join(" + ") || "No live courses"}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {v.topics.length ? (
                    v.topics.map((t) => (
                      <span key={t.id} className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-800">
                        <Tags className="size-3" /> {t.name}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-primary">All topics</span>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {v.examsTaken} exam{v.examsTaken === 1 ? "" : "s"} · best {percent(v.best)} · {v.examQuestions} Qs in {v.examMinutes} min
                </p>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <Button size="sm" className="flex-1" disabled={start.isPending || !v.questionCount} onClick={() => start.mutate({ variationId: v.id })}>
                    {start.isPending && start.variables.variationId === v.id ? <Loader2 className="animate-spin" /> : <Timer />} Exam
                  </Button>
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to="/learn/quizbank/s/$id" params={{ id: String(v.id) }}>
                      <Brain /> Study
                    </Link>
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing(v)} aria-label={`Edit ${v.name}`}>
                    <Pencil />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => confirm(`Delete the study set "${v.name}"?`) && remove.mutate(v.id)} aria-label={`Delete ${v.name}`}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editing && (
        <StudySetDialog
          id={editing === "new" ? undefined : editing.id}
          initial={
            editing === "new"
              ? { name: "", courseIds: [], tagIds: [], examQuestions: 20, examMinutes: 30 }
              : { name: editing.name, courseIds: editing.courses.map((c) => c.id), tagIds: editing.topics.map((t) => t.id), examQuestions: editing.examQuestions, examMinutes: editing.examMinutes }
          }
          onClose={() => setEditing(null)}
          onSaved={() => void refetch()}
        />
      )}
    </div>
  );
}
