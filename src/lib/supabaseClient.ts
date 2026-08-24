import { createClient } from '@supabase/supabase-js';
import { Bus, Complaint, FoodItem, LostFoundItem, Notice } from '../types';

// Supabase credentials with production fallback from DOCUMENTATION.md
const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 
  'https://pdregecsxfqgxkerjdcu.supabase.co';

const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcmVnZWNzeGZxZ3hrZXJqZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjIzMTEsImV4cCI6MjEwMzEzODMxMX0.8jZG4Iguu-QDO0wy9jPszZV8GgVCv_PjqWkAopMrT6E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Avatar resolution: prioritizes Supabase cloud database avatar for cross-device sync
 */
export const getResolvedAvatar = (email?: string | null, dbAvatar?: string | null): string => {
  if (dbAvatar && dbAvatar.trim().length > 0) {
    return dbAvatar;
  }
  if (email) {
    const local = localStorage.getItem(`gub_avatar_${email.toLowerCase().trim()}`);
    if (local && local.trim().length > 0) {
      return local;
    }
  }
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
};

export const saveLocalAvatar = (email: string, avatarUrl: string): void => {
  if (!email) return;
  localStorage.setItem(`gub_avatar_${email.toLowerCase().trim()}`, avatarUrl);
};

// Built-in resilient mock seed datasets for instant rendering / offline fallback
export const FALLBACK_NOTICES: Notice[] = [
  {
    id: 'n-1',
    title: 'Summer 2026 Semester Registration Deadline Extended',
    content: 'All students are advised that course pre-registration and advising deadline for Summer 2026 has been extended till May 20, 2026. Please clear any outstanding dues before advising to avoid late fee penalties.',
    date: '2026-05-10',
    category: 'academic',
    author: 'Office of the Registrar',
    created_at: new Date().toISOString()
  },
  {
    id: 'n-2',
    title: 'Midterm Examination Schedule Announcement',
    content: 'Midterm examinations for Spring 2026 will commence from June 5, 2026. Detailed room-wise and section-wise schedules have been published on the official notice board.',
    date: '2026-05-08',
    category: 'academic',
    author: 'Controller of Examinations',
    created_at: new Date().toISOString()
  },
  {
    id: 'n-3',
    title: 'GUB National IUPC 2026 Programming Contest',
    content: 'Green University Computer Club (GUCC) is proud to announce the 8th National Inter-University Programming Contest (IUPC 2026). Registration is now open for all universities across Bangladesh.',
    date: '2026-05-05',
    category: 'events',
    author: 'Department of CSE',
    created_at: new Date().toISOString()
  },
  {
    id: 'n-4',
    title: 'Campus Bus Route 3 (Mirpur 10) Scheduled Maintenance',
    content: 'Please be informed that Bus GUB-03 will undergo routine mechanical maintenance this weekend. Students are requested to take Bus GUB-01 or alternate shuttle routes.',
    date: '2026-05-02',
    category: 'administrative',
    author: 'Transport Division',
    created_at: new Date().toISOString()
  }
];

export const FALLBACK_BUSES: Bus[] = [
  {
    id: 'bus-1',
    name: 'Green Express 01',
    route: 'Mirpur 10 ➔ Kazipara ➔ Agargaon ➔ Purbachal Campus',
    status: 'active',
    current_location: 'Approaching Kazipara Metro Station',
    eta: '12 mins',
    schedule: ['07:30 AM', '09:00 AM', '01:30 PM', '04:30 PM']
  },
  {
    id: 'bus-2',
    name: 'Green Express 02',
    route: 'Uttara Sector 7 ➔ Airport ➔ Kuril ➔ Purbachal Campus',
    status: 'active',
    current_location: 'Passing Kuril Flyover Toll Plaza',
    eta: '8 mins',
    schedule: ['07:45 AM', '09:15 AM', '02:00 PM', '05:00 PM']
  },
  {
    id: 'bus-3',
    name: 'Green Express 03',
    route: 'Mirpur 14 ➔ Kachukhet ➔ Banani ➔ Purbachal Campus',
    status: 'delayed',
    current_location: 'Stuck at Banani Signal (Heavy Traffic)',
    eta: '25 mins',
    schedule: ['08:00 AM', '10:00 AM', '02:30 PM', '05:30 PM']
  },
  {
    id: 'bus-4',
    name: 'Green Express 04',
    route: 'Savar ➔ Hemayetpur ➔ Gabtoli ➔ Purbachal Campus',
    status: 'inactive',
    current_location: 'Campus Workshop — Scheduled Maintenance',
    eta: 'Departs 04:30 PM',
    schedule: ['07:00 AM', '01:00 PM', '04:30 PM']
  }
];

export const FALLBACK_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'f-1',
    name: 'Chicken Biryani Special (GUB Classic)',
    category: 'lunch',
    price: 150,
    is_vegetarian: false,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    rating: 4.9
  },
  {
    id: 'f-2',
    name: 'Beef Tehari (Old Dhaka Style)',
    category: 'lunch',
    price: 160,
    is_vegetarian: false,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    rating: 4.8
  },
  {
    id: 'f-3',
    name: 'Crispy Singara & Samosa Combo (4 pcs)',
    category: 'snacks',
    price: 20,
    is_vegetarian: true,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    rating: 4.6
  },
  {
    id: 'f-4',
    name: 'Cold Coffee with Vanilla Ice Cream',
    category: 'beverage',
    price: 70,
    is_vegetarian: true,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    rating: 4.7
  },
  {
    id: 'f-5',
    name: 'Egg Omelette with Hot Paratha (2 pcs)',
    category: 'breakfast',
    price: 45,
    is_vegetarian: false,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    rating: 4.5
  },
  {
    id: 'f-6',
    name: 'Bhuna Khichuri with Dim Bhaji & Salad',
    category: 'lunch',
    price: 90,
    is_vegetarian: false,
    is_available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8
  }
];

export const FALLBACK_LOST_FOUND: LostFoundItem[] = [
  {
    id: 'lf-1',
    title: 'Blue Student ID Card (CSE 22100234)',
    description: 'Found a student ID card near Cafeteria Table 4. Name on card: Tanvir Ahmed.',
    status: 'found',
    category: 'documents',
    location: 'Main Cafeteria Level 1',
    date: '2026-05-11',
    contact_name: 'Shakib Rahman',
    contact_phone: '01711223344',
    reported_by: 'shakib@green.edu.bd'
  },
  {
    id: 'lf-2',
    title: 'Casio fx-991EX ClassWiz Calculator',
    description: 'Lost my scientific calculator during the EEE201 quiz in Room B-402. Has a small sticker of Naruto on the back cover.',
    status: 'lost',
    category: 'electronics',
    location: 'Building B, Room 402',
    date: '2026-05-10',
    contact_name: 'Nafisa Islam',
    contact_phone: '01899887766',
    reported_by: 'nafisa@green.edu.bd'
  },
  {
    id: 'lf-3',
    title: 'Black Leather Wallet with National ID',
    description: 'Found a black leather wallet containing NID and some cash near Library entrance 3rd floor.',
    status: 'found',
    category: 'accessories',
    location: 'Central Library 3rd Floor',
    date: '2026-05-09',
    contact_name: 'Library Security Desk',
    contact_phone: '01900112233',
    reported_by: 'security@green.edu.bd'
  }
];

export const FALLBACK_COMPLAINTS: Complaint[] = [
  {
    id: 'c-1',
    title: 'Slow WiFi Connection in Building A 4th Floor Labs',
    description: 'The high-speed student WiFi frequently disconnects during laboratory sessions in Software Lab 403 & 404.',
    category: 'it',
    status: 'under_review',
    is_anonymous: false,
    date: '2026-05-07',
    reported_by: 'Farhan Kabir',
    reported_by_email: 'farhan@green.edu.bd',
    admin_feedback: 'IT Network team has scheduled an access point upgrade on Friday.'
  },
  {
    id: 'c-2',
    title: 'Need Additional Water Purifier in Cafeteria Annex',
    description: 'During peak lunch hours (1:00 PM - 2:30 PM), the current water dispenser has long queues and runs out quickly.',
    category: 'cafeteria',
    status: 'pending',
    is_anonymous: true,
    date: '2026-05-09',
    reported_by: 'Anonymous Student',
    reported_by_email: 'anonymous@green.edu.bd',
    admin_feedback: null
  }
];
