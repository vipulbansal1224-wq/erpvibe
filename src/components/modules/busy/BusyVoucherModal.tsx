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
  ArrowRightLeft,
  Truck,
  Warehouse,
  Clock,
  CreditCard,
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

const defaultMaterialCenters = [
  "Main Central Warehouse (Godown A)",
  "Factory / Plant Shop Floor (Godown B)",
  "Retail Showroom & Depot (Godown C)",
  "Consignment Depot - Bengaluru",
];

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
  const [billRefType, setBillRefType] = useState<"New Ref" | "Agst Ref" | "Advance" | "On Account">("New Ref");
  const [narration, setNarration] = useState("");

  // Material Centers (Multi-Godown)
  const [materialCenter, setMaterialCenter] = useState(defaultMaterialCenters[0]);
  const [destMaterialCenter, setDestMaterialCenter] = useState(defaultMaterialCenters[1]);

  // Banking, Instrument & PDC
  const [chequeNo, setChequeNo] = useState("");
  const [chequeDate, setChequeDate] = useState(new Date().toISOString().substring(0, 10));
  const [clearanceDate, setClearanceDate] = useState("");
  const [isPDC, setIsPDC] = useState(false);

  // Items & Sundries for Trading Vouchers
  const [voucherItems, setVoucherItems] = useState<BusyVoucherItem[]>([]);
  const [sundries, setSundries] = useState<BusyBillSundry[]>([
    { id: "SND-1", type: "discount", name: "Trade Discount", rate: 0, amount: 0 },
    { id: "SND-2", type: "freight", name: "Freight & Cartage", amount: 0 },
    { id: "SND-3", type: "packaging", name: "Packaging & Forwarding", amount: 0 },
    { id: "SND-4", type: "insurance", name: "Insurance Charges", amount: 0 },
    { id: "SND-5", type: "roundoff", name: "Round-Off (+/-)", amount: 0 },
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
      setBillRefType(editVoucher.billRefType || "New Ref");
      setMaterialCenter(editVoucher.materialCenter || defaultMaterialCenters[0]);
      setDestMaterialCenter(editVoucher.destMaterialCenter || defaultMaterialCenters[1]);
      setChequeNo(editVoucher.chequeNo || "");
      setChequeDate(editVoucher.chequeDate || editVoucher.date);
      setClearanceDate(editVoucher.clearanceDate || "");
      setIsPDC(editVoucher.isPDC || false);
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
          : initialType === "credit_note"
          ? "CN"
          : "TRF";
      setVoucherNo(`${prefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
      setDate(new Date().toISOString().substring(0, 10));
      setPartyId("");
      setPartyName("");
      setPartyState(company.state);
      setPartyGstin("");
      setDebitAccount("");
      setCreditAccount("");
      setBillRef("");
      setBillRefType("New Ref");
      setMaterialCenter(defaultMaterialCenters[0]);
      setDestMaterialCenter(defaultMaterialCenters[1]);
      setChequeNo("");
      setChequeDate(new Date().toISOString().substring(0, 10));
      setClearanceDate("");
      setIsPDC(false);
      setNarration("");
      setDirectAmount(0);

      // Default sample item for trading vouchers
      if (["sales", "purchase", "debit_note", "credit_note", "stock_transfer"].includes(initialType) && items.length > 0) {
        const firstItem = items[0];
        const qty = 1;
        const rate = initialType === "purchase" ? firstItem.purchaseRate : firstItem.sellingPrice;
        const taxable = qty * rate;
        const gstRate = initialType === "stock_transfer" ? 0 : firstItem.gstRate;
        const isInter = company.state !== company.state; // default false
        const cgst = isInter || initialType === "stock_transfer" ? 0 : (taxable * (gstRate / 2)) / 100;
        const sgst = isInter || initialType === "stock_transfer" ? 0 : (taxable * (gstRate / 2)) / 100;
        const igst = isInter && initialType !== "stock_transfer" ? (taxable * gstRate) / 100 : 0;
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
            batchNo: `BT-${new Date().getFullYear()}-01`,
            mfgDate: "2026-08-01",
            expDate: "2029-07-31",
            mrp: Math.round(firstItem.sellingPrice * 1.2),
            materialCenter: defaultMaterialCenters[0],
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
      const gstRate = voucherType === "stock_transfer" ? 0 : Number(item.gstRate) || 0;
      const taxable = qty * rate;

      item.taxableAmount = taxable;
      if (voucherType === "stock_transfer") {
        item.cgst = 0;
        item.sgst = 0;
        item.igst = 0;
      } else if (isInterState) {
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
    const gstRate = voucherType === "stock_transfer" ? 0 : firstItem.gstRate || 18;
    const cgst = isInterState || voucherType === "stock_transfer" ? 0 : (taxable * (gstRate / 2)) / 100;
    const sgst = isInterState || voucherType === "stock_transfer" ? 0 : (taxable * (gstRate / 2)) / 100;
    const igst = isInterState && voucherType !== "stock_transfer" ? (taxable * gstRate) / 100 : 0;

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
        batchNo: `BT-${new Date().getFullYear()}-${prev.length + 1}`,
        mfgDate: "2026-08-01",
        expDate: "2029-07-31",
        mrp: Math.round(rate * 1.2),
        materialCenter: materialCenter,
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
  const isTradingVoucher = ["sales", "purchase", "debit_note", "credit_note", "stock_transfer"].includes(voucherType);

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
  const packagingSundry = sundries.find((s) => s.type === "packaging")?.amount || 0;
  const insuranceSundry = sundries.find((s) => s.type === "insurance")?.amount || 0;
  const tdsSundry = sundries.find((s) => s.type === "tds")?.amount || 0;
  const tcsSundry = sundries.find((s) => s.type === "tcs")?.amount || 0;
  const roundoffSundry = sundries.find((s) => s.type === "roundoff")?.amount || 0;

  const netItemsTotal = rawTaxable + rawCgst + rawSgst + rawIgst;
  const grandTotal = isTradingVoucher
    ? Math.max(0, netItemsTotal + discountSundry + freightSundry + packagingSundry + insuranceSundry + tdsSundry + tcsSundry + roundoffSundry)
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
      id: editVoucher?.id || `VOUCH-${Date.now()}`,
      voucherNo,
      voucherType,
      date,
      series,
      partyId,
      partyName: partyName || (voucherType === "contra" ? "Internal Treasury Transfer" : voucherType === "stock_transfer" ? "Inter-Godown Transfer" : "General Account"),
      partyState,
      partyGstin,
      isInterState: voucherType === "stock_transfer" ? false : isInterState,
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
      billRefType,
      materialCenter,
      destMaterialCenter: voucherType === "stock_transfer" ? destMaterialCenter : undefined,
      chequeNo: chequeNo || undefined,
      chequeDate: chequeDate || undefined,
      clearanceDate: clearanceDate || undefined,
      isPDC,
      narration:
        narration ||
        `${voucherType.toUpperCase()} Voucher entry recorded in general accounting sequence.`,
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
                : voucherType === "credit_note"
                ? "^F8"
                : "Alt+T"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
                  {voucherType.replace("_", " ")} Voucher Entry
                </h3>
                <span className="rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Statutory Accounting Standard
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
            { id: "stock_transfer", label: "Stock Transfer (Godown)", key: "Alt+T" },
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
                  voucherType === "stock_transfer"
                    ? "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    : isInterState
                    ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                    : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                {voucherType === "stock_transfer"
                  ? "Internal Movement (Zero Tax)"
                  : isInterState
                  ? "Inter-State (IGST 100%)"
                  : "Intra-State (CGST 50% + SGST 50%)"}
              </div>
            </div>
          </div>

          {/* Material Center (Godown) Location Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60 dark:bg-slate-800/20 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <Warehouse className="h-3.5 w-3.5 text-blue-600" />
                Source Material Center (Godown) *
              </label>
              <select
                value={materialCenter}
                onChange={(e) => setMaterialCenter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {defaultMaterialCenters.map((mc) => (
                  <option key={mc} value={mc}>
                    {mc}
                  </option>
                ))}
              </select>
            </div>

            {voucherType === "stock_transfer" && (
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5 text-emerald-600" />
                  Destination Material Center (Receiving Godown) *
                </label>
                <select
                  value={destMaterialCenter}
                  onChange={(e) => setDestMaterialCenter(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {defaultMaterialCenters
                    .filter((mc) => mc !== materialCenter)
                    .map((mc) => (
                      <option key={mc} value={mc}>
                        {mc}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          {/* Party Selection (For Sales, Purchase, Debit Note, Credit Note) */}
          {isTradingVoucher && voucherType !== "stock_transfer" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="md:col-span-2">
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
                  Supply State (Tax Bifurcation)
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

          {/* Payment & Receipt Accounts Grid with Bill-by-Bill Allocation */}
          {(voucherType === "payment" || voucherType === "receipt") && (
            <div className="space-y-4">
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

              {/* Bill-by-Bill Allocation Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allocation Method
                  </label>
                  <select
                    value={billRefType}
                    onChange={(e) => setBillRefType(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Agst Ref">Against Ref (Agst Ref)</option>
                    <option value="New Ref">New Reference (New Ref)</option>
                    <option value="Advance">Advance (Unadjusted)</option>
                    <option value="On Account">On Account (Lump Sum)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reference / Bill No.
                  </label>
                  <input
                    type="text"
                    value={billRef}
                    onChange={(e) => setBillRef(e.target.value)}
                    placeholder="e.g. SALE-2026-001"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cheque / UTR No.
                  </label>
                  <input
                    type="text"
                    value={chequeNo}
                    onChange={(e) => setChequeNo(e.target.value)}
                    placeholder="e.g. CHQ-882103 / UTR-991"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="isPdcCheck"
                    checked={isPDC}
                    onChange={(e) => setIsPDC(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPdcCheck" className="text-slate-700 dark:text-slate-300 font-bold cursor-pointer">
                    Post-Dated Cheque (PDC)
                  </label>
                </div>
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

          {/* Item Details Grid (For Trading Vouchers: Sales, Purchase, Notes, Stock Transfer) */}
          {isTradingVoucher && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    Item Masters, Batch & Multi-Tax Details
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (Auto-calculates item-wise GST slabs & batch tracking)
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
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="p-3 w-56">Item Name</th>
                      <th className="p-3 w-28">Batch No.</th>
                      <th className="p-3 w-24">Expiry Date</th>
                      <th className="p-3 w-20">Qty</th>
                      <th className="p-3 w-16">UOM</th>
                      <th className="p-3 w-24">Rate (₹)</th>
                      <th className="p-3 w-24">Taxable</th>
                      {voucherType !== "stock_transfer" && (
                        <>
                          <th className="p-3 w-20">GST %</th>
                          <th className="p-3 w-24">Tax (₹)</th>
                        </>
                      )}
                      <th className="p-3 w-28">Total (₹)</th>
                      <th className="p-3 w-12 text-center">Act</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {voucherItems.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, "itemName", e.target.value)}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-slate-900 dark:text-white font-medium"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.batchNo || ""}
                            onChange={(e) => handleItemChange(idx, "batchNo", e.target.value)}
                            placeholder="BT-2026-X01"
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 font-mono text-[11px]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="date"
                            value={item.expDate || ""}
                            onChange={(e) => handleItemChange(idx, "expDate", e.target.value)}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-1.5 py-1 text-[11px]"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-right font-bold"
                          />
                        </td>
                        <td className="p-2 text-slate-500 font-medium">{item.uom}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
                            className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-2 py-1 text-right font-medium"
                          />
                        </td>
                        <td className="p-2 text-right font-semibold">
                          {formatINR(item.taxableAmount)}
                        </td>
                        {voucherType !== "stock_transfer" && (
                          <>
                            <td className="p-2">
                              <select
                                value={item.gstRate}
                                onChange={(e) => handleItemChange(idx, "gstRate", e.target.value)}
                                className="w-full rounded border border-slate-300 dark:border-slate-700 bg-transparent px-1.5 py-1 font-bold text-blue-600"
                              >
                                <option value="0">0%</option>
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                                <option value="28">28%</option>
                              </select>
                            </td>
                            <td className="p-2 text-right text-slate-600 dark:text-slate-400">
                              {formatINR(item.cgst + item.sgst + item.igst)}
                            </td>
                          </>
                        )}
                        <td className="p-2 text-right font-bold text-slate-900 dark:text-white">
                          {formatINR(item.total)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {voucherItems.length === 0 && (
                      <tr>
                        <td colSpan={10} className="p-4 text-center text-slate-400 italic">
                          No items added yet. Click &apos;Add Item Line&apos; to record inventory items.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bill Sundries Foot Grid (Only for Sales, Purchase, Notes) */}
          {isTradingVoucher && voucherType !== "stock_transfer" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block mb-2">
                  Bill Sundries (Commercial Overheads & Deductions)
                </span>
                {sundries.map((sundry, idx) => (
                  <div key={sundry.id} className="flex items-center justify-between gap-3">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex-1">
                      {sundry.name}
                    </span>
                    <input
                      type="number"
                      value={sundry.amount}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setSundries((prev) => {
                          const updated = [...prev];
                          updated[idx] = { ...updated[idx], amount: val };
                          return updated;
                        });
                      }}
                      className="w-32 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-right font-mono font-semibold"
                    />
                  </div>
                ))}
              </div>

              {/* Summary Card */}
              <div className="flex flex-col justify-between space-y-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Taxable Value (Subtotal):</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatINR(rawTaxable)}
                    </span>
                  </div>

                  {!isInterState ? (
                    <>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Central GST (CGST):</span>
                        <span className="font-semibold text-emerald-600">
                          {formatINR(rawCgst)}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>State GST (SGST):</span>
                        <span className="font-semibold text-emerald-600">
                          {formatINR(rawSgst)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Integrated GST (IGST 100%):</span>
                      <span className="font-semibold text-blue-600">
                        {formatINR(rawIgst)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Sundry Net Overheads / Deductions:</span>
                    <span className="font-medium">
                      {formatINR(
                        discountSundry + freightSundry + packagingSundry + insuranceSundry + tdsSundry + tcsSundry + roundoffSundry
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Grand Total (INR):
                  </span>
                  <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                    {formatINR(grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Narration */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 text-xs mb-1">
              Narration / Transaction Remarks
            </label>
            <input
              type="text"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Inward supply cleared via Cheque #445192, verified against Purchase Order #PO-882"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Shortcut: Press <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">F2</kbd> to save immediately, <kbd className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold">Esc</kbd> to close.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Cancel (Esc)
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <Save className="h-4 w-4" />
                Save & Post Voucher (F2)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
