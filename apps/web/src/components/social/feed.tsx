import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { api } from "#/lib/api-client";
import { EmptyState, Loading } from "#/components/site/kit";
import { PostCard } from "./post-card";

type Row = Record<string, any>;

// Infinite list of posts from any feed endpoint ({ items } paged by ?before=id).
export function PostFeed({ queryKey, path, params, empty }: { queryKey: Array<unknown>; path: string; params?: Record<string, unknown>; empty?: React.ReactNode }) {
  const q = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => api.get<{ items: Array<Row>; posts?: Array<Row> }>(path, { ...params, before: pageParam || undefined }),
    initialPageParam: 0,
    getNextPageParam: (last) => {
      const items = last.items ?? last.posts ?? [];
      return items.length >= 15 ? items[items.length - 1]?.id : undefined;
    },
  });
  const sentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && q.hasNextPage && !q.isFetchingNextPage) void q.fetchNextPage();
    });
    io.observe(el);
    return () => io.disconnect();
  }, [q]);
  if (q.isLoading) return <Loading />;
  const items = q.data?.pages.flatMap((p) => p.items ?? p.posts ?? []) ?? [];
  if (!items.length) return <>{empty ?? <EmptyState icon={Newspaper} title="No posts yet" />}</>;
  return (
    <div className="space-y-4">
      {items.map((p) => (
        <PostCard key={p.id} post={p} onChanged={() => void q.refetch()} />
      ))}
      <div ref={sentinel} />
      {q.isFetchingNextPage && <Loading className="py-6" />}
    </div>
  );
}
