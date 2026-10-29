// Sharing a bus trip from the trip list: shares the trip's flyer, which
// carries the details and a QR code to the booking page.
import { Share2 } from "lucide-react";
import { cn } from "#/lib/utils";
import { shareLink } from "./flyer-kit";

type Row = Record<string, any>;

export const tripShare = (t: Row, origin: string) => ({
  title: `${t.origin} → ${t.destination} bus`,
  text: `Book a seat on ${t.operator}'s bus from ${t.origin} to ${t.destination}.`,
  url: `${origin}/market/tickets/bus/${t.id}/flyer`,
});

export function ShareTripButton({ trip, className }: { trip: Row; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => void shareLink(tripShare(trip, window.location.origin))}
      className={cn("inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-semibold text-primary hover:border-primary/40 hover:bg-muted", className)}
      aria-label={`Share the ${trip.origin} to ${trip.destination} trip`}
    >
      <Share2 className="size-3.5" /> Share
    </button>
  );
}
