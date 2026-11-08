// A QR code that invites people to join a campus group. It links to the group
// page with ?join=1, which shows non-members an invitation to join.
import { useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, QrCode as QrIcon, Share2 } from "lucide-react";
import { copyLink, shareLink, useOrigin } from "#/components/market/flyer-kit";
import { QrCode } from "#/components/market/trip-pin";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";

type Group = { name: string; slug: string };

export const groupInviteUrl = (origin: string, slug: string) => `${origin}/groups/${slug}?join=1`;

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

// A print-ready card: the group's name, the code and a call to action.
async function downloadCard(group: Group, url: string) {
  const qr = new Image();
  qr.src = await QRCode.toDataURL(url, { width: 900, margin: 1, errorCorrectionLevel: "M", color: { dark: "#041d40" } });
  await qr.decode();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = "center";
  ctx.fillStyle = "#041d40";
  ctx.fillText(fitText(ctx, group.name, 960, [72, 60, 48, 40]), 540, 150);
  ctx.drawImage(qr, 90, 220, 900, 900);
  ctx.font = "700 44px system-ui, sans-serif";
  ctx.fillText("Scan to join on Capevars", 540, 1220);
  ctx.fillStyle = "#5b6b78";
  ctx.font = "400 30px system-ui, sans-serif";
  ctx.fillText(url.replace(/^https?:\/\//, ""), 540, 1285);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${group.slug}-join-qr.png`;
  link.click();
}

export function GroupQrButton({ group }: { group: Group }) {
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
          <div className="mx-auto w-full max-w-64 rounded-2xl border bg-white p-4">
            {origin && <QrCode value={url} label={`QR code to join ${group.name}`} className="aspect-square w-full" />}
          </div>
          <p className="break-all text-center text-xs text-muted-foreground">{url}</p>
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={() => copyLink(url)}>
              <Copy /> Copy
            </Button>
            <Button variant="outline" size="sm" onClick={() => void shareLink({ title: group.name, text: `Join ${group.name} on Capevars`, url })}>
              <Share2 /> Share
            </Button>
            <Button size="sm" className="bg-sys-groups hover:bg-sys-groups/90" onClick={() => void downloadCard(group, url)}>
              <Download /> Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
