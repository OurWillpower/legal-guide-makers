
-- 1) Email templates
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT NOT NULL DEFAULT '',
  description TEXT,
  variables TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_templates TO authenticated;
GRANT ALL ON public.email_templates TO service_role;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage email templates" ON public.email_templates
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER trg_email_templates_updated_at
BEFORE UPDATE ON public.email_templates
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed the five templates. HTML uses {{variable}} tokens the send helper interpolates.
INSERT INTO public.email_templates (template_key, subject, description, variables, html, text) VALUES
('booking_confirmation',
 'Your consultation is confirmed — WIN Legal Advisors',
 'Sent when a booking is created.',
 ARRAY['name','service','preferredDate','preferredTime','manageUrl','googleCalendarUrl','icsUrl','pdfUrl','statusUrl'],
 '<h1>Your consultation request is in.</h1><p>Dear {{name}},</p><p>Thank you for reaching out to WIN Legal Advisors. We''ve received your request and will confirm a time within one business day.</p><p><strong>Service:</strong> {{service}}<br/><strong>Date:</strong> {{preferredDate}}<br/><strong>Time:</strong> {{preferredTime}}</p><p>Manage your booking: <a href="{{manageUrl}}">{{manageUrl}}</a><br/>Public status page: <a href="{{statusUrl}}">{{statusUrl}}</a></p>',
 'Dear {{name}}, your consultation request for {{service}} on {{preferredDate}} at {{preferredTime}} has been received. Manage: {{manageUrl}}'
),
('booking_rescheduled',
 'Your consultation has been rescheduled — WIN Legal Advisors',
 'Sent when a booking is rescheduled.',
 ARRAY['name','service','preferredDate','preferredTime','manageUrl','statusUrl'],
 '<h1>Your consultation has been rescheduled.</h1><p>Dear {{name}},</p><p>Your consultation for <strong>{{service}}</strong> has been rescheduled to <strong>{{preferredDate}} at {{preferredTime}}</strong>.</p><p>Manage: <a href="{{manageUrl}}">{{manageUrl}}</a></p>',
 'Dear {{name}}, your {{service}} consultation is now on {{preferredDate}} at {{preferredTime}}. Manage: {{manageUrl}}'
),
('booking_cancelled',
 'Your consultation has been cancelled — WIN Legal Advisors',
 'Sent when a booking is cancelled.',
 ARRAY['name','service','preferredDate','preferredTime','statusUrl'],
 '<h1>Your consultation has been cancelled.</h1><p>Dear {{name}},</p><p>We''ve cancelled your consultation for <strong>{{service}}</strong> ({{preferredDate}} at {{preferredTime}}). You can book a new time whenever you''re ready.</p>',
 'Dear {{name}}, your {{service}} consultation on {{preferredDate}} at {{preferredTime}} has been cancelled.'
),
('booking_reminder_24h',
 'Reminder: your consultation is tomorrow — WIN Legal Advisors',
 'Sent ~24 hours before the appointment.',
 ARRAY['name','service','preferredDate','preferredTime','manageUrl','googleCalendarUrl','icsUrl','pdfUrl','statusUrl'],
 '<h1>Your consultation is tomorrow.</h1><p>Dear {{name}},</p><p>Reminder for <strong>{{service}}</strong> on <strong>{{preferredDate}} at {{preferredTime}}</strong>.</p><p>Manage: <a href="{{manageUrl}}">{{manageUrl}}</a> · PDF: <a href="{{pdfUrl}}">Download</a></p>',
 'Reminder: {{service}} tomorrow at {{preferredTime}} ({{preferredDate}}). Manage: {{manageUrl}}'
),
('booking_reminder_2h',
 'Your consultation is in ~2 hours — WIN Legal Advisors',
 'Sent ~2 hours before the appointment.',
 ARRAY['name','service','preferredDate','preferredTime','manageUrl','statusUrl'],
 '<h1>Your consultation is in about 2 hours.</h1><p>Dear {{name}},</p><p>Quick reminder for <strong>{{service}}</strong> at <strong>{{preferredTime}}</strong> today. The video call link will follow shortly.</p><p>Manage: <a href="{{manageUrl}}">{{manageUrl}}</a></p>',
 'Reminder: {{service}} today at {{preferredTime}}. Manage: {{manageUrl}}'
);

-- 2) Booking events (timeline)
CREATE TABLE public.booking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX booking_events_booking_id_created_idx ON public.booking_events (booking_id, created_at);
GRANT SELECT, INSERT ON public.booking_events TO authenticated;
GRANT ALL ON public.booking_events TO service_role;
ALTER TABLE public.booking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners read their booking events" ON public.booking_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = booking_events.booking_id AND b.user_id = auth.uid()));

CREATE POLICY "Admins read all booking events" ON public.booking_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) WhatsApp columns
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS whatsapp_24h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS whatsapp_2h_sent_at TIMESTAMPTZ;
