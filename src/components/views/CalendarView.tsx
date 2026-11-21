"use client";

import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  BookOpen,
  Languages,
  Code2,
  Activity,
  Flame,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { calculateDayCompletion, getDateForDayNumber } from "@/lib/storage";

export function CalendarView() {
  const {
    state,
    currentDay,
    selectedDay,
    setSelectedDay,
    setActiveTab,
    toggleActivity,
  } = useMission();

  const [filterMode, setFilterMode] = useState<"all" | "completed" | "inProgress" | "upcoming">("all");

  const totalDays = state.settings.totalDays;
  const currentRecord = state.dayRecords[selectedDay];
  const selectedDayCompletion = calculateDayCompletion(currentRecord, state.timetable);

  const selectedDateStr = getDateForDayNumber(state.settings.startDate, selectedDay);
  const formattedSelectedDate = new Date(selectedDateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isFutureDay = selectedDay > currentDay;
  const isPastDay = selectedDay < currentDay;
  const isToday = selectedDay === currentDay;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Overview & Filter */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              {totalDays}-Day Journey Map
            </span>
            <span className="text-xs text-slate-400">
              Independent isolated tracking per day
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Challenge Calendar & Daily Inspector
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any day to inspect its isolated checklist, diary, English minutes, and fitness records.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterMode === "all"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            All Days ({totalDays})
          </button>
          <button
            onClick={() => setFilterMode("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterMode === "completed"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Completed (≥70%)
          </button>
          <button
            onClick={() => setFilterMode("inProgress")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterMode === "inProgress"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilterMode("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              filterMode === "upcoming"
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Upcoming
          </button>
        </div>
      </div>

      {/* 30-Day Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-3">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
          const rec = state.dayRecords[dayNum];
          const completion = calculateDayCompletion(rec, state.timetable);
          const dayDate = getDateForDayNumber(state.settings.startDate, dayNum);
          const isSelected = dayNum === selectedDay;
          const isCurrent = dayNum === currentDay;
          const isFuture = dayNum > currentDay;

          // Apply filter
          if (filterMode === "completed" && completion < 70) return null;
          if (filterMode === "inProgress" && (completion === 0 || completion >= 70 || isFuture)) return null;
          if (filterMode === "upcoming" && !isFuture) return null;

          return (
            <button
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                isSelected
                  ? "bg-cyan-950/60 border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                  : isCurrent
                  ? "bg-slate-800/90 border-cyan-600/80 hover:border-cyan-400"
                  : isFuture
                  ? "bg-slate-900/40 border-slate-800/80 hover:border-slate-700 opacity-60"
                  : completion >= 70
                  ? "bg-emerald-950/20 border-emerald-800/60 hover:border-emerald-700"
                  : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-sm text-white">
                  Day {dayNum}
                </span>
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
                {completion >= 70 && !isFuture && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>

              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {new Date(dayDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px]">
                <span
                  className={`font-bold ${
                    isFuture
                      ? "text-slate-500"
                      : completion >= 70
                      ? "text-emerald-400"
                      : completion > 0
                      ? "text-cyan-400"
                      : "text-slate-500"
                  }`}
                >
                  {isFuture ? "Planned" : `${completion}%`}
                </span>
                <span className="text-[9px] text-slate-500">
                  {rec?.diary ? "📝" : ""}
                  {(rec?.english?.speakingMinutes || 0) > 0 ? "🎙️" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Full Inspector Panel */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                Detailed Inspector
              </span>
              <span className="text-base font-black text-white">
                Day {selectedDay} ({formattedSelectedDate})
              </span>
              {isToday && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                  Today
                </span>
              )}
              {isFutureDay && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-800">
                  Future Day (Read-only Timetable Preview)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Changes made here affect Day {selectedDay} exclusively.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("diary")}
              className="px-3 py-1.5 rounded-lg bg-amber-950/50 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Day {selectedDay} Diary</span>
            </button>
            <button
              onClick={() => setActiveTab("mission")}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <span>Full Checklist</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Summary Metrics for this Day */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Timetable Completed</div>
            <div className="text-xl font-bold text-white mt-1">
              {selectedDayCompletion}%
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {Object.values(currentRecord?.activities || {}).filter((a) => a.completed).length} / {state.timetable.length} tasks
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">English Practice</div>
            <div className="text-xl font-bold text-cyan-400 mt-1">
              {(currentRecord?.english?.speakingMinutes || 0) + (currentRecord?.english?.listeningMinutes || 0)} mins
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target: 120 mins
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Running / Cardio</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {currentRecord?.health?.runningMinutes || 0} mins
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {currentRecord?.health?.runningDistanceKm || 0} km logged
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs text-slate-400">Comfort Challenge</div>
            <div className="text-xl font-bold text-amber-400 mt-1">
              {currentRecord?.comfortChallenge?.completed ? "Completed" : "Pending"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">
              {currentRecord?.comfortChallenge?.title || "Daily growth drill"}
            </div>
          </div>
        </div>

        {/* Timetable Checkboxes Preview for this day */}
        <div>
          <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            Day {selectedDay} Schedule Checkpoints
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {state.timetable.map((act) => {
              const isDone = Boolean(currentRecord?.activities?.[act.id]?.completed);
              return (
                <div
                  key={act.id}
                  onClick={() => {
                    if (isFutureDay) {
                      alert("Future days cannot be marked completed in advance.");
                      return;
                    }
                    toggleActivity(selectedDay, act.id);
                  }}
                  className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer transition select-none ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-800/40 text-slate-300"
                      : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => {}}
                      className="rounded text-cyan-500 pointer-events-none"
                    />
                    <span className={`font-semibold truncate ${isDone ? "line-through text-slate-400" : ""}`}>
                      {act.activity}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">
                    {act.timeRange}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Edit History Log */}
        {currentRecord?.lastEditedAt && (
          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Last updated: {new Date(currentRecord.lastEditedAt).toLocaleString()}</span>
            <span>All entries saved independently to Day {selectedDay}</span>
          </div>
        )}
      </div>
    </div>
  );
}
