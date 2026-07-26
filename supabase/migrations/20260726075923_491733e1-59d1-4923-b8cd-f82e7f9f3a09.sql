
DROP POLICY IF EXISTS "Anyone can log an event" ON public.analytics_events;

CREATE POLICY "Anyone can log a valid event"
  ON public.analytics_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(event_name) BETWEEN 1 AND 80
    AND char_length(COALESCE(path, '')) <= 500
    AND char_length(COALESCE(user_agent, '')) <= 500
    AND char_length(COALESCE(referrer, '')) <= 500
    AND pg_column_size(properties) <= 4096
  );
