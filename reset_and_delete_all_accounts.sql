-- =========================================================================
-- CAMPUS 360 SOLUTION: COMPLETE WIPE & RESET OF ALL ACCOUNTS
-- Run this SQL in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pdregecsxfqgxkerjdcu/sql
-- =========================================================================

-- STEP 1: Wipe all seat bookings, complaints, orders & lost items tied to old accounts
TRUNCATE TABLE public.bus_seat_bookings CASCADE;
TRUNCATE TABLE public.complaints CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.lost_found_items CASCADE;

-- STEP 2: Delete all records from public.profiles
DELETE FROM public.profiles;

-- STEP 3: Delete all user accounts from auth.users (Supabase Authentication)
-- This completely wipes students, teachers, admins, conductors & test accounts
DELETE FROM auth.users;

-- STEP 4: Ensure profiles_role_check constraint allows all 4 roles:
-- 'student', 'teacher', 'admin', 'conductor'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'admin', 'conductor'));

-- STEP 5: Verification check — verify all tables are completely clean (should return 0)
SELECT 
  (SELECT count(*) FROM auth.users) AS remaining_auth_users,
  (SELECT count(*) FROM public.profiles) AS remaining_profiles,
  (SELECT count(*) FROM public.bus_seat_bookings) AS remaining_bookings,
  (SELECT count(*) FROM public.complaints) AS remaining_complaints,
  (SELECT count(*) FROM public.orders) AS remaining_orders;
