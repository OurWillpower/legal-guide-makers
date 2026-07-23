import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { ArrowLeft } from "lucide-react";
import { listFaqs } from "@/lib/content.functions";

const faqsQuery = queryOptions({
  queryKey: ["public-faqs"],
  queryFn: () => listFaqs(),
});

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  component: FAQ,
  head: ({ loaderData }) => {
    const items = (loaderData as { question: string; answer: string }[] | undefined) ?? [];
    return {
      meta: [
        { title: "Frequently Asked Questions — WIN Legal Advisors" },
        {
          name: "description",
          content:
            "Common questions about consultations, industries served, DPDP compliance, litigation, pricing, and how to work with WIN Legal Advisors.",
        },
        { property: "og:title", content: "FAQ — WIN Legal Advisors" },
        { property: "og:description", content: "Answers to common questions about WIN Legal Advisors." },
        { property: "og:url", content: "https://www.winlegaladvisors.com/faq" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "WIN Legal Advisors" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "FAQ — WIN Legal Advisors" },
        { name: "twitter:description", content: "Answers to common questions about WIN Legal Advisors." },
      ],
      links: [{ rel: "canonical", href: "https://www.winlegaladvisors.com/faq" }],
      scripts: items.length
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: items.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              }),
            },
          ]
        : undefined,
    };
  },
});

function FAQ() {
  const { data: faqs } = useSuspenseQuery(faqsQuery);

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
          {faqs.map((f) => (
            <details
              key={f.id}
              className="group rounded-xl border border-navy/10 bg-cream/40 p-5 open:border-gold open:bg-cream"
            >
              <summary className="cursor-pointer list-none font-serif text-lg font-semibold text-navy-deep marker:hidden">
                {f.question}
              </summary>
              <p className="mt-3 whitespace-pre-wrap text-navy-soft">{f.answer}</p>
            </details>
          ))}
          {faqs.length === 0 && (
            <p className="text-center text-muted-foreground">No FAQs published yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
