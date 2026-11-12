"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Search, CheckCircle2, AlertCircle, Building2, MapPin } from "lucide-react";
import { getStateByCode } from "@/lib/utils";

interface GSTINLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GSTINLookupModal({ isOpen, onClose }: GSTINLookupModalProps) {
  if (!isOpen) return null;

  const [inputGstin, setInputGstin] = useState("27AAACT2727Q1ZW");
  const [result, setResult] = useState<{
    gstin: string;
    legalName: string;
    tradeName: string;
    pan: string;
    stateCode: string;
    stateName: string;
    status: string;
    taxpayerType: string;
    dateOfRegistration: string;
    centerJurisdiction: string;
    stateJurisdiction: string;
  } | null>({
    gstin: "27AAACT2727Q1ZW",
    legalName: "TATA CONSULTANCY SERVICES LIMITED",
    tradeName: "TCS Enterprise Services",
    pan: "AAACT2727Q",
    stateCode: "27",
    stateName: "Maharashtra",
    status: "Active",
    taxpayerType: "Regular",
    dateOfRegistration: "01/07/2017",
    centerJurisdiction: "Commissionerate MUMBAI SOUTH, Division V, Range II",
    stateJurisdiction: "LTU MUMBAI",
  });

  const handleLookup = () => {
    const trimmed = inputGstin.trim().toUpperCase();
    if (trimmed.length < 15) return;

    const stateCode = trimmed.substring(0, 2);
    const pan = trimmed.substring(2, 12);
    const stateName = getStateByCode(stateCode);

    setResult({
      gstin: trimmed,
      legalName: `${pan.substring(0, 4)} TECHNOLOGIES INDIA PRIVATE LIMITED`,
      tradeName: `${pan.substring(0, 4)} Enterprise Suite`,
      pan,
      stateCode,
      stateName,
      status: "Active",
      taxpayerType: "Regular",
      dateOfRegistration: "12/04/2018",
      centerJurisdiction: `Commissionerate ${stateName.toUpperCase()}, Range I`,
      stateJurisdiction: `Division ${stateCode}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              GSTIN Verification & Taxpayer Lookup
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Enter 15-Digit GST Identification Number (GSTIN)
            </label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                maxLength={15}
                value={inputGstin}
                onChange={(e) => setInputGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 27AABCA9845E1ZP"
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold uppercase tracking-wider"
              />
              <button
                onClick={handleLookup}
                className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-semibold shadow-sm"
              >
                Verify
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              First 2 digits: State code | Next 10: PAN | 13th: Entity number | 14th: Z | 15th: Checksum
            </p>
          </div>

          {result && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                  {result.gstin}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                  <CheckCircle2 className="h-3 w-3" />
                  {result.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px]">Legal Name of Business:</span>
                  <p className="font-bold text-slate-900 dark:text-white">{result.legalName}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">Trade Name:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{result.tradeName}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[10px]">PAN Extracted:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{result.pan}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Taxpayer Type:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{result.taxpayerType}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">State Code & Name:</span>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {result.stateCode} - {result.stateName}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Date of Registration:</span>
                    <p className="font-bold text-slate-900 dark:text-white">{result.dateOfRegistration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
