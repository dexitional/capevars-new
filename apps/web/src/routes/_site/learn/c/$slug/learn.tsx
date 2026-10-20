import { useEffect, useMemo, useState } from "react";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Award, CheckCircle2, ChevronLeft, ChevronRight, Circle, Download, Lock, Menu, MessageSquare, Star, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { LESSON_TYPES } from "#/lib/labels";
import { Avatar, FileUpload, Loading, Prose, StarInput, StatusBadge } from "#/components/site/kit";
import { LESSON_ICONS, videoEmbed } from "#/components/learn/lesson-icons";
import { ChatRoom } from "#/components/social/chat-room";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;
type Player = { course: Row; sections: Array<Row & { lessons: Array<Row> }>; enrollment: Row | null; progress: Array<Row>; isInstructor: boolean };

export const Route = createFileRoute("/_site/learn/c/$slug/learn")({
  validateSearch: z.object({ lesson: z.coerce.number().optional().catch(undefined) }),
  beforeLoad: ({ context, location, params }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
    const imported = /^kidilearn-basic-([1-9])-(english|mathematics|science)$/.exec(params.slug);
    if (imported) throw redirect({ to: "/learn/kidilearn/subjects/$level/$subject", params: { level: `b${imported[1]}`, subject: imported[2]! } });
  },
  head: () => ({ meta: [{ title: "Learning | OpenLearn" }] }),
  component: PlayerPage,
});

function PlayerPage() {
  const { slug } = Route.useParams();
  const { lesson: lessonParam } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();
  const [sidebar, setSidebar] = useState(true);
  const [tab, setTab] = useState<"overview" | "qa" | "chat" | "review">("overview");
  const { data, refetch } = useQuery({ queryKey: ["player", slug], queryFn: () => api.get<Player>(`/learn/player/${slug}`) });
  const lessons = useMemo(() => data?.sections.flatMap((s) => s.lessons) ?? [], [data]);
  const done = useMemo(() => new Set((data?.progress ?? []).map((p) => p.lesson_id as number)), [data]);
  const currentId = lessonParam ?? data?.enrollment?.last_lesson_id ?? lessons.find((l) => !done.has(l.id) && !l.locked)?.id ?? lessons[0]?.id;
  const idx = lessons.findIndex((l) => l.id === currentId);
  const lesson = lessons[idx];
  const enrolled = Boolean(data?.enrollment && ["active", "completed"].includes(data.enrollment.status));
  useEffect(() => {
    if (lesson && enrolled && !lesson.locked) void api.post(`/learn/lessons/${lesson.id}/visit`).catch(() => undefined);
  }, [lesson?.id, enrolled]); // eslint-disable-line react-hooks/exhaustive-deps
  const go = (id: number) => void navigate({ search: { lesson: id } });
  const complete = useMutation({
    mutationFn: () => api.post<{ progress: number }>(`/learn/lessons/${lesson!.id}/complete`),
    onSuccess: (r) => {
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["course", slug] });
      if (r.progress >= 100) toast.success("Course complete! 🎉");
      const next = lessons[idx + 1];
      if (next && !next.locked) go(next.id);
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading className="min-h-[60vh]" />;
  const c = data.course;
  const pct = data.enrollment?.progress_percent ?? 0;
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white">
      <header className="flex items-center gap-3 border-b bg-primary px-4 py-3 text-white">
        <Link to="/learn/c/$slug" params={{ slug }} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Back to course">
          <ArrowLeft className="size-5" />
        </Link>
        <p className="min-w-0 flex-1 truncate font-semibold">{c.title}</p>
        {data.enrollment && (
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <div className="h-2 w-32 overflow-hidden rounded-full bg-white/20">
              <div className="h-full bg-brand-gold" style={{ width: `${pct}%` }} />
            </div>
            {pct}%
          </div>
        )}
        {data.enrollment?.certificate_code && (
          <Button asChild size="sm" className="bg-brand-cream text-primary hover:bg-brand-butter">
            <Link to="/learn/certificate/$code" params={{ code: data.enrollment.certificate_code }}>
              <Award /> Certificate
            </Link>
          </Button>
        )}
        <button type="button" onClick={() => setSidebar(!sidebar)} className="rounded-lg p-1.5 hover:bg-white/10" aria-label="Toggle course content">
          {sidebar ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>
      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1">
          {!lesson ? (
            <p className="p-10 text-center text-muted-foreground">This course has no lessons yet.</p>
          ) : lesson.locked ? (
            <div className="flex aspect-video max-h-[70vh] w-full flex-col items-center justify-center gap-3 bg-primary text-white">
              <Lock className="size-10" />
              <p className="text-lg font-semibold">Enrol to unlock this lesson</p>
              <Button asChild className="bg-brand-cream text-primary">
                <Link to="/learn/c/$slug" params={{ slug }}>
                  View enrolment options
                </Link>
              </Button>
            </div>
          ) : (
            <LessonView key={lesson.id} lesson={lesson} enrolled={enrolled} done={done.has(lesson.id)} onProgress={() => void refetch()} />
          )}
          {lesson && (
            <div className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-8">
              <Button variant="ghost" size="sm" disabled={idx <= 0} onClick={() => go(lessons[idx - 1]!.id)}>
                <ChevronLeft /> Previous
              </Button>
              {enrolled && !lesson.locked && !["quiz", "assignment"].includes(lesson.type) && (
                <Button size="sm" className={cn(done.has(lesson.id) ? "bg-success" : "bg-sys-learn")} disabled={complete.isPending || done.has(lesson.id)} onClick={() => complete.mutate()}>
                  <CheckCircle2 /> {done.has(lesson.id) ? "Completed" : "Mark complete & continue"}
                </Button>
              )}
              <Button variant="ghost" size="sm" disabled={idx >= lessons.length - 1} onClick={() => go(lessons[idx + 1]!.id)}>
                Next <ChevronRight />
              </Button>
            </div>
          )}
          <div className="px-4 py-6 sm:px-8">
            <div className="mb-5 flex gap-1 border-b">
              {(
                [
                  ["overview", "Overview"],
                  ["qa", "Q&A"],
                  ["chat", "Course chat"],
                  ["review", "Review"],
                ] as const
              ).map(([k, label]) => (
                <button key={k} type="button" onClick={() => setTab(k)} className={cn("relative px-4 py-2.5 text-sm font-semibold", tab === k ? "text-primary after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:bg-sys-learn" : "text-muted-foreground")}>
                  {label}
                </button>
              ))}
            </div>
            {tab === "overview" && (
              <div className="text-sm">
                <h2 className="text-xl font-black text-primary">{lesson?.title}</h2>
                <p className="mt-1 text-muted-foreground">
                  {lesson && LESSON_TYPES[lesson.type]} · by{" "}
                  <Link to="/u/$username" params={{ username: c.instructor_username }} className="underline">
                    {c.instructor_name}
                  </Link>
                </p>
              </div>
            )}
            {tab === "qa" && <Discussions courseId={c.id} lessonId={lesson?.id} canPost={enrolled || data.isInstructor} />}
            {tab === "chat" && (enrolled || data.isInstructor ? <CourseChat courseId={c.id} /> : <p className="text-sm text-muted-foreground">Enrol to join the course chat.</p>)}
            {tab === "review" && (enrolled ? <ReviewForm courseId={c.id} slug={slug} /> : <p className="text-sm text-muted-foreground">Enrol to review this course.</p>)}
          </div>
        </main>
        {sidebar && (
          <aside className="hidden w-80 shrink-0 overflow-y-auto border-l bg-muted/30 md:block">
            <p className="border-b bg-white px-4 py-3 text-sm font-bold">Course content</p>
            {data.sections.map((s, si) => (
              <div key={s.id}>
                <p className="border-b bg-muted px-4 py-2.5 text-sm font-semibold">
                  Section {si + 1}: {s.title}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {s.lessons.filter((l: Row) => done.has(l.id)).length}/{s.lessons.length} done
                  </span>
                </p>
                <ul>
                  {s.lessons.map((l: Row) => {
                    const Icon = LESSON_ICONS[l.type] ?? Circle;
                    return (
                      <li key={l.id}>
                        <button type="button" onClick={() => go(l.id)} className={cn("flex w-full items-start gap-2.5 px-4 py-2.5 text-left text-sm hover:bg-white", l.id === currentId && "bg-white font-semibold")}>
                          {done.has(l.id) ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" /> : l.locked ? <Lock className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> : <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />}
                          <span className="min-w-0 flex-1">
                            {l.title}
                            <span className="mt-0.5 flex items-center gap-1 text-xs font-normal text-muted-foreground">
                              <Icon className="size-3" /> {LESSON_TYPES[l.type]}
                              {l.duration_minutes ? ` · ${l.duration_minutes} min` : ""}
                              {l.is_preview && !enrolled ? " · Preview" : ""}
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}

function LessonView({ lesson, enrolled, done, onProgress }: { lesson: Row; enrolled: boolean; done: boolean; onProgress: () => void }) {
  if (lesson.type === "video") {
    const embed = videoEmbed(lesson.video_url);
    return (
      <div className="bg-black">
        {embed ? (
          <iframe src={embed} title={lesson.title} className="mx-auto aspect-video max-h-[70vh] w-full" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : lesson.video_url ? (
          <video src={lesson.video_url} controls controlsList="nodownload" className="mx-auto aspect-video max-h-[70vh] w-full" />
        ) : (
          <p className="p-16 text-center text-white/60">Video coming soon.</p>
        )}
        {lesson.content && (
          <div className="bg-white px-4 py-6 sm:px-8">
            <Prose html={lesson.content} />
          </div>
        )}
      </div>
    );
  }
  if (lesson.type === "infographic") {
    return (
      <div className="bg-muted p-4 sm:p-8">
        {lesson.image_url && (
          <a href={lesson.image_url} target="_blank" rel="noopener noreferrer">
            <img src={lesson.image_url} alt={lesson.title} className="mx-auto max-h-[80vh] rounded-xl shadow" />
          </a>
        )}
        {lesson.content && <Prose html={lesson.content} className="mx-auto mt-6 max-w-3xl" />}
      </div>
    );
  }
  if (lesson.type === "quiz") return <Quiz lesson={lesson} enrolled={enrolled} done={done} onProgress={onProgress} />;
  if (lesson.type === "assignment") return <Assignment lesson={lesson} enrolled={enrolled} onProgress={onProgress} />;
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-black text-primary">{lesson.title}</h1>
      <Prose html={lesson.content} className="mt-5" />
      {lesson.file_url && (
        <a href={lesson.file_url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold text-primary hover:bg-muted">
          <Download className="size-5" /> Download resource
        </a>
      )}
    </div>
  );
}

function Quiz({ lesson, enrolled, done, onProgress }: { lesson: Row; enrolled: boolean; done: boolean; onProgress: () => void }) {
  const qs: Array<Row> = lesson.questions ?? [];
  const [answers, setAnswers] = useState<Array<number | null>>(() => qs.map(() => null));
  const [result, setResult] = useState<{ score: number; passed: boolean; passMark: number; results: Array<Row> } | null>(null);
  const submit = useMutation({
    mutationFn: () => api.post<{ score: number; passed: boolean; passMark: number; results: Array<Row> }>(`/learn/lessons/${lesson.id}/quiz`, { answers: answers.map((a) => a ?? 9) }),
    onSuccess: (r) => {
      setResult(r);
      if (r.passed) onProgress();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-black text-primary">{lesson.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {qs.length} questions · pass mark {lesson.pass_mark}% {done && "· ✓ passed"}
      </p>
      {result && (
        <div className={cn("mt-5 rounded-2xl p-5", result.passed ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900")}>
          <p className="text-2xl font-black">{result.score}%</p>
          <p className="font-semibold">{result.passed ? "Passed — well done!" : `You need ${result.passMark}% to pass. Review and try again.`}</p>
        </div>
      )}
      <ol className="mt-6 space-y-6">
        {qs.map((q, i) => {
          const r = result?.results[i];
          return (
            <li key={q.id} className="rounded-2xl border bg-white p-5">
              <p className="font-semibold">
                {i + 1}. {q.question}
              </p>
              <div className="mt-3 space-y-2">
                {(q.options as Array<string>).map((opt, oi) => (
                  <label
                    key={oi}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm",
                      answers[i] === oi && "border-sys-learn bg-rose-50",
                      r && oi === r.correctIndex && "border-success bg-emerald-50",
                      r && answers[i] === oi && !r.correct && "border-destructive bg-red-50",
                    )}
                  >
                    <input type="radio" name={`q${q.id}`} checked={answers[i] === oi} disabled={Boolean(result) || !enrolled} onChange={() => setAnswers(answers.map((a, j) => (j === i ? oi : a)))} className="accent-rose-600" />
                    {opt}
                  </label>
                ))}
              </div>
              {r?.explanation && <p className="mt-3 rounded-lg bg-muted p-3 text-sm">💡 {r.explanation}</p>}
            </li>
          );
        })}
      </ol>
      {enrolled ? (
        result ? (
          <Button className="mt-6" variant="outline" onClick={() => (setResult(null), setAnswers(qs.map(() => null)))}>
            Retake quiz
          </Button>
        ) : (
          <Button className="mt-6 bg-sys-learn" disabled={answers.some((a) => a === null) || submit.isPending} onClick={() => submit.mutate()}>
            Submit answers
          </Button>
        )
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Enrol to take this quiz.</p>
      )}
    </div>
  );
}

function Assignment({ lesson, enrolled, onProgress }: { lesson: Row; enrolled: boolean; onProgress: () => void }) {
  const sub = lesson.submission as Row | null;
  const [body, setBody] = useState(sub?.body ?? "");
  const [fileUrl, setFileUrl] = useState<string | null>(sub?.file_url ?? null);
  const submit = useMutation({
    mutationFn: () => api.post(`/learn/lessons/${lesson.id}/assignment`, { body, fileUrl }),
    onSuccess: () => {
      toast.success("Assignment submitted");
      onProgress();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-black text-primary">{lesson.title}</h1>
      <Prose html={lesson.content} className="mt-4" />
      {lesson.file_url && (
        <a href={lesson.file_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline">
          <Download className="size-4" /> Assignment brief
        </a>
      )}
      {sub && (
        <div className="mt-6 rounded-2xl border bg-white p-4">
          <p className="flex items-center gap-2 text-sm font-semibold">
            Your submission <StatusBadge status={sub.status} />
            {sub.grade !== null && <span className="ml-auto text-lg font-black text-primary">{sub.grade}/100</span>}
          </p>
          {sub.feedback && <p className="mt-2 rounded-lg bg-muted p-3 text-sm">Instructor: {sub.feedback}</p>}
        </div>
      )}
      {enrolled && (!sub || sub.status !== "graded") && (
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <Textarea rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your answer…" />
          <FileUpload value={fileUrl} onChange={setFileUrl} folder="lessons" label="Attach a file (optional)" />
          <Button type="submit" className="bg-sys-learn" disabled={submit.isPending || (!body.trim() && !fileUrl)}>
            {sub ? "Resubmit" : "Submit assignment"}
          </Button>
        </form>
      )}
    </div>
  );
}

function Discussions({ courseId, lessonId, canPost }: { courseId: number; lessonId?: number; canPost: boolean }) {
  const [onlyLesson, setOnlyLesson] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [replies, setReplies] = useState<Record<number, string>>({});
  const { data, refetch } = useQuery({ queryKey: ["discussions", courseId, onlyLesson ? lessonId : 0], queryFn: () => api.get<{ items: Array<Row> }>(`/learn/c/${courseId}/discussions`, { lesson: onlyLesson ? lessonId : undefined }) });
  const ask = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post(`/learn/c/${courseId}/discussions`, payload),
    onSuccess: () => {
      setTitle("");
      setBody("");
      setReplies({});
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="max-w-3xl space-y-4">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={onlyLesson} onChange={(e) => setOnlyLesson(e.target.checked)} /> Only this lesson
      </label>
      {canPost && (
        <form
          className="space-y-2 rounded-2xl border bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            ask.mutate({ title, body, lessonId });
          }}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question title" required />
          <Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe your question" required />
          <Button size="sm" type="submit" disabled={ask.isPending}>
            <MessageSquare /> Ask
          </Button>
        </form>
      )}
      {data?.items.map((d) => (
        <article key={d.id} className="rounded-2xl border bg-white p-4">
          <div className="flex items-center gap-2 text-sm">
            <Avatar src={d.author_avatar} name={d.author_name} size="sm" />
            <span className="font-semibold">{d.author_name}</span>
            {Number(d.is_instructor) ? <span className="rounded bg-sys-learn/10 px-1.5 text-xs font-bold text-rose-700">Instructor</span> : null}
            <span className="text-xs text-muted-foreground">· {timeAgo(d.created_at)}</span>
            {d.lesson_title && <span className="ml-auto truncate text-xs text-muted-foreground">{d.lesson_title}</span>}
          </div>
          <p className="mt-2 font-bold text-primary">{d.title}</p>
          <p className="mt-1 text-sm whitespace-pre-line">{d.body}</p>
          <ul className="mt-3 space-y-2 border-l-2 pl-4">
            {d.replies.map((r: Row) => (
              <li key={r.id} className="text-sm">
                <span className="font-semibold">{r.author_name}</span>
                {Number(r.is_instructor) ? <span className="ml-1 rounded bg-sys-learn/10 px-1.5 text-xs font-bold text-rose-700">Instructor</span> : null}
                <span className="text-xs text-muted-foreground"> · {timeAgo(r.created_at)}</span>
                <p className="whitespace-pre-line">{r.body}</p>
              </li>
            ))}
          </ul>
          {canPost && (
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (replies[d.id]?.trim()) ask.mutate({ body: replies[d.id], parentId: d.id });
              }}
            >
              <Input value={replies[d.id] ?? ""} onChange={(e) => setReplies({ ...replies, [d.id]: e.target.value })} placeholder="Reply…" />
              <Button size="sm" type="submit" variant="outline">
                Reply
              </Button>
            </form>
          )}
        </article>
      ))}
      {data && data.items.length === 0 && <p className="text-sm text-muted-foreground">No questions yet.</p>}
    </div>
  );
}

function CourseChat({ courseId }: { courseId: number }) {
  const { data, error } = useQuery({ queryKey: ["course-chat", courseId], queryFn: () => api.get<{ id: number }>(`/chat/course/${courseId}`) });
  if (error) return <p className="text-sm text-destructive">{(error as Error).message}</p>;
  if (!data) return <Loading />;
  return <ChatRoom threadId={data.id} className="h-[60vh] max-w-3xl rounded-2xl border" />;
}

function ReviewForm({ courseId, slug }: { courseId: number; slug: string }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const save = useMutation({
    mutationFn: () => api.post(`/learn/c/${courseId}/reviews`, { rating, body }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      void queryClient.invalidateQueries({ queryKey: ["course", slug] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="max-w-xl space-y-3">
      <p className="flex items-center gap-2 font-semibold">
        <Star className="size-4" /> How would you rate this course?
      </p>
      <StarInput value={rating} onChange={setRating} />
      <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What did you think?" />
      <Button disabled={!rating || save.isPending} onClick={() => save.mutate()}>
        Submit review
      </Button>
    </div>
  );
}
