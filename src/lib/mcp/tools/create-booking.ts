import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, notAuthenticated } from "../supabase";

export default defineTool({
  name: "create_booking",
  title: "Book a consultation",
  description:
    "Create a consultation booking for the signed-in user. Date must be YYYY-MM-DD and time HH:MM (24h, IST).",
  inputSchema: {
    name: z.string().describe("Full name of the client."),
    email: z.string().describe("Contact email address."),
    phone: z.string().optional().describe("Contact phone number."),
    company: z.string().optional().describe("Company or organisation name."),
    service: z.string().describe("Service required, e.g. 'Company Incorporation'."),
    preferred_date: z.string().describe("Preferred date, YYYY-MM-DD."),
    preferred_time: z.string().describe("Preferred time, HH:MM in 24h IST."),
    message: z.string().optional().describe("Short description of the legal matter."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const { data, error } = await supabaseForUser(ctx)
      .from("bookings")
      .insert({ ...input, user_id: ctx.getUserId() })
      .select("id, service, preferred_date, preferred_time, status")
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { booking: data },
    };
  },
});
