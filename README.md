# Campus 360 Solution — Green University of Bangladesh (GUB)

Comprehensive Smart Campus Management Portal for Green University of Bangladesh (GUB).
Built with **React 19 + TypeScript + Vite + Supabase (PostgreSQL + Auth + Real-time Sync) + Custom Design System**.

---

## 🌟 Key Features

- **Role-Based Authentication (Supabase Auth):** Student, Faculty / Teacher, and Administrator access with protected routes and auto-profile syncing.
- **Student Dashboard:** Welcome banner, dynamic CGPA (`3.84`), credit completion tracker (`118/144`), attendance (`94.2%`), quick service tiles, live transport ticker, and recent official notices.
- **Teacher Dashboard:** Faculty statistics, course load, today's lecture schedule with room assignments, and grade submissions.
- **Admin Dashboard:** Central campus metrics, live Bus Fleet dispatch controller, grievance resolution desk, and notice publisher.
- **Notice Board:** Category filtering (`Academic`, `Administrative`, `Events`, `Sports`), keyword search, and reader modal.
- **Cafeteria:** Category filters, vegetarian filter toggle, **Unit Selection Modal** with live subtotal calculation in BDT (Tk), and slide-in **Tray Drawer** with order checkout.
- **Transport Tracker:** Real-time bus telemetry with status badges (`Active`, `Delayed`, `In Workshop`), live location checkpoints, ETA, and departure schedules.
- **Lost & Found:** Recovered/Missing item feeds, category filters, and "Report an Item" modal.
- **Complaints & Grievances:** Anonymous or named grievance submission toggle, status progression (`Pending` ➔ `Under Review` ➔ `Resolved`), and official administrator response threads.
- **Dark / Light Theme:** Custom Vanilla CSS design system with smooth theme switching and micro-animations.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 6
- **Backend / Database:** Supabase (PostgreSQL, Row Level Security, Triggers, Real-time Channels)
- **Icons:** Lucide React
- **Styling:** Vanilla CSS (Custom Design System, Glassmorphism, Dark/Light Mode)
- **Deployment Target:** Vercel

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

```

### 3. Run Locally
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Schema & SQL

The complete PostgreSQL database schema, RLS policies, auto-creation triggers, and initial seed data are provided in `supabase_schema.sql`.

---

## 📄 License
Green University of Bangladesh (GUB) • Campus 360 Solution
