export type ModuleType =
  | "dashboard"
  | "invoices"
  | "gst-compliance"
  | "inventory"
  | "busy-accounting"
  | "manufacturing"
  | "quality"
  | "fleet"
  | "jobwork"
  | "subscriptions"
  | "projects"
  | "pos"
  | "banking"
  | "expenses"
  | "assets"
  | "helpdesk"
  | "recruitment"
  | "documents"
  | "financial-reports"
  | "customers"
  | "suppliers"
  | "purchase-orders"
  | "quotations"
  | "payroll"
  | "accounts"
  | "audit-trail"
  | "settings";

export type GSTType = "CGST+SGST" | "IGST" | "NIL" | "EXEMPT";

export interface ModuleSettings {
  busyAccounting: boolean;
  gstCompliance: boolean;
  invoices: boolean;
  pos: boolean;
  inventory: boolean;
  manufacturing: boolean;
  quality: boolean;
  fleet: boolean;
  jobwork: boolean;
  subscriptions: boolean;
  projects: boolean;
  banking: boolean;
  expenses: boolean;
  assets: boolean;
  helpdesk: boolean;
  recruitment: boolean;
  documents: boolean;
  payroll: boolean;
  customers: boolean;
  suppliers: boolean;
  financialReports: boolean;
  auditTrail: boolean;
}

export interface CompanyInfo {
  legalName: string;
  tradeName: string;
  gstin: string;
  pan: string;
  cin: string;
  msmeUdyam: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch: string;
  lutNumber?: string; // For export
}

export interface Customer {
  id: string;
  name: string;
  tradeName?: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  state: string;
  stateCode: string;
  address: string;
  city: string;
  pincode: string;
  creditLimit: number;
  outstandingBalance: number;
  status: "Active" | "Inactive";
  contactPerson?: string;
  shippingAddress?: string;
  creditDays?: number;
  bankAccount?: string;
  bankIfsc?: string;
}

export interface Supplier {
  id: string;
  name: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  state: string;
  stateCode: string;
  address: string;
  city: string;
  pincode: string;
  msmeCategory: "Micro" | "Small" | "Medium" | "Non-MSME";
  paymentTerms: string;
  balancePayable: number;
  status: "Active" | "Inactive";
  udyamNumber?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  branch?: string;
  tdsSection?: string;
  contactPerson?: string;
  creditLimit?: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: "Finished Goods" | "Raw Material" | "Services" | "Consumables";
  hsnSacCode: string;
  uom: "NOS" | "KGS" | "MTR" | "BOX" | "HRS" | "SET";
  gstRate: 0 | 5 | 12 | 18 | 28;
  purchasePrice: number;
  sellingPrice: number;
  currentStock: number;
  reorderLevel: number;
  warehouse: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  barcode?: string;
  batchTracking?: boolean;
  expiryTracking?: boolean;
  minOrderQty?: number;
  altUom?: string;
  conversionFactor?: number;
  brand?: string;
  binLocation?: string;
}

export interface InvoiceItem {
  id: string;
  itemId?: string;
  description: string;
  hsnSacCode: string;
  quantity: number;
  uom: string;
  unitPrice: number;
  discountPercent: number;
  taxableValue: number;
  gstRate: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  customerGstin: string;
  customerState: string;
  customerStateCode: string;
  placeOfSupply: string;
  invoiceType: "B2B" | "B2C" | "Export (SEZ)" | "Deemed Export";
  items: InvoiceItem[];
  subTotal: number;
  discountTotal: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
  paymentStatus: "Paid" | "Partially Paid" | "Unpaid" | "Overdue";
  eInvoiceStatus: "Generated" | "Pending" | "Cancelled" | "Not Applicable";
  irn?: string;
  ackNo?: string;
  ackDate?: string;
  eWayBillNo?: string;
  poNumber?: string;
  poDate?: string;
  vehicleNo?: string;
  transporterName?: string;
  paymentTerms?: string;
  shippingAddress?: string;
  remittanceBank?: string;
  notes?: string;
  termsAndConditions?: string;
}

export interface EWayBill {
  id: string;
  ewayBillNo: string;
  invoiceNo: string;
  customerName: string;
  fromPincode: string;
  toPincode: string;
  distanceKm: number;
  vehicleNo: string;
  transporterName: string;
  transporterId: string;
  generatedDate: string;
  validUntil: string;
  status: "Active" | "Expired" | "Cancelled";
}

export interface Employee {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  pan: string;
  uan: string;
  esicNo: string;
  bankAccount: string;
  bankIfsc: string;
  basicSalary: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  grossSalary: number;
  status: "Active" | "On Leave" | "Relieved";
  email?: string;
  phone?: string;
  dob?: string;
  gender?: "Male" | "Female" | "Other";
  emergencyContact?: string;
}

export interface SalarySlip {
  id: string;
  slipNumber: string;
  employeeId: string;
  employeeName: string;
  month: string;
  year: number;
  workingDays: number;
  presentDays: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  conveyance: number;
  grossEarnings: number;
  employeePF: number;
  employeeESIC: number;
  professionalTax: number;
  tdsDeduction: number;
  totalDeductions: number;
  netPayable: number;
  paymentStatus: "Processed" | "Paid" | "Pending";
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "IRN_GENERATED" | "EWAYBILL_CREATED" | "EXPORT";
  module: string;
  recordId: string;
  recordIdentifier: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  previousData?: string;
  newData?: string;
  remarks: string;
}

export interface ChartOfAccountNode {
  id: string;
  code: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Income" | "Expense";
  balance: number;
  children?: ChartOfAccountNode[];
}

export interface HsnSacItem {
  code: string;
  description: string;
  type: "HSN" | "SAC";
  rate: number;
  category: string;
}

// 1. Manufacturing & Production
export interface BOMItem {
  itemId: string;
  itemName: string;
  sku: string;
  quantityRequired: number;
  uom: string;
  unitCost: number;
  totalCost: number;
}

export interface BillOfMaterial {
  id: string;
  bomCode: string;
  finishedGoodId: string;
  finishedGoodName: string;
  quantityOutput: number;
  uom: string;
  items: BOMItem[];
  operationsCost: number;
  totalProductionCost: number;
  status: "Active" | "Draft" | "Archived";
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  bomId: string;
  finishedGoodName: string;
  quantityToProduce: number;
  quantityProduced: number;
  startDate: string;
  targetDate: string;
  warehouse: string;
  status: "Planned" | "In Progress" | "Completed" | "Cancelled";
  supervisor?: string;
  batchNo?: string;
  scrapAllowance?: number;
}

// 2. Projects & Timesheets
export interface ProjectTask {
  id: string;
  title: string;
  assignedTo: string;
  status: "Todo" | "In Progress" | "Review" | "Done";
  priority: "Low" | "Medium" | "High";
  estimatedHours: number;
  loggedHours: number;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  clientName: string;
  budget: number;
  spentAmount: number;
  startDate: string;
  deadline: string;
  status: "Open" | "In Progress" | "Completed" | "On Hold";
  tasks: ProjectTask[];
  projectManager?: string;
  billingType?: "Fixed Price" | "Time & Material" | "Retainer";
}

export interface TimesheetEntry {
  id: string;
  employeeName: string;
  projectName: string;
  taskTitle: string;
  date: string;
  hours: number;
  billable: boolean;
  remarks: string;
}

// 3. Point of Sale (POS)
export interface POSCartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  gstRate: number;
}

export interface POSTransaction {
  id: string;
  receiptNumber: string;
  timestamp: string;
  cashierName: string;
  items: POSCartItem[];
  subtotal: number;
  taxAmount: number;
  grandTotal: number;
  paymentMode: "UPI / QR" | "Cash" | "Card" | "NetBanking";
  status: "Completed";
}

// 4. Banking & Reconciliation
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
  currentBalance: number;
  unreconciledBalance?: number;
  type: "Current" | "OD / CC" | "Escrow" | "Savings" | "Cash Credit" | "Overdraft";
}

export interface BankTransaction {
  id: string;
  date: string;
  referenceNo: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  reconciled: boolean;
  matchedInvoiceNo?: string;
  paymentMode?: "NEFT" | "RTGS" | "IMPS" | "UPI" | "Cheque" | "NACH";
  partyName?: string;
  chequeNo?: string;
}

// 5. Assets & Depreciation
export interface FixedAsset {
  id: string;
  assetCode: string;
  name: string;
  category: "Computer Hardware" | "Plant & Machinery" | "Office Furniture" | "Vehicles";
  purchaseDate: string;
  purchaseCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: "Straight Line (SLM)" | "Written Down Value (WDV)";
  accumulatedDepreciation: number;
  currentBookValue: number;
  status: "Active" | "Disposed" | "Written Off";
  tagNumber?: string;
  location?: string;
  vendorName?: string;
  invoiceReference?: string;
}

// 6. Helpdesk & Support Tickets
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  subject: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Open" | "In Progress" | "Waiting on Client" | "Resolved";
  assignedAgent: string;
  createdAt: string;
  slaHoursLeft: number;
  clientEmail?: string;
  clientPhone?: string;
  contactEmail?: string;
  contactPhone?: string;
  category?: "Technical" | "Billing" | "Feature" | "Implementation" | "Product Training" | "Bug Report" | "Hardware";
  description?: string;
  resolutionNotes?: string;
}

// ==========================================
// 7 NEW ENTERPRISE EXTENSIONS (SAP / Odoo / NetSuite)
// ==========================================

// 7. Quality Management & Inspection (QM)
export interface QualityParameter {
  name: string;
  standardValue: string;
  measuredValue: string;
  passed: boolean;
}

export interface QualityInspection {
  id: string;
  inspectionNo: string;
  inspectionType: "Incoming (GRN)" | "In-Process" | "Dispatch QC";
  itemName: string;
  lotBatchNo: string;
  inspectedBy: string;
  date: string;
  sampleSize: number;
  status: "Accepted" | "Rejected" | "Conditional Pass";
  parameters: QualityParameter[];
  vendorName?: string;
  inspectedQty?: number;
  acceptedQty?: number;
  rejectedQty?: number;
  capaRemarks?: string;
}

// 8. Fleet & Logistics Management (TMS)
export interface FleetVehicle {
  id: string;
  vehicleNo: string;
  model: string;
  type: "Heavy Commercial Truck" | "Medium Delivery Van" | "Pickup Container" | "Staff Fleet";
  driverName: string;
  driverPhone: string;
  fuelType: "Diesel" | "CNG" | "Electric";
  odometerKm: number;
  insuranceValidUntil: string;
  pucValidUntil: string;
  fitnessValidUntil: string;
  status: "Available" | "On Delivery" | "Under Maintenance";
  payloadCapacityMT?: number;
  fastagBalance?: number;
  nationalPermitValidUntil?: string;
  currentLocation?: string;
}

// 9. Subcontracting & Job Work (Indian GST Sec 143 / ITC-04)
export interface JobWorkOrder {
  id: string;
  challanNo: string; // Form GST ITC-04 delivery challan
  jobWorkerName: string;
  jobWorkerGstin: string;
  natureOfProcessing: string;
  dispatchedDate: string;
  statutoryDueDate: string; // 1 year for inputs, 3 years for capital goods
  inputItemName: string;
  inputQuantity: number;
  expectedOutputItem: string;
  receivedQuantity: number;
  scrapGenerated: number;
  status: "Material Sent" | "Partially Received" | "Closed / Completed";
  ewayBillNo?: string;
  assessmentValue?: number;
  processingRate?: number;
  scrapAllowancePercent?: number;
}

// 10. Subscriptions & Recurring AMC Invoicing
export interface SubscriptionRecord {
  id: string;
  contractNo: string;
  clientName: string;
  planName: string;
  billingFrequency: "Monthly" | "Quarterly" | "Annual";
  recurringAmount: number;
  gstRate: number;
  startDate: string;
  nextInvoiceDate: string;
  autoRenew: boolean;
  status: "Active" | "Paused" | "Cancelled";
  clientGstin?: string;
  clientEmail?: string;
  contactEmail?: string;
  contractDurationMonths?: number;
  paymentTermsDays?: number;
}

// 11. Employee Expenses & Reimbursements
export interface ExpenseClaim {
  id: string;
  claimNo: string;
  employeeName: string;
  category: "Travel & Fuel" | "Client Hospitality" | "Lodging & Food" | "Office Supplies";
  expenseDate: string;
  amount: number;
  merchantName: string;
  taxInvoiceAvailable: boolean;
  approvedBy?: string;
  paymentStatus: "Pending Approval" | "Approved" | "Reimbursed / Paid";
  merchantGstin?: string;
  taxAmount?: number;
  projectAllocation?: string;
  purposeNotes?: string;
}

// 12. Recruitment & Applicant Tracking System (ATS)
export interface JobCandidate {
  id: string;
  candidateName: string;
  jobRole: string;
  email: string;
  phone: string;
  experienceYears: number;
  appliedDate: string;
  stage: "Applied" | "Screening" | "Technical Interview" | "HR Round" | "Hired" | "Rejected";
  rating: 1 | 2 | 3 | 4 | 5;
  currentCtc?: number;
  expectedCtc?: number;
  noticePeriodDays?: number;
  currentEmployer?: string;
  skills?: string | string[];
}

// 13. Document Management & Legal Compliance Vault (DMS)
export interface VaultDocument {
  id: string;
  documentTitle: string;
  category: "Statutory & Tax" | "Company Legal" | "Vendor Contracts" | "Leases & Property";
  fileNumber: string;
  issueDate: string;
  expiryDate?: string;
  authority: string;
  verificationStatus: "Verified & Current" | "Renewal Pending" | "Permanent";
  description?: string;
  keywords?: string | string[];
  confidentiality?: "Public" | "Internal" | "Confidential" | "Board Only" | "Restricted";
  confidentialityLevel?: "Public" | "Internal" | "Restricted" | "Confidential" | "Board Only";
  lockerReference?: string;
  physicalLockerRef?: string;
}

// 14. Enterprise Accounting & Vouchers System (Indian Statutory ERP Master Engine)
export type BusyVoucherType =
  | "sales" // F8
  | "purchase" // F9
  | "payment" // F5
  | "receipt" // F6
  | "contra" // F4
  | "journal" // F7
  | "debit_note" // Ctrl+F9
  | "credit_note" // Ctrl+F8
  | "stock_transfer"; // Stock Transfer between Material Centers

export interface BusyBillSundry {
  id: string;
  type: "discount" | "freight" | "insurance" | "packaging" | "tds" | "tcs" | "roundoff";
  name: string;
  rate?: number;
  section?: string;
  amount: number;
}

export interface BusyVoucherItem {
  id: string;
  itemId?: string;
  itemName: string;
  itemGroup?: string;
  hsnCode: string;
  qty: number;
  uom: string;
  rate: number;
  gstRate: number; // 0, 5, 12, 18, 28
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  batchNo?: string;
  mfgDate?: string;
  expDate?: string;
  mrp?: number;
  materialCenter?: string;
}

export interface BusyVoucher {
  id: string;
  voucherNo: string;
  voucherType: BusyVoucherType;
  date: string;
  series: string; // e.g. "Main"
  partyId?: string;
  partyName: string;
  partyState: string;
  partyGstin?: string;
  isInterState: boolean;
  debitAccount?: string; // For Payment, Contra, Journal
  creditAccount?: string; // For Receipt, Contra, Journal
  items: BusyVoucherItem[];
  sundries: BusyBillSundry[];
  taxableAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  billRef?: string; // Bill-by-bill reference matching
  billRefType?: "New Ref" | "Agst Ref" | "Advance" | "On Account";
  materialCenter?: string;
  destMaterialCenter?: string;
  chequeNo?: string;
  chequeDate?: string;
  clearanceDate?: string;
  isReconciled?: boolean;
  isPDC?: boolean;
  dueDate?: string;
  narration: string;
  status: "Draft" | "Posted" | "Cancelled";
  irnStatus?: "Generated" | "Pending" | "Not Applicable";
}

export interface MaterialCenterMaster {
  id: string;
  name: string;
  code: string;
  address: string;
  isDefault: boolean;
  managerName?: string;
}

export interface ItemBatchRecord {
  id: string;
  itemId: string;
  itemName: string;
  batchNo: string;
  mfgDate: string;
  expDate: string;
  mrp: number;
  purchaseRate: number;
  currentQty: number;
  uom: string;
  materialCenter: string;
  status: "Active" | "Expiring Soon" | "Expired";
}

export interface BankReconciliationRecord {
  id: string;
  voucherNo: string;
  date: string;
  bankAccount: string;
  partyName: string;
  chequeNo: string;
  debitAmount: number;
  creditAmount: number;
  clearanceDate?: string;
  isCleared: boolean;
}

export interface PdcRecord {
  id: string;
  voucherNo: string;
  partyName: string;
  type: "Received" | "Issued";
  chequeNo: string;
  bankName: string;
  chequeDate: string;
  amount: number;
  status: "Pending" | "Cleared" | "Bounced" | "Discounted";
}

export interface InterestCalculationItem {
  partyName: string;
  billNo: string;
  billDate: string;
  dueDate: string;
  overdueDays: number;
  billAmount: number;
  interestRate: number; // e.g. 18% p.a.
  accruedInterest: number;
}

export interface BusyAccountMaster {
  id: string;
  name: string;
  printName: string;
  group:
    | "Sundry Debtors"
    | "Sundry Creditors"
    | "Bank Accounts"
    | "Cash-in-hand"
    | "Direct Expenses"
    | "Indirect Expenses"
    | "Direct Incomes"
    | "Indirect Incomes"
    | "Duties & Taxes"
    | "Capital Account"
    | "Loans (Liability)"
    | "Fixed Assets"
    | "Current Assets"
    | "Current Liabilities";
  state: string;
  stateCode: string;
  gstin?: string;
  pan?: string;
  creditLimit?: number;
  openingBalance: number;
  balanceType: "Dr" | "Cr";
  currentBalance: number;
  billByBill: boolean;
  email?: string;
  phone?: string;
  address?: string;
}

export interface BusyItemMaster {
  id: string;
  name: string;
  printName: string;
  group: string;
  uom: string;
  altUom?: string;
  conversionFactor?: number;
  taxCategory: "Exempt" | "GST 5%" | "GST 12%" | "GST 18%" | "GST 28%";
  gstRate: number;
  hsnCode: string;
  openingQty: number;
  purchaseRate: number;
  sellingPrice: number;
  currentQty: number;
  reorderLevel: number;
  valuationMethod: "FIFO" | "Weighted Average";
}

