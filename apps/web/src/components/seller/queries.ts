import { api } from "#/lib/api-client";

export const sellerStoreQuery = { queryKey: ["seller", "store"], queryFn: () => api.get<{ store: Record<string, any> | null }>("/seller/store") };
