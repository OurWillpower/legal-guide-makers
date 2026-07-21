
CREATE TABLE IF NOT EXISTS public.internal_secrets (
  name text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.internal_secrets TO service_role;
ALTER TABLE public.internal_secrets ENABLE ROW LEVEL SECURITY;
-- No policies: only service_role (which bypasses RLS) can read/write.

INSERT INTO public.internal_secrets (name, value)
VALUES ('cron_webhook_secret', encode(gen_random_bytes(32), 'hex'))
ON CONFLICT (name) DO UPDATE SET value = EXCLUDED.value;

-- Reschedule the reminders cron with the new secret header
DO $$
DECLARE
  v_secret text;
BEGIN
  SELECT value INTO v_secret FROM public.internal_secrets WHERE name = 'cron_webhook_secret';
  PERFORM cron.unschedule('send-booking-reminders');
  PERFORM cron.schedule(
    'send-booking-reminders',
    '*/5 * * * *',
    format($cmd$
      SELECT net.http_post(
        url := 'https://project--553f81cd-9a56-4d24-82ae-228451f57257.lovable.app/api/public/hooks/booking-reminders',
        headers := %L::jsonb,
        body := '{}'::jsonb
      ) AS request_id;
    $cmd$, json_build_object('Content-Type','application/json','x-cron-secret', v_secret)::text)
  );
END $$;
