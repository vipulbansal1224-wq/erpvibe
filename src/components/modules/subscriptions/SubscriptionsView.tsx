"use client";

import { useState } from "react";
import { SubscriptionRecord } from "@/types/erp";
import {
  Repeat,
  Plus,
  Search,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FileCheck,
  PauseCircle,
  CreditCard,
} from "lucide-react";

interface SubscriptionsViewProps {
  subscriptions: SubscriptionRecord[];
  onAddSubscription: (sub: SubscriptionRecord) => void;
}

export function SubscriptionsView({ subscriptions, onAddSubscription }: SubscriptionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [contractNo, setContractNo] = useState(`SUB/AMC/26-${Date.now().toString().slice(-3)}`);
  const [clientName, setClientName] = useState("");
  const [planName, setPlanName] = useState("Enterprise ERP AMC Support");
  const [billingFrequency, setBillingFrequency] = useState<SubscriptionRecord["billingFrequency"]>("Monthly");
  const [recurringAmount, setRecurringAmount] = useState(25000);
  const [gstRate, setGstRate] = useState(18);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextInvoiceDate, setNextInvoiceDate] = useState("2026-12-01");
  const [autoRenew, setAutoRenew] = useState(true);

  const filtered = subscriptions.filter((s) => {
    const matchSearch =
      s.contractNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate MRR (Monthly Recurring Revenue)
  const monthlyRecurringRevenue = subscriptions
    .filter((s) => s.status === "Active")
    .reduce((sum, s) => {
      if (s.billingFrequency === "Monthly") return sum + s.recurringAmount;
      if (s.billingFrequency === "Quarterly") return sum + s.recurringAmount / 3;
      if (s.billingFrequency === "Annual") return sum + s.recurringAmount / 12;
      return sum;
    }, 0);

  const activeCount = subscriptions.filter((s) => s.status === "Active").length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;
    const newRecord: SubscriptionRecord = {
      id: `SUB-${Date.now()}`,
      contractNo,
      clientName,
      planName,
      billingFrequency,
      recurringAmount: Number(recurringAmount) || 0,
      gstRate: Number(gstRate) || 18,
      startDate,
      nextInvoiceDate,
      autoRenew,
      status: "Active",
    };
    onAddSubscription(newRecord);
    setShowModal(false);
    setClientName("");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-purple-700 to-violet-800 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-100 border border-purple-400/30">
              SaaS & Recurring Billing
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              Automated Invoicing Engine
            </span>
          </div>
          <h1 className="text-2xl font-bold">Subscriptions & AMC Contracts</h1>
          <p className="text-purple-100 text-sm mt-1">
            Manage Software SaaS Subscriptions, Hardware Annual Maintenance Contracts (AMC), MRR & Auto GST Billing
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-purple-800 rounded-xl font-semibold shadow hover:bg-purple-50 transition"
        >
          <Plus className="w-5 h-5" />
          Create Contract
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Monthly Recurring (MRR)
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-2">
            ₹{Math.round(monthlyRecurringRevenue).toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-purple-600 mt-1">Predictable recurring stream</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Active Subscriptions
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {activeCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Live client contracts</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Contract Value
            <DollarSign className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            ₹
            {subscriptions
              .reduce((sum, s) => sum + s.recurringAmount, 0)
              .toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500 mt-1">Sum of active billings</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Renewal Rate
            <Repeat className="w-5 h-5 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">96.8%</div>
          <p className="text-xs text-emerald-600 mt-1">Annual client retention</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Contract #, Client or Plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Active", "Paused", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab
                  ? "bg-purple-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Contract # / Start</th>
                <th className="py-3 px-4">Client & Plan</th>
                <th className="py-3 px-4">Frequency</th>
                <th className="py-3 px-4">Recurring Fee (+GST)</th>
                <th className="py-3 px-4">Next Billing Date</th>
                <th className="py-3 px-4">Auto Renew</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {s.contractNo}
                    </div>
                    <div className="text-xs text-slate-500">Since {s.startDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {s.clientName}
                    </div>
                    <div className="text-xs text-purple-600 font-medium">{s.planName}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {s.billingFrequency}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      ₹{s.recurringAmount.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-slate-500">+{s.gstRate}% GST</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      {s.nextInvoiceDate}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {s.autoRenew ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Enabled
                      </span>
                    ) : (
                      <span className="text-slate-400">Manual</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        s.status === "Active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : s.status === "Paused"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No subscription contracts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              New Subscription Contract
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Contract Reference #
                  </label>
                  <input
                    type="text"
                    value={contractNo}
                    onChange={(e) => setContractNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={billingFrequency}
                    onChange={(e) => setBillingFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Client / Customer Name
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

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Plan / Service Package
                </label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Recurring Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={recurringAmount}
                    onChange={(e) => setRecurringAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    GST Rate (%)
                  </label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value={18}>18% (SAC Standard)</option>
                    <option value={12}>12%</option>
                    <option value={5}>5%</option>
                    <option value={0}>0% (Export / Exempt)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Contract Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Next Invoice Date
                  </label>
                  <input
                    type="date"
                    value={nextInvoiceDate}
                    onChange={(e) => setNextInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="autoRenew"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="rounded text-purple-600 focus:ring-purple-500 h-4 w-4"
                />
                <label htmlFor="autoRenew" className="text-xs text-slate-700 dark:text-slate-300">
                  Enable automated recurring invoice creation & email to client
                </label>
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
