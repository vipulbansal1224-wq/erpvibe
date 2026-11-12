export type ModuleType =
  | "dashboard"
  | "invoices"
  | "gst-compliance"
  | "inventory"
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
  action: "CREATE" | "UPDATE" | "DELETE" | "IRN_GENERATED" | "EWAYBILL_CREATED";
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
  branch: string;
  currentBalance: number;
  unreconciledBalance: number;
  type: "Current" | "OD / CC" | "Escrow";
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
}
