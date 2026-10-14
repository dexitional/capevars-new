import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { Segmented } from "#/components/admin/ui";

export const Route = createFileRoute("/admin/_admin/social")({ component: Social });

function Social() {
  const [tab, setTab] = useState<"posts" | "pages">("posts");
  return (
    <div className="space-y-6">
      <AdminPageHeader title="SocialNet" description="Hide posts that break community rules and manage pages." />
      <Segmented value={tab} onChange={setTab} options={[{ value: "posts", label: "Posts" }, { value: "pages", label: "Pages" }]} />
      {tab === "posts" ? (
        <ModerationTable
          key="posts"
          entity="posts"
          columns={[
            { label: "Post", render: (r) => <TitleCell title={<span className="line-clamp-3 max-w-md font-normal">{r.title}</span>} sub={`${r.author} · ${r.visibility}${(r.images ?? []).length ? ` · ${r.images.length} photos` : ""}`} /> },
            { label: "Engagement", render: (r) => <span className="text-xs">{r.reaction_count} reactions · {r.comment_count} comments</span> },
            { label: "Reports", render: (r) => (Number(r.open_reports) ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">{r.open_reports} open</span> : <span className="text-xs text-muted-foreground">—</span>) },
            { label: "Posted", render: (r) => <DateCell value={r.created_at} time /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      ) : (
        <ModerationTable
          key="pages"
          entity="pages"
          columns={[
            { label: "Page", render: (r) => <TitleCell title={r.title} sub={`${r.category} · by ${r.owner_name}`} image={r.avatar_url} round /> },
            { label: "Followers", render: (r) => <span className="text-xs">{r.follower_count}</span> },
            { label: "Created", render: (r) => <DateCell value={r.created_at} /> },
            { label: "Status", render: (r) => <StatusCell row={r} /> },
          ]}
        />
      )}
    </div>
  );
}
