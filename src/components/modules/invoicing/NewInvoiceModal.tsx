"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Calculator, ShieldCheck } from "lucide-react";
import {
  Customer,
  InventoryItem,
  SalesInvoice,
  InvoiceItem,
  CompanyInfo,
} from "@/types/erp";
import {
  formatINR,
  numberToIndianWords,
  getStateCodeFromGSTIN,
} from "@/lib/utils";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  items: InventoryItem[];
  company: CompanyInfo;
  onSaveInvoice: (invoice: SalesInvoice) => void;
}

export function NewInvoiceModal({
  isOpen,
  onClose,
  customers,
  items,
  company,
  onSaveInvoice,
}: NewInvoiceModalProps) {
  if (!isOpen) return null;

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || ""
  );
  const selectedCustomer =
    customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const [invoiceNumber, setInvoiceNumber] = useState(
    `APX/26-27/00${Math.floor(100 + Math.random() * 900)}`
  );
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );
  const [notes, setNotes] = useState("Thank you for your business.");

  // Check intra-state vs inter-state
  const isIntraState =
    selectedCustomer &&
    selectedCustomer.stateCode === company.stateCode;

  // Invoice Items
  const [lineItems, setLineItems] = useState<
    {
      itemId: string;
      description: string;
      hsnSacCode: string;
      quantity: number;
      uom: string;
      unitPrice: number;
      discountPercent: number;
      gstRate: number;
    }[]
  >([
    {
      itemId: items[0]?.id || "",
      description: items[0]?.name || "IT Hardware",
      hsnSacCode: items[0]?.hsnSacCode || "84713010",
      quantity: 1,
      uom: items[0]?.uom || "NOS",
      unitPrice: items[0]?.sellingPrice || 50000,
      discountPercent: 0,
      gstRate: items[0]?.gstRate || 18,
    },
  ]);

  const handleAddItem = () => {
    const defaultItem = items[0];
    setLineItems([
      ...lineItems,
      {
        itemId: defaultItem?.id || "",
        description: defaultItem?.name || "Professional Services",
        hsnSacCode: defaultItem?.hsnSacCode || "998314",
        quantity: 1,
        uom: defaultItem?.uom || "NOS",
        unitPrice: defaultItem?.sellingPrice || 10000,
        discountPercent: 0,
        gstRate: defaultItem?.gstRate || 18,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (lineItems.length === 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleItemSelect = (index: number, itemId: string) => {
    const itm = items.find((i) => i.id === itemId);
    if (!itm) return;
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      itemId: itm.id,
      description: itm.name,
      hsnSacCode: itm.hsnSacCode,
      unitPrice: itm.sellingPrice,
      uom: itm.uom,
      gstRate: itm.gstRate,
    };
    setLineItems(updated);
  };

  // Calculations
  const calculatedItems: InvoiceItem[] = lineItems.map((li, idx) => {
    const baseValue = li.quantity * li.unitPrice;
    const discountAmt = (baseValue * li.discountPercent) / 100;
    const taxableValue = baseValue - discountAmt;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isIntraState) {
      cgst = (taxableValue * (li.gstRate / 2)) / 100;
      sgst = (taxableValue * (li.gstRate / 2)) / 100;
    } else {
      igst = (taxableValue * li.gstRate) / 100;
    }

    const total = taxableValue + cgst + sgst + igst;

    return {
      id: `ITEM-ROW-${idx + 1}`,
      itemId: li.itemId,
      description: li.description,
      hsnSacCode: li.hsnSacCode,
      quantity: li.quantity,
      uom: li.uom,
      unitPrice: li.unitPrice,
      discountPercent: li.discountPercent,
      taxableValue: Math.round(taxableValue * 100) / 100,
      gstRate: li.gstRate,
      cgstAmount: Math.round(cgst * 100) / 100,
      sgstAmount: Math.round(sgst * 100) / 100,
      igstAmount: Math.round(igst * 100) / 100,
      totalAmount: Math.round(total * 100) / 100,
    };
  });

  const subTotal = calculatedItems.reduce((s, i) => s + i.taxableValue, 0);
  const cgstTotal = calculatedItems.reduce((s, i) => s + i.cgstAmount, 0);
  const sgstTotal = calculatedItems.reduce((s, i) => s + i.sgstAmount, 0);
  const igstTotal = calculatedItems.reduce((s, i) => s + i.igstAmount, 0);
  const rawTotal = subTotal + cgstTotal + sgstTotal + igstTotal;
  const grandTotal = Math.round(rawTotal);
  const roundOff = Math.round((grandTotal - rawTotal) * 100) / 100;
  const amountWords = numberToIndianWords(grandTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const newInvoice: SalesInvoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber,
      invoiceDate,
      dueDate,
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerGstin: selectedCustomer.gstin,
      customerState: selectedCustomer.state,
      customerStateCode: selectedCustomer.stateCode,
      placeOfSupply: `${selectedCustomer.stateCode}-${selectedCustomer.state}`,
      invoiceType: "B2B",
      items: calculatedItems,
      subTotal,
      discountTotal: 0,
      cgstTotal,
      sgstTotal,
      igstTotal,
      roundOff,
      grandTotal,
      amountInWords: amountWords,
      paymentStatus: "Unpaid",
      eInvoiceStatus: "Pending",
      notes,
      termsAndConditions: "Payment due in 30 days. Subject to Mumbai Jurisdiction.",
    };

    onSaveInvoice(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl my-8 overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Create GST Tax Invoice
            </h2>
            <p className="text-xs text-slate-500">
              Tax rules automatically resolve CGST/SGST vs IGST based on customer Place of Supply.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Top Row: Customer & Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Customer *
              </label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.stateCode})
                  </option>
                ))}
              </select>
              <p className="mt-1 font-mono text-[10px] text-slate-500">
                GSTIN: {selectedCustomer?.gstin} | State: {selectedCustomer?.state} ({selectedCustomer?.stateCode})
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Invoice Number *
              </label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tax Classification Alert */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>
                Tax Regime:{" "}
                <strong>
                  {isIntraState
                    ? "Intra-State Supply (CGST + SGST applied)"
                    : "Inter-State Supply (IGST applied)"}
                </strong>
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">
              Company (State {company.stateCode}) → POS ({selectedCustomer?.stateCode})
            </span>
          </div>

          {/* Item Rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Items & Services
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-300 px-2.5 py-1 text-xs font-medium hover:bg-blue-100"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {lineItems.map((li, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/30 text-xs items-center"
                >
                  <div className="col-span-4">
                    <label className="text-[10px] text-slate-500">Select Item</label>
                    <select
                      value={li.itemId}
                      onChange={(e) => handleItemSelect(idx, e.target.value)}
                      className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs truncate"
                    >
                      {items.map((it) => (
                        <option key={it.id} value={it.id}>
                          {it.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500">HSN/SAC</label>
                    <input
                      type="text"
                      value={li.hsnSacCode}
                      onChange={(e) => {
                        const updated = [...lineItems];
                        updated[idx].hsnSacCode = e.target.value;
                        setLineItems(updated);
                      }}
                      className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="text-[10px] text-slate-500">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={li.quantity}
                      onChange={(e) => {
                        const updated = [...lineItems];
                        updated[idx].quantity = Number(e.target.value);
                        setLineItems(updated);
                      }}
                      className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500">Rate (INR)</label>
                    <input
                      type="number"
                      value={li.unitPrice}
                      onChange={(e) => {
                        const updated = [...lineItems];
                        updated[idx].unitPrice = Number(e.target.value);
                        setLineItems(updated);
                      }}
                      className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs font-mono"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] text-slate-500">GST Slab</label>
                    <select
                      value={li.gstRate}
                      onChange={(e) => {
                        const updated = [...lineItems];
                        updated[idx].gstRate = Number(e.target.value);
                        setLineItems(updated);
                      }}
                      className="w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-xs font-mono font-medium"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>

                  <div className="col-span-1 flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={lineItems.length === 1}
                      className="text-slate-400 hover:text-red-500 disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary & Totals */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex-1 space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Invoice Notes / Payment Instructions
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
              />
              <p className="text-[11px] text-slate-500 italic">
                Amount In Words: {amountWords}
              </p>
            </div>

            <div className="w-full sm:w-72 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Taxable Value:</span>
                <span className="font-mono font-medium">{formatINR(subTotal)}</span>
              </div>
              {isIntraState ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CGST Amount:</span>
                    <span className="font-mono">{formatINR(cgstTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">SGST Amount:</span>
                    <span className="font-mono">{formatINR(sgstTotal)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-slate-500">IGST Amount:</span>
                  <span className="font-mono">{formatINR(igstTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 text-[10px]">
                <span>Round Off:</span>
                <span className="font-mono">{formatINR(roundOff)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm text-slate-900 dark:text-white">
                <span>Grand Total:</span>
                <span className="font-mono text-blue-600 dark:text-blue-400">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-semibold shadow-md shadow-blue-500/20"
            >
              Save & Generate Tax Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
