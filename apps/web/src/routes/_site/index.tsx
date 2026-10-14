import { useEffect, useRef, useState } from "react";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Briefcase, MapPin, Package, Search, Sparkles, Store, Ticket, UserCheck, Users, Utensils } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatCompact } from "#/lib/money";
import { DEFAULT_SETTINGS } from "#/lib/settings";
import { settingsQuery } from "#/components/site/site-footer";
import { SYSTEMS } from "#/components/site/site-header";
import { SystemLogo } from "#/components/site/system-logo";
import { Container, SectionHeader, SeeAll } from "#/components/site/kit";
import { CourseCard, EventCard, GroupCard, JobCard, ListingCard, ProductCard } from "#/components/site/cards";
import { asset } from "#/lib/asset";
import { OptimizedImage } from "#/components/site/optimized-image";

type Row = Record<string, any>;
interface HomeData {
  stats: Record<string, number>;
  products: Array<Row>;
  listings: Array<Row>;
  groups: Array<Row>;
  courses: Array<Row>;
  events: Array<Row>;
  jobs: Array<Row>;
}

const homeQuery = { queryKey: ["home"], queryFn: () => api.get<HomeData>("/public/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/")({
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(homeQuery), context.queryClient.ensureQueryData(settingsQuery)]),
  component: HomePage,
});

const TILE_ART: Record<string, { gradient: string; chips: Array<string> }> = {
  market: { gradient: "from-amber-400/25 to-transparent", chips: ["Shop", "Food", "Tickets", "Jobs", "Expos"] },
  finder: { gradient: "from-teal-400/25 to-transparent", chips: ["Hostels", "Hotels", "Restaurants", "People"] },
  groups: { gradient: "from-violet-400/25 to-transparent", chips: ["Forums", "Meetings", "Donations"] },
  social: { gradient: "from-blue-400/25 to-transparent", chips: ["Friends", "Walls", "Pages", "Chats"] },
  learn: { gradient: "from-rose-400/25 to-transparent", chips: ["Courses", "Quizzes", "Certificates"] },
  leadgen: { gradient: "from-cyan-400/25 to-transparent", chips: ["Leads", "Bulk SMS", "Bulk email"] },
};


// The "Capevars in numbers" items: an icon for what's counted, and a link to where the number lives.
const STAT_TILES: Array<{ label: string; stat: string; icon: LucideIcon; to: string }> = [
  { label: "Members", stat: "members", icon: UserCheck, to: "/social/friends" },
  { label: "Stores", stat: "stores", icon: Store, to: "/market" },
  { label: "Products", stat: "products", icon: Package, to: "/market/browse" },
  { label: "Finder listings", stat: "listings", icon: MapPin, to: "/finder" },
  { label: "Campus groups", stat: "groups_count", icon: Users, to: "/groups" },
  { label: "Courses", stat: "courses", icon: BookOpen, to: "/learn/courses" },
];

// Counts up from zero the first time the number scrolls into view. The server
// renders the real value, and a number already on screen at load is left alone,
// so nothing flashes; reduced-motion users always see the plain value.
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || value <= 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);
  return <span ref={ref}>{formatCompact(shown)}</span>;
}
function HomePage() {
  const { data } = useQuery(homeQuery);
  const { data: settings } = useQuery(settingsQuery);
  const home = settings?.home ?? DEFAULT_SETTINGS.home;
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const stats = data?.stats ?? {};
  // The quiet numbers line under the hero copy: only what's non-zero.
  const heroStats = (
    [
      ["members", stats.members],
      ["stores", stats.stores],
      ["courses", stats.courses],
      ["campus groups", stats.groups_count],
    ] as Array<[string, number | undefined]>
  ).filter((entry): entry is [string, number] => Number(entry[1]) > 0);

  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero-navy relative overflow-hidden text-white">
        {home.heroImageUrl ? (
          <>
            {/* The image set in Admin → Settings, under a navy wash that keeps the copy readable. */}
            <OptimizedImage src={home.heroImageUrl} alt="" priority sizes="100vw" className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/25" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/70 to-transparent" aria-hidden="true" />
          </>
        ) : (
          <img src={asset("logo-mark-light.png")} alt="" className="pointer-events-none absolute -right-24 -bottom-16 hidden w-[520px] opacity-[0.07] lg:block" aria-hidden="true" />
        )}
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative py-16 sm:py-20 lg:py-28">
          <div className="max-w-5xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-cream/30 bg-white/5 px-3.5 py-1.5 text-xs font-bold tracking-wider text-brand-cream uppercase">
              <Sparkles className="size-3.5" /> {home.heroEyebrow}
            </p>
            {/* Editorial serif heading: the title, then the highlight on its own gradient line. */}
            <h1 className="mt-6 max-w-5xl font-hero text-4xl leading-[1.15] font-bold tracking-normal sm:text-5xl lg:text-[58px]">
              {home.heroTitle}
              <br />
              <span className="bg-gradient-to-r from-brand-cream via-brand-gold to-brand-butter bg-clip-text text-transparent">{home.heroHighlight}</span>
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">{home.heroText}</p>
            {heroStats.length > 0 && (
              <p className="mt-2.5 text-xs text-white/55">
                {heroStats.map(([label, n], i) => (
                  <span key={label}>
                    {i > 0 && " · "}
                    <span className="font-semibold text-brand-cream tabular-nums">{formatCompact(n)}</span> {label}
                  </span>
                ))}
              </p>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (q.trim().length >= 2) void navigate({ to: "/search", search: { q: q.trim() } });
              }}
              className="mt-8 flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20"
            >
              <Search className="ml-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={home.searchPlaceholder}
                aria-label="Search Capevars"
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-base text-foreground outline-none"
              />
              <button type="submit" className="rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90">
                Search
              </button>
            </form>
            {home.trendingSearches.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-white/60">Trending:</span>
                {home.trendingSearches.map((t) => (
                  <Link key={t} to="/search" search={{ q: t }} className="rounded-full bg-white/10 px-3 py-1 text-white/90 hover:bg-white/20">
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ---- The six platforms ---- */}
      <Container className="relative z-10 -mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          {SYSTEMS.map((s) => (
            <Link
              key={s.key}
              to={s.to}
              className="card-hover group relative overflow-hidden rounded-2xl border border-border bg-white p-5 shadow-lg shadow-primary/5"
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", TILE_ART[s.key]?.gradient)} aria-hidden="true" />
              {/* flex + h-full: grid rows stretch every card to match the tallest, so this fills that height and
                  mt-auto below pins Explore to the bottom — aligned across the row regardless of blurb/chip length. */}
              <div className="relative flex h-full flex-col">
                <SystemLogo system={s.key} size="xl" className="transition-transform duration-300 group-hover:-rotate-6" />
                {/* Dancing Script with a gold brush-stroke underline — the same treatment as the platform title in each sub-system's secondary nav. */}
                <h2 className="relative mt-4 w-fit pb-1 font-script text-2xl leading-none font-bold whitespace-nowrap text-primary">
                  {s.label}
                  <svg
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 -bottom-1 h-2 w-full text-brand-gold"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 5.6C24 2.4 58 1.6 98 3.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {TILE_ART[s.key]?.chips.map((chip) => (
                    <span key={chip} className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-border">
                      {chip}
                    </span>
                  ))}
                </div>
                {/* Pill button: pale yellow on navy text/ring, lifts to butter on hover, presses on click, arrow turns to "launch" on hover. */}
                <div className="mt-auto flex justify-center pt-4">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-cream py-1.5 pr-4 pl-3 text-sm font-bold text-primary ring-2 ring-primary shadow-[0_4px_10px_-2px_rgb(4_29_64/0.3)] transition-[background-color,transform] duration-500 group-hover:bg-brand-butter group-active:scale-[0.97] group-active:duration-150">
                    <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-rotate-45" />
                    Explore
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* ---- Stats: "Capevars in numbers" (same footprint as the old strip, restyled) ---- */}
      <Container className="py-12">
        <section
          aria-label="Capevars in numbers"
          className="hero-navy perimeter-glow relative overflow-hidden rounded-2xl px-4 py-2.5 text-white"
        >
          <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="pointer-events-none absolute -top-16 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-brand-cream/10 blur-3xl" aria-hidden="true" />
          <ul className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {STAT_TILES.map((t) => (
              <li key={t.label}>
                <Link
                  to={t.to}
                  className="group/stat flex items-center gap-3 rounded-xl px-2 py-1.5 transition duration-300 hover:bg-white/[0.08]"
                >
                  {/* Same pale-yellow tile as the platform logos (44px, 28% radius), with the stat's own icon. */}
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-brand-cream text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.75),inset_0_0_0_1px_rgb(4_29_64/0.1),0_1px_2px_rgb(4_29_64/0.18)] transition-transform duration-300 group-hover/stat:-rotate-6">
                    <t.icon className="size-5" strokeWidth={2.25} />
                  </span>
                  <span className="min-w-0">
                    <span className="block bg-gradient-to-r from-brand-cream to-brand-gold bg-clip-text text-2xl leading-tight font-black text-transparent tabular-nums">
                      <CountUp value={Number(stats[t.stat]) || 0} />
                    </span>
                    <span className="block truncate text-xs text-white/70 group-hover/stat:text-white">{t.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>

      {/* ---- Marketplace ---- */}
      {data && data.products.length > 0 && (
        <Container className="pb-14">
          <SectionHeader title="Fresh in the Marketplace" text="Hand-picked deals from verified sellers" action={<SeeAll to="/market">Shop all</SeeAll>} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {[
              { to: "/market/food", label: "Order food", icon: Utensils, text: "Campus vendors near you" },
              { to: "/market/tickets", label: "Get tickets", icon: Ticket, text: "Events and bus seats" },
              { to: "/market/jobs", label: "Find a job", icon: Briefcase, text: "Gigs, internships, careers" },
              { to: "/seller/apply", label: "Start selling", icon: Store, text: "Open your store free" },
            ].map((x) => (
              <Link key={x.to} to={x.to} className="card-hover flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
                <span className="flex size-11 items-center justify-center rounded-xl bg-sys-market/15 text-amber-700">
                  <x.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-bold text-primary">{x.label}</span>
                  <span className="block text-xs text-muted-foreground">{x.text}</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      {/* ---- Finder ---- */}
      {data && data.listings.length > 0 && (
        <section className="bg-white py-14">
          <Container>
            <SectionHeader title="Stay, eat & explore" text="Top-rated hostels, hotels and restaurants on The Finder" action={<SeeAll to="/finder">Open The Finder</SeeAll>} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.listings.map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---- Events ---- */}
      {data && data.events.length > 0 && (
        <Container className="py-14">
          <SectionHeader title="Happening soon" text="Get your e-tickets before they sell out" action={<SeeAll to="/market/tickets">All events</SeeAll>} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.events.map((e) => (
              <EventCard key={e.id} e={e} />
            ))}
          </div>
        </Container>
      )}

      {/* ---- Groups + Jobs ---- */}
      {data && (data.groups.length > 0 || data.jobs.length > 0) && (
        <section className="bg-white py-14">
          <Container className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <SectionHeader title="Campus groups" text="Associations, clubs and communities to join" action={<SeeAll to="/groups">Discover</SeeAll>} />
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.groups.map((g) => (
                  <GroupCard key={g.id} g={g} />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Job Circle" text="Latest openings" action={<SeeAll to="/market/jobs">All jobs</SeeAll>} />
              <div className="space-y-3">
                {data.jobs.map((j) => (
                  <JobCard key={j.id} j={j} />
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ---- Courses ---- */}
      {data && data.courses.length > 0 && (
        <Container className="py-14">
          <SectionHeader title="Learn something new" text="Popular courses on OpenLearn" action={<SeeAll to="/learn/courses">Browse courses</SeeAll>} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.courses.map((c) => (
              <CourseCard key={c.id} c={c} />
            ))}
          </div>
        </Container>
      )}

      {/* ---- CTA ---- */}
      <Container className="pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="hero-navy relative overflow-hidden rounded-3xl p-8 text-white">
            <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
            <div className="relative">
              <Store className="size-9 text-brand-cream" />
              <h3 className="mt-4 text-2xl font-black">Sell to your campus and city</h3>
              <p className="mt-2 max-w-sm text-white/70">Products, food, event tickets, bus trips or exhibitions — open one store for all of them.</p>
              <Link to="/seller/apply" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-cream px-5 py-2.5 text-sm font-bold text-primary hover:bg-brand-butter">
                Open your store <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-brand-cream p-8 text-primary">
            <div className="dot-grid-dark absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <BookOpen className="size-9" />
              <h3 className="mt-4 text-2xl font-black">Teach what you know</h3>
              <p className="mt-2 max-w-sm text-primary/70">Build a course with videos, articles, quizzes and assignments. Set your price and reach learners everywhere.</p>
              <Link to="/learn/teach" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90">
                Become an instructor <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
