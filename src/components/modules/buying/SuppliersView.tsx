"use client";

import React, { useState } from "react";
import { Truck, Plus, Search, ShieldCheck, Mail, Phone, Clock, AlertCircle, Edit, Trash2 } from "lucide-react";
import { Supplier } from "@/types/erp";
import { formatINR } from "@/lib/utils";
import { SupplierModal } from "./SupplierModal";

interface SuppliersViewProps {
  suppliers: Supplier[];
  onAddSupplier?: (supplier: Supplier) => void;
  onUpdateSupplier?: (supplier: Supplier) => void;
  onDeleteSupplier?: (id: string) => void;
}

export function SuppliersView({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}: SuppliersViewProps) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.gstin.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleSave = (supplier: Supplier) => {
    if (editingSupplier) {
      if (onUpdateSupplier) onUpdateSupplier(supplier);
    } else {
      if (onAddSupplier) onAddSupplier(supplier);
    }
  };

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

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search supplier, GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Supplier
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-purple-400 transition flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {supplier.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">{supplier.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                    {supplier.msmeCategory}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(supplier)}
                    className="p-1 rounded text-slate-400 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Supplier"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  {onDeleteSupplier && (
                    <button
                      onClick={() => onDeleteSupplier(supplier.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                      title="Delete Supplier"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-2.5 font-mono text-[11px] space-y-1 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">GSTIN:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{supplier.gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PAN:</span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold truncate max-w-[170px]">
                    {supplier.pan}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 mt-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Terms: {supplier.paymentTerms} (Sec 15 MSME)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-500 text-[10px]">Status:</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {supplier.status}
                </p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px]">Payable Balance:</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatINR(supplier.balancePayable)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SupplierModal
        isOpen={isModalOpen}
        supplier={editingSupplier}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
