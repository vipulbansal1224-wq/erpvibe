"use client";

import React, { useState } from "react";
import {
  Factory,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { BillOfMaterial, WorkOrder } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface ManufacturingViewProps {
  boms: BillOfMaterial[];
  workOrders: WorkOrder[];
  onNewWorkOrder?: () => void;
}

export function ManufacturingView({
  boms,
  workOrders,
}: ManufacturingViewProps) {
  const [activeTab, setActiveTab] = useState<"work_orders" | "boms">("work_orders");
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterial | null>(boms[0] || null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Factory className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Manufacturing & Production Planning
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-level Bill of Materials (BOM), work orders, raw material consumption, and production line tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Layers className="h-4 w-4" />
            {boms.length} Active BOMs
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("work_orders")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "work_orders"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Production Work Orders ({workOrders.length})
        </button>
        <button
          onClick={() => setActiveTab("boms")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "boms"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Layers className="h-4 w-4" />
          Bill of Materials (BOM Master)
        </button>
      </div>

      {activeTab === "work_orders" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3">Work Order #</th>
                  <th className="px-6 py-3">Product to Produce</th>
                  <th className="px-6 py-3">Quantity & Progress</th>
                  <th className="px-6 py-3">Scheduled Dates</th>
                  <th className="px-6 py-3">Target Warehouse</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {workOrders.map((wo) => {
                  const progressPct = Math.round((wo.quantityProduced / wo.quantityToProduce) * 100);
                  return (
                    <tr key={wo.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                        {wo.orderNumber}
                      </td>
                      <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                        {wo.finishedGoodName}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            {wo.quantityProduced} / {wo.quantityToProduce} Units
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">({progressPct}%)</span>
                        </div>
                        <div className="mt-1 h-1.5 w-32 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              progressPct === 100 ? "bg-emerald-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                        <span>{wo.startDate}</span> → <span>{wo.targetDate}</span>
                      </td>
                      <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300 text-[11px]">
                        {wo.warehouse}
                      </td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            wo.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : wo.status === "In Progress"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          {wo.status === "Completed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* BOM List */}
          <div className="space-y-3">
            {boms.map((bom) => (
              <div
                key={bom.id}
                onClick={() => setSelectedBOM(bom)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedBOM?.id === bom.id
                    ? "border-blue-600 bg-blue-50/50 dark:bg-slate-800/90 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                      {bom.bomCode}
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-0.5">
                      {bom.finishedGoodName}
                    </h3>
                  </div>
                  <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold">
                    Active
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  <span>Unit Yield: 1 {bom.uom}</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(bom.totalProductionCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* BOM Breakdown */}
          {selectedBOM && (
            <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedBOM.finishedGoodName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">BOM Code: {selectedBOM.bomCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Estimated Production Cost</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
                    {formatINR(selectedBOM.totalProductionCost)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Raw Materials & Component List
                </h4>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-3 py-2">Component Name</th>
                        <th className="px-3 py-2">SKU</th>
                        <th className="px-3 py-2 text-center">Required Qty</th>
                        <th className="px-3 py-2 text-right">Unit Cost</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                      {selectedBOM.items.map((item) => (
                        <tr key={item.itemId}>
                          <td className="px-3 py-2 font-sans font-medium text-slate-900 dark:text-white">
                            {item.itemName}
                          </td>
                          <td className="px-3 py-2 text-slate-500">{item.sku}</td>
                          <td className="px-3 py-2 text-center">
                            {item.quantityRequired} {item.uom}
                          </td>
                          <td className="px-3 py-2 text-right">{formatINR(item.unitCost)}</td>
                          <td className="px-3 py-2 text-right font-bold text-slate-900 dark:text-white">
                            {formatINR(item.totalCost)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 flex justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  Assembly Labor & Machine Operations Cost:
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">
                  {formatINR(selectedBOM.operationsCost)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
