// Admin → OpenLearn → Quizbank → Analytics: views (signed-in and guest) and exam
// simulations over a period, overall and for every course, with each course
// opening to the members behind its numbers.
import { useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BarChart3, CheckCircle2, Eye, GraduationCap, Loader2, Target, Users } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDate, formatDateTime } from "#/lib/format";
import type { QbLevel } from "#/lib/quizbank";
import { SearchInput, Segmented } from "#/components/admin/ui";
import { StatusCell, TitleCell } from "#/components/admin/cells";
import { Delta, Kpi, TrendChart } from "#/components/analytics/product-analytics";
import { LevelBadge, percent } from "#/components/quizbank/kit";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Days = "7" | "30" | "90";
type Metric = "views" | "started" | "completed";
interface Day {
  day: string;
  views: number;
  guestViews: number;
  started: number;
  completed: number;
}
interface ExamStats {
  started: number;
  completed: number;
  takers: number;
  completionRate: number | null;
  avgScore: number | null;
  bestScore: number | null;
  avgMinutes: number | null;
}
interface Totals {
  range: { from: string; to: string; days: number };
  summary: ExamStats & { views: number; guestViews: number; viewers: number; previous: { views: number; completed: number } };
  daily: Array<Day>;
}
type CourseRow = ExamStats & { id: number; slug: string; title: string; code: string | null; level: QbLevel; status: string; questionCount: number; views: number; guestViews: number; viewers: number };
type Overview = Totals & { courses: Array<CourseRow> };
type Detail = Totals & {
  viewers: Array<{ id: number; name: string; email: string; views: number; lastDay: string }>;
  takers: Array<ExamStats & { id: number; name: string; email: string; lastAt: string }>;
};

const METRICS: Record<Metric, string> = { views: "Views", started: "Exams started", completed: "Exams completed" };
const headCell = "px-4 py-3 whitespace-nowrap";
const numCell = "px-4 py-3 text-right tabular-nums";

function Summary({ data }: { data: Totals }) {
  const s = data.summary;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <Kpi icon={Eye} label="Course views" value={s.views.toLocaleString()}>
        <Delta now={s.views} before={s.previous.views} />
      </Kpi>
      <Kpi icon={Users} label="Signed-in viewers" value={s.viewers.toLocaleString()}>
        <span className="text-xs text-muted-foreground">{s.guestViews.toLocaleString()} guest views</span>
      </Kpi>
      <Kpi icon={CheckCircle2} label="Exams completed" value={s.completed.toLocaleString()}>
        <Delta now={s.completed} before={s.previous.completed} />
      </Kpi>
      <Kpi icon={GraduationCap} label="Completion rate" value={percent(s.completionRate)}>
        <span className="text-xs text-muted-foreground">
          of {s.started.toLocaleString()} started · {s.takers.toLocaleString()} member{s.takers === 1 ? "" : "s"}
        </span>
      </Kpi>
      <Kpi icon={Target} label="Average score" value={percent(s.avgScore)}>
        <span className="text-xs text-muted-foreground">best {percent(s.bestScore)}</span>
      </Kpi>
    </div>
  );
}

function Trend({ data }: { data: Totals }) {
  const [metric, setMetric] = useState<Metric>("views");
  return (
    <div className="rounded-2xl border bg-white p-5">
      <Segmented value={metric} onChange={setMetric} options={(Object.keys(METRICS) as Array<Metric>).map((value) => ({ value, label: METRICS[value] }))} />
      <div className="mt-4">
        <TrendChart
          data={data.daily}
          label={METRICS[metric]}
          value={(d) => d[metric]}
          format={(n) => n.toLocaleString()}
          readout={(d) => `${d.views} views (${d.guestViews} guest) · ${d.started} exams started · ${d.completed} completed`}
        />
      </div>
    </div>
  );
}

function CourseDialog({ course, days, onClose }: { course: CourseRow; days: Days; onClose: () => void }) {
  const { data } = useQuery({
    queryKey: ["admin-qb-analytics-course", course.id, days],
    queryFn: () => api.get<Detail>(`/admin/quizbank/analytics/courses/${course.id}`, { days }),
    placeholderData: keepPreviousData,
  });
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
          <DialogDescription>
            {course.code ? `${course.code} · ` : ""}last {days} days
          </DialogDescription>
        </DialogHeader>
        {!data ? (
          <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading analytics…
          </p>
        ) : (
          <div className="min-w-0 space-y-4">
            <Summary data={data} />
            <Trend data={data} />
            <div className="grid gap-4">
              <section className="min-w-0 overflow-x-auto rounded-xl border bg-white">
                <h3 className="border-b px-4 py-3 font-bold text-primary">Members who viewed it</h3>
                {data.viewers.length ? (
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                      <tr>
                        <th className={headCell}>Member</th>
                        <th className={cn(headCell, "text-right")}>Views</th>
                        <th className={headCell}>Last viewed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.viewers.map((v) => (
                        <tr key={v.id}>
                          <td className="px-4 py-3">
                            <TitleCell title={v.name} sub={v.email} />
                          </td>
                          <td className={numCell}>{v.views.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs whitespace-nowrap">{formatDate(v.lastDay)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-6 text-center text-sm text-muted-foreground">No signed-in views in this period.</p>
                )}
              </section>
              <section className="min-w-0 overflow-x-auto rounded-xl border bg-white">
                <h3 className="border-b px-4 py-3 font-bold text-primary">Members who sat its exams</h3>
                {data.takers.length ? (
                  <table className="w-full text-sm">
                    <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                      <tr>
                        <th className={headCell}>Member</th>
                        <th className={cn(headCell, "text-right")}>Completed</th>
                        <th className={cn(headCell, "text-right")}>Average</th>
                        <th className={cn(headCell, "text-right")}>Best</th>
                        <th className={headCell}>Last started</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {data.takers.map((t) => (
                        <tr key={t.id}>
                          <td className="px-4 py-3">
                            <TitleCell title={t.name} sub={t.email} />
                          </td>
                          <td className={numCell}>
                            {t.completed} of {t.started}
                          </td>
                          <td className={numCell}>{percent(t.avgScore)}</td>
                          <td className={numCell}>{percent(t.bestScore)}</td>
                          <td className="px-4 py-3 text-xs whitespace-nowrap">{formatDateTime(t.lastAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="p-6 text-center text-sm text-muted-foreground">No exams started in this period.</p>
                )}
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function QuizbankAnalytics() {
  const [days, setDays] = useState<Days>("30");
  const [sort, setSort] = useState<"views" | "exams">("views");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<CourseRow | null>(null);
  const { data, isFetching } = useQuery({
    queryKey: ["admin-qb-analytics", days],
    queryFn: () => api.get<Overview>("/admin/quizbank/analytics", { days }),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    const byViews = (a: CourseRow, b: CourseRow) => b.views - a.views;
    const byExams = (a: CourseRow, b: CourseRow) => b.completed - a.completed || b.started - a.started;
    return (data?.courses ?? [])
      .filter((c) => !term || c.title.toLowerCase().includes(term) || c.code?.toLowerCase().includes(term))
      .sort((a, b) => (sort === "views" ? byViews(a, b) || byExams(a, b) : byExams(a, b) || byViews(a, b)) || a.title.localeCompare(b.title));
  }, [data, q, sort]);
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="flex items-center gap-2 text-lg font-black text-primary">
            <BarChart3 className="size-5" /> Quizbank analytics
          </h2>
          {isFetching && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
        </div>
        <Segmented
          value={days}
          onChange={setDays}
          options={[
            { value: "7", label: "7 days" },
            { value: "30", label: "30 days" },
            { value: "90", label: "90 days" },
          ]}
        />
      </div>
      {!data ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border bg-white text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Loading analytics…
        </div>
      ) : (
        <>
          <Summary data={data} />
          <Trend data={data} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchInput value={q} onChange={setQ} placeholder="Search a course or code…" className="w-full sm:max-w-xs" />
            <Segmented
              value={sort}
              onChange={setSort}
              options={[
                { value: "views", label: "Most viewed" },
                { value: "exams", label: "Most exams" },
              ]}
            />
          </div>
          <div className="overflow-x-auto rounded-xl border bg-white">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-xs text-muted-foreground uppercase">
                <tr>
                  <th className={headCell}>Course</th>
                  <th className={cn(headCell, "text-right")}>Views</th>
                  <th className={cn(headCell, "text-right")}>Guest views</th>
                  <th className={cn(headCell, "text-right")}>Signed-in viewers</th>
                  <th className={cn(headCell, "text-right")}>Exams completed</th>
                  <th className={cn(headCell, "text-right")}>Completion</th>
                  <th className={cn(headCell, "text-right")}>Average</th>
                  <th className={cn(headCell, "text-right")}>Best</th>
                  <th className={headCell}>Status</th>
                  <th className={headCell} />
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <LevelBadge level={c.level} />
                        <TitleCell title={c.title} sub={c.code ?? c.slug} />
                      </div>
                    </td>
                    <td className={cn(numCell, "font-semibold")}>{c.views.toLocaleString()}</td>
                    <td className={numCell}>{c.guestViews.toLocaleString()}</td>
                    <td className={numCell}>{c.viewers.toLocaleString()}</td>
                    <td className={cn(numCell, "font-semibold")}>
                      {c.completed.toLocaleString()} <span className="font-normal text-muted-foreground">of {c.started.toLocaleString()}</span>
                    </td>
                    <td className={numCell}>{percent(c.completionRate)}</td>
                    <td className={numCell}>{percent(c.avgScore)}</td>
                    <td className={numCell}>{percent(c.bestScore)}</td>
                    <td className="px-4 py-3">
                      <StatusCell row={c} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setOpen(c)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No courses match.</p>}
          </div>
          <p className="text-xs text-muted-foreground">
            A view is one browser session opening a course page. Exams are counted on the day they started; exams on study sets that mix several courses aren't credited to any one course.
          </p>
        </>
      )}
      {open && <CourseDialog course={open} days={days} onClose={() => setOpen(null)} />}
    </section>
  );
}
