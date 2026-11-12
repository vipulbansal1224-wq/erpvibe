"use client";

import { useState } from "react";
import { FleetVehicle } from "@/types/erp";
import {
  Truck,
  Plus,
  Search,
  Fuel,
  Gauge,
  CalendarCheck,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Navigation,
  Edit,
  Trash2,
} from "lucide-react";

interface FleetViewProps {
  vehicles: FleetVehicle[];
  onAddVehicle: (vehicle: FleetVehicle) => void;
  onUpdateVehicle?: (vehicle: FleetVehicle) => void;
  onDeleteVehicle?: (id: string) => void;
}

export function FleetView({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
}: FleetViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [vehicleNo, setVehicleNo] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState<FleetVehicle["type"]>("Heavy Commercial Truck");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("+91 ");
  const [fuelType, setFuelType] = useState<FleetVehicle["fuelType"]>("Diesel");
  const [odometerKm, setOdometerKm] = useState(25000);
  const [insuranceValidUntil, setInsuranceValidUntil] = useState("2027-12-31");
  const [pucValidUntil, setPucValidUntil] = useState("2027-06-30");
  const [fitnessValidUntil, setFitnessValidUntil] = useState("2028-12-31");
  const [status, setStatus] = useState<FleetVehicle["status"]>("Available");

  const filtered = vehicles.filter((v) => {
    const matchSearch =
      v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const availableCount = vehicles.filter((v) => v.status === "Available").length;
  const onDeliveryCount = vehicles.filter((v) => v.status === "On Delivery").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "Under Maintenance").length;

  const handleOpenNew = () => {
    setEditingId(null);
    setVehicleNo("");
    setModel("");
    setDriverName("");
    setDriverPhone("+91 ");
    setStatus("Available");
    setShowModal(true);
  };

  const handleOpenEdit = (v: FleetVehicle) => {
    setEditingId(v.id);
    setVehicleNo(v.vehicleNo);
    setModel(v.model);
    setType(v.type);
    setDriverName(v.driverName);
    setDriverPhone(v.driverPhone);
    setFuelType(v.fuelType);
    setOdometerKm(v.odometerKm);
    setInsuranceValidUntil(v.insuranceValidUntil);
    setPucValidUntil(v.pucValidUntil);
    setFitnessValidUntil(v.fitnessValidUntil);
    setStatus(v.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo || !driverName) return;
    const record: FleetVehicle = {
      id: editingId || `FLT-${Date.now().toString().slice(-4)}`,
      vehicleNo: vehicleNo.toUpperCase(),
      model,
      type,
      driverName,
      driverPhone,
      fuelType,
      odometerKm: Number(odometerKm) || 0,
      insuranceValidUntil,
      pucValidUntil,
      fitnessValidUntil,
      status,
    };

    if (editingId && onUpdateVehicle) {
      onUpdateVehicle(record);
    } else {
      onAddVehicle(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-100 border border-blue-400/30">
              Transport Management System (TMS)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white">
              Vahan & Sarathi Compliance
            </span>
          </div>
          <h1 className="text-2xl font-bold">Fleet & Logistics Management</h1>
          <p className="text-blue-100 text-sm mt-1">
            Commercial Vehicles, Driver Logs, e-Way Bill Linked Dispatches, Fuel & Statutory Fitness Tracking
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-800 rounded-xl font-semibold shadow hover:bg-blue-50 transition"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Fleet
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {vehicles.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Registered delivery vehicles</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            On Delivery Run
            <Navigation className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            {onDeliveryCount}
          </div>
          <p className="text-xs text-indigo-600 mt-1">Linked with active e-Way Bills</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Ready in Yard
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {availableCount}
          </div>
          <p className="text-xs text-slate-500 mt-1">Available for dispatch</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            In Workshop
            <Wrench className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {maintenanceCount}
          </div>
          <p className="text-xs text-amber-500 mt-1">Scheduled service / repairs</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Vehicle #, Driver or Model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
          {["All", "Available", "On Delivery", "Under Maintenance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:border-blue-400 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {v.vehicleNo}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{v.model}</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      v.status === "Available"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : v.status === "On Delivery"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                    }`}
                  >
                    {v.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(v)}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Edit Vehicle"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  {onDeleteVehicle && (
                    <button
                      onClick={() => onDeleteVehicle(v.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-medium">{v.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Driver:</span>
                  <span className="font-medium">{v.driverName} ({v.driverPhone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Fuel className="w-3.5 h-3.5" /> Fuel & Odometer:
                  </span>
                  <span className="font-medium font-mono">{v.fuelType} • {v.odometerKm.toLocaleString()} KM</span>
                </div>
              </div>

              {/* Statutory Expiries */}
              <div className="mt-4 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs space-y-1 border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <CalendarCheck className="w-3 h-3 text-blue-500" />
                  Statutory Validities
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Insurance:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{v.insuranceValidUntil}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>PUC Certificate:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{v.pucValidUntil}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Fitness Cert (RTO):</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{v.fitnessValidUntil}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500">
              <span>Ready for e-Way Bill trip sheet</span>
              <button
                onClick={() => handleOpenEdit(v)}
                className="text-blue-600 font-semibold hover:underline"
              >
                Change Details →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              {editingId ? "Edit Fleet Vehicle" : "Register Fleet Vehicle"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    placeholder="MH-04-AB-1234"
                    value={vehicleNo}
                    onChange={(e) => setVehicleNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono uppercase"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Heavy Commercial Truck">Heavy Commercial Truck</option>
                    <option value="Medium Delivery Van">Medium Delivery Van</option>
                    <option value="Pickup Container">Pickup Container</option>
                    <option value="Staff Fleet">Staff Fleet</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Make & Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tata Prima 2830.K / Mahindra Bolero"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    placeholder="Driver Full Name"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Driver Mobile
                  </label>
                  <input
                    type="text"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Odometer (KM)
                  </label>
                  <input
                    type="number"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(Number(e.target.value))}
                    className="w-full px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
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
                    <option value="Available">Available</option>
                    <option value="On Delivery">On Delivery</option>
                    <option value="Under Maintenance">Under Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Insurance Expiry
                  </label>
                  <input
                    type="date"
                    value={insuranceValidUntil}
                    onChange={(e) => setInsuranceValidUntil(e.target.value)}
                    className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    PUC Expiry
                  </label>
                  <input
                    type="date"
                    value={pucValidUntil}
                    onChange={(e) => setPucValidUntil(e.target.value)}
                    className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Fitness Expiry
                  </label>
                  <input
                    type="date"
                    value={fitnessValidUntil}
                    onChange={(e) => setFitnessValidUntil(e.target.value)}
                    className="w-full p-1.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
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
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  {editingId ? "Update Vehicle" : "Save Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
