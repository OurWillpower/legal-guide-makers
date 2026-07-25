import { buildIcs, googleCalendarUrl, slotToISO } from "./ics";

function siteBaseUrl(): string {
  return (process.env.APP_URL || process.env.SITE_URL || "https://www.winlegaladvisors.com").replace(/\/$/, "");
}

export async function logBookingEvent(
  bookingId: string,
  eventType: string,
  meta: Record<string, unknown> = {},
  actor?: string,
) {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("booking_events").insert({
      booking_id: bookingId,
      event_type: eventType,
      meta: meta as never,
      actor: actor ?? null,
    });
  } catch (err) {
    console.warn("[bookings] event log skipped:", err);
  }
}

export async function sendBookingEmail(opts: {
  to: string;
  name: string;
  phone?: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  bookingId: string;
  manageToken?: string | null;
  cancelled?: boolean;
  rescheduled?: boolean;
}) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return;
  try {
    const [{ sendLovableEmail }, { renderDbTemplate }] = await Promise.all([
      import("@lovable.dev/email-js"),
      import("./email-render.server"),
    ]);

    let googleCalUrl = "";
    try {
      const startISO = slotToISO(opts.preferredDate, opts.preferredTime);
      googleCalUrl = googleCalendarUrl({
        title: `Legal Consultation — WIN Legal Advisors (${opts.service})`,
        startISO,
        durationMinutes: 45,
        description: "Your legal consultation with WIN Legal Advisors.",
        location: "WIN Legal Advisors (Video call)",
      });
    } catch (err) {
      console.warn("[bookings] calendar url skipped:", err);
    }
    const base = siteBaseUrl();
    const icsUrl = opts.manageToken
      ? `${base}/api/public/booking-ics/${opts.bookingId}?token=${encodeURIComponent(opts.manageToken)}`
      : "";
    const pdfUrl = opts.manageToken
      ? `${base}/api/public/booking-pdf/${opts.bookingId}?token=${encodeURIComponent(opts.manageToken)}`
      : "";
    const manageUrl = opts.manageToken
      ? `${base}/manage/${opts.bookingId}?token=${encodeURIComponent(opts.manageToken)}`
      : "";
    const statusUrl = opts.manageToken
      ? `${base}/status/${opts.bookingId}?token=${encodeURIComponent(opts.manageToken)}`
      : "";

    const key = opts.cancelled
      ? "booking_cancelled"
      : opts.rescheduled
        ? "booking_rescheduled"
        : "booking_confirmation";

    const rendered = await renderDbTemplate(key, {
      name: opts.name,
      service: opts.service,
      preferredDate: opts.preferredDate,
      preferredTime: opts.preferredTime,
      manageUrl,
      googleCalendarUrl: googleCalUrl,
      icsUrl,
      pdfUrl,
      statusUrl,
    });
    if (!rendered) {
      console.warn(`[bookings] template ${key} not found`);
      return;
    }

    await sendLovableEmail(
      {
        to: opts.to,
        from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        purpose: "booking_confirmation",
        reply_to: "contact@winlegaladvisors.com",
      },
      { apiKey },
    );
  } catch (err) {
    console.warn("[bookings] email skipped:", err);
  }
}

export { buildIcs, googleCalendarUrl, slotToISO };