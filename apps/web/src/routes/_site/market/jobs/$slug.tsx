import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Building2, CalendarClock, CheckCircle2, ExternalLink, Flag, Mail, MapPin, Wallet } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatDate, timeAgo } from "#/lib/format";
import { JOB_TYPES, LEVELS, WORKPLACES, label } from "#/lib/labels";
import { useMember, useRequireMember } from "#/hooks/useMember";
import { Avatar, Container, FavouriteButton, FileUpload, Img, StatusBadge, TextBlock } from "#/components/site/kit";
import { JobCard, salaryText } from "#/components/site/cards";
import { ReportButton } from "#/components/site/report-button";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const jobQuery = (slug: string) => ({ queryKey: ["job", slug], queryFn: () => api.get<{ job: Row; similar: Array<Row>; application: Row | null; isOwner: boolean }>(`/jobs/${slug}`) });

export const Route = createFileRoute("/_site/market/jobs/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(jobQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.job.title} at ${loaderData.job.company_name} | Job Circle` }] : [] }),
  component: JobPage,
});

function JobPage() {
  const { slug } = Route.useParams();
  const { data, refetch } = useQuery(jobQuery(slug));
  const member = useMember();
  const requireMember = useRequireMember();
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ phone: "", coverLetter: "", cvUrl: null as string | null });
  const apply = useMutation({
    mutationFn: () => api.post(`/jobs/${data!.job.id}/apply`, form),
    onSuccess: () => {
      toast.success("Application sent!");
      setApplying(false);
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const j = data.job;
  const salary = salaryText(j);
  const open = j.status === "published" && (!j.deadline || new Date(`${j.deadline}T23:59:59Z`).getTime() >= Date.now());
  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-start gap-4">
              <Img src={j.company_logo_url} className="size-16 shrink-0 rounded-2xl border" fallback={<Building2 className="size-6" />} />
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black text-primary">{j.title}</h1>
                <p className="text-muted-foreground">{j.company_name}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm">
                  <span className="rounded-full bg-secondary px-3 py-1 font-medium">{label(JOB_TYPES, j.job_type)}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-medium">{label(WORKPLACES, j.workplace)}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-medium">{label(LEVELS, j.experience_level)}</span>
                  <span className="rounded-full bg-secondary px-3 py-1 font-medium">{j.category}</span>
                </div>
              </div>
              <FavouriteButton type="job" id={j.id} className="border" />
            </div>
            <dl className="mt-6 grid gap-4 border-t pt-5 text-sm sm:grid-cols-3">
              <div className="flex gap-2">
                <MapPin className="size-4 text-primary" />
                <div>
                  <dt className="text-xs text-muted-foreground">Location</dt>
                  <dd className="font-semibold">{j.location}</dd>
                </div>
              </div>
              <div className="flex gap-2">
                <Wallet className="size-4 text-primary" />
                <div>
                  <dt className="text-xs text-muted-foreground">Salary</dt>
                  <dd className="font-semibold">{salary ?? "Not disclosed"}</dd>
                </div>
              </div>
              <div className="flex gap-2">
                <CalendarClock className="size-4 text-primary" />
                <div>
                  <dt className="text-xs text-muted-foreground">Apply by</dt>
                  <dd className="font-semibold">{j.deadline ? formatDate(j.deadline) : "Open until filled"}</dd>
                </div>
              </div>
            </dl>
          </div>
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-black text-primary">About the role</h2>
            <TextBlock text={j.description} className="mt-3 text-sm leading-relaxed" />
            {j.skills?.length > 0 && (
              <>
                <h3 className="mt-6 font-bold text-primary">Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {j.skills.map((s: string) => (
                    <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </section>
          {data.similar.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-black text-primary">Similar jobs</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {data.similar.map((x) => (
                  <JobCard key={x.id} j={x} />
                ))}
              </div>
            </section>
          )}
        </div>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-white p-5">
            {data.isOwner ? (
              <>
                <p className="text-sm">You posted this job.</p>
                <StatusBadge status={j.status} className="mt-2" />
                {j.status_reason && <p className="mt-2 text-sm text-destructive">{j.status_reason}</p>}
                <Button asChild className="mt-4 w-full">
                  <Link to="/market/jobs/manage/$id" params={{ id: String(j.id) }}>
                    View applicants
                  </Link>
                </Button>
              </>
            ) : data.application ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto size-10 text-success" />
                <p className="mt-2 font-bold text-primary">You applied {timeAgo(data.application.created_at)}</p>
                <StatusBadge status={data.application.status} className="mt-2" />
              </div>
            ) : !open ? (
              <p className="text-center text-sm text-muted-foreground">This job is no longer accepting applications.</p>
            ) : j.apply_method === "platform" ? (
              applying ? (
                <form
                  className="space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    apply.mutate();
                  }}
                >
                  <p className="font-bold text-primary">Apply as {member?.fullName}</p>
                  <Field label="Phone">
                    <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                  </Field>
                  <Field label="CV (PDF or Word)">
                    <FileUpload value={form.cvUrl} onChange={(v) => setForm({ ...form, cvUrl: v })} folder="cvs" />
                  </Field>
                  <Field label="Cover letter">
                    <Textarea rows={5} value={form.coverLetter} onChange={(e) => setForm({ ...form, coverLetter: e.target.value })} placeholder="Why are you a great fit?" />
                  </Field>
                  <Button type="submit" className="w-full" disabled={apply.isPending}>
                    Send application
                  </Button>
                </form>
              ) : (
                <Button size="lg" className="h-12 w-full rounded-xl" onClick={() => requireMember(() => setApplying(true))}>
                  <Briefcase /> Apply now
                </Button>
              )
            ) : j.apply_method === "email" ? (
              <Button asChild size="lg" className="h-12 w-full rounded-xl">
                <a href={`mailto:${j.apply_target}?subject=${encodeURIComponent(`Application: ${j.title}`)}`}>
                  <Mail /> Apply by email
                </a>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-12 w-full rounded-xl">
                <a href={j.apply_target} target="_blank" rel="noopener noreferrer nofollow">
                  <ExternalLink /> Apply on company site
                </a>
              </Button>
            )}
          </div>
          <div className="rounded-2xl border bg-white p-5 text-sm">
            <p className="text-xs text-muted-foreground">Posted {timeAgo(j.created_at)} by</p>
            <Link to="/u/$username" params={{ username: j.poster_username }} className="mt-2 flex items-center gap-2 font-semibold hover:underline">
              <Avatar src={j.poster_avatar} name={j.poster_name} size="sm" /> {j.poster_name}
            </Link>
            <p className="mt-3 text-xs text-muted-foreground">Never pay to apply for a job. Report suspicious posts.</p>
            <ReportButton entityType="job" entityId={j.id} className="mt-2">
              <Flag className="size-3.5" /> Report job
            </ReportButton>
          </div>
        </aside>
      </div>
    </Container>
  );
}
