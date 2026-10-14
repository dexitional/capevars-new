import { useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Minus, Plus, ShoppingCart, Store, Trash2 } from "lucide-react";
import { formatMoney } from "#/lib/money";
import { cart, useCart } from "#/hooks/useCart";
import { groupByStore, useCartQuote } from "#/components/market/cart-quote";
import { Container, EmptyState, Img } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/market/cart")({
  head: () => ({ meta: [{ title: "Cart | Capevars" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines } = useCart();
  const { data: quote } = useCartQuote(lines);
  // Keep cached titles/prices in sync with the live quote.
  useEffect(() => {
    for (const q of quote?.items ?? []) {
      const l = lines.find((x) => x.productId === q.id);
      if (l && Number(q.price) !== l.price) cart.add({ ...l, price: Number(q.price) }, 0);
    }
  }, [quote, lines]);
  const groups = groupByStore(lines, quote?.items);
  const subtotal = groups.flatMap((g) => g.lines).filter((l) => l.available).reduce((n, l) => n + l.price * l.quantity, 0);
  const unavailable = groups.flatMap((g) => g.lines).filter((l) => !l.available);

  if (!lines.length) {
    return (
      <Container className="py-12">
        <EmptyState icon={ShoppingCart} title="Your cart is empty" text="Browse the Marketplace or order from a food vendor." action={<Link to="/market" className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white">Start shopping</Link>} />
      </Container>
    );
  }
  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-black text-primary">Your cart</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {unavailable.length > 0 && (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
              <span className="flex items-center gap-2">
                <AlertTriangle className="size-4" /> {unavailable.length} item(s) are unavailable or low on stock.
              </span>
              <Button size="sm" variant="outline" onClick={() => cart.removeMany(unavailable.map((l) => l.productId))}>
                Remove them
              </Button>
            </div>
          )}
          {groups.map((g) => (
            <section key={g.store} className="overflow-hidden rounded-2xl border bg-white">
              <header className="flex items-center gap-2 border-b bg-muted/50 px-5 py-3 text-sm font-bold text-primary">
                <Store className="size-4" />
                {g.storeSlug ? (
                  <Link to="/market/store/$slug" params={{ slug: g.storeSlug }} className="hover:underline">
                    {g.store}
                  </Link>
                ) : (
                  g.store
                )}
                <span className="ml-auto text-xs font-medium text-muted-foreground">{g.delivers ? `Delivery ${g.fee ? formatMoney(g.fee) : "free"}` : "Pickup only"}</span>
              </header>
              <ul className="divide-y">
                {g.lines.map((l) => (
                  <li key={l.productId} className="flex items-center gap-4 p-4">
                    <Img src={l.image} className="size-20 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <Link to="/market/p/$slug" params={{ slug: l.slug }} className="line-clamp-2 font-medium hover:underline">
                        {l.title}
                      </Link>
                      <p className="mt-1 font-bold text-primary">{formatMoney(l.price)}</p>
                      {!l.available && <p className="text-xs font-semibold text-destructive">{l.live ? `Only ${l.live.stock} left` : "No longer available"}</p>}
                    </div>
                    <div className="flex items-center rounded-xl border">
                      <button type="button" onClick={() => cart.setQuantity(l.productId, l.quantity - 1)} className="p-2" aria-label="Decrease">
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                      <button type="button" onClick={() => cart.setQuantity(l.productId, l.quantity + 1)} className="p-2" aria-label="Increase">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button type="button" onClick={() => cart.remove(l.productId)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive" aria-label="Remove">
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-primary">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd className="text-muted-foreground">Chosen at checkout</dd>
            </div>
          </dl>
          <Button asChild size="lg" className="mt-5 h-12 w-full rounded-xl" disabled={!subtotal}>
            <Link to="/market/checkout">Checkout</Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Orders from different stores are placed separately.</p>
        </aside>
      </div>
    </Container>
  );
}
