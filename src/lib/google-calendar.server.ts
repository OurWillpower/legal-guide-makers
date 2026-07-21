// Server-only helpers to call the firm's Google Calendar through the Lovable connector gateway.
// Never import from client bundles.

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

function requireEnv() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gcalKey = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!lovableKey || !gcalKey) {
    throw new Error("Google Calendar connector is not configured (missing gateway keys)");
  }
  return { lovableKey, gcalKey };
}

function headers() {
  const { lovableKey, gcalKey } = requireEnv();
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": gcalKey,
    "Content-Type": "application/json",
  };
}

export interface GcalEventInput {
  summary: string;
  description?: string;
  location?: string;
  startISO: string;
  durationMinutes: number;
  attendeeEmail?: string;
  attendeeName?: string;
  timeZone?: string;
}

export async function createGcalEvent(input: GcalEventInput): Promise<{ id: string; htmlLink?: string } | null> {
  try {
    const start = new Date(input.startISO);
    const end = new Date(start.getTime() + input.durationMinutes * 60_000);
    const body: Record<string, unknown> = {
      summary: input.summary,
      description: input.description,
      location: input.location,
      start: { dateTime: start.toISOString(), timeZone: input.timeZone ?? "Asia/Kolkata" },
      end: { dateTime: end.toISOString(), timeZone: input.timeZone ?? "Asia/Kolkata" },
    };
    if (input.attendeeEmail) {
      body.attendees = [{ email: input.attendeeEmail, displayName: input.attendeeName }];
    }
    const res = await fetch(`${GATEWAY_URL}/calendars/primary/events?sendUpdates=none`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      console.warn("[gcal] create failed", res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { id: string; htmlLink?: string };
    return { id: json.id, htmlLink: json.htmlLink };
  } catch (err) {
    console.warn("[gcal] create errored:", err);
    return null;
  }
}

export async function updateGcalEvent(
  eventId: string,
  patch: Partial<GcalEventInput>,
): Promise<boolean> {
  try {
    const body: Record<string, unknown> = {};
    if (patch.summary) body.summary = patch.summary;
    if (patch.description !== undefined) body.description = patch.description;
    if (patch.location !== undefined) body.location = patch.location;
    if (patch.startISO && patch.durationMinutes) {
      const start = new Date(patch.startISO);
      const end = new Date(start.getTime() + patch.durationMinutes * 60_000);
      body.start = { dateTime: start.toISOString(), timeZone: patch.timeZone ?? "Asia/Kolkata" };
      body.end = { dateTime: end.toISOString(), timeZone: patch.timeZone ?? "Asia/Kolkata" };
    }
    const res = await fetch(
      `${GATEWAY_URL}/calendars/primary/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
      { method: "PATCH", headers: headers(), body: JSON.stringify(body) },
    );
    if (!res.ok) console.warn("[gcal] update failed", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.warn("[gcal] update errored:", err);
    return false;
  }
}

export async function deleteGcalEvent(eventId: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${GATEWAY_URL}/calendars/primary/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
      { method: "DELETE", headers: headers() },
    );
    return res.ok || res.status === 410 || res.status === 404;
  } catch (err) {
    console.warn("[gcal] delete errored:", err);
    return false;
  }
}
