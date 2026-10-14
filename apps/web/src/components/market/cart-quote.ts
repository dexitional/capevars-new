import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import type { CartLine } from "#/hooks/useCart";

type Row = Record<string, any>;

// Re-quotes the cart against live prices and availability.
export function useCartQuote(lines: Array<CartLine>) {
  const ids = lines.map((l) => l.productId).sort();
  return useQuery({
    queryKey: ["cart-quote", ids],
    queryFn: () => api.post<{ items: Array<Row> }>("/market/quote", { ids }),
    enabled: ids.length > 0,
  });
}

export type QuotedLine = CartLine & { live?: Row; available: boolean };
export interface StoreGroup {
  store: string;
  storeSlug: string | null;
  delivers: boolean;
  fee: number;
  lines: Array<QuotedLine>;
}

export function groupByStore(lines: Array<CartLine>, quote: Array<Row> | undefined): Array<StoreGroup> {
  const byId = new Map((quote ?? []).map((q) => [q.id as number, q]));
  const groups = new Map<string, StoreGroup>();
  for (const l of lines) {
    const live = byId.get(l.productId);
    const key = (live?.store_slug as string | undefined) ?? l.storeName;
    const g: StoreGroup = groups.get(key) ?? {
      store: (live?.store_name as string | undefined) ?? l.storeName,
      storeSlug: (live?.store_slug as string | undefined) ?? null,
      delivers: Boolean(live?.delivers),
      fee: Number(live?.delivery_fee ?? 0),
      lines: [],
    };
    const available = quote ? Boolean(live && Number(live.available)) && (live?.stock === null || Number(live?.stock) >= l.quantity) : true;
    g.lines.push({ ...l, price: live ? Number(live.price) : l.price, live, available });
    groups.set(key, g);
  }
  return [...groups.values()];
}
