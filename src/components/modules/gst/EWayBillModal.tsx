"use client";

import React, { useState } from "react";
import { X, Truck, ShieldCheck } from "lucide-react";
import { EWayBill, SalesInvoice, CompanyInfo } from "@/types/erp";
import { generateMockEWayBill } from "@/lib/utils";

interface EWayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: SalesInvoice[];
  company: CompanyInfo;
  onSaveEWayBill: (ewb: EWayBill) => void;
}

export function EWayBillModal({
  isOpen,
  onClose,
  invoices,
  company,
  onSaveEWayBill,
}: EWayBillModalProps) {
  if (!isOpen) return null;

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    invoices[0]?.id || ""
  );
  const selectedInvoice =
    invoices.find((i) => i.id === selectedInvoiceId) || invoices[0];

  const [vehicleNo, setVehicleNo] = useState("MH-04-KB-8921");
  const [transporterName, setTransporterName] = useState("VRL Logistics Ltd");
  const [transporterId, setTransporterId] = useState("29AABCV1290K1ZP");
  const [distanceKm, setDistanceKm] = useState(120);
  const [toPincode, setToPincode] = useState("400001");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const newEwb: EWayBill = {
      id: `EWB-${Date.now()}`,
      ewayBillNo: generateMockEWayBill(),
      invoiceNo: selectedInvoice.invoiceNumber,
      customerName: selectedInvoice.customerName,
      fromPincode: company.pincode,
      toPincode,
      distanceKm,
      vehicleNo: vehicleNo.toUpperCase(),
      transporterName,
      transporterId: transporterId.toUpperCase(),
      generatedDate: new Date().toISOString().replace("T", " ").substring(0, 16),
      validUntil: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace("T", " ")
        .substring(0, 16),
      status: "Active",
    };

    onSaveEWayBill(newEwb);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Generate Official e-Way Bill
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Select Sales Invoice *
            </label>
            <select
              value={selectedInvoiceId}
              onChange={(e) => setSelectedInvoiceId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
            >
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} - {inv.customerName} (₹{inv.grandTotal})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Dispatch From Pincode
              </label>
              <input
                type="text"
                disabled
                value={company.pincode}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Destination To Pincode *
              </label>
              <input
                type="text"
                required
                value={toPincode}
                onChange={(e) => setToPincode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Approx Distance (KM) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Vehicle Registration No *
              </label>
              <input
                type="text"
                required
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value.toUpperCase())}
                placeholder="MH-02-AB-1234"
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Transporter Name
              </label>
              <input
                type="text"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Transporter GSTIN / ID
              </label>
              <input
                type="text"
                value={transporterId}
                onChange={(e) => setTransporterId(e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Generate e-Way Bill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
