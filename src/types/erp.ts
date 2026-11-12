export type ModuleType =
  | "dashboard"
  | "invoices"
  | "gst-compliance"
  | "inventory"
  | "customers"
  | "suppliers"
  | "purchase-orders"
  | "quotations"
  | "payroll"
  | "accounts"
  | "audit-trail"
  | "settings";

export type GSTType = "CGST+SGST" | "IGST" | "NIL" | "EXEMPT";

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
