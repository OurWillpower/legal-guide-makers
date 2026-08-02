import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, ArrowRight, Calendar } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import portraitAsset from "@/assets/vrushali-portrait.png.asset.json";
import sonaliAsset from "@/assets/sonali-deshmukh.jpg.asset.json";
import jayantAsset from "@/assets/jayant-bhat.jpg.asset.json";

const logo = logoAsset.url;
const portrait = portraitAsset.url;
const sonaliPortrait = sonaliAsset.url;
const jayantPortrait = jayantAsset.url;

const PAGE_URL = "https://www.winlegaladvisors.com/team";
const PAGE_TITLE = "Our Core Team — WIN Legal Advisors";
const PAGE_DESC =
  "Meet the WIN Legal Advisors core team — Vrushali Borade (Founder), Sonali Deshmukh (Senior IT Consultant) and Jayant Bhat (Business Mentor & Consultant).";

const founder = {
  name: "Vrushali Borade",
  role: "Founder · Corporate Legal Expert · Compliance Strategist · Business Enabler",
  image: portrait,
  bio: "Vrushali advises founders and boards on the legal decisions that matter most — structuring for growth, closing rounds, building compliance into the DNA of the company, and resolving disputes when they arise. She blends UK-trained legal rigour with on-the-ground understanding of Indian business.",
  credentials: [
    "LLM (United Kingdom)",
    "LLB — Symbiosis Law School, Pune",
    "QLTT Certified — England & Wales",
    "Enrolled Advocate — Bar Council of Maharashtra & Goa",
    "10+ years advising conglomerates, enterprises and startups",
  ],
};

const advisors = [
  {
    name: "Sonali Deshmukh",
    role: "Senior IT Consultant",
    image: sonaliPortrait,
    bio: "15+ years of experience in the world of IT, having held senior coding and technical leadership roles. Advises on technology architecture, product engineering and digital delivery for modern legal-tech and enterprise workflows.",
  },
  {
    name: "Jayant Bhat",
    role: "Business Mentor, Trainer & Consultant",
    image: jayantPortrait,
    bio: "25+ years of work experience, having held senior decisive positions in MNCs. Has offered mentoring to founders and management consultancy to organizations for over 14 years.",
  },
];

export const Route = createFileRoute("/team")({
  component: TeamPage,
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESC },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESC },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:site_name", content: "WIN Legal Advisors" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESC },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.winlegaladvisors.com/" },
                { "@type": "ListItem", position: 2, name: "Our Core Team", item: PAGE_URL },
              ],
            },
            {
              "@type": "Organization",
              "@id": "https://www.winlegaladvisors.com/#organization",
              name: "WIN Legal Advisors",
              url: "https://www.winlegaladvisors.com",
              member: [
                { "@type": "Person", name: founder.name, jobTitle: "Founder & Corporate Legal Expert" },
                { "@type": "Person", name: advisors[0].name, jobTitle: advisors[0].role },
                { "@type": "Person", name: advisors[1].name, jobTitle: advisors[1].role },
              ],
            },
            {
              "@type": "Person",
              name: founder.name,
              jobTitle: "Founder & Corporate Legal Expert",
              description: founder.bio,
              worksFor: { "@id": "https://www.winlegaladvisors.com/#organization" },
              alumniOf: ["Symbiosis Law School, Pune"],
              hasCredential: founder.credentials,
            },
            {
              "@type": "Person",
              name: advisors[0].name,
              jobTitle: advisors[0].role,
              description: advisors[0].bio,
              worksFor: { "@id": "https://www.winlegaladvisors.com/#organization" },
            },
            {
              "@type": "Person",
              name: advisors[1].name,
              jobTitle: advisors[1].role,
              description: advisors[1].bio,
              worksFor: { "@id": "https://www.winlegaladvisors.com/#organization" },
            },
          ],
        }),
      },
    ],
  }),
});

function TeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="WIN Legal Advisors" className="h-12 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-navy md:flex">
            <Link to="/" className="hover:text-gold transition-colors">Home</Link>
            <Link to="/team" className="text-gold">Our Core Team</Link>
            <Link to="/articles/dpdp" className="hover:text-gold transition-colors">Articles</Link>
            <Link to="/faq" className="hover:text-gold transition-colors">FAQ</Link>
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

      <section className="bg-gradient-navy text-cream">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-24">
          <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.28em] text-gold/90">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-cream/80">Our Core Team</span>
          </nav>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl font-bold leading-[1.05] md:text-6xl">
            Our <span className="text-gold-gradient">Core Team</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-cream/75">
            Lawyers, technologists and business mentors — working shoulder to shoulder
            with founders, boards and general counsel to turn legal complexity into a
            competitive advantage.
          </p>
        </div>
      </section>

      <section className="bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-gold opacity-20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-elegant">
                <img
                  src={founder.image}
                  alt={`${founder.name} — Founder, WIN Legal Advisors`}
                  className="h-full w-full object-cover"
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
                {founder.name}
              </h2>
              <p className="mt-3 text-lg text-gold">{founder.role}</p>
              <div className="divider-gold my-8 max-w-xs" />
              <p className="text-lg leading-relaxed text-muted-foreground">{founder.bio}</p>
              <ul className="mt-8 grid gap-3 text-sm text-navy">
                {founder.credentials.map((q) => (
                  <li key={q} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-gold" aria-hidden />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-20">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
                Senior Advisors
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold text-navy-deep md:text-4xl">
                Business & technology depth, alongside legal rigour
              </h2>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {advisors.map((m) => (
                <article
                  key={m.name}
                  className="group overflow-hidden rounded-3xl border border-gold/20 bg-background shadow-elegant"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-navy-deep">
                    <img
                      src={m.image}
                      alt={`${m.name} — ${m.role}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={1024}
                      height={1280}
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-2xl font-bold text-navy-deep">{m.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
                      {m.role}
                    </p>
                    <div className="divider-gold my-5 max-w-[3rem]" />
                    <p className="text-base leading-relaxed text-muted-foreground">{m.bio}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-20 flex flex-col items-center gap-4 rounded-3xl border border-gold/20 bg-background p-10 text-center shadow-elegant">
            <h2 className="font-serif text-3xl font-bold text-navy-deep">
              Work directly with our core team
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Book a consultation and get a legal partner who understands your business
              from day one.
            </p>
            <Link
              to="/booking"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
