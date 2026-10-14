import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, LayoutGrid, MapPin, Store } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatEventRange } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { CardGridSkeleton, Chip, Container, EmptyState, Img, PageHero } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/exhibitions/")({
  head: () => ({ meta: [{ title: "Exhibitions | Capevars" }] }),
  component: ExhibitionsPage,
});

function ExhibitionsPage() {
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming");
  const { data } = useQuery({ queryKey: ["exhibitions", when], queryFn: () => api.get<{ items: Array<Row> }>("/exhibitions", { when }) });
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Exhibition services" title="Fairs, expos and trade shows." text="Visit, or book a booth to showcase your products and services to campus and the community.">
        <Link to="/seller/apply" className="inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-2.5 text-sm font-bold text-primary">
          <LayoutGrid className="size-4" /> Organise an exhibition
        </Link>
      </PageHero>
      <Container className="mt-8">
        <div className="mb-6 flex gap-2">
          <Chip active={when === "upcoming"} onClick={() => setWhen("upcoming")}>
            Upcoming
          </Chip>
          <Chip active={when === "past"} onClick={() => setWhen("past")}>
            Past
          </Chip>
        </div>
        {!data ? (
          <CardGridSkeleton count={6} />
        ) : data.items.length === 0 ? (
          <EmptyState icon={Store} title="No exhibitions yet" />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((x) => {
              const left = x.booths_total - x.booths_taken;
              return (
                <Link key={x.id} to="/market/exhibitions/$slug" params={{ slug: x.slug }} className="card-hover overflow-hidden rounded-2xl border bg-white">
                  <Img src={x.cover_url} className="aspect-[16/9] w-full" />
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-primary">{x.title}</h3>
                    {x.theme && <p className="text-sm text-muted-foreground italic">“{x.theme}”</p>}
                    <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4" /> {formatEventRange(x.starts_at, x.ends_at)}
                    </p>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4" /> {x.venue}
                      {x.city ? `, ${x.city}` : ""}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
                      <span>
                        Booths from <strong className="text-primary">{formatMoney(x.booth_price, { free: "Free" })}</strong>
                      </span>
                      <span className={left > 0 ? "font-semibold text-success" : "text-destructive"}>{left > 0 ? `${left} left` : "Fully booked"}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
