# HallPilot — Multi-College Exam Hall Lookup Platform

> **"Your Exam Hall, One Search Away."**  
> HallPilot digitizes paper-based examination seating arrangements used by colleges, providing students with instantaneous, private exam hall lookups while giving college administrators a secure, multi-tenant portal to upload, preview, and publish seating arrangements.

---

## Key Features

* **Instant Student Lookup:** Fast search by College and Register Number with strict preservation of leading zeros (e.g. `004101`, `09CS102`).
* **Multi-Tenant College Isolation:** Automated separation across colleges using Supabase Row Level Security (RLS).
* **Anti-Scraping Protection:** Zero public `SELECT` on full seating rosters. All lookups run through a parameterized, rate-limited PostgreSQL `SECURITY DEFINER` function (`lookup_student_seating`).
* **Automated Expiry:** Exam sessions automatically expire post-session, preventing stale data.
* **Modern Navy Design System:** Tailored edtech visual identity built with React, Vite, and Tailwind CSS.
* **Zero Secret Exposure:** Browser code only interfaces via public anonymous keys; service-role keys are strictly prohibited from client bundles.

---

## Project Structure

```
HallPilot/
├── docs/                                 # Architectural specifications
│   ├── PROJECT_PLAN.md                  # Scope, roadmap, and UI folder structure
│   ├── DATABASE_DESIGN.md               # ERD, schemas, and anti-scraping RPC
│   ├── SECURITY_PLAN.md                 # Supabase RLS policies and key isolation
│   ├── UPLOAD_FORMAT.md                 # Excel/CSV column schemas and aliasing
│   └── sample_seating_template.csv      # Fictional sample template
├── public/                              # Brand icons and static assets
├── src/
│   ├── components/
│   │   ├── common/                      # Button, Badge, Navbar, Footer
│   │   ├── layout/                      # PublicLayout
│   │   └── student/                     # LookupForm, HallResultCard
│   ├── lib/                             # Supabase client instantiation & mock datasets
│   ├── pages/
│   │   ├── public/                      # HomePage, LookupPage
│   │   └── admin/                       # AdminLoginPage
│   ├── services/                        # API & RPC lookup service
│   ├── types/                           # Typed database and domain models
│   ├── App.tsx                          # Client-side router
│   ├── index.css                        # Tailwind directives & design system
│   └── main.tsx                         # Entry point
├── supabase/
│   ├── migrations/
│   │   └── 20261009000001_initial_schema.sql  # Complete schema, RLS & RPC
│   └── seed.sql                         # Fictional demo seed data
├── .env.example                         # Environment template (placeholders only)
├── package.json
└── vite.config.ts
```

---

## Local Development Setup

### 1. Prerequisites
* Node.js (v18+ or v20+)
* npm (v9+)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables (Optional for UI Shell)
By default, HallPilot runs in **Demo Mode** with fictional sample records so you can test the UI immediately without configuring a database.

To connect your Supabase project:
1. Copy the example configuration:
   ```bash
   cp .env.example .env.local
   ```
2. Populate `.env.local` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
   *(Never add `SUPABASE_SERVICE_ROLE_KEY` to this file)*

### 4. Apply Database Migrations (Supabase)
To apply the database schema to your Supabase instance:
1. In the Supabase Dashboard, navigate to **SQL Editor**.
2. Run the migration script in:
   [`supabase/migrations/20261009000001_initial_schema.sql`](supabase/migrations/20261009000001_initial_schema.sql)
3. To insert fictional test records, run:
   [`supabase/seed.sql`](supabase/seed.sql)

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 6. Verify Production Build & TypeScript
```bash
npm run build
```

---

## Testing the Student Lookup

When running locally in Demo Mode, you can test student searches with these fictional candidates:
* **Apex Institute of Technology (AIT):**
  * Register Number: `004101` (tests preserved leading zero)
  * Register Number: `09CS102` (tests alphanumeric format)
* **Beacon College of Engineering (BCE):**
  * Register Number: `005520` (tests afternoon session)

---

## Security & Privacy Compliance

* **Fictional Data Only:** No real student data, names, or real register numbers are committed to this repository.
* **Service-Role Isolation:** Service-role keys are never stored in client code.
* **Row Level Security:** Multi-tenant isolation enforced at the PostgreSQL layer.
