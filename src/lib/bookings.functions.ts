import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  bookingIcsSchema,
  bookingSchema,
  cancelSchema,
  rescheduleSchema,
  uuidSchema,
  publicManageSchema,
  publicRescheduleSchema,
  publicCancelSchema,
} from "./bookings.schema";
import type { BookingInput } from "./bookings.schema";


export type { BookingInput };


export const submitBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createGcalEvent } = await import("./google-calendar.server");
    const { logBookingEvent, sendBookingEmail, slotToISO } = await import("./bookings.server");

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

    await logBookingEvent(row.id, "created", {
      service: data.service,
      date: data.preferredDate,
      time: data.preferredTime,
    });

    await sendBookingEmail({
      to: data.email,
      name: data.name,
      phone: data.phone,
      service: data.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: row.id,
      manageToken: row.manage_token,
    });

    return { id: row.id, ok: true };
  });

// Public (no-auth) booking — clients can request a consultation without
// creating an account. They still get a manage_token via email for
// reschedule / cancel / status.
export const submitBookingPublic = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createGcalEvent } = await import("./google-calendar.server");
    const { logBookingEvent, sendBookingEmail, slotToISO } = await import("./bookings.server");

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        user_id: null,
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
      console.error("[bookings] public insert failed:", error);
      throw new Error("Could not save your request. Please try again.");
    }

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

    await logBookingEvent(row.id, "created", {
      service: data.service,
      date: data.preferredDate,
      time: data.preferredTime,
      channel: "public",
    });

    await sendBookingEmail({
      to: data.email,
      name: data.name,
      phone: data.phone,
      service: data.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: row.id,
      manageToken: row.manage_token,
    });

    return { id: row.id, manageToken: row.manage_token, ok: true };
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
  .inputValidator((id: string) => uuidSchema.parse(id))
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

export const rescheduleBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => rescheduleSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { logBookingEvent, sendBookingEmail, slotToISO } = await import("./bookings.server");

    // Owner-scoped update via RLS
    const { data: existing, error: readErr } = await context.supabase
      .from("bookings")
      .select("id, name, email, service, reschedule_count, cancelled_at, manage_token")
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

    await logBookingEvent(data.id, "rescheduled", {
      date: data.preferredDate,
      time: data.preferredTime,
      count: existing.reschedule_count + 1,
    });

    await sendBookingEmail({
      to: existing.email,
      name: existing.name,
      service: existing.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: data.id,
      manageToken: existing.manage_token,
      rescheduled: true,
    });

    return { ok: true };
  });

export const cancelBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => cancelSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { logBookingEvent, sendBookingEmail } = await import("./bookings.server");

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

    await logBookingEvent(data.id, "cancelled", { reason: data.reason || null });

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
  .inputValidator((raw: unknown) => bookingIcsSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { buildIcs, slotToISO } = await import("./bookings.server");
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

// ============= Public token-gated management (no auth required) =============
// Clients who booked via the public form receive a manage_token by email.
// These functions verify the token via the admin client (RLS bypass) so the
// booking owner can view / reschedule / cancel without creating an account.

export const getBookingByToken = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => publicManageSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("bookings")
      .select(
        "id, name, email, phone, service, preferred_date, preferred_time, status, cancelled_at, cancellation_reason, reschedule_count, manage_token",
      )
      .eq("id", data.id)
      .maybeSingle();
    if (!row || row.manage_token !== data.token) return null;
    // Strip the token before returning to the client.
    const { manage_token: _t, ...safe } = row;
    return safe;
  });

export const rescheduleBookingByToken = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => publicRescheduleSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { logBookingEvent, sendBookingEmail, slotToISO } = await import("./bookings.server");

    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id, name, email, service, reschedule_count, cancelled_at, manage_token, google_event_id")
      .eq("id", data.id)
      .maybeSingle();
    if (!existing || existing.manage_token !== data.token) throw new Error("Booking not found");
    if (existing.cancelled_at) throw new Error("This booking has been cancelled");
    if (existing.reschedule_count >= 3) throw new Error("Maximum reschedules reached — please contact us.");

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        reschedule_count: existing.reschedule_count + 1,
        status: "pending",
      })
      .eq("id", data.id);
    if (error) throw error;

    try {
      if (existing.google_event_id) {
        const { updateGcalEvent } = await import("./google-calendar.server");
        await updateGcalEvent(existing.google_event_id, {
          startISO: slotToISO(data.preferredDate, data.preferredTime),
          durationMinutes: 45,
          summary: `Legal Consultation — ${existing.name} (${existing.service})`,
        });
      }
    } catch (err) {
      console.warn("[bookings] gcal reschedule (public) skipped:", err);
    }

    await logBookingEvent(data.id, "rescheduled", {
      date: data.preferredDate,
      time: data.preferredTime,
      count: existing.reschedule_count + 1,
      channel: "public",
    });

    await sendBookingEmail({
      to: existing.email,
      name: existing.name,
      service: existing.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: data.id,
      manageToken: existing.manage_token,
      rescheduled: true,
    });

    return { ok: true };
  });

export const cancelBookingByToken = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => publicCancelSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { logBookingEvent, sendBookingEmail } = await import("./bookings.server");

    const { data: existing } = await supabaseAdmin
      .from("bookings")
      .select("id, name, email, service, preferred_date, preferred_time, cancelled_at, manage_token, google_event_id")
      .eq("id", data.id)
      .maybeSingle();
    if (!existing || existing.manage_token !== data.token) throw new Error("Booking not found");
    if (existing.cancelled_at) return { ok: true };

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({
        cancelled_at: new Date().toISOString(),
        cancellation_reason: data.reason || null,
        status: "cancelled",
      })
      .eq("id", data.id);
    if (error) throw error;

    try {
      if (existing.google_event_id) {
        const { deleteGcalEvent } = await import("./google-calendar.server");
        await deleteGcalEvent(existing.google_event_id);
      }
    } catch (err) {
      console.warn("[bookings] gcal delete (public) skipped:", err);
    }

    await logBookingEvent(data.id, "cancelled", { reason: data.reason || null, channel: "public" });

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
