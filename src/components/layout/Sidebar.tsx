"use client";

import React from "react";
import {
  LayoutDashboard,
  Receipt,
  ShieldCheck,
  Package,
  Users,
  Truck,
  FileSpreadsheet,
  FileText,
  BadgeIndianRupee,
  Landmark,
  History,
  Settings,
  ChevronRight,
  Sparkles,
  Factory,
  FolderKanban,
  ShoppingCart,
  Boxes,
  LifeBuoy,
  BarChart3,
  CreditCard,
  SlidersHorizontal,
  ClipboardCheck,
  Navigation,
  Cog,
  Repeat,
  Wallet,
  UserCheck,
  Lock,
  Calculator,
} from "lucide-react";
import { ModuleType, ModuleSettings } from "@/types/erp";
import { moduleGuides } from "@/data/moduleGuides";

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  moduleSettings: ModuleSettings;
  onOpenSwitchboard?: () => void;
}

export function Sidebar({
  activeModule,
  setActiveModule,
  isOpen,
  setIsOpen,
  moduleSettings,
  onOpenSwitchboard,
}: SidebarProps) {
  const allNavSections = [
    {
      title: "OVERVIEW & FINANCIALS",
      items: [
        { id: "dashboard" as ModuleType, label: "Dashboard", icon: LayoutDashboard, enabled: true },
        { id: "financial-reports" as ModuleType, label: "Financial Reports & P&L", icon: BarChart3, badge: "Schedule III", enabled: moduleSettings.financialReports },
        { id: "documents" as ModuleType, label: "Legal Document Vault", icon: Lock, badge: "DMS", enabled: moduleSettings.documents },
      ],
    },
    {
      title: "INDIA STATUTORY & GST",
      items: [
        {
          id: "gst-compliance" as ModuleType,
          label: "India GST & Compliance",
          icon: ShieldCheck,
          badge: "e-Inv / e-Way",
          enabled: moduleSettings.gstCompliance,
        },
        {
          id: "invoices" as ModuleType,
          label: "Tax Invoices",
          icon: Receipt,
          badge: "B2B/B2C",
          enabled: moduleSettings.invoices,
        },
      ],
    },
    {
      title: "RETAIL & SUBSCRIPTIONS",
      items: [
        { id: "pos" as ModuleType, label: "Point of Sale (POS)", icon: ShoppingCart, badge: "UPI / Cash", enabled: moduleSettings.pos },
        { id: "subscriptions" as ModuleType, label: "Subscriptions & AMC", icon: Repeat, badge: "MRR", enabled: moduleSettings.subscriptions },
        { id: "customers" as ModuleType, label: "Customers (CRM)", icon: Users, enabled: moduleSettings.customers },
        { id: "quotations" as ModuleType, label: "Quotations & Estimates", icon: FileSpreadsheet, enabled: moduleSettings.customers },
      ],
    },
    {
      title: "PRODUCTION & SUPPLY CHAIN",
      items: [
        { id: "manufacturing" as ModuleType, label: "Manufacturing & BOM", icon: Factory, badge: "Work Orders", enabled: moduleSettings.manufacturing },
        { id: "quality" as ModuleType, label: "Quality Inspection (QM)", icon: ClipboardCheck, badge: "TQM", enabled: moduleSettings.quality },
        { id: "jobwork" as ModuleType, label: "Subcontracting / ITC-04", icon: Cog, badge: "Sec 143", enabled: moduleSettings.jobwork },
        { id: "inventory" as ModuleType, label: "Stock & Item Master", icon: Package, enabled: moduleSettings.inventory },
        { id: "fleet" as ModuleType, label: "Fleet & Logistics (TMS)", icon: Navigation, badge: "Vahan", enabled: moduleSettings.fleet },
        { id: "suppliers" as ModuleType, label: "Suppliers & MSME", icon: Truck, enabled: moduleSettings.suppliers },
        { id: "purchase-orders" as ModuleType, label: "Purchase Orders", icon: FileText, enabled: moduleSettings.suppliers },
      ],
    },
    {
      title: "PROJECTS & SERVICES",
      items: [
        { id: "projects" as ModuleType, label: "Projects & Timesheets", icon: FolderKanban, badge: "Billing", enabled: moduleSettings.projects },
        { id: "helpdesk" as ModuleType, label: "Helpdesk & SLA Tickets", icon: LifeBuoy, badge: "Support", enabled: moduleSettings.helpdesk },
      ],
    },
    {
      title: "FINANCE & HUMAN RESOURCES",
      items: [
        { id: "banking" as ModuleType, label: "Banking & Reconciliation", icon: CreditCard, badge: "1-Click", enabled: moduleSettings.banking },
        { id: "busy-accounting" as ModuleType, label: "Advanced Accounting & Vouchers", icon: Calculator, badge: "F1-F9", enabled: moduleSettings.busyAccounting !== false },
        { id: "expenses" as ModuleType, label: "Employee Expenses", icon: Wallet, badge: "Claims", enabled: moduleSettings.expenses },
        { id: "assets" as ModuleType, label: "Fixed Assets & Depr.", icon: Boxes, badge: "SLM/WDV", enabled: moduleSettings.assets },
        { id: "accounts" as ModuleType, label: "Chart of Accounts", icon: Landmark, enabled: true },
        { id: "recruitment" as ModuleType, label: "Recruitment & ATS", icon: UserCheck, badge: "Hiring", enabled: moduleSettings.recruitment },
        { id: "payroll" as ModuleType, label: "Payroll & Payslips", icon: BadgeIndianRupee, badge: "PF/ESIC", enabled: moduleSettings.payroll },
      ],
    },
    {
      title: "COMPLIANCE & SYSTEM",
      items: [
        { id: "audit-trail" as ModuleType, label: "MCA Audit Trail", icon: History, badge: "MCA Log", enabled: moduleSettings.auditTrail },
        { id: "settings" as ModuleType, label: "Settings", icon: Settings, enabled: true },
      ],
    },
  ];

  // Filter sections that have enabled items
  const visibleNavSections = allNavSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.enabled),
    }))
    .filter((section) => section.items.length > 0);

  const totalModulesCount = allNavSections.reduce((sum, sec) => sum + sec.items.length, 0);
  const activeModulesCount = visibleNavSections.reduce((sum, sec) => sum + sec.items.length, 0);

  // Running sequential counter for auto-numbering (1. Dashboard, 2. Financial reports...)
  let autoNumberCounter = 0;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-slate-900 text-slate-100 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25 font-black text-white tracking-wider text-xl">
              V
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">ERPVibe</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  INDIA
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 border border-blue-500/30">
                  {activeModulesCount} Modules Active
                </span>
                <span className="text-[10px] text-slate-400">Total {totalModulesCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {visibleNavSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-xs font-black tracking-wider text-slate-400 uppercase">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  autoNumberCounter++;
                  const currentNumber = autoNumberCounter;
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        setIsOpen(false);
                      }}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-black shrink-0 ${
                            isActive ? "text-amber-300 font-extrabold" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        >
                          {currentNumber}.
                        </span>
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-semibold whitespace-nowrap ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-slate-800 text-slate-400 group-hover:text-slate-200 border border-slate-700/60"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {isActive && <ChevronRight className="h-3 w-3 text-white/80" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={() => {
              if (onOpenSwitchboard) {
                onOpenSwitchboard();
              } else {
                setActiveModule("settings");
              }
              setIsOpen(false);
            }}
            className="w-full text-left rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 p-3 hover:border-blue-500/60 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-blue-200">Module Switchboard</span>
              </div>
              <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded font-black font-mono">
                {activeModulesCount}/{totalModulesCount}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Auto-numbered 1 to {activeModulesCount} (Click to enable/disable)
            </p>
          </button>
        </div>
      </aside>
    </>
  );
}
