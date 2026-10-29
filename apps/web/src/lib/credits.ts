// Broadcast credit pricing for any amount, shared by the wallet page and the
// server so both quote the same price. A purchase pays the per-credit rate of
// the cheapest bundle it reaches (amounts below the smallest bundle pay that
// bundle's rate), so a custom amount never costs more per credit than a
// bundle it could have bought, and buying exactly a bundle costs its price.
export interface CreditBundle {
  credits: number;
  price: number;
}

export const MIN_CREDIT_PURCHASE = 1; // GHS
export const MAX_CREDIT_PURCHASE = 10_000_000; // credits

const round2 = (n: number) => Math.round(n * 100) / 100;

export function creditRate(bundles: Array<CreditBundle>, credits: number) {
  const tiers = [...bundles].sort((a, b) => a.credits - b.credits);
  let rate = tiers[0] ? tiers[0].price / tiers[0].credits : 0;
  for (const t of tiers) if (credits >= t.credits) rate = Math.min(rate, t.price / t.credits);
  return rate;
}

export const creditPrice = (bundles: Array<CreditBundle>, credits: number) => round2(credits * creditRate(bundles, credits));

// The most credits `amount` cedis buys.
export function creditsFor(bundles: Array<CreditBundle>, amount: number) {
  if (!(amount > 0)) return 0;
  let best = 0;
  for (const b of bundles) best = Math.max(best, Math.floor(amount / (b.price / b.credits) + 1e-9));
  best = Math.min(best, MAX_CREDIT_PURCHASE);
  while (best > 0 && creditPrice(bundles, best) > amount) best--;
  return best;
}

// Mobile money wallets members can pay into by hand (Admin → Settings →
// LeadGen); an admin credits the wallet once the transfer is confirmed.
export const MOMO_NETWORKS = { mtn: "MTN Mobile Money", telecel: "Telecel Cash", airteltigo: "AirtelTigo Money" } as const;
export type MomoNetwork = keyof typeof MOMO_NETWORKS;
export const networkName = (network: string) => (MOMO_NETWORKS as Record<string, string | undefined>)[network] ?? network;
export interface MomoAccount {
  network: MomoNetwork;
  name: string;
  number: string;
}
