// Server-only: sends webinar registration emails (registrant confirmation +
// instant internal notification) through the Lovable email API.
import { wrapBrandShell } from "./email-render.server";
import { WEBINAR } from "./webinar.schema";

const FROM = "WIN Legal Advisors <hello@winlegaladvisors.com>";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export interface WebinarRegistrationRecord {
  id: string;
  fullName: string;
  company?: string | undefined;
  designation?: string | undefined;
  email: string;
  mobile?: string | undefined;
  website?: string | undefined;
  challenge?: string | undefined;
}

export type DeliveryStatus = "sent" | "skipped" | "failed";
export interface DeliveryResult {
  status: DeliveryStatus;
  detail: string;
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  purpose: string;
  idempotencyKey?: string;
}): Promise<DeliveryResult> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    console.warn("[webinar] LOVABLE_API_KEY missing — email skipped");
    return { status: "skipped", detail: "Email service is not configured for this project." };
  }
  try {
    const { sendLovableEmail } = await import("@lovable.dev/email-js");
    const res = (await sendLovableEmail(
      {
        to: opts.to,
        from: FROM,
        subject: opts.subject,
        html: opts.html,
        text: stripHtml(opts.html),
        purpose: "transactional",
        reply_to: "contact@winlegaladvisors.com",
        idempotency_key: opts.idempotencyKey ?? `${opts.purpose}-${opts.to}-${Date.now()}`,
      } as Parameters<typeof sendLovableEmail>[0],
      { apiKey },
    )) as { sent?: boolean; reason?: string } | undefined;

    if (res && res.sent === false) {
      return {
        status: "skipped",
        detail:
          res.reason === "recipient_suppressed"
            ? "This address previously bounced or unsubscribed, so the provider blocked delivery."
            : (res.reason ?? "The email provider did not accept this message."),
      };
    }
    return { status: "sent", detail: "Accepted by the email provider for delivery." };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.warn("[webinar] email failed:", detail);
    return { status: "failed", detail };
  }
}


export async function sendWebinarEmails(reg: WebinarRegistrationRecord, attempt = 1) {
  const detail = (label: string, value?: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#7a8299;font-size:13px;">${esc(label)}</td><td style="padding:6px 0;font-size:14px;font-weight:600;">${esc(value)}</td></tr>`
      : "";

  const attendeeHtml = wrapBrandShell({
    preview: `You're registered — ${WEBINAR.title}`,
    contentHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9a24a;">Registration confirmed</p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.3;">${esc(WEBINAR.title)}</h1>
      <p style="margin:0 0 20px;">Hi ${esc(reg.fullName)}, thank you for registering. Your seat has been confirmed.</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        ${detail("Date", WEBINAR.dateLabel)}
        ${detail("Time", WEBINAR.timeLabel)}
        ${detail("Mode", WEBINAR.mode)}
      </table>
      <p style="margin:0 0 8px;">The joining link will be emailed to you shortly before the event. Please keep an eye on this inbox.</p>
      <p style="margin:20px 0 0;color:#7a8299;font-size:13px;">Questions? Reply to this email or WhatsApp us at +91 74982 85423.</p>`,
  });

  const cumulative = await buildCumulativeReport();

  const internalHtml = wrapBrandShell({
    preview: `New webinar registration — ${reg.fullName}`,
    contentHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9a24a;">New registration</p>
      <h1 style="margin:0 0 16px;font-size:22px;">${esc(reg.fullName)}</h1>
      <table role="presentation" cellpadding="0" cellspacing="0">
        ${detail("Email", reg.email)}
        ${detail("Mobile", reg.mobile)}
        ${detail("Company", reg.company)}
        ${detail("Designation", reg.designation)}
        ${detail("Website", reg.website)}
        ${detail("Webinar", WEBINAR.title)}
      </table>
      ${reg.challenge ? `<p style="margin:16px 0 0;"><strong>Biggest compliance challenge:</strong><br/>${esc(reg.challenge)}</p>` : ""}
      ${cumulative}`,
  });

  const suffix = attempt > 1 ? `-r${attempt}` : "";
  const internalSubject = `New webinar registration: ${reg.fullName}${reg.company ? ` (${reg.company})` : ""}`;
  const [attendee, ...internalResults] = await Promise.all([
    send({
      to: reg.email,
      subject: `Registration confirmed — ${WEBINAR.title}`,
      html: attendeeHtml,
      purpose: "webinar_registration_confirmation",
      idempotencyKey: `webinar-attendee-${reg.id}${suffix}`,
    }),
    ...notifyRecipients().map((to) =>
      send({
        to,
        subject: internalSubject,
        html: internalHtml,
        purpose: "webinar_registration_notification",
        idempotencyKey: `webinar-internal-${reg.id}-${to}${suffix}`,
      }),
    ),
  ]);

  const internal: DeliveryResult =
    internalResults.find((r) => r.status === "sent") ??
    internalResults[0] ?? { status: "failed", detail: "No internal recipient configured." };

  const whatsapp = await sendWebinarWhatsapp(reg);

  return { attendee, internal, whatsapp };
}

/** Sends the WhatsApp registration confirmation to the attendee. */
export async function sendWebinarWhatsapp(reg: WebinarRegistrationRecord): Promise<DeliveryResult> {
  if (!reg.mobile) {
    return { status: "skipped", detail: "No WhatsApp number was provided." };
  }

  const { sendWhatsappTemplate } = await import("./whatsapp.server");
  const result = await sendWhatsappTemplate({
    to: reg.mobile,
    templateName: process.env.WHATSAPP_WEBINAR_TEMPLATE ?? "webinar_registration_confirmation",
    languageCode: process.env.WHATSAPP_WEBINAR_TEMPLATE_LANG ?? "en",
    bodyParams: [reg.fullName, WEBINAR.title, WEBINAR.dateLabel, WEBINAR.timeLabel],
  });

  if (result.sent) {
    return { status: "sent", detail: "Delivered to WhatsApp for the number you provided." };
  }
  if (result.skipped === "whatsapp_not_configured") {
    return { status: "skipped", detail: "WhatsApp messaging is not configured for this project yet." };
  }
  if (result.skipped === "no_phone") {
    return { status: "skipped", detail: "The WhatsApp number could not be read." };
  }
  return { status: "failed", detail: result.error ?? "WhatsApp provider did not accept the message." };
}

/** Reports whether outgoing mail is configured, for the email setup wizard. */
export async function emailInfrastructureStatus() {
  const hasApiKey = Boolean(process.env.LOVABLE_API_KEY);
  let senderDomainReachable = false;
  let detail = "Email service key is missing, so no mail can leave the app.";

  if (hasApiKey) {
    const probe = await send({
      to: WEBINAR.notifyEmail,
      subject: "WIN Legal Advisors — email delivery self-test",
      html: wrapBrandShell({
        preview: "Email delivery self-test",
        contentHtml:
          '<h1 style="margin:0 0 12px;font-size:22px;">Delivery self-test</h1><p style="margin:0;">If you are reading this, outgoing mail from the website is working.</p>',
      }),
      purpose: "email_setup_self_test",
      idempotencyKey: `email-self-test-${new Date().toISOString().slice(0, 13)}`,
    });
    senderDomainReachable = probe.status === "sent";
    detail = probe.detail;
  }

  return {
    hasApiKey,
    senderDomainReachable,
    detail,
    fromAddress: FROM,
    notifyEmail: WEBINAR.notifyEmail,
  };
}

