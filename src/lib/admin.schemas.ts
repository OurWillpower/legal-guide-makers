import { z } from "zod";

export const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  quote: z.string().trim().min(1).max(1000),
  author_name: z.string().trim().min(1).max(120),
  author_role: z.string().trim().max(160).optional().or(z.literal("")),
  avatar_url: z.string().trim().max(500).optional().or(z.literal("")),
  published: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(1000),
  icon: z.string().trim().min(1).max(60),
  active: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
});

export const settingsSchema = z.object({
  time_slots: z.array(z.string().trim().min(1).max(20)).min(1).max(30),
  blocked_dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(365),
  buffer_days: z.number().int().min(0).max(30),
  timezone: z.string().trim().min(1).max(60),
  consultation_duration_minutes: z.number().int().min(15).max(240),
});

export const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(5000),
  sort_order: z.number().int().min(0).max(9999),
  published: z.boolean(),
});

export const emailTemplateSchema = z.object({
  id: z.string().uuid(),
  subject: z.string().trim().min(1).max(300),
  html: z.string().min(1).max(60000),
  text: z.string().max(20000).optional().or(z.literal("")),
});