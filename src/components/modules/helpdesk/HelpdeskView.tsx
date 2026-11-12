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
  Edit,
  Trash2,
} from "lucide-react";
import { SupportTicket } from "@/types/erp";

interface HelpdeskViewProps {
  tickets: SupportTicket[];
  onAddTicket?: (ticket: SupportTicket) => void;
  onUpdateTicket?: (ticket: SupportTicket) => void;
  onDeleteTicket?: (id: string) => void;
}

export function HelpdeskView({
  tickets,
  onAddTicket,
  onUpdateTicket,
  onDeleteTicket,
}: HelpdeskViewProps) {
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [ticketNumber, setTicketNumber] = useState(`HD-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [customerName, setCustomerName] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [status, setStatus] = useState<SupportTicket["status"]>("Open");
  const [assignedAgent, setAssignedAgent] = useState("Pooja Deshmukh");
  const [slaHoursLeft, setSlaHoursLeft] = useState(8);

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());

    if (priorityFilter === "all") return matchesSearch;
    return matchesSearch && t.priority === priorityFilter;
  });

  const openTickets = tickets.filter((t) => t.status !== "Resolved").length;

  const handleOpenNew = () => {
    setEditingId(null);
    setTicketNumber(`HD-2026-${Math.floor(100 + Math.random() * 900)}`);
    setCustomerName("");
    setSubject("");
    setPriority("Medium");
    setStatus("Open");
    setSlaHoursLeft(8);
    setShowModal(true);
  };

  const handleOpenEdit = (t: SupportTicket) => {
    setEditingId(t.id);
    setTicketNumber(t.ticketNumber);
    setCustomerName(t.customerName);
    setSubject(t.subject);
    setPriority(t.priority);
    setStatus(t.status);
    setAssignedAgent(t.assignedAgent);
    setSlaHoursLeft(t.slaHoursLeft);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !subject) return;

    const record: SupportTicket = {
      id: editingId || `TCK-${Date.now()}`,
      ticketNumber,
      customerName,
      subject,
      priority,
      status,
      assignedAgent,
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      slaHoursLeft: Number(slaHoursLeft) || 0,
    };

    if (editingId && onUpdateTicket) {
      onUpdateTicket(record);
    } else if (onAddTicket) {
      onAddTicket(record);
    }
    setShowModal(false);
  };

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

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Open Tickets</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {openTickets}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Pending Resolution</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SLA Compliance Rate</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            98.5%
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Within Agreed Time</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Avg. First Response</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            18 Mins
          </p>
          <span className="text-[11px] text-blue-500 font-medium">Industry Benchmark &lt; 1hr</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Tickets (FY 26-27)</span>
            <MessageSquare className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {tickets.length}
          </p>
          <span className="text-[11px] text-slate-400">Resolved & Active</span>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket #, client, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Ticket #</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Issue / Subject</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">SLA Status</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
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
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit / Resolve Ticket"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteTicket && (
                        <button
                          onClick={() => onDeleteTicket(t.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-red-600" />
              {editingId ? "Edit / Update Helpdesk Ticket" : "Log New Support Ticket"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Ticket #
                  </label>
                  <input
                    type="text"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value="Urgent">Urgent (4hr SLA)</option>
                    <option value="High">High (8hr SLA)</option>
                    <option value="Medium">Medium (24hr SLA)</option>
                    <option value="Low">Low (48hr SLA)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Customer / Enterprise Client Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Consultancy Enterprises Ltd"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Subject / Problem Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NIC e-Way bill gateway timeout during peak dispatch"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Assigned Agent
                  </label>
                  <input
                    type="text"
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    SLA Left (Hrs)
                  </label>
                  <input
                    type="number"
                    value={slaHoursLeft}
                    onChange={(e) => setSlaHoursLeft(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                >
                  {editingId ? "Update Ticket" : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
