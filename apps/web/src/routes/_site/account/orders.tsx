import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { MessageCircle, Package, Phone, Star } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { ORDER_STATUSES } from "#/lib/labels";
import { EmptyState, Img, Loading, StarInput, StatusBadge } from "#/components/site/kit";
import { PaymentBanner } from "#/components/site/payment-banner";
import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "#/components/ui/dialog";

export const Route = createFileRoute("/_site/account/orders")({
  validateSearch: z.object({ payment: z.string().optional().catch(undefined) }),
  component: OrdersPage,
});

type Row = Record<string, any>;
const STEPS = ["pending", "confirmed", "shipped", "delivered"];

function OrdersPage() {
  const { payment } = Route.useSearch();
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["my-orders"], queryFn: () => api.get<{ orders: Array<Row> }>("/market/orders") });
  const [review, setReview] = useState<Row | null>(null);
  const cancel = useMutation({
    mutationFn: (id: number) => api.post(`/market/orders/${id}/cancel`),
    onSuccess: () => {
      toast.success("Order cancelled");
      void queryClient.invalidateQueries({ queryKey: ["my-orders"] });
    },
    onError: (e) => toast.error(e.message),
  });
  const pay = useMutation({
    mutationFn: (id: number) => api.post<{ authorizationUrl: string }>(`/market/orders/${id}/pay`),
    onSuccess: (r) => (window.location.href = r.authorizationUrl),
    onError: (e) => toast.error(e.message),
  });
  if (!data) return <Loading />;
  return (
    <div>
      <PaymentBanner status={payment} />
      {data.orders.length === 0 ? (
        <EmptyState icon={Package} title="No orders yet" text="When you buy from the Marketplace or order food, your orders appear here." action={<Link to="/market" className="font-semibold text-primary underline">Start shopping</Link>} />
      ) : (
        <div className="space-y-4">
          {data.orders.map((o) => {
            const step = o.status === "ready" ? 2 : STEPS.indexOf(o.status);
            return (
              <article key={o.id} className="overflow-hidden rounded-2xl border bg-white">
                <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-muted/50 px-5 py-3">
                  <div>
                    <p className="font-bold text-primary">
                      Order {o.order_no} ·{" "}
                      <Link to="/market/store/$slug" params={{ slug: o.store_slug }} className="hover:underline">
                        {o.store_name}
                      </Link>
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(o.created_at)} · {o.fulfilment === "pickup" ? "Pickup" : "Delivery"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={o.status} label={ORDER_STATUSES[o.status]} />
                    <StatusBadge status={o.payment_status === "paid" ? "paid" : "pending"} label={o.payment_status === "paid" ? "Paid" : o.payment_method === "cash" ? "Pay on delivery" : "Unpaid"} />
                  </div>
                </header>
                {o.status !== "cancelled" && (
                  <ol className="flex items-center gap-2 px-5 pt-4">
                    {STEPS.map((s, i) => (
                      <li key={s} className="flex flex-1 items-center gap-2">
                        <span className={cn("size-2.5 shrink-0 rounded-full", i <= step ? "bg-success" : "bg-border")} />
                        <span className={cn("text-xs", i <= step ? "font-semibold text-foreground" : "text-muted-foreground")}>{ORDER_STATUSES[s === "shipped" && o.fulfilment === "pickup" ? "ready" : s]}</span>
                        {i < STEPS.length - 1 && <span className={cn("h-0.5 flex-1 rounded", i < step ? "bg-success" : "bg-border")} />}
                      </li>
                    ))}
                  </ol>
                )}
                <ul className="divide-y px-5">
                  {o.items.map((i: Row) => (
                    <li key={i.id} className="flex items-center gap-3 py-3">
                      <Img src={i.image_url} className="size-14 shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        {i.slug ? (
                          <Link to="/market/p/$slug" params={{ slug: i.slug }} className="font-medium hover:underline">
                            {i.title}
                          </Link>
                        ) : (
                          <span className="font-medium">{i.title}</span>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {i.quantity} × {formatMoney(i.unit_price)}
                        </p>
                      </div>
                      {o.status === "delivered" && i.product_id && (
                        <Button size="sm" variant="outline" onClick={() => setReview(i)}>
                          <Star /> Review
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {o.seller_note && <p className="mx-5 mb-3 rounded-xl bg-accent px-3 py-2 text-sm">Seller: {o.seller_note}</p>}
                <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3">
                  <div className="flex gap-2">
                    {o.store_whatsapp && (
                      <a href={`https://wa.me/${String(o.store_whatsapp).replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, about my order ${o.order_no}`)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">
                        <MessageCircle className="size-4" /> WhatsApp
                      </a>
                    )}
                    {o.store_phone && (
                      <a href={`tel:${o.store_phone}`} className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">
                        <Phone className="size-4" /> Call
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      Total <strong className="text-base text-primary">{formatMoney(o.total)}</strong>
                    </span>
                    {o.payment_method === "online" && o.payment_status !== "paid" && o.status !== "cancelled" && (
                      <Button size="sm" onClick={() => pay.mutate(o.id)} disabled={pay.isPending}>
                        Pay now
                      </Button>
                    )}
                    {o.status === "pending" && o.payment_status !== "paid" && (
                      <Button size="sm" variant="outline" onClick={() => confirm("Cancel this order?") && cancel.mutate(o.id)}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      )}
      <ReviewDialog item={review} onClose={() => setReview(null)} />
    </div>
  );
}

function ReviewDialog({ item, onClose }: { item: Row | null; onClose: () => void }) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const save = useMutation({
    mutationFn: () => api.post(`/market/products/${item!.product_id}/reviews`, { rating, body }),
    onSuccess: () => {
      toast.success("Thanks for your review!");
      onClose();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <Dialog open={Boolean(item)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {item?.title}</DialogTitle>
        </DialogHeader>
        <StarInput value={rating} onChange={setRating} />
        <Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What did you like or dislike?" />
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Submit review
        </Button>
      </DialogContent>
    </Dialog>
  );
}
