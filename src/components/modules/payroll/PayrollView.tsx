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
} from "lucide-react";
import { Employee, SalarySlip, CompanyInfo } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface PayrollViewProps {
  employees: Employee[];
  salarySlips: SalarySlip[];
  company: CompanyInfo;
  onViewSlip: (slip: SalarySlip) => void;
}

export function PayrollView({
  employees,
  salarySlips,
  company,
  onViewSlip,
}: PayrollViewProps) {
  const [activeTab, setActiveTab] = useState<"slips" | "employees">("slips");

  const totalGrossPayroll = salarySlips.reduce((sum, s) => sum + s.grossEarnings, 0);
  const totalNetDisbursed = salarySlips.reduce((sum, s) => sum + s.netPayable, 0);
  const totalPfDeducted = salarySlips.reduce((sum, s) => sum + s.employeePF, 0);
  const totalTdsDeducted = salarySlips.reduce((sum, s) => sum + s.tdsDeduction, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgeDollarSign className="h-5 w-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              India Payroll & Statutory Deductions
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Employees Provident Fund (EPF), ESIC, State Professional Tax (PT), and Income Tax TDS under Indian salary compensation rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <FileCheck2 className="h-4 w-4" />
            EPF & ESIC Compliant (UAN Linked)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Monthly Gross Payroll</span>
          <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {formatINR(totalGrossPayroll)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Basic + HRA + Special Allowance</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Net Salary Disbursed</span>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatINR(totalNetDisbursed)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct Bank Transfer</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total PF (EPF) Withheld</span>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {formatINR(totalPfDeducted)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">To deposit on EPFO by 15th</p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <span className="text-xs text-slate-500 dark:text-slate-400">Salary TDS Withheld</span>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">
            {formatINR(totalTdsDeducted)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">For Form 24Q Quarterly Return</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("slips")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "slips"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <BadgeDollarSign className="h-4 w-4" />
          Monthly Salary Slips
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 transition-all ${
            activeTab === "employees"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400"
          }`}
        >
          <Users className="h-4 w-4" />
          Employee Master Directory ({employees.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "slips" ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase">
                <tr>
                  <th className="px-6 py-3">Slip No</th>
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-6 py-3">Month</th>
                  <th className="px-6 py-3">Gross Salary</th>
                  <th className="px-6 py-3">EPF</th>
                  <th className="px-6 py-3">Prof Tax (PT)</th>
                  <th className="px-6 py-3">TDS</th>
                  <th className="px-6 py-3">Net Disbursed</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {salarySlips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      {slip.slipNumber}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-900 dark:text-white">
                      {slip.employeeName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-300">
                      {slip.month} {slip.year}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                      {formatINR(slip.grossEarnings)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-blue-600 dark:text-blue-400">
                      {formatINR(slip.employeePF)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {formatINR(slip.professionalTax)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-purple-600 dark:text-purple-400">
                      {formatINR(slip.tdsDeduction)}
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatINR(slip.netPayable)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="h-3 w-3" />
                        Disbursed
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => onViewSlip(slip)}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium"
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
