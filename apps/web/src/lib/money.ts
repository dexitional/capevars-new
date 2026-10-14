// Prices are DECIMAL strings from MySQL; everything is in Ghana cedis.
export function formatMoney(value: string | number | null | undefined, opts: { free?: string } = {}) {
  const n = Number(value ?? 0);
  if (n === 0 && opts.free) return opts.free;
  return `GH₵ ${n.toLocaleString("en-GH", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

export function discountPercent(price: string | number, compareAt: string | number | null | undefined) {
  const p = Number(price);
  const c = Number(compareAt ?? 0);
  return c > p && c > 0 ? Math.round(((c - p) / c) * 100) : 0;
}

export function formatCompact(n: number | string | null | undefined) {
  const v = Number(n ?? 0);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(v);
}

export function formatDuration(minutes: number) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m ? `${m}m` : ""}`.trim() : `${m}m`;
}
