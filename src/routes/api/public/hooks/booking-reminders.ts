import { createFileRoute } from "@tanstack/react-router";
import { slotToISO, googleCalendarUrl } from "@/lib/ics";

// Called by pg_cron every 5 minutes. Sends 24h and 2h reminders via email + WhatsApp.
export const Route = createFileRoute("/api/public/hooks/booking-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const provided =
          request.headers.get("x-cron-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        const { data: secretRow, error: secretErr } = await supabaseAdmin
          .from("internal_secrets")
          .select("value")
          .eq("name", "cron_webhook_secret")
          .maybeSingle();
        if (secretErr || !secretRow?.value) {
          return new Response("Server not configured", { status: 500 });
        }

        const textEncoder = new TextEncoder();
        const a = textEncoder.encode(provided);
        const b = textEncoder.encode(secretRow.value);
        if (a.length !== b.length) {
          return new Response("Forbidden", { status: 403 });
        }
        const { timingSafeEqual } = await import("crypto");
        if (!timingSafeEqual(a, b)) {
          return new Response("Forbidden", { status: 403 });
        }

        const { renderDbTemplate } = await import("@/lib/email-render.server");
        const { sendWhatsappTemplate } = await import("@/lib/whatsapp.server");
        const now = Date.now();

        const in30h = new Date(now + 30 * 3600_000).toISOString().slice(0, 10);
        const today = new Date(now).toISOString().slice(0, 10);
        const { data: rows, error } = await supabaseAdmin
          .from("bookings")
          .select(
            "id, name, email, phone, service, preferred_date, preferred_time, manage_token, reminder_24h_sent_at, reminder_2h_sent_at, whatsapp_24h_sent_at, whatsapp_2h_sent_at, whatsapp_opt_in, cancelled_at",
          )
          .is("cancelled_at", null)
          .gte("preferred_date", today)
          .lte("preferred_date", in30h);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

        const apiKey = process.env.LOVABLE_API_KEY;
        const { sendLovableEmail } = apiKey
          ? await import("@lovable.dev/email-js")
          : { sendLovableEmail: null as never };

        const base = (process.env.APP_URL || process.env.SITE_URL || "https://www.winlegaladvisors.com").replace(/\/$/, "");

        let sentEmails = 0;
        let sentWhatsapp = 0;
        for (const b of rows ?? []) {
          let startMs: number;
          try {
            startMs = new Date(slotToISO(b.preferred_date, b.preferred_time)).getTime();
          } catch {
            continue;
          }
          const diff = startMs - now;
          if (diff <= 0) continue;

          const inWindow24 = diff <= 24 * 3600_000 && diff > 2 * 3600_000;
          const inWindow2 = diff <= 2 * 3600_000;
          if (!inWindow24 && !inWindow2) continue;
          const which: "24h" | "2h" = inWindow2 ? "2h" : "24h";

          const gcal = googleCalendarUrl({
            title: `Legal Consultation — WIN Legal Advisors (${b.service})`,
            startISO: new Date(startMs).toISOString(),
            durationMinutes: 45,
            description: "Your legal consultation with WIN Legal Advisors.",
            location: "WIN Legal Advisors (Video call)",
          });
          const icsUrl = b.manage_token
            ? `${base}/api/public/booking-ics/${b.id}?token=${encodeURIComponent(b.manage_token)}`
            : "";
          const pdfUrl = b.manage_token
            ? `${base}/api/public/booking-pdf/${b.id}?token=${encodeURIComponent(b.manage_token)}`
            : "";
          const manageUrl = b.manage_token ? `${base}/manage-booking/${b.id}` : "";
          const statusUrl = b.manage_token
            ? `${base}/status/${b.id}?token=${encodeURIComponent(b.manage_token)}`
            : "";

          const emailFlag = which === "2h" ? b.reminder_2h_sent_at : b.reminder_24h_sent_at;
          const waFlag = which === "2h" ? b.whatsapp_2h_sent_at : b.whatsapp_24h_sent_at;

          // Email reminder
          if (!emailFlag && sendLovableEmail && apiKey) {
            // Count prior failed attempts so each retry uses a fresh idempotency
            // key (the email API rejects reusing a key from a failed send with
            // 409) and so we eventually back off instead of looping forever.
            const failedEventType = `reminder_email_${which}_failed`;
            const { count: priorFailures } = await supabaseAdmin
              .from("booking_events")
              .select("id", { count: "exact", head: true })
              .eq("booking_id", b.id)
              .eq("event_type", failedEventType);
            const attempt = (priorFailures ?? 0) + 1;
            const MAX_ATTEMPTS = 5;
            const emailBackedOff = attempt > MAX_ATTEMPTS;
            if (emailBackedOff) {
              console.warn(
                `[reminders] ${which} email for booking ${b.id} giving up after ${MAX_ATTEMPTS} failed attempts`,
              );
            }
            if (!emailBackedOff) {
              try {
                const rendered = await renderDbTemplate(
                  which === "2h" ? "booking_reminder_2h" : "booking_reminder_24h",
                  {
                    name: b.name,
                    service: b.service,
                    preferredDate: b.preferred_date,
                    preferredTime: b.preferred_time,
                    manageUrl,
                    googleCalendarUrl: gcal,
                    icsUrl,
                    pdfUrl,
                    statusUrl,
                  },
                );
                if (rendered) {
                  await sendLovableEmail(
                    {
                      to: b.email,
                      from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
                      subject: rendered.subject,
                      html: rendered.html,
                      text: rendered.text,
                      purpose: "transactional",
                      reply_to: "contact@winlegaladvisors.com",
                      idempotency_key: `booking-${b.id}-reminder-${which}-${attempt}`,
                    },
                    { apiKey },
                  );
                  const patch = which === "2h"
                    ? { reminder_2h_sent_at: new Date().toISOString() }
                    : { reminder_24h_sent_at: new Date().toISOString() };
                  await supabaseAdmin.from("bookings").update(patch).eq("id", b.id);
                  await supabaseAdmin.from("booking_events").insert({
                    booking_id: b.id,
                    event_type: `reminder_email_${which}_sent`,
                    meta: {} as never,
                  });
                  sentEmails += 1;
                }
              } catch (err) {
                console.warn(
                  `[reminders] email send failed (attempt ${attempt}/${MAX_ATTEMPTS}):`,
                  err,
                );
                await supabaseAdmin.from("booking_events").insert({
                  booking_id: b.id,
                  event_type: failedEventType,
                  meta: {
                    attempt,
                    error: err instanceof Error ? err.message : String(err),
                  } as never,
                });
              }
            }
          }

          // WhatsApp reminder (no-ops if not configured)
          if (!waFlag && b.whatsapp_opt_in && b.phone) {
            const res = await sendWhatsappTemplate({
              to: b.phone,
              templateName: which === "2h" ? "booking_reminder_2h" : "booking_reminder_24h",
              languageCode: "en_US",
              bodyParams: [
                b.name,
                b.service,
                b.preferred_date,
                b.preferred_time,
                manageUrl,
              ],
            });
            if (res.sent) {
              const patch = which === "2h"
                ? { whatsapp_2h_sent_at: new Date().toISOString() }
                : { whatsapp_24h_sent_at: new Date().toISOString() };
              await supabaseAdmin.from("bookings").update(patch).eq("id", b.id);
              await supabaseAdmin.from("booking_events").insert({
                booking_id: b.id,
                event_type: `reminder_whatsapp_${which}_sent`,
                meta: {} as never,
              });
              sentWhatsapp += 1;
            }
          }
        }

        return new Response(
          JSON.stringify({ ok: true, sentEmails, sentWhatsapp, scanned: rows?.length ?? 0 }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
