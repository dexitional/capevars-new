import { useEffect, useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { JOB_TYPES, LEVELS, WORKPLACES } from "#/lib/labels";
import { Container, ImageUpload } from "#/components/site/kit";
import { TagInput } from "#/components/site/tag-input";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/market/jobs/post")({
  validateSearch: z.object({ edit: z.string().optional().catch(undefined) }),
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Post a job | Job Circle" }] }),
  component: PostJob,
});

const EMPTY = {
  companyName: "",
  companyLogoUrl: null as string | null,
  title: "",
  category: "Technology",
  jobType: "full_time",
  workplace: "onsite",
  experienceLevel: "any",
  location: "",
  salaryMin: "",
  salaryMax: "",
  salaryPeriod: "month",
  description: "",
  skills: [] as Array<string>,
  applyMethod: "platform",
  applyTarget: "",
  deadline: "",
};

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: Record<string, string> | Array<string> }) {
  const entries = Array.isArray(options) ? options.map((o) => [o, o]) : Object.entries(options);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="h-9 w-full rounded-md border border-input bg-white px-3 text-sm">
      {entries.map(([k, v]) => (
        <option key={k} value={k}>
          {v}
        </option>
      ))}
    </select>
  );
}

function PostJob() {
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const set = <K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) => setForm((f) => ({ ...f, [k]: v }));
  const { data: meta } = useQuery({ queryKey: ["job-meta"], queryFn: () => api.get<{ categories: Array<string> }>("/jobs/meta") });
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
      const body = { ...form, salaryMin: form.salaryMin ? Number(form.salaryMin) : null, salaryMax: form.salaryMax ? Number(form.salaryMax) : null };
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
        <section className="grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-[120px_1fr]">
          <ImageUpload value={form.companyLogoUrl} onChange={(v) => set("companyLogoUrl", v)} folder="jobs" aspect="aspect-square" label="Logo" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company / organisation" className="sm:col-span-2">
              <Input value={form.companyName} onChange={(e) => set("companyName", e.target.value)} required />
            </Field>
            <Field label="Job title" className="sm:col-span-2">
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
            </Field>
          </div>
        </section>
        <section className="grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-3">
          <Field label="Category">
            <Select value={form.category} onChange={(v) => set("category", v)} options={meta?.categories ?? [form.category]} />
          </Field>
          <Field label="Job type">
            <Select value={form.jobType} onChange={(v) => set("jobType", v)} options={JOB_TYPES} />
          </Field>
          <Field label="Workplace">
            <Select value={form.workplace} onChange={(v) => set("workplace", v)} options={WORKPLACES} />
          </Field>
          <Field label="Experience">
            <Select value={form.experienceLevel} onChange={(v) => set("experienceLevel", v)} options={LEVELS} />
          </Field>
          <Field label="Location" className="sm:col-span-2">
            <Input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Cape Coast, or Remote" required />
          </Field>
          <Field label="Salary from (GH₵)">
            <Input inputMode="numeric" value={form.salaryMin} onChange={(e) => set("salaryMin", e.target.value)} />
          </Field>
          <Field label="Salary to (GH₵)">
            <Input inputMode="numeric" value={form.salaryMax} onChange={(e) => set("salaryMax", e.target.value)} />
          </Field>
          <Field label="Per">
            <Select value={form.salaryPeriod} onChange={(v) => set("salaryPeriod", v)} options={{ hour: "Hour", day: "Day", month: "Month", year: "Year", project: "Project" }} />
          </Field>
        </section>
        <section className="space-y-4 rounded-2xl border bg-white p-6">
          <Field label="Description" hint="Responsibilities, requirements, benefits and how to stand out.">
            <Textarea rows={10} value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </Field>
          <Field label="Skills">
            <TagInput value={form.skills} onChange={(v) => set("skills", v)} />
          </Field>
        </section>
        <section className="grid gap-4 rounded-2xl border bg-white p-6 sm:grid-cols-3">
          <Field label="How should people apply?">
            <Select value={form.applyMethod} onChange={(v) => set("applyMethod", v)} options={{ platform: "On Capevars (CV + cover letter)", email: "By email", link: "On our website" }} />
          </Field>
          {form.applyMethod !== "platform" && (
            <Field label={form.applyMethod === "email" ? "Application email" : "Application link"}>
              <Input value={form.applyTarget} onChange={(e) => set("applyTarget", e.target.value)} required />
            </Field>
          )}
          <Field label="Deadline (optional)">
            <Input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
          </Field>
        </section>
        <Button type="submit" size="lg" disabled={save.isPending}>
          {save.isPending && <Loader2 className="animate-spin" />} {edit ? "Save changes" : "Submit job"}
        </Button>
      </form>
    </Container>
  );
}
