import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeftRight, CalendarDays, MapPin, Search } from "lucide-react";

export function BusSearchForm({ initial, places = [] }: { initial?: { from?: string; to?: string; date?: string }; places?: Array<string> }) {
  const navigate = useNavigate();
  const [from, setFrom] = useState(initial?.from ?? "");
  const [to, setTo] = useState(initial?.to ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void navigate({ to: "/market/tickets/bus", search: { from: from || undefined, to: to || undefined, date: date || undefined } });
      }}
      className="grid gap-2 rounded-2xl bg-white p-2 text-foreground shadow-xl sm:grid-cols-[1fr_auto_1fr_180px_auto]"
    >
      <datalist id="bus-places">
        {places.map((p) => (
          <option key={p} value={p} />
        ))}
      </datalist>
      <label className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted">
        <MapPin className="size-4 text-muted-foreground" />
        <input list="bus-places" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From (e.g. Cape Coast)" className="w-full bg-transparent outline-none" />
      </label>
      <button type="button" onClick={() => (setFrom(to), setTo(from))} className="hidden self-center rounded-full border p-2 hover:bg-muted sm:block" aria-label="Swap">
        <ArrowLeftRight className="size-4" />
      </button>
      <label className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted">
        <MapPin className="size-4 text-muted-foreground" />
        <input list="bus-places" value={to} onChange={(e) => setTo(e.target.value)} placeholder="To (e.g. Accra)" className="w-full bg-transparent outline-none" />
      </label>
      <label className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-muted">
        <CalendarDays className="size-4 text-muted-foreground" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-transparent outline-none" />
      </label>
      <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white">
        <Search className="size-4" /> Find buses
      </button>
    </form>
  );
}
