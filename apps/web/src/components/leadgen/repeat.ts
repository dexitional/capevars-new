// Repeating SMS broadcasts: labels and send-count estimates for the composer
// and history pages. The server caps a series at 500 sends.
export type RepeatUnit = "hour" | "day" | "week" | "month";
export const REPEAT_UNITS: Array<RepeatUnit> = ["hour", "day", "week", "month"];
export const MAX_SENDS = 500;

export const repeatLabel = (every: number, unit: string) => (Number(every) === 1 ? `every ${unit}` : `every ${every} ${unit}s`);

// How many sends fit between the first send and the end of `endsOn` (inclusive).
export function sendsUntil(start: Date, endsOn: string, every: number, unit: RepeatUnit) {
  const end = new Date(`${endsOn}T23:59:59Z`);
  if (!(every >= 1) || Number.isNaN(end.getTime()) || end < start) return 0;
  let steps: number;
  if (unit === "month") {
    const months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth();
    const shifted = new Date(start);
    shifted.setUTCMonth(start.getUTCMonth() + months);
    steps = Math.floor((shifted <= end ? months : months - 1) / every);
  } else {
    const ms = { hour: 3_600_000, day: 86_400_000, week: 604_800_000 }[unit];
    steps = Math.floor((end.getTime() - start.getTime()) / (ms * every));
  }
  return Math.min(steps + 1, MAX_SENDS);
}
