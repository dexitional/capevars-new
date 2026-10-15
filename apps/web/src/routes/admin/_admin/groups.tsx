import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { GROUP_CATEGORIES } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/groups")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "groups", "pending"), component: Groups });

function Groups() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Campus Groups" description="Every new group needs approval before it's visible to the public." />
      <ModerationTable
        entity="groups"
        defaultStatus="pending"
        columns={[
          { label: "Group", render: (r) => <TitleCell title={r.title} sub={`${GROUP_CATEGORIES[r.category]} · ${r.visibility} · ${r.join_policy === "open" ? "open to join" : "approval to join"}`} image={r.logo_url} /> },
          { label: "About", render: (r) => <p className="line-clamp-3 max-w-xs text-xs text-muted-foreground">{r.tagline}</p> },
          { label: "Created by", render: (r) => <span className="text-xs">{r.creator_name}<br />{r.creator_email}</span> },
          { label: "Members", render: (r) => <span className="text-xs">{r.member_count}</span> },
          { label: "Created", render: (r) => <DateCell value={r.created_at} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
