import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, MapPin, Phone, Plus, ShoppingCart, Truck } from "lucide-react";
import { ApiError, api } from "#/lib/api-client";
import { formatMoney } from "#/lib/money";
import { cart, useCart } from "#/hooks/useCart";
import { Container, EmptyState, Img, RatingPill, TextBlock, Verified } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;
const vendorQuery = (slug: string) => ({ queryKey: ["vendor", slug], queryFn: () => api.get<{ vendor: Row; menu: Array<Row> }>(`/market/food/${slug}`) });

export const Route = createFileRoute("/_site/market/food/$slug")({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(vendorQuery(params.slug));
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) throw notFound();
      throw err;
    }
  },
  head: ({ loaderData }) => ({ meta: loaderData ? [{ title: `${loaderData.vendor.store_name} menu | Capevars` }] : [] }),
  component: VendorPage,
});

function VendorPage() {
  const { slug } = Route.useParams();
  const { data } = useQuery(vendorQuery(slug));
  const navigate = useNavigate();
  const { lines, count, subtotal } = useCart();
  if (!data) return null;
  const v = data.vendor;
  const sections = [...new Set(data.menu.map((m) => m.menu_section as string))];
  const add = (m: Row) => {
    cart.add({ productId: m.id, title: m.title, price: Number(m.price), image: m.image, slug: m.slug, storeName: v.store_name });
    toast.success(`${m.title} added`);
  };
  const inCart = (id: number) => lines.find((l) => l.productId === id)?.quantity ?? 0;
  return (
    <div className="pb-24">
      <div className="relative h-56 bg-primary sm:h-72">
        <Img src={v.banner_url} className="size-full" fallback={<span />} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-6 text-white">
          <div className="flex items-end gap-4">
            <Img src={v.logo_url} className="size-20 shrink-0 rounded-2xl border-4 border-white" />
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-black">
                {v.store_name} {v.is_verified ? <Verified className="size-5" /> : null}
              </h1>
              <p className="text-white/80">{[v.cuisine, v.tagline].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
        </Container>
      </div>
      <Container className="mt-6 grid gap-8 lg:grid-cols-[200px_1fr_280px]">
        <nav className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {sections.map((s) => (
              <a key={s} href={`#${encodeURIComponent(s)}`} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-white">
                {s}
              </a>
            ))}
          </div>
        </nav>
        <div>
          {!v.is_open && <p className="mb-4 rounded-2xl bg-amber-50 p-4 text-sm font-medium text-amber-900">This vendor is closed right now. You can still browse the menu.</p>}
          {data.menu.length === 0 ? (
            <EmptyState title="No menu yet" />
          ) : (
            sections.map((s) => (
              <section key={s} id={encodeURIComponent(s)} className="mb-8 scroll-mt-24">
                <h2 className="mb-3 text-lg font-black text-primary">{s}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.menu
                    .filter((m) => m.menu_section === s)
                    .map((m) => (
                      <div key={m.id} className="flex gap-3 rounded-2xl border bg-white p-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{m.title}</p>
                          {m.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{m.description}</p>}
                          <p className="mt-2 font-bold text-primary">{formatMoney(m.price)}</p>
                        </div>
                        <div className="relative shrink-0">
                          <Img src={m.image} className="size-24 rounded-xl" />
                          <button
                            type="button"
                            onClick={() => add(m)}
                            disabled={!v.is_open || (m.stock !== null && m.stock <= 0)}
                            className="absolute -right-1.5 -bottom-1.5 flex size-9 items-center justify-center rounded-full bg-primary text-white shadow-lg disabled:opacity-40"
                            aria-label={`Add ${m.title}`}
                          >
                            {inCart(m.id) ? <span className="text-xs font-bold">{inCart(m.id)}</span> : <Plus className="size-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            ))
          )}
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl border bg-white p-5 text-sm">
            <RatingPill value={v.rating_avg} count={v.rating_count} />
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {v.opening_hours && (
                <li className="flex items-center gap-2">
                  <Clock className="size-4" /> {v.opening_hours}
                </li>
              )}
              {v.location && (
                <li className="flex items-center gap-2">
                  <MapPin className="size-4" /> {v.location}
                </li>
              )}
              <li className="flex items-center gap-2">
                <Truck className="size-4" /> {v.delivers ? `Delivery ${Number(v.delivery_fee) ? formatMoney(v.delivery_fee) : "free"}` : "Pickup only"}
              </li>
              {v.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="size-4" /> <a href={`tel:${v.phone}`}>{v.phone}</a>
                </li>
              )}
            </ul>
            <TextBlock text={v.description} className="mt-3 text-muted-foreground" />
          </div>
        </aside>
      </Container>
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
          <Button size="lg" className="h-14 rounded-full px-8 shadow-2xl" onClick={() => void navigate({ to: "/market/cart" })}>
            <ShoppingCart /> View cart · {count} items · {formatMoney(subtotal)}
          </Button>
        </div>
      )}
    </div>
  );
}
