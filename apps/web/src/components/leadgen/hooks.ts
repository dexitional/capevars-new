import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";

export function useWallet() {
  return useQuery({ queryKey: ["leadgen", "wallet"], queryFn: () => api.get<{ balance: number; transactions: Array<Record<string, any>>; bundles: Array<{ credits: number; price: number }>; smsCreditCost: number; emailCreditCost: number; onlinePayments: boolean }>("/leadgen/portal/wallet") });
}
