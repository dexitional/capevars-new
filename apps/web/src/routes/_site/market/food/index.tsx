import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search, Utensils } from "lucide-react";
import { api } from "#/lib/api-client";
import { CardGridSkeleton, Chip, Container, EmptyState, PageHero, SectionHeader } from "#/components/site/kit";
import { ProductCard, VendorCard } from "#/components/site/cards";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/food/")({
  head: () => ({ meta: [{ title: "Food services | Capevars" }] }),
  component: FoodHome,
});

const CRAVINGS = ["Jollof", "Waakye", "Banku", "Fried rice", "Pizza", "Shawarma", "Kenkey", "Pastries", "Smoothies"];

function FoodHome() {
  const [q, setQ] = useState("");
  const [openOnly, setOpenOnly] = useState(false);
  const { data } = useQuery({
    queryKey: ["food", q],
    queryFn: () => api.get<{ vendors: Array<Row>; popular: Array<Row> }>("/market/food", { q }),
    placeholderData: keepPreviousData,
  });
  const vendors = (data?.vendors ?? []).filter((v) => !openOnly || v.is_open);
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Food services" title="Campus food, delivered or ready for pickup." text="Order from food vendors, canteens and home kitchens near you.">
        <div className="flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2">
          <Search className="ml-3 size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search dishes or vendors" className="flex-1 bg-transparent py-2.5 text-foreground outline-none" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {CRAVINGS.map((c) => (
            <button key={c} type="button" onClick={() => setQ(c)} className="rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/20">
              {c}
            </button>
          ))}
        </div>
      </PageHero>
      <Container className="mt-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black text-primary">{q ? `Vendors serving “${q}”` : "All vendors"}</h2>
          <Chip active={openOnly} onClick={() => setOpenOnly(!openOnly)}>
            Open now
          </Chip>
        </div>
        {!data ? (
          <CardGridSkeleton count={4} />
        ) : vendors.length === 0 ? (
          <EmptyState icon={Utensils} title="No vendors found" text="Try another dish, or check back later." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {vendors.map((v) => (
              <VendorCard key={v.id} v={v} />
            ))}
          </div>
        )}
        {data && data.popular.length > 0 && !q && (
          <section className="mt-12">
            <SectionHeader title="Popular dishes" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {data.popular.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
