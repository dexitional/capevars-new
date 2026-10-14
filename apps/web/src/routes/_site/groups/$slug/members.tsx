import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { PersonRow } from "#/components/site/cards";
import { useGroup } from "#/components/groups/use-group";
import { PrivateNotice } from "#/components/groups/locked";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/members")({ component: Members });

const ROLE_LABEL: Record<string, string> = { owner: "Owner", admin: "Admin", moderator: "Moderator", member: "Member" };

function Members() {
  const { slug } = Route.useParams();
  const { data: g } = useGroup(slug);
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["group-members", g?.group.id], queryFn: () => api.get<{ items: Array<Row> }>(`/groups/${g!.group.id}/members`), enabled: Boolean(g?.canSee) });
  if (!g) return null;
  if (!g.canSee) return <PrivateNotice />;
  const items = (data?.items ?? []).filter((m) => !q || m.user_name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-primary">Members ({data?.items.length ?? "…"})</h2>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members" className="w-56 bg-white" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div key={m.user_id} className="rounded-2xl border bg-white p-4">
            <PersonRow
              u={{ id: m.user_id, full_name: m.user_name, username: m.user_username, avatar_url: m.user_avatar, headline: m.user_headline, is_verified: m.user_verified }}
              sub={m.title ?? (m.role !== "member" ? ROLE_LABEL[m.role] : m.user_headline)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
