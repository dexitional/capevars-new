import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Award, BarChart3, Check, ChevronDown, Clock, FileText, Globe, Lock, PlayCircle, PlayIcon, Users } from "lucide-react";
import { LESSON_ICONS } from "#/components/learn/lesson-icons";
import { ApiError, api } from "#/lib/api-client";
import { formatDate, timeAgo } from "#/lib/format";
import { discountPercent, formatCompact, formatDuration, formatMoney } from "#/lib/money";
import { COURSE_LEVELS, LESSON_TYPES } from "#/lib/labels";
import { useRequireMember } from "#/hooks/useMember";
import { Avatar, Container, FavouriteButton, Img, Prose, Stars, StatusBadge, TextBlock } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const courseQuery = (slug: string) => ({
  queryKey: ["course", slug],
  queryFn: () => api.get<{ course: Row; curriculum: Array<Row>; reviews: Array<Row>; breakdown: Record<string, number>; instructorStats: Row; enrollment: Row | null; isInstructor: boolean; onlinePayments: boolean }>(`/learn/c/${slug}`),
});

export const Route = createFileRoute("/_site/learn/c/$slug/")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(courseQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.course.title} | OpenLearn` }, { name: "description", content: loaderData.course.subtitle ?? "" }, { property: "og:image", content: loaderData.course.cover_url ?? "" }] : [],
  }),
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { payment } = Route.useSearch();
  const { data, refetch } = useQuery(courseQuery(slug));
  const navigate = useNavigate();
  const requireMember = useRequireMember();
  const enroll = useMutation({
    mutationFn: () => api.post<{ status: string; authorizationUrl?: string | null }>(`/learn/c/${data!.course.id}/enroll`),
    onSuccess: (r) => {
      if (r.authorizationUrl) window.location.href = r.authorizationUrl;
      else if (r.status === "active" || r.status === "completed") void navigate({ to: "/learn/c/$slug/learn", params: { slug } });
      else {
        toast.success("Request sent — the instructor will confirm your payment.");
        void refetch();
      }
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const c = data.course;
  const e = data.enrollment;
  const enrolled = e && ["active", "completed"].includes(e.status);
  const off = discountPercent(c.price, c.compare_at_price);
  const lessons = data.curriculum.reduce((n, s) => n + s.lessons.length, 0);
  const total = Object.values(data.breakdown).reduce((a, b) => a + b, 0);
  const enrollCard = (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-xl">
      {c.promo_video_url ? (
        <video src={c.promo_video_url} poster={c.cover_url ?? undefined} controls className="aspect-video w-full bg-black" />
      ) : (
        <Img src={c.cover_url} className="aspect-video w-full" priority />
      )}
      <div className="space-y-4 p-5">
        {!enrolled && (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-primary">{formatMoney(c.price, { free: "Free" })}</span>
            {off > 0 && (
              <>
                <span className="text-muted-foreground line-through">{formatMoney(c.compare_at_price)}</span>
                <span className="text-sm font-bold text-rose-600">{off}% off</span>
              </>
            )}
          </div>
        )}
        {data.isInstructor ? (
          <Button asChild className="h-12 w-full rounded-xl">
            <Link to="/learn/teach/$id" params={{ id: String(c.id) }}>
              Edit course
            </Link>
          </Button>
        ) : enrolled ? (
          <>
            <div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-sys-learn" style={{ width: `${e!.progress_percent}%` }} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{e!.progress_percent}% complete</p>
            </div>
            <Button asChild className="h-12 w-full rounded-xl bg-sys-learn hover:bg-sys-learn/90">
              <Link to="/learn/c/$slug/learn" params={{ slug }}>
                <PlayIcon /> {e!.progress_percent > 0 ? "Continue learning" : "Start learning"}
              </Link>
            </Button>
          </>
        ) : e?.status === "pending_payment" && !data.onlinePayments ? (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">Waiting for the instructor to confirm your payment.</p>
        ) : (
          <Button className="h-12 w-full rounded-xl bg-sys-learn hover:bg-sys-learn/90" disabled={enroll.isPending} onClick={() => requireMember(() => enroll.mutate())}>
            {Number(c.price) === 0 ? "Enrol for free" : data.onlinePayments ? "Buy now" : "Request to enrol"}
          </Button>
        )}
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <PlayCircle className="size-4" /> {lessons} lessons · {formatDuration(c.duration_minutes)}
          </li>
          <li className="flex items-center gap-2">
            <BarChart3 className="size-4" /> {COURSE_LEVELS[c.level]}
          </li>
          <li className="flex items-center gap-2">
            <Globe className="size-4" /> {c.language}
          </li>
          {c.certificate_enabled ? (
            <li className="flex items-center gap-2">
              <Award className="size-4" /> Certificate of completion
            </li>
          ) : null}
          <li className="flex items-center gap-2">
            <Clock className="size-4" /> Learn at your own pace
          </li>
        </ul>
        <FavouriteButton type="course" id={c.id} label className="w-full" />
      </div>
    </div>
  );
  return (
    <div className="pb-16">
      <section className="bg-gradient-to-br from-[#041d40] to-[#2a1840] text-white">
        <Container className="grid gap-8 py-10 lg:grid-cols-[1fr_380px]">
          <div>
            <PaymentBanner status={payment} />
            {c.status !== "published" && <StatusBadge status={c.status} className="mb-3" />}
            {c.category_name && (
              <Link to="/learn/courses" search={{ category: c.category_slug }} className="text-sm font-semibold text-brand-cream hover:underline">
                {c.category_name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl leading-tight font-black sm:text-4xl">{c.title}</h1>
            {c.subtitle && <p className="mt-3 text-lg text-white/80">{c.subtitle}</p>}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {c.rating_avg ? (
                <span className="flex items-center gap-1.5">
                  <strong className="text-brand-gold">{Number(c.rating_avg).toFixed(1)}</strong> <Stars value={c.rating_avg} /> ({c.rating_count} ratings)
                </span>
              ) : (
                <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-semibold">New course</span>
              )}
              <span className="flex items-center gap-1">
                <Users className="size-4" /> {formatCompact(c.enrollment_count)} learners
              </span>
              {c.published_at && <span>Updated {formatDate(c.updated_at)}</span>}
            </div>
            <Link to="/u/$username" params={{ username: c.instructor_username }} className="mt-4 inline-flex items-center gap-2 text-sm hover:underline">
              <Avatar src={c.instructor_avatar} name={c.instructor_name} size="sm" /> Created by <strong>{c.instructor_name}</strong>
            </Link>
          </div>
          <div className="lg:hidden">{enrollCard}</div>
        </Container>
      </section>
      <Container className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8 pt-8">
          {c.outcomes?.length > 0 && (
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-xl font-black text-primary">What you'll learn</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {c.outcomes.map((o: string) => (
                  <li key={o} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" /> {o}
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="text-xl font-black text-primary">Course content</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.curriculum.length} sections · {lessons} lessons · {formatDuration(c.duration_minutes)} total
            </p>
            <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
              {data.curriculum.map((s, i) => (
                <details key={s.id} open={i === 0} className="group border-b last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center gap-3 bg-muted/50 px-5 py-3.5 font-semibold">
                    <ChevronDown className="size-4 transition group-open:rotate-180" />
                    <span className="flex-1">{s.title}</span>
                    <span className="text-xs font-normal text-muted-foreground">{s.lessons.length} lessons</span>
                  </summary>
                  <ul>
                    {s.lessons.map((l: Row) => {
                      const Icon = LESSON_ICONS[l.type] ?? FileText;
                      return (
                        <li key={l.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                          <Icon className="size-4 text-muted-foreground" />
                          <span className="flex-1">{l.title}</span>
                          {l.is_preview ? (
                            <Link to="/learn/c/$slug/learn" params={{ slug }} search={{ lesson: l.id }} className="text-xs font-semibold text-sys-learn hover:underline">
                              Preview
                            </Link>
                          ) : (
                            <Lock className="size-3.5 text-muted-foreground" />
                          )}
                          <span className="w-16 text-right text-xs text-muted-foreground">{l.duration_minutes ? `${l.duration_minutes} min` : LESSON_TYPES[l.type]}</span>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </section>
          {c.requirements?.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-primary">Requirements</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {c.requirements.map((r: string) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}
          {c.description && (
            <section>
              <h2 className="text-xl font-black text-primary">Description</h2>
              <Prose html={c.description} className="mt-3" />
            </section>
          )}
          {c.audience?.length > 0 && (
            <section>
              <h2 className="text-xl font-black text-primary">Who this course is for</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                {c.audience.map((a: string) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </section>
          )}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-xl font-black text-primary">Instructor</h2>
            <Link to="/u/$username" params={{ username: c.instructor_username }} className="mt-4 flex items-center gap-4">
              <Avatar src={c.instructor_avatar} name={c.instructor_name} size="xl" />
              <span>
                <span className="block text-lg font-bold text-primary hover:underline">{c.instructor_name}</span>
                <span className="block text-sm text-muted-foreground">{c.instructor_headline}</span>
                <span className="text-xs text-muted-foreground">
                  {data.instructorStats.courses} courses · {formatCompact(data.instructorStats.learners)} learners
                  {data.instructorStats.rating ? ` · ${data.instructorStats.rating} rating` : ""}
                </span>
              </span>
            </Link>
            <TextBlock text={c.instructor_bio} className="mt-4 text-sm text-muted-foreground" />
          </section>
          <section>
            <h2 className="text-xl font-black text-primary">Learner reviews</h2>
            {data.reviews.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <>
                <div className="mt-4 grid gap-6 sm:grid-cols-[160px_1fr]">
                  <div className="text-center">
                    <p className="text-5xl font-black text-amber-700">{Number(c.rating_avg).toFixed(1)}</p>
                    <Stars value={c.rating_avg} className="mt-1" />
                    <p className="text-xs text-muted-foreground">Course rating</p>
                  </div>
                  <ul className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((n) => (
                      <li key={n} className="flex items-center gap-2 text-xs">
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                          <span className="block h-full bg-amber-500" style={{ width: `${((data.breakdown[n] ?? 0) / Math.max(1, total)) * 100}%` }} />
                        </span>
                        <Stars value={n} className="[&_svg]:size-3" />
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 grid gap-4 md:grid-cols-2">
                  {data.reviews.map((r) => (
                    <li key={r.id} className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-2">
                        <Avatar src={r.avatar_url} name={r.full_name} size="sm" />
                        <span className="text-sm font-semibold">{r.full_name}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{timeAgo(r.created_at)}</span>
                      </div>
                      <Stars value={r.rating} className="mt-2" />
                      {r.body && <p className="mt-1 text-sm">{r.body}</p>}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-24 -mt-64">{enrollCard}</div>
        </aside>
      </Container>
    </div>
  );
}
