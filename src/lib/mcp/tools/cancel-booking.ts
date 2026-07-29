import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser, notAuthenticated } from "../supabase";

export default defineTool({
  name: "cancel_booking",
  title: "Cancel a consultation",
  description: "Cancel one of the signed-in user's consultation bookings by its id.",
  inputSchema: {
    booking_id: z.string().describe("The booking id to cancel."),
    reason: z.string().optional().describe("Optional cancellation reason."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false },
  handler: async ({ booking_id, reason }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated;
    const { data, error } = await supabaseForUser(ctx)
      .from("bookings")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason ?? null,
      })
      .eq("id", booking_id)
      .select("id, status, cancelled_at")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data)
      return { content: [{ type: "text", text: "Booking not found." }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { booking: data },
    };
  },
});
