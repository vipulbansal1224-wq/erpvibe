"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  FileSpreadsheet,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function FinancialReportsView() {
  const [activeTab, setActiveTab] = useState<"pnl" | "balance_sheet" | "cash_flow" | "aged_debtors">("pnl");

  // Export report to CSV
  const exportToCSV = (title: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8,Particulars,Amount (INR)\nRevenue from Operations,24800000\nCost of Materials Consumed,-13400000\nGross Profit,11400000\nEmployee Benefit Expense,-3850000\nOperating Profit (EBITDA),7550000\nDepreciation & Amortization,-1220000\nFinance Costs,-380000\nProfit Before Tax (PBT),5950000\nIncome Tax Provision,-1487500\nNet Profit After Tax (PAT),4462500";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title}_FY26-27.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileSpreadsheet className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Financial Statements & Business Analytics
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Schedule III Indian Companies Act compliant P&L, Balance Sheet, Cash Flow, and Debtors Aging.
          </p>
        </div>

        <button
          onClick={() => exportToCSV("Financial_Report")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-all"
        >
          <Download className="h-4 w-4" />
          Export Statement (.CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        {[
          { id: "pnl", label: "Profit & Loss (P&L)" },
          { id: "balance_sheet", label: "Balance Sheet (Schedule III)" },
          { id: "cash_flow", label: "Cash Flow Statement" },
          { id: "aged_debtors", label: "Aged Receivables (Debtors)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 border-b-2 transition-all ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PROFIT & LOSS */}
      {activeTab === "pnl" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Statement of Profit and Loss for Period Ended 31st Oct 2026
            </h3>
            <span className="text-xs text-slate-500">Amounts in Indian Rupees (INR)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Particulars (Income / Expense Schedule)</th>
                  <th className="px-4 py-3 text-right">Current Period (FY 26-27)</th>
                  <th className="px-4 py-3 text-right">Previous Year (FY 25-26)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr className="font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-sans">I. Revenue from Operations (Net of GST)</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatINR(24800000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(19800000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Direct Sales - IT Hardware & Solutions
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(16200000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(13400000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Consulting & Implementation Services
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(6400000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(4800000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Cloud Infrastructure Hosting Services
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(2200000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(1600000)}</td>
                </tr>

                <tr className="font-bold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-sans">II. Expenses</td>
                  <td className="px-4 py-2.5 text-right font-bold">{formatINR(18850000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(15200000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Cost of Goods Sold & Hardware Procurement
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(13400000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(11000000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Employee Benefit Expense (Salaries, EPF, ESIC)
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(3850000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(2950000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Depreciation and Amortization Expense
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(1220000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(950000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Other Operational & Professional Fees
                  </td>
                  <td className="px-4 py-2.5 text-right">{formatINR(380000)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{formatINR(300000)}</td>
                </tr>

                <tr className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 text-sm">
                  <td className="px-4 py-3 font-sans">
                    III. Profit Before Tax (PBT = I - II)
                  </td>
                  <td className="px-4 py-3 text-right">{formatINR(5950000)}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{formatINR(4600000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 font-sans pl-8 text-slate-700 dark:text-slate-300">
                    Current Corporate Tax Provision (@ 25% under Sec 115BAA)
                  </td>
                  <td className="px-4 py-2.5 text-right text-red-600">-{formatINR(1487500)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">-{formatINR(1150000)}</td>
                </tr>
                <tr className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 text-base">
                  <td className="px-4 py-3.5 font-sans">
                    IV. Net Profit After Tax (PAT / Net Margin: 18.0%)
                  </td>
                  <td className="px-4 py-3.5 text-right">{formatINR(4462500)}</td>
                  <td className="px-4 py-3.5 text-right text-slate-500">{formatINR(3450000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BALANCE SHEET */}
      {activeTab === "balance_sheet" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Balance Sheet as at 31st October 2026 (Schedule III Format)
            </h3>
            <span className="text-xs text-slate-500">Audited Compliance View</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assets */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                APPLICATION OF FUNDS (ASSETS)
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                      <td className="p-2.5">Non-Current Assets</td>
                      <td className="p-2.5 text-right font-mono">{formatINR(4400000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Fixed Assets (Tangible)</td>
                      <td className="p-2 text-right">{formatINR(4400000)}</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                      <td className="p-2.5">Current Assets</td>
                      <td className="p-2.5 text-right font-mono">{formatINR(9850000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Inventories & Stock in Hand</td>
                      <td className="p-2 text-right">{formatINR(850000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Trade Receivables (Debtors)</td>
                      <td className="p-2 text-right">{formatINR(3570000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Cash and Bank Balances</td>
                      <td className="p-2 text-right">{formatINR(4890000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">GST Input Tax Credit Balance</td>
                      <td className="p-2 text-right">{formatINR(540000)}</td>
                    </tr>
                    <tr className="bg-blue-50 dark:bg-blue-950/60 font-black text-blue-900 dark:text-blue-300">
                      <td className="p-3 font-sans">TOTAL ASSETS</td>
                      <td className="p-3 text-right">{formatINR(14250000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                SOURCE OF FUNDS (EQUITY & LIABILITIES)
              </h4>
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                    <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                      <td className="p-2.5">Shareholders Funds</td>
                      <td className="p-2.5 text-right font-mono">{formatINR(10130000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Paid-up Equity Share Capital</td>
                      <td className="p-2 text-right">{formatINR(2500000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Reserves & Retained Earnings</td>
                      <td className="p-2 text-right">{formatINR(7630000)}</td>
                    </tr>
                    <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                      <td className="p-2.5">Current Liabilities</td>
                      <td className="p-2.5 text-right font-mono">{formatINR(4120000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Trade Payables (MSME & Others)</td>
                      <td className="p-2 text-right">{formatINR(2915000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">GST Output Tax Liability</td>
                      <td className="p-2 text-right">{formatINR(845000)}</td>
                    </tr>
                    <tr>
                      <td className="p-2 pl-6 font-sans text-slate-600 dark:text-slate-400">Statutory TDS / TCS Payable</td>
                      <td className="p-2 text-right">{formatINR(360000)}</td>
                    </tr>
                    <tr className="bg-blue-50 dark:bg-blue-950/60 font-black text-blue-900 dark:text-blue-300">
                      <td className="p-3 font-sans">TOTAL LIABILITIES & EQUITY</td>
                      <td className="p-3 text-right">{formatINR(14250000)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CASH FLOW */}
      {activeTab === "cash_flow" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Cash Flow Statement (Direct Method)
            </h3>
            <span className="text-xs text-slate-500">Period: Q1-Q3 FY 2026-27</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                  <td className="p-3">A. Cash Flow from Operating Activities</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-600">{formatINR(6450000)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-8 font-sans text-slate-600 dark:text-slate-400">Cash receipts from client billing</td>
                  <td className="p-2.5 text-right">{formatINR(23200000)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-8 font-sans text-slate-600 dark:text-slate-400">Cash payments to suppliers & MSME vendors</td>
                  <td className="p-2.5 text-right text-red-600">-{formatINR(12900000)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-8 font-sans text-slate-600 dark:text-slate-400">Cash payments to employees (Payroll)</td>
                  <td className="p-2.5 text-right text-red-600">-{formatINR(3850000)}</td>
                </tr>

                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                  <td className="p-3">B. Cash Flow from Investing Activities</td>
                  <td className="p-3 text-right font-mono font-bold text-red-600">-{formatINR(1450000)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 pl-8 font-sans text-slate-600 dark:text-slate-400">Purchase of IT Equipment & Fixed Servers</td>
                  <td className="p-2.5 text-right text-red-600">-{formatINR(1450000)}</td>
                </tr>

                <tr className="bg-slate-50 dark:bg-slate-800/40 font-bold font-sans">
                  <td className="p-3">C. Cash Flow from Financing Activities</td>
                  <td className="p-3 text-right font-mono font-bold text-red-600">-{formatINR(110000)}</td>
                </tr>

                <tr className="bg-emerald-50 dark:bg-emerald-950/60 font-black text-emerald-900 dark:text-emerald-300 text-sm">
                  <td className="p-3.5 font-sans">Net Increase in Cash & Equivalents (A + B + C)</td>
                  <td className="p-3.5 text-right">{formatINR(4890000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AGED DEBTORS */}
      {activeTab === "aged_debtors" && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Accounts Receivable Aging Analysis (Aging Buckets)
              </h3>
              <p className="text-xs text-slate-500">Track outstanding dues past credit period</p>
            </div>
            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
              Total Outstanding: {formatINR(4790000)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Customer Name</th>
                  <th className="px-4 py-3 text-right">0 - 30 Days</th>
                  <th className="px-4 py-3 text-right">31 - 60 Days</th>
                  <th className="px-4 py-3 text-right">61 - 90 Days</th>
                  <th className="px-4 py-3 text-right">90+ Days (Overdue)</th>
                  <th className="px-4 py-3 text-right">Total Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                <tr>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    Tata Consultancy Enterprises Ltd
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatINR(1240000)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatINR(1240000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    Infosys Digital Solutions Ltd
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-blue-600">{formatINR(2450000)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatINR(2450000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    Delhivery Express Solutions
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-amber-600">{formatINR(680000)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatINR(680000)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-sans font-semibold text-slate-900 dark:text-white">
                    Zoho Business Cloud Technologies
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatINR(420000)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right text-slate-400">-</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatINR(420000)}</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-900 dark:text-white">
                  <td className="px-4 py-3 font-sans">TOTAL AGED RECEIVABLES</td>
                  <td className="px-4 py-3 text-right">{formatINR(1660000)}</td>
                  <td className="px-4 py-3 text-right">{formatINR(2450000)}</td>
                  <td className="px-4 py-3 text-right">{formatINR(680000)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">₹0.00</td>
                  <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">{formatINR(4790000)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
