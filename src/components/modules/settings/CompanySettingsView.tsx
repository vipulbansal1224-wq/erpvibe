"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Landmark,
  FileCheck2,
} from "lucide-react";
import { CompanyInfo } from "@/types/erp";

interface CompanySettingsViewProps {
  company: CompanyInfo;
  onUpdateCompany: (company: CompanyInfo) => void;
}

export function CompanySettingsView({
  company,
  onUpdateCompany,
}: CompanySettingsViewProps) {
  const [formData, setFormData] = useState<CompanyInfo>(company);
  const [savedAlert, setSavedAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Company Profile & Statutory Identifiers
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure Indian statutory identities printed on tax invoices, e-Way bills, and used for GST portal JSON generation.
          </p>
        </div>

        {savedAlert && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Settings Saved Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Statutory Registration Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Company Legal Name (MCA Registered) *
              </label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Trade Name (Brand Name)
              </label>
              <input
                type="text"
                value={formData.tradeName}
                onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Goods and Services Tax Identification Number (GSTIN) *
              </label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Permanent Account Number (PAN) *
              </label>
              <input
                type="text"
                value={formData.pan}
                onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Corporate Identification Number (CIN) *
              </label>
              <input
                type="text"
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                MSME Udyam Registration Number
              </label>
              <input
                type="text"
                value={formData.msmeUdyam}
                onChange={(e) => setFormData({ ...formData, msmeUdyam: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Principal Place of Business (Registered Office)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="col-span-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                State GST Code (2 Digits)
              </label>
              <input
                type="text"
                value={formData.stateCode}
                onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Bank Details Card */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Bank Details for Tax Invoices
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Branch Name</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-semibold shadow-md shadow-blue-500/20"
          >
            <Save className="h-4 w-4" />
            Save Statutory Profile
          </button>
        </div>
      </form>
    </div>
  );
}
