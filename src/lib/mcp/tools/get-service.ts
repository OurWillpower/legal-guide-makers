import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { SERVICE_PAGES } from "@/lib/service-pages";

export default defineTool({
  name: "get_service",
  title: "Get service details",
  description:
    "Get the full scope, deliverables, timeline and FAQs for one WIN Legal Advisors service by its slug.",
  inputSchema: {
    slug: z.string().describe("Service slug, e.g. 'incorporation' or 'trademark'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const service = SERVICE_PAGES[slug];
    if (!service) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Unknown service '${slug}'. Available: ${Object.keys(SERVICE_PAGES).join(", ")}`,
          },
        ],
        isError: true,
      };
    }
    const payload = {
      slug: service.slug,
      title: service.title,
      tagline: service.tagline,
      intro: service.intro,
      scope: service.scope,
      deliverables: service.deliverables,
      timeline: service.timeline,
      faqs: service.faqs,
      url: `https://www.winlegaladvisors.com/services/${service.slug}`,
    };
    return {
      content: [{ type: "text" as const, text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
