import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, Mail, MapPin, MessageCircle, Package, Phone, Search, Truck } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { SELLER_KINDS } from "#/lib/labels";
import { CardGridSkeleton, Container, EmptyState, FavouriteButton, Img, Pager, RatingPill, SectionHeader, TextBlock, Verified } from "#/components/site/kit";
import { EventCard, ProductCard } from "#/components/site/cards";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;
const storeQuery = (slug: string) => ({ queryKey: ["store", slug], queryFn: () => api.get<{ store: Row; stats: Row; events: Array<Row> }>(`/market/stores/${slug}`) });

export const Route = createFileRoute("/_site/market/store/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(storeQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.store.store_name} | Capevars` }] : [] }),
  component: StorePage,
});

function StorePage() {
  const { slug } = Route.useParams();
  const { data } = useQuery(storeQuery(slug));
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const products = useQuery({
    queryKey: ["store-products", slug, q, page],
    queryFn: () => api.get<{ items: Array<Row>; total: number }>("/market/products", { store: slug, q, page, pageSize: 24, sort: "newest" }),
    placeholderData: keepPreviousData,
  });
  if (!data) return null;
  const s = data.store;
  const kinds = String(s.kinds).split(",");
  return (
    <div className="pb-16">
      <div className="relative h-48 bg-primary sm:h-64">
        <Img src={s.banner_url} className="size-full opacity-90" fallback={<span />} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
      </div>
      <Container>
        <div className="relative -mt-16 flex flex-col gap-5 rounded-2xl border bg-white p-6 shadow-sm sm:flex-row sm:items-end">
          <Img src={s.logo_url} className="size-28 shrink-0 rounded-2xl border-4 border-white shadow" />
          <div className="min-w-0 flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-black text-primary">
              {s.store_name} {s.is_verified ? <Verified className="size-5" /> : null}
            </h1>
            {s.tagline && <p className="text-muted-foreground">{s.tagline}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <RatingPill value={s.rating_avg} count={s.rating_count} />
              <span className="flex items-center gap-1">
                <Package className="size-4" /> {data.stats.products} products · {data.stats.sold} sold
              </span>
              {s.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" /> {s.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <CalendarDays className="size-4" /> Since {formatDate(s.created_at)}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <FavouriteButton type="store" id={s.id} label />
            {s.whatsapp && (
              <a href={`https://wa.me/${String(s.whatsapp).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-bold text-white">
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-black text-primary">Products</h2>
              <div className="relative w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => (setQ(e.target.value), setPage(1))} placeholder="Search this store" className="bg-white pl-9" />
              </div>
            </div>
            {!products.data ? (
              <CardGridSkeleton count={6} className="md:grid-cols-3 lg:grid-cols-3" />
            ) : products.data.items.length === 0 ? (
              <EmptyState icon={Package} title="No products yet" />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {products.data.items.map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
                </div>
                <Pager page={page} pageSize={24} total={products.data.total} onPage={setPage} />
              </>
            )}
            {data.events.length > 0 && (
              <section className="mt-10">
                <SectionHeader title="Upcoming events" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.events.map((e) => (
                    <EventCard key={e.id} e={e} compact />
                  ))}
                </div>
              </section>
            )}
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl border bg-white p-5">
              <h3 className="font-bold text-primary">About the store</h3>
              <TextBlock text={s.description || "No description yet."} className="mt-2 text-sm text-muted-foreground" />
              <div className="mt-4 flex flex-wrap gap-1.5">
                {kinds.map((k) => (
                  <span key={k} className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
                    {SELLER_KINDS[k]?.label ?? k}
                  </span>
                ))}
              </div>
            </div>
            <ul className="space-y-2.5 rounded-2xl border bg-white p-5 text-sm">
              {s.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4 text-primary" /> <a href={`tel:${s.phone}`}>{s.phone}</a>
                </li>
              )}
              {s.email && (
                <li className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" /> <a href={`mailto:${s.email}`}>{s.email}</a>
                </li>
              )}
              {s.opening_hours && (
                <li className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" /> {s.opening_hours}
                </li>
              )}
              <li className="flex items-center gap-2">
                <Truck className="size-4 text-primary" /> {s.delivers ? `Delivers · ${Number(s.delivery_fee) ? formatMoney(s.delivery_fee) : "free"}` : "Pickup only"}
              </li>
            </ul>
          </aside>
        </div>
      </Container>
    </div>
  );
}
