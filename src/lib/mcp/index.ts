import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listServices from "./tools/list-services";
import getService from "./tools/get-service";
import listMyBookings from "./tools/list-my-bookings";
import createBooking from "./tools/create-booking";
import cancelBooking from "./tools/cancel-booking";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "win-legal-advisors-hub",
  title: "Win Legal Advisors Hub",
  version: "0.1.0",
  instructions:
    "Tools for WIN Legal Advisors. Use `list_services` and `get_service` to explore the firm's legal services, and `list_my_bookings`, `create_booking` and `cancel_booking` to manage the signed-in client's consultations.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listServices, getService, listMyBookings, createBooking, cancelBooking],
});
