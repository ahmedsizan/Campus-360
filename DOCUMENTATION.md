# Campus 360 Solution — Full Documentation

> Comprehensive Campus Management Portal for Green University of Bangladesh (GUB)
> Live URL: https://campus-360-solution.vercel.app
> GitHub: https://github.com/ahmedsizan/Campus-360-Solution

---

## Table of Contents

1. Project Overview
2. Tech Stack
3. Live Deployment
4. Supabase Backend Credentials
5. Project Structure
6. User Roles and Access
7. Pages and Features
8. Database Schema (Supabase)
9. Authentication System
10. Environment Variables
11. Running Locally
12. Demo Accounts
13. Database Seed Data

---

## Project Overview

Campus 360 Solution is a modern full-stack campus management portal built for Green University of Bangladesh (GUB). It enables students, teachers, and administrators to manage and access campus services from one unified platform.

Core Features:
- Role-based authentication (Student / Teacher / Admin)
- Notice board with category filtering
- Cafeteria with unit ordering and multi-item cart checkout
- Real-time bus transport tracker
- Lost & Found reporting system
- Anonymous or named complaints with admin feedback
- Full profile customization with avatar upload
- Dark/Light theme toggle
- Fully responsive (mobile, tablet, desktop)

---

## Tech Stack

| Layer                  | Technology                          |
|------------------------|-------------------------------------|
| Frontend Framework     | React 19 + TypeScript               |
| Build Tool             | Vite 8                              |
| Styling                | Vanilla CSS (Custom Design System)  |
| Icons                  | Lucide React                        |
| Backend / Database     | Supabase (PostgreSQL)               |
| Authentication         | Supabase Auth                       |
| Hosting                | Vercel                              |
| Version Control        | Git + GitHub                        |
| Fonts                  | Google Fonts (Inter, Outfit)        |

---

## Live Deployment

| Item                | Value                                                    |
|---------------------|----------------------------------------------------------|
| Live URL            | https://campus-360-solution.vercel.app                   |
| GitHub Repository   | https://github.com/ahmedsizan/Campus-360-Solution        |
| Hosting Platform    | Vercel                                                   |
| Production Branch   | main                                                     |

NOTE: Always share the permanent production URL above.
Vercel preview links (with random hashes) expire after new deployments.

---

## Supabase Backend Credentials

### Supabase Project URL
```
https://pdregecsxfqgxkerjdcu.supabase.co
```

### Supabase Anon Key (Public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcmVnZWNzeGZxZ3hrZXJqZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjIzMTEsImV4cCI6MjEwMzEzODMxMX0.8jZG4Iguu-QDO0wy9jPszZV8GgVCv_PjqWkAopMrT6E
```

### Supabase Dashboard
```
https://supabase.com/dashboard/project/pdregecsxfqgxkerjdcu
```

### .env File Configuration
```
VITE_SUPABASE_URL=https://pdregecsxfqgxkerjdcu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkcmVnZWNzeGZxZ3hrZXJqZGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1NjIzMTEsImV4cCI6MjEwMzEzODMxMX0.8jZG4Iguu-QDO0wy9jPszZV8GgVCv_PjqWkAopMrT6E
```

The credentials are also embedded as production fallback values inside src/lib/supabaseClient.ts so the app works on Vercel even without explicit environment variable configuration.

---

## Project Structure

```
Campus 360 Solution/
├── public/
├── src/
│   ├── assets/                   # Static image assets
│   ├── components/
│   │   ├── Modal.tsx             # Reusable modal wrapper
│   │   ├── Navbar.tsx            # Top navigation bar (glassmorphic, theme toggle)
│   │   ├── ProfileModal.tsx      # Profile customization modal
│   │   └── Sidebar.tsx           # Legacy sidebar component
│   ├── context/
│   │   ├── AuthContext.tsx       # Authentication state, login, logout, register
│   │   └── AppContext.tsx        # Global app state (notices, buses, food, cart)
│   ├── lib/
│   │   └── supabaseClient.ts     # Supabase client with fallback credentials
│   ├── pages/
│   │   ├── Dashboards/
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── Cafeteria.tsx
│   │   ├── Complaints.tsx
│   │   ├── Login.tsx
│   │   ├── LostFound.tsx
│   │   ├── Notices.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── Transport.tsx
│   ├── types.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── supabase_schema.sql           # Full DB schema + seed data
├── vercel.json                   # Vercel build + SPA routing config
├── vite.config.ts                # Vite config with code-splitting
├── package.json
├── .env                          # Environment variables (gitignored)
└── DOCUMENTATION.md              # This file
```

---

## User Roles and Access

| Role    | Email Format                       | Permissions                                            |
|---------|------------------------------------|--------------------------------------------------------|
| Student | @green.edu.bd                      | Read campus data, order food, submit complaints        |
| Teacher | Contains teacher/faculty/prof      | All student permissions + grade management views       |
| Admin   | Contains admin in email            | Full permissions + respond to complaints, manage data  |

Role Detection:
- admin@... → Admin
- teacher@... / faculty@... / prof@... → Teacher
- All other @green.edu.bd → Student

---

## Pages and Features

### Login Page
- Email and Password login via Supabase Auth
- Account registration (name, email, department, student ID, password)
- Email must end with @green.edu.bd
- Quick demo login buttons for all 3 roles
- Light/Dark mode toggle

### Dashboard (Per Role)

Student Dashboard:
- Welcome banner with stats (GPA, attendance, credits)
- Navigation tiles (Cafeteria, Bus, Notices, Complaints)
- Recent notices and active bus ETA

Teacher Dashboard:
- Lecture schedule with room assignments
- Student count and class metrics
- Grade submission widget

Admin Dashboard:
- System-wide statistics (students, teachers, pending complaints)
- Complaint management widget
- Notice board overview

### Notices Board
- Data from Supabase notices table
- Filter: academic, administrative, events, sports
- Admins can create new notices

### Cafeteria
- Menu from Supabase food_items table
- Filter: breakfast, lunch, snacks, beverage
- Unit Selection Modal: set quantity, see live subtotal
- Multi-item cart with single checkout
- Orders saved to Supabase orders table

### Transport Tracker
- Live bus data from Supabase buses table
- Status: active (green), delayed (orange), inactive (grey)
- Shows current location, ETA, and full schedule

### Lost and Found
- Browse and report lost/found items
- Filter by status (lost/found) and category

### Complaints
- Submit named or anonymous complaints
- Categories: academic, facilities, it, transport, cafeteria
- Track status: pending → under_review → resolved
- Admins provide feedback

### Profile
- Edit name, phone, department, bio, blood group, parent names
- Upload profile picture (URL or file)
- Change password
- Avatar locked permanently per email

### Settings
- Theme, notification, and language preferences

---

## Database Schema (Supabase)

### Table 1: profiles
Linked to Supabase Auth. Auto-created on signup via trigger.

| Column       | Type        | Description                  |
|--------------|-------------|------------------------------|
| id           | UUID (PK)   | References auth.users.id     |
| email        | TEXT        | University email             |
| name         | TEXT        | Full name                    |
| role         | TEXT        | admin, teacher, or student   |
| avatar       | TEXT        | Profile picture URL          |
| phone        | TEXT        | Phone number                 |
| department   | TEXT        | Department name              |
| id_no        | TEXT        | Student/Employee ID          |
| semester     | TEXT        | Current semester             |
| bio          | TEXT        | Short biography              |
| office_hours | TEXT        | Teacher office hours         |
| father_name  | TEXT        | Father name                  |
| mother_name  | TEXT        | Mother name                  |
| blood_group  | TEXT        | Blood group                  |
| updated_at   | TIMESTAMPTZ | Last update timestamp        |
| created_at   | TIMESTAMPTZ | Creation timestamp           |

RLS: SELECT / INSERT / UPDATE open to all.
Trigger: on_auth_user_created → auto-creates profile on signup.

---

### Table 2: notices

| Column     | Type        | Description                                   |
|------------|-------------|-----------------------------------------------|
| id         | TEXT (PK)   | e.g. n-uuid                                   |
| title      | TEXT        | Notice headline                               |
| content    | TEXT        | Full notice body                              |
| date       | TEXT        | Publication date                              |
| category   | TEXT        | academic, administrative, events, sports      |
| author     | TEXT        | Posted by                                     |
| created_at | TIMESTAMPTZ | Timestamp                                     |

---

### Table 3: buses

| Column           | Type        | Description                        |
|------------------|-------------|------------------------------------|
| id               | TEXT (PK)   | e.g. bus-1                         |
| name             | TEXT        | Bus display name                   |
| route            | TEXT        | Route description                  |
| status           | TEXT        | active, inactive, delayed          |
| current_location | TEXT        | Live location description          |
| eta              | TEXT        | Estimated arrival time             |
| schedule         | TEXT[]      | Array of departure times           |
| created_at       | TIMESTAMPTZ | Timestamp                          |

---

### Table 4: food_items

| Column       | Type        | Description                        |
|--------------|-------------|------------------------------------|
| id           | TEXT (PK)   | e.g. f-uuid                        |
| name         | TEXT        | Food item name                     |
| category     | TEXT        | breakfast, lunch, snacks, beverage |
| price        | NUMERIC     | Price in BDT (Tk)                  |
| is_vegetarian| BOOLEAN     | Vegetarian flag                    |
| is_available | BOOLEAN     | Availability                       |
| image        | TEXT        | Food image URL                     |
| rating       | NUMERIC     | Rating out of 5                    |
| created_at   | TIMESTAMPTZ | Timestamp                          |

---

### Table 5: lost_found_items

| Column        | Type        | Description                             |
|---------------|-------------|-----------------------------------------|
| id            | TEXT (PK)   | e.g. lf-uuid                            |
| title         | TEXT        | Item name                               |
| description   | TEXT        | Description                             |
| status        | TEXT        | lost or found                           |
| category      | TEXT        | electronics, documents, accessories, others |
| location      | TEXT        | Where it was lost/found                 |
| date          | TEXT        | Date reported                           |
| contact_name  | TEXT        | Contact person name                     |
| contact_phone | TEXT        | Contact phone                           |
| reported_by   | TEXT        | Reporter email                          |
| created_at    | TIMESTAMPTZ | Timestamp                               |

---

### Table 6: complaints

| Column            | Type        | Description                              |
|-------------------|-------------|------------------------------------------|
| id                | TEXT (PK)   | e.g. c-uuid                              |
| title             | TEXT        | Complaint headline                       |
| description       | TEXT        | Full complaint details                   |
| category          | TEXT        | academic, facilities, it, transport, cafeteria |
| status            | TEXT        | pending, under_review, resolved          |
| is_anonymous      | BOOLEAN     | Anonymous flag                           |
| date              | TEXT        | Submission date                          |
| reported_by       | TEXT        | Submitter name                           |
| reported_by_email | TEXT        | Submitter email                          |
| admin_feedback    | TEXT        | Admin response                           |
| created_at        | TIMESTAMPTZ | Timestamp                                |

---

### Table 7: orders

| Column      | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| id          | TEXT (PK)   | e.g. ord-uuid                        |
| order_id    | TEXT        | Human-readable order ID              |
| items       | JSONB       | Ordered items with quantities/prices |
| total_price | NUMERIC     | Total in BDT (Tk)                    |
| status      | TEXT        | pending, preparing, ready, completed |
| ordered_by  | TEXT        | User email                           |
| date        | TEXT        | Order date                           |
| created_at  | TIMESTAMPTZ | Timestamp                            |

---

## Authentication System

1. Registration:
   - supabase.auth.signUp() creates auth user
   - DB trigger auto-creates profiles row
   - Metadata includes name, role, department, id_no

2. Login:
   - supabase.auth.signInWithPassword() authenticates
   - Profile fetched from profiles table
   - Profile + avatar stored in localStorage

3. Session Persistence:
   - Supabase session auto-refreshes
   - On app load: checks active Supabase session first, then localStorage

4. Profile Picture Locking:
   - Avatar saved in localStorage under key gub_avatar_<email>
   - getResolvedAvatar() checks localStorage FIRST on every login
   - Custom picture never overwritten by DB defaults

5. Logout:
   - supabase.auth.signOut() clears session
   - localStorage gub_user cleared
   - Redirected to login page

---

## Environment Variables

| Variable              | Value                                             |
|-----------------------|---------------------------------------------------|
| VITE_SUPABASE_URL     | https://pdregecsxfqgxkerjdcu.supabase.co          |
| VITE_SUPABASE_ANON_KEY| eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (above) |

Also embedded in src/lib/supabaseClient.ts as production fallback.

---

## Running Locally

Prerequisites: Node.js v18+, npm v9+, Git

```bash
# Clone the repository
git clone https://github.com/ahmedsizan/Campus-360-Solution.git
cd Campus-360-Solution

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

App runs at: http://localhost:5173

---

## Demo Accounts

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Student | student@green.edu.bd     | student123  |
| Teacher | teacher@green.edu.bd     | teacher123  |
| Admin   | admin@green.edu.bd       | admin123    |

You can also register with any @green.edu.bd email.

---

## Database Seed Data

### Notices (4 records)
- Registration deadline for Summer 2026
- Midterm examination schedule
- IUPC 2026 programming contest
- Transport maintenance notice

### Buses (4 routes)
| Route                        | Status              |
|------------------------------|---------------------|
| Mirpur to Purbachal          | Active              |
| Uttara to Purbachal          | Active              |
| Mirpur 10 to Purbachal       | Delayed             |
| Savar to Purbachal           | Inactive (Maintenance) |

### Food Items (6 items)
| Item                        | Category  | Price  |
|-----------------------------|-----------|--------|
| Chicken Biryani Special     | Lunch     | Tk 150 |
| Beef Tehari (GUB Special)   | Lunch     | Tk 160 |
| Singara and Samosa Set      | Snacks    | Tk 20  |
| Cold Coffee with Ice Cream  | Beverage  | Tk 70  |
| Paratha and Egg Omelette    | Breakfast | Tk 45  |
| Khichuri with Egg Curry     | Lunch     | Tk 90  |

### Lost and Found (3 records)
- Blue Student ID Card (found)
- Black Leather Wallet (found)
- Casio fx-991EX Calculator (lost)

### Complaints (2 records)
- WiFi issues in Building A — under_review
- Cafeteria wash basin cleanliness — pending

---

## Project Info

| Item        | Detail                                          |
|-------------|-------------------------------------------------|
| University  | Green University of Bangladesh (GUB)            |
| Developer   | Ahmed Sizan                                     |
| GitHub      | https://github.com/ahmedsizan                   |
| Email       | ahmedsizan3six9@gmail.com                       |
| Live App    | https://campus-360-solution.vercel.app          |

Last updated: August 2026
