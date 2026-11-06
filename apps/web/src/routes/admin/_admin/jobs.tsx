import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { canManage } from "#/lib/permissions";
import { AdminPageHeader, errorToast } from "#/components/admin/ui";
import { MemberPicker } from "#/components/admin/member-picker";
import type { PickedMember } from "#/components/admin/member-picker";
import { EMPTY_JOB, JobFields, jobBody } from "#/components/jobs/job-fields";
import type { SetJobField } from "#/components/jobs/job-fields";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { JOB_TYPES } from "#/lib/labels";

export const Route = createFileRoute("/admin/_admin/jobs")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "jobs", "pending"), component: Jobs });

function JobDialog({ owner, onClose, onSaved }: { owner: PickedMember; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(EMPTY_JOB);
  const set: SetJobField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = useMutation({
    mutationFn: () => api.post("/admin/jobs", { ...jobBody(form), userId: owner.id }),
    onSuccess: () => {
      toast.success("Job published.");
      onSaved();
      onClose();
    },
    onError: errorToast("Couldn't post the job."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Post a job for {owner.name}</DialogTitle>
          <DialogDescription>It goes live straight away, under their account. Applicants and edits are theirs to manage.</DialogDescription>
        </DialogHeader>
        <form
          id="admin-job-form"
          className="min-w-0 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
        >
          <JobFields form={form} set={set} />
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="admin-job-form" disabled={save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} Publish job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Jobs() {
  const { admin } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const [picking, setPicking] = useState(false);
  const [owner, setOwner] = useState<PickedMember | null>(null);
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Job Circle"
        description="Review jobs before they're published, reject scams and pay-to-apply posts, and post jobs for members."
        actions={
          canManage(admin.role, "jobs") && (
            <Button onClick={() => setPicking(true)}>
              <Plus /> Post a job
            </Button>
          )
        }
      />
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
      {picking && (
        <MemberPicker
          title="Post a job for which member?"
          description="The job sits under their account and they're notified."
          onPick={(m) => {
            setOwner(m);
            setPicking(false);
          }}
          onClose={() => setPicking(false)}
        />
      )}
      {owner && <JobDialog key={owner.id} owner={owner} onClose={() => setOwner(null)} onSaved={() => void queryClient.invalidateQueries({ queryKey: ["admin-mod", "jobs"] })} />}
    </div>
  );
}
