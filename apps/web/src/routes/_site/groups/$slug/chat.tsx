import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { EmptyState, Loading } from "#/components/site/kit";
import { ChatRoom } from "#/components/social/chat-room";
import { useGroup } from "#/components/groups/use-group";

export const Route = createFileRoute("/_site/groups/$slug/chat")({ component: GroupChat });

function GroupChat() {
  const { slug } = Route.useParams();
  const { data: g } = useGroup(slug);
  const isMember = g?.membership?.status === "active";
  const { data, error } = useQuery({ queryKey: ["group-chat", g?.group.id], queryFn: () => api.get<{ id: number }>(`/chat/group/${g!.group.id}`), enabled: Boolean(g && isMember) });
  if (!g) return null;
  if (!isMember) return <EmptyState title="Members only" text="Join the group to chat with other members." />;
  if (error) return <EmptyState title="Chat unavailable" text={(error as Error).message} />;
  if (!data) return <Loading />;
  return <ChatRoom threadId={data.id} className="h-[70vh] rounded-2xl border bg-white" />;
}
