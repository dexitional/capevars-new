import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pause, Play, Square } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";
import { repeatLabel } from "./repeat";

type Row = Record<string, any>;

const SERIES_BADGE: Record<string, string> = { active: "scheduled", paused: "pending", completed: "completed", cancelled: "closed" };

// What a repeating broadcast does next, e.g. "every 2 weeks · 3 of 6 sent · next 12 Nov, 08:00".
export function seriesSummary(s: Row) {
  const progress = s.max_runs ? `${s.run_count} of ${s.max_runs} sent` : `${s.run_count} sent`;
  const end = s.ends_at ? ` · until ${String(s.ends_at).slice(0, 10)}` : "";
  const next = s.status === "active" && s.next_run_at ? ` · next ${formatDateTime(s.next_run_at)}` : "";
  return `${repeatLabel(s.every_n, s.unit)} · ${progress}${end}${next}`;
}

export function SeriesStatus({ s }: { s: Row }) {
  return <StatusBadge status={SERIES_BADGE[s.status] ?? "draft"} label={s.status} />;
}

export function SeriesActions({ s, onDone }: { s: Row; onDone?: () => void }) {
  const queryClient = useQueryClient();
  const act = useMutation({
    mutationFn: (action: "pause" | "resume" | "cancel") => api.post(`/leadgen/portal/series/${s.id}/${action}`),
    onSuccess: (_, action) => {
      toast.success({ pause: "Repeats paused", resume: "Repeats resumed", cancel: "Repeats stopped" }[action]);
      void queryClient.invalidateQueries({ queryKey: ["leadgen"] });
      onDone?.();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!["active", "paused"].includes(s.status)) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {s.status === "active" ? (
        <Button size="xs" variant="outline" disabled={act.isPending} onClick={() => act.mutate("pause")}>
          <Pause /> Pause
        </Button>
      ) : (
        <Button size="xs" variant="outline" disabled={act.isPending} onClick={() => act.mutate("resume")}>
          <Play /> Resume
        </Button>
      )}
      <Button size="xs" variant="outline" className="text-destructive" disabled={act.isPending} onClick={() => confirm("Stop all future repeats? Messages already sent aren't affected.") && act.mutate("cancel")}>
        <Square /> Stop
      </Button>
    </div>
  );
}
