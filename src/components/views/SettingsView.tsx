"use client";

import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Calendar,
  Clock,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  Trophy,
  CheckCircle2,
  Cloud,
  CloudOff,
  Bell,
  Trash2,
  FileCode,
  ShieldCheck,
  ChevronRight,
  Flame,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { isSupabaseConfigured } from "@/lib/supabase";

export function SettingsView() {
  const {
    state,
    updateSettings,
    extendChallenge,
    exportDataJson,
    importDataJson,
    resetAllData,
  } = useMission();

  const [customDaysInput, setCustomDaysInput] = useState<string>("");
  const [notificationStatus, setNotificationStatus] = useState<string>("Not requested");
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const handleRequestNotification = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotificationStatus("Permission granted! Browser reminders enabled.");
          new Notification("MISSION 30", {
            body: "Reminders active. Remember to keep this browser tab open for timely schedule alerts.",
          });
        } else {
          setNotificationStatus("Permission denied or dismissed.");
        }
      } catch (e) {
        setNotificationStatus("Browser notification error.");
      }
    } else {
      setNotificationStatus("Notifications not supported in this browser.");
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportSuccess(true);
        setImportError(null);
        setTimeout(() => setImportSuccess(false), 4000);
      } else {
        setImportError("Invalid backup file. Please select a valid MISSION 30 JSON export.");
      }
    };
    reader.readAsText(file);
  };

  const milestones = [
    { day: 7, label: "Day 7", desc: "First Week of Unbroken Discipline", reached: state.settings.totalDays >= 7 },
    { day: 15, label: "Day 15", desc: "Halfway Through the 30-Day Crucible", reached: state.settings.totalDays >= 15 },
    { day: 30, label: "Day 30", desc: "First Complete Life Transformation Completed", reached: state.settings.totalDays >= 30 },
    { day: 60, label: "Day 60", desc: "Habit Permanence & Neural Rewiring", reached: state.settings.totalDays >= 60 },
    { day: 90, label: "Day 90", desc: "Total Identity Transformation & Career Breakthrough", reached: state.settings.totalDays >= 90 },
    { day: 180, label: "Day 180", desc: "Half-Year Elite Consistency", reached: state.settings.totalDays >= 180 },
    { day: 365, label: "Day 365", desc: "Full Year Transformed Human", reached: state.settings.totalDays >= 365 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Configuration & Evolution
            </span>
            <span className="text-xs text-slate-400">
              Extend Challenge, Backups & Integrations
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Challenge Settings & Extensions
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure your journey parameters, start dates, timetable times, and cloud storage.
          </p>
        </div>
      </div>

      {/* 1. EXTEND CHALLENGE SECTION (Zero Data Loss Guarantee) */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-white text-lg">
                Extend Challenge Duration
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Current Duration: <strong>{state.settings.totalDays} Days</strong>. Extending preserves 100% of your daily diaries, job applications, DSA problems, and records.
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800">
            Zero Data Loss Guaranteed
          </span>
        </div>

        {/* Quick Extend Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[60, 90, 180, 365].map((targetDays) => {
            const isCurrent = state.settings.totalDays === targetDays;
            const isAlreadyPassed = state.settings.totalDays > targetDays;

            return (
              <button
                key={targetDays}
                disabled={state.settings.totalDays >= targetDays}
                onClick={() => {
                  if (confirm(`Extend challenge to ${targetDays} days? All previous progress will be fully preserved.`)) {
                    extendChallenge(targetDays);
                  }
                }}
                className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center ${
                  isCurrent
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                    : isAlreadyPassed
                    ? "bg-slate-900/40 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
                    : "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-white font-bold hover:border-cyan-400"
                }`}
              >
                <span className="text-lg font-black">{targetDays} Days</span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {isCurrent ? "Active Horizon" : isAlreadyPassed ? "Passed" : "Extend Horizon"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Duration Input */}
        <div className="flex items-center gap-2 max-w-md pt-1">
          <input
            type="number"
            min={state.settings.totalDays + 1}
            value={customDaysInput}
            onChange={(e) => setCustomDaysInput(e.target.value)}
            placeholder={`Custom Days (e.g. ${state.settings.totalDays + 15})`}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="button"
            onClick={() => {
              const num = parseInt(customDaysInput);
              if (num && num > state.settings.totalDays) {
                extendChallenge(num);
                setCustomDaysInput("");
              } else {
                alert(`Please enter a number greater than ${state.settings.totalDays}`);
              }
            }}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Extend
          </button>
        </div>

        {/* Milestone Path */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-300 mb-2">
            Target Transformation Milestones:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {milestones.map((m) => (
              <div
                key={m.day}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  m.reached
                    ? "bg-cyan-950/40 border-cyan-800/70 text-cyan-300"
                    : "bg-slate-900/40 border-slate-800 text-slate-500"
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${m.reached ? "text-cyan-400" : "text-slate-600"}`} />
                <div>
                  <div className="font-bold">{m.label}</div>
                  <div className="text-[10px] text-slate-400 truncate">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CORE CHALLENGE & TIMEZONE SETTINGS */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <SettingsIcon className="w-4 h-4 text-cyan-400" />
          General Challenge Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Challenge Display Name
            </label>
            <input
              type="text"
              value={state.settings.challengeName}
              onChange={(e) => updateSettings({ challengeName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Challenge Start Date (Day 1)
            </label>
            <input
              type="date"
              value={state.settings.startDate}
              onChange={(e) => updateSettings({ startDate: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Timezone (Default: Asia/Kolkata)
            </label>
            <select
              value={state.settings.timezone || "Asia/Kolkata"}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC (Universal Coordinated Time)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Berlin">Europe/Berlin (CET)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Daily English Speaking Target (Minutes)
            </label>
            <input
              type="number"
              min={30}
              step={15}
              value={state.settings.englishTargetMinutes || 120}
              onChange={(e) =>
                updateSettings({ englishTargetMinutes: parseInt(e.target.value) || 120 })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 3. BROWSER NOTIFICATIONS & REMINDERS */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              Schedule Reminders & Notifications
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Browser alerts notify you at 6:30 AM wake-up and key timetable transitions. Note: Standard browser notifications require keeping this website tab open.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-300">
            Current status: <strong className="text-cyan-400">{notificationStatus}</strong>
          </div>
          <button
            onClick={handleRequestNotification}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            Request Browser Permission
          </button>
        </div>
      </div>

      {/* 4. SUPABASE CLOUD SYNC & DATABASE MIGRATION */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isSupabaseConfigured
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                : "bg-amber-950/60 border-amber-800 text-amber-400"
            }`}>
              {isSupabaseConfigured ? <Cloud className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Cloud Database Storage (Supabase)
              </h3>
              <p className="text-xs text-slate-400">
                {isSupabaseConfigured
                  ? "Connected to your live Supabase cloud PostgreSQL instance."
                  : "Local Demo Mode Active (Persistent Browser LocalStorage). All data persists across page refreshes."}
              </p>
            </div>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
            isSupabaseConfigured
              ? "bg-emerald-950 text-emerald-300 border-emerald-700"
              : "bg-amber-950 text-amber-300 border-amber-700"
          }`}>
            {isSupabaseConfigured ? "Connected" : "Local Demo Mode"}
          </span>
        </div>

        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-300">
          <div className="font-bold text-white flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            Supabase Setup Instructions:
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
            <li>Create a free project at <span className="text-cyan-400">supabase.com</span></li>
            <li>Copy the complete PostgreSQL schema located at <code className="bg-slate-900 px-1.5 py-0.5 rounded text-cyan-300">supabase/schema.sql</code></li>
            <li>Paste and run it in the Supabase SQL Editor to generate all tables, RLS security policies, and indexes</li>
            <li>Set <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="text-cyan-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in your <code className="text-cyan-300">.env.local</code> file</li>
          </ol>
        </div>
      </div>

      {/* 5. DATA BACKUP (EXPORT & IMPORT JSON) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Complete Backup, Export & Import
        </h3>
        <p className="text-xs text-slate-400">
          Export your entire 30/60/90-day journey (checklists, diaries, applications, DSA problems, and settings) as a single portable JSON file.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={exportDataJson}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md shadow-cyan-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Complete JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer flex items-center gap-2 transition">
            <Upload className="w-4 h-4" />
            <span>Import JSON Backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>

        {importSuccess && (
          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
            ✓ Backup file imported successfully! All records restored.
          </div>
        )}

        {importError && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
            {importError}
          </div>
        )}
      </div>

      {/* 6. RESET DATA (CONFIRMATION GUARDED) */}
      <div className="glass-panel rounded-2xl p-6 border border-rose-900/40 space-y-3">
        <h3 className="font-bold text-rose-400 text-base flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          Reset Challenge Data
        </h3>
        <p className="text-xs text-slate-400">
          Reset all progress back to pristine Day 1 defaults.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-xs font-bold transition"
          >
            Reset All Data to Initial Defaults
          </button>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-700 space-y-3">
            <p className="text-xs text-rose-200 font-semibold">
              Are you sure? This will clear all logged daily records, diary entries, and applications.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
