import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import {
  getBookingByToken,
  rescheduleBookingByToken,
  cancelBookingByToken,
} from "@/lib/bookings.functions";
import { getBookingSettings } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, AlertTriangle } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

const searchSchema = z.object({ token: z.string().min(10) });

export const Route = createFileRoute("/manage/$id")({
  validateSearch: searchSchema,
  component: PublicManage,
  head: () => ({
    meta: [
      { title: "Manage Booking — WIN Legal Advisors" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function PublicManage() {
  const { id } = Route.useParams();
  const { token } = useSearch({ from: Route.id });
  const qc = useQueryClient();
  const fetchOne = useServerFn(getBookingByToken);
  const fetchSettings = useServerFn(getBookingSettings);
  const doReschedule = useServerFn(rescheduleBookingByToken);
  const doCancel = useServerFn(cancelBookingByToken);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["manage-booking", id, token],
    queryFn: () => fetchOne({ data: { id, token } }),
  });
  const { data: settings } = useQuery({
    queryKey: ["booking-settings"],
    queryFn: () => fetchSettings(),
  });

  const [mode, setMode] = useState<"view" | "reschedule" | "cancel">("view");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const submitReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await doReschedule({ data: { id, token, preferredDate: date, preferredTime: time } });
      toast.success("Rescheduled — confirmation email sent.");
      qc.invalidateQueries({ queryKey: ["manage-booking", id, token] });
      setMode("view");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not reschedule.");
    }
    setBusy(false);
  };

  const submitCancel = async () => {
    setBusy(true);
    try {
      await doCancel({ data: { id, token, reason } });
      toast.success("Booking cancelled — confirmation email sent.");
      qc.invalidateQueries({ queryKey: ["manage-booking", id, token] });
      setMode("view");
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
          <Link to="/contact" className="text-sm font-medium text-navy hover:text-gold">
            Need help?
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !booking ? (
          <div className="rounded-2xl border border-dashed border-navy/20 p-12 text-center">
            <h1 className="font-serif text-2xl font-bold text-navy-deep">Booking not found</h1>
            <p className="mt-3 text-muted-foreground">
              This management link is invalid or has expired. Please check the URL in your confirmation email.
            </p>
          </div>
        ) : (
          <>
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
                <div className="mt-1 font-medium text-navy-deep">
                  {booking.cancelled_at ? "Cancelled" : booking.status}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-gold">Reschedules</div>
                <div className="mt-1 font-medium text-navy-deep">{booking.reschedule_count} / 3</div>
              </div>
            </div>

            {booking.cancelled_at ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-700 mt-0.5" />
                  <div>
                    <div className="font-semibold text-rose-900">This booking has been cancelled.</div>
                    {booking.cancellation_reason && (
                      <div className="mt-1 text-sm text-rose-800">
                        Reason: {booking.cancellation_reason}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : mode === "view" ? (
              <div className="flex gap-3">
                <Button onClick={() => setMode("reschedule")} className="bg-gradient-navy hover:opacity-95">
                  Reschedule
                </Button>
                <Button
                  onClick={() => setMode("cancel")}
                  variant="outline"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50"
                >
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
                    {((settings?.time_slots as string[] | undefined) ?? []).map((t: string) => (
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
                <p className="text-sm text-rose-800">
                  This action cannot be undone. We'll send you a confirmation email.
                </p>
                <div>
                  <Label htmlFor="reason">Reason (optional)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
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
          </>
        )}
      </main>
    </div>
  );
}
