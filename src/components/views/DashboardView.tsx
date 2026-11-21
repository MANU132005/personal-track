"use client";

import React from "react";
import {
  Flame,
  Trophy,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Target,
  Languages,
  Code2,
  Briefcase,
  Heart,
  Quote,
  TrendingUp,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { MOTIVATIONAL_QUOTES } from "@/lib/constants";
import { getDateForDayNumber } from "@/lib/storage";

export function DashboardView() {
  const {
    state,
    currentDay,
    selectedDay,
    setSelectedDay,
    todayCompletion,
    overallProgress,
    toggleActivity,
    setActiveTab,
  } = useMission();

  const totalDays = state.settings.totalDays;
  const daysRemaining = Math.max(0, totalDays - currentDay);
  const currentRecord = state.dayRecords[currentDay] || state.dayRecords[1];

  // Pick quote based on day
  const quote = MOTIVATIONAL_QUOTES[(currentDay - 1) % MOTIVATIONAL_QUOTES.length];

  const categoryColors: Record<string, string> = {
    routine: "text-slate-400 bg-slate-800/80 border-slate-700",
    fitness: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
    wellness: "text-teal-400 bg-teal-950/60 border-teal-800/60",
    learning: "text-blue-400 bg-blue-950/60 border-blue-800/60",
    career: "text-purple-400 bg-purple-950/60 border-purple-800/60",
    mindset: "text-amber-400 bg-amber-950/60 border-amber-800/60",
  };

  const todayDateStr = getDateForDayNumber(state.settings.startDate, currentDay);
  const formattedTodayDate = new Date(todayDateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Calculate current timetable section (Morning, Afternoon, Evening, Night)
  const currentHour = new Date().getHours();
  let activePeriod: string = "morning";
  if (currentHour >= 12 && currentHour < 17) activePeriod = "afternoon";
  else if (currentHour >= 17 && currentHour < 20) activePeriod = "evening";
  else if (currentHour >= 20 || currentHour < 6) activePeriod = "night";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/60 border border-slate-800 p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/50 text-cyan-300 text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              MISSION 30 — MY TRANSFORMATION JOURNEY
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Day {currentDay} of {totalDays}
              <span className="text-slate-400 font-medium text-lg lg:text-xl ml-3">
                ({daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining)
              </span>
            </h2>
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              {formattedTodayDate} • Timezone: {state.settings.timezone || "Asia/Kolkata"}
            </p>
          </div>

          {/* Motivational Quote Box */}
          <div className="lg:max-w-md bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 shadow-inner">
            <div className="flex items-start gap-2.5">
              <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs lg:text-sm font-medium italic text-slate-200">
                  "{quote.quote}"
                </p>
                <p className="text-[11px] font-semibold text-cyan-400 mt-1">
                  — {quote.author}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Challenge Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Overall Challenge Progress
            </span>
            <span className="text-cyan-300 font-bold">
              {overallProgress.overallPercentage}% Completed (
              {overallProgress.totalCompletedActivities} / {overallProgress.totalPossibleActivities} tasks)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800/90 overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-700 ease-out shadow-sm shadow-cyan-500/50"
              style={{ width: `${Math.min(100, Math.max(0, overallProgress.overallPercentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Essential Highlight Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Completion */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Progress</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-white">
              {todayCompletion}%
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Day {currentDay} Habit Target
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Current Streak</span>
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-white flex items-baseline gap-1">
              {overallProgress.currentStreak}
              <span className="text-xs text-slate-400 font-normal">days</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Longest: {overallProgress.longestStreak} days
            </div>
          </div>
        </div>

        {/* Total Completed Activities */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Activities Completed</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-white">
              {overallProgress.totalCompletedActivities}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Total reps logged
            </div>
          </div>
        </div>

        {/* Days Left */}
        <div className="glass-panel rounded-xl p-4 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Challenge Horizon</span>
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-800/50 text-purple-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl lg:text-3xl font-black text-white">
              {daysRemaining}
              <span className="text-xs text-slate-400 font-normal ml-1">left</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Target: {totalDays} Days
            </div>
          </div>
        </div>
      </div>

      {/* Prominent "Today's Mission" Priority Timetable Section */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                Today's Mission Checklist (Day {currentDay})
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                {todayCompletion}% Done
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Every completed activity saves instantly and updates progress immediately.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedDay(currentDay);
              setActiveTab("mission");
            }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-600/20"
          >
            <span>Full Schedule & Notes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timetable Items preview with instant working checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {state.timetable.map((act) => {
            const isCompleted = Boolean(currentRecord?.activities?.[act.id]?.completed);
            const isCurrentPeriod = act.period === activePeriod;

            return (
              <div
                key={act.id}
                onClick={() => toggleActivity(currentDay, act.id)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  isCompleted
                    ? "bg-emerald-950/20 border-emerald-800/40 opacity-80"
                    : isCurrentPeriod
                    ? "bg-slate-800/90 border-cyan-500/40 shadow-sm shadow-cyan-500/5 hover:border-cyan-400"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => {}} // Controlled by container onClick
                    className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-500 cursor-pointer pointer-events-none"
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-sm font-semibold truncate ${
                        isCompleted
                          ? "line-through text-slate-400"
                          : "text-slate-100"
                      }`}
                    >
                      {act.activity}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{act.timeRange}</span>
                      <span>•</span>
                      <span>{act.durationMinutes}m</span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2 ml-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                      categoryColors[act.category] || "text-slate-400 bg-slate-800 border-slate-700"
                    }`}
                  >
                    {act.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Cards to 4 Core Tracking Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* English Card */}
        <div
          onClick={() => setActiveTab("english")}
          className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/50 text-blue-400 group-hover:scale-110 transition">
              <Languages className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Target: 2h/day</span>
          </div>
          <h4 className="font-bold text-base text-white mt-3 group-hover:text-cyan-400 transition">
            English Fluency
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Speaking, listening, Duolingo, and vocabulary logs.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Log Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* DSA Card */}
        <div
          onClick={() => setActiveTab("dsa")}
          className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 group-hover:scale-110 transition">
              <Code2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {state.dsaProblems.length} Solved
            </span>
          </div>
          <h4 className="font-bold text-base text-white mt-3 group-hover:text-cyan-400 transition">
            DSA Practice
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Algorithm problems, complexity notes, and revisions.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Open Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Job Applications Card */}
        <div
          onClick={() => setActiveTab("jobs")}
          className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-400 group-hover:scale-110 transition">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {state.jobApplications.length} Total
            </span>
          </div>
          <h4 className="font-bold text-base text-white mt-3 group-hover:text-cyan-400 transition">
            Job Applications
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Abroad and local software roles, stages, and follow-ups.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Manage Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Daily Diary Card */}
        <div
          onClick={() => {
            setSelectedDay(currentDay);
            setActiveTab("diary");
          }}
          className="glass-panel rounded-xl p-5 border border-slate-800 hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400 group-hover:scale-110 transition">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Private</span>
          </div>
          <h4 className="font-bold text-base text-white mt-3 group-hover:text-cyan-400 transition">
            Daily Diary
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            10 reflection prompts, mood score, and gratitude.
          </p>
          <div className="mt-3 text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <span>Write Entry</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
