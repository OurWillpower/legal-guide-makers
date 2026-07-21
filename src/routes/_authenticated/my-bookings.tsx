import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "@/lib/bookings.functions";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, ArrowRight, LogOut } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

export const Route = createFileRoute("/_authenticated/my-bookings")({
  component: MyBookings,
  head: () => ({ meta: [{ title: "My Bookings — WIN Legal Advisors" }, { name: "robots", content: "noindex" }] }),
});

function statusBadge(row: { status: string; cancelled_at: string | null }) {
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

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/">
            <img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" />
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-navy-deep">My Consultations</h1>
            <p className="text-muted-foreground">View, reschedule, or cancel your appointments.</p>
          </div>
          <Link to="/booking">
            <Button className="bg-gradient-navy hover:opacity-95">Book new consultation</Button>
          </Link>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !data || data.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center">
            <p className="mb-4 text-muted-foreground">You haven't booked a consultation yet.</p>
            <Link to="/booking">
              <Button>Book your first consultation</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((b) => (
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
