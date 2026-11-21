"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Lock,
  Download,
  Search,
  Calendar,
  Sparkles,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { DiaryEntry } from "@/types";
import { getDateForDayNumber } from "@/lib/storage";

export function DailyDiaryView() {
  const {
    state,
    selectedDay,
    setSelectedDay,
    currentDay,
    updateDiary,
  } = useMission();

  const [activeDiaryTab, setActiveDiaryTab] = useState<"write" | "browse">("write");
  const [diarySearchQuery, setDiarySearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<string>("All changes auto-saved");

  const currentRecord = state.dayRecords[selectedDay];
  const dateStr = getDateForDayNumber(state.settings.startDate, selectedDay);
  const formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const diary: DiaryEntry = currentRecord?.diary || {
    dayNumber: selectedDay,
    date: dateStr,
    mood: "good",
    energyScore: 7,
    q1_accomplished: "",
    q2_learned: "",
    q3_happy: "",
    q4_difficult: "",
    q5_uncomfortable: "",
    q6_englishImprovement: "",
    q7_mistakesToAvoid: "",
    q8_gratefulFor: "",
    q9_improveTomorrow: "",
    q10_personalThoughts: "",
    freeWriting: "",
    updatedAt: new Date().toISOString(),
  };

  const handleFieldChange = (field: keyof DiaryEntry, value: any) => {
    updateDiary(selectedDay, {
      [field]: value,
    });
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Saved locally");
    }, 600);
  };

  // Export this day's entry as text file
  const handleExportText = () => {
    const content = `
MISSION 30 — PRIVATE DAILY DIARY
Day ${selectedDay} • ${formattedDate}
Mood: ${diary.mood} | Energy: ${diary.energyScore}/10
-----------------------------------------------------------
1. What did I accomplish today?
${diary.q1_accomplished || "N/A"}

2. What did I learn today?
${diary.q2_learned || "N/A"}

3. What made me happy?
${diary.q3_happy || "N/A"}

4. What was difficult?
${diary.q4_difficult || "N/A"}

5. What uncomfortable thing did I do?
${diary.q5_uncomfortable || "N/A"}

6. How did I improve my English?
${diary.q6_englishImprovement || "N/A"}

7. What mistakes should I avoid?
${diary.q7_mistakesToAvoid || "N/A"}

8. What am I grateful for?
${diary.q8_gratefulFor || "N/A"}

9. What will I improve tomorrow?
${diary.q9_improveTomorrow || "N/A"}

10. My personal thoughts:
${diary.q10_personalThoughts || "N/A"}

-----------------------------------------------------------
FREE WRITING & UNFILTERED JOURNAL:
${diary.freeWriting || "N/A"}
-----------------------------------------------------------
Recorded on: ${diary.updatedAt || new Date().toISOString()}
    `.trim();

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diary-day-${selectedDay}-${dateStr}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export this day's entry as JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(diary, null, 2));
    const link = document.createElement("a");
    link.href = dataStr;
    link.download = `diary-day-${selectedDay}.json`;
    link.click();
  };

  const moodOptions: { id: DiaryEntry["mood"]; label: string; emoji: string }[] = [
    { id: "terrific", label: "Terrific", emoji: "🔥" },
    { id: "good", label: "Good", emoji: "😊" },
    { id: "neutral", label: "Neutral", emoji: "😐" },
    { id: "tired", label: "Tired", emoji: "😴" },
    { id: "rough", label: "Rough", emoji: "🌧️" },
  ];

  // Past diary entries for search & browse
  const allEntriesWithDiary = Object.values(state.dayRecords)
    .filter((r) => r.diary && (r.diary.freeWriting || r.diary.q1_accomplished))
    .map((r) => r.diary!);

  const filteredPastEntries = allEntriesWithDiary.filter((d) => {
    if (!diarySearchQuery) return true;
    const q = diarySearchQuery.toLowerCase();
    return (
      d.q1_accomplished?.toLowerCase().includes(q) ||
      d.q2_learned?.toLowerCase().includes(q) ||
      d.q8_gratefulFor?.toLowerCase().includes(q) ||
      d.q10_personalThoughts?.toLowerCase().includes(q) ||
      d.freeWriting?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              Private & Encrypted Journal
            </span>
            <span className="text-xs text-slate-400">
              10:35–10:50 PM Slot (15 Mins)
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Day {selectedDay} Daily Reflection Diary
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {formattedDate} • Never displayed publicly
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveDiaryTab("write")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeDiaryTab === "write"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Write / Edit
            </button>
            <button
              onClick={() => setActiveDiaryTab("browse")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                activeDiaryTab === "browse"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Search Entries ({allEntriesWithDiary.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleExportText}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition"
              title="Export as Text (.txt)"
            >
              <FileText className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs border border-slate-700 transition"
              title="Export as JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {activeDiaryTab === "browse" ? (
        /* Search and Browse Past Diaries */
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={diarySearchQuery}
              onChange={(e) => setDiarySearchQuery(e.target.value)}
              placeholder="Search across all past reflections, gratitude, lessons, or notes..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {filteredPastEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No written diary entries found. Write your reflection in the "Write / Edit" tab!
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPastEntries.map((item) => (
                <div
                  key={item.dayNumber}
                  onClick={() => {
                    setSelectedDay(item.dayNumber);
                    setActiveDiaryTab("write");
                  }}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      Day {item.dayNumber} ({item.date})
                    </span>
                    <span className="text-xs text-amber-400 font-medium">
                      Mood: {item.mood} • Energy: {item.energyScore}/10
                    </span>
                  </div>

                  {item.q1_accomplished && (
                    <p className="text-xs text-slate-300 line-clamp-2">
                      <strong>Accomplished:</strong> {item.q1_accomplished}
                    </p>
                  )}
                  {item.q8_gratefulFor && (
                    <p className="text-xs text-emerald-400 line-clamp-1">
                      <strong>Grateful:</strong> {item.q8_gratefulFor}
                    </p>
                  )}
                  {item.freeWriting && (
                    <p className="text-xs text-slate-400 italic line-clamp-2">
                      "{item.freeWriting}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Write / Edit Current Day Diary */
        <div className="space-y-6">
          {/* Day Navigation & Mood / Energy Selector */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDay(Math.max(1, selectedDay - 1))}
                disabled={selectedDay <= 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white">
                Viewing Day {selectedDay}
              </span>
              <button
                onClick={() => setSelectedDay(Math.min(state.settings.totalDays, selectedDay + 1))}
                disabled={selectedDay >= state.settings.totalDays}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mood selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Mood:</span>
              {moodOptions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleFieldChange("mood", m.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    diary.mood === m.id
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Energy Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">
                Energy: <strong className="text-amber-400">{diary.energyScore || 7}</strong>/10
              </span>
              <input
                type="range"
                min={1}
                max={10}
                value={diary.energyScore || 7}
                onChange={(e) =>
                  handleFieldChange("energyScore", parseInt(e.target.value))
                }
                className="w-28 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          {/* 10 Guided Reflection Questions */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-black text-white text-base">
                10 Deep Reflection Inquiries
              </h3>
              <span className="text-[11px] text-emerald-400 font-medium">
                {saveStatus}
              </span>
            </div>

            <div className="space-y-4">
              {/* Question 1 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  1. What did I accomplish today?
                </label>
                <textarea
                  rows={2}
                  value={diary.q1_accomplished || ""}
                  onChange={(e) => handleFieldChange("q1_accomplished", e.target.value)}
                  placeholder="The tasks finished, DSA questions cracked, miles ran..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 2 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  2. What did I learn today?
                </label>
                <textarea
                  rows={2}
                  value={diary.q2_learned || ""}
                  onChange={(e) => handleFieldChange("q2_learned", e.target.value)}
                  placeholder="Key technical, psychological, or practical learnings..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 3 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  3. What made me happy?
                </label>
                <textarea
                  rows={2}
                  value={diary.q3_happy || ""}
                  onChange={(e) => handleFieldChange("q3_happy", e.target.value)}
                  placeholder="A good moment with family, a solved bug, a pleasant run..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 4 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  4. What was difficult?
                </label>
                <textarea
                  rows={2}
                  value={diary.q4_difficult || ""}
                  onChange={(e) => handleFieldChange("q4_difficult", e.target.value)}
                  placeholder="Where did friction occur? Low energy, procrastination, or hard problem?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 5 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  5. What uncomfortable thing did I do?
                </label>
                <textarea
                  rows={2}
                  value={diary.q5_uncomfortable || ""}
                  onChange={(e) => handleFieldChange("q5_uncomfortable", e.target.value)}
                  placeholder="Pushing past hesitation, speaking up, cold calling, cold shower..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 6 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  6. How did I improve my English?
                </label>
                <textarea
                  rows={2}
                  value={diary.q6_englishImprovement || ""}
                  onChange={(e) => handleFieldChange("q6_englishImprovement", e.target.value)}
                  placeholder="New idioms learned, speech recorded, pronunciation corrected..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 7 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  7. What mistakes should I avoid?
                </label>
                <textarea
                  rows={2}
                  value={diary.q7_mistakesToAvoid || ""}
                  onChange={(e) => handleFieldChange("q7_mistakesToAvoid", e.target.value)}
                  placeholder="Distractions to eliminate, wasted time, or missed schedule checkpoints..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Question 8 */}
              <div>
                <label className="text-xs font-bold text-emerald-400 block mb-1">
                  8. What am I grateful for?
                </label>
                <textarea
                  rows={2}
                  value={diary.q8_gratefulFor || ""}
                  onChange={(e) => handleFieldChange("q8_gratefulFor", e.target.value)}
                  placeholder="3 specific things, people, or opportunities I appreciate today..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Question 9 */}
              <div>
                <label className="text-xs font-bold text-cyan-400 block mb-1">
                  9. What will I improve tomorrow?
                </label>
                <textarea
                  rows={2}
                  value={diary.q9_improveTomorrow || ""}
                  onChange={(e) => handleFieldChange("q9_improveTomorrow", e.target.value)}
                  placeholder="One concrete enhancement to execute starting tomorrow at 6:30 AM..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Question 10 */}
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1">
                  10. My personal thoughts:
                </label>
                <textarea
                  rows={2}
                  value={diary.q10_personalThoughts || ""}
                  onChange={(e) => handleFieldChange("q10_personalThoughts", e.target.value)}
                  placeholder="Internal state, emotional clarity, philosophical thoughts..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Unfiltered Free-Writing Area */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Free-Writing & Stream of Consciousness
              </h3>
              <span className="text-xs text-slate-400">
                Write freely with zero filters
              </span>
            </div>
            <textarea
              rows={8}
              value={diary.freeWriting || ""}
              onChange={(e) => handleFieldChange("freeWriting", e.target.value)}
              placeholder="Dump all raw thoughts, ideas, brainstorms, or feelings here..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
