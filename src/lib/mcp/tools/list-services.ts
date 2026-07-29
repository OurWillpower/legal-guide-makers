import { defineTool } from "@lovable.dev/mcp-js";
import { SERVICE_PAGES } from "@/lib/service-pages";

export default defineTool({
  name: "list_services",
  title: "List legal services",
  description:
    "List every legal service WIN Legal Advisors offers, with its slug, title and one-line summary.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const services = Object.values(SERVICE_PAGES).map((s) => ({
      slug: s.slug,
      title: s.title,
      tagline: s.tagline,
      url: `https://www.winlegaladvisors.com/services/${s.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
      structuredContent: { services },
    };
  },
});
