"use client";

import React, { useState } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Boxes,
  Building,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { InventoryItem } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface InventoryViewProps {
  items: InventoryItem[];
  onOpenNewItem: () => void;
}

export function InventoryView({ items, onOpenNewItem }: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.hsnSacCode.includes(search);

    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && item.category === categoryFilter;
  });

  const totalValuation = items.reduce(
    (sum, item) => sum + item.currentStock * item.purchasePrice,
    0
  );
  const lowStockCount = items.filter((i) => i.currentStock <= i.reorderLevel).length;

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Stock & Inventory Management
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Item master catalog, Indian HSN code mapping, multi-warehouse stock ledgers, and automated reorder level alerts.
          </p>
        </div>

        <button
          onClick={onOpenNewItem}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Item Master
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Inventory Valuation</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatINR(totalValuation)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Based on FIFO Purchase Cost</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total SKUs Tracked</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {items.length} Active Items
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Finished Goods, Services & Consumables</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Low Stock Warnings</span>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
            {lowStockCount} Item{lowStockCount > 1 ? "s" : ""} Below Threshold
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Automated Purchase Order suggestion</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search SKU, name, HSN code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Items" },
            { id: "Finished Goods", label: "Finished Goods" },
            { id: "Services", label: "Services" },
            { id: "Consumables", label: "Consumables" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                categoryFilter === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">SKU & Code</th>
                <th className="px-6 py-3">Item Name</th>
                <th className="px-6 py-3">HSN/SAC</th>
                <th className="px-6 py-3">GST Slab</th>
                <th className="px-6 py-3">Purchase Price</th>
                <th className="px-6 py-3">Selling Price</th>
                <th className="px-6 py-3">Stock Level</th>
                <th className="px-6 py-3">Warehouse</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                    {item.sku}
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                    {item.hsnSacCode}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-400">
                      {item.gstRate}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                    {formatINR(item.purchasePrice)}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                    {formatINR(item.sellingPrice)}
                  </td>
                  <td className="px-6 py-3.5 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{item.currentStock}</span>{" "}
                    <span className="text-slate-400 text-[10px]">{item.uom}</span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 text-[11px]">
                    {item.warehouse}
                  </td>
                  <td className="px-6 py-3.5">
                    {item.currentStock <= item.reorderLevel ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-950/60 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                        <AlertTriangle className="h-3 w-3" />
                        Low Stock (Min: {item.reorderLevel})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Healthy
                      </span>
                    )}
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
