import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "#/lib/api-client";
import { Loading, Prose } from "#/components/site/kit";
import { useGroup } from "#/components/groups/use-group";
import { PrivateNotice } from "#/components/groups/locked";

export const Route = createFileRoute("/_site/groups/$slug/p/$page")({ component: GroupPage });

function GroupPage() {
  const { slug, page } = Route.useParams();
  const { data: g } = useGroup(slug);
  const { data } = useQuery({ queryKey: ["group-page", g?.group.id, page], queryFn: () => api.get<{ page: Record<string, any> }>(`/groups/${g!.group.id}/pages/${page}`), enabled: Boolean(g?.canSee) });
  if (!g) return null;
  if (!g.canSee) return <PrivateNotice />;
  if (!data) return <Loading />;
  return (
    <article className="rounded-2xl border bg-white p-6 sm:p-10">
      <h1 className="mb-6 text-3xl font-black text-primary">{data.page.title}</h1>
      <Prose html={data.page.body} />
    </article>
  );
}
