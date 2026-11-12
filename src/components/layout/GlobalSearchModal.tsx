"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  X,
  Receipt,
  Package,
  Users,
  ShieldCheck,
  Landmark,
  BadgeDollarSign,
  History,
  Settings,
  ChevronRight,
  Factory,
  FolderKanban,
  ShoppingCart,
  Boxes,
  LifeBuoy,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { ModuleType, SalesInvoice, Customer, InventoryItem } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveModule: (m: ModuleType) => void;
  invoices: SalesInvoice[];
  customers: Customer[];
  items: InventoryItem[];
  onViewInvoice: (inv: SalesInvoice) => void;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
  setActiveModule,
  invoices,
  customers,
  items,
  onViewInvoice,
}: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickNav: { module: ModuleType; label: string; icon: any; category: string }[] = [
    { module: "dashboard", label: "Executive Dashboard", icon: Landmark, category: "Navigation" },
    { module: "financial-reports", label: "Financial Statements & Analytics (P&L / Balance Sheet)", icon: BarChart3, category: "Finance" },
    { module: "documents", label: "Document Management & Legal Compliance Vault (DMS)", icon: Settings, category: "Legal" },
    { module: "gst-compliance", label: "India Compliance & GST Hub (IRN / e-Way / GSTR)", icon: ShieldCheck, category: "Statutory" },
    { module: "invoices", label: "Sales Tax Invoices (B2B/B2C)", icon: Receipt, category: "Sales" },
    { module: "pos", label: "Point of Sale (POS) Cashier Register", icon: ShoppingCart, category: "Retail" },
    { module: "subscriptions", label: "Subscriptions & Recurring AMC Contracts", icon: Receipt, category: "SaaS" },
    { module: "manufacturing", label: "Manufacturing & Bill of Materials (BOM)", icon: Factory, category: "Production" },
    { module: "quality", label: "Quality Management & Inspection (QM / TQM)", icon: ShieldCheck, category: "Quality" },
    { module: "jobwork", label: "Subcontracting & Job Work (Form GST ITC-04)", icon: Factory, category: "Production" },
    { module: "inventory", label: "Stock & Item Master", icon: Package, category: "Inventory" },
    { module: "fleet", label: "Fleet & Logistics Management (TMS)", icon: Package, category: "Logistics" },
    { module: "projects", label: "Projects & Timesheet Tracking", icon: FolderKanban, category: "Services" },
    { module: "banking", label: "Banking & Bank Reconciliation", icon: CreditCard, category: "Finance" },
    { module: "expenses", label: "Employee Expenses & Reimbursements", icon: Receipt, category: "Finance" },
    { module: "assets", label: "Fixed Assets & Depreciation (Schedule II)", icon: Boxes, category: "Finance" },
    { module: "helpdesk", label: "Helpdesk & Customer Support SLA", icon: LifeBuoy, category: "Support" },
    { module: "customers", label: "Customer Master & Ledgers", icon: Users, category: "CRM" },
    { module: "recruitment", label: "Recruitment & Applicant Tracking System (ATS)", icon: Users, category: "HR" },
    { module: "payroll", label: "Payroll & Payslips (EPF/ESIC/PT)", icon: BadgeDollarSign, category: "HR" },
    { module: "accounts", label: "Chart of Accounts (Schedule III)", icon: Landmark, category: "Accounts" },
    { module: "audit-trail", label: "MCA Mandatory Audit Trail & Edit Log", icon: History, category: "MCA Compliance" },
    { module: "settings", label: "Company Statutory Profile & GSTIN", icon: Settings, category: "Settings" },
  ];

  const filteredNav = quickNav.filter(
    (n) =>
      n.label.toLowerCase().includes(query.toLowerCase()) ||
      n.category.toLowerCase().includes(query.toLowerCase())
  );

  const matchedInvoices = query
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
          i.customerName.toLowerCase().includes(query.toLowerCase()) ||
          i.customerGstin.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedItems = query
    ? items.filter(
        (it) =>
          it.name.toLowerCase().includes(query.toLowerCase()) ||
          it.sku.toLowerCase().includes(query.toLowerCase()) ||
          it.hsnSacCode.includes(query)
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-20">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search any module, invoice, item, project, bank..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Matched Invoices */}
          {matchedInvoices.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tax Invoices
              </p>
              <div className="space-y-1">
                {matchedInvoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onViewInvoice(inv);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                          {inv.invoiceNumber}
                        </p>
                        <p className="text-slate-500">{inv.customerName}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold">{formatINR(inv.grandTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Items */}
          {matchedItems.length > 0 && (
            <div>
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Stock & Item Master
              </p>
              <div className="space-y-1">
                {matchedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveModule("inventory");
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-slate-500 font-mono text-[10px]">
                          SKU: {item.sku} | HSN: {item.hsnSacCode}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono">{formatINR(item.sellingPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <div>
            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Enterprise Modules & Statutory Features
            </p>
            <div className="space-y-1">
              {filteredNav.map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.module}
                    onClick={() => {
                      setActiveModule(n.module);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="font-medium">{n.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {n.category}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
