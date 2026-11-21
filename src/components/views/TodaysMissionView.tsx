"use client";

import React, { useState } from "react";
import {
  Sun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit3,
  ChevronRight,
  MessageSquare,
  Flame,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { TimeOfDay } from "@/types";
import { getDateForDayNumber } from "@/lib/storage";

export function TodaysMissionView() {
  const {
    state,
    selectedDay,
    setSelectedDay,
    currentDay,
    toggleActivity,
    updateActivityNotes,
    selectedDayCompletion,
  } = useMission();

  const [expandedNotesActId, setExpandedNotesActId] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<string>("all");

  const currentRecord = state.dayRecords[selectedDay];
  const dateStr = getDateForDayNumber(state.settings.startDate, selectedDay);
  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isSelectedDayFuture = selectedDay > currentDay;

  const sections: { id: TimeOfDay; label: string; time: string; icon: any; color: string }[] = [
    {
      id: "morning",
      label: "MORNING",
      time: "6:30 AM to 12:00 PM",
      icon: Sun,
      color: "text-amber-400 bg-amber-950/40 border-amber-800/50",
    },
    {
      id: "afternoon",
      label: "AFTERNOON",
      time: "12:00 PM to 5:00 PM",
      icon: Sun,
      color: "text-cyan-400 bg-cyan-950/40 border-cyan-800/50",
    },
    {
      id: "evening",
      label: "EVENING",
      time: "5:00 PM to 8:00 PM",
      icon: Sunset,
      color: "text-indigo-400 bg-indigo-950/40 border-indigo-800/50",
    },
    {
      id: "night",
      label: "NIGHT",
      time: "8:00 PM to 11:00 PM",
      icon: Moon,
      color: "text-purple-400 bg-purple-950/40 border-purple-800/50",
    },
  ];

  const categoryBadgeColors: Record<string, string> = {
    routine: "text-slate-300 bg-slate-800 border-slate-700",
    fitness: "text-emerald-300 bg-emerald-950/60 border-emerald-800/60",
    wellness: "text-teal-300 bg-teal-950/60 border-teal-800/60",
    learning: "text-blue-300 bg-blue-950/60 border-blue-800/60",
    career: "text-purple-300 bg-purple-950/60 border-purple-800/60",
    mindset: "text-amber-300 bg-amber-950/60 border-amber-800/60",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Day Navigator */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Day {selectedDay} of {state.settings.totalDays}
            </span>
            {selectedDay === currentDay && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                Today
              </span>
            )}
            {isSelectedDayFuture && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                Upcoming (Previewing Planned Timetable)
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Daily Execution Timetable
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {formattedDate}
          </p>
        </div>

        {/* Day navigation buttons and completion ring */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
              disabled={selectedDay <= 1}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-300 transition"
            >
              Previous Day
            </button>
            <button
              onClick={() => setSelectedDay(Math.min(state.settings.totalDays, selectedDay + 1))}
              disabled={selectedDay >= state.settings.totalDays}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-300 transition"
            >
              Next Day
            </button>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="text-right">
              <div className="text-lg font-black text-white">
                {selectedDayCompletion}%
              </div>
              <div className="text-[10px] text-slate-400">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Period Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilterPeriod("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
            filterPeriod === "all"
              ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
          }`}
        >
          All Periods ({state.timetable.length})
        </button>
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setFilterPeriod(sec.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
              filterPeriod === sec.id
                ? "bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/20"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            }`}
          >
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* 4 Timetable Sections */}
      <div className="space-y-6">
        {sections
          .filter((sec) => filterPeriod === "all" || filterPeriod === sec.id)
          .map((sec) => {
            const SectionIcon = sec.icon;
            const activities = state.timetable.filter((act) => act.period === sec.id);
            if (activities.length === 0) return null;

            return (
              <div key={sec.id} className="glass-panel rounded-2xl border border-slate-800 p-5 space-y-3">
                {/* Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${sec.color}`}>
                      <SectionIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base tracking-wide">
                        {sec.label}
                      </h3>
                      <p className="text-xs text-slate-400">{sec.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {activities.filter((a) => currentRecord?.activities?.[a.id]?.completed).length} / {activities.length} completed
                  </span>
                </div>

                {/* Activity List */}
                <div className="space-y-2.5">
                  {activities.map((act) => {
                    const rec = currentRecord?.activities?.[act.id];
                    const isCompleted = Boolean(rec?.completed);
                    const isNotesOpen = expandedNotesActId === act.id;

                    return (
                      <div
                        key={act.id}
                        className={`rounded-xl border transition-all ${
                          isCompleted
                            ? "bg-emerald-950/20 border-emerald-800/40"
                            : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                        }`}
                      >
                        <div className="p-3.5 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5 min-w-0 flex-1">
                            {/* Checkbox button */}
                            <button
                              type="button"
                              onClick={() => {
                                if (isSelectedDayFuture) {
                                  alert("Notice: Future days cannot be marked completed in advance.");
                                  return;
                                }
                                toggleActivity(selectedDay, act.id);
                              }}
                              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                                isCompleted
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950 font-black shadow-md shadow-emerald-500/30"
                                  : "bg-slate-800 border-slate-700 hover:border-cyan-400 text-transparent"
                              }`}
                            >
                              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? "opacity-100" : "opacity-0"}`} />
                            </button>

                            {/* Activity Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-sm font-bold ${
                                    isCompleted ? "line-through text-slate-400" : "text-slate-100"
                                  }`}
                                >
                                  {act.activity}
                                </span>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                    categoryBadgeColors[act.category] || "text-slate-400 bg-slate-800 border-slate-700"
                                  }`}
                                >
                                  {act.category}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <span className="font-semibold text-cyan-400">{act.timeRange}</span>
                                <span>•</span>
                                <span>{act.durationMinutes} mins</span>
                                {act.description && (
                                  <>
                                    <span>•</span>
                                    <span className="truncate hidden sm:inline text-slate-400">
                                      {act.description}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Notes toggle button */}
                          <button
                            onClick={() =>
                              setExpandedNotesActId(isNotesOpen ? null : act.id)
                            }
                            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                              rec?.notes
                                ? "bg-cyan-950/50 border-cyan-700 text-cyan-300"
                                : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                            }`}
                            title="Add / view notes"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">{rec?.notes ? "Notes" : "+ Note"}</span>
                          </button>
                        </div>

                        {/* Collapsible notes input */}
                        {isNotesOpen && (
                          <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/80">
                            <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                              Personal Notes for {act.activity}:
                            </label>
                            <textarea
                              rows={2}
                              value={rec?.notes || ""}
                              onChange={(e) =>
                                updateActivityNotes(selectedDay, act.id, e.target.value)
                              }
                              placeholder="Write observations, focus level, or details..."
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                            <div className="text-[10px] text-slate-500 text-right mt-1">
                              Auto-saved to Day {selectedDay} record
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
