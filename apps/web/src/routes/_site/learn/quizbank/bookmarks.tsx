import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Bookmark } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import type { QbPublicQuestion } from "#/lib/quizbank";
import { Container, EmptyState, Loading } from "#/components/site/kit";
import { Studier } from "#/components/quizbank/studier";

// Study mode for the member's bookmarked questions, a mix from any course.
export const Route = createFileRoute("/_site/learn/quizbank/bookmarks")({
  head: () => ({ meta: [{ title: "My bookmarks | Quizbank" }, { name: "robots", content: "noindex" }] }),
  component: BookmarksPage,
});

function BookmarksPage() {
  // Loaded once per visit, so removing a bookmark doesn't pull the question off the screen or shift the ones after it.
  const { data, error } = useQuery({
    queryKey: ["qb-bookmarks-study"],
    queryFn: () => api.get<{ questions: Array<QbPublicQuestion> }>("/learn/quizbank/bookmarks/study"),
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  if (error instanceof ApiError && error.status === 401) return <EmptyState icon={Bookmark} title="Sign in to see your bookmarks" className="m-8" />;
  if (!data) return <Loading className="py-24" />;
  if (!data.questions.length)
    return (
      <Container className="py-8">
        <EmptyState icon={Bookmark} title="No bookmarks yet" text="Bookmark a question in study mode to save it here, mixed with questions from any other course." />
      </Container>
    );
  return (
    <Studier
      header={
        <Link to="/learn/quizbank" className="flex min-w-0 items-center gap-2 text-sm font-bold text-primary">
          <ArrowLeft className="size-4 shrink-0" />
          <Bookmark className="size-4 shrink-0 text-amber-600" />
          <span className="truncate">My bookmarks</span>
        </Link>
      }
      topics={[]}
      questions={data.questions}
      position={0}
      positionUrl=""
    />
  );
}
