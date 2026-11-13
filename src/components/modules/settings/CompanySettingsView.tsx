"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Landmark,
  SlidersHorizontal,
  Database,
  Trash2,
  RefreshCw,
  Sparkles,
  Factory,
  ShoppingCart,
  FolderKanban,
  Boxes,
  LifeBuoy,
  CreditCard,
  BadgeIndianRupee,
  Users,
  Truck,
  BarChart3,
  Receipt,
} from "lucide-react";
import { CompanyInfo, ModuleSettings } from "@/types/erp";

interface CompanySettingsViewProps {
  company: CompanyInfo;
  moduleSettings: ModuleSettings;
  onUpdateCompany: (company: CompanyInfo) => void;
  onUpdateModuleSettings: (settings: ModuleSettings) => void;
  onResetToCleanSlate: () => void;
  onRestoreDemoData: () => void;
}

export function CompanySettingsView({
  company,
  moduleSettings,
  onUpdateCompany,
  onUpdateModuleSettings,
  onResetToCleanSlate,
  onRestoreDemoData,
}: CompanySettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "modules" | "data">("modules");
  const [formData, setFormData] = useState<CompanyInfo>(company);
  const [localSettings, setLocalSettings] = useState<ModuleSettings>(moduleSettings);
  const [savedAlert, setSavedAlert] = useState(false);
  const [cleanAlert, setCleanAlert] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleToggleModule = (key: keyof ModuleSettings) => {
    const updated = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updated);
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
      key: "manufacturing",
      title: "Manufacturing & Production (BOM)",
      description: "Bill of materials, work orders, raw material consumption, and production line scheduling.",
      category: "Operations",
      icon: Factory,
    },
    {
      key: "quality",
      title: "Quality Management & Inspection (QM)",
      description: "Incoming GRN inspections, in-process tolerances, pre-dispatch quality certificates and non-conformance quarantine.",
      category: "Operations",
      icon: ShieldCheck,
    },
    {
      key: "fleet",
      title: "Fleet & Logistics Management (TMS)",
      description: "Commercial vehicle registry, driver assignments, fuel tracking, odometer logs, and insurance/fitness expiry alerts.",
      category: "Operations",
      icon: Truck,
    },
    {
      key: "jobwork",
      title: "Subcontracting & Job Work (Form GST ITC-04)",
      description: "GST Section 143 delivery challans, materials sent to processors, scrap accountability and 1-year return deadlines.",
      category: "Operations",
      icon: Factory,
    },
    {
      key: "subscriptions",
      title: "Subscriptions & Recurring AMC",
      description: "SaaS subscriptions, annual maintenance contracts, MRR revenue metrics, and auto GST recurring invoice generation.",
      category: "Sales",
      icon: Receipt,
    },
    {
      key: "pos",
      title: "Point of Sale (POS) Counter",
      description: "Fast retail register with touch grid, barcode search, dynamic UPI QR code, and receipt printing.",
      category: "Retail",
      icon: ShoppingCart,
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
      key: "gstCompliance",
      title: "India GST & Statutory Compliance",
      description: "e-Invoicing (IRN), e-Way Bills, GSTR-1/3B JSON generator, HSN lookup, and TDS/TCS calculation.",
      category: "Statutory",
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

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Settings & Feature Switchboard
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Customize ERPVibe to your exact business model: enable/disable any module, configure your company GSTIN, or reset to fresh production data.
          </p>
        </div>

        {savedAlert && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Settings Updated Live
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("modules")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "modules"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Enable / Disable Modules (Feature Toggles)
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Your Company & GSTIN Profile
        </button>
        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "data"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Database className="h-4 w-4" />
          Data Mode (Demo vs Fresh Clean Slate)
        </button>
      </div>

      {/* TAB 1: MODULE SWITCHBOARD */}
      {activeTab === "modules" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>
                <strong>Tailor ERPVibe to your business:</strong> Turn off modules your company doesn't need (e.g. disable Manufacturing if you are a Service business, or disable POS if you are pure B2B).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleItems.map((item) => {
              const Icon = item.icon;
              const isEnabled = localSettings[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isEnabled
                      ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                      : "border-slate-100 dark:border-slate-800/40 bg-slate-50/60 dark:bg-slate-900/40 opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isEnabled
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-500">
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
                    onClick={() => handleToggleModule(item.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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
      )}

      {/* TAB 2: COMPANY PROFILE */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Configure Your Registered Organization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Company Legal Name (MCA Registered) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="e.g. My Real Company Private Limited"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  placeholder="e.g. MyBrand Solutions"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Your GSTIN (15 Digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="e.g. AAAAA0000A"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Identification Number (CIN)
                </label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                  placeholder="e.g. U72900DL2023PTC123456"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  MSME Udyam Registration Number
                </label>
                <input
                  type="text"
                  value={formData.msmeUdyam}
                  onChange={(e) => setFormData({ ...formData, msmeUdyam: e.target.value })}
                  placeholder="e.g. UDYAM-DL-01-0012345"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address & Bank Details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Office Address & Bank Details (Printed on Invoices)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Office Address</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">City & Pincode</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">State & 2-Digit GST Code</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    className="w-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name & Branch</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Account Number & IFSC</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20"
            >
              <Save className="h-4 w-4" />
              Save Company Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DATA & DEMO MANAGEMENT */}
      {activeTab === "data" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Production Data Mode vs. Demo Showcase
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You can switch between pre-loaded demo transactions (used to preview charts, invoices, and reports) and a fresh, blank ledger ready for your real business operations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-xs text-red-900 dark:text-red-200">
                    Switch to Clean Slate (Blank Database)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Clears all sample invoices, dummy stock, and demo transactions so you can start recording real invoices and items for your company.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onResetToCleanSlate();
                    setCleanAlert(true);
                    setTimeout(() => setCleanAlert(false), 3000);
                  }}
                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
                >
                  Clear Demo Data & Start Fresh
                </button>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200">
                    Load Demo Showcase Data
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Repopulates realistic enterprise transactions, Indian clients (TCS, Infosys, Reliance), invoices, and charts to showcase ERPVibe to customers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDemoData();
                    setCleanAlert(true);
                    setTimeout(() => setCleanAlert(false), 3000);
                  }}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
                >
                  Populate Demo Showcase Data
                </button>
              </div>
            </div>

            {cleanAlert && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Ledger updated successfully!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
