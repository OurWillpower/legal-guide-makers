import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Backend is not configured");
  }

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export async function listServicesData() {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, description, icon, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getServiceBySlugData(slug: string) {
  const supabase = publicClient();
  const { data } = await supabase
    .from("services")
    .select("id, slug, title, description, icon")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  return data;
}

export async function listTestimonialsData() {
  const supabase = publicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_role, avatar_url, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getBookingSettingsData() {
  const supabase = publicClient();
  const { data } = await supabase
    .from("booking_settings")
    .select("time_slots, blocked_dates, buffer_days, timezone, consultation_duration_minutes")
    .limit(1)
    .maybeSingle();
  return (
    data ?? {
      time_slots: ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"],
      blocked_dates: [],
      buffer_days: 1,
      timezone: "Asia/Kolkata",
      consultation_duration_minutes: 45,
    }
  );
}

export async function listFaqsData() {
  const supabase = publicClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPublicBookingStatusData(data: { id: string; token: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: b } = await supabaseAdmin
    .from("bookings")
    .select(
      "id, name, service, preferred_date, preferred_time, status, cancelled_at, cancellation_reason, reschedule_count, message, manage_token, created_at, payment_status, payment_amount, payment_currency, payment_reference",
    )
    .eq("id", data.id)
    .maybeSingle();
  if (!b || b.manage_token !== data.token) return null;
  const { data: events } = await supabaseAdmin
    .from("booking_events")
    .select("id, event_type, meta, created_at")
    .eq("booking_id", data.id)
    .order("created_at", { ascending: true });
  const { manage_token: _token, ...safe } = b;
  void _token;
  return { booking: safe, events: events ?? [] };
}