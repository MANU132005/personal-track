"use client";

import React from "react";
import {
  Activity,
  Heart,
  Droplets,
  Sparkles,
  Sun,
  Moon,
  Plus,
  Minus,
  CheckCircle2,
  Apple,
  Footprints,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";

export function HealthFitnessView() {
  const {
    state,
    selectedDay,
    currentDay,
    updateHealth,
  } = useMission();

  const currentRecord = state.dayRecords[selectedDay];
  const health = currentRecord?.health || {
    runningMinutes: 0,
    runningDistanceKm: 0,
    walkingMinutes: 0,
    stretchingDone: false,
    runningNotes: "",
    breakfastDone: false,
    lunchDone: false,
    dinnerDone: false,
    waterGlasses: 0,
    fruitVegIntake: false,
    nutritionNotes: "",
    morningSkincare: false,
    sunscreenApplied: false,
    nightSkincare: false,
    skincareNotes: "",
  };

  const waterTarget = state.settings.waterTargetGlasses || 10;
  const waterPercentage = Math.min(100, Math.round(((health.waterGlasses || 0) / waterTarget) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-400 border border-teal-800">
              Vitality & Discipline
            </span>
            <span className="text-xs text-slate-400">
              Running, Nutrition & Skincare Routine
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Health, Fitness & Skincare Dashboard
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Logging daily physical vitality for <strong>Day {selectedDay}</strong>
            {selectedDay === currentDay ? " (Today)" : ""}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. RUNNING & CARDIO */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Running & Stretching
              </h3>
              <p className="text-[11px] text-slate-400">6:45–7:30 AM Slot</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Running Duration (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={health.runningMinutes || 0}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      runningMinutes: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">minutes</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Distance (Kilometers, Optional)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={0.5}
                  value={health.runningDistanceKm || 0}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      runningDistanceKm: Math.max(0, parseFloat(e.target.value) || 0),
                    })
                  }
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">km</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Walking Duration (Minutes)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={health.walkingMinutes || 0}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      walkingMinutes: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs text-slate-400">minutes</span>
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={health.stretchingDone || false}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    stretchingDone: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-slate-200">
                Post-run Stretching Completed
              </span>
            </label>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Running & Energy Notes
              </label>
              <textarea
                rows={2}
                value={health.runningNotes || ""}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    runningNotes: e.target.value,
                  })
                }
                placeholder="Felt strong, good breathing rhythm..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* 2. NUTRITION & HYDRATION */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800 text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Nutrition & Hydration
              </h3>
              <p className="text-[11px] text-slate-400">Clean fuel for sustained focus</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* Water Counter */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-cyan-400" />
                  Water Intake: {health.waterGlasses || 0} / {waterTarget} Glasses
                </span>
                <span className="text-xs font-bold text-cyan-400">
                  {((health.waterGlasses || 0) * 0.25).toFixed(1)} L
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() =>
                    updateHealth(selectedDay, {
                      waterGlasses: Math.max(0, (health.waterGlasses || 0) - 1),
                    })
                  }
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-white">
                  {health.waterGlasses || 0} Glasses (250ml each)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateHealth(selectedDay, {
                      waterGlasses: (health.waterGlasses || 0) + 1,
                    })
                  }
                  className="p-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Meals Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={health.breakfastDone || false}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      breakfastDone: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Healthy Breakfast (8:00–8:30 AM)
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={health.lunchDone || false}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      lunchDone: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Balanced Lunch (1:00–2:00 PM)
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={health.dinnerDone || false}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      dinnerDone: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-cyan-500 bg-slate-950 border-slate-700 focus:ring-cyan-500"
                />
                <span className="text-xs font-semibold text-slate-200">
                  Light Dinner (7:30–8:00 PM)
                </span>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={health.fruitVegIntake || false}
                  onChange={(e) =>
                    updateHealth(selectedDay, {
                      fruitVegIntake: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-slate-700 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Apple className="w-3.5 h-3.5 text-emerald-400" />
                  Fruits & Fresh Vegetables Consumed
                </span>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Meal Notes
              </label>
              <textarea
                rows={2}
                value={health.nutritionNotes || ""}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    nutritionNotes: e.target.value,
                  })
                }
                placeholder="High protein, zero junk food today..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* 3. SKINCARE DISCIPLINE */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <div className="p-2 rounded-xl bg-teal-950/60 border border-teal-800 text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Skincare Discipline
              </h3>
              <p className="text-[11px] text-slate-400">Personal grooming and care</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={health.morningSkincare || false}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    morningSkincare: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-teal-500 bg-slate-950 border-slate-700 focus:ring-teal-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Morning Skincare (7:30–8:00 AM)
                </span>
                <span className="text-[10px] text-slate-400">
                  Gentle cleanser + moisturizer
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={health.sunscreenApplied || false}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    sunscreenApplied: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Sunscreen Applied (SPF 50+)
                </span>
                <span className="text-[10px] text-slate-400">
                  Crucial UV protection before stepping out
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
              <input
                type="checkbox"
                checked={health.nightSkincare || false}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    nightSkincare: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-indigo-500 bg-slate-950 border-slate-700 focus:ring-indigo-500"
              />
              <div>
                <span className="text-xs font-semibold text-slate-200 block flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  Night Skincare (10:20–10:35 PM)
                </span>
                <span className="text-[10px] text-slate-400">
                  Night wash + hydrating night cream
                </span>
              </div>
            </label>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Skincare Notes
              </label>
              <textarea
                rows={3}
                value={health.skincareNotes || ""}
                onChange={(e) =>
                  updateHealth(selectedDay, {
                    skincareNotes: e.target.value,
                  })
                }
                placeholder="Skin feeling hydrated, no irritation..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
