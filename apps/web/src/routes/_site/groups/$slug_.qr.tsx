import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Users } from "lucide-react";
import { ApiError } from "#/lib/api-client";
import { asset } from "#/lib/asset";
import { optimizedUrl } from "#/lib/image";
import { groupQuery, useGroup } from "#/components/groups/use-group";
import { GroupQrCode, groupInviteUrl } from "#/components/groups/group-qr";
import { FlyerPage, FlyerSheet, HeroDecor, backLinkClass, useOrigin } from "#/components/market/flyer-kit";

// A printable A4 poster that invites people to join a campus group: its logo
// and name, and a QR code (logo in the middle) to the group's join link.
export const Route = createFileRoute("/_site/groups/$slug_/qr")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(groupQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `Join ${loaderData.group.name} | Campus Groups` }, { name: "robots", content: "noindex" }] : [] }),
  component: GroupQrPoster,
});

function GroupQrPoster() {
  const { slug } = Route.useParams();
  const { data } = useGroup(slug);
  const origin = useOrigin();
  if (!data) return null;
  const g = data.group;
  const url = groupInviteUrl(origin, slug);
  const group = { name: g.name as string, slug, logo: (g.logo_url as string | null) ?? null };
  return (
    <FlyerPage
      back={
        <Link to="/groups/$slug" params={{ slug }} className={backLinkClass}>
          <ArrowLeft className="size-4" /> Group page
        </Link>
      }
      share={origin ? { title: g.name, text: `Join ${g.name} on Capevars`, url } : null}
      notice={g.status !== "approved" ? "This group isn't approved yet, so people can't join it from the code." : null}
    >
      <FlyerSheet>
        <header className="relative flex flex-none flex-col items-center overflow-hidden bg-primary px-[6cqw] pt-[7cqw] pb-[6cqw] text-center text-white">
          <HeroDecor />
          {group.logo ? (
            <img src={optimizedUrl(group.logo, 512, 85)} alt="" className="relative size-[22cqw] rounded-[4cqw] bg-white object-cover p-[1cqw] shadow-xl" />
          ) : (
            <span className="relative grid size-[22cqw] place-items-center rounded-[4cqw] bg-brand-gold text-primary shadow-xl">
              <Users className="size-[11cqw]" />
            </span>
          )}
          <h1 className="relative mt-[4cqw] text-[7cqw] leading-tight font-black">{g.name}</h1>
          {g.tagline && <p className="relative mt-[1.5cqw] text-[2.6cqw] text-white/80">{g.tagline}</p>}
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-[6cqw]">
          <p className="text-[4.2cqw] font-black">Scan to join us</p>
          <div className="mt-[3cqw] rounded-[3cqw] border-[0.8cqw] border-brand-gold bg-white p-[3cqw] shadow-sm">
            {origin ? <GroupQrCode url={url} group={group} className="size-[48cqw]" /> : <div className="size-[48cqw]" />}
          </div>
          <p className="mt-[3cqw] text-[2.4cqw] text-primary/70">Open your phone camera, point it at the code and tap the link.</p>
          <p className="mt-[1cqw] text-[2.2cqw] font-bold break-all">{url.replace(/^https?:\/\//, "")}</p>
        </div>
        <footer className="flex flex-none items-center justify-between gap-[2cqw] bg-primary px-[6cqw] py-[2.4cqw] text-white">
          <p className="text-[2cqw] font-semibold">Campus Groups on Capevars</p>
          <img src={asset("logo-mark-light.png")} alt="Capevars" className="h-[5cqw] w-auto" />
        </footer>
      </FlyerSheet>
    </FlyerPage>
  );
}
