// A QR code that invites people to join a campus group. It links to the group
// page with ?join=1, which shows non-members an invitation to join. The
// group's logo sits in the middle of the code: the code uses the highest
// error correction (H, 30%), so it still scans with the centre covered.
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { Copy, Download, Printer, QrCode as QrIcon, Share2 } from "lucide-react";
import { optimizedUrl } from "#/lib/image";
import { cn } from "#/lib/utils";
import { copyLink, shareLink, useOrigin } from "#/components/market/flyer-kit";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

export type QrGroup = { name: string; slug: string; logo: string | null };

const NAVY = "#041d40";
// The logo plate covers this share of the code's width; H correction allows ~30% damage.
const LOGO_SHARE = 0.24;

export const groupInviteUrl = (origin: string, slug: string) => `${origin}/groups/${slug}?join=1`;
const logoSrc = (logo: string, width: number) => optimizedUrl(logo, width, 85);

// The code with the group's logo on a white plate in the middle.
export function GroupQrCode({ url, group, className }: { url: string; group: QrGroup; className?: string }) {
  const { data: svg } = useQuery({
    queryKey: ["group-qr", url],
    queryFn: () => QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "H", color: { dark: NAVY, light: "#ffffff" } }),
    staleTime: Infinity,
  });
  if (!svg) return <div className={cn("animate-pulse rounded bg-muted", className)} aria-hidden="true" />;
  return (
    <div role="img" aria-label={`QR code to join ${group.name}`} className={cn("relative", className)}>
      <div className="[&>svg]:block [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: svg }} />
      {group.logo && (
        <span className="absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[18%] bg-white p-[2%]" style={{ width: `${LOGO_SHARE * 100}%`, height: `${LOGO_SHARE * 100}%` }}>
          <img src={logoSrc(group.logo, 256)} alt="" className="size-full rounded-[14%] object-cover" />
        </span>
      )}
    </div>
  );
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    // Needed to export the canvas; an image without CORS headers just isn't drawn.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Draws an image filling a rounded square, cropped to cover it.
function drawRounded(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number, radius: number) {
  const scale = Math.max(size / img.width, size / img.height);
  const w = img.width * scale;
  const h = img.height * scale;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, size, size, radius);
  ctx.clip();
  ctx.drawImage(img, x + (size - w) / 2, y + (size - h) / 2, w, h);
  ctx.restore();
}

// Fits text to a width by shrinking the font, then shortening it.
function fitText(ctx: CanvasRenderingContext2D, text: string, width: number, sizes: Array<number>) {
  for (const size of sizes) {
    ctx.font = `800 ${size}px system-ui, sans-serif`;
    if (ctx.measureText(text).width <= width) return text;
  }
  let short = text;
  while (short.length > 1 && ctx.measureText(`${short}…`).width > width) short = short.slice(0, -1);
  return `${short.trimEnd()}…`;
}

// A print-ready card: the group's logo and name, the code (logo in the
// middle) and a call to action.
async function downloadCard(group: QrGroup, url: string) {
  const [qr, logo] = await Promise.all([
    QRCode.toDataURL(url, { width: 820, margin: 1, errorCorrectionLevel: "H", color: { dark: NAVY } }).then(loadImage),
    group.logo ? loadImage(logoSrc(group.logo, 384)) : Promise.resolve(null),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = NAVY;
  let y = 90;
  if (logo) {
    drawRounded(ctx, logo, 460, y, 160, 32);
    y += 230;
  } else {
    y += 60;
  }
  ctx.fillText(fitText(ctx, group.name, 960, [64, 54, 44, 38]), 540, y);
  const top = y + 50;
  if (qr) ctx.drawImage(qr, 130, top, 820, 820);
  if (logo) {
    const plate = Math.round(820 * LOGO_SHARE);
    const px = 540 - plate / 2;
    const py = top + 410 - plate / 2;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(px, py, plate, plate, plate * 0.18);
    ctx.fill();
    drawRounded(ctx, logo, px + 8, py + 8, plate - 16, (plate - 16) * 0.14);
  }
  ctx.fillStyle = NAVY;
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillText("Scan to join on Capevars", 540, top + 900);
  ctx.fillStyle = "#5b6b78";
  ctx.font = "400 30px system-ui, sans-serif";
  ctx.fillText(url.replace(/^https?:\/\//, ""), 540, top + 955);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${group.slug}-join-qr.png`;
  link.click();
}

export function GroupQrButton({ group }: { group: QrGroup }) {
  const [open, setOpen] = useState(false);
  const origin = useOrigin();
  const url = groupInviteUrl(origin, group.slug);
  return (
    <>
      <Button size="icon" variant="outline" onClick={() => setOpen(true)} aria-label="Show a QR code to join this group">
        <QrIcon />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite people to join</DialogTitle>
            <DialogDescription>Anyone who scans this code can join {group.name}.</DialogDescription>
          </DialogHeader>
          <div className="mx-auto w-full max-w-64 rounded-2xl border bg-white p-4">{origin && <GroupQrCode url={url} group={group} className="aspect-square w-full" />}</div>
          <p className="break-all text-center text-xs text-muted-foreground">{url}</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => copyLink(url)}>
              <Copy /> Copy link
            </Button>
            <Button variant="outline" size="sm" onClick={() => void shareLink({ title: group.name, text: `Join ${group.name} on Capevars`, url })}>
              <Share2 /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => void downloadCard(group, url)}>
              <Download /> Save image
            </Button>
            <Button asChild size="sm" className="bg-sys-groups hover:bg-sys-groups/90">
              {/* No view transition: it would start while the dialog is still open. */}
              <Link to="/groups/$slug/qr" params={{ slug: group.slug }} viewTransition={false}>
                <Printer /> Print
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
