"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Users, Building2, Shield } from "lucide-react";

export default function ProviderLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("providerId")) {
      router.replace("/provider/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/provider/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("providerId", data.providerId);
        router.replace("/provider/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 sm:p-12 border border-white/50">

          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Image src="/logo.png" alt="MoreLife Healthcare" width={180} height={70} className="object-contain mx-auto" unoptimized />
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium mt-2 text-sm">Sign in to your provider dashboard</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
            <button
              type="button"
              onClick={() => router.push("/patient/login")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer text-slate-500 hover:text-slate-700"
            >
              <Users size={15} />
              Patient
            </button>
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer bg-white text-emerald-600 shadow-md"
            >
              <Building2 size={15} />
              Provider
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-sm font-black flex-shrink-0">!</div>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Password</label>
                <Link href="/provider/forgot-password" className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-16 pr-14 py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-4xl font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group cursor-pointer mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-medium text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/provider/register" className="text-emerald-600 hover:text-emerald-700 font-black transition-colors border-b-2 border-emerald-600/20 hover:border-emerald-600">
                Register Practice
              </Link>
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400">
          <Shield size={14} />
          <span className="text-xs font-medium">256-bit encrypted &middot; Secure connection</span>
        </div>
      </div>
    </div>
  );
}
