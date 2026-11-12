"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  FileCheck2,
  Truck,
  Hash,
  Download,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  RefreshCw,
  QrCode,
  FileSpreadsheet,
  Calculator,
  Building,
} from "lucide-react";
import {
  SalesInvoice,
  EWayBill,
  HsnSacItem,
  CompanyInfo,
  AuditLogEntry,
} from "@/types/erp";
import { formatINR, generateMockIRN, generateMockEWayBill } from "@/lib/utils";

interface IndiaComplianceViewProps {
  company: CompanyInfo;
  invoices: SalesInvoice[];
  ewayBills: EWayBill[];
  hsnDirectory: HsnSacItem[];
  onGenerateIRN: (invoiceId: string) => void;
  onCancelIRN: (invoiceId: string) => void;
  onNewEWayBill: (ewb: EWayBill) => void;
  onViewInvoice: (invoice: SalesInvoice) => void;
}

export function IndiaComplianceView({
  company,
  invoices,
  ewayBills,
  hsnDirectory,
  onGenerateIRN,
  onCancelIRN,
  onNewEWayBill,
  onViewInvoice,
}: IndiaComplianceViewProps) {
  const [activeTab, setActiveTab] = useState<
    "einvoice" | "ewaybill" | "gstr" | "hsn" | "tds"
  >("einvoice");

  // HSN Search
  const [hsnSearch, setHsnSearch] = useState("");
  const filteredHsn = hsnDirectory.filter(
    (item) =>
      item.code.toLowerCase().includes(hsnSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(hsnSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(hsnSearch.toLowerCase())
  );

  // TDS / TCS Calculator state
  const [tdsSection, setTdsSection] = useState("194J");
  const [tdsAmount, setTdsAmount] = useState<number>(100000);
  const [hasPan, setHasPan] = useState(true);

  // TDS rates map
  const tdsRates: Record<string, { label: string; rateWithPan: number; rateNoPan: number; threshold: number }> = {
    "194C": { label: "194C - Contractors (Company/LLP)", rateWithPan: 2, rateNoPan: 20, threshold: 30000 },
    "194J": { label: "194J - Professional & Technical Fees", rateWithPan: 10, rateNoPan: 20, threshold: 30000 },
    "194I": { label: "194I - Rent on Land/Building/Furniture", rateWithPan: 10, rateNoPan: 20, threshold: 240000 },
    "194Q": { label: "194Q - Purchase of Goods > ₹50 Lakhs", rateWithPan: 0.1, rateNoPan: 5, threshold: 5000000 },
    "206C1H": { label: "206C(1H) - TCS on Sale of Goods > ₹50 Lakhs", rateWithPan: 0.1, rateNoPan: 1, threshold: 5000000 },
  };

  const selectedTdsConfig = tdsRates[tdsSection] || tdsRates["194J"];
  const appliedTdsRate = hasPan ? selectedTdsConfig.rateWithPan : selectedTdsConfig.rateNoPan;
  const calculatedTds = (tdsAmount * appliedTdsRate) / 100;
  const netPayableAfterTds = tdsAmount - calculatedTds;

  // GSTR Calculations
  const b2bInvoices = invoices.filter((i) => i.invoiceType === "B2B");
  const b2cInvoices = invoices.filter((i) => i.invoiceType === "B2C");
  const totalTaxable = invoices.reduce((sum, i) => sum + i.subTotal, 0);
  const totalCgst = invoices.reduce((sum, i) => sum + i.cgstTotal, 0);
  const totalSgst = invoices.reduce((sum, i) => sum + i.sgstTotal, 0);
  const totalIgst = invoices.reduce((sum, i) => sum + i.igstTotal, 0);
  const totalGst = totalCgst + totalSgst + totalIgst;

  // GSTR-1 JSON Generator & Download
  const downloadGSTR1Json = () => {
    const gstr1Payload = {
      gstin: company.gstin,
      fp: "112026",
      cur_gt: totalTaxable,
      b2b: b2bInvoices.map((inv) => ({
        ctin: inv.customerGstin,
        inv: [
          {
            inum: inv.invoiceNumber,
            idt: inv.invoiceDate,
            val: inv.grandTotal,
            pos: inv.placeOfSupply.split("-")[0],
            rchrg: "N",
            inv_typ: "R",
            itms: inv.items.map((item, idx) => ({
              num: idx + 1,
              itm_det: {
                rt: item.gstRate,
                txval: item.taxableValue,
                iamt: item.igstAmount,
                camt: item.cgstAmount,
                samt: item.sgstAmount,
                csamt: 0,
              },
            })),
          },
        ],
      })),
      b2c: b2cInvoices.map((inv) => ({
        pos: inv.placeOfSupply.split("-")[0],
        txval: inv.subTotal,
        iamt: inv.igstTotal,
      })),
      hsn: {
        data: hsnDirectory.slice(0, 5).map((h, i) => ({
          num: i + 1,
          hsn_sc: h.code,
          desc: h.description,
          uqc: "NOS",
          qty: 10,
          val: 100000,
          txval: 100000,
          iamt: 18000,
          camt: 0,
          samt: 0,
          csamt: 0,
        })),
      },
    };

    const blob = new Blob([JSON.stringify(gstr1Payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GSTR1_${company.gstin}_112026.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              India Statutory Compliance & GST Hub
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            Handles Indian statutory mandates: e-Invoicing via NIC IRP, e-Way Bills, GSTR-1 & 3B filing summaries, 14,000+ HSN/SAC codes, and TDS/TCS withholding rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadGSTR1Json}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-medium shadow-sm transition-all"
          >
            <Download className="h-4 w-4" />
            Export GSTR-1 JSON
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto text-xs font-semibold">
        {[
          { id: "einvoice", label: "e-Invoicing (IRN)", icon: QrCode },
          { id: "ewaybill", label: "e-Way Bills", icon: Truck },
          { id: "gstr", label: "GSTR-1 & GSTR-3B Summary", icon: FileSpreadsheet },
          { id: "hsn", label: "HSN / SAC Code Directory", icon: Hash },
          { id: "tds", label: "TDS & TCS Withholding Engine", icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: E-INVOICING */}
      {activeTab === "einvoice" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Invoice Registration Portal (IRP) Integration
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mandatory for all B2B invoices. Generates unique 64-character IRN, Ack No, and digitally signed QR code.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  IRP API Connected (ClearTax / NIC)
                </span>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer & GSTIN</th>
                    <th className="px-4 py-3">Taxable & Total</th>
                    <th className="px-4 py-3">IRN Status</th>
                    <th className="px-4 py-3">Ack Details</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-medium text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {inv.invoiceDate}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{inv.customerName}</p>
                        <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{inv.customerGstin}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-white">{formatINR(inv.grandTotal)}</p>
                        <p className="text-[10px] text-slate-500">Taxable: {formatINR(inv.subTotal)}</p>
                      </td>
                      <td className="px-4 py-3">
                        {inv.eInvoiceStatus === "Generated" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="h-3 w-3" />
                            IRN Generated
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                            <Clock className="h-3 w-3" />
                            Pending IRN
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {inv.irn ? (
                          <div className="font-mono text-[10px] space-y-0.5">
                            <p className="text-slate-700 dark:text-slate-300 truncate max-w-[140px]" title={inv.irn}>
                              IRN: {inv.irn.substring(0, 14)}...
                            </p>
                            <p className="text-slate-500">Ack: {inv.ackNo}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Not Generated</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {inv.eInvoiceStatus !== "Generated" ? (
                            <button
                              onClick={() => onGenerateIRN(inv.id)}
                              className="rounded bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 text-[11px] font-medium transition-colors"
                            >
                              Generate IRN
                            </button>
                          ) : (
                            <button
                              onClick={() => onCancelIRN(inv.id)}
                              className="rounded border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 px-2 py-1 text-[11px] font-medium transition-colors"
                            >
                              Cancel IRN
                            </button>
                          )}
                          <button
                            onClick={() => onViewInvoice(inv)}
                            className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: E-WAY BILLS */}
      {activeTab === "ewaybill" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Electronic Way Bills (e-Way Bill System)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mandatory for consignment movement of goods value exceeding ₹50,000 under Rule 138 of CGST Rules.
                </p>
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">e-Way Bill No</th>
                    <th className="px-4 py-3">Invoice No</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">From - To</th>
                    <th className="px-4 py-3">Distance & Vehicle</th>
                    <th className="px-4 py-3">Transporter</th>
                    <th className="px-4 py-3">Validity</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {ewayBills.map((ewb) => (
                    <tr key={ewb.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {ewb.ewayBillNo}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">
                        {ewb.invoiceNo}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                        {ewb.customerName}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {ewb.fromPincode} → {ewb.toPincode}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{ewb.vehicleNo}</p>
                        <p className="text-[10px] text-slate-500">{ewb.distanceKm} KM</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        <p className="truncate max-w-[140px]">{ewb.transporterName}</p>
                        <p className="font-mono text-[10px] text-slate-400">{ewb.transporterId}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 text-[11px]">
                        Valid till {ewb.validUntil}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          Active (On Road)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GSTR-1 & GSTR-3B */}
      {activeTab === "gstr" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Taxable Value</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {formatINR(totalTaxable)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Table 4: B2B Outward Supplies</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Integrated Tax (IGST)</span>
              <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {formatINR(totalIgst)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Inter-State Outward Sales</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Central Tax (CGST)</span>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                {formatINR(totalCgst)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Intra-State (Maharashtra)</p>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">State Tax (SGST)</span>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {formatINR(totalSgst)}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">Intra-State (Maharashtra)</p>
            </div>
          </div>

          {/* GSTR-3B Computation Matrix */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  GSTR-3B Tax Liability & Input Tax Credit (ITC) Summary
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Auto-populated calculation for Return Period November 2026
                </p>
              </div>
              <button
                onClick={downloadGSTR1Json}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
              >
                <Download className="h-3.5 w-3.5" />
                Download GSTR JSON
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Section Description</th>
                    <th className="px-4 py-3">Total Taxable Value</th>
                    <th className="px-4 py-3">IGST</th>
                    <th className="px-4 py-3">CGST</th>
                    <th className="px-4 py-3">SGST</th>
                    <th className="px-4 py-3">CESS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">
                      3.1 (a) Outward taxable supplies (other than zero rated, nil and exempted)
                    </td>
                    <td className="px-4 py-3">{formatINR(totalTaxable)}</td>
                    <td className="px-4 py-3">{formatINR(totalIgst)}</td>
                    <td className="px-4 py-3">{formatINR(totalCgst)}</td>
                    <td className="px-4 py-3">{formatINR(totalSgst)}</td>
                    <td className="px-4 py-3">₹0.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white">
                      4 (A) Eligible ITC Available (Inputs & Capital Goods)
                    </td>
                    <td className="px-4 py-3">₹14,50,000.00</td>
                    <td className="px-4 py-3">₹1,10,000.00</td>
                    <td className="px-4 py-3">₹75,500.00</td>
                    <td className="px-4 py-3">₹75,500.00</td>
                    <td className="px-4 py-3">₹0.00</td>
                  </tr>
                  <tr className="bg-blue-50/50 dark:bg-blue-950/20 font-bold">
                    <td className="px-4 py-3 font-sans text-blue-900 dark:text-blue-300">
                      5. Net Tax Payable in Cash (Liability - Available ITC)
                    </td>
                    <td className="px-4 py-3">-</td>
                    <td className="px-4 py-3 text-indigo-600 dark:text-indigo-400">{formatINR(Math.max(0, totalIgst - 110000))}</td>
                    <td className="px-4 py-3 text-blue-600 dark:text-blue-400">{formatINR(Math.max(0, totalCgst - 75500))}</td>
                    <td className="px-4 py-3 text-purple-600 dark:text-purple-400">{formatINR(Math.max(0, totalSgst - 75500))}</td>
                    <td className="px-4 py-3">₹0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: HSN / SAC DIRECTORY */}
      {activeTab === "hsn" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  HSN / SAC Master Code Library (14,000+ Codes In-built)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-configured Harmonized System of Nomenclature (HSN) and Services Accounting Codes (SAC) with statutory GST slab rates.
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code or description..."
                  value={hsnSearch}
                  onChange={(e) => setHsnSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">HSN / SAC Code</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Statutory GST Slab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredHsn.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            item.type === "HSN"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                        {item.code}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">
                        {item.category}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-md">
                        {item.description}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-400">
                          {item.rate}% GST
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TDS / TCS WITHHOLDING ENGINE */}
      {activeTab === "tds" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              Tax Withholding Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Calculate statutory TDS / TCS deduction based on Indian Income Tax Act 1961 provisions.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Select Section
                </label>
                <select
                  value={tdsSection}
                  onChange={(e) => setTdsSection(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                >
                  {Object.entries(tdsRates).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Invoice / Bill Gross Amount (INR)
                </label>
                <input
                  type="number"
                  value={tdsAmount}
                  onChange={(e) => setTdsAmount(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="hasPanCheckbox"
                  checked={hasPan}
                  onChange={(e) => setHasPan(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="hasPanCheckbox" className="text-xs text-slate-700 dark:text-slate-300">
                  Vendor PAN Available (Without PAN: 20% higher deduction under Sec 206AA)
                </label>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicable Rate:</span>
                <span className="font-bold text-slate-900 dark:text-white">{appliedTdsRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Statutory Threshold:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{formatINR(selectedTdsConfig.threshold)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
                <span className="text-red-600 dark:text-red-400">TDS to Deduct:</span>
                <span className="text-red-600 dark:text-red-400 font-mono">{formatINR(calculatedTds)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">Net Payable to Vendor:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">{formatINR(netPayableAfterTds)}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Income Tax Statutory Withholding Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Configured tax withholding categories mapped to ERP accounts for quarterly Form 26Q / 27Q e-TDS filing.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Section</th>
                    <th className="px-4 py-3">Nature of Payment</th>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3">Rate (with PAN)</th>
                    <th className="px-4 py-3">No PAN (Sec 206AA)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {Object.entries(tdsRates).map(([k, v]) => (
                    <tr key={k} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                        {k}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-medium">
                        {v.label}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                        {formatINR(v.threshold)}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                        {v.rateWithPan}%
                      </td>
                      <td className="px-4 py-3 font-bold text-red-600 dark:text-red-400">
                        {v.rateNoPan}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
