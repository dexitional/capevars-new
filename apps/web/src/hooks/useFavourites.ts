import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "#/lib/api-client";
import { useMember, useRequireMember } from "./useMember";

export type FavouriteType = "listing" | "product" | "job" | "course" | "event" | "store";

export interface FavouriteItem {
  type: FavouriteType;
  id: number;
  title: string;
  image: string | null;
  link: string;
  subtitle: string | null;
}

export function useFavourites() {
  const member = useMember();
  return useQuery({
    queryKey: ["favourites"],
    queryFn: () => api.get<{ items: Array<FavouriteItem>; keys: Array<string> }>("/me/favourites"),
    enabled: Boolean(member),
    staleTime: 60_000,
  });
}

export function useFavourite(type: FavouriteType, id: number) {
  const queryClient = useQueryClient();
  const requireMember = useRequireMember();
  const { data } = useFavourites();
  const saved = Boolean(data?.keys.includes(`${type}:${id}`));
  const mutation = useMutation({
    mutationFn: () => api.post<{ saved: boolean }>("/me/favourites", { type, id }),
    onSuccess: (r) => {
      toast.success(r.saved ? "Saved to favourites" : "Removed from favourites");
      void queryClient.invalidateQueries({ queryKey: ["favourites"] });
    },
    onError: (e) => toast.error(e.message),
  });
  return { saved, pending: mutation.isPending, toggle: () => requireMember(() => mutation.mutate()) };
}
