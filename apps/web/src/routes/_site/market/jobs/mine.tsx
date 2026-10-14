import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Briefcase, Pencil, Plus, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { Container, EmptyState, Img, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/jobs/mine")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "My jobs | Job Circle" }] }),
  component: MyJobs,
});

function MyJobs() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["my-jobs"], queryFn: () => api.get<{ posted: Array<Row>; applied: Array<Row> }>("/jobs/mine") });
  const close = useMutation({
    mutationFn: (id: number) => api.patch(`/jobs/${id}`, { close: true }),
    onSuccess: () => {
      toast.success("Job closed");
      void queryClient.invalidateQueries({ queryKey: ["my-jobs"] });
    },
  });
  if (!data) return <Loading />;
  return (
    <Container className="space-y-10 py-8">
      <section>
        <SectionHeader
          title="Jobs I posted"
          action={
            <Button asChild size="sm">
              <Link to="/market/jobs/post">
                <Plus /> Post a job
              </Link>
            </Button>
          }
        />
        {data.posted.length === 0 ? (
          <EmptyState icon={Briefcase} title="You haven't posted any jobs" />
        ) : (
          <div className="divide-y rounded-2xl border bg-white">
            {data.posted.map((j) => (
              <div key={j.id} className="flex flex-wrap items-center gap-4 p-4">
                <Img src={j.company_logo_url} className="size-12 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Link to="/market/jobs/$slug" params={{ slug: j.slug }} className="font-semibold text-primary hover:underline">
                    {j.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {j.company_name} · posted {timeAgo(j.created_at)} · {j.view_count} views
                  </p>
                  {j.status_reason && j.status === "rejected" && <p className="mt-1 text-xs text-destructive">Moderator: {j.status_reason}</p>}
                </div>
                <StatusBadge status={j.status} label={j.status === "pending" ? "in review" : undefined} />
                <Button asChild size="sm" variant="outline">
                  <Link to="/market/jobs/manage/$id" params={{ id: String(j.id) }}>
                    <Users /> {j.applicants} applicants
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/market/jobs/post" search={{ edit: j.slug }}>
                    <Pencil /> Edit
                  </Link>
                </Button>
                {j.status === "published" && (
                  <Button size="sm" variant="ghost" onClick={() => confirm("Close this job to new applicants?") && close.mutate(j.id)}>
                    Close
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section>
        <SectionHeader title="My applications" />
        {data.applied.length === 0 ? (
          <EmptyState icon={Briefcase} title="No applications yet" action={<Link to="/market/jobs" className="font-semibold text-primary underline">Find jobs</Link>} />
        ) : (
          <div className="divide-y rounded-2xl border bg-white">
            {data.applied.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-4">
                <Img src={a.company_logo_url} className="size-12 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <Link to="/market/jobs/$slug" params={{ slug: a.slug }} className="font-semibold text-primary hover:underline">
                    {a.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {a.company_name} · applied {timeAgo(a.created_at)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
