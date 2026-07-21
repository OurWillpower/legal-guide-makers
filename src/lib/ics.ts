// RFC 5545 ICS generation — pure functions, safe for server or edge.

export interface IcsEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  startISO: string; // full ISO datetime
  durationMinutes: number;
  organizerName?: string;
  organizerEmail?: string;
  attendeeName?: string;
  attendeeEmail?: string;
  status?: "CONFIRMED" | "CANCELLED";
  sequence?: number;
  method?: "REQUEST" | "CANCEL";
}

function fmt(dateISO: string): string {
  const d = new Date(dateISO);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function esc(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function buildIcs(ev: IcsEvent): string {
  const start = new Date(ev.startISO);
  const end = new Date(start.getTime() + ev.durationMinutes * 60_000);
  const method = ev.method ?? "REQUEST";
  const status = ev.status ?? "CONFIRMED";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//WIN Legal Advisors//Booking//EN",
    "CALSCALE:GREGORIAN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${ev.uid}`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(start.toISOString())}`,
    `DTEND:${fmt(end.toISOString())}`,
    `SUMMARY:${esc(ev.title)}`,
    ev.description ? `DESCRIPTION:${esc(ev.description)}` : "",
    ev.location ? `LOCATION:${esc(ev.location)}` : "",
    `SEQUENCE:${ev.sequence ?? 0}`,
    `STATUS:${status}`,
    ev.organizerEmail
      ? `ORGANIZER;CN=${esc(ev.organizerName ?? "WIN Legal Advisors")}:mailto:${ev.organizerEmail}`
      : "",
    ev.attendeeEmail
      ? `ATTENDEE;CN=${esc(ev.attendeeName ?? ev.attendeeEmail)};RSVP=TRUE:mailto:${ev.attendeeEmail}`
      : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  return lines.join("\r\n");
}

// Convert "10:00 AM" / "2:30 PM" + YYYY-MM-DD into an ISO datetime in IST.
export function slotToISO(dateYMD: string, timeLabel: string, timezoneOffsetMinutes = 330): string {
  const m = timeLabel.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) throw new Error(`Invalid time: ${timeLabel}`);
  let hour = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === "PM" && hour < 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  const [y, mo, d] = dateYMD.split("-").map(Number);
  // Build UTC millis assuming the wall-clock date/time is in the given timezone (default IST = +5:30).
  const utc = Date.UTC(y, mo - 1, d, hour, min) - timezoneOffsetMinutes * 60_000;
  return new Date(utc).toISOString();
}

// Google Calendar "add event" URL. Times are UTC in YYYYMMDDTHHMMSSZ format.
export function googleCalendarUrl(opts: {
  title: string;
  startISO: string;
  durationMinutes: number;
  description?: string;
  location?: string;
}): string {
  const start = new Date(opts.startISO);
  const end = new Date(start.getTime() + opts.durationMinutes * 60_000);
  const fmt = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      pad(d.getUTCSeconds()) +
      "Z"
    );
  };
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(start)}/${fmt(end)}`,
  });
  if (opts.description) params.set("details", opts.description);
  if (opts.location) params.set("location", opts.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
