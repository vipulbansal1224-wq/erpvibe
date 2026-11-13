"use client";

import { useState } from "react";
import { JobWorkOrder } from "@/types/erp";
import {
  Cog,
  Plus,
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";

interface JobWorkViewProps {
  orders: JobWorkOrder[];
  onAddOrder: (order: JobWorkOrder) => void;
  onUpdateOrder?: (order: JobWorkOrder) => void;
  onDeleteOrder?: (id: string) => void;
}

export function JobWorkView({
  orders,
  onAddOrder,
  onUpdateOrder,
  onDeleteOrder,
}: JobWorkViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [challanNo, setChallanNo] = useState(`JW/ITC04/26-${Date.now().toString().slice(-3)}`);
  const [jobWorkerName, setJobWorkerName] = useState("");
  const [jobWorkerGstin, setJobWorkerGstin] = useState("");
  const [natureOfProcessing, setNatureOfProcessing] = useState("Heat Treatment & Surface Coating");
  const [inputItemName, setInputItemName] = useState("");
  const [inputQuantity, setInputQuantity] = useState(100);
  const [expectedOutputItem, setExpectedOutputItem] = useState("");
  const [dispatchedDate, setDispatchedDate] = useState(new Date().toISOString().split("T")[0]);
  const [statutoryDueDate, setStatutoryDueDate] = useState("2027-11-12");
  const [receivedQuantity, setReceivedQuantity] = useState(0);
  const [ewayBillNo, setEwayBillNo] = useState("");
  const [assessmentValue, setAssessmentValue] = useState(150000);
  const [processingRate, setProcessingRate] = useState(250);
  const [scrapAllowancePercent, setScrapAllowancePercent] = useState(1.5);
  const [status, setStatus] = useState<JobWorkOrder["status"]>("Material Sent");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.challanNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.jobWorkerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.inputItemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalDispatched = orders.reduce((sum, o) => sum + o.inputQuantity, 0);
  const totalReceived = orders.reduce((sum, o) => sum + o.receivedQuantity, 0);
  const pendingRecovery = totalDispatched - totalReceived;

  const handleOpenNew = () => {
    setEditingId(null);
    setChallanNo(`JW/ITC04/26-${Date.now().toString().slice(-3)}`);
    setJobWorkerName("");
    setJobWorkerGstin("");
    setInputItemName("");
    setInputQuantity(100);
    setReceivedQuantity(0);
    setDispatchedDate(new Date().toISOString().split("T")[0]);
    setEwayBillNo("");
    setAssessmentValue(150000);
    setProcessingRate(250);
    setScrapAllowancePercent(1.5);
    setStatus("Material Sent");
    setShowModal(true);
  };

  const handleOpenEdit = (order: JobWorkOrder) => {
    setEditingId(order.id);
    setChallanNo(order.challanNo);
    setJobWorkerName(order.jobWorkerName);
    setJobWorkerGstin(order.jobWorkerGstin);
    setNatureOfProcessing(order.natureOfProcessing);
    setInputItemName(order.inputItemName);
    setInputQuantity(order.inputQuantity);
    setExpectedOutputItem(order.expectedOutputItem);
    setDispatchedDate(order.dispatchedDate || new Date().toISOString().split("T")[0]);
    setStatutoryDueDate(order.statutoryDueDate);
    setReceivedQuantity(order.receivedQuantity);
    setEwayBillNo(order.ewayBillNo || "");
    setAssessmentValue(order.assessmentValue || 150000);
    setProcessingRate(order.processingRate || 250);
    setScrapAllowancePercent(order.scrapAllowancePercent || 1.5);
    setStatus(order.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobWorkerName || !inputItemName) return;
    const record: JobWorkOrder = {
      id: editingId || `JW-${Date.now()}`,
      challanNo,
      jobWorkerName,
      jobWorkerGstin: jobWorkerGstin || "27AAAPL0000A1Z5",
      natureOfProcessing,
      dispatchedDate,
      statutoryDueDate,
      inputItemName,
      inputQuantity: Number(inputQuantity) || 1,
      expectedOutputItem: expectedOutputItem || inputItemName,
      receivedQuantity: Number(receivedQuantity) || 0,
      scrapGenerated: Math.round((Number(inputQuantity) * (Number(scrapAllowancePercent) || 1.5)) / 100),
      status: Number(receivedQuantity) >= Number(inputQuantity) ? "Closed / Completed" : Number(receivedQuantity) > 0 ? "Partially Received" : status,
      ewayBillNo: ewayBillNo || undefined,
      assessmentValue: Number(assessmentValue) || 0,
      processingRate: Number(processingRate) || 0,
      scrapAllowancePercent: Number(scrapAllowancePercent) || 0,
    };

    if (editingId && onUpdateOrder) {
      onUpdateOrder(record);
    } else {
      onAddOrder(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-amber-600 to-orange-700 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/30 text-amber-100 border border-amber-400/30">
              GST Sec 143 Compliance
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              Form GST ITC-04 Ready
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Subcontracting & Job Work (ITC-04)</h1>
          <p className="text-amber-100 text-sm mt-1">
            Track Raw Materials Sent to Job Workers, Return of Processed Goods, Scrap Accounting & Statutory 1-Year Time Limits
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-amber-800 rounded-xl font-semibold shadow hover:bg-amber-50 transition"
        >
          <Plus className="w-5 h-5" />
          Issue Delivery Challan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Job Orders
            <Cog className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {orders.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">ITC-04 challans logged</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Pending at Job Workers
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">
            {pendingRecovery} <span className="text-xs text-slate-400 font-normal">units</span>
          </div>
          <p className="text-xs text-orange-600 mt-1">Within 1-year input return window</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Material Recovered
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {totalReceived} <span className="text-xs text-slate-400 font-normal">units</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Received back in factory</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Statutory Alert
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            0 Overdue
          </div>
          <p className="text-xs text-emerald-600 mt-1">Zero deemed supply tax risk</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Challan #, Job Worker or Item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Material Sent", "Partially Received", "Closed / Completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === tab
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Challan # / Date</th>
                <th className="py-3 px-4">Job Worker & GSTIN</th>
                <th className="py-3 px-4">Processing Nature</th>
                <th className="py-3 px-4">Sent Input Item (Qty)</th>
                <th className="py-3 px-4">Received / Scrap</th>
                <th className="py-3 px-4">1-Yr Statutory Deadline</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {o.challanNo}
                    </div>
                    <div className="text-xs text-slate-500">{o.dispatchedDate}</div>
                    {o.ewayBillNo && (
                      <span className="block font-mono text-[10px] text-blue-600 dark:text-blue-400">
                        EWB: {o.ewayBillNo}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {o.jobWorkerName}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{o.jobWorkerGstin}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {o.natureOfProcessing}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                      {o.inputItemName}
                    </div>
                    <div className="text-xs text-amber-600 font-semibold">Qty: {o.inputQuantity}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    <div>Recv: <span className="font-semibold text-emerald-600">{o.receivedQuantity}</span></div>
                    {o.scrapGenerated > 0 && (
                      <div className="text-xs text-slate-500">Scrap: {o.scrapGenerated} units</div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      {o.statutoryDueDate}
                    </div>
                    <div className="text-[11px] text-slate-400">Sec 143(1)(a)</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        o.status === "Closed / Completed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : o.status === "Partially Received"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(o)}
                        className="p-1.5 rounded text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Update Received Goods / Challan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteOrder && (
                        <button
                          onClick={() => onDeleteOrder(o.id)}
                          className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Delete Challan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500 text-sm">
                    No subcontracting / job work challans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              {editingId ? "Update Job Work Challan & Stock Receipt" : "Issue GST ITC-04 Delivery Challan"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Challan Number
                  </label>
                  <input
                    type="text"
                    value={challanNo}
                    onChange={(e) => setChallanNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Job Worker GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="27AAACP8891P1ZK"
                    value={jobWorkerGstin}
                    onChange={(e) => setJobWorkerGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Job Worker Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precise Heat Treaters & Powder Coaters"
                  value={jobWorkerName}
                  onChange={(e) => setJobWorkerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nature of Job Work Processing
                </label>
                <input
                  type="text"
                  value={natureOfProcessing}
                  onChange={(e) => setNatureOfProcessing(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Sent Raw Material / Input
                  </label>
                  <input
                    type="text"
                    placeholder="Rough Pinion Shafts"
                    value={inputItemName}
                    onChange={(e) => setInputItemName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Quantity Sent (Units)
                  </label>
                  <input
                    type="number"
                    value={inputQuantity}
                    onChange={(e) => setInputQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Dispatched Date
                  </label>
                  <input
                    type="date"
                    value={dispatchedDate}
                    onChange={(e) => setDispatchedDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Statutory Return Due (1-Yr)
                  </label>
                  <input
                    type="date"
                    value={statutoryDueDate}
                    onChange={(e) => setStatutoryDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transit e-Way Bill #
                  </label>
                  <input
                    type="text"
                    placeholder="241890123456"
                    value={ewayBillNo}
                    onChange={(e) => setEwayBillNo(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Goods Value (₹)
                  </label>
                  <input
                    type="number"
                    value={assessmentValue}
                    onChange={(e) => setAssessmentValue(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Rate / Unit (₹)
                  </label>
                  <input
                    type="number"
                    value={processingRate}
                    onChange={(e) => setProcessingRate(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Received Back (Units)
                  </label>
                  <input
                    type="number"
                    value={receivedQuantity}
                    onChange={(e) => setReceivedQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Challan Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Material Sent">Material Sent</option>
                    <option value="Partially Received">Partially Received</option>
                    <option value="Closed / Completed">Closed / Completed</option>
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-600 text-white hover:bg-amber-700"
                >
                  {editingId ? "Update Challan" : "Generate Challan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
