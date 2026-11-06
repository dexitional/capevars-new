import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, ShieldAlert } from "lucide-react";
import { api } from "#/lib/api-client";
import { canManage } from "#/lib/permissions";
import { MEMBER_TYPES } from "#/lib/labels";
import { AdminPageHeader, Field, Switch, errorToast } from "#/components/admin/ui";
import { ModerationTable, prefetchModeration } from "#/components/admin/moderation-table";
import { DateCell, StatusCell, TitleCell } from "#/components/admin/cells";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog.tsx";

export const Route = createFileRoute("/admin/_admin/members")({
  loader: ({ context }) => prefetchModeration(context.queryClient, "members"),
  component: Members,
});

type Row = Record<string, any>;

function Members() {
  const { admin } = Route.useRouteContext();
  const editable = canManage(admin.role, "members");
  const queryClient = useQueryClient();
  // null = closed, "new" = create, number = edit that member.
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const refresh = () => void queryClient.invalidateQueries({ queryKey: ["admin-mod", "members"] });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Members"
        description="Everyone with a Capevars account. Add or edit members, suspend abusive accounts or verify trusted ones."
        actions={
          editable && (
            <Button onClick={() => setEditing("new")}>
              <Plus /> New member
            </Button>
          )
        }
      />
      <ModerationTable
        entity="members"
        columns={[
          { label: "Member", render: (r) => <TitleCell title={r.title} sub={`@${r.username} · ${r.email}`} image={r.avatar_url} round /> },
          { label: "Type", render: (r) => <span className="text-xs">{MEMBER_TYPES[r.member_type]}{r.institution ? ` · ${r.institution}` : ""}</span> },
          { label: "Sign-in", render: (r) => <span className="text-xs">{Number(r.uses_google) ? "Google" : "Email"}</span> },
          { label: "Store", render: (r) => <span className="text-xs">{r.store_name ?? "—"}</span> },
          { label: "Last seen", render: (r) => <DateCell value={r.last_seen_at ?? r.last_login_at} time /> },
          { label: "Joined", render: (r) => <DateCell value={r.created_at} /> },
          { label: "Status", render: (r) => <StatusCell row={r} /> },
        ]}
        extra={
          editable
            ? (row) => (
                <Button size="icon-xs" variant="ghost" onClick={() => setEditing(row.id as number)} aria-label="Edit" title="Edit">
                  <Pencil />
                </Button>
              )
            : undefined
        }
        onDelete={editable ? setDeleting : undefined}
      />
      {editing !== null && <MemberDialog key={String(editing)} id={editing} onClose={() => setEditing(null)} onSaved={refresh} />}
      {deleting && <DeleteMember member={deleting} onClose={() => setDeleting(null)} onDeleted={refresh} />}
    </div>
  );
}

const BLANK = { fullName: "", username: "", email: "", phone: "", memberType: "public", institution: "", headline: "", isVerified: false, isActive: true, password: "" };

function MemberDialog({ id, onClose, onSaved }: { id: number | "new"; onClose: () => void; onSaved: () => void }) {
  const isNew = id === "new";
  const [form, setForm] = useState<typeof BLANK | null>(isNew ? BLANK : null);
  const set = (patch: Partial<typeof BLANK>) => setForm((f) => (f ? { ...f, ...patch } : f));
  // Editing: load the member, then fill the form once.
  const { data, isError } = useQuery({
    queryKey: ["admin-member", id],
    queryFn: () => api.get<{ member: Row }>(`/admin/members/${id}`),
    enabled: !isNew,
    staleTime: 0,
  });
  if (!isNew && data && !form) {
    const m = data.member;
    setForm({
      fullName: m.full_name ?? "",
      username: m.username ?? "",
      email: m.email ?? "",
      phone: m.phone ?? "",
      memberType: m.member_type ?? "public",
      institution: m.institution ?? "",
      headline: m.headline ?? "",
      isVerified: Boolean(m.is_verified),
      isActive: Boolean(m.is_active),
      password: "",
    });
  }
  const save = useMutation({
    mutationFn: (body: Record<string, unknown>) => (isNew ? api.post("/admin/members", body) : api.patch(`/admin/members/${id}`, body)),
    onSuccess: () => {
      toast.success(isNew ? "Member created." : "Member updated.");
      onSaved();
      onClose();
    },
    onError: errorToast("Couldn't save the member."),
  });
  const member = data?.member;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isNew ? "New member" : "Edit member"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Create an account the member can sign in to with this email and password."
              : member && Number(member.uses_google)
                ? "This member signs in with Google. Setting a password also lets them sign in by email."
                : "Leave the password empty to keep the current one."}
          </DialogDescription>
        </DialogHeader>
        {isError ? (
          <p className="text-sm text-destructive">Couldn't load this member.</p>
        ) : !form ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form
            id="member-form"
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const { password, ...rest } = form;
              save.mutate({ ...rest, ...(password ? { password } : {}) });
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input value={form.fullName} onChange={(e) => set({ fullName: e.target.value })} required />
              </Field>
              <Field label="Username" hint="Letters, numbers, dots or underscores.">
                <Input value={form.username} onChange={(e) => set({ username: e.target.value.toLowerCase() })} pattern="[a-z0-9_.]{3,40}" required />
              </Field>
              <Field label="Email">
                <Input type="email" value={form.email} onChange={(e) => set({ email: e.target.value })} required />
              </Field>
              <Field label="Phone" hint="Optional">
                <Input type="tel" value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
              </Field>
              <Field label="Member type">
                <select
                  value={form.memberType}
                  onChange={(e) => set({ memberType: e.target.value })}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs"
                >
                  {Object.entries(MEMBER_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Institution" hint="Optional">
                <Input value={form.institution} onChange={(e) => set({ institution: e.target.value })} placeholder="e.g. UCC" />
              </Field>
            </div>
            <Field label="Headline" hint="Optional, shown on their profile.">
              <Input value={form.headline} onChange={(e) => set({ headline: e.target.value })} maxLength={160} />
            </Field>
            <Field label={isNew ? "Password" : "Set a new password"} hint="At least 8 characters.">
              <Input type="text" value={form.password} onChange={(e) => set({ password: e.target.value })} minLength={8} required={isNew} autoComplete="new-password" />
            </Field>
            <div className="grid gap-3 rounded-lg border p-3">
              <Switch checked={form.isVerified} onChange={(v) => set({ isVerified: v })} label="Verified" description="Shows the verified badge on their profile and listings." />
              <Switch checked={form.isActive} onChange={(v) => set({ isActive: v })} label="Active" description="Suspended members can't sign in." />
            </div>
          </form>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="member-form" disabled={!form || save.isPending}>
            {save.isPending && <Loader2 className="animate-spin" />} {isNew ? "Create member" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Shows everything that would go before anything does, with what belongs to
// other people set apart, and asks for the username to confirm.
function DeleteMember({ member, onClose, onDeleted }: { member: Row; onClose: () => void; onDeleted: () => void }) {
  const [typed, setTyped] = useState("");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-member-delete-preview", member.id],
    queryFn: () =>
      api.get<{
        own: Array<{ module: string; items: Array<{ label: string; count: number }> }>;
        others: Array<{ module: string; label: string; count: number }>;
        credits: number;
      }>(`/admin/members/${member.id}/delete-preview`),
    staleTime: 0,
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/admin/members/${member.id}?confirm=${encodeURIComponent(member.username as string)}`),
    onSuccess: () => {
      toast.success("Member and their data deleted.");
      onDeleted();
      onClose();
    },
    onError: errorToast("Couldn't delete the member."),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-destructive" /> Delete {member.title}?
          </DialogTitle>
          <DialogDescription>This permanently removes the account and everything below, from every module. It can't be undone. Consider suspending them if you may need any of it later.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : isError || !data ? (
          <p className="text-sm text-destructive">Couldn't work out what this member has. Nothing was deleted.</p>
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
            {data.credits > 0 && <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">Their {data.credits.toLocaleString()} unused broadcast credits are lost.</p>}
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
              <p className="text-muted-foreground">They have no other data, just the account.</p>
            )}
            <Field label={`Type ${member.username} to confirm`}>
              <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" aria-label="Type the username to confirm" />
            </Field>
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" disabled={!data || typed !== member.username || remove.isPending} onClick={() => remove.mutate()}>
            {remove.isPending && <Loader2 className="animate-spin" />} Delete everything
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
