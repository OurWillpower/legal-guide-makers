import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Globe,
  GraduationCap,
  Handshake,
  Lock,
  Mail,
  Phone,
  PencilLine,
  ScrollText,
  ShieldCheck,
  Scale,
  TrendingUp,
  User,
  Video,
} from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import portrait from "@/assets/vrushali-portrait.png.asset.json";
import { Reveal } from "@/components/Reveal";
import { WEBINAR } from "@/lib/webinar.schema";
import { registerForWebinar, resendWebinarConfirmation } from "@/lib/webinar.functions";

const PAGE_URL = "https://www.winlegaladvisors.com/webinar";
const TITLE = "Executive Masterclass | WIN Legal Advisors";
const DESCRIPTION =
  "Free Executive Masterclass on Building a Legally Scalable SaaS Company covering DPDP, AI Governance, Enterprise Compliance and Investor Due Diligence.";

const faqs = [
  { q: "Is this webinar free?", a: "Yes, absolutely. This is a free executive masterclass." },
  { q: "Will the recording be shared?", a: "No." },
  {
    q: "How will I receive the joining link?",
    a: "The joining link will be shared via email a day before the webinar.",
  },
  { q: "Can I ask questions during the session?", a: "Yes, there will be a live Q&A session at the end." },
  {
    q: "Who should attend this webinar?",
    a: "SaaS founders, CEOs, CTOs, CFOs, CLOs, product leaders, compliance professionals and anyone building or scaling a SaaS business.",
  },
];

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
              performer: { "@type": "Person", name: "Vrushali Borade" },
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

const whyAttend = [
  {
    icon: ShieldCheck,
    title: "Reduce Legal Risks",
    desc: "Build a strong legal foundation and minimise exposure.",
  },
  {
    icon: Handshake,
    title: "Win Enterprise Customers",
    desc: "Meet compliance requirements with confidence.",
  },
  {
    icon: TrendingUp,
    title: "Raise Capital Easily",
    desc: "Be investor-ready with strong governance and documentation.",
  },
  {
    icon: Globe,
    title: "Stay Future Ready",
    desc: "Understand emerging laws, AI governance and global trends.",
  },
];

const keyOutcomes = [
  { icon: Scale, text: "DPDP Act compliance for SaaS businesses" },
  { icon: ScrollText, text: "Customer data lifecycle management" },
  { icon: ShieldCheck, text: "AI governance and emerging obligations" },
  { icon: Building2, text: "SaaS Legal Architecture Framework" },
  { icon: BriefcaseBusiness, text: "Enterprise contracts and procurement expectations" },
  { icon: Award, text: "Common legal mistakes made by startups" },
  { icon: TrendingUp, text: "Investor due diligence readiness" },
  { icon: Video, text: "Live Q&A with industry expert" },
];

const credentials = [
  { icon: GraduationCap, text: "LLM — Business & Commercial Laws (UK)" },
  { icon: ScrollText, text: "LLB — Symbiosis, Pune" },
  { icon: Scale, text: "QLTT (UK)" },
];

const WHATSAPP = "https://wa.me/917498285423";

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
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {units.map((u) => (
        <div
          key={u.label}
          className="min-w-[74px] flex-1 rounded-lg border border-gold/40 bg-navy-deep/60 px-3 py-3 text-center sm:min-w-[86px] sm:flex-none sm:px-6 sm:py-4"
        >
          <div className="font-serif text-2xl font-bold tabular-nums text-gold sm:text-3xl" suppressHydrationWarning>
            {now === null ? "--" : String(u.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-cream/60 sm:text-[10px]">
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function FloatingRegisterCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("register");
    if (!target) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href="#register"
      aria-label="Jump to the masterclass registration form"
      className={`shimmer-cta fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full bg-gradient-gold px-7 py-3 text-sm font-bold text-navy-deep shadow-gold transition-all duration-300 md:left-6 md:translate-x-0 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <span className="shimmer-cta-sheen" aria-hidden="true" />
      <span className="relative">Register Now — Free Seat</span>
    </a>
  );
}

function WhatsAppFab() {
  return (

    <a
      href={WHATSAPP}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with WIN Legal Advisors on WhatsApp"
      className="group fixed right-4 top-1/2 z-40 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30 transition-transform hover:scale-110 md:hidden"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-green-500/40" aria-hidden="true" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="relative h-7 w-7" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy-deep px-3 py-1 text-xs font-medium text-cream opacity-0 transition-opacity group-hover:opacity-100">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

const fieldClass =
  "w-full rounded-lg border border-gold/25 bg-navy-deep/60 px-4 py-3 pr-11 text-sm text-cream placeholder:text-cream/45 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25";

function Field({
  id,
  label,
  icon: Icon,
  ...rest
}: {
  id: string;
  label: string;
  icon: typeof User;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <input id={id} placeholder={label} className={fieldClass} {...rest} />
      <Icon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
    </div>
  );
}

type Delivery = { status: "sent" | "skipped" | "failed"; detail: string };

function DeliveryBadge({ label, d }: { label: string; d: Delivery }) {
  const map = {
    sent: { text: "Sent", cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" },
    skipped: { text: "Queued / blocked", cls: "border-amber-400/40 bg-amber-400/10 text-amber-200" },
    failed: { text: "Failed", cls: "border-red-400/40 bg-red-400/10 text-red-200" },
  } as const;
  const s = map[d.status];
  return (
    <div className="rounded-xl border border-cream/15 bg-white/5 p-3 text-left">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.14em] text-cream/60">{label}</span>
        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}>{s.text}</span>
      </div>
      <p className="mt-1.5 text-xs leading-relaxed text-cream/70">{d.detail}</p>
    </div>
  );
}

function RegistrationForm() {
  const submit = useServerFn(registerForWebinar);
  const resend = useServerFn(resendWebinarConfirmation);
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
  const [delivery, setDelivery] = useState<{ attendee: Delivery; internal: Delivery; whatsapp: Delivery } | null>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState<string | null>(null);

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
      const res = await submit({ data: { ...form, consent: true as const } });
      setDelivery(res.delivery ?? null);
      setResendEmail(form.email);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onResend(e: React.FormEvent) {
    e.preventDefault();
    setResending(true);
    setResendMsg(null);
    try {
      const res = await resend({ data: { email: resendEmail } });
      if (!res.found) {
        setResendMsg("We could not find a registration with that email address.");
      } else if (res.delivery) {
        setDelivery(res.delivery);
        setResendMsg("Confirmation re-sent — see the delivery status above.");
      }
    } catch (err) {
      setResendMsg(err instanceof Error ? err.message : "Could not resend right now.");
    } finally {
      setResending(false);
    }
  }

  if (done) {
    const failed = delivery && delivery.attendee.status !== "sent";
    return (
      <div className="rounded-2xl border border-gold/40 bg-navy-deep p-8 text-center shadow-[0_30px_90px_-50px_rgba(11,31,58,0.9)] sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-serif text-2xl font-bold text-gold">Registration Successful</h3>
        <p className="mt-3 text-cream/80">Your seat has been confirmed and saved.</p>

        {delivery && (
          <div className="mt-6 space-y-2.5">
            <DeliveryBadge label="Confirmation to you" d={delivery.attendee} />
            <DeliveryBadge label="Notification to our team" d={delivery.internal} />
          </div>
        )}

        {failed && (
          <p className="mt-4 text-xs text-cream/60">
            Your seat is safe regardless of email delivery. You can retry below.
          </p>
        )}

        <form onSubmit={onResend} className="mt-6 space-y-3 text-left">
          <label className="text-xs uppercase tracking-[0.14em] text-cream/60" htmlFor="w-resend">
            Resend confirmation
          </label>
          <input
            id="w-resend"
            type="email"
            required
            value={resendEmail}
            onChange={(e) => setResendEmail(e.target.value)}
            placeholder="Email you registered with"
            className={fieldClass}
          />
          <button
            type="submit"
            disabled={resending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gold/50 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-navy-deep disabled:opacity-60"
          >
            {resending ? "Sending…" : "Resend confirmation email"}
          </button>
          {resendMsg && <p className="text-xs text-cream/75">{resendMsg}</p>}
        </form>

        <a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full border border-gold/50 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold hover:text-navy-deep"
        >
          Chat on WhatsApp
        </a>
      </div>
    );
  }


  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-gold/40 bg-navy-deep p-6 shadow-[0_30px_90px_-50px_rgba(11,31,58,0.9)] sm:p-8"
    >
      <h3 className="text-center font-serif text-2xl font-bold text-gold">Register Now</h3>
      <p className="mt-1 text-center text-sm text-cream/70">Reserve your free seat today!</p>

      <div className="mt-6 space-y-3.5">
        <Field id="w-name" label="Full Name *" icon={User} required maxLength={120}
          value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
        <Field id="w-company" label="Company Name" icon={Building2} maxLength={160}
          value={form.company} onChange={(e) => update("company", e.target.value)} />
        <Field id="w-designation" label="Designation" icon={BriefcaseBusiness} maxLength={120}
          value={form.designation} onChange={(e) => update("designation", e.target.value)} />
        <Field id="w-email" label="Email Address *" icon={Mail} type="email" required maxLength={254}
          value={form.email} onChange={(e) => update("email", e.target.value)} />
        <Field id="w-mobile" label="WhatsApp Number (with country code) *" icon={Phone} type="tel" required
          maxLength={40} inputMode="tel" pattern="[+0-9][0-9 ()\-]{7,}"
          title="Enter your WhatsApp number with country code, e.g. +91 98765 43210"
          value={form.mobile} onChange={(e) => update("mobile", e.target.value)} />
        <Field id="w-website" label="Company Website (Optional)" icon={Globe} maxLength={300}
          value={form.website} onChange={(e) => update("website", e.target.value)} />
        <div className="relative">
          <label className="sr-only" htmlFor="w-challenge">Biggest legal or compliance challenge</label>
          <textarea
            id="w-challenge"
            rows={3}
            maxLength={2000}
            placeholder="What is your biggest legal or compliance challenge today?"
            className={fieldClass}
            value={form.challenge}
            onChange={(e) => update("challenge", e.target.value)}
          />
          <PencilLine className="pointer-events-none absolute right-4 top-4 h-4 w-4 text-gold/70" />
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm text-cream/75">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gold/40 accent-gold"
        />
        <span>I agree to receive updates and communications from WIN Legal Advisors.</span>
      </label>

      {error && <p className="mt-4 text-sm font-medium text-red-300">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-gold px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy-deep shadow-lg shadow-gold/25 transition hover:brightness-105 disabled:opacity-60"
      >
        {submitting ? "Registering…" : "Register Now"}
        {!submitting && <ArrowRight className="h-4 w-4" />}
      </button>

      <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-cream/55">
        <Lock className="h-3.5 w-3.5 text-gold/80" />
        We respect your privacy. Your information is safe with us.
      </p>
    </form>
  );
}

function WebinarPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-navy/10 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <Link to="/" className="flex items-center">
            <img src={logoAsset.url} alt="WIN Legal Advisors — Vision to Victory" className="h-10 w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy lg:flex">
            <Link to="/" className="hover:text-gold">Home</Link>
            <Link to="/team" className="hover:text-gold">About Us</Link>
            <Link to="/articles/dpdp" className="hover:text-gold">Resources</Link>
            <Link to="/faq" className="hover:text-gold">FAQ</Link>
            <Link to="/contact" className="hover:text-gold">Contact Us</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/booking"
              className="hidden rounded-full border border-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold hover:text-navy-deep sm:inline-flex"
            >
              Book a Consultation
            </Link>
            <a
              href="#register"
              className="shimmer-cta relative inline-flex rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
            >
              <span className="shimmer-cta-sheen" aria-hidden="true" />
              <span className="relative">Masterclass</span>
            </a>

          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative isolate overflow-hidden bg-navy-deep text-cream">
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(circle_at_70%_40%,rgba(201,162,74,0.28),transparent_65%)]"
          />
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-16">
            <Reveal>
              <span className="inline-flex items-center rounded-md border border-gold/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                Free Executive Masterclass
              </span>
              <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.1] md:text-5xl lg:text-[3.4rem]">
                Building a Legally
                <br />
                Scalable SaaS Company
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gold">
                Beyond Privacy Policies: Build Compliance That Investors, Enterprise Customers &amp;
                Regulators Trust
              </p>

              <dl className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
                {[
                  { icon: CalendarDays, value: WEBINAR.dateLabel },
                  { icon: Clock, value: "4:00 PM IST" },
                  { icon: Video, value: "Online (Live)" },
                ].map((m) => (
                  <div key={m.value} className="flex items-center gap-2.5">
                    <m.icon className="h-4 w-4 text-gold" />
                    <span className="font-medium text-cream/90">{m.value}</span>
                  </div>
                ))}
              </dl>

              <div className="mt-8 max-w-md">
                <Countdown />
              </div>

              <div className="mt-8">
                <a
                  href="#register"
                  className="inline-flex items-center gap-3 rounded-lg bg-gradient-gold px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-navy-deep shadow-lg shadow-gold/25 transition hover:brightness-105"
                >
                  Reserve Your Seat Now <ArrowRight className="h-4 w-4" />
                </a>
                <p className="mt-3 text-sm text-cream/70">Limited Seats. Register Now!</p>
              </div>
            </Reveal>

            <Reveal delay={120} className="relative">
              <div className="relative mx-auto max-w-md">
                <div
                  aria-hidden
                  className="absolute -inset-6 rounded-[2rem] bg-[linear-gradient(140deg,rgba(201,162,74,0.35),transparent_60%)] blur-2xl"
                />
                <img
                  src={portrait.url}
                  alt="Vrushali Borade, Attorney and Solicitor, WIN Legal Advisors"
                  loading="lazy"
                  decoding="async"
                  width={520}
                  height={620}
                  className="relative w-full rounded-2xl object-cover object-top shadow-[0_40px_100px_-50px_rgba(0,0,0,0.9)]"
                />
              </div>
              <div className="mt-6 md:mt-8">
                <h2 className="font-serif text-2xl font-bold text-gold">Vrushali Borade</h2>
                <p className="mt-1 text-sm font-medium text-cream/90">Attorney and Solicitor</p>
                <ul className="mt-4 space-y-2.5">
                  {credentials.map((c) => (
                    <li key={c.text} className="flex items-center gap-3 text-sm text-cream/85">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/50 text-gold">
                        <c.icon className="h-3.5 w-3.5" />
                      </span>
                      {c.text}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm font-semibold text-gold">10+ Years of Experience</p>
                <p className="text-sm text-cream/85">Advising Startups, SMEs &amp; Large Enterprises</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHY ATTEND + REGISTER */}
        <section className="bg-cream/40">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-navy-deep md:text-3xl">
                Why Attend?
              </h2>
              <div className="divider-gold my-5 max-w-[5rem]" />
              <p className="max-w-xl leading-relaxed text-muted-foreground">
                SaaS businesses are under increasing scrutiny from customers, investors, regulators
                and enterprise buyers. Legal readiness is no longer optional — it's a competitive
                advantage.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-navy/10">
                {whyAttend.map((w, i) => (
                  <Reveal key={w.title} delay={i * 70}>
                    <div className="text-center lg:px-4">
                      <w.icon className="mx-auto h-9 w-9 text-gold" />
                      <h3 className="mt-4 font-semibold text-navy-deep">{w.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.desc}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <div id="register" className="scroll-mt-24">
              <Reveal delay={100}>
                <RegistrationForm />
              </Reveal>
            </div>
          </div>
        </section>

        {/* KEY OUTCOMES */}
        <section className="bg-navy-deep py-14 text-cream">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wide md:text-3xl">
                Key Outcomes
              </h2>
              <div className="divider-gold my-5 max-w-[5rem]" />
            </Reveal>
            <div className="mt-8 grid gap-x-12 gap-y-5 md:grid-cols-2">
              {keyOutcomes.map((k, i) => (
                <Reveal key={k.text} delay={i * 50}>
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                      <k.icon className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-sm text-cream/90">{k.text}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-7xl px-6 py-14">
          <Reveal>
            <h2 className="font-serif text-2xl font-bold uppercase tracking-wide text-navy-deep md:text-3xl">
              Frequently Asked Questions
            </h2>
            <div className="divider-gold my-5 max-w-[5rem]" />
          </Reveal>
          <div className="mt-6 divide-y divide-navy/10 overflow-hidden rounded-xl border border-navy/10">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 50}>
                <details className="group bg-white open:bg-cream/30">
                  <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-start gap-4 px-5 py-4 marker:hidden md:grid-cols-[minmax(0,0.32fr)_1fr_auto]">
                    <span className="text-sm font-semibold text-navy-deep">{f.q}</span>
                    <span className="hidden text-sm text-muted-foreground md:block">{f.a}</span>
                    <ChevronDown className="h-4 w-4 text-navy/50 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground md:hidden">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-navy/10 bg-navy-deep py-10 text-sm text-cream/70">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <img src={logoAsset.url} alt="WIN Legal Advisors" className="mx-auto h-10 w-auto" />
          <p className="mt-4">© {new Date().getFullYear()} WIN Legal Advisors · Vision to Victory</p>
          <p className="mt-2 text-xs text-cream/50">
            This page is for informational purposes only and does not constitute legal advice or
            solicitation.
          </p>
        </div>
      </footer>

      <FloatingRegisterCta />
      <WhatsAppFab />

    </div>
  );
}
