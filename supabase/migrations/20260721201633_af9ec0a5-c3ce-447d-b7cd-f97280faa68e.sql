-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users see their own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins see all roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT,
  avatar_url TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published testimonials" ON public.testimonials FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert testimonials" ON public.testimonials FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update testimonials" ON public.testimonials FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete testimonials" ON public.testimonials FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Scale',
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads active services" ON public.services FOR SELECT
  USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert services" ON public.services FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update services" ON public.services FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete services" ON public.services FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Booking settings (single row)
CREATE TABLE public.booking_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_slots JSONB NOT NULL DEFAULT '["10:00 AM","11:00 AM","12:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"]'::jsonb,
  blocked_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  buffer_days INTEGER NOT NULL DEFAULT 1,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  consultation_duration_minutes INTEGER NOT NULL DEFAULT 45,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.booking_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.booking_settings TO authenticated;
GRANT ALL ON public.booking_settings TO service_role;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads booking settings" ON public.booking_settings FOR SELECT USING (true);
CREATE POLICY "Admins insert booking settings" ON public.booking_settings FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update booking settings" ON public.booking_settings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.booking_settings (id) VALUES (gen_random_uuid());

-- Seed services from the current homepage set
INSERT INTO public.services (slug, title, description, icon, sort_order) VALUES
  ('corporate-legal','Corporate Legal','End-to-end company setup, governance, board and shareholder matters, legal opinions and secretarial compliance.','Landmark',1),
  ('contracts-commercial','Contracts & Commercial','Drafting, review and negotiation of commercial agreements, MSAs, SLAs, NDAs, vendor and partnership contracts.','FileSignature',2),
  ('dpdp-data-privacy','DPDP & Data Privacy','India DPDP Act readiness, privacy notices, consent frameworks, DPO advisory and cross-border data workflows.','ShieldCheck',3),
  ('technology-ai-cyber','Technology, AI & Cyber Law','SaaS, product terms, AI governance, IT Act, cyber-incident advisory, DPDP-aligned tech policies.','Cpu',4),
  ('ma-jv','M&A / Joint Ventures','Deal structuring, due diligence, share purchase, JV and shareholder agreements, transaction closings.','Handshake',5),
  ('ipr-innovation','IPR & Innovation','Trademarks, copyrights, licensing, brand protection, technology transfer and innovation IP strategy.','Lightbulb',6),
  ('regulatory-compliance','Regulatory & Compliance','Sector-specific regulatory advisory, licensing, RBI/SEBI/MCA compliance, policies and risk frameworks.','FileCheck2',7),
  ('litigation','Litigation & Dispute Resolution','Commercial disputes, arbitration, mediation, high-court and tribunal representation across India.','Gavel',8);

-- Seed testimonials
INSERT INTO public.testimonials (quote, author_name, author_role, sort_order) VALUES
  ('WIN Legal transformed how we approach compliance. Vrushali''s team is sharp, business-savvy, and always responsive.','Rajesh Kumar','Founder, TechForward SaaS',1),
  ('The DPDP readiness engagement was executed flawlessly. Investor-ready in weeks, not months.','Priya Sharma','COO, HealthCore Analytics',2),
  ('From incorporation to Series A, WIN has been our trusted counsel. Ethical, precise, and always business-focused.','Arjun Mehta','CEO, GreenGrid Ventures',3);

-- Extend bookings for client accounts, cancel, and reschedule
ALTER TABLE public.bookings
  ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN manage_token TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  ADD COLUMN cancelled_at TIMESTAMPTZ,
  ADD COLUMN cancellation_reason TEXT,
  ADD COLUMN reschedule_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN google_event_id TEXT;

CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings (user_id);

-- Clients can view/manage their own bookings; admins see all
CREATE POLICY "Users view own bookings" ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bookings" ON public.bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins update all bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Contact messages: admins can view all
CREATE POLICY "Admins view all contact messages" ON public.contact_messages FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update contact messages" ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));