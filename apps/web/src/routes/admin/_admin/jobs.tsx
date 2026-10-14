import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader } from "#/components/admin/ui";
import { ModerationTable } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { JOB_TYPES } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/jobs")({ component: Jobs });

function Jobs() {
  return (
    <div className="space-y-6">
      <AdminPageHeader title="Job Circle" description="Review jobs before they're published. Reject scams and pay-to-apply posts." />
      <ModerationTable
        entity="jobs"
        defaultStatus="pending"
        columns={[
          { label: "Job", render: (r) => <TitleCell title={r.title} sub={`${r.company_name} · ${r.location}`} image={r.company_logo_url} /> },
          { label: "Type", render: (r) => <span className="text-xs">{JOB_TYPES[r.job_type]} · {r.category}</span> },
          { label: "Posted by", render: (r) => <span className="text-xs">{r.poster_name}<br />{r.poster_email}</span> },
          { label: "Applicants", render: (r) => <span className="text-xs">{r.applicants} · {r.view_count} views</span> },
          { label: "Deadline", render: (r) => <DateCell value={r.deadline} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />
    </div>
  );
}
