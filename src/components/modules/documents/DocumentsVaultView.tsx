"use client";

import { useState } from "react";
import { VaultDocument } from "@/types/erp";
import {
  FileText,
  Plus,
  Search,
  ShieldCheck,
  Calendar,
  Lock,
  AlertCircle,
  FileCheck2,
  Building,
  KeyRound,
  Download,
  Edit,
  Trash2,
} from "lucide-react";

interface DocumentsVaultViewProps {
  documents: VaultDocument[];
  onAddDocument: (doc: VaultDocument) => void;
  onUpdateDocument?: (doc: VaultDocument) => void;
  onDeleteDocument?: (id: string) => void;
}

export function DocumentsVaultView({
  documents,
  onAddDocument,
  onUpdateDocument,
  onDeleteDocument,
}: DocumentsVaultViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [documentTitle, setDocumentTitle] = useState("");
  const [category, setCategory] = useState<VaultDocument["category"]>("Statutory & Tax");
  const [fileNumber, setFileNumber] = useState("");
  const [authority, setAuthority] = useState("Government of India / MCA");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [expiryDate, setExpiryDate] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<VaultDocument["verificationStatus"]>("Verified & Current");

  const categories: VaultDocument["category"][] = [
    "Statutory & Tax",
    "Company Legal",
    "Vendor Contracts",
    "Leases & Property",
  ];

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.documentTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.fileNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.authority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === "All" || d.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const verifiedCount = documents.filter((d) => d.verificationStatus === "Verified & Current" || d.verificationStatus === "Permanent").length;
  const renewalPending = documents.filter((d) => d.verificationStatus === "Renewal Pending").length;

  const handleOpenNew = () => {
    setEditingId(null);
    setDocumentTitle("");
    setFileNumber("");
    setAuthority("Government of India / MCA");
    setExpiryDate("");
    setVerificationStatus("Verified & Current");
    setShowModal(true);
  };

  const handleOpenEdit = (doc: VaultDocument) => {
    setEditingId(doc.id);
    setDocumentTitle(doc.documentTitle);
    setCategory(doc.category);
    setFileNumber(doc.fileNumber);
    setAuthority(doc.authority);
    setIssueDate(doc.issueDate);
    setExpiryDate(doc.expiryDate || "");
    setVerificationStatus(doc.verificationStatus);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentTitle || !fileNumber) return;
    const record: VaultDocument = {
      id: editingId || `DOC-${Date.now().toString().slice(-4)}`,
      documentTitle,
      category,
      fileNumber,
      issueDate,
      expiryDate: expiryDate || undefined,
      authority,
      verificationStatus,
    };

    if (editingId && onUpdateDocument) {
      onUpdateDocument(record);
    } else {
      onAddDocument(record);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-800 to-zinc-900 text-white p-6 rounded-2xl shadow-lg border border-slate-700">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              AES-256 Vault Encryption
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white">
              Statutory Compliance Dossier
            </span>
          </div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lock className="w-6 h-6 text-emerald-400" />
            Document Management & Legal Compliance Vault (DMS)
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            GST Registration, MCA Articles, ROC Returns, Leases, Trade Licenses & Digital Certificate Expiry Alarms
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-500 transition"
        >
          <Plus className="w-5 h-5" />
          Deposit Document
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Total Vault Deeds
            <FileText className="w-5 h-5 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-white mt-2">
            {documents.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Statutory and legal contracts</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Verified & Active
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {verifiedCount}
          </div>
          <p className="text-xs text-emerald-600 mt-1">Legally sound & unexpired</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            Renewal Reminders
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {renewalPending}
          </div>
          <p className="text-xs text-amber-500 mt-1">Action due within 60 days</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium uppercase tracking-wider">
            MCA Audit Readiness
            <KeyRound className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
            100%
          </div>
          <p className="text-xs text-indigo-600 mt-1">Section 134(5) compliant</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Title, Certificate # or Authority..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                categoryFilter === cat
                  ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Document Title & File Ref</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Issuing Authority</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Statutory Expiry</th>
                <th className="py-3 px-4 text-center">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-750 transition">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      {doc.documentTitle}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{doc.fileNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                    {doc.authority}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs">
                    {doc.issueDate}
                  </td>
                  <td className="py-3 px-4 text-xs font-medium">
                    {doc.expiryDate ? (
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {doc.expiryDate}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-normal">Perpetual / Nil</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        doc.verificationStatus === "Verified & Current" || doc.verificationStatus === "Permanent"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {doc.verificationStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                        title="Edit Document"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {onDeleteDocument && (
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="Delete Document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-sm">
                    No vault documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              {editingId ? "Edit Vault Document Record" : "Deposit Document into Legal Vault"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Document / Deed Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Factory Pollution Control CTO / Trade Mark Cert"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Classification
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Certificate / File Ref #
                  </label>
                  <input
                    type="text"
                    placeholder="REG-2026-X"
                    value={fileNumber}
                    onChange={(e) => setFileNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Issuing Authority / Counterparty
                </label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Expiry Date (if applicable)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Compliance Status
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold"
                >
                  <option value="Verified & Current">Verified & Current</option>
                  <option value="Permanent">Permanent (Charter / PAN)</option>
                  <option value="Renewal Pending">Renewal Pending</option>
                </select>
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
                  {editingId ? "Update Document" : "Encrypt & Save to Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
