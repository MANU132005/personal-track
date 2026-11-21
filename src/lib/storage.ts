import {
  ActivityTemplate,
  AppState,
  ChallengeSettings,
  ComfortChallengeRecord,
  DayActivityRecord,
  DayRecord,
  DiaryEntry,
  DsaProblem,
  EnglishSession,
  HealthRecord,
  JobApplication,
  TechLearningRecord,
  WeeklyReview,
} from "@/types";
import { COMFORT_CHALLENGES_LIBRARY, DEFAULT_TIMETABLE } from "./constants";

const STORAGE_KEY = "mission_30_data_v2";

export function getTodayDateString(timezone: string = "Asia/Kolkata"): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    return formatter.format(new Date()); // Returns YYYY-MM-DD
  } catch {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
}

export function getDateForDayNumber(startDateStr: string, dayNumber: number): string {
  try {
    const [y, m, d] = startDateStr.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() + (dayNumber - 1));
    return date.toISOString().split("T")[0];
  } catch {
    return startDateStr;
  }
}

export function calculateDayNumberFromDate(startDateStr: string, currentDateStr: string): number {
  try {
    const [sy, sm, sd] = startDateStr.split("-").map(Number);
    const [cy, cm, cd] = currentDateStr.split("-").map(Number);
    const start = Date.UTC(sy, sm - 1, sd);
    const current = Date.UTC(cy, cm - 1, cd);
    const diffMs = current - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays + 1; // 1-indexed
  } catch {
    return 1;
  }
}

export function createInitialDayRecord(
  dayNumber: number,
  dateStr: string,
  timetable = DEFAULT_TIMETABLE
): DayRecord {
  const activities: Record<string, DayActivityRecord> = {};
  timetable.forEach((act) => {
    activities[act.id] = {
      activityId: act.id,
      completed: false,
    };
  });

  const challengeLibraryItem =
    COMFORT_CHALLENGES_LIBRARY[(dayNumber - 1) % COMFORT_CHALLENGES_LIBRARY.length] ||
    COMFORT_CHALLENGES_LIBRARY[0];

  const comfortChallenge: ComfortChallengeRecord = {
    challengeId: String(challengeLibraryItem.id),
    title: challengeLibraryItem.title,
    completed: false,
    skipped: false,
    difficultyRating: 3,
    whatIDid: "",
    whatILearned: "",
    confidenceBefore: 5,
    confidenceAfter: 6,
  };

  const english: EnglishSession = {
    id: `eng-day-${dayNumber}`,
    timestamp: new Date().toISOString(),
    speakingMinutes: 0,
    listeningMinutes: 0,
    pronunciationMinutes: 0,
    duolingoCompleted: false,
    vocabulary: [],
    confidenceScore: 5,
    notes: "",
  };

  const health: HealthRecord = {
    runningMinutes: 0,
    runningDistanceKm: 0,
    walkingMinutes: 0,
    stretchingDone: false,
    runningNotes: "",
    breakfastDone: false,
    lunchDone: false,
    dinnerDone: false,
    waterGlasses: 0,
    fruitVegIntake: false,
    nutritionNotes: "",
    morningSkincare: false,
    sunscreenApplied: false,
    nightSkincare: false,
    skincareNotes: "",
  };

  return {
    dayNumber,
    dateStr,
    activities,
    english,
    health,
    comfortChallenge,
  };
}

export function getInitialState(): AppState {
  const todayStr = getTodayDateString("Asia/Kolkata");
  const settings: ChallengeSettings = {
    challengeName: "MISSION 30 — Become Your Best Self",
    startDate: todayStr,
    totalDays: 30,
    wakeUpTime: "06:30",
    bedTime: "23:00",
    englishTargetMinutes: 120,
    waterTargetGlasses: 10,
    timezone: "Asia/Kolkata",
    theme: "dark",
    soundEffects: true,
  };

  const dayRecords: Record<number, DayRecord> = {};
  for (let i = 1; i <= settings.totalDays; i++) {
    const dStr = getDateForDayNumber(settings.startDate, i);
    dayRecords[i] = createInitialDayRecord(i, dStr, DEFAULT_TIMETABLE);
  }

  // Pre-populate a couple of sample job applications to demonstrate full working structure
  const sampleJobs: JobApplication[] = [
    {
      id: "job-1",
      category: "abroad",
      company: "Stripe",
      title: "Full Stack Software Engineer",
      country: "Remote (Global)",
      city: "Remote",
      appliedDate: todayStr,
      url: "https://stripe.com/jobs",
      resumeVersion: "v2.1-FullStack-International",
      status: "Applied",
      notes: "Tailored cover letter focusing on high-concurrency systems and Next.js.",
      followUpDate: getDateForDayNumber(todayStr, 7),
    },
    {
      id: "job-2",
      category: "local",
      company: "Razorpay",
      title: "Frontend Engineer II",
      country: "India",
      city: "Bengaluru",
      appliedDate: todayStr,
      url: "https://razorpay.com/careers",
      resumeVersion: "v2.0-React-TypeScript",
      status: "Assessment",
      notes: "Online assessment received, scheduled for this weekend.",
      followUpDate: getDateForDayNumber(todayStr, 3),
    },
  ];

  return {
    settings,
    timetable: DEFAULT_TIMETABLE,
    dayRecords,
    dsaProblems: [],
    techLearnings: [],
    jobApplications: sampleJobs,
    weeklyReviews: {},
  };
}

// In-memory fallback if window is undefined (SSR)
let memoryState: AppState | null = null;

export function loadAppState(): AppState {
  if (typeof window === "undefined") {
    if (!memoryState) memoryState = getInitialState();
    return memoryState;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialState();
      saveAppState(initial);
      return initial;
    }
    const parsed: AppState = JSON.parse(raw);
    // Sanity checks to ensure structure completeness
    if (!parsed.settings) parsed.settings = getInitialState().settings;
    if (!parsed.timetable || parsed.timetable.length === 0) parsed.timetable = DEFAULT_TIMETABLE;
    if (!parsed.dayRecords) parsed.dayRecords = {};

    // Ensure all days up to totalDays exist
    const totalDays = parsed.settings.totalDays || 30;
    for (let d = 1; d <= totalDays; d++) {
      if (!parsed.dayRecords[d]) {
        const dStr = getDateForDayNumber(parsed.settings.startDate, d);
        parsed.dayRecords[d] = createInitialDayRecord(d, dStr, parsed.timetable);
      } else {
        // Ensure all timetable activities exist in day activities
        parsed.timetable.forEach((act) => {
          if (!parsed.dayRecords[d].activities[act.id]) {
            parsed.dayRecords[d].activities[act.id] = {
              activityId: act.id,
              completed: false,
            };
          }
        });
      }
    }

    if (!Array.isArray(parsed.jobApplications)) parsed.jobApplications = [];
    if (!Array.isArray(parsed.dsaProblems)) parsed.dsaProblems = [];
    if (!Array.isArray(parsed.techLearnings)) parsed.techLearnings = [];
    if (!parsed.weeklyReviews) parsed.weeklyReviews = {};

    return parsed;
  } catch (err) {
    console.error("Error loading app state:", err);
    return getInitialState();
  }
}

type Subscriber = (state: AppState) => void;
const subscribers = new Set<Subscriber>();

export function subscribeToState(callback: Subscriber): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function notifySubscribers(newState: AppState) {
  subscribers.forEach((cb) => {
    try {
      cb(newState);
    } catch (e) {
      console.error("Subscriber notification error", e);
    }
  });
}

export function saveAppState(state: AppState): void {
  memoryState = state;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      // Dispatch custom window event so other tabs or components can react
      window.dispatchEvent(new Event("mission30_storage_updated"));
    } catch (err) {
      console.error("Error saving state to localStorage:", err);
    }
  }
  notifySubscribers(state);
}

// Helper: Calculate Day Completion %
export function calculateDayCompletion(dayRecord?: DayRecord, timetable = DEFAULT_TIMETABLE): number {
  if (!dayRecord || !dayRecord.activities) return 0;
  const total = timetable.length;
  if (total === 0) return 0;
  let completed = 0;
  timetable.forEach((act) => {
    if (dayRecord.activities[act.id]?.completed) {
      completed++;
    }
  });
  return Math.round((completed / total) * 100);
}

// Helper: Calculate Overall Challenge Completion %
export function calculateOverallProgress(
  dayRecords: Record<number, DayRecord>,
  timetable: ActivityTemplate[],
  totalDays: number
): {
  totalCompletedActivities: number;
  totalPossibleActivities: number;
  overallPercentage: number;
  currentStreak: number;
  longestStreak: number;
} {
  const totalPossible = totalDays * timetable.length;
  let totalCompleted = 0;

  // Streak calculation
  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  for (let d = 1; d <= totalDays; d++) {
    const rec = dayRecords[d];
    let dayCompleted = 0;
    if (rec && rec.activities) {
      timetable.forEach((act) => {
        if (rec.activities[act.id]?.completed) {
          dayCompleted++;
          totalCompleted++;
        }
      });
    }

    const dayPct = timetable.length > 0 ? (dayCompleted / timetable.length) * 100 : 0;
    // Count as streak day if user finished at least 1 activity or >= 50%
    if (dayCompleted > 0) {
      runningStreak++;
      if (runningStreak > longestStreak) longestStreak = runningStreak;
      currentStreak = runningStreak;
    } else {
      runningStreak = 0;
    }
  }

  const overallPercentage =
    totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  return {
    totalCompletedActivities: totalCompleted,
    totalPossibleActivities: totalPossible,
    overallPercentage,
    currentStreak,
    longestStreak,
  };
}

// Extend Challenge Duration
export function extendChallengeDays(newTotalDays: number): AppState {
  const state = loadAppState();
  if (newTotalDays <= state.settings.totalDays) {
    return state;
  }

  state.settings.totalDays = newTotalDays;
  for (let d = 1; d <= newTotalDays; d++) {
    if (!state.dayRecords[d]) {
      const dStr = getDateForDayNumber(state.settings.startDate, d);
      state.dayRecords[d] = createInitialDayRecord(d, dStr, state.timetable);
    }
  }

  saveAppState(state);
  return state;
}

// Reset data with sample
export function resetToDefaults(): AppState {
  const initial = getInitialState();
  saveAppState(initial);
  return initial;
}
