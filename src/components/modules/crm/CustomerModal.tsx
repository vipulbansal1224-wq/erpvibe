"use client";

import React, { useState, useEffect } from "react";
import { X, Users, Building, ShieldCheck, Mail, Phone, MapPin, CreditCard } from "lucide-react";
import { Customer } from "@/types/erp";

interface CustomerModalProps {
  isOpen: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSave: (customer: Customer) => void;
}

export function CustomerModal({ isOpen, customer, onClose, onSave }: CustomerModalProps) {
  const [formData, setFormData] = useState<Customer>({
    id: "",
    name: "",
    gstin: "",
    pan: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    stateCode: "27",
    pincode: "400001",
    creditLimit: 500000,
    outstandingBalance: 0,
    status: "Active",
    contactPerson: "",
    shippingAddress: "",
    creditDays: 30,
    bankAccount: "",
    bankIfsc: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        contactPerson: customer.contactPerson || "",
        shippingAddress: customer.shippingAddress || "",
        creditDays: customer.creditDays || 30,
        bankAccount: customer.bankAccount || "",
        bankIfsc: customer.bankIfsc || "",
      });
    } else {
      setFormData({
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: "",
        gstin: "",
        pan: "",
        email: "",
        phone: "+91 ",
        address: "",
        city: "",
        state: "Maharashtra",
        stateCode: "27",
        pincode: "400001",
        creditLimit: 500000,
        outstandingBalance: 0,
        status: "Active",
        contactPerson: "",
        shippingAddress: "",
        creditDays: 30,
        bankAccount: "",
        bankIfsc: "",
      });
    }
  }, [customer, isOpen]);

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
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
              <Users className="h-5 w-5" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {customer ? "Edit Customer Record" : "Add New Customer"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer / Legal Trade Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Reliance Industries Limited"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GSTIN (15 Digits)
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase();
                  setFormData({
                    ...formData,
                    gstin: val,
                    stateCode: val.slice(0, 2) || formData.stateCode,
                    pan: val.slice(2, 12) || formData.pan,
                  });
                }}
                placeholder="27AAACR1234E1ZP"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Permanent Account (PAN)
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                placeholder="AAACR1234E"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono uppercase text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Person Name & Designation
              </label>
              <input
                type="text"
                value={formData.contactPerson || ""}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="e.g. Mr. Rajesh Kadam - Procurement Lead"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credit Period (Days)
              </label>
              <input
                type="number"
                value={formData.creditDays || 30}
                onChange={(e) => setFormData({ ...formData, creditDays: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="accounts@company.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mobile / Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
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
                placeholder="Mumbai"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                State (Code)
              </label>
              <input
                type="text"
                value={`${formData.state} (${formData.stateCode})`}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Credit Limit (₹)
              </label>
              <input
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
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
              className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
            >
              {customer ? "Update Customer" : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
