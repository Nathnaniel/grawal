# Gratitude Wall

A digital gratitude wall for believers: pin your wins as they happen, and look back year after year at everything God has done.

The product brief is in [Gratitude-Wall-PRD.md](Gratitude-Wall-PRD.md). The name is a working title and is set in `lib/site.ts`.

## Run it

```bash
npm install
npm run dev
```

The app runs on http://localhost:3002. Without Supabase keys, every page leads to the sign-in screen, which links to **http://localhost:3002/preview**: the real screens with sample wins, kept in memory until you reload. `/preview` returns 404 in production.

| Command | What it does |
| --- | --- |
| `npm test` | Applies the migrations to Postgres (PGlite) and checks privacy rules, plus dates, saving, search and colour contrast |
| `npm run typecheck` | Checks types |
| `npm run build` | Production build |

## Connect Supabase

1. Create a project at supabase.com.
2. Apply every file in `supabase/migrations/`, in order. Either paste them into the SQL editor, or use `supabase link` and then `supabase db push`.
3. Copy `.env.example` to `.env.local` and fill in the project URL and publishable key.
4. In **Authentication > URL Configuration**, set the site URL and add `http://localhost:3002/auth/callback` plus the same path on your live domain to the redirect URLs.
5. For Google sign-in, create an OAuth client in Google Cloud and add its ID and secret under **Authentication > Providers > Google**.
6. Replace `lib/database.types.ts` with the output of `supabase gen types typescript`.

Before the beta:
- **Email:** Supabase's built-in sender is heavily rate limited, so set up custom SMTP.
- **Magic links across devices:** the default link must be opened in the browser that asked for it. To allow any device, point the email template at `/auth/confirm?token_hash={{ .TokenHash }}&type=email`.
- **Backups:** the PRD requires daily backups, so confirm the plan you choose includes them.

## How it's built

- **Next.js 16, React 19, Tailwind 4, TypeScript.** Colours and fonts are tokens at the top of `app/globals.css`.
- **The wall is a desktop:** history on the left (`WinHistory`), pinned wins as keepsake objects in the middle (`PinnedWins`, `Keepsake`), widgets on the right (`Widgets`) and a dock below (`AppShell`). Below 1024px it stacks into one scrolling page. Pinning moves a win from the history onto the desktop.
- **`public/sky.jpg`** is an original generated image, so there's nothing to license.
- **Reads** happen on the server in `lib/queries.ts`.
- **Writes** go from the browser through `lib/store.ts`, protected by row-level security.
- **Saving a win:** the card appears at once and the save goes into a device-side queue (`lib/outbox.ts`). If the connection fails, it retries on reconnect. Ids are made in the browser, so a retry can't create a duplicate.
- **Dates:** `entry_date` is a plain calendar day, handled as text in `lib/dates.ts` so it never shifts across timezones.

## Changes from the PRD data model

| PRD | Here | Why |
| --- | --- | --- |
| `User` | `profiles`, linked to Supabase's `auth.users` | Supabase owns sign-in. Email stays there rather than being copied |
| none | `reminder_frequency`, `onboarded_at` | The PRD offers daily or weekly, and onboarding needs a finished flag |
| `photo_url` | `photo_path` | Photos are private and served by signed URLs, so a fixed public URL would break "private by default" |
| none | `updated_at`, `search_text` on entries | Sync and partial-word search |

## What works and what's next

**Working:** sign-in, onboarding, quick add, the wall, pin, edit, delete, default and custom categories, scripture and reflection, year view, search and filter, settings, and the On this day and year summary widgets.

**Placeholder pages, not linked from the menu yet:** `/on-this-day` (the wall's widget works; this full page doesn't yet), `/recap/[year]`, `/settings/export`.

**Not built yet:**
- **Sharing.** `/t/[slug]` returns 404 and there's no signed-out read of any entry. The `shares` table and its owner rules exist.
- **Reminders.** The choice is saved, but nothing is sent.
- **Photo upload.** The private bucket and `photo_path` exist, with no upload screen.
- **Full offline.** There's a web manifest but no service worker. A dropped connection is handled while the app is open, but the app can't open cold without a network.
- **PNG app icons** for iOS home screens. Only an SVG icon ships so far.
- **Account deletion and export,** which the PRD lists as privacy mitigations.
- **Voice notes,** an open question in the PRD.
