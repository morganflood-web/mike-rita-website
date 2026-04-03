# Mike Rita Admin Panel — Setup Guide

A password-protected admin panel at `/admin` so Mike can manage shows, releases, and bio without touching code.

---

## Step 1 — Install the dependency

From the website root (`~/Documents/mike-rita-website/`):

```bash
npm install @vercel/postgres
```

---

## Step 2 — Copy files into the project

Copy everything from this archive into the project root, merging with existing folders:

```
app/admin/          → app/admin/
app/api/admin/      → app/api/admin/
app/api/setup/      → app/api/setup/
lib/actions/        → lib/actions/
lib/auth.ts         → lib/auth.ts
lib/data.ts         → lib/data.ts
lib/db.ts           → lib/db.ts
```

> **Note:** The admin layout at `app/admin/layout.tsx` wraps all `/admin/*` routes with auth checking. The login page at `app/admin/page.tsx` is **outside** the layout (it's the root of the segment, not a child route).

---

## Step 3 — Local dev setup

Create `.env.local` in the project root (never commit this file):

```
ADMIN_PASSWORD=Reets2025
POSTGRES_URL=<paste from Vercel dashboard — see Step 4>
```

---

## Step 4 — Connect Vercel Postgres

1. Go to [vercel.com](https://vercel.com) → your project → **Storage** tab
2. Click **Create Database** → choose **Postgres** → follow the prompts
3. Connect the database to your project
4. Vercel automatically adds `POSTGRES_URL` (and a few other `POSTGRES_*` vars) to your environment
5. For local dev: in Vercel dashboard → Storage → your DB → `.env.local` tab → copy the snippet and paste into your local `.env.local`

---

## Step 5 — Add `ADMIN_PASSWORD` to Vercel

1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add: `ADMIN_PASSWORD` = `Reets2025` (or whatever password you choose)
3. Apply to **Production**, **Preview**, and **Development** environments

---

## Step 6 — Deploy & run setup

```bash
git add .
git commit -m "Add admin panel"
git push
```

Once deployed, visit this URL **once** to create the database tables and seed initial data:

```
https://mikerita.com/api/setup
```

You should see:
```json
{"ok": true, "message": "Database tables created and seeded successfully."}
```

This endpoint is idempotent — safe to run multiple times, it won't duplicate data.

---

## Step 7 — Access the admin panel

Go to: **https://mikerita.com/admin**

Enter your password → you're in.

---

## Step 8 — Update public pages to read from the database

The admin panel writes to Vercel Postgres. Your public pages need to read from it too — replace any hardcoded arrays with calls to the helpers in `lib/data.ts`.

### Shows page (e.g. `app/live/page.tsx`)

```tsx
// Before:
const shows = [
  { date: "Fri, Apr 03, 2026", venue: "The Boardroom ...", ... },
  // ...
]

// After:
import { getShows } from '@/lib/data';

export default async function LivePage() {
  const shows = await getShows();
  // ... rest of your JSX unchanged
}
```

### Releases page (e.g. `app/releases/page.tsx`)

```tsx
import { getReleases } from '@/lib/data';

export default async function ReleasesPage() {
  const releases = await getReleases();
  // ...
}
```

### Bio page (e.g. `app/bio/page.tsx`)

```tsx
import { getBio } from '@/lib/data';

export default async function BioPage() {
  const { bio, awards } = await getBio();
  // ...
}
```

The data shape matches what you likely already have — `shows` is an array of `{ id, date, venue, city, ticketUrl, soldOut }`, releases is `{ id, title, year, type, youtubeUrl, spotifyUrl, ... }`, bio is `{ text }` and awards is `[{ id, text }]`.

---

## ⚠️ A note on Vercel's filesystem

Vercel's filesystem is **ephemeral** — it resets on every deploy. That's why this module uses **Vercel Postgres** instead of JSON files. Your data lives in the database and persists across all deploys.

If you ever want to migrate off Vercel, the data model is simple standard SQL — easy to export and move to any Postgres host (Railway, Supabase, Neon, etc.).

---

## Admin Panel Features

| Section | What you can do |
|---------|----------------|
| **Shows** | Add, edit, delete shows. Mark as sold out. |
| **Releases** | Add, edit, delete albums & specials. Manage all streaming links. |
| **Bio** | Edit bio text. Add/remove/reorder awards. |

Changes take effect **immediately** — the admin panel revalidates the public site cache after every save.

---

## Security Notes

- Password is stored as an env var — never hardcoded
- Session cookie is `httpOnly`, `SameSite=Lax`, and `Secure` in production
- Admin routes are protected at the layout level (server-side redirect)
- Server actions also verify auth before any DB write
- The `/admin` page is tagged `noindex, nofollow` — won't appear in search results

---

## Troubleshooting

**"Invalid password" on first login**
→ Make sure `ADMIN_PASSWORD` is set in Vercel environment variables and you've redeployed.

**Database errors / "relation does not exist"**
→ Run `https://mikerita.com/api/setup` again.

**Changes not showing on public site**
→ The server actions call `revalidatePath()` for `/`, `/live`, `/releases`, and `/bio`. If your page uses a different path, add it to the relevant action in `lib/actions/`.

**Logout not working**
→ Make sure `NEXT_PUBLIC_SITE_URL` is set to `https://mikerita.com` in Vercel env vars (optional — defaults to localhost in dev).
