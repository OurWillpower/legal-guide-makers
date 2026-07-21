import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getMyBooking, rescheduleBooking, cancelBooking } from "@/lib/bookings.functions";
import { getBookingSettings } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Clock, AlertTriangle } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

export const Route = createFileRoute("/_authenticated/manage-booking/$id")({
  component: ManageBooking,
  head: () => ({ meta: [{ title: "Manage Booking — WIN Legal Advisors" }, { name: "robots", content: "noindex" }] }),
});

function ManageBooking() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchOne = useServerFn(getMyBooking);
  const fetchSettings = useServerFn(getBookingSettings);
  const doReschedule = useServerFn(rescheduleBooking);
  const doCancel = useServerFn(cancelBooking);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchOne({ data: id }),
  });
  const { data: settings } = useQuery({ queryKey: ["booking-settings"], queryFn: () => fetchSettings() });

  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  if (isLoading) return <p className="p-8">Loading…</p>;
  if (!booking) return <p className="p-8">Booking not found.</p>;

  const isCancelled = !!booking.cancelled_at;

  const submitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await doReschedule({ data: { id, preferredDate: date, preferredTime: time } });
      toast.success("Rescheduled — confirmation email sent.");
      qc.invalidateQueries({ queryKey: ["booking", id] });
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      setMode("view");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reschedule.");
    }
    setBusy(false);
  };

  const submitCancel = async () => {
    setBusy(true);
    try {
      await doCancel({ data: { id, reason } });
      toast.success("Booking cancelled — confirmation email sent.");
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      navigate({ to: "/my-bookings" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel.");
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link to="/">
            <img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" />
          </Link>
          <Link to="/my-bookings" className="inline-flex items-center gap-2 text-sm text-navy hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> All bookings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-2 font-serif text-3xl font-bold text-navy-deep">{booking.service}</h1>
        <p className="mb-6 text-muted-foreground">Booking ID: {booking.id.slice(0, 8)}</p>

        <div className="mb-6 grid gap-4 rounded-2xl border border-navy/10 bg-cream/40 p-6 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Date</div>
            <div className="mt-1 inline-flex items-center gap-2 font-serif text-lg text-navy-deep">
              <Calendar className="h-4 w-4" /> {booking.preferred_date}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Time</div>
            <div className="mt-1 inline-flex items-center gap-2 font-serif text-lg text-navy-deep">
              <Clock className="h-4 w-4" /> {booking.preferred_time}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Status</div>
            <div className="mt-1 font-medium text-navy-deep">{isCancelled ? "Cancelled" : booking.status}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Reschedules</div>
            <div className="mt-1 font-medium text-navy-deep">{booking.reschedule_count} / 3</div>
          </div>
        </div>

        {isCancelled ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-700 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-900">This booking has been cancelled.</div>
                {booking.cancellation_reason && (
                  <div className="mt-1 text-sm text-rose-800">Reason: {booking.cancellation_reason}</div>
                )}
              </div>
            </div>
          </div>
        ) : mode === "view" ? (
          <div className="flex gap-3">
            <Button onClick={() => setMode("reschedule")} className="bg-gradient-navy hover:opacity-95">
              Reschedule
            </Button>
            <Button onClick={() => setMode("cancel")} variant="outline" className="border-rose-300 text-rose-700 hover:bg-rose-50">
              Cancel booking
            </Button>
          </div>
        ) : mode === "reschedule" ? (
          <form onSubmit={submitReschedule} className="space-y-4 rounded-2xl border border-navy/10 p-6">
            <h2 className="font-serif text-xl font-semibold text-navy-deep">Reschedule</h2>
            <div>
              <Label htmlFor="date">New date</Label>
              <Input
                id="date"
                type="date"
                required
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="time">New time</Label>
              <select
                id="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">Select a time…</option>
                {(settings?.time_slots ?? []).map((t: string) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={busy} className="bg-gradient-navy hover:opacity-95">
                Confirm reschedule
              </Button>
              <Button type="button" variant="outline" onClick={() => setMode("view")}>
                Back
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 rounded-2xl border border-rose-200 bg-rose-50/40 p-6">
            <h2 className="font-serif text-xl font-semibold text-rose-900">Cancel this consultation?</h2>
            <p className="text-sm text-rose-800">This action cannot be undone. We'll send you a confirmation email.</p>
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
            </div>
            <div className="flex gap-3">
              <Button onClick={submitCancel} disabled={busy} variant="destructive">
                Yes, cancel booking
              </Button>
              <Button variant="outline" onClick={() => setMode("view")}>
                Keep booking
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
