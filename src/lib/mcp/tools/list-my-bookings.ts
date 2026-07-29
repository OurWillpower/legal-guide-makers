import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser, notAuthenticated } from "../supabase";

export default defineTool({
  name: "list_my_bookings",
  title: "List my consultations",
  description: "List the signed-in user's consultation bookings with WIN Legal Advisors.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const { data, error } = await supabaseForUser(ctx)
      .from("bookings")
      .select("id, service, preferred_date, preferred_time, status, cancelled_at, created_at")
      .order("preferred_date", { ascending: false });
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { bookings: data ?? [] },
    };
  },
});
