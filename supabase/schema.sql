-- MISSION 30: Complete Supabase PostgreSQL Schema & Security Policies
-- Run this script in the Supabase SQL Editor to set up cloud persistence.

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Challenges Table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_name TEXT NOT NULL DEFAULT 'MISSION 30 — Become Your Best Self',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_days INT NOT NULL DEFAULT 30,
  wake_up_time TIME NOT NULL DEFAULT '06:30',
  bed_time TIME NOT NULL DEFAULT '23:00',
  english_target_minutes INT NOT NULL DEFAULT 120,
  water_target_glasses INT NOT NULL DEFAULT 10,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  theme TEXT NOT NULL DEFAULT 'dark',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activity Templates Table (Customizable Timetable)
CREATE TABLE IF NOT EXISTS activity_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  time_range TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('fitness', 'learning', 'career', 'wellness', 'mindset', 'routine')),
  period TEXT NOT NULL CHECK (period IN ('morning', 'afternoon', 'evening', 'night')),
  duration_minutes INT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Daily Records Table
CREATE TABLE IF NOT EXISTS daily_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  record_date DATE NOT NULL,
  completed_percentage INT DEFAULT 0,
  last_edited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (challenge_id, day_number)
);

-- 5. Daily Activity Logs (Individual Checkboxes)
CREATE TABLE IF NOT EXISTS daily_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE,
  activity_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (daily_record_id, activity_id)
);

-- 6. English Practice Sessions
CREATE TABLE IF NOT EXISTS english_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE UNIQUE,
  speaking_minutes INT DEFAULT 0,
  listening_minutes INT DEFAULT 0,
  pronunciation_minutes INT DEFAULT 0,
  duolingo_completed BOOLEAN DEFAULT FALSE,
  vocabulary TEXT[] DEFAULT '{}',
  confidence_score INT CHECK (confidence_score BETWEEN 1 AND 10) DEFAULT 5,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DSA Problems Solved
CREATE TABLE IF NOT EXISTS dsa_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  topic TEXT NOT NULL,
  problem_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  status TEXT NOT NULL CHECK (status IN ('Attempted', 'Solved')),
  problem_url TEXT,
  time_spent_minutes INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Technical Learning Records
CREATE TABLE IF NOT EXISTS technical_learnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  topic TEXT NOT NULL,
  course_or_resource TEXT,
  duration_minutes INT DEFAULT 0,
  concepts_covered TEXT[] DEFAULT '{}',
  project_worked_on TEXT,
  github_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('abroad', 'local')),
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  url TEXT,
  resume_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn')),
  notes TEXT,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Health & Fitness Records
CREATE TABLE IF NOT EXISTS health_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE UNIQUE,
  running_minutes INT DEFAULT 0,
  running_distance_km NUMERIC(5,2) DEFAULT 0,
  walking_minutes INT DEFAULT 0,
  stretching_done BOOLEAN DEFAULT FALSE,
  running_notes TEXT,
  breakfast_done BOOLEAN DEFAULT FALSE,
  lunch_done BOOLEAN DEFAULT FALSE,
  dinner_done BOOLEAN DEFAULT FALSE,
  water_glasses INT DEFAULT 0,
  fruit_veg_intake BOOLEAN DEFAULT FALSE,
  nutrition_notes TEXT,
  morning_skincare BOOLEAN DEFAULT FALSE,
  sunscreen_applied BOOLEAN DEFAULT FALSE,
  night_skincare BOOLEAN DEFAULT FALSE,
  skincare_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Daily Uncomfortable Challenges
CREATE TABLE IF NOT EXISTS comfort_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE UNIQUE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  skipped BOOLEAN DEFAULT FALSE,
  difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5) DEFAULT 3,
  what_i_did TEXT,
  what_i_learned TEXT,
  confidence_before INT CHECK (confidence_before BETWEEN 1 AND 10) DEFAULT 5,
  confidence_after INT CHECK (confidence_after BETWEEN 1 AND 10) DEFAULT 6,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Daily Diary Entries (Private)
CREATE TABLE IF NOT EXISTS diary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_record_id UUID REFERENCES daily_records(id) ON DELETE CASCADE UNIQUE,
  day_number INT NOT NULL,
  entry_date DATE NOT NULL,
  mood TEXT CHECK (mood IN ('terrific', 'good', 'neutral', 'tired', 'rough')),
  energy_score INT CHECK (energy_score BETWEEN 1 AND 10) DEFAULT 7,
  q1_accomplished TEXT,
  q2_learned TEXT,
  q3_happy TEXT,
  q4_difficult TEXT,
  q5_uncomfortable TEXT,
  q6_english_improvement TEXT,
  q7_mistakes_to_avoid TEXT,
  q8_grateful_for TEXT,
  q9_improve_tomorrow TEXT,
  q10_personal_thoughts TEXT,
  free_writing TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Weekly Reviews
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  completed_activities_count INT DEFAULT 0,
  missed_activities_count INT DEFAULT 0,
  strongest_habit TEXT,
  most_missed_habit TEXT,
  total_learning_hours NUMERIC(6,2) DEFAULT 0,
  english_hours NUMERIC(6,2) DEFAULT 0,
  dsa_solved_count INT DEFAULT 0,
  job_applications_count INT DEFAULT 0,
  running_days INT DEFAULT 0,
  reflection_notes TEXT,
  next_week_plan TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (challenge_id, week_number)
);

-- 14. ROW LEVEL SECURITY (RLS)
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dsa_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE comfort_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

-- 15. Policies: Only owner can SELECT, INSERT, UPDATE, DELETE their data
CREATE POLICY "Users own challenges" ON challenges FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own dsa_problems" ON dsa_problems FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own technical_learnings" ON technical_learnings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own job_applications" ON job_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own diary_entries" ON diary_entries FOR ALL USING (auth.uid() = user_id);
