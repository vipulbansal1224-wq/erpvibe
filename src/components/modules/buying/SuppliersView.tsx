"use client";

import React, { useState } from "react";
import { Truck, Plus, Search, ShieldCheck, Mail, Phone, Clock, AlertCircle } from "lucide-react";
import { Supplier } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface SuppliersViewProps {
  suppliers: Supplier[];
}

export function SuppliersView({ suppliers }: SuppliersViewProps) {
  const [search, setSearch] = useState("");

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.gstin.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Truck className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Suppliers & MSME Vendor Management
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            MSME classification (Micro/Small/Medium) for statutory 43B(h) Income Tax & 45-day MSME Act payment tracking.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search supplier, GSTIN, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {supplier.name}
                </h3>
                <span className="inline-block mt-0.5 rounded px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {supplier.msmeCategory} Vendor
                </span>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                Active
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">GSTIN:</span>
                <span className="font-bold text-slate-900 dark:text-white">{supplier.gstin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">State:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {supplier.state} ({supplier.stateCode})
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Payment Terms: <strong>{supplier.paymentTerms}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{supplier.phone}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[10px]">Accounts Payable:</span>
              <p className="font-mono font-bold text-slate-900 dark:text-white">
                {formatINR(supplier.balancePayable)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
