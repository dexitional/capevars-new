import { useState } from "react";
import { Link, createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Banknote, CheckCircle2, CreditCard, Loader2, MapPin, Smartphone, Store } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatMoney } from "#/lib/money";
import { cart, useCart } from "#/hooks/useCart";
import { useMember } from "#/hooks/useMember";
import { Container, EmptyState } from "#/components/site/kit";
import { Field } from "#/components/admin/ui";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Button } from "#/components/ui/button";
import { groupByStore, useCartQuote } from "#/components/market/cart-quote";

export const Route = createFileRoute("/_site/market/checkout")({
  beforeLoad: ({ context, location }) => {
    if (!context.member) throw redirect({ to: "/login", search: { next: location.href } });
  },
  head: () => ({ meta: [{ title: "Checkout | Capevars" }] }),
  component: CheckoutPage,
});

type Method = "online" | "cash" | "momo_direct";

function CheckoutPage() {
  const member = useMember()!;
  const navigate = useNavigate();
  const { lines } = useCart();
  const { data: quote } = useCartQuote(lines);
  const { data: payConfig } = useQuery({ queryKey: ["pay-config"], queryFn: () => api.get<{ online: boolean }>("/payments/config") });
  const groups = groupByStore(lines, quote?.items).map((g) => ({ ...g, lines: g.lines.filter((l) => l.available) })).filter((g) => g.lines.length);
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const [method, setMethod] = useState<Method>("cash");
  const [form, setForm] = useState({ contactName: member.fullName, contactPhone: "", deliveryAddress: "", notes: "" });
  const [done, setDone] = useState<Array<{ order_no: string; store: string; total: number }> | null>(null);
  const cantDeliver = fulfilment === "delivery" ? groups.filter((g) => !g.delivers) : [];
  const subtotal = groups.reduce((n, g) => n + g.lines.reduce((m, l) => m + l.price * l.quantity, 0), 0);
  const delivery = fulfilment === "delivery" ? groups.reduce((n, g) => n + (g.delivers ? g.fee : 0), 0) : 0;

  const place = useMutation({
    mutationFn: () =>
      api.post<{ orders: Array<{ order_no: string; store: string; total: number }>; authorizationUrl: string | null }>("/market/checkout", {
        items: groups.flatMap((g) => g.lines.map((l) => ({ productId: l.productId, quantity: l.quantity }))),
        fulfilment,
        paymentMethod: method,
        ...form,
      }),
    onSuccess: (r) => {
      cart.removeMany(groups.flatMap((g) => g.lines.map((l) => l.productId)));
      if (r.authorizationUrl) {
        window.location.href = r.authorizationUrl;
        return;
      }
      setDone(r.orders);
    },
    onError: (e) => toast.error(e.message),
  });

  if (done) {
    return (
      <Container className="py-14">
        <div className="mx-auto max-w-lg rounded-3xl border bg-white p-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-success" />
          <h1 className="mt-4 text-2xl font-black text-primary">Order placed!</h1>
          <p className="mt-2 text-muted-foreground">The seller has been notified and will confirm shortly.</p>
          <ul className="mt-6 divide-y rounded-2xl border text-left text-sm">
            {done.map((o) => (
              <li key={o.order_no} className="flex justify-between p-3">
                <span>
                  <strong>{o.order_no}</strong> · {o.store}
                </span>
                <span className="font-bold">{formatMoney(o.total)}</span>
              </li>
            ))}
          </ul>
          {method === "momo_direct" && <p className="mt-4 rounded-xl bg-accent p-3 text-sm">Send Mobile Money to the seller (see your order page for contacts). They'll mark it paid.</p>}
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => void navigate({ to: "/account/orders" })}>Track my orders</Button>
            <Button variant="outline" onClick={() => void navigate({ to: "/market" })}>
              Keep shopping
            </Button>
          </div>
        </div>
      </Container>
    );
  }
  if (!lines.length) {
    return (
      <Container className="py-12">
        <EmptyState title="Nothing to check out" action={<Link to="/market" className="font-semibold text-primary underline">Go shopping</Link>} />
      </Container>
    );
  }
  const methods: Array<{ key: Method; label: string; text: string; icon: typeof Banknote; show: boolean }> = [
    { key: "online", label: "Pay online", text: "Card or Mobile Money via Paystack", icon: CreditCard, show: Boolean(payConfig?.online) },
    { key: "cash", label: "Pay on delivery / pickup", text: "Cash or MoMo when you receive it", icon: Banknote, show: true },
    { key: "momo_direct", label: "MoMo to seller", text: "Send to the seller's number; they confirm", icon: Smartphone, show: true },
  ];
  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-black text-primary">Checkout</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          place.mutate();
        }}
        className="grid gap-6 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-5">
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="mb-4 font-bold text-primary">1. How do you want it?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["delivery", "pickup"] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFulfilment(f)} className={cn("flex items-center gap-3 rounded-xl border-2 p-4 text-left", fulfilment === f ? "border-primary bg-accent" : "border-border")}>
                  {f === "delivery" ? <MapPin className="size-5 text-primary" /> : <Store className="size-5 text-primary" />}
                  <span>
                    <span className="block font-semibold capitalize">{f}</span>
                    <span className="block text-xs text-muted-foreground">{f === "delivery" ? "To your hostel, hall or address" : "Collect from the seller"}</span>
                  </span>
                </button>
              ))}
            </div>
            {cantDeliver.length > 0 && (
              <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{cantDeliver.map((g) => g.store).join(", ")} only offer pickup. Choose pickup or remove their items.</p>
            )}
          </section>
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="mb-4 font-bold text-primary">2. Contact {fulfilment === "delivery" ? "& delivery" : ""}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
              </Field>
              <Field label="Phone number">
                <Input type="tel" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} required placeholder="024 000 0000" />
              </Field>
              {fulfilment === "delivery" && (
                <Field label="Delivery address" className="sm:col-span-2" hint="Hostel/hall name, room, landmark.">
                  <Textarea rows={2} value={form.deliveryAddress} onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })} required />
                </Field>
              )}
              <Field label="Note to seller (optional)" className="sm:col-span-2">
                <Input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </Field>
            </div>
          </section>
          <section className="rounded-2xl border bg-white p-5">
            <h2 className="mb-4 font-bold text-primary">3. Payment</h2>
            <div className="grid gap-3">
              {methods
                .filter((m) => m.show)
                .map((m) => (
                  <button key={m.key} type="button" onClick={() => setMethod(m.key)} className={cn("flex items-center gap-3 rounded-xl border-2 p-4 text-left", method === m.key ? "border-primary bg-accent" : "border-border")}>
                    <m.icon className="size-5 text-primary" />
                    <span>
                      <span className="block font-semibold">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.text}</span>
                    </span>
                  </button>
                ))}
            </div>
          </section>
        </div>
        <aside className="h-fit rounded-2xl border bg-white p-5 lg:sticky lg:top-24">
          <h2 className="font-bold text-primary">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {groups.map((g) => (
              <li key={g.store}>
                <p className="font-semibold">{g.store}</p>
                {g.lines.map((l) => (
                  <p key={l.productId} className="flex justify-between text-muted-foreground">
                    <span className="truncate pr-2">
                      {l.quantity} × {l.title}
                    </span>
                    <span>{formatMoney(l.price * l.quantity)}</span>
                  </p>
                ))}
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatMoney(delivery)}</dd>
            </div>
            <div className="flex justify-between pt-2 text-base font-black text-primary">
              <dt>Total</dt>
              <dd>{formatMoney(subtotal + delivery)}</dd>
            </div>
          </dl>
          <Button type="submit" size="lg" className="mt-5 h-12 w-full rounded-xl" disabled={place.isPending || cantDeliver.length > 0 || !groups.length}>
            {place.isPending && <Loader2 className="animate-spin" />} {method === "online" ? "Pay & place order" : "Place order"}
          </Button>
        </aside>
      </form>
    </Container>
  );
}
