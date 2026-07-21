import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

export const submitBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        service: data.service,
        preferred_date: data.preferredDate,
        preferred_time: data.preferredTime,
        message: data.message || null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[bookings] insert failed:", error);
      throw new Error("Could not save your request. Please try again.");
    }

    // Fire-and-forget email so a domain-not-ready state never blocks the form.
    try {
      const apiKey = process.env.LOVABLE_API_KEY;
      if (apiKey) {
        const [{ sendLovableEmail }, { render }, tpl] = await Promise.all([
          import("@lovable.dev/email-js"),
          import("@react-email/render"),
          import("./email-templates"),
        ]);
        const React = (await import("react")).default;
        const element = React.createElement(tpl.BookingConfirmationEmail, {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          company: data.company || null,
          service: data.service,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          message: data.message || null,
        });
        const html = await render(element);
        const text = await render(element, { plainText: true });
        await sendLovableEmail(
          {
            to: data.email,
            from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
            subject: "Your consultation request — WIN Legal Advisors",
            html,
            text,
            purpose: "booking_confirmation",
            reply_to: "contact@winlegaladvisors.com",
          },
          { apiKey },
        );
      }
    } catch (emailErr) {
      // Never fail the booking because email couldn't send — domain may still be verifying.
      console.warn("[bookings] confirmation email skipped:", emailErr);
    }

    return { id: row.id, ok: true };
  });
