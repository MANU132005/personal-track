"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import confetti from "canvas-confetti";
import {
  AppState,
  ChallengeSettings,
  ComfortChallengeRecord,
  DayRecord,
  DiaryEntry,
  DsaProblem,
  EnglishSession,
  HealthRecord,
  JobApplication,
  TechLearningRecord,
  WeeklyReview,
  ActivityTemplate,
} from "@/types";
import {
  calculateDayCompletion,
  calculateDayNumberFromDate,
  calculateOverallProgress,
  createInitialDayRecord,
  extendChallengeDays,
  getDateForDayNumber,
  getInitialState,
  getTodayDateString,
  loadAppState,
  resetToDefaults,
  saveAppState,
  subscribeToState,
} from "@/lib/storage";

interface MissionContextType {
  state: AppState;
  currentDay: number;
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  todayCompletion: number;
  selectedDayCompletion: number;
  overallProgress: {
    totalCompletedActivities: number;
    totalPossibleActivities: number;
    overallPercentage: number;
    currentStreak: number;
    longestStreak: number;
  };
  toggleActivity: (dayNumber: number, activityId: string) => void;
  updateActivityNotes: (dayNumber: number, activityId: string, notes: string) => void;
  updateEnglish: (dayNumber: number, data: Partial<EnglishSession>) => void;
  updateHealth: (dayNumber: number, data: Partial<HealthRecord>) => void;
  updateComfortChallenge: (dayNumber: number, data: Partial<ComfortChallengeRecord>) => void;
  updateDiary: (dayNumber: number, data: Partial<DiaryEntry>) => void;
  addDsaProblem: (problem: Omit<DsaProblem, "id">) => void;
  updateDsaProblem: (problem: DsaProblem) => void;
  deleteDsaProblem: (id: string) => void;
  addTechLearning: (record: Omit<TechLearningRecord, "id">) => void;
  updateTechLearning: (record: TechLearningRecord) => void;
  deleteTechLearning: (id: string) => void;
  addJobApplication: (job: Omit<JobApplication, "id">) => void;
  updateJobApplication: (job: JobApplication) => void;
  deleteJobApplication: (id: string) => void;
  updateWeeklyReview: (weekNumber: number, data: Partial<WeeklyReview>) => void;
  updateSettings: (settings: Partial<ChallengeSettings>) => void;
  updateTimetable: (timetable: ActivityTemplate[]) => void;
  extendChallenge: (newDays: number) => void;
  exportDataJson: () => void;
  importDataJson: (jsonString: string) => boolean;
  resetAllData: () => void;
  triggerConfetti: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize and load saved state
  useEffect(() => {
    setIsMounted(true);
    const loaded = loadAppState();
    setState(loaded);

    const unsubscribe = subscribeToState((newState) => {
      setState({ ...newState });
    });

    const handleStorageChange = () => {
      setState(loadAppState());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("mission30_storage_updated", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("mission30_storage_updated", handleStorageChange);
    };
  }, []);

  // Calculate currentDay based on startDate and today in timezone
  const currentDay = useMemo(() => {
    const todayStr = getTodayDateString(state.settings.timezone || "Asia/Kolkata");
    const calc = calculateDayNumberFromDate(state.settings.startDate, todayStr);
    if (calc < 1) return 1;
    if (calc > state.settings.totalDays) return state.settings.totalDays;
    return calc;
  }, [state.settings.startDate, state.settings.timezone, state.settings.totalDays]);

  // Sync selectedDay to currentDay on initial mount
  useEffect(() => {
    if (isMounted) {
      setSelectedDay(currentDay);
    }
  }, [currentDay, isMounted]);

  // Today completion percentage
  const todayCompletion = useMemo(() => {
    const todayRec = state.dayRecords[currentDay];
    return calculateDayCompletion(todayRec, state.timetable);
  }, [state.dayRecords, currentDay, state.timetable]);

  // Selected day completion percentage
  const selectedDayCompletion = useMemo(() => {
    const rec = state.dayRecords[selectedDay];
    return calculateDayCompletion(rec, state.timetable);
  }, [state.dayRecords, selectedDay, state.timetable]);

  // Overall challenge progress
  const overallProgress = useMemo(() => {
    return calculateOverallProgress(
      state.dayRecords,
      state.timetable,
      state.settings.totalDays
    );
  }, [state.dayRecords, state.timetable, state.settings.totalDays]);

  const triggerConfetti = () => {
    if (typeof window !== "undefined") {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  // Toggle activity checkbox
  const toggleActivity = (dayNumber: number, activityId: string) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) {
      const dStr = getDateForDayNumber(newState.settings.startDate, dayNumber);
      newState.dayRecords[dayNumber] = createInitialDayRecord(
        dayNumber,
        dStr,
        newState.timetable
      );
    }

    const dayRec = { ...newState.dayRecords[dayNumber] };
    const activities = { ...dayRec.activities };
    const currentAct = activities[activityId] || {
      activityId,
      completed: false,
    };

    const nextCompleted = !currentAct.completed;
    activities[activityId] = {
      ...currentAct,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
    };

    dayRec.activities = activities;
    dayRec.lastEditedAt = new Date().toISOString();
    newState.dayRecords[dayNumber] = dayRec;

    saveAppState(newState);

    if (nextCompleted) {
      triggerConfetti();
    }
  };

  // Update activity notes
  const updateActivityNotes = (
    dayNumber: number,
    activityId: string,
    notes: string
  ) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) return;

    const dayRec = { ...newState.dayRecords[dayNumber] };
    const activities = { ...dayRec.activities };
    if (activities[activityId]) {
      activities[activityId] = {
        ...activities[activityId],
        notes,
      };
      dayRec.activities = activities;
      dayRec.lastEditedAt = new Date().toISOString();
      newState.dayRecords[dayNumber] = dayRec;
      saveAppState(newState);
    }
  };

  // Update English session
  const updateEnglish = (dayNumber: number, data: Partial<EnglishSession>) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) {
      const dStr = getDateForDayNumber(newState.settings.startDate, dayNumber);
      newState.dayRecords[dayNumber] = createInitialDayRecord(
        dayNumber,
        dStr,
        newState.timetable
      );
    }

    const dayRec = { ...newState.dayRecords[dayNumber] };
    dayRec.english = {
      ...dayRec.english,
      ...data,
      timestamp: new Date().toISOString(),
    };
    dayRec.lastEditedAt = new Date().toISOString();
    newState.dayRecords[dayNumber] = dayRec;
    saveAppState(newState);
  };

  // Update Health record
  const updateHealth = (dayNumber: number, data: Partial<HealthRecord>) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) {
      const dStr = getDateForDayNumber(newState.settings.startDate, dayNumber);
      newState.dayRecords[dayNumber] = createInitialDayRecord(
        dayNumber,
        dStr,
        newState.timetable
      );
    }

    const dayRec = { ...newState.dayRecords[dayNumber] };
    dayRec.health = {
      ...dayRec.health,
      ...data,
    };
    dayRec.lastEditedAt = new Date().toISOString();
    newState.dayRecords[dayNumber] = dayRec;
    saveAppState(newState);
  };

  // Update Comfort Challenge
  const updateComfortChallenge = (
    dayNumber: number,
    data: Partial<ComfortChallengeRecord>
  ) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) {
      const dStr = getDateForDayNumber(newState.settings.startDate, dayNumber);
      newState.dayRecords[dayNumber] = createInitialDayRecord(
        dayNumber,
        dStr,
        newState.timetable
      );
    }

    const dayRec = { ...newState.dayRecords[dayNumber] };
    dayRec.comfortChallenge = {
      ...dayRec.comfortChallenge,
      ...data,
    };
    dayRec.lastEditedAt = new Date().toISOString();
    newState.dayRecords[dayNumber] = dayRec;
    saveAppState(newState);
  };

  // Update Diary Entry
  const updateDiary = (dayNumber: number, data: Partial<DiaryEntry>) => {
    const newState = { ...state };
    if (!newState.dayRecords[dayNumber]) {
      const dStr = getDateForDayNumber(newState.settings.startDate, dayNumber);
      newState.dayRecords[dayNumber] = createInitialDayRecord(
        dayNumber,
        dStr,
        newState.timetable
      );
    }

    const dayRec = { ...newState.dayRecords[dayNumber] };
    const dateStr = getDateForDayNumber(newState.settings.startDate, dayNumber);

    const existingDiary = dayRec.diary || {
      dayNumber,
      date: dateStr,
      mood: "good",
      energyScore: 7,
      q1_accomplished: "",
      q2_learned: "",
      q3_happy: "",
      q4_difficult: "",
      q5_uncomfortable: "",
      q6_englishImprovement: "",
      q7_mistakesToAvoid: "",
      q8_gratefulFor: "",
      q9_improveTomorrow: "",
      q10_personalThoughts: "",
      freeWriting: "",
      updatedAt: new Date().toISOString(),
    };

    dayRec.diary = {
      ...existingDiary,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    dayRec.lastEditedAt = new Date().toISOString();
    newState.dayRecords[dayNumber] = dayRec;
    saveAppState(newState);
  };

  // DSA CRUD
  const addDsaProblem = (problem: Omit<DsaProblem, "id">) => {
    const newState = { ...state };
    const newProblem: DsaProblem = {
      ...problem,
      id: `dsa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    newState.dsaProblems = [newProblem, ...(newState.dsaProblems || [])];
    saveAppState(newState);
  };

  const updateDsaProblem = (problem: DsaProblem) => {
    const newState = { ...state };
    newState.dsaProblems = (newState.dsaProblems || []).map((p) =>
      p.id === problem.id ? problem : p
    );
    saveAppState(newState);
  };

  const deleteDsaProblem = (id: string) => {
    const newState = { ...state };
    newState.dsaProblems = (newState.dsaProblems || []).filter((p) => p.id !== id);
    saveAppState(newState);
  };

  // Tech Learning CRUD
  const addTechLearning = (record: Omit<TechLearningRecord, "id">) => {
    const newState = { ...state };
    const newRecord: TechLearningRecord = {
      ...record,
      id: `tech-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    newState.techLearnings = [newRecord, ...(newState.techLearnings || [])];
    saveAppState(newState);
  };

  const updateTechLearning = (record: TechLearningRecord) => {
    const newState = { ...state };
    newState.techLearnings = (newState.techLearnings || []).map((r) =>
      r.id === record.id ? record : r
    );
    saveAppState(newState);
  };

  const deleteTechLearning = (id: string) => {
    const newState = { ...state };
    newState.techLearnings = (newState.techLearnings || []).filter((r) => r.id !== id);
    saveAppState(newState);
  };

  // Job Applications CRUD
  const addJobApplication = (job: Omit<JobApplication, "id">) => {
    const newState = { ...state };
    const newJob: JobApplication = {
      ...job,
      id: `job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    newState.jobApplications = [newJob, ...(newState.jobApplications || [])];
    saveAppState(newState);
  };

  const updateJobApplication = (job: JobApplication) => {
    const newState = { ...state };
    newState.jobApplications = (newState.jobApplications || []).map((j) =>
      j.id === job.id ? job : j
    );
    saveAppState(newState);
  };

  const deleteJobApplication = (id: string) => {
    const newState = { ...state };
    newState.jobApplications = (newState.jobApplications || []).filter((j) => j.id !== id);
    saveAppState(newState);
  };

  // Weekly Reviews
  const updateWeeklyReview = (weekNumber: number, data: Partial<WeeklyReview>) => {
    const newState = { ...state };
    const existing = newState.weeklyReviews[weekNumber] || {
      weekNumber,
      startDate: getDateForDayNumber(newState.settings.startDate, (weekNumber - 1) * 7 + 1),
      endDate: getDateForDayNumber(newState.settings.startDate, Math.min(weekNumber * 7, newState.settings.totalDays)),
      completedActivitiesCount: 0,
      missedActivitiesCount: 0,
      strongestHabit: "",
      mostMissedHabit: "",
      totalLearningHours: 0,
      englishHours: 0,
      dsaSolvedCount: 0,
      jobApplicationsCount: 0,
      runningDays: 0,
      reflectionNotes: "",
      nextWeekPlan: "",
      updatedAt: new Date().toISOString(),
    };

    newState.weeklyReviews[weekNumber] = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveAppState(newState);
  };

  // Settings & Timetable
  const updateSettings = (newSettings: Partial<ChallengeSettings>) => {
    const newState = { ...state };
    newState.settings = { ...newState.settings, ...newSettings };
    saveAppState(newState);
  };

  const updateTimetable = (newTimetable: ActivityTemplate[]) => {
    const newState = { ...state };
    newState.timetable = newTimetable;
    saveAppState(newState);
  };

  // Extend Challenge
  const extendChallenge = (newDays: number) => {
    const updated = extendChallengeDays(newDays);
    setState(updated);
    triggerConfetti();
  };

  // Export JSON
  const exportDataJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mission-30-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const importDataJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.settings || !parsed.dayRecords) {
        throw new Error("Invalid Mission 30 backup file");
      }
      saveAppState(parsed);
      setState(parsed);
      return true;
    } catch (e) {
      console.error("Import failed:", e);
      return false;
    }
  };

  // Reset Data
  const resetAllData = () => {
    const initial = resetToDefaults();
    setState(initial);
    setSelectedDay(1);
  };

  return (
    <MissionContext.Provider
      value={{
        state,
        currentDay,
        selectedDay,
        setSelectedDay,
        activeTab,
        setActiveTab,
        todayCompletion,
        selectedDayCompletion,
        overallProgress,
        toggleActivity,
        updateActivityNotes,
        updateEnglish,
        updateHealth,
        updateComfortChallenge,
        updateDiary,
        addDsaProblem,
        updateDsaProblem,
        deleteDsaProblem,
        addTechLearning,
        updateTechLearning,
        deleteTechLearning,
        addJobApplication,
        updateJobApplication,
        deleteJobApplication,
        updateWeeklyReview,
        updateSettings,
        updateTimetable,
        extendChallenge,
        exportDataJson,
        importDataJson,
        resetAllData,
        triggerConfetti,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error("useMission must be used within a MissionProvider");
  }
  return context;
}
