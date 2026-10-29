// Bus trip pickup pins and QR codes, shared by the trip editor and the
// printable trip flyer.
import { useQuery } from "@tanstack/react-query";
import QRCode from "qrcode";
import { cn } from "#/lib/utils";

type Row = Record<string, any>;

// Reads a map pin from "5.1036, -1.2825" or a pasted Google Maps link
// (…/@5.1036,-1.2825,17z, ?q=5.1036,-1.2825, ?query=…, ?ll=…).
export function parsePin(text: string): { lat: number; lng: number } | null {
  const s = decodeURIComponent(text.trim());
  const m =
    /@(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/.exec(s) ??
    /[?&](?:q|query|ll|destination)=(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/.exec(s) ??
    /^(-?\d{1,2}(?:\.\d+)?)\s*[,\s]\s*(-?\d{1,3}(?:\.\d+)?)$/.exec(s);
  if (!m) return null;
  const lat = Number(m[1]);
  const lng = Number(m[2]);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) } : null;
}

export const formatPin = (lat: unknown, lng: unknown) => (lat !== null && lat !== undefined && lng !== null && lng !== undefined ? `${Number(lat)}, ${Number(lng)}` : "");

// Opens the pickup point in Google Maps (directions on phones): by its pin
// when the operator set one, otherwise by searching its name in the town.
export function pickupMapUrl(trip: Row) {
  const query = trip.pickup_lat !== null && trip.pickup_lat !== undefined ? `${Number(trip.pickup_lat)},${Number(trip.pickup_lng)}` : [trip.pickup_point, trip.origin].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function QrCode({ value, label, className, dark = "#041d40" }: { value: string; label: string; className?: string; dark?: string }) {
  const { data: svg } = useQuery({
    queryKey: ["qr", value, dark],
    queryFn: () => QRCode.toString(value, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark, light: "#ffffff00" } }),
    staleTime: Infinity,
  });
  return svg ? (
    <div role="img" aria-label={label} className={cn("[&>svg]:block [&>svg]:size-full", className)} dangerouslySetInnerHTML={{ __html: svg }} />
  ) : (
    <div className={cn("animate-pulse rounded bg-muted", className)} aria-hidden="true" />
  );
}
