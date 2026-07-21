// Renders DB-editable email templates. Admins edit HTML + subject with {{var}}
// tokens in `email_templates`; we interpolate and wrap in a shared brand shell.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const NAVY = "#0f1930";
const NAVY_SOFT = "#1a2a4a";
const GOLD = "#c9a24a";
const CREAM = "#faf8f2";

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k: string) => {
    const v = data[k];
    return v == null ? "" : String(v);
  });
}

export function wrapBrandShell(opts: { preview: string; contentHtml: string }): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width"/><title>${escape(opts.preview)}</title></head>
<body style="margin:0;padding:0;background:#f4f2ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${NAVY};">
<div style="display:none;opacity:0;max-height:0;overflow:hidden">${escape(opts.preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec;padding:32px 0;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:${CREAM};border-radius:12px;overflow:hidden;border:1px solid ${GOLD}33;">
<tr><td style="background:${NAVY};padding:28px 32px;text-align:center;">
<div style="font-family:'Playfair Display',Georgia,serif;font-size:28px;font-weight:700;color:${GOLD};letter-spacing:2px;">WIN</div>
<div style="font-size:11px;text-transform:uppercase;letter-spacing:4px;color:${CREAM};margin-top:6px;">Legal Advisors — Vision to Victory</div>
</td></tr>
<tr><td style="padding:36px 40px;color:${NAVY};font-size:15px;line-height:1.6;">${opts.contentHtml}</td></tr>
<tr><td style="background:${NAVY_SOFT};padding:20px 32px;text-align:center;color:${CREAM};font-size:12px;">
<div>WIN Legal Advisors · www.winlegaladvisors.com</div>
<div style="margin-top:4px;color:#7a8299;">Corporate · Compliance · Contracts · DPDP · IPR</div>
</td></tr></table></td></tr></table></body></html>`;
}

function textFallback(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function renderDbTemplate(
  templateKey: string,
  data: Record<string, unknown>,
): Promise<{ subject: string; html: string; text: string } | null> {
  const { data: tpl } = await supabaseAdmin
    .from("email_templates")
    .select("subject, html, text")
    .eq("template_key", templateKey)
    .maybeSingle();
  if (!tpl) return null;
  const subject = interpolate(tpl.subject, data);
  const innerHtml = interpolate(tpl.html, data);
  const html = wrapBrandShell({ preview: subject, contentHtml: innerHtml });
  const text = tpl.text ? interpolate(tpl.text, data) : textFallback(innerHtml);
  return { subject, html, text };
}
