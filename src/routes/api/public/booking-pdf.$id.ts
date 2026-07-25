import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/booking-pdf/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token");
        if (!token) return new Response("Missing token", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select(
            "id, name, email, phone, company, service, preferred_date, preferred_time, message, status, cancelled_at, created_at, manage_token, payment_status, payment_amount, payment_currency, payment_reference",
          )
          .eq("id", params.id)
          .maybeSingle();

        if (error || !data) return new Response("Not found", { status: 404 });
        if (data.manage_token !== token) return new Response("Forbidden", { status: 403 });

        const { generateBookingPdf } = await import("@/lib/booking-pdf");
        const pdf = await generateBookingPdf({
          bookingId: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          service: data.service,
          preferredDate: data.preferred_date,
          preferredTime: data.preferred_time,
          message: data.message,
          status: data.status,
          cancelledAt: data.cancelled_at,
          createdAt: data.created_at,
          paymentStatus: (data as { payment_status?: string }).payment_status ?? "complimentary",
          paymentAmount: (data as { payment_amount?: number }).payment_amount ?? 0,
          paymentCurrency: (data as { payment_currency?: string }).payment_currency ?? "INR",
          paymentReference: (data as { payment_reference?: string | null }).payment_reference ?? null,
        });

        return new Response(new Uint8Array(pdf).buffer as ArrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="win-legal-booking-${data.id.slice(0, 8)}.pdf"`,
            "Cache-Control": "no-store",
          },
        });
      },
    },
  },
});
