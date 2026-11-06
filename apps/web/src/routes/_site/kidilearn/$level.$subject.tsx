import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Gamepad2, Lightbulb, Trophy } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { LEVELS, SUBJECTS } from "#/lib/kidilearn/catalog";
import type { SubjectId } from "#/lib/kidilearn/catalog";
import { breadcrumbJsonLd, courseJsonLd, pageSeo } from "#/lib/seo";
import { Container } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Data = { course: { title: string; subtitle: string | null; description: string | null; price: number | string; lessons: number }; lessons: Array<string> };
const subjectQuery = (level: string, subject: string) => ({
  queryKey: ["kidilearn-catalog", level, subject],
  queryFn: () => api.get<Data>(`/public/kidilearn/${level}/${subject}`),
  staleTime: 5 * 60_000,
});
const levelOf = (id: string) => LEVELS.find((l) => l.id === id);
const subjectOf = (id: string) => (SUBJECTS as Record<string, (typeof SUBJECTS)[SubjectId] | undefined>)[id];

const describe = (level: string, subject: string, lessons: number) =>
  `${subjectOf(subject)?.name} for ${levelOf(level)?.label} on kidiLearn: ${lessons.toLocaleString()} interactive online lessons. ${subjectOf(subject)?.description} Children explore, play and take on challenges while parents follow their progress.`;

// One subject in kidiLearn's public catalog: what it covers, with no account or progress on it.
export const Route = createFileRoute("/_site/kidilearn/$level/$subject")({
  loader: async ({ context, params }) => {
    if (!levelOf(params.level) || !subjectOf(params.subject)) throw notFound();
    try {
      return await context.queryClient.ensureQueryData(subjectQuery(params.level, params.subject));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const label = `${subjectOf(params.subject)?.name} for ${levelOf(params.level)?.label}`;
    const path = `/kidilearn/${params.level}/${params.subject}`;
    const image = `/og/kidilearn/${params.level}/${params.subject}.png`;
    const description = describe(params.level, params.subject, loaderData.course.lessons);
    return pageSeo({
      title: `${label}: Online Lessons for Children | kidiLearn`,
      description,
      path,
      image,
      imageAlt: `${label} on kidiLearn`,
      jsonLd: [
        courseJsonLd({ name: label, description, path, image, level: levelOf(params.level)?.label, price: Number(loaderData.course.price), audience: "student" }),
        breadcrumbJsonLd([["OpenLearn", "/learn"], ["kidiLearn", "/kidilearn"], [label, path]]),
      ],
    });
  },
  component: SubjectPage,
});

const PHASES = [
  [Lightbulb, "Explore", "Meet a new idea through stories, pictures and short videos."],
  [Gamepad2, "Play", "Practise it with games and activities."],
  [Trophy, "Challenge", "Show what they've learned with a friendly quiz."],
] as const;

function SubjectPage() {
  const { level, subject } = Route.useParams();
  const { data } = useQuery(subjectQuery(level, subject));
  if (!data) return null;
  const label = `${subjectOf(subject)?.name} for ${levelOf(level)?.label}`;
  return (
    <div className="pb-16">
      <section className="bg-linear-to-br from-[#041d40] via-[#1e2a78] to-[#4c1d95] text-white">
        <Container className="py-12">
          <Link to="/kidilearn" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="size-4" /> All kidiLearn subjects
          </Link>
          <h1 className="mt-4 max-w-3xl font-hero text-3xl leading-tight font-bold sm:text-5xl">{label}</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/75">{subjectOf(subject)?.description}</p>
          <p className="mt-2 text-sm font-semibold text-amber-300">{data.course.lessons.toLocaleString()} interactive lessons</p>
          <Button asChild size="lg" className="mt-6 bg-amber-400 text-[#041d40] hover:bg-amber-300">
            <Link to="/learn/kidilearn">Start learning</Link>
          </Button>
        </Container>
      </section>
      <Container className="mt-10 max-w-4xl space-y-8">
        <section>
          <h2 className="text-xl font-black text-primary">How children learn</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {PHASES.map(([Icon, name, text]) => (
              <li key={name} className="rounded-2xl border bg-white p-4">
                <Icon className="size-6 text-amber-500" aria-hidden="true" />
                <p className="mt-2 font-bold text-primary">{name}</p>
                <p className="text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>
        {data.lessons.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-primary">What's covered</h2>
            <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-primary/90 sm:grid-cols-2">
              {data.lessons.map((title, i) => (
                <li key={i} className="list-inside list-disc">
                  {title}
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>
    </div>
  );
}
