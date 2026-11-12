"use client";

import React from "react";
import { X, Printer, Building2 } from "lucide-react";
import { SalarySlip, Employee, CompanyInfo } from "@/types/erp";
import { formatINR, numberToIndianWords } from "@/lib/utils";

interface PayslipModalProps {
  slip: SalarySlip | null;
  employee?: Employee;
  company: CompanyInfo;
  onClose: () => void;
}

export function PayslipModal({
  slip,
  employee,
  company,
  onClose,
}: PayslipModalProps) {
  if (!slip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-2xl my-8 overflow-hidden print:m-0 print:p-0 print:shadow-none print:w-full">
        {/* Controls */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
          <span className="font-bold text-slate-900">
            Payslip - {slip.employeeName} ({slip.month} {slip.year})
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print Payslip
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PAYSLIP */}
        <div className="p-8 text-xs font-sans space-y-6">
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h1 className="text-xl font-black text-slate-900 uppercase">
              {company.legalName}
            </h1>
            <p className="text-[11px] text-slate-600">
              {company.addressLine1}, {company.city}, {company.state} - {company.pincode}
            </p>
            <p className="font-bold text-sm tracking-wider uppercase mt-2 text-slate-800">
              PAYSLIP FOR THE MONTH OF {slip.month.toUpperCase()} {slip.year}
            </p>
          </div>

          {/* Employee & Bank Info Grid */}
          <div className="grid grid-cols-2 gap-4 border border-slate-300 p-4 text-[11px]">
            <div className="space-y-1">
              <div><strong>Employee Name:</strong> {slip.employeeName}</div>
              <div><strong>Designation:</strong> {employee?.designation || "Solutions Architect"}</div>
              <div><strong>Department:</strong> {employee?.department || "ERP Solutions"}</div>
              <div><strong>Date of Joining:</strong> {employee?.dateOfJoining || "2022-04-01"}</div>
            </div>
            <div className="space-y-1">
              <div><strong>PAN:</strong> {employee?.pan || "ABKPS4412F"}</div>
              <div><strong>UAN (PF Number):</strong> {employee?.uan || "100984512390"}</div>
              <div><strong>Bank Account:</strong> {employee?.bankAccount || "982001004512"}</div>
              <div><strong>Working / Present Days:</strong> {slip.workingDays} / {slip.presentDays}</div>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="border border-slate-300">
            <div className="grid grid-cols-2 border-b border-slate-300 font-bold bg-slate-100 text-[11px]">
              <div className="p-2 border-r border-slate-300">EARNINGS (INR)</div>
              <div className="p-2">DEDUCTIONS (STATUTORY INDIA)</div>
            </div>

            <div className="grid grid-cols-2 text-[11px] divide-x divide-slate-300">
              {/* Earnings */}
              <div className="p-3 space-y-1.5 font-mono">
                <div className="flex justify-between font-sans">
                  <span>Basic Salary</span>
                  <span className="font-mono">{formatINR(slip.basic)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>House Rent Allowance (HRA)</span>
                  <span className="font-mono">{formatINR(slip.hra)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>Special Allowance</span>
                  <span className="font-mono">{formatINR(slip.specialAllowance)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>Conveyance Allowance</span>
                  <span className="font-mono">{formatINR(slip.conveyance)}</span>
                </div>
              </div>

              {/* Deductions */}
              <div className="p-3 space-y-1.5 font-mono">
                <div className="flex justify-between font-sans">
                  <span>Provident Fund (EPF 12%)</span>
                  <span className="font-mono">{formatINR(slip.employeePF)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>ESIC (0.75%)</span>
                  <span className="font-mono">{formatINR(slip.employeeESIC)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>Professional Tax (PT - State)</span>
                  <span className="font-mono">{formatINR(slip.professionalTax)}</span>
                </div>
                <div className="flex justify-between font-sans">
                  <span>Income Tax (TDS u/s 192)</span>
                  <span className="font-mono">{formatINR(slip.tdsDeduction)}</span>
                </div>
              </div>
            </div>

            {/* Subtotals */}
            <div className="grid grid-cols-2 border-t border-slate-300 font-bold bg-slate-50 text-[11px]">
              <div className="p-2 flex justify-between border-r border-slate-300">
                <span>Total Gross Earnings:</span>
                <span className="font-mono">{formatINR(slip.grossEarnings)}</span>
              </div>
              <div className="p-2 flex justify-between">
                <span>Total Statutory Deductions:</span>
                <span className="font-mono text-red-600">-{formatINR(slip.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Box */}
          <div className="rounded border-2 border-slate-900 p-4 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Net Salary Disbursed (Take Home):
              </span>
              <p className="font-black text-xl text-slate-900 font-mono mt-0.5">
                {formatINR(slip.netPayable)}
              </p>
              <p className="text-[11px] text-slate-600 mt-1">
                {numberToIndianWords(slip.netPayable)}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                Transferred to Bank Account
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between pt-8 border-t border-slate-300 text-[10px] text-slate-500">
            <div>Employer Signature & Seal</div>
            <div>Employee Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}
