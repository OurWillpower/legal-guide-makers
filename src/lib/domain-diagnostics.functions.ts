import { createServerFn } from "@tanstack/react-start";

export type CheckStatus = "pass" | "fail" | "warn";

export type DiagnosticCheck = {
  id: string;
  step: number;
  title: string;
  status: CheckStatus;
  detail: string;
  expected?: string;
  actual?: string;
  action?: string;
};

const APEX = "winlegaladvisors.com";
const WWW = "www.winlegaladvisors.com";
const LOVABLE_IP = "185.158.133.1";
const VERIFY_TOKEN =
  "lovable_verify=416e5229439a6c27878d59f26d7a095a2efb676dbfc53d720a11bfbd47d9ba83";

type DohAnswer = { name: string; type: number; data: string };

async function resolve(name: string, type: "A" | "TXT" | "CNAME" | "CAA"): Promise<string[]> {
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
      { headers: { accept: "application/dns-json" } },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as { Answer?: DohAnswer[] };
    return (json.Answer ?? []).map((a) => a.data.replace(/^"|"$/g, "").trim());
  } catch {
    return [];
  }
}

type TlsResult = { ok: boolean; status?: number; error?: string; redirect?: string | null };

async function probeHttps(host: string): Promise<TlsResult> {
  try {
    const res = await fetch(`https://${host}/`, { redirect: "manual" });
    return { ok: true, status: res.status, redirect: res.headers.get("location") };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export const runDomainDiagnostics = createServerFn({ method: "GET" }).handler(async () => {
  const [apexA, wwwA, wwwCname, txtRoot, txtLovable, caa, apexTls, wwwTls] = await Promise.all([
    resolve(APEX, "A"),
    resolve(WWW, "A"),
    resolve(WWW, "CNAME"),
    resolve(APEX, "TXT"),
    resolve(`_lovable.${APEX}`, "TXT"),
    resolve(APEX, "CAA"),
    probeHttps(APEX),
    probeHttps(WWW),
  ]);

  const checks: DiagnosticCheck[] = [];

  const apexOk = apexA.includes(LOVABLE_IP);
  checks.push({
    id: "apex-a",
    step: 1,
    title: "Apex A record points to Lovable",
    status: apexOk ? "pass" : "fail",
    expected: LOVABLE_IP,
    actual: apexA.join(", ") || "no A record",
    detail: apexOk
      ? "The root domain resolves to Lovable's edge."
      : "The root domain does not resolve to Lovable's edge, so no certificate can be issued.",
    action: apexOk ? undefined : `Set an A record: @ → ${LOVABLE_IP} and remove any other A records.`,
  });

  const wwwOk = wwwA.includes(LOVABLE_IP);
  checks.push({
    id: "www-a",
    step: 2,
    title: "www A record points to Lovable",
    status: wwwOk ? "pass" : "fail",
    expected: LOVABLE_IP,
    actual: wwwA.join(", ") || "no A record",
    detail: wwwOk
      ? "www resolves to Lovable's edge."
      : "www does not resolve to Lovable's edge.",
    action: wwwOk ? undefined : `Set an A record: www → ${LOVABLE_IP}.`,
  });

  const staleCname = wwwCname.filter((c) => !c.includes("lovable"));
  checks.push({
    id: "stale-bindings",
    step: 3,
    title: "No stale or conflicting host bindings",
    status: staleCname.length ? "fail" : "pass",
    expected: "no CNAME on www while using A-record mode",
    actual: wwwCname.join(", ") || "none",
    detail: staleCname.length
      ? "A leftover CNAME (e.g. from GitHub Pages or a previous host) is still bound to www. Conflicting bindings are the usual cause of 409 (host already claimed) and 421 (misdirected request) responses that survive DNS changes."
      : "No competing CNAME binding on www. A-record mode is clean.",
    action: staleCname.length
      ? "Delete the CNAME on www at your registrar. A host cannot have both a CNAME and an A record."
      : undefined,
  });

  const verifyOk = [...txtRoot, ...txtLovable].some((t) => t === VERIFY_TOKEN);
  checks.push({
    id: "verify-txt",
    step: 4,
    title: "Lovable ownership TXT record is published",
    status: verifyOk ? "pass" : "fail",
    expected: VERIFY_TOKEN,
    actual: [...txtLovable, ...txtRoot].join(" | ") || "none",
    detail: verifyOk
      ? "Ownership verification token is live in DNS."
      : "Lovable cannot verify ownership without the exact token on _lovable.",
    action: verifyOk ? undefined : `Add TXT record: _lovable → ${VERIFY_TOKEN}`,
  });

  const caaBlocks =
    caa.length > 0 && !caa.some((r) => /letsencrypt\.org|pki\.goog|;/i.test(r));
  checks.push({
    id: "caa",
    step: 5,
    title: "CAA records allow certificate issuance",
    status: caa.length === 0 ? "pass" : caaBlocks ? "fail" : "warn",
    expected: "no CAA, or one that permits letsencrypt.org",
    actual: caa.join(", ") || "none",
    detail:
      caa.length === 0
        ? "No CAA restrictions — any trusted CA may issue."
        : caaBlocks
          ? "Your CAA records block Let's Encrypt, so SSL provisioning will keep failing even with perfect DNS."
          : "CAA records exist; confirm they include letsencrypt.org.",
    action: caaBlocks ? 'Add: CAA @ 0 issue "letsencrypt.org" (or remove the CAA records).' : undefined,
  });

  const tlsHandshakeFailed = (r: TlsResult) =>
    !r.ok && /handshake|ssl|tls|certificate|cipher/i.test(r.error ?? "");

  const wwwTlsOk = wwwTls.ok;
  checks.push({
    id: "www-ssl",
    step: 6,
    title: "HTTPS certificate issued for www",
    status: wwwTlsOk ? "pass" : "fail",
    expected: "TLS handshake succeeds",
    actual: wwwTls.ok ? `HTTP ${wwwTls.status}` : (wwwTls.error ?? "connection failed"),
    detail: wwwTlsOk
      ? "A valid certificate is being served for www."
      : tlsHandshakeFailed(wwwTls)
        ? "DNS resolves to Lovable but the TLS handshake is rejected — this means no certificate has been provisioned yet, which happens when the domain is not attached (or not yet Active) on the Lovable project."
        : "www is not reachable over HTTPS yet.",
    action: wwwTlsOk
      ? undefined
      : "In Project Settings → Domains, add www.winlegaladvisors.com (A-record mode, proxy unchecked), remove any older/duplicate entry for the same host first, then click Complete setup / Retry.",
  });

  const apexRedirects =
    apexTls.ok && apexTls.status! >= 300 && apexTls.status! < 400 && !!apexTls.redirect;
  checks.push({
    id: "apex-redirect",
    step: 7,
    title: "Apex redirects to www over HTTPS",
    status: apexTls.ok ? (apexRedirects ? "pass" : "warn") : "fail",
    expected: `301 → https://${WWW}/`,
    actual: apexTls.ok
      ? `HTTP ${apexTls.status}${apexTls.redirect ? ` → ${apexTls.redirect}` : ""}`
      : (apexTls.error ?? "connection failed"),
    detail: apexTls.ok
      ? apexRedirects
        ? "The root domain redirects to the primary www hostname."
        : "The root domain serves directly instead of redirecting to www."
      : "The root domain has no working certificate yet.",
    action: apexRedirects
      ? undefined
      : `Add ${APEX} as a second domain entry and set ${WWW} as Primary so the apex 301-redirects to it.`,
  });

  const failing = checks.filter((c) => c.status === "fail");
  const summary =
    failing.length === 0
      ? "All checks pass — the custom domain is connected and serving over HTTPS."
      : `${failing.length} blocking issue${failing.length > 1 ? "s" : ""} found. Start with step ${failing[0].step}: ${failing[0].title}.`;

  return { checkedAt: new Date().toISOString(), checks, summary, allPass: failing.length === 0 };
});
