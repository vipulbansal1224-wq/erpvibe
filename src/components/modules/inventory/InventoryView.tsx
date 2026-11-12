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
  Edit,
  Trash2,
} from "lucide-react";
import { InventoryItem } from "@/types/erp";
import { formatINR } from "@/lib/utils";
import { ItemModal } from "./ItemModal";

interface InventoryViewProps {
  items: InventoryItem[];
  onOpenNewItem?: () => void;
  onSaveItem?: (item: InventoryItem) => void;
  onDeleteItem?: (id: string) => void;
}

export function InventoryView({ items, onOpenNewItem, onSaveItem, onDeleteItem }: InventoryViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

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

  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveModal = (item: InventoryItem) => {
    if (onSaveItem) {
      onSaveItem(item);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Package className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Inventory & Warehouse Management
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-location stock, HSN/SAC statutory tax classifications, batch valuation and reorder levels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenNewItem || handleOpenAdd}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total SKUs Active</span>
            <Boxes className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {items.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Mapped to HSN/SAC</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Stock Valuation</span>
            <Building className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalValuation)}
          </p>
          <span className="text-[11px] text-slate-400">At Purchase Cost</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Low Stock Reorders</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {lowStockCount}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Below Min Safety Level</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>GST Valuation Accuracy</span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            100%
          </p>
          <span className="text-[11px] text-blue-500 font-medium">Auto-ITC Ready</span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, item name or HSN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Work in Progress">Work in Progress</option>
              <option value="Finished Goods">Finished Goods</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3 font-semibold">SKU Code</th>
                <th className="px-6 py-3 font-semibold">Item & Category</th>
                <th className="px-6 py-3 font-semibold">HSN/SAC</th>
                <th className="px-6 py-3 font-semibold">GST Rate</th>
                <th className="px-6 py-3 font-semibold">Cost Price</th>
                <th className="px-6 py-3 font-semibold">Selling Price</th>
                <th className="px-6 py-3 font-semibold">Current Stock</th>
                <th className="px-6 py-3 font-semibold">Warehouse</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
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
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Item"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {onDeleteItem && (
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Item"
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

      <ItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSaveItem={handleSaveModal}
      />
    </div>
  );
}
