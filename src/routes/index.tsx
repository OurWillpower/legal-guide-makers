import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scale,
  ShieldCheck,
  FileSignature,
  Lock,
  Cpu,
  Handshake,
  Lightbulb,
  Landmark,
  Users,
  Target,
  Globe,
  Briefcase,
  ArrowRight,
  Mail,
  Phone,
  Calendar,
  Quote,
  Star,
  HelpCircle,
  Rocket,
  BadgeCheck,
  ClipboardList,
  Building2,
} from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import portraitAsset from "@/assets/vrushali-portrait.png.asset.json";
import { HeroServicesSlider } from "@/components/HeroServicesSlider";

const logo = logoAsset.url;
const portrait = portraitAsset.url;

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "WIN Legal Advisors — Vision to Victory" },
      {
        name: "description",
        content:
          "Corporate legal, compliance, contracts, DPDP, IPR and regulatory advisory for scalable, investor-ready companies. Led by Adv. Vrushali Borade.",
      },
      { property: "og:title", content: "WIN Legal Advisors — Vision to Victory" },
      {
        property: "og:description",
        content:
          "Building scalable, compliant and investor-ready companies. Trust. Compliance. Growth. Sustainability.",
      },
      { property: "og:url", content: "https://www.winlegaladvisors.com/" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WIN Legal Advisors" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "WIN Legal Advisors — Vision to Victory" },
      {
        name: "twitter:description",
        content:
          "Corporate legal, compliance, DPDP, IPR and regulatory advisory for scalable, investor-ready companies.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.winlegaladvisors.com/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["LegalService", "LocalBusiness"],
              "@id": "https://www.winlegaladvisors.com/#organization",
              name: "WIN Legal Advisors",
              url: "https://www.winlegaladvisors.com",
              image: "https://www.winlegaladvisors.com/favicon.png",
              description:
                "Corporate legal, compliance, contracts, DPDP & data privacy, IPR, M&A and regulatory advisory led by Adv. Vrushali Borade.",
              slogan: "Vision to Victory",
              areaServed: "IN",
              priceRange: "$$",
              address: { "@type": "PostalAddress", addressCountry: "IN" },
              founder: {
                "@type": "Person",
                name: "Adv. Vrushali Borade",
                jobTitle: "Founder & Corporate Legal Expert",
              },
              sameAs: ["https://www.winlegaladvisors.com"],
            },
            {
              "@type": "WebSite",
              "@id": "https://www.winlegaladvisors.com/#website",
              url: "https://www.winlegaladvisors.com",
              name: "WIN Legal Advisors",
              publisher: { "@id": "https://www.winlegaladvisors.com/#organization" },
            },
          ],
        }),
      },
    ],
  }),
});


const services = [
  {
    id: "startup-incorporation",
    icon: Rocket,
    title: "Startup Incorporation & Setup",
    desc: "Private Limited, LLP, OPC and Section 8 incorporation — MoA, AoA, DPIIT recognition and founder agreements, done end-to-end.",
    slug: "incorporation",
  },
  {
    id: "corporate-legal",
    icon: Scale,
    title: "Corporate Legal Services",
    desc: "End-to-end legal support for businesses at every stage of growth — from day-one setup to boardroom governance.",
    slug: "corporate-legal",
  },
  {
    id: "contracts-commercial",
    icon: FileSignature,
    title: "Contracts & Commercial Advisory",
    desc: "Drafting, review and negotiation of MSAs, SaaS, NDAs, founder and shareholder agreements that protect your interests.",
    slug: "contracts-commercial",
  },
  {
    id: "vendor-supplier",
    icon: ClipboardList,
    title: "Vendor & Supplier Contracts",
    desc: "Vendor onboarding, supply, distribution, service-level and procurement contracts with airtight risk allocation.",
    slug: "vendor-contracts",
  },
  {
    id: "trademark-brand",
    icon: BadgeCheck,
    title: "Trademark & Brand Protection",
    desc: "Trademark search, filing, prosecution, opposition and renewals — plus copyright and design registration across classes.",
    slug: "trademark",
  },
  {
    id: "ip-innovation",
    icon: Lightbulb,
    title: "Intellectual Property & Innovation",
    desc: "Protecting your ideas, brands, inventions and intellectual assets across patents, copyrights, designs and trade secrets.",
    slug: "ip-innovation",
  },
  {
    id: "licensing-registrations",
    icon: Building2,
    title: "Licensing & Registrations",
    desc: "GST, MSME/Udyam, Shops & Establishment, FSSAI, IEC, professional tax and industry-specific licenses under one roof.",
    slug: "licensing-registrations",
  },
  {
    id: "dpdp-privacy",
    icon: Lock,
    title: "DPDP & Data Privacy Compliance",
    desc: "Helping organizations comply with the DPDP Act 2023 and global privacy laws — notices, consent, DPIAs and breach response.",
    slug: "dpdp-privacy",
  },
  {
    id: "tech-ai-cyber",
    icon: Cpu,
    title: "Technology, AI & Cyber Law",
    desc: "Guidance on AI, SaaS, cybersecurity, IT Act and emerging technologies — from product terms to incident response.",
    slug: "tech-ai-cyber",
  },
  {
    id: "ma-jv",
    icon: Handshake,
    title: "Mergers, Acquisitions & JV",
    desc: "Strategic legal support for M&A, joint ventures, fundraising and restructuring — from term sheet to closing.",
    slug: "ma-jv",
  },
  {
    id: "regulatory-compliance",
    icon: Landmark,
    title: "Regulatory & Compliance",
    desc: "Advisory on regulatory frameworks, sectoral licenses, FEMA, RBI and ongoing corporate compliance calendars.",
    slug: "regulatory-compliance",
  },
  {
    id: "litigation-dispute",
    icon: Users,
    title: "Litigation & Dispute Resolution",
    desc: "Effective representation across commercial courts, tribunals, arbitration and mediation — with a commercial lens.",
    slug: "litigation-dispute",
  },
];

const pillars = ["Trust", "Compliance", "Growth", "Sustainability"];

const differentiators = [
  { icon: Briefcase, title: "Business-Focused", desc: "Practical solutions tailored to commercial reality." },
  { icon: Users, title: "Experienced Team", desc: "A bench of seasoned legal experts across domains." },
  { icon: Target, title: "Ethical Advice", desc: "Measurable impact with uncompromising ethics." },
  { icon: Globe, title: "Pan-India Presence", desc: "Local depth with a global perspective." },
];

const testimonials = [
  {
    initials: "RM",
    name: "Rohan Mehta",
    role: "Founder & CEO, SaaS Startup",
    quote:
      "WIN Legal Advisors made our Series A term-sheet negotiations painless. Sharp, commercial and always ahead of the room.",
  },
  {
    initials: "AS",
    name: "Ananya Sharma",
    role: "General Counsel, FinTech",
    quote:
      "Their DPDP readiness playbook was the clearest we've seen. We closed our enterprise-security review in half the time.",
  },
  {
    initials: "KJ",
    name: "Kunal Joshi",
    role: "Co-founder, D2C Brand",
    quote:
      "From incorporation to trademark and vendor contracts — one team, zero drama. They think like operators, not just lawyers.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3">
            <img
              src={logo}
              alt="WIN Legal Advisors — Vision to Victory"
              className="h-11 w-auto"
              width={220}
              height={98}
            />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-navy md:flex">
            <a href="#about" className="hover:text-gold transition-colors">About</a>
            <div className="group relative">
              <a
                href="#services"
                aria-haspopup="true"
                className="inline-flex items-center gap-1 hover:text-gold transition-colors focus-visible:text-gold"
              >
                Services
                <svg className="h-3 w-3 opacity-70" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div
                role="menu"
                aria-label="Services"
                className="invisible absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-xl border border-navy/10 bg-background p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
              >
                {services.map((s) => (
                  <a
                    key={s.id}
                    role="menuitem"
                    href={`#service-${s.id}`}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy hover:bg-navy/5 hover:text-gold focus-visible:bg-navy/5 focus-visible:text-gold focus-visible:outline-none"
                  >
                    <s.icon className="h-4 w-4 shrink-0 text-gold" />
                    <span>{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
            <a href="#why-us" className="hover:text-gold transition-colors">Why Us</a>
            <a href="#founder" className="hover:text-gold transition-colors">Founder</a>
            <a href="#testimonials" className="hover:text-gold transition-colors">Testimonials</a>
            <Link to="/articles/dpdp" className="hover:text-gold transition-colors">Articles</Link>
            <a href="#faq" className="hover:text-gold transition-colors">FAQ</a>
            <Link to="/contact" className="hover:text-gold transition-colors">Contact</Link>
          </nav>
          <Link
            to="/booking"
            className="hidden items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03] md:inline-flex"
          >
            <Calendar className="h-4 w-4" />
            Book Consultation
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden bg-gradient-navy text-cream">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, oklch(0.78 0.13 82 / 0.4), transparent 40%), radial-gradient(circle at 80% 80%, oklch(0.78 0.13 82 / 0.3), transparent 45%)",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.15fr_1fr] md:py-28 lg:py-32">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
                Building Legally Strong
              </span>
            </div>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] md:text-6xl lg:text-7xl">
              Scalable, Compliant &{" "}
              <span className="text-gold-gradient">Investor-Ready</span> Companies
            </h1>
            <p className="mt-6 max-w-xl text-lg text-cream/75">
              WIN Legal Advisors partners with founders, boards and enterprises to
              turn legal complexity into a competitive advantage — from incorporation
              to exit.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {pillars.map((p) => (
                <div key={p} className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
                  <span className="text-sm font-medium uppercase tracking-[0.2em] text-cream/90">
                    {p}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
              >
                <Calendar className="h-4 w-4" />
                Book a Free Legal Consultation
              </Link>
              <a
                href="#services"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-7 py-3.5 text-sm font-semibold text-cream transition-colors hover:bg-gold/10"
              >
                Explore Services
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-8 rounded-full bg-gradient-gold opacity-20 blur-3xl" />
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[2rem] border border-gold/30 shadow-elegant">
              <img
                src={portrait}
                alt="Adv. Vrushali Borade — Founder, WIN Legal Advisors"
                className="h-full w-full object-cover"
                width={1024}
                height={1280}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent p-6 pt-16">
                <p className="font-serif text-xl font-semibold text-cream">Adv. Vrushali Borade</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">
                  Corporate Legal Expert
                </p>
              </div>
            </div>
          </div>
        </div>

        <HeroServicesSlider slides={services} className="mt-16 md:mt-20" />
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              About the Firm
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
              Legal counsel, built for the way businesses actually grow.
            </h2>
            <div className="divider-gold my-8 max-w-xs" />
            <p className="text-lg leading-relaxed text-muted-foreground">
              WIN Legal Advisors is a modern legal advisory firm working at the
              intersection of law, technology and business. We help startups,
              growth-stage companies and established enterprises stay compliant,
              raise capital confidently, protect what they build and scale
              sustainably across India and beyond.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Our approach is business-first — every opinion, contract and
              compliance framework is engineered to move your company forward,
              not slow it down.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {[
              { k: "10+", v: "Years of Experience" },
              { k: "150+", v: "Companies Advised" },
              { k: "PAN", v: "India Presence" },
              { k: "Global", v: "UK-Trained Counsel" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl border border-navy/10 bg-card p-8 shadow-sm transition-shadow hover:shadow-elegant"
              >
                <div className="font-serif text-4xl font-bold text-navy-deep">{s.k}</div>
                <div className="mt-2 text-sm uppercase tracking-widest text-gold">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative bg-navy-deep text-cream">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              What We Do
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold md:text-5xl">
              A single-window legal partner
            </h2>
            <div className="divider-gold mx-auto my-6 max-w-xs" />
            <p className="text-cream/70">
              From incorporation and trademark to vendor contracts, licensing,
              DPDP and disputes — startups and established enterprises get every
              legal need served under one roof, by one accountable team.
            </p>
          </div>


          <div className="mt-16 grid gap-px overflow-hidden rounded-3xl bg-gold/20 md:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.title}
                id={`service-${s.id}`}
                className="group relative scroll-mt-24 bg-navy-deep p-8 transition-colors hover:bg-navy"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg border border-gold/40 bg-navy text-gold transition-transform group-hover:scale-110">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 font-serif text-xl font-semibold text-cream">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/65">{s.desc}</p>
                {"slug" in s && s.slug ? (
                  <Link
                    to="/services/$slug"
                    params={{ slug: s.slug as string }}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gold hover:text-cream"
                  >
                    Learn more →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            Why Choose Us
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
            Business-focused. Practical. Measurable.
          </h2>
          <div className="divider-gold mx-auto my-6 max-w-xs" />
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {differentiators.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border border-navy/10 bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-navy text-gold shadow-elegant">
                <d.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-navy-deep">
                {d.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER */}
      <section id="founder" className="bg-muted">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-gold opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-elegant">
              <img
                src={portrait}
                alt="Adv. Vrushali Borade"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1024}
                height={1280}
              />
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              Meet the Founder
            </span>
            <h2 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
              Adv. Vrushali Borade
            </h2>
            <p className="mt-3 text-lg text-gold">
              Corporate Legal Expert · Compliance Strategist · Business Enabler
            </p>
            <div className="divider-gold my-8 max-w-xs" />
            <p className="text-lg leading-relaxed text-muted-foreground">
              Vrushali advises founders and boards on the legal decisions that
              matter most — structuring for growth, closing rounds, building
              compliance into the DNA of the company, and resolving disputes
              when they arise. She blends UK-trained legal rigour with
              on-the-ground understanding of Indian business.
            </p>
            <ul className="mt-8 grid gap-3 text-sm text-navy">
              {[
                "LLM (United Kingdom)",
                "LLB — Symbiosis Law School, Pune",
                "QLTT Certified — England & Wales",
                "Enrolled Advocate — Bar Council of Maharashtra & Goa",
                "10+ years advising startups, SMEs and enterprises",
              ].map((q) => (
                <li key={q} className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            Client Voices
          </span>
          <h2 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
            Trusted by founders, boards & general counsel
          </h2>
          <div className="divider-gold mx-auto my-6 max-w-xs" />
          <p className="text-muted-foreground">
            A few words from businesses we've helped scale, close rounds and stay compliant.
          </p>
          <p className="mt-3 text-xs italic text-muted-foreground/80">
            Names and identifying details of some clients have been anonymised on request.
            Consent obtained for every quote shown.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative flex h-full flex-col rounded-3xl border border-navy/10 bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-gold/25" />
              <div className="flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-navy-deep">
                <p className="font-serif text-lg leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-navy/10 pt-6">
                <div
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-navy font-serif text-lg font-bold text-gold"
                  aria-hidden
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-serif text-base font-semibold text-navy-deep">
                    {t.name}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gold">
                    {t.role}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section id="faq" className="bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Frequently Asked</p>
            <h2 className="mt-3 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
              Answers before you book
            </h2>
            <div className="divider-gold mx-auto my-6 max-w-xs" />
            <p className="text-muted-foreground">
              Consultation format, timelines, documents to bring, and how we protect what you share.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "How does a consultation work and how long is it?",
                a: "A 30–45 minute video call on Google Meet or Teams. You'll get an email confirmation with an Add to Google Calendar link and a downloadable .ics invite; the video link is sent 24 hours before the call.",
              },
              {
                q: "How soon can I get a slot?",
                a: "Most consultations are confirmed within one business day and held within 2–4 business days. Urgent regulatory or investor matters can be fast-tracked — mention it in your booking note.",
              },
              {
                q: "What documents should I bring or share?",
                a: "Whatever is relevant — incorporation docs, contracts under review, term sheets, DPDP/privacy notices, legal notices, and a one-page summary of what you'd like to discuss. Everything you share is treated as confidential.",
              },
              {
                q: "Can I reschedule or cancel later?",
                a: "Yes — sign in and manage your booking any time. You can reschedule up to three times and cancel any time before the appointment.",
              },
            ].map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-navy/10 bg-card p-6 shadow-sm transition-all open:shadow-elegant"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="flex items-start gap-3">
                    <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                    <span className="font-serif text-lg font-semibold text-navy-deep">{f.q}</span>
                  </span>
                  <span className="mt-1 text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 pl-8 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-white px-6 py-3 text-sm font-semibold text-navy-deep transition-colors hover:border-gold hover:text-gold"
            >
              See all FAQs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA / CONTACT */}
      <section id="contact" className="relative overflow-hidden bg-gradient-navy text-cream">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, oklch(0.78 0.13 82 / 0.4), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <img src={logo} alt="WIN Legal Advisors — Vision to Victory" className="mx-auto h-24 w-auto brightness-125" />
          <h2 className="mt-8 font-serif text-4xl font-bold md:text-5xl">
            Ready to build a <span className="text-gold-gradient">legally strong</span> company?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-cream/75">
            Book a free 30-minute consultation. We'll map the legal risks and
            opportunities specific to your business — no obligation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-8 py-4 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Calendar className="h-4 w-4" />
              Book a Free Consultation
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-8 py-4 text-sm font-semibold text-cream transition-colors hover:bg-gold/10"
            >
              <Mail className="h-4 w-4" />
              Send us a message
            </Link>
          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-navy-deep text-cream/70">
        <div className="mx-auto grid max-w-7xl gap-10 border-t border-gold/10 px-6 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <img
              src={logo}
              alt="WIN Legal Advisors — Vision to Victory"
              className="h-16 w-auto brightness-125"
            />
            <p className="mt-4 max-w-md text-sm">
              Corporate legal, compliance, contracts, DPDP, IPR and regulatory
              advisory for scalable, investor-ready companies.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-gold">
              Explore
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="#about" className="hover:text-gold">About</a></li>
              <li><a href="#services" className="hover:text-gold">Services</a></li>
              <li><a href="#why-us" className="hover:text-gold">Why Us</a></li>
              <li><a href="#founder" className="hover:text-gold">Founder</a></li>
              <li><a href="#testimonials" className="hover:text-gold">Testimonials</a></li>
              <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
              <li><Link to="/booking" className="hover:text-gold">Book Consultation</Link></li>
              <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-gold">
              Contact
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href="https://www.winlegaladvisors.com" className="hover:text-gold">
                  www.winlegaladvisors.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href="mailto:contact@winlegaladvisors.com" className="hover:text-gold">
                  contact@winlegaladvisors.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>By appointment · Pune, Maharashtra</span>
              </li>
              <li className="flex items-start gap-2">
                <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>Pan-India Practice · Advisory across all jurisdictions</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bar Council disclaimer strip (mandatory under BCI Rules) */}
        <div className="border-t border-gold/10 bg-navy-deep/60">
          <div className="mx-auto max-w-7xl px-6 py-6 text-[11px] leading-relaxed text-cream/55">
            <p className="font-semibold uppercase tracking-widest text-gold">Disclaimer & Rules of the Bar Council of India</p>
            <p className="mt-2">
              As per the Rules of the Bar Council of India, advocates are not permitted to
              solicit work or advertise. By accessing this website (www.winlegaladvisors.com),
              you acknowledge and confirm that you are seeking information relating to
              WIN Legal Advisors of your own accord and that no form of solicitation,
              advertisement or inducement has been made by the firm or its members.
              Information obtained from this website is intended for the user's general
              knowledge only and is not legal advice, nor does it create a lawyer–client
              relationship. WIN Legal Advisors is not liable for any consequence of action
              taken by the user relying on material on this website. Please consult a
              qualified professional for advice specific to your matter.
            </p>
          </div>
        </div>

        <div className="border-t border-gold/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-cream/50 md:flex-row">
            <div>© {new Date().getFullYear()} WIN Legal Advisors. All rights reserved.</div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link to="/terms" className="hover:text-gold">Terms of Service</Link>
              <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
              <Link to="/faq" className="hover:text-gold">FAQ</Link>
              <Link to="/contact" className="hover:text-gold">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
