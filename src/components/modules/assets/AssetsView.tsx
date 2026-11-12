"use client";

import React, { useState } from "react";
import {
  Boxes,
  Plus,
  TrendingDown,
  Calendar,
  CheckCircle2,
  DollarSign,
} from "lucide-react";
import { FixedAsset } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface AssetsViewProps {
  assets: FixedAsset[];
}

export function AssetsView({ assets }: AssetsViewProps) {
  const totalOriginalCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
  const totalDepreciation = assets.reduce((sum, a) => sum + a.accumulatedDepreciation, 0);
  const totalNetBookValue = assets.reduce((sum, a) => sum + a.currentBookValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Boxes className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Fixed Assets & Depreciation Schedule
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Compliant with Schedule II of the Indian Companies Act 2013: SLM / WDV automated monthly depreciation calculations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Calendar className="h-4 w-4" />
            Schedule II Compliant
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Gross Block (Purchase Cost)</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatINR(totalOriginalCost)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{assets.length} Fixed Assets Tracked</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Accumulated Depreciation</span>
          <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
            {formatINR(totalDepreciation)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Written off against P&L</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Net Book Value (Balance Sheet)</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalNetBookValue)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Current Asset Valuation</p>
        </div>
      </div>

      {/* Assets Register Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
