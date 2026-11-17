import type { AppEvent } from "./types";
export type EventPeriod = "Upcoming" | "Past" | "All dates";
export function calendarDay(at: Date, timezone = "America/Chicago"): string {
  if (/^[+-](?:0\d|1[0-4]):?[0-5]\d$/.test(timezone)) {
    const direction = timezone[0] === "+" ? 1 : -1;
    const compact = timezone.replace(":", "");
    const minutes = Number(compact.slice(1,3)) * 60 + Number(compact.slice(3));
    return new Date(at.getTime() + direction * minutes * 60_000).toISOString().slice(0,10);
  }
  try { return new Intl.DateTimeFormat("en-CA", { timeZone: timezone }).format(at); }
  catch { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago" }).format(at); }
}
const validDay = (day: string | null) => !!day && /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(Date.parse(day+"T12:00:00Z")) && new Date(day+"T12:00:00Z").toISOString().slice(0,10) === day;
export function eventPeriod(event: AppEvent, at: Date): "Upcoming" | "Past" | "Unknown" {
  if (!validDay(event.event_date) || (event.end_date && (!validDay(event.end_date) || event.end_date < event.event_date!))) return "Unknown";
  return (event.end_date || event.event_date!) < calendarDay(at, event.timezone || undefined) ? "Past" : "Upcoming";
}
export function eventsForPeriod(events: AppEvent[], period: EventPeriod, at: Date): AppEvent[] {
  return events.filter(e => period === "All dates" || eventPeriod(e, at) === period).sort((a,b) => {
    const ad = validDay(a.event_date) ? a.event_date! : "9999";
    const bd = validDay(b.event_date) ? b.event_date! : "9999";
    return (period === "Past" ? bd.localeCompare(ad) : ad.localeCompare(bd)) || a.id.localeCompare(b.id);
  });
}
