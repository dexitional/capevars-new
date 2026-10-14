import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Award, BookOpen, PlayCircle, Search, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatCompact } from "#/lib/money";
import { Avatar, Container, SectionHeader, SeeAll } from "#/components/site/kit";
import { CourseCard } from "#/components/site/cards";
import { NamedIcon } from "#/components/site/icon";

type Row = Record<string, any>;
const learnHome = { queryKey: ["learn-home"], queryFn: () => api.get<Record<string, any>>("/learn/home"), staleTime: 60_000 };

export const Route = createFileRoute("/_site/learn/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(learnHome),
  head: () => ({ meta: [{ title: "OpenLearn — courses by experts | Capevars" }] }),
  component: LearnHome,
});

function Row4({ title, items, action }: { title: string; items: Array<Row>; action?: React.ReactNode }) {
  if (!items?.length) return null;
  return (
    <Container className="mt-12">
      <SectionHeader title={title} action={action} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((c) => (
          <CourseCard key={c.id} c={c} />
        ))}
      </div>
    </Container>
  );
}

function LearnHome() {
  const { data } = useQuery(learnHome);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const d = data ?? {};
  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#041d40] via-[#2a1840] to-[#5a1530] text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">OpenLearn</p>
            <h1 className="mt-3 font-hero text-4xl leading-tight font-bold tracking-normal sm:text-5xl">Learn skills that move you forward.</h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">Courses from lecturers, professionals and creators — with video lessons, quizzes, assignments and certificates.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void navigate({ to: "/learn/courses", search: { q: q || undefined } });
              }}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2"
            >
              <Search className="ml-3 size-5 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="What do you want to learn?" className="flex-1 bg-transparent py-2.5 text-foreground outline-none" />
              <button className="rounded-xl bg-sys-learn px-5 py-2.5 text-sm font-bold text-white">Search</button>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              [BookOpen, formatCompact(d.stats?.courses), "Courses"],
              [Users, formatCompact(d.stats?.enrollments), "Enrolments"],
              [Award, formatCompact(d.stats?.instructors), "Instructors"],
              [PlayCircle, "Free", "Previews on every course"],
            ].map(([Icon, value, label]) => {
              const I = Icon as typeof BookOpen;
              return (
                <div key={label as string} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                  <I className="size-6 text-brand-cream" />
                  <p className="mt-3 text-2xl font-black">{value as string}</p>
                  <p className="text-sm text-white/70">{label as string}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {d.categories && (
        <Container className="mt-10">
          <SectionHeader title="Explore categories" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {d.categories.map((c: Row) => (
              <Link key={c.id} to="/learn/courses" search={{ category: c.slug }} className="card-hover flex items-center gap-3 rounded-2xl border bg-white p-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sys-learn/10 text-rose-700">
                  <NamedIcon name={c.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-sm font-semibold text-primary">{c.name}</span>
                  <span className="text-[11px] text-muted-foreground">{c.course_count} courses</span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      <Row4 title="Featured courses" items={d.featured} action={<SeeAll to="/learn/courses" />} />
      <Row4 title="Most popular" items={d.popular} action={<SeeAll to="/learn/courses" search={{ sort: "popular" }} />} />
      <Row4 title="Free to start" items={d.free} action={<SeeAll to="/learn/courses" search={{ price: "free" }} />} />
      <Row4 title="New on OpenLearn" items={d.newest} action={<SeeAll to="/learn/courses" search={{ sort: "newest" }} />} />

      {d.instructors?.length > 0 && (
        <Container className="mt-12">
          <SectionHeader title="Top instructors" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.instructors.map((i: Row) => (
              <Link key={i.id} to="/u/$username" params={{ username: i.username }} className="card-hover flex items-center gap-3 rounded-2xl border bg-white p-4">
                <Avatar src={i.avatar_url} name={i.full_name} size="lg" />
                <span className="min-w-0">
                  <span className="block font-bold text-primary">{i.full_name}</span>
                  <span className="line-clamp-1 block text-xs text-muted-foreground">{i.headline}</span>
                  <span className="text-xs text-muted-foreground">
                    {i.courses} courses · {formatCompact(i.learners)} learners
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </Container>
      )}

      <Container className="mt-14">
        <div className="grid items-center gap-6 overflow-hidden rounded-3xl bg-brand-cream p-8 md:grid-cols-[1fr_auto]">
          <div>
            <h3 className="text-2xl font-black text-primary">Share your knowledge. Earn from it.</h3>
            <p className="mt-2 max-w-xl text-primary/70">Anyone can teach on OpenLearn. Build a course with our step-by-step guidelines, set your price, and we'll review it before launch.</p>
          </div>
          <Link to="/learn/teach" className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-white">
            Start teaching
          </Link>
        </div>
      </Container>
    </div>
  );
}
