"use client";

import React, { useState } from "react";
import {
  Cpu,
  Plus,
  ExternalLink,
  Trash2,
  Clock,
  Github,
  BookOpen,
  Code,
  Tag,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { getDateForDayNumber } from "@/lib/storage";

export function TechnicalSkillsView() {
  const {
    state,
    selectedDay,
    addTechLearning,
    deleteTechLearning,
  } = useMission();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [conceptTagInput, setConceptTagInput] = useState("");

  const selectedDateStr = getDateForDayNumber(state.settings.startDate, selectedDay);

  const [formData, setFormData] = useState<{
    topic: string;
    courseOrResource: string;
    durationMinutes: number;
    conceptsCovered: string[];
    projectWorkedOn: string;
    githubUrl: string;
    notes: string;
  }>({
    topic: "Next.js & TypeScript Architecture",
    courseOrResource: "Official Docs & Real Project",
    durationMinutes: 90,
    conceptsCovered: ["Server Components", "State Management", "Tailwind CSS"],
    projectWorkedOn: "MISSION 30 Transformation Platform",
    githubUrl: "",
    notes: "",
  });

  const handleAddConcept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conceptTagInput.trim()) return;
    if (!formData.conceptsCovered.includes(conceptTagInput.trim())) {
      setFormData({
        ...formData,
        conceptsCovered: [...formData.conceptsCovered, conceptTagInput.trim()],
      });
    }
    setConceptTagInput("");
  };

  const handleRemoveConcept = (concept: string) => {
    setFormData({
      ...formData,
      conceptsCovered: formData.conceptsCovered.filter((c) => c !== concept),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    addTechLearning({
      ...formData,
      date: selectedDateStr,
    });

    setFormData({
      topic: "",
      courseOrResource: "",
      durationMinutes: 60,
      conceptsCovered: [],
      projectWorkedOn: "",
      githubUrl: "",
      notes: "",
    });
    setIsFormOpen(false);
  };

  const learnings = state.techLearnings || [];
  const totalMinutes = learnings.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
              Technical Stack & Engineering
            </span>
            <span className="text-xs text-slate-400">
              Deep Work & Practical Coding
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Technical Skills & Project Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log architectures mastered, courses completed, and repositories built.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>{isFormOpen ? "Close Form" : "Log Learning Session"}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Tech Sessions</div>
          <div className="text-2xl font-black text-white mt-1">{learnings.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Logged sessions</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-blue-400">Cumulative Time</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{totalHours} hrs</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalMinutes} minutes</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-cyan-400">Projects Built</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {new Set(learnings.map((l) => l.projectWorkedOn).filter(Boolean)).size}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Distinct projects</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-emerald-400">Repositories Linked</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {learnings.filter((l) => l.githubUrl).length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">GitHub repos</div>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-6 border border-blue-500/30 bg-slate-900/90 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              Log Technical Learning & Build Record
            </h3>
            <span className="text-xs text-slate-400">Day {selectedDay} ({selectedDateStr})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Technology / Topic *
              </label>
              <input
                type="text"
                required
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                placeholder="e.g. Next.js App Router, Redis caching, System Design"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Course, Book, or Resource
              </label>
              <input
                type="text"
                value={formData.courseOrResource}
                onChange={(e) =>
                  setFormData({ ...formData, courseOrResource: e.target.value })
                }
                placeholder="e.g. Designing Data-Intensive Applications, Udemy, Docs"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Learning Duration (Minutes)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    durationMinutes: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Project Worked On (Optional)
              </label>
              <input
                type="text"
                value={formData.projectWorkedOn}
                onChange={(e) =>
                  setFormData({ ...formData, projectWorkedOn: e.target.value })
                }
                placeholder="e.g. E-Commerce Microservices, Portfolio"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                GitHub Repository or Live Demo URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
                placeholder="https://github.com/your-username/repo"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Concepts tags */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Key Concepts Covered
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={conceptTagInput}
                  onChange={(e) => setConceptTagInput(e.target.value)}
                  placeholder="Type a concept and click Add"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddConcept}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.conceptsCovered.map((concept, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs bg-blue-950/70 border border-blue-800 text-blue-300"
                  >
                    {concept}
                    <button
                      type="button"
                      onClick={() => handleRemoveConcept(concept)}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Technical Notes & Architecture Takeaways
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Document core insights, commands, pitfalls resolved, or performance improvements..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
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
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-slate-950 text-xs font-bold"
            >
              Save Learning Record
            </button>
          </div>
        </form>
      )}

      {/* Learning History List */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">
          Learning & Project History ({learnings.length})
        </h3>

        {learnings.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No technical learning sessions logged yet. Click "Log Learning Session" above!
          </div>
        ) : (
          <div className="space-y-3">
            {learnings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-base text-white">
                      {item.topic}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {item.courseOrResource} • {item.durationMinutes} mins • {item.date}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    <button
                      onClick={() => deleteTechLearning(item.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {item.projectWorkedOn && (
                  <div className="text-xs text-cyan-300 flex items-center gap-1.5 font-medium">
                    <Code className="w-3.5 h-3.5" />
                    <span>Project: {item.projectWorkedOn}</span>
                  </div>
                )}

                {item.conceptsCovered && item.conceptsCovered.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.conceptsCovered.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                    {item.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
