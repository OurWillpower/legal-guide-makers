import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { dpdpArticles, dpdpCategories } from "@/lib/dpdp-articles";

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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "DPDP Act Articles & Insights",
          url: "https://www.winlegaladvisors.com/articles/dpdp",
          publisher: { "@type": "Organization", name: "WIN Legal Advisors" },
          blogPost: dpdpArticles.map((a) => ({
            "@type": "BlogPosting",
            headline: a.title,
            url: `https://www.winlegaladvisors.com/articles/dpdp/${a.slug}`,
            datePublished: a.date,
            description: a.excerpt,
            author: { "@type": "Person", name: "Adv. Vrushali Borade" },
          })),
        }),
      },
    ],
  }),
});

function DpdpArticles() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return dpdpArticles.filter((a) => {
      const matchesTag = !activeTag || a.tags.includes(activeTag);
      if (!matchesTag) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, activeTag]);

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

      <main className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        {/* Search + filters */}
        <div className="rounded-2xl border border-navy/10 bg-cream/40 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search articles</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search DPDP articles…"
                className="w-full rounded-full border border-navy/15 bg-background py-2.5 pl-10 pr-4 text-sm text-navy-deep placeholder:text-navy/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
              />
            </label>
            <div className="text-xs font-semibold uppercase tracking-wider text-navy/60">
              {filtered.length} article{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeTag === null
                  ? "border-gold bg-gold/15 text-navy-deep"
                  : "border-navy/15 bg-background text-navy/70 hover:border-gold/60"
              }`}
            >
              All topics
            </button>
            {dpdpCategories.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  activeTag === tag
                    ? "border-gold bg-gold/15 text-navy-deep"
                    : "border-navy/15 bg-background text-navy/70 hover:border-gold/60"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Articles list */}
        <div className="mt-10 space-y-6">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-navy/20 p-10 text-center text-navy/60">
              No articles match your search. Try clearing the filter.
            </div>
          ) : (
            filtered.map((a) => (
              <article
                key={a.slug}
                className="group rounded-2xl border border-navy/10 bg-background p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-wider text-navy/60">
                  <span className="inline-flex items-center gap-1.5 text-gold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {a.category}
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
                  <Link
                    to="/articles/dpdp/$slug"
                    params={{ slug: a.slug }}
                    className="transition-colors hover:text-gold"
                  >
                    {a.title}
                  </Link>
                </h2>
                <p className="mt-3 text-navy/70">{a.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-navy/15 bg-cream/40 px-2.5 py-0.5 text-[11px] font-medium text-navy/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  to="/articles/dpdp/$slug"
                  params={{ slug: a.slug }}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-deep transition-colors hover:text-gold"
                >
                  Read article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))
          )}
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
