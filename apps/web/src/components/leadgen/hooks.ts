import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import type { MomoAccount } from "#/lib/credits";
import type { CreditRequest } from "./momo-checkout";

export function useWallet() {
  return useQuery({ queryKey: ["leadgen", "wallet"], queryFn: () => api.get<{ balance: number; transactions: Array<Record<string, any>>; bundles: Array<{ credits: number; price: number }>; smsCreditCost: number; emailCreditCost: number; onlinePayments: boolean; momoAccounts: Array<MomoAccount>; requests: Array<CreditRequest> }>("/leadgen/portal/wallet") });
}
