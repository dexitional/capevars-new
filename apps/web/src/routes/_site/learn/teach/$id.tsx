import { useEffect, useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, CheckCircle2, Circle, Eye, Loader2, Pencil, Plus, Rocket, Trash2, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { COURSE_LEVELS, LESSON_TYPES } from "#/lib/labels";
import { Avatar, Container, FileUpload, ImageUpload, Loading, StatusBadge } from "#/components/site/kit";
import { TagInput } from "#/components/site/tag-input";
import { LESSON_ICONS } from "#/components/learn/lesson-icons";
import { RichTextEditor } from "#/components/admin/rich-text-editor";
import { Field, Switch } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;
type Builder = { course: Row; sections: Array<Row & { lessons: Array<Row & { questions: Array<Row> }> }>; categories: Array<Row>; readiness: { checks: Array<{ key: string; label: string; ok: boolean; detail?: Array<string> }>; ready: boolean } };

export const Route = createFileRoute("/_site/learn/teach/$id")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Course builder | OpenLearn" }] }),
  component: CourseBuilder,
});

type Tab = "details" | "curriculum" | "students" | "publish";

function CourseBuilder() {
  const { id } = Route.useParams();
  const [tab, setTab] = useState<Tab>("details");
  const { data, refetch } = useQuery({ queryKey: ["builder", id], queryFn: () => api.get<Builder>(`/teach/courses/${id}`) });
  if (!data) return <Loading />;
  const c = data.course;
  const tabs: Array<[Tab, string]> = [
    ["details", "1. Details"],
    ["curriculum", "2. Curriculum"],
    ["publish", "3. Publish"],
    ["students", "Students & grading"],
  ];
  return (
    <Container className="py-6">
      <Link to="/learn/teach" className="text-sm text-muted-foreground hover:underline">
        ← Instructor dashboard
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-primary">{c.title}</h1>
        <div className="flex items-center gap-2">
          <StatusBadge status={c.status} />
          <Button asChild size="sm" variant="outline">
            <Link to="/learn/c/$slug" params={{ slug: c.slug }}>
              <Eye /> Preview
            </Link>
          </Button>
        </div>
      </div>
      {c.status === "rejected" && c.review_note && <p className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">Reviewer feedback: {c.review_note}</p>}
      <div className="mt-5 mb-6 flex gap-1 overflow-x-auto rounded-xl bg-white p-1">
        {tabs.map(([k, label]) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-semibold", tab === k ? "bg-sys-learn text-white" : "text-muted-foreground hover:bg-muted")}>
            {label}
          </button>
        ))}
      </div>
      {tab === "details" && <Details data={data} onSaved={() => void refetch()} />}
      {tab === "curriculum" && <Curriculum data={data} onChange={() => void refetch()} />}
      {tab === "publish" && <Publish data={data} onChange={() => void refetch()} />}
      {tab === "students" && <Students courseId={c.id} />}
    </Container>
  );
}

// ---- Details --------------------------------------------------------------------------------

function Details({ data, onSaved }: { data: Builder; onSaved: () => void }) {
  const c = data.course;
  const [f, setF] = useState(() => ({
    title: c.title ?? "",
    subtitle: c.subtitle ?? "",
    categoryId: c.category_id ? String(c.category_id) : "",
    description: c.description ?? "",
    outcomes: (c.outcomes ?? []) as Array<string>,
    requirements: (c.requirements ?? []) as Array<string>,
    audience: (c.audience ?? []) as Array<string>,
    level: c.level ?? "all",
    language: c.language ?? "English",
    coverUrl: (c.cover_url ?? null) as string | null,
    promoVideoUrl: (c.promo_video_url ?? null) as string | null,
    price: String(c.price ?? "0"),
    compareAtPrice: c.compare_at_price ? String(c.compare_at_price) : "",
    certificateEnabled: c.certificate_enabled === 1,
  }));
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useMutation({
    mutationFn: () =>
      api.patch(`/teach/courses/${c.id}`, {
        ...f,
        categoryId: f.categoryId ? Number(f.categoryId) : null,
        price: Number(f.price) || 0,
        compareAtPrice: f.compareAtPrice ? Number(f.compareAtPrice) : null,
      }),
    onSuccess: () => {
      toast.success("Course details saved");
      onSaved();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      className="grid gap-6 lg:grid-cols-[1fr_340px]"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="space-y-5 rounded-2xl border bg-white p-6">
        <Field label="Course title" hint="Clear and specific, e.g. “Microsoft Excel: from beginner to pro”.">
          <Input value={f.title} onChange={(e) => set("title", e.target.value)} required minLength={5} />
        </Field>
        <Field label="Subtitle" hint="One sentence on what learners will be able to do.">
          <Input value={f.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Category">
            <select value={f.categoryId} onChange={(e) => set("categoryId", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
              <option value="">— Choose —</option>
              {data.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Level">
            <select value={f.level} onChange={(e) => set("level", e.target.value)} className="h-9 rounded-md border border-input bg-white px-3 text-sm">
              {Object.entries(COURSE_LEVELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Language">
            <Input value={f.language} onChange={(e) => set("language", e.target.value)} />
          </Field>
        </div>
        <Field label="What learners will learn" hint="At least 4 outcomes. Press Enter after each.">
          <TagInput value={f.outcomes} onChange={(v) => set("outcomes", v)} placeholder="e.g. Build pivot tables" />
        </Field>
        <Field label="Requirements">
          <TagInput value={f.requirements} onChange={(v) => set("requirements", v)} placeholder="e.g. A laptop with Excel" />
        </Field>
        <Field label="Who it's for">
          <TagInput value={f.audience} onChange={(v) => set("audience", v)} placeholder="e.g. Students preparing for internships" />
        </Field>
        <Field label="Description">
          <RichTextEditor value={f.description} onChange={(v) => set("description", v)} folder="courses" memberUploads minHeight="min-h-56" />
        </Field>
      </div>
      <div className="space-y-5">
        <div className="space-y-4 rounded-2xl border bg-white p-5">
          <Field label="Cover image" hint="1280×720 works best.">
            <ImageUpload value={f.coverUrl} onChange={(v) => set("coverUrl", v)} folder="courses" />
          </Field>
          <Field label="Promo video (optional)">
            <FileUpload value={f.promoVideoUrl} onChange={(v) => set("promoVideoUrl", v)} folder="courses" kind="video" label="Upload an MP4/WebM trailer" />
          </Field>
        </div>
        <div className="space-y-4 rounded-2xl border bg-white p-5">
          <Field label="Price (GH₵)" hint="0 = free course.">
            <Input inputMode="decimal" value={f.price} onChange={(e) => set("price", e.target.value)} />
          </Field>
          <Field label="Was (optional)">
            <Input inputMode="decimal" value={f.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
          </Field>
          <Switch checked={f.certificateEnabled} onChange={(v) => set("certificateEnabled", v)} label="Certificate of completion" />
        </div>
        <Button type="submit" size="lg" className="w-full bg-sys-learn" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} Save details
        </Button>
      </div>
    </form>
  );
}

// ---- Curriculum ----------------------------------------------------------------------------------

function Curriculum({ data, onChange }: { data: Builder; onChange: () => void }) {
  const courseId = data.course.id;
  const [sectionTitle, setSectionTitle] = useState("");
  const [editing, setEditing] = useState<{ sectionId: number; lesson: Row | null } | null>(null);
  const addSection = useMutation({
    mutationFn: () => api.post(`/teach/courses/${courseId}/sections`, { title: sectionTitle }),
    onSuccess: () => {
      setSectionTitle("");
      onChange();
    },
    onError: (e) => toast.error(e.message),
  });
  const renameSection = useMutation({ mutationFn: ({ id, title }: { id: number; title: string }) => api.patch(`/teach/sections/${id}`, { title }), onSuccess: onChange });
  const deleteSection = useMutation({ mutationFn: (id: number) => api.delete(`/teach/sections/${id}`), onSuccess: onChange });
  const deleteLesson = useMutation({ mutationFn: (id: number) => api.delete(`/teach/lessons/${id}`), onSuccess: onChange });
  const reorder = useMutation({ mutationFn: (sections: Array<{ id: number; lessons: Array<number> }>) => api.post(`/teach/courses/${courseId}/reorder`, { sections }), onSuccess: onChange });
  const structure = () => data.sections.map((s) => ({ id: s.id as number, lessons: s.lessons.map((l) => l.id as number) }));
  const moveSection = (i: number, dir: -1 | 1) => {
    const s = structure();
    const j = i + dir;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j]!, s[i]!];
    reorder.mutate(s);
  };
  const moveLesson = (si: number, li: number, dir: -1 | 1) => {
    const s = structure();
    const sec = s[si]!;
    const j = li + dir;
    if (j >= 0 && j < sec.lessons.length) {
      [sec.lessons[li], sec.lessons[j]] = [sec.lessons[j]!, sec.lessons[li]!];
    } else {
      // Past the edge: move into the neighbouring section.
      const target = s[si + dir];
      if (!target) return;
      const [lesson] = sec.lessons.splice(li, 1);
      if (dir === -1) target.lessons.push(lesson!);
      else target.lessons.unshift(lesson!);
    }
    reorder.mutate(s);
  };
  return (
    <div className="space-y-4">
      {data.sections.map((s, si) => (
        <section key={s.id} className="rounded-2xl border bg-white">
          <header className="flex flex-wrap items-center gap-2 border-b bg-muted/50 px-4 py-3">
            <span className="text-xs font-bold text-muted-foreground">Section {si + 1}</span>
            <input defaultValue={s.title} onBlur={(e) => e.target.value !== s.title && renameSection.mutate({ id: s.id, title: e.target.value })} className="min-w-40 flex-1 bg-transparent font-bold text-primary outline-none" aria-label="Section title" />
            <Button size="icon-sm" variant="ghost" onClick={() => moveSection(si, -1)} disabled={si === 0} aria-label="Move up">
              <ArrowUp />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => moveSection(si, 1)} disabled={si === data.sections.length - 1} aria-label="Move down">
              <ArrowDown />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => confirm("Delete this section and its lessons?") && deleteSection.mutate(s.id)} aria-label="Delete section">
              <Trash2 />
            </Button>
          </header>
          <ul className="divide-y">
            {s.lessons.map((l, li) => {
              const Icon = LESSON_ICONS[l.type] ?? Circle;
              const empty = (l.type === "video" && !l.video_url) || (["article", "assignment"].includes(l.type) && !l.content) || (l.type === "infographic" && !l.image_url) || (l.type === "resource" && !l.file_url) || (l.type === "quiz" && l.questions.length < 3);
              return (
                <li key={l.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Icon className="size-4 text-sys-learn" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{l.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {LESSON_TYPES[l.type]}
                      {l.duration_minutes ? ` · ${l.duration_minutes} min` : ""}
                      {l.is_preview ? " · Free preview" : ""}
                      {l.type === "quiz" ? ` · ${l.questions.length} questions` : ""}
                      {empty && <span className="ml-1 font-semibold text-amber-700">· needs content</span>}
                    </span>
                  </span>
                  <Button size="icon-sm" variant="ghost" onClick={() => moveLesson(si, li, -1)} aria-label="Move up">
                    <ArrowUp />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => moveLesson(si, li, 1)} aria-label="Move down">
                    <ArrowDown />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing({ sectionId: s.id, lesson: l })} aria-label="Edit">
                    <Pencil />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => confirm("Delete this lesson?") && deleteLesson.mutate(l.id)} aria-label="Delete">
                    <Trash2 />
                  </Button>
                </li>
              );
            })}
          </ul>
          <div className="p-3">
            <Button size="sm" variant="outline" onClick={() => setEditing({ sectionId: s.id, lesson: null })}>
              <Plus /> Add lesson
            </Button>
          </div>
        </section>
      ))}
      <form
        className="flex gap-2 rounded-2xl border border-dashed bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (sectionTitle.trim().length >= 2) addSection.mutate();
        }}
      >
        <Input value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} placeholder="New section title, e.g. Getting started" />
        <Button type="submit" disabled={addSection.isPending}>
          <Plus /> Add section
        </Button>
      </form>
      {editing && <LessonEditor key={editing.lesson?.id ?? `new-${editing.sectionId}`} sectionId={editing.sectionId} lesson={editing.lesson} onClose={() => setEditing(null)} onSaved={onChange} />}
    </div>
  );
}

interface Question {
  question: string;
  options: Array<string>;
  correctIndex: number;
  explanation: string;
}

function LessonEditor({ sectionId, lesson, onClose, onSaved }: { sectionId: number; lesson: Row | null; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState(() => ({
    title: lesson?.title ?? "",
    type: (lesson?.type ?? "video") as string,
    content: lesson?.content ?? "",
    videoUrl: (lesson?.video_url ?? null) as string | null,
    fileUrl: (lesson?.file_url ?? null) as string | null,
    imageUrl: (lesson?.image_url ?? null) as string | null,
    durationMinutes: String(lesson?.duration_minutes ?? ""),
    passMark: String(lesson?.pass_mark ?? 70),
    isPreview: lesson?.is_preview === 1,
  }));
  const [questions, setQuestions] = useState<Array<Question>>(() =>
    (lesson?.questions ?? []).map((q: Row) => ({ question: q.question, options: q.options, correctIndex: q.correct_index, explanation: q.explanation ?? "" })),
  );
  const [videoMode, setVideoMode] = useState<"upload" | "link">(lesson?.video_url && !/r2\.dev|\/capevars\//.test(lesson.video_url) ? "link" : "upload");
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((x) => ({ ...x, [k]: v }));
  const save = useMutation({
    mutationFn: async () => {
      const body = { ...f, durationMinutes: Number(f.durationMinutes) || 0, passMark: Number(f.passMark) || 70 };
      let id = lesson?.id as number | undefined;
      if (id) await api.patch(`/teach/lessons/${id}`, body);
      else id = (await api.post<{ id: number }>(`/teach/sections/${sectionId}/lessons`, body)).id;
      if (f.type === "quiz") await api.put(`/teach/lessons/${id}/questions`, { questions });
    },
    onSuccess: () => {
      toast.success("Lesson saved");
      onSaved();
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  const updateQ = (i: number, patch: Partial<Question>) => setQuestions((qs) => qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit lesson" : "New lesson"}</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Object.entries(LESSON_TYPES).map(([k, label]) => {
              const Icon = LESSON_ICONS[k] ?? Circle;
              return (
                <button key={k} type="button" onClick={() => set("type", k)} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 p-2.5 text-xs font-semibold", f.type === k ? "border-sys-learn bg-rose-50 text-rose-800" : "border-border")}>
                  <Icon className="size-5" /> {label}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Field label="Lesson title">
              <Input value={f.title} onChange={(e) => set("title", e.target.value)} required />
            </Field>
            <Field label="Minutes">
              <Input inputMode="numeric" value={f.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} />
            </Field>
          </div>
          {f.type === "video" && (
            <div className="space-y-2">
              <div className="flex gap-2 text-sm">
                {(["upload", "link"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setVideoMode(m)} className={cn("rounded-full px-3 py-1 font-semibold", videoMode === m ? "bg-primary text-white" : "bg-muted")}>
                    {m === "upload" ? "Upload video" : "YouTube / Vimeo link"}
                  </button>
                ))}
              </div>
              {videoMode === "upload" ? (
                <FileUpload value={f.videoUrl} onChange={(v) => set("videoUrl", v)} folder="lessons" kind="video" label="MP4 or WebM, up to 1 GB" />
              ) : (
                <Input value={f.videoUrl ?? ""} onChange={(e) => set("videoUrl", e.target.value || null)} placeholder="https://www.youtube.com/watch?v=…" />
              )}
            </div>
          )}
          {f.type === "infographic" && (
            <Field label="Infographic image">
              <ImageUpload value={f.imageUrl} onChange={(v) => set("imageUrl", v)} folder="lessons" aspect="aspect-[4/3]" />
            </Field>
          )}
          {["resource", "assignment"].includes(f.type) && (
            <Field label={f.type === "resource" ? "Resource file" : "Brief / template file (optional)"}>
              <FileUpload value={f.fileUrl} onChange={(v) => set("fileUrl", v)} folder="lessons" />
            </Field>
          )}
          {f.type !== "quiz" && (
            <Field label={f.type === "article" ? "Article" : f.type === "assignment" ? "Assignment instructions" : "Notes (optional)"}>
              <RichTextEditor value={f.content} onChange={(v) => set("content", v)} folder="lessons" memberUploads minHeight="min-h-48" />
            </Field>
          )}
          {f.type === "quiz" && (
            <div className="space-y-3">
              <Field label="Pass mark (%)" className="max-w-32">
                <Input inputMode="numeric" value={f.passMark} onChange={(e) => set("passMark", e.target.value)} />
              </Field>
              {questions.map((q, i) => (
                <div key={i} className="space-y-2 rounded-xl border p-3">
                  <div className="flex gap-2">
                    <Input value={q.question} onChange={(e) => updateQ(i, { question: e.target.value })} placeholder={`Question ${i + 1}`} required />
                    <Button type="button" size="icon" variant="ghost" onClick={() => setQuestions(questions.filter((_, j) => j !== i))} aria-label="Remove question">
                      <Trash2 />
                    </Button>
                  </div>
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input type="radio" name={`correct-${i}`} checked={q.correctIndex === oi} onChange={() => updateQ(i, { correctIndex: oi })} className="accent-emerald-600" title="Correct answer" />
                      <Input value={opt} onChange={(e) => updateQ(i, { options: q.options.map((o, k) => (k === oi ? e.target.value : o)) })} placeholder={`Option ${oi + 1}`} required />
                      {q.options.length > 2 && (
                        <button type="button" onClick={() => updateQ(i, { options: q.options.filter((_, k) => k !== oi), correctIndex: q.correctIndex >= oi && q.correctIndex > 0 ? q.correctIndex - 1 : q.correctIndex })} className="text-muted-foreground" aria-label="Remove option">
                          <XCircle className="size-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center gap-2">
                    {q.options.length < 6 && (
                      <Button type="button" size="xs" variant="outline" onClick={() => updateQ(i, { options: [...q.options, ""] })}>
                        + Option
                      </Button>
                    )}
                    <Input value={q.explanation} onChange={(e) => updateQ(i, { explanation: e.target.value })} placeholder="Explanation shown after answering (optional)" className="flex-1" />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setQuestions([...questions, { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }])}>
                <Plus /> Add question
              </Button>
              <p className="text-xs text-muted-foreground">Select the radio button next to the correct answer. Quizzes need at least 3 questions.</p>
            </div>
          )}
          <Switch checked={f.isPreview} onChange={(v) => set("isPreview", v)} label="Free preview" description="Anyone can watch this lesson before enrolling." />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sys-learn" disabled={save.isPending}>
              {save.isPending && <Loader2 className="animate-spin" />} Save lesson
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Publish ----------------------------------------------------------------------------------

function Publish({ data, onChange }: { data: Builder; onChange: () => void }) {
  const c = data.course;
  const submit = useMutation({
    mutationFn: () => api.post<{ status: string }>(`/teach/courses/${c.id}/submit`),
    onSuccess: (r) => {
      toast.success(r.status === "published" ? "Your course is live again" : "Submitted for review — we'll notify you.");
      onChange();
    },
    onError: (e) => toast.error(e.message),
  });
  const archive = useMutation({ mutationFn: () => api.post(`/teach/courses/${c.id}/archive`), onSuccess: onChange });
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="rounded-2xl border bg-white p-6">
        <h2 className="font-bold text-primary">Ready to publish?</h2>
        <p className="text-sm text-muted-foreground">Every course is checked against the creation guidelines before review.</p>
        <ul className="mt-5 space-y-3">
          {data.readiness.checks.map((ch) => (
            <li key={ch.key} className="flex gap-3 text-sm">
              {ch.ok ? <CheckCircle2 className="size-5 shrink-0 text-success" /> : <Circle className="size-5 shrink-0 text-muted-foreground" />}
              <span>
                {ch.label}
                {!ch.ok && ch.detail && ch.detail.length > 0 && <span className="block text-xs text-amber-700">Missing content: {ch.detail.join(", ")}</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>
      <aside className="h-fit space-y-4 rounded-2xl border bg-white p-5">
        <p className="text-sm">
          Status: <StatusBadge status={c.status} />
        </p>
        {c.submitted_at && <p className="text-xs text-muted-foreground">Submitted {formatDateTime(c.submitted_at)}</p>}
        {["draft", "rejected", "archived"].includes(c.status) && (
          <Button className="w-full bg-sys-learn" disabled={!data.readiness.ready || submit.isPending} onClick={() => submit.mutate()}>
            <Rocket /> {c.status === "archived" && c.published_at ? "Republish" : "Submit for review"}
          </Button>
        )}
        {c.status === "in_review" && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">In review. Usually within 3 working days.</p>}
        {c.status === "published" && (
          <>
            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">Your course is live. Edits to lessons appear immediately.</p>
            <Button variant="outline" className="w-full" onClick={() => confirm("Unpublish this course? Enrolled learners keep access.") && archive.mutate()}>
              Unpublish
            </Button>
          </>
        )}
        {c.status === "in_review" && (
          <Button variant="ghost" className="w-full" onClick={() => archive.mutate()}>
            Withdraw submission
          </Button>
        )}
      </aside>
    </div>
  );
}

// ---- Students & grading --------------------------------------------------------------------------

function Students({ courseId }: { courseId: number }) {
  const { data, refetch } = useQuery({ queryKey: ["students", courseId], queryFn: () => api.get<{ course: Row; students: Array<Row>; submissions: Array<Row> }>(`/teach/courses/${courseId}/students`) });
  const confirmPay = useMutation({
    mutationFn: (id: number) => api.post(`/teach/enrollments/${id}/confirm`),
    onSuccess: () => {
      toast.success("Learner enrolled");
      void refetch();
    },
  });
  if (!data) return <Loading />;
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border bg-white">
        <h2 className="border-b px-5 py-3 font-bold text-primary">Students ({data.students.length})</h2>
        {data.students.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No students yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {data.students.map((s) => (
                <tr key={s.id}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <Avatar src={s.avatar_url} name={s.full_name} size="sm" />
                      <span>
                        <span className="block font-semibold">{s.full_name}</span>
                        <span className="text-xs text-muted-foreground">{s.email}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-sys-learn" style={{ width: `${s.progress_percent}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.progress_percent}%</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{formatDateTime(s.created_at)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {s.status === "pending_payment" && (
                      <Button size="xs" onClick={() => confirm(`Confirm ${s.full_name} paid ${formatMoney(data.course.price)}?`) && confirmPay.mutate(s.id)}>
                        Confirm payment
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section className="rounded-2xl border bg-white">
        <h2 className="border-b px-5 py-3 font-bold text-primary">Assignment submissions</h2>
        {data.submissions.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <ul className="divide-y">
            {data.submissions.map((s) => (
              <Submission key={s.id} s={s} onGraded={() => void refetch()} />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Submission({ s, onGraded }: { s: Row; onGraded: () => void }) {
  const [grade, setGrade] = useState(s.grade === null ? "" : String(s.grade));
  const [feedback, setFeedback] = useState(s.feedback ?? "");
  useEffect(() => setFeedback(s.feedback ?? ""), [s.feedback]);
  const save = useMutation({
    mutationFn: (status: "graded" | "resubmit") => api.patch(`/teach/submissions/${s.id}`, { grade: grade === "" ? null : Number(grade), feedback, status }),
    onSuccess: () => {
      toast.success("Feedback sent");
      onGraded();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <li className="space-y-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Avatar src={s.avatar_url} name={s.full_name} size="sm" />
        <span className="font-semibold">{s.full_name}</span>
        <span className="text-sm text-muted-foreground">· {s.lesson_title}</span>
        <StatusBadge status={s.status} className="ml-auto" />
      </div>
      {s.body && <p className="rounded-xl bg-muted p-3 text-sm whitespace-pre-line">{s.body}</p>}
      {s.file_url && (
        <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary underline">
          Open attached file
        </a>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Input value={grade} onChange={(e) => setGrade(e.target.value)} inputMode="numeric" placeholder="Grade /100" className="w-32" />
        <Textarea rows={1} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Feedback for the learner" className="min-w-60 flex-1" />
        <Button size="sm" onClick={() => save.mutate("graded")} disabled={save.isPending}>
          Grade
        </Button>
        <Button size="sm" variant="outline" onClick={() => save.mutate("resubmit")} disabled={save.isPending}>
          Ask to resubmit
        </Button>
      </div>
    </li>
  );
}
