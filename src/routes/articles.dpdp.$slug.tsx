import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Calendar, Clock, ShieldCheck, ChevronRight, List } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { getDpdpArticle, dpdpArticles, type DpdpArticle } from "@/lib/dpdp-articles";

const logo = logoAsset.url;

export const Route = createFileRoute("/articles/dpdp/$slug")({
  loader: ({ params }) => {
    const article = getDpdpArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found | WIN Legal Advisors" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { article } = loaderData;
    const url = `https://www.winlegaladvisors.com/articles/dpdp/${params.slug}`;
    return {
      meta: [
        { title: `${article.title} | WIN Legal Advisors` },
        { name: "description", content: article.excerpt },
        { name: "author", content: "Adv. Vrushali Borade" },
        { name: "keywords", content: article.tags.join(", ") },
        { property: "og:title", content: article.title },
        { property: "og:description", content: article.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "WIN Legal Advisors" },
        { property: "article:published_time", content: article.date },
        { property: "article:author", content: "Adv. Vrushali Borade" },
        { property: "article:section", content: article.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: article.title },
        { name: "twitter:description", content: article.excerpt },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            author: { "@type": "Person", name: "Adv. Vrushali Borade" },
            publisher: {
              "@type": "Organization",
              name: "WIN Legal Advisors",
            },
            datePublished: article.date,
            mainEntityOfPage: url,
            articleSection: article.category,
            keywords: article.tags.join(", "),
          }),
        },
      ],
    };
  },
  component: DpdpArticleDetail,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl font-bold text-navy-deep">Article not found</h1>
        <p className="mt-2 text-navy/70">
          The article you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/articles/dpdp"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to articles
        </Link>
      </div>
    </div>
  ),
});

function DpdpArticleDetail() {
  const { article } = Route.useLoaderData() as { article: DpdpArticle };
  const currentIndex = dpdpArticles.findIndex((a) => a.slug === article.slug);
  const prev = currentIndex > 0 ? dpdpArticles[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < dpdpArticles.length - 1
      ? dpdpArticles[currentIndex + 1]
      : null;

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
        <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
          <Link
            to="/articles/dpdp"
            className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to articles
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
              {article.category}
            </span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-bold md:text-5xl">{article.title}</h1>
          <p className="mt-4 max-w-2xl text-cream/75">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wider text-cream/60">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {article.readTime}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gold">
              <ShieldCheck className="h-3.5 w-3.5" /> Adv. Vrushali Borade
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-14 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-navy/10 bg-cream/40 p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-deep">
                <List className="h-4 w-4 text-gold" />
                On this page
              </div>
              <nav aria-label="Table of contents" className="mt-4">
                <ul className="space-y-2 text-sm">
                  {article.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="block rounded-md px-2 py-1.5 text-navy/75 transition-colors hover:bg-navy/5 hover:text-navy-deep"
                      >
                        {s.heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="prose prose-neutral max-w-none">
              {article.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 mb-10">
                  <h2 className="group font-serif text-2xl font-bold text-navy-deep md:text-3xl">
                    <a href={`#${s.id}`} className="no-underline hover:text-gold">
                      {s.heading}
                    </a>
                  </h2>
                  <div className="mt-4 space-y-4 text-navy/80 leading-relaxed">
                    {s.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {article.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-navy/15 bg-cream/40 px-3 py-1 text-xs font-medium text-navy/75"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-12 grid gap-4 border-t border-navy/10 pt-8 md:grid-cols-2">
              {prev ? (
                <Link
                  to="/articles/dpdp/$slug"
                  params={{ slug: prev.slug }}
                  className="group rounded-xl border border-navy/10 p-5 transition-colors hover:border-gold/60 hover:bg-cream/40"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                    Previous
                  </div>
                  <div className="mt-1 font-serif text-lg font-semibold text-navy-deep group-hover:text-gold">
                    {prev.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  to="/articles/dpdp/$slug"
                  params={{ slug: next.slug }}
                  className="group rounded-xl border border-navy/10 p-5 text-right transition-colors hover:border-gold/60 hover:bg-cream/40"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-navy/60">
                    Next
                  </div>
                  <div className="mt-1 inline-flex items-center gap-1 font-serif text-lg font-semibold text-navy-deep group-hover:text-gold">
                    {next.title}
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              ) : null}
            </div>

            <div className="mt-14 rounded-2xl bg-navy-deep p-8 text-center text-cream md:p-10">
              <h3 className="font-serif text-2xl font-bold">Have questions on this topic?</h3>
              <p className="mt-2 text-cream/70">
                Book a confidential consultation with Adv. Vrushali Borade.
              </p>
              <Link
                to="/booking"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.03]"
              >
                <Calendar className="h-4 w-4" />
                Book Consultation
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
