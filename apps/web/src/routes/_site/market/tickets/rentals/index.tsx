import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bus, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatMoney } from "#/lib/money";
import { CardGridSkeleton, Container, EmptyState, Img, PageHero } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/tickets/rentals/")({
  head: () => ({ meta: [{ title: "Bus rentals | Capevars" }] }),
  component: RentalsPage,
});

function RentalsPage() {
  const { data } = useQuery({ queryKey: ["rentals"], queryFn: () => api.get<{ items: Array<Row> }>("/tickets/rentals") });
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Bus rentals" title="Hire a bus for your trip." text="Excursions, field trips, conferences, weddings and funerals. Request a quote from trusted operators." />
      <Container className="mt-8">
        {!data ? (
          <CardGridSkeleton count={6} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Bus} title="No buses listed yet" />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((r) => (
              <Link key={r.id} to="/market/tickets/rentals/$id" params={{ id: String(r.id) }} className="card-hover overflow-hidden rounded-2xl border bg-white">
                <Img src={r.images?.[0]} className="aspect-video w-full" fallback={<Bus className="size-8" />} />
                <div className="p-4">
                  <p className="font-bold text-primary">{r.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="size-4" /> {r.capacity} seats · {r.vehicle_type}
                  </p>
                  <p className="text-xs text-muted-foreground">{r.operator}</p>
                  <p className="mt-2 font-extrabold text-primary">
                    {formatMoney(r.price_per_day)} <span className="text-xs font-medium text-muted-foreground">/ day</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
