"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Globe,
  MapPin,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Edit2,
} from "lucide-react";
import { useMission } from "@/context/MissionContext";
import { JobApplication, JobCategory, JobStatus } from "@/types";
import { getDateForDayNumber, getTodayDateString } from "@/lib/storage";

export function JobApplicationsView() {
  const {
    state,
    selectedDay,
    addJobApplication,
    updateJobApplication,
    deleteJobApplication,
  } = useMission();

  const [activeCategoryTab, setActiveCategoryTab] = useState<JobCategory>("abroad");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);

  const todayStr = getTodayDateString(state.settings.timezone || "Asia/Kolkata");

  const [formData, setFormData] = useState<{
    category: JobCategory;
    company: string;
    title: string;
    country: string;
    city: string;
    appliedDate: string;
    url: string;
    resumeVersion: string;
    status: JobStatus;
    notes: string;
    followUpDate: string;
  }>({
    category: activeCategoryTab,
    company: "",
    title: "",
    country: activeCategoryTab === "abroad" ? "Germany / Remote EU" : "India",
    city: activeCategoryTab === "abroad" ? "Berlin / Remote" : "Bengaluru",
    appliedDate: todayStr,
    url: "",
    resumeVersion: "v2.2-FullStack-2026",
    status: "Applied",
    notes: "",
    followUpDate: getDateForDayNumber(todayStr, 7),
  });

  const handleOpenAddForm = () => {
    setEditingJob(null);
    setFormData({
      category: activeCategoryTab,
      company: "",
      title: "",
      country: activeCategoryTab === "abroad" ? "United States / Remote" : "India",
      city: activeCategoryTab === "abroad" ? "Remote" : "Bengaluru",
      appliedDate: todayStr,
      url: "",
      resumeVersion: "v2.2-SoftwareEngineer",
      status: "Applied",
      notes: "",
      followUpDate: getDateForDayNumber(todayStr, 7),
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (job: JobApplication) => {
    setEditingJob(job);
    setFormData({
      category: job.category,
      company: job.company,
      title: job.title,
      country: job.country,
      city: job.city,
      appliedDate: job.appliedDate,
      url: job.url || "",
      resumeVersion: job.resumeVersion,
      status: job.status,
      notes: job.notes || "",
      followUpDate: job.followUpDate || "",
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.title.trim()) return;

    if (editingJob) {
      updateJobApplication({
        ...editingJob,
        ...formData,
      });
    } else {
      addJobApplication(formData);
    }

    setIsFormOpen(false);
    setEditingJob(null);
  };

  const allJobs = state.jobApplications || [];
  const currentCategoryJobs = allJobs.filter((j) => j.category === activeCategoryTab);

  // Statistics
  const totalApplications = allJobs.length;
  const abroadCount = allJobs.filter((j) => j.category === "abroad").length;
  const localCount = allJobs.filter((j) => j.category === "local").length;
  const appliedTodayCount = allJobs.filter((j) => j.appliedDate === todayStr).length;
  const interviewCount = allJobs.filter(
    (j) => j.status === "Interview" || j.status === "Assessment"
  ).length;
  const offerCount = allJobs.filter((j) => j.status === "Offer").length;

  // Filtered list
  const filteredJobs = currentCategoryJobs.filter((j) => {
    const matchesStatus = statusFilter === "All" || j.status === statusFilter;
    const matchesSearch =
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors: Record<JobStatus, string> = {
    Saved: "text-slate-400 bg-slate-800 border-slate-700",
    Applied: "text-blue-400 bg-blue-950/60 border-blue-800",
    Assessment: "text-amber-400 bg-amber-950/60 border-amber-800",
    Interview: "text-purple-400 bg-purple-950/60 border-purple-800",
    Offer: "text-emerald-400 bg-emerald-950/60 border-emerald-800 font-black",
    Rejected: "text-rose-400 bg-rose-950/60 border-rose-800",
    Withdrawn: "text-slate-500 bg-slate-900 border-slate-800",
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
              Career Pipeline
            </span>
            <span className="text-xs text-slate-400">
              Daily Target: 2:00–3:30 PM (Abroad) & 3:30–4:30 PM (Local)
            </span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1">
            Job Applications Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Track outbound applications, resume revisions, interviews, and follow-ups.
          </p>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-slate-400">Total Pipeline</div>
          <div className="text-2xl font-black text-white mt-1">{totalApplications}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">All applications</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-purple-400">Applied Today</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{appliedTodayCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Target: 3+ daily</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-blue-400">Abroad Roles</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{abroadCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Global / Remote</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-teal-400">Local Roles</div>
          <div className="text-2xl font-black text-teal-400 mt-1">{localCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Regional / Onsite</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-amber-400">Interviews Active</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{interviewCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Assessment & Talks</div>
        </div>

        <div className="glass-panel rounded-xl p-4 border border-slate-800">
          <div className="text-xs font-medium text-emerald-400">Offers Received</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{offerCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Wins</div>
        </div>
      </div>

      {/* Main Category Tabs: ABROAD vs LOCAL */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            setActiveCategoryTab("abroad");
            setStatusFilter("All");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
            activeCategoryTab === "abroad"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>ABROAD JOBS ({abroadCount})</span>
        </button>

        <button
          onClick={() => {
            setActiveCategoryTab("local");
            setStatusFilter("All");
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition ${
            activeCategoryTab === "local"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>LOCAL JOBS ({localCount})</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-2xl p-6 border border-purple-500/30 bg-slate-900/90 shadow-2xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              {editingJob ? "Edit Job Application" : "New Job Application Entry"}
            </h3>
            <span className="text-xs text-purple-400 uppercase font-bold">
              Category: {formData.category.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="e.g. Stripe, Google, Revolut, Flipkart"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Senior Frontend Engineer, Full Stack Developer"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Target Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="e.g. United States, Germany, Singapore, India"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                City / Remote Specification
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="e.g. Remote (Worldwide), Berlin, Bengaluru"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as JobStatus,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Resume Version
                </label>
                <input
                  type="text"
                  value={formData.resumeVersion}
                  onChange={(e) =>
                    setFormData({ ...formData, resumeVersion: e.target.value })
                  }
                  placeholder="e.g. v2.1-Frontend-Remote"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Application Date
                </label>
                <input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, appliedDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) =>
                    setFormData({ ...formData, followUpDate: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Application Link / Job Posting URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://company.com/jobs/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Notes & Recruiter Contact Details
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Referred by John on LinkedIn, emphasized performance engineering..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
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
              className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
            >
              {editingJob ? "Update Application" : "Save Application"}
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeCategoryTab} applications by company, title, or city...`}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {["All", "Applied", "Assessment", "Interview", "Offer", "Saved", "Rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === status
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Applications Cards/Table */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 text-slate-400 text-xs space-y-2">
            <p>No {activeCategoryTab} applications found matching the filter.</p>
            <button
              onClick={handleOpenAddForm}
              className="text-purple-400 font-bold hover:underline"
            >
              + Add a new application
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel rounded-xl p-4 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h4 className="font-extrabold text-base text-white">
                    {job.company}
                  </h4>
                  <span className="text-sm font-semibold text-slate-300">
                    — {job.title}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      statusColors[job.status] || "text-slate-400 bg-slate-800 border-slate-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {job.city}, {job.country}
                  </span>
                  <span>•</span>
                  <span>Applied: {job.appliedDate}</span>
                  <span>•</span>
                  <span>Resume: {job.resumeVersion}</span>
                  {job.followUpDate && (
                    <>
                      <span>•</span>
                      <span className="text-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Follow-up: {job.followUpDate}
                      </span>
                    </>
                  )}
                </div>

                {job.notes && (
                  <p className="text-xs text-slate-400 mt-1 italic">
                    "{job.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-400 transition"
                    title="Open job link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={() => handleEditClick(job)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-purple-400 transition"
                  title="Edit application"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteJobApplication(job.id)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition"
                  title="Delete application"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
