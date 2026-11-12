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

// Modals
import { TaxInvoicePrintModal } from "@/components/modules/invoicing/TaxInvoicePrintModal";
import { NewInvoiceModal } from "@/components/modules/invoicing/NewInvoiceModal";
import { NewItemModal } from "@/components/modules/inventory/NewItemModal";
import { GSTINLookupModal } from "@/components/modules/gst/GSTINLookupModal";
import { EWayBillModal } from "@/components/modules/gst/EWayBillModal";
import { PayslipModal } from "@/components/modules/payroll/PayslipModal";
import { GlobalSearchModal } from "@/components/layout/GlobalSearchModal";

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

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
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
            />
          )}

          {activeModule === "quality" && (
            <QualityView
              inspections={qualityInspections}
              onAddInspection={(q) => {
                setQualityInspections((prev) => [q, ...prev]);
                appendAuditLog("CREATE", "Quality Inspection", q.id, q.inspectionNo, `Logged QC test for ${q.itemName}`);
              }}
            />
          )}

          {activeModule === "fleet" && (
            <FleetView
              vehicles={fleetVehicles}
              onAddVehicle={(v) => {
                setFleetVehicles((prev) => [v, ...prev]);
                appendAuditLog("CREATE", "Fleet Logistics", v.id, v.vehicleNo, `Registered commercial vehicle ${v.model}`);
              }}
            />
          )}

          {activeModule === "jobwork" && (
            <JobWorkView
              orders={jobWorkOrders}
              onAddOrder={(jw) => {
                setJobWorkOrders((prev) => [jw, ...prev]);
                appendAuditLog("CREATE", "Subcontracting", jw.id, jw.challanNo, `Issued GST ITC-04 delivery challan to ${jw.jobWorkerName}`);
              }}
            />
          )}

          {activeModule === "subscriptions" && (
            <SubscriptionsView
              subscriptions={subscriptions}
              onAddSubscription={(s) => {
                setSubscriptions((prev) => [s, ...prev]);
                appendAuditLog("CREATE", "Subscriptions", s.id, s.contractNo, `Activated recurring contract for ${s.clientName}`);
              }}
            />
          )}

          {activeModule === "projects" && (
            <ProjectsView
              projects={projects}
              timesheets={timesheets}
            />
          )}

          {activeModule === "banking" && (
            <BankingView
              accounts={bankAccounts}
              transactions={bankTransactions}
            />
          )}

          {activeModule === "expenses" && (
            <ExpensesView
              claims={expenseClaims}
              onAddClaim={(c) => {
                setExpenseClaims((prev) => [c, ...prev]);
                appendAuditLog("CREATE", "Employee Expenses", c.id, c.claimNo, `Claim filed by ${c.employeeName} for ₹${c.amount}`);
              }}
            />
          )}

          {activeModule === "assets" && (
            <AssetsView
              assets={fixedAssets}
            />
          )}

          {activeModule === "helpdesk" && (
            <HelpdeskView
              tickets={supportTickets}
            />
          )}

          {activeModule === "recruitment" && (
            <RecruitmentView
              candidates={jobCandidates}
              onAddCandidate={(cand) => {
                setJobCandidates((prev) => [cand, ...prev]);
                appendAuditLog("CREATE", "Recruitment ATS", cand.id, cand.candidateName, `Candidate applied for ${cand.jobRole}`);
              }}
            />
          )}

          {activeModule === "documents" && (
            <DocumentsVaultView
              documents={vaultDocuments}
              onAddDocument={(doc) => {
                setVaultDocuments((prev) => [doc, ...prev]);
                appendAuditLog("CREATE", "Document Vault", doc.id, doc.fileNumber, `Deposited ${doc.documentTitle}`);
              }}
            />
          )}

          {activeModule === "financial-reports" && (
            <FinancialReportsView />
          )}

          {activeModule === "inventory" && (
            <InventoryView
              items={items}
              onOpenNewItem={() => setIsNewItemOpen(true)}
            />
          )}

          {activeModule === "customers" && (
            <CustomersView customers={customers} />
          )}

          {activeModule === "suppliers" && (
            <SuppliersView suppliers={suppliers} />
          )}

          {activeModule === "purchase-orders" && (
            <SuppliersView suppliers={suppliers} />
          )}

          {activeModule === "quotations" && (
            <InvoicesView
              invoices={invoices}
              onOpenNewInvoice={() => setIsNewInvoiceOpen(true)}
              onViewInvoice={(inv) => setSelectedInvoiceForPrint(inv)}
              onGenerateIRN={handleGenerateIRN}
            />
          )}

          {activeModule === "payroll" && (
            <PayrollView
              employees={employees}
              salarySlips={salarySlips}
              company={company}
              onViewSlip={(slip) => setSelectedSlipForPrint(slip)}
            />
          )}

          {activeModule === "accounts" && (
            <ChartOfAccountsView tree={chartOfAccountsTree} />
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
    </div>
  );
}
