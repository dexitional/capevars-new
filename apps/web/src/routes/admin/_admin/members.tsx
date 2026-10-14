import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { MEMBER_TYPES } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/members")({ component: Members });

function Members() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Members" description="Everyone with a Capevars account. Suspend abusive accounts or verify trusted ones." />
      <ModerationTable
        entity="members"
        columns={[
          { label: "Member", render: (r) => <TitleCell title={r.title} sub={`@${r.username} · ${r.email}`} image={r.avatar_url} round /> },
          { label: "Type", render: (r) => <span className="text-xs">{MEMBER_TYPES[r.member_type]}{r.institution ? ` · ${r.institution}` : ""}</span> },
          { label: "Sign-in", render: (r) => <span className="text-xs">{Number(r.uses_google) ? "Google" : "Email"}</span> },
          { label: "Store", render: (r) => <span className="text-xs">{r.store_name ?? "—"}</span> },
          { label: "Last seen", render: (r) => <DateCell value={r.last_seen_at ?? r.last_login_at} time /> },
          { label: "Joined", render: (r) => <DateCell value={r.created_at} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
