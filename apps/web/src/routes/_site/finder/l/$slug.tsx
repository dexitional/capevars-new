import { useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Clock, ExternalLink, Flag, Globe, Images, Mail, MapPin, MessageCircle, Pencil, Phone, Share2 } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { timeAgo } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { FINDER_TYPES } from "#/lib/labels";
import type { FinderType } from "#/lib/labels";
import { useRequireMember } from "#/hooks/useMember";
import { Avatar, Container, FavouriteButton, Img, StarInput, Stars, StatusBadge, TextBlock, Verified } from "#/components/site/kit";
import { ListingCard } from "#/components/site/cards";
import { ReportButton } from "#/components/site/report-button";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Dialog, DialogContent } from "#/components/ui/dialog";

type Row = Record<string, any>;
const listingQuery = (slug: string) => ({
  queryKey: ["listing", slug],
  queryFn: () => api.get<{ listing: Row; reviews: Array<Row>; similar: Array<Row>; breakdown: Record<string, number>; isOwner: boolean; myReview: Row | null }>(`/finder/l/${slug}`),
});

export const Route = createFileRoute("/_site/finder/l/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(listingQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.listing.name} | The Finder` },
          { name: "description", content: loaderData.listing.tagline ?? "" },
          { property: "og:image", content: loaderData.listing.cover_url ?? "" },
        ]
      : [],
  }),
  component: ListingPage,
});

const ratingWord = (r: number) => (r >= 4.5 ? "Exceptional" : r >= 4 ? "Very good" : r >= 3.5 ? "Good" : r >= 3 ? "Pleasant" : "Rated");


// "Amamoma, Cape Coast" + "Amamoma" + "Cape Coast" → "Amamoma, Cape Coast": an address
// often already names its area and city, so repeated parts are dropped.
function placeLine(...parts: Array<string | null | undefined>) {
  const seen = new Map<string, string>();
  for (const part of parts) {
    for (const piece of String(part ?? "").split(",")) {
      const p = piece.trim();
      if (p && !seen.has(p.toLowerCase())) seen.set(p.toLowerCase(), p);
    }
  }
  return [...seen.values()].join(", ");
}
function ListingPage() {
  const { slug } = Route.useParams();
  const { data, refetch } = useQuery(listingQuery(slug));
  const requireMember = useRequireMember();
  const [gallery, setGallery] = useState<number | null>(null);
  const [rating, setRating] = useState(data?.myReview?.rating ?? 0);
  const [title, setTitle] = useState(data?.myReview?.title ?? "");
  const [body, setBody] = useState(data?.myReview?.body ?? "");
  const review = useMutation({
    mutationFn: () => api.post(`/finder/l/${data!.listing.id}/reviews`, { rating, title, body }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  if (!data) return null;
  const l = data.listing;
  const images: Array<string> = [l.cover_url, ...(l.images ?? [])].filter(Boolean);
  const type = FINDER_TYPES[l.type as FinderType];
  const total = Object.values(data.breakdown).reduce((a, b) => a + b, 0);
  const place = placeLine(l.address, l.area, l.city);
  const mapQuery = l.latitude && l.longitude ? `${l.latitude},${l.longitude}` : placeLine(l.name, l.address, l.area, l.city);
  const wa = l.whatsapp ? `https://wa.me/${String(l.whatsapp).replace(/\D/g, "").replace(/^0/, "233")}?text=${encodeURIComponent(`Hi, I found ${l.name} on Capevars`)}` : null;
  return (
    <Container className="py-6">
      <nav className="mb-3 text-sm text-muted-foreground">
        <Link to="/finder" className="hover:underline">
          The Finder
        </Link>{" "}
        /{" "}
        <Link to="/finder/search" search={{ type: l.type }} className="hover:underline">
          {type?.label}
        </Link>
        {l.city && (
          <>
            {" / "}
            <Link to="/finder/search" search={{ type: l.type, city: l.city }} className="hover:underline">
              {l.city}
            </Link>
          </>
        )}
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-sys-finder/10 px-2 py-0.5 text-xs font-bold text-teal-800">{type?.one}</span>
            {l.star_rating ? <Stars value={l.star_rating} /> : null}
            {l.status !== "published" && <StatusBadge status={l.status} />}
          </div>
          <h1 className="mt-2 flex items-center gap-2 text-3xl font-black text-primary">
            {l.name} {l.is_verified ? <Verified className="size-6" /> : null}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {place}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {data.isOwner && (
            <Button asChild variant="outline" size="sm">
              <Link to="/finder/edit/$id" params={{ id: String(l.id) }}>
                <Pencil /> Edit
              </Link>
            </Button>
          )}
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }}
            className="flex size-10 items-center justify-center rounded-full border bg-white"
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </button>
          <FavouriteButton type="listing" id={l.id} label />
        </div>
      </div>

      {/* Gallery */}
      <div className="mt-5 grid h-[280px] gap-2 overflow-hidden rounded-2xl sm:h-[420px] sm:grid-cols-4 sm:grid-rows-2">
        {images.length === 0 ? (
          <Img src={null} className="size-full sm:col-span-4 sm:row-span-2" />
        ) : (
          images.slice(0, 5).map((src, i) => (
            <button key={src} type="button" onClick={() => setGallery(i)} className={cn("relative overflow-hidden", i === 0 ? "sm:col-span-2 sm:row-span-2" : "hidden sm:block")}>
              <Img src={src} className="size-full transition hover:scale-105" priority={i === 0} sizes={i === 0 ? "50vw" : "25vw"} />
              {i === 4 && images.length > 5 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 font-bold text-white">
                  <Images className="mr-2 size-5" /> +{images.length - 5}
                </span>
              )}
            </button>
          ))
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {l.tagline && <p className="text-lg font-medium text-primary">{l.tagline}</p>}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-black text-primary">About</h2>
            <TextBlock text={l.description || "No description yet."} className="mt-3 text-sm leading-relaxed" />
            {l.attributes && Object.keys(l.attributes).length > 0 && (
              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                {Object.entries(l.attributes as Record<string, string>).map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-muted p-3">
                    <dt className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
          {l.amenities?.length > 0 && (
            <section className="rounded-2xl border bg-white p-6">
              <h2 className="text-lg font-black text-primary">What's available</h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {l.amenities.map((a: string) => (
                  <li key={a} className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-success" /> {a}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {mapQuery && (
            <section className="overflow-hidden rounded-2xl border bg-white">
              <iframe
                title={`Map of ${l.name}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
                className="h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-5 py-3 text-sm font-semibold text-primary hover:underline">
                Open in Google Maps <ExternalLink className="size-3.5" />
              </a>
            </section>
          )}

          {/* Reviews */}
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-black text-primary">Reviews</h2>
            {l.rating_avg ? (
              <div className="mt-4 grid gap-6 sm:grid-cols-[180px_1fr]">
                <div className="text-center">
                  <p className="text-5xl font-black text-primary">{Number(l.rating_avg).toFixed(1)}</p>
                  <Stars value={l.rating_avg} size="md" className="mt-1" />
                  <p className="mt-1 text-sm font-semibold">{ratingWord(Number(l.rating_avg))}</p>
                  <p className="text-xs text-muted-foreground">{l.rating_count} reviews</p>
                </div>
                <ul className="space-y-1.5">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <li key={n} className="flex items-center gap-2 text-xs">
                      <span className="w-3">{n}</span>
                      <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <span className="block h-full bg-brand-gold" style={{ width: `${((data.breakdown[n] ?? 0) / Math.max(1, total)) * 100}%` }} />
                      </span>
                      <span className="w-6 text-right text-muted-foreground">{data.breakdown[n] ?? 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No reviews yet — be the first.</p>
            )}
            {!data.isOwner && (
              <form
                className="mt-6 space-y-3 rounded-2xl bg-muted p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  requireMember(() => review.mutate());
                }}
              >
                <p className="font-semibold">{data.myReview ? "Update your review" : "Write a review"}</p>
                <StarInput value={rating} onChange={setRating} />
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" className="bg-white" />
                <Textarea rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What was it like?" className="bg-white" />
                <Button type="submit" disabled={!rating || review.isPending}>
                  Post review
                </Button>
              </form>
            )}
            <ul className="mt-6 space-y-5">
              {data.reviews.map((r) => (
                <li key={r.id} className="flex gap-3">
                  <Avatar src={r.avatar_url} name={r.full_name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">
                      {r.full_name} <span className="font-normal text-muted-foreground">· {timeAgo(r.created_at)}</span>
                    </p>
                    <Stars value={r.rating} />
                    {r.title && <p className="mt-1 font-semibold">{r.title}</p>}
                    {r.body && <p className="text-sm">{r.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-white p-5">
            {l.price_from ? (
              <p className="text-sm text-muted-foreground">
                From <span className="text-3xl font-black text-primary">{formatMoney(l.price_from)}</span> {l.price_unit}
                {l.price_to ? <span className="block text-xs">up to {formatMoney(l.price_to)}</span> : null}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Contact for prices</p>
            )}
            {l.rating_avg && (
              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-lg bg-primary px-2 py-1 text-sm font-black text-white">{Number(l.rating_avg).toFixed(1)}</span>
                <span className="text-sm font-semibold">{ratingWord(Number(l.rating_avg))}</span>
              </div>
            )}
            <div className="mt-5 grid gap-2">
              {l.phone && (
                <a href={`tel:${l.phone}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white">
                  <Phone className="size-4" /> Call {l.phone}
                </a>
              )}
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-white">
                  <MessageCircle className="size-4" /> WhatsApp
                </a>
              )}
              {l.email && (
                <a href={`mailto:${l.email}`} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold">
                  <Mail className="size-4" /> Email
                </a>
              )}
              {l.website && (
                <a href={l.website} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold">
                  <Globe className="size-4" /> Website
                </a>
              )}
            </div>
            {l.opening_hours && (
              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-4" /> {l.opening_hours}
              </p>
            )}
          </div>
          <ReportButton entityType="listing" entityId={l.id} className="px-2">
            <Flag className="size-3.5" /> Report incorrect information
          </ReportButton>
        </aside>
      </div>

      {data.similar.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-black text-primary">More {type?.label.toLowerCase()} nearby</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.similar.map((x) => (
              <ListingCard key={x.id} l={x} />
            ))}
          </div>
        </section>
      )}

      <Dialog open={gallery !== null} onOpenChange={(o) => !o && setGallery(null)}>
        <DialogContent className="max-w-5xl bg-black p-2 sm:max-w-5xl">
          {gallery !== null && (
            <div>
              <img src={images[gallery]} alt="" className="max-h-[75vh] w-full object-contain" />
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {images.map((src, i) => (
                  <button key={src} type="button" onClick={() => setGallery(i)} className={cn("size-16 shrink-0 overflow-hidden rounded-lg border-2", i === gallery ? "border-brand-gold" : "border-transparent opacity-60")}>
                    <img src={src} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
