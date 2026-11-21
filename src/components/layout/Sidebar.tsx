"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Languages,
  Code2,
  Cpu,
  Briefcase,
  Activity,
  Zap,
  BookOpen,
  BarChart3,
  CalendarCheck,
  Settings,
  Flame,
  Trophy,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

export const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "mission", label: "Today's Mission", icon: CheckSquare },
  { id: "calendar", label: "30-Day Calendar", icon: Calendar },
  { id: "english", label: "English Tracker", icon: Languages },
  { id: "dsa", label: "DSA Practice", icon: Code2 },
  { id: "tech", label: "Technical Skills", icon: Cpu },
  { id: "jobs", label: "Job Applications", icon: Briefcase },
  { id: "health", label: "Health & Fitness", icon: Activity },
  { id: "comfort", label: "Comfort Challenge", icon: Zap },
  { id: "diary", label: "Daily Diary", icon: BookOpen },
  { id: "analytics", label: "Progress Analytics", icon: BarChart3 },
  { id: "reviews", label: "Weekly Reviews", icon: CalendarCheck },
  { id: "settings", label: "Settings & Extend", icon: Settings },
];

export function Sidebar() {
  const { activeTab, setActiveTab, currentDay, state, overallProgress } = useMission();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900/90 border-r border-slate-800 backdrop-blur-xl h-screen sticky top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-white text-lg">
            30
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              MISSION 30
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">Become Your Best Self</p>
          </div>
        </div>
      </div>

      {/* Quick Streak & Day Banner */}
      <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-xs font-semibold text-slate-200">
              {overallProgress.currentStreak} Day Streak
            </div>
            <div className="text-[10px] text-slate-400">
              Best: {overallProgress.longestStreak} days
            </div>
          </div>
        </div>
        <div className="px-2 py-1 rounded-md bg-cyan-950/80 border border-cyan-800/50 text-cyan-300 text-xs font-bold">
          Day {currentDay}/{state.settings.totalDays}
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.id === "calendar" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {state.settings.totalDays}d
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Milestone */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-slate-300 font-medium">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span>Transformation: {overallProgress.overallPercentage}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, overallProgress.overallPercentage)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
