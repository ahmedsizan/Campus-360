import { createClient } from '@supabase/supabase-js';
import { Bus, BusSeatBooking, Complaint, FoodItem, LostFoundItem, Notice } from '../types';

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
    name: 'Green Line 1 (Mirpur Route)',
    route: 'Mirpur (Terminal) ➔ Kuril Flyover ➔ Green University Campus',
    status: 'active',
    current_location: 'Passing Kuril Flyover (Bus 01 in Transit)',
    eta: '15 mins to Campus (08:30 AM Shift)',
    schedule: ['07:30 AM (Bus 1)', '12:00 PM (Bus 2)', '01:45 PM (Return)', '04:45 PM (Return)'],
    total_seats: 45
  },
  {
    id: 'bus-2',
    name: 'Green Line 2 (Uttara Route)',
    route: 'Uttara House Building ➔ Uttara BNS Center ➔ Kuril Flyover ➔ Green University Campus',
    status: 'active',
    current_location: 'Passing Uttara BNS Center (Bus 01 in Transit)',
    eta: '8 mins to Kuril • 25 mins to Campus',
    schedule: ['07:30 AM (Bus 1)', '09:30 AM (Bus 2)', '12:00 PM (Bus 3)', '01:45 PM (Return)', '04:45 PM (Dual Return)'],
    total_seats: 45
  },
  {
    id: 'bus-3',
    name: 'Green Line 3 (Bishnandi Ferry Ghat Route)',
    route: 'Bishnandi Ferry Ghat ➔ Araihazar ➔ Gawsia ➔ Green University Campus',
    status: 'active',
    current_location: 'Passing Araihazar Bazaar (Bus 01 in Transit)',
    eta: '12 mins to Gawsia • 30 mins to Campus',
    schedule: ['07:30 AM (Bus 1)', '09:30 AM (Bus 2)', '12:00 PM (Bus 3)', '01:45 PM (Return)', '04:45 PM (Dual Return)'],
    total_seats: 45
  },
  {
    id: 'bus-4',
    name: 'Green Line 4 (Savar Route)',
    route: 'Savar (Terminal) ➔ Kuril Flyover ➔ Green University Campus',
    status: 'active',
    current_location: 'Approaching Kuril Flyover from Savar (Bus 01 in Transit)',
    eta: '18 mins to Campus (08:30 AM Shift)',
    schedule: ['07:00 AM (Bus 1)', '12:00 PM (Bus 2)', '01:45 PM (Return)', '04:45 PM (Return)'],
    total_seats: 45
  }
];



export const FALLBACK_SEAT_BOOKINGS: BusSeatBooking[] = [
  {
    id: 'bk-gl4-1',
    token_id: 'GUB-TK-4108',
    bus_id: 'bus-4',
    bus_name: 'Green Line 4 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:00 AM',
    stoppage: 'Savar',
    stoppage_time: '07:00 AM',
    seat_number: 8,
    student_name: 'Shahriar Kabir',
    student_id: '22100512',
    user_email: 'shahriar@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-gl4-2',
    token_id: 'GUB-TK-4109',
    bus_id: 'bus-4',
    bus_name: 'Green Line 4 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:00 AM',
    stoppage: 'Kuril Flyover',
    stoppage_time: '08:00 AM',
    seat_number: 15,
    student_name: 'Mehnaz Parvin',
    student_id: '22100623',
    user_email: 'mehnaz@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-gl1-1',
    token_id: 'GUB-TK-1021',
    bus_id: 'bus-1',
    bus_name: 'Green Line 1 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Mirpur',
    stoppage_time: '07:30 AM',
    seat_number: 6,
    student_name: 'Adnan Sami',
    student_id: '22100678',
    user_email: 'adnan@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-gl1-2',
    token_id: 'GUB-TK-1022',
    bus_id: 'bus-1',
    bus_name: 'Green Line 1 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Kuril Flyover',
    stoppage_time: '08:00 AM',
    seat_number: 11,
    student_name: 'Tasnim Hossain',
    student_id: '22100789',
    user_email: 'tasnim@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-101',
    token_id: 'GUB-TK-2034',
    bus_id: 'bus-2',
    bus_name: 'Green Line 2 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Uttara House Building',
    stoppage_time: '07:30 AM',
    seat_number: 4,
    student_name: 'Tanvir Ahmed',
    student_id: '22100234',
    user_email: 'tanvir@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-102',
    token_id: 'GUB-TK-2035',
    bus_id: 'bus-2',
    bus_name: 'Green Line 2 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Uttara BNS Center',
    stoppage_time: '07:40 AM',
    seat_number: 7,
    student_name: 'Nafisa Islam',
    student_id: '22100589',
    user_email: 'nafisa@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-103',
    token_id: 'GUB-TK-3045',
    bus_id: 'bus-3',
    bus_name: 'Green Line 3 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Bishnandi Ferry Ghat',
    stoppage_time: '07:30 AM',
    seat_number: 5,
    student_name: 'Mahmudul Hasan',
    student_id: '22100312',
    user_email: 'mahmud@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-104',
    token_id: 'GUB-TK-3046',
    bus_id: 'bus-3',
    bus_name: 'Green Line 3 (Bus 01)',
    direction: 'to_campus',
    trip_slot: '07:30 AM',
    stoppage: 'Araihazar',
    stoppage_time: '07:50 AM',
    seat_number: 9,
    student_name: 'Fariha Chowdhury',
    student_id: '22100445',
    user_email: 'fariha@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
  },
  {
    id: 'bk-105',
    token_id: 'GUB-TK-3047',
    bus_id: 'bus-3',
    bus_name: 'Green Line 3 (Bus 02)',
    direction: 'to_campus',
    trip_slot: '09:30 AM',
    stoppage: 'Gawsia',
    stoppage_time: '10:10 AM',
    seat_number: 14,
    student_name: 'Rayhan Uddin',
    student_id: '22100981',
    user_email: 'rayhan@green.edu.bd',
    booking_date: new Date().toISOString().split('T')[0],
    status: 'confirmed',
    created_at: new Date().toISOString()
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
