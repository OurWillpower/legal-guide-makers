
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published faqs"
  ON public.faqs FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert faqs"
  ON public.faqs FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update faqs"
  ON public.faqs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete faqs"
  ON public.faqs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Do you offer a free initial consultation?', 'Yes — every prospective client gets a complimentary 30–45 minute consultation to understand your needs and outline how WIN Legal Advisors can help.', 10),
('How does a consultation work?', 'Consultations are held over a secure video call (Google Meet or Microsoft Teams). Once you book, you''ll receive an email confirmation with an Add to Google Calendar link and a downloadable .ics invite. The video link and any prep notes are sent 24 hours before the call.', 20),
('How long is each consultation, and how soon can I get a slot?', 'A standard consultation runs 30–45 minutes. We typically confirm your slot within one business day, and most clients are seen within 2–4 business days. For urgent regulatory or investor matters, mention it in your booking note and we''ll fast-track a time.', 30),
('What documents should I bring or share before the call?', 'Share whatever is relevant to your question — commonly: incorporation certificate and MoA/AoA, key contracts under review (customer, vendor, employment, SaaS), term sheets or SHA drafts, DPDP/privacy notices, any legal notices or regulatory correspondence, and a short one-page summary of what you''d like to discuss. Reply to your confirmation email with attachments; anything you share is treated as confidential.', 40),
('What is the typical timeline for common engagements?', 'Consultations: same or next business day. DPDP readiness assessment: 2–4 weeks. Contract templates suite: 1–2 weeks. Company incorporation: 10–15 business days after documents are ready. M&A / fundraise support and regulatory approvals depend on scope and third parties — we scope timelines upfront.', 50),
('Which industries do you work with?', 'We advise SaaS and technology companies, fintech, healthcare, D2C brands, manufacturing, professional services, and early-stage startups across India.', 60),
('Do you handle DPDP Act (Digital Personal Data Protection) readiness?', 'Yes. We deliver end-to-end DPDP readiness — gap assessments, consent frameworks, privacy notices, DPO advisory, cross-border data workflows, and staff training.', 70),
('Can WIN Legal Advisors represent us in court?', 'Yes. Our litigation team represents clients before High Courts, tribunals, and arbitral forums across India for commercial and regulatory disputes.', 80),
('How is pricing structured?', 'We offer transparent engagement models — fixed-fee packages for defined scopes (like DPDP readiness, incorporation, or contract templates), monthly retainers for ongoing counsel, and hourly rates for advisory work. We share a written fee estimate before any paid work begins.', 90),
('Is my information confidential?', 'Absolutely. All communications, documents and consultation notes are covered by attorney–client confidentiality. We can sign a mutual NDA before the consultation on request.', 100),
('Where are you based?', 'WIN Legal Advisors is headquartered in India with a Pan-India presence. We serve clients across the country and support cross-border engagements.', 110),
('Can I reschedule or cancel my booked consultation?', 'Yes. Sign in to your account and open the booking to reschedule (up to three times) or cancel any time before the appointment. You''ll receive an updated email and calendar invite each time.', 120);

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_2h_sent_at TIMESTAMPTZ;
