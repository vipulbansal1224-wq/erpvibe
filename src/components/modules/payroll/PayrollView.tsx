"use client";

import React, { useState } from "react";
import {
  BadgeDollarSign,
  Users,
  Eye,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { Employee, SalarySlip, CompanyInfo } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface PayrollViewProps {
  employees: Employee[];
  salarySlips: SalarySlip[];
  company: CompanyInfo;
  onViewSlip: (slip: SalarySlip) => void;
  onAddEmployee?: (emp: Employee) => void;
  onUpdateEmployee?: (emp: Employee) => void;
  onDeleteEmployee?: (id: string) => void;
}

export function PayrollView({
  employees,
  salarySlips,
  company,
  onViewSlip,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}: PayrollViewProps) {
  const [activeTab, setActiveTab] = useState<"slips" | "employees">("slips");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for employee
  const [empCode, setEmpCode] = useState(`EMP-${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("Software Engineer");
  const [department, setDepartment] = useState("Engineering");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [pan, setPan] = useState("ABCDE1234F");
  const [uan, setUan] = useState("101234567890");
  const [bankAccount, setBankAccount] = useState("50200012345678");
  const [bankIfsc, setBankIfsc] = useState("HDFC0000240");
  const [grossSalary, setGrossSalary] = useState(85000);

  const totalGrossPayroll = salarySlips.reduce((sum, s) => sum + s.grossEarnings, 0);
  const totalNetDisbursed = salarySlips.reduce((sum, s) => sum + s.netPayable, 0);
  const totalPfDeducted = salarySlips.reduce((sum, s) => sum + s.employeePF, 0);
  const totalTdsDeducted = salarySlips.reduce((sum, s) => sum + s.tdsDeduction, 0);

  const handleOpenNew = () => {
    setEditingId(null);
    setEmpCode(`EMP-${Math.floor(100 + Math.random() * 900)}`);
    setName("");
    setDesignation("Software Engineer");
    setDepartment("Engineering");
    setGrossSalary(85000);
    setShowModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setEmpCode(emp.empCode);
    setName(emp.name);
    setDesignation(emp.designation);
    setDepartment(emp.department);
    setJoiningDate(emp.dateOfJoining);
    setPan(emp.pan);
    setUan(emp.uan);
    setBankAccount(emp.bankAccount);
    setBankIfsc(emp.bankIfsc);
    setGrossSalary(emp.grossSalary);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const basic = Math.round(grossSalary * 0.5);
    const hra = Math.round(grossSalary * 0.3);
    const remaining = grossSalary - basic - hra;

    const record: Employee = {
      id: editingId || `EMP-${Date.now()}`,
      empCode,
      name,
      designation,
      department,
      dateOfJoining: joiningDate,
      pan,
      uan,
      esicNo: "N/A (Exempt > 21k)",
      bankAccount,
      bankIfsc,
      grossSalary: Number(grossSalary) || 0,
      basicSalary: basic,
      hra,
      specialAllowance: Math.round(remaining * 0.7),
      conveyance: Math.round(remaining * 0.3),
      status: "Active",
    };

    if (editingId && onUpdateEmployee) {
      onUpdateEmployee(record);
    } else if (onAddEmployee) {
      onAddEmployee(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgeDollarSign className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              India Payroll & Statutory Deductions
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Form 16 ready payroll: Provident Fund (EPF 12%), ESIC (0.75%/3.25%), State Professional Tax (PT), and TDS under Section 192.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActiveTab("slips")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "slips"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Salary Slips ({salarySlips.length})
          </button>
          <button
            onClick={() => setActiveTab("employees")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "employees"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
          >
            Employee Directory ({employees.length})
          </button>
          <button
            onClick={handleOpenNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Gross Monthly CTC</span>
            <BadgeDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {formatINR(totalGrossPayroll)}
          </p>
          <span className="text-[11px] text-slate-400">Total company payout</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Net Disbursed</span>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatINR(totalNetDisbursed)}
          </p>
          <span className="text-[11px] text-blue-500 font-medium">Credited to Bank</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>EPF Challan Due (12%)</span>
            <ShieldCheck className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatINR(totalPfDeducted * 2)}
          </p>
          <span className="text-[11px] text-purple-500 font-medium">Employee + Employer</span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Salary TDS (Sec 192)</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {formatINR(totalTdsDeducted)}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Due 7th of Month</span>
        </div>
      </div>

      {/* Content Tabs */}
      {activeTab === "slips" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3">Slip # / Month</th>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3 text-right">Gross Salary</th>
                  <th className="px-6 py-3 text-right">EPF (12%)</th>
                  <th className="px-6 py-3 text-right">TDS (192)</th>
                  <th className="px-6 py-3 text-right">Net Payable</th>
                  <th className="px-6 py-3">Disbursement</th>
                  <th className="px-6 py-3 text-right">Official Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salarySlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      <div>{slip.slipNumber}</div>
                      <span className="text-[10px] text-slate-400">{slip.month}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{slip.employeeName}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{slip.employeeId}</span>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right text-slate-700 dark:text-slate-300">
                      {formatINR(slip.grossEarnings)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right text-red-600 dark:text-red-400">
                      -{formatINR(slip.employeePF)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right text-red-600 dark:text-red-400">
                      -{formatINR(slip.tdsDeduction)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(slip.netPayable)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Transferred
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => onViewSlip(slip)}
                        className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3">Emp Code</th>
                  <th className="px-6 py-3">Full Name & Designation</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">PAN & UAN</th>
                  <th className="px-6 py-3">Bank Details</th>
                  <th className="px-6 py-3">Gross Salary</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      {emp.empCode}
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{emp.name}</p>
                      <p className="text-[10px] text-slate-500">{emp.designation}</p>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                      {emp.department}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px]">
                      <p>PAN: {emp.pan}</p>
                      <p className="text-slate-500">UAN: {emp.uan}</p>
                    </td>
                    <td className="px-6 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      <p>A/C: {emp.bankAccount}</p>
                      <p className="text-slate-400">IFSC: {emp.bankIfsc}</p>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {formatINR(emp.grossSalary)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                          title="Edit Employee"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {onDeleteEmployee && (
                          <button
                            onClick={() => onDeleteEmployee(emp.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              {editingId ? "Edit Employee Master Record" : "Enroll New Employee into Payroll"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Employee Legal Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Gross Salary CTC (₹)
                  </label>
                  <input
                    type="number"
                    value={grossSalary}
                    onChange={(e) => setGrossSalary(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    PAN Card #
                  </label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    EPFO UAN #
                  </label>
                  <input
                    type="text"
                    value={uan}
                    onChange={(e) => setUan(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bank Account #
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  {editingId ? "Update Employee" : "Enroll Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
