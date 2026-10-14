import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "#/hooks/useMember";
import { Loading } from "#/components/site/kit";
import { StoreForm } from "#/components/seller/forms";
import { sellerStoreQuery } from "#/components/seller/queries";

export const Route = createFileRoute("/_site/seller/settings")({ component: StoreSettings });

function StoreSettings() {
  const { data, refetch } = useQuery(sellerStoreQuery);
  const { refresh } = useSession();
  if (!data) return <Loading />;
  return (
    <div>
      <h1 className="mb-5 text-2xl font-black text-primary">Store settings</h1>
      <StoreForm store={data.store} onSaved={() => void refetch().then(refresh)} />
    </div>
  );
}
