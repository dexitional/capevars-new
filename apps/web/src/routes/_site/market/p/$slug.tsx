import { useState } from "react";
import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Flag, MapPin, MessageCircle, Minus, Phone, Plus, ShieldCheck, ShoppingCart, Store, Truck, Zap } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDate, timeAgo } from "#/lib/format";
import { discountPercent, formatMoney } from "#/lib/money";
import { cart } from "#/hooks/useCart";
import { useMember } from "#/hooks/useMember";
import { Avatar, Container, FavouriteButton, Img, RatingPill, SectionHeader, Stars, TextBlock, Verified } from "#/components/site/kit";
import { ProductCard } from "#/components/site/cards";
import { ReportButton } from "#/components/site/report-button";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const productQuery = (slug: string) => ({
  queryKey: ["product", slug],
  queryFn: () => api.get<{ product: Row; reviews: Array<Row>; related: Array<Row>; more: Array<Row>; canReview: boolean }>(`/market/products/${slug}`),
});

export const Route = createFileRoute("/_site/market/p/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(productQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.title} | Capevars Marketplace` },
          { name: "description", content: String(loaderData.product.description ?? "").slice(0, 160) },
          { property: "og:image", content: loaderData.product.images?.[0] ?? "" },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery(productQuery(slug));
  const navigate = useNavigate();
  const member = useMember();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  if (!data) return null;
  const p = data.product;
  const images: Array<string> = p.images?.length ? p.images : [];
  const off = discountPercent(p.price, p.compare_at_price);
  const soldOut = p.stock !== null && p.stock <= 0;
  const isOwn = member?.id === p.store_owner_id;
  const line = { productId: p.id, title: p.title, price: Number(p.price), image: images[0] ?? null, slug: p.slug, storeName: p.store_name };
  const add = () => {
    cart.add(line, qty);
    toast.success("Added to cart", { action: { label: "View cart", onClick: () => void navigate({ to: "/market/cart" }) } });
  };
  const wa = p.store_whatsapp ? `https://wa.me/${String(p.store_whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I'm interested in "${p.title}" on Capevars`)}` : null;

  return (
    <Container className="py-6">
      <nav className="mb-4 text-sm text-muted-foreground">
        <Link to="/market" className="hover:underline">
          Marketplace
        </Link>
        {p.category_slug && (
          <>
            {" / "}
            <Link to="/market/browse" search={{ category: p.category_slug }} className="hover:underline">
              {p.category_name}
            </Link>
          </>
        )}
      </nav>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr_300px]">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
            <Img src={images[active]} alt={p.title} sizes="(min-width: 1024px) 40vw, 100vw" priority className="size-full object-contain" />
            <FavouriteButton type="product" id={p.id} className="absolute top-3 right-3" />
            {off > 0 && <span className="absolute top-3 left-3 rounded-lg bg-rose-600 px-2 py-1 text-sm font-bold text-white">-{off}%</span>}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button key={src} type="button" onClick={() => setActive(i)} className={cn("size-16 shrink-0 overflow-hidden rounded-xl border-2", i === active ? "border-primary" : "border-transparent")}>
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl leading-snug font-bold text-foreground sm:text-3xl">{p.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {p.rating_avg ? (
              <span className="flex items-center gap-1.5">
                <Stars value={p.rating_avg} /> {Number(p.rating_avg).toFixed(1)} ({p.rating_count} reviews)
              </span>
            ) : (
              <span>No reviews yet</span>
            )}
            {p.sold_count > 0 && <span>· {p.sold_count} sold</span>}
            <span className="capitalize">· {p.item_condition}</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-black text-primary">{formatMoney(p.price)}</span>
            {off > 0 && <span className="text-lg text-muted-foreground line-through">{formatMoney(p.compare_at_price)}</span>}
          </div>
          {p.stock !== null && (
            <p className={cn("mt-2 text-sm font-medium", soldOut ? "text-destructive" : p.stock <= 5 ? "text-amber-700" : "text-success")}>
              {soldOut ? "Sold out" : p.stock <= 5 ? `Only ${p.stock} left` : "In stock"}
            </p>
          )}
          {!isOwn && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-xl border bg-white">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-3" aria-label="Decrease quantity">
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(p.stock ?? 99, qty + 1))} className="p-3" aria-label="Increase quantity">
                  <Plus className="size-4" />
                </button>
              </div>
              <Button size="lg" className="h-12 flex-1 rounded-xl" disabled={soldOut} onClick={add}>
                <ShoppingCart /> Add to cart
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 flex-1 rounded-xl bg-brand-cream text-primary hover:bg-brand-butter"
                disabled={soldOut}
                onClick={() => {
                  cart.add(line, qty);
                  void navigate({ to: "/market/checkout" });
                }}
              >
                <Zap /> Buy now
              </Button>
            </div>
          )}
          {isOwn && (
            <p className="mt-6 rounded-xl bg-accent p-3 text-sm">
              This is your product.{" "}
              <Link to="/seller/products" className="font-semibold underline">
                Manage it in Seller Center
              </Link>
            </p>
          )}
          <ul className="mt-6 space-y-2 rounded-2xl border bg-white p-4 text-sm">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" /> {p.delivers ? `Delivery ${Number(p.delivery_fee) ? formatMoney(p.delivery_fee) : "free"} · or pickup` : "Pickup from seller"}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> {p.store_location ?? "Location on request"}
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> Pay on delivery available — inspect before you pay
            </li>
          </ul>
          {p.tags?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t: string) => (
                <Link key={t} to="/market/browse" search={{ q: t }} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium hover:bg-accent">
                  #{t}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Seller */}
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Sold by</p>
          <Link to="/market/store/$slug" params={{ slug: p.store_slug }} className="mt-3 flex items-center gap-3">
            <Img src={p.store_logo} className="size-12 rounded-xl border" fallback={<Store className="size-5" />} />
            <span>
              <span className="flex items-center gap-1 font-bold text-primary hover:underline">
                {p.store_name} {p.store_verified ? <Verified /> : null}
              </span>
              <RatingPill value={p.store_rating} count={p.store_rating_count} />
            </span>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">Selling since {formatDate(p.store_since)}</p>
          <div className="mt-4 grid gap-2">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-bold text-white hover:opacity-90">
                <MessageCircle className="size-4" /> Chat on WhatsApp
              </a>
            )}
            {p.store_phone && (
              <a href={`tel:${p.store_phone}`} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold hover:bg-muted">
                <Phone className="size-4" /> Call seller
              </a>
            )}
            <Link to="/market/store/$slug" params={{ slug: p.store_slug }} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border text-sm font-semibold hover:bg-muted">
              <Store className="size-4" /> Visit store
            </Link>
          </div>
          <ReportButton entityType="product" entityId={p.id} className="mt-4">
            <Flag className="size-3.5" /> Report this listing
          </ReportButton>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-black text-primary">Description</h2>
          <TextBlock text={p.description || "No description provided."} className="mt-3 text-sm leading-relaxed text-foreground/90" />
        </section>
        <section className="rounded-2xl border bg-white p-6">
          <h2 className="text-lg font-black text-primary">Reviews ({data.reviews.length})</h2>
          {data.reviews.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No reviews yet. Buyers can review after delivery.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {data.reviews.map((r) => (
                <li key={r.id} className="flex gap-3">
                  <Avatar src={r.avatar_url} name={r.full_name} size="sm" />
                  <div>
                    <p className="text-sm font-semibold">
                      {r.full_name} <span className="font-normal text-muted-foreground">· {timeAgo(r.created_at)}</span>
                    </p>
                    <Stars value={r.rating} />
                    {r.body && <p className="mt-1 text-sm">{r.body}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {data.more.length > 0 && (
        <section className="mt-10">
          <SectionHeader title={`More from ${p.store_name}`} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {data.more.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
      {data.related.length > 0 && (
        <section className="mt-10">
          <SectionHeader title="You may also like" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.related.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
