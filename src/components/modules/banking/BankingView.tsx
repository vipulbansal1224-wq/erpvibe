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
  Plus,
  Trash2,
} from "lucide-react";
import { BankAccount, BankTransaction } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BankingViewProps {
  accounts: BankAccount[];
  transactions: BankTransaction[];
  onReconcile?: (txnId: string) => void;
  onAddTransaction?: (txn: BankTransaction) => void;
  onDeleteTransaction?: (id: string) => void;
  onAddAccount?: (acc: BankAccount) => void;
}

export function BankingView({
  accounts: initialAccounts,
  transactions: initialTxns,
  onReconcile,
  onAddTransaction,
  onDeleteTransaction,
  onAddAccount,
}: BankingViewProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [transactions, setTransactions] = useState<BankTransaction[]>(initialTxns);
  const [filterReconciled, setFilterReconciled] = useState<string>("all");
  const [showModal, setShowModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Form states for transaction
  const [txnDate, setTxnDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNo, setReferenceNo] = useState(`UTR${Date.now().toString().slice(-6)}`);
  const [partyName, setPartyName] = useState("");
  const [paymentMode, setPaymentMode] = useState<BankTransaction["paymentMode"]>("NEFT");
  const [chequeNo, setChequeNo] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"Credit" | "Debit">("Credit");
  const [amount, setAmount] = useState(25000);

  // Form states for new bank account
  const [newBankName, setNewBankName] = useState("State Bank of India");
  const [newAccountNo, setNewAccountNo] = useState("");
  const [newIfsc, setNewIfsc] = useState("SBIN0001234");
  const [newAccountType, setNewAccountType] = useState<BankAccount["type"]>("Current");
  const [newOpeningBal, setNewOpeningBal] = useState(100000);

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

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;

    const newTxn: BankTransaction = {
      id: `TXN-${Date.now()}`,
      date: txnDate,
      referenceNo,
      description,
      partyName: partyName || undefined,
      paymentMode,
      chequeNo: chequeNo || undefined,
      debit: type === "Debit" ? Number(amount) : 0,
      credit: type === "Credit" ? Number(amount) : 0,
      balance: totalBankBalance + (type === "Credit" ? Number(amount) : -Number(amount)),
      reconciled: false,
    };

    setTransactions([newTxn, ...transactions]);
    if (onAddTransaction) {
      onAddTransaction(newTxn);
    }
    setShowModal(false);
    setDescription("");
    setPartyName("");
    setChequeNo("");
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountNo) return;
    const newAcc: BankAccount = {
      id: `ACC-${Date.now()}`,
      bankName: newBankName,
      accountNumber: newAccountNo,
      ifscCode: newIfsc,
      branch: "Main Branch",
      type: newAccountType,
      currentBalance: Number(newOpeningBal) || 0,
      unreconciledBalance: 0,
    };
    setAccounts([...accounts, newAcc]);
    if (onAddAccount) {
      onAddAccount(newAcc);
    }
    setShowAccountModal(false);
    setNewAccountNo("");
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    if (onDeleteTransaction) {
      onDeleteTransaction(id);
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Banking & Bank Reconciliation
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Multi-bank accounts, live statement reconciliation, automated invoice matching, and ledger verification.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAccountModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 px-3 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Bank Account
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Statement Entry
          </button>
        </div>
      </div>

      {/* Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase">
                  {acc.type} Account
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                  {acc.bankName}
                </h3>
                <p className="text-[11px] font-mono text-slate-500">{acc.accountNumber}</p>
              </div>
              <span className="rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                Live Feed
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400">Available Balance:</span>
                <p className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                  {formatINR(acc.currentBalance)}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">IFSC: {acc.ifscCode}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction Reconciliation Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bank Statement & Reconciliation Log
            </h3>
            <p className="text-xs text-slate-500">
              {totalUnreconciled} transactions awaiting 1-click ledger reconciliation
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["all", "reconciled", "unreconciled"].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterReconciled(filter)}
                className={`px-3 py-1 text-xs rounded-lg font-medium capitalize transition-all ${
                  filterReconciled === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
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
                  <td className="px-4 py-3 font-sans">
                    <p className="font-medium text-slate-900 dark:text-white max-w-xs truncate">{txn.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {txn.paymentMode && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono">
                          {txn.paymentMode}
                        </span>
                      )}
                      {txn.partyName && (
                        <span className="text-[10px] text-slate-500 truncate">{txn.partyName}</span>
                      )}
                      {txn.chequeNo && (
                        <span className="text-[10px] text-amber-600 font-mono">Chq: {txn.chequeNo}</span>
                      )}
                    </div>
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleReconcile(txn.id)}
                        className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {txn.reconciled ? "Unmatch" : "1-Click Match"}
                      </button>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              Add Bank Statement Transaction
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    value={txnDate}
                    onChange={(e) => setTxnDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Transaction Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value="Credit">Deposit / Credit (+)</option>
                    <option value="Debit">Withdrawal / Debit (-)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    UTR / Cheque Ref #
                  </label>
                  <input
                    type="text"
                    value={referenceNo}
                    onChange={(e) => setReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                  >
                    <option value="NEFT">NEFT Transfer</option>
                    <option value="RTGS">RTGS Real-Time</option>
                    <option value="IMPS">IMPS Immediate</option>
                    <option value="UPI">UPI Auto-Collect</option>
                    <option value="Cheque">Bank CTS Cheque</option>
                    <option value="NACH">NACH / e-Mandate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Counterparty / Party Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tata Consultancy Services"
                    value={partyName}
                    onChange={(e) => setPartyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Cheque # (if applicable)
                  </label>
                  <input
                    type="text"
                    placeholder="000123"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description / Party Narration *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NEFT INW Tata Consultancy Inv 001"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Transaction Amount (₹) *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Post Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-blue-600" />
              Add Company Bank Account
            </h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Bank Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. HDFC Bank / State Bank of India / ICICI Bank"
                  value={newBankName}
                  onChange={(e) => setNewBankName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    placeholder="502000..."
                    value={newAccountNo}
                    onChange={(e) => setNewAccountNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    value={newIfsc}
                    onChange={(e) => setNewIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={newAccountType}
                    onChange={(e) => setNewAccountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    <option value="Current">Current Account</option>
                    <option value="Savings">Savings Account</option>
                    <option value="Cash Credit">Cash Credit (CC)</option>
                    <option value="Overdraft">Overdraft (OD)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Opening Balance (₹)
                  </label>
                  <input
                    type="number"
                    value={newOpeningBal}
                    onChange={(e) => setNewOpeningBal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
