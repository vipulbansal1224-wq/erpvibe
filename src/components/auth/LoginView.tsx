"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Building2,
  FileCheck2,
} from "lucide-react";
import { AppUser } from "@/types/erp";

interface LoginViewProps {
  users: AppUser[];
  onLogin: (user: AppUser) => void;
}

export function LoginView({ users, onLogin }: LoginViewProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matchedUser = users.find(
      (u) =>
        (u.username.toLowerCase() === cleanUsername ||
          u.email.toLowerCase() === cleanUsername) &&
        u.password === cleanPassword
    );

    if (!matchedUser) {
      setError("अमान्य यूजरनेम या पासवर्ड! कृपया सही विवरण दर्ज करें। (Invalid username or password)");
      return;
    }

    if (matchedUser.status !== "Active") {
      setError(`यह यूजर खाता वर्तमान में ${matchedUser.status} है। कृपया सिस्टम एडमिनिस्ट्रेटर से संपर्क करें।`);
      return;
    }

    // Update last login
    const updatedUser = {
      ...matchedUser,
      lastLoginAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    onLogin(updatedUser);
  };

  const handleQuickLogin = (u: AppUser) => {
    setError(null);
    const updatedUser = {
      ...u,
      lastLoginAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    onLogin(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25 font-black text-white text-xl">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">ERPVibe</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Enterprise Statutory ERP & Compliance Engine</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            MCA Section 134(5) & Rule 3(1) Compliant
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
            <Lock className="h-3.5 w-3.5 text-purple-400" />
            AES-256 Auth Gateway
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Promo / Information Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-xs font-bold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Role-Based Access Control (RBAC) System
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                सुरक्षित लॉगिन एवं <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  संपूर्ण व्यापार नियंत्रण
                </span>
              </h1>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-lg">
                Sign in with your authorized corporate credentials. Access is restricted to designated personnel with strict MCA statutory edit-logging on all transactions.
              </p>
            </div>

            {/* Quick 1-Click Persona Logins */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-blue-400" />
                1-Click Quick Demo Sign-In (डेमो लॉगिन विकल्प)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="text-left p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:border-indigo-500/50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                        {u.username}
                      </span>
                      {u.allAccess ? (
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">
                          All Access
                        </span>
                      ) : (
                        <span className="text-[9px] bg-slate-800 text-slate-400 px-1 py-0.2 rounded font-mono">
                          RBAC
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{u.role}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <p className="text-base font-bold text-white">27 Modules</p>
                <p className="text-[11px] text-slate-400">Integrated Enterprise</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <p className="text-base font-bold text-emerald-400">100% MCA</p>
                <p className="text-[11px] text-slate-400">Immutable Audit Trail</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <p className="text-base font-bold text-blue-400">₹ INR Ready</p>
                <p className="text-[11px] text-slate-400">GST, TDS, EPF, PT</p>
              </div>
            </div>
          </div>

          {/* Right Login Form Card */}
          <div className="lg:col-span-6">
            <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Sign In / लॉगिन</h2>
                  <p className="text-xs text-slate-400 mt-1">Enter your ERPVibe login credentials</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <LogIn className="h-5 w-5" />
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 flex items-start gap-2.5 text-xs text-red-200">
                  <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Username or Email (यूजरनेम या ईमेल)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="admin / finance / user@company.in"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Password (पासवर्ड)
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Default: <code className="text-blue-300 font-mono">admin</code>
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="text-xs text-slate-400">Remember session (सत्र याद रखें)</span>
                  </label>
                  <span className="text-xs text-slate-400 font-medium">Session: Encrypted</span>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In to ERP Console / प्रवेश करें
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800 text-center">
                <p className="text-[11px] text-slate-400">
                  New users and permission roles can be created inside{" "}
                  <strong className="text-slate-200">Module 27 (Settings)</strong> by an authorized Super Admin.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-slate-800/60 bg-slate-900/30 text-xs text-slate-400">
        ERPVibe India Platform © 2026-27 • ApexTech ERP Solutions • Government of India GSTN & MCA Compliant
      </footer>
    </div>
  );
}
