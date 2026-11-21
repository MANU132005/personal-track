"use client";

import React, { useState } from "react";
import {
  Languages,
  Mic,
  Headphones,
  Sparkles,
  BookMarked,
  CheckCircle2,
  TrendingUp,
  Plus,
  Trash2,
  Flame,
  Award,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function EnglishTrackerView() {
  const {
    state,
    selectedDay,
    setSelectedDay,
    currentDay,
    updateEnglish,
  } = useMission();

  const [vocabInput, setVocabInput] = useState("");

  const currentRecord = state.dayRecords[selectedDay];
  const english = currentRecord?.english || {
    id: `eng-${selectedDay}`,
    timestamp: new Date().toISOString(),
    speakingMinutes: 0,
    listeningMinutes: 0,
    pronunciationMinutes: 0,
    duolingoCompleted: false,
    vocabulary: [],
    confidenceScore: 5,
    notes: "",
  };

  const totalMinutesToday =
    (english.speakingMinutes || 0) +
    (english.listeningMinutes || 0) +
    (english.pronunciationMinutes || 0);

  const targetMinutes = state.settings.englishTargetMinutes || 120;
  const progressPercent = Math.min(100, Math.round((totalMinutesToday / targetMinutes) * 100));

  // Calculate cumulative English practice across the entire challenge
  let totalChallengeMinutes = 0;
  Object.values(state.dayRecords).forEach((rec) => {
    if (rec.english) {
      totalChallengeMinutes +=
        (rec.english.speakingMinutes || 0) +
        (rec.english.listeningMinutes || 0) +
        (rec.english.pronunciationMinutes || 0);
    }
  });
  const totalChallengeHours = (totalChallengeMinutes / 60).toFixed(1);

  const handleAddVocab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vocabInput.trim()) return;
    const currentVocab = english.vocabulary || [];
    if (!currentVocab.includes(vocabInput.trim())) {
      updateEnglish(selectedDay, {
        vocabulary: [...currentVocab, vocabInput.trim()],
      });
    }
    setVocabInput("");
  };

  const handleRemoveVocab = (wordToRemove: string) => {
    const currentVocab = english.vocabulary || [];
    updateEnglish(selectedDay, {
      vocabulary: currentVocab.filter((w) => w !== wordToRemove),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
              High Priority Mastery
            </span>
            <span className="text-xs text-slate-400">
              Daily Target: 2 Hours (120 Mins)
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Daily English Speaking & Fluency Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Logging practice for <strong>Day {selectedDay}</strong>
            {selectedDay === currentDay ? " (Today)" : ""}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-right">
            <div className="text-xs text-slate-400">Challenge Total</div>
            <div className="text-xl font-black text-blue-400">
              {totalChallengeHours} hrs
            </div>
            <div className="text-[10px] text-slate-500">Total Practice</div>
          </div>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Total vs Target */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today's Progress</span>
            <span className="text-xs font-bold text-blue-400">{progressPercent}%</span>
          </div>
          <div className="text-2xl font-black text-white">
            {totalMinutesToday} / {targetMinutes} <span className="text-xs text-slate-400 font-normal">mins</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {totalMinutesToday >= targetMinutes ? "🎉 Daily 2-hour target reached!" : `${targetMinutes - totalMinutesToday} mins remaining today`}
          </p>
        </div>

        {/* Duolingo Completion */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400">Duolingo Practice</div>
            <div className="text-lg font-bold text-white mt-1">
              {english.duolingoCompleted ? "Completed Today" : "Not Done Yet"}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">Keep daily streak alive</div>
          </div>
          <button
            onClick={() =>
              updateEnglish(selectedDay, {
                duolingoCompleted: !english.duolingoCompleted,
              })
            }
            className={`px-4 py-2 rounded-xl font-bold text-xs border transition ${
              english.duolingoCompleted
                ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            {english.duolingoCompleted ? "Done ✓" : "Mark Done"}
          </button>
        </div>

        {/* Confidence Score */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Vocal Confidence</span>
            <span className="text-xs font-bold text-cyan-400">{english.confidenceScore || 5} / 10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={english.confidenceScore || 5}
            onChange={(e) =>
              updateEnglish(selectedDay, {
                confidenceScore: parseInt(e.target.value),
              })
            }
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Hesitant (1)</span>
            <span>Flowing & Clear (10)</span>
          </div>
        </div>
      </div>

      {/* Minute Input Form & Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Mic className="w-5 h-5 text-blue-400" />
          Log Minutes for Day {selectedDay}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Speaking Minutes */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Mic className="w-4 h-4 text-cyan-400" />
              Speaking Practice
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={english.speakingMinutes || 0}
                onChange={(e) =>
                  updateEnglish(selectedDay, {
                    speakingMinutes: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400">minutes</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[+15, +30, +60].map((inc) => (
                <button
                  key={inc}
                  onClick={() =>
                    updateEnglish(selectedDay, {
                      speakingMinutes: (english.speakingMinutes || 0) + inc,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300"
                >
                  +{inc}m
                </button>
              ))}
            </div>
          </div>

          {/* Listening Minutes */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Headphones className="w-4 h-4 text-blue-400" />
              Listening & Podcasts
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={english.listeningMinutes || 0}
                onChange={(e) =>
                  updateEnglish(selectedDay, {
                    listeningMinutes: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400">minutes</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[+15, +30].map((inc) => (
                <button
                  key={inc}
                  onClick={() =>
                    updateEnglish(selectedDay, {
                      listeningMinutes: (english.listeningMinutes || 0) + inc,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300"
                >
                  +{inc}m
                </button>
              ))}
            </div>
          </div>

          {/* Pronunciation Practice */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Pronunciation / Shadowing
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={5}
                value={english.pronunciationMinutes || 0}
                onChange={(e) =>
                  updateEnglish(selectedDay, {
                    pronunciationMinutes: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-lg font-bold text-white focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs text-slate-400">minutes</span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {[+10, +20].map((inc) => (
                <button
                  key={inc}
                  onClick={() =>
                    updateEnglish(selectedDay, {
                      pronunciationMinutes: (english.pronunciationMinutes || 0) + inc,
                    })
                  }
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-semibold text-slate-300"
                >
                  +{inc}m
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* New Vocabulary Learned Today */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-cyan-400" />
              New Vocabulary & Phrasal Verbs Learned (Day {selectedDay})
            </label>
            <span className="text-xs text-slate-400">
              {(english.vocabulary || []).length} words recorded
            </span>
          </div>

          <form onSubmit={handleAddVocab} className="flex gap-2">
            <input
              type="text"
              value={vocabInput}
              onChange={(e) => setVocabInput(e.target.value)}
              placeholder="e.g. 'Nuance' (subtle distinction) or 'Cut corners'"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Word</span>
            </button>
          </form>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-1">
            {(english.vocabulary || []).length === 0 ? (
              <span className="text-xs text-slate-500 italic">
                No new words logged for this day yet. Add words above!
              </span>
            ) : (
              (english.vocabulary || []).map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-950/60 border border-blue-800/60 text-blue-300"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => handleRemoveVocab(word)}
                    className="hover:text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Mistakes and Improvements Notes */}
        <div className="space-y-2 pt-3 border-t border-slate-800">
          <label className="text-sm font-bold text-slate-200">
            Notes on Pronunciation, Hesitations, and Corrections:
          </label>
          <textarea
            rows={3}
            value={english.notes || ""}
            onChange={(e) =>
              updateEnglish(selectedDay, {
                notes: e.target.value,
              })
            }
            placeholder="e.g. Need to pronounce 'th' sound clearly without substituting 'd'. Practiced shadowing Steve Jobs speech."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <div className="text-[10px] text-slate-500 text-right">
            Auto-saved to Day {selectedDay}
          </div>
        </div>
      </div>
    </div>
  );
}
