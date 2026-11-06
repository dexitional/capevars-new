// The fields of a job post, shared by members posting a job and admins posting one on a member's behalf.
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { JOB_TYPES, LEVELS, WORKPLACES } from "#/lib/labels";
import { ImageUpload } from "#/components/site/kit";
import { TagInput } from "#/components/site/tag-input";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

export const EMPTY_JOB = {
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

export type JobForm = typeof EMPTY_JOB;
export type SetJobField = <T extends keyof JobForm>(k: T, v: JobForm[T]) => void;

export const jobBody = (form: JobForm) => ({ ...form, salaryMin: form.salaryMin ? Number(form.salaryMin) : null, salaryMax: form.salaryMax ? Number(form.salaryMax) : null });

export function JobFields({ form, set }: { form: JobForm; set: SetJobField }) {
  const { data: meta } = useQuery({ queryKey: ["job-meta"], queryFn: () => api.get<{ categories: Array<string> }>("/jobs/meta") });
  return (
    <>
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
    </>
  );
}
