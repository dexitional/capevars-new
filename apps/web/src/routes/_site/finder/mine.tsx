import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { FINDER_TYPES } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { Container, EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/finder/mine")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "My listings | The Finder" }] }),
  component: MyListings,
});

function MyListings() {
  const { data, refetch } = useQuery({ queryKey: ["finder-mine"], queryFn: () => api.get<{ items: Array<Row> }>("/finder/mine") });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/finder/listings/${id}`),
    onSuccess: () => {
      toast.success("Deleted");
      void refetch();
    },
  });
  if (!data) return <Loading />;
  return (
    <Container className="py-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-black text-primary">My listings</h1>
        <Button asChild>
          <Link to="/finder/add">
            <Plus /> Add listing
          </Link>
        </Button>
      </div>
      {data.items.length === 0 ? (
        <EmptyState icon={MapPin} title="You haven't listed anything yet" />
      ) : (
        <div className="space-y-3">
          {data.items.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4">
              <Img src={l.cover_url} className="h-16 w-24 rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-primary">{l.name}</p>
                <p className="text-xs text-muted-foreground">
                  {FINDER_TYPES[l.type as FinderType]?.one} · {[l.area, l.city].filter(Boolean).join(", ")} · {l.view_count} views
                </p>
                {l.status_reason && ["rejected", "hidden"].includes(l.status) && <p className="text-xs text-destructive">Moderator: {l.status_reason}</p>}
              </div>
              <StatusBadge status={l.status} label={l.status === "pending" ? "in review" : undefined} />
              <Button asChild size="icon-sm" variant="ghost">
                <Link to="/finder/l/$slug" params={{ slug: l.slug }} aria-label="View">
                  <Eye />
                </Link>
              </Button>
              <Button asChild size="icon-sm" variant="ghost">
                <Link to="/finder/edit/$id" params={{ id: String(l.id) }} aria-label="Edit">
                  <Pencil />
                </Link>
              </Button>
              <Button size="icon-sm" variant="ghost" onClick={() => confirm("Delete this listing?") && remove.mutate(l.id)} aria-label="Delete">
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
