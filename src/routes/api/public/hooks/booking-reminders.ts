import { createFileRoute } from "@tanstack/react-router";
import { slotToISO, googleCalendarUrl } from "@/lib/ics";

// Called by pg_cron every 5 minutes. Sends 24h and 2h reminder emails to clients.
export const Route = createFileRoute("/api/public/hooks/booking-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Simple auth: the anon apikey is enough — this endpoint sits under
        // /api/public/* which bypasses SSR auth. The apikey header is set by pg_cron.
        const apikey = request.headers.get("apikey");
        if (!apikey || apikey !== process.env.SUPABASE_PUBLISHABLE_KEY) {
          return new Response("Forbidden", { status: 403 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const now = Date.now();

        // Pull upcoming, non-cancelled bookings in the next 30 hours.
        const in30h = new Date(now + 30 * 3600_000).toISOString().slice(0, 10);
        const today = new Date(now).toISOString().slice(0, 10);
        const { data: rows, error } = await supabaseAdmin
          .from("bookings")
          .select(
            "id, name, email, service, preferred_date, preferred_time, manage_token, reminder_24h_sent_at, reminder_2h_sent_at, cancelled_at",
          )
          .is("cancelled_at", null)
          .gte("preferred_date", today)
          .lte("preferred_date", in30h);
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response(JSON.stringify({ sent: 0, reason: "no LOVABLE_API_KEY" }));

        const [{ sendLovableEmail }, { render }, tpl, React] = await Promise.all([
          import("@lovable.dev/email-js"),
          import("@react-email/render"),
          import("@/lib/email-templates"),
          import("react").then((m) => m.default),
        ]);

        let sent = 0;
        for (const b of rows ?? []) {
          let startMs: number;
          try {
            startMs = new Date(slotToISO(b.preferred_date, b.preferred_time)).getTime();
          } catch {
            continue;
          }
          const diff = startMs - now;
          if (diff <= 0) continue;

          const need24 = diff <= 24 * 3600_000 && diff > 2 * 3600_000 && !b.reminder_24h_sent_at;
          const need2 = diff <= 2 * 3600_000 && !b.reminder_2h_sent_at;
          if (!need24 && !need2) continue;

          const which: "24h" | "2h" = need2 ? "2h" : "24h";
          const base = (process.env.APP_URL || process.env.SITE_URL || "https://www.winlegaladvisors.com").replace(/\/$/, "");
          const gcal = googleCalendarUrl({
            title: `Legal Consultation — WIN Legal Advisors (${b.service})`,
            startISO: new Date(startMs).toISOString(),
            durationMinutes: 45,
            description: "Your legal consultation with WIN Legal Advisors.",
            location: "WIN Legal Advisors (Video call)",
          });
          const icsUrl = b.manage_token
            ? `${base}/api/public/booking-ics/${b.id}?token=${encodeURIComponent(b.manage_token)}`
            : undefined;
          const pdfUrl = b.manage_token
            ? `${base}/api/public/booking-pdf/${b.id}?token=${encodeURIComponent(b.manage_token)}`
            : undefined;
          const manageUrl = b.manage_token ? `${base}/manage-booking/${b.id}` : undefined;

          const element = React.createElement(tpl.BookingReminderEmail, {
            name: b.name,
            service: b.service,
            preferredDate: b.preferred_date,
            preferredTime: b.preferred_time,
            when: which,
            googleCalendarUrl: gcal,
            icsUrl,
            manageUrl,
            pdfUrl,
          });
          const html = await render(element);
          const text = await render(element, { plainText: true });
          const subject =
            which === "2h"
              ? "Reminder: your consultation is in ~2 hours — WIN Legal Advisors"
              : "Reminder: your consultation is tomorrow — WIN Legal Advisors";

          try {
            await sendLovableEmail(
              {
                to: b.email,
                from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
                subject,
                html,
                text,
                purpose: "booking_reminder",
                reply_to: "contact@winlegaladvisors.com",
              },
              { apiKey },
            );
            if (which === "2h") {
              await supabaseAdmin
                .from("bookings")
                .update({ reminder_2h_sent_at: new Date().toISOString() })
                .eq("id", b.id);
            } else {
              await supabaseAdmin
                .from("bookings")
                .update({ reminder_24h_sent_at: new Date().toISOString() })
                .eq("id", b.id);
            }
            sent += 1;
          } catch (err) {
            console.warn("[reminders] send failed:", err);
          }
        }

        return new Response(JSON.stringify({ ok: true, sent, scanned: rows?.length ?? 0 }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
