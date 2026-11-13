"use client";

import React, { useState } from "react";
import {
  Building2,
  ShieldCheck,
  Save,
  CheckCircle2,
  Landmark,
  SlidersHorizontal,
  Database,
  Trash2,
  RefreshCw,
  Sparkles,
  Factory,
  ShoppingCart,
  FolderKanban,
  Boxes,
  LifeBuoy,
  CreditCard,
  BadgeIndianRupee,
  Users,
  Truck,
  BarChart3,
  Receipt,
  KeyRound,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Search,
  Plus,
  AlertCircle,
  XCircle,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import {
  CompanyInfo,
  ModuleSettings,
  AppUser,
  UserRole,
  ModuleType,
  ModulePermission,
} from "@/types/erp";
import { initialUsers } from "@/data/initialUsers";

interface CompanySettingsViewProps {
  company: CompanyInfo;
  moduleSettings: ModuleSettings;
  onUpdateCompany: (company: CompanyInfo) => void;
  onUpdateModuleSettings: (settings: ModuleSettings) => void;
  onResetToCleanSlate: () => void;
  onRestoreDemoData: () => void;
  users?: AppUser[];
  currentUser?: AppUser | null;
  onAddUser?: (user: AppUser) => void;
  onUpdateUser?: (user: AppUser) => void;
  onDeleteUser?: (id: string) => void;
}

export function CompanySettingsView({
  company,
  moduleSettings,
  onUpdateCompany,
  onUpdateModuleSettings,
  onResetToCleanSlate,
  onRestoreDemoData,
  users: propUsers,
  currentUser,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}: CompanySettingsViewProps) {
  const [activeTab, setActiveTab] = useState<"users" | "modules" | "profile" | "data">("users");
  const [formData, setFormData] = useState<CompanyInfo>(company);
  const [localSettings, setLocalSettings] = useState<ModuleSettings>(moduleSettings);
  const [savedAlert, setSavedAlert] = useState(false);
  const [cleanAlert, setCleanAlert] = useState(false);

  // User Management State
  const [userList, setUserList] = useState<AppUser[]>(propUsers && propUsers.length > 0 ? propUsers : initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // User Modal State
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formFullName, setFormFullName] = useState("");
  const [formUsername, setFormUsername] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("+91 ");
  const [formPassword, setFormPassword] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("Finance & Accounts Admin");
  const [formDepartment, setFormDepartment] = useState("Finance & Accounts");
  const [formStatus, setFormStatus] = useState<"Active" | "Inactive">("Active");
  const [formAllAccess, setFormAllAccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Granular Module Permission matrix (for custom roles)
  const defaultModulesList: { id: ModuleType; name: string; category: string }[] = [
    { id: "invoices", name: "Tax Invoices (B2B/B2C)", category: "Billing & Sales" },
    { id: "pos", name: "Point of Sale (POS)", category: "Billing & Sales" },
    { id: "quotations", name: "Quotations & Estimates", category: "Billing & Sales" },
    { id: "subscriptions", name: "Subscriptions & AMC", category: "Billing & Sales" },
    { id: "customers", name: "Customers (CRM)", category: "Billing & Sales" },
    { id: "busy-accounting", name: "Accounting & Vouchers (F1-F9)", category: "Financials" },
    { id: "banking", name: "Banking & Reconciliation", category: "Financials" },
    { id: "accounts", name: "Chart of Accounts", category: "Financials" },
    { id: "financial-reports", name: "Financial Reports & P&L", category: "Financials" },
    { id: "expenses", name: "Employee Expenses", category: "Financials" },
    { id: "assets", name: "Fixed Assets & Depr.", category: "Financials" },
    { id: "gst-compliance", name: "India GST & Compliance", category: "Statutory" },
    { id: "audit-trail", name: "MCA Audit Trail", category: "Statutory" },
    { id: "documents", name: "Legal Document Vault (DMS)", category: "Statutory" },
    { id: "inventory", name: "Stock & Item Master", category: "Supply Chain" },
    { id: "manufacturing", name: "Manufacturing & BOM", category: "Supply Chain" },
    { id: "quality", name: "Quality Inspection (QM)", category: "Supply Chain" },
    { id: "jobwork", name: "Subcontracting / ITC-04", category: "Supply Chain" },
    { id: "fleet", name: "Fleet & Logistics (TMS)", category: "Supply Chain" },
    { id: "suppliers", name: "Suppliers & MSME", category: "Supply Chain" },
    { id: "purchase-orders", name: "Purchase Orders", category: "Supply Chain" },
    { id: "payroll", name: "Payroll & Payslips", category: "Human Resources" },
    { id: "recruitment", name: "Recruitment & ATS", category: "Human Resources" },
    { id: "projects", name: "Projects & Timesheets", category: "Human Resources" },
    { id: "helpdesk", name: "Helpdesk & SLA Tickets", category: "Human Resources" },
    { id: "settings", name: "Settings & Access Control", category: "Administration" },
  ];

  const [permissionsMatrix, setPermissionsMatrix] = useState<Record<string, ModulePermission>>(() => {
    const init: Record<string, ModulePermission> = {};
    defaultModulesList.forEach((m) => {
      init[m.id] = { view: true, create: false, edit: false, delete: false };
    });
    return init;
  });

  const handleOpenNewUser = () => {
    setEditingUserId(null);
    setFormFullName("");
    setFormUsername("");
    setFormEmail("");
    setFormPhone("+91 ");
    setFormPassword("user@123");
    setFormRole("Finance & Accounts Admin");
    setFormDepartment("Finance & Accounts");
    setFormStatus("Active");
    setFormAllAccess(false);
    setShowPassword(false);
    setModalError(null);

    const init: Record<string, ModulePermission> = {};
    defaultModulesList.forEach((m) => {
      init[m.id] = { view: true, create: false, edit: false, delete: false };
    });
    setPermissionsMatrix(init);
    setShowUserModal(true);
  };

  const handleOpenEditUser = (user: AppUser) => {
    setEditingUserId(user.id);
    setFormFullName(user.fullName);
    setFormUsername(user.username);
    setFormEmail(user.email);
    setFormPhone(user.phone || "+91 ");
    setFormPassword(user.password);
    setFormRole(user.role);
    setFormDepartment(user.department);
    setFormStatus(user.status === "Active" ? "Active" : "Inactive");
    setFormAllAccess(user.allAccess);
    setShowPassword(false);
    setModalError(null);

    const existing: Record<string, ModulePermission> = {};
    defaultModulesList.forEach((m) => {
      existing[m.id] = user.permissions?.[m.id] || {
        view: user.allAccess,
        create: user.allAccess,
        edit: user.allAccess,
        delete: user.allAccess,
      };
    });
    setPermissionsMatrix(existing);
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!formFullName.trim() || !formUsername.trim() || !formPassword.trim()) {
      setModalError("Full Name, Username, and Password are required fields.");
      return;
    }

    const cleanUsername = formUsername.trim().toLowerCase();

    // Check duplicate username if new
    if (!editingUserId) {
      const exists = userList.some((u) => u.username.toLowerCase() === cleanUsername);
      if (exists) {
        setModalError("This username is already taken. Please choose another username.");
        return;
      }
    }

    const savedRecord: AppUser = {
      id: editingUserId || `USR-${Date.now().toString().slice(-4)}`,
      fullName: formFullName.trim(),
      username: cleanUsername,
      email: formEmail.trim(),
      phone: formPhone.trim(),
      password: formPassword.trim(),
      role: formRole,
      department: formDepartment.trim(),
      status: formStatus,
      allAccess: formAllAccess,
      permissions: formAllAccess ? undefined : permissionsMatrix,
      createdAt: editingUserId ? userList.find((u) => u.id === editingUserId)?.createdAt || "2026-04-01" : new Date().toISOString().split("T")[0],
      lastLoginAt: editingUserId ? userList.find((u) => u.id === editingUserId)?.lastLoginAt : undefined,
    };

    let updated: AppUser[];
    if (editingUserId) {
      updated = userList.map((u) => (u.id === editingUserId ? savedRecord : u));
      if (onUpdateUser) onUpdateUser(savedRecord);
    } else {
      updated = [...userList, savedRecord];
      if (onAddUser) onAddUser(savedRecord);
    }
    setUserList(updated);
    setShowUserModal(false);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleToggleUserStatus = (userId: string) => {
    if (userId === "USR-001") {
      alert("Cannot deactivate the primary root Super Admin.");
      return;
    }
    const updated = userList.map((u) =>
      u.id === userId
        ? { ...u, status: (u.status === "Active" ? "Inactive" : "Active") as "Active" | "Inactive" }
        : u
    );
    setUserList(updated);
    const target = updated.find((u) => u.id === userId);
    if (target && onUpdateUser) onUpdateUser(target);
  };

  const handleDeleteUserClick = (userId: string) => {
    if (userId === "USR-001") {
      alert("Cannot delete the primary root Super Admin.");
      return;
    }
    const target = userList.find((u) => u.id === userId);
    if (window.confirm(`Are you sure you want to permanently delete user "${target?.fullName}" (@${target?.username})?`)) {
      const updated = userList.filter((u) => u.id !== userId);
      setUserList(updated);
      if (onDeleteUser) onDeleteUser(userId);
    }
  };

  const filteredUsers = userList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleToggleModule = (key: keyof ModuleSettings) => {
    const updated = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(updated);
    onUpdateModuleSettings(updated);
  };

  const moduleItems: {
    key: keyof ModuleSettings;
    title: string;
    description: string;
    category: string;
    icon: any;
  }[] = [
    {
      key: "manufacturing",
      title: "Manufacturing & Production (BOM)",
      description: "Bill of materials, work orders, raw material consumption, and production line scheduling.",
      category: "Operations",
      icon: Factory,
    },
    {
      key: "quality",
      title: "Quality Management & Inspection (QM)",
      description: "Incoming GRN inspections, in-process tolerances, pre-dispatch quality certificates and non-conformance quarantine.",
      category: "Operations",
      icon: ShieldCheck,
    },
    {
      key: "fleet",
      title: "Fleet & Logistics Management (TMS)",
      description: "Commercial vehicle registry, driver assignments, fuel tracking, odometer logs, and insurance/fitness expiry alerts.",
      category: "Operations",
      icon: Truck,
    },
    {
      key: "jobwork",
      title: "Subcontracting & Job Work (Form GST ITC-04)",
      description: "GST Section 143 delivery challans, materials sent to processors, scrap accountability and 1-year return deadlines.",
      category: "Operations",
      icon: Factory,
    },
    {
      key: "subscriptions",
      title: "Subscriptions & Recurring AMC",
      description: "SaaS subscriptions, annual maintenance contracts, MRR revenue metrics, and auto GST recurring invoice generation.",
      category: "Sales",
      icon: Receipt,
    },
    {
      key: "pos",
      title: "Point of Sale (POS) Counter",
      description: "Fast retail register with touch grid, barcode search, dynamic UPI QR code, and receipt printing.",
      category: "Retail",
      icon: ShoppingCart,
    },
    {
      key: "projects",
      title: "Projects & Timesheet Billing",
      description: "Client milestones, consultant assignments, task kanban, and billable hour logging.",
      category: "Services",
      icon: FolderKanban,
    },
    {
      key: "banking",
      title: "Banking & Bank Reconciliation",
      description: "Multi-bank feeds (HDFC, ICICI, SBI) and 1-click matching of statement transactions against invoices.",
      category: "Finance",
      icon: CreditCard,
    },
    {
      key: "expenses",
      title: "Employee Expenses & Reimbursements",
      description: "Staff expense claims, travel/food allowance receipts, multi-tier approvals, and payroll reconciliation.",
      category: "Finance",
      icon: Receipt,
    },
    {
      key: "assets",
      title: "Fixed Assets & Depreciation (Schedule II)",
      description: "Automated Straight Line (SLM) and Written Down Value (WDV) depreciation under Companies Act 2013.",
      category: "Finance",
      icon: Boxes,
    },
    {
      key: "helpdesk",
      title: "Customer Support & SLA Helpdesk",
      description: "Client ticketing system with SLA timers, priority queues, and customer feedback resolution.",
      category: "Support",
      icon: LifeBuoy,
    },
    {
      key: "recruitment",
      title: "Recruitment & Applicant Tracking (ATS)",
      description: "Candidate pipeline, interview stage progression, star ratings, and direct transfer into payroll master.",
      category: "Human Resources",
      icon: Users,
    },
    {
      key: "documents",
      title: "Document Management & Legal Compliance Vault (DMS)",
      description: "AES-256 encrypted storage for PAN, CIN, GST certificates, factory licenses, leases and expiry alarms.",
      category: "Compliance",
      icon: ShieldCheck,
    },
    {
      key: "gstCompliance",
      title: "India GST & Statutory Compliance",
      description: "e-Invoicing (IRN), e-Way Bills, GSTR-1/3B JSON generator, HSN lookup, and TDS/TCS calculation.",
      category: "Statutory",
      icon: ShieldCheck,
    },
    {
      key: "payroll",
      title: "India Payroll & Deductions",
      description: "Statutory employee deductions: EPF (12%), ESIC, State Professional Tax (PT), and Salary TDS.",
      category: "Human Resources",
      icon: BadgeIndianRupee,
    },
    {
      key: "customers",
      title: "Customers & Quotations (CRM)",
      description: "Customer directory with GSTIN verification, credit limits, and commercial proposals.",
      category: "Sales",
      icon: Users,
    },
    {
      key: "suppliers",
      title: "Suppliers & MSME Purchasing",
      description: "Vendor master tagged by MSME category for compliance with statutory 45-day payment rules.",
      category: "Procurement",
      icon: Truck,
    },
    {
      key: "financialReports",
      title: "Financial Statements (P&L / Balance Sheet)",
      description: "Schedule III Balance Sheet, Profit & Loss statement, and Cash Flow statement with CSV export.",
      category: "Finance",
      icon: BarChart3,
    },
    {
      key: "auditTrail",
      title: "MCA Audit Trail (Edit Log)",
      description: "Companies Act 2013 mandatory audit log tracking every transaction change, IP, and timestamp.",
      category: "Compliance",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <SlidersHorizontal className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              System Settings & Feature Switchboard
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Customize ERPVibe to your exact business model: enable/disable any module, configure your company GSTIN, or reset to fresh production data.
          </p>
        </div>

        {savedAlert && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Settings Updated Live
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <KeyRound className="h-4 w-4 text-indigo-500" />
          User Logins & Role Permissions (RBAC)
          <span className="ml-1 rounded-full bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 text-[10px] text-indigo-700 dark:text-indigo-300 font-bold">
            {userList.length} Logins
          </span>
        </button>
        <button
          onClick={() => setActiveTab("modules")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "modules"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Enable / Disable Modules (Feature Toggles)
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "profile"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Building2 className="h-4 w-4" />
          Your Company & GSTIN Profile
        </button>
        <button
          onClick={() => setActiveTab("data")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all whitespace-nowrap ${
            activeTab === "data"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Database className="h-4 w-4" />
          Data Mode (Demo vs Fresh Clean Slate)
        </button>
      </div>

      {/* TAB 0: USER LOGINS & ACCESS CONTROL (RBAC) */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* Banner & Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-indigo-900/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Role-Based Access Control (RBAC)
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AES-256 Vault Ready
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <KeyRound className="w-6 h-6 text-indigo-400" />
                User Logins & Permission Rights Manager
              </h3>
              <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
                Create new logins, grant All Access or customize granular rights (View, Create, Modify, Delete) across all 27 ERP modules, edit passwords, and manage active sessions.
              </p>
            </div>
            <button
              onClick={handleOpenNewUser}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-indigo-600/30 transition-all shrink-0"
            >
              <UserPlus className="h-4 w-4" />
              Create New Login
            </button>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Total Registered Logins</span>
                <Users className="h-4 w-4 text-blue-500" />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {userList.length}
              </p>
              <span className="text-[10px] text-slate-400">Authorized corporate logins</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Active Logins</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {userList.filter((u) => u.status === "Active").length}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Permitted to enter ERP</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Super Admins (All Access)</span>
                <ShieldCheck className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {userList.filter((u) => u.allAccess).length}
              </p>
              <span className="text-[10px] text-slate-400">Unrestricted module access</span>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>MCA Edit Log Tracking</span>
                <Lock className="h-4 w-4 text-purple-500" />
              </div>
              <p className="mt-2 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                100%
              </p>
              <span className="text-[10px] text-purple-500 font-medium">Rule 3(1) Compliant Audit</span>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Name, Username, Role or Email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter Role:</span>
              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              >
                <option value="all">All Roles</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Finance & Accounts Admin">Finance & Accounts Admin</option>
                <option value="Sales & Billing Manager">Sales & Billing Manager</option>
                <option value="Inventory & Store Incharge">Inventory & Store Incharge</option>
                <option value="HR & Payroll Manager">HR & Payroll Manager</option>
                <option value="Statutory Auditor">Statutory Auditor</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">User & Login ID</th>
                    <th className="px-5 py-3.5">Role & Department</th>
                    <th className="px-5 py-3.5">Contact (Email & Phone)</th>
                    <th className="px-5 py-3.5">Access Scope</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5">Last Login</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((user) => {
                    const isRootAdmin = user.id === "USR-001";
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-600 text-white font-black text-xs shadow-sm shrink-0">
                              {user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                {user.fullName}
                                {isRootAdmin && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold px-1.5 py-0.2 rounded border border-amber-500/30">
                                    ROOT
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                  @{user.username}
                                </span>
                                <span className="text-[10px] text-slate-400">• Created {user.createdAt}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                              user.role === "Super Admin"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                                : user.role.includes("Finance")
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : user.role.includes("Sales")
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                : user.role.includes("Inventory")
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            {user.role}
                          </span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{user.department}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800 dark:text-slate-200">{user.email}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user.phone || "—"}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          {user.allAccess ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              All Access (27 Modules)
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                <SlidersHorizontal className="h-3 w-3" />
                                Custom Permissions
                              </span>
                              <p className="text-[10px] text-slate-400">
                                {Object.keys(user.permissions || {}).length} modules configured
                              </p>
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleUserStatus(user.id)}
                            title="Click to toggle Active / Inactive"
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold transition-all border ${
                              user.status === "Active"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-200"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border-slate-300 hover:bg-slate-300"
                            }`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                            {user.status}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-[10px]">
                          {user.lastLoginAt ? user.lastLoginAt : "Never logged in"}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Modify Login & Permissions"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {!isRootAdmin && (
                              <button
                                onClick={() => handleDeleteUserClick(user.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                                title="Delete Login"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                        No user logins found matching your filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: MODULE SWITCHBOARD */}
      {activeTab === "modules" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span>
                <strong>Tailor ERPVibe to your business:</strong> Turn off modules your company doesn't need (e.g. disable Manufacturing if you are a Service business, or disable POS if you are pure B2B).
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleItems.map((item) => {
              const Icon = item.icon;
              const isEnabled = localSettings[item.key];
              return (
                <div
                  key={item.key}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    isEnabled
                      ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                      : "border-slate-100 dark:border-slate-800/40 bg-slate-50/60 dark:bg-slate-900/40 opacity-75"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isEnabled
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                          {item.title}
                        </h4>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded text-slate-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleModule(item.key)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY PROFILE */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Configure Your Registered Organization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Company Legal Name (MCA Registered) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  placeholder="e.g. My Real Company Private Limited"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Brand / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tradeName}
                  onChange={(e) => setFormData({ ...formData, tradeName: e.target.value })}
                  placeholder="e.g. MyBrand Solutions"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Your GSTIN (15 Digits) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                  placeholder="e.g. 07AAAAA0000A1Z5"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Permanent Account Number (PAN) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={formData.pan}
                  onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                  placeholder="e.g. AAAAA0000A"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold uppercase"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Corporate Identification Number (CIN)
                </label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value.toUpperCase() })}
                  placeholder="e.g. U72900DL2023PTC123456"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  MSME Udyam Registration Number
                </label>
                <input
                  type="text"
                  value={formData.msmeUdyam}
                  onChange={(e) => setFormData({ ...formData, msmeUdyam: e.target.value })}
                  placeholder="e.g. UDYAM-DL-01-0012345"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Address & Bank Details */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Office Address & Bank Details (Printed on Invoices)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="col-span-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Office Address</label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">City & Pincode</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-28 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">State & 2-Digit GST Code</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.stateCode}
                    onChange={(e) => setFormData({ ...formData, stateCode: e.target.value })}
                    className="w-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Bank Name & Branch</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Account Number & IFSC</label>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono"
                  />
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-xs font-bold shadow-md shadow-blue-500/20"
            >
              <Save className="h-4 w-4" />
              Save Company Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: DATA & DEMO MANAGEMENT */}
      {activeTab === "data" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Production Data Mode vs. Demo Showcase
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You can switch between pre-loaded demo transactions (used to preview charts, invoices, and reports) and a fresh, blank ledger ready for your real business operations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <h4 className="font-bold text-xs text-red-900 dark:text-red-200">
                    Switch to Clean Slate (Blank Database)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Clears all sample invoices, dummy stock, and demo transactions so you can start recording real invoices and items for your company.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onResetToCleanSlate();
                    setCleanAlert(true);
                    setTimeout(() => setCleanAlert(false), 3000);
                  }}
                  className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
                >
                  Clear Demo Data & Start Fresh
                </button>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  <h4 className="font-bold text-xs text-blue-900 dark:text-blue-200">
                    Load Demo Showcase Data
                  </h4>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Repopulates realistic enterprise transactions, Indian clients (TCS, Infosys, Reliance), invoices, and charts to showcase ERPVibe to customers.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onRestoreDemoData();
                    setCleanAlert(true);
                    setTimeout(() => setCleanAlert(false), 3000);
                  }}
                  className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold shadow-sm"
                >
                  Populate Demo Showcase Data
                </button>
              </div>
            </div>

            {cleanAlert && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Ledger updated successfully!
              </div>
            )}
          </div>
        </div>
      )}

      {/* USER CREATE / EDIT MODAL */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] flex flex-col my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingUserId ? "Edit User Login & Permissions" : "Create New Corporate Login"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Role-Based Access Control (RBAC) & Authentication Gateway
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="my-3 p-3 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs flex items-center gap-2 shrink-0">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 overflow-y-auto pr-1 flex-1 py-4">
              {/* Credentials Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formFullName}
                    onChange={(e) => setFormFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Username (Login Handle) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">@</span>
                    <input
                      type="text"
                      placeholder="rahul.s"
                      value={formUsername}
                      onChange={(e) => setFormUsername(e.target.value.toLowerCase().replace(/\s+/g, ""))}
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="user@apextech.in"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone #
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98..."
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Login Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormPassword(`EV@${Math.floor(1000 + Math.random() * 9000)}#IN`)}
                      className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <KeyRound className="h-3 w-3" />
                      Auto-generate
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      className="w-full px-3 py-2 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Designated Corporate Role *
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-medium"
                  >
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Finance & Accounts Admin">Finance & Accounts Admin</option>
                    <option value="Sales & Billing Manager">Sales & Billing Manager</option>
                    <option value="Inventory & Store Incharge">Inventory & Store Incharge</option>
                    <option value="HR & Payroll Manager">HR & Payroll Manager</option>
                    <option value="Statutory Auditor">Statutory Auditor (External CA / Auditor)</option>
                    <option value="Read-Only Operator">Read-Only Operator</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Department / Branch
                  </label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Account Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="Active">Active (Permitted to Login)</option>
                    <option value="Inactive">Inactive (Access Suspended)</option>
                  </select>
                </div>
              </div>

              {/* All Access Toggle Switch */}
              <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Grant All Access (Unrestricted Admin Rights)
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Super Admin privilege: bypasses permission filters, allows View, Create, Modify, and Delete on all 27 ERP modules.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formAllAccess}
                      onChange={(e) => setFormAllAccess(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Granular Permissions Matrix */}
              {!formAllAccess && (
                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Module-by-Module Permission Matrix
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Configure specific permissions: View, Create, Modify, and Delete
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...permissionsMatrix };
                          Object.keys(updated).forEach((k) => {
                            updated[k] = { view: true, create: false, edit: false, delete: false };
                          });
                          setPermissionsMatrix(updated);
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      >
                        All Read-Only
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...permissionsMatrix };
                          Object.keys(updated).forEach((k) => {
                            updated[k] = { view: true, create: true, edit: true, delete: false };
                          });
                          setPermissionsMatrix(updated);
                        }}
                        className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950 text-[10px] font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-200"
                      >
                        All Read/Write
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...permissionsMatrix };
                          Object.keys(updated).forEach((k) => {
                            updated[k] = { view: false, create: false, edit: false, delete: false };
                          });
                          setPermissionsMatrix(updated);
                        }}
                        className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-500 hover:bg-slate-200"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Module / Section</th>
                          <th className="px-3 py-2 text-center">View</th>
                          <th className="px-3 py-2 text-center">Create</th>
                          <th className="px-3 py-2 text-center">Edit</th>
                          <th className="px-3 py-2 text-center">Delete</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {defaultModulesList.map((m) => {
                          const p = permissionsMatrix[m.id] || { view: false, create: false, edit: false, delete: false };
                          return (
                            <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="px-3 py-2">
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</p>
                                <span className="text-[10px] text-slate-400">{m.category}</span>
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.view}
                                  onChange={(e) =>
                                    setPermissionsMatrix({
                                      ...permissionsMatrix,
                                      [m.id]: { ...p, view: e.target.checked },
                                    })
                                  }
                                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.create}
                                  onChange={(e) =>
                                    setPermissionsMatrix({
                                      ...permissionsMatrix,
                                      [m.id]: { ...p, create: e.target.checked, view: e.target.checked ? true : p.view },
                                    })
                                  }
                                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.edit}
                                  onChange={(e) =>
                                    setPermissionsMatrix({
                                      ...permissionsMatrix,
                                      [m.id]: { ...p, edit: e.target.checked, view: e.target.checked ? true : p.view },
                                    })
                                  }
                                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={p.delete}
                                  onChange={(e) =>
                                    setPermissionsMatrix({
                                      ...permissionsMatrix,
                                      [m.id]: { ...p, delete: e.target.checked, view: e.target.checked ? true : p.view },
                                    })
                                  }
                                  className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/30"
                >
                  {editingUserId ? "Update User & Permissions" : "Save User Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
