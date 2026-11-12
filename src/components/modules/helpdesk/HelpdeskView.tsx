"use client";

import React, { useState } from "react";
import {
  LifeBuoy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  MessageSquare,
} from "lucide-react";
import { SupportTicket } from "@/types/erp";

interface HelpdeskViewProps {
  tickets: SupportTicket[];
}

export function HelpdeskView({ tickets }: HelpdeskViewProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());

    if (priorityFilter === "all") return matchesSearch;
    return matchesSearch && t.priority === priorityFilter;
  });

  const openTickets = tickets.filter((t) => t.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
              <LifeBuoy className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Customer Support & Helpdesk Tickets
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enterprise SLA management, issue resolution tracking, and client satisfaction metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
            <Clock className="h-4 w-4" />
            {openTickets} Open Issues
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search ticket, customer, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {["all", "High", "Medium", "Low"].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`rounded-lg px-3 py-1 font-medium capitalize transition-colors ${
                priorityFilter === p
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {p} Priority
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Ticket #</th>
                <th className="px-6 py-3">Client / Organization</th>
                <th className="px-6 py-3">Issue Subject</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">SLA Status</th>
                <th className="px-6 py-3">Assigned Agent</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {t.ticketNumber}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {t.customerName}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200 max-w-md">
                    {t.subject}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        t.priority === "High" || t.priority === "Urgent"
                          ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          : t.priority === "Medium"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[11px]">
                    {t.slaHoursLeft > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        {t.slaHoursLeft}h Remaining
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400">SLA Met</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    {t.assignedAgent}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        t.status === "Resolved"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : t.status === "In Progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {t.status === "Resolved" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
