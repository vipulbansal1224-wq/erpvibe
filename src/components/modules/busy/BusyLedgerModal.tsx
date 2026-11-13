"use client";

import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Calendar,
  Search,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
} from "lucide-react";
import { BusyVoucher, BusyAccountMaster, CompanyInfo } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BusyLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: BusyAccountMaster[];
  vouchers: BusyVoucher[];
  company: CompanyInfo;
  selectedAccountId?: string;
}

export function BusyLedgerModal({
  isOpen,
  onClose,
  accounts,
  vouchers,
  company,
  selectedAccountId,
}: BusyLedgerModalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    selectedAccountId || (accounts.length > 0 ? accounts[0].id : "")
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-04-01");
  const [dateTo, setDateTo] = useState(new Date().toISOString().substring(0, 10));

  if (!isOpen) return null;

  const currentAccount = accounts.find((a) => a.id === selectedId) || accounts[0];

  // Filter vouchers related to this account
  const accountVouchers = vouchers.filter((v) => {
    if (!currentAccount) return false;
    const matchParty = v.partyName === currentAccount.name || v.partyId === currentAccount.id;
    const matchDebit = v.debitAccount === currentAccount.name;
    const matchCredit = v.creditAccount === currentAccount.name;
    const inDate = (!dateFrom || v.date >= dateFrom) && (!dateTo || v.date <= dateTo);
    return (matchParty || matchDebit || matchCredit) && inDate;
  });

  // Calculate Running Balance
  let running = currentAccount?.openingBalance || 0;
  const isDebtorOrAsset =
    currentAccount?.group === "Sundry Debtors" ||
    currentAccount?.group === "Bank Accounts" ||
    currentAccount?.group === "Cash-in-hand" ||
    currentAccount?.group === "Direct Expenses" ||
    currentAccount?.group === "Indirect Expenses" ||
    currentAccount?.group === "Fixed Assets";

  const rows = accountVouchers.map((v) => {
    let debit = 0;
    let credit = 0;

    if (v.voucherType === "sales") {
      debit = v.totalAmount;
    } else if (v.voucherType === "purchase") {
      credit = v.totalAmount;
    } else if (v.voucherType === "receipt") {
      if (v.creditAccount === currentAccount?.name || v.partyName === currentAccount?.name) {
        credit = v.totalAmount;
      } else {
        debit = v.totalAmount;
      }
    } else if (v.voucherType === "payment") {
      if (v.debitAccount === currentAccount?.name || v.partyName === currentAccount?.name) {
        debit = v.totalAmount;
      } else {
        credit = v.totalAmount;
      }
    } else if (v.voucherType === "contra") {
      if (v.debitAccount === currentAccount?.name) debit = v.totalAmount;
      if (v.creditAccount === currentAccount?.name) credit = v.totalAmount;
    } else if (v.voucherType === "journal") {
      if (v.debitAccount === currentAccount?.name) debit = v.totalAmount;
      if (v.creditAccount === currentAccount?.name) credit = v.totalAmount;
    } else if (v.voucherType === "debit_note") {
      debit = v.totalAmount;
    } else if (v.voucherType === "credit_note") {
      credit = v.totalAmount;
    }

    if (isDebtorOrAsset) {
      running = running + debit - credit;
    } else {
      running = running + credit - debit;
    }

    return {
      id: v.id,
      date: v.date,
      voucherType: v.voucherType.toUpperCase().replace("_", " "),
      voucherNo: v.voucherNo,
      narration: v.narration || `${v.voucherType} entry`,
      billRef: v.billRef || "-",
      debit,
      credit,
      runningBalance: running,
    };
  });

  const totalDebit = rows.reduce((acc, r) => acc + r.debit, 0);
  const totalCredit = rows.reduce((acc, r) => acc + r.credit, 0);

  const exportCSV = () => {
    let csv = `Date,Voucher Type,Voucher No,Narration,Bill Ref,Debit (Dr),Credit (Cr),Running Balance\n`;
    csv += `2026-04-01,Opening Balance,-,Opening Balance per Books,-,${
      currentAccount?.balanceType === "Dr" ? currentAccount.openingBalance : 0
    },${currentAccount?.balanceType === "Cr" ? currentAccount.openingBalance : 0},${
      currentAccount?.openingBalance
    }\n`;
    rows.forEach((r) => {
      csv += `${r.date},"${r.voucherType}","${r.voucherNo}","${r.narration}","${r.billRef}",${r.debit},${r.credit},${r.runningBalance}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Account_Ledger_${currentAccount?.name.replace(/\s+/g, "_")}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 py-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md">
              Alt+L
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Account Ledger Book (खाताबही)
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold">
                  Statutory Statement Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detailed statement of account with running balance & bill-by-bill references.
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
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Account Ledger Master
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} [{a.group}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Account Master Card Details */}
        {currentAccount && (
          <div className="p-4 bg-blue-50/40 dark:bg-blue-950/20 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs gap-4">
            <div>
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                {currentAccount.name}
              </div>
              <div className="text-slate-500">
                Group: <span className="font-semibold text-blue-600">{currentAccount.group}</span> | State:{" "}
                <span className="font-semibold">{currentAccount.state}</span> | GSTIN:{" "}
                <span className="font-mono">{currentAccount.gstin || "Unregistered"}</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-500 block text-[11px]">Opening Balance:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {formatINR(currentAccount.openingBalance)} {currentAccount.balanceType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Closing Balance:</span>
                <span className="font-extrabold text-blue-600 text-sm">
                  {formatINR(Math.abs(running))} {running >= 0 ? "Dr" : "Cr"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Ledger Table */}
        <div className="p-6 overflow-x-auto max-h-[60vh]">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3 w-24">Date</th>
                <th className="p-3 w-28">Voucher Type</th>
                <th className="p-3 w-32">Voucher No</th>
                <th className="p-3">Particulars / Narration</th>
                <th className="p-3 w-28">Bill Ref</th>
                <th className="p-3 w-32 text-right">Debit (Dr)</th>
                <th className="p-3 w-32 text-right">Credit (Cr)</th>
                <th className="p-3 w-36 text-right">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {/* Opening Balance Row */}
              <tr className="bg-slate-50/60 dark:bg-slate-800/40 font-semibold italic">
                <td className="p-3">01/04/2026</td>
                <td className="p-3 text-slate-500">Opening</td>
                <td className="p-3">-</td>
                <td className="p-3">Opening Balance as per Financial Books</td>
                <td className="p-3">-</td>
                <td className="p-3 text-right">
                  {currentAccount?.balanceType === "Dr"
                    ? formatINR(currentAccount.openingBalance)
                    : "-"}
                </td>
                <td className="p-3 text-right">
                  {currentAccount?.balanceType === "Cr"
                    ? formatINR(currentAccount.openingBalance)
                    : "-"}
                </td>
                <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                  {formatINR(currentAccount?.openingBalance || 0)}{" "}
                  {currentAccount?.balanceType}
                </td>
              </tr>

              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono">{r.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {r.voucherType}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {r.voucherNo}
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{r.narration}</td>
                  <td className="p-3 font-mono text-slate-500">{r.billRef}</td>
                  <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                    {r.debit > 0 ? formatINR(r.debit) : "-"}
                  </td>
                  <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                    {r.credit > 0 ? formatINR(r.credit) : "-"}
                  </td>
                  <td className="p-3 text-right font-bold text-blue-600 dark:text-blue-400">
                    {formatINR(Math.abs(r.runningBalance))} {r.runningBalance >= 0 ? "Dr" : "Cr"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-900 dark:text-white">
              <tr>
                <td colSpan={5} className="p-3 text-right">
                  Total Transaction Debits & Credits:
                </td>
                <td className="p-3 text-right text-emerald-600 dark:text-emerald-400">
                  {formatINR(totalDebit)}
                </td>
                <td className="p-3 text-right text-purple-600 dark:text-purple-400">
                  {formatINR(totalCredit)}
                </td>
                <td className="p-3 text-right text-blue-600 dark:text-blue-400">
                  {formatINR(Math.abs(running))} {running >= 0 ? "Dr" : "Cr"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Press <kbd className="font-mono font-bold bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-300">Esc</kbd> to exit ledger view.
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
