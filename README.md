# MISSION 30 — Become Your Best Self

A personal productivity and life transformation web application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

Designed to guide and track your transformation day by day through an exact timetable, dedicated daily checklists, private diary reflections, English fluency tracking, DSA problem solving, job applications pipeline, fitness routines, and comfort zone challenges.

---

## 🚀 Key Features

### 1. Main Dashboard
- **Live Day Telemetry**: Shows Day X of 30, current date, days remaining, today's completion percentage, total challenge completion, current streak, longest streak, and total completed activities.
- **Dynamic Motivational Anchor**: Daily quotes and wisdom to keep discipline sharp.
- **Today's Mission Checkpoints**: Instant, auto-saving checkboxes with confetti feedback. Tasks are strictly completed only when checked—never by merely visiting a page.

### 2. Exact 6:30 AM – 11:00 PM Timetable (4 Periods, 24 Scheduled Activities)
- **Morning (6:30 AM – 12:00 PM)**: Wake up & water, Running & stretching, Shower & morning skincare, Healthy breakfast, Day planning, Technical skills learning, Break, DSA practice.
- **Afternoon (12:00 PM – 5:00 PM)**: English speaking practice, Lunch & rest, Abroad job applications, Local job applications, Snack & relaxation.
- **Evening (5:00 PM – 8:00 PM)**: English speaking & Duolingo, Uncomfortable challenge, Practical coding & projects, Dinner.
- **Night (8:00 PM – 11:00 PM)**: DSA revision, Mindset development & reading, Family & relaxation, Technical revision / job follow-ups, Night skincare, Daily diary writing, Wind down for sleep.
- Includes category tags (`fitness`, `learning`, `career`, `wellness`, `mindset`, `routine`), duration, and expandable personal notes per task.

### 3. Dedicated 30-Day Calendar & Daily Inspector
- **Strict Data Isolation**: Day 1, Day 2, ... Day 30+ have completely isolated checklists, diary entries, English records, and health stats. No data is ever mixed or overwritten.
- **Dynamically Calculated Dates**: Formatted in your configured timezone (`Asia/Kolkata` default).
- **Future Day Protection**: Future days display planned timetables for preview but cannot be completed in advance.
- **Past Day Editing**: Review and edit previous days at any time with update timestamps.

### 4. English Speaking & Fluency Tracker
- **Daily Target**: 120 minutes (2 hours).
- **Breakdown**: Speaking minutes, Listening minutes, Pronunciation / shadowing minutes.
- **Duolingo Status**: Streak tracking toggle.
- **Vocabulary Vault**: Add and manage new words and idioms with one-click tags.
- **Vocal Confidence Slider**: 1 to 10 rating.
- **Mistakes & Insights**: Detailed text log for phonetics, hesitations, and corrections.
- **Total Challenge Hours**: Cumulative calculation across all active days.

### 5. DSA & Technical Skills Tracker
- **Algorithmic Logger**: Track problem name, topic (Sliding Window, Trees, Graphs, DP), platform (LeetCode, GFG, CodeChef, Codeforces, HackerRank), difficulty (Easy, Medium, Hard), status (Attempted vs Solved), URL, time spent, and complexity notes.
- **Technical Skills**: Track topics, resources/courses, concepts covered, projects built, and GitHub links.
- **Real Metrics**: Counts problems solved by difficulty, hours invested, and repositories committed.

### 6. Job Applications Pipeline
- **Dual Pipeline**: Separate tabs for **ABROAD JOBS** and **LOCAL JOBS**.
- **Fields**: Company, Job Title, Target Country, City/Remote, Applied Date, Follow-up Date, Resume Version, Application Link, Status (`Saved`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, `Withdrawn`), and Recruiter Notes.
- **Pipeline Statistics**: Applications today, this week, total count, active interviews, offers, and search/status filtering.

### 7. Health, Fitness & Skincare
- **Running & Cardio**: Duration, distance in km, walking minutes, stretching checkbox, and energy notes.
- **Nutrition & Hydration**: Interactive water glass/liter counter (`+` and `-` buttons), healthy breakfast/lunch/dinner checkboxes, fruit & vegetable intake, and meal notes.
- **Skincare Discipline**: Morning routine, Sunscreen applied (SPF 50+), and Night routine checkboxes with notes.

### 8. Daily Uncomfortable Challenge (5–10 Minutes)
- **Built-in 30 Challenges Catalog**: Safe, realistic, legal, and respectful exercises (e.g. recording English speeches, public networking, camera practice, cold showers, asking for constructive feedback).
- **Tracking**: Mark completed or skipped, difficulty rating (1–5), confidence before and after sliders (1–10), action taken, and lessons learned.
- **Custom Mode**: Replace any challenge with your own custom assignment.

### 9. Private Daily Diary
- **10 Guided Reflection Prompts**:
  1. What did I accomplish today?
  2. What did I learn today?
  3. What made me happy?
  4. What was difficult?
  5. What uncomfortable thing did I do?
  6. How did I improve my English?
  7. What mistakes should I avoid?
  8. What am I grateful for?
  9. What will I improve tomorrow?
  10. My personal thoughts.
- **Free-Writing Section**: Unfiltered stream of consciousness journal.
- **Mood & Energy**: 5 mood states (`Terrific`, `Good`, `Neutral`, `Tired`, `Rough`) + 1–10 energy level.
- **Export**: Download any day's diary as a `.txt` or `.json` file.
- **Searchable**: Search past entries by keywords across all prompts.

### 10. Progress Analytics (Recharts)
- **Daily Completion Trend**: Area chart showing % completed over time.
- **Weekly Completion Comparison**: Bar chart comparing 7-day performance averages.
- **English Hours Trend**: Bar chart of daily practice hours against the 2-hour target.
- **DSA Difficulty Breakdown**: Solved problems categorized by Easy, Medium, and Hard.
- **Job Pipeline Distribution**: Donut chart of application statuses.
- **Transparent Habit Ratios**: Real adherence percentage calculated as `Completed Days / Elapsed Days`.

### 11. Weekly Reviews & Audits
- Automatically groups the challenge into weekly review periods (Week 1, Week 2, Week 3, Week 4, etc.).
- Summarizes completed vs missed reps, strongest habit, most missed habit, total learning hours, English hours, and running days.
- Weekly reflection form and non-negotiables battle plan for the upcoming week.

### 12. Extend the Challenge (Zero Data Loss Guarantee)
- Start with 30 days. When you finish (or early via Settings), extend to **60 days**, **90 days**, **180 days**, **365 days**, or enter a custom number.
- **Guaranteed Zero Data Loss**: Extending preserves 100% of previous daily records, diaries, job applications, DSA problems, and streak counters.
- Visual milestone path: Day 7, 15, 30, 60, 90, 180, and 365.

### 13. Data Safety, Cloud Sync & Backups
- **Persistent Local Storage (Demo Mode)**: Works out of the box with zero external setup. All data survives page refreshes and browser restarts.
- **One-Click JSON Export & Import**: Create complete backups of your entire challenge at any time.
- **Supabase Cloud Database Ready**: Includes full PostgreSQL schema file (`supabase/schema.sql`) with Row Level Security (RLS) policies.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom glassmorphism
- **Icons**: Lucide React
- **Visual Analytics**: Recharts
- **Celebration Effects**: Canvas Confetti
- **Storage / Database**: Browser LocalStorage engine with automatic migration + Supabase PostgreSQL client integration

---

## 💻 Running Locally

### 1. Prerequisites
- Node.js 18+ (tested with Node.js v24)
- npm or pnpm

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Supabase Cloud Database Setup (Optional)

MISSION 30 operates with persistent local browser storage by default. To connect to Supabase:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/schema.sql` from this repository, paste the contents, and click **Run**. This creates:
   - `challenges`
   - `activity_templates`
   - `daily_records`
   - `daily_activity_logs`
   - `english_sessions`
   - `dsa_problems`
   - `technical_learnings`
   - `job_applications`
   - `health_records`
   - `comfort_challenges`
   - `diary_entries`
   - `weekly_reviews`
   - Complete Row Level Security (RLS) policies so users can only access their own records.
4. Copy your project URL and public Anon Key from **Project Settings -> API**.
5. Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Restart the Next.js development server. The header badge will change from "Local Demo Storage" to "Supabase Cloud".
