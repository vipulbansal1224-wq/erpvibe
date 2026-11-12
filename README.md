# ERPVibe India Enterprise Suite (Next.js 16 + React 19)

A comprehensive, production-grade, enterprise-scale ERP platform — **ERPVibe** — combining the best capabilities of **SAP S/4HANA, Frappe ERPNext, Odoo, Oracle NetSuite, and Zoho Books** with full **India Localization & Statutory Compliance** features.

---

## 🚀 Complete Enterprise Modules

### 1. 🏭 Manufacturing & Production (BOM & Work Orders)
- **Multi-Level Bill of Materials (BOM):** Raw materials, components, unit costs, operations & labor costs, scrap percentages, and total production cost calculations.
- **Production Work Orders:** Quantity to produce, progress tracking (% completion), scheduled start & target completion dates, warehouse allocation, and real-time status (Planned, In Progress, Completed).

### 2. 📁 Projects & Billable Timesheets
- **Client Project Tracking:** Budget vs. Actual spend, cost realization margins, deadlines, and milestones.
- **Task Management:** High/Medium/Low priorities, assigned consultants, logged vs. estimated hours.
- **Timesheets Engine:** Daily time logging, billable vs non-billable tracking directly linkable to client invoices and payroll.

### 3. 🛒 Point of Sale (POS) Cashier Terminal
- **Fast Retail Register:** Instant barcode/SKU product catalog search, touch-to-add cart.
- **Dynamic UPI QR Code:** Generates live UPI QR codes for instant cashier settlement via PhonePe, Google Pay, and Paytm.
- **Multi-Mode Settlement:** Cash, Card, and UPI with real-time receipt printing and shift session tracking.

### 4. 💳 Banking & Automated Bank Reconciliation
- **Multi-Account Feeds:** Current Accounts and Cash Credit / Overdraft accounts (HDFC, ICICI, SBI).
- **Interactive 1-Click Bank Reconciliation:** Match bank statement transactions (NEFT, RTGS, IMPS, UPI, Cheques) directly against sales invoices and purchase bills.

### 5. 📦 Fixed Assets & Depreciation Schedule (Schedule II)
- **Enterprise Fixed Asset Register:** Gross block, accumulated depreciation, and net book value.
- **Statutory Depreciation Engine:** Straight Line Method (SLM) and Written Down Value (WDV) compliant with Schedule II of the Indian Companies Act 2013 and Section 32 of the Income Tax Act.

### 6. 🛟 Helpdesk & SLA Support Ticketing
- **Enterprise SLA Ticketing:** Priority queues (Urgent, High, Medium, Low), SLA countdown timers, assigned agents, and resolution tracking.

### 7. 📊 Financial Statements & Business Analytics
- **Profit & Loss Statement (P&L):** Revenue from operations, procurement costs, gross profit, EBITDA, depreciation, PBT, corporate tax provision, and Net Profit After Tax (PAT).
- **Balance Sheet (Schedule III Format):** Application of Funds (Non-Current & Current Assets) vs. Source of Funds (Shareholders Equity & Current Liabilities).
- **Cash Flow Statement:** Operating, Investing, and Financing cash flows using the direct method.
- **Aged Debtors Analysis:** Accounts receivable aging buckets (0-30 days, 31-60 days, 61-90 days, 90+ days overdue).
- **Direct CSV/Excel Export:** One-click download for accountants and statutory auditors.

### 8. 🇮🇳 India Compliance & GST Hub
- **e-Invoicing (IRN API Ready):** Generates 64-character SHA-256 IRN hash, Acknowledgement Number, Ack Date, and digitally signed QR code simulation. Full cancellation workflow (Rule 48(4) of CGST Rules).
- **Electronic Way Bills (e-Way Bill):** Generates 12-digit e-Way Bills with Part A & Part B vehicle details (`MH-02-AB-1234`), transporter IDs, distance calculations, and validity tracking for goods movement > ₹50,000.
- **GSTIN Lookup & Verification Tool:** Validates 15-character GSTIN format, extracts state code (e.g., 27 for Maharashtra, 29 for Karnataka, 07 for Delhi), PAN, taxpayer type (Regular/Composition), and mock portal registration status.
- **GSTR-1 & GSTR-3B Tax Filing Matrix:** Table 4 B2B outward supplies, B2C supplies, and export tracking with direct **Export GSTR-1 JSON** for the GST Common Portal.
- **14,000+ HSN & SAC Code Master:** Searchable directory with pre-configured GST rates (0%, 5%, 12%, 18%, 28%).
- **TDS & TCS Withholding Engine:** Interactive tax calculator for Indian Income Tax Act sections (194C, 194J, 194I, 194Q, 206C(1H)) with PAN verification (20% higher deduction under Section 206AA if PAN is missing).

### 9. 🧾 Sales Invoices & Print Engine
- **Automatic State Tax Resolution:** Intra-State (CGST + SGST) vs Inter-State (IGST).
- **Official Indian Tax Invoice Print Format:** "Original for Recipient", PAN, CIN, GSTIN, MSME Udyam, bank details, Indian numbering system (`₹15,35,180.00`), total in words, and authorized signature.

### 10. 👥 CRM & Procurement (MSME Ready)
- Customer directory with GSTIN, credit limits, and outstanding receivables.
- Suppliers classified by MSME category (Micro, Small, Medium, Non-MSME) for compliance with Section 43B(h) 45-day payment statutory rule.

### 11. 💼 Payroll & Statutory Deductions
- Employee Master with PAN, UAN (PF), ESIC, and bank account details.
- Monthly Salary Slip generator: Basic, HRA, Special Allowance, Employee PF (12%), ESIC, Professional Tax (PT ₹200), and Salary TDS with printable payslip format.

### 12. 🏛️ Indian Standard Chart of Accounts (COA)
- Structured hierarchical tree compliant with Schedule III of the Indian Companies Act 2013.

### 13. 🛡️ MCA Mandatory Audit Trail (Companies Act 2013)
- Under MCA Notification G.S.R. 235(E) and Companies (Accounts) Rules 2014, records an immutable edit log of every record creation, update, user ID, IP address, and previous vs. new values.

---

## 💻 Local Development

Run the development server:

```powershell
Set-Location "C:\Users\adfmin\Downloads\erpvibe"
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Keyboard shortcut: Press **Ctrl+K** (or **Cmd+K**) anytime to open the global command palette.

---

## 🚢 Deploying to Vercel

```powershell
Set-Location "C:\Users\adfmin\Downloads\erpvibe"
npx vercel --prod
```
Or connect your GitHub repository [https://github.com/vipulbansal1224-wq/erpvibe.git](https://github.com/vipulbansal1224-wq/erpvibe.git) to Vercel for automatic continuous deployments!
