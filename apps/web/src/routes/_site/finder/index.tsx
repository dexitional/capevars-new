import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, MapPin, Plus } from "lucide-react";
import { api } from "#/lib/api-client";
import { FINDER_TYPES, FINDER_TYPE_KEYS } from "#/lib/labels";
import { settingsQuery } from "#/components/site/site-footer";
import { Container, Img, SectionHeader, SeeAll } from "#/components/site/kit";
import { ListingCard } from "#/components/site/cards";
import { FinderSearchBox, TYPE_ICONS } from "#/components/finder/finder-search";

type Row = Record<string, any>;
const finderHome = { queryKey: ["finder-home"], queryFn: () => api.get<{ counts: Record<string, number>; byType: Record<string, Array<Row>>; topRated: Array<Row>; cities: Array<Row> }>("/finder/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/finder/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(finderHome),
  head: () => ({ meta: [{ title: "The Finder — hostels, hotels, places & people | Capevars" }] }),
  component: FinderHome,
});

function FinderHome() {
  const { data } = useQuery(finderHome);
  const { data: settings } = useQuery(settingsQuery);
  const cities = settings?.finder.cities ?? [];
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#041d40] via-[#06354f] to-[#0d4f4a] text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative py-14 lg:py-20">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">The Finder</p>
          <h1 className="mt-3 max-w-3xl font-hero text-4xl leading-tight font-bold tracking-normal sm:text-5xl">Find your next stay, meal, place or person.</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/75">Hostels near campus, hotels for visitors, restaurants, businesses, landmarks and professionals — rated by the community.</p>
          <div className="mt-8 max-w-4xl">
            <FinderSearchBox cities={cities} />
          </div>
        </Container>
      </section>

      <Container className="mt-10">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {FINDER_TYPE_KEYS.map((t) => {
            const Icon = TYPE_ICONS[t];
            return (
              <Link key={t} to="/finder/search" search={{ type: t }} className="card-hover flex flex-col items-center gap-2 rounded-2xl border bg-white p-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-sys-finder/10 text-teal-700">
                  <Icon className="size-6" />
                </span>
                <span className="text-sm font-bold text-primary">{FINDER_TYPES[t].label}</span>
                <span className="text-[11px] text-muted-foreground">{data?.counts[t] ?? 0} listed</span>
              </Link>
            );
          })}
        </div>
      </Container>

      {data && data.cities.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Explore by city" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.cities.map((c) => (
              <Link key={c.city} to="/finder/search" search={{ city: c.city }} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Img src={c.cover_url} className="size-full transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="flex items-center gap-1 text-lg font-black">
                    <MapPin className="size-4" /> {c.city}
                  </p>
                  <p className="text-xs text-white/80">{c.n} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {FINDER_TYPE_KEYS.filter((t) => data?.byType[t]?.length).map((t) => (
        <Container key={t} className="mt-12">
          <SectionHeader title={`Popular ${FINDER_TYPES[t].label.toLowerCase()}`} action={<SeeAll to="/finder/search" search={{ type: t }} />} />
          <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {data!.byType[t]!.map((l) => (
              <ListingCard key={l.id} l={l} className="w-72 shrink-0 snap-start" />
            ))}
          </div>
        </Container>
      ))}

      {data && data.topRated.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Guest favourites" text="The highest-rated places on The Finder" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.topRated.map((l) => (
              <ListingCard key={l.id} l={l} />
            ))}
          </div>
        </Container>
      )}

      <Container className="mt-14 grid gap-4 md:grid-cols-2">
        <Link to="/finder/add" className="card-hover flex items-center gap-4 rounded-3xl bg-brand-cream p-6 text-primary">
          <Plus className="size-10" />
          <span>
            <span className="block text-xl font-black">List your hostel, hotel or business</span>
            <span className="block text-sm text-primary/70">Free to list. Reach students, staff and visitors.</span>
          </span>
        </Link>
        <Link to="/account/favourites" className="card-hover flex items-center gap-4 rounded-3xl border bg-white p-6 text-primary">
          <Heart className="size-10 text-rose-500" />
          <span>
            <span className="block text-xl font-black">Your favourites</span>
            <span className="block text-sm text-muted-foreground">Everything you've saved, in one place.</span>
          </span>
        </Link>
      </Container>
    </div>
  );
}
