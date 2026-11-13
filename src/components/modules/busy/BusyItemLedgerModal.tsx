"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Boxes,
  AlertTriangle,
} from "lucide-react";
import { BusyItemMaster, BusyVoucher, CompanyInfo } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BusyItemLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BusyItemMaster[];
  vouchers: BusyVoucher[];
  company: CompanyInfo;
  selectedItemId?: string;
}

export function BusyItemLedgerModal({
  isOpen,
  onClose,
  items,
  vouchers,
  company,
  selectedItemId,
}: BusyItemLedgerModalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    selectedItemId || (items.length > 0 ? items[0].id : "")
  );

  if (!isOpen) return null;

  const currentItem = items.find((i) => i.id === selectedId) || items[0];

  // Track stock movements from all vouchers
  let runningQty = currentItem?.openingQty || 0;
  const movements: any[] = [];

  vouchers.forEach((v) => {
    v.items.forEach((vi) => {
      if (
        vi.itemName === currentItem?.name ||
        vi.itemId === currentItem?.id ||
        (vi.hsnCode && vi.hsnCode === currentItem?.hsnCode)
      ) {
        let inward = 0;
        let outward = 0;

        if (v.voucherType === "purchase" || v.voucherType === "credit_note") {
          inward = vi.qty;
          runningQty += inward;
        } else if (v.voucherType === "sales" || v.voucherType === "debit_note") {
          outward = vi.qty;
          runningQty -= outward;
        }

        movements.push({
          id: `${v.id}-${vi.id}`,
          date: v.date,
          voucherType: v.voucherType.toUpperCase().replace("_", " "),
          voucherNo: v.voucherNo,
          partyName: v.partyName,
          rate: vi.rate,
          inward,
          outward,
          closingQty: runningQty,
          valuation: runningQty * (currentItem?.purchaseRate || vi.rate),
        });
      }
    });
  });

  const totalInward = movements.reduce((acc, m) => acc + m.inward, 0);
  const totalOutward = movements.reduce((acc, m) => acc + m.outward, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md">
              Alt+I
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Item Stock Ledger (स्टॉक बही)
                </h3>
                <span className="rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 text-[10px] font-bold">
                  BUSY Display Menu Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Item-wise inward receipts, outward issues, running inventory & FIFO valuation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              <Printer className="h-4 w-4" />
              Print (Alt+P)
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Item Selector */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Select Item Master
          </label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full sm:w-1/2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
          >
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} [{i.group}] (HSN: {i.hsnCode})
              </option>
            ))}
          </select>
        </div>

        {/* Item Summary Info Box */}
        {currentItem && (
          <div className="p-4 bg-purple-50/40 dark:bg-purple-950/20 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-4">
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                {currentItem.name}
              </div>
              <div className="text-slate-500">
                Group: <span className="font-semibold text-purple-600">{currentItem.group}</span> | HSN/SAC:{" "}
                <span className="font-mono font-semibold">{currentItem.hsnCode}</span> | Tax Slab:{" "}
                <span className="font-semibold">{currentItem.taxCategory}</span> | UOM:{" "}
                <span className="font-semibold">{currentItem.uom}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-500 block text-[11px]">Opening Stock:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {currentItem.openingQty} {currentItem.uom}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Closing Stock:</span>
                <span className="font-extrabold text-purple-600 text-sm">
                  {runningQty} {currentItem.uom}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Stock Valuation:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatINR(runningQty * currentItem.purchaseRate)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Stock Movements Table */}
        <div className="p-6 overflow-x-auto max-h-[55vh]">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-24">Date</th>
                <th className="p-3 w-28">Voucher Type</th>
                <th className="p-3 w-32">Voucher No</th>
                <th className="p-3">Party Name / Particulars</th>
                <th className="p-3 w-28 text-right">Rate (₹)</th>
                <th className="p-3 w-28 text-right">Inward (Qty)</th>
                <th className="p-3 w-28 text-right">Outward (Qty)</th>
                <th className="p-3 w-28 text-right">Closing (Qty)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-semibold italic">
                <td className="p-3">01/04/2026</td>
                <td className="p-3 text-slate-500">Opening</td>
                <td className="p-3">-</td>
                <td className="p-3">Opening Stock per Warehouse Count</td>
                <td className="p-3 text-right">{formatINR(currentItem?.purchaseRate || 0)}</td>
                <td className="p-3 text-right">{currentItem?.openingQty}</td>
                <td className="p-3 text-right">-</td>
                <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                  {currentItem?.openingQty} {currentItem?.uom}
                </td>
              </tr>

              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono">{m.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {m.voucherType}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-purple-600 dark:text-purple-400">
                    {m.voucherNo}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{m.partyName}</td>
                  <td className="p-3 text-right font-mono">{formatINR(m.rate)}</td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    {m.inward > 0 ? `+${m.inward}` : "-"}
                  </td>
                  <td className="p-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    {m.outward > 0 ? `-${m.outward}` : "-"}
                  </td>
                  <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                    {m.closingQty} {currentItem?.uom}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white">
              <tr>
                <td colSpan={5} className="p-3 text-right">
                  Total Movements:
                </td>
                <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                  +{totalInward}
                </td>
                <td className="p-3 text-right text-rose-600 dark:text-rose-400">
                  -{totalOutward}
                </td>
                <td className="p-3 text-right text-purple-600 dark:text-purple-400">
                  {runningQty} {currentItem?.uom}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Press <kbd className="font-mono font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-300">Esc</kbd> to exit.
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 font-semibold hover:bg-slate-300"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
