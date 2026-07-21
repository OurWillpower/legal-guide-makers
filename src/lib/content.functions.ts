// Public read-only content — safe to call from public loaders during SSR.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(process.env.SUPABASE_URL!, key, {
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

export const listServices = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("services")
    .select("id, slug, title, description, icon, sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const supabase = publicClient();
    const { data } = await supabase
      .from("services")
      .select("id, slug, title, description, icon")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();
    return data;
  });

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("testimonials")
    .select("id, quote, author_name, author_role, avatar_url, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getBookingSettings = createServerFn({ method: "GET" }).handler(async () => {
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
});

export const listFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, sort_order")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});
