import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { webinarRegistrationSchema, WEBINAR } from "./webinar.schema";
import type { WebinarRegistrationInput } from "./webinar.schema";

export type { WebinarRegistrationInput };

export type EmailDelivery = { status: "sent" | "skipped" | "failed"; detail: string };

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

    let delivery: { attendee: EmailDelivery; internal: EmailDelivery } = {
      attendee: { status: "failed", detail: "Email could not be attempted." },
      internal: { status: "failed", detail: "Email could not be attempted." },
    };
    try {
      const { sendWebinarEmails } = await import("./webinar.server");
      delivery = await sendWebinarEmails({ id: row.id, ...data });
    } catch (emailErr) {
      const detail = emailErr instanceof Error ? emailErr.message : String(emailErr);
      delivery = { attendee: { status: "failed", detail }, internal: { status: "failed", detail } };
    }

    return { id: row.id, ok: true, delivery };
  });

/** Re-sends the confirmation to an already-registered address. */
export const resendWebinarConfirmation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ email: z.string().trim().email("Enter the email you registered with").max(254) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("webinar_registrations")
      .select("id, full_name, company, designation, email, mobile, website, challenge")
      .eq("email", data.email)
      .eq("webinar_slug", WEBINAR.slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      return {
        found: false,
        delivery: null as null | { attendee: EmailDelivery; internal: EmailDelivery },
      };
    }

    const { sendWebinarEmails } = await import("./webinar.server");
    const delivery = await sendWebinarEmails(
      {
        id: row.id,
        fullName: row.full_name,
        company: row.company ?? undefined,
        designation: row.designation ?? undefined,
        email: row.email,
        mobile: row.mobile ?? undefined,
        website: row.website ?? undefined,
        challenge: row.challenge ?? undefined,
      },
      Math.floor(Date.now() / 1000),
    );

    return { found: true, delivery };
  });

/** Powers the email setup wizard's live readiness checks. */
export const checkEmailSetup = createServerFn({ method: "POST" }).handler(async () => {
  const { emailInfrastructureStatus } = await import("./webinar.server");
  return emailInfrastructureStatus();
});
