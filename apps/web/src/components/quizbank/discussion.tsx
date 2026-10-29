// The per-question discussion: members' insights, corrections, remarks and
// better explanations, shown and hidden with a toggle.
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronDown, Loader2, MessagesSquare, ThumbsUp, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { QB_DISCUSSION_KINDS } from "#/lib/quizbank";
import type { QbDiscussionKind } from "#/lib/quizbank";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Avatar } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { SlideDown } from "./kit";

interface Comment {
  id: number;
  kind: QbDiscussionKind;
  body: string;
  helpful: number;
  voted: boolean;
  mine: boolean;
  createdAt: string;
  author: { name: string; username: string; avatarUrl: string | null };
}

const KIND_STYLE: Record<QbDiscussionKind, string> = {
  insight: "bg-sky-100 text-sky-800",
  correction: "bg-red-100 text-red-800",
  remark: "bg-slate-100 text-slate-700",
  explanation: "bg-emerald-100 text-emerald-800",
};

function Thread({ questionId }: { questionId: number }) {
  const member = useMember();
  const requireMember = useRequireMember();
  const [kind, setKind] = useState<QbDiscussionKind>("insight");
  const [body, setBody] = useState("");
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["qb-discussion", questionId],
    queryFn: () => api.get<{ items: Array<Comment> }>(`/learn/quizbank/questions/${questionId}/discussion`),
  });
  const post = useMutation({
    mutationFn: () => api.post(`/learn/quizbank/questions/${questionId}/discussion`, { kind, body }),
    onSuccess: () => {
      setBody("");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const vote = useMutation({ mutationFn: (id: number) => api.post(`/learn/quizbank/discussion/${id}/helpful`), onSuccess: () => void refetch(), onError: (e) => toast.error(e.message) });
  const remove = useMutation({ mutationFn: (id: number) => api.delete(`/learn/quizbank/discussion/${id}`), onSuccess: () => void refetch(), onError: (e) => toast.error(e.message) });
  return (
    <div className="space-y-3 pt-3">
      {isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading the discussion…
        </p>
      ) : data?.items.length === 0 ? (
        <p className="rounded-xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">No one has commented yet. Share an insight or a clearer explanation.</p>
      ) : (
        <ul className="space-y-2">
          {data?.items.map((d) => (
            <li key={d.id} className="rounded-xl border bg-white p-3">
              <div className="flex items-center gap-2">
                <Avatar src={d.author.avatarUrl} name={d.author.name} size="sm" />
                <span className="text-sm font-semibold text-primary">{d.author.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", KIND_STYLE[d.kind])}>{QB_DISCUSSION_KINDS[d.kind]}</span>
                <span className="ml-auto text-[11px] text-muted-foreground">{formatDateTime(d.createdAt)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{d.body}</p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  disabled={d.mine || vote.isPending}
                  onClick={() => requireMember(() => vote.mutate(d.id))}
                  className={cn("flex items-center gap-1 rounded-full px-2 py-1 font-semibold disabled:opacity-60", d.voted ? "bg-primary text-white" : "bg-secondary text-primary hover:bg-accent")}
                >
                  <ThumbsUp className="size-3.5" /> Helpful{d.helpful ? ` · ${d.helpful}` : ""}
                </button>
                {d.mine && (
                  <button type="button" onClick={() => confirm("Delete your comment?") && remove.mutate(d.id)} className="flex items-center gap-1 text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <form
        className="rounded-xl border bg-secondary/30 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          requireMember(() => post.mutate());
        }}
      >
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(QB_DISCUSSION_KINDS) as Array<QbDiscussionKind>).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={cn("rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", kind === k ? cn(KIND_STYLE[k], "ring-current/30") : "bg-white text-muted-foreground ring-border")}
            >
              {QB_DISCUSSION_KINDS[k]}
            </button>
          ))}
        </div>
        <Textarea
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={member ? "Add an insight, a correction, or explain it more simply…" : "Sign in to join the discussion"}
          className="mt-2 bg-white"
          maxLength={4000}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm" disabled={post.isPending || body.trim().length < 3}>
            {post.isPending && <Loader2 className="animate-spin" />} Post
          </Button>
        </div>
      </form>
    </div>
  );
}

export function DiscussionToggle({ questionId, count }: { questionId: number; count: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t pt-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-primary hover:bg-secondary"
      >
        <MessagesSquare className="size-4" /> {open ? "Hide discussion" : "Show discussion"}
        {count > 0 && <span className="rounded-full bg-primary px-1.5 text-[11px] text-white">{count}</span>}
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <SlideDown open>
          <Thread questionId={questionId} />
        </SlideDown>
      )}
    </div>
  );
}
