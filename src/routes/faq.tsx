import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { ArrowLeft } from "lucide-react";

const faqs = [
  {
    q: "Do you offer a free initial consultation?",
    a: "Yes — every prospective client gets a complimentary 30–45 minute consultation to understand your needs and outline how WIN Legal Advisors can help.",
  },
  {
    q: "Which industries do you work with?",
    a: "We advise SaaS and technology companies, fintech, healthcare, D2C brands, manufacturing, professional services, and early-stage startups across India.",
  },
  {
    q: "Do you handle DPDP Act (Digital Personal Data Protection) readiness?",
    a: "Yes. We deliver end-to-end DPDP readiness — gap assessments, consent frameworks, privacy notices, DPO advisory, cross-border data workflows, and staff training.",
  },
  {
    q: "Can WIN Legal Advisors represent us in court?",
    a: "Yes. Our litigation team represents clients before High Courts, tribunals, and arbitral forums across India for commercial and regulatory disputes.",
  },
  {
    q: "How is pricing structured?",
    a: "We offer transparent engagement models — fixed-fee packages for defined scopes (like DPDP readiness, incorporation, or contract templates), monthly retainers for ongoing counsel, and hourly rates for advisory work.",
  },
  {
    q: "Where are you based?",
    a: "WIN Legal Advisors is headquartered in India with a Pan-India presence. We serve clients across the country and support cross-border engagements.",
  },
  {
    q: "Can I reschedule or cancel my booked consultation?",
    a: "Yes. Sign in to your account and open the booking to reschedule or cancel any time before the appointment.",
  },
];

export const Route = createFileRoute("/faq")({
  component: FAQ,
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — WIN Legal Advisors" },
      {
        name: "description",
        content:
          "Common questions about consultations, industries served, DPDP compliance, litigation, pricing, and how to work with WIN Legal Advisors.",
      },
      { property: "og:title", content: "FAQ — WIN Legal Advisors" },
      { property: "og:description", content: "Answers to common questions about WIN Legal Advisors." },
      { property: "og:url", content: "/faq" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
});

function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">FAQ</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you'd want to know before working with us.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-navy/10 bg-cream/40 p-5 open:border-gold open:bg-cream"
            >
              <summary className="cursor-pointer list-none font-serif text-lg font-semibold text-navy-deep marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-navy-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </main>
    </div>
  );
}
