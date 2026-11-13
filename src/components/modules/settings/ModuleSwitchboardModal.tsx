"use client";

import React from "react";
import {
  SlidersHorizontal,
  X,
  Sparkles,
  CheckCircle2,
  Factory,
  ShieldCheck,
  Truck,
  Repeat,
  ShoppingCart,
  FolderKanban,
  CreditCard,
  Receipt,
  Boxes,
  LifeBuoy,
  Users,
  BadgeIndianRupee,
  BarChart3,
  Calculator,
  Package,
} from "lucide-react";
import { ModuleSettings } from "@/types/erp";

interface ModuleSwitchboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleSettings: ModuleSettings;
  onUpdateModuleSettings: (settings: ModuleSettings) => void;
}

export function ModuleSwitchboardModal({
  isOpen,
  onClose,
  moduleSettings,
  onUpdateModuleSettings,
}: ModuleSwitchboardModalProps) {
  if (!isOpen) return null;

  const handleToggle = (key: keyof ModuleSettings) => {
    const updated = { ...moduleSettings, [key]: !moduleSettings[key] };
    onUpdateModuleSettings(updated);
  };

  const handleEnableAll = () => {
    const updated: ModuleSettings = { ...moduleSettings };
    (Object.keys(updated) as (keyof ModuleSettings)[]).forEach((k) => {
      updated[k] = true;
    });
    onUpdateModuleSettings(updated);
  };

  const moduleItems: {
    key: keyof ModuleSettings;
    title: string;
    description: string;
    category: string;
    icon: any;
  }[] = [
    {
      key: "busyAccounting",
      title: "Advanced Accounting & Voucher Master Engine",
      description: "Indian statutory daily vouchers F1-F9 (Sales, Purchase, Payment, Receipt, Contra, Journal, Debit/Credit Notes), Bill Sundries, and Alt+L account ledger books.",
      category: "Finance",
      icon: Calculator,
    },
    {
      key: "invoices",
      title: "Tax Invoices (B2B & B2C)",
      description: "GST-compliant tax invoices with automatic CGST/SGST/IGST breakdown, IRN QR code, and e-Way bill linkage.",
      category: "Billing",
      icon: Receipt,
    },
    {
      key: "inventory",
      title: "Stock & Item Master (Inventory)",
      description: "Multi-godown inventory, HSN/SAC master, opening stock balances, reorder level alerts, and barcode scanning.",
      category: "Supply Chain",
      icon: Package,
    },
    {
      key: "gstCompliance",
      title: "India GST & Statutory Compliance Hub",
      description: "Real-time GSTIN verification, e-Invoicing (IRN), e-Way Bills, GSTR-1/3B JSON generator, and TDS/TCS auto calculations.",
      category: "Statutory",
      icon: ShieldCheck,
    },
    {
      key: "pos",
      title: "Point of Sale (POS) Terminal",
      description: "Fast retail register with touch grid, barcode search, dynamic UPI QR code, cash drawer, and thermal receipt printing.",
      category: "Retail",
      icon: ShoppingCart,
    },
    {
      key: "manufacturing",
      title: "Manufacturing & Production (BOM)",
      description: "Multi-level Bill of Materials (BOM), work orders execution, raw material consumption, and production line scheduling.",
      category: "Supply Chain",
      icon: Factory,
    },
    {
      key: "quality",
      title: "Quality Management & Inspection (QM)",
      description: "Incoming GRN inspections, in-process tolerances, pre-dispatch quality certificates and non-conformance quarantine.",
      category: "Supply Chain",
      icon: ShieldCheck,
    },
    {
      key: "fleet",
      title: "Fleet & Logistics Management (TMS)",
      description: "Commercial vehicle registry, driver assignments, fuel tracking, odometer logs, and insurance/fitness expiry alerts.",
      category: "Supply Chain",
      icon: Truck,
    },
    {
      key: "jobwork",
      title: "Subcontracting & Job Work (Form GST ITC-04)",
      description: "GST Section 143 delivery challans, materials sent to processors, scrap accountability and 1-year return deadlines.",
      category: "Supply Chain",
      icon: Factory,
    },
    {
      key: "subscriptions",
      title: "Subscriptions & Recurring AMC",
      description: "SaaS subscriptions, annual maintenance contracts, MRR revenue metrics, and auto GST recurring invoice generation.",
      category: "Sales",
      icon: Repeat,
    },
    {
      key: "projects",
      title: "Projects & Timesheet Billing",
      description: "Client milestones, consultant assignments, task kanban, and billable hour logging.",
      category: "Services",
      icon: FolderKanban,
    },
    {
      key: "banking",
      title: "Banking & Bank Reconciliation",
      description: "Multi-bank feeds (HDFC, ICICI, SBI) and 1-click matching of statement transactions against invoices.",
      category: "Finance",
      icon: CreditCard,
    },
    {
      key: "expenses",
      title: "Employee Expenses & Reimbursements",
      description: "Staff expense claims, travel/food allowance receipts, multi-tier approvals, and payroll reconciliation.",
      category: "Finance",
      icon: Receipt,
    },
    {
      key: "assets",
      title: "Fixed Assets & Depreciation (Schedule II)",
      description: "Automated Straight Line (SLM) and Written Down Value (WDV) depreciation under Companies Act 2013.",
      category: "Finance",
      icon: Boxes,
    },
    {
      key: "helpdesk",
      title: "Customer Support & SLA Helpdesk",
      description: "Client ticketing system with SLA timers, priority queues, and customer feedback resolution.",
      category: "Support",
      icon: LifeBuoy,
    },
    {
      key: "recruitment",
      title: "Recruitment & Applicant Tracking (ATS)",
      description: "Candidate pipeline, interview stage progression, star ratings, and direct transfer into payroll master.",
      category: "Human Resources",
      icon: Users,
    },
    {
      key: "documents",
      title: "Document Management & Legal Compliance Vault (DMS)",
      description: "AES-256 encrypted storage for PAN, CIN, GST certificates, factory licenses, leases and expiry alarms.",
      category: "Compliance",
      icon: ShieldCheck,
    },
    {
      key: "payroll",
      title: "India Payroll & Deductions",
      description: "Statutory employee deductions: EPF (12%), ESIC, State Professional Tax (PT), and Salary TDS.",
      category: "Human Resources",
      icon: BadgeIndianRupee,
    },
    {
      key: "customers",
      title: "Customers & Quotations (CRM)",
      description: "Customer directory with GSTIN verification, credit limits, and commercial proposals.",
      category: "Sales",
      icon: Users,
    },
    {
      key: "suppliers",
      title: "Suppliers & MSME Purchasing",
      description: "Vendor master tagged by MSME category for compliance with statutory 45-day payment rules.",
      category: "Procurement",
      icon: Truck,
    },
    {
      key: "financialReports",
      title: "Financial Statements (P&L / Balance Sheet)",
      description: "Schedule III Balance Sheet, Profit & Loss statement, and Cash Flow statement with CSV export.",
      category: "Finance",
      icon: BarChart3,
    },
    {
      key: "auditTrail",
      title: "MCA Audit Trail (Edit Log)",
      description: "Companies Act 2013 mandatory audit log tracking every transaction change, IP, and timestamp.",
      category: "Compliance",
      icon: ShieldCheck,
    },
  ];

  const enabledCount = Object.values(moduleSettings).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <SlidersHorizontal className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  Module Switchboard
                </h2>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                  {enabledCount} of {moduleItems.length} Enabled
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Turn modules ON or OFF. Disabled modules are hidden from sidebar and menu numbers auto-adjust in real time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEnableAll}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Enable All Modules
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Close Switchboard"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Module Grid */}
        <div className="overflow-y-auto pr-1 flex-1 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {moduleItems.map((item) => {
              const Icon = item.icon;
              const isEnabled = moduleSettings[item.key] !== false;
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isEnabled
                      ? "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shadow-sm"
                      : "border-slate-200/50 dark:border-slate-800/20 bg-slate-100/30 dark:bg-slate-900/40 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isEnabled
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-[9px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.2 rounded font-semibold text-slate-600 dark:text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shrink-0 mt-0.5 ${
                      isEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <p className="text-xs text-slate-500">
            Changes are saved live and preserved across sessions.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
