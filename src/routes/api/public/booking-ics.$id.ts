import { createFileRoute } from "@tanstack/react-router";
import { buildIcs, slotToISO } from "@/lib/ics";

export const Route = createFileRoute("/api/public/booking-ics/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        if (!token) return new Response("Missing token", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("id, name, email, service, preferred_date, preferred_time, cancelled_at, manage_token")
          .eq("id", params.id)
          .maybeSingle();

        if (error || !data) return new Response("Not found", { status: 404 });
        if (data.manage_token !== token) return new Response("Forbidden", { status: 403 });

        const startISO = slotToISO(data.preferred_date, data.preferred_time);
        const ics = buildIcs({
          uid: `${data.id}@winlegaladvisors.com`,
          title: `Legal Consultation — WIN Legal Advisors (${data.service})`,
          description:
            "Your legal consultation with WIN Legal Advisors. We'll share a video call link before the appointment. Reply to your confirmation email with any documents you'd like us to review.",
          location: "WIN Legal Advisors (Video call)",
          startISO,
          durationMinutes: 45,
          organizerName: "WIN Legal Advisors",
          organizerEmail: "hello@winlegaladvisors.com",
          attendeeName: data.name,
          attendeeEmail: data.email,
          status: data.cancelled_at ? "CANCELLED" : "CONFIRMED",
          method: data.cancelled_at ? "CANCEL" : "REQUEST",
        });

        return new Response(ics, {
          status: 200,
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="win-legal-consultation-${data.id.slice(0, 8)}.ics"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
