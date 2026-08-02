CREATE TABLE public.webinar_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company text,
  designation text,
  email text NOT NULL,
  mobile text,
  website text,
  challenge text,
  consent boolean NOT NULL DEFAULT false,
  webinar_slug text NOT NULL DEFAULT 'saas-legal-masterclass-2026-08-07',
  reported_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.webinar_registrations TO anon, authenticated;
GRANT SELECT ON public.webinar_registrations TO authenticated;
GRANT ALL ON public.webinar_registrations TO service_role;

ALTER TABLE public.webinar_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit valid webinar registration"
ON public.webinar_registrations FOR INSERT TO anon, authenticated
WITH CHECK (
  char_length(full_name) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 254
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND consent = true
  AND char_length(COALESCE(company, '')) <= 160
  AND char_length(COALESCE(designation, '')) <= 120
  AND char_length(COALESCE(mobile, '')) <= 40
  AND char_length(COALESCE(website, '')) <= 300
  AND char_length(COALESCE(challenge, '')) <= 2000
);

CREATE POLICY "Admins view webinar registrations"
ON public.webinar_registrations FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER webinar_registrations_updated_at
BEFORE UPDATE ON public.webinar_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();