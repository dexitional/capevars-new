// Confirms deleting something that takes other records with it: lists what would
// go first, with what belongs to other people set apart, and asks for its name.
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";
import { api } from "#/lib/api-client";
import { Field, errorToast } from "#/components/admin/ui";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";

interface Preview {
  own: Array<{ module: string; items: Array<{ label: string; count: number }> }>;
  others: Array<{ module: string; label: string; count: number }>;
  credits?: number;
  kept?: number;
}

export function PurgeDialog({
  title,
  description,
  url,
  confirmWord,
  nothingElse,
  success,
  onClose,
  onDeleted,
}: {
  title: string;
  description: string;
  /** The record's admin API path: DELETE here, and GET {url}/delete-preview. */
  url: string;
  /** What the admin has to type. */
  confirmWord: string;
  nothingElse: string;
  success: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [typed, setTyped] = useState("");
  const { data, isLoading, isError } = useQuery({ queryKey: ["admin-purge-preview", url], queryFn: () => api.get<Preview>(`${url}/delete-preview`), staleTime: 0 });
  const remove = useMutation({
    mutationFn: () => api.delete(`${url}?confirm=${encodeURIComponent(confirmWord)}`),
    onSuccess: () => {
      toast.success(success);
      onDeleted();
      onClose();
    },
    onError: errorToast("Couldn't delete it."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-destructive" /> {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">Couldn't work out what would be removed. Nothing was deleted.</p>
        ) : (
          <div className="min-w-0 space-y-4 text-sm">
            {data.others.length > 0 && (
              <section className="rounded-lg border border-destructive/40 bg-destructive/5 p-3">
                <h3 className="font-bold text-destructive">Also removed, belonging to other people</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">These people aren't told and nothing is refunded automatically.</p>
                <ul className="mt-2 space-y-1">
                  {data.others.map((o) => (
                    <li key={o.label} className="flex justify-between gap-3">
                      <span>{o.label}</span>
                      <span className="font-semibold tabular-nums">{o.count.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {Boolean(data.credits) && <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">Their {data.credits?.toLocaleString()} unused broadcast credits are lost.</p>}
            {data.own.length > 0 ? (
              <section className="grid gap-3 sm:grid-cols-2">
                {data.own.map((g) => (
                  <div key={g.module}>
                    <h3 className="font-bold text-primary">{g.module}</h3>
                    <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {g.items.map((i) => (
                        <li key={i.label} className="flex justify-between gap-3">
                          <span>{i.label}</span>
                          <span className="tabular-nums">{i.count.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            ) : (
              <p className="text-muted-foreground">{nothingElse}</p>
            )}
            {Boolean(data.kept) && (
              <p className="text-xs text-muted-foreground">
                {data.kept?.toLocaleString()} payment record{data.kept === 1 ? "" : "s"} and donation{data.kept === 1 ? "" : "s"} stay for the books, without their name or email.
              </p>
            )}
            <Field label={`Type ${confirmWord} to confirm`}>
              <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" aria-label="Type to confirm" />
            </Field>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!data || typed !== confirmWord || remove.isPending} onClick={() => remove.mutate()}>
            {remove.isPending && <Loader2 className="animate-spin" />} Delete everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
