import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  isAdmin,
  adminListTestimonials,
  saveTestimonial,
  deleteTestimonial,
  adminListServices,
  saveService,
  deleteService,
  saveBookingSettings,
  adminListBookings,
  adminUpdateBookingStatus,
  adminListMessages,
} from "@/lib/admin.functions";
import { getBookingSettings } from "@/lib/content.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Plus, Trash2, Save } from "lucide-react";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
  head: () => ({ meta: [{ title: "Admin — WIN Legal Advisors" }, { name: "robots", content: "noindex" }] }),
});

type Tab = "bookings" | "messages" | "testimonials" | "services" | "settings";

function AdminDashboard() {
  const checkAdmin = useServerFn(isAdmin);
  const { data: admin, isLoading } = useQuery({ queryKey: ["is-admin"], queryFn: () => checkAdmin() });
  const [tab, setTab] = useState<Tab>("bookings");

  if (isLoading) return <p className="p-8">Checking access…</p>;
  if (admin === false) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-cream/30">
      <header className="border-b border-navy/10 bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" />
            <span className="font-serif text-lg font-semibold text-navy-deep">Admin</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={async () => { await supabase.auth.signOut(); window.location.href = "/"; }}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-navy/10">
          {(["bookings", "messages", "testimonials", "services", "settings"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition ${
                tab === t ? "border-gold text-navy-deep" : "border-transparent text-muted-foreground hover:text-navy"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "bookings" && <BookingsPanel />}
        {tab === "messages" && <MessagesPanel />}
        {tab === "testimonials" && <TestimonialsPanel />}
        {tab === "services" && <ServicesPanel />}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

function BookingsPanel() {
  const fetchAll = useServerFn(adminListBookings);
  const updateStatus = useServerFn(adminUpdateBookingStatus);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-bookings"], queryFn: () => fetchAll() });

  const setStatus = async (id: string, status: "pending" | "confirmed" | "completed" | "cancelled") => {
    await updateStatus({ data: { id, status } });
    toast.success("Updated");
    qc.invalidateQueries({ queryKey: ["admin-bookings"] });
  };

  if (isLoading) return <p>Loading…</p>;
  return (
    <div className="overflow-hidden rounded-xl border border-navy/10 bg-background">
      <table className="w-full text-sm">
        <thead className="bg-navy-deep text-cream">
          <tr>
            <th className="px-4 py-3 text-left">When</th>
            <th className="px-4 py-3 text-left">Client</th>
            <th className="px-4 py-3 text-left">Service</th>
            <th className="px-4 py-3 text-left">Date/Time</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((b: any) => (
            <tr key={b.id} className="border-t border-navy/5">
              <td className="px-4 py-3 text-muted-foreground">{new Date(b.created_at).toLocaleString()}</td>
              <td className="px-4 py-3">
                <div className="font-medium">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.email}</div>
              </td>
              <td className="px-4 py-3">{b.service}</td>
              <td className="px-4 py-3">{b.preferred_date} · {b.preferred_time}</td>
              <td className="px-4 py-3">
                <select
                  value={b.cancelled_at ? "cancelled" : b.status}
                  onChange={(e) => setStatus(b.id, e.target.value as any)}
                  className="rounded border border-input px-2 py-1"
                >
                  {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
          {(data ?? []).length === 0 && (
            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No bookings yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MessagesPanel() {
  const fetchAll = useServerFn(adminListMessages);
  const { data, isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: () => fetchAll() });
  if (isLoading) return <p>Loading…</p>;
  return (
    <div className="space-y-3">
      {(data ?? []).map((m: any) => (
        <div key={m.id} className="rounded-xl border border-navy/10 bg-background p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <div className="font-semibold text-navy-deep">{m.name} <span className="text-muted-foreground font-normal">&lt;{m.email}&gt;</span></div>
              {m.subject && <div className="text-sm text-gold">{m.subject}</div>}
            </div>
            <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
          {m.phone && <p className="mt-2 text-xs text-muted-foreground">📞 {m.phone}</p>}
        </div>
      ))}
      {(data ?? []).length === 0 && <p className="text-muted-foreground">No messages yet.</p>}
    </div>
  );
}

function TestimonialsPanel() {
  const fetchAll = useServerFn(adminListTestimonials);
  const save = useServerFn(saveTestimonial);
  const del = useServerFn(deleteTestimonial);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => fetchAll() });
  const [editing, setEditing] = useState<any | null>(null);

  const empty = { quote: "", author_name: "", author_role: "", avatar_url: "", published: true, sort_order: 0 };

  const submit = async (row: any) => {
    try {
      await save({ data: row });
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  };

  if (isLoading) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-2" /> Add testimonial</Button>
      </div>
      {editing && <TestimonialForm initial={editing} onSubmit={submit} onCancel={() => setEditing(null)} />}
      <div className="grid gap-3 md:grid-cols-2">
        {(data ?? []).map((t: any) => (
          <div key={t.id} className="rounded-xl border border-navy/10 bg-background p-5">
            <p className="mb-3 text-sm italic text-navy-soft">"{t.quote}"</p>
            <div className="text-sm font-semibold text-navy-deep">{t.author_name}</div>
            <div className="text-xs text-muted-foreground">{t.author_role}</div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(t)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                if (!confirm("Delete this testimonial?")) return;
                await del({ data: t.id });
                qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
              }}><Trash2 className="h-4 w-4" /></Button>
              <span className={`ml-auto text-xs ${t.published ? "text-emerald-700" : "text-muted-foreground"}`}>
                {t.published ? "Published" : "Hidden"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialForm({ initial, onSubmit, onCancel }: { initial: any; onSubmit: (r: any) => void; onCancel: () => void }) {
  const [row, setRow] = useState(initial);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit(row); }}
      className="rounded-xl border border-gold/40 bg-background p-5 space-y-3"
    >
      <div>
        <Label>Quote</Label>
        <Textarea required rows={3} value={row.quote} onChange={(e) => setRow({ ...row, quote: e.target.value })} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div><Label>Author name</Label><Input required value={row.author_name} onChange={(e) => setRow({ ...row, author_name: e.target.value })} /></div>
        <div><Label>Role / company</Label><Input value={row.author_role || ""} onChange={(e) => setRow({ ...row, author_role: e.target.value })} /></div>
        <div><Label>Avatar URL (optional)</Label><Input value={row.avatar_url || ""} onChange={(e) => setRow({ ...row, avatar_url: e.target.value })} /></div>
        <div><Label>Sort order</Label><Input type="number" value={row.sort_order} onChange={(e) => setRow({ ...row, sort_order: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={row.published} onCheckedChange={(v) => setRow({ ...row, published: v })} />
        <span className="text-sm">Published</span>
      </div>
      <div className="flex gap-2">
        <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function ServicesPanel() {
  const fetchAll = useServerFn(adminListServices);
  const save = useServerFn(saveService);
  const del = useServerFn(deleteService);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-services"], queryFn: () => fetchAll() });
  const [editing, setEditing] = useState<any | null>(null);
  const empty = { slug: "", title: "", description: "", icon: "Scale", active: true, sort_order: 0 };

  const submit = async (row: any) => {
    try {
      await save({ data: row });
      toast.success("Saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-services"] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  };

  if (isLoading) return <p>Loading…</p>;
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-2" /> Add service</Button>
      </div>
      {editing && (
        <form onSubmit={(e) => { e.preventDefault(); submit(editing); }} className="rounded-xl border border-gold/40 bg-background p-5 space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div><Label>Slug (URL-safe)</Label><Input required value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></div>
            <div><Label>Title</Label><Input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
          </div>
          <div><Label>Description</Label><Textarea required rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
          <div className="grid gap-3 md:grid-cols-3">
            <div><Label>Icon (Lucide name)</Label><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></div>
            <div><Label>Sort order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} /></div>
            <div className="flex items-center gap-2 pt-6"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /><span>Active</span></div>
          </div>
          <div className="flex gap-2">
            <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </form>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {(data ?? []).map((s: any) => (
          <div key={s.id} className="rounded-xl border border-navy/10 bg-background p-5">
            <div className="mb-1 font-serif text-lg font-semibold text-navy-deep">{s.title}</div>
            <div className="mb-2 text-xs text-muted-foreground">/{s.slug}</div>
            <p className="text-sm text-navy-soft">{s.description}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(s)}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={async () => {
                if (!confirm("Delete this service?")) return;
                await del({ data: s.id });
                qc.invalidateQueries({ queryKey: ["admin-services"] });
              }}><Trash2 className="h-4 w-4" /></Button>
              <span className={`ml-auto text-xs ${s.active ? "text-emerald-700" : "text-muted-foreground"}`}>{s.active ? "Active" : "Hidden"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const fetchSettings = useServerFn(getBookingSettings);
  const save = useServerFn(saveBookingSettings);
  const { data, isLoading } = useQuery({ queryKey: ["booking-settings-admin"], queryFn: () => fetchSettings() });
  const [row, setRow] = useState<any>(null);

  useEffect(() => { if (data) setRow(data); }, [data]);

  if (isLoading || !row) return <p>Loading…</p>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await save({
        data: {
          time_slots: row.time_slots,
          blocked_dates: row.blocked_dates,
          buffer_days: row.buffer_days,
          timezone: row.timezone,
          consultation_duration_minutes: row.consultation_duration_minutes,
        },
      });
      toast.success("Saved");
    } catch (e) { toast.error(e instanceof Error ? e.message : "Save failed"); }
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4 rounded-xl border border-navy/10 bg-background p-6">
      <div>
        <Label>Available time slots (comma-separated)</Label>
        <Input
          value={(row.time_slots as string[]).join(", ")}
          onChange={(e) => setRow({ ...row, time_slots: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
        />
      </div>
      <div>
        <Label>Blocked dates (YYYY-MM-DD, comma-separated)</Label>
        <Input
          value={(row.blocked_dates as string[]).join(", ")}
          onChange={(e) => setRow({ ...row, blocked_dates: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div><Label>Buffer days</Label><Input type="number" value={row.buffer_days} onChange={(e) => setRow({ ...row, buffer_days: parseInt(e.target.value) || 0 })} /></div>
        <div><Label>Timezone</Label><Input value={row.timezone} onChange={(e) => setRow({ ...row, timezone: e.target.value })} /></div>
        <div><Label>Duration (min)</Label><Input type="number" value={row.consultation_duration_minutes} onChange={(e) => setRow({ ...row, consultation_duration_minutes: parseInt(e.target.value) || 45 })} /></div>
      </div>
      <Button type="submit"><Save className="h-4 w-4 mr-2" /> Save settings</Button>
    </form>
  );
}
