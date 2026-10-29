import { useEffect, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, BookOpenCheck, Brain, CheckCircle2, Layers, Loader2, PenLine, Plus, Tags, Timer, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Container, Img, TextBlock } from "#/components/site/kit";
import { LevelBadge, percent } from "#/components/quizbank/kit";
import type { QbCourseCard } from "#/components/quizbank/kit";
import { ExamSettingsFields, clampSettings, useStartExam } from "#/components/quizbank/exam-settings";
import type { ExamSettings } from "#/components/quizbank/exam-settings";
import { StudySetDialog, TopicPicker, useTopics } from "#/components/quizbank/topics";
import type { QbTopic } from "#/lib/quizbank";
import { Button } from "#/components/ui/button";

type Attempt = { id: number; title: string | null; status: string; score: number | null; maxScore: number | null; minutes: number; questions: number; startedAt: string; submittedAt: string | null };
type CourseData = {
  course: QbCourseCard & { questionTypes: Partial<Record<"choice" | "text", number>> };
  topics: { topics: Array<QbTopic>; total: number; untagged: number };
  board: (ExamSettings & { tagIds: Array<number>; studyPosition: number; custom: boolean }) | null;
  attempts: Array<Attempt>;
};

const courseQuery = (slug: string) => ({ queryKey: ["qb-course", slug], queryFn: () => api.get<CourseData>(`/learn/quizbank/courses/${slug}`) });

export const Route = createFileRoute("/_site/learn/quizbank/c/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(courseQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.course.title} | Quizbank` }] : [] }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { data, refetch } = useQuery(courseQuery(slug));
  const member = useMember();
  const requireMember = useRequireMember();
  const start = useStartExam();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ExamSettings>({ examQuestions: 20, examMinutes: 30 });
  const [tagIds, setTagIds] = useState<Array<number>>([]);
  const [saving, setSaving] = useState(false);
  const boardTags = data?.board?.tagIds.join(",");
  useEffect(() => {
    if (data) setSettings(clampSettings(data.board ?? { examQuestions: data.course.examQuestions, examMinutes: data.course.examMinutes }, data.course.questionCount));
  }, [data]);
  useEffect(() => {
    setTagIds(boardTags ? boardTags.split(",").map(Number) : []);
  }, [boardTags]);
  const topics = useTopics(data ? [data.course.id] : [], tagIds);
  const add = useMutation({
    mutationFn: () => api.post(`/learn/quizbank/board/${data!.course.id}`),
    onSuccess: () => {
      toast.success("Added to your Study Board");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/learn/quizbank/board/${data!.course.id}`),
    onSuccess: () => void refetch(),
    onError: (e) => toast.error(e.message),
  });
  const save = useMutation({
    mutationFn: (v: Partial<ExamSettings> & { tagIds?: Array<number> }) => api.patch(`/learn/quizbank/board/${data!.course.id}`, v),
    onError: (e) => toast.error(e.message),
  });
  // On the board, the chosen topics are the course's study plan and are saved.
  const chooseTopics = (ids: Array<number>) => {
    setTagIds(ids);
    if (data?.board) save.mutate({ tagIds: ids }, { onSuccess: () => void refetch() });
  };
  if (!data) return null;
  const c = data.course;
  const matching = tagIds.length ? (topics.data?.matching ?? c.questionCount) : c.questionCount;
  const empty = matching === 0;
  const startExam = () =>
    requireMember(() => {
      const v = clampSettings(settings, matching);
      if (data.board) save.mutate(v);
      start.mutate({ courseId: c.id, settings: { ...v, tagIds } });
    });

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        {c.coverUrl && <Img src={c.coverUrl} className="absolute inset-0 size-full opacity-20" />}
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative py-10">
          <Link to="/learn/quizbank" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> Quizbank
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <LevelBadge level={c.level} />
            {c.code && <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs font-bold ring-1 ring-white/25">{c.code}</span>}
          </div>
          <h1 className="mt-3 max-w-3xl font-hero text-3xl leading-tight font-bold sm:text-5xl">{c.title}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <Layers className="size-4 text-amber-300" /> {c.questionCount.toLocaleString()} questions
            </span>
            {Boolean(c.questionTypes.choice) && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-amber-300" /> {c.questionTypes.choice} multiple choice
              </span>
            )}
            {Boolean(c.questionTypes.text) && (
              <span className="flex items-center gap-1.5">
                <PenLine className="size-4 text-amber-300" /> {c.questionTypes.text} written
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-amber-300" /> on {c.boardCount.toLocaleString()} study boards
            </span>
          </div>
          {c.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <Link key={t.slug} to="/learn/quizbank" search={{ tag: t.slug }} className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/20">
                  #{t.name}
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>

      <Container className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border bg-white p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-white">
                <Timer className="size-5" />
              </span>
              <h2 className="mt-3 text-lg font-black text-primary">Exam mode</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A timed simulation: answer every question before the countdown ends. When time runs out it submits itself, then reveals your score with the answers.
              </p>
            </div>
            <div className="rounded-2xl border bg-white p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-amber-400 text-[#041d40]">
                <Brain className="size-5" />
              </span>
              <h2 className="mt-3 text-lg font-black text-primary">Study mode</h2>
              <p className="mt-1 text-sm text-muted-foreground">No timer. Pick an option to see a hint about it; get it right to unlock the lesson behind the answer. Written answers get instant feedback.</p>
              <Button asChild variant="outline" className="mt-4" disabled={empty}>
                <Link to="/learn/quizbank/c/$slug/study" params={{ slug }} search={data.board ? {} : { tags: tagIds.join(",") }}>
                  <Brain /> {data.board?.studyPosition ? "Continue studying" : "Start studying"}
                </Link>
              </Button>
            </div>
          </div>
          {c.description && (
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-black text-primary">About this course</h2>
              <TextBlock text={c.description} className="mt-2 text-sm leading-relaxed" />
            </section>
          )}
          {member && data.attempts.length > 0 && (
            <section className="overflow-hidden rounded-2xl border bg-white">
              <h2 className="border-b px-5 py-3 font-bold text-primary">Your exam history</h2>
              <ul className="divide-y">
                {data.attempts.map((a) => {
                  const pct = a.score !== null && a.maxScore ? a.score / a.maxScore : null;
                  return (
                    <li key={a.id}>
                      <Link to="/learn/quizbank/exam/$id" params={{ id: String(a.id) }} className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/50">
                        <span
                          className={cn(
                            "grid size-12 place-items-center rounded-full text-sm font-black",
                            pct === null ? "bg-secondary text-muted-foreground" : pct >= 0.7 ? "bg-emerald-100 text-emerald-800" : pct >= 0.5 ? "bg-amber-100 text-amber-900" : "bg-red-100 text-red-800",
                          )}
                        >
                          {pct === null ? "…" : percent(pct)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-primary">
                            {a.questions} question{a.questions === 1 ? "" : "s"} · {a.minutes} min
                            {a.title && a.title !== c.title && <span className="font-normal text-muted-foreground"> · {a.title.replace(`${c.title} · `, "")}</span>}
                          </span>
                          <span className="block text-xs text-muted-foreground">{formatDateTime(a.submittedAt ?? a.startedAt)}</span>
                        </span>
                        <span className="text-xs font-semibold text-primary">{a.status === "submitted" ? "Review" : "Resume"} →</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-black text-primary">Study Board</h2>
            {data.board ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <BookOpenCheck className="size-4" /> On your board
              </span>
            ) : null}
          </div>
          {data.board ? (
            <button type="button" className="text-xs text-muted-foreground underline" onClick={() => confirm("Remove this course from your Study Board?") && remove.mutate()}>
              Remove from board
            </button>
          ) : (
            <Button variant="outline" className="w-full" disabled={add.isPending} onClick={() => requireMember(() => add.mutate())}>
              <Plus /> Add to my Study Board
            </Button>
          )}
          <div className="border-t pt-4">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-bold text-primary">
              <Tags className="size-4" /> Topics
            </p>
            <p className="mb-3 text-xs text-muted-foreground">{data.board ? "Your study plan for this course. Exams and study draw only from these." : "Narrow the questions to some topics."}</p>
            <TopicPicker data={topics.data ?? { ...data.topics, matching: c.questionCount }} value={tagIds} onChange={chooseTopics} />
            <button type="button" className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline" onClick={() => requireMember(() => setSaving(true))}>
              <Layers className="size-3.5" /> Save as a study set, or mix with other courses
            </button>
          </div>
          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-bold text-primary">Exam simulation</p>
            <ExamSettingsFields value={settings} max={matching} onChange={setSettings} />
            <Button className="mt-4 h-11 w-full rounded-xl" disabled={empty || start.isPending} onClick={startExam}>
              {start.isPending ? <Loader2 className="animate-spin" /> : <Timer />} Start exam
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {empty ? "No questions match yet." : data.board ? "Your settings are saved to your board." : "Add the course to your board to keep these settings."}
            </p>
          </div>
        </aside>
        {saving && (
          <StudySetDialog
            initial={{
              name: [c.title, ...tagIds.map((id) => data.topics.topics.find((t) => t.id === id)?.name).filter(Boolean)].join(" · ").slice(0, 120),
              courseIds: [c.id],
              tagIds,
              examQuestions: settings.examQuestions,
              examMinutes: settings.examMinutes,
            }}
            onClose={() => setSaving(false)}
            onSaved={() => void queryClient.invalidateQueries({ queryKey: ["qb-variations"] })}
          />
        )}
      </Container>
    </div>
  );
}
