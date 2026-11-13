"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Save,
  Calculator,
  Percent,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
} from "lucide-react";
import {
  BusyVoucher,
  BusyVoucherType,
  BusyVoucherItem,
  BusyBillSundry,
  BusyAccountMaster,
  BusyItemMaster,
  CompanyInfo,
} from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface BusyVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voucher: BusyVoucher) => void;
  initialType?: BusyVoucherType;
  company: CompanyInfo;
  accounts: BusyAccountMaster[];
  items: BusyItemMaster[];
  editVoucher?: BusyVoucher | null;
}

export function BusyVoucherModal({
  isOpen,
  onClose,
  onSave,
  initialType = "sales",
  company,
  accounts,
  items,
  editVoucher,
}: BusyVoucherModalProps) {
  const [voucherType, setVoucherType] = useState<BusyVoucherType>(initialType);
  const [voucherNo, setVoucherNo] = useState("");
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [series, setSeries] = useState("Main");

  // Party & Accounts
  const [partyId, setPartyId] = useState("");
  const [partyName, setPartyName] = useState("");
  const [partyState, setPartyState] = useState(company.state);
  const [partyGstin, setPartyGstin] = useState("");
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [billRef, setBillRef] = useState("");
  const [narration, setNarration] = useState("");

  // Items & Sundries for Trading Vouchers
  const [voucherItems, setVoucherItems] = useState<BusyVoucherItem[]>([]);
  const [sundries, setSundries] = useState<BusyBillSundry[]>([
    { id: "SND-1", type: "discount", name: "Trade Discount", rate: 0, amount: 0 },
    { id: "SND-2", type: "freight", name: "Freight & Cartage", amount: 0 },
    { id: "SND-3", type: "insurance", name: "Insurance Charges", amount: 0 },
    { id: "SND-4", type: "roundoff", name: "Round-Off (+/-)", amount: 0 },
  ]);

  // Direct Amount for Financial Vouchers (Payment, Receipt, Contra, Journal)
  const [directAmount, setDirectAmount] = useState<number>(0);

  // Auto-detect Intra vs Inter-State
  const isInterState =
    partyState.trim().toLowerCase() !== company.state.trim().toLowerCase();

  // Reset or Populate on Open
  useEffect(() => {
    if (editVoucher) {
      setVoucherType(editVoucher.voucherType);
      setVoucherNo(editVoucher.voucherNo);
      setDate(editVoucher.date);
      setSeries(editVoucher.series || "Main");
      setPartyId(editVoucher.partyId || "");
      setPartyName(editVoucher.partyName || "");
      setPartyState(editVoucher.partyState || company.state);
      setPartyGstin(editVoucher.partyGstin || "");
      setDebitAccount(editVoucher.debitAccount || "");
      setCreditAccount(editVoucher.creditAccount || "");
      setBillRef(editVoucher.billRef || "");
      setNarration(editVoucher.narration || "");
      setVoucherItems(editVoucher.items || []);
      setSundries(editVoucher.sundries || []);
      setDirectAmount(editVoucher.totalAmount || 0);
    } else {
      setVoucherType(initialType);
      const prefix =
        initialType === "sales"
          ? "SALE"
          : initialType === "purchase"
          ? "PUR"
          : initialType === "payment"
          ? "PYMT"
          : initialType === "receipt"
          ? "RCPT"
          : initialType === "contra"
          ? "CNTR"
          : initialType === "journal"
          ? "JRNL"
          : initialType === "debit_note"
          ? "DN"
          : "CN";
      setVoucherNo(`${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setDate(new Date().toISOString().substring(0, 10));
      setPartyId("");
      setPartyName("");
      setPartyState(company.state);
      setPartyGstin("");
      setDebitAccount("");
      setCreditAccount("");
      setBillRef("");
      setNarration("");
      setDirectAmount(0);

      // Default sample item for sales/purchase
      if (["sales", "purchase", "debit_note", "credit_note"].includes(initialType) && items.length > 0) {
        const firstItem = items[0];
        const qty = 1;
        const rate = initialType === "purchase" ? firstItem.purchaseRate : firstItem.sellingPrice;
        const taxable = qty * rate;
        const gstRate = firstItem.gstRate;
        const isInter = company.state !== company.state; // default false
        const cgst = isInter ? 0 : (taxable * (gstRate / 2)) / 100;
        const sgst = isInter ? 0 : (taxable * (gstRate / 2)) / 100;
        const igst = isInter ? (taxable * gstRate) / 100 : 0;
        setVoucherItems([
          {
            id: `VI-${Date.now()}`,
            itemId: firstItem.id,
            itemName: firstItem.name,
            itemGroup: firstItem.group,
            hsnCode: firstItem.hsnCode,
            qty,
            uom: firstItem.uom,
            rate,
            gstRate,
            taxableAmount: taxable,
            cgst,
            sgst,
            igst,
            total: taxable + cgst + sgst + igst,
          },
        ]);
      } else {
        setVoucherItems([]);
      }
    }
  }, [isOpen, initialType, editVoucher, company.state, items]);

  // Recalculate Item taxes whenever partyState or item values change
  const handleItemChange = (index: number, field: keyof BusyVoucherItem, val: any) => {
    setVoucherItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index], [field]: val };

      // Recalculate
      const qty = Number(item.qty) || 0;
      const rate = Number(item.rate) || 0;
      const gstRate = Number(item.gstRate) || 0;
      const taxable = qty * rate;

      item.taxableAmount = taxable;
      if (isInterState) {
        item.cgst = 0;
        item.sgst = 0;
        item.igst = (taxable * gstRate) / 100;
      } else {
        item.cgst = (taxable * (gstRate / 2)) / 100;
        item.sgst = (taxable * (gstRate / 2)) / 100;
        item.igst = 0;
      }
      item.total = taxable + item.cgst + item.sgst + item.igst;
      updated[index] = item;
      return updated;
    });
  };

  const handleAddItem = () => {
    const firstItem = items[0] || {
      id: "ITEM-GEN",
      name: "Standard Goods / Service",
      group: "General",
      hsnCode: "85285200",
      uom: "Pcs",
      sellingPrice: 1000,
      gstRate: 18,
    };
    const qty = 1;
    const rate = firstItem.sellingPrice || 1000;
    const taxable = qty * rate;
    const gstRate = firstItem.gstRate || 18;
    const cgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const sgst = isInterState ? 0 : (taxable * (gstRate / 2)) / 100;
    const igst = isInterState ? (taxable * gstRate) / 100 : 0;

    setVoucherItems((prev) => [
      ...prev,
      {
        id: `VI-${Date.now()}-${Math.random()}`,
        itemId: firstItem.id,
        itemName: firstItem.name,
        itemGroup: firstItem.group,
        hsnCode: firstItem.hsnCode,
        qty,
        uom: firstItem.uom,
        rate,
        gstRate,
        taxableAmount: taxable,
        cgst,
        sgst,
        igst,
        total: taxable + cgst + sgst + igst,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setVoucherItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Select Party from Masters
  const handleSelectParty = (accId: string) => {
    const acc = accounts.find((a) => a.id === accId);
    if (acc) {
      setPartyId(acc.id);
      setPartyName(acc.name);
      setPartyState(acc.state || company.state);
      setPartyGstin(acc.gstin || "");
    }
  };

  // Totals Calculation
  const isTradingVoucher = ["sales", "purchase", "debit_note", "credit_note"].includes(voucherType);

  const rawTaxable = isTradingVoucher
    ? voucherItems.reduce((acc, curr) => acc + curr.taxableAmount, 0)
    : directAmount;
  const rawCgst = isTradingVoucher
    ? voucherItems.reduce((acc, curr) => acc + curr.cgst, 0)
    : 0;
  const rawSgst = isTradingVoucher
    ? voucherItems.reduce((acc, curr) => acc + curr.sgst, 0)
    : 0;
  const rawIgst = isTradingVoucher
    ? voucherItems.reduce((acc, curr) => acc + curr.igst, 0)
    : 0;

  // Sundry Adjustments
  const discountSundry = sundries.find((s) => s.type === "discount")?.amount || 0;
  const freightSundry = sundries.find((s) => s.type === "freight")?.amount || 0;
  const insuranceSundry = sundries.find((s) => s.type === "insurance")?.amount || 0;
  const roundoffSundry = sundries.find((s) => s.type === "roundoff")?.amount || 0;

  const netItemsTotal = rawTaxable + rawCgst + rawSgst + rawIgst;
  const grandTotal = isTradingVoucher
    ? Math.max(0, netItemsTotal + discountSundry + freightSundry + insuranceSundry + roundoffSundry)
    : directAmount;

  // Keyboard shortcut listener inside modal: F2 = Save, Esc = Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "F2") {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voucherNo) {
      alert("Please specify a Voucher Number.");
      return;
    }

    const newVoucher: BusyVoucher = {
      id: editVoucher?.id || `BVOUCH-${Date.now()}`,
      voucherNo,
      voucherType,
      date,
      series,
      partyId,
      partyName: partyName || (voucherType === "contra" ? "Internal Treasury Transfer" : "General Account"),
      partyState,
      partyGstin,
      isInterState,
      debitAccount,
      creditAccount,
      items: voucherItems,
      sundries,
      taxableAmount: rawTaxable,
      cgstAmount: rawCgst,
      sgstAmount: rawSgst,
      igstAmount: rawIgst,
      totalAmount: grandTotal,
      billRef: billRef || undefined,
      narration:
        narration ||
        `${voucherType.toUpperCase()} Voucher entry recorded in BUSY accounting sequence.`,
      status: "Posted",
      irnStatus: voucherType === "sales" ? "Generated" : "Not Applicable",
    };

    onSave(newVoucher);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md">
              {voucherType === "sales"
                ? "F8"
                : voucherType === "purchase"
                ? "F9"
                : voucherType === "payment"
                ? "F5"
                : voucherType === "receipt"
                ? "F6"
                : voucherType === "contra"
                ? "F4"
                : voucherType === "journal"
                ? "F7"
                : voucherType === "debit_note"
                ? "^F9"
                : "^F8"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {voucherType.replace("_", " ")} Voucher Entry
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  BUSY Accounting Standard
                </span>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                  Press F2 to Save
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Statutory GST & double-entry compliant ledger posting.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Voucher Type Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900 px-6 pt-2 gap-1 text-xs font-semibold">
          {[
            { id: "sales", label: "F8 Sales", key: "F8" },
            { id: "purchase", label: "F9 Purchase", key: "F9" },
            { id: "payment", label: "F5 Payment", key: "F5" },
            { id: "receipt", label: "F6 Receipt", key: "F6" },
            { id: "contra", label: "F4 Contra", key: "F4" },
            { id: "journal", label: "F7 Journal", key: "F7" },
            { id: "debit_note", label: "^F9 Debit Note", key: "Ctrl+F9" },
            { id: "credit_note", label: "^F8 Credit Note", key: "Ctrl+F8" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setVoucherType(t.id as BusyVoucherType)}
              className={`px-3 py-2 rounded-t-lg transition-all border-b-2 ${
                voucherType === t.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-800 font-bold shadow-sm"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Voucher Series
              </label>
              <input
                type="text"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Voucher Number *
              </label>
              <input
                type="text"
                required
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date (DD/MM/YYYY) *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                GST Supply Nature
              </label>
              <div
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold border ${
                  isInterState
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                    : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                {isInterState ? "Inter-State (IGST 100%)" : "Intra-State (CGST 50% + SGST 50%)"}
              </div>
            </div>
          </div>

          {/* Party Selection (For Sales, Purchase, Debit Note, Credit Note) */}
          {isTradingVoucher && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Party / Account Master (Debtor / Creditor) *
                </label>
                <select
                  value={partyId}
                  onChange={(e) => handleSelectParty(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Master Ledger --</option>
                  {accounts
                    .filter((a) =>
                      voucherType === "sales" || voucherType === "credit_note"
                        ? a.group === "Sundry Debtors"
                        : a.group === "Sundry Creditors"
                    )
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.state})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supply State (Determines Tax Bifurcation)
                </label>
                <input
                  type="text"
                  value={partyState}
                  onChange={(e) => setPartyState(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Maharashtra, Karnataka"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bill-by-Bill Reference No.
                </label>
                <input
                  type="text"
                  value={billRef}
                  onChange={(e) => setBillRef(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. INV-2026-901"
                />
              </div>
            </div>
          )}

          {/* Payment & Receipt Accounts Grid */}
          {(voucherType === "payment" || voucherType === "receipt") && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {voucherType === "payment" ? "Debit Account (Supplier / Expense)" : "Credit Account (Customer / Revenue)"} *
                </label>
                <select
                  value={voucherType === "payment" ? debitAccount : creditAccount}
                  onChange={(e) =>
                    voucherType === "payment"
                      ? setDebitAccount(e.target.value)
                      : setCreditAccount(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Ledger --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} [{a.group}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {voucherType === "payment" ? "Credit Bank / Cash Account" : "Debit Bank / Cash Account"} *
                </label>
                <select
                  value={voucherType === "payment" ? creditAccount : debitAccount}
                  onChange={(e) =>
                    voucherType === "payment"
                      ? setCreditAccount(e.target.value)
                      : setDebitAccount(e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Bank/Cash --</option>
                  {accounts
                    .filter((a) => a.group === "Bank Accounts" || a.group === "Cash-in-hand")
                    .map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name} (Bal: {formatINR(a.currentBalance)})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={directAmount || ""}
                  onChange={(e) => setDirectAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Contra Grid (Cash to Bank or Bank to Bank) */}
          {voucherType === "contra" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Deposit Into (Debit Bank Account) *
                </label>
                <select
                  value={debitAccount}
                  onChange={(e) => setDebitAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Destination Bank --</option>
                  {accounts
                    .filter((a) => a.group === "Bank Accounts" || a.group === "Cash-in-hand")
                    .map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Withdraw From (Credit Cash / Bank) *
                </label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Source Cash/Bank --</option>
                  {accounts
                    .filter((a) => a.group === "Bank Accounts" || a.group === "Cash-in-hand")
                    .map((a) => (
                      <option key={a.id} value={a.name}>
                        {a.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transfer Amount (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={directAmount || ""}
                  onChange={(e) => setDirectAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Journal Grid (Non-Cash Adjustment) */}
          {voucherType === "journal" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Debit Account (Expense / Asset) *
                </label>
                <select
                  value={debitAccount}
                  onChange={(e) => setDebitAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Debit Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} [{a.group}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Credit Account (Liability / Asset) *
                </label>
                <select
                  value={creditAccount}
                  onChange={(e) => setCreditAccount(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="">-- Select Credit Account --</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.name}>
                      {a.name} [{a.group}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adjustment Amount (INR) *
                </label>
                <input
                  type="number"
                  required
                  value={directAmount || ""}
                  onChange={(e) => setDirectAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {/* Item Details Grid (For Trading Vouchers: Sales, Purchase, Notes) */}
          {isTradingVoucher && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    Item Masters & Multi-Tax Details
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (Auto-calculates item-wise GST slabs)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 px-3 py-1.5 text-xs font-semibold transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Item Line
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    <tr>
                      <th className="p-3">Item Description</th>
                      <th className="p-3 w-28">HSN/SAC</th>
                      <th className="p-3 w-20">Qty</th>
                      <th className="p-3 w-20">UOM</th>
                      <th className="p-3 w-28">Rate (₹)</th>
                      <th className="p-3 w-20">GST %</th>
                      <th className="p-3 w-28 text-right">Taxable (₹)</th>
                      <th className="p-3 w-28 text-right">
                        {isInterState ? "IGST (₹)" : "CGST+SGST (₹)"}
                      </th>
                      <th className="p-3 w-32 text-right">Line Total (₹)</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {voucherItems.map((item, idx) => (
                      <tr key={item.id}>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={item.hsnCode}
                            onChange={(e) => handleItemChange(idx, "hsnCode", e.target.value)}
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-slate-900 dark:text-white font-mono"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, "qty", Number(e.target.value))}
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={item.uom}
                            onChange={(e) => handleItemChange(idx, "uom", e.target.value)}
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-1 py-1 text-slate-900 dark:text-white"
                          >
                            <option value="Pcs">Pcs</option>
                            <option value="Box">Box</option>
                            <option value="Kgs">Kgs</option>
                            <option value="Mtr">Mtr</option>
                            <option value="Nos">Nos</option>
                          </select>
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, "rate", Number(e.target.value))}
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-2 py-1 text-slate-900 dark:text-white font-semibold"
                          />
                        </td>
                        <td className="p-2.5">
                          <select
                            value={item.gstRate}
                            onChange={(e) =>
                              handleItemChange(idx, "gstRate", Number(e.target.value))
                            }
                            className="w-full rounded border border-slate-200 dark:border-slate-700 bg-transparent px-1 py-1 text-slate-900 dark:text-white font-semibold"
                          >
                            <option value="0">0%</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        </td>
                        <td className="p-2.5 text-right font-medium">
                          {formatINR(item.taxableAmount)}
                        </td>
                        <td className="p-2.5 text-right font-medium text-blue-600 dark:text-blue-400">
                          {isInterState
                            ? formatINR(item.igst)
                            : formatINR(item.cgst + item.sgst)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-white">
                          {formatINR(item.total)}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bill Sundries Bottom Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-xs">
                    <Percent className="h-4 w-4 text-blue-600" />
                    Additional Bill Sundries (Charges / Discounts)
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-600 dark:text-slate-400">Trade Discount (-)</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={Math.abs(discountSundry) || ""}
                        onChange={(e) => {
                          const val = -Math.abs(Number(e.target.value));
                          setSundries((prev) =>
                            prev.map((s) => (s.type === "discount" ? { ...s, amount: val } : s))
                          );
                        }}
                        className="w-32 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-right text-red-600 font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-600 dark:text-slate-400">Freight & Cartage (+)</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={freightSundry || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSundries((prev) =>
                            prev.map((s) => (s.type === "freight" ? { ...s, amount: val } : s))
                          );
                        }}
                        className="w-32 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-right text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-600 dark:text-slate-400">Insurance Charges (+)</span>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={insuranceSundry || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSundries((prev) =>
                            prev.map((s) => (s.type === "insurance" ? { ...s, amount: val } : s))
                          );
                        }}
                        className="w-32 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-right text-slate-900 dark:text-white font-medium"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-600 dark:text-slate-400">Round-Off (+/-)</span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={roundoffSundry || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setSundries((prev) =>
                            prev.map((s) => (s.type === "roundoff" ? { ...s, amount: val } : s))
                          );
                        }}
                        className="w-32 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-right text-slate-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Tax Breakdown Summary Box */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
                    Tax & Settlement Summary
                  </div>

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Value:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatINR(rawTaxable)}
                    </span>
                  </div>

                  {!isInterState ? (
                    <>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Central GST (CGST):</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatINR(rawCgst)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>State GST (SGST):</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {formatINR(rawSgst)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Integrated GST (IGST 100%):</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatINR(rawIgst)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Net Bill Sundries:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {formatINR(discountSundry + freightSundry + insuranceSundry + roundoffSundry)}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
                    <span>Grand Total:</span>
                    <span className="text-base text-blue-600 dark:text-blue-400">
                      {formatINR(grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Narration Box */}
          <div className="text-xs">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Voucher Narration / Remarks
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. Being goods sold against PO #4501, dispatched via SafeX Express."
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">F2</span> Save Entry
              <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold ml-2">Esc</span> Cancel
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                Post Voucher (F2)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
