"use client";

import React, { useState } from "react";
import {
  Calculator,
  Receipt,
  ShoppingCart,
  CreditCard,
  Landmark,
  ArrowRightLeft,
  FileText,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  ShieldCheck,
  Building2,
  Percent,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Keyboard,
  Boxes,
  Layers,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Trash2,
  Warehouse,
  Calendar,
  Clock,
  Zap,
  Tag,
  AlertTriangle,
  ChevronRight,
  Eye,
  Check,
  X,
} from "lucide-react";
import {
  BusyVoucher,
  BusyVoucherType,
  BusyAccountMaster,
  BusyItemMaster,
  CompanyInfo,
  MaterialCenterMaster,
  ItemBatchRecord,
  BankReconciliationRecord,
  PdcRecord,
  InterestCalculationItem,
} from "@/types/erp";
import { formatINR } from "@/lib/utils";
import {
  initialMaterialCenters,
  initialItemBatches,
  initialBankReconciliations,
  initialPdcEntries,
  initialOverdueInterestItems,
} from "@/data/mockData";

interface BusyAccountingHubProps {
  company: CompanyInfo;
  vouchers: BusyVoucher[];
  accounts: BusyAccountMaster[];
  items: BusyItemMaster[];
  onOpenNewVoucher: (type: BusyVoucherType) => void;
  onOpenLedger: (accountId?: string) => void;
  onOpenItemLedger: (itemId?: string) => void;
  onOpenHelp: () => void;
  onDeleteVoucher: (id: string) => void;
  onResetToBusyDefaults: () => void;
  onBackupData: () => void;
}

export function BusyAccountingHub({
  company,
  vouchers,
  accounts,
  items,
  onOpenNewVoucher,
  onOpenLedger,
  onOpenItemLedger,
  onOpenHelp,
  onDeleteVoucher,
  onResetToBusyDefaults,
  onBackupData,
}: BusyAccountingHubProps) {
  const [activeTab, setActiveTab] = useState<
    | "vouchers"
    | "accounts"
    | "items"
    | "godowns"
    | "batches"
    | "outstanding"
    | "brs"
    | "pdc"
    | "daybook"
    | "reports"
    | "sundries"
  >("vouchers");

  const [voucherFilter, setVoucherFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [accountGroupFilter, setAccountGroupFilter] = useState<string>("all");
  const [itemGroupFilter, setItemGroupFilter] = useState<string>("all");
  const [outstandingType, setOutstandingType] = useState<"debtors" | "creditors">("debtors");

  // Advanced States
  const [materialCenters, setMaterialCenters] = useState<MaterialCenterMaster[]>(initialMaterialCenters);
  const [batches, setBatches] = useState<ItemBatchRecord[]>(initialItemBatches);
  const [brsRecords, setBrsRecords] = useState<BankReconciliationRecord[]>(initialBankReconciliations);
  const [selectedBrsBank, setSelectedBrsBank] = useState("HDFC Bank Current Account");
  const [pdcList, setPdcList] = useState<PdcRecord[]>(initialPdcEntries);
  const [interestItems, setInterestItems] = useState<InterestCalculationItem[]>(initialOverdueInterestItems);
  const [dayBookDate, setDayBookDate] = useState("2026-11-08");

  // Print Preview Modal State
  const [selectedVoucherForPrint, setSelectedVoucherForPrint] = useState<BusyVoucher | null>(null);

  // New Account Master Quick Modal State
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [newAccName, setNewAccName] = useState("");
  const [newAccGroup, setNewAccGroup] = useState<BusyAccountMaster["group"]>("Sundry Debtors");
  const [newAccState, setNewAccState] = useState(company.state);
  const [newAccGstin, setNewAccGstin] = useState("");
  const [newAccBalance, setNewAccBalance] = useState<number>(0);
  const [newAccBalType, setNewAccBalType] = useState<"Dr" | "Cr">("Dr");

  // New Item Master Quick Modal State
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemGroup, setNewItemGroup] = useState("Electronics");
  const [newItemHsn, setNewItemHsn] = useState("85285200");
  const [newItemUom, setNewItemUom] = useState("Pcs");
  const [newItemTax, setNewItemTax] = useState<BusyItemMaster["taxCategory"]>("GST 18%");
  const [newItemCost, setNewItemCost] = useState<number>(1000);
  const [newItemPrice, setNewItemPrice] = useState<number>(1500);
  const [newItemQty, setNewItemQty] = useState<number>(10);

  // Filter vouchers
  const filteredVouchers = vouchers.filter((v) => {
    const matchesType = voucherFilter === "all" || v.voucherType === voucherFilter;
    const matchesSearch =
      v.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.materialCenter && v.materialCenter.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (v.narration && v.narration.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // KPI calculations
  const totalSalesAmount = vouchers
    .filter((v) => v.voucherType === "sales")
    .reduce((acc, v) => acc + v.totalAmount, 0);

  const totalPurchaseAmount = vouchers
    .filter((v) => v.voucherType === "purchase")
    .reduce((acc, v) => acc + v.totalAmount, 0);

  const totalCashBank = accounts
    .filter((a) => a.group === "Bank Accounts" || a.group === "Cash-in-hand")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalDebtors = accounts
    .filter((a) => a.group === "Sundry Debtors")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalCreditors = accounts
    .filter((a) => a.group === "Sundry Creditors")
    .reduce((acc, a) => acc + a.currentBalance, 0);

  const totalStockValuation = items.reduce(
    (acc, i) => acc + i.currentQty * i.purchaseRate,
    0
  );

  // Bank Reconciliation Formula:
  // Book Balance + Cheques issued not presented - Cheques deposited not cleared = Passbook Balance
  const bankAccountLedger = accounts.find((a) => a.name === selectedBrsBank);
  const bookBalance = bankAccountLedger ? bankAccountLedger.currentBalance : 1485000;
  const unclearedChequesIssued = brsRecords
    .filter((b) => b.bankAccount === selectedBrsBank && !b.isCleared && b.creditAmount > 0)
    .reduce((sum, b) => sum + b.creditAmount, 0);
  const unclearedChequesDeposited = brsRecords
    .filter((b) => b.bankAccount === selectedBrsBank && !b.isCleared && b.debitAmount > 0)
    .reduce((sum, b) => sum + b.debitAmount, 0);
  const adjustedBankPassbookBalance = bookBalance + unclearedChequesIssued - unclearedChequesDeposited;

  // Day book vouchers
  const dayBookVouchers = vouchers.filter((v) => v.date === dayBookDate);
  const dayBookTotalDebit = dayBookVouchers.reduce((acc, v) => acc + v.totalAmount, 0);

  // Handler to clear a cheque in BRS
  const handleClearCheque = (id: string) => {
    const today = new Date().toISOString().substring(0, 10);
    setBrsRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isCleared: true, clearanceDate: today } : r
      )
    );
  };

  // Handler to mark PDC cleared
  const handleClearPDC = (id: string) => {
    setPdcList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Cleared" } : p))
    );
  };

  // Handler to create new master on the fly
  const handleCreateAccountMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    const newMaster: BusyAccountMaster = {
      id: `ACC-CUSTOM-${Date.now()}`,
      name: newAccName.trim(),
      printName: newAccName.trim(),
      group: newAccGroup,
      state: newAccState,
      stateCode: newAccState === company.state ? company.stateCode : "29",
      gstin: newAccGstin.trim() || undefined,
      openingBalance: newAccBalance,
      balanceType: newAccBalType,
      currentBalance: newAccBalance,
      billByBill: newAccGroup === "Sundry Debtors" || newAccGroup === "Sundry Creditors",
    };
    accounts.unshift(newMaster);
    setIsAddAccountModalOpen(false);
    setNewAccName("");
    setNewAccBalance(0);
    alert(`Account Master "${newMaster.name}" created successfully!`);
  };

  const handleCreateItemMaster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const rateMap: Record<string, number> = {
      "Exempt": 0,
      "GST 5%": 5,
      "GST 12%": 12,
      "GST 18%": 18,
      "GST 28%": 28,
    };
    const newMaster: BusyItemMaster = {
      id: `ITEM-CUSTOM-${Date.now()}`,
      name: newItemName.trim(),
      printName: newItemName.trim(),
      group: newItemGroup,
      uom: newItemUom,
      taxCategory: newItemTax,
      gstRate: rateMap[newItemTax] || 18,
      hsnCode: newItemHsn.trim() || "85285200",
      openingQty: newItemQty,
      purchaseRate: newItemCost,
      sellingPrice: newItemPrice,
      currentQty: newItemQty,
      reorderLevel: 5,
      valuationMethod: "FIFO",
    };
    items.unshift(newMaster);
    setIsAddItemModalOpen(false);
    setNewItemName("");
    alert(`Item Master "${newMaster.name}" created successfully!`);
  };

  const handlePostInterestDebitNote = (item: InterestCalculationItem) => {
    onOpenNewVoucher("debit_note");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Zap className="h-5 w-5 text-amber-300" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Enterprise Accounting & Statutory Operations
            </h2>
            <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-xs font-bold border border-blue-300 dark:border-blue-700">
              Indian MSME Master Suite
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
            Integrated accounting engine: F1-F9 daily voucher entry, multi-godown stock, batch/expiry control, bank reconciliation (BRS), overdue interest, and Alt+L running ledger books.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <HelpCircle className="h-4 w-4 text-blue-600" />
            Course Guide (F1)
          </button>
          <button
            onClick={onBackupData}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 px-3 py-2 text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            Backup Data (JSON)
          </button>
          <button
            onClick={onResetToBusyDefaults}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-bold shadow-md transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Auto-Setup Masters
          </button>
        </div>
      </div>

      {/* QUICK KEYBOARD SHORTCUT LAUNCHER BAR (F4-F9, Alt+L, Alt+I, Alt+T) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Keyboard className="h-4 w-4 text-blue-600" />
            <span>Quick Launch Keyboard Shortcuts:</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Click any button or press physical keyboard keys directly from anywhere
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
          <button
            onClick={() => onOpenNewVoucher("sales")}
            className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold transition-all"
          >
            <span>Sales</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-emerald-300">F8</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("purchase")}
            className="flex items-center justify-between p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-bold transition-all"
          >
            <span>Purchase</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-blue-300">F9</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("payment")}
            className="flex items-center justify-between p-2 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold transition-all"
          >
            <span>Payment</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-purple-300">F5</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("receipt")}
            className="flex items-center justify-between p-2 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-bold transition-all"
          >
            <span>Receipt</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-amber-300">F6</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("contra")}
            className="flex items-center justify-between p-2 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/30 dark:hover:bg-cyan-900/40 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 font-bold transition-all"
          >
            <span>Contra</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-cyan-300">F4</kbd>
          </button>

          <button
            onClick={() => onOpenNewVoucher("journal")}
            className="flex items-center justify-between p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold transition-all"
          >
            <span>Journal</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-indigo-300">F7</kbd>
          </button>

          <button
            onClick={() => onOpenLedger()}
            className="flex items-center justify-between p-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-bold transition-all"
          >
            <span>Ledger</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-rose-300">Alt+L</kbd>
          </button>

          <button
            onClick={() => onOpenItemLedger()}
            className="flex items-center justify-between p-2 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold transition-all"
          >
            <span>Stock Bahi</span>
            <kbd className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] shadow-sm font-mono border border-teal-300">Alt+I</kbd>
          </button>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Total Vouchers</span>
          <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
            {vouchers.length}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Posted & Audited</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Sales Turnover (F8)</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">
            {formatINR(totalSalesAmount)}
          </span>
          <span className="text-[10px] text-slate-400">GST Outward Invoices</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Purchases (F9)</span>
          <span className="text-xl font-black text-blue-600 mt-1 block">
            {formatINR(totalPurchaseAmount)}
          </span>
          <span className="text-[10px] text-slate-400">ITC Claimable</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Cash & Bank Bal</span>
          <span className="text-xl font-black text-purple-600 mt-1 block">
            {formatINR(totalCashBank)}
          </span>
          <span className="text-[10px] text-slate-400">Liquid Treasury</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Bills Receivable</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">
            {formatINR(totalDebtors)}
          </span>
          <span className="text-[10px] text-slate-400">Sundry Debtors</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <span className="text-slate-500 block text-[11px] font-medium">Stock Valuation</span>
          <span className="text-xl font-black text-teal-600 mt-1 block">
            {formatINR(totalStockValuation)}
          </span>
          <span className="text-[10px] text-slate-400">FIFO Method</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-1 text-xs font-bold">
        {[
          { id: "vouchers", label: "Transactions Register", count: vouchers.length },
          { id: "accounts", label: "Account Masters", count: accounts.length },
          { id: "items", label: "Item Masters & Stock", count: items.length },
          { id: "godowns", label: "Material Centers (Godowns)", count: materialCenters.length },
          { id: "batches", label: "Batch & Expiry", count: batches.length },
          { id: "outstanding", label: "Outstanding & Interest" },
          { id: "brs", label: "Bank Reconciliation (BRS)" },
          { id: "pdc", label: "PDC Register", count: pdcList.length },
          { id: "daybook", label: "Day Book / Cash Book" },
          { id: "reports", label: "Display Menu (P&L, Balance Sheet)" },
          { id: "sundries", label: "GST & Bill Sundries" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 pt-2 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: VOUCHERS REGISTER */}
      {activeTab === "vouchers" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search Voucher #, Party, Godown, or Narration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                {[
                  { id: "all", label: "All" },
                  { id: "sales", label: "Sales (F8)" },
                  { id: "purchase", label: "Purchase (F9)" },
                  { id: "payment", label: "Payment (F5)" },
                  { id: "receipt", label: "Receipt (F6)" },
                  { id: "contra", label: "Contra (F4)" },
                  { id: "journal", label: "Journal (F7)" },
                  { id: "debit_note", label: "Debit Note" },
                  { id: "credit_note", label: "Credit Note" },
                  { id: "stock_transfer", label: "Stock Transfer" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setVoucherFilter(f.id)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                      voucherFilter === f.id
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm font-bold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vouchers Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-28">Date</th>
                  <th className="p-3 w-36">Voucher #</th>
                  <th className="p-3 w-28">Type</th>
                  <th className="p-3">Party / Account</th>
                  <th className="p-3 w-32">Godown</th>
                  <th className="p-3 w-28 text-right">Taxable</th>
                  <th className="p-3 w-28 text-right">Tax (GST)</th>
                  <th className="p-3 w-32 text-right">Total Amount</th>
                  <th className="p-3 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{v.date}</td>
                    <td className="p-3">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {v.voucherNo}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          v.voucherType === "sales"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                            : v.voucherType === "purchase"
                            ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                            : v.voucherType === "payment"
                            ? "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400"
                            : v.voucherType === "receipt"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400"
                            : v.voucherType === "contra"
                            ? "bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400"
                            : v.voucherType === "journal"
                            ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400"
                            : v.voucherType === "stock_transfer"
                            ? "bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400"
                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400"
                        }`}
                      >
                        {v.voucherType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{v.partyName}</div>
                      {v.narration && (
                        <div className="text-[11px] text-slate-500 line-clamp-1">{v.narration}</div>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {v.materialCenter || "Main Central"}
                    </td>
                    <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                      {formatINR(v.taxableAmount)}
                    </td>
                    <td className="p-3 text-right text-slate-600 dark:text-slate-400">
                      {formatINR(v.cgstAmount + v.sgstAmount + v.igstAmount)}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {formatINR(v.totalAmount)}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedVoucherForPrint(v)}
                          title="Print / View Invoice Slip (Alt+P)"
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteVoucher(v.id)}
                          title="Cancel / Reversal Entry"
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ACCOUNT MASTERS */}
      {activeTab === "accounts" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Filter Group:</span>
              <select
                value={accountGroupFilter}
                onChange={(e) => setAccountGroupFilter(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Groups ({accounts.length} Master Accounts)</option>
                <option value="Sundry Debtors">Sundry Debtors (Customers)</option>
                <option value="Sundry Creditors">Sundry Creditors (Suppliers)</option>
                <option value="Bank Accounts">Bank Accounts</option>
                <option value="Cash-in-hand">Cash-in-Hand</option>
                <option value="Direct Expenses">Direct Expenses</option>
                <option value="Indirect Expenses">Indirect Expenses</option>
                <option value="Duties & Taxes">Duties & Taxes (GST)</option>
                <option value="Capital Account">Capital Account</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddAccountModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Account Master (F3)
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Account Master Name</th>
                  <th className="p-3 w-40">Group / Category</th>
                  <th className="p-3 w-32">State</th>
                  <th className="p-3 w-36">GSTIN</th>
                  <th className="p-3 w-32 text-right">Opening Balance</th>
                  <th className="p-3 w-36 text-right">Current Balance</th>
                  <th className="p-3 w-28 text-center">Bill-by-Bill</th>
                  <th className="p-3 w-24 text-center">Ledger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {accounts
                  .filter((a) => accountGroupFilter === "all" || a.group === accountGroupFilter)
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{a.name}</div>
                        <div className="text-[11px] text-slate-500">{a.printName}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {a.group}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{a.state}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                        {a.gstin || "-"}
                      </td>
                      <td className="p-3 text-right font-medium">
                        {formatINR(a.openingBalance)} {a.balanceType}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatINR(a.currentBalance)} {a.balanceType}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            a.billByBill
                              ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {a.billByBill ? "Yes (Ref)" : "No"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onOpenLedger(a.id)}
                          className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-bold text-[11px]"
                        >
                          Alt+L
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ITEM MASTERS */}
      {activeTab === "items" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white">Filter Group:</span>
              <select
                value={itemGroupFilter}
                onChange={(e) => setItemGroupFilter(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-slate-900 dark:text-white font-medium"
              >
                <option value="all">All Groups ({items.length} Items)</option>
                <option value="Electronics">Electronics</option>
                <option value="Networking">Networking</option>
                <option value="Industrial Hardware">Industrial Hardware</option>
                <option value="Raw Materials">Raw Materials</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddItemModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Item Master (F3)
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Item Name & Description</th>
                  <th className="p-3 w-32">Group</th>
                  <th className="p-3 w-28">HSN/SAC</th>
                  <th className="p-3 w-20">UOM</th>
                  <th className="p-3 w-24">Tax Slab</th>
                  <th className="p-3 w-28 text-right">Cost Rate (₹)</th>
                  <th className="p-3 w-28 text-right">Sale Price (₹)</th>
                  <th className="p-3 w-28 text-right">Current Stock</th>
                  <th className="p-3 w-32 text-right">Valuation (₹)</th>
                  <th className="p-3 w-24 text-center">Card</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {items
                  .filter((i) => itemGroupFilter === "all" || i.group === itemGroupFilter)
                  .map((i) => (
                    <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 dark:text-white">{i.name}</div>
                        <div className="text-[11px] text-slate-500">{i.printName}</div>
                      </td>
                      <td className="p-3 font-semibold text-purple-600">{i.group}</td>
                      <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{i.hsnCode}</td>
                      <td className="p-3 font-medium">{i.uom}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                          {i.taxCategory}
                        </span>
                      </td>
                      <td className="p-3 text-right font-medium">{formatINR(i.purchaseRate)}</td>
                      <td className="p-3 text-right font-semibold text-slate-900 dark:text-white">
                        {formatINR(i.sellingPrice)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                        {i.currentQty} {i.uom}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600">
                        {formatINR(i.currentQty * i.purchaseRate)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onOpenItemLedger(i.id)}
                          className="px-2.5 py-1 rounded bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 hover:bg-purple-100 font-bold text-[11px]"
                        >
                          Alt+I
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: MATERIAL CENTERS (MULTI-GODOWN MANAGEMENT) */}
      {activeTab === "godowns" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-blue-600" />
                Material Centers (Multi-Godown / Warehouse Locations)
              </h3>
              <p className="text-xs text-slate-500">
                Manage physical inventory across factories, central warehouses, retail showrooms, and consignment depots.
              </p>
            </div>
            <button
              onClick={() => onOpenNewVoucher("stock_transfer")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer Stock (Alt+T)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {materialCenters.map((mc) => (
              <div
                key={mc.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 relative overflow-hidden"
              >
                {mc.isDefault && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                    Primary Depot
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-black text-sm">
                    {mc.code.substring(0, 3)}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                      {mc.name}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-400">Code: {mc.code}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2">{mc.address}</p>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Manager:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{mc.managerName || "Operations Lead"}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <span>Section 143 Job Work & Consignment Depot transfers maintain statutory zero-tax e-Way Bills.</span>
            </div>
            <span className="font-bold">Inter-Godown Transfer Ready</span>
          </div>
        </div>
      )}

      {/* TAB 5: BATCH & EXPIRY MANAGEMENT */}
      {activeTab === "batches" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="h-5 w-5 text-indigo-600" />
                Batch-Wise Inventory & Expiry Tracking Register
              </h3>
              <p className="text-xs text-slate-500">
                Track pharmaceutical, electronics, and perishable goods with manufacturing dates, expiry dates, and MRP.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-32">Batch #</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3 w-28">Mfg Date</th>
                  <th className="p-3 w-28">Expiry Date</th>
                  <th className="p-3 w-28 text-right">MRP (₹)</th>
                  <th className="p-3 w-28 text-right">Cost (₹)</th>
                  <th className="p-3 w-24 text-right">In Stock</th>
                  <th className="p-3 w-40">Godown / Location</th>
                  <th className="p-3 w-28 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {batches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {b.batchNo}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{b.itemName}</td>
                    <td className="p-3 text-slate-500 font-mono">{b.mfgDate}</td>
                    <td className="p-3 text-slate-500 font-mono">{b.expDate}</td>
                    <td className="p-3 text-right font-medium">{formatINR(b.mrp)}</td>
                    <td className="p-3 text-right font-medium">{formatINR(b.purchaseRate)}</td>
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                      {b.currentQty} {b.uom}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{b.materialCenter}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === "Active"
                            ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700"
                            : b.status === "Expiring Soon"
                            ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700"
                            : "bg-rose-100 dark:bg-rose-950/50 text-rose-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: BILL-BY-BILL OUTSTANDING & INTEREST CALCULATION */}
      {activeTab === "outstanding" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Bill-by-Bill Outstanding & Overdue Interest Calculation
              </h3>
              <p className="text-xs text-slate-500">
                Aging analysis of trade receivables with automated 18% p.a. statutory interest computation on delayed bills.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOutstandingType("debtors")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  outstandingType === "debtors"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900"
                }`}
              >
                Bills Receivable (Debtors)
              </button>
              <button
                onClick={() => setOutstandingType("creditors")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  outstandingType === "creditors"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-slate-900"
                }`}
              >
                Bills Payable (Creditors)
              </button>
            </div>
          </div>

          {/* Aging Summary Brackets */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
              <span className="text-emerald-700 dark:text-emerald-300 font-medium">0 - 30 Days (Current)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">₹4,25,000</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Standard Credit Terms</span>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
              <span className="text-blue-700 dark:text-blue-300 font-medium">31 - 60 Days (Due)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">₹2,14,800</span>
              <span className="text-[10px] text-blue-600 font-semibold">Follow-up Dispatched</span>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <span className="text-amber-700 dark:text-amber-300 font-medium">61 - 90 Days (Overdue)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">₹4,85,000</span>
              <span className="text-[10px] text-amber-600 font-semibold">Interest Accruing (18%)</span>
            </div>
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20">
              <span className="text-rose-700 dark:text-rose-300 font-medium">&gt; 90 Days (Critical)</span>
              <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">₹1,20,000</span>
              <span className="text-[10px] text-rose-600 font-semibold">MSME Samadhaan Alert</span>
            </div>
          </div>

          {/* Overdue Interest Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Overdue Invoices & Accrued Interest @ 18% p.a.</span>
              <span className="text-rose-600">Total Accrued Interest: {formatINR(interestItems.reduce((acc, i) => acc + i.accruedInterest, 0))}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3">Party Name</th>
                  <th className="p-3 w-32">Bill #</th>
                  <th className="p-3 w-28">Bill Date</th>
                  <th className="p-3 w-28">Due Date</th>
                  <th className="p-3 w-24 text-center">Overdue Days</th>
                  <th className="p-3 w-32 text-right">Bill Principal</th>
                  <th className="p-3 w-24 text-right">Rate</th>
                  <th className="p-3 w-32 text-right">Accrued Interest</th>
                  <th className="p-3 w-28 text-center">Post Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {interestItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{item.partyName}</td>
                    <td className="p-3 font-mono font-bold text-blue-600">{item.billNo}</td>
                    <td className="p-3 font-mono text-slate-500">{item.billDate}</td>
                    <td className="p-3 font-mono text-slate-500">{item.dueDate}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-rose-700 font-bold">
                        {item.overdueDays} days
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{formatINR(item.billAmount)}</td>
                    <td className="p-3 text-right text-slate-500">{item.interestRate}% p.a.</td>
                    <td className="p-3 text-right font-bold text-rose-600">{formatINR(item.accruedInterest)}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handlePostInterestDebitNote(item)}
                        className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-300"
                      >
                        Debit Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: BANK RECONCILIATION STATEMENT (BRS) */}
      {activeTab === "brs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="h-5 w-5 text-blue-600" />
                Bank Reconciliation Statement (BRS)
              </h3>
              <p className="text-xs text-slate-500">
                Reconcile company book ledger balance with true bank passbook statement through cheque clearance tracking.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Bank Account:</label>
              <select
                value={selectedBrsBank}
                onChange={(e) => setSelectedBrsBank(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
              >
                <option value="HDFC Bank Current Account">HDFC Bank Current Account</option>
                <option value="SBI Current Account">SBI Current Account</option>
              </select>
            </div>
          </div>

          {/* BRS Calculation Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-lg text-xs">
            <div>
              <span className="text-slate-400 block">Balance as per Books</span>
              <span className="text-xl font-black block mt-1">{formatINR(bookBalance)}</span>
              <span className="text-[10px] text-blue-300">Company General Ledger</span>
            </div>
            <div>
              <span className="text-slate-400 block">(+) Cheques Issued not Presented</span>
              <span className="text-xl font-black text-emerald-400 block mt-1">+{formatINR(unclearedChequesIssued)}</span>
              <span className="text-[10px] text-slate-300">Uncleared Vendor Cheques</span>
            </div>
            <div>
              <span className="text-slate-400 block">(-) Cheques Deposited not Cleared</span>
              <span className="text-xl font-black text-rose-400 block mt-1">-{formatINR(unclearedChequesDeposited)}</span>
              <span className="text-[10px] text-slate-300">Transit Customer Receipts</span>
            </div>
            <div className="border-l border-slate-700 pl-4">
              <span className="text-amber-300 font-bold block">Adjusted Bank Passbook Balance</span>
              <span className="text-2xl font-black text-white block mt-1">{formatINR(adjustedBankPassbookBalance)}</span>
              <span className="text-[10px] text-emerald-400 font-bold">100% Reconciled Balance</span>
            </div>
          </div>

          {/* Cheque Clearance Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-28">Voucher #</th>
                  <th className="p-3 w-28">Issue Date</th>
                  <th className="p-3">Party / Particulars</th>
                  <th className="p-3 w-36">Cheque / UTR #</th>
                  <th className="p-3 w-28 text-right">Debit (Receipt)</th>
                  <th className="p-3 w-28 text-right">Credit (Payment)</th>
                  <th className="p-3 w-28">Bank Clear Date</th>
                  <th className="p-3 w-28 text-center">Status</th>
                  <th className="p-3 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {brsRecords
                  .filter((b) => b.bankAccount === selectedBrsBank)
                  .map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-bold">{rec.voucherNo}</td>
                      <td className="p-3 font-mono text-slate-500">{rec.date}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white">{rec.partyName}</td>
                      <td className="p-3 font-mono text-blue-600">{rec.chequeNo}</td>
                      <td className="p-3 text-right font-medium text-emerald-600">
                        {rec.debitAmount > 0 ? formatINR(rec.debitAmount) : "-"}
                      </td>
                      <td className="p-3 text-right font-medium text-slate-700 dark:text-slate-300">
                        {rec.creditAmount > 0 ? formatINR(rec.creditAmount) : "-"}
                      </td>
                      <td className="p-3 font-mono text-slate-500">{rec.clearanceDate || "Pending"}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.isCleared
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {rec.isCleared ? "Cleared" : "Uncleared"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {!rec.isCleared ? (
                          <button
                            onClick={() => handleClearCheque(rec.id)}
                            className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-sm"
                          >
                            Mark Cleared
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Matched</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 8: POST-DATED CHEQUES (PDC) REGISTER */}
      {activeTab === "pdc" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Post-Dated Cheques (PDC) Register
              </h3>
              <p className="text-xs text-slate-500">
                Track future maturing instruments issued to suppliers or received from customers.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-32">PDC Voucher #</th>
                  <th className="p-3 w-28">Type</th>
                  <th className="p-3">Party Name</th>
                  <th className="p-3 w-32">Cheque #</th>
                  <th className="p-3 w-36">Bank Name</th>
                  <th className="p-3 w-28">Maturity Date</th>
                  <th className="p-3 w-32 text-right">Amount (₹)</th>
                  <th className="p-3 w-28 text-center">Status</th>
                  <th className="p-3 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {pdcList.map((pdc) => (
                  <tr key={pdc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{pdc.voucherNo}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pdc.type === "Received" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {pdc.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{pdc.partyName}</td>
                    <td className="p-3 font-mono text-purple-600">{pdc.chequeNo}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{pdc.bankName}</td>
                    <td className="p-3 font-mono font-semibold">{pdc.chequeDate}</td>
                    <td className="p-3 text-right font-black text-slate-900 dark:text-white">{formatINR(pdc.amount)}</td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                        {pdc.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {pdc.status === "Pending" ? (
                        <button
                          onClick={() => handleClearPDC(pdc.id)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-sm"
                        >
                          Deposit & Clear
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Deposited</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: DAY BOOK & CASH/BANK BOOK */}
      {activeTab === "daybook" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-600" />
                Statutory Day Book & Daily Cash Register
              </h3>
              <p className="text-xs text-slate-500">
                Chronological listing of all financial transactions recorded on a specific date.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Date:</label>
              <input
                type="date"
                value={dayBookDate}
                onChange={(e) => setDayBookDate(e.target.value)}
                className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Day Book Entries for Date: {dayBookDate}</span>
              <span className="text-emerald-600">Total Day Activity: {formatINR(dayBookTotalDebit)}</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="p-3 w-32">Voucher #</th>
                  <th className="p-3 w-28">Type</th>
                  <th className="p-3">Party / Ledger Particulars</th>
                  <th className="p-3 w-32">Godown</th>
                  <th className="p-3 w-32 text-right">Debit (₹)</th>
                  <th className="p-3 w-32 text-right">Credit (₹)</th>
                  <th className="p-3 w-20 text-center">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dayBookVouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{v.voucherNo}</td>
                    <td className="p-3 uppercase font-bold text-blue-600">{v.voucherType}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{v.partyName}</div>
                      <div className="text-[11px] text-slate-500">{v.narration}</div>
                    </td>
                    <td className="p-3 text-slate-500">{v.materialCenter || "Main Central"}</td>
                    <td className="p-3 text-right font-medium">
                      {["payment", "purchase", "debit_note"].includes(v.voucherType) ? formatINR(v.totalAmount) : "-"}
                    </td>
                    <td className="p-3 text-right font-medium">
                      {["sales", "receipt", "credit_note"].includes(v.voucherType) ? formatINR(v.totalAmount) : "-"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedVoucherForPrint(v)}
                        className="p-1 rounded text-slate-400 hover:text-blue-600"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {dayBookVouchers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400 italic">
                      No voucher transactions recorded on {dayBookDate}. Select another date or record new entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 10: REPORTS & DISPLAY MENU */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trial Balance Card */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                Trial Balance (Arithmetic Check)
              </div>
              <p className="text-xs text-slate-500">
                Verifies arithmetic accuracy: Total Debits must exactly equal Total Credits.
              </p>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>Total Debit: {formatINR(totalSalesAmount + totalCashBank)}</span>
                <span>Total Credit: {formatINR(totalSalesAmount + totalCashBank)}</span>
              </div>
            </div>

            {/* Account Ledger Book (Alt+L) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Account Ledger Book (Alt+L)
              </div>
              <p className="text-xs text-slate-500">
                The primary statement report. Complete debit/credit statements with running balances.
              </p>
              <button
                onClick={() => onOpenLedger()}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
              >
                Open Ledger Book (Alt+L)
              </button>
            </div>

            {/* Stock Movement Ledger (Alt+I) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Boxes className="h-4 w-4 text-purple-600" />
                Stock Summary Ledger (Alt+I)
              </div>
              <p className="text-xs text-slate-500">
                Real-time inventory levels, inward GRN, outward dispatches, and FIFO valuation.
              </p>
              <button
                onClick={() => onOpenItemLedger()}
                className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
              >
                Open Stock Summary (Alt+I)
              </button>
            </div>
          </div>

          {/* Schedule III Financial Statements Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profit & Loss Statement */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Trading & Profit & Loss Account
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">FY 2026-27</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Revenue from Operations (Gross Sales):</span>
                  <span className="font-bold text-emerald-600">{formatINR(totalSalesAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Cost of Goods Sold (Purchases):</span>
                  <span className="font-bold text-rose-600">-{formatINR(totalPurchaseAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-1 font-bold">
                  <span>Gross Profit:</span>
                  <span className="text-emerald-600">{formatINR(Math.max(0, totalSalesAmount - totalPurchaseAmount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Administrative & General Overheads:</span>
                  <span className="text-slate-700">₹65,000</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-black text-sm text-slate-900 dark:text-white">
                  <span>Net Profit Before Tax:</span>
                  <span className="text-blue-600">{formatINR(Math.max(0, totalSalesAmount - totalPurchaseAmount - 65000))}</span>
                </div>
              </div>
            </div>

            {/* Balance Sheet Statement */}
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Schedule III Balance Sheet
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">As at Nov 2026</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Share Capital & Net Reserves:</span>
                  <span className="font-bold">₹25,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sundry Creditors (Trade Payables):</span>
                  <span className="font-bold">{formatINR(totalCreditors)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sundry Debtors (Trade Receivables):</span>
                  <span className="font-bold text-emerald-600">{formatINR(totalDebtors)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Closing Stock / Inventories:</span>
                  <span className="font-bold text-teal-600">{formatINR(totalStockValuation)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-black text-sm text-slate-900 dark:text-white">
                  <span>Cash & Bank Balances:</span>
                  <span className="text-purple-600">{formatINR(totalCashBank)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 11: BILL SUNDRIES & GST ARCHITECTURE */}
      {activeTab === "sundries" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                GST State Bifurcation Architecture (Indian Statutory Standard)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                In this enterprise accounting system, supply categorization is 100% automated by evaluating the registered state of your business (<strong>{company.state} - Code {company.stateCode}</strong>) against the recipient party&apos;s state.
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                    1. Intra-State Supply (Local CGST 50% + SGST 50%)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    When supplier state matches customer state (e.g., Maharashtra to Maharashtra). Tax is split equally: 18% GST becomes 9% CGST + 9% SGST.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="font-bold text-blue-700 dark:text-blue-400 mb-1">
                    2. Inter-State Supply (Integrated IGST 100%)
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    When goods move across state boundaries (e.g., Maharashtra to Karnataka, Gujarat, Delhi). A single 18% IGST is charged under Section 7 of the IGST Act.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                <Percent className="h-5 w-5 text-blue-600" />
                Automated Bill Sundries Engine
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Bill Sundries allow applying commercial overheads, deductions, freight, insurance, and round-offs at the foot of vouchers without manual spreadsheet calculation.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Trade Discount (-)</span>
                  <span className="text-rose-600 font-bold">Deductive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Freight & Cartage (+)</span>
                  <span className="text-blue-600 font-bold">Additive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Packaging & Forwarding (+)</span>
                  <span className="text-indigo-600 font-bold">Additive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Transit Insurance (+)</span>
                  <span className="text-blue-600 font-bold">Additive Sundry</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">TDS Deduction (u/s 194C / 194J / 194Q)</span>
                  <span className="text-amber-600 font-bold">Statutory Tax Withholding</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Round-Off Paisa (+/-)</span>
                  <span className="text-purple-600 font-bold">Auto Math Rounding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK MODAL 1: ADD ACCOUNT MASTER */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Add New Account Master Ledger (F3)
              </h3>
              <button
                onClick={() => setIsAddAccountModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAccountMaster} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Account Master Name *</label>
                <input
                  type="text"
                  required
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. Bharat Electronics Ltd"
                  className="w-full rounded-lg border p-2 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Group *</label>
                  <select
                    value={newAccGroup}
                    onChange={(e) => setNewAccGroup(e.target.value as any)}
                    className="w-full rounded-lg border p-2 bg-transparent font-medium"
                  >
                    <option value="Sundry Debtors">Sundry Debtors (Customer)</option>
                    <option value="Sundry Creditors">Sundry Creditors (Supplier)</option>
                    <option value="Bank Accounts">Bank Accounts</option>
                    <option value="Cash-in-hand">Cash-in-Hand</option>
                    <option value="Direct Expenses">Direct Expenses</option>
                    <option value="Indirect Expenses">Indirect Expenses</option>
                    <option value="Duties & Taxes">Duties & Taxes</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={newAccState}
                    onChange={(e) => setNewAccState(e.target.value)}
                    className="w-full rounded-lg border p-2 bg-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">GSTIN (15 Digits)</label>
                <input
                  type="text"
                  value={newAccGstin}
                  onChange={(e) => setNewAccGstin(e.target.value)}
                  placeholder="27AAABC1234F1Z5"
                  className="w-full rounded-lg border p-2 bg-transparent font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Opening Balance (₹)</label>
                  <input
                    type="number"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(Number(e.target.value))}
                    className="w-full rounded-lg border p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Balance Type</label>
                  <select
                    value={newAccBalType}
                    onChange={(e) => setNewAccBalType(e.target.value as any)}
                    className="w-full rounded-lg border p-2 bg-transparent font-bold"
                  >
                    <option value="Dr">Dr (Debit)</option>
                    <option value="Cr">Cr (Credit)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddAccountModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold"
                >
                  Save Master
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK MODAL 2: ADD ITEM MASTER */}
      {isAddItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />
                Add New Item Master (F3)
              </h3>
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateItemMaster} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Item Name & Description *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Optical Fiber Cleaver Tool"
                  className="w-full rounded-lg border p-2 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Group *</label>
                  <input
                    type="text"
                    required
                    value={newItemGroup}
                    onChange={(e) => setNewItemGroup(e.target.value)}
                    className="w-full rounded-lg border p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">HSN Code *</label>
                  <input
                    type="text"
                    required
                    value={newItemHsn}
                    onChange={(e) => setNewItemHsn(e.target.value)}
                    className="w-full rounded-lg border p-2 bg-transparent font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">UOM *</label>
                  <input
                    type="text"
                    required
                    value={newItemUom}
                    onChange={(e) => setNewItemUom(e.target.value)}
                    className="w-full rounded-lg border p-2 bg-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tax Slab *</label>
                  <select
                    value={newItemTax}
                    onChange={(e) => setNewItemTax(e.target.value as any)}
                    className="w-full rounded-lg border p-2 bg-transparent font-bold text-blue-600"
                  >
                    <option value="Exempt">Exempt (0%)</option>
                    <option value="GST 5%">GST 5%</option>
                    <option value="GST 12%">GST 12%</option>
                    <option value="GST 18%">GST 18%</option>
                    <option value="GST 28%">GST 28%</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cost Rate (₹)</label>
                  <input
                    type="number"
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full rounded-lg border p-2 bg-transparent"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value))}
                    className="w-full rounded-lg border p-2 bg-transparent font-bold"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-lg border text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 text-white font-bold"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK MODAL 3: PRINT VOUCHER SLIP (ALT + P) */}
      {selectedVoucherForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 space-y-6 my-8">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-black">
                  <Printer className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white uppercase tracking-tight">
                    Tax Invoice / Accounting Voucher Slip
                  </h3>
                  <span className="text-xs text-slate-500">
                    Voucher Ref: {selectedVoucherForPrint.voucherNo} • Series: {selectedVoucherForPrint.series}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVoucherForPrint(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Invoice Header Details */}
            <div className="grid grid-cols-2 gap-6 text-xs border-b pb-4">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-sm">{company.tradeName}</span>
                <span className="text-slate-600 block">{company.legalName}</span>
                <span className="text-slate-500 block font-mono">GSTIN: {company.gstin}</span>
                <span className="text-slate-500 block">State: {company.state} (Code: {company.stateCode})</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 dark:text-white block text-sm">Billed To (Party):</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{selectedVoucherForPrint.partyName}</span>
                <span className="text-slate-500 block font-mono">GSTIN: {selectedVoucherForPrint.partyGstin || "Unregistered"}</span>
                <span className="text-slate-500 block">State: {selectedVoucherForPrint.partyState}</span>
                <span className="text-slate-500 block">Date: {selectedVoucherForPrint.date}</span>
              </div>
            </div>

            {/* Items Table */}
            {selectedVoucherForPrint.items && selectedVoucherForPrint.items.length > 0 && (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2 w-20">HSN</th>
                      <th className="p-2 w-16 text-right">Qty</th>
                      <th className="p-2 w-20 text-right">Rate</th>
                      <th className="p-2 w-24 text-right">Taxable</th>
                      <th className="p-2 w-24 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedVoucherForPrint.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-medium">{it.itemName}</td>
                        <td className="p-2 font-mono text-slate-500">{it.hsnCode}</td>
                        <td className="p-2 text-right">{it.qty} {it.uom}</td>
                        <td className="p-2 text-right">{formatINR(it.rate)}</td>
                        <td className="p-2 text-right">{formatINR(it.taxableAmount)}</td>
                        <td className="p-2 text-right font-bold">{formatINR(it.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Totals & Net In Words */}
            <div className="flex justify-between items-end border-t pt-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">Authorized Signatory</span>
                <span className="text-slate-400 block text-[11px]">ApexTech ERP Solutions • MCA E-Audited</span>
              </div>
              <div className="text-right space-y-1">
                <div className="text-slate-500">Taxable Value: {formatINR(selectedVoucherForPrint.taxableAmount)}</div>
                <div className="text-slate-500">Tax Total: {formatINR(selectedVoucherForPrint.cgstAmount + selectedVoucherForPrint.sgstAmount + selectedVoucherForPrint.igstAmount)}</div>
                <div className="text-lg font-black text-blue-600">Grand Total: {formatINR(selectedVoucherForPrint.totalAmount)}</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="h-4 w-4" />
                Print Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
