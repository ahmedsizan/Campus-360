-- =========================================================
-- Campus 360 Solution — Database Schema & Seed Data
-- Green University of Bangladesh (GUB)
-- =========================================================

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar TEXT,
  phone TEXT,
  department TEXT DEFAULT 'Computer Science & Engineering',
  id_no TEXT,
  semester TEXT DEFAULT 'Spring 2026',
  bio TEXT DEFAULT 'Student at Green University of Bangladesh',
  office_hours TEXT,
  father_name TEXT,
  mother_name TEXT,
  blood_group TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger for auto profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, department, id_no, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 
      CASE 
        WHEN NEW.email ILIKE '%admin%' THEN 'admin'
        WHEN NEW.email ILIKE '%teacher%' OR NEW.email ILIKE '%faculty%' OR NEW.email ILIKE '%prof%' THEN 'teacher'
        ELSE 'student'
      END
    ),
    COALESCE(NEW.raw_user_meta_data->>'department', 'Computer Science & Engineering'),
    COALESCE(NEW.raw_user_meta_data->>'id_no', 'GUB-221000' || floor(random()*900 + 100)::text),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Notices Table
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'administrative', 'events', 'sports')),
  author TEXT DEFAULT 'Registrar Office',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notices are readable by all" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Notices can be inserted by authenticated" ON public.notices FOR INSERT WITH CHECK (true);
CREATE POLICY "Notices can be updated by authenticated" ON public.notices FOR UPDATE USING (true);
CREATE POLICY "Notices can be deleted by authenticated" ON public.notices FOR DELETE USING (true);


-- 3. Buses Table
CREATE TABLE IF NOT EXISTS public.buses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  route TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'delayed')),
  current_location TEXT NOT NULL,
  eta TEXT NOT NULL,
  schedule TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.buses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buses are readable by all" ON public.buses FOR SELECT USING (true);
CREATE POLICY "Buses can be modified by authenticated" ON public.buses FOR ALL USING (true);


-- 4. Food Items Table
CREATE TABLE IF NOT EXISTS public.food_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'lunch', 'snacks', 'beverage')),
  price NUMERIC NOT NULL,
  is_vegetarian BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  image TEXT NOT NULL,
  rating NUMERIC DEFAULT 4.5,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Food items are readable by all" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Food items can be modified by authenticated" ON public.food_items FOR ALL USING (true);


-- 5. Lost & Found Items Table
CREATE TABLE IF NOT EXISTS public.lost_found_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('lost', 'found')),
  category TEXT NOT NULL CHECK (category IN ('electronics', 'documents', 'accessories', 'others')),
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lost found items are readable by all" ON public.lost_found_items FOR SELECT USING (true);
CREATE POLICY "Lost found items can be inserted by authenticated" ON public.lost_found_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Lost found items can be updated by authenticated" ON public.lost_found_items FOR UPDATE USING (true);


-- 6. Complaints Table
CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'facilities', 'it', 'transport', 'cafeteria')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'resolved')),
  is_anonymous BOOLEAN DEFAULT false,
  date TEXT NOT NULL,
  reported_by TEXT NOT NULL,
  reported_by_email TEXT NOT NULL,
  admin_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Complaints are readable by all" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Complaints can be inserted by authenticated" ON public.complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Complaints can be updated by authenticated" ON public.complaints FOR UPDATE USING (true);


-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  items JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed')),
  ordered_by TEXT NOT NULL,
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are readable by all" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Orders can be inserted by authenticated" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be updated by authenticated" ON public.orders FOR UPDATE USING (true);


-- =========================================================
-- SEED DATA
-- =========================================================

-- Seed Notices
INSERT INTO public.notices (id, title, content, date, category, author)
VALUES 
  ('n-1', 'Summer 2026 Semester Registration Deadline Extended', 'All students are advised that course pre-registration and advising deadline for Summer 2026 has been extended till May 20, 2026. Please clear any outstanding dues before advising.', '2026-05-10', 'academic', 'Office of the Registrar'),
  ('n-2', 'Midterm Examination Schedule Announcement', 'Midterm examinations for Spring 2026 will commence from June 5, 2026. Detailed room-wise and section-wise schedules have been published on the student portal.', '2026-05-08', 'academic', 'Controller of Examinations'),
  ('n-3', 'GUB National IUPC 2026 Programming Contest', 'Green University Computer Club (GUCC) is proud to announce the 8th National Inter-University Programming Contest (IUPC 2026). Registration is now open for all university teams.', '2026-05-05', 'events', 'Department of CSE'),
  ('n-4', 'Campus Bus Route 3 (Mirpur 10) Scheduled Maintenance', 'Please be informed that Bus GUB-03 will undergo routine mechanical maintenance on Saturday. Students are requested to take Bus GUB-01 or alternate shuttle routes.', '2026-05-02', 'administrative', 'Transport Division')
ON CONFLICT (id) DO NOTHING;

-- Seed Buses
INSERT INTO public.buses (id, name, route, status, current_location, eta, schedule)
VALUES 
  ('bus-1', 'Green Express 01', 'Mirpur 10 ➔ Kazipara ➔ Agargaon ➔ Purbachal Campus', 'active', 'Approaching Kazipara Metro Station', '12 mins', ARRAY['07:30 AM', '09:00 AM', '01:30 PM', '04:30 PM']),
  ('bus-2', 'Green Express 02', 'Uttara Sector 7 ➔ Airport ➔ Kuril ➔ Purbachal Campus', 'active', 'Passing Kuril Flyover Toll Plaza', '8 mins', ARRAY['07:45 AM', '09:15 AM', '02:00 PM', '05:00 PM']),
  ('bus-3', 'Green Express 03', 'Mirpur 14 ➔ Kachukhet ➔ Banani ➔ Purbachal Campus', 'delayed', 'Stuck at Banani Signal (Heavy Traffic)', '25 mins', ARRAY['08:00 AM', '10:00 AM', '02:30 PM', '05:30 PM']),
  ('bus-4', 'Green Express 04', 'Savar ➔ Hemayetpur ➔ Gabtoli ➔ Purbachal Campus', 'inactive', 'Campus Workshop — Scheduled Maintenance', 'Departs 04:30 PM', ARRAY['07:00 AM', '01:00 PM', '04:30 PM'])
ON CONFLICT (id) DO NOTHING;

-- Seed Food Items
INSERT INTO public.food_items (id, name, category, price, is_vegetarian, is_available, image, rating)
VALUES 
  ('f-1', 'Chicken Biryani Special (GUB Classic)', 'lunch', 150, false, true, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80', 4.9),
  ('f-2', 'Beef Tehari (Old Dhaka Style)', 'lunch', 160, false, true, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80', 4.8),
  ('f-3', 'Crispy Singara & Samosa Combo (4 pcs)', 'snacks', 20, true, true, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 4.6),
  ('f-4', 'Cold Coffee with Vanilla Ice Cream', 'beverage', 70, true, true, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80', 4.7),
  ('f-5', 'Egg Omelette with Hot Paratha (2 pcs)', 'breakfast', 45, false, true, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80', 4.5),
  ('f-6', 'Bhuna Khichuri with Dim Bhaji & Salad', 'lunch', 90, false, true, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', 4.8)
ON CONFLICT (id) DO NOTHING;

-- Seed Lost and Found
INSERT INTO public.lost_found_items (id, title, description, status, category, location, date, contact_name, contact_phone, reported_by)
VALUES 
  ('lf-1', 'Blue Student ID Card (CSE 22100234)', 'Found a student ID card near Cafeteria Table 4. Name on card: Tanvir Ahmed.', 'found', 'documents', 'Main Cafeteria Level 1', '2026-05-11', 'Shakib Rahman', '01711223344', 'shakib@green.edu.bd'),
  ('lf-2', 'Casio fx-991EX ClassWiz Calculator', 'Lost my scientific calculator during the EEE201 quiz in Room B-402. Has a small sticker of Naruto on the back cover.', 'lost', 'electronics', 'Building B, Room 402', '2026-05-10', 'Nafisa Islam', '01899887766', 'nafisa@green.edu.bd'),
  ('lf-3', 'Black Leather Wallet with National ID', 'Found a black leather wallet containing NID and some cash near Library entrance 3rd floor.', 'found', 'accessories', 'Central Library 3rd Floor', '2026-05-09', 'Library Security Desk', '01900112233', 'security@green.edu.bd')
ON CONFLICT (id) DO NOTHING;

-- Seed Complaints
INSERT INTO public.complaints (id, title, description, category, status, is_anonymous, date, reported_by, reported_by_email, admin_feedback)
VALUES 
  ('c-1', 'Slow WiFi Connection in Building A 4th Floor Labs', 'The high-speed student WiFi frequently disconnects during laboratory sessions in Software Lab 403 & 404.', 'it', 'under_review', false, '2026-05-07', 'Farhan Kabir', 'farhan@green.edu.bd', 'IT Network team has scheduled an access point upgrade on Friday.'),
  ('c-2', 'Need Additional Water Purifier in Cafeteria Annex', 'During peak lunch hours (1:00 PM - 2:30 PM), the current water dispenser has long queues and runs out quickly.', 'cafeteria', 'pending', true, '2026-05-09', 'Anonymous Student', 'anonymous@green.edu.bd', NULL)
ON CONFLICT (id) DO NOTHING;
