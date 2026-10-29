import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AdminPageHeader, Segmented } from "#/components/admin/ui";
import { QuizbankAdmin } from "#/components/admin/quizbank-admin";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, MoneyCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { COURSE_LEVELS } from "#/lib/labels";
import { formatDuration } from "#/lib/money";

export const Route = createFileRoute("/admin/_admin/learn")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "courses", "in_review"), component: Learn });

function Learn() {
  const [tab, setTab] = useState<"courses" | "quizbank">("courses");
  return (
    <div className="space-y-6">
      <AdminPageHeader title="OpenLearn" description="Review courses before they go live, and manage the Quizbank question bank." />
      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: "courses", label: "Course review" },
          { value: "quizbank", label: "Quizbank" },
        ]}
      />
      {tab === "quizbank" && <QuizbankAdmin />}
      {tab === "courses" && <ModerationTable
        entity="courses"
        defaultStatus="in_review"
        columns={[
          { label: "Course", render: (r) => <TitleCell title={r.title} sub={`${r.instructor_name} · ${r.category_name ?? "Uncategorised"}`} image={r.cover_url} /> },
          { label: "Content", render: (r) => <span className="text-xs">{r.lesson_count} lessons · {formatDuration(r.duration_minutes)} · {COURSE_LEVELS[r.level]}</span> },
          { label: "Price", render: (r) => <MoneyCell value={r.price} free /> },
          { label: "Learners", render: (r) => <span className="text-xs">{r.enrollment_count}{r.rating_avg ? ` · ★ ${r.rating_avg}` : ""}</span> },
          { label: "Submitted", render: (r) => <DateCell value={r.submitted_at} time /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
      />}
    </div>
  );
}
