import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { api } from "#/lib/api-client";
import { SheetImport } from "#/components/leadgen/sheet-import";
import type { SheetContact } from "#/components/leadgen/sheet-import";
import { EMPTY_LIST, ListForm, toPayload } from "#/components/leadgen/list-form";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/_site/leadgen/portal/leads/new")({ component: NewList });

function NewList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: home } = useQuery({ queryKey: ["leadgen", "home"], queryFn: () => api.get<{ settings: { terms: string } }>("/leadgen/home") });
  const [contacts, setContacts] = useState<{ name: string; items: Array<SheetContact> } | null>(null);
  const [form, setForm] = useState(EMPTY_LIST);
  const save = useMutation({
    mutationFn: (submit: boolean) =>
      api.post<{ id: number; added: number; invalid: number; duplicates: number }>("/leadgen/portal/lists", { ...toPayload(form), contacts: contacts?.items ?? [], submit }),
    onSuccess: (r, submit) => {
      toast.success(`${r.added.toLocaleString()} contacts saved${r.invalid ? ` · ${r.invalid} invalid skipped` : ""}${r.duplicates ? ` · ${r.duplicates} duplicates skipped` : ""}${submit ? " · sent for review" : ""}`);
      void queryClient.invalidateQueries({ queryKey: ["leadgen"] });
      void navigate({ to: "/leadgen/portal/leads/$id", params: { id: String(r.id) } });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-primary">New lead list</h1>
        <p className="text-sm text-muted-foreground">Upload contacts, describe the list, then keep it private for your own broadcasts or publish it to share or sell.</p>
      </div>
      <section className="rounded-2xl border bg-white p-5">
        <p className="mb-3 font-bold text-primary">1. Contacts</p>
        {contacts ? (
          <div className="flex items-center justify-between rounded-xl bg-muted p-3 text-sm">
            <span>
              <strong>{contacts.items.length.toLocaleString()}</strong> contacts from {contacts.name}
            </span>
            <button type="button" onClick={() => setContacts(null)} className="text-xs font-semibold text-destructive">
              Replace
            </button>
          </div>
        ) : (
          <SheetImport onContacts={(items, name) => setContacts({ items, name })} />
        )}
      </section>
      <section className="rounded-2xl border bg-white p-5">
        <p className="mb-4 font-bold text-primary">2. About the list</p>
        <ListForm value={form} onChange={setForm} terms={home?.settings.terms} />
      </section>
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" disabled={!contacts || !form.title || save.isPending} onClick={() => save.mutate(false)}>
          {save.isPending && <Loader2 className="animate-spin" />} Save as private list
        </Button>
        <Button disabled={!contacts || !form.title || !form.consentConfirmed || save.isPending} onClick={() => save.mutate(true)}>
          Save & submit for publishing
        </Button>
      </div>
    </div>
  );
}
