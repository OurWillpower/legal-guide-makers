import { z } from "zod";

export const webinarRegistrationSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  designation: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid business email").max(254),
  mobile: z
    .string()
    .trim()
    .min(8, "Enter your WhatsApp number")
    .max(40)
    .regex(/^[+\d][\d\s()-]{7,}$/, "Enter a valid WhatsApp number with country code"),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  challenge: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Please accept to continue" }),
});

export type WebinarRegistrationInput = z.infer<typeof webinarRegistrationSchema>;

export const WEBINAR = {
  slug: "saas-legal-masterclass-2026-08-07",
  title: "Building a Legally Scalable SaaS Company",
  subtitle: "Beyond Privacy Policies",
  dateLabel: "Friday, 7 August 2026",
  timeLabel: "4:00 PM IST",
  mode: "Online",
  /** 7 Aug 2026, 16:00 IST = 10:30 UTC */
  startsAtISO: "2026-08-07T10:30:00.000Z",
  notifyEmail: "AdvocateBorade@gmail.com",
} as const;
