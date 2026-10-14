import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, UserSearch } from "lucide-react";
import { api } from "#/lib/api-client";
import { Avatar, Container, EmptyState, Loading, PageHero, Verified } from "#/components/site/kit";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/market/jobs/talent")({
  head: () => ({ meta: [{ title: "Hire talent | Job Circle" }] }),
  component: TalentPage,
});

function TalentPage() {
  const [q, setQ] = useState("");
  const { data } = useQuery({ queryKey: ["talent", q], queryFn: () => api.get<{ items: Array<Row> }>("/jobs/talent", { q }) });
  return (
    <div className="pb-16">
      <PageHero system="market" eyebrow="Hire talent" title="Students and professionals open to work." text="Members who switched on “Open to work” in their profile.">
        <div className="flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2">
          <Search className="ml-3 size-5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Skill, role or name (e.g. graphic design)" className="flex-1 bg-transparent py-2.5 text-foreground outline-none" />
        </div>
      </PageHero>
      <Container className="mt-8">
        {!data ? (
          <Loading />
        ) : data.items.length === 0 ? (
          <EmptyState icon={UserSearch} title="No one matches yet" text="Try a broader skill." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((u) => (
              <Link key={u.id} to="/u/$username" params={{ username: u.username }} className="card-hover rounded-2xl border bg-white p-5">
                <div className="flex items-center gap-3">
                  <Avatar src={u.avatar_url} name={u.full_name} size="lg" />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 font-bold text-primary">
                      {u.full_name} {u.is_verified ? <Verified /> : null}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{u.headline}</p>
                  </div>
                </div>
                {u.location && (
                  <p className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" /> {u.location}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-1">
                  {(u.skills ?? []).slice(0, 6).map((s: string) => (
                    <span key={s} className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-primary">
                      {s}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
