
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can submit a contact message" ON public.contact_messages;

CREATE POLICY "Public can submit valid booking"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(service) BETWEEN 1 AND 120
    AND char_length(coalesce(message, '')) <= 2000
    AND char_length(coalesce(phone, '')) <= 40
    AND char_length(coalesce(company, '')) <= 160
    AND preferred_date >= (now()::date - interval '1 day')
    AND preferred_date <= (now()::date + interval '365 days')
  );

CREATE POLICY "Public can submit valid contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(name) BETWEEN 1 AND 120
    AND char_length(email) BETWEEN 3 AND 254
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND char_length(message) BETWEEN 1 AND 2000
    AND char_length(coalesce(subject, '')) <= 200
    AND char_length(coalesce(phone, '')) <= 40
  );
