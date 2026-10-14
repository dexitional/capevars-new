import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, ShieldAlert, Store, XCircle } from "lucide-react";
import { api } from "#/lib/api-client";
import { useSession } from "#/hooks/useMember";
import { Loading } from "#/components/site/kit";
import { StoreForm } from "#/components/seller/forms";
import { sellerStoreQuery } from "#/components/seller/queries";

export const Route = createFileRoute("/_site/seller/apply")({ component: ApplyPage });

function ApplyPage() {
  const { data, refetch } = useQuery(sellerStoreQuery);
  const { refresh } = useSession();
  const { data: settings } = useQuery({ queryKey: ["public-settings"], queryFn: () => api.get<{ marketplace: { sellerTerms: string } }>("/public/settings") });
  if (!data) return <Loading />;
  const store = data.store;
  const onSaved = async () => {
    await refetch();
    await refresh();
  };
  return (
    <div className="space-y-6">
      <div className="hero-navy relative overflow-hidden rounded-3xl p-8 text-white">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="relative">
          <Store className="size-10 text-brand-cream" />
          <h1 className="mt-4 text-3xl font-black">{store ? "Your store" : "Open your store on Capevars"}</h1>
          <p className="mt-2 max-w-xl text-white/70">One store covers products, food, event tickets, bus trips & rentals and exhibitions. Applications are reviewed within 1–2 working days.</p>
        </div>
      </div>
      {store?.status === "pending" && (
        <p className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
          <Clock className="size-5" /> Your application is being reviewed. We'll notify you as soon as it's approved — you can still update details below.
        </p>
      )}
      {store?.status === "rejected" && (
        <p className="flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <XCircle className="size-5 shrink-0" /> Your application needs changes{store.status_reason ? `: ${store.status_reason}` : "."} Update the details and save to resubmit.
        </p>
      )}
      {store?.status === "suspended" && (
        <p className="flex items-start gap-3 rounded-2xl bg-destructive/10 p-4 text-sm text-destructive">
          <ShieldAlert className="size-5 shrink-0" /> Your store is suspended{store.status_reason ? `: ${store.status_reason}` : "."} Contact support to appeal.
        </p>
      )}
      {store?.status === "approved" && (
        <p className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">
          Your store is approved. <Link to="/seller" className="font-semibold underline">Go to the Seller Center</Link>
        </p>
      )}
      <StoreForm store={store} onSaved={() => void onSaved()} terms={settings?.marketplace.sellerTerms} />
    </div>
  );
}
