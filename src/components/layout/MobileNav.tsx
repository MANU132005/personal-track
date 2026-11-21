"use client";

import React from "react";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Languages,
  BookOpen,
  X,
  Settings,
  Code2,
  Cpu,
  Briefcase,
  Activity,
  Zap,
  BarChart3,
  CalendarCheck,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { NAV_ITEMS } from "./Sidebar";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { activeTab, setActiveTab, currentDay, state } = useMission();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-white text-sm">
                30
              </div>
              <span className="font-extrabold text-white text-base">MISSION 30</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-2">
            <div className="text-xs font-semibold text-slate-500 uppercase px-2 py-1">
              Menu
            </div>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      isActive
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
          Day {currentDay} of {state.settings.totalDays} • Transform Daily
        </div>
      </div>
    </div>
  );
}

export function MobileBottomBar() {
  const { activeTab, setActiveTab } = useMission();

  const primaryMobileTabs = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "mission", label: "Mission", icon: CheckSquare },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "english", label: "English", icon: Languages },
    { id: "diary", label: "Diary", icon: BookOpen },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1 flex items-center justify-around shadow-lg">
      {primaryMobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-lg text-xs transition ${
              isActive
                ? "text-cyan-400 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
