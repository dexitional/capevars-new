import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { BedDouble, Hotel, MapPin, Search, Store, UserRound, UtensilsCrossed } from "lucide-react";
import { cn } from "#/lib/utils";
import { FINDER_TYPES, FINDER_TYPE_KEYS } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";

export const TYPE_ICONS: Record<FinderType, React.ComponentType<{ className?: string }>> = {
  hostel: BedDouble,
  hotel: Hotel,
  restaurant: UtensilsCrossed,
  business: Store,
  place: MapPin,
  person: UserRound,
};

export function FinderSearchBox({ initial, cities = [] }: { initial?: { type?: FinderType; q?: string; city?: string }; cities?: Array<string> }) {
  const navigate = useNavigate();
  const [type, setType] = useState<FinderType | undefined>(initial?.type);
  const [q, setQ] = useState(initial?.q ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  return (
    <div>
      <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
        {FINDER_TYPE_KEYS.map((t) => {
          const Icon = TYPE_ICONS[t];
          return (
            <button
              key={t}
              type="button"
              onClick={() => setType(type === t ? undefined : t)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                type === t ? "border-brand-cream bg-brand-cream text-primary" : "border-white/25 text-white hover:bg-white/10",
              )}
            >
              <Icon className="size-4" /> {FINDER_TYPES[t].label}
            </button>
          );
        })}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void navigate({ to: "/finder/search", search: { type, q: q || undefined, city: city || undefined } });
        }}
        className="grid gap-2 rounded-2xl bg-brand-gold p-1.5 shadow-2xl sm:grid-cols-[1fr_240px_auto]"
      >
        <label className="flex items-center gap-2 rounded-xl bg-white px-4">
          <Search className="size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={type ? `Search ${FINDER_TYPES[type].label.toLowerCase()}…` : "Hostels, hotels, restaurants, places, people…"} className="w-full bg-transparent py-3.5 text-foreground outline-none" />
        </label>
        <label className="flex items-center gap-2 rounded-xl bg-white px-4">
          <MapPin className="size-5 text-muted-foreground" />
          <input list="finder-cities" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full bg-transparent py-3.5 text-foreground outline-none" />
          <datalist id="finder-cities">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <button type="submit" className="rounded-xl bg-primary px-8 py-3.5 text-base font-bold text-white hover:bg-primary/90">
          Search
        </button>
      </form>
    </div>
  );
}
