// Sends WhatsApp messages via Meta's Cloud API. No-ops when secrets aren't set,
// so the app keeps working before WhatsApp is configured.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api

function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/[^\d+]/g, "");
  if (!digits) return null;
  // Meta expects E.164 without leading '+'. If it starts with '+', strip it.
  // If it starts with '0' and looks like an Indian mobile (10 digits after 0), assume +91.
  if (digits.startsWith("+")) return digits.slice(1);
  if (/^\d{10}$/.test(digits)) return `91${digits}`;
  if (/^0\d{10}$/.test(digits)) return `91${digits.slice(1)}`;
  return digits;
}

interface TemplateParam {
  type: "text";
  text: string;
}

export async function sendWhatsappTemplate(opts: {
  to: string | null | undefined;
  templateName: string;
  languageCode?: string;
  bodyParams: string[];
}): Promise<{ sent: boolean; skipped?: string; error?: string }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return { sent: false, skipped: "whatsapp_not_configured" };

  const to = normalizePhone(opts.to);
  if (!to) return { sent: false, skipped: "no_phone" };

  const params: TemplateParam[] = opts.bodyParams.map((t) => ({ type: "text", text: t }));

  try {
    const resp = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: opts.templateName,
          language: { code: opts.languageCode ?? "en_US" },
          components: params.length ? [{ type: "body", parameters: params }] : [],
        },
      }),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.warn(`[whatsapp] send failed [${resp.status}]:`, body);
      return { sent: false, error: `${resp.status}: ${body.slice(0, 200)}` };
    }
    return { sent: true };
  } catch (err) {
    console.warn("[whatsapp] error:", err);
    return { sent: false, error: err instanceof Error ? err.message : String(err) };
  }
}
