-- =========================================================================
-- CAMPUS 360 SOLUTION: FIX BUS SEAT BOOKINGS TABLE & REALTIME PUBLICATION
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pdregecsxfqgxkerjdcu/sql
-- =========================================================================

-- 1. Create the bus_seat_bookings table if not already created
CREATE TABLE IF NOT EXISTS public.bus_seat_bookings (
  id TEXT PRIMARY KEY,
  token_id TEXT,
  bus_id TEXT NOT NULL,
  bus_name TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('to_campus', 'from_campus')),
  trip_slot TEXT NOT NULL,
  stoppage TEXT NOT NULL,
  stoppage_time TEXT NOT NULL,
  seat_number INTEGER NOT NULL CHECK (seat_number >= 1 AND seat_number <= 45),
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  booking_date TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  conductor_notes TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT unique_seat_reservation UNIQUE (bus_id, trip_slot, direction, seat_number, booking_date, is_demo)
);

-- 2. Enable Row Level Security (RLS) and grant open public access for student & conductor booking
ALTER TABLE public.bus_seat_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Seat bookings are readable by all" ON public.bus_seat_bookings;
CREATE POLICY "Seat bookings are readable by all" ON public.bus_seat_bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Seat bookings can be inserted by all" ON public.bus_seat_bookings;
CREATE POLICY "Seat bookings can be inserted by all" ON public.bus_seat_bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Seat bookings can be updated by all" ON public.bus_seat_bookings;
CREATE POLICY "Seat bookings can be updated by all" ON public.bus_seat_bookings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Seat bookings can be deleted by all" ON public.bus_seat_bookings;
CREATE POLICY "Seat bookings can be deleted by all" ON public.bus_seat_bookings FOR DELETE USING (true);

-- 3. Create high-performance indexes for lightning-fast seat search
CREATE INDEX IF NOT EXISTS idx_seat_bookings_demo ON public.bus_seat_bookings(is_demo, bus_id, trip_slot, booking_date);
CREATE INDEX IF NOT EXISTS idx_seat_bookings_token_id ON public.bus_seat_bookings(token_id);
CREATE INDEX IF NOT EXISTS idx_seat_bookings_user_email ON public.bus_seat_bookings(user_email);

-- 4. Enable Supabase Realtime for instant cross-device WebSocket push notifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'bus_seat_bookings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bus_seat_bookings;
  END IF;
END $$;

ALTER TABLE public.bus_seat_bookings REPLICA IDENTITY FULL;

-- 5. Officially permit 'conductor' in the profiles check constraint
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'admin', 'conductor'));

-- 6. Update any existing conductor accounts saved as 'admin' back to 'conductor'
UPDATE public.profiles
SET role = 'conductor'
WHERE email ILIKE '%@green.conductor.bd' OR email = 'conductor@green.edu.bd';

-- 7. Verification: check table existence
SELECT count(*) AS total_seat_bookings FROM public.bus_seat_bookings;
