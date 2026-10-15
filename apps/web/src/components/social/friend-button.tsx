import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, Clock, Loader2, MessageCircle, UserMinus, UserPlus } from "lucide-react";
import { api } from "#/lib/api-client";
import { useRequireMember } from "#/hooks/useMember";
import { Button } from "#/components/ui/button";
import { cn } from "#/lib/utils";

// Add friend / Cancel / Accept / Friends + Message, for a given member.
export function FriendButton({ userId, status, direction, size = "sm", onChange }: { userId: number; status: string | null; direction?: "incoming" | "outgoing"; size?: "sm" | "default"; onChange?: () => void }) {
  const requireMember = useRequireMember();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const done = () => {
    onChange?.();
    void queryClient.invalidateQueries({ queryKey: ["friends"] });
    void queryClient.invalidateQueries({ queryKey: ["people"] });
    void queryClient.invalidateQueries({ queryKey: ["counts"] });
  };
  const add = useMutation({ mutationFn: () => api.post(`/social/friends/${userId}/request`), onSuccess: () => (toast.success("Friend request sent"), done()), onError: (e) => toast.error(e.message) });
  const respond = useMutation({ mutationFn: (accept: boolean) => api.post(`/social/friends/${userId}/respond`, { accept }), onSuccess: done });
  const remove = useMutation({ mutationFn: () => api.delete(`/social/friends/${userId}`), onSuccess: done });
  const message = useMutation({
    mutationFn: () => api.post<{ id: number }>(`/chat/direct/${userId}`),
    onSuccess: (r) => void navigate({ to: "/social/chats/$id", params: { id: String(r.id) } }),
    onError: (e) => toast.error(e.message),
  });
  if (status === "accepted") {
    return (
      <div className="flex gap-2">
        <Button size={size} className="bg-sys-social" onClick={() => message.mutate()}>
          <MessageCircle /> Message
        </Button>
        <Button size={size} variant="outline" onClick={() => confirm("Remove this friend?") && remove.mutate()} title="Unfriend">
          <UserMinus />
        </Button>
      </div>
    );
  }
  if (status === "pending" && direction === "incoming") {
    return (
      <div className="flex gap-2">
        <Button size={size} className="bg-sys-social" onClick={() => respond.mutate(true)}>
          <Check /> Accept
        </Button>
        <Button size={size} variant="outline" onClick={() => respond.mutate(false)}>
          Decline
        </Button>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <Button size={size} variant="outline" onClick={() => remove.mutate()}>
        <Clock /> Requested · Cancel
      </Button>
    );
  }
  return (
    <button
      type="button"
      className={cn("btn-shine", size === "sm" ? "text-xs" : "text-[13px]")}
      onClick={() => requireMember(() => add.mutate())}
      disabled={add.isPending}
    >
      {add.isPending ? "Sending…" : "Add friend"}
      {add.isPending ? <Loader2 className="btn-shine-icon animate-spin" /> : <UserPlus className="btn-shine-icon" strokeWidth={2.5} />}
    </button>
  );
}
