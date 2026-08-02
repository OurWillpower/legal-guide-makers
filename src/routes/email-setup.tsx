import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Globe, KeyRound, Mail, Send, XCircle } from "lucide-react";
import { checkEmailSetup } from "@/lib/webinar.functions";

const TITLE = "Email Setup Wizard | WIN Legal Advisors";
const DESCRIPTION =
  "Step-by-step wizard to configure the WIN Legal Advisors sender domain and verify outgoing mail delivery for registrations and booking confirmations.";

export const Route = createFileRoute("/email-setup")({
  component: EmailSetupPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Status = Awaited<ReturnType<typeof checkEmailSetup>>;

const steps = [
  {
    icon: Globe,
    title: "1. Own the sender domain",
    body: "Outgoing mail must come from a domain you control — winlegaladvisors.com. There is no shared or free sender address; every email is signed as your brand.",
  },
  {
    icon: KeyRound,
    title: "2. Delegate the mail subdomain",
    body: "A dedicated subdomain (for example notify.winlegaladvisors.com) is delegated with NS records at your registrar. SPF, DKIM and MX records are then managed for you inside that zone.",
  },
  {
    icon: Mail,
    title: "3. Wait for verification",
    body: "DNS propagation can take up to 72 hours. Until the domain is verified, every send is refused by the provider and nothing reaches the inbox — this is exactly why the masterclass confirmations went missing.",
  },
  {
    icon: Send,
    title: "4. Run the delivery self-test",
    body: "Once verified, run the live check below. It attempts a real send and reports the provider's own response instead of failing silently.",
  },
];

function EmailSetupPage() {
  const check = useServerFn(checkEmailSetup);
  const [status, setStatus] = useState<Status | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCheck() {
    setRunning(true);
    setError(null);
    try {
      setStatus(await check({ data: undefined }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not run the check.");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy/70 hover:text-gold">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <h1 className="mt-6 font-serif text-4xl font-bold text-navy">Email Setup Wizard</h1>
        <p className="mt-3 max-w-2xl text-navy/70">
          Everything required for the website to send registration confirmations, booking emails and reminders —
          and a live test that shows exactly where delivery stands.
        </p>

        <ol className="mt-10 space-y-4">
          {steps.map((s) => (
            <li key={s.title} className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                <s.icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-lg font-bold text-navy">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-navy/70">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-10 rounded-2xl border border-gold/40 bg-navy-deep p-8 text-cream">
          <h2 className="font-serif text-2xl font-bold text-gold">Live delivery check</h2>
          <p className="mt-2 text-sm text-cream/75">
            Sends a real test message to the practice inbox and reports the provider's response verbatim.
          </p>

          <button
            type="button"
            onClick={runCheck}
            disabled={running}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-navy-deep transition hover:brightness-105 disabled:opacity-60"
          >
            {running ? "Checking…" : "Run delivery check"}
            {!running && <Send className="h-4 w-4" />}
          </button>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

          {status && (
            <div className="mt-6 space-y-3 text-sm">
              <Row ok={status.hasApiKey} label="Email service key configured" />
              <Row ok={status.senderDomainReachable} label="Sender domain verified and accepting mail" />
              <p className="rounded-xl border border-cream/15 bg-white/5 p-4 text-cream/80">
                <span className="font-semibold text-gold">Provider response:</span> {status.detail}
              </p>
              <p className="text-cream/60">
                From address: {status.fromAddress} · Notifications to: {status.notifyEmail}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function Row({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {ok ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-300" />
      ) : (
        <XCircle className="h-5 w-5 text-red-300" />
      )}
      <span className={ok ? "text-cream/90" : "text-cream/70"}>{label}</span>
      {!ok && <AlertTriangle className="h-4 w-4 text-amber-300" />}
    </div>
  );
}
