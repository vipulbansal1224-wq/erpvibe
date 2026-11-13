"use client";

import React, { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  FileCheck,
  Filter,
  Trash2,
  Check,
} from "lucide-react";
import { SalesInvoice } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface InvoicesViewProps {
  invoices: SalesInvoice[];
  onOpenNewInvoice: () => void;
  onViewInvoice: (inv: SalesInvoice) => void;
  onGenerateIRN: (invId: string) => void;
  onDeleteInvoice?: (invId: string) => void;
  onTogglePaymentStatus?: (invId: string) => void;
}

export function InvoicesView({
  invoices,
  onOpenNewInvoice,
  onViewInvoice,
  onGenerateIRN,
  onDeleteInvoice,
  onTogglePaymentStatus,
}: InvoicesViewProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerGstin.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "paid") return matchesSearch && inv.paymentStatus === "Paid";
    if (filterStatus === "unpaid") return matchesSearch && (inv.paymentStatus === "Unpaid" || inv.paymentStatus === "Partially Paid");
    if (filterStatus === "irn_generated") return matchesSearch && inv.eInvoiceStatus === "Generated";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Receipt className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Sales Tax Invoices (GST Compliant)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Form GST INV-01 compliant tax invoices with real-time IRP e-Invoice IRN QR code generation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewInvoice}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Create Tax Invoice
          </button>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice #, customer, GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Invoices</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid / Due</option>
              <option value="irn_generated">IRN Generated</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-semibold">Invoice #</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Customer & GSTIN</th>
                <th className="px-6 py-3 font-semibold">Place of Supply</th>
                <th className="px-6 py-3 font-semibold">Taxable Value</th>
                <th className="px-6 py-3 font-semibold">Total GST</th>
                <th className="px-6 py-3 font-semibold">Grand Total</th>
                <th className="px-6 py-3 font-semibold">IRN Status</th>
                <th className="px-6 py-3 font-semibold">Payment</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5">
                    <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                      {inv.invoiceNumber}
                    </span>
                    {inv.poNumber && (
                      <span className="block text-[10px] text-slate-400 font-mono">
                        PO: {inv.poNumber}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">
                    {inv.invoiceDate}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{inv.customerName}</p>
                    <p className="font-mono text-[11px] text-slate-400">{inv.customerGstin}</p>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                      {inv.placeOfSupply}
                    </span>
                    {inv.vehicleNo && (
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        🚛 {inv.vehicleNo}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {formatINR(inv.subTotal)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {formatINR(inv.cgstTotal + inv.sgstTotal + inv.igstTotal)}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(inv.grandTotal)}
                  </td>
                  <td className="px-6 py-3.5">
                    {inv.eInvoiceStatus === "Generated" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        IRN Signed
                      </span>
                    ) : (
                      <button
                        onClick={() => onGenerateIRN(inv.id)}
                        className="rounded bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 text-[10px] font-medium transition-colors"
                      >
                        Generate IRN
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={() => onTogglePaymentStatus && onTogglePaymentStatus(inv.id)}
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-80 transition ${
                        inv.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : inv.paymentStatus === "Partially Paid"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                      title="Click to toggle Paid/Unpaid"
                    >
                      {inv.paymentStatus}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="View / Print Tax Invoice"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Print
                      </button>
                      {onDeleteInvoice && (
                        <button
                          onClick={() => onDeleteInvoice(inv.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
