"use client";

import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Languages,
  Code2,
  Briefcase,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { calculateDayCompletion, getDateForDayNumber } from "@/lib/storage";

export function AnalyticsView() {
  const { state, currentDay } = useMission();

  const totalDays = state.settings.totalDays;

  // 1. Daily Completion Chart Data (Day 1 to totalDays)
  const dailyCompletionData = useMemo(() => {
    return Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
      const rec = state.dayRecords[dayNum];
      const completion = calculateDayCompletion(rec, state.timetable);
      const isFuture = dayNum > currentDay;
      return {
        day: `D${dayNum}`,
        completion: isFuture ? 0 : completion,
        isFuture,
      };
    });
  }, [state.dayRecords, state.timetable, totalDays, currentDay]);

  // 2. Weekly Completion Data (Week 1, Week 2, etc.)
  const weeklyCompletionData = useMemo(() => {
    const weeksCount = Math.ceil(totalDays / 7);
    return Array.from({ length: weeksCount }, (_, i) => i + 1).map((wNum) => {
      const startD = (wNum - 1) * 7 + 1;
      const endD = Math.min(wNum * 7, totalDays);
      let totalComp = 0;
      let countedDays = 0;

      for (let d = startD; d <= endD; d++) {
        if (d <= currentDay) {
          totalComp += calculateDayCompletion(state.dayRecords[d], state.timetable);
          countedDays++;
        }
      }

      const avg = countedDays > 0 ? Math.round(totalComp / countedDays) : 0;
      return {
        week: `Week ${wNum}`,
        averageCompletion: avg,
        days: `${startD}-${endD}`,
      };
    });
  }, [state.dayRecords, state.timetable, totalDays, currentDay]);

  // 3. English Minutes Trend Data
  const englishHoursData = useMemo(() => {
    return Array.from({ length: currentDay }, (_, i) => i + 1).map((dayNum) => {
      const eng = state.dayRecords[dayNum]?.english;
      const speaking = eng?.speakingMinutes || 0;
      const listening = eng?.listeningMinutes || 0;
      const pronunciation = eng?.pronunciationMinutes || 0;
      return {
        day: `D${dayNum}`,
        speaking,
        listening,
        pronunciation,
        totalHours: parseFloat(((speaking + listening + pronunciation) / 60).toFixed(1)),
      };
    });
  }, [state.dayRecords, currentDay]);

  // 4. DSA Solved by Difficulty
  const dsaDifficultyData = useMemo(() => {
    const problems = state.dsaProblems || [];
    const easy = problems.filter((p) => p.difficulty === "Easy" && p.status === "Solved").length;
    const medium = problems.filter((p) => p.difficulty === "Medium" && p.status === "Solved").length;
    const hard = problems.filter((p) => p.difficulty === "Hard" && p.status === "Solved").length;

    return [
      { name: "Easy", count: easy, color: "#10b981" },
      { name: "Medium", count: medium, color: "#f59e0b" },
      { name: "Hard", count: hard, color: "#ef4444" },
    ];
  }, [state.dsaProblems]);

  // 5. Job Applications Status Breakdown
  const jobStatusData = useMemo(() => {
    const jobs = state.jobApplications || [];
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      counts[j.status] = (counts[j.status] || 0) + 1;
    });

    const colors: Record<string, string> = {
      Applied: "#3b82f6",
      Assessment: "#f59e0b",
      Interview: "#a855f7",
      Offer: "#10b981",
      Saved: "#64748b",
      Rejected: "#f43f5e",
      Withdrawn: "#475569",
    };

    return Object.entries(counts).map(([status, count]) => ({
      name: status,
      value: count,
      color: colors[status] || "#94a3b8",
    }));
  }, [state.jobApplications]);

  // 6. Habit Completion Breakdown (Calculated Transparently)
  const habitCompletionStats = useMemo(() => {
    const counts: Record<string, { completed: number; scheduled: number }> = {};
    state.timetable.forEach((act) => {
      counts[act.activity] = { completed: 0, scheduled: 0 };
    });

    for (let d = 1; d <= currentDay; d++) {
      const rec = state.dayRecords[d];
      state.timetable.forEach((act) => {
        counts[act.activity].scheduled += 1;
        if (rec?.activities?.[act.id]?.completed) {
          counts[act.activity].completed += 1;
        }
      });
    }

    return Object.entries(counts).map(([name, { completed, scheduled }]) => ({
      name,
      percentage: scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0,
      completed,
      scheduled,
    }));
  }, [state.timetable, state.dayRecords, currentDay]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              Data-Driven Growth
            </span>
            <span className="text-xs text-slate-400">
              100% Real Records • Transparent Formulas
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Progress Analytics & Transformation Telemetry
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent metrics tracking completion rates, learning hours, problems, and pipeline.
          </p>
        </div>
      </div>

      {/* 1. Daily Completion Trend Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Daily Habit Completion Trend (% per Day)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target is 70%+ daily completion across all 24 scheduled activities
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyCompletionData}>
              <defs>
                <linearGradient id="completionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="completion"
                name="Completion %"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#completionGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. English Hours & Weekly Average Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* English Practice Hours */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-400" />
              English Speaking & Listening Hours
            </h3>
            <span className="text-xs text-blue-400 font-semibold">Goal: 2.0 hrs/day</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={englishHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="totalHours" name="Hours Practiced" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Completion Comparison */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Weekly Average Completion
            </h3>
            <span className="text-xs text-slate-400">7-Day Aggregates</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 10 }} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="averageCompletion" name="Avg Completion %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. DSA Solved & Job Application Pipelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DSA Difficulty Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Code2 className="w-4 h-4 text-emerald-400" />
            DSA Problems Solved by Difficulty
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            {dsaDifficultyData.every((d) => d.count === 0) ? (
              <div className="text-xs text-slate-500 text-center">
                No DSA problems recorded yet. Log problems in the DSA Practice tab!
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dsaDifficultyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Problems Solved" radius={[0, 4, 4, 0]}>
                    {dsaDifficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Job Applications Breakdown */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-purple-400" />
            Job Applications by Status
          </h3>

          <div className="h-56 w-full flex items-center justify-center">
            {jobStatusData.length === 0 ? (
              <div className="text-xs text-slate-500 text-center">
                No job applications recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={jobStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {jobStatusData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 4. Individual Habit Consistency Ratios */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-white text-base">
              Individual Habit Execution Rate (Days 1 to {currentDay})
            </h3>
            <p className="text-xs text-slate-400">
              Formula: Completed Scheduled Days / Total Elapsed Days
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habitCompletionStats.map((habit, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 truncate pr-2">
                  {habit.name}
                </span>
                <span className="font-bold text-cyan-400 shrink-0">
                  {habit.percentage}% ({habit.completed}/{habit.scheduled})
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                  style={{ width: `${habit.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
