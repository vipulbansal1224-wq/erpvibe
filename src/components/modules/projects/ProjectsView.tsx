"use client";

import React, { useState } from "react";
import {
  FolderKanban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  TrendingUp,
  User,
  Calendar,
  Edit,
  Trash2,
} from "lucide-react";
import { Project, TimesheetEntry } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface ProjectsViewProps {
  projects: Project[];
  timesheets: TimesheetEntry[];
  onAddProject?: (project: Project) => void;
  onUpdateProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
}

export function ProjectsView({
  projects,
  timesheets,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
}: ProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "timesheets">("projects");
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState(`PRJ-${Date.now().toString().slice(-4)}`);
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [budget, setBudget] = useState(500000);
  const [spentAmount, setSpentAmount] = useState(0);
  const [status, setStatus] = useState<Project["status"]>("In Progress");

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spentAmount, 0);
  const totalLoggedHours = timesheets.reduce((sum, t) => sum + t.hours, 0);

  const handleOpenNew = () => {
    setEditingId(null);
    setCode(`PRJ-${Date.now().toString().slice(-4)}`);
    setName("");
    setClientName("");
    setBudget(500000);
    setSpentAmount(0);
    setStatus("In Progress");
    setShowModal(true);
  };

  const handleOpenEdit = (p: Project) => {
    setEditingId(p.id);
    setCode(p.code);
    setName(p.name);
    setClientName(p.clientName);
    setBudget(p.budget);
    setSpentAmount(p.spentAmount);
    setStatus(p.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !clientName) return;

    const record: Project = {
      id: editingId || `PRJ-${Date.now()}`,
      code,
      name,
      clientName,
      startDate: new Date().toISOString().split("T")[0],
      deadline: "2026-12-31",
      budget: Number(budget) || 0,
      spentAmount: Number(spentAmount) || 0,
      status,
      tasks: selectedProject?.tasks || [
        { id: "TSK-01", title: "Project Initiation & Kickoff", assignedTo: "Aditya Patil", status: "Done", priority: "High", estimatedHours: 40, loggedHours: 40 },
        { id: "TSK-02", title: "Execution & Testing Phase", assignedTo: "Rajesh Sharma", status: "In Progress", priority: "Medium", estimatedHours: 80, loggedHours: 35 },
      ],
    };

    if (editingId && onUpdateProject) {
      onUpdateProject(record);
    } else if (onAddProject) {
      onAddProject(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FolderKanban className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Project Management & Timesheets
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Client project budgets, milestones, task assignments, and billable timesheet logging.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Projects Budget</span>
            <FolderKanban className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalBudget)}
          </p>
          <span className="text-[11px] text-slate-400">{projects.length} Total Client Projects</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Cost Incurred / Spent</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalSpent)}
          </p>
          <span className="text-[11px] text-purple-600 font-medium">
            {Math.round((totalSpent / totalBudget) * 100)}% of Allocation
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Billable Hours Logged</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {totalLoggedHours} Hrs
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">In Timesheets</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Deliverables</span>
            <CheckCircle2 className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {projects.filter((p) => p.status === "In Progress").length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">SLA Milestones Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "projects"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          Project Portfolio ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab("timesheets")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "timesheets"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Clock className="h-4 w-4" />
          Timesheet Logs ({timesheets.length})
        </button>
      </div>

      {activeTab === "projects" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedProject?.id === proj.id
                    ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800/90 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      {proj.code}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                      {proj.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{proj.clientName}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 text-[10px] font-bold">
                      {proj.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(proj);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Edit Project"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    {onDeleteProject && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete Project"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Budget Spent:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(proj.spentAmount)} / {formatINR(proj.budget)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600"
                      style={{ width: `${Math.min(100, (proj.spentAmount / proj.budget) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedProject && (
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-600">{selectedProject.code}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedProject.name}
                  </h3>
                  <p className="text-xs text-slate-500">Client: {selectedProject.clientName}</p>
                </div>
                <button
                  onClick={() => handleOpenEdit(selectedProject)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit Project Budget
                </button>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Task Execution & Milestones
                </h4>
                <div className="space-y-2">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full ${task.status === "Done" ? "bg-emerald-500" : "bg-blue-500"}`} />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                          <p className="text-[10px] text-slate-400">Assigned: {task.assignedTo}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${task.status === "Done" ? "bg-emerald-100 text-emerald-800" : "bg-blue-100 text-blue-800"}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Project Code</th>
                  <th className="px-6 py-3">Team Member</th>
                  <th className="px-6 py-3">Activity Description</th>
                  <th className="px-6 py-3 text-right">Hours Logged</th>
                  <th className="px-6 py-3 text-right">Billing Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {timesheets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {t.date}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-blue-600">
                      {t.projectName}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {t.employeeName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300">
                      {t.taskTitle} <span className="text-xs text-slate-400">({t.remarks})</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right font-bold text-slate-900 dark:text-white">
                      {t.hours} hrs
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right font-semibold text-emerald-600">
                      {t.billable ? "Billable Client Hours" : "Internal R&D"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Project Contract" : "Initialize New Client Project"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Project Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ERP Cloud Integration Phase 2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Client / Enterprise Customer *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Consultancy Enterprises Ltd"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Total Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Current Cost Spent (₹)
                  </label>
                  <input
                    type="number"
                    value={spentAmount}
                    onChange={(e) => setSpentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                  />
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Project" : "Launch Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
