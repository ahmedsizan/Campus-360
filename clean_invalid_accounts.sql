-- =========================================================================
-- CAMPUS 360 SOLUTION: DATABASE PURGE & CONDUCTOR CONSTRAINT UPDATE
-- Execute this SQL script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/pdregecsxfqgxkerjdcu/sql
-- =========================================================================

-- STEP 1: Update check constraint on profiles to officially permit 'conductor'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'teacher', 'admin', 'conductor'));

-- STEP 2: DELETE all invalid student accounts from public.profiles
-- Rule: Student account MUST have exactly 9-digit numeric ID AND email MUST be [ID]@student.green.ac.bd
-- Keeps official demo student 'student@green.edu.bd'
DELETE FROM public.profiles
WHERE role = 'student'
  AND email <> 'student@green.edu.bd'
  AND (
    id_no !~ '^[0-9]{9}$'
    OR email !~ '^[0-9]{9}@student\.green\.ac\.bd$'
    OR email <> (id_no || '@student.green.ac.bd')
  );

-- STEP 3: DELETE all invalid conductor accounts from public.profiles
-- Rule: Conductor account MUST have exactly 9-digit numeric ID AND email MUST be [ID]@green.conductor.bd
-- Keeps official demo conductor 'conductor@green.edu.bd'
DELETE FROM public.profiles
WHERE role = 'conductor'
  AND email <> 'conductor@green.edu.bd'
  AND (
    id_no !~ '^[0-9]{9}$'
    OR email !~ '^[0-9]{9}@green\.conductor\.bd$'
    OR email <> (id_no || '@green.conductor.bd')
  );

-- STEP 4: Remove any orphaned auth.users records whose profiles were deleted
DELETE FROM auth.users
WHERE email NOT IN (SELECT email FROM public.profiles)
  AND email NOT IN (
    'student@green.edu.bd',
    'teacher@green.edu.bd',
    'admin@green.edu.bd',
    'conductor@green.edu.bd'
  );

-- STEP 5: Verification — List all clean and active accounts remaining in database
SELECT id, email, name, role, id_no, department, created_at 
FROM public.profiles 
ORDER BY role, created_at;
