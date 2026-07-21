import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Scale,
  Lock,
  FileSignature,
  Cpu,
  Handshake,
  Lightbulb,
  Landmark,
  Users,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { submitBooking, type BookingInput } from "@/lib/bookings.functions";

export const Route = createFileRoute("/booking")({
  component: BookingPage,
  head: () => ({
    meta: [
      { title: "Book a Free Legal Consultation — WIN Legal Advisors" },
      {
        name: "description",
        content:
          "Book a free 30-minute consultation with WIN Legal Advisors. Pick a service, date and time — we confirm within one business day.",
      },
      { property: "og:title", content: "Book a Free Legal Consultation — WIN Legal Advisors" },
      {
        property: "og:description",
        content:
          "Corporate, compliance, DPDP, IPR and regulatory advisory. Pick a service and time to meet with Adv. Vrushali Borade.",
      },
      { property: "og:url", content: "/booking" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
});

const SERVICES = [
  { id: "corporate", label: "Corporate Legal Services", Icon: Scale },
  { id: "contracts", label: "Contracts & Commercial Advisory", Icon: FileSignature },
  { id: "dpdp", label: "DPDP & Data Privacy Compliance", Icon: Lock },
  { id: "tech", label: "Technology, AI & Cyber Law", Icon: Cpu },
  { id: "ma", label: "Mergers, Acquisitions & JV", Icon: Handshake },
  { id: "ipr", label: "Intellectual Property & Innovation", Icon: Lightbulb },
  { id: "regulatory", label: "Regulatory & Compliance", Icon: Landmark },
  { id: "litigation", label: "Litigation & Dispute Resolution", Icon: Users },
];

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:30 AM",
  "12:30 PM",
  "02:30 PM",
  "03:30 PM",
  "04:30 PM",
  "05:30 PM",
];

function todayIso() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}
function plusDaysIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function BookingPage() {
  const submit = useServerFn(submitBooking);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<BookingInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof BookingInput>(k: K, v: BookingInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const canGo2 = form.service.length > 0;
  const canGo3 = form.preferredDate && form.preferredTime;
  const canSubmit = form.name && form.email && canGo2 && canGo3 && !submitting;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await submit({ data: form });
      setStep(4);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong — please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center">
            <img
              src={logoAsset.url}
              alt="WIN Legal Advisors — Vision to Victory"
              className="h-10 w-auto"
            />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            Book a Consultation
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
            A free 30-minute legal consultation.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Three quick steps. We'll confirm your slot within one business day.
          </p>
        </div>

        {/* Stepper */}
        <ol className="mx-auto mt-10 flex max-w-md items-center justify-between">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex flex-1 items-center">
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-serif text-sm font-bold transition-colors ${
                  step >= n
                    ? "bg-gradient-gold text-navy-deep"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {n}
              </div>
              {n < 3 && (
                <div
                  className={`mx-2 h-px flex-1 ${step > n ? "bg-gold" : "bg-border"}`}
                />
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl border border-navy/10 bg-card p-8 shadow-elegant md:p-10">
          {step === 1 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy-deep">
                Choose your service
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Pick the practice area that fits your need.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {SERVICES.map(({ id, label, Icon }) => {
                  const selected = form.service === label;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => update("service", label)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? "border-gold bg-gold/5 shadow-gold"
                          : "border-navy/10 bg-background hover:border-gold/40"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${
                          selected ? "bg-gradient-navy text-gold" : "bg-muted text-navy"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-serif text-sm font-semibold text-navy-deep">
                          {label}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  disabled={!canGo2}
                  onClick={() => setStep(2)}
                  className="rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy-deep">
                Pick a date & time
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All times in IST. We'll confirm within a business day.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                    <CalendarIcon className="h-4 w-4" /> Date
                  </span>
                  <input
                    type="date"
                    min={todayIso()}
                    max={plusDaysIso(120)}
                    value={form.preferredDate}
                    onChange={(e) => update("preferredDate", e.target.value)}
                    className="w-full rounded-xl border border-navy/15 bg-background px-4 py-3 text-navy-deep outline-none transition-colors focus:border-gold"
                  />
                </label>
                <div>
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold">
                    <Clock className="h-4 w-4" /> Time slot
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const selected = form.preferredTime === t;
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => update("preferredTime", t)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                            selected
                              ? "border-gold bg-gradient-gold text-navy-deep"
                              : "border-navy/10 bg-background text-navy hover:border-gold/40"
                          }`}
                        >
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-navy hover:text-gold"
                >
                  ← Back
                </button>
                <button
                  disabled={!canGo3}
                  onClick={() => setStep(3)}
                  className="rounded-full bg-gradient-gold px-7 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-serif text-2xl font-semibold text-navy-deep">
                Your details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We'll email your confirmation to this address.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Field
                  label="Full name *"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  maxLength={120}
                />
                <Field
                  label="Email *"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  maxLength={254}
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(v) => update("phone", v)}
                  maxLength={40}
                />
                <Field
                  label="Company"
                  value={form.company ?? ""}
                  onChange={(v) => update("company", v)}
                  maxLength={160}
                />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Tell us briefly what you need
                </span>
                <textarea
                  rows={4}
                  value={form.message ?? ""}
                  onChange={(e) => update("message", e.target.value)}
                  maxLength={2000}
                  className="w-full rounded-xl border border-navy/15 bg-background px-4 py-3 text-navy-deep outline-none transition-colors focus:border-gold"
                />
              </label>

              <div className="mt-6 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                <div>
                  <span className="text-gold">Service:</span> {form.service}
                </div>
                <div>
                  <span className="text-gold">When:</span> {form.preferredDate} ·{" "}
                  {form.preferredTime} IST
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-navy hover:text-gold"
                >
                  ← Back
                </button>
                <button
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  className="rounded-full bg-gradient-gold px-8 py-3 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Submitting…" : "Confirm request"}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-navy-deep shadow-gold">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-serif text-3xl font-bold text-navy-deep">
                Request received.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                We've emailed a confirmation to <strong>{form.email}</strong>.
                Our team will reach out within one business day to lock the slot.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/40 px-6 py-3 text-sm font-semibold text-navy hover:bg-gold/10"
              >
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-navy/15 bg-background px-4 py-3 text-navy-deep outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}
