import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";

export type GroupData = {
  group: Record<string, any>;
  membership: { role: string; status: string; title: string | null } | null;
  canSee: boolean;
  canManage: boolean;
  canModerate: boolean;
  stats: Record<string, number>;
  pages: Array<{ id: number; title: string; slug: string }>;
  admins: Array<Record<string, any>>;
};

export const groupQuery = (slug: string) => ({ queryKey: ["group", slug], queryFn: () => api.get<GroupData>(`/groups/s/${slug}`) });

export function useGroup(slug: string) {
  return useQuery(groupQuery(slug));
}
