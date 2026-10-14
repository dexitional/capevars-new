import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Lock, MessagesSquare, Pin, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { Avatar, EmptyState } from "#/components/site/kit";
import { useGroup } from "#/components/groups/use-group";
import { PrivateNotice } from "#/components/groups/locked";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/forum/")({ component: Forum });

function Forum() {
  const { slug } = Route.useParams();
  const { data: g } = useGroup(slug);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { data, refetch } = useQuery({ queryKey: ["group-topics", g?.group.id], queryFn: () => api.get<{ items: Array<Row> }>(`/groups/${g!.group.id}/topics`), enabled: Boolean(g?.canSee) });
  const create = useMutation({
    mutationFn: () => api.post(`/groups/${g!.group.id}/topics`, { title, body }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      setOpen(false);
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!g) return null;
  if (!g.canSee) return <PrivateNotice />;
  const isMember = g.membership?.status === "active";
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-primary">Forum</h2>
        {isMember && (
          <Button size="sm" className="bg-sys-groups" onClick={() => setOpen(!open)}>
            <Plus /> New topic
          </Button>
        )}
      </div>
      {open && (
        <form
          className="mb-4 space-y-3 rounded-2xl border bg-white p-4"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic title" required />
          <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What would you like to discuss?" required />
          <Button type="submit" size="sm" disabled={create.isPending}>
            Post topic
          </Button>
        </form>
      )}
      {!data ? null : data.items.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No topics yet" />
      ) : (
        <ul className="divide-y rounded-2xl border bg-white">
          {data.items.map((t) => (
            <li key={t.id}>
              <Link to="/groups/$slug/forum/$topicId" params={{ slug, topicId: String(t.id) }} className="flex items-center gap-3 p-4 hover:bg-muted/50">
                <Avatar src={t.author_avatar} name={t.author_name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-semibold text-primary">
                    {t.is_pinned ? <Pin className="size-3.5" /> : null}
                    {t.is_locked ? <Lock className="size-3.5" /> : null}
                    {t.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.author_name} · {timeAgo(t.created_at)}
                    {t.last_reply_at ? ` · last reply ${timeAgo(t.last_reply_at)}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">{t.reply_count} replies</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
