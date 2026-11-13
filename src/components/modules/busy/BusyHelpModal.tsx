"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Keyboard,
  ShieldCheck,
  Building2,
  FileText,
  Calculator,
  Percent,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";

interface BusyHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BusyHelpModal({ isOpen, onClose }: BusyHelpModalProps) {
  const [activeTab, setActiveTab] = useState<"shortcuts" | "overview" | "vouchers" | "gst" | "masters">("shortcuts");

  if (!isOpen) return null;

  const shortcuts = [
    { key: "F1", desc: "Help & Complete BUSY Documentation (मदद एवं गाइड)", context: "Anywhere in software" },
    { key: "F2", desc: "Save current Voucher / Master entry (वाउचर सुरक्षित करें)", context: "Transaction / Master screen" },
    { key: "F3", desc: "Add new Master (Account / Item) on-the-fly (नया खाता/आइटम बनाएं)", context: "During voucher entry" },
    { key: "F4", desc: "Open Contra Voucher (बैंक-कैश ट्रांसफर)", context: "Transaction menu" },
    { key: "F5", desc: "Open Payment Voucher (भुगतान प्रविष्टि)", context: "Transaction menu" },
    { key: "F6", desc: "Open Receipt Voucher (रसीद प्रविष्टि)", context: "Transaction menu" },
    { key: "F7", desc: "Open Journal Voucher (जर्नल समायोजन)", context: "Transaction menu" },
    { key: "F8", desc: "Open Sales Voucher (बिक्री बिलिंग / GST इनवॉइस)", context: "Transaction menu" },
    { key: "F9", desc: "Open Purchase Voucher (खरीद प्रविष्टि / ITC)", context: "Transaction menu" },
    { key: "Ctrl + F9", desc: "Open Debit Note (खरीद वापसी / Purchase Return)", context: "Transaction menu" },
    { key: "Ctrl + F8", desc: "Open Credit Note (बिक्री वापसी / Sales Return)", context: "Transaction menu" },
    { key: "Alt + L", desc: "View Account Ledger Book (खाताबही देखें)", context: "Anywhere in software" },
    { key: "Alt + I", desc: "View Item Stock Movement Ledger (स्टॉक बही देखें)", context: "Anywhere in software" },
    { key: "Alt + M", desc: "Modify selected Master (Account / Item)", context: "Master selection fields" },
    { key: "Alt + P", desc: "Print current document / Invoice / Report", context: "Any active report / voucher" },
    { key: "Alt + F", desc: "Filter / Search records across tables", context: "Report and list grids" },
    { key: "Esc", desc: "Cancel, Exit current screen or Go back", context: "Universal navigation" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md">
              F1
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  BUSY Accounting Software — Complete Practical Guide
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                  AICE Course Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Complete all-in-one practical walkthrough for Indian MSME accounting & statutory GST.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 px-6 pt-2 gap-1 text-xs font-semibold">
          {[
            { id: "shortcuts", label: "Keyboard Shortcuts (F1-F9)" },
            { id: "overview", label: "1. Overview & Company Setup" },
            { id: "masters", label: "2. Account & Item Masters" },
            { id: "vouchers", label: "3. Voucher Entry Mechanics" },
            { id: "gst", label: "4. GST & Bill Sundries" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 font-bold shadow-sm"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
          {/* TAB 1: SHORTCUTS */}
          {activeTab === "shortcuts" && (
            <div className="space-y-4">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                  <Keyboard className="h-4 w-4 text-blue-600" />
                  Essential BUSY Shortcut Keys (Quick Reference Sheet)
                </div>
                <p className="text-slate-500 mt-1">
                  Mastering keyboard shortcuts is essential for lightning-fast daily voucher entry.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="p-3 w-32">Shortcut Key</th>
                      <th className="p-3">Function / Action in BUSY</th>
                      <th className="p-3 w-48">Context / Screen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {shortcuts.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3">
                          <kbd className="font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
                            {s.key}
                          </kbd>
                        </td>
                        <td className="p-3 font-medium text-slate-800 dark:text-slate-200">
                          {s.desc}
                        </td>
                        <td className="p-3 text-slate-500">{s.context}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  What is BUSY Accounting Software?
                </h4>
                <p>
                  BUSY is one of India&apos;s leading business accounting and ERP software applications, widely used by Micro, Small, and Medium Enterprises (MSMEs). Unlike generic bookkeeping tools, BUSY specializes in integrated inventory management, Indian statutory GST compliance, multi-location stock tracking, and automated bill sundries.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="font-bold text-blue-600 flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    Company Creation & Setup
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>Company Name & Print Name:</strong> Legal trade name for official reports; Print Name is what prints on GST tax invoices.</li>
                    <li><strong>Country & State:</strong> Crucial for GST calculation. Local (Intra-state) vs Inter-state supply is determined by comparing company state with party state.</li>
                    <li><strong>Financial Year:</strong> Beginning date usually 01/04/XXXX (e.g. 01/04/2026).</li>
                    <li><strong>Books Commencing From:</strong> The actual date from which daily transactions are recorded.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                  <div className="font-bold text-emerald-600 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    GST / VAT Information
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                    <li><strong>Dealer Type:</strong> Regular (e-Invoicing / e-Way bills / ITC enabled) or Composition scheme.</li>
                    <li><strong>15-Digit GSTIN:</strong> Mandatory 2-digit state code prefix + 10-digit PAN + entity code.</li>
                    <li><strong>Security Controls:</strong> Setting administrative username & password to prevent unauthorized database tampering.</li>
                    <li><strong>Housekeeping & Daily Backup:</strong> Save automated JSON backups daily to avoid data loss.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MASTERS */}
          {activeTab === "masters" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Account Masters */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    A. Account Masters (Ledgers)
                  </h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Sundry Debtors (Customers):</strong>
                      <p>Entities who purchase goods on credit. Must specify Billing Address, State, GSTIN, and Credit Limit.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Sundry Creditors (Suppliers):</strong>
                      <p>Vendors from whom goods/services are purchased. Critical to link correct State code for Input Tax Credit (ITC).</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Bank & Cash Accounts:</strong>
                      <p>Pre-created &apos;Cash&apos; ledger; bank accounts (e.g., SBI, HDFC) created under &apos;Bank Accounts&apos; group.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Expense & Income Ledgers:</strong>
                      <p>Rent, Salaries, Freight (Direct/Indirect Expenses), and Commission, Interest (Incomes).</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Capital Account:</strong>
                      <p>Owner&apos;s equity and promoter investment in the enterprise.</p>
                    </div>
                  </div>
                </div>

                {/* Item Masters */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-600" />
                    B. Item Masters (Stock & Goods)
                  </h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-400">
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Item Name & Print Name:</strong>
                      <p>Clear product description (e.g., Samsung 24&quot; LED Monitor LF24T350).</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Unit of Measurement (UOM):</strong>
                      <p>Base units (Pcs, Box, Kgs, Mtr) and packaging conversions (e.g., 1 Box = 5 Pcs).</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Tax Category & GST Slab:</strong>
                      <p>Link exact GST slab: Exempt (0%), GST 5%, GST 12%, GST 18%, or GST 28%.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">HSN / SAC Code:</strong>
                      <p>Mandatory 6 or 8-digit HSN code for goods; 6-digit SAC for services.</p>
                    </div>
                    <div>
                      <strong className="text-slate-800 dark:text-slate-200">Opening Balance & Valuation:</strong>
                      <p>Opening quantity, purchase rate, selling price, and FIFO / Weighted Average method.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VOUCHERS */}
          {activeTab === "vouchers" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                    <tr>
                      <th className="p-3 w-28">Voucher Type</th>
                      <th className="p-3 w-20">Key</th>
                      <th className="p-3">Purpose & Nature of Entry</th>
                      <th className="p-3">Key Fields / Mechanics in BUSY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    <tr>
                      <td className="p-3 font-bold text-blue-600">Purchase</td>
                      <td className="p-3 font-mono font-bold">F9</td>
                      <td className="p-3">Inward supply of raw materials or trading stock from suppliers.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Select Type (Local L/GST or Inter-state I/GST), enter Party, Item, Qty, Rate, and Bill Sundry (GST).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-600">Sales</td>
                      <td className="p-3 font-mono font-bold">F8</td>
                      <td className="p-3">Outward billing to customers/clients; generates GST Tax Invoices.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Select Sale Type (L/GST or Multi-Tax), Customer, Item details. Bottom grid automatically applies CGST/SGST/IGST + Discounts.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-purple-600">Payment</td>
                      <td className="p-3 font-mono font-bold">F5</td>
                      <td className="p-3">Disbursing funds to suppliers, paying expenses (Rent, Salaries).</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Debit: Party / Expense Ledger. Credit: Bank or Cash Account. Bill-by-bill reference matching.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-600">Receipt</td>
                      <td className="p-3 font-mono font-bold">F6</td>
                      <td className="p-3">Receiving money from customers or other revenue streams.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Debit: Cash or Bank Account. Credit: Customer / Sundry Debtor. Adjust against pending invoices.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-cyan-600">Contra</td>
                      <td className="p-3 font-mono font-bold">F4</td>
                      <td className="p-3">Internal fund transfers (Cash deposit/withdrawal, bank-to-bank).</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Strictly affects only Cash and Bank accounts. No third-party debtors/creditors involved.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-indigo-600">Journal</td>
                      <td className="p-3 font-mono font-bold">F7</td>
                      <td className="p-3">Non-cash adjustment entries, depreciation, correction entries.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Direct Double Entry system (Debit / Credit) without cash/bank movement.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-rose-600">Debit Note</td>
                      <td className="p-3 font-mono font-bold">Ctrl+F9</td>
                      <td className="p-3">Purchase Return or debiting supplier for rate difference/defects.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Reverses input tax credit and reduces creditor liability. Links original purchase invoice.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-orange-600">Credit Note</td>
                      <td className="p-3 font-mono font-bold">Ctrl+F8</td>
                      <td className="p-3">Sales Return or crediting customer for returned items/allowances.</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">Reverses output GST liability and adjusts debtor receivables balance.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: GST & SUNDRIES */}
          {activeTab === "gst" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    GST Calculation Rules
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>
                      <strong>Local Supplies (Intra-State):</strong> When Supplier and Buyer are in the same state (e.g. Maharashtra to Maharashtra), BUSY bifurcates tax equally into <strong>CGST (50%)</strong> and <strong>SGST (50%)</strong>.
                    </li>
                    <li>
                      <strong>Inter-State Supplies:</strong> When goods move across state boundaries (e.g. Maharashtra to Karnataka), single <strong>IGST (100%)</strong> is charged.
                    </li>
                    <li>
                      <strong>Multi-Tax Invoicing:</strong> Bill items with different tax rates (e.g. 5%, 12%, 18%) in a single invoice without errors using BUSY&apos;s &apos;Item-wise&apos; or &apos;Multi-Tax&apos; sale types.
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                    <Percent className="h-4 w-4 text-blue-600" />
                    Additional Bill Sundries
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>
                      <strong>Trade Discounts (-):</strong> Flat or percentage deduction from taxable total before or after tax calculation.
                    </li>
                    <li>
                      <strong>Freight / Cartage Charges (+):</strong> Transport and delivery fees added to invoice total.
                    </li>
                    <li>
                      <strong>Insurance Charges (+):</strong> Transit insurance added to high-value goods dispatches.
                    </li>
                    <li>
                      <strong>Round-Off (+/-):</strong> Automatic fractional paisa adjustment to round the invoice net payable to the nearest rupee.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Based on Achievers Institute of Computer Education (AICE) BUSY Accounting Course.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold shadow-sm"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
