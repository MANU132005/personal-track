"use client";

import React, { useState } from "react";
import {
  Code2,
  Plus,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  BarChart2,
  BookOpen,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { DsaProblem } from "@/types";
import { getDateForDayNumber, getTodayDateString } from "@/lib/storage";

export function DsaTrackerView() {
  const {
    state,
    selectedDay,
    currentDay,
    addDsaProblem,
    deleteDsaProblem,
  } = useMission();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>("All");

  const todayStr = getTodayDateString(state.settings.timezone || "Asia/Kolkata");
  const selectedDateStr = getDateForDayNumber(state.settings.startDate, selectedDay);

  // Form State
  const [formData, setFormData] = useState<{
    topic: string;
    problemName: string;
    platform: "LeetCode" | "GeeksforGeeks" | "CodeChef" | "Codeforces" | "HackerRank" | "Other";
    difficulty: "Easy" | "Medium" | "Hard";
    status: "Attempted" | "Solved";
    problemUrl: string;
    timeSpentMinutes: number;
    notes: string;
  }>({
    topic: "Arrays & Hashing",
    problemName: "",
    platform: "LeetCode",
    difficulty: "Medium",
    status: "Solved",
    problemUrl: "",
    timeSpentMinutes: 30,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.problemName.trim()) return;

    addDsaProblem({
      ...formData,
      date: selectedDateStr,
    });

    setFormData({
      topic: formData.topic,
      problemName: "",
      platform: "LeetCode",
      difficulty: "Medium",
      status: "Solved",
      problemUrl: "",
      timeSpentMinutes: 30,
      notes: "",
    });
    setIsFormOpen(false);
  };

  const problems = state.dsaProblems || [];
  const totalSolved = problems.filter((p) => p.status === "Solved").length;
  const easyCount = problems.filter((p) => p.difficulty === "Easy" && p.status === "Solved").length;
  const mediumCount = problems.filter((p) => p.difficulty === "Medium" && p.status === "Solved").length;
  const hardCount = problems.filter((p) => p.difficulty === "Hard" && p.status === "Solved").length;

  const totalMinutes = problems.reduce((acc, p) => acc + (p.timeSpentMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const filteredProblems = problems.filter((p) => {
    if (filterDifficulty === "All") return true;
    return p.difficulty === filterDifficulty;
  });

  const difficultyColors = {
    Easy: "text-emerald-400 bg-emerald-950/60 border-emerald-800",
    Medium: "text-amber-400 bg-amber-950/60 border-amber-800",
    Hard: "text-red-400 bg-red-950/60 border-red-800",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Algorithms & Problem Solving
            </span>
            <span className="text-xs text-slate-400">
              Consistent Practice Every Single Day
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            DSA Practice & Revision Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log solved problems, record edge cases, and analyze your difficulty breakdown.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Form" : "Log New Problem"}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Solved</div>
          <div className="text-2xl font-black text-white mt-1">{totalSolved}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{problems.length} attempted</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-emerald-400">Easy Solved</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{easyCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fundamentals</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-amber-400">Medium Solved</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{mediumCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Core Interviews</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-red-400">Hard Solved</div>
          <div className="text-2xl font-black text-red-400 mt-1">{hardCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Advanced Mastery</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-xs font-medium text-cyan-400">Total Time Spent</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">{totalHours} hrs</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalMinutes} minutes</div>
        </div>
      </div>

      {/* Add Problem Form Modal/Accordion */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-6 border border-emerald-500/30 bg-slate-900/90 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Log Algorithmic Problem
            </h3>
            <span className="text-xs text-slate-400">Date: {selectedDateStr}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Problem Title *
              </label>
              <input
                type="text"
                required
                value={formData.problemName}
                onChange={(e) =>
                  setFormData({ ...formData, problemName: e.target.value })
                }
                placeholder="e.g. Longest Substring Without Repeating Characters"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Topic / Pattern
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="e.g. Sliding Window, Two Pointers, Binary Trees"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as "Easy" | "Medium" | "Hard",
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as "Attempted" | "Solved",
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Solved">Solved</option>
                  <option value="Attempted">Attempted</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="LeetCode">LeetCode</option>
                  <option value="GeeksforGeeks">GFG</option>
                  <option value="Codeforces">Codeforces</option>
                  <option value="CodeChef">CodeChef</option>
                  <option value="HackerRank">HackerRank</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Problem URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.problemUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, problemUrl: e.target.value })
                  }
                  placeholder="https://leetcode.com/problems/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Time Spent (Mins)
                </label>
                <input
                  type="number"
                  min={5}
                  step={5}
                  value={formData.timeSpentMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeSpentMinutes: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Complexity & Key Intuition Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="e.g. Time: O(N) using sliding window hash map, Space: O(min(M,N)). Watch out for duplicate characters."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              Save Problem Record
            </button>
          </div>
        </form>
      )}

      {/* Filter and Problem List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <h3 className="font-bold text-white text-base">
            Solved Problems Log ({filteredProblems.length})
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Difficulty:</span>
            {["All", "Easy", "Medium", "Hard"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterDifficulty(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                  filterDifficulty === lvl
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {filteredProblems.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No DSA problems logged yet for this filter. Click "Log New Problem" above!
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredProblems.map((prob) => (
              <div
                key={prob.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white">
                      {prob.problemName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        difficultyColors[prob.difficulty]
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {prob.platform}
                    </span>
                    <span className="text-[10px] text-slate-500">{prob.date}</span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span className="font-medium text-cyan-400">{prob.topic}</span>
                    <span>•</span>
                    <span>{prob.timeSpentMinutes} mins</span>
                    {prob.notes && (
                      <>
                        <span>•</span>
                        <span className="truncate max-w-xs text-slate-400">
                          {prob.notes}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {prob.problemUrl && (
                    <a
                      href={prob.problemUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition"
                      title="Open problem link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => deleteDsaProblem(prob.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                    title="Delete problem record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
