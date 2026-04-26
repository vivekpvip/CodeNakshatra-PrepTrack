-- =============================================
-- PrepTrack — Single-file Database Schema
-- Run this entire file in the Supabase SQL Editor
-- (creates tables + indexes + RLS + auto-profile trigger).
-- Safe to re-run; uses IF NOT EXISTS / DROP IF EXISTS where applicable.
-- =============================================

-- =====================
-- 1. PROFILES
-- =====================
create table if not exists profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  full_name       text,
  avatar_url      text,
  exam_type       text default 'upsc',
  exam_date       date,
  phone           text,
  reminder_time   text default '07:00',
  reminder_on     boolean default false,
  streak          int default 0,
  longest_streak  int default 0,
  xp_points       int default 0,
  invite_code     text unique,
  created_at      timestamptz default now()
);

-- Backfill invite_code on existing rows (random short slug)
update profiles set invite_code = lower(substr(md5(random()::text), 1, 8)) where invite_code is null;

-- Default for new rows going forward (handled in trigger too, but harmless)
alter table profiles alter column invite_code set default lower(substr(md5(random()::text), 1, 8));

-- =====================
-- 2. TOPIC PROGRESS
-- =====================
create table if not exists topic_progress (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  topic_id    text not null,
  status      text default 'not_started',
  notes       text,
  updated_at  timestamptz default now(),
  unique(user_id, topic_id)
);

-- =====================
-- 3. DAILY TARGETS
-- =====================
create table if not exists daily_targets (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  topic_id      text not null,
  target_date   date default current_date,
  completed     boolean default false,
  completed_at  timestamptz,
  created_at    timestamptz default now()
);

-- =====================
-- 4. TEST RESULTS
-- =====================
create table if not exists test_results (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  test_name   text not null,
  score       numeric not null,
  total       numeric not null,
  percentage  numeric generated always as (round((score / nullif(total, 0)) * 100, 2)) stored,
  topic_tags  text[],
  difficulty  text default 'medium',
  notes       text,
  taken_at    date default current_date,
  created_at  timestamptz default now()
);

-- =====================
-- 5. STUDY SESSIONS
-- =====================
create table if not exists study_sessions (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references auth.users(id) on delete cascade,
  topic_id      text,
  duration_min  int not null,
  session_date  date default current_date,
  created_at    timestamptz default now()
);

-- =====================
-- 6. COACH MESSAGES
-- =====================
create table if not exists coach_messages (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  role        text not null,
  content     text not null,
  created_at  timestamptz default now()
);

-- =====================
-- 7. BOOKMARKS  (resources page)
-- =====================
create table if not exists bookmarks (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  title       text not null,
  url         text not null,
  type        text default 'web',     -- web | youtube | pdf | book
  topic_tags  text[],
  notes       text,
  created_at  timestamptz default now()
);

-- =====================
-- 8. FRIENDS  (leaderboard)
-- =====================
create table if not exists friends (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade,
  friend_id   uuid references auth.users(id) on delete cascade,
  created_at  timestamptz default now(),
  unique(user_id, friend_id),
  check (user_id <> friend_id)
);

-- =====================
-- INDEXES
-- =====================
create index if not exists idx_topic_progress_user  on topic_progress(user_id);
create index if not exists idx_daily_targets_user   on daily_targets(user_id);
create index if not exists idx_daily_targets_date   on daily_targets(target_date);
create index if not exists idx_test_results_user    on test_results(user_id);
create index if not exists idx_study_sessions_user  on study_sessions(user_id);
create index if not exists idx_coach_messages_user  on coach_messages(user_id);
create index if not exists idx_bookmarks_user       on bookmarks(user_id);
create index if not exists idx_friends_user         on friends(user_id);
create index if not exists idx_friends_friend       on friends(friend_id);
create index if not exists idx_profiles_invite      on profiles(invite_code);

-- =====================
-- ROW LEVEL SECURITY
-- =====================
alter table profiles        enable row level security;
alter table topic_progress  enable row level security;
alter table daily_targets   enable row level security;
alter table test_results    enable row level security;
alter table study_sessions  enable row level security;
alter table coach_messages  enable row level security;
alter table bookmarks       enable row level security;
alter table friends         enable row level security;

-- Drop any prior versions of the policies so this script is rerunnable
drop policy if exists "own_profile_select"      on profiles;
drop policy if exists "own_profile_update"      on profiles;
drop policy if exists "own_profile_insert"      on profiles;
drop policy if exists "leaderboard_friends_read" on profiles;
drop policy if exists "own_topic_progress"      on topic_progress;
drop policy if exists "own_daily_targets"       on daily_targets;
drop policy if exists "own_test_results"        on test_results;
drop policy if exists "own_study_sessions"      on study_sessions;
drop policy if exists "own_coach_messages"      on coach_messages;
drop policy if exists "own_bookmarks"           on bookmarks;
drop policy if exists "own_friends"             on friends;

-- Profiles: users see/edit only their own row...
create policy "own_profile_select" on profiles
  for select using (auth.uid() = id);
create policy "own_profile_update" on profiles
  for update using (auth.uid() = id);
create policy "own_profile_insert" on profiles
  for insert with check (auth.uid() = id);

-- ...except users can also read profiles of confirmed friends (for leaderboard).
create policy "leaderboard_friends_read" on profiles
  for select using (
    exists (
      select 1 from friends
      where friends.user_id = auth.uid()
        and friends.friend_id = profiles.id
    )
  );

create policy "own_topic_progress" on topic_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_daily_targets" on daily_targets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_test_results" on test_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_study_sessions" on study_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_coach_messages" on coach_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_bookmarks" on bookmarks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own_friends" on friends
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =====================
-- AUTO-CREATE PROFILE ON SIGNUP
-- Reads OAuth provider metadata (full_name / avatar_url / picture)
-- =====================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url, invite_code)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    lower(substr(md5(random()::text), 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =====================
-- REALTIME — push profile updates to the browser so XP/streak/level changes
-- show up instantly. Skipped silently if the table is already published.
-- =====================
do $$
begin
  alter publication supabase_realtime add table profiles;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
