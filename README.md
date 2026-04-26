# Mizpah Lodge #302 — Camp App

A mobile-first camp planning app for Mizpah Lodge #302. Covers the full weekend: shared gear/shopping checklist with real-time sync, the meal plan, and the RSVP list. Any brother checks something off on their phone — everyone sees it instantly.

**Stack:** Vite · React 18 · TypeScript · Supabase (Postgres + Realtime) · Vercel

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/axeion/campapp.git
cd campapp
npm install
```

### 2. Set up Supabase (see full instructions below)

Once you have a Supabase project, copy the example env file and fill it in:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Supabase Setup

### 1. Create a project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New project**
3. Choose your organization, give the project a name (e.g. `mizpah-camp`), set a database password, pick the closest region
4. Wait ~2 minutes for provisioning

### 2. Run the migration

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run**

This creates two tables:
- `config` — stores the RSVP list, pack list, and menu as JSONB
- `checklist` — stores the shared real-time check state (which items are ticked)

### 3. Enable Realtime

The migration enables realtime on both tables automatically. To verify:

1. Go to **Database → Replication** in the Supabase dashboard
2. Confirm `config` and `checklist` appear under the `supabase_realtime` publication

### 4. Get your API keys

1. Go to **Project Settings → API** (gear icon in the sidebar)
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public** key → `VITE_SUPABASE_ANON_KEY`

> The anon key is safe to expose in a frontend app — Row Level Security policies control what it can do.

---

## Vercel Deployment

### 1. Push to GitHub

If you haven't already:

```bash
git remote add origin https://github.com/your-username/campapp.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repo (`axeion/campapp`)
4. Vercel will auto-detect it as a Vite project — the defaults are correct:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3. Add environment variables

Before clicking Deploy, expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` |

Set both for **Production**, **Preview**, and **Development** environments.

### 4. Deploy

Click **Deploy**. Vercel builds and publishes the app. Your URL will be something like `mizpah-camp.vercel.app`.

Every push to `main` triggers an automatic redeploy.

### 5. (Optional) Add a custom domain

1. In your Vercel project, go to **Settings → Domains**
2. Add your domain (e.g. `camp.mizpahomaha.com`)
3. Follow the DNS instructions — typically a CNAME pointing to `cname.vercel-dns.com`

---

## How It Works

### First visit
The app prompts for your name. It's stored in `localStorage` — just so checklist changes can be attributed to a person. No account, no password.

### Pack List
Gear and shopping categories in one unified checklist. Check an item off on your phone and every other open session updates in under a second via Supabase Realtime.

### Menu
The full weekend meal plan (Fri dinner → Sun breakfast) with cook's notes. Read-only for regular users.

### RSVP
The attendee list with Fri/Sat attendance and shirt sizes, plus an auto-generated shirt size summary.

### Admin mode
Tap **Admin** in the header. PIN is **302**. From there you can edit the RSVP list, pack list categories/items, and meal descriptions. Changes save to Supabase and sync to all open sessions.

---

## Resetting Data

To reset the pack list, RSVP, or menu back to the built-in defaults:

1. Open the app → tap **Admin** → enter PIN `302`
2. Navigate to the section you want to reset
3. Tap **Reset** and confirm

To wipe the checklist state (all unchecked):
- Tap **Clear all** at the top of the Pack List tab

To hard-reset everything via Supabase:

```sql
delete from checklist;
delete from config;
```

Then reload the app — it will re-seed from the built-in defaults.

---

## Project Structure

```
campapp/
├── src/
│   ├── App.tsx                  # Root component, tab routing
│   ├── theme.ts                 # Color tokens
│   ├── types/index.ts           # Shared TypeScript types
│   ├── data/defaults.ts         # Seed data (RSVP, gear, shopping, menu)
│   ├── lib/supabase.ts          # Supabase client
│   ├── hooks/
│   │   ├── useAppConfig.ts      # Loads/saves RSVP, pack list, menu
│   │   └── useChecklist.ts      # Real-time shared checklist state
│   └── components/
│       ├── NameGate.tsx         # First-visit name prompt
│       ├── ui/                  # Primitives: Card, CheckRow, Btn, Modal
│       ├── tabs/                # PackListTab, MenuTab, RsvpTab
│       └── admin/               # AdminTab, AdminRsvp, AdminPackList, AdminMenu
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.example
└── index.html
```
