import { createServerFn } from "@tanstack/react-start";
import { webinarRegistrationSchema, WEBINAR } from "./webinar.schema";
import type { WebinarRegistrationInput } from "./webinar.schema";

export type { WebinarRegistrationInput };

export const registerForWebinar = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => webinarRegistrationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row, error } = await supabaseAdmin
      .from("webinar_registrations")
      .insert({
        full_name: data.fullName,
        company: data.company || null,
        designation: data.designation || null,
        email: data.email,
        mobile: data.mobile || null,
        website: data.website || null,
        challenge: data.challenge || null,
        consent: true,
        webinar_slug: WEBINAR.slug,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[webinar] insert failed:", error);
      throw new Error("Could not complete your registration. Please try again.");
    }

    try {
      const { sendWebinarEmails } = await import("./webinar.server");
      await sendWebinarEmails({ id: row.id, ...data });
    } catch (emailErr) {
      console.warn("[webinar] emails skipped:", emailErr);
    }

    return { id: row.id, ok: true };
  });
