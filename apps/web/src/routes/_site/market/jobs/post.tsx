import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { Container } from "#/components/site/kit";
import { EMPTY_JOB, JobFields, jobBody } from "#/components/jobs/job-fields";
import type { SetJobField } from "#/components/jobs/job-fields";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/market/jobs/post")({
  validateSearch: z.object({ edit: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Post a job | Job Circle" }] }),
  component: PostJob,
});

function PostJob() {
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY_JOB);
  const set: SetJobField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const existing = useQuery({ queryKey: ["job", edit], queryFn: () => api.get<{ job: Record<string, any>; isOwner: boolean }>(`/jobs/${edit}`), enabled: Boolean(edit) });
  useEffect(() => {
    const j = existing.data?.isOwner ? existing.data.job : null;
    if (!j) return;
    setForm({
      companyName: j.company_name,
      companyLogoUrl: j.company_logo_url,
      title: j.title,
      category: j.category,
      jobType: j.job_type,
      workplace: j.workplace,
      experienceLevel: j.experience_level,
      location: j.location,
      salaryMin: j.salary_min ?? "",
      salaryMax: j.salary_max ?? "",
      salaryPeriod: j.salary_period,
      description: j.description,
      skills: j.skills ?? [],
      applyMethod: j.apply_method,
      applyTarget: j.apply_target ?? "",
      deadline: j.deadline ?? "",
    });
  }, [existing.data]);
  const save = useMutation({
    mutationFn: () => {
      const body = jobBody(form);
      return existing.data?.isOwner ? api.patch(`/jobs/${existing.data.job.id}`, body) : api.post("/jobs", body);
    },
    onSuccess: () => {
      toast.success(existing.data ? "Job updated" : "Job submitted — it goes live after a quick review.");
      void navigate({ to: "/market/jobs/mine" });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Container className="max-w-4xl py-8">
      <h1 className="text-2xl font-black text-primary">{edit ? "Edit job" : "Post a job"}</h1>
      <p className="mt-1 text-sm text-muted-foreground">Posting is free. Jobs are reviewed before they go live, usually within a day.</p>
      <form
        className="mt-6 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <JobFields form={form} set={set} />
        <Button type="submit" size="lg" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} {edit ? "Save changes" : "Submit job"}
        </Button>
      </form>
    </Container>
  );
}
