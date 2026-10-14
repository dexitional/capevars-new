import { useState } from "react";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BookOpen, ClipboardList, GraduationCap, Plus, Users, Wallet } from "lucide-react";
import { api } from "#/lib/api-client";
import { timeAgo } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Container, EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/learn/teach/")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Teach on OpenLearn" }] }),
  component: Teach,
});

const STATUS_LABEL: Record<string, string> = { draft: "Draft", in_review: "In review", published: "Live", rejected: "Changes requested", archived: "Unpublished" };

function Teach() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const { data } = useQuery({ queryKey: ["teach-courses"], queryFn: () => api.get<{ items: Array<Row> }>("/teach/courses") });
  const { data: guide } = useQuery({ queryKey: ["teach-guidelines"], queryFn: () => api.get<{ instructorGuidelines: string; minLessons: number; platformFeePercent: number }>("/teach/guidelines") });
  const create = useMutation({
    mutationFn: () => api.post<{ id: number }>("/teach/courses", { title }),
    onSuccess: (r) => void navigate({ to: "/learn/teach/$id", params: { id: String(r.id) } }),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  const totals = data.items.reduce((t, c) => ({ learners: t.learners + c.enrollment_count, revenue: t.revenue + Number(c.revenue), toGrade: t.toGrade + Number(c.to_grade) }), { learners: 0, revenue: 0, toGrade: 0 });
  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-black text-primary">Instructor dashboard</h1>
            <p className="text-sm text-muted-foreground">Build, publish and manage your courses.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            {[
              [BookOpen, data.items.length, "Courses"],
              [Users, totals.learners, "Learners"],
              [Wallet, formatMoney(totals.revenue), "Revenue"],
              [ClipboardList, totals.toGrade, "To grade"],
            ].map(([Icon, v, l]) => {
              const I = Icon as typeof BookOpen;
              return (
                <div key={l as string} className="rounded-2xl border bg-white p-4">
                  <I className="size-5 text-sys-learn" />
                  <p className="mt-2 text-xl font-black text-primary">{v as string}</p>
                  <p className="text-xs text-muted-foreground">{l as string}</p>
                </div>
              );
            })}
          </div>
          <form
            className="flex flex-wrap gap-2 rounded-2xl border bg-white p-4"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Working title, e.g. Excel for Beginners" className="min-w-60 flex-1" required minLength={5} />
            <Button type="submit" className="bg-sys-learn" disabled={create.isPending}>
              <Plus /> Create course
            </Button>
          </form>
          {data.items.length === 0 ? (
            <EmptyState icon={GraduationCap} title="No courses yet" text="Start with a working title — you can change everything later." />
          ) : (
            <div className="space-y-3">
              {data.items.map((c) => (
                <Link key={c.id} to="/learn/teach/$id" params={{ id: String(c.id) }} className="card-hover flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4">
                  <Img src={c.cover_url} className="h-16 w-28 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-primary">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.lesson_count} lessons · {c.enrollment_count} learners · {formatMoney(c.price, { free: "Free" })} · updated {timeAgo(c.updated_at)}
                    </p>
                    {c.status === "rejected" && c.review_note && <p className="mt-1 text-xs text-destructive">Reviewer: {c.review_note}</p>}
                  </div>
                  {Number(c.pending_payments) > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">{c.pending_payments} payments to confirm</span>}
                  {Number(c.to_grade) > 0 && <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">{c.to_grade} to grade</span>}
                  <StatusBadge status={c.status} label={STATUS_LABEL[c.status]} />
                </Link>
              ))}
            </div>
          )}
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-6 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 font-black text-primary">
            <ClipboardList className="size-5" /> Course creation guidelines
          </h2>
          <ol className="mt-4 space-y-3 text-sm">
            {(guide?.instructorGuidelines ?? "").split("\n").filter(Boolean).map((line) => (
              <li key={line} className="leading-relaxed">
                {line}
              </li>
            ))}
          </ol>
          {guide && (
            <p className="mt-4 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
              Minimum {guide.minLessons} lessons. For paid courses you receive {100 - guide.platformFeePercent}% of each sale.
            </p>
          )}
        </aside>
      </div>
    </Container>
  );
}
