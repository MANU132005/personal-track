"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Sparkles,
  CloudOff,
  Cloud,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Flame,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getDateForDayNumber } from "@/lib/storage";

export function Header({ onToggleMobileMenu }: { onToggleMobileMenu?: () => void }) {
  const {
    state,
    currentDay,
    selectedDay,
    setSelectedDay,
    todayCompletion,
    overallProgress,
    setActiveTab,
  } = useMission();

  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("light");
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-wider uppercase font-bold text-cyan-400 bg-cyan-950/70 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                MY TRANSFORMATION JOURNEY
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                {state.settings.timezone || "Asia/Kolkata"}
              </span>
            </div>
            <h1 className="text-lg lg:text-xl font-black tracking-tight text-white flex items-center gap-2">
              MISSION 30
              <span className="text-xs font-normal text-slate-400 hidden md:inline">
                • {currentDateFormatted}
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Day Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDayDropdownOpen(!isDayDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 hover:border-cyan-500/50 text-xs font-semibold text-slate-200 transition shadow-sm"
          >
            <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Viewing: <strong className="text-cyan-300">Day {selectedDay}</strong>
              {selectedDay === currentDay ? " (Today)" : ""}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown list of days */}
          {isDayDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50">
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                Jump to Day (Total {state.settings.totalDays} Days)
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: state.settings.totalDays }, (_, i) => i + 1).map(
                  (dayNum) => {
                    const isToday = dayNum === currentDay;
                    const isSelected = dayNum === selectedDay;
                    const isPast = dayNum < currentDay;
                    const isFuture = dayNum > currentDay;

                    return (
                      <button
                        key={dayNum}
                        onClick={() => {
                          setSelectedDay(dayNum);
                          setIsDayDropdownOpen(false);
                        }}
                        className={`py-1.5 px-2 text-xs rounded-lg font-bold transition flex flex-col items-center justify-center ${
                          isSelected
                            ? "bg-cyan-500 text-slate-950 shadow-md"
                            : isToday
                            ? "bg-cyan-950 border border-cyan-500 text-cyan-300"
                            : isPast
                            ? "bg-slate-800/80 hover:bg-slate-700 text-slate-200"
                            : "bg-slate-900/60 hover:bg-slate-800 text-slate-500"
                        }`}
                      >
                        <span>D{dayNum}</span>
                        {isToday && (
                          <span className="text-[8px] uppercase tracking-tighter text-cyan-300">
                            Today
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Storage Badge & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* Storage status */}
          <button
            onClick={() => setActiveTab("settings")}
            title={
              isSupabaseConfigured
                ? "Connected to Supabase Database"
                : "Using Persistent Browser Storage (Local Demo Mode)"
            }
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition ${
              isSupabaseConfigured
                ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-400"
                : "bg-amber-950/40 border-amber-700/60 text-amber-300 hover:bg-amber-900/40"
            }`}
          >
            {isSupabaseConfigured ? (
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <CloudOff className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSupabaseConfigured ? "Supabase Cloud" : "Local Demo Storage"}</span>
          </button>

          {/* Theme button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Toggle Light / Dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
