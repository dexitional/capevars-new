import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Layers } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import type { QbPublicQuestion } from "#/lib/quizbank";
import { Container, EmptyState, Loading } from "#/components/site/kit";
import { Studier } from "#/components/quizbank/studier";
import { useStartExam } from "#/components/quizbank/exam-settings";

type Study = { variation: { id: number; name: string }; topics: Array<string>; position: number; questions: Array<QbPublicQuestion> };

// Study mode for one of the member's study sets (a mix of courses and topics).
export const Route = createFileRoute("/_site/learn/quizbank/s/$id")({
  head: () => ({ meta: [{ title: "Study set | Quizbank" }, { name: "robots", content: "noindex" }] }),
  component: StudySetPage,
});

function StudySetPage() {
  const { id } = Route.useParams();
  const start = useStartExam();
  const { data, error } = useQuery({ queryKey: ["qb-variation-study", id], queryFn: () => api.get<Study>(`/learn/quizbank/variations/${id}/study`) });
  if (error instanceof ApiError) return <EmptyState icon={Layers} title={error.status === 401 ? "Sign in to study" : "Study set not found"} className="m-8" />;
  if (!data) return <Loading className="py-24" />;
  if (!data.questions.length)
    return (
      <Container className="py-8">
        <EmptyState icon={Layers} title="No questions in this set right now" text="Its courses or topics may have changed. Edit the set on your Study Board." />
      </Container>
    );
  return (
    <Studier
      header={
        <Link to="/learn/quizbank" className="flex min-w-0 items-center gap-2 text-sm font-bold text-primary">
          <ArrowLeft className="size-4 shrink-0" />
          <Layers className="size-4 shrink-0 text-indigo-600" />
          <span className="truncate">{data.variation.name}</span>
        </Link>
      }
      topics={data.topics}
      questions={data.questions}
      position={data.position}
      positionUrl={`/learn/quizbank/variations/${data.variation.id}/study/position`}
      onExam={() => start.mutate({ variationId: data.variation.id })}
      examPending={start.isPending}
    />
  );
}
