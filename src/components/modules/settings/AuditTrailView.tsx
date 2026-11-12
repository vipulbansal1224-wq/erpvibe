"use client";

import React, { useState } from "react";
import { History, ShieldCheck, Search, Filter, Lock, CheckCircle2 } from "lucide-react";
import { AuditLogEntry } from "@/types/erp";

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
}

export function AuditTrailView({ logs }: AuditTrailViewProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const filtered = logs.filter((log) => {
    const matchesSearch =
      log.recordIdentifier.toLowerCase().includes(search.toLowerCase()) ||
      log.remarks.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase());

    if (actionFilter === "all") return matchesSearch;
    return matchesSearch && log.action === actionFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <History className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              MCA Mandatory Audit Trail & Edit Log
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Complies with MCA Notification G.S.R. 235(E) and Companies (Accounts) Rules, 2014. Records immutable edit logs of every accounting entry, user IP, and timestamp. Cannot be disabled.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <Lock className="h-3.5 w-3.5" />
            Audit Trail Feature Locked (Non-disablable)
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search record, module, user, or IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Logs" },
            { id: "CREATE", label: "Created" },
            { id: "UPDATE", label: "Updated" },
            { id: "IRN_GENERATED", label: "IRN Generated" },
            { id: "EWAYBILL_CREATED", label: "e-Way Bill" },
          ].map((act) => (
            <button
              key={act.id}
              onClick={() => setActionFilter(act.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                actionFilter === act.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {act.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Timestamp (IST)</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Module</th>
                <th className="px-6 py-3">Record Identifier</th>
                <th className="px-6 py-3">User & IP Address</th>
                <th className="px-6 py-3">Audit Details & Value Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                        log.action === "IRN_GENERATED"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          : log.action === "EWAYBILL_CREATED"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : log.action === "UPDATE"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      }`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                    {log.module}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {log.recordIdentifier}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-[11px]">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{log.userName}</p>
                    <p className="text-slate-400">{log.ipAddress}</p>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 max-w-md">
                    <p>{log.remarks}</p>
                    {log.previousData && log.newData && (
                      <div className="mt-1 rounded bg-slate-100 dark:bg-slate-800 p-1.5 text-[10px] font-mono">
                        <span className="text-red-500">Old: {log.previousData}</span> →{" "}
                        <span className="text-emerald-500">New: {log.newData}</span>
                      </div>
                    )}
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
