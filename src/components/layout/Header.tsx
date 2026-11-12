"use client";

import React from "react";
import {
  Menu,
  Search,
  Bell,
  Building2,
  Calendar,
  Sparkles,
  Plus,
  HelpCircle,
} from "lucide-react";
import { CompanyInfo, ModuleType } from "@/types/erp";
import { moduleGuides } from "@/data/moduleGuides";

interface HeaderProps {
  company: CompanyInfo;
  activeModule: ModuleType;
  setIsOpen: (open: boolean) => void;
  onNewInvoice: () => void;
  onOpenSearch: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
}

const moduleTitles: Record<ModuleType, { title: string; subtitle: string }> = {
  dashboard: { title: "Executive Dashboard", subtitle: "Real-time operations, GST liabilities and financial metrics" },
  invoices: { title: "Tax Invoices", subtitle: "GST-compliant B2B & B2C tax invoices with IRN and e-Way link" },
  "gst-compliance": { title: "India Compliance & GST Hub", subtitle: "GSTIN verification, e-Invoicing, e-Way bill & GSTR reports" },
  pos: { title: "Point of Sale (POS) Terminal", subtitle: "Counter cashier billing with instant UPI QR & receipt printing" },
  manufacturing: { title: "Manufacturing & Production", subtitle: "Multi-level Bill of Materials (BOM) and Work Orders execution" },
  quality: { title: "Quality Management & Inspection (QM)", subtitle: "Incoming material GRN, in-process and pre-dispatch quality assurance" },
  fleet: { title: "Fleet & Logistics Management (TMS)", subtitle: "Vehicle tracking, drivers, fuel records and statutory fitness expiry" },
  jobwork: { title: "Subcontracting & Job Work (ITC-04)", subtitle: "Raw materials sent to job workers and Section 143 return reconciliation" },
  subscriptions: { title: "Subscriptions & Recurring AMC", subtitle: "SaaS subscriptions, maintenance contracts and MRR revenue automation" },
  projects: { title: "Projects & Timesheets", subtitle: "Client milestone tracking, team tasks and billable time logs" },
  banking: { title: "Banking & Bank Reconciliation", subtitle: "Multi-bank feeds and automated invoice matching" },
  expenses: { title: "Employee Expenses & Claims", subtitle: "Staff reimbursement claims, receipt attachments and payroll disbursement" },
  assets: { title: "Fixed Assets & Depreciation", subtitle: "Schedule II Companies Act SLM/WDV automated schedules" },
  helpdesk: { title: "Customer Support & SLA Helpdesk", subtitle: "Client ticketing system with SLA timers and status resolution" },
  recruitment: { title: "Recruitment & Applicant Tracking (ATS)", subtitle: "Talent pipeline stages, interview feedback and offer letters" },
  documents: { title: "Legal & Statutory Document Vault (DMS)", subtitle: "Encrypted company incorporation deeds, GST registration and licenses" },
  "financial-reports": { title: "Financial Statements & Analytics", subtitle: "Schedule III Balance Sheet, Profit & Loss and Cash Flow statements" },
  inventory: { title: "Stock & Item Master", subtitle: "Multi-warehouse inventory, HSN mapping, and reorder levels" },
  customers: { title: "Customer Master", subtitle: "GSTIN-verified enterprise and retail clients" },
  suppliers: { title: "Suppliers & Vendors", subtitle: "MSME-tagged vendor records and payable ledgers" },
  "purchase-orders": { title: "Purchase Orders", subtitle: "Procurement cycles and Goods Receipt Note (GRN) status" },
  quotations: { title: "Quotations & Estimates", subtitle: "Commercial proposals ready to convert to tax invoices" },
  payroll: { title: "Payroll & Payslips", subtitle: "India statutory deductions: PF, ESIC, Professional Tax, TDS" },
  accounts: { title: "Chart of Accounts", subtitle: "General ledger hierarchy, Assets, Liabilities and Trial Balance" },
  "audit-trail": { title: "MCA Audit Trail & Edit Log", subtitle: "Indian Companies Act 2013 mandatory audit tracking" },
  settings: { title: "Company Profile & Statutory Settings", subtitle: "GSTIN, PAN, CIN, Bank Details and Invoice Templates" },
};

export function Header({
  company,
  activeModule,
  setIsOpen,
  onNewInvoice,
  onOpenSearch,
  onOpenSettings,
  onOpenHelp,
}: HeaderProps) {
  const currentInfo = moduleTitles[activeModule] || { title: "ERPVibe India", subtitle: "" };
  const currentGuide = moduleGuides[activeModule];

  const displayTitle = currentGuide
    ? `${currentGuide.number}. ${currentGuide.titleEn}`
    : currentInfo.title;

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-4 sm:px-8">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {displayTitle}
            </h1>
            {currentGuide && (
              <span className="hidden xl:inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                {currentGuide.titleHi}
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:text-blue-300">
              <Sparkles className="h-3 w-3 text-blue-500" />
              FY 2026-27
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Module Help / Guide Button */}
        {onOpenHelp && (
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-700/80 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 px-3 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 transition-all shadow-sm"
            title="Open Hindi & English Help for this Module / सहायता"
          >
            <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="hidden xs:inline">Help / सहायता</span>
          </button>
        )}

        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Search className="h-3.5 w-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search...</span>
          <span className="rounded bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
            Ctrl+K
          </span>
        </button>

        {/* New Invoice Action Button */}
        <button
          onClick={onNewInvoice}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-all shadow-blue-500/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Create Invoice</span>
        </button>

        {/* Company Pill */}
        <button
          onClick={onOpenSettings}
          title="Click to change Company Profile or GSTIN"
          className="hidden xl:flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 px-3 py-1.5 transition-colors cursor-pointer text-left"
        >
          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <div className="text-left text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{company.tradeName}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">GSTIN: {company.gstin}</p>
          </div>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-semibold text-xs shadow-sm">
            EV
          </div>
        </div>
      </div>
    </header>
  );
}
