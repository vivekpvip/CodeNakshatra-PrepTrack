-- =============================================
-- Row Level Security Policies
-- Run this after schema.sql
-- =============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table topic_progress enable row level security;
alter table daily_targets enable row level security;
alter table test_results enable row level security;
alter table study_sessions enable row level security;
alter table coach_messages enable row level security;

-- Profiles: users can only access their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Topic Progress
create policy "Users can manage own topic progress"
  on topic_progress for all using (auth.uid() = user_id);

-- Daily Targets
create policy "Users can manage own daily targets"
  on daily_targets for all using (auth.uid() = user_id);

-- Test Results
create policy "Users can manage own test results"
  on test_results for all using (auth.uid() = user_id);

-- Study Sessions
create policy "Users can manage own study sessions"
  on study_sessions for all using (auth.uid() = user_id);

-- Coach Messages
create policy "Users can manage own coach messages"
  on coach_messages for all using (auth.uid() = user_id);

-- =============================================
-- Auto-create profile on signup
-- =============================================
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if exists, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
