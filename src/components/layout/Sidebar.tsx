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
  BadgeDollarSign,
  Landmark,
  History,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { ModuleType } from "@/types/erp";

interface SidebarProps {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({
  activeModule,
  setActiveModule,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const navSections = [
    {
      title: "OVERVIEW",
      items: [
        { id: "dashboard" as ModuleType, label: "Dashboard", icon: LayoutDashboard },
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
        },
        {
          id: "invoices" as ModuleType,
          label: "Tax Invoices",
          icon: Receipt,
          badge: "B2B/B2C",
        },
      ],
    },
    {
      title: "SALES & CRM",
      items: [
        { id: "customers" as ModuleType, label: "Customers", icon: Users },
        { id: "quotations" as ModuleType, label: "Quotations & Estimates", icon: FileSpreadsheet },
      ],
    },
    {
      title: "INVENTORY & PURCHASES",
      items: [
        { id: "inventory" as ModuleType, label: "Stock & Item Master", icon: Package },
        { id: "suppliers" as ModuleType, label: "Suppliers & Vendors", icon: Truck },
        { id: "purchase-orders" as ModuleType, label: "Purchase Orders", icon: FileText },
      ],
    },
    {
      title: "FINANCE & HUMAN RESOURCES",
      items: [
        { id: "accounts" as ModuleType, label: "Chart of Accounts", icon: Landmark },
        { id: "payroll" as ModuleType, label: "Payroll & Payslips", icon: BadgeDollarSign, badge: "PF/ESIC" },
      ],
    },
    {
      title: "COMPLIANCE & SYSTEM",
      items: [
        { id: "audit-trail" as ModuleType, label: "MCA Audit Trail", icon: History, badge: "MCA Log" },
        { id: "settings" as ModuleType, label: "Company Settings", icon: Settings },
      ],
    },
  ];

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
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20 font-bold text-white tracking-wider text-lg">
              E
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white">ERPNext</span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                  INDIA
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Statutory & Enterprise Suite</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveModule(item.id);
                        setIsOpen(false);
                      }}
                      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
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
          <div className="rounded-xl bg-gradient-to-r from-blue-950/60 to-indigo-950/60 border border-blue-800/40 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-blue-200">MCA & GST Ready</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Companies Act 2013 audit trail and e-Invoice IRN API live.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
