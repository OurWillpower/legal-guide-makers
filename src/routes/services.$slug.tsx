import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Clock, Download, FileText, Sparkles } from "lucide-react";
import { SERVICE_PAGES, type ServicePage } from "@/lib/service-pages";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const page = SERVICE_PAGES[params.slug as ServicePage["slug"]];
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service — WIN Legal Advisors" }, { name: "robots", content: "noindex" }] };
    }
    const url = `https://www.winlegaladvisors.com/services/${loaderData.slug}`;
    return {
      meta: [
        { title: loaderData.seo.title },
        { name: "description", content: loaderData.seo.description },
        { property: "og:title", content: loaderData.seo.title },
        { property: "og:description", content: loaderData.seo.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "WIN Legal Advisors" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.seo.title },
        { name: "twitter:description", content: loaderData.seo.description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: loaderData.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.winlegaladvisors.com/" },
              { "@type": "ListItem", position: 2, name: "Services", item: "https://www.winlegaladvisors.com/#services" },
              { "@type": "ListItem", position: 3, name: loaderData.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: ServicePageView,
  notFoundComponent: ServiceNotFound,
});

function ServiceNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl font-bold text-navy-deep">Service not found</h1>
      <p className="mt-3 text-muted-foreground">This service page doesn't exist.</p>
      <Link to="/" className="mt-6 inline-block text-gold hover:underline">Back to home</Link>
    </div>
  );
}

function ServicePageView() {
  const page = Route.useLoaderData() as ServicePage;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <section className="border-b border-navy/10 bg-gradient-to-b from-cream/60 to-background">
        <div className="mx-auto max-w-4xl px-6 pt-8 md:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-navy-soft">
              <li>
                <Link to="/" className="hover:text-gold">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5 text-navy/40" /></li>
              <li>
                <Link to="/" hash="services" className="hover:text-gold">Services</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5 text-navy/40" /></li>
              <li aria-current="page" className="font-semibold text-navy-deep">{page.title}</li>
            </ol>
          </nav>
        </div>
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-8 md:pb-20">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">{page.eyebrow}</span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">{page.title}</h1>
          <p className="mt-4 text-lg text-navy-soft">{page.tagline}</p>
          <p className="mt-6 max-w-3xl text-muted-foreground">{page.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-cream shadow-sm transition hover:bg-navy-deep"
            >
              Book a consultation
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-navy/20 px-6 py-3 text-sm font-semibold text-navy-deep transition hover:border-gold hover:text-gold"
            >
              Request a scoping call
            </Link>
            <a
              href={page.checklist.url}
              download={page.checklist.filename}
              onClick={() =>
                trackEvent("checklist_download", {
                  service: page.slug,
                  location: "hero",
                  filename: page.checklist.filename,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg border border-gold/60 bg-gold/10 px-6 py-3 text-sm font-semibold text-navy-deep transition hover:bg-gold hover:text-navy-deep"
            >
              <Download className="h-4 w-4" /> Download checklist
            </a>
          </div>
        </div>
      </section>


      <main className="mx-auto max-w-4xl px-6 py-16 space-y-16">
        <section aria-labelledby="scope">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 id="scope" className="font-serif text-2xl font-bold text-navy-deep">Scope of work</h2>
          </div>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {page.scope.map((s) => (
              <li key={s} className="flex gap-3 rounded-lg border border-navy/10 bg-cream/30 p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                <span className="text-sm text-navy-soft">{s}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="deliverables">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-gold" />
            <h2 id="deliverables" className="font-serif text-2xl font-bold text-navy-deep">Deliverables</h2>
          </div>
          <ul className="mt-6 space-y-2">
            {page.deliverables.map((d) => (
              <li key={d} className="flex gap-3 border-l-2 border-gold/60 pl-4 py-1 text-navy-soft">
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="timeline">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gold" />
            <h2 id="timeline" className="font-serif text-2xl font-bold text-navy-deep">Timeline</h2>
          </div>
          <ol className="mt-6 space-y-4">
            {page.timeline.map((t, i) => (
              <li key={t.phase} className="rounded-xl border border-navy/10 bg-background p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-serif text-lg font-semibold text-navy-deep">
                    <span className="text-gold">{String(i + 1).padStart(2, "0")}.</span> {t.phase}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">{t.duration}</span>
                </div>
                <p className="mt-2 text-sm text-navy-soft">{t.detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            Timelines are indicative. Regulatory processing times and third-party responses may vary.
          </p>
        </section>

        <section
          aria-labelledby="download"
          className="rounded-2xl border border-gold/40 bg-cream/50 p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-gold/20 text-gold">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 id="download" className="font-serif text-xl font-bold text-navy-deep">
                  {page.checklist.label}
                </h2>
                <p className="mt-1 text-sm text-navy-soft">
                  A printable scope and checklist you can share internally before we start.
                </p>
              </div>
            </div>
            <a
              href={page.checklist.url}
              download={page.checklist.filename}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-sm font-semibold text-cream transition hover:bg-navy-deep"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
          </div>
        </section>


        <section aria-labelledby="faqs">
          <h2 id="faqs" className="font-serif text-2xl font-bold text-navy-deep">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {page.faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-navy/10 bg-cream/40 p-5 open:border-gold open:bg-cream"
              >
                <summary className="cursor-pointer list-none font-serif text-base font-semibold text-navy-deep marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 whitespace-pre-wrap text-navy-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gold/40 bg-navy p-8 text-cream md:p-10">
          <h2 className="font-serif text-2xl font-bold">Ready to get started?</h2>
          <p className="mt-2 text-cream/80">
            Book a consultation with Adv. Vrushali Borade to discuss your requirements and get a fixed-scope proposal.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold/90"
            >
              Book consultation
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-cream/30 px-6 py-3 text-sm font-semibold text-cream hover:border-gold hover:text-gold"
            >
              Contact us
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
