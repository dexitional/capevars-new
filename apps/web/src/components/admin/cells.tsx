// Small table cells shared by the admin queue pages.
import { formatDate, formatDateTime } from "#/lib/format";
import { formatMoney } from "#/lib/money";
import { Status } from "./moderation-table";
import { Avatar, Img } from "#/components/site/kit";

type Row = Record<string, any>;

export const TitleCell = ({ title, sub, image, round }: { title: React.ReactNode; sub?: React.ReactNode; image?: string | null; round?: boolean }) => (
  <div className="flex min-w-48 items-center gap-3">
    {image !== undefined &&
      (round ? <Avatar src={image} name={String(title)} size="sm" /> : <Img src={image} className="size-10 shrink-0 rounded-lg" />)}
    <div className="min-w-0">
      <p className="font-semibold text-foreground">{title}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

export const DateCell = ({ value, time }: { value: string | null | undefined; time?: boolean }) => (
  <span className="text-xs whitespace-nowrap text-muted-foreground">{value ? (time ? formatDateTime(value) : formatDate(value)) : "—"}</span>
);

export const MoneyCell = ({ value, free }: { value: unknown; free?: boolean }) => <span className="font-semibold whitespace-nowrap">{formatMoney(value as number, free ? { free: "Free" } : {})}</span>;

export const StatusCell = ({ row }: { row: Row }) => (
  <div className="space-y-1">
    <Status row={row} />
    {row.is_featured ? <span className="block text-[10px] font-bold text-amber-700 uppercase">Featured</span> : null}
    {row.is_verified ? <span className="block text-[10px] font-bold text-sky-700 uppercase">Verified</span> : null}
    {(row.status_reason || row.review_note) && <p className="max-w-48 text-xs text-muted-foreground">{row.status_reason ?? row.review_note}</p>}
  </div>
);
