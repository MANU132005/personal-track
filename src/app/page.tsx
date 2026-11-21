"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav, MobileBottomBar } from "@/components/layout/MobileNav";
import { useMission } from "@/context/MissionContext";

// Views
import { DashboardView } from "@/components/views/DashboardView";
import { TodaysMissionView } from "@/components/views/TodaysMissionView";
import { CalendarView } from "@/components/views/CalendarView";
import { EnglishTrackerView } from "@/components/views/EnglishTrackerView";
import { DsaTrackerView } from "@/components/views/DsaTrackerView";
import { TechnicalSkillsView } from "@/components/views/TechnicalSkillsView";
import { JobApplicationsView } from "@/components/views/JobApplicationsView";
import { HealthFitnessView } from "@/components/views/HealthFitnessView";
import { ComfortChallengeView } from "@/components/views/ComfortChallengeView";
import { DailyDiaryView } from "@/components/views/DailyDiaryView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { WeeklyReviewsView } from "@/components/views/WeeklyReviewsView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const { activeTab } = useMission();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 animate-spin flex items-center justify-center font-black text-white text-lg">
            30
          </div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
            Loading MISSION 30 Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "mission":
        return <TodaysMissionView />;
      case "calendar":
        return <CalendarView />;
      case "english":
        return <EnglishTrackerView />;
      case "dsa":
        return <DsaTrackerView />;
      case "tech":
        return <TechnicalSkillsView />;
      case "jobs":
        return <JobApplicationsView />;
      case "health":
        return <HealthFitnessView />;
      case "comfort":
        return <ComfortChallengeView />;
      case "diary":
        return <DailyDiaryView />;
      case "analytics":
        return <AnalyticsView />;
      case "reviews":
        return <WeeklyReviewsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Drawer Menu */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Header onToggleMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <MobileBottomBar />
    </div>
  );
}
