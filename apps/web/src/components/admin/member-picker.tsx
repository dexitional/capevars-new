// Picks whose name a new listing goes under, when an admin adds one on behalf of a member.
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Loader2, Store } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { SearchInput } from "#/components/admin/ui";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

export interface PickedMember {
  id: number;
  name: string;
  phone: string | null;
  email: string;
}
type Found = { id: number; full_name: string; username: string; email: string; phone: string | null; is_active: number; store_name: string | null; store_status: string | null };

export function MemberPicker({
  title,
  description,
  sellersOnly = false,
  needsStore = false,
  storeless = false,
  onPick,
  onClose,
}: {
  title: string;
  description: string;
  /** Only members who already have a store. */
  sellersOnly?: boolean;
  /** The listing needs an approved store; a member without one gets one created. */
  needsStore?: boolean;
  /** Opening a store: members who already have one can't be picked. */
  storeless?: boolean;
  onPick: (member: PickedMember) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [term, setTerm] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setTerm(q.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [q]);
  const { data, isFetching } = useQuery({
    queryKey: ["admin-member-lookup", term, sellersOnly],
    queryFn: () => api.get<{ items: Array<Found> }>("/admin/members/lookup", { q: term || undefined, sellers: sellersOnly ? 1 : undefined }),
    placeholderData: keepPreviousData,
  });
  const blocked = (m: Found) => {
    if (!m.is_active) return "Suspended";
    if (storeless && m.store_name) return "Has a store";
    if (needsStore && m.store_name && m.store_status !== "approved") return `Store ${m.store_status}`;
    return null;
  };
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <SearchInput value={q} onChange={setQ} placeholder={sellersOnly ? "Search a seller, store or email…" : "Search a name, username or email…"} className="w-full" />
        <div className={cn("max-h-80 min-h-24 divide-y overflow-y-auto rounded-lg border transition-opacity", isFetching && "opacity-60")}>
          {!data ? (
            <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </p>
          ) : data.items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{sellersOnly ? "No sellers match." : "No members match."}</p>
          ) : (
            data.items.map((m) => {
              const reason = blocked(m);
              return (
                <button
                  key={m.id}
                  type="button"
                  disabled={Boolean(reason)}
                  onClick={() => onPick({ id: m.id, name: m.store_name ?? m.full_name, phone: m.phone, email: m.email })}
                  className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-primary">{m.full_name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      @{m.username} · {m.email}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    {reason ?? (m.store_name ? <><Store className="size-3.5" /> {m.store_name}</> : needsStore ? "New store" : null)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
