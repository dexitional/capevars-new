// Star ratings and comments on a Quizbank course. Members who have sat an
// exam on the course, or put it on their Study Board, can leave one review,
// then edit or delete it.
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquareText, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Avatar, StarInput, Stars } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

export type QbReview = {
  id: number;
  rating: number;
  body: string | null;
  createdAt: string;
  updatedAt: string;
  author: { name: string; username: string | null; avatarUrl: string | null };
};

export type QbReviews = {
  items: Array<QbReview>;
  breakdown: Record<number, number>;
  mine: QbReview | null;
  canReview: boolean;
};

function ReviewForm({ courseId, mine, onChanged }: { courseId: number; mine: QbReview | null; onChanged: () => void }) {
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [body, setBody] = useState(mine?.body ?? "");
  useEffect(() => {
    setRating(mine?.rating ?? 0);
    setBody(mine?.body ?? "");
  }, [mine]);
  const save = useMutation({
    mutationFn: () => api.put(`/learn/quizbank/courses/${courseId}/review`, { rating, body }),
    onSuccess: () => {
      toast.success(mine ? "Review updated" : "Thanks for your review!");
      onChanged();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/learn/quizbank/courses/${courseId}/review`),
    onSuccess: () => {
      toast.success("Review deleted");
      onChanged();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="space-y-3 rounded-xl bg-secondary/50 p-4">
      <p className="text-sm font-semibold text-primary">{mine ? "Your review" : "How would you rate this course?"}</p>
      <StarInput value={rating} onChange={setRating} />
      <Textarea rows={3} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What helped you? What could be better?" aria-label="Your comment" />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={!rating || save.isPending} onClick={() => save.mutate()}>
          {mine ? "Update review" : "Post review"}
        </Button>
        {mine && (
          <Button size="sm" variant="ghost" disabled={remove.isPending} onClick={() => confirm("Delete your review?") && remove.mutate()}>
            <Trash2 /> Delete
          </Button>
        )}
      </div>
    </div>
  );
}

export function CourseReviews({
  courseId,
  ratingAvg,
  ratingCount,
  reviews,
  onChanged,
}: {
  courseId: number;
  ratingAvg: number | null;
  ratingCount: number;
  reviews: QbReviews;
  onChanged: () => void;
}) {
  const member = useMember();
  const requireMember = useRequireMember();
  const total = Math.max(1, ratingCount);
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="flex items-center gap-2 text-lg font-black text-primary">
        <MessageSquareText className="size-5" /> Reviews
      </h2>
      {ratingCount > 0 && ratingAvg !== null ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-[150px_1fr]">
          <div className="text-center">
            <p className="text-5xl font-black text-amber-700">{ratingAvg.toFixed(1)}</p>
            <Stars value={ratingAvg} className="mt-1" />
            <p className="text-xs text-muted-foreground">
              {ratingCount} review{ratingCount === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((n) => (
              <li key={n} className="flex items-center gap-2 text-xs">
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full bg-amber-500"
                    style={{
                      width: `${((reviews.breakdown[n] ?? 0) / total) * 100}%`,
                    }}
                  />
                </span>
                <Stars value={n} className="[&_svg]:size-3" />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">No reviews yet. Be the first to share how this course helped you.</p>
      )}

      <div className="mt-5">
        {!member ? (
          <Button variant="outline" size="sm" onClick={() => requireMember(() => undefined)}>
            Sign in to review
          </Button>
        ) : reviews.canReview || reviews.mine ? (
          <ReviewForm courseId={courseId} mine={reviews.mine} onChanged={onChanged} />
        ) : (
          <p className="text-sm text-muted-foreground">Sit an exam on this course, or add it to your Study Board, to leave a review.</p>
        )}
      </div>

      {reviews.items.length > 0 && (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.items.map((r) => (
            <li key={r.id} className="rounded-2xl border bg-white p-4">
              <div className="flex items-center gap-2">
                <Avatar src={r.author.avatarUrl} name={r.author.name} size="sm" />
                <span className="text-sm font-semibold">{r.author.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{timeAgo(r.updatedAt)}</span>
              </div>
              <Stars value={r.rating} className="mt-2" />
              {r.body && <p className="mt-1 text-sm whitespace-pre-line">{r.body}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
