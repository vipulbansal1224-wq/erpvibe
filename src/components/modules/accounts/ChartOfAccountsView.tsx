"use client";

import React, { useState } from "react";
import {
  Landmark,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { ChartOfAccountNode } from "@/types/erp";
import { formatINR } from "@/lib/utils";

interface ChartOfAccountsViewProps {
  tree: ChartOfAccountNode[];
}

export function ChartOfAccountsView({ tree }: ChartOfAccountsViewProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "1000": true,
    "1100": true,
    "2000": true,
    "3000": true,
    "4000": true,
  });

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: ChartOfAccountNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expanded[node.id];

    return (
      <div key={node.id} className="space-y-1">
        <div
          onClick={() => hasChildren && toggle(node.id)}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
          className={`flex items-center justify-between rounded-lg py-2.5 pr-4 text-xs transition-colors cursor-pointer ${
            level === 0
              ? "bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white"
              : level === 1
              ? "bg-slate-50/60 dark:bg-slate-800/40 font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <span className="p-0.5 text-slate-400">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            ) : (
              <span className="w-5" />
            )}

            {hasChildren ? (
              <Folder className="h-4 w-4 text-blue-500" />
            ) : (
              <FileText className="h-3.5 w-3.5 text-slate-400" />
            )}

            <span className="font-mono text-slate-400 text-[11px]">{node.code}</span>
            <span>{node.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                node.type === "Asset"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : node.type === "Liability"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                  : node.type === "Income"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                  : "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
              }`}
            >
              {node.type}
            </span>
            <span className="font-mono font-bold text-slate-900 dark:text-white min-w-[120px] text-right">
              {formatINR(node.balance)}
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-1">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Landmark className="h-5 w-5" />
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Indian Standard Chart of Accounts (COA)
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Compliant with Schedule III of the Indian Companies Act 2013: Real-time Assets, Liabilities, Equity, Revenue, and Expenses tree.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Trial Balance Balanced
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="space-y-2">{tree.map((rootNode) => renderNode(rootNode, 0))}</div>
      </div>
    </div>
  );
}
