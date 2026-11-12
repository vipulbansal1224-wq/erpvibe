"use client";

import React, { useState } from "react";
import {
  Landmark,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Search,
  FileCheck2,
} from "lucide-react";
import { BankAccount, BankTransaction } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BankingViewProps {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  onReconcile?: (txnId: string) => void;
}

export function BankingView({
  accounts,
  transactions: initialTxns,
  onReconcile,
}: BankingViewProps) {
  const [transactions, setTransactions] = useState<BankTransaction[]>(initialTxns);
  const [filterReconciled, setFilterReconciled] = useState<string>("all");

  const totalBankBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalUnreconciled = transactions.filter((t) => !t.reconciled).length;

  const handleToggleReconcile = (id: string) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, reconciled: !t.reconciled } : t
      )
    );
    if (onReconcile) {
      onReconcile(id);
    }
  };

  const filtered = transactions.filter((t) => {
    if (filterReconciled === "reconciled") return t.reconciled;
    if (filterReconciled === "unreconciled") return !t.reconciled;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Landmark className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Banking & Automated Bank Reconciliation
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-bank accounts, live statement feeds, and one-click reconciliation with customer remittances & vendor payouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            HDFC & ICICI Feeds Synced
          </span>
        </div>
      </div>

      {/* Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {acc.bankName}
                </h3>
                <p className="text-xs text-slate-500">{acc.branch}</p>
              </div>
              <span className="rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-semibold">
                {acc.type} A/C
              </span>
            </div>

            <div className="font-mono text-xs space-y-1">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Account Number:</span>
                <span className="font-bold text-slate-900 dark:text-white">{acc.accountNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>IFSC Code:</span>
                <span>{acc.ifscCode}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Book Balance</span>
                <p className="font-mono font-black text-lg text-slate-900 dark:text-white">
                  {formatINR(acc.currentBalance)}
                </p>
              </div>
              {acc.unreconciledBalance > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-amber-500 uppercase">Unreconciled</span>
                  <p className="font-mono font-bold text-xs text-amber-600">
                    {formatINR(acc.unreconciledBalance)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Statement and Reconciliation Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden space-y-3 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Bank Statement Transactions
            </h3>
            <p className="text-xs text-slate-500">
              Match incoming remittances and outgoing payouts to invoices.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {["all", "reconciled", "unreconciled"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterReconciled(filter)}
                className={`rounded-lg px-3 py-1 font-medium capitalize transition-colors ${
                  filterReconciled === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reference / UTR #</th>
                <th className="px-4 py-3">Transaction Description</th>
                <th className="px-4 py-3 text-right">Debit (Withdrawal)</th>
                <th className="px-4 py-3 text-right">Credit (Deposit)</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{txn.date}</td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-200">
                    {txn.referenceNo}
                  </td>
                  <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white max-w-xs truncate">
                    {txn.description}
                  </td>
                  <td className="px-4 py-3 text-right text-red-600 dark:text-red-400">
                    {txn.debit > 0 ? formatINR(txn.debit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    {txn.credit > 0 ? formatINR(txn.credit) : "-"}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">
                    {formatINR(txn.balance)}
                  </td>
                  <td className="px-4 py-3 text-center font-sans">
                    {txn.reconciled ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3" />
                        Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                        <Clock className="h-3 w-3" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-sans">
                    <button
                      onClick={() => handleToggleReconcile(txn.id)}
                      className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {txn.reconciled ? "Unmatch" : "1-Click Match"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
