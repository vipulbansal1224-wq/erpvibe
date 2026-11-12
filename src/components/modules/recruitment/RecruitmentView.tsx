"use client";

import { useState } from "react";
import { JobCandidate } from "@/types/erp";
import {
  Users,
  Plus,
  Search,
  Star,
  Mail,
  Phone,
  Briefcase,
  CheckCircle2,
  Calendar,
  UserCheck,
  Edit,
  Trash2,
} from "lucide-react";

interface RecruitmentViewProps {
  candidates: JobCandidate[];
  onAddCandidate: (candidate: JobCandidate) => void;
  onUpdateCandidate?: (candidate: JobCandidate) => void;
  onDeleteCandidate?: (id: string) => void;
}

export function RecruitmentView({
  candidates,
  onAddCandidate,
  onUpdateCandidate,
  onDeleteCandidate,
}: RecruitmentViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [candidateName, setCandidateName] = useState("");
  const [jobRole, setJobRole] = useState("Senior Fullstack Engineer");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [experienceYears, setExperienceYears] = useState(4);
  const [stage, setStage] = useState<JobCandidate["stage"]>("Applied");
  const [rating, setRating] = useState<JobCandidate["rating"]>(4);

  const stages: JobCandidate["stage"][] = [
    "Applied",
    "Screening",
    "Technical Interview",
    "HR Round",
    "Hired",
    "Rejected",
  ];

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.jobRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStage = stageFilter === "All" || c.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const hiredCount = candidates.filter((c) => c.stage === "Hired").length;
  const interviewingCount = candidates.filter(
    (c) => c.stage === "Technical Interview" || c.stage === "HR Round"
  ).length;

  const handleOpenNew = () => {
    setEditingId(null);
    setCandidateName("");
    setEmail("");
    setPhone("+91 ");
    setStage("Applied");
    setRating(4);
    setShowModal(true);
  };

  const handleOpenEdit = (c: JobCandidate) => {
    setEditingId(c.id);
    setCandidateName(c.candidateName);
    setJobRole(c.jobRole);
    setEmail(c.email);
    setPhone(c.phone);
    setExperienceYears(c.experienceYears);
    setStage(c.stage);
    setRating(c.rating);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !email) return;
    const record: JobCandidate = {
      id: editingId || `CAND-${Date.now().toString().slice(-4)}`,
      candidateName,
      jobRole,
      email,
      phone,
      experienceYears: Number(experienceYears) || 0,
      appliedDate: new Date().toISOString().split("T")[0],
      stage,
      rating,
    };

    if (editingId && onUpdateCandidate) {
      onUpdateCandidate(record);
    } else {
      onAddCandidate(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-sky-600 to-cyan-700 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/30 text-sky-100 border border-sky-400/30">
              Talent Acquisition & ATS
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              Hiring Pipeline
            </span>
          </div>
          <h1 className="text-2xl font-bold">Recruitment & Applicant Tracking (ATS)</h1>
          <p className="text-sky-100 text-sm mt-1">
            Job Openings, Candidate Pipeline Stages, Interview Feedback & Seamless Onboarding to Payroll
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-sky-800 rounded-xl font-semibold shadow hover:bg-sky-50 transition"
        >
          <Plus className="w-5 h-5" />
          Add Candidate
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Candidates
            <Users className="w-5 h-5 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {candidates.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">In active applicant pipeline</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Active Interviews
            <Briefcase className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
            {interviewingCount}
          </div>
          <p className="text-xs text-cyan-600 mt-1">Tech & HR rounds scheduled</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Offers Accepted / Hired
            <UserCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {hiredCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Ready for PF/ESIC enrollment</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Avg. Pipeline Speed
            <Calendar className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            14 Days
          </div>
          <p className="text-xs text-indigo-600 mt-1">Screening to Offer letter</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Name, Role or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["All", ...stages].map((st) => (
            <button
              key={st}
              onClick={() => setStageFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                stageFilter === st
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:border-sky-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-base">
                    {c.candidateName}
                  </div>
                  <div className="text-xs text-sky-600 dark:text-sky-400 font-semibold">
                    {c.jobRole}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < c.rating ? "fill-amber-400" : "text-slate-300 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 rounded text-slate-400 hover:text-sky-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Edit Candidate / Change Stage"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {onDeleteCandidate && (
                    <button
                      onClick={() => onDeleteCandidate(c.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete Candidate"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.experienceYears} Years Exp • Applied {c.appliedDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  c.stage === "Hired"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : c.stage === "Rejected"
                    ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                    : c.stage === "Technical Interview" || c.stage === "HR Round"
                    ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
                    : "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300"
                }`}
              >
                {c.stage}
              </span>
              <button
                onClick={() => handleOpenEdit(c)}
                className="text-xs text-sky-600 font-semibold hover:underline"
              >
                Progress Stage →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-sky-600" />
              {editingId ? "Edit Candidate Dossier" : "Add Candidate to Pipeline"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Job Position Applied
                  </label>
                  <input
                    type="text"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Mobile Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Hiring Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rating (1-5)
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value) as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-600 text-white hover:bg-sky-700"
                >
                  {editingId ? "Update Candidate" : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
