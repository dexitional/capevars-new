import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { getMemberSession } from "#/server/member-session";
import type { SessionMember } from "#/server/member-session";
import { api } from "#/lib/api-client";

export const memberQuery = {
  queryKey: ["me"] as const,
  queryFn: () => getMemberSession(),
  staleTime: 60_000,
};

// The signed-in member (or null). Seeded on the server by the _site layout.
export function useMember(): SessionMember | null {
  return useQuery(memberQuery).data ?? null;
}

export function useSession() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return {
    // After sign-in/out/profile edits: refresh the member and every loader.
    refresh: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      await router.invalidate();
    },
    logout: async () => {
      await api.post("/auth/logout");
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "me" });
      await router.invalidate();
    },
  };
}

// Runs `action` when signed in; otherwise sends the visitor to sign in and
// back to this page afterwards.
export function useRequireMember() {
  const member = useMember();
  const navigate = useNavigate();
  const href = useRouterState({ select: (s) => s.location.href });
  return (action?: () => void) => {
    if (member) {
      action?.();
      return true;
    }
    void navigate({ to: "/login", search: { next: href } });
    return false;
  };
}
