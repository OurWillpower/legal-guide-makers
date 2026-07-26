import { supabase } from "@/integrations/supabase/client";

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

/**
 * Fire-and-forget analytics event logger.
 * Writes to public.analytics_events. Safe to call from any client component.
 */
export function trackEvent(eventName: string, properties: AnalyticsProperties = {}) {
  if (typeof window === "undefined") return;
  try {
    const payload = {
      event_name: eventName,
      path: window.location.pathname + window.location.search,
      properties: properties as Record<string, unknown>,
      user_agent: navigator.userAgent?.slice(0, 500) ?? null,
      referrer: document.referrer?.slice(0, 500) || null,
    };
    // Fire and forget — don't block the click.
    void supabase.from("analytics_events").insert(payload);
  } catch {
    // Analytics must never break UX.
  }
}
