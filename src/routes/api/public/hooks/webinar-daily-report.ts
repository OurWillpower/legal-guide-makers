import { createFileRoute } from "@tanstack/react-router";

// Called by pg_cron daily at 19:00 IST (13:30 UTC).
// Emails a CSV report of new webinar registrations to the practice inbox.
export const Route = createFileRoute("/api/public/hooks/webinar-daily-report")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const provided =
          request.headers.get("x-cron-secret") ??
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
          "";

        const { data: secretRow, error: secretErr } = await supabaseAdmin
          .from("internal_secrets")
          .select("value")
          .eq("name", "cron_webhook_secret")
          .maybeSingle();
        if (secretErr || !secretRow?.value) {
          return new Response("Server not configured", { status: 500 });
        }
        const enc = new TextEncoder();
        const a = enc.encode(provided);
        const b = enc.encode(secretRow.value);
        if (a.length !== b.length) return new Response("Forbidden", { status: 403 });
        const { timingSafeEqual } = await import("crypto");
        if (!timingSafeEqual(a, b)) return new Response("Forbidden", { status: 403 });

        const { WEBINAR } = await import("@/lib/webinar.schema");

        const { data: rows, error } = await supabaseAdmin
          .from("webinar_registrations")
          .select(
            "id, full_name, company, designation, email, mobile, website, challenge, created_at",
          )
          .is("reported_at", null)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("[webinar-report] query failed:", error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
        if (!rows || rows.length === 0) {
          return Response.json({ ok: true, count: 0, note: "no new registrations" });
        }

        const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const header = [
          "Registered At (IST)",
          "Full Name",
          "Company",
          "Designation",
          "Email",
          "Mobile",
          "Website",
          "Biggest Compliance Challenge",
        ];
        const csv = [
          header.map(cell).join(","),
          ...rows.map((r) =>
            [
              new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
              r.full_name,
              r.company,
              r.designation,
              r.email,
              r.mobile,
              r.website,
              r.challenge,
            ]
              .map(cell)
              .join(","),
          ),
        ].join("\r\n");

        const dateLabel = new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });
        const apiKey = process.env.LOVABLE_API_KEY;
        let emailed = false;

        if (apiKey) {
          try {
            const { wrapBrandShell } = await import("@/lib/email-render.server");
            const { sendLovableEmail } = await import("@lovable.dev/email-js");
            const esc = (s: string) =>
              s.replace(/[&<>"']/g, (c) =>
                ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
                  c
                ] as string,
              );
            const list = rows
              .map(
                (r) =>
                  `<tr><td style="padding:6px 12px 6px 0;font-size:13px;">${esc(r.full_name)}</td><td style="padding:6px 12px 6px 0;font-size:13px;">${esc(r.company ?? "—")}</td><td style="padding:6px 0;font-size:13px;">${esc(r.email)}</td></tr>`,
              )
              .join("");
            const html = wrapBrandShell({
              preview: `${rows.length} new webinar registrations — ${dateLabel}`,
              contentHtml: `
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c9a24a;">Daily report</p>
                <h1 style="margin:0 0 12px;font-size:22px;">${rows.length} new registration${rows.length === 1 ? "" : "s"}</h1>
                <p style="margin:0 0 16px;">Masterclass: ${esc(WEBINAR.title)} — ${dateLabel}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">${list}</table>
                <p style="margin:20px 0 0;color:#7a8299;font-size:12px;">A CSV of the same data is attached below as plain text for spreadsheet import.</p>
                <pre style="margin:12px 0 0;padding:12px;background:#fff;border:1px solid #e5e1d6;border-radius:8px;font-size:11px;white-space:pre-wrap;">${esc(csv)}</pre>`,
            });

            await sendLovableEmail(
              {
                to: WEBINAR.notifyEmail,
                from: "WIN Legal Advisors <hello@winlegaladvisors.com>",
                subject: `Webinar registrations — ${dateLabel} (${rows.length})`,
                html,
                text: csv,
                purpose: "webinar_daily_report",
                idempotency_key: `webinar-report-${new Date().toISOString().slice(0, 10)}`,
              } as Parameters<typeof sendLovableEmail>[0],
              { apiKey },
            );
            emailed = true;
          } catch (err) {
            console.error("[webinar-report] email failed:", err);
          }
        }

        if (emailed) {
          const { error: markErr } = await supabaseAdmin
            .from("webinar_registrations")
            .update({ reported_at: new Date().toISOString() })
            .in(
              "id",
              rows.map((r) => r.id),
            );
          if (markErr) console.error("[webinar-report] mark failed:", markErr);
        }

        return Response.json({ ok: true, count: rows.length, emailed });
      },
    },
  },
});
