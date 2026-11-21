"use client";

import React, { useState } from "react";
import {
  Zap,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  ArrowRight,
  RefreshCw,
  Award,
  AlertCircle,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { COMFORT_CHALLENGES_LIBRARY } from "@/lib/constants";

export function ComfortChallengeView() {
  const {
    state,
    selectedDay,
    currentDay,
    updateComfortChallenge,
    triggerConfetti,
  } = useMission();

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customTitleInput, setCustomTitleInput] = useState("");

  const currentRecord = state.dayRecords[selectedDay];
  const libraryIndex = (selectedDay - 1) % COMFORT_CHALLENGES_LIBRARY.length;
  const defaultChallenge = COMFORT_CHALLENGES_LIBRARY[libraryIndex];

  const challenge = currentRecord?.comfortChallenge || {
    challengeId: String(defaultChallenge.id),
    title: defaultChallenge.title,
    completed: false,
    skipped: false,
    difficultyRating: 3,
    whatIDid: "",
    whatILearned: "",
    confidenceBefore: 5,
    confidenceAfter: 7,
  };

  const currentPrompt =
    COMFORT_CHALLENGES_LIBRARY.find((c) => c.title === challenge.title)?.prompt ||
    "Push through temporary hesitation to expand your emotional comfort zone.";

  const handleMarkCompleted = () => {
    const nextCompleted = !challenge.completed;
    updateComfortChallenge(selectedDay, {
      completed: nextCompleted,
      skipped: false,
    });
    if (nextCompleted) {
      triggerConfetti();
    }
  };

  const handleMarkSkipped = () => {
    updateComfortChallenge(selectedDay, {
      completed: false,
      skipped: !challenge.skipped,
    });
  };

  const handleCycleNextChallenge = () => {
    const nextIndex = (libraryIndex + 1) % COMFORT_CHALLENGES_LIBRARY.length;
    const nextItem = COMFORT_CHALLENGES_LIBRARY[nextIndex];
    updateComfortChallenge(selectedDay, {
      challengeId: String(nextItem.id),
      title: nextItem.title,
    });
  };

  const handleSaveCustomChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitleInput.trim()) return;
    updateComfortChallenge(selectedDay, {
      title: customTitleInput.trim(),
    });
    setIsCustomMode(false);
    setCustomTitleInput("");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800">
              Anti-Comfort Zone Drill
            </span>
            <span className="text-xs text-slate-400">
              6:00–6:10 PM Slot • 5–10 Minutes
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Daily Uncomfortable Challenge
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Expanding psychological resilience on <strong>Day {selectedDay}</strong>
            {selectedDay === currentDay ? " (Today)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
          >
            {isCustomMode ? "Cancel Custom" : "Replace with Custom Challenge"}
          </button>
          <button
            onClick={handleCycleNextChallenge}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            title="Pick another challenge from the 30-item library"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Custom Challenge Creator */}
      {isCustomMode && (
        <form
          onSubmit={handleSaveCustomChallenge}
          className="glass-panel rounded-2xl p-5 border border-amber-500/40 bg-slate-900/90 space-y-3"
        >
          <label className="text-xs font-bold text-slate-200 block">
            Enter Your Own Safe, Respectful Uncomfortable Challenge:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={customTitleInput}
              onChange={(e) => setCustomTitleInput(e.target.value)}
              placeholder="e.g. Ask a store manager for advice on public speaking"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Set as Today's Challenge
            </button>
          </div>
        </form>
      )}

      {/* Main Challenge Hero Card */}
      <div className="glass-panel rounded-2xl p-6 lg:p-8 border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" />
              Day {selectedDay} Assignment
            </div>
            <h3 className="text-xl lg:text-2xl font-black text-white">
              "{challenge.title}"
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {currentPrompt}
            </p>
          </div>

          {/* Action buttons: Completed / Skipped */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleMarkSkipped}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                challenge.skipped
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700"
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>{challenge.skipped ? "Skipped" : "Skip"}</span>
            </button>

            <button
              onClick={handleMarkCompleted}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition flex items-center gap-2 shadow-lg ${
                challenge.completed
                  ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-emerald-500/20"
                  : "bg-amber-500 hover:bg-amber-400 border-amber-400 text-slate-950 shadow-amber-500/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{challenge.completed ? "Mission Accomplished ✓" : "Mark Completed"}</span>
            </button>
          </div>
        </div>

        {/* Confidence Before and After Rating Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Difficulty Rating */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Difficulty Rating
              </span>
              <span className="text-xs font-bold text-amber-400">
                {challenge.difficultyRating || 3} / 5
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={challenge.difficultyRating || 3}
              onChange={(e) =>
                updateComfortChallenge(selectedDay, {
                  difficultyRating: parseInt(e.target.value),
                })
              }
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Mild (1)</span>
              <span>Intense (5)</span>
            </div>
          </div>

          {/* Confidence Before */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Confidence BEFORE
              </span>
              <span className="text-xs font-bold text-cyan-400">
                {challenge.confidenceBefore || 5} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={challenge.confidenceBefore || 5}
              onChange={(e) =>
                updateComfortChallenge(selectedDay, {
                  confidenceBefore: parseInt(e.target.value),
                })
              }
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Anxious (1)</span>
              <span>Ready (10)</span>
            </div>
          </div>

          {/* Confidence After */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Confidence AFTER
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {challenge.confidenceAfter || 7} / 10
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={challenge.confidenceAfter || 7}
              onChange={(e) =>
                updateComfortChallenge(selectedDay, {
                  confidenceAfter: parseInt(e.target.value),
                })
              }
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>No change (1)</span>
              <span>Unstoppable (10)</span>
            </div>
          </div>
        </div>

        {/* Reflection Textareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              What Exactly Did You Do?
            </label>
            <textarea
              rows={3}
              value={challenge.whatIDid || ""}
              onChange={(e) =>
                updateComfortChallenge(selectedDay, {
                  whatIDid: e.target.value,
                })
              }
              placeholder="Describe the action you took and how you initiated it..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              What Did You Learn About Yourself?
            </label>
            <textarea
              rows={3}
              value={challenge.whatILearned || ""}
              onChange={(e) =>
                updateComfortChallenge(selectedDay, {
                  whatILearned: e.target.value,
                })
              }
              placeholder="e.g. The fear in my head was 10x worse than reality. Once I started speaking, it was effortless..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 30-Day Safe Challenges Library Preview */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          The 30 Comfort-Zone Challenges Catalog
        </h3>
        <p className="text-xs text-slate-400">
          All challenges are safe, constructive, professional, and designed to compound social courage.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
          {COMFORT_CHALLENGES_LIBRARY.map((item) => {
            const isTodayItem = item.title === challenge.title;
            return (
              <div
                key={item.id}
                onClick={() => {
                  updateComfortChallenge(selectedDay, {
                    challengeId: String(item.id),
                    title: item.title,
                  });
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 ${
                  isTodayItem
                    ? "bg-amber-950/40 border-amber-500/60 shadow-md shadow-amber-500/10 text-white"
                    : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <span className="font-bold text-amber-400 shrink-0">#{item.id}</span>
                <div className="min-w-0">
                  <p className="font-semibold">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
