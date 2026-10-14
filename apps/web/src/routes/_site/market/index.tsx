import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BadgePercent, ChevronRight, ShieldCheck, Truck, Wallet } from "lucide-react";
import { api } from "#/lib/api-client";
import { Container, SectionHeader, SeeAll } from "#/components/site/kit";
import { ProductCard, StoreCard, VendorCard } from "#/components/site/cards";
import { NamedIcon } from "#/components/site/icon";

type Row = Record<string, any>;
const marketHome = { queryKey: ["market-home"], queryFn: () => api.get<Record<string, Array<Row>>>("/market/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/market/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(marketHome),
  head: () => ({ meta: [{ title: "Marketplace | Capevars" }] }),
  component: MarketHome,
});

function MarketHome() {
  const { data } = useQuery(marketHome);
  const d = data ?? {};
  const categories = (d.categories ?? []).filter((c) => !c.is_food);
  return (
    <div className="pb-16">
      <Container className="pt-6">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr_260px]">
          {/* Category rail */}
          <nav className="hidden rounded-2xl border bg-white p-2 lg:block" aria-label="Categories">
            {categories.map((c) => (
              <Link key={c.id} to="/market/browse" search={{ category: c.slug }} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-primary">
                <NamedIcon name={c.icon} className="size-4 text-muted-foreground" />
                <span className="flex-1 truncate">{c.name}</span>
                <ChevronRight className="size-3.5 text-muted-foreground" />
              </Link>
            ))}
          </nav>
          {/* Banner */}
          {/* perimeter-glow: a bright comet sweeps around all four sides over a dim resting ring, on a loop (styles.css). Replaces a plain border. */}
          <div className="hero-navy perimeter-glow relative flex min-h-72 flex-col justify-center overflow-hidden rounded-2xl p-8 text-white">
            <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative max-w-md">
              <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">Capevars Marketplace</p>
              <h1 className="mt-3 font-hero text-3xl leading-tight font-bold tracking-normal sm:text-4xl">Buy from people you trust — right on campus.</h1>
              <p className="mt-3 text-white/70">Verified sellers, honest prices, delivery or pickup. Pay online, with MoMo, or on delivery.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link to="/market/browse" className="rounded-full bg-brand-cream px-5 py-2.5 text-sm font-bold text-primary hover:bg-brand-butter">
                  Shop all products
                </Link>
                <Link to="/market/browse" search={{ deals: true }} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold hover:bg-white/10">
                  Today's deals
                </Link>
              </div>
            </div>
          </div>
          {/* Promises */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {[
              { icon: ShieldCheck, title: "Verified sellers", text: "Every store is approved before it can sell." },
              { icon: Truck, title: "Delivery or pickup", text: "Sellers set fees; pickup is always free." },
              { icon: Wallet, title: "Flexible payment", text: "Card, Mobile Money or cash on delivery." },
              { icon: BadgePercent, title: "Student prices", text: "Deals from students and local businesses." },
            ].map((x) => (
              <div key={x.title} className="flex items-start gap-3 rounded-2xl border bg-white p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <x.icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-primary">{x.title}</span>
                  <span className="block text-xs text-muted-foreground">{x.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile categories */}
        <div className="no-scrollbar mt-5 flex gap-3 overflow-x-auto lg:hidden">
          {categories.map((c) => (
            <Link key={c.id} to="/market/browse" search={{ category: c.slug }} className="flex w-20 shrink-0 flex-col items-center gap-1.5 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl border bg-white text-primary">
                <NamedIcon name={c.icon} className="size-6" />
              </span>
              <span className="line-clamp-2 text-[11px] font-medium">{c.name}</span>
            </Link>
          ))}
        </div>
      </Container>

      {d.deals && d.deals.length > 0 && (
        <Container className="mt-10">
          <div className="rounded-3xl bg-gradient-to-r from-rose-600 to-amber-500 p-5 text-white">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <BadgePercent className="size-6" /> Flash deals
              </h2>
              <Link to="/market/browse" search={{ deals: true }} className="text-sm font-bold hover:underline">
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {d.deals.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </Container>
      )}

      {d.featured && d.featured.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Top picks" text="Popular with buyers this week" action={<SeeAll to="/market/browse" search={{ sort: "popular" }} />} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {d.featured.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </Container>
      )}

      {d.food && d.food.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Hungry? Order from campus kitchens" action={<SeeAll to="/market/food">All vendors</SeeAll>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.food.slice(0, 4).map((v) => (
              <VendorCard key={v.id} v={v} />
            ))}
          </div>
        </Container>
      )}

      {d.latest && d.latest.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="New arrivals" action={<SeeAll to="/market/browse" search={{ sort: "newest" }} />} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {d.latest.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </Container>
      )}

      {d.stores && d.stores.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Top stores" text="Trusted sellers on Capevars" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {d.stores.map((s) => (
              <StoreCard key={s.id} s={s} />
            ))}
          </div>
        </Container>
      )}
    </div>
  );
}
