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
} from "lucide-react";
import { SalesInvoice } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface InvoicesViewProps {
  invoices: SalesInvoice[];
  onOpenNewInvoice: () => void;
  onViewInvoice: (inv: SalesInvoice) => void;
  onGenerateIRN: (invId: string) => void;
}

export function InvoicesView({
  invoices,
  onOpenNewInvoice,
  onViewInvoice,
  onGenerateIRN,
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Sales Invoices (GST & e-Invoice Ready)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Create, manage and print Indian GST tax invoices with automatic CGST, SGST, IGST calculations and IRP QR generation.
          </p>
        </div>

        <button
          onClick={onOpenNewInvoice}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          Create Tax Invoice
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, client, GSTIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Invoices" },
            { id: "paid", label: "Paid" },
            { id: "unpaid", label: "Pending Payment" },
            { id: "irn_generated", label: "IRN Signed" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                filterStatus === f.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Invoice No</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Customer & GSTIN</th>
                <th className="px-6 py-3">Place of Supply</th>
                <th className="px-6 py-3">Taxable Value</th>
                <th className="px-6 py-3">GST Tax</th>
                <th className="px-6 py-3">Grand Total</th>
                <th className="px-6 py-3">e-Invoice IRN</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    {inv.invoiceDate}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{inv.customerName}</p>
                    <p className="font-mono text-[10px] text-slate-500">{inv.customerGstin}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono">
                      {inv.placeOfSupply}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                    {formatINR(inv.subTotal)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-300">
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
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onViewInvoice(inv)}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Print / View
                      </button>
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
