import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, ScanLine, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/checkin")({ component: CheckIn });

const RESULTS: Record<string, { title: string; tone: string; icon: typeof CheckCircle2 }> = {
  checked_in: { title: "Checked in", tone: "bg-emerald-50 text-emerald-800", icon: CheckCircle2 },
  already_used: { title: "Already used", tone: "bg-amber-50 text-amber-900", icon: AlertTriangle },
  reserved: { title: "Not paid yet", tone: "bg-amber-50 text-amber-900", icon: AlertTriangle },
  cancelled: { title: "Cancelled ticket", tone: "bg-red-50 text-red-800", icon: XCircle },
};

function CheckIn() {
  const [code, setCode] = useState("");
  const [log, setLog] = useState<Array<{ result: string; ticket: Row } | { error: string; code: string }>>([]);
  const input = useRef<HTMLInputElement>(null);
  const check = useMutation({
    mutationFn: (c: string) => api.post<{ ticket: Row; result: string }>("/seller/checkin", { code: c }),
    onSuccess: (r) => setLog((l) => [r, ...l].slice(0, 20)),
    onError: (e, c) => setLog((l) => [{ error: e.message, code: c }, ...l].slice(0, 20)),
    onSettled: () => {
      setCode("");
      input.current?.focus();
    },
  });
  const last = log[0];
  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-black text-primary">Check-in</h1>
      <p className="text-sm text-muted-foreground">Type or scan the ticket code at the door or when boarding.</p>
      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) check.mutate(code.trim());
        }}
      >
        <div className="relative flex-1">
          <ScanLine className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={input}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="TK…"
            className="h-14 w-full rounded-2xl border-2 bg-white pl-12 font-mono text-xl font-bold tracking-wider outline-none focus:border-primary"
          />
        </div>
        <Button type="submit" className="h-14 rounded-2xl px-6" disabled={check.isPending}>
          Check
        </Button>
      </form>
      {last && (
        <div className={cn("mt-6 rounded-3xl p-6 text-center", "error" in last ? "bg-red-50 text-red-800" : RESULTS[last.result]?.tone)}>
          {"error" in last ? (
            <>
              <XCircle className="mx-auto size-14" />
              <p className="mt-2 text-xl font-black">Invalid ticket</p>
              <p className="text-sm">{last.error}</p>
            </>
          ) : (
            <>
              {(() => {
                const R = RESULTS[last.result] ?? RESULTS.cancelled!;
                return <R.icon className="mx-auto size-14" />;
              })()}
              <p className="mt-2 text-xl font-black">{RESULTS[last.result]?.title ?? last.result}</p>
              <p className="mt-1 font-semibold">{last.ticket.holder_name}</p>
              <p className="text-sm">
                {last.ticket.title}
                {last.ticket.type_name ? ` · ${last.ticket.type_name}` : ""}
                {last.ticket.seat_no ? ` · Seat ${last.ticket.seat_no}` : ""}
              </p>
              {last.result === "already_used" && last.ticket.checked_in_at && <p className="text-xs">First used {formatDateTime(last.ticket.checked_in_at)}</p>}
            </>
          )}
        </div>
      )}
      {log.length > 1 && (
        <ul className="mt-6 divide-y rounded-2xl border bg-white text-sm">
          {log.slice(1).map((l, i) => (
            <li key={i} className="flex justify-between px-4 py-2">
              <span className="font-mono">{"error" in l ? l.code : l.ticket.code}</span>
              <span className="text-muted-foreground">{"error" in l ? "invalid" : `${l.ticket.holder_name} · ${l.result.replace("_", " ")}`}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
