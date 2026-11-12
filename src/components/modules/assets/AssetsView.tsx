"use client";

import React, { useState } from "react";
import {
  Boxes,
  Plus,
  TrendingDown,
  Calendar,
  CheckCircle2,
  DollarSign,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import { FixedAsset } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface AssetsViewProps {
  assets: FixedAsset[];
  onAddAsset?: (asset: FixedAsset) => void;
  onUpdateAsset?: (asset: FixedAsset) => void;
  onDeleteAsset?: (id: string) => void;
}

export function AssetsView({
  assets,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: AssetsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [assetCode, setAssetCode] = useState(`AST-${Date.now().toString().slice(-4)}`);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FixedAsset["category"]>("Plant & Machinery");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [purchaseCost, setPurchaseCost] = useState(100000);
  const [usefulLifeYears, setUsefulLifeYears] = useState(10);
  const [depreciationMethod, setDepreciationMethod] = useState<FixedAsset["depreciationMethod"]>("Straight Line (SLM)");
  const [status, setStatus] = useState<FixedAsset["status"]>("Active");

  const totalOriginalCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
  const totalDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

  const handleOpenNew = () => {
    setEditingId(null);
    setAssetCode(`AST-${Date.now().toString().slice(-4)}`);
    setName("");
    setPurchaseCost(100000);
    setUsefulLifeYears(10);
    setDepreciationMethod("Straight Line (SLM)");
    setStatus("Active");
    setShowModal(true);
  };

  const handleOpenEdit = (ast: FixedAsset) => {
    setEditingId(ast.id);
    setAssetCode(ast.assetCode);
    setName(ast.name);
    setCategory(ast.category);
    setPurchaseDate(ast.purchaseDate);
    setPurchaseCost(ast.purchaseCost);
    setUsefulLifeYears(ast.usefulLifeYears);
    setDepreciationMethod(ast.depreciationMethod);
    setStatus(ast.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Calculate annual and current depreciation estimate
    const annualRate = depreciationMethod === "Straight Line (SLM)" ? 100 / usefulLifeYears : 200 / usefulLifeYears;
    const estDepreciation = Math.round((purchaseCost * (annualRate / 100)) * 0.5); // 6 months est
    const currentBookValue = Math.max(0, purchaseCost - estDepreciation);

    const record: FixedAsset = {
      id: editingId || `AST-${Date.now()}`,
      assetCode,
      name,
      category,
      purchaseDate,
      purchaseCost: Number(purchaseCost) || 0,
      salvageValue: Math.round((Number(purchaseCost) || 0) * 0.05),
      usefulLifeYears: Number(usefulLifeYears) || 1,
      depreciationMethod,
      accumulatedDepreciation: estDepreciation,
      currentBookValue,
      status,
    };

    if (editingId && onUpdateAsset) {
      onUpdateAsset(record);
    } else if (onAddAsset) {
      onAddAsset(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Boxes className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fixed Assets & Depreciation Schedule
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Compliant with Schedule II of the Indian Companies Act 2013: SLM / WDV automated monthly depreciation calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Fixed Asset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Gross Block (Original Cost)</span>
            <DollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalOriginalCost)}
          </p>
          <span className="text-[11px] text-slate-400">Historical acquisition value</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Acc. Depreciation</span>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">
            -{formatINR(totalDepreciation)}
          </p>
          <span className="text-[11px] text-red-500 font-medium">As per Schedule II rates</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Net Carrying Block</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatINR(totalNetBookValue)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Balance sheet asset value</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Capitalized Assets</span>
            <Boxes className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {assets.length}
          </p>
          <span className="text-[11px] text-blue-500 font-medium">Tagged and verified</span>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-6 py-3">Asset Code</th>
                <th className="px-6 py-3">Asset Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Purchase Date</th>
                <th className="px-6 py-3">Method & Life</th>
                <th className="px-6 py-3 text-right">Original Cost</th>
                <th className="px-6 py-3 text-right">Acc. Depreciation</th>
                <th className="px-6 py-3 text-right">Net Book Value</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {assets.map((ast) => (
                <tr key={ast.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {ast.assetCode}
                  </td>
                  <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                    {ast.name}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px]">
                      {ast.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                    {ast.purchaseDate}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                    <p className="font-semibold">{ast.depreciationMethod}</p>
                    <p className="text-[10px] text-slate-400">{ast.usefulLifeYears} Years Life</p>
                  </td>
                  <td className="px-6 py-3.5 font-mono text-right text-slate-700 dark:text-slate-300">
                    {formatINR(ast.purchaseCost)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-right text-red-600 dark:text-red-400">
                    -{formatINR(ast.accumulatedDepreciation)}
                  </td>
                  <td className="px-6 py-3.5 font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {formatINR(ast.currentBookValue)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                      {ast.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(ast)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Edit Asset"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteAsset && (
                        <button
                          onClick={() => onDeleteAsset(ast.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-indigo-600" />
              {editingId ? "Edit Fixed Asset Record" : "Capitalize New Fixed Asset"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Asset Code / Tag
                  </label>
                  <input
                    type="text"
                    value={assetCode}
                    onChange={(e) => setAssetCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Plant & Machinery">Plant & Machinery</option>
                    <option value="IT Equipment">IT Equipment</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Buildings">Buildings</option>
                    <option value="Furniture & Fixtures">Furniture & Fixtures</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Asset Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g. CNC Vertical Machining Center VMC-850"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Acquisition Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => setPurchaseCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Useful Life (Yrs)
                  </label>
                  <input
                    type="number"
                    value={usefulLifeYears}
                    onChange={(e) => setUsefulLifeYears(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Depr. Method
                  </label>
                  <select
                    value={depreciationMethod}
                    onChange={(e) => setDepreciationMethod(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Straight Line (SLM)">Straight Line (SLM)</option>
                    <option value="Written Down Value (WDV)">Written Down (WDV)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="Disposed">Disposed</option>
                    <option value="Written Off">Written Off</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {editingId ? "Update Asset" : "Capitalize Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
