-- =============================================
-- PrepTrack Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- =============================================
-- PROFILES: Extended user data
-- =============================================
create table if not exists profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  full_name     text,
  avatar_url    text,
  exam_type     text default 'upsc',
  exam_date     date,
  phone         text,
  reminder_time text default '07:00',
  reminder_on   boolean default false,
  streak        int default 0,
  longest_streak int default 0,
  xp_points     int default 0,
  created_at    timestamptz default now()
);

-- =============================================
-- TOPIC PROGRESS: Syllabus completion tracking
-- =============================================
create table if not exists topic_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  topic_id    text not null,
  status      text default 'not_started',
  notes       text,
  updated_at  timestamptz default now(),
  unique(user_id, topic_id)
);

-- =============================================
-- DAILY TARGETS: Study planner entries
-- =============================================
create table if not exists daily_targets (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  topic_id     text not null,
  target_date  date default current_date,
  completed    boolean default false,
  completed_at timestamptz,
  created_at   timestamptz default now()
);

-- =============================================
-- TEST RESULTS: Mock exam performance log
-- =============================================
create table if not exists test_results (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  test_name   text not null,
  score       numeric not null,
  total       numeric not null,
  percentage  numeric generated always as (round((score/nullif(total,0))*100, 2)) stored,
  topic_tags  text[],
  difficulty  text default 'medium',
  notes       text,
  taken_at    date default current_date,
  created_at  timestamptz default now()
);

-- =============================================
-- STUDY SESSIONS: Time tracking
-- =============================================
create table if not exists study_sessions (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade,
  topic_id     text,
  duration_min int not null,
  session_date date default current_date,
  created_at   timestamptz default now()
);

-- =============================================
-- AI COACH MESSAGES: Chat history
-- =============================================
create table if not exists coach_messages (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references auth.users(id) on delete cascade,
  role       text not null,
  content    text not null,
  created_at timestamptz default now()
);

-- =============================================
-- INDEXES for performance
-- =============================================
create index if not exists idx_topic_progress_user on topic_progress(user_id);
create index if not exists idx_daily_targets_user on daily_targets(user_id);
create index if not exists idx_daily_targets_date on daily_targets(target_date);
create index if not exists idx_test_results_user on test_results(user_id);
create index if not exists idx_study_sessions_user on study_sessions(user_id);
create index if not exists idx_coach_messages_user on coach_messages(user_id);
