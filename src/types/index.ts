export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type HabitCategory =
  | "fitness"
  | "learning"
  | "career"
  | "wellness"
  | "mindset"
  | "routine";

export interface ActivityTemplate {
  id: string;
  timeRange: string; // e.g. "6:30–6:45 AM"
  activity: string;
  category: HabitCategory;
  period: TimeOfDay;
  durationMinutes: number;
  description?: string;
}

export interface DayActivityRecord {
  activityId: string;
  completed: boolean;
  completedAt?: string;
  actualDurationMinutes?: number;
  notes?: string;
}

export interface EnglishSession {
  id: string;
  timestamp: string;
  speakingMinutes: number;
  listeningMinutes: number;
  pronunciationMinutes: number;
  duolingoCompleted: boolean;
  vocabulary: string[];
  confidenceScore: number; // 1-10
  notes: string;
}

export interface DsaProblem {
  id: string;
  date: string;
  topic: string;
  problemName: string;
  platform: "LeetCode" | "GeeksforGeeks" | "CodeChef" | "Codeforces" | "HackerRank" | "Other";
  difficulty: "Easy" | "Medium" | "Hard";
  status: "Attempted" | "Solved";
  problemUrl?: string;
  timeSpentMinutes: number;
  notes?: string;
}

export interface TechLearningRecord {
  id: string;
  date: string;
  topic: string;
  courseOrResource: string;
  durationMinutes: number;
  conceptsCovered: string[];
  projectWorkedOn?: string;
  githubUrl?: string;
  notes?: string;
}

export type JobCategory = "abroad" | "local";
export type JobStatus =
  | "Saved"
  | "Applied"
  | "Assessment"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export interface JobApplication {
  id: string;
  category: JobCategory;
  company: string;
  title: string;
  country: string;
  city: string;
  appliedDate: string;
  url?: string;
  resumeVersion: string;
  status: JobStatus;
  notes?: string;
  followUpDate?: string;
}

export interface HealthRecord {
  runningMinutes: number;
  runningDistanceKm?: number;
  walkingMinutes: number;
  stretchingDone: boolean;
  runningNotes?: string;
  breakfastDone: boolean;
  lunchDone: boolean;
  dinnerDone: boolean;
  waterGlasses: number; // 250ml per glass
  fruitVegIntake: boolean;
  nutritionNotes?: string;
  morningSkincare: boolean;
  sunscreenApplied: boolean;
  nightSkincare: boolean;
  skincareNotes?: string;
}

export interface ComfortChallengeRecord {
  challengeId?: string;
  title: string;
  completed: boolean;
  skipped: boolean;
  difficultyRating: number; // 1-5
  whatIDid: string;
  whatILearned: string;
  confidenceBefore: number; // 1-10
  confidenceAfter: number; // 1-10
}

export interface DiaryEntry {
  dayNumber: number;
  date: string;
  mood: "terrific" | "good" | "neutral" | "tired" | "rough";
  energyScore: number; // 1-10
  q1_accomplished: string;
  q2_learned: string;
  q3_happy: string;
  q4_difficult: string;
  q5_uncomfortable: string;
  q6_englishImprovement: string;
  q7_mistakesToAvoid: string;
  q8_gratefulFor: string;
  q9_improveTomorrow: string;
  q10_personalThoughts: string;
  freeWriting: string;
  updatedAt: string;
}

export interface DayRecord {
  dayNumber: number;
  dateStr: string; // YYYY-MM-DD
  activities: Record<string, DayActivityRecord>; // activityId -> record
  english: EnglishSession;
  health: HealthRecord;
  comfortChallenge: ComfortChallengeRecord;
  diary?: DiaryEntry;
  lastEditedAt?: string;
  editHistory?: { timestamp: string; summary: string }[];
}

export interface ChallengeSettings {
  challengeName: string;
  startDate: string; // YYYY-MM-DD
  totalDays: number; // 30, 60, 90, 180, 365, etc.
  wakeUpTime: string;
  bedTime: string;
  englishTargetMinutes: number;
  waterTargetGlasses: number;
  timezone: string;
  theme: "dark" | "light" | "system";
  soundEffects: boolean;
}

export interface WeeklyReview {
  weekNumber: number;
  startDate: string;
  endDate: string;
  completedActivitiesCount: number;
  missedActivitiesCount: number;
  strongestHabit: string;
  mostMissedHabit: string;
  totalLearningHours: number;
  englishHours: number;
  dsaSolvedCount: number;
  jobApplicationsCount: number;
  runningDays: number;
  reflectionNotes: string;
  nextWeekPlan: string;
  updatedAt: string;
}

export interface AppState {
  settings: ChallengeSettings;
  timetable: ActivityTemplate[];
  dayRecords: Record<number, DayRecord>; // dayNumber -> DayRecord
  dsaProblems: DsaProblem[];
  techLearnings: TechLearningRecord[];
  jobApplications: JobApplication[];
  weeklyReviews: Record<number, WeeklyReview>;
}
