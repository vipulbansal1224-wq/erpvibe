"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

// Existing Modules
import { DashboardView } from "@/components/modules/dashboard/DashboardView";
import { InvoicesView } from "@/components/modules/invoicing/InvoicesView";
import { IndiaComplianceView } from "@/components/modules/gst/IndiaComplianceView";
import { InventoryView } from "@/components/modules/inventory/InventoryView";
import { CustomersView } from "@/components/modules/crm/CustomersView";
import { SuppliersView } from "@/components/modules/buying/SuppliersView";
import { PayrollView } from "@/components/modules/payroll/PayrollView";
import { ChartOfAccountsView } from "@/components/modules/accounts/ChartOfAccountsView";
import { AuditTrailView } from "@/components/modules/settings/AuditTrailView";
import { CompanySettingsView } from "@/components/modules/settings/CompanySettingsView";

// Enterprise Modules
import { ManufacturingView } from "@/components/modules/manufacturing/ManufacturingView";
import { QualityView } from "@/components/modules/quality/QualityView";
import { FleetView } from "@/components/modules/fleet/FleetView";
import { JobWorkView } from "@/components/modules/jobwork/JobWorkView";
import { SubscriptionsView } from "@/components/modules/subscriptions/SubscriptionsView";
import { ProjectsView } from "@/components/modules/projects/ProjectsView";
import { PointOfSaleView } from "@/components/modules/pos/PointOfSaleView";
import { BankingView } from "@/components/modules/banking/BankingView";
import { ExpensesView } from "@/components/modules/expenses/ExpensesView";
import { AssetsView } from "@/components/modules/assets/AssetsView";
import { HelpdeskView } from "@/components/modules/helpdesk/HelpdeskView";
import { RecruitmentView } from "@/components/modules/recruitment/RecruitmentView";
import { DocumentsVaultView } from "@/components/modules/documents/DocumentsVaultView";
import { FinancialReportsView } from "@/components/modules/reports/FinancialReportsView";
import { BusyAccountingHub } from "@/components/modules/busy/BusyAccountingHub";

// Modals
import { TaxInvoicePrintModal } from "@/components/modules/invoicing/TaxInvoicePrintModal";
import { NewInvoiceModal } from "@/components/modules/invoicing/NewInvoiceModal";
import { NewItemModal } from "@/components/modules/inventory/NewItemModal";
import { GSTINLookupModal } from "@/components/modules/gst/GSTINLookupModal";
import { EWayBillModal } from "@/components/modules/gst/EWayBillModal";
import { PayslipModal } from "@/components/modules/payroll/PayslipModal";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";
import { ModuleHelpModal } from "@/components/common/ModuleHelpModal";
import { BusyVoucherModal } from "@/components/modules/busy/BusyVoucherModal";
import { BusyLedgerModal } from "@/components/modules/busy/BusyLedgerModal";
import { BusyItemLedgerModal } from "@/components/modules/busy/BusyItemLedgerModal";
import { BusyHelpModal } from "@/components/modules/busy/BusyHelpModal";

// Data & Types
import {
  ModuleType,
  SalesInvoice,
  InventoryItem,
  EWayBill,
  SalarySlip,
  AuditLogEntry,
  CompanyInfo,
  BillOfMaterial,
  WorkOrder,
  Project,
  TimesheetEntry,
  POSTransaction,
  BankAccount,
  BankTransaction,
  FixedAsset,
  SupportTicket,
  QualityInspection,
  FleetVehicle,
  JobWorkOrder,
  SubscriptionRecord,
  ExpenseClaim,
  JobCandidate,
  VaultDocument,
  ModuleSettings,
  Customer,
  Supplier,
  Employee,
  BusyVoucher,
  BusyVoucherType,
  BusyAccountMaster,
  BusyItemMaster,
} from "@/types/erp";
import {
  defaultCompany,
  initialCustomers,
  initialSuppliers,
  initialItems,
  initialInvoices,
  initialEWayBills,
  initialEmployees,
  initialSalarySlips,
  initialAuditLogs,
  hsnSacDirectory,
  chartOfAccountsTree,
  initialBOMs,
  initialWorkOrders,
  initialProjects,
  initialTimesheets,
  initialPOSTransactions,
  initialBankAccounts,
  initialBankTransactions,
  initialFixedAssets,
  initialSupportTickets,
  initialQualityInspections,
  initialFleetVehicles,
  initialJobWorkOrders,
  initialSubscriptions,
  initialExpenseClaims,
  initialJobCandidates,
  initialVaultDocuments,
  initialBusyAccountMasters,
  initialBusyItemMasters,
  initialBusyVouchers,
} from "@/data/mockData";
import { generateMockIRN, formatINR } from "@/lib/utils";

export default function Home() {
  const [activeModule, setActiveModule] = useState<ModuleType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core App State
  const [company, setCompany] = useState<CompanyInfo>(defaultCompany);
  const [customers, setCustomers] = useState(initialCustomers);
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [invoices, setInvoices] = useState<SalesInvoice[]>(initialInvoices);
  const [ewayBills, setEwayBills] = useState<EWayBill[]>(initialEWayBills);
  const [employees, setEmployees] = useState(initialEmployees);
  const [salarySlips, setSalarySlips] = useState<SalarySlip[]>(initialSalarySlips);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs);

  // Module Configuration (Feature Toggles)
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings>({
    busyAccounting: true,
    manufacturing: true,
    quality: true,
    fleet: true,
    jobwork: true,
    subscriptions: true,
    projects: true,
    pos: true,
    banking: true,
    expenses: true,
    assets: true,
    helpdesk: true,
    recruitment: true,
    documents: true,
    gstCompliance: true,
    payroll: true,
    customers: true,
    suppliers: true,
    financialReports: true,
    auditTrail: true,
    invoices: true,
    inventory: true,
  });

  // Switch to clean slate (Clear dummy data)
  const handleResetToCleanSlate = () => {
    setInvoices([]);
    setEwayBills([]);
    setWorkOrders([]);
    setPosTransactions([]);
    setQualityInspections([]);
    setJobWorkOrders([]);
    setExpenseClaims([]);
    appendAuditLog(
      "UPDATE",
      "System Settings",
      "SYS-001",
      "Database Reset",
      "Switched to Clean Slate: Demo transactions cleared for production business entry."
    );
  };

  // Restore demo showcase data
  const handleRestoreDemoData = () => {
    setInvoices(initialInvoices);
    setEwayBills(initialEWayBills);
    setWorkOrders(initialWorkOrders);
    setPosTransactions(initialPOSTransactions);
    setQualityInspections(initialQualityInspections);
    setJobWorkOrders(initialJobWorkOrders);
    setExpenseClaims(initialExpenseClaims);
    appendAuditLog(
      "UPDATE",
      "System Settings",
      "SYS-002",
      "Demo Data Restored",
      "Restored showcase sample data for presentations."
    );
  };
  const [boms, setBoms] = useState<BillOfMaterial[]>(initialBOMs);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(initialWorkOrders);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(initialTimesheets);
  const [posTransactions, setPosTransactions] = useState<POSTransaction[]>(initialPOSTransactions);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(initialBankTransactions);
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(initialFixedAssets);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [qualityInspections, setQualityInspections] = useState<QualityInspection[]>(initialQualityInspections);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(initialFleetVehicles);
  const [jobWorkOrders, setJobWorkOrders] = useState<JobWorkOrder[]>(initialJobWorkOrders);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(initialSubscriptions);
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>(initialExpenseClaims);
  const [jobCandidates, setJobCandidates] = useState<JobCandidate[]>(initialJobCandidates);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(initialVaultDocuments);

  // Modals state
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<SalesInvoice | null>(null);
  const [selectedSlipForPrint, setSelectedSlipForPrint] = useState<SalarySlip | null>(null);
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isNewItemOpen, setIsNewItemOpen] = useState(false);
  const [isGSTINModalOpen, setIsGSTINModalOpen] = useState(false);
  const [isEWayModalOpen, setIsEWayModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // BUSY Accounting State
  const [busyVouchers, setBusyVouchers] = useState<BusyVoucher[]>(initialBusyVouchers);
  const [busyAccounts, setBusyAccounts] = useState<BusyAccountMaster[]>(initialBusyAccountMasters);
  const [busyItems, setBusyItems] = useState<BusyItemMaster[]>(initialBusyItemMasters);
  const [isBusyVoucherOpen, setIsBusyVoucherOpen] = useState(false);
  const [busyVoucherType, setBusyVoucherType] = useState<BusyVoucherType>("sales");
  const [isBusyLedgerOpen, setIsBusyLedgerOpen] = useState(false);
  const [selectedLedgerAccountId, setSelectedLedgerAccountId] = useState<string | undefined>();
  const [isBusyItemLedgerOpen, setIsBusyItemLedgerOpen] = useState(false);
  const [selectedItemLedgerId, setSelectedItemLedgerId] = useState<string | undefined>();
  const [isBusyHelpOpen, setIsBusyHelpOpen] = useState(false);

  // Global Keyboard Shortcuts for BUSY Accounting (F1 - F9, Alt+L, Alt+I, Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept normal typing in inputs, except for F-keys and Alt-combos
      const isInput =
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA";

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "F1") {
        e.preventDefault();
        setIsBusyHelpOpen((prev) => !prev);
      } else if (e.key === "F4" && !isInput) {
        e.preventDefault();
        setBusyVoucherType("contra");
        setIsBusyVoucherOpen(true);
      } else if (e.key === "F5") {
        // Prevent default browser refresh on F5!
        e.preventDefault();
        setBusyVoucherType("payment");
        setIsBusyVoucherOpen(true);
      } else if (e.key === "F6" && !isInput) {
        e.preventDefault();
        setBusyVoucherType("receipt");
        setIsBusyVoucherOpen(true);
      } else if (e.key === "F7" && !isInput) {
        e.preventDefault();
        setBusyVoucherType("journal");
        setIsBusyVoucherOpen(true);
      } else if (e.key === "F8" && !isInput) {
        e.preventDefault();
        setBusyVoucherType("sales");
        setIsBusyVoucherOpen(true);
      } else if (e.key === "F9" && !isInput) {
        e.preventDefault();
        setBusyVoucherType("purchase");
        setIsBusyVoucherOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "F9" || e.code === "F9")) {
        e.preventDefault();
        setBusyVoucherType("debit_note");
        setIsBusyVoucherOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "F8" || e.code === "F8")) {
        e.preventDefault();
        setBusyVoucherType("credit_note");
        setIsBusyVoucherOpen(true);
      } else if (e.altKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        setIsBusyLedgerOpen((prev) => !prev);
      } else if (e.altKey && (e.key === "i" || e.key === "I")) {
        e.preventDefault();
        setIsBusyItemLedgerOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Helper to append to immutable MCA audit trail
  const appendAuditLog = (
    action: AuditLogEntry["action"],
    module: string,
    recordId: string,
    recordIdentifier: string,
    remarks: string,
    previousData?: string,
    newData?: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action,
      module,
      recordId,
      recordIdentifier,
      userName: "admin.user",
      userRole: "Statutory Administrator",
      ipAddress: "103.21.144.10",
      previousData,
      newData,
      remarks,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // e-Invoice IRN Generator
  const handleGenerateIRN = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const irn = generateMockIRN(company.gstin, inv.invoiceNumber);
    const ackNo = `1126${Math.floor(10000000 + Math.random() * 90000000)}`;
    const ackDate = new Date().toISOString().replace("T", " ").substring(0, 19);

    const updated = invoices.map((i) =>
      i.id === invoiceId
        ? {
            ...i,
            eInvoiceStatus: "Generated" as const,
            irn,
            ackNo,
            ackDate,
          }
        : i
    );

    setInvoices(updated);
    appendAuditLog(
      "IRN_GENERATED",
      "e-Invoicing",
      inv.id,
      inv.invoiceNumber,
      `Signed IRN generated from IRP Portal for ${inv.customerName} (${formatINR(inv.grandTotal)})`
    );
  };

  // Cancel IRN
  const handleCancelIRN = (invoiceId: string) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const updated = invoices.map((i) =>
      i.id === invoiceId
        ? {
            ...i,
            eInvoiceStatus: "Cancelled" as const,
          }
        : i
    );
    setInvoices(updated);
    appendAuditLog(
      "UPDATE",
      "e-Invoicing",
      inv.id,
      inv.invoiceNumber,
      `IRN cancelled for ${inv.customerName}. Reason: 2-Data Entry Correction`
    );
  };

  // Save new invoice
  const handleSaveInvoice = (newInvoice: SalesInvoice) => {
    setInvoices([newInvoice, ...invoices]);
    appendAuditLog(
      "CREATE",
      "Sales Invoice",
      newInvoice.id,
      newInvoice.invoiceNumber,
      `New Tax Invoice created for ${newInvoice.customerName} (${formatINR(newInvoice.grandTotal)})`
    );
  };

  // BUSY Accounting Handlers
  const handleSaveBusyVoucher = (v: BusyVoucher) => {
    setBusyVouchers((prev) => [v, ...prev]);

    // Update Party balance in Account Masters
    if (v.partyId) {
      setBusyAccounts((prev) =>
        prev.map((acc) => {
          if (acc.id === v.partyId || acc.name === v.partyName) {
            let newBal = acc.currentBalance;
            if (v.voucherType === "sales" || v.voucherType === "debit_note") {
              newBal += v.totalAmount;
            } else if (
              v.voucherType === "purchase" ||
              v.voucherType === "credit_note" ||
              v.voucherType === "receipt"
            ) {
              newBal -= v.totalAmount;
            }
            return { ...acc, currentBalance: newBal };
          }
          return acc;
        })
      );
    }

    // Update item stock in Item Masters
    if (v.items && v.items.length > 0) {
      setBusyItems((prev) =>
        prev.map((item) => {
          const matched = v.items.find(
            (vi) => vi.itemName === item.name || vi.itemId === item.id
          );
          if (matched) {
            let updatedQty = item.currentQty;
            if (v.voucherType === "purchase" || v.voucherType === "credit_note") {
              updatedQty += matched.qty;
            } else if (v.voucherType === "sales" || v.voucherType === "debit_note") {
              updatedQty = Math.max(0, updatedQty - matched.qty);
            }
            return { ...item, currentQty: updatedQty };
          }
          return item;
        })
      );
    }

    // Append to MCA statutory audit trail
    appendAuditLog(
      "CREATE",
      "BUSY Accounting",
      v.id,
      v.voucherNo,
      `Voucher ${v.voucherNo} posted (${v.voucherType.toUpperCase()}) for ${v.partyName}. Amount: ${formatINR(v.totalAmount)}`
    );
  };

  const handleDeleteBusyVoucher = (id: string) => {
    const item = busyVouchers.find((v) => v.id === id);
    setBusyVouchers((prev) => prev.filter((v) => v.id !== id));
    appendAuditLog(
      "DELETE",
      "BUSY Accounting",
      id,
      item?.voucherNo || id,
      `Voucher ${item?.voucherNo || id} cancelled and removed from general ledger sequence.`
    );
  };

  const handleResetToBusyDefaults = () => {
    setBusyAccounts(initialBusyAccountMasters);
    setBusyItems(initialBusyItemMasters);
    setBusyVouchers(initialBusyVouchers);
    appendAuditLog(
      "UPDATE",
      "BUSY Accounting",
      "BUSY-INIT",
      "Auto-Setup Masters",
      "Auto-initialized all 28 Account Masters, Item Masters, Bill Sundries and standard voucher sequences from course manual."
    );
    alert("BUSY Accounting Engine auto-initialized with 28 Master Ledgers, Stock Items, and Vouchers!");
  };

  const handleBackupData = () => {
    const data = {
      company,
      busyAccounts,
      busyItems,
      busyVouchers,
      invoices,
      items,
      auditLogs,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `BUSY_Complete_Accounting_Backup_${new Date()
      .toISOString()
      .substring(0, 10)}.json`;
    a.click();
    appendAuditLog(
      "EXPORT",
      "BUSY Housekeeping",
      "BACKUP-01",
      "JSON Backup",
      "Generated and downloaded statutory financial database backup."
    );
  };

  // Save new item
  const handleSaveItem = (newItem: InventoryItem) => {
    setItems([newItem, ...items]);
    appendAuditLog(
      "CREATE",
      "Inventory Master",
      newItem.id,
      newItem.sku,
      `Item master created: ${newItem.name} (HSN: ${newItem.hsnSacCode}, GST: ${newItem.gstRate}%)`
    );
  };

  // Save new e-Way Bill
  const handleSaveEWayBill = (newEwb: EWayBill) => {
    setEwayBills([newEwb, ...ewayBills]);
    // Link to invoice
    setInvoices(
      invoices.map((inv) =>
        inv.invoiceNumber === newEwb.invoiceNo
          ? { ...inv, eWayBillNo: newEwb.ewayBillNo }
          : inv
      )
    );
    appendAuditLog(
      "EWAYBILL_CREATED",
      "e-Way Bill",
      newEwb.id,
      newEwb.ewayBillNo,
      `e-Way bill generated for Vehicle ${newEwb.vehicleNo} against Invoice ${newEwb.invoiceNo}`
    );
  };

  // Save POS Transaction
  const handleCompletePOSTransaction = (txn: POSTransaction) => {
    setPosTransactions([txn, ...posTransactions]);
    appendAuditLog(
      "CREATE",
      "Point of Sale",
      txn.id,
      txn.receiptNumber,
      `POS Sale completed: ${txn.receiptNumber} (${formatINR(txn.grandTotal)} via ${txn.paymentMode})`
    );
  };

  // Update company profile
  const handleUpdateCompany = (updatedCompany: CompanyInfo) => {
    setCompany(updatedCompany);
    appendAuditLog(
      "UPDATE",
      "Company Profile",
      "COMP-001",
      updatedCompany.legalName,
      `Statutory credentials updated. GSTIN: ${updatedCompany.gstin}`
    );
  };

  // Customer CRUD
  const handleAddCustomer = (c: Customer) => {
    setCustomers((prev) => [c, ...prev]);
    appendAuditLog("CREATE", "Customer CRM", c.id, c.name, `New customer registered: ${c.name} (GSTIN: ${c.gstin})`);
  };
  const handleUpdateCustomer = (c: Customer) => {
    setCustomers((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    appendAuditLog("UPDATE", "Customer CRM", c.id, c.name, `Updated customer master for ${c.name}`);
  };
  const handleDeleteCustomer = (id: string) => {
    const item = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    appendAuditLog("DELETE", "Customer CRM", id, item?.name || id, `Deleted customer ${item?.name || id}`);
  };

  // Supplier CRUD
  const handleAddSupplier = (s: Supplier) => {
    setSuppliers((prev) => [s, ...prev]);
    appendAuditLog("CREATE", "Vendor Portal", s.id, s.name, `New vendor enrolled: ${s.name} (MSME: ${s.msmeCategory || "N/A"})`);
  };
  const handleUpdateSupplier = (s: Supplier) => {
    setSuppliers((prev) => prev.map((item) => (item.id === s.id ? s : item)));
    appendAuditLog("UPDATE", "Vendor Portal", s.id, s.name, `Updated vendor details for ${s.name}`);
  };
  const handleDeleteSupplier = (id: string) => {
    const item = suppliers.find((s) => s.id === id);
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
    appendAuditLog("DELETE", "Vendor Portal", id, item?.name || id, `Deleted vendor ${item?.name || id}`);
  };

  // Item Save & Delete
  const handleSaveItemModal = (item: InventoryItem) => {
    const exists = items.some((i) => i.id === item.id);
    if (exists) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      appendAuditLog(
        "UPDATE",
        "Inventory Master",
        item.id,
        item.sku,
        `Item master updated: ${item.name} (HSN: ${item.hsnSacCode}, GST: ${item.gstRate}%)`
      );
    } else {
      setItems((prev) => [item, ...prev]);
      appendAuditLog(
        "CREATE",
        "Inventory Master",
        item.id,
        item.sku,
        `Item master created: ${item.name} (HSN: ${item.hsnSacCode}, GST: ${item.gstRate}%)`
      );
    }
  };
  const handleDeleteItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    appendAuditLog(
      "DELETE",
      "Inventory Master",
      id,
      item ? item.sku : id,
      `Item master deleted: ${item?.name || id}`
    );
  };

  // Quality Inspection CRUD
  const handleUpdateInspection = (q: QualityInspection) => {
    setQualityInspections((prev) => prev.map((item) => (item.id === q.id ? q : item)));
    appendAuditLog("UPDATE", "Quality Inspection", q.id, q.inspectionNo, `Updated QC inspection for ${q.itemName}`);
  };
  const handleDeleteInspection = (id: string) => {
    const item = qualityInspections.find((q) => q.id === id);
    setQualityInspections((prev) => prev.filter((q) => q.id !== id));
    appendAuditLog("DELETE", "Quality Inspection", id, item?.inspectionNo || id, `Deleted QC inspection for ${item?.itemName || id}`);
  };

  // Fleet CRUD
  const handleUpdateVehicle = (v: FleetVehicle) => {
    setFleetVehicles((prev) => prev.map((item) => (item.id === v.id ? v : item)));
    appendAuditLog("UPDATE", "Fleet Logistics", v.id, v.vehicleNo, `Updated fleet vehicle record for ${v.vehicleNo}`);
  };
  const handleDeleteVehicle = (id: string) => {
    const item = fleetVehicles.find((v) => v.id === id);
    setFleetVehicles((prev) => prev.filter((v) => v.id !== id));
    appendAuditLog("DELETE", "Fleet Logistics", id, item?.vehicleNo || id, `Removed vehicle ${item?.vehicleNo || id}`);
  };

  // Job Work CRUD
  const handleUpdateJobWork = (jw: JobWorkOrder) => {
    setJobWorkOrders((prev) => prev.map((item) => (item.id === jw.id ? jw : item)));
    appendAuditLog("UPDATE", "Subcontracting", jw.id, jw.challanNo, `Updated job work order ${jw.challanNo} for ${jw.jobWorkerName}`);
  };
  const handleDeleteJobWork = (id: string) => {
    const item = jobWorkOrders.find((jw) => jw.id === id);
    setJobWorkOrders((prev) => prev.filter((jw) => jw.id !== id));
    appendAuditLog("DELETE", "Subcontracting", id, item?.challanNo || id, `Deleted job work order ${item?.challanNo || id}`);
  };

  // Subscriptions CRUD
  const handleUpdateSubscription = (s: SubscriptionRecord) => {
    setSubscriptions((prev) => prev.map((item) => (item.id === s.id ? s : item)));
    appendAuditLog("UPDATE", "Subscriptions", s.id, s.contractNo, `Modified recurring contract for ${s.clientName}`);
  };
  const handleDeleteSubscription = (id: string) => {
    const item = subscriptions.find((s) => s.id === id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    appendAuditLog("DELETE", "Subscriptions", id, item?.contractNo || id, `Terminated contract ${item?.contractNo || id}`);
  };

  // Expenses CRUD
  const handleUpdateExpense = (c: ExpenseClaim) => {
    setExpenseClaims((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    appendAuditLog("UPDATE", "Employee Expenses", c.id, c.claimNo, `Updated expense claim ${c.claimNo}`);
  };
  const handleDeleteExpense = (id: string) => {
    const item = expenseClaims.find((c) => c.id === id);
    setExpenseClaims((prev) => prev.filter((c) => c.id !== id));
    appendAuditLog("DELETE", "Employee Expenses", id, item?.claimNo || id, `Deleted expense claim ${item?.claimNo || id}`);
  };

  // Recruitment CRUD
  const handleUpdateCandidate = (cand: JobCandidate) => {
    setJobCandidates((prev) => prev.map((item) => (item.id === cand.id ? cand : item)));
    appendAuditLog("UPDATE", "Recruitment ATS", cand.id, cand.candidateName, `Updated applicant status for ${cand.candidateName}`);
  };
  const handleDeleteCandidate = (id: string) => {
    const item = jobCandidates.find((c) => c.id === id);
    setJobCandidates((prev) => prev.filter((c) => c.id !== id));
    appendAuditLog("DELETE", "Recruitment ATS", id, item?.candidateName || id, `Deleted applicant ${item?.candidateName || id}`);
  };

  // Documents CRUD
  const handleUpdateDocument = (doc: VaultDocument) => {
    setVaultDocuments((prev) => prev.map((item) => (item.id === doc.id ? doc : item)));
    appendAuditLog("UPDATE", "Document Vault", doc.id, doc.fileNumber, `Updated metadata for document ${doc.documentTitle}`);
  };
  const handleDeleteDocument = (id: string) => {
    const item = vaultDocuments.find((d) => d.id === id);
    setVaultDocuments((prev) => prev.filter((d) => d.id !== id));
    appendAuditLog("DELETE", "Document Vault", id, item?.fileNumber || id, `Archived document ${item?.documentTitle || id}`);
  };

  // Assets CRUD
  const handleAddAsset = (asset: FixedAsset) => {
    setFixedAssets((prev) => [asset, ...prev]);
    appendAuditLog("CREATE", "Fixed Assets", asset.id, asset.assetCode, `Added fixed asset ${asset.name} (${formatINR(asset.purchaseCost)})`);
  };
  const handleUpdateAsset = (asset: FixedAsset) => {
    setFixedAssets((prev) => prev.map((item) => (item.id === asset.id ? asset : item)));
    appendAuditLog("UPDATE", "Fixed Assets", asset.id, asset.assetCode, `Updated asset record for ${asset.name}`);
  };
  const handleDeleteAsset = (id: string) => {
    const item = fixedAssets.find((a) => a.id === id);
    setFixedAssets((prev) => prev.filter((a) => a.id !== id));
    appendAuditLog("DELETE", "Fixed Assets", id, item?.assetCode || id, `Scrapped/Deleted asset ${item?.name || id}`);
  };

  // Helpdesk CRUD
  const handleAddTicket = (ticket: SupportTicket) => {
    setSupportTickets((prev) => [ticket, ...prev]);
    appendAuditLog("CREATE", "Helpdesk SLA", ticket.id, ticket.ticketNumber, `Logged support ticket for ${ticket.customerName}: ${ticket.subject}`);
  };
  const handleUpdateTicket = (ticket: SupportTicket) => {
    setSupportTickets((prev) => prev.map((item) => (item.id === ticket.id ? ticket : item)));
    appendAuditLog("UPDATE", "Helpdesk SLA", ticket.id, ticket.ticketNumber, `Updated ticket ${ticket.ticketNumber} status to ${ticket.status}`);
  };
  const handleDeleteTicket = (id: string) => {
    const item = supportTickets.find((t) => t.id === id);
    setSupportTickets((prev) => prev.filter((t) => t.id !== id));
    appendAuditLog("DELETE", "Helpdesk SLA", id, item?.ticketNumber || id, `Resolved/Deleted ticket ${item?.ticketNumber || id}`);
  };

  // Manufacturing / Work Orders CRUD
  const handleAddWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => [wo, ...prev]);
    appendAuditLog("CREATE", "Manufacturing", wo.id, wo.orderNumber, `Created work order ${wo.orderNumber} for ${wo.finishedGoodName}`);
  };
  const handleUpdateWorkOrder = (wo: WorkOrder) => {
    setWorkOrders((prev) => prev.map((item) => (item.id === wo.id ? wo : item)));
    appendAuditLog("UPDATE", "Manufacturing", wo.id, wo.orderNumber, `Updated work order ${wo.orderNumber} status: ${wo.status}`);
  };
  const handleDeleteWorkOrder = (id: string) => {
    const item = workOrders.find((w) => w.id === id);
    setWorkOrders((prev) => prev.filter((w) => w.id !== id));
    appendAuditLog("DELETE", "Manufacturing", id, item?.orderNumber || id, `Cancelled work order ${item?.orderNumber || id}`);
  };

  // Projects CRUD
  const handleAddProject = (p: Project) => {
    setProjects((prev) => [p, ...prev]);
    appendAuditLog("CREATE", "Project Management", p.id, p.code, `Created project ${p.name} (Budget: ${formatINR(p.budget)})`);
  };
  const handleUpdateProject = (p: Project) => {
    setProjects((prev) => prev.map((item) => (item.id === p.id ? p : item)));
    appendAuditLog("UPDATE", "Project Management", p.id, p.code, `Updated project status/details for ${p.name}`);
  };
  const handleDeleteProject = (id: string) => {
    const item = projects.find((p) => p.id === id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    appendAuditLog("DELETE", "Project Management", id, item?.code || id, `Deleted project ${item?.name || id}`);
  };

  // Banking CRUD
  const handleAddBankTransaction = (txn: BankTransaction) => {
    setBankTransactions((prev) => [txn, ...prev]);
    appendAuditLog("CREATE", "Banking & Reconciliation", txn.id, txn.referenceNo, `Added bank entry ${txn.description} (${formatINR(txn.credit || txn.debit)})`);
  };
  const handleDeleteBankTransaction = (id: string) => {
    const item = bankTransactions.find((t) => t.id === id);
    setBankTransactions((prev) => prev.filter((t) => t.id !== id));
    appendAuditLog("DELETE", "Banking & Reconciliation", id, item?.referenceNo || id, `Removed statement item ${item?.referenceNo || id}`);
  };

  // Payroll / Employee CRUD
  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => [emp, ...prev]);
    appendAuditLog("CREATE", "Payroll HRMS", emp.id, emp.empCode, `Onboarded employee ${emp.name} (${emp.designation})`);
  };
  const handleUpdateEmployee = (emp: Employee) => {
    setEmployees((prev) => prev.map((item) => (item.id === emp.id ? emp : item)));
    appendAuditLog("UPDATE", "Payroll HRMS", emp.id, emp.empCode, `Updated profile for employee ${emp.name}`);
  };
  const handleDeleteEmployee = (id: string) => {
    const item = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    appendAuditLog("DELETE", "Payroll HRMS", id, item?.empCode || id, `Deactivated employee ${item?.name || id}`);
  };

  // Invoices CRUD
  const handleDeleteInvoice = (id: string) => {
    const item = invoices.find((i) => i.id === id);
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    appendAuditLog("DELETE", "Sales Invoicing", id, item?.invoiceNumber || id, `Deleted tax invoice ${item?.invoiceNumber || id} for ${item?.customerName}`);
  };
  const handleTogglePaymentStatus = (id: string) => {
    const item = invoices.find((i) => i.id === id);
    if (!item) return;
    const nextStatus = item.paymentStatus === "Paid" ? "Unpaid" : "Paid";
    setInvoices((prev) =>
      prev.map((i) => (i.id === id ? { ...i, paymentStatus: nextStatus } : i))
    );
    appendAuditLog("UPDATE", "Sales Invoicing", id, item.invoiceNumber, `Payment status updated to ${nextStatus} for ${item.customerName}`);
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        moduleSettings={moduleSettings}
      />

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          company={company}
          activeModule={activeModule}
          setIsOpen={setSidebarOpen}
          onNewInvoice={() => setIsNewInvoiceOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setActiveModule("settings")}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeModule === "dashboard" && (
            <DashboardView
              invoices={invoices}
              items={items}
              ewayBills={ewayBills}
              auditLogs={auditLogs}
              setActiveModule={setActiveModule}
              onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
              onOpenGSTINModal={() => setIsGSTINModalOpen(true)}
              onOpenEWayModal={() => setIsEWayModalOpen(true)}
            />
          )}

          {activeModule === "invoices" && (
            <InvoicesView
              invoices={invoices}
              onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
              onGenerateIRN={handleGenerateIRN}
              onDeleteInvoice={handleDeleteInvoice}
              onTogglePaymentStatus={handleTogglePaymentStatus}
            />
          )}

          {activeModule === "gst-compliance" && (
            <IndiaComplianceView
              company={company}
              invoices={invoices}
              ewayBills={ewayBills}
              hsnDirectory={hsnSacDirectory}
              onGenerateIRN={handleGenerateIRN}
              onCancelIRN={handleCancelIRN}
              onNewEWayBill={handleSaveEWayBill}
              onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
            />
          )}

          {activeModule === "pos" && (
            <PointOfSaleView
              items={items}
              recentTransactions={posTransactions}
              onCompleteTransaction={handleCompletePOSTransaction}
            />
          )}

          {activeModule === "manufacturing" && (
            <ManufacturingView
              boms={boms}
              workOrders={workOrders}
              onAddWorkOrder={handleAddWorkOrder}
              onUpdateWorkOrder={handleUpdateWorkOrder}
              onDeleteWorkOrder={handleDeleteWorkOrder}
            />
          )}

          {activeModule === "quality" && (
            <QualityView
              inspections={qualityInspections}
              onAddInspection={(q) => {
                setQualityInspections((prev) => [q, ...prev]);
                appendAuditLog("CREATE", "Quality Inspection", q.id, q.inspectionNo, `Logged QC test for ${q.itemName}`);
              }}
              onUpdateInspection={handleUpdateInspection}
              onDeleteInspection={handleDeleteInspection}
            />
          )}

          {activeModule === "fleet" && (
            <FleetView
              vehicles={fleetVehicles}
              onAddVehicle={(v) => {
                setFleetVehicles((prev) => [v, ...prev]);
                appendAuditLog("CREATE", "Fleet Logistics", v.id, v.vehicleNo, `Registered commercial vehicle ${v.model}`);
              }}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          )}

          {activeModule === "jobwork" && (
            <JobWorkView
              orders={jobWorkOrders}
              onAddOrder={(jw) => {
                setJobWorkOrders((prev) => [jw, ...prev]);
                appendAuditLog("CREATE", "Subcontracting", jw.id, jw.challanNo, `Issued GST ITC-04 delivery challan to ${jw.jobWorkerName}`);
              }}
              onUpdateOrder={handleUpdateJobWork}
              onDeleteOrder={handleDeleteJobWork}
            />
          )}

          {activeModule === "subscriptions" && (
            <SubscriptionsView
              subscriptions={subscriptions}
              onAddSubscription={(s) => {
                setSubscriptions((prev) => [s, ...prev]);
                appendAuditLog("CREATE", "Subscriptions", s.id, s.contractNo, `Activated recurring contract for ${s.clientName}`);
              }}
              onUpdateSubscription={handleUpdateSubscription}
              onDeleteSubscription={handleDeleteSubscription}
            />
          )}

          {activeModule === "projects" && (
            <ProjectsView
              projects={projects}
              timesheets={timesheets}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeModule === "banking" && (
            <BankingView
              accounts={bankAccounts}
              transactions={bankTransactions}
              onAddTransaction={handleAddBankTransaction}
              onDeleteTransaction={handleDeleteBankTransaction}
            />
          )}

          {activeModule === "expenses" && (
            <ExpensesView
              claims={expenseClaims}
              onAddClaim={(c) => {
                setExpenseClaims((prev) => [c, ...prev]);
                appendAuditLog("CREATE", "Employee Expenses", c.id, c.claimNo, `Claim filed by ${c.employeeName} for ₹${c.amount}`);
              }}
              onUpdateClaim={handleUpdateExpense}
              onDeleteClaim={handleDeleteExpense}
            />
          )}

          {activeModule === "assets" && (
            <AssetsView
              assets={fixedAssets}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
            />
          )}

          {activeModule === "helpdesk" && (
            <HelpdeskView
              tickets={supportTickets}
              onAddTicket={handleAddTicket}
              onUpdateTicket={handleUpdateTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {activeModule === "recruitment" && (
            <RecruitmentView
              candidates={jobCandidates}
              onAddCandidate={(cand) => {
                setJobCandidates((prev) => [cand, ...prev]);
                appendAuditLog("CREATE", "Recruitment ATS", cand.id, cand.candidateName, `Candidate applied for ${cand.jobRole}`);
              }}
              onUpdateCandidate={handleUpdateCandidate}
              onDeleteCandidate={handleDeleteCandidate}
            />
          )}

          {activeModule === "documents" && (
            <DocumentsVaultView
              documents={vaultDocuments}
              onAddDocument={(doc) => {
                setVaultDocuments((prev) => [doc, ...prev]);
                appendAuditLog("CREATE", "Document Vault", doc.id, doc.fileNumber, `Deposited ${doc.documentTitle}`);
              }}
              onUpdateDocument={handleUpdateDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}

          {activeModule === "financial-reports" && (
            <FinancialReportsView />
          )}

          {activeModule === "inventory" && (
            <InventoryView
              items={items}
              onOpenNewItem={() => setIsNewItemOpen(true)}
              onSaveItem={handleSaveItemModal}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {activeModule === "customers" && (
            <CustomersView
              customers={customers}
              onAddCustomer={handleAddCustomer}
              onUpdateCustomer={handleUpdateCustomer}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeModule === "suppliers" && (
            <SuppliersView
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {activeModule === "purchase-orders" && (
            <SuppliersView
              suppliers={suppliers}
              onAddSupplier={handleAddSupplier}
              onUpdateSupplier={handleUpdateSupplier}
              onDeleteSupplier={handleDeleteSupplier}
            />
          )}

          {activeModule === "quotations" && (
            <InvoicesView
              invoices={invoices}
              onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
              onGenerateIRN={handleGenerateIRN}
              onDeleteInvoice={handleDeleteInvoice}
              onTogglePaymentStatus={handleTogglePaymentStatus}
            />
          )}

          {activeModule === "payroll" && (
            <PayrollView
              employees={employees}
              salarySlips={salarySlips}
              company={company}
              onViewSlip={(slip) => setSelectedSlipForPrint(slip)}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          )}

          {activeModule === "accounts" && (
            <ChartOfAccountsView tree={chartOfAccountsTree} />
          )}

          {activeModule === "busy-accounting" && (
            <BusyAccountingHub
              company={company}
              vouchers={busyVouchers}
              accounts={busyAccounts}
              items={busyItems}
              onOpenNewVoucher={(type) => {
                setBusyVoucherType(type);
                setIsBusyVoucherOpen(true);
              }}
              onOpenLedger={(accId) => {
                setSelectedLedgerAccountId(accId);
                setIsBusyLedgerOpen(true);
              }}
              onOpenItemLedger={(itemId) => {
                setSelectedItemLedgerId(itemId);
                setIsBusyItemLedgerOpen(true);
              }}
              onOpenHelp={() => setIsBusyHelpOpen(true)}
              onDeleteVoucher={handleDeleteBusyVoucher}
              onResetToBusyDefaults={handleResetToBusyDefaults}
              onBackupData={handleBackupData}
            />
          )}

          {activeModule === "audit-trail" && (
            <AuditTrailView logs={auditLogs} />
          )}

          {activeModule === "settings" && (
            <CompanySettingsView
              company={company}
              moduleSettings={moduleSettings}
              onUpdateCompany={handleUpdateCompany}
              onUpdateModuleSettings={setModuleSettings}
              onResetToCleanSlate={handleResetToCleanSlate}
              onRestoreDemoData={handleRestoreDemoData}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      <TaxInvoicePrintModal
        invoice={selectedInvoiceForPrint}
        company={company}
        onClose={() => setSelectedInvoiceForPrint(null)}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceOpen}
        onClose={() => setIsNewInvoiceOpen(false)}
        customers={customers}
        items={items}
        company={company}
        onSaveInvoice={handleSaveInvoice}
      />

      <NewItemModal
        isOpen={isNewItemOpen}
        onClose={() => setIsNewItemOpen(false)}
        onSaveItem={handleSaveItem}
      />

      <GSTINLookupModal
        isOpen={isGSTINModalOpen}
        onClose={() => setIsGSTINModalOpen(false)}
      />

      <EWayBillModal
        isOpen={isEWayModalOpen}
        onClose={() => setIsEWayModalOpen(false)}
        invoices={invoices}
        company={company}
        onSaveEWayBill={handleSaveEWayBill}
      />

      <PayslipModal
        slip={selectedSlipForPrint}
        employee={employees.find((e) => e.id === selectedSlipForPrint?.employeeId)}
        company={company}
        onClose={() => setSelectedSlipForPrint(null)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveModule={setActiveModule}
        invoices={invoices}
        customers={customers}
        items={items}
        onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
      />

      {/* Floating Module Help Button */}
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-4 py-2.5 shadow-2xl shadow-amber-500/40 transition-all hover:scale-105 border-2 border-white/60 dark:border-slate-800"
        title="Open Interactive Guide & Help for this Module / सहायता"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-amber-300 text-xs font-black">
          ?
        </span>
        <span className="text-xs tracking-wide">Module Help / सहायता</span>
      </button>

      {/* Interactive Bilingual Help Modal */}
      <ModuleHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        activeModule={activeModule}
      />

      {/* BUSY Accounting Modals */}
      <BusyVoucherModal
        isOpen={isBusyVoucherOpen}
        onClose={() => setIsBusyVoucherOpen(false)}
        onSave={handleSaveBusyVoucher}
        initialType={busyVoucherType}
        company={company}
        accounts={busyAccounts}
        items={busyItems}
      />

      <BusyLedgerModal
        isOpen={isBusyLedgerOpen}
        onClose={() => setIsBusyLedgerOpen(false)}
        accounts={busyAccounts}
        vouchers={busyVouchers}
        company={company}
        selectedAccountId={selectedLedgerAccountId}
      />

      <BusyItemLedgerModal
        isOpen={isBusyItemLedgerOpen}
        onClose={() => setIsBusyItemLedgerOpen(false)}
        items={busyItems}
        vouchers={busyVouchers}
        company={company}
        selectedItemId={selectedItemLedgerId}
      />

      <BusyHelpModal
        isOpen={isBusyHelpOpen}
        onClose={() => setIsBusyHelpOpen(false)}
      />

      {/* Persistent BUSY Accounting Shortcut Floating Dock (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 hidden sm:flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-700/80 shadow-2xl text-[11px] text-white">
        <span className="px-2 font-black text-blue-400 border-r border-slate-700 mr-0.5">
          BUSY
        </span>
        <button
          onClick={() => {
            setBusyVoucherType("sales");
            setIsBusyVoucherOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/80 hover:bg-emerald-500 font-bold transition-all"
        >
          <span>Sales</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">F8</kbd>
        </button>
        <button
          onClick={() => {
            setBusyVoucherType("purchase");
            setIsBusyVoucherOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/80 hover:bg-blue-500 font-bold transition-all"
        >
          <span>Purchase</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">F9</kbd>
        </button>
        <button
          onClick={() => {
            setBusyVoucherType("payment");
            setIsBusyVoucherOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-600/80 hover:bg-purple-500 font-bold transition-all"
        >
          <span>Payment</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">F5</kbd>
        </button>
        <button
          onClick={() => {
            setBusyVoucherType("receipt");
            setIsBusyVoucherOpen(true);
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-600/80 hover:bg-amber-500 font-bold transition-all"
        >
          <span>Receipt</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">F6</kbd>
        </button>
        <button
          onClick={() => setIsBusyLedgerOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-600/80 hover:bg-rose-500 font-bold transition-all"
        >
          <span>Ledger</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">Alt+L</kbd>
        </button>
        <button
          onClick={() => setIsBusyHelpOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-700 hover:bg-slate-600 font-bold transition-all"
        >
          <span>Help</span>
          <kbd className="bg-black/40 px-1 rounded text-[9px] font-mono">F1</kbd>
        </button>
      </div>
    </div>
  );
}
