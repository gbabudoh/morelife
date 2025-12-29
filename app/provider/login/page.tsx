"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, ArrowRight, Building2, ShieldCheck } from "lucide-react";

export default function ProviderLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        router.push("/provider/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/90 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 sm:p-12 border border-white/50">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-6 group transition-all duration-500 hover:scale-110">
              <Image
                src="/logo.png"
                alt="MoreLife Healthcare"
                width={180}
                height={70}
                className="object-contain mx-auto"
                unoptimized
              />
            </Link>
            
            <div className="inline-flex items-center gap-2 bg-emerald-100/50 px-4 py-1.5 rounded-full mb-4 border border-emerald-200/50">
              <Building2 size={16} className="text-emerald-600" />
              <span className="text-emerald-700 font-bold text-[10px] uppercase tracking-wider">Provider Portal</span>
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium mt-2">Access your healthcare management suite</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm font-black flex-shrink-0">!</div>
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Professional Email</label>
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
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Security Pass</label>
                <Link href="/provider/forgot-password" className="text-[10px] font-black text-emerald-600 uppercase tracking-wider hover:text-emerald-700 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-500 font-bold tracking-tight">
              New to the ecosystem?{" "}
              <Link href="/provider/register" className="text-emerald-600 hover:text-emerald-700 font-black ml-1 transition-all border-b-2 border-emerald-600/10 hover:border-emerald-600">
                Apply as Provider
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-[0.1em]">Secure Multi-Factor Authentication</span>
        </div>
      </div>
    </div>
  );
}

