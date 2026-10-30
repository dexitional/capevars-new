import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, Brain } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import type { QbLevel, QbPublicQuestion } from "#/lib/quizbank";
import { Container, EmptyState, Loading } from "#/components/site/kit";
import { LevelBadge } from "#/components/quizbank/kit";
import { Studier } from "#/components/quizbank/studier";
import { useStartExam } from "#/components/quizbank/exam-settings";

type Study = { course: { id: number; slug: string; title: string; level: QbLevel }; topics: Array<string>; position: number; questions: Array<QbPublicQuestion> };

export const Route = createFileRoute("/_site/learn/quizbank/c/$slug_/study")({
  // Topic ids to study instead of the board's choice, e.g. ?tags=3,5. A single id (?tags=3) is parsed as a number.
  validateSearch: z.object({ tags: z.union([z.string(), z.number()]).transform(String).pipe(z.string().regex(/^[\d,]*$/)).optional().catch(undefined) }),
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData({ queryKey: ["qb-course", params.slug], queryFn: () => api.get<{ course: { id: number } }>(`/learn/quizbank/courses/${params.slug}`) });
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: () => ({ meta: [{ title: "Study mode | Quizbank" }] }),
  component: StudyPage,
});

function StudyPage() {
  const loaded = Route.useLoaderData();
  const { tags } = Route.useSearch();
  const start = useStartExam();
  const { data, error } = useQuery({
    queryKey: ["qb-study", loaded.course.id, tags],
    queryFn: () => api.get<Study>(`/learn/quizbank/courses/${loaded.course.id}/study`, tags === undefined ? {} : { tags }),
  });
  if (error instanceof ApiError && error.status === 401) return <Container className="py-16 text-center text-muted-foreground">Sign in to study this course.</Container>;
  if (!data) return <Loading className="py-24" />;
  if (!data.questions.length) return <EmptyState icon={Brain} title="No questions to study" text="No questions match the topics you picked. Choose more topics on the course page." className="m-8" />;
  const tagIds = tags?.split(",").map(Number).filter(Boolean);
  return (
    <Studier
      key={tags ?? "board"}
      header={
        <Link to="/learn/quizbank/c/$slug" params={{ slug: data.course.slug }} className="flex min-w-0 items-center gap-2 text-sm font-bold text-primary">
          <ArrowLeft className="size-4 shrink-0" />
          <span className="truncate">{data.course.title}</span>
          <LevelBadge level={data.course.level} className="shrink-0" />
        </Link>
      }
      topics={data.topics}
      questions={data.questions}
      position={data.position}
      positionUrl={tags === undefined ? `/learn/quizbank/courses/${data.course.id}/study/position` : ""}
      onExam={() => start.mutate({ courseId: data.course.id, settings: tagIds ? { tagIds } : undefined })}
      examPending={start.isPending}
    />
  );
}
