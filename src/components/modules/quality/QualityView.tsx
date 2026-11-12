"use client";

import { useState } from "react";
import { QualityInspection } from "@/types/erp";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Plus,
  Search,
  ClipboardCheck,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";

interface QualityViewProps {
  inspections: QualityInspection[];
  onAddInspection: (inspection: QualityInspection) => void;
}

export function QualityView({ inspections, onAddInspection }: QualityViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [inspectionNo, setInspectionNo] = useState(`QC-${Date.now().toString().slice(-4)}`);
  const [inspectionType, setInspectionType] = useState<"Incoming (GRN)" | "In-Process" | "Dispatch QC">("Incoming (GRN)");
  const [itemName, setItemName] = useState("");
  const [lotBatchNo, setLotBatchNo] = useState("");
  const [inspectedBy, setInspectedBy] = useState("Ramesh Pawar (QA)");
  const [sampleSize, setSampleSize] = useState(10);
  const [paramName, setParamName] = useState("Dimensions & Tolerance");
  const [standardVal, setStandardVal] = useState("±0.05 mm");
  const [measuredVal, setMeasuredVal] = useState("0.02 mm");
  const [status, setStatus] = useState<"Accepted" | "Rejected" | "Conditional Pass">("Accepted");

  const filtered = inspections.filter((item) => {
    const matchSearch =
      item.inspectionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lotBatchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "All" || item.inspectionType === filterType;
    return matchSearch && matchType;
  });

  const totalAccepted = inspections.filter((i) => i.status === "Accepted").length;
  const totalRejected = inspections.filter((i) => i.status === "Rejected").length;
  const passRate = inspections.length > 0 ? Math.round((totalAccepted / inspections.length) * 100) : 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) return;
    const newRecord: QualityInspection = {
      id: `QC-${Date.now()}`,
      inspectionNo,
      inspectionType,
      itemName,
      lotBatchNo: lotBatchNo || `LOT-${Date.now().toString().slice(-4)}`,
      inspectedBy,
      date: new Date().toISOString().split("T")[0],
      sampleSize: Number(sampleSize) || 1,
      status,
      parameters: [
        {
          name: paramName,
          standardValue: standardVal,
          measuredValue: measuredVal,
          passed: status !== "Rejected",
        },
      ],
    };
    onAddInspection(newRecord);
    setShowModal(false);
    setItemName("");
    setLotBatchNo("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
              ISO 9001:2015 & TQM
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              Zero Defect Framework
            </span>
          </div>
          <h1 className="text-2xl font-bold">Quality Management & Inspection (QM)</h1>
          <p className="text-emerald-100 text-sm mt-1">
            Incoming Material GRN Inspection, In-Process QC Checks, Pre-Dispatch Certificates & Non-Conformance Log
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-800 rounded-xl font-semibold shadow hover:bg-emerald-50 transition"
        >
          <Plus className="w-5 h-5" />
          New Inspection
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Inspections
            <ClipboardCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {inspections.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Active lot inspection sheets</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Pass Rate (TQM)
            <ShieldCheck className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            {passRate}%
          </div>
          <p className="text-xs text-emerald-600 mt-1">Direct pass without concession</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Accepted Lots
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {totalAccepted}
          </div>
          <p className="text-xs text-slate-500 mt-1">Moved to Available stock</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Rejection Quarantine
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600 mt-2">
            {totalRejected}
          </div>
          <p className="text-xs text-red-500 mt-1">Vendor debit notes pending</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Inspection #, Item or Lot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Incoming (GRN)", "In-Process", "Dispatch QC"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === tab
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Inspections List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Inspection # / Date</th>
                <th className="py-3 px-4">QC Type</th>
                <th className="py-3 px-4">Item & Batch</th>
                <th className="py-3 px-4">Sample Size</th>
                <th className="py-3 px-4">Inspector</th>
                <th className="py-3 px-4">Key Parameters Checked</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.inspectionNo}
                    </div>
                    <div className="text-xs text-slate-500">{item.date}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800">
                      {item.inspectionType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {item.itemName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">Lot: {item.lotBatchNo}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {item.sampleSize} units
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {item.inspectedBy}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      {item.parameters.map((p, idx) => (
                        <div key={idx} className="text-xs flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${p.passed ? "bg-emerald-500" : "bg-red-500"}`} />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{p.name}:</span>
                          <span className="text-slate-500">{p.measuredValue} (Std: {p.standardValue})</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : item.status === "Conditional Pass"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                          : "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300"
                      }`}
                    >
                      {item.status === "Accepted" && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {item.status === "Conditional Pass" && <AlertTriangle className="w-3.5 h-3.5" />}
                      {item.status === "Rejected" && <XCircle className="w-3.5 h-3.5" />}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No quality inspection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for New Inspection */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              Create Quality Inspection Sheet
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Inspection Number
                  </label>
                  <input
                    type="text"
                    value={inspectionNo}
                    onChange={(e) => setInspectionNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Inspection Type
                  </label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Incoming (GRN)">Incoming (GRN)</option>
                    <option value="In-Process">In-Process</option>
                    <option value="Dispatch QC">Dispatch QC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Item / Part Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild Steel Sheet 2mm / Hydraulic Valve"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Batch / Lot No.
                  </label>
                  <input
                    type="text"
                    placeholder="LOT-2026-X"
                    value={lotBatchNo}
                    onChange={(e) => setLotBatchNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Sample Size (Units)
                  </label>
                  <input
                    type="number"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Parameter Checked */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-2 border border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Key Quality Parameter
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Parameter (e.g. Hardness)"
                    value={paramName}
                    onChange={(e) => setParamName(e.target.value)}
                    className="text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Std Value (e.g. 58-62 HRC)"
                    value={standardVal}
                    onChange={(e) => setStandardVal(e.target.value)}
                    className="text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    placeholder="Measured Value (e.g. 60 HRC)"
                    value={measuredVal}
                    onChange={(e) => setMeasuredVal(e.target.value)}
                    className="text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Inspector Name
                  </label>
                  <input
                    type="text"
                    value={inspectedBy}
                    onChange={(e) => setInspectedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    QC Verdict
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value="Accepted">Accepted (Pass)</option>
                    <option value="Conditional Pass">Conditional Pass</option>
                    <option value="Rejected">Rejected</option>
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save Inspection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
