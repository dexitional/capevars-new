import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { Container, EmptyState, Loading } from "#/components/site/kit";
import { PostCard } from "#/components/social/post-card";

export const Route = createFileRoute("/_site/social/post/$id")({ component: SinglePost });

function SinglePost() {
  const { id } = Route.useParams();
  const { data, error, refetch } = useQuery({ queryKey: ["post", id], queryFn: () => api.get<{ post: Record<string, any> }>(`/social/posts/${id}`), retry: false });
  return (
    <Container className="max-w-2xl py-8">
      {error ? <EmptyState title="Post not available" text="It may have been deleted, or you don't have permission to see it." /> : !data ? <Loading /> : <PostCard post={data.post} onChanged={() => void refetch()} />}
    </Container>
  );
}
