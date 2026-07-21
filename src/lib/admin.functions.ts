import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const isAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return Boolean(data);
  });

// --- Testimonials
const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  quote: z.string().trim().min(1).max(1000),
  author_name: z.string().trim().min(1).max(120),
  author_role: z.string().trim().max(160).optional().or(z.literal("")),
  avatar_url: z.string().trim().max(500).optional().or(z.literal("")),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const adminListTestimonials = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const saveTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => testimonialSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      quote: data.quote,
      author_name: data.author_name,
      author_role: data.author_role || null,
      avatar_url: data.avatar_url || null,
      published: data.published,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await context.supabase.from("testimonials").update(row).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("testimonials").insert(row);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deleteTestimonial = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("testimonials").delete().eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

// --- Services
const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  icon: z.string().trim().min(1).max(60),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const adminListServices = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => serviceSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const row = {
      slug: data.slug,
      title: data.title,
      description: data.description,
      icon: data.icon,
      active: data.active,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await context.supabase.from("services").update(row).eq("id", data.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("services").insert(row);
      if (error) throw error;
    }
    return { ok: true };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((id: string) => z.string().uuid().parse(id))
  .handler(async ({ data: id, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

// --- Booking settings
const settingsSchema = z.object({
  time_slots: z.array(z.string().trim().min(1).max(20)).min(1).max(30),
  blocked_dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(365),
  buffer_days: z.number().int().min(0).max(30),
  timezone: z.string().trim().min(1).max(60),
  consultation_duration_minutes: z.number().int().min(15).max(240),
});

export const saveBookingSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => settingsSchema.parse(raw))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: existing } = await context.supabase.from("booking_settings").select("id").limit(1).maybeSingle();
    if (existing) {
      const { error } = await context.supabase
        .from("booking_settings")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("booking_settings").insert(data);
      if (error) throw error;
    }
    return { ok: true };
  });

// --- Bookings & messages inbox
export const adminListBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  });

export const adminUpdateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(["pending", "confirmed", "completed", "cancelled"]) }).parse(raw),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("bookings").update({ status: data.status }).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const adminListMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return data ?? [];
  });
