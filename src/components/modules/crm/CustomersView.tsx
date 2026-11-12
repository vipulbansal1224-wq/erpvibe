"use client";

import React, { useState } from "react";
import { Users, Plus, Search, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { Customer } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface CustomersViewProps {
  customers: Customer[];
}

export function CustomersView({ customers }: CustomersViewProps) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.gstin.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Customer Directory (B2B & B2C)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            GSTIN-verified enterprise clients with credit limits, state tax codes, and outstanding receivables ledger.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, GSTIN, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {customer.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {customer.tradeName || "Enterprise Client"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                GST Verified
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 font-mono text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">GSTIN:</span>
                <span className="font-bold text-slate-900 dark:text-white">{customer.gstin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">State / POS:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {customer.state} ({customer.stateCode})
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="truncate">{customer.city}, {customer.pincode}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Credit Limit:</span>
                <p className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {formatINR(customer.creditLimit)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">Outstanding:</span>
                <p
                  className={`font-mono font-bold ${
                    customer.outstandingBalance > 0
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {formatINR(customer.outstandingBalance)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
