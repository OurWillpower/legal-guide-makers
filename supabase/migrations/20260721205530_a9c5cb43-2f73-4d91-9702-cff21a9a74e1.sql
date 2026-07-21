ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'complimentary',
  ADD COLUMN IF NOT EXISTS payment_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_currency text NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_status_check
  CHECK (payment_status IN ('complimentary','pending','paid','refunded','waived'));