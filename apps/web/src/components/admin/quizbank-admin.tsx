// Admin → OpenLearn → Quizbank: courses (level, tags, exam defaults), the
// question bank (choice or written questions with per-option hints, diagrams
// and explanations, shareable across courses), JSON import, and moderation of
// question discussions.
import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Circle, FileJson, ImagePlus, Pencil, Plus, Shapes, Trash2, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { QB_DIFFICULTY, QB_LEVELS, QB_LEVEL_IDS, QB_MAX_OPTIONS, mediaSrc, qbCourseSchema, qbQuestionSchema } from "#/lib/quizbank";
import type { QbCourseInput, QbMedia, QbOption, QbQuestionInput } from "#/lib/quizbank";
import { Field, SearchInput, Segmented, errorToast } from "#/components/admin/ui";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { ImageField } from "#/components/admin/media-fields";
import { ModerationTable } from "#/components/admin/moderation-table";
import { TagInput } from "#/components/site/tag-input";
import { Pager } from "#/components/site/kit";
import { LevelBadge } from "#/components/quizbank/kit";
import { RichText } from "#/components/quizbank/rich-text";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Row = Record<string, any>;
type Tab = "courses" | "questions" | "discussions";
const selectClass = "h-9 rounded-md border bg-white px-3 text-sm";
const LETTERS = "ABCDEFGH";

const firstIssue = (err: { issues: Array<{ path: Array<PropertyKey>; message: string }> }) => {
  const i = err.issues[0];
  return i ? `${i.path.length ? `${String(i.path[0])}: ` : ""}${i.message}` : "Check the form";
};

function useCourses() {
  return useQuery({ queryKey: ["admin-qb-courses"], queryFn: () => api.get<{ items: Array<Row> }>("/admin/quizbank/courses") });
}

// Question text, options, answers, lessons and hints all accept the Quizbank markup.
const FORMATTING_GUIDE: Array<[string, string]> = [
  ["$x^2 + \\frac{1}{2}$", "Inline maths (LaTeX)"],
  ["$$\\int_1^5 y\\,dx$$", "Display maths, on its own line"],
  ["$\\ce{2H2 + O2 -> 2H2O}$", "Chemical equations"],
  ["**bold**  _italic_  ++underline++", "Emphasis"],
  ["`mono`  ==highlight==  ~~struck~~", "Code, highlight, strike-through"],
  ["{{green:k = −1}}", "Coloured badge: green blue red amber purple slate"],
  ["## Advanced explanation", "Heading (Advanced, Simplified, Answer, Steps… get icons)"],
  ["- point   1. step", "Bullets and numbered steps"],
  ["> [!tip] Exam tip", "Callout: tip note warning answer formula"],
  ["| x | y |\n|---|---|", "Table (header row, then a --- row)"],
];

function FormattingPreview({ q }: { q: QbQuestionInput }) {
  const parts: Array<[string, string | null | undefined]> = [
    ["Question", q.body],
    ["Model answer", q.type === "text" ? q.answer : null],
    ["Explanation", q.explanation],
    ["Hint", q.hint],
  ];
  return (
    <details className="rounded-xl border bg-slate-50/60">
      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-primary">Formatting guide & preview</summary>
      <div className="grid gap-4 border-t p-3 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <dl className="space-y-1.5 text-xs">
          {FORMATTING_GUIDE.map(([code, what]) => (
            <div key={code}>
              <dt className="font-mono font-semibold whitespace-pre-wrap text-rose-700">{code}</dt>
              <dd className="text-muted-foreground">{what}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-3">
          {parts.map(([label, text]) =>
            text ? (
              <div key={label} className="rounded-lg border bg-white p-3">
                <p className="mb-1.5 text-[11px] font-bold text-muted-foreground uppercase">{label}</p>
                <RichText text={text} className="text-sm leading-relaxed text-primary" />
              </div>
            ) : null,
          )}
        </div>
      </div>
    </details>
  );
}

// ---- Courses ------------------------------------------------------------------------------------

function CourseEditor({ course, onClose }: { course: Row | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: knownTags } = useQuery({ queryKey: ["admin-qb-tags"], queryFn: () => api.get<{ items: Array<Row> }>("/admin/quizbank/tags") });
  const [d, setD] = useState<QbCourseInput>(() => ({
    title: course?.title ?? "",
    code: course?.code ?? "",
    level: course?.level ?? "shs",
    description: course?.description ?? "",
    coverUrl: course?.cover_url ?? "",
    examQuestions: course?.exam_questions ?? 20,
    examMinutes: course?.exam_minutes ?? 30,
    status: course?.status ?? "draft",
    tags: course?.tags ?? [],
  }));
  const set = (patch: Partial<QbCourseInput>) => setD({ ...d, ...patch });
  const save = useMutation({
    mutationFn: () => {
      const parsed = qbCourseSchema.safeParse(d);
      if (!parsed.success) throw new Error(firstIssue(parsed.error));
      return course ? api.patch(`/admin/quizbank/courses/${course.id}`, parsed.data) : api.post("/admin/quizbank/courses", parsed.data);
    },
    onSuccess: () => {
      toast.success(course ? "Course saved" : "Course created");
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-tags"] });
      onClose();
    },
    onError: errorToast("Couldn't save the course."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{course ? "Edit course" : "New Quizbank course"}</DialogTitle>
          <DialogDescription>Courses group questions; a question can belong to several courses.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Field label="Title" className="sm:col-span-2">
            <Input value={d.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Core Mathematics" required />
          </Field>
          <Field label="Course code" hint="Optional, e.g. ECON 101">
            <Input value={d.code ?? ""} onChange={(e) => set({ code: e.target.value })} />
          </Field>
          <Field label="Level category">
            <select className={selectClass} value={d.level} onChange={(e) => set({ level: e.target.value as QbCourseInput["level"] })}>
              {QB_LEVEL_IDS.map((l) => (
                <option key={l} value={l}>
                  {QB_LEVELS[l]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags" className="sm:col-span-2" hint="For filtering, e.g. WASSCE, Algebra, Year 1. Press Enter after each; click × to remove.">
            <TagInput value={d.tags ?? []} onChange={(tags) => set({ tags })} suggestions={knownTags?.items.map((t) => t.name as string)} />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea rows={3} value={d.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
          </Field>
          <Field label="Default questions per exam">
            <Input type="number" min={1} max={200} value={d.examQuestions} onChange={(e) => set({ examQuestions: Number(e.target.value) })} />
          </Field>
          <Field label="Default exam minutes">
            <Input type="number" min={1} max={300} value={d.examMinutes} onChange={(e) => set({ examMinutes: Number(e.target.value) })} />
          </Field>
          <ImageField label="Cover image (optional)" value={d.coverUrl} onChange={(url) => set({ coverUrl: url ?? "" })} folder="courses" aspect="wide" className="sm:col-span-2" />
          <Field label="Status">
            <select className={selectClass} value={d.status} onChange={(e) => set({ status: e.target.value as "draft" | "published" })}>
              <option value="draft">Draft (hidden)</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <div className="flex items-end justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              Save course
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const IMPORT_EXAMPLE = `[
  {
    "type": "choice",
    "body": "What is 7 × 8?",
    "options": [
      { "text": "54", "hint": "That's 6 × 9." },
      { "text": "56", "hint": "Yes: 7 × 8 = 56." },
      { "text": "64", "hint": "That's 8 × 8." }
    ],
    "correctIndex": 1,
    "explanation": "7 × 8 means seven groups of eight: 8 + 8 + ... = 56.",
    "difficulty": "easy",
    "tags": ["Multiplication"]
  },
  {
    "type": "text",
    "body": "Explain why the sky looks blue.",
    "answer": "Air molecules scatter short (blue) wavelengths of sunlight much more than long (red) ones (Rayleigh scattering), so blue light reaches our eyes from all directions.",
    "explanation": "Scattering strength rises steeply as wavelength falls.",
    "marks": 4,
    "tags": ["Light", "Waves"]
  }
]`;

function ImportDialog({ course, onClose }: { course: Row; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const run = useMutation({
    mutationFn: () => {
      let questions: unknown;
      try {
        questions = JSON.parse(text);
      } catch {
        throw new Error("That isn't valid JSON.");
      }
      if (!Array.isArray(questions)) throw new Error("Paste a JSON array of questions.");
      return api.post<{ imported: number }>(`/admin/quizbank/courses/${course.id}/import`, { questions });
    },
    onSuccess: (r) => {
      toast.success(`Imported ${r.imported} questions`);
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-questions"] });
      onClose();
    },
    onError: errorToast("Couldn't import the questions."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import questions into {course.title}</DialogTitle>
          <DialogDescription>Paste up to 500 questions as JSON. Every question is checked first; nothing is saved if one is invalid.</DialogDescription>
        </DialogHeader>
        <Textarea rows={14} value={text} onChange={(e) => setText(e.target.value)} placeholder={IMPORT_EXAMPLE} className="font-mono text-xs" />
        <div className="flex justify-between gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => setText(IMPORT_EXAMPLE)}>
            Insert example
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={!text.trim() || run.isPending} onClick={() => run.mutate()}>
              <FileJson /> Import
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Courses({ onQuestions }: { onQuestions: (courseId: number) => void }) {
  const queryClient = useQueryClient();
  const { data } = useCourses();
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [importing, setImporting] = useState<Row | null>(null);
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/quizbank/courses/${id}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] }),
    onError: errorToast("Couldn't delete the course."),
  });
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus /> New course
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3">Exam default</th>
              <th className="px-4 py-3">Boards</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <LevelBadge level={c.level} />
                    <TitleCell title={c.title} sub={c.code ?? c.slug} />
                  </div>
                </td>
                <td className="max-w-56 px-4 py-3 text-xs text-muted-foreground">{c.tags.length ? c.tags.map((t: string) => `#${t}`).join(" ") : "—"}</td>
                <td className="px-4 py-3">
                  <button type="button" className="font-semibold text-primary underline" onClick={() => onQuestions(c.id)}>
                    {c.question_count}
                  </button>
                  {Number(c.linked) !== Number(c.question_count) && <span className="block text-[11px] text-muted-foreground">{c.linked} incl. drafts</span>}
                </td>
                <td className="px-4 py-3 text-xs">
                  {c.exam_questions} Qs · {c.exam_minutes} min
                </td>
                <td className="px-4 py-3 text-xs">{c.board_count}</td>
                <td className="px-4 py-3">
                  <StatusCell row={c} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button size="icon-sm" variant="ghost" onClick={() => setImporting(c)} aria-label="Import questions" title="Import questions (JSON)">
                    <FileJson />
                  </Button>
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing(c)} aria-label="Edit course">
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => confirm(`Delete "${c.title}"? Its questions stay in the bank.`) && remove.mutate(c.id)}
                    aria-label="Delete course"
                  >
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No courses yet. Create one, then add or import questions.</p>}
      </div>
      {editing && <CourseEditor course={editing === "new" ? null : editing} onClose={() => setEditing(null)} />}
      {importing && <ImportDialog course={importing} onClose={() => setImporting(null)} />}
    </div>
  );
}

// ---- Questions ----------------------------------------------------------------------------------

const blankQuestion = (courseId?: number): QbQuestionInput => ({
  type: "choice",
  body: "",
  media: [],
  options: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
  correctIndex: null,
  answer: "",
  explanation: "",
  hint: "",
  difficulty: "medium",
  marks: 1,
  status: "published",
  courseIds: courseId ? [courseId] : [],
  tags: [],
});

function MediaEditor({ value, onChange }: { value: Array<QbMedia>; onChange: (v: Array<QbMedia>) => void }) {
  const update = (i: number, patch: Partial<QbMedia>) => onChange(value.map((m, j) => (j === i ? { ...m, ...patch } : m)));
  return (
    <div className="space-y-3">
      {value.map((m, i) => (
        <div key={i} className="grid gap-3 rounded-xl border bg-secondary/30 p-3 sm:grid-cols-[1fr_200px]">
          <div className="space-y-2">
            {m.kind === "image" ? (
              <ImageField value={m.url} onChange={(url) => update(i, { url: url ?? "" })} folder="lessons" />
            ) : (
              <Textarea rows={6} value={m.svg ?? ""} onChange={(e) => update(i, { svg: e.target.value })} placeholder="<svg viewBox=&quot;0 0 200 100&quot; ...>...</svg>" className="font-mono text-xs" />
            )}
            <Input value={m.caption ?? ""} onChange={(e) => update(i, { caption: e.target.value })} placeholder="Caption (also helps AI marking), e.g. Fig. 1: triangle ABC" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid flex-1 place-items-center rounded-lg border bg-white p-2">
              {(m.kind === "image" ? m.url : m.svg) ? <img src={mediaSrc(m)} alt="" className="max-h-32 object-contain" /> : <span className="text-xs text-muted-foreground">Preview</span>}
            </div>
            <Button type="button" size="sm" variant="ghost" className="text-destructive" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <X /> Remove
            </Button>
          </div>
        </div>
      ))}
      {value.length < 6 && (
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, { kind: "image", url: "" }])}>
            <ImagePlus /> Add image or diagram
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => onChange([...value, { kind: "svg", svg: "" }])}>
            <Shapes /> Add vector drawing (SVG)
          </Button>
        </div>
      )}
    </div>
  );
}

function OptionsEditor({ q, set }: { q: QbQuestionInput; set: (patch: Partial<QbQuestionInput>) => void }) {
  const opts = q.options ?? [];
  const update = (i: number, patch: Partial<QbOption>) => set({ options: opts.map((o, j) => (j === i ? { ...o, ...patch } : o)) });
  const [pictures, setPictures] = useState<Record<number, boolean>>({});
  return (
    <div className="space-y-2">
      {opts.map((o, i) => {
        const correct = q.correctIndex === i;
        return (
          <div key={i} className={cn("rounded-xl border-2 p-3", correct ? "border-emerald-400 bg-emerald-50/50" : "border-border")}>
            <div className="flex items-start gap-2">
              <button type="button" onClick={() => set({ correctIndex: i })} className="mt-1.5 flex items-center gap-1 text-xs font-bold" aria-label={`Mark option ${LETTERS[i]} correct`} title="Mark as the correct answer">
                {correct ? <CheckCircle2 className="size-5 text-emerald-600" /> : <Circle className="size-5 text-muted-foreground" />}
                {LETTERS[i]}
              </button>
              <div className="flex-1 space-y-2">
                <Input value={o.text} onChange={(e) => update(i, { text: e.target.value })} placeholder={`Option ${LETTERS[i]}`} />
                <Textarea
                  rows={2}
                  value={o.hint ?? ""}
                  onChange={(e) => update(i, { hint: e.target.value })}
                  placeholder={correct ? "Why this is right (shown when a learner picks it in study mode)" : "Hint shown when a learner picks this option, e.g. the common mistake behind it"}
                  className="text-sm"
                />
                {(pictures[i] || o.imageUrl) && <ImageField value={o.imageUrl} onChange={(url) => update(i, { imageUrl: url ?? "" })} folder="lessons" aspect="wide" />}
              </div>
              <div className="flex flex-col">
                {!o.imageUrl && !pictures[i] && (
                  <Button type="button" size="icon-sm" variant="ghost" onClick={() => setPictures({ ...pictures, [i]: true })} aria-label="Add a picture to this option">
                    <ImagePlus />
                  </Button>
                )}
                {opts.length > 2 && (
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    onClick={() =>
                      set({
                        options: opts.filter((_, j) => j !== i),
                        correctIndex: q.correctIndex === i ? null : q.correctIndex !== null && q.correctIndex !== undefined && q.correctIndex > i ? q.correctIndex - 1 : q.correctIndex,
                      })
                    }
                    aria-label={`Remove option ${LETTERS[i]}`}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {opts.length < QB_MAX_OPTIONS && (
        <Button type="button" size="sm" variant="outline" onClick={() => set({ options: [...opts, { text: "" }] })}>
          <Plus /> Add option
        </Button>
      )}
    </div>
  );
}

function QuestionEditor({ id, courseId, onClose }: { id: number | null; courseId?: number; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: courses } = useCourses();
  const existing = useQuery({
    queryKey: ["admin-qb-question", id],
    queryFn: () => api.get<{ question: QbQuestionInput }>(`/admin/quizbank/questions/${id}`),
    enabled: id !== null,
  });
  const [q, setQ] = useState<QbQuestionInput>(() => blankQuestion(courseId));
  const [courseFilter, setCourseFilter] = useState("");
  useEffect(() => {
    if (existing.data) setQ({ ...blankQuestion(), ...existing.data.question, options: existing.data.question.options?.length ? existing.data.question.options : blankQuestion().options });
  }, [existing.data]);
  const set = (patch: Partial<QbQuestionInput>) => setQ((prev) => ({ ...prev, ...patch }));
  const save = useMutation({
    mutationFn: () => {
      const parsed = qbQuestionSchema.safeParse(q);
      if (!parsed.success) throw new Error(firstIssue(parsed.error));
      return id ? api.patch(`/admin/quizbank/questions/${id}`, parsed.data) : api.post("/admin/quizbank/questions", parsed.data);
    },
    onSuccess: () => {
      toast.success(id ? "Question saved" : "Question added");
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-questions"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] });
      onClose();
    },
    onError: errorToast("Couldn't save the question."),
  });
  const chosen = new Set(q.courseIds ?? []);
  const { data: allTags } = useQuery({ queryKey: ["admin-qb-tags"], queryFn: () => api.get<{ items: Array<Row> }>("/admin/quizbank/tags") });
  // The chosen courses' tags first: they're the topics members filter by.
  const tagSuggestions = [
    ...new Set([...(courses?.items ?? []).filter((c) => chosen.has(c.id)).flatMap((c) => c.tags as Array<string>), ...(allTags?.items ?? []).map((t) => t.name as string)]),
  ];
  const courseList = (courses?.items ?? []).filter((c) => !courseFilter || `${c.title} ${c.code ?? ""}`.toLowerCase().includes(courseFilter.toLowerCase()));
  if (id !== null && !existing.data) return null;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[94vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{id ? `Edit question #${id}` : "New question"}</DialogTitle>
          <DialogDescription>Write the question, its answer, hints and the lesson behind it. Add it to every course it belongs to.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <Segmented
            value={q.type}
            onChange={(type) => set({ type })}
            options={[
              { value: "choice", label: "Multiple choice" },
              { value: "text", label: "Written answer (marked by AI)" },
            ]}
          />
          <Field label="Question">
            <Textarea rows={4} value={q.body} onChange={(e) => set({ body: e.target.value })} placeholder="Type the question. Line breaks are kept." required />
          </Field>
          <Field label="Diagrams, drawings and images" hint="Pictures upload to the media library; vector drawings are pasted as SVG code.">
            <MediaEditor value={(q.media ?? []).map((m) => ({ ...m, url: m.url ?? undefined, caption: m.caption ?? undefined }))} onChange={(media) => set({ media })} />
          </Field>
          {q.type === "choice" ? (
            <Field label="Options" hint="Click the circle beside the correct option. Each option's hint slides open under it in study mode.">
              <OptionsEditor q={q} set={set} />
            </Field>
          ) : (
            <Field label="Model answer" hint="What a full-marks answer says. Claude marks responses on meaning against this.">
              <Textarea rows={4} value={q.answer ?? ""} onChange={(e) => set({ answer: e.target.value })} />
            </Field>
          )}
          <Field label="Explanation (the lesson)" hint="Shown once the question is answered correctly in study mode, and in exam reviews. Explain why the answer is right, simply.">
            <Textarea rows={4} value={q.explanation ?? ""} onChange={(e) => set({ explanation: e.target.value })} />
          </Field>
          <Field label="General hint (optional)" hint="Shown above the options in study mode, never in exams.">
            <Input value={q.hint ?? ""} onChange={(e) => set({ hint: e.target.value })} />
          </Field>
          <FormattingPreview q={q} />
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Difficulty">
              <select className={selectClass} value={q.difficulty} onChange={(e) => set({ difficulty: e.target.value as QbQuestionInput["difficulty"] })}>
                {Object.entries(QB_DIFFICULTY).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Marks">
              <Input type="number" min={0.5} max={100} step={0.5} value={q.marks} onChange={(e) => set({ marks: Number(e.target.value) })} />
            </Field>
            <Field label="Status">
              <select className={selectClass} value={q.status} onChange={(e) => set({ status: e.target.value as "draft" | "published" })}>
                <option value="published">Published</option>
                <option value="draft">Draft (hidden)</option>
              </select>
            </Field>
          </div>
          <Field label={`Courses (${chosen.size})`} hint="A question can be shared by several courses.">
            <Input value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} placeholder="Filter courses" className="mb-2" />
            <div className="grid max-h-48 gap-1 overflow-y-auto rounded-lg border p-2 sm:grid-cols-2">
              {courseList.map((c) => (
                <label key={c.id} className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm", chosen.has(c.id) ? "bg-primary/10 font-semibold text-primary" : "hover:bg-secondary")}>
                  <input
                    type="checkbox"
                    checked={chosen.has(c.id)}
                    onChange={(e) => set({ courseIds: e.target.checked ? [...chosen, c.id] : [...chosen].filter((x) => x !== c.id) })}
                  />
                  <span className="truncate">{c.title}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground uppercase">{QB_LEVELS[c.level as keyof typeof QB_LEVELS]}</span>
                </label>
              ))}
            </div>
          </Field>
          <Field label="Topic tags" hint="Members narrow a course to topics, e.g. Algebra or Mechanics. New topics are added to this question's courses too.">
            <TagInput value={q.tags ?? []} onChange={(tags) => set({ tags })} suggestions={tagSuggestions} max={15} />
          </Field>
          <div className="sticky -bottom-6 -mx-6 -mb-6 flex justify-end gap-2 border-t bg-white px-6 py-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={save.isPending}>
              Save question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Questions({ courseId, setCourseId }: { courseId: number | undefined; setCourseId: (id: number | undefined) => void }) {
  const queryClient = useQueryClient();
  const { data: courses } = useCourses();
  const [q, setQ] = useState("");
  const [type, setType] = useState<"" | "choice" | "text">("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { data } = useQuery({
    queryKey: ["admin-qb-questions", courseId, type, q, page],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/admin/quizbank/questions", { courseId, type: type || undefined, q, page, pageSize: 25 }),
    placeholderData: keepPreviousData,
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/quizbank/questions/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-questions"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] });
    },
    onError: errorToast("Couldn't delete the question."),
  });
  const detach = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/quizbank/courses/${courseId}/questions/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-questions"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-qb-courses"] });
    },
    onError: errorToast("Couldn't remove the question from the course."),
  });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={courseId ?? ""}
          onChange={(e) => {
            setCourseId(e.target.value ? Number(e.target.value) : undefined);
            setPage(1);
          }}
          aria-label="Course"
        >
          <option value="">All courses</option>
          {courses?.items.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select className={selectClass} value={type} onChange={(e) => setType(e.target.value as typeof type)} aria-label="Type">
          <option value="">All types</option>
          <option value="choice">Multiple choice</option>
          <option value="text">Written</option>
        </select>
        <SearchInput value={q} onChange={(v) => (setQ(v), setPage(1))} placeholder="Search questions" className="w-64" />
        <Button className="ml-auto" onClick={() => setEditing("new")}>
          <Plus /> New question
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
            <tr>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Courses</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {data?.items.map((r) => (
              <tr key={r.id} className="align-top">
                <td className="max-w-md px-4 py-3">
                  <p className="line-clamp-2 font-medium text-primary">{r.body}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    #{r.id} · {QB_DIFFICULTY[r.difficulty as keyof typeof QB_DIFFICULTY]} · {Number(r.marks)} mark(s)
                    {Number(r.media_count) > 0 && ` · ${r.media_count} diagram(s)`}
                    {r.discussion_count > 0 && ` · ${r.discussion_count} comments`}
                    {r.status === "draft" && " · draft"}
                  </p>
                  {r.tags && <p className="mt-1 text-[11px] font-semibold text-indigo-700">#{String(r.tags).split(", ").join(" #")}</p>}
                </td>
                <td className="max-w-56 px-4 py-3 text-xs text-muted-foreground">{r.courses ?? "Not in a course"}</td>
                <td className="px-4 py-3 text-xs">{r.type === "text" ? "Written" : "Choice"}</td>
                <td className="px-4 py-3">
                  <DateCell value={r.updated_at} />
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Button size="icon-sm" variant="ghost" onClick={() => setEditing(r.id)} aria-label="Edit question">
                    <Pencil />
                  </Button>
                  {courseId && (
                    <Button size="icon-sm" variant="ghost" onClick={() => detach.mutate(r.id)} aria-label="Remove from this course" title="Remove from this course (keeps it in the bank)">
                      <X />
                    </Button>
                  )}
                  <Button size="icon-sm" variant="ghost" className="text-destructive" onClick={() => confirm("Delete this question from the bank and every course?") && remove.mutate(r.id)} aria-label="Delete question">
                    <Trash2 />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.items.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No questions match.</p>}
      </div>
      {data && <Pager page={page} pageSize={25} total={data.total} onPage={setPage} />}
      {editing !== null && <QuestionEditor key={String(editing)} id={editing === "new" ? null : editing} courseId={courseId} onClose={() => setEditing(null)} />}
    </div>
  );
}

export function QuizbankAdmin() {
  const [tab, setTab] = useState<Tab>("courses");
  const [courseId, setCourseId] = useState<number | undefined>();
  return (
    <div className="space-y-4">
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "courses", label: "Courses & tags" },
          { value: "questions", label: "Question bank" },
          { value: "discussions", label: "Discussions" },
        ]}
      />
      {tab === "courses" && (
        <Courses
          onQuestions={(id) => {
            setCourseId(id);
            setTab("questions");
          }}
        />
      )}
      {tab === "questions" && <Questions courseId={courseId} setCourseId={setCourseId} />}
      {tab === "discussions" && (
        <ModerationTable
          key="qb-discussions"
          entity="qb-discussions"
          defaultStatus="visible"
          columns={[
            { label: "Comment", render: (r) => <TitleCell title={<span className="line-clamp-2">{r.body}</span>} sub={`${r.kind} · ${r.helpful_count} helpful`} /> },
            { label: "On question", render: (r) => <p className="line-clamp-2 max-w-xs text-xs text-muted-foreground">{r.question_body}</p> },
            { label: "By", render: (r) => <span className="text-xs">{r.author_name}<br />{r.author_email}</span> },
            { label: "Posted", render: (r) => <DateCell value={r.created_at} time /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
    </div>
  );
}
