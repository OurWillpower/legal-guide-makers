import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { getMyBookings } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, LogOut } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  component: MyBookings,
  head: () => ({ meta: [{ title: "My Bookings — WIN Legal Advisors" }, { name: "robots", content: "noindex" }] }),
});

type BookingRow = {
  id: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: string;
  cancelled_at: string | null;
  reschedule_count: number;
  created_at: string;
  message: string | null;
};

type Filter = "upcoming" | "rescheduled" | "cancelled" | "all";

function statusBadge(row: BookingRow) {
  const s = row.cancelled_at ? "cancelled" : row.status;
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-800 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-800 border-emerald-200",
    completed: "bg-slate-100 text-slate-700 border-slate-200",
    cancelled: "bg-rose-50 text-rose-800 border-rose-200",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[s] ?? map.pending}`}>
      {s}
    </span>
  );
}

function MyBookings() {
  const fetchBookings = useServerFn(getMyBookings);
  const { data, isLoading } = useQuery({ queryKey: ["my-bookings"], queryFn: () => fetchBookings() });
  const [filter, setFilter] = useState<Filter>("upcoming");

  const signOut = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const today = new Date().toISOString().slice(0, 10);
  const rows = (data ?? []) as BookingRow[];

  const filtered = useMemo(() => {
    if (filter === "all") return rows;
    if (filter === "cancelled") return rows.filter((b) => !!b.cancelled_at);
    if (filter === "rescheduled")
      return rows.filter((b) => !b.cancelled_at && b.reschedule_count > 0);
    // upcoming
    return rows.filter((b) => !b.cancelled_at && b.preferred_date >= today);
  }, [rows, filter, today]);

  const counts = useMemo(
    () => ({
      upcoming: rows.filter((b) => !b.cancelled_at && b.preferred_date >= today).length,
      rescheduled: rows.filter((b) => !b.cancelled_at && b.reschedule_count > 0).length,
      cancelled: rows.filter((b) => !!b.cancelled_at).length,
      all: rows.length,
    }),
    [rows, today],
  );

  const tabs: { key: Filter; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "rescheduled", label: "Rescheduled" },
    { key: "cancelled", label: "Cancelled" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" /></Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-deep">My Consultations</h1>
            <p className="text-muted-foreground">View, reschedule, or cancel your appointments.</p>
          </div>
          <Link to="/booking">
            <Button className="bg-gradient-navy hover:opacity-95">Book new consultation</Button>
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-navy/10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                filter === t.key
                  ? "border-gold text-navy-deep"
                  : "border-transparent text-muted-foreground hover:text-navy"
              }`}
            >
              {t.label}
              <span className="ml-2 rounded-full bg-navy/5 px-2 py-0.5 text-xs text-navy">
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center">
            <p className="mb-4 text-muted-foreground">
              {filter === "upcoming"
                ? "No upcoming consultations."
                : filter === "rescheduled"
                  ? "No rescheduled bookings."
                  : filter === "cancelled"
                    ? "No cancelled bookings."
                    : "You haven't booked a consultation yet."}
            </p>
            <Link to="/booking">
              <Button>Book a consultation</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b) => (
              <Link
                key={b.id}
                to="/manage-booking/$id"
                params={{ id: b.id }}
                className="flex items-center justify-between rounded-xl border border-navy/10 bg-cream/40 p-5 transition hover:border-gold hover:shadow-sm"
              >
                <div>
                  <div className="mb-1 flex items-center gap-3">
                    <span className="font-serif text-lg font-semibold text-navy-deep">{b.service}</span>
                    {statusBadge(b)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> {b.preferred_date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4" /> {b.preferred_time}
                    </span>
                    {b.reschedule_count > 0 && (
                      <span className="text-gold">Rescheduled {b.reschedule_count}×</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-navy/40" />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
