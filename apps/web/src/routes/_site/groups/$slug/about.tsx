import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { formatDate } from "#/lib/format";
import { Prose } from "#/components/site/kit";
import { useGroup } from "#/components/groups/use-group";

export const Route = createFileRoute("/_site/groups/$slug/about")({ component: About });

function About() {
  const { slug } = Route.useParams();
  const { data } = useGroup(slug);
  if (!data) return null;
  const g = data.group;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <section className="rounded-2xl border bg-white p-6">
        {g.about ? <Prose html={g.about} /> : <p className="text-muted-foreground">No description yet.</p>}
      </section>
      <aside className="h-fit space-y-2 rounded-2xl border bg-white p-5 text-sm">
        <p>Created {formatDate(g.created_at)}</p>
        <p>{g.member_count} members</p>
        {g.contact_email && (
          <a href={`mailto:${g.contact_email}`} className="flex items-center gap-2 font-semibold text-primary hover:underline">
            <Mail className="size-4" /> {g.contact_email}
          </a>
        )}
      </aside>
    </div>
  );
}
