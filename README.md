# PrepTrack — Competitive Exam Progress OS

PrepTrack is a production-grade, AI-integrated, full-stack web application for Indian students preparing for competitive exams (UPSC, JEE, NEET, CAT, GATE). It serves as a centralized "Operating System" to track syllabus progress, analyze mock-test scores, and receive AI-powered coaching, daily plans, and SMS reminders.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS v4 + custom CSS variables (obsidian dark theme)
- **Database & Auth**: Supabase (Postgres + RLS + triggers + realtime)
- **AI**: Anthropic Claude (Sonnet 4)
- **SMS**: Twilio
- **Email**: Resend
- **Animations**: Framer Motion
- **Charts**: Chart.js + react-chartjs-2
- **Command palette**: cmdk
- **Icons**: lucide-react

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — from your Supabase project's API settings.
   - `ANTHROPIC_API_KEY` — from console.anthropic.com.
   - `NEXT_PUBLIC_APP_URL` — `http://localhost:3000` for local dev.
   - Optional: `TWILIO_*` (SMS reminders) and `RESEND_API_KEY` + `RESEND_FROM_EMAIL` + `RESEND_TO_ADMIN_EMAIL` (transactional emails + contact form).

3. **Database**
   - Open Supabase SQL Editor.
   - Run the entire contents of `supabase/schema.sql` once. (`rls-policies.sql` is now obsolete — schema.sql contains everything.)
   - Add Google OAuth: Supabase → Auth → Providers → Google → enable + paste client ID/secret.
   - Set Site URL: Supabase → Auth → URL Configuration → set to `http://localhost:3000` for dev (and your prod URL for production), and add `http://localhost:3000/auth/callback` to redirect URLs.

4. **Run dev server**
   ```bash
   npm run dev
   ```

## Architecture notes

- **Auth**: cookie-based session via `@supabase/ssr`. The `proxy.js` (Next 16 replacement for `middleware.js`) refreshes the session on every request, gates protected routes, and bounces signed-in users away from auth pages. OAuth lands on `/auth/callback`, which exchanges the PKCE code for a session.
- **API routes** (`app/api/*`) all use `createServerSupabaseClient()` so `auth.getUser()` returns the real user.
- **Realtime profile**: `useUser` subscribes to `postgres_changes` on the `profiles` row so XP / streak updates reflect instantly across the UI (powers the level-up modal).
- **XP & levels**: `lib/xp.js` centralizes reward amounts (5 / 10 / 15 / 20 XP) and tier thresholds (Aspirant → Scholar → Expert → Champion). The `LevelUpListener` mounted in the dashboard layout fires confetti + a celebration modal when the user crosses a threshold.
- **Command palette**: ⌘K / Ctrl+K opens a Linear-style palette. Searches pages, quick actions, and topics in your exam syllabus.
- **Pomodoro**: floating bottom-right widget; completed 25-minute sessions auto-log to `study_sessions` and feed the activity heatmap + streak.
- **PWA**: `public/manifest.json` + `public/sw.js`. The service worker is registered only in production builds.

## Pages

- Marketing: `/`, `/about`, `/features`, `/pricing`, `/contact`
- Auth: `/login`, `/signup`, `/reset-password`, `/auth/callback`
- App: `/dashboard`, `/syllabus`, `/planner`, `/tests`, `/analytics`, `/coach`, `/resources`, `/leaderboard`, `/settings`

## API routes

- `POST /api/coach` — streaming Claude chat (cookie-authed)
- `POST /api/weekly-plan` — structured 7-day study plan
- `POST /api/syllabus`, `GET /api/syllabus`, `DELETE /api/syllabus` — topic-progress CRUD
- `POST /api/reminder` — sends today's targets via Twilio
- `POST /api/send-email` — Resend templates: `welcome`, `weekly-digest`, `contact-form`

## Deployment

1. Push to GitHub
2. Import repo to Vercel (auto-detects Next.js)
3. Add the same `.env.local` variables in Vercel → Settings → Environment Variables
4. Update Supabase Auth → URL Configuration with your Vercel production URL + `/auth/callback`
5. Optional: connect a custom domain
