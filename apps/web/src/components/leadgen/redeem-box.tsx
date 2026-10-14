import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Ticket } from "lucide-react";
import { api } from "#/lib/api-client";
import { useRequireMember } from "#/hooks/useMember";

// Redeems a credit voucher (adds broadcast credits) or a list share code
// (gives access to a private lead list).
export function RedeemBox({ dark }: { dark?: boolean }) {
  const [code, setCode] = useState("");
  const requireMember = useRequireMember();
  const queryClient = useQueryClient();
  const redeem = useMutation({
    mutationFn: () => api.post<{ kind: "credits" | "list"; credits?: number; title?: string; voucher?: string }>("/leadgen/redeem", { code }),
    onSuccess: (r) => {
      setCode("");
      toast.success(r.kind === "credits" ? `${r.credits} credits added to your wallet` : `You now have “${r.title}” (voucher ${r.voucher})`);
      void queryClient.invalidateQueries({ queryKey: ["leadgen"] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (code.trim()) requireMember(() => redeem.mutate());
      }}
      className={dark ? "flex max-w-md items-center gap-2 rounded-2xl bg-white/10 p-1.5 ring-1 ring-white/20" : "flex items-center gap-2 rounded-2xl border bg-white p-1.5"}
    >
      <Ticket className={dark ? "ml-2 size-5 text-brand-cream" : "ml-2 size-5 text-primary"} />
      <input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Redeem a voucher or share code"
        className={dark ? "min-w-0 flex-1 bg-transparent py-2 text-white placeholder:text-white/50 outline-none" : "min-w-0 flex-1 bg-transparent py-2 outline-none"}
      />
      <button disabled={redeem.isPending} className="rounded-xl bg-brand-cream px-4 py-2 text-sm font-bold text-primary">
        Redeem
      </button>
    </form>
  );
}
