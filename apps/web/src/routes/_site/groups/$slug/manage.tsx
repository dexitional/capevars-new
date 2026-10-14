import { useState } from "react";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, FileText, HandHeart, Pencil, Plus, Settings, Trash2, Users, X } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { useMember } from "#/hooks/useMember";
import { Avatar, ImageUpload, Loading, StatusBadge } from "#/components/site/kit";
import { groupQuery, useGroup } from "#/components/groups/use-group";
import { GroupForm, groupValues } from "#/components/groups/group-form";
import { RichTextEditor } from "#/components/admin/rich-text-editor";
import { Field, Switch } from "#/components/admin/ui";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/manage")({
  beforeLoad: async ({ context, params }) => {
    const g = await context.queryClient.ensureQueryData(groupQuery(params.slug));
    if (!g.canManage) throw redirect({ to: "/groups/$slug", params });
  },
  component: Manage,
});

type Tab = "members" | "settings" | "donations" | "pages";

function Manage() {
  const { slug } = Route.useParams();
  const { data } = useGroup(slug);
  const [tab, setTab] = useState<Tab>("members");
  if (!data) return <Loading />;
  const tabs: Array<[Tab, string, typeof Users]> = [
    ["members", "Members", Users],
    ["settings", "Settings", Settings],
    ["donations", "Donations", HandHeart],
    ["pages", "Pages", FileText],
  ];
  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <nav className="flex gap-1 overflow-x-auto lg:flex-col">
        {tabs.map(([k, label, Icon]) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold", tab === k ? "bg-sys-groups text-white" : "hover:bg-white")}>
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </nav>
      <div>
        {tab === "members" && <MembersAdmin groupId={data.group.id} myRole={data.membership?.role ?? "member"} />}
        {tab === "settings" && <SettingsAdmin group={data.group} slug={slug} />}
        {tab === "donations" && <DonationsAdmin groupId={data.group.id} />}
        {tab === "pages" && <PagesAdmin groupId={data.group.id} slug={slug} />}
      </div>
    </div>
  );
}

function MembersAdmin({ groupId, myRole }: { groupId: number; myRole: string }) {
  const me = useMember();
  const [status, setStatus] = useState<"active" | "pending" | "banned">("pending");
  const { data, refetch } = useQuery({ queryKey: ["group-admin-members", groupId, status], queryFn: () => api.get<{ items: Array<Row> }>(`/groups/${groupId}/members`, { status }) });
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: Record<string, unknown> }) => api.patch(`/groups/${groupId}/members/${userId}`, body),
    onSuccess: () => {
      void refetch();
      void queryClient.invalidateQueries({ queryKey: ["group"] });
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({ mutationFn: (userId: number) => api.delete(`/groups/${groupId}/members/${userId}`), onSuccess: () => void refetch(), onError: (e) => toast.error(e.message) });
  return (
    <section className="rounded-2xl border bg-white">
      <div className="flex gap-2 border-b p-4">
        {(["pending", "active", "banned"] as const).map((s) => (
          <button key={s} type="button" onClick={() => setStatus(s)} className={cn("rounded-full px-3 py-1 text-sm font-semibold capitalize", status === s ? "bg-primary text-white" : "bg-muted")}>
            {s === "pending" ? "Requests" : s}
          </button>
        ))}
      </div>
      {!data ? (
        <Loading />
      ) : data.items.length === 0 ? (
        <p className="p-6 text-sm text-muted-foreground">Nobody here.</p>
      ) : (
        <ul className="divide-y">
          {data.items.map((m) => (
            <li key={m.user_id} className="flex flex-wrap items-center gap-3 p-4">
              <Avatar src={m.user_avatar} name={m.user_name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{m.user_name}</p>
                <p className="text-xs text-muted-foreground">
                  @{m.user_username} · joined {formatDateTime(m.joined_at)}
                </p>
              </div>
              {status === "pending" && (
                <>
                  <Button size="sm" onClick={() => update.mutate({ userId: m.user_id, body: { status: "active" } })}>
                    <Check /> Approve
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => remove.mutate(m.user_id)}>
                    <X /> Decline
                  </Button>
                </>
              )}
              {status === "active" && m.role !== "owner" && m.user_id !== me?.id && (
                <>
                  <Input
                    defaultValue={m.title ?? ""}
                    placeholder="Title (e.g. President)"
                    className="h-8 w-40"
                    onBlur={(e) => e.target.value !== (m.title ?? "") && update.mutate({ userId: m.user_id, body: { title: e.target.value } })}
                  />
                  <select
                    value={m.role}
                    onChange={(e) => update.mutate({ userId: m.user_id, body: { role: e.target.value } })}
                    className="h-8 rounded-md border px-2 text-sm"
                    disabled={m.role === "admin" && myRole !== "owner"}
                  >
                    <option value="member">Member</option>
                    <option value="moderator">Moderator</option>
                    {myRole === "owner" && <option value="admin">Admin</option>}
                    {myRole === "owner" && <option value="owner">Make owner</option>}
                  </select>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={() => confirm(`Ban ${m.user_name}?`) && update.mutate({ userId: m.user_id, body: { status: "banned" } })}>
                    Ban
                  </Button>
                </>
              )}
              {status === "active" && m.role === "owner" && <StatusBadge status="active" label="Owner" />}
              {status === "banned" && (
                <Button size="sm" variant="outline" onClick={() => remove.mutate(m.user_id)}>
                  Unban
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function SettingsAdmin({ group, slug }: { group: Row; slug: string }) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(() => groupValues({ ...group, about: group.about ?? "" }));
  const save = useMutation({
    mutationFn: () => api.patch(`/groups/${group.id}`, value),
    onSuccess: () => {
      toast.success("Group saved");
      void queryClient.invalidateQueries({ queryKey: ["group", slug] });
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <form
      className="rounded-2xl border bg-white p-6"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <GroupForm value={value} onChange={setValue} />
      <Button type="submit" className="mt-6" disabled={save.isPending}>
        Save settings
      </Button>
    </form>
  );
}

function DonationsAdmin({ groupId }: { groupId: number }) {
  const { data: camp, refetch: refetchCamp } = useQuery({ queryKey: ["group-campaigns", groupId], queryFn: () => api.get<{ campaigns: Array<Row> }>(`/groups/${groupId}/campaigns`) });
  const { data: dons, refetch } = useQuery({ queryKey: ["group-donations", groupId], queryFn: () => api.get<{ items: Array<Row> }>(`/groups/${groupId}/donations`) });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", story: "", goalAmount: "", momoNumber: "", momoName: "", endsOn: "", coverUrl: null as string | null });
  const create = useMutation({
    mutationFn: () => api.post(`/groups/${groupId}/campaigns`, { ...f, goalAmount: Number(f.goalAmount) }),
    onSuccess: () => {
      toast.success("Campaign started");
      setOpen(false);
      void refetchCamp();
    },
    onError: (e) => toast.error(e.message),
  });
  const close = useMutation({ mutationFn: (c: Row) => api.patch(`/groups/campaigns/${c.id}`, { status: c.status === "active" ? "closed" : "active" }), onSuccess: () => void refetchCamp() });
  const handle = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => api.patch(`/groups/donations/${id}`, { status }),
    onSuccess: () => {
      void refetch();
      void refetchCamp();
    },
    onError: (e) => toast.error(e.message),
  });
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-primary">Campaigns</h2>
          <Button size="sm" onClick={() => setOpen(!open)}>
            <Plus /> New campaign
          </Button>
        </div>
        {open && (
          <form
            className="mb-4 grid gap-3 rounded-xl bg-muted p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <Field label="Cover" className="sm:col-span-2">
              <ImageUpload value={f.coverUrl} onChange={(v) => setF({ ...f, coverUrl: v })} folder="groups" aspect="aspect-[3/1]" />
            </Field>
            <Field label="Title" className="sm:col-span-2">
              <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required className="bg-white" />
            </Field>
            <Field label="Goal (GH₵)">
              <Input inputMode="decimal" value={f.goalAmount} onChange={(e) => setF({ ...f, goalAmount: e.target.value })} required className="bg-white" />
            </Field>
            <Field label="Ends on">
              <Input type="date" value={f.endsOn} onChange={(e) => setF({ ...f, endsOn: e.target.value })} className="bg-white" />
            </Field>
            <Field label="MoMo number for direct gifts">
              <Input value={f.momoNumber} onChange={(e) => setF({ ...f, momoNumber: e.target.value })} className="bg-white" />
            </Field>
            <Field label="MoMo account name">
              <Input value={f.momoName} onChange={(e) => setF({ ...f, momoName: e.target.value })} className="bg-white" />
            </Field>
            <Field label="Story" className="sm:col-span-2">
              <Textarea rows={4} value={f.story} onChange={(e) => setF({ ...f, story: e.target.value })} className="bg-white" />
            </Field>
            <Button type="submit" size="sm" className="w-fit" disabled={create.isPending}>
              Start campaign
            </Button>
          </form>
        )}
        <ul className="divide-y">
          {camp?.campaigns.map((c) => (
            <li key={c.id} className="flex items-center gap-3 py-3">
              <div className="flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatMoney(c.raised_amount)} of {formatMoney(c.goal_amount)} · {c.donor_count} donors
                </p>
              </div>
              <StatusBadge status={c.status === "active" ? "active" : "closed"} />
              <Button size="sm" variant="outline" onClick={() => close.mutate(c)}>
                {c.status === "active" ? "Close" : "Reopen"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
      <section className="overflow-hidden rounded-2xl border bg-white">
        <h2 className="border-b px-5 py-3 font-bold text-primary">Donations</h2>
        {!dons ? (
          <Loading />
        ) : dons.items.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No donations yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {dons.items.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-2">
                    <p className="font-semibold">
                      {d.donor_name} {d.is_anonymous ? "(anonymous)" : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {d.campaign_title} · {formatDateTime(d.created_at)} · {d.method === "momo_direct" ? `MoMo ref ${d.momo_reference}` : "Online"}
                    </p>
                  </td>
                  <td className="px-4 py-2 font-bold">{formatMoney(d.amount)}</td>
                  <td className="px-4 py-2">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    {d.status === "pending" && d.method === "momo_direct" && (
                      <div className="flex justify-end gap-1">
                        <Button size="xs" onClick={() => handle.mutate({ id: d.id, status: "confirmed" })}>
                          Confirm
                        </Button>
                        <Button size="xs" variant="ghost" onClick={() => handle.mutate({ id: d.id, status: "rejected" })}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

function PagesAdmin({ groupId, slug }: { groupId: number; slug: string }) {
  const queryClient = useQueryClient();
  const { data } = useGroup(slug);
  const [editing, setEditing] = useState<{ id?: number; slug?: string; title: string; body: string; isPublished: boolean } | null>(null);
  const load = useMutation({
    mutationFn: (p: { id: number; slug: string }) => api.get<{ page: Row; raw: string | null }>(`/groups/${groupId}/pages/${p.slug}`),
    onSuccess: (r, p) => setEditing({ id: p.id, slug: p.slug, title: r.page.title, body: r.raw ?? "", isPublished: r.page.is_published === 1 }),
  });
  const save = useMutation({
    mutationFn: () => (editing!.id ? api.patch(`/groups/pages/${editing!.id}`, editing) : api.post(`/groups/${groupId}/pages`, editing)),
    onSuccess: () => {
      toast.success("Page saved");
      setEditing(null);
      void queryClient.invalidateQueries({ queryKey: ["group", slug] });
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.delete(`/groups/pages/${id}`),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["group", slug] }),
  });
  if (editing) {
    return (
      <form
        className="space-y-4 rounded-2xl border bg-white p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <Field label="Page title">
          <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} required />
        </Field>
        <RichTextEditor key={editing.id ?? "new"} value={editing.body} onChange={(body) => setEditing({ ...editing, body })} folder="groups" memberUploads />
        <Switch checked={editing.isPublished} onChange={(v) => setEditing({ ...editing, isPublished: v })} label="Published" description="Unpublished pages are visible only to admins." />
        <div className="flex gap-2">
          <Button type="submit" disabled={save.isPending}>
            Save page
          </Button>
          <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
            Cancel
          </Button>
        </div>
      </form>
    );
  }
  return (
    <section className="rounded-2xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-primary">Custom pages</h2>
        <Button size="sm" onClick={() => setEditing({ title: "", body: "", isPublished: true })}>
          <Plus /> New page
        </Button>
      </div>
      <p className="mb-3 text-sm text-muted-foreground">e.g. Constitution, Executives, Past events, How to join. Pages appear as tabs on the group.</p>
      <ul className="divide-y">
        {data?.pages.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-3">
            <FileText className="size-4 text-muted-foreground" />
            <Link to="/groups/$slug/p/$page" params={{ slug, page: p.slug }} className="flex-1 font-medium hover:underline">
              {p.title}
            </Link>
            <Button size="icon-sm" variant="ghost" onClick={() => load.mutate(p)} aria-label="Edit">
              <Pencil />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={() => confirm("Delete this page?") && remove.mutate(p.id)} aria-label="Delete">
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
