import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { buildIcs, slotToISO, googleCalendarUrl } from "./ics";

function siteBaseUrl(): string {
  return (
    process.env.APP_URL ||
    process.env.SITE_URL ||
    "https://www.winlegaladvisors.com"
  ).replace(/\/$/, "");
}

const bookingSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  service: z.string().trim().min(1).max(120),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().trim().min(1).max(20),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

async function sendBookingEmail(opts: {
  to: string;
  name: string;
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
    const [{ sendLovableEmail }, { render }, tpl] = await Promise.all([
      import("@lovable.dev/email-js"),
      import("@react-email/render"),
      import("./email-templates"),
    ]);
    const React = (await import("react")).default;

    // Build calendar helpers (best-effort — if time parsing fails we still send the email).
    let googleCalUrl: string | undefined;
    let icsUrl: string | undefined;
    let manageUrl: string | undefined;
    try {
      const startISO = slotToISO(opts.preferredDate, opts.preferredTime);
      googleCalUrl = googleCalendarUrl({
        title: `Legal Consultation — WIN Legal Advisors (${opts.service})`,
        startISO,
        durationMinutes: 45,
        description:
          "Your legal consultation with WIN Legal Advisors. A video call link will be shared before the appointment.",
        location: "WIN Legal Advisors (Video call)",
      });
    } catch (err) {
      console.warn("[bookings] calendar url skipped:", err);
    }
    if (opts.manageToken) {
      const base = siteBaseUrl();
      icsUrl = `${base}/api/public/booking-ics/${opts.bookingId}?token=${encodeURIComponent(opts.manageToken)}`;
      manageUrl = `${base}/manage-booking/${opts.bookingId}`;
    }

    const element = React.createElement(tpl.BookingConfirmationEmail, {
      name: opts.name,
      email: opts.to,
      phone: null,
      company: null,
      service: opts.service,
      preferredDate: opts.preferredDate,
      preferredTime: opts.preferredTime,
      message: null,
      bookingId: opts.bookingId,
      cancelled: opts.cancelled,
      rescheduled: opts.rescheduled,
      googleCalendarUrl: googleCalUrl,
      icsUrl,
      manageUrl,
    });
    const html = await render(element);
    const text = await render(element, { plainText: true });
    const subject = opts.cancelled
      ? "Your consultation has been cancelled — WIN Legal Advisors"
      : opts.rescheduled
        ? "Your consultation has been rescheduled — WIN Legal Advisors"
        : "Your consultation is confirmed — WIN Legal Advisors";
    await sendLovableEmail(
      {
        to: opts.to,
        from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
        subject,
        html,
        text,
        purpose: "booking_confirmation",
        reply_to: "contact@winlegaladvisors.com",
      },
      { apiKey },
    );
  } catch (err) {
    console.warn("[bookings] email skipped:", err);
  }
}

export const submitBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createGcalEvent } = await import("./google-calendar.server");

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: context.userId,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        message: data.message || null,
      })
      .select("id, manage_token")
      .single();

    if (error || !row) {
      console.error("[bookings] insert failed:", error);
      throw new Error("Could not save your request. Please try again.");
    }

    // Create Google Calendar event on the firm's calendar (fire and forget).
    try {
      const startISO = slotToISO(data.preferredDate, data.preferredTime);
      const gcal = await createGcalEvent({
        summary: `Legal Consultation — ${data.name} (${data.service})`,
        description: `Client: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || "—"}\nService: ${data.service}\n\nMessage:\n${data.message || "—"}`,
        location: "WIN Legal Advisors (Video call link to follow)",
        startISO,
        durationMinutes: 45,
        attendeeEmail: data.email,
        attendeeName: data.name,
      });
      if (gcal?.id) {
        await supabaseAdmin.from("bookings").update({ google_event_id: gcal.id }).eq("id", row.id);
      }
    } catch (err) {
      console.warn("[bookings] gcal skipped:", err);
    }

    await sendBookingEmail({
      to: data.email,
      name: data.name,
      service: data.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: row.id,
      manageToken: row.manage_token,
    });

    return { id: row.id, ok: true };
  });

export const getMyBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        "id, service, preferred_date, preferred_time, status, cancelled_at, reschedule_count, created_at, message",
      )
      .order("preferred_date", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const getMyBooking = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id, context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        "id, name, email, phone, company, service, preferred_date, preferred_time, status, cancelled_at, cancellation_reason, reschedule_count, message, created_at",
      )
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data;
  });

const rescheduleSchema = z.object({
  id: z.string().uuid(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().trim().min(1).max(20),
});

export const rescheduleBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => rescheduleSchema.parse(data))
  .handler(async ({ data, context }) => {
    // Owner-scoped update via RLS
    const { data: existing, error: readErr } = await context.supabase
      .from("bookings")
      .select("id, name, email, service, reschedule_count, cancelled_at")
      .eq("id", data.id)
      .maybeSingle();
    if (readErr || !existing) throw new Error("Booking not found");
    if (existing.cancelled_at) throw new Error("This booking has been cancelled");
    if (existing.reschedule_count >= 3) throw new Error("Maximum reschedules reached — please contact us.");

    const { error } = await context.supabase
      .from("bookings")
      .update({
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        reschedule_count: existing.reschedule_count + 1,
        status: "pending",
      })
      .eq("id", data.id);
    if (error) throw error;

    // Update GCal event server-side (admin client — RLS bypass to read event id)
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row } = await supabaseAdmin
        .from("bookings")
        .select("google_event_id, name, service")
        .eq("id", data.id)
        .maybeSingle();
      if (row?.google_event_id) {
        const { updateGcalEvent } = await import("./google-calendar.server");
        await updateGcalEvent(row.google_event_id, {
          startISO: slotToISO(data.preferredDate, data.preferredTime),
          durationMinutes: 45,
          summary: `Legal Consultation — ${row.name} (${row.service})`,
        });
      }
    } catch (err) {
      console.warn("[bookings] gcal reschedule skipped:", err);
    }

    await sendBookingEmail({
      to: existing.email,
      name: existing.name,
      service: existing.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: data.id,
      rescheduled: true,
    });

    return { ok: true };
  });

const cancelSchema = z.object({
  id: z.string().uuid(),
  reason: z.string().trim().max(500).optional().or(z.literal("")),
});

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => cancelSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { data: existing, error: readErr } = await context.supabase
      .from("bookings")
      .select("id, name, email, service, preferred_date, preferred_time, cancelled_at")
      .eq("id", data.id)
      .maybeSingle();
    if (readErr || !existing) throw new Error("Booking not found");
    if (existing.cancelled_at) return { ok: true };

    const { error } = await context.supabase
      .from("bookings")
      .update({
        cancelled_at: new Date().toISOString(),
        cancellation_reason: data.reason || null,
        status: "cancelled",
      })
      .eq("id", data.id);
    if (error) throw error;

    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row } = await supabaseAdmin
        .from("bookings")
        .select("google_event_id")
        .eq("id", data.id)
        .maybeSingle();
      if (row?.google_event_id) {
        const { deleteGcalEvent } = await import("./google-calendar.server");
        await deleteGcalEvent(row.google_event_id);
      }
    } catch (err) {
      console.warn("[bookings] gcal delete skipped:", err);
    }

    await sendBookingEmail({
      to: existing.email,
      name: existing.name,
      service: existing.service,
      preferredDate: existing.preferred_date,
      preferredTime: existing.preferred_time,
      bookingId: data.id,
      cancelled: true,
    });

    return { ok: true };
  });

// Public server route helper: build an ICS for a booking, gated by manage_token.
export const getBookingIcs = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().uuid(), token: z.string().min(10) }).parse(raw),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("bookings")
      .select("id, name, email, service, preferred_date, preferred_time, cancelled_at, manage_token")
      .eq("id", data.id)
      .maybeSingle();
    if (!row || row.manage_token !== data.token) return { ics: null };
    const startISO = slotToISO(row.preferred_date, row.preferred_time);
    const ics = buildIcs({
      uid: `${row.id}@winlegaladvisors.com`,
      title: `Legal Consultation — WIN Legal Advisors (${row.service})`,
      description: `Consultation with Adv. Vrushali Borade at WIN Legal Advisors.\nService: ${row.service}`,
      location: "WIN Legal Advisors (Video link to follow)",
      startISO,
      durationMinutes: 45,
      organizerName: "WIN Legal Advisors",
      organizerEmail: "hello@winlegaladvisors.com",
      attendeeEmail: row.email,
      attendeeName: row.name,
      status: row.cancelled_at ? "CANCELLED" : "CONFIRMED",
      method: row.cancelled_at ? "CANCEL" : "REQUEST",
    });
    return { ics };
  });
