import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Globe,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import portrait from "@/assets/vrushali-portrait.png.asset.json";
import { Reveal } from "@/components/Reveal";
import { WEBINAR } from "@/lib/webinar.schema";
import { registerForWebinar } from "@/lib/webinar.functions";

const PAGE_URL = "https://www.winlegaladvisors.com/webinar";
const TITLE = "Executive Masterclass | WIN Legal Advisors";
const DESCRIPTION =
  "Free Executive Masterclass on Building a Legally Scalable SaaS Company covering DPDP, AI Governance, Enterprise Compliance and Investor Due Diligence.";

export const Route = createFileRoute("/webinar")({
  component: WebinarPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "WIN Legal Advisors" },
      { property: "og:image", content: `https://www.winlegaladvisors.com${portrait.url}` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `https://www.winlegaladvisors.com${portrait.url}` },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Event",
              name: `${WEBINAR.title} — Free Executive Masterclass`,
              description: DESCRIPTION,
              startDate: WEBINAR.startsAtISO,
              eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: { "@type": "VirtualLocation", url: PAGE_URL },
              image: [`https://www.winlegaladvisors.com${portrait.url}`],
              organizer: {
                "@type": "Organization",
                name: "WIN Legal Advisors",
                url: "https://www.winlegaladvisors.com",
              },
              performer: { "@type": "Person", name: "Adv. Vrushali Borade" },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
                url: PAGE_URL,
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
});

const topics = [
  { title: "DPDP Compliance", desc: "Build a defensible Digital Personal Data Protection posture before regulators or buyers ask." },
  { title: "AI Governance", desc: "Model usage, vendor risk, disclosures and internal AI policy that stands up to scrutiny." },
  { title: "SaaS Contracts", desc: "MSAs, DPAs, SLAs and order forms drafted to close enterprise deals faster." },
  { title: "Customer Data Lifecycle", desc: "Collection, retention, deletion and cross-border transfer — mapped end to end." },
  { title: "Investor Due Diligence", desc: "The legal file investors expect at seed, Series A and beyond." },
  { title: "Enterprise Sales Compliance", desc: "Clear security and privacy questionnaires without stalling the pipeline." },
  { title: "SaaS Legal Architecture Framework", desc: "A single operating framework that ties product, data and contracts together." },
];

const audience = [
  "Founders",
  "CEOs",
  "CTOs",
  "CFOs",
  "Chief Legal Officers",
  "HR Heads",
  "Compliance Officers",
  "Product Leaders",
  "Startup Teams",
  "Investors",
];

const expertise = [
  "Corporate Law",
  "Technology Law",
  "Data Privacy",
  "AI Governance",
  "Commercial Contracts",
  "Corporate Governance",
];

const faqs = [
  { q: "Is the webinar free?", a: "Yes. The masterclass is completely free to attend." },
  { q: "Will the recording be shared?", a: "No. The session is live only and no recording will be shared." },
  {
    q: "How will I receive the joining link?",
    a: "By email before the webinar, to the business email you register with.",
  },
];

const WHATSAPP = "https://wa.me/917498285423";
const BLUE = "#0056D6";

function Countdown() {
  const target = useMemo(() => new Date(WEBINAR.startsAtISO).getTime(), []);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, target - (now ?? target));
  const units = [
    { label: "Days", value: Math.floor(diff / 86400000) },
    { label: "Hours", value: Math.floor(diff / 3600000) % 24 },
    { label: "Minutes", value: Math.floor(diff / 60000) % 60 },
    { label: "Seconds", value: Math.floor(diff / 1000) % 60 },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-5">
      {units.map((u) => (
        <div
          key={u.label}
          className="rounded-2xl border border-navy/10 bg-white px-2 py-5 text-center shadow-[0_10px_40px_-24px_rgba(11,31,58,0.45)] sm:px-4 sm:py-7"
        >
          <div
            className="font-serif text-3xl font-bold tabular-nums text-navy-deep sm:text-5xl"
            suppressHydrationWarning
          >
            {now === null ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with WIN Legal Advisors"
      className="group fixed right-4 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30 transition-transform hover:scale-110 md:hidden"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/40" aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy-deep px-3 py-1 text-xs font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100">
        Chat with WIN Legal Advisors
      </span>
    </a>
  );
}

const inputClass =
  "w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm text-navy outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground";

function RegistrationForm() {
  const submit = useServerFn(registerForWebinar);
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    designation: "",
    email: "",
    mobile: "",
    website: "",
    challenge: "",
  });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setError("Please accept the consent checkbox to continue.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submit({ data: { ...form, consent: true as const } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-navy/10 bg-white p-10 text-center shadow-[0_24px_80px_-48px_rgba(11,31,58,0.5)]">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-serif text-3xl font-bold text-navy-deep">Registration Successful</h3>
        <p className="mt-3 text-muted-foreground">Thank you for registering.</p>
        <p className="text-muted-foreground">Your seat has been confirmed.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          The webinar joining link will be emailed before the event.
        </p>
        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-full border border-navy/15 px-6 py-3 text-sm font-semibold text-navy transition hover:border-gold hover:text-gold"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-navy/10 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(11,31,58,0.5)] sm:p-10"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="w-name">Full Name *</label>
          <input id="w-name" required maxLength={120} className={inputClass}
            value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="w-company">Company</label>
          <input id="w-company" maxLength={160} className={inputClass}
            value={form.company} onChange={(e) => update("company", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="w-designation">Designation</label>
          <input id="w-designation" maxLength={120} className={inputClass}
            value={form.designation} onChange={(e) => update("designation", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="w-email">Business Email *</label>
          <input id="w-email" type="email" required maxLength={254} className={inputClass}
            value={form.email} onChange={(e) => update("email", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="w-mobile">Mobile Number</label>
          <input id="w-mobile" type="tel" maxLength={40} className={inputClass}
            value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
        </div>
        <div>
          <label className={labelClass} htmlFor="w-website">Company Website</label>
          <input id="w-website" maxLength={300} placeholder="https://" className={inputClass}
            value={form.website} onChange={(e) => update("website", e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="w-challenge">Biggest Compliance Challenge</label>
          <textarea id="w-challenge" rows={4} maxLength={2000} className={inputClass}
            value={form.challenge} onChange={(e) => update("challenge", e.target.value)} />
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-navy/30 accent-gold"
        />
        <span>
          I consent to WIN Legal Advisors contacting me about this masterclass and related legal
          updates.
        </span>
      </label>

      {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        style={{ backgroundColor: BLUE }}
        className="mt-6 w-full rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
      >
        {submitting ? "Registering…" : "Register Now"}
      </button>
    </form>
  );
}

function WebinarPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img src={logoAsset.url} alt="WIN Legal Advisors — Vision to Victory" className="h-10 w-auto" />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold/12 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Free Executive Masterclass
            </span>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight text-navy-deep md:text-5xl lg:text-[3.4rem]">
              {WEBINAR.title}
            </h1>
            <p className="mt-5 text-xl font-semibold text-navy">Beyond Privacy Policies:</p>
            <p className="mt-2 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Build compliance that enterprise customers, investors and regulators trust.
            </p>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {[
                { icon: CalendarDays, label: "Date", value: WEBINAR.dateLabel },
                { icon: Clock, label: "Time", value: "4 PM IST" },
                { icon: Globe, label: "Mode", value: WEBINAR.mode },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-deep text-gold">
                    <m.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {m.label}
                    </dt>
                    <dd className="text-sm font-semibold text-navy-deep">{m.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#register"
                className="rounded-full bg-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy-deep shadow-lg shadow-gold/30 transition hover:brightness-105"
              >
                Register Now
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-navy/15 px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy transition hover:border-gold hover:text-gold"
              >
                Contact on WhatsApp
              </a>
            </div>
          </Reveal>

          <Reveal delay={120} className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gold/10 blur-2xl" aria-hidden="true" />
              <img
                src={portrait.url}
                alt="Adv. Vrushali Borade, Founder & Managing Partner, WIN Legal Advisors"
                loading="lazy"
                decoding="async"
                width={420}
                height={420}
                className="relative h-64 w-64 rounded-full border-4 border-white object-cover object-top shadow-[0_30px_90px_-40px_rgba(11,31,58,0.65)] sm:h-80 sm:w-80 md:h-[22rem] md:w-[22rem]"
              />
            </div>
          </Reveal>
        </section>

        {/* COUNTDOWN */}
        <section className="border-y border-navy/10 bg-cream/40 py-12">
          <div className="mx-auto max-w-3xl px-6">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Masterclass begins in
            </p>
            <Countdown />
          </div>
        </section>

        {/* WHY */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-deep md:text-4xl">
              Why this masterclass
            </h2>
            <div className="divider-gold mx-auto my-6 max-w-[7rem]" />
            <p className="text-muted-foreground">
              Seven building blocks that turn scattered legal documents into a compliance
              architecture your customers and investors can audit.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((t, i) => (
              <Reveal key={t.title} delay={i * 60}>
                <article className="h-full rounded-2xl border border-navy/10 bg-white p-7 shadow-[0_16px_50px_-40px_rgba(11,31,58,0.6)] transition duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_28px_70px_-44px_rgba(11,31,58,0.6)]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-deep text-gold">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-navy-deep">{t.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* SPEAKER */}
        <section className="border-y border-navy/10 bg-cream/40 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <img
                src={portrait.url}
                alt="Adv. Vrushali Borade"
                loading="lazy"
                decoding="async"
                width={420}
                height={520}
                className="w-full max-w-sm rounded-3xl border border-navy/10 object-cover shadow-[0_30px_90px_-50px_rgba(11,31,58,0.7)]"
              />
            </Reveal>
            <Reveal delay={100}>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                Meet the speaker
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-deep md:text-4xl">
                Adv. Vrushali Borade
              </h2>
              <p className="mt-2 text-lg font-medium text-navy">Attorney &amp; Solicitor</p>
              <p className="mt-1 text-muted-foreground">
                LLM (Business &amp; Commercial Laws, UK)
              </p>
              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Former Legal Advisor
              </p>
              <p className="mt-2 text-navy-deep">Cipla · Reliance · Adlabs</p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {expertise.map((e) => (
                  <li
                    key={e}
                    className="rounded-full border border-gold/50 px-4 py-1.5 text-xs font-medium text-navy"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-deep md:text-4xl">
              Who should attend
            </h2>
            <div className="divider-gold mx-auto my-6 max-w-[7rem]" />
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {audience.map((a, i) => (
              <Reveal key={a} delay={i * 40}>
                <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-navy/10 bg-white px-4 py-8 text-center shadow-[0_16px_50px_-44px_rgba(11,31,58,0.6)] transition duration-300 hover:-translate-y-1 hover:border-gold/40">
                  <Users className="h-5 w-5 text-gold" />
                  <span className="text-sm font-semibold text-navy-deep">{a}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* REGISTRATION */}
        <section id="register" className="scroll-mt-24 border-y border-navy/10 bg-cream/40 py-20">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                Reserve your seat
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-deep md:text-4xl">
                Registration
              </h2>
              <p className="mt-4 text-muted-foreground">
                Free to attend · Limited seats · Joining link emailed before the event
              </p>
            </Reveal>
            <div className="mt-10">
              <RegistrationForm />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <Reveal className="text-center">
            <h2 className="font-serif text-3xl font-bold text-navy-deep md:text-4xl">
              Frequently asked questions
            </h2>
            <div className="divider-gold mx-auto my-6 max-w-[7rem]" />
          </Reveal>
          <div className="mt-8 space-y-4">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <details className="group rounded-2xl border border-navy/10 bg-white p-6 shadow-[0_16px_50px_-46px_rgba(11,31,58,0.6)]">
                  <summary className="cursor-pointer list-none font-semibold text-navy-deep marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/10 bg-navy-deep py-10 text-center text-sm text-cream/70">
        <div className="mx-auto max-w-6xl px-6">
          <img src={logoAsset.url} alt="WIN Legal Advisors" className="mx-auto h-10 w-auto" />
          <p className="mt-4">
            © {new Date().getFullYear()} WIN Legal Advisors · Vision to Victory
          </p>
          <p className="mt-2 text-xs text-cream/50">
            This page is for informational purposes only and does not constitute legal advice or
            solicitation.
          </p>
        </div>
      </footer>

      <WhatsAppFab />
    </div>
  );
}
