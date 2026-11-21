"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Trophy,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Languages,
  Code2,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { WeeklyReview } from "@/types";
import { calculateDayCompletion, getDateForDayNumber } from "@/lib/storage";

export function WeeklyReviewsView() {
  const { state, currentDay, updateWeeklyReview } = useMission();

  const totalDays = state.settings.totalDays;
  const totalWeeks = Math.ceil(totalDays / 7);
  const currentWeekNumber = Math.min(totalWeeks, Math.ceil(currentDay / 7));

  const [selectedWeek, setSelectedWeek] = useState<number>(currentWeekNumber);

  const startDay = (selectedWeek - 1) * 7 + 1;
  const endDay = Math.min(selectedWeek * 7, totalDays);
  const startDateStr = getDateForDayNumber(state.settings.startDate, startDay);
  const endDateStr = getDateForDayNumber(state.settings.startDate, endDay);

  // Compute actual weekly performance metrics from dayRecords
  let completedActivities = 0;
  let possibleActivities = 0;
  let englishMinutes = 0;
  let runningDays = 0;

  const habitFrequency: Record<string, number> = {};
  state.timetable.forEach((act) => {
    habitFrequency[act.activity] = 0;
  });

  for (let d = startDay; d <= endDay; d++) {
    const rec = state.dayRecords[d];
    if (d <= currentDay && rec) {
      state.timetable.forEach((act) => {
        possibleActivities++;
        if (rec.activities?.[act.id]?.completed) {
          completedActivities++;
          habitFrequency[act.activity]++;
        }
      });

      const eng = rec.english;
      if (eng) {
        englishMinutes +=
          (eng.speakingMinutes || 0) +
          (eng.listeningMinutes || 0) +
          (eng.pronunciationMinutes || 0);
      }

      if ((rec.health?.runningMinutes || 0) > 0) {
        runningDays++;
      }
    }
  }

  const missedActivities = Math.max(0, possibleActivities - completedActivities);

  // Find strongest & most missed habits
  let strongestHabit = "N/A";
  let mostMissedHabit = "N/A";
  let maxCompleted = -1;
  let minCompleted = 99999;

  Object.entries(habitFrequency).forEach(([name, count]) => {
    if (count > maxCompleted) {
      maxCompleted = count;
      strongestHabit = name;
    }
    if (count < minCompleted) {
      minCompleted = count;
      mostMissedHabit = name;
    }
  });

  // DSA problems solved in this week's date range
  const dsaSolvedInWeek = (state.dsaProblems || []).filter((p) => {
    return p.date >= startDateStr && p.date <= endDateStr && p.status === "Solved";
  }).length;

  // Job applications submitted in this week's date range
  const jobsInWeek = (state.jobApplications || []).filter((j) => {
    return j.appliedDate >= startDateStr && j.appliedDate <= endDateStr;
  }).length;

  const review: WeeklyReview = state.weeklyReviews[selectedWeek] || {
    weekNumber: selectedWeek,
    startDate: startDateStr,
    endDate: endDateStr,
    completedActivitiesCount: completedActivities,
    missedActivitiesCount: missedActivities,
    strongestHabit,
    mostMissedHabit,
    totalLearningHours: 0,
    englishHours: parseFloat((englishMinutes / 60).toFixed(1)),
    dsaSolvedCount: dsaSolvedInWeek,
    jobApplicationsCount: jobsInWeek,
    runningDays,
    reflectionNotes: "",
    nextWeekPlan: "",
    updatedAt: new Date().toISOString(),
  };

  const handleNotesChange = (field: "reflectionNotes" | "nextWeekPlan", val: string) => {
    updateWeeklyReview(selectedWeek, {
      [field]: val,
      completedActivitiesCount: completedActivities,
      missedActivitiesCount: missedActivities,
      strongestHabit,
      mostMissedHabit,
      englishHours: parseFloat((englishMinutes / 60).toFixed(1)),
      dsaSolvedCount: dsaSolvedInWeek,
      jobApplicationsCount: jobsInWeek,
      runningDays,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Iterative Growth Engine
            </span>
            <span className="text-xs text-slate-400">
              Structured Weekly Audit & Recalibration
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Week {selectedWeek} Performance Audit
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Covering Days {startDay} to {endDay} ({startDateStr} to {endDateStr})
          </p>
        </div>

        {/* Week Selector */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
            disabled={selectedWeek <= 1}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
            Week {selectedWeek} of {totalWeeks}
          </span>
          <button
            onClick={() => setSelectedWeek(Math.min(totalWeeks, selectedWeek + 1))}
            disabled={selectedWeek >= totalWeeks}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 Real Weekly Telemetry Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Completed Reps</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {completedActivities}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {missedActivities} missed
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">English Practice</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {(englishMinutes / 60).toFixed(1)}h
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Target: 14h / week</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">DSA Solved</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {dsaSolvedInWeek}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Problems solved</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Job Pipeline</div>
          <div className="text-2xl font-black text-purple-400 mt-1">
            {jobsInWeek}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Applications sent</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Running Days</div>
          <div className="text-2xl font-black text-teal-400 mt-1">
            {runningDays} / 7
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Cardio consistency</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Execution Score</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {possibleActivities > 0 ? Math.round((completedActivities / possibleActivities) * 100) : 0}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Weekly rating</div>
        </div>
      </div>

      {/* Habit Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl p-5 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Strongest Habit This Week</div>
            <div className="text-base font-bold text-white mt-1">{strongestHabit}</div>
            <div className="text-xs text-emerald-400 mt-0.5">Highest adherence rate</div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-5 border border-slate-800 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Most Frequently Missed</div>
            <div className="text-base font-bold text-white mt-1">{mostMissedHabit}</div>
            <div className="text-xs text-rose-400 mt-0.5">Needs prioritization next week</div>
          </div>
        </div>
      </div>

      {/* Reflection Form */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">
          Week {selectedWeek} Reflection & Recalibration Form
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Personal Reflection & Root-Cause Analysis for Week {selectedWeek}:
            </label>
            <textarea
              rows={4}
              value={review.reflectionNotes || ""}
              onChange={(e) => handleNotesChange("reflectionNotes", e.target.value)}
              placeholder="What went exceptionally well? What caused slips or missed timetable slots? How did mental resilience hold up?"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Battle Plan & Non-Negotiables for Week {selectedWeek + 1}:
            </label>
            <textarea
              rows={4}
              value={review.nextWeekPlan || ""}
              onChange={(e) => handleNotesChange("nextWeekPlan", e.target.value)}
              placeholder="What specific adjustments will you make to sleep, focus blocks, or environment to guarantee 85%+ execution next week?"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="text-[11px] text-slate-500 text-right pt-2">
          Auto-saved to Week {selectedWeek} Review record
        </div>
      </div>
    </div>
  );
}
