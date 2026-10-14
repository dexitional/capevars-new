import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarPlus, CalendarDays, Link2, MapPin, Plus, Trash2, Video } from "lucide-react";
import { api } from "#/lib/api-client";
import { cn } from "#/lib/utils";
import { dateParts, formatDateTime, formatTime } from "#/lib/format";
import { EmptyState, TextBlock } from "#/components/site/kit";
import { useGroup } from "#/components/groups/use-group";
import { Field } from "#/components/admin/ui";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";

type Row = Record<string, any>;

export const Route = createFileRoute("/_site/groups/$slug/meetings")({ component: Meetings });

// "Add to calendar" without a server: a downloadable .ics file.
function icsHref(m: Row, groupName: string) {
  const stamp = (v: string) => `${v.replace(/[-: ]/g, "").slice(0, 15)}Z`.replace(/(\d{8})(\d{6})/, "$1T$2");
  const end = m.ends_at ?? m.starts_at;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Capevars//Groups//EN",
    "BEGIN:VEVENT",
    `UID:meeting-${m.id}@capevars`,
    `DTSTART:${stamp(m.starts_at)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${m.title} (${groupName})`,
    m.location ? `LOCATION:${m.location}` : "",
    m.meeting_url ? `URL:${m.meeting_url}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}

function Meetings() {
  const { slug } = Route.useParams();
  const { data: g } = useGroup(slug);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", agenda: "", startsAt: "", endsAt: "", location: "", meetingUrl: "", membersOnly: true });
  const { data, refetch } = useQuery({ queryKey: ["group-meetings", g?.group.id], queryFn: () => api.get<{ items: Array<Row> }>(`/groups/${g!.group.id}/meetings`), enabled: Boolean(g) });
  const create = useMutation({
    mutationFn: () => api.post(`/groups/${g!.group.id}/meetings`, f),
    onSuccess: () => {
      toast.success("Meeting scheduled — members were notified");
      setOpen(false);
      void refetch();
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({ mutationFn: (id: number) => api.delete(`/groups/meetings/${id}`), onSuccess: () => void refetch() });
  if (!g) return null;
  const now = Date.now();
  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-primary">Meetings</h2>
        {g.canModerate && (
          <Button size="sm" className="bg-sys-groups" onClick={() => setOpen(!open)}>
            <Plus /> Schedule meeting
          </Button>
        )}
      </div>
      {open && (
        <form
          className="mb-4 grid gap-3 rounded-2xl border bg-white p-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate();
          }}
        >
          <Field label="Title" className="sm:col-span-2">
            <Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} required />
          </Field>
          <Field label="Starts">
            <Input type="datetime-local" value={f.startsAt} onChange={(e) => setF({ ...f, startsAt: e.target.value })} required />
          </Field>
          <Field label="Ends">
            <Input type="datetime-local" value={f.endsAt} onChange={(e) => setF({ ...f, endsAt: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
          </Field>
          <Field label="Online link (Meet/Zoom)">
            <Input value={f.meetingUrl} onChange={(e) => setF({ ...f, meetingUrl: e.target.value })} placeholder="https://" />
          </Field>
          <Field label="Agenda" className="sm:col-span-2">
            <Textarea rows={3} value={f.agenda} onChange={(e) => setF({ ...f, agenda: e.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" checked={f.membersOnly} onChange={(e) => setF({ ...f, membersOnly: e.target.checked })} className="accent-violet-600" /> Members only (hide link and location from non-members)
          </label>
          <Button type="submit" size="sm" className="w-fit" disabled={create.isPending}>
            Schedule
          </Button>
        </form>
      )}
      {!data ? null : data.items.length === 0 ? (
        <EmptyState icon={CalendarDays} title="No meetings scheduled" />
      ) : (
        <ul className="space-y-3">
          {data.items.map((m) => {
            const d = dateParts(m.starts_at);
            const past = new Date(`${m.starts_at.replace(" ", "T")}Z`).getTime() < now;
            return (
              <li key={m.id} className={cn("flex gap-4 rounded-2xl border bg-white p-4", past && "opacity-60")}>
                <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-violet-50 text-violet-800">
                  <span className="text-2xl font-black">{d.day}</span>
                  <span className="text-xs font-bold uppercase">{d.month}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-primary">{m.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(m.starts_at)}
                    {m.ends_at ? ` – ${formatTime(m.ends_at)}` : ""} · {formatDateTime(m.starts_at).split(",")[0]}
                  </p>
                  {m.location && (
                    <p className="flex items-center gap-1 text-sm">
                      <MapPin className="size-3.5" /> {m.location}
                    </p>
                  )}
                  {m.meeting_url && (
                    <a href={m.meeting_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-info">
                      <Video className="size-3.5" /> Join online
                    </a>
                  )}
                  {m.agenda && <TextBlock text={m.agenda} className="mt-2 text-sm" />}
                  {m.members_only && !m.meeting_url && !m.location && !g.membership && <p className="mt-1 text-xs text-muted-foreground">Details are for members.</p>}
                </div>
                <div className="flex flex-col gap-1">
                  {!past && (
                    <a href={icsHref(m, g.group.name)} download={`meeting-${m.id}.ics`} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" title="Add to calendar">
                      <CalendarPlus className="size-4" />
                    </a>
                  )}
                  {m.meeting_url && (
                    <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted" title="Copy link" onClick={() => (navigator.clipboard?.writeText(m.meeting_url), toast.success("Link copied"))}>
                      <Link2 className="size-4" />
                    </button>
                  )}
                  {g.canModerate && (
                    <button type="button" className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive" onClick={() => confirm("Delete meeting?") && remove.mutate(m.id)} aria-label="Delete">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
