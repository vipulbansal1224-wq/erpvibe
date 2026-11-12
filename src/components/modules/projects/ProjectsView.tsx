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
} from "lucide-react";
import { Project, TimesheetEntry } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface ProjectsViewProps {
  projects: Project[];
  timesheets: TimesheetEntry[];
}

export function ProjectsView({ projects, timesheets }: ProjectsViewProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "timesheets">("projects");
  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spentAmount, 0);
  const totalLoggedHours = timesheets.reduce((sum, t) => sum + t.hours, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FolderKanban className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Project Management & Timesheets
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Client project budgets, milestones, task assignments, and billable timesheet logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Clock className="h-4 w-4" />
            {totalLoggedHours} Hours Logged
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Project Budgets</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatINR(totalBudget)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{projects.length} Active Client Projects</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Cost Incurred / Spent</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {formatINR(totalSpent)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {Math.round((totalSpent / totalBudget) * 100)}% of Allocated Budget
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Project Margin / Profit</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalBudget - totalSpent)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Projected Realization</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "projects"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <FolderKanban className="h-4 w-4" />
          Projects & Tasks
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
          {/* Projects List */}
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
                  <span className="rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 text-[10px] font-bold">
                    {proj.status}
                  </span>
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

          {/* Project Details & Task List */}
          {selectedProject && (
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedProject.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client: <strong>{selectedProject.clientName}</strong> | Deadline:{" "}
                    <strong>{selectedProject.deadline}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Total Budget</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {formatINR(selectedProject.budget)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Project Tasks & Milestones
                </h4>
                <div className="space-y-2">
                  {selectedProject.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs"
                    >
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                        <p className="text-[11px] text-slate-500">
                          Assigned to: <span className="font-medium text-slate-700 dark:text-slate-300">{task.assignedTo}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {task.loggedHours} / {task.estimatedHours} hrs
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            task.status === "Done"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : task.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </div>
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
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Task & Remarks</th>
                  <th className="px-6 py-3">Hours</th>
                  <th className="px-6 py-3">Billable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {timesheets.map((ts) => (
                  <tr key={ts.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {ts.date}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {ts.employeeName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium">
                      {ts.projectName}
                    </td>
                    <td className="px-6 py-3.5 max-w-md">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{ts.taskTitle}</p>
                      <p className="text-[11px] text-slate-500">{ts.remarks}</p>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {ts.hours} hrs
                    </td>
                    <td className="px-6 py-3.5">
                      {ts.billable ? (
                        <span className="rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 text-[10px]">
                          Non-Billable
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
