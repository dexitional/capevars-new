import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { GROUP_CATEGORIES } from "#/lib/labels";
import { Container, EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/mine")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "My groups | Capevars" }] }),
  component: MyGroups,
});

function MyGroups() {
  const { data } = useQuery({ queryKey: ["my-groups"], queryFn: () => api.get<{ items: Array<Row> }>("/groups/mine") });
  if (!data) return <Loading />;
  return (
    <Container className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary">My groups</h1>
        <Button asChild>
          <Link to="/groups/new">
            <Plus /> Create group
          </Link>
        </Button>
      </div>
      {data.items.length === 0 ? (
        <EmptyState icon={Users} title="You haven't joined any groups" action={<Link to="/groups" className="font-semibold text-primary underline">Discover groups</Link>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.items.map((g) => (
            <Link key={g.id} to="/groups/$slug" params={{ slug: g.slug }} className="card-hover flex items-center gap-4 rounded-2xl border bg-white p-4">
              <Img src={g.logo_url} className="size-14 rounded-xl" fallback={<Users className="size-5" />} />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-primary">{g.name}</p>
                <p className="text-xs text-muted-foreground">
                  {GROUP_CATEGORIES[g.category]} · {g.member_count} members · you're {g.membership_status === "pending" ? "awaiting approval" : `a ${g.role}`}
                </p>
                {g.status !== "approved" && (
                  <p className="mt-1 text-xs">
                    <StatusBadge status={g.status} label={g.status === "pending" ? "awaiting approval" : g.status} /> {g.status_reason && <span className="text-destructive">{g.status_reason}</span>}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
