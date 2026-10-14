import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, MessageCircle, Package, Phone } from "lucide-react";
import { api } from "#/lib/api-client";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { ORDER_STATUSES } from "#/lib/labels";
import { Avatar, Chip, EmptyState, Img, Loading, StatusBadge } from "#/components/site/kit";
import { Button } from "#/components/ui/button";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/seller/orders")({ component: SellerOrders });

const NEXT: Record<string, Array<[string, string]>> = {
  pending: [["confirmed", "Confirm order"]],
  confirmed: [["ready", "Ready for pickup"], ["shipped", "Out for delivery"]],
  ready: [["delivered", "Mark collected"]],
  shipped: [["delivered", "Mark delivered"]],
};

function SellerOrders() {
  const [status, setStatus] = useState("all");
  const { data, refetch } = useQuery({ queryKey: ["seller", "orders", status], queryFn: () => api.get<{ orders: Array<Row> }>("/seller/orders", { status }), refetchInterval: 60_000 });
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Record<string, unknown> }) => api.patch(`/seller/orders/${id}`, body),
    onSuccess: () => {
      toast.success("Order updated — the buyer has been notified");
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div>
      <h1 className="mb-4 text-2xl font-black text-primary">Orders</h1>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {["all", "pending", "confirmed", "ready", "shipped", "delivered", "cancelled"].map((s) => (
          <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
            {s === "all" ? "All" : ORDER_STATUSES[s]}
          </Chip>
        ))}
      </div>
      {!data ? (
        <Loading />
      ) : data.orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders here" />
      ) : (
        <div className="space-y-4">
          {data.orders.map((o) => (
            <article key={o.id} className="rounded-2xl border bg-white">
              <header className="flex flex-wrap items-center gap-3 border-b px-5 py-3">
                <Avatar src={o.buyer_avatar} name={o.buyer_name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary">
                    {o.order_no} · {o.contact_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(o.created_at)} · {o.fulfilment === "pickup" ? "Pickup" : "Delivery"} · {o.payment_method === "cash" ? "Pay on delivery" : o.payment_method === "online" ? "Online" : "MoMo to you"}
                  </p>
                </div>
                <StatusBadge status={o.status} label={ORDER_STATUSES[o.status]} />
                <StatusBadge status={o.payment_status === "paid" ? "paid" : "pending"} label={o.payment_status === "paid" ? "Paid" : "Unpaid"} />
              </header>
              <div className="grid gap-4 p-5 md:grid-cols-[1fr_260px]">
                <ul className="space-y-2">
                  {o.items.map((i: Row) => (
                    <li key={i.id} className="flex items-center gap-3 text-sm">
                      <Img src={i.image_url} className="size-10 rounded-lg" />
                      <span className="flex-1">
                        {i.quantity} × {i.title}
                      </span>
                      <span className="font-semibold">{formatMoney(Number(i.unit_price) * i.quantity)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t pt-2 text-sm">
                    <span className="text-muted-foreground">Delivery {formatMoney(o.delivery_fee)}</span>
                    <strong className="text-primary">Total {formatMoney(o.total)}</strong>
                  </li>
                  {o.notes && <li className="rounded-lg bg-muted p-2 text-sm">Buyer note: {o.notes}</li>}
                </ul>
                <div className="space-y-2 text-sm">
                  <a href={`tel:${o.contact_phone}`} className="flex items-center gap-2 hover:underline">
                    <Phone className="size-4" /> {o.contact_phone}
                  </a>
                  <a href={`https://wa.me/${String(o.contact_phone).replace(/\D/g, "").replace(/^0/, "233")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                    <MessageCircle className="size-4" /> WhatsApp buyer
                  </a>
                  {o.delivery_address && (
                    <p className="flex gap-2">
                      <MapPin className="size-4 shrink-0" /> {o.delivery_address}
                    </p>
                  )}
                </div>
              </div>
              {o.status !== "cancelled" && o.status !== "delivered" && (
                <footer className="flex flex-wrap gap-2 border-t px-5 py-3">
                  {(NEXT[o.status] ?? []).map(([s, label]) => (
                    <Button key={s} size="sm" onClick={() => update.mutate({ id: o.id, body: { status: s } })}>
                      {label}
                    </Button>
                  ))}
                  {o.payment_status !== "paid" && (
                    <Button size="sm" variant="outline" onClick={() => confirm("Confirm you've received payment for this order?") && update.mutate({ id: o.id, body: { markPaid: true } })}>
                      Mark as paid
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      const note = prompt("Message to the buyer (optional)", o.seller_note ?? "");
                      if (note !== null) update.mutate({ id: o.id, body: { sellerNote: note } });
                    }}
                  >
                    Add note
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto text-destructive"
                    onClick={() => {
                      const reason = prompt("Why are you cancelling? (shared with the buyer)");
                      if (reason !== null) update.mutate({ id: o.id, body: { status: "cancelled", sellerNote: reason } });
                    }}
                  >
                    Cancel order
                  </Button>
                </footer>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
