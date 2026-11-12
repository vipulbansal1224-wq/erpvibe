"use client";

import { useState } from "react";
import { ExpenseClaim } from "@/types/erp";
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Check,
  Fuel,
  Briefcase,
  UtensilsCrossed,
  FileCheck,
  Edit,
  Trash2,
} from "lucide-react";

interface ExpensesViewProps {
  claims: ExpenseClaim[];
  onAddClaim: (claim: ExpenseClaim) => void;
  onUpdateClaim?: (claim: ExpenseClaim) => void;
  onDeleteClaim?: (id: string) => void;
}

export function ExpensesView({
  claims,
  onAddClaim,
  onUpdateClaim,
  onDeleteClaim,
}: ExpensesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [claimNo, setClaimNo] = useState(`EXP/NOV/${Date.now().toString().slice(-3)}`);
  const [employeeName, setEmployeeName] = useState("");
  const [category, setCategory] = useState<ExpenseClaim["category"]>("Travel & Fuel");
  const [amount, setAmount] = useState(2500);
  const [merchantName, setMerchantName] = useState("");
  const [taxInvoiceAvailable, setTaxInvoiceAvailable] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<ExpenseClaim["paymentStatus"]>("Pending Approval");

  const filtered = claims.filter((c) => {
    const matchSearch =
      c.claimNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || c.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalClaimed = claims.reduce((sum, c) => sum + c.amount, 0);
  const totalApproved = claims
    .filter((c) => c.paymentStatus === "Approved" || c.paymentStatus === "Reimbursed / Paid")
    .reduce((sum, c) => sum + c.amount, 0);
  const pendingCount = claims.filter((c) => c.paymentStatus === "Pending Approval").length;

  const handleOpenNew = () => {
    setEditingId(null);
    setClaimNo(`EXP/NOV/${Date.now().toString().slice(-3)}`);
    setEmployeeName("");
    setMerchantName("");
    setAmount(2500);
    setPaymentStatus("Pending Approval");
    setShowModal(true);
  };

  const handleOpenEdit = (c: ExpenseClaim) => {
    setEditingId(c.id);
    setClaimNo(c.claimNo);
    setEmployeeName(c.employeeName);
    setCategory(c.category);
    setAmount(c.amount);
    setMerchantName(c.merchantName);
    setTaxInvoiceAvailable(c.taxInvoiceAvailable);
    setPaymentStatus(c.paymentStatus);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeName || !merchantName) return;
    const record: ExpenseClaim = {
      id: editingId || `EXP-${Date.now()}`,
      claimNo,
      employeeName,
      category,
      expenseDate: new Date().toISOString().split("T")[0],
      amount: Number(amount) || 0,
      merchantName,
      taxInvoiceAvailable,
      paymentStatus,
      approvedBy: paymentStatus !== "Pending Approval" ? "Finance Admin" : undefined,
    };

    if (editingId && onUpdateClaim) {
      onUpdateClaim(record);
    } else {
      onAddClaim(record);
    }
    setShowModal(false);
  };

  const getCategoryIcon = (cat: ExpenseClaim["category"]) => {
    switch (cat) {
      case "Travel & Fuel":
        return <Fuel className="w-4 h-4 text-blue-500" />;
      case "Client Hospitality":
        return <Briefcase className="w-4 h-4 text-purple-500" />;
      case "Lodging & Food":
        return <UtensilsCrossed className="w-4 h-4 text-amber-500" />;
      default:
        return <Receipt className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-rose-600 to-pink-700 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/30 text-rose-100 border border-rose-400/30">
              Employee Reimbursements
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              GST ITC Expense Claims
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Employee Expenses & Claims</h1>
          <p className="text-rose-100 text-sm mt-1">
            Staff Travel, Fuel, Client Entertainment, Out-of-Pocket Claims & Automated Payroll Reconciliations
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-rose-800 rounded-xl font-semibold shadow hover:bg-rose-50 transition"
        >
          <Plus className="w-5 h-5" />
          Submit Claim
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Claims
            <Receipt className="w-5 h-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            ₹{totalClaimed.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500 mt-1">{claims.length} total vouchers</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Pending Approval
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {pendingCount}
          </div>
          <p className="text-xs text-amber-600 mt-1">Awaiting manager sign-off</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Approved & Disbursed
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            ₹{totalApproved.toLocaleString("en-IN")}
          </div>
          <p className="text-xs text-slate-500 mt-1">Cleared for bank transfer</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            GST ITC Eligible
            <FileCheck className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {claims.filter((c) => c.taxInvoiceAvailable).length}
          </div>
          <p className="text-xs text-indigo-600 mt-1">With valid GST invoice attached</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Voucher #, Employee or Merchant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Pending Approval", "Approved", "Reimbursed / Paid"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Claim # / Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Merchant / Purpose</th>
                <th className="py-3 px-4">Tax Invoice</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {c.claimNo}
                    </div>
                    <div className="text-xs text-slate-500">{c.expenseDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {c.employeeName}
                    </div>
                    {c.approvedBy && (
                      <div className="text-xs text-slate-400">By: {c.approvedBy}</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                      {getCategoryIcon(c.category)}
                      {c.category}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {c.merchantName}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    {c.taxInvoiceAvailable ? (
                      <span className="text-emerald-600 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> GST Invoice
                      </span>
                    ) : (
                      <span className="text-slate-400">Cash Slip</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white">
                    ₹{c.amount.toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.paymentStatus === "Reimbursed / Paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : c.paymentStatus === "Approved"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      }`}
                    >
                      {c.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit Claim"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteClaim && (
                        <button
                          onClick={() => onDeleteClaim(c.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Claim"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 text-sm">
                    No expense claims found.
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
              <Receipt className="w-5 h-5 text-rose-600" />
              {editingId ? "Edit Expense Claim / Approval" : "Submit Employee Expense Claim"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Voucher Number
                  </label>
                  <input
                    type="text"
                    value={claimNo}
                    onChange={(e) => setClaimNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Travel & Fuel">Travel & Fuel</option>
                    <option value="Client Hospitality">Client Hospitality</option>
                    <option value="Lodging & Food">Lodging & Food</option>
                    <option value="Office Supplies">Office Supplies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Employee Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Patil (Field Tech)"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Merchant / Vendor & Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indian Oil Petrol Pump / Hotel Taj Meeting"
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Claim Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment / Approval Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Approved">Approved</option>
                    <option value="Reimbursed / Paid">Reimbursed / Paid</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={taxInvoiceAvailable}
                    onChange={(e) => setTaxInvoiceAvailable(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                  GST Tax Invoice Attached (Eligible for Corporate ITC)
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-rose-600 text-white hover:bg-rose-700"
                >
                  {editingId ? "Update Claim" : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
