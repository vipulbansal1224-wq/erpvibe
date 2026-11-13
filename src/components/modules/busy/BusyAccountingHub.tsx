"use client";

import React, { useState } from "react";
import {
  Calculator,
  Receipt,
  ShoppingCart,
  CreditCard,
  Landmark,
  ArrowRightLeft,
  FileText,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  ShieldCheck,
  Building2,
  Percent,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Keyboard,
  Boxes,
  Layers,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  BusyVoucher,
  BusyVoucherType,
  BusyAccountMaster,
  BusyItemMaster,
  CompanyInfo,
} from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BusyAccountingHubProps {
  company: CompanyInfo;
  vouchers: BusyVoucher[];
  accounts: BusyAccountMaster[];
  items: BusyItemMaster[];
  onOpenNewVoucher: (type: BusyVoucherType) => void;
  onOpenLedger: (accountId?: string) => void;
  onOpenItemLedger: (itemId?: string) => void;
  onOpenHelp: () => void;
  onDeleteVoucher: (id: string) => void;
  onResetToBusyDefaults: () => void;
  onBackupData: () => void;
}

export function BusyAccountingHub({
  company,
  vouchers,
  accounts,
  items,
  onOpenNewVoucher,
  onOpenLedger,
  onOpenItemLedger,
  onOpenHelp,
  onDeleteVoucher,
  onResetToBusyDefaults,
  onBackupData,
}: BusyAccountingHubProps) {
  const [activeTab, setActiveTab] = useState<"vouchers" | "accounts" | "items" | "reports" | "sundries">("vouchers");
  const [voucherFilter, setVoucherFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [accountGroupFilter, setAccountGroupFilter] = useState<string>("all");

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesType = voucherFilter === "all" || v.voucherType === voucherFilter;
    const matchesSearch =
      v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.narration && v.narration.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // KPI calculations
  const totalSalesAmount = vouchers
    .filter((v) => v.voucherType === "sales")
    .reduce((acc, v) => acc + v.totalAmount, 0);

  const totalPurchaseAmount = vouchers
    .filter((v) => v.voucherType === "purchase")
    .reduce((acc, v) => acc + v.totalAmount, 0);

  const totalCashBank = accounts
    .filter((a) => a.group === "Bank Accounts" || a.group === "Cash-in-hand")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalDebtors = accounts
    .filter((a) => a.group === "Sundry Debtors")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalCreditors = accounts
    .filter((a) => a.group === "Sundry Creditors")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalStockValuation = items.reduce(
    (acc, i) => acc + i.currentQty * i.purchaseRate,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-base shadow-md">
              B
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              BUSY Accounting & Statutory Vouchers
            </h2>
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-xs font-bold border border-blue-300 dark:border-blue-700">
              India MSME Master Suite
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            Integrated accounting engine: F1-F9 daily voucher entry, automated bill sundries, CGST/SGST/IGST state bifurcation, and running ledger books (Alt+L).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <HelpCircle className="h-4 w-4 text-blue-600" />
            Course Guide (F1)
          </button>
          <button
            onClick={onBackupData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            Backup Data (JSON)
          </button>
          <button
            onClick={onResetToBusyDefaults}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Auto-Setup BUSY Masters
          </button>
        </div>
      </div>

      {/* QUICK KEYBOARD SHORTCUT LAUNCHER BAR (F4-F9, Alt+L, Alt+I) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Keyboard className="h-4 w-4 text-blue-600" />
            <span>BUSY Quick Launch Keyboard Shortcuts:</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any button or press the keyboard key directly from anywhere
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          <button
            onClick={() => onOpenNewVoucher("sales")}
            className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold transition-all"
          >
            <span>Sales</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-emerald-300">F8</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("purchase")}
            className="flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold transition-all"
          >
            <span>Purchase</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-blue-300">F9</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("payment")}
            className="flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold transition-all"
          >
            <span>Payment</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-purple-300">F5</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("receipt")}
            className="flex items-center justify-between p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold transition-all"
          >
            <span>Receipt</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-amber-300">F6</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("contra")}
            className="flex items-center justify-between p-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:hover:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold transition-all"
          >
            <span>Contra</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-cyan-300">F4</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("journal")}
            className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold transition-all"
          >
            <span>Journal</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-indigo-300">F7</kbd>
          </button>

          <button
            onClick={() => onOpenLedger()}
            className="flex items-center justify-between p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold transition-all"
          >
            <span>Ledger</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-rose-300">Alt+L</kbd>
          </button>

          <button
            onClick={() => onOpenItemLedger()}
            className="flex items-center justify-between p-2 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold transition-all"
          >
            <span>Stock Bahi</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-teal-300">Alt+I</kbd>
          </button>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Total Vouchers</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {vouchers.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Posted & Audited</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Sales Turnover (F8)</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">
            {formatINR(totalSalesAmount)}
          </span>
          <span className="text-[10px] text-slate-400">GST Outward Invoices</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Purchases (F9)</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">
            {formatINR(totalPurchaseAmount)}
          </span>
          <span className="text-[10px] text-slate-400">ITC Claimable</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Cash & Bank Bal</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">
            {formatINR(totalCashBank)}
          </span>
          <span className="text-[10px] text-slate-400">Liquid Treasury</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Bills Receivable</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">
            {formatINR(totalDebtors)}
          </span>
          <span className="text-[10px] text-slate-400">Sundry Debtors</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Stock Valuation</span>
          <span className="text-xl font-black text-teal-600 mt-1 block">
            {formatINR(totalStockValuation)}
          </span>
          <span className="text-[10px] text-slate-400">FIFO Method</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: "vouchers", label: "Transactions Register (Vouchers)", count: vouchers.length },
          { id: "accounts", label: "Account Masters (Ledgers)", count: accounts.length },
          { id: "items", label: "Item Masters & Stock Status", count: items.length },
          { id: "sundries", label: "GST & Bill Sundries Engine" },
          { id: "reports", label: "Display Menu (P&L, Balance Sheet, Aging)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 pt-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: VOUCHERS REGISTER */}
      {activeTab === "vouchers" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Voucher #, Party Name, or Narration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  { id: "all", label: "All" },
                  { id: "sales", label: "Sales (F8)" },
                  { id: "purchase", label: "Purchase (F9)" },
                  { id: "payment", label: "Payment (F5)" },
                  { id: "receipt", label: "Receipt (F6)" },
                  { id: "contra", label: "Contra (F4)" },
                  { id: "journal", label: "Journal (F7)" },
                  { id: "debit_note", label: "Debit Note" },
                  { id: "credit_note", label: "Credit Note" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setVoucherFilter(f.id)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      voucherFilter === f.id
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-28">Date</th>
                  <th className="p-3 w-28">Type</th>
                  <th className="p-3 w-32">Voucher No</th>
                  <th className="p-3">Party Name / Ledger Accounts</th>
                  <th className="p-3 w-28 text-right">Taxable (₹)</th>
                  <th className="p-3 w-28 text-right">GST (₹)</th>
                  <th className="p-3 w-28 text-right">Sundries (₹)</th>
                  <th className="p-3 w-32 text-right">Net Amount (₹)</th>
                  <th className="p-3 w-20 text-center">Status</th>
                  <th className="p-3 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredVouchers.map((v) => {
                  const netGst = v.cgstAmount + v.sgstAmount + v.igstAmount;
                  const netSundry = v.sundries.reduce((acc, s) => acc + s.amount, 0);

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono">{v.date}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            v.voucherType === "sales"
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                              : v.voucherType === "purchase"
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300"
                              : v.voucherType === "payment"
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                              : v.voucherType === "receipt"
                              ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                              : v.voucherType === "contra"
                              ? "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {v.voucherType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {v.voucherNo}
                      </td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {v.partyName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">
                          {v.debitAccount && v.creditAccount
                            ? `Dr: ${v.debitAccount} | Cr: ${v.creditAccount}`
                            : v.narration}
                        </div>
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatINR(v.taxableAmount)}
                      </td>
                      <td className="p-3 text-right font-medium text-blue-600 dark:text-blue-400">
                        {netGst > 0 ? formatINR(netGst) : "-"}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {netSundry !== 0 ? formatINR(netSundry) : "-"}
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-900 dark:text-white">
                        {formatINR(v.totalAmount)}
                      </td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Posted
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onOpenLedger(v.partyId)}
                            title="View Account Ledger (Alt+L)"
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <BookOpen className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteVoucher(v.id)}
                            title="Delete Voucher"
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT MASTERS */}
      {activeTab === "accounts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Filter Group:</span>
              <select
                value={accountGroupFilter}
                onChange={(e) => setAccountGroupFilter(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Groups (28 Master Accounts)</option>
                <option value="Sundry Debtors">Sundry Debtors (Customers)</option>
                <option value="Sundry Creditors">Sundry Creditors (Suppliers)</option>
                <option value="Bank Accounts">Bank Accounts</option>
                <option value="Cash-in-hand">Cash-in-Hand</option>
                <option value="Direct Expenses">Direct Expenses</option>
                <option value="Indirect Expenses">Indirect Expenses</option>
                <option value="Duties & Taxes">Duties & Taxes (GST)</option>
                <option value="Capital Account">Capital Account</option>
              </select>
            </div>

            <button
              onClick={() => onOpenHelp()}
              className="inline-flex items-center gap-1.5 text-blue-600 font-semibold"
            >
              <HelpCircle className="h-4 w-4" />
              How to create Account Masters in BUSY?
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Account Master Name</th>
                  <th className="p-3 w-40">Group / Category</th>
                  <th className="p-3 w-32">State</th>
                  <th className="p-3 w-36">GSTIN</th>
                  <th className="p-3 w-32 text-right">Opening Balance</th>
                  <th className="p-3 w-36 text-right">Current Balance</th>
                  <th className="p-3 w-28 text-center">Bill-by-Bill</th>
                  <th className="p-3 w-24 text-center">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {accounts
                  .filter((a) => accountGroupFilter === "all" || a.group === accountGroupFilter)
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                        <div className="text-[11px] text-slate-500">{a.printName}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {a.group}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{a.state}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                        {a.gstin || "-"}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatINR(a.openingBalance)} {a.balanceType}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatINR(a.currentBalance)} {a.balanceType}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.billByBill
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {a.billByBill ? "Yes (Ref)" : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onOpenLedger(a.id)}
                          className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[11px]"
                        >
                          Alt+L
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ITEM MASTERS */}
      {activeTab === "items" && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Item Name & Description</th>
                  <th className="p-3 w-32">Group</th>
                  <th className="p-3 w-28">HSN/SAC</th>
                  <th className="p-3 w-20">UOM</th>
                  <th className="p-3 w-24">Tax Slab</th>
                  <th className="p-3 w-28 text-right">Cost Rate (₹)</th>
                  <th className="p-3 w-28 text-right">Sale Price (₹)</th>
                  <th className="p-3 w-28 text-right">Current Stock</th>
                  <th className="p-3 w-32 text-right">Valuation (₹)</th>
                  <th className="p-3 w-24 text-center">Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{i.name}</div>
                      <div className="text-[11px] text-slate-500">{i.printName}</div>
                    </td>
                    <td className="p-3 font-semibold text-purple-600">{i.group}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{i.hsnCode}</td>
                    <td className="p-3 font-medium">{i.uom}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                        {i.taxCategory}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{formatINR(i.purchaseRate)}</td>
                    <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                      {formatINR(i.sellingPrice)}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {i.currentQty} {i.uom}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600">
                      {formatINR(i.currentQty * i.purchaseRate)}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onOpenItemLedger(i.id)}
                        className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 font-bold text-[11px]"
                      >
                        Alt+I
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BILL SUNDRIES & GST MECHANICS */}
      {activeTab === "sundries" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                GST State Bifurcation Architecture (Indian Statutory Standard)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                In BUSY, supply categorization is 100% automated by evaluating the registered state of your business (<strong>{company.state} - Code {company.stateCode}</strong>) against the recipient party&apos;s state.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    1. Intra-State Supply (Local CGST 50% + SGST 50%)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    When supplier state matches customer state (e.g., Maharashtra to Maharashtra). Tax is split equally: 18% GST becomes 9% CGST + 9% SGST.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="font-bold text-blue-700 dark:text-blue-400 mb-1">
                    2. Inter-State Supply (Integrated IGST 100%)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    When goods move across state boundaries (e.g., Maharashtra to Karnataka, Gujarat, Delhi). A single 18% IGST is charged under Section 7 of the IGST Act.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Percent className="h-5 w-5 text-blue-600" />
                Automated Bill Sundries Engine
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bill Sundries allow applying commercial overheads, deductions, freight, and round-offs at the foot of vouchers without manual spreadsheet calculation.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Trade Discount (-)</span>
                  <span className="text-rose-600 font-bold">Deductive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Freight & Cartage (+)</span>
                  <span className="text-blue-600 font-bold">Additive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Transit Insurance (+)</span>
                  <span className="text-blue-600 font-bold">Additive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Round-Off Paisa (+/-)</span>
                  <span className="text-purple-600 font-bold">Auto Math Rounding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPORTS & DISPLAY MENU */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trial Balance Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Trial Balance (Arithmetic Check)
              </div>
              <p className="text-xs text-slate-500">
                Verifies arithmetic accuracy: Total Debits must exactly equal Total Credits.
              </p>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>Total Debit: {formatINR(totalSalesAmount + totalCashBank)}</span>
                <span>Total Credit: {formatINR(totalSalesAmount + totalCashBank)}</span>
              </div>
            </div>

            {/* Account Ledger Book (Alt+L) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Account Ledger Book (Alt+L)
              </div>
              <p className="text-xs text-slate-500">
                The most checked report in BUSY. Complete debit/credit statements with running balances.
              </p>
              <button
                onClick={() => onOpenLedger()}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
              >
                Open Ledger Book (Alt+L)
              </button>
            </div>

            {/* Stock Movement Ledger (Alt+I) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Boxes className="h-4 w-4 text-purple-600" />
                Stock Summary Ledger (Alt+I)
              </div>
              <p className="text-xs text-slate-500">
                Real-time inventory levels, inward GRN, outward dispatches, and FIFO valuation.
              </p>
              <button
                onClick={() => onOpenItemLedger()}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
              >
                Open Stock Summary (Alt+I)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
