"use client";

import React from "react";
import {
  X,
  Printer,
  Download,
  QrCode,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { SalesInvoice, CompanyInfo } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface TaxInvoicePrintModalProps {
  invoice: SalesInvoice | null;
  company: CompanyInfo;
  onClose: () => void;
}

export function TaxInvoicePrintModal({
  invoice,
  company,
  onClose,
}: TaxInvoicePrintModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const isIntraState = invoice.cgstTotal > 0 || invoice.sgstTotal > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white text-slate-900 shadow-2xl my-8 overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">
              Tax Invoice Preview - {invoice.invoiceNumber}
            </span>
            {invoice.eInvoiceStatus === "Generated" && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-3 w-3" />
                IRN Signed
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE INVOICE CONTENT */}
        <div id="printable-tax-invoice" className="p-8 font-sans text-xs space-y-6">
          {/* Header Banner */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                {company.legalName}
              </h1>
              <p className="text-xs font-semibold text-slate-600">{company.tradeName}</p>
              <p className="text-[11px] text-slate-600 max-w-md mt-1">
                {company.addressLine1}, {company.addressLine2}, {company.city}, {company.state} - {company.pincode}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-700">
                <span><strong>GSTIN:</strong> {company.gstin}</span>
                <span><strong>PAN:</strong> {company.pan}</span>
                <span><strong>CIN:</strong> {company.cin}</span>
                <span><strong>MSME:</strong> {company.msmeUdyam}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border border-slate-900 px-3 py-1 font-bold text-sm tracking-wider uppercase bg-slate-100">
                TAX INVOICE
              </div>
              <p className="text-[10px] text-slate-500 mt-1 uppercase">
                (Original for Recipient)
              </p>
              {invoice.irn && (
                <div className="mt-2 flex flex-col items-end">
                  {/* Simulated QR Code */}
                  <div className="flex h-16 w-16 items-center justify-center border border-slate-300 bg-slate-50 p-1">
                    <QrCode className="h-14 w-14 text-slate-800" />
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono mt-0.5">IRP Signed QR</span>
                </div>
              )}
            </div>
          </div>

          {/* IRN & Ack Details if Generated */}
          {invoice.irn && (
            <div className="rounded border border-slate-300 bg-slate-50 p-2.5 font-mono text-[10px] leading-tight space-y-1">
              <div className="truncate">
                <strong>IRN:</strong> {invoice.irn}
              </div>
              <div className="flex justify-between">
                <span><strong>Ack No:</strong> {invoice.ackNo}</span>
                <span><strong>Ack Date:</strong> {invoice.ackDate}</span>
                {invoice.eWayBillNo && <span><strong>e-Way Bill No:</strong> {invoice.eWayBillNo}</span>}
              </div>
            </div>
          )}

          {/* Invoice Meta Grid */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4">
            {/* Bill To */}
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                Bill To (Recipient Details):
              </span>
              <p className="font-bold text-sm text-slate-900">{invoice.customerName}</p>
              <p className="text-slate-600 text-[11px]">
                State: {invoice.customerState} (Code: {invoice.customerStateCode})
              </p>
              <p className="font-mono text-[11px]">
                <strong>GSTIN / UIN:</strong> {invoice.customerGstin}
              </p>
              <p className="text-slate-600 text-[11px]">
                <strong>Place of Supply:</strong> {invoice.placeOfSupply}
              </p>
            </div>

            {/* Invoice Info */}
            <div className="space-y-1 text-right">
              <div className="flex justify-between">
                <span className="text-slate-600">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Invoice Date:</span>
                <span className="font-medium text-slate-900">{invoice.invoiceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Payment Due Date:</span>
                <span className="font-medium text-slate-900">{invoice.dueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Reverse Charge (RCM):</span>
                <span className="font-medium text-slate-900">No</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Supply Type:</span>
                <span className="font-medium text-slate-900">{invoice.invoiceType}</span>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto border border-slate-300">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-100 font-bold border-b border-slate-300 text-slate-800">
                <tr>
                  <th className="p-2 w-8 text-center">#</th>
                  <th className="p-2">Description of Goods / Services</th>
                  <th className="p-2 text-center">HSN/SAC</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Rate</th>
                  <th className="p-2 text-right">Taxable Val</th>
                  <th className="p-2 text-center">GST %</th>
                  {isIntraState ? (
                    <>
                      <th className="p-2 text-right">CGST</th>
                      <th className="p-2 text-right">SGST</th>
                    </>
                  ) : (
                    <th className="p-2 text-right">IGST</th>
                  )}
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="p-2 text-center font-mono">{idx + 1}</td>
                    <td className="p-2 font-medium">{item.description}</td>
                    <td className="p-2 text-center font-mono">{item.hsnSacCode}</td>
                    <td className="p-2 text-center font-mono">
                      {item.quantity} {item.uom}
                    </td>
                    <td className="p-2 text-right font-mono">{formatINR(item.unitPrice)}</td>
                    <td className="p-2 text-right font-mono font-medium">
                      {formatINR(item.taxableValue)}
                    </td>
                    <td className="p-2 text-center font-mono">{item.gstRate}%</td>
                    {isIntraState ? (
                      <>
                        <td className="p-2 text-right font-mono">{formatINR(item.cgstAmount)}</td>
                        <td className="p-2 text-right font-mono">{formatINR(item.sgstAmount)}</td>
                      </>
                    ) : (
                      <td className="p-2 text-right font-mono">{formatINR(item.igstAmount)}</td>
                    )}
                    <td className="p-2 text-right font-mono font-bold">
                      {formatINR(item.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Amount In Words & Totals Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="border border-slate-300 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Total Amount in Words:
                </span>
                <p className="font-semibold text-xs text-slate-900 mt-1">
                  {invoice.amountInWords}
                </p>
              </div>

              {/* Bank Details */}
              <div className="border border-slate-300 p-3 rounded text-[11px] space-y-1">
                <span className="font-bold text-[10px] uppercase text-slate-500">
                  Bank Details for Electronic Remittance (NEFT / RTGS / IMPS):
                </span>
                <div className="grid grid-cols-2 gap-x-2 font-mono text-[10px] pt-1">
                  <div><strong>Bank:</strong> {company.bankName}</div>
                  <div><strong>A/C No:</strong> {company.accountNumber}</div>
                  <div><strong>IFSC Code:</strong> {company.ifscCode}</div>
                  <div><strong>Branch:</strong> {company.branch}</div>
                </div>
              </div>
            </div>

            <div className="border border-slate-300 p-3 rounded space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">Taxable Value:</span>
                <span className="font-mono font-medium">{formatINR(invoice.subTotal)}</span>
              </div>
              {invoice.discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Trade Discount:</span>
                  <span className="font-mono">-{formatINR(invoice.discountTotal)}</span>
                </div>
              )}
              {isIntraState ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Central Tax (CGST):</span>
                    <span className="font-mono font-medium">{formatINR(invoice.cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">State Tax (SGST):</span>
                    <span className="font-mono font-medium">{formatINR(invoice.sgstTotal)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-600">Integrated Tax (IGST):</span>
                  <span className="font-mono font-medium">{formatINR(invoice.igstTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>Round Off:</span>
                <span className="font-mono">{formatINR(invoice.roundOff)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-sm font-black text-slate-900">
                <span>Invoice Total (INR):</span>
                <span className="font-mono">{formatINR(invoice.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Terms & Signatory */}
          <div className="grid grid-cols-2 gap-4 border-t border-slate-300 pt-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-500">
                Terms & Conditions:
              </span>
              <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                1. Goods once sold will not be taken back.<br />
                2. Disputes are subject to Mumbai Jurisdiction.<br />
                3. Overdue payments attract 18% per annum statutory commercial interest.
              </p>
            </div>

            <div className="text-right flex flex-col justify-between items-end h-28">
              <span className="text-[11px] font-bold text-slate-800">
                For {company.legalName}
              </span>
              <div className="border-t border-slate-400 pt-1 w-48 text-center text-[10px] text-slate-600">
                Authorised Signatory
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
