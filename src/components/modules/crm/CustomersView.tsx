"use client";

import React, { useState } from "react";
import { Users, Plus, Search, ShieldCheck, Mail, Phone, MapPin, Edit, Trash2, LayoutGrid, Table as TableIcon } from "lucide-react";
import { Customer } from "@/types/erp";
import { formatINR } from "@/lib/utils";
import { CustomerModal } from "./CustomerModal";

interface CustomersViewProps {
  customers: Customer[];
  onAddCustomer?: (customer: Customer) => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (id: string) => void;
}

export function CustomersView({
  customers,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomersViewProps) {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.gstin.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleSave = (customer: Customer) => {
    if (editingCustomer) {
      if (onUpdateCustomer) onUpdateCustomer(customer);
    } else {
      if (onAddCustomer) onAddCustomer(customer);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Customer Directory (B2B & B2C)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            GSTIN-verified enterprise clients with credit limits, state tax codes, and outstanding receivables ledger.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition ${viewMode === "table" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500"}`}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition ${viewMode === "grid" ? "bg-white dark:bg-slate-700 text-blue-600 shadow-sm" : "text-slate-500"}`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Customer
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Client Code & Name</th>
                  <th className="px-5 py-3 font-semibold">Contact Person & Phone</th>
                  <th className="px-5 py-3 font-semibold">GSTIN / PAN</th>
                  <th className="px-5 py-3 font-semibold">State / POS</th>
                  <th className="px-5 py-3 font-semibold">Credit Limit (₹)</th>
                  <th className="px-5 py-3 font-semibold">Credit Days</th>
                  <th className="px-5 py-3 font-semibold">Outstanding (₹)</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">{customer.id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {customer.contactPerson || customer.email}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono">{customer.phone}</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px]">
                      <span className="font-medium text-slate-900 dark:text-white">{customer.gstin || "Unregistered"}</span>
                      {customer.pan && <span className="block text-slate-400">PAN: {customer.pan}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                        {customer.state} ({customer.stateCode})
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {formatINR(customer.creditLimit)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {customer.creditDays || 30} Days
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold">
                      <span className={customer.outstandingBalance > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}>
                        {formatINR(customer.outstandingBalance)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(customer)}
                          className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Edit Customer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        {onDeleteCustomer && (
                          <button
                            onClick={() => onDeleteCustomer(customer.id)}
                            className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                            title="Delete Customer"
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((customer) => (
          <div
            key={customer.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-blue-400 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {customer.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{customer.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(customer)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Customer"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  {onDeleteCustomer && (
                    <button
                      onClick={() => onDeleteCustomer(customer.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Delete Customer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 font-mono text-[11px] space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{customer.gstin || "Unregistered"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">State / POS:</span>
                  <span className="text-slate-700 dark:text-slate-300">
                    {customer.state} ({customer.stateCode})
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 mt-2">
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
      )}

      <CustomerModal
        isOpen={isModalOpen}
        customer={editingCustomer}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
