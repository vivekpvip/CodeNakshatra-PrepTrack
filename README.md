# PrepTrack - Competitive Exam Progress OS

PrepTrack is a production-grade, AI-integrated full-stack web application built for Indian students preparing for competitive exams (UPSC, JEE, NEET, CAT, GATE). It serves as a centralized "Operating System" to track syllabus progress, analyze mock test scores, and receive AI-powered coaching and daily study targets.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom CSS Variables (Obsidian Dark Theme)
- **Database & Auth**: Supabase (PostgreSQL + RLS + Triggers)
- **AI Integration**: Anthropic Claude 3.5 Sonnet SDK
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Chart.js + React-Chartjs-2

## Setup Instructions

1. **Clone the repository** (or use existing files).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   
   # Optional
   TWILIO_ACCOUNT_SID=
   TWILIO_AUTH_TOKEN=
   TWILIO_PHONE_NUMBER=
   ```
4. **Database Setup**:
   Run the SQL provided in `supabase/schema.sql` in your Supabase SQL Editor. This sets up the schema, RLS policies, and the profile auto-creation trigger.
5. **Run the development server**:
   ```bash
   npm run dev
   ```

## Key Features

- **Dynamic Syllabus Heatmap**: Hierarchical tracking of papers, subjects, and topics.
- **Mock Test Analytics**: Log tests and visualize accuracy over time with Chart.js.
- **Claude AI Coach**: Context-aware chat mentor that knows your progress.
- **Weekly Plan Generation**: AI generates structured 7-day study plans.
- **Gamified Planner**: Daily targets, streaks, and XP points.
- **Premium UI**: Glassmorphism, animated gradients, mesh backgrounds.

## Deployment
When deploying to Vercel, ensure all environment variables are correctly mapped in the Vercel dashboard. Supabase RLS will automatically secure data per user.
