import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

const logo = logoAsset.url;

export const Route = createFileRoute("/articles/dpdp")({
  component: DpdpArticles,
  head: () => ({
    meta: [
      { title: "DPDP Act Articles & Insights | WIN Legal Advisors" },
      {
        name: "description",
        content:
          "Practical guides on India's Digital Personal Data Protection (DPDP) Act — compliance checklists, consent, data principal rights, breach response and more.",
      },
      { property: "og:title", content: "DPDP Act Articles & Insights | WIN Legal Advisors" },
      {
        property: "og:description",
        content:
          "In-depth articles on DPDP Act compliance for Indian businesses, by Adv. Vrushali Borade.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WIN Legal Advisors" },
      { property: "og:url", content: "https://www.winlegaladvisors.com/articles/dpdp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DPDP Act Articles & Insights" },
      {
        name: "twitter:description",
        content: "Practical DPDP Act guides for founders, GCs and compliance teams.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://www.winlegaladvisors.com/articles/dpdp" },
    ],
  }),
});

const articles = [
  {
    slug: "dpdp-act-overview",
    title: "The DPDP Act 2023: A Founder's Overview",
    date: "March 12, 2025",
    readTime: "6 min read",
    excerpt:
      "A plain-English walkthrough of India's Digital Personal Data Protection Act — who it applies to, what changes, and what founders must do first.",
    body: [
      "The Digital Personal Data Protection Act, 2023 (DPDP Act) is India's first comprehensive data protection law. It applies to any business — Indian or foreign — that processes the digital personal data of individuals in India.",
      "At its core, the Act introduces a consent-first regime. Businesses (called 'Data Fiduciaries') must obtain clear, informed and specific consent before processing personal data, and must give individuals ('Data Principals') the ability to access, correct, erase and grievance-redress their data.",
      "For founders, the immediate priorities are: (1) mapping what personal data you collect and why, (2) refreshing your privacy notice and consent flows, (3) appointing a grievance officer, and (4) putting a breach-response playbook in place. Penalties can reach ₹250 crore per instance — compliance is a board-level concern, not an IT ticket.",
    ],
  },
  {
    slug: "consent-notice-checklist",
    title: "DPDP Consent & Notice: A Practical Checklist",
    date: "March 18, 2025",
    readTime: "5 min read",
    excerpt:
      "How to draft a DPDP-compliant notice and consent flow — with the seven elements every notice must contain.",
    body: [
      "Under Section 5 of the DPDP Act, every notice served to a Data Principal must be clear, in plain language, and available in English plus any of the 22 languages listed in the Eighth Schedule.",
      "A compliant notice must state: the personal data being collected, the specific purpose, the manner of exercising rights, the grievance redressal mechanism, and the way to withdraw consent. Consent must be free, specific, informed, unconditional and unambiguous — bundled consents and pre-ticked boxes are non-starters.",
      "Practical tip: separate marketing consent from service consent, and log the exact notice version each user consented to. Regulators will ask for this trail.",
    ],
  },
  {
    slug: "data-principal-rights",
    title: "Rights of Data Principals — And How to Honour Them",
    date: "March 25, 2025",
    readTime: "4 min read",
    excerpt:
      "Access, correction, erasure, grievance redressal and nomination — what each right means and the SLAs you should design for.",
    body: [
      "The DPDP Act grants Data Principals five key rights: right to information about processing, right to correction and erasure, right to grievance redressal, right to nominate, and the right to withdraw consent as easily as it was given.",
      "Operationally, you need a user-facing rights portal (or email intake) with acknowledged turnaround times. We recommend an internal SLA of 7 days for access requests and 30 days for erasure requests, with an audit log for every action.",
      "Remember: if you refuse a request, you must give reasons in writing, and the Data Principal can escalate to the Data Protection Board of India.",
    ],
  },
  {
    slug: "cross-border-transfers",
    title: "Cross-Border Data Transfers Under the DPDP Act",
    date: "April 2, 2025",
    readTime: "5 min read",
    excerpt:
      "The DPDP Act flips the model — transfers are allowed by default, except to notified 'negative-list' countries. Here's how to prepare.",
    body: [
      "Unlike the GDPR, the DPDP Act adopts a negative-list approach: cross-border transfers are permitted unless the Central Government notifies a specific country as restricted.",
      "That said, sectoral regulators (RBI, IRDAI, SEBI) continue to impose data localisation on regulated entities. Your inter-company data-sharing agreements, standard contractual clauses and vendor DPAs should reference both the DPDP Act and applicable sectoral rules.",
      "Action item: maintain a live 'data transfer register' showing every third-party processor, its location, the categories of data shared, and the safeguards in place.",
    ],
  },
  {
    slug: "breach-response",
    title: "Personal Data Breaches: A 72-Hour Playbook",
    date: "April 9, 2025",
    readTime: "6 min read",
    excerpt:
      "Every Data Fiduciary must notify the Data Protection Board and affected Data Principals of a breach. Here's the workflow to build now.",
    body: [
      "The DPDP Act requires prompt notification of personal data breaches to both the Data Protection Board of India and each affected Data Principal — regardless of severity.",
      "Build a breach-response playbook that covers detection, containment, forensic assessment, regulator notification, user communication and post-incident review. Assign named owners and rehearse it at least twice a year.",
      "Notification content should include the nature of the breach, categories and approximate number of records affected, likely consequences, mitigation measures taken, and the point of contact for further information.",
    ],
  },
  {
    slug: "significant-data-fiduciary",
    title: "Are You a Significant Data Fiduciary?",
    date: "April 16, 2025",
    readTime: "4 min read",
    excerpt:
      "The government can designate companies as SDFs based on volume, sensitivity and risk — triggering additional obligations. Understand the threshold.",
    body: [
      "A Significant Data Fiduciary (SDF) faces heightened obligations: appointment of a Data Protection Officer based in India, an independent data auditor, periodic Data Protection Impact Assessments, and independent audits.",
      "Designation is based on factors including the volume and sensitivity of data processed, risk to Data Principal rights, potential impact on India's sovereignty and public order, and risk to electoral democracy.",
      "Even if you aren't formally designated, adopting SDF-grade governance early is a strong signal to investors, enterprise buyers and regulators. It's also cheaper than retrofitting later.",
    ],
  },
];

function DpdpArticles() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="WIN Legal Advisors" className="h-11 w-auto" width={220} height={98} />
          </Link>
          <Link
            to="/booking"
            className="hidden items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03] md:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            Book Consultation
          </Link>
        </div>
      </header>

      <section className="bg-gradient-navy text-cream">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              DPDP Insights
            </span>
          </div>
          <h1 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
            Articles on the <span className="text-gold-gradient">DPDP Act</span>
          </h1>
          <p className="mt-4 max-w-2xl text-cream/75">
            Practical, board-ready commentary on India's Digital Personal Data Protection Act
            — written for founders, general counsel and compliance leaders.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div className="space-y-10">
          {articles.map((a) => (
            <article
              key={a.slug}
              id={a.slug}
              className="scroll-mt-24 rounded-2xl border border-navy/10 bg-background p-6 shadow-sm md:p-8"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-navy/60">
                <span className="inline-flex items-center gap-1.5 text-gold">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  DPDP Act
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {a.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {a.readTime}
                </span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold text-navy-deep md:text-3xl">
                {a.title}
              </h2>
              <p className="mt-3 text-navy/70">{a.excerpt}</p>
              <div className="mt-5 space-y-4 text-navy/80 leading-relaxed">
                {a.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl bg-navy-deep p-8 text-center text-cream md:p-12">
          <h3 className="font-serif text-2xl font-bold md:text-3xl">
            Need DPDP guidance tailored to your business?
          </h3>
          <p className="mt-3 text-cream/70">
            Book a consultation with Adv. Vrushali Borade to build a compliance roadmap.
          </p>
          <Link
            to="/booking"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
          >
            <Calendar className="h-4 w-4" />
            Book Consultation
          </Link>
        </div>
      </main>
    </div>
  );
}
