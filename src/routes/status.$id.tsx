import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { getPublicBookingStatus } from "@/lib/content.functions";
import { Calendar, Clock, CheckCircle2, XCircle, RotateCcw, Bell, Sparkles, Download, Receipt } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

const statusSearchSchema = z.object({ token: z.string().min(10) });

export const Route = createFileRoute("/status/$id")({
  validateSearch: statusSearchSchema,
  component: PublicStatus,
  head: () => ({
    meta: [
      { title: "Booking status — WIN Legal Advisors" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function eventIcon(type: string) {
  if (type.startsWith("reminder")) return <Bell className="h-4 w-4 text-gold" />;
  if (type === "cancelled") return <XCircle className="h-4 w-4 text-rose-600" />;
  if (type === "rescheduled") return <RotateCcw className="h-4 w-4 text-amber-600" />;
  if (type === "created") return <Sparkles className="h-4 w-4 text-emerald-600" />;
  return <CheckCircle2 className="h-4 w-4 text-navy" />;
}

function eventLabel(type: string): string {
  return (
    {
      created: "Booking created",
      rescheduled: "Rescheduled",
      cancelled: "Cancelled",
      reminder_email_24h_sent: "24h email reminder sent",
      reminder_email_2h_sent: "2h email reminder sent",
      reminder_whatsapp_24h_sent: "24h WhatsApp reminder sent",
      reminder_whatsapp_2h_sent: "2h WhatsApp reminder sent",
    }[type] ?? type
  );
}

function statusBadge(status: string, cancelled: string | null): { label: string; cls: string } {
  if (cancelled) return { label: "Cancelled", cls: "bg-rose-50 text-rose-800 border-rose-200" };
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending confirmation", cls: "bg-amber-50 text-amber-800 border-amber-200" },
    confirmed: { label: "Confirmed", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    completed: { label: "Completed", cls: "bg-slate-100 text-slate-700 border-slate-200" },
    cancelled: { label: "Cancelled", cls: "bg-rose-50 text-rose-800 border-rose-200" },
  };
  return map[status] ?? map.pending;
}

function PublicStatus() {
  const { id } = Route.useParams();
  const { token } = useSearch({ from: Route.id });
  const fetchStatus = useServerFn(getPublicBookingStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["public-status", id, token],
    queryFn: () => fetchStatus({ data: { id, token } }),
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" /></Link>
          <Link to="/contact" className="text-sm font-medium text-navy hover:text-gold">Need help?</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {isLoading ? (
          <p className="text-muted-foreground">Loading booking…</p>
        ) : !data ? (
          <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center">
            <h1 className="font-serif text-2xl font-bold text-navy-deep">Booking not found</h1>
            <p className="mt-3 text-muted-foreground">
              This status link is invalid or has expired. Please check the URL in your confirmation email.
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Booking status</span>
              <h1 className="mt-3 font-serif text-3xl font-bold text-navy-deep md:text-4xl">
                {data.booking.service}
              </h1>
              <div className="mt-4 flex justify-center">
                {(() => {
                  const s = statusBadge(data.booking.status, data.booking.cancelled_at);
                  return (
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${s.cls}`}>
                      {s.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-navy/10 bg-cream/40 p-6 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Date</div>
                <div className="mt-1 flex items-center gap-2 font-serif text-lg text-navy-deep">
                  <Calendar className="h-4 w-4 text-gold" /> {data.booking.preferred_date}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Time</div>
                <div className="mt-1 flex items-center gap-2 font-serif text-lg text-navy-deep">
                  <Clock className="h-4 w-4 text-gold" /> {data.booking.preferred_time}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Client</div>
                <div className="mt-1 font-medium text-navy-deep">{data.booking.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Reschedules</div>
                <div className="mt-1 font-medium text-navy-deep">
                  {data.booking.reschedule_count} / 3 used
                </div>
              </div>
              {data.booking.cancellation_reason ? (
                <div className="md:col-span-2">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Cancellation reason</div>
                  <div className="mt-1 text-navy-soft">{data.booking.cancellation_reason}</div>
                </div>
              ) : null}
            </div>

            {(() => {
              const b = data.booking as {
                payment_status?: string | null;
                payment_amount?: number | null;
                payment_currency?: string | null;
                payment_reference?: string | null;
              };
              const status = (b.payment_status ?? "complimentary").toLowerCase();
              const amount = Number(b.payment_amount ?? 0);
              const currency = (b.payment_currency ?? "INR").toUpperCase();
              const label: Record<string, string> = {
                complimentary: "Complimentary",
                pending: "Payment pending",
                paid: "Paid",
                refunded: "Refunded",
                waived: "Fee waived",
              };
              const badge: Record<string, string> = {
                complimentary: "bg-slate-100 text-slate-700 border-slate-200",
                pending: "bg-amber-50 text-amber-800 border-amber-200",
                paid: "bg-emerald-50 text-emerald-800 border-emerald-200",
                refunded: "bg-rose-50 text-rose-800 border-rose-200",
                waived: "bg-slate-100 text-slate-700 border-slate-200",
              };
              const receiptUrl = `/api/public/booking-pdf/${data.booking.id}?token=${encodeURIComponent(token)}`;
              return (
                <section className="mt-6 rounded-2xl border border-gold/30 bg-background p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Receipt className="h-6 w-6 text-gold" />
                      <div>
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">Payment</div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="font-serif text-lg font-semibold text-navy-deep">
                            {amount > 0 ? `${currency} ${amount.toFixed(2)}` : "No charge"}
                          </span>
                          <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge[status] ?? badge.complimentary}`}>
                            {label[status] ?? status}
                          </span>
                        </div>
                        {b.payment_reference && (
                          <div className="mt-1 text-xs text-muted-foreground">Ref: {b.payment_reference}</div>
                        )}
                      </div>
                    </div>
                    <a
                      href={receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-navy/20 bg-cream px-4 py-2 text-sm font-medium text-navy-deep hover:border-gold hover:bg-gold/10"
                    >
                      <Download className="h-4 w-4" /> Download receipt (PDF)
                    </a>
                  </div>
                </section>
              );
            })()}


            <section className="mt-10">
              <h2 className="font-serif text-xl font-semibold text-navy-deep">Timeline</h2>
              <ol className="mt-4 space-y-3 border-l border-gold/40 pl-6">
                {data.events.map((e: { id: string; event_type: string; created_at: string }) => (
                  <li key={e.id} className="relative">
                    <span className="absolute -left-[33px] top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 bg-background">
                      {eventIcon(e.event_type)}
                    </span>
                    <div className="text-sm font-medium text-navy-deep">{eventLabel(e.event_type)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(e.created_at).toLocaleString()}
                    </div>
                  </li>
                ))}
                {data.events.length === 0 && (
                  <li className="text-sm text-muted-foreground">No events yet.</li>
                )}
              </ol>
            </section>

            <div className="mt-10 rounded-2xl border border-gold/30 bg-navy p-6 text-center text-cream">
              <p className="text-sm">
                To reschedule or cancel, please <Link to="/auth" className="font-semibold text-gold underline">sign in</Link> or reply to your confirmation email.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
