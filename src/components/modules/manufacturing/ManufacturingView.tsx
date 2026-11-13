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
  Edit,
  Trash2,
} from "lucide-react";
import { BillOfMaterial, WorkOrder } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface ManufacturingViewProps {
  boms: BillOfMaterial[];
  workOrders: WorkOrder[];
  onAddWorkOrder?: (wo: WorkOrder) => void;
  onUpdateWorkOrder?: (wo: WorkOrder) => void;
  onDeleteWorkOrder?: (id: string) => void;
}

export function ManufacturingView({
  boms,
  workOrders,
  onAddWorkOrder,
  onUpdateWorkOrder,
  onDeleteWorkOrder,
}: ManufacturingViewProps) {
  const [activeTab, setActiveTab] = useState<"work_orders" | "boms">("work_orders");
  const [selectedBOM, setSelectedBOM] = useState<BillOfMaterial | null>(boms[0] || null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [orderNumber, setOrderNumber] = useState(`MFG/WO/26-27/${Math.floor(100 + Math.random() * 900)}`);
  const [finishedGoodName, setFinishedGoodName] = useState(boms[0]?.finishedGoodName || "Industrial Control Panel Assembly");
  const [quantityToProduce, setQuantityToProduce] = useState(50);
  const [quantityProduced, setQuantityProduced] = useState(0);
  const [status, setStatus] = useState<WorkOrder["status"]>("Planned");
  const [warehouse, setWarehouse] = useState("Mumbai Central Warehouse");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [targetDate, setTargetDate] = useState("2026-12-15");
  const [supervisor, setSupervisor] = useState("Suresh Shinde (Shift Incharge)");
  const [batchNo, setBatchNo] = useState(`BATCH-26-${Date.now().toString().slice(-4)}`);
  const [scrapAllowance, setScrapAllowance] = useState(2);

  // New BOM state
  const [showBomModal, setShowBomModal] = useState(false);
  const [newBomCode, setNewBomCode] = useState(`BOM-${Date.now().toString().slice(-3)}`);
  const [newFinishedGoodName, setNewFinishedGoodName] = useState("");
  const [newOutputQty, setNewOutputQty] = useState(1);
  const [newOperationsCost, setNewOperationsCost] = useState(5000);
  const [bomRawItemName, setBomRawItemName] = useState("Copper Busbars & Wiring");
  const [bomRawQty, setBomRawQty] = useState(10);
  const [bomRawRate, setBomRawRate] = useState(850);

  const handleOpenNew = () => {
    setEditingId(null);
    setOrderNumber(`MFG/WO/26-27/${Math.floor(100 + Math.random() * 900)}`);
    setFinishedGoodName(boms[0]?.finishedGoodName || "Industrial Control Panel Assembly");
    setQuantityToProduce(50);
    setQuantityProduced(0);
    setStatus("Planned");
    setStartDate(new Date().toISOString().split("T")[0]);
    setTargetDate("2026-12-15");
    setSupervisor("Suresh Shinde (Shift Incharge)");
    setBatchNo(`BATCH-26-${Date.now().toString().slice(-4)}`);
    setScrapAllowance(2);
    setShowModal(true);
  };

  const handleOpenEdit = (wo: WorkOrder) => {
    setEditingId(wo.id);
    setOrderNumber(wo.orderNumber);
    setFinishedGoodName(wo.finishedGoodName);
    setQuantityToProduce(wo.quantityToProduce);
    setQuantityProduced(wo.quantityProduced);
    setStatus(wo.status);
    setWarehouse(wo.warehouse);
    setStartDate(wo.startDate || new Date().toISOString().split("T")[0]);
    setTargetDate(wo.targetDate || "2026-12-15");
    setSupervisor(wo.supervisor || "Suresh Shinde (Shift Incharge)");
    setBatchNo(wo.batchNo || `BATCH-26-${Date.now().toString().slice(-4)}`);
    setScrapAllowance(wo.scrapAllowance || 2);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBom = boms.find((b) => b.finishedGoodName === finishedGoodName) || boms[0];
    const record: WorkOrder = {
      id: editingId || `WO-${Date.now()}`,
      orderNumber,
      bomId: targetBom?.id || "BOM-001",
      finishedGoodName,
      quantityToProduce: Number(quantityToProduce) || 1,
      quantityProduced: Number(quantityProduced) || 0,
      startDate,
      targetDate,
      status: Number(quantityProduced) >= Number(quantityToProduce) ? "Completed" : Number(quantityProduced) > 0 ? "In Progress" : status,
      warehouse,
      supervisor,
      batchNo,
      scrapAllowance: Number(scrapAllowance) || 0,
    };

    if (editingId && onUpdateWorkOrder) {
      onUpdateWorkOrder(record);
    } else if (onAddWorkOrder) {
      onAddWorkOrder(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Factory className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Manufacturing & Production Planning
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-level Bill of Materials (BOM), work orders, raw material consumption, and production line tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("work_orders")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "work_orders"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Work Orders ({workOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("boms")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "boms"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Bill of Materials ({boms.length})
          </button>
          {activeTab === "work_orders" && (
            <button
              onClick={handleOpenNew}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm transition"
            >
              <Plus className="h-3.5 w-3.5" />
              New Work Order
            </button>
          )}
          {activeTab === "boms" && (
            <button
              onClick={() => {
                setNewBomCode(`BOM-${Date.now().toString().slice(-3)}`);
                setNewFinishedGoodName("");
                setShowBomModal(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 shadow-sm transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New BOM
            </button>
          )}
        </div>
      </div>

      {/* Content depending on active tab */}
      {activeTab === "work_orders" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-amber-600" />
              Shop Floor Work Orders
            </h3>
            <span className="text-xs text-slate-500">Live Production Queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-3">Work Order #</th>
                  <th className="px-6 py-3">Finished Item</th>
                  <th className="px-6 py-3">Progress (Produced / Plan)</th>
                  <th className="px-6 py-3">Target Date</th>
                  <th className="px-6 py-3">Warehouse</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {workOrders.map((wo) => {
                  const progressPct = Math.round(
                    (wo.quantityProduced / wo.quantityToProduce) * 100
                  );
                  return (
                    <tr key={wo.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-3.5">
                        <span className="font-mono font-medium text-slate-900 dark:text-white">
                          {wo.orderNumber}
                        </span>
                        {wo.batchNo && (
                          <span className="block font-mono text-[10px] text-amber-600 dark:text-amber-400">
                            {wo.batchNo}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-slate-900 dark:text-white">{wo.finishedGoodName}</p>
                        {wo.supervisor && (
                          <span className="text-[10px] text-slate-400">
                            Sup: {wo.supervisor}
                          </span>
                        )}
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
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(wo)}
                            className="p-1 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit / Progress Work Order"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          {onDeleteWorkOrder && (
                            <button
                              onClick={() => onDeleteWorkOrder(wo.id)}
                              className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                              title="Delete Work Order"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
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
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {bom.bomCode}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{bom.finishedGoodName}</p>
                  </div>
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                    Output: {bom.quantityOutput} {bom.uom}
                  </span>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Total BOM Cost:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatINR(bom.totalProductionCost)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            {selectedBOM && (
              <div>
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <div>
                    <span className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {selectedBOM.bomCode}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedBOM.finishedGoodName}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Total Production Cost:</span>
                    <p className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatINR(selectedBOM.totalProductionCost)}
                    </p>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Item / Component</th>
                      <th className="py-2.5 px-3">Qty Required</th>
                      <th className="py-2.5 px-3 text-right">Unit Rate</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedBOM.items.map((item) => (
                      <tr key={item.itemId}>
                        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white">
                          {item.itemName}
                        </td>
                        <td className="py-2.5 px-3 font-mono">
                          {item.quantityRequired} {item.uom}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right text-slate-600 dark:text-slate-300">
                          {formatINR(item.unitCost)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-right font-semibold text-slate-900 dark:text-white">
                          {formatINR(item.totalCost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Factory className="w-5 h-5 text-amber-600" />
              {editingId ? "Edit Work Order Production" : "Release New Work Order"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Work Order #
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Finished Item
                  </label>
                  <input
                    type="text"
                    value={finishedGoodName}
                    onChange={(e) => setFinishedGoodName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Plan Qty
                  </label>
                  <input
                    type="number"
                    value={quantityToProduce}
                    onChange={(e) => setQuantityToProduce(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Produced
                  </label>
                  <input
                    type="number"
                    value={quantityProduced}
                    onChange={(e) => setQuantityProduced(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono font-bold text-emerald-600"
                  />
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
                    <option value="Planned">Planned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Batch / Lot Number
                  </label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    placeholder="BATCH-26-001"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Shift Supervisor / Operator
                  </label>
                  <input
                    type="text"
                    value={supervisor}
                    onChange={(e) => setSupervisor(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Staging Warehouse
                  </label>
                  <input
                    type="text"
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Scrap Allowance (%)
                  </label>
                  <input
                    type="number"
                    value={scrapAllowance}
                    onChange={(e) => setScrapAllowance(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700"
                >
                  {editingId ? "Update Work Order" : "Issue Work Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOM Modal */}
      {showBomModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              Define New Bill of Materials (BOM)
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newFinishedGoodName) return;
                const newBom: BillOfMaterial = {
                  id: `BOM-${Date.now()}`,
                  bomCode: newBomCode,
                  finishedGoodId: `FG-${Date.now().toString().slice(-4)}`,
                  finishedGoodName: newFinishedGoodName,
                  quantityOutput: Number(newOutputQty) || 1,
                  uom: "NOS",
                  operationsCost: Number(newOperationsCost) || 0,
                  totalProductionCost: (Number(bomRawQty) * Number(bomRawRate)) + (Number(newOperationsCost) || 0),
                  status: "Active",
                  items: [
                    {
                      itemId: `RAW-01`,
                      itemName: bomRawItemName,
                      sku: "SKU-RAW-101",
                      quantityRequired: Number(bomRawQty) || 1,
                      uom: "NOS",
                      unitCost: Number(bomRawRate) || 0,
                      totalCost: (Number(bomRawQty) || 1) * (Number(bomRawRate) || 0),
                    },
                  ],
                };
                boms.push(newBom);
                setSelectedBOM(newBom);
                setShowBomModal(false);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    BOM Code
                  </label>
                  <input
                    type="text"
                    value={newBomCode}
                    onChange={(e) => setNewBomCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Output Qty (NOS)
                  </label>
                  <input
                    type="number"
                    value={newOutputQty}
                    onChange={(e) => setNewOutputQty(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Finished Item Name *
                </label>
                <input
                  type="text"
                  value={newFinishedGoodName}
                  onChange={(e) => setNewFinishedGoodName(e.target.value)}
                  placeholder="e.g. Smart IoT Gateway 5G"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  required
                />
              </div>

              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500">Key Raw Material Component</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={bomRawItemName}
                    onChange={(e) => setBomRawItemName(e.target.value)}
                    placeholder="Component name"
                    className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs col-span-1"
                  />
                  <input
                    type="number"
                    value={bomRawQty}
                    onChange={(e) => setBomRawQty(Number(e.target.value))}
                    placeholder="Qty"
                    className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                  <input
                    type="number"
                    value={bomRawRate}
                    onChange={(e) => setBomRawRate(Number(e.target.value))}
                    placeholder="Rate (₹)"
                    className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Operations & Assembly Cost (₹)
                </label>
                <input
                  type="number"
                  value={newOperationsCost}
                  onChange={(e) => setNewOperationsCost(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBomModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700"
                >
                  Save Bill of Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
