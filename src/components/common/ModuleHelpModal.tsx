"use client";

import React, { useState } from "react";
import {
  X,
  HelpCircle,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Edit3,
  Trash2,
  ShieldCheck,
  Lightbulb,
  Globe,
  Printer,
  ChevronRight,
  Search,
} from "lucide-react";
import { moduleGuides, ModuleGuide } from "@/data/moduleGuides";
import { ModuleType } from "@/types/erp";

interface ModuleHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: ModuleType;
}

export function ModuleHelpModal({
  isOpen,
  onClose,
  activeModule,
}: ModuleHelpModalProps) {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(activeModule);
  const [languageMode, setLanguageMode] = useState<"both" | "en" | "hi">("both");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with active module when opened
  React.useEffect(() => {
    if (activeModule && moduleGuides[activeModule]) {
      setSelectedModuleId(activeModule);
    }
  }, [activeModule, isOpen]);

  if (!isOpen) return null;

  const guide: ModuleGuide = moduleGuides[selectedModuleId] || moduleGuides["dashboard"];

  const allGuideEntries = Object.values(moduleGuides).sort((a, b) => a.number - b.number);

  const filteredGuides = allGuideEntries.filter(
    (g) =>
      g.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.titleHi.includes(searchQuery) ||
      g.number.toString().includes(searchQuery)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 border border-amber-500/30">
                  MODULE #{guide.number}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Interactive Help & Workflow Manual / सहायता संदर्शिका
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                {guide.number}. {guide.titleEn}
              </h2>
              <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {guide.titleHi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Language Selector */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setLanguageMode("both")}
                className={`rounded px-2.5 py-1 transition ${
                  languageMode === "both"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-blue-500"
                }`}
              >
                द्विभाषी (Both)
              </button>
              <button
                onClick={() => setLanguageMode("hi")}
                className={`rounded px-2.5 py-1 transition ${
                  languageMode === "hi"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-amber-500"
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguageMode("en")}
                className={`rounded px-2.5 py-1 transition ${
                  languageMode === "en"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                English
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Module Switcher Ribbon */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
            <span className="text-[11px] uppercase tracking-wider text-slate-400">Jump to Module:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
            {allGuideEntries.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedModuleId(item.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedModuleId === item.id
                    ? "bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60"
                }`}
                title={`${item.number}. ${item.titleEn} (${item.titleHi})`}
              >
                {item.number}. {item.titleEn.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Summary / Tagline Card */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 p-5 space-y-2">
            {(languageMode === "both" || languageMode === "en") && (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                <span className="font-bold text-amber-700 dark:text-amber-400 mr-2">Overview:</span>
                {guide.descriptionEn}
              </p>
            )}
            {(languageMode === "both" || languageMode === "hi") && (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed border-t border-amber-200/60 dark:border-amber-900/40 pt-2">
                <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">विवरण (हिन्दी):</span>
                {guide.descriptionHi}
              </p>
            )}
          </div>

          {/* Section 1: How It Works / Step-by-Step Workflow */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white text-xs font-black">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                How It Works & Step-by-Step Workflow / यह कैसे काम करता है
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {guide.workflowSteps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm hover:border-blue-400 transition"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold border border-blue-200 dark:border-blue-800">
                      #{step.step}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {step.titleEn}
                    </h4>
                  </div>
                  
                  {(languageMode === "both" || languageMode === "en") && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {step.descEn}
                    </p>
                  )}

                  {(languageMode === "both" || languageMode === "hi") && (
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="font-bold text-blue-600 dark:text-blue-400">चरण {step.step}: </span>
                      {step.descHi}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Complete CRUD Action Guide (Add, Edit, Delete) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-white text-xs font-black">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Operations Guide: Add, Edit/Change, and Delete / संचालन विधि
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Add Card */}
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    ➕ Add (नया रिकॉर्ड जोड़ें)
                  </span>
                </div>
                {(languageMode === "both" || languageMode === "en") && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {guide.crudGuide.addEn}
                  </p>
                )}
                {(languageMode === "both" || languageMode === "hi") && (
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed pt-2 border-t border-emerald-200/60 dark:border-emerald-900/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">विधि: </span>
                    {guide.crudGuide.addHi}
                  </p>
                )}
              </div>

              {/* Edit Card */}
              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Edit3 className="h-5 w-5" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    ✏️ Edit / Change (संशोधित करें)
                  </span>
                </div>
                {(languageMode === "both" || languageMode === "en") && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {guide.crudGuide.editEn}
                  </p>
                )}
                {(languageMode === "both" || languageMode === "hi") && (
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed pt-2 border-t border-blue-200/60 dark:border-blue-900/30">
                    <span className="font-bold text-blue-700 dark:text-blue-400">विधि: </span>
                    {guide.crudGuide.editHi}
                  </p>
                )}
              </div>

              {/* Delete Card */}
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/15 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                  <Trash2 className="h-5 w-5" />
                  <span className="font-bold text-xs uppercase tracking-wide">
                    🗑️ Delete (हटाएं व ऑडिट प्रभाव)
                  </span>
                </div>
                {(languageMode === "both" || languageMode === "en") && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {guide.crudGuide.deleteEn}
                  </p>
                )}
                {(languageMode === "both" || languageMode === "hi") && (
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed pt-2 border-t border-red-200/60 dark:border-red-900/30">
                    <span className="font-bold text-red-700 dark:text-red-400">विधि: </span>
                    {guide.crudGuide.deleteHi}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Statutory India Compliance & Law */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/15 p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                India Statutory Compliance & Acts / भारतीय वैधानिक नियम व अधिनियम
              </h4>
            </div>
            {(languageMode === "both" || languageMode === "en") && (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {guide.statutoryComplianceEn}
              </p>
            )}
            {(languageMode === "both" || languageMode === "hi") && (
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed pt-2 border-t border-purple-200/60 dark:border-purple-900/30">
                <span className="font-bold text-purple-700 dark:text-purple-400">कानूनी प्रभाव: </span>
                {guide.statutoryComplianceHi}
              </p>
            )}
          </div>

          {/* Section 4: Pro Tips & Best Practices */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Lightbulb className="h-5 w-5" />
              <h4 className="font-bold text-xs uppercase tracking-wider">
                Pro Tips & Best Practices / सर्वोत्तम कार्यप्रणाली एवं सुझाव
              </h4>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {guide.proTipsEn.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    {(languageMode === "both" || languageMode === "en") && (
                      <p>{tip}</p>
                    )}
                    {(languageMode === "both" || languageMode === "hi") && (
                      <p className="font-medium text-slate-900 dark:text-white mt-0.5">
                        👉 {guide.proTipsHi[idx]}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Module {guide.number} of 26</span>
            <span>•</span>
            <span>ERP Vibe India Enterprise Edition</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Guide / प्रिंट
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition shadow-sm"
            >
              Done / समझ गए
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
