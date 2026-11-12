"use client";

import React, { useState, useEffect } from "react";
import { X, Truck, ShieldCheck } from "lucide-react";
import { Supplier } from "@/types/erp";

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplier?: Supplier | null;
}

export function SupplierModal({
  isOpen,
  onClose,
  onSave,
  supplier,
}: SupplierModalProps) {
  const [formData, setFormData] = useState<Supplier>({
    id: "",
    name: "",
    gstin: "",
    pan: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "411018",
    state: "Maharashtra",
    stateCode: "27",
    msmeCategory: "Micro",
    paymentTerms: "45 Days",
    balancePayable: 0,
    status: "Active",
  });

  useEffect(() => {
    if (supplier) {
      setFormData(supplier);
    } else {
      setFormData({
        id: `SUP-${Date.now().toString().slice(-4)}`,
        name: "",
        gstin: "",
        pan: "",
        email: "",
        phone: "+91 ",
        address: "",
        city: "",
        pincode: "411018",
        state: "Maharashtra",
        stateCode: "27",
        msmeCategory: "Micro",
        paymentTerms: "45 Days",
        balancePayable: 0,
        status: "Active",
      });
    }
  }, [supplier, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-950 p-2 text-purple-600 dark:text-purple-400">
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {supplier ? "Edit Vendor / Supplier" : "Add New MSME Vendor"}
              </h2>
              <p className="text-xs text-slate-500">
                Statutory MSME Samadhaan & GST compliance data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supplier / Company Legal Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Precision CNC Works Pvt Ltd"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN Number (15 Digits)
              </label>
              <input
                type="text"
                maxLength={15}
                value={formData.gstin}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData({
                    ...formData,
                    gstin: val,
                    pan: val.length >= 12 ? val.slice(2, 12) : formData.pan,
                  });
                }}
                placeholder="27AAAPL1234K1Z0"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                placeholder="AAAPL1234K"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                MSME Category (Act Sec 15)
              </label>
              <select
                value={formData.msmeCategory}
                onChange={(e) => setFormData({ ...formData, msmeCategory: e.target.value as any })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="Micro">Micro (Turnover &lt; 5 Cr)</option>
                <option value="Small">Small (Turnover &lt; 50 Cr)</option>
                <option value="Medium">Medium (Turnover &lt; 250 Cr)</option>
                <option value="Non-MSME">Non-MSME Large Enterprise</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Terms
              </label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="45 Days"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pincode
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payable (₹)
              </label>
              <input
                type="number"
                value={formData.balancePayable}
                onChange={(e) => setFormData({ ...formData, balancePayable: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-5 py-2 text-xs font-semibold text-white hover:bg-purple-700 shadow-md shadow-purple-500/20"
            >
              {supplier ? "Update Supplier" : "Save Supplier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
