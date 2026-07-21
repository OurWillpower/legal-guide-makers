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
