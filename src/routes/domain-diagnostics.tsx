import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runDomainDiagnostics, type DiagnosticCheck } from "@/lib/domain-diagnostics.functions";

export const Route = createFileRoute("/domain-diagnostics")({
  component: DomainDiagnostics,
  head: () => ({
    meta: [
      { title: "Domain & SSL Diagnostics — WIN Legal Advisors" },
      {
        name: "description",
        content:
          "Internal diagnostics panel for winlegaladvisors.com: DNS records, stale host bindings, certificate issuance and apex-to-www redirect status.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Domain & SSL Diagnostics — WIN Legal Advisors" },
      {
        property: "og:description",
        content: "Step-by-step connection and SSL diagnostics for the WIN Legal Advisors custom domain.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const statusStyles: Record<DiagnosticCheck["status"], { ring: string; chip: string; label: string }> = {
  pass: { ring: "border-emerald-600/30", chip: "bg-emerald-600/10 text-emerald-700", label: "Pass" },
  warn: { ring: "border-gold/40", chip: "bg-gold/15 text-navy-deep", label: "Check" },
  fail: { ring: "border-destructive/40", chip: "bg-destructive/10 text-destructive", label: "Blocking" },
};

function StatusIcon({ status }: { status: DiagnosticCheck["status"] }) {
  if (status === "pass") return <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />;
  if (status === "warn") return <AlertTriangle className="h-5 w-5 text-gold" aria-hidden />;
  return <XCircle className="h-5 w-5 text-destructive" aria-hidden />;
}

function DomainDiagnostics() {
  const run = useServerFn(runDomainDiagnostics);
  const { data, isFetching, refetch, error } = useQuery({
    queryKey: ["domain-diagnostics"],
    queryFn: () => run({}),
    refetchOnWindowFocus: false,
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-background px-6 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy-deep"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to home
        </Link>

        <header className="mt-6">
          <h1 className="font-serif text-3xl font-bold text-navy-deep sm:text-4xl">
            Domain &amp; SSL diagnostics
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Live checks for <strong>winlegaladvisors.com</strong> — DNS records, leftover host
            bindings from previous providers, certificate issuance, and the apex → www redirect.
            Each failing step tells you exactly what to change next.
          </p>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-gradient-navy hover:opacity-95"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden />
            {isFetching ? "Running checks…" : "Re-run diagnostics"}
          </Button>
          {data && (
            <span className="text-xs text-muted-foreground">
              Last checked {new Date(data.checkedAt).toLocaleString()}
            </span>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm text-destructive">
            Could not run diagnostics: {(error as Error).message}
          </p>
        )}

        {data && (
          <div
            className={`mt-6 rounded-xl border p-5 ${
              data.allPass ? "border-emerald-600/30 bg-emerald-600/5" : "border-destructive/30 bg-destructive/5"
            }`}
          >
            <p className="font-medium text-navy-deep">{data.summary}</p>
          </div>
        )}

        <ol className="mt-8 space-y-4">
          {(data?.checks ?? []).map((check) => {
            const s = statusStyles[check.status];
            return (
              <li
                key={check.id}
                className={`rounded-2xl border bg-background p-6 shadow-elegant ${s.ring}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <StatusIcon status={check.status} />
                  <h2 className="font-serif text-lg font-semibold text-navy-deep">
                    Step {check.step}. {check.title}
                  </h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.chip}`}>
                    {s.label}
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{check.detail}</p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-cream/60 p-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Expected</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-navy-deep">
                      {check.expected ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-cream/60 p-3">
                    <dt className="text-xs uppercase tracking-wide text-muted-foreground">Found</dt>
                    <dd className="mt-1 break-all font-mono text-xs text-navy-deep">
                      {check.actual ?? "—"}
                    </dd>
                  </div>
                </dl>
                {check.action && (
                  <p className="mt-4 rounded-lg border border-gold/40 bg-gold/10 p-3 text-sm text-navy-deep">
                    <strong>Next action:</strong> {check.action}
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        <section className="mt-10 rounded-2xl border border-navy/10 bg-background p-6">
          <h2 className="font-serif text-xl font-semibold text-navy-deep">
            Clearing stale bindings (409 / 421 errors)
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
            <li>
              At your registrar, delete every record for <code>@</code> and <code>www</code> that is
              not the Lovable A record — old GitHub Pages A records, <code>*.github.io</code> CNAMEs,
              parking records and duplicate ALIAS entries all claim the same host.
            </li>
            <li>
              In Project Settings → Domains, remove any existing entry for the same hostname before
              re-adding it. A hostname already claimed by an older binding returns 409 on setup and
              421 at the edge.
            </li>
            <li>
              Re-add <code>www.winlegaladvisors.com</code> and <code>winlegaladvisors.com</code> in
              A-record mode with the proxy option unchecked, then set www as Primary.
            </li>
            <li>Re-run the diagnostics above until every step passes.</li>
          </ol>
        </section>
      </div>
    </main>
  );
}
