import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, BookOpen } from "lucide-react";
import { api } from "#/lib/api-client";
import { Container, EmptyState, Loading, SectionHeader, StatusBadge } from "#/components/site/kit";
import { CourseCard } from "#/components/site/cards";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/learn/my")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "My learning | OpenLearn" }] }),
  component: MyLearning,
});

function MyLearning() {
  const { data } = useQuery({ queryKey: ["my-learning"], queryFn: () => api.get<{ items: Array<Row> }>("/learn/my") });
  if (!data) return <Loading />;
  const inProgress = data.items.filter((c) => c.status === "active");
  const completed = data.items.filter((c) => c.status === "completed");
  const pending = data.items.filter((c) => c.status === "pending_payment");
  return (
    <Container className="space-y-10 py-8">
      <h1 className="text-2xl font-black text-primary">My learning</h1>
      {data.items.length === 0 && <EmptyState icon={BookOpen} title="You haven't enrolled yet" action={<Link to="/learn/courses" className="font-semibold text-primary underline">Browse courses</Link>} />}
      {inProgress.length > 0 && (
        <section>
          <SectionHeader title="In progress" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {inProgress.map((c) => (
              <CourseCard key={c.id} c={c} progress={c.progress_percent} />
            ))}
          </div>
        </section>
      )}
      {pending.length > 0 && (
        <section>
          <SectionHeader title="Awaiting payment confirmation" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pending.map((c) => (
              <div key={c.id} className="relative">
                <CourseCard c={c} />
                <StatusBadge status="pending_payment" className="absolute top-3 left-3" />
              </div>
            ))}
          </div>
        </section>
      )}
      {completed.length > 0 && (
        <section>
          <SectionHeader title="Completed" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {completed.map((c) => (
              <div key={c.id} className="space-y-2">
                <CourseCard c={c} progress={100} />
                {c.certificate_code && (
                  <Link to="/learn/certificate/$code" params={{ code: c.certificate_code }} className="flex items-center justify-center gap-2 rounded-xl bg-brand-cream py-2 text-sm font-bold text-primary">
                    <Award className="size-4" /> View certificate
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
