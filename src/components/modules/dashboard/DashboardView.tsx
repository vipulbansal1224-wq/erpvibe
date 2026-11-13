"use client";

import React from "react";
import {
  TrendingUp,
  Receipt,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  Truck,
  FileCheck2,
  DollarSign,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Keyboard,
  BookOpen,
  Boxes,
  ArrowRightLeft,
  X,
  Save,
  HelpCircle,
  FileText,
  CreditCard,
  Zap,
} from "lucide-react";
import {
  SalesInvoice,
  EWayBill,
  InventoryItem,
  AuditLogEntry,
  ModuleType,
  BusyVoucherType,
} from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface DashboardViewProps {
  invoices: SalesInvoice[];
  items: InventoryItem[];
  ewayBills: EWayBill[];
  auditLogs: AuditLogEntry[];
  setActiveModule: (m: ModuleType) => void;
  onViewInvoice: (inv: SalesInvoice) => void;
  onOpenGSTINModal: () => void;
  onOpenEWayModal: () => void;
  onOpenBusyVoucher?: (type: BusyVoucherType) => void;
  onOpenBusyLedger?: () => void;
  onOpenBusyItemLedger?: () => void;
  onOpenBusyHelp?: () => void;
}

export function DashboardView({
  invoices,
  items,
  ewayBills,
  auditLogs,
  setActiveModule,
  onViewInvoice,
  onOpenGSTINModal,
  onOpenEWayModal,
  onOpenBusyVoucher,
  onOpenBusyLedger,
  onOpenBusyItemLedger,
  onOpenBusyHelp,
}: DashboardViewProps) {
  // Aggregate stats
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalTaxable = invoices.reduce((sum, inv) => sum + inv.subTotal, 0);
  const totalGST = invoices.reduce(
    (sum, inv) => sum + (inv.cgstTotal + inv.sgstTotal + inv.igstTotal),
    0
  );
  const unpaidInvoices = invoices.filter(
    (inv) => inv.paymentStatus === "Unpaid" || inv.paymentStatus === "Partially Paid"
  );
  const unpaidAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const lowStockItems = items.filter((item) => item.currentStock <= item.reorderLevel);

  return (
    <div className="space-y-6">
      {/* Enterprise Accounting Rapid Operation Console (F1-F9, Alt+L, Alt+I) */}
      <div className="rounded-2xl border-2 border-blue-500/30 dark:border-blue-600/30 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-5 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg ring-1 ring-blue-400/40">
                <Zap className="h-5 w-5 text-amber-300" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-blue-400" />
                    Rapid Operations & Voucher Console
                  </h3>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    Live Operations
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Dashboard se direct 1-click ya physical keyboard shortcut se pura business operate karein.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-slate-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Press key on keyboard or click button below
              </span>
            </div>
          </div>

          {/* All 13 Keys Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {/* F8 Sales */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("sales")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow">
                  F8
                </span>
                <Receipt className="h-4 w-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Sales Voucher</span>
              <span className="text-[10px] text-emerald-300 mt-0.5">बिक्री बिलिंग / GST Tax</span>
            </button>

            {/* F9 Purchase */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("purchase")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 hover:border-blue-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-blue-500 text-slate-950 shadow">
                  F9
                </span>
                <Truck className="h-4 w-4 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Purchase Voucher</span>
              <span className="text-[10px] text-blue-300 mt-0.5">खरीद प्रविष्टि / ITC</span>
            </button>

            {/* F5 Payment */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("payment")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 hover:border-purple-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-purple-500 text-slate-950 shadow">
                  F5
                </span>
                <CreditCard className="h-4 w-4 text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Payment Voucher</span>
              <span className="text-[10px] text-purple-300 mt-0.5">भुगतान / Expenses</span>
            </button>

            {/* F6 Receipt */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("receipt")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 hover:border-amber-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-500 text-slate-950 shadow">
                  F6
                </span>
                <DollarSign className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Receipt Voucher</span>
              <span className="text-[10px] text-amber-300 mt-0.5">रसीद / Collections</span>
            </button>

            {/* F4 Contra */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("contra")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-cyan-500 text-slate-950 shadow">
                  F4
                </span>
                <ArrowRightLeft className="h-4 w-4 text-cyan-400 group-hover:rotate-180 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Contra Voucher</span>
              <span className="text-[10px] text-cyan-300 mt-0.5">बैंक-कैश ट्रांसफर</span>
            </button>

            {/* F7 Journal */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("journal")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/40 hover:border-indigo-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-indigo-500 text-slate-950 shadow">
                  F7
                </span>
                <FileText className="h-4 w-4 text-indigo-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Journal Voucher</span>
              <span className="text-[10px] text-indigo-300 mt-0.5">जर्नल / Depreciation</span>
            </button>

            {/* Ctrl + F9 Debit Note */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("debit_note")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 hover:border-rose-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-rose-500 text-slate-950 shadow">
                  ^F9
                </span>
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Debit Note</span>
              <span className="text-[10px] text-rose-300 mt-0.5">खरीद वापसी / Ret.</span>
            </button>

            {/* Ctrl + F8 Credit Note */}
            <button
              onClick={() => onOpenBusyVoucher && onOpenBusyVoucher("credit_note")}
              className="flex flex-col items-start p-2.5 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 border border-orange-500/40 hover:border-orange-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-orange-500 text-slate-950 shadow">
                  ^F8
                </span>
                <CheckCircle2 className="h-4 w-4 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Credit Note</span>
              <span className="text-[10px] text-orange-300 mt-0.5">बिक्री वापसी / Ret.</span>
            </button>

            {/* Alt + L Account Ledger Book */}
            <button
              onClick={onOpenBusyLedger}
              className="flex flex-col items-start p-2.5 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/40 hover:border-teal-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-teal-400 text-slate-950 shadow">
                  Alt+L
                </span>
                <BookOpen className="h-4 w-4 text-teal-300 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Ledger Book</span>
              <span className="text-[10px] text-teal-300 mt-0.5">खाताबही / Statement</span>
            </button>

            {/* Alt + I Item Stock Ledger */}
            <button
              onClick={onOpenBusyItemLedger}
              className="flex flex-col items-start p-2.5 rounded-xl bg-violet-950/60 hover:bg-violet-900/80 border border-violet-500/40 hover:border-violet-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-[11px] px-1.5 py-0.5 rounded bg-violet-400 text-slate-950 shadow">
                  Alt+I
                </span>
                <Boxes className="h-4 w-4 text-violet-300 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Stock Ledger</span>
              <span className="text-[10px] text-violet-300 mt-0.5">स्टॉक बही / Valuation</span>
            </button>

            {/* F1 Complete Guide */}
            <button
              onClick={onOpenBusyHelp}
              className="flex flex-col items-start p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 hover:border-sky-400 text-left transition-all hover:scale-[1.02] shadow-sm group"
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-sky-400 text-slate-950 shadow">
                  F1
                </span>
                <HelpCircle className="h-4 w-4 text-sky-300 group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-xs font-bold text-white leading-tight">Voucher Guide</span>
              <span className="text-[10px] text-sky-300 mt-0.5">मास्टर गाइड (F1)</span>
            </button>

            {/* F2 Save Indicator */}
            <div className="flex flex-col items-start p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-left">
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-300 text-slate-950 shadow">
                  F2
                </span>
                <Save className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-200 leading-tight">Save Voucher</span>
              <span className="text-[10px] text-slate-400 mt-0.5">वाउचर सुरक्षित करें</span>
            </div>

            {/* Esc Exit Indicator */}
            <div className="flex flex-col items-start p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-left">
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-300 text-slate-950 shadow">
                  Esc
                </span>
                <X className="h-4 w-4 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-200 leading-tight">Cancel / Close</span>
              <span className="text-[10px] text-slate-400 mt-0.5">बाहर निकलें</span>
            </div>
          </div>
        </div>
      </div>

      {/* India Statutory Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300">
                <ShieldCheck className="h-4 w-4" />
                GST & MCA Compliance Engine Active
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 border border-blue-400/30 px-3 py-1 text-xs font-bold text-white shadow">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                22 Enterprise Modules Embedded
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Apex Technovations - India Enterprise Hub
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Automatic e-Invoicing (IRN), real-time e-Way Bill generation, and statutory edit logs fully compliant with the Indian Companies Act 2013.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenGSTINModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2 text-xs font-medium backdrop-blur transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Verify GSTIN
            </button>
            <button
              onClick={onOpenEWayModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-blue-500/30 transition-all"
            >
              <Truck className="h-4 w-4" />
              New e-Way Bill
            </button>
            <button
              onClick={() => setActiveModule("gst-compliance")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-emerald-500/30 transition-all"
            >
              <FileCheck2 className="h-4 w-4" />
              GSTR Reports
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Invoiced Revenue */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Invoiced (FY 26-27)
            </span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatINR(totalRevenue)}
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+18.4% vs last quarter</span>
            </div>
          </div>
        </div>

        {/* GST Output Tax Collected */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              GST Output Tax Collected
            </span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formatINR(totalGST)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Taxable Turnover: {formatINR(totalTaxable)}
            </p>
          </div>
        </div>

        {/* Outstanding Receivables */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Outstanding Receivables
            </span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/60 p-2 text-amber-600 dark:text-amber-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {formatINR(unpaidAmount)}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {unpaidInvoices.length} invoices awaiting payment
            </p>
          </div>
        </div>

        {/* Inventory & Low Stock Alerts */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Stock Reorder Warnings
            </span>
            <div className="rounded-lg bg-red-50 dark:bg-red-950/60 p-2 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-red-600 dark:text-red-400">
              {lowStockItems.length} Item{lowStockItems.length > 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {items.length} total active item masters
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Charts & India Statutory Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Tax Trends (SVG Visual Chart) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Monthly Revenue & GST Trend (Q3 FY26-27)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Taxable revenue vs. Output GST liability in Lakhs (INR)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                <span className="text-slate-600 dark:text-slate-400">Taxable Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                <span className="text-slate-600 dark:text-slate-400">GST Liability</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div className="h-64 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {[
              { month: "May", sales: 18.5, gst: 3.33 },
              { month: "Jun", sales: 22.0, gst: 3.96 },
              { month: "Jul", sales: 19.8, gst: 3.56 },
              { month: "Aug", sales: 26.4, gst: 4.75 },
              { month: "Sep", sales: 24.1, gst: 4.33 },
              { month: "Oct", sales: 31.5, gst: 5.67 },
              { month: "Nov (Cur)", sales: 34.8, gst: 6.26 },
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {/* Sales Bar */}
                  <div
                    style={{ height: `${(d.sales / 38) * 100}%` }}
                    className="w-1/2 max-w-[28px] rounded-t-md bg-blue-600 group-hover:bg-blue-500 transition-all relative flex justify-center"
                  >
                    <span className="absolute -top-6 text-[10px] font-semibold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 shadow px-1 rounded border border-slate-200 dark:border-slate-700">
                      ₹{d.sales}L
                    </span>
                  </div>
                  {/* GST Bar */}
                  <div
                    style={{ height: `${(d.gst / 8) * 100}%` }}
                    className="w-1/2 max-w-[28px] rounded-t-md bg-purple-500 group-hover:bg-purple-400 transition-all relative flex justify-center"
                  >
                    <span className="absolute -top-6 text-[10px] font-semibold text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-800 shadow px-1 rounded border border-slate-200 dark:border-slate-700">
                      ₹{d.gst}L
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 text-center">
                  {d.month}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Average GST rate applied: 18%</span>
            <span>Next GSTR-3B Due: 20th November 2026</span>
          </div>
        </div>

        {/* State-wise Supply Distribution & e-Way Activity */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Tax By Place of Supply
            </h3>
            <div className="space-y-3">
              {[
                { state: "Maharashtra (27)", share: 55, amount: "₹1,17,090 (CGST+SGST)", color: "bg-blue-600" },
                { state: "Karnataka (29)", share: 30, amount: "₹1,55,664 (IGST)", color: "bg-indigo-600" },
                { state: "Delhi (07)", share: 15, amount: "₹73,872 (IGST)", color: "bg-emerald-600" },
              ].map((item) => (
                <div key={item.state} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{item.state}</span>
                    <span className="text-slate-500 dark:text-slate-400">{item.amount}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.share}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Live e-Way Bills (On Road)
              </h3>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                {ewayBills.length} Active
              </span>
            </div>
            <div className="space-y-2">
              {ewayBills.map((ewb) => (
                <div
                  key={ewb.id}
                  className="rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-2.5 text-xs"
                >
                  <div className="flex justify-between font-mono font-medium text-slate-900 dark:text-slate-200">
                    <span>EWB: {ewb.ewayBillNo}</span>
                    <span className="text-blue-600 dark:text-blue-400">{ewb.vehicleNo}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[150px]">{ewb.customerName}</span>
                    <span>{ewb.distanceKm} KM</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Recent Tax Invoices & e-Invoice Status
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All invoices with IRN generation and GST validation
            </p>
          </div>
          <button
            onClick={() => setActiveModule("invoices")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All ({invoices.length})
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th className="px-6 py-3">Invoice No</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer & GSTIN</th>
                <th className="px-6 py-3">Place of Supply</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">e-Invoice IRN</th>
                <th className="px-6 py-3">Payment</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium font-mono text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    {inv.invoiceDate}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{inv.customerName}</p>
                    <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{inv.customerGstin}</p>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">
                      {inv.placeOfSupply}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {formatINR(inv.grandTotal)}
                  </td>
                  <td className="px-6 py-3.5">
                    {inv.eInvoiceStatus === "Generated" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        IRN Signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        inv.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : inv.paymentStatus === "Partially Paid"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button
                      onClick={() => onViewInvoice(inv)}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Tax Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Launchpad: All 22 Modules Matrix */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Complete Enterprise Directory (22 Modules Ready)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              India Statutory Compliance, Production, Retail, Logistics, CRM & HR Modules
            </p>
          </div>
          <button
            onClick={() => setActiveModule("settings")}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition"
          >
            Configure & Toggle Modules →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {[
            { id: "gst-compliance", label: "GST & Compliance", badge: "e-Inv/e-Way", tag: "Statutory" },
            { id: "invoices", label: "Tax Invoices", badge: "B2B / B2C", tag: "Sales" },
            { id: "pos", label: "POS Terminal", badge: "UPI / Cash", tag: "Retail" },
            { id: "inventory", label: "Stock & Warehouses", badge: "Multi-Loc", tag: "Inventory" },
            { id: "manufacturing", label: "Manufacturing & BOM", badge: "Work Orders", tag: "Production" },
            { id: "quality", label: "Quality Control (QM)", badge: "ISO / GRN", tag: "Quality" },
            { id: "fleet", label: "Fleet & Logistics", badge: "TMS / Vahan", tag: "Logistics" },
            { id: "jobwork", label: "Job Work (ITC-04)", badge: "Sec 143", tag: "Production" },
            { id: "subscriptions", label: "Subscriptions & AMC", badge: "MRR Engine", tag: "SaaS" },
            { id: "projects", label: "Projects & Tasks", badge: "Timesheets", tag: "Services" },
            { id: "banking", label: "Bank Reconciliation", badge: "Multi-Bank", tag: "Finance" },
            { id: "expenses", label: "Employee Expenses", badge: "Reimburse", tag: "Finance" },
            { id: "assets", label: "Fixed Assets (SLM/WDV)", badge: "Sched. II", tag: "Finance" },
            { id: "helpdesk", label: "Customer Helpdesk", badge: "SLA Timers", tag: "Support" },
            { id: "customers", label: "CRM & Customers", badge: "GSTIN Lead", tag: "Sales" },
            { id: "suppliers", label: "Suppliers & MSME", badge: "45-Day Rule", tag: "Buying" },
            { id: "recruitment", label: "Recruitment (ATS)", badge: "Hiring", tag: "HR" },
            { id: "payroll", label: "Payroll & Payslips", badge: "PF / ESIC", tag: "HR" },
            { id: "documents", label: "Legal Document Vault", badge: "AES-256", tag: "Legal" },
            { id: "financial-reports", label: "P&L / Balance Sheet", badge: "Sched. III", tag: "Reports" },
            { id: "accounts", label: "Chart of Accounts", badge: "General Ledger", tag: "Accounts" },
            { id: "audit-trail", label: "MCA Audit Trail", badge: "Sec 134(5)", tag: "Audit" },
          ].map((m, idx) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(m.id as ModuleType)}
              className="flex flex-col items-start p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 transition text-left group"
            >
              <div className="flex justify-between items-center w-full">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-500 font-semibold">
                  #{String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {m.badge}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {m.label}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {m.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              MCA Audit Trail & Statutory Edit Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mandatory under Indian Companies (Accounts) Rules, 2014 & MCA Notification GSR 235(E)
            </p>
          </div>
          <button
            onClick={() => setActiveModule("audit-trail")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Audit Log ({auditLogs.length})
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 text-xs"
            >
              <div className="flex items-start sm:items-center gap-3">
                <span className="rounded bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-blue-700 dark:text-blue-300">
                  {log.action}
                </span>
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{log.remarks}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Module: <span className="text-slate-700 dark:text-slate-300 font-medium">{log.module}</span> | User: <span className="font-mono">{log.userName}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
