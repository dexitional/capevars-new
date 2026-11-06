import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { api } from "#/lib/api-client";
import { LEVELS, SUBJECTS } from "#/lib/kidilearn/catalog";
import type { LevelId, SubjectId } from "#/lib/kidilearn/catalog";
import { breadcrumbJsonLd, pageSeo } from "#/lib/seo";
import { Container, EmptyState } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Item = { level: LevelId; subject: SubjectId; title: string; lessons: number };
const catalogQuery = { queryKey: ["kidilearn-catalog"], queryFn: () => api.get<{ items: Array<Item> }>("/public/kidilearn"), staleTime: 5 * 60_000 };

// kidiLearn's public face, for parents and search engines. The learning space
// itself stays behind a sign-in at /learn/kidilearn, and members go straight there.
export const Route = createFileRoute("/_site/kidilearn/")({
  beforeLoad: ({ context }) => {
    if (context.member) throw redirect({ to: "/learn/kidilearn" });
  },
  loader: ({ context }) => context.queryClient.prefetchQuery(catalogQuery),
  head: () =>
    pageSeo({
      title: "kidiLearn: Fun Online Lessons for Children, KG to Basic 9 | Capevars",
      description: "Interactive lessons for children from KG to Basic 9 in literacy, numeracy, science and more. Children explore, play and take on challenges while parents follow their progress.",
      path: "/kidilearn",
      jsonLd: [breadcrumbJsonLd([["OpenLearn", "/learn"], ["kidiLearn", "/kidilearn"]])],
    }),
  component: KidiCatalog,
});

function KidiCatalog() {
  const { data } = useQuery(catalogQuery);
  const items = data?.items ?? [];
  return (
    <div className="pb-16">
      <section className="bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        <Container className="py-14">
          <p className="text-xs font-bold tracking-[0.2em] text-brand-cream uppercase">OpenLearn · kidiLearn</p>
          <h1 className="mt-3 max-w-3xl font-hero text-4xl leading-tight font-bold sm:text-5xl">Fun online lessons for children, KG to Basic 9</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">Every subject is a learning journey: children explore a new idea, play with it, then take on a challenge, while parents follow their progress.</p>
          <Button asChild size="lg" className="mt-6 bg-amber-400 text-[#041d40] hover:bg-amber-300">
            <Link to="/learn/kidilearn">Start learning</Link>
          </Button>
        </Container>
      </section>
      <Container className="mt-10 space-y-10">
        {items.length === 0 && <EmptyState icon={BookOpen} title="Subjects are on their way" text="New kidiLearn subjects are being prepared." />}
        {LEVELS.filter((l) => items.some((i) => i.level === l.id)).map((level) => (
          <section key={level.id}>
            <h2 className="text-xl font-black text-primary">
              {level.label} <span className="text-sm font-medium text-muted-foreground">{level.detail}</span>
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((i) => i.level === level.id)
                .map((i) => (
                  <li key={i.subject}>
                    <Link to="/kidilearn/$level/$subject" params={{ level: i.level, subject: i.subject }} className="block h-full rounded-2xl border bg-white p-4 transition-colors hover:border-primary/40">
                      <span className="block font-bold text-primary">{SUBJECTS[i.subject].name}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{SUBJECTS[i.subject].description}</span>
                      <span className="mt-2 block text-xs font-semibold text-primary/70">{i.lessons.toLocaleString()} lessons</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </Container>
    </div>
  );
}
