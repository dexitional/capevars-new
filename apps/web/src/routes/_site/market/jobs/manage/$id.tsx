import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FileText, Mail, MapPin, Phone, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { Avatar, Container, EmptyState, Loading, StatusBadge, TextBlock } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/jobs/manage/$id")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Applicants | Job Circle" }] }),
  component: Applicants,
});

const STATUSES = ["reviewed", "shortlisted", "rejected", "hired"] as const;

function Applicants() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["applicants", id], queryFn: () => api.get<{ job: Row; items: Array<Row> }>(`/jobs/${id}/applications`) });
  const setStatus = useMutation({
    mutationFn: ({ appId, status }: { appId: number; status: string }) => api.patch(`/jobs/applications/${appId}`, { status }),
    onSuccess: () => {
      toast.success("Updated — the applicant has been notified");
      void queryClient.invalidateQueries({ queryKey: ["applicants", id] });
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <Container className="py-8">
      <Link to="/market/jobs/mine" className="text-sm text-muted-foreground hover:underline">
        ← My jobs
      </Link>
      <h1 className="mt-2 text-2xl font-black text-primary">{data.job.title}</h1>
      <p className="text-muted-foreground">{data.items.length} applicants</p>
      {data.items.length === 0 ? (
        <EmptyState icon={Users} title="No applicants yet" className="mt-6" />
      ) : (
        <div className="mt-6 space-y-4">
          {data.items.map((a) => (
            <article key={a.id} className="rounded-2xl border bg-white p-5">
              <div className="flex flex-wrap items-start gap-4">
                <Avatar src={a.avatar_url} name={a.full_name} size="lg" />
                <div className="min-w-0 flex-1">
                  <Link to="/u/$username" params={{ username: a.username }} className="text-lg font-bold text-primary hover:underline">
                    {a.full_name}
                  </Link>
                  {a.headline && <p className="text-sm text-muted-foreground">{a.headline}</p>}
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <a href={`mailto:${a.email}`} className="flex items-center gap-1 hover:text-primary">
                      <Mail className="size-4" /> {a.email}
                    </a>
                    <a href={`tel:${a.phone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="size-4" /> {a.phone}
                    </a>
                    {a.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" /> {a.location}
                      </span>
                    )}
                    <span>Applied {timeAgo(a.created_at)}</span>
                  </div>
                  {a.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {a.skills.map((s: string) => (
                        <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <StatusBadge status={a.status} />
              </div>
              {a.cover_letter && <TextBlock text={a.cover_letter} className="mt-4 rounded-xl bg-muted p-4 text-sm" />}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {a.cv_url && (
                  <a href={a.cv_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-muted">
                    <FileText className="size-4" /> View CV
                  </a>
                )}
                <span className="ml-auto text-xs text-muted-foreground">Move to:</span>
                {STATUSES.map((s) => (
                  <button key={s} type="button" disabled={a.status === s} onClick={() => setStatus.mutate({ appId: a.id, status: s })} className="rounded-full border px-3 py-1 text-xs font-semibold capitalize hover:bg-muted disabled:bg-primary disabled:text-white">
                    {s}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}
