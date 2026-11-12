# Gratitude Wall — Product Requirements Document

**Working name:** Gratitude Wall · **Owner:** Nathaniel · **Date:** November 2026 · **Status:** Draft v1

> **One-line pitch:** A digital gratitude wall for believers: pin your wins as they happen, and look back year after year at everything God has done.

---

## 1. Problem

Busy people forget how far they've come and what God has done for them, so they feel stuck instead of grateful.

Wins and answered prayers happen in the middle of busy days. They're celebrated for a moment, then forgotten. When life feels slow, there's no record to look back on — so people measure themselves by what's missing instead of what's been given.

## 2. Who it's for

**Primary:** Busy believers, roughly 22–40, who want to remember their wins and God's faithfulness, so they stay grateful instead of feeling stuck.

| User | What they need |
| --- | --- |
| Working professional | A quick way to capture wins between meetings and look back during hard seasons |
| Founder, freelancer or creative | Proof of progress when the work never feels "finished" |
| Student or early-career believer | A record of answered prayers through exams, moves and new jobs |
| Faithful journaler | A simpler, more visual alternative to a paper journal they never keep up with |

## 3. The product

A digital gratitude wall where believers write down and pin what they've achieved and what God has done, the moment it happens. Every entry is kept year after year, so whenever life feels slow, they can look back, see the full story of their growth, and be grateful.

## 4. Goals and non-goals

**Goals (v1)**
- Capture a win in under 10 seconds.
- Make the wall feel personal, warm and worth revisiting.
- Keep every entry safe and available year after year.
- Bring past wins back at the right moment ("On this day", yearly recap).

**Non-goals (v1)**
- Public social feed, likes or follower counts.
- Church or group walls (planned for v2).
- Bible reading plans or full devotional content.
- Native mobile apps (v1 is a mobile-first web app / PWA).

## 5. User stories

1. As a believer, I want to **add a win instantly**, so I don't forget it by the end of the day.
2. As a believer, I want to **pin my most meaningful wins** to the top of my wall, so they're always in view.
3. As a believer, I want to **attach a scripture, photo or note**, so I remember the full story behind each win.
4. As a believer, I want to **see my wins by year**, so I can look back on how far I've come.
5. As a believer, I want to **be reminded of past wins** on hard days, so I stay grateful instead of feeling stuck.
6. As a believer, I want my wall to be **private by default**, so I can write honestly.
7. As a believer, I want to **share a single win as a testimony** with family or friends when I choose to.

## 6. Core features (v1)

| # | Feature | Description |
| --- | --- | --- |
| 1 | **Quick add** | One tap opens a short form: what happened, optional category, date (defaults to today). Save in under 10 seconds. |
| 2 | **The wall** | A visual board of entries as cards, newest first, with pinned entries at the top. |
| 3 | **Pin** | Pin and unpin entries to keep the most meaningful wins in view. |
| 4 | **Categories** | Faith, Work, Family, Health, Finances, Studies, Answered Prayer — plus custom ones. |
| 5 | **Rich entries** | Optional scripture reference, photo and longer reflection on any entry. |
| 6 | **Year view** | Browse the wall year by year and month by month as a timeline. |
| 7 | **On this day** | Shows wins from the same date in past years. |
| 8 | **Year in gratitude** | An end-of-year recap: number of wins, top categories, favourite pinned moments. |
| 9 | **Gentle reminders** | Optional daily or weekly nudge: "What has God done for you this week?" |
| 10 | **Search and filter** | Find entries by keyword, category or year. |
| 11 | **Share a testimony** | Turn one entry into a beautiful shareable image or private link. |
| 12 | **Export** | Download all entries as PDF or CSV, so records are never locked in. |

## 7. User flow

1. **Sign up** with email magic link or Google — no passwords.
2. **Onboarding (3 screens):** why gratitude matters, choose reminder time, add your first win.
3. **Home = the wall.** A floating **+ Add a win** button is always visible.
4. **Add a win** → card appears on the wall instantly with a soft animation.
5. **Revisit** through Year view, On this day, or search.
6. **Year end** → receive the Year in gratitude recap.

## 8. Design principles

- **Calm and warm:** soft colours, generous spacing, no noisy metrics or streak pressure.
- **Fast to capture:** adding a win must never feel like a chore.
- **Personal, not public:** private by default; sharing is always a deliberate choice.
- **Built to last:** entries feel like a keepsake, not a to-do list.
- **Accessible:** readable type, high contrast, keyboard and screen-reader friendly.

## 9. Data model (simplified)

| Entity | Key fields |
| --- | --- |
| User | id, name, email, timezone, reminder_time, created_at |
| Entry | id, user_id, title, reflection, category_id, scripture_ref, photo_url, is_pinned, entry_date, created_at |
| Category | id, user_id (null for defaults), name, colour |
| Share | id, entry_id, public_slug, created_at, revoked_at |

## 10. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Speed | Wall loads in under 2 seconds on mobile; adding a win saves instantly with offline support |
| Privacy | Entries private by default; encrypted at rest; row-level security so users only see their own data |
| Reliability | Daily backups; no entry ever lost |
| Platforms | Mobile-first responsive web app, installable as a PWA |
| Accessibility | WCAG 2.2 AA |

## 11. Suggested stack

- **Frontend:** Next.js + React + TypeScript, Tailwind CSS
- **Backend, auth, storage:** Supabase (magic link + Google, Postgres with row-level security, photo storage)
- **Reminders:** email first, then web push notifications
- **Share images:** server-side image generation (e.g. @vercel/og)
- **Hosting:** Vercel

## 12. Success metrics (first 90 days)

| Metric | Target |
| --- | --- |
| Users who add a 2nd win within 7 days | 50% or more |
| Weekly active users adding at least one win | 35% or more |
| Average wins per active user per month | 6 or more |
| Users who revisit an old entry (On this day / Year view) | 40% or more monthly |
| Shared testimonies per month | Track as a growth signal |

*Targets are starting guesses to revisit after launch.*

## 13. Business model (later)

- **Free:** unlimited text entries, the wall, pins, year view.
- **Premium (monthly/yearly):** photos, Year in gratitude recap, custom themes, PDF keepsake export.
- **Future:** church and small-group plans with shared testimony walls.

## 14. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Users forget to come back | Gentle reminders, On this day, and yearly recap |
| Feels like a chore | Under-10-second quick add; no streak pressure |
| Privacy concerns about personal faith content | Private by default, clear privacy copy, easy export and delete |
| Low differentiation from journaling apps | Visual wall, faith-first language, testimony sharing |

## 15. Milestones

1. **Design:** wireframes and visual design for wall, quick add, year view, onboarding.
2. **Build MVP:** auth, quick add, wall, pin, categories, year view, search.
3. **Retention features:** On this day, reminders, share a testimony, export.
4. **Beta:** 50 users from church and creator communities; collect feedback.
5. **Launch:** public launch; plan Premium and group walls from usage data.

## 16. Open questions

- [ ] Final product name and domain
- [ ] Should entries support voice notes in v1?
- [ ] Which Bible translation(s) to support for scripture references?
- [ ] Free vs Premium split for photos
- [ ] When to introduce church/group walls
