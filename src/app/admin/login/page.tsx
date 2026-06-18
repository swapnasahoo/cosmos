"use client";

import React, { useState, useEffect } from "react";
import { loginAction } from "../actions";
import { Lock, User, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(null, formData);

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute top-8 left-8 flex items-center gap-2 font-heading font-black tracking-wider text-white select-none">
        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
        <span className="text-lg tracking-widest font-heading font-black">COSMOS</span>
      </div>

      <div className="w-full max-w-[420px] glass-panel border-white/5 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Ambient glows inside card */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-cyan-500/5 blur-[40px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-indigo-500/5 blur-[40px] pointer-events-none" />

        <div className="text-center flex flex-col items-center gap-3 mb-8">
          <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-cyan-400 font-heading bg-cyan-400/10 px-3.5 py-1 rounded-full border border-cyan-400/20 shadow-[0_0_10px_rgba(0,242,254,0.05)]">
            SECURE ACCESS
          </span>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight uppercase">
            Cosmic Chronicle
          </h1>
          <p className="text-xs text-neutral-400 font-light">
            Enter your credentials to manage posts and writers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold text-center font-heading">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-heading" htmlFor="username">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:bg-[#0b071e]/70 focus:outline-none transition-all duration-300 text-sm font-heading tracking-wide placeholder-neutral-600 text-white"
                placeholder="e.g. admin"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider font-heading" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-white/5 bg-[#0b071e]/40 focus:border-cyan-500 focus:bg-[#0b071e]/70 focus:outline-none transition-all duration-300 text-sm font-heading tracking-wide placeholder-neutral-600 text-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full py-3 rounded-xl bg-cyan-500 text-black font-heading font-black text-xs hover:bg-cyan-400 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(0,242,254,0.15)] disabled:opacity-50"
          >
            {loading ? "AUTHENTICATING..." : "LOGIN PORTAL"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-[10px] font-heading font-bold text-neutral-500 hover:text-cyan-400 tracking-wider uppercase transition-colors"
          >
            ← Back to Main Website
          </a>
        </div>
      </div>
    </div>
  );
}
