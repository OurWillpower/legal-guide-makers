import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — WIN Legal Advisors" },
      { name: "description", content: "Sign in to book consultations, manage your appointments, or access admin tools." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function isSafePath(p?: string | null): p is string {
  return !!p && p.startsWith("/") && !p.startsWith("//");
}

function AuthPage() {
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data }) => {
        if (!cancelled && data.session) {
          navigate({ to: isSafePath(redirect) ? redirect : "/my-bookings", replace: true });
        }
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) navigate({ to: isSafePath(redirect) ? redirect : "/my-bookings", replace: true });
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [navigate, redirect]);

  const google = async () => {
    setBusy(true);
    if (isSafePath(redirect)) sessionStorage.setItem("win_post_signin_redirect", redirect);
    const { lovable } = await import("@/integrations/lovable/index");
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error("Sign in failed. Try again.");
    setBusy(false);
  };

  const emailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { supabase } = await import("@/integrations/supabase/client");
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/auth" },
      });
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account.");
    }
    setBusy(false);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("win_post_signin_redirect");
    if (saved && isSafePath(saved)) {
      void import("@/integrations/supabase/client").then(({ supabase }) => supabase.auth.getSession()).then(({ data }) => {
        if (data.session) {
          sessionStorage.removeItem("win_post_signin_redirect");
          navigate({ to: saved, replace: true });
        }
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-navy/10 bg-background p-8 shadow-elegant">
        <Link to="/" className="mb-6 flex justify-center">
          <img src={logoAsset.url} alt="WIN Legal Advisors" className="h-14 w-auto" />
        </Link>
        <h1 className="mb-2 text-center font-serif text-2xl font-bold text-navy-deep">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Sign in to manage your consultations." : "Sign up to book and manage consultations."}
        </p>

        <Button onClick={google} disabled={busy} variant="outline" className="w-full mb-4 h-11">
          <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </Button>

        <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-navy/10" />
          <span>or</span>
          <div className="h-px flex-1 bg-navy/10" />
        </div>

        <form onSubmit={emailSubmit} className="space-y-3">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-gradient-navy hover:opacity-95 h-11">
            {mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-navy hover:text-gold"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
