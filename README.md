# APN Hub — Phase 1 MVP

An Apostolic Pentecostal media & resource platform for the **Apostolic Power
Network**. Discover events, preaching, podcasts, materials, and prayer requests
— and submit content for admin approval.

Built with **Next.js (App Router) · TypeScript · Tailwind CSS · Supabase**, and
ready to deploy on **Vercel**.

---

## ✨ What's in Phase 1

- **Public site** — Home, Events, Preaching, Podcast, Materials, Prayer, Submit
- **Search + category filters** on every browse page
- **Prayer wall** with an atomic “I Prayed” counter
- **Central submission form** (event, sermon, podcast, music, material,
  testimony, news, prayer) — fields adapt to the type, everything lands as
  `pending`
- **Newsletter signup**
- **Admin dashboard** — analytics, submission review (approve / reject /
  publish), content management (publish / draft / delete), prayer moderation,
  subscriber list
- **Admin approval required** before anything appears publicly
- **Empty, loading, and error states** throughout
- **Seed data + zero-config preview** — runs fully populated even before you
  connect Supabase

> 🚫 Intentionally **not** in Phase 1 (structured so they can be added later):
> payments, AI agents, Instagram automation, APN+ premium membership, native
> mobile apps.

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure Supabase — see below. You can skip this to preview.
cp .env.example .env.local

# 3. Run
npm run dev
# open http://localhost:3000
```

**No Supabase yet?** The app detects missing credentials and automatically uses
built-in seed data (read-only). Every page renders populated, forms show success
states, and `/admin` opens in a read-only **demo mode**. This makes it easy to
preview and screenshot before wiring up a database.

---

## 🗄️ Connect Supabase (enables real data + admin)

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the schema then the seed:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/seed.sql`
3. Copy your keys into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...        # server only — never expose
   ADMIN_EMAILS=you@example.com         # who can access /admin
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Create your admin login:
   - In **Supabase → Authentication → Users**, add a user with the same email
     you put in `ADMIN_EMAILS`.
   - That email should also be in the `admin_users` table (the seed inserts a
     placeholder — update it to your email).
5. Restart `npm run dev` and visit `/admin` to sign in.

### Security model

- Public users can **read published content only** (enforced by RLS).
- Public can **insert** prayer requests, submissions, and newsletter signups —
  always as `pending`. Nothing public is auto-published.
- All approvals/edits happen **server-side with the service-role key**, gated by
  the admin dashboard.

---

## 📁 Project structure

```
apn-hub/
├─ supabase/
│  ├─ migrations/0001_initial_schema.sql   # tables, enums, RLS, triggers, RPC
│  └─ seed.sql                             # sample data
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                        # nav + footer + bottom nav
│  │  ├─ page.tsx                          # Home
│  │  ├─ events|preaching|podcast|materials|prayer|submit/
│  │  ├─ admin/                            # guarded dashboard
│  │  └─ api/                              # prayer, submit, newsletter, admin
│  ├─ components/
│  │  ├─ ui/                               # Button, Card, Badge, Filters, States…
│  │  ├─ layout/                           # Navbar, BottomNav, Footer
│  │  ├─ cards/                            # Event/Preaching/Podcast/Material/Prayer
│  │  ├─ lists/                            # client browse+filter lists
│  │  ├─ forms/                            # Prayer, Newsletter, Submit
│  │  ├─ sections/                         # Hero, Newsletter
│  │  └─ admin/                            # AdminLogin, AdminDashboard
│  ├─ lib/
│  │  ├─ types.ts                          # content models (mirror the schema)
│  │  ├─ constants.ts                      # categories, nav, submission types
│  │  ├─ data.ts                           # data layer (Supabase + seed fallback)
│  │  ├─ sample-data.ts                    # seed data for fallback mode
│  │  └─ supabase/                         # clients + auth helpers + config
│  └─ middleware.ts                        # refreshes admin session cookies
└─ .env.example
```

---

## ▲ Deploy to Vercel

1. Push this folder to a Git repo and **Import** it in Vercel.
2. Add the same env vars from `.env.example` in **Project → Settings →
   Environment Variables**.
3. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
4. Deploy. (It builds and runs even with no env vars, in seed-data mode.)

Drop the deployed URL into the Apostolic Power Network Instagram bio and start
collecting event submissions, prayer requests, subscribers, and content.

---

## 🧱 Designed to grow (Phase 2+)

The code is organized so future work slots in cleanly:

- **APN+ premium** — `materials.is_premium` + `FreePremiumBadge` already exist.
- **Payments** — add a billing module; gate premium materials by membership.
- **More content types** — add a table + a `types.ts` model + a `data.ts`
  reader + a card; the submission promoter (`/api/admin/submissions`) maps types
  to tables in one place.
- **Instagram / AI automation** — add as separate API routes or background jobs.

---

## 📜 Scripts

| Command            | Description                |
| ------------------ | -------------------------- |
| `npm run dev`      | Start the dev server       |
| `npm run build`    | Production build           |
| `npm run start`    | Run the production build   |
| `npm run lint`     | Lint                       |
| `npm run typecheck`| TypeScript check (no emit) |

Built for the Apostolic Pentecostal community. 🔥
