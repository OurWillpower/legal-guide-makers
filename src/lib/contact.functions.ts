import { createServerFn } from "@tanstack/react-start";
import { contactSchema } from "./contact.schema";
import type { ContactInput } from "./contact.schema";

export type { ContactInput };

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[contact] insert failed:", error);
      throw new Error("Could not send your message. Please try again.");
    }

    try {
      const apiKey = process.env.LOVABLE_API_KEY;
      if (apiKey) {
        const [{ sendLovableEmail }, { render }, tpl] = await Promise.all([
          import("@lovable.dev/email-js"),
          import("@react-email/render"),
          import("./email-templates"),
        ]);
        const React = (await import("react")).default;
        const element = React.createElement(tpl.ContactConfirmationEmail, {
          name: data.name,
          subject: data.subject || null,
          message: data.message,
        });
        const html = await render(element);
        const text = await render(element, { plainText: true });
        await sendLovableEmail(
          {
            to: data.email,
            from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
            subject: "We received your message — WIN Legal Advisors",
            html,
            text,
            purpose: "contact_confirmation",
            reply_to: "contact@winlegaladvisors.com",
          },
          { apiKey },
        );
      }
    } catch (emailErr) {
      console.warn("[contact] confirmation email skipped:", emailErr);
    }

    return { id: row.id, ok: true };
  });
