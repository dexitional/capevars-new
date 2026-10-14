import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, CalendarDays, Globe, GraduationCap, MapPin, Pencil, Store, Users } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatDate } from "#/lib/format";
import { MEMBER_TYPES } from "#/lib/labels";
import { Avatar, Container, Img, TextBlock, Verified } from "#/components/site/kit";
import { Composer } from "#/components/social/composer";
import { PostFeed } from "#/components/social/feed";
import { FriendButton } from "#/components/social/friend-button";
import { ReportButton } from "#/components/site/report-button";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const profileQuery = (username: string) => ({
  queryKey: ["profile", username],
  queryFn: () => api.get<{ profile: Row; counts: Row; friends: Array<Row>; pages: Array<Row>; groups: Array<Row>; store: Row | null; friendship: { status: string; direction: "incoming" | "outgoing" } | null; mutual: number; isMe: boolean }>(`/social/u/${username}`),
});

export const Route = createFileRoute("/_site/u/$username")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(profileQuery(params.username));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.profile.full_name} | Capevars` }, { name: "description", content: loaderData.profile.headline ?? "" }] : [] }),
  component: Profile,
});

function Profile() {
  const { username } = Route.useParams();
  const queryClient = useQueryClient();
  const { data, refetch } = useQuery(profileQuery(username));
  if (!data) return null;
  const u = data.profile;
  const isFriend = data.friendship?.status === "accepted";
  return (
    <div className="pb-16">
      <div className="h-48 bg-gradient-to-br from-primary via-[#0b2f6b] to-sys-social sm:h-72">
        <Img src={u.cover_url} className="size-full" fallback={<span />} sizes="100vw" priority />
      </div>
      <Container>
        <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar src={u.avatar_url} name={u.full_name} size="2xl" ring />
          <div className="min-w-0 flex-1 pb-2">
            <h1 className="flex items-center gap-2 text-3xl font-black text-primary">
              {u.full_name} {u.is_verified ? <Verified className="size-6" /> : null}
            </h1>
            {u.headline && <p className="text-muted-foreground">{u.headline}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              {data.counts.friends} friends
              {data.mutual > 0 && ` · ${data.mutual} mutual`}
              {u.open_to_work ? <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Open to work</span> : null}
            </p>
          </div>
          <div className="pb-2">
            {data.isMe ? (
              <Button asChild variant="outline">
                <Link to="/account">
                  <Pencil /> Edit profile
                </Link>
              </Button>
            ) : (
              <FriendButton userId={u.id} status={data.friendship?.status ?? null} direction={data.friendship?.direction} size="default" onChange={() => void refetch()} />
            )}
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="h-fit space-y-4">
            <section className="space-y-2.5 rounded-2xl border bg-white p-5 text-sm">
              <h2 className="font-bold text-primary">About</h2>
              {u.bio && <TextBlock text={u.bio} className="text-muted-foreground" />}
              <p className="flex items-center gap-2">
                <GraduationCap className="size-4 text-muted-foreground" /> {MEMBER_TYPES[u.member_type]}
                {u.institution ? ` · ${u.institution}` : ""}
              </p>
              {u.location && (
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" /> {u.location}
                </p>
              )}
              {u.website && (
                <a href={u.website} target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 hover:underline">
                  <Globe className="size-4 text-muted-foreground" /> {u.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              <p className="flex items-center gap-2">
                <CalendarDays className="size-4 text-muted-foreground" /> Joined {formatDate(u.created_at)}
              </p>
              {data.store && (
                <Link to="/market/store/$slug" params={{ slug: data.store.slug }} className="flex items-center gap-2 font-semibold text-primary hover:underline">
                  <Store className="size-4" /> {data.store.store_name}
                </Link>
              )}
              {u.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {u.skills.map((s: string) => (
                    <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              {u.open_to_work ? (
                <Link to="/market/jobs/talent" className="flex items-center gap-2 text-emerald-700 hover:underline">
                  <Briefcase className="size-4" /> Available for work
                </Link>
              ) : null}
            </section>
            {data.friends.length > 0 && (
              <section className="rounded-2xl border bg-white p-5">
                <h2 className="mb-3 flex items-center gap-2 font-bold text-primary">
                  <Users className="size-4" /> Friends
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {data.friends.map((f) => (
                    <Link key={f.id} to="/u/$username" params={{ username: f.username }} className="text-center text-xs hover:underline">
                      <Avatar src={f.avatar_url} name={f.full_name} size="lg" className="mx-auto" />
                      <span className="mt-1 line-clamp-2 block">{f.full_name}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
            {(data.groups.length > 0 || data.pages.length > 0) && (
              <section className="space-y-2 rounded-2xl border bg-white p-5 text-sm">
                <h2 className="font-bold text-primary">Groups & pages</h2>
                {data.groups.map((g) => (
                  <Link key={g.slug} to="/groups/$slug" params={{ slug: g.slug }} className="flex items-center gap-2 hover:underline">
                    <Img src={g.logo_url} className="size-7 rounded-lg" /> {g.name} <span className="text-xs text-muted-foreground capitalize">· {g.role}</span>
                  </Link>
                ))}
                {data.pages.map((p) => (
                  <Link key={p.slug} to="/social/pages/$slug" params={{ slug: p.slug }} className="flex items-center gap-2 hover:underline">
                    <Avatar src={p.avatar_url} name={p.name} size="xs" /> {p.name}
                  </Link>
                ))}
              </section>
            )}
            {!data.isMe && (
              <ReportButton entityType="user" entityId={u.id} className="px-2">
                Report profile
              </ReportButton>
            )}
          </aside>
          <div className="min-w-0 space-y-4">
            {(data.isMe || isFriend) && (
              <Composer
                wallUserId={data.isMe ? undefined : u.id}
                wallName={data.isMe ? undefined : u.full_name.split(" ")[0]}
                onPosted={() => void queryClient.invalidateQueries({ queryKey: ["wall", username] })}
              />
            )}
            <PostFeed queryKey={["wall", username]} path={`/social/u/${username}/posts`} />
          </div>
        </div>
      </Container>
    </div>
  );
}
