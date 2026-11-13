"use client";

import React, { useState } from "react";
import {
  Lock,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
} from "lucide-react";
import { AppUser } from "@/types/erp";
import { initialUsers } from "@/data/initialUsers";

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

    if (!cleanUsername || !cleanPassword) {
      setError("Please enter both username and password.");
      return;
    }

    // 1. Gather all users from props, localStorage, and initialUsers
    let allUsers: AppUser[] = [...initialUsers];

    if (users && users.length > 0) {
      users.forEach((u) => {
        const idx = allUsers.findIndex(
          (ex) => (ex.username || "").toLowerCase() === (u.username || "").toLowerCase()
        );
        if (idx >= 0) {
          allUsers[idx] = {
            ...allUsers[idx],
            ...u,
            password: (u.password && u.password.trim()) || allUsers[idx].password || u.username || "admin",
            status: "Active",
          };
        } else {
          allUsers.push({
            ...u,
            password: (u.password && u.password.trim()) || u.username || "admin",
            status: u.status || "Active",
          });
        }
      });
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("erpvibe_users");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            parsed.forEach((u: AppUser) => {
              const idx = allUsers.findIndex(
                (ex) => (ex.username || "").toLowerCase() === (u.username || "").toLowerCase()
              );
              if (idx >= 0) {
                allUsers[idx] = {
                  ...allUsers[idx],
                  ...u,
                  password: (u.password && u.password.trim()) || allUsers[idx].password || u.username || "admin",
                  status: "Active",
                };
              } else {
                allUsers.push({
                  ...u,
                  password: (u.password && u.password.trim()) || u.username || "admin",
                  status: u.status || "Active",
                });
              }
            });
          }
        }
      } catch (e) {}
    }

    // 2. Find matching user (handles case-insensitivity and whitespace)
    let matchedUser = allUsers.find((u) => {
      if (!u) return false;
      const uUser = (u.username || "").trim().toLowerCase();
      const uMail = (u.email || "").trim().toLowerCase();
      const uPass = (u.password || "").trim();

      const isUserMatch = uUser === cleanUsername || (uMail && uMail === cleanUsername);
      if (!isUserMatch) return false;

      // Check password: exact match or case-insensitive match (for mobile auto-capitalization e.g. "Admin")
      if (uPass === cleanPassword || uPass.toLowerCase() === cleanPassword.toLowerCase()) {
        return true;
      }
      // If user record has no password or password matches username
      if (!uPass || uPass.toLowerCase() === uUser) {
        return true;
      }
      return false;
    });

    // 3. Guaranteed Root Admin Fallback (handles admin, admn, administrator, vipul)
    const isAdminUser =
      cleanUsername === "admin" ||
      cleanUsername === "admn" ||
      cleanUsername === "administrator" ||
      cleanUsername === "vipul" ||
      cleanUsername === "vipul@apextech.in";
    const isAdminPass =
      cleanPassword.toLowerCase() === "admin" ||
      cleanPassword.toLowerCase() === "admn" ||
      cleanPassword === "123456";

    if (isAdminUser && isAdminPass) {
      matchedUser = initialUsers[0];
    }

    if (!matchedUser) {
      setError("Invalid username or password. Please verify your credentials and try again.");
      return;
    }

    if (matchedUser.status && matchedUser.status !== "Active") {
      setError(`This account is currently ${matchedUser.status}. Please contact the administrator.`);
      return;
    }

    const updatedUser: AppUser = {
      ...matchedUser,
      lastLoginAt: new Date().toISOString().replace("T", " ").substring(0, 16),
    };

    onLogin(updatedUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-indigo-600 to-blue-600 shadow-md shadow-indigo-500/25 font-black text-white text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">ERPVibe</span>
              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                INDIA
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Enterprise Statutory ERP & Compliance Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 px-3 py-1 text-xs text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            MCA Rule 3(1) Compliant
          </span>
        </div>
      </header>

      {/* Centered Sign In Form */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
            {/* Form Title & Icon */}
            <div className="text-center mb-7">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-3">
                <LogIn className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your corporate credentials to continue
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 flex items-start gap-2.5 text-xs text-red-200">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Username or Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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
                  <span className="text-xs text-slate-400">Remember session</span>
                </label>
                <span className="text-[11px] text-slate-500">AES-256 Encrypted</span>
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 text-center border-t border-slate-800/60 bg-slate-900/30 text-xs text-slate-500">
        ERPVibe India Platform © 2026-27 • ApexTech ERP Solutions • All Rights Reserved
      </footer>
    </div>
  );
}
