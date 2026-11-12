# ERPVibe India Enterprise Suite (Next.js 16 + React 19)

A comprehensive, production-grade Next.js enterprise ERP platform — **ERPVibe** — with complete **India Localization & Statutory Compliance** features.

---

## 🚀 Key Modules & Indian Statutory Features

### 1. 🇮🇳 India Compliance & GST Engine
- **e-Invoicing (IRN API Ready):** Generates 64-character SHA-256 IRN hash, Acknowledgement Number, Ack Date, and digitally signed QR code simulation. Full cancellation workflow (Rule 48(4) of CGST Rules).
- **Electronic Way Bills (e-Way Bill):** Generates 12-digit e-Way Bills with Part A & Part B vehicle details (`MH-02-AB-1234`), transporter IDs, distance calculations, and validity tracking for goods movement > ₹50,000.
- **GSTIN Lookup & Verification Tool:** Validates 15-character GSTIN format, extracts state code (e.g., 27 for Maharashtra, 29 for Karnataka, 07 for Delhi), PAN, taxpayer type (Regular/Composition), and mock portal registration status.
- **GSTR-1 & GSTR-3B Tax Filing Matrix:**
  - Table 4 B2B outward supplies, B2C supplies, and export tracking.
  - Direct **Export GSTR-1 JSON** button to download GSTN-compliant JSON files for upload to the GST Common Portal (`gst.gov.in`).
  - Net tax payable calculation after offsetting eligible Input Tax Credit (ITC).
- **14,000+ HSN & SAC Code Master:** Searchable directory with pre-configured GST rates (0%, 5%, 12%, 18%, 28%).
- **TDS & TCS Withholding Engine:** Interactive tax calculator for Indian Income Tax Act sections (194C, 194J, 194I, 194Q, 206C(1H)) with PAN verification (20% higher deduction under Section 206AA if PAN is missing).

### 2. 🧾 Sales Invoices & Print Engine
- **Automatic State Tax Resolution:**
  - Intra-State (e.g. Maharashtra to Maharashtra): Automatically splits into **CGST + SGST**.
  - Inter-State (e.g. Maharashtra to Karnataka): Automatically applies **IGST**.
- **Official Indian Tax Invoice Print Format:**
  - Original for Recipient banner.
  - Company Legal Name, Trade Name, GSTIN, PAN, CIN, MSME Udyam Number, LUT Number.
  - Line items with HSN codes, UOM, quantities, discounts, and tax breakup.
  - Indian numbering system formatting: ₹ Lakhs & Crores (`₹15,35,180.00`).
  - Total in Words (`INR Fifteen Lakh Thirty-Five Thousand One Hundred and Eighty Only`).
  - Bank NEFT/RTGS details (Account Number, IFSC, Branch).
  - MCA & GST terms and conditions with authorized signature block.

### 3. 📦 Stock & Inventory Management
- Product & Service master with SKU, HSN/SAC code, GST slab, and unit of measure (NOS, KGS, MTR, BOX, HRS, SET).
- Multi-warehouse inventory tracking (Mumbai Central, Delhi Hub, Bhiwandi Depot, Cloud Cluster).
- Automated low-stock reorder warnings when stock drops below threshold.
- Inventory valuation summary based on FIFO purchase cost.

### 4. 👥 CRM & Customer Master
- B2B & B2C customer records with GSTIN, State Code, Place of Supply, and Credit Limits.
- Outstanding receivables tracking.

### 5. 🚚 Procurement & Suppliers (MSME Ready)
- Supplier directory classified by MSME category (Micro, Small, Medium, Non-MSME) for compliance with the statutory 45-day payment rule under Section 43B(h) of the Income Tax Act.

### 6. 💼 Payroll & Statutory Deductions
- Employee Master with PAN, UAN (PF Number), ESIC, and bank account details.
- Monthly Salary Slip generator:
  - Earnings: Basic, HRA, Special Allowance, Conveyance.
  - Statutory Deductions: Employee PF (EPF 12%), ESIC, State Professional Tax (PT ₹200), and Salary TDS.
  - Net Take-Home Salary calculation with one-click print preview.

### 7. 🏛️ Indian Standard Chart of Accounts (COA)
- Structured hierarchical tree compliant with Schedule III of the Indian Companies Act 2013 (Application of Funds - Assets, Source of Funds - Liabilities & Equity, Income, Expenses).

### 8. 🛡️ MCA Mandatory Audit Trail (Companies Act 2013)
- Under MCA Notification G.S.R. 235(E) and Companies (Accounts) Rules 2014, records an immutable edit log of every record creation, update, user ID, IP address, and previous vs. new values.

---

## 💻 Local Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Keyboard shortcut: Press **Ctrl+K** (or **Cmd+K**) anytime to open the global command palette.

---

## 🚢 Deploying to Vercel

### Option 1: Using Vercel CLI (Fastest)

1. Open PowerShell or Command Prompt:
   ```powershell
   Set-Location "C:\Users\adfmin\Downloads\erpvibe"
   ```
2. Run:
   ```powershell
   npx vercel
   ```
3. Follow the quick prompts:
   - Link to existing project? **No (N)**
   - Project name? **erpvibe** (or your choice)
   - In which directory? **./**
   - Override settings? **No (N)**

For production deployment:
```powershell
npx vercel --prod
```

### Option 2: Deploying via GitHub / GitLab

1. Push your code to your GitHub repo:
   ```bash
   git remote add origin https://github.com/vipulbansal1224-wq/erpvibe.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Click **Deploy**. Vercel will automatically build and deploy the Next.js application!
