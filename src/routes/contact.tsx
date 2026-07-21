import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Phone, Globe } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { submitContactMessage, type ContactInput } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact WIN Legal Advisors — Talk to a Corporate Lawyer" },
      {
        name: "description",
        content:
          "Get in touch with WIN Legal Advisors. Corporate, compliance, DPDP, IPR and regulatory legal advisory. We reply within one business day.",
      },
      { property: "og:title", content: "Contact WIN Legal Advisors" },
      {
        property: "og:description",
        content:
          "Speak with WIN Legal Advisors about corporate, compliance, DPDP, IPR and regulatory needs.",
      },
      { property: "og:url", content: "/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const submit = useServerFn(submitContactMessage);
  const [form, setForm] = useState<ContactInput>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof ContactInput>(k: K, v: ContactInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setError(null);
    try {
      await submit({ data: form });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-gradient-navy">
              <span className="font-serif text-base font-bold text-gold">W</span>
            </span>
            <span className="font-serif text-lg font-bold text-navy-deep">
              WIN Legal Advisors
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-[1fr_1.2fr]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">
            Contact
          </span>
          <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">
            Let's talk.
          </h1>
          <div className="divider-gold my-6 max-w-xs" />
          <p className="text-lg text-muted-foreground">
            Whether it's a fundraise, a new market, a compliance concern or a
            contract dispute — we usually reply within one business day.
          </p>

          <ul className="mt-10 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-navy text-gold">
                <Mail className="h-4 w-4" />
              </span>
              <a
                href="mailto:contact@winlegaladvisors.com"
                className="text-navy hover:text-gold"
              >
                contact@winlegaladvisors.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-navy text-gold">
                <Globe className="h-4 w-4" />
              </span>
              www.winlegaladvisors.com
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-navy text-gold">
                <Phone className="h-4 w-4" />
              </span>
              India · Pan-India Practice
            </li>
          </ul>

          <div className="mt-10 rounded-2xl border border-navy/10 bg-muted p-6">
            <p className="font-serif text-lg font-semibold text-navy-deep">
              Prefer a scheduled call?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Book a free 30-minute consultation with a defined slot.
            </p>
            <Link
              to="/booking"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-5 py-2.5 text-sm font-semibold text-navy-deep shadow-gold hover:scale-[1.02] transition-transform"
            >
              Book consultation
            </Link>
          </div>
        </div>

        <div>
          {sent ? (
            <div className="rounded-3xl border border-navy/10 bg-card p-10 text-center shadow-elegant">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-navy-deep shadow-gold">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="mt-6 font-serif text-2xl font-bold text-navy-deep">
                Message received.
              </h2>
              <p className="mt-3 text-muted-foreground">
                A confirmation has been sent to <strong>{form.email}</strong>. We'll
                be in touch shortly.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-navy/10 bg-card p-8 shadow-elegant md:p-10"
            >
              <h2 className="font-serif text-2xl font-semibold text-navy-deep">
                Send us a message
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <TextField
                  label="Full name *"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  maxLength={120}
                  required
                />
                <TextField
                  label="Email *"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  maxLength={254}
                  required
                />
                <TextField
                  label="Phone"
                  type="tel"
                  value={form.phone ?? ""}
                  onChange={(v) => update("phone", v)}
                  maxLength={40}
                />
                <TextField
                  label="Subject"
                  value={form.subject ?? ""}
                  onChange={(v) => update("subject", v)}
                  maxLength={200}
                />
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
                  Message *
                </span>
                <textarea
                  rows={6}
                  required
                  maxLength={2000}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className="w-full rounded-xl border border-navy/15 bg-background px-4 py-3 text-navy-deep outline-none transition-colors focus:border-gold"
                />
              </label>
              {error && (
                <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-full bg-gradient-gold px-8 py-3.5 text-sm font-semibold text-navy-deep shadow-gold transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-gold">
        {label}
      </span>
      <input
        type={type}
        required={required}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-navy/15 bg-background px-4 py-3 text-navy-deep outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}
