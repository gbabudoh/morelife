"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  UserPlus,
  Search,
  Stethoscope,
  FileText,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up as a patient or provider in under 2 minutes. Your unique MH-Number and digital health card are generated instantly.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    numColor: "text-blue-100",
    border: "border-blue-100",
    tag: "2 min setup",
  },
  {
    number: "02",
    icon: Search,
    title: "Connect & Schedule",
    description:
      "Browse verified specialists across Africa, view real-time availability, and book appointments — in-person or video.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    numColor: "text-emerald-100",
    border: "border-emerald-100",
    tag: "Real-time booking",
  },
  {
    number: "03",
    icon: Stethoscope,
    title: "Receive Quality Care",
    description:
      "Consult via HD video or walk in. Your care plan, prescriptions, and notes are automatically updated in your dashboard.",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    numColor: "text-purple-100",
    border: "border-purple-100",
    tag: "HD video + in-person",
  },
  {
    number: "04",
    icon: FileText,
    title: "Unified Records",
    description:
      "Your full medical history, lab results, and prescriptions — accessible anywhere, anytime. One account, total control.",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    numColor: "text-indigo-100",
    border: "border-indigo-100",
    tag: "Always accessible",
  },
];

export default function HowItWorksPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState<"patient" | "provider">("patient");

  useEffect(() => {
    const patientId = localStorage.getItem("patientId");
    setIsLoggedIn(!!patientId);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("patientId");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Floating Navbar */}
      <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-8`}>
        <div className={`mx-auto max-w-5xl rounded-full border ${scrolled ? "bg-white/80 backdrop-blur-md border-white/40 shadow-lg" : "bg-white/60 backdrop-blur-sm border-white/30 shadow-sm"} transition-all duration-300`}>
          <div className="flex items-center px-4 py-3 sm:px-6">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <Image src="/logo.png" alt="MoreLife" width={120} height={40} className="object-contain" priority unoptimized />
            </Link>

            <nav className="hidden md:flex items-center gap-8 ml-auto mr-4">
              {!isLoggedIn ? (
                <>
                  <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                  <Link href="/how-it-works" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-0.5">How it Works</Link>
                </>
              ) : (
                <>
                  <Link href="/patient/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                  <Link href="/patient/marketplace" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Marketplace</Link>
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="px-5 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer">
                  Logout
                </button>
              ) : (
                <>
                  <Link href="/patient/login" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">Sign In</Link>
                  <Link href="/patient/register" className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">Get Started</Link>
                </>
              )}
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-auto">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full mt-2 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-2xl p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top-4 fade-in duration-200">
            {!isLoggedIn ? (
              <>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-between">
                  <span>About</span><ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                  <span>How it Works</span><ChevronRight size={16} />
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                <Link href="/patient/login" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                  <span>Patient Sign In</span><ChevronRight size={16} />
                </Link>
                <Link href="/provider/login" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-between">
                  <span>Provider Sign In</span><ChevronRight size={16} />
                </Link>
                <Link href="/patient/register" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-between">
                  <span>Create Account</span><ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link href="/patient/dashboard" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                  <span>Dashboard</span><ArrowRight size={16} />
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                <button onClick={handleLogout} className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-left flex items-center justify-between w-full">
                  <span>Logout</span><X size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Hero */}
        <section className="text-center mb-20 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black tracking-widest uppercase mb-6">
            Simple &amp; Transparent
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Healthcare made{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
              Effortless.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            No confusing paperwork. No fragmented records. Your entire healthcare
            journey in four clear steps.
          </p>
        </section>

        {/* Steps — horizontal timeline on desktop, stacked on mobile */}
        <section className="mb-24 relative">

          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-14 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 via-purple-200 to-indigo-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative flex flex-col">

                {/* Step number node (sits on the connector line on desktop) */}
                <div className="flex lg:justify-center mb-6 lg:mb-0 lg:relative lg:z-10">
                  <div className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shrink-0 relative`}>
                    <step.icon className={step.iconColor} size={26} />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500">
                      {i + 1}
                    </span>
                  </div>
                  {/* Mobile connector */}
                  {i < steps.length - 1 && (
                    <div className="flex sm:hidden ml-auto items-center pr-2">
                      <ArrowRight size={16} className="text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className={`glass rounded-[2rem] p-6 border ${step.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-1 relative overflow-hidden`}>
                  {/* Big background number */}
                  <span className={`absolute -bottom-3 -right-1 text-8xl font-black ${step.numColor} leading-none select-none pointer-events-none`}>
                    {step.number}
                  </span>

                  <div className="mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.tag}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2 leading-tight">{step.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What you get summary */}
        <section className="mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Setup time", value: "< 2 min", sub: "From sign-up to your first booking" },
              { label: "Provider network", value: "500+", sub: "Verified clinics, hospitals & specialists" },
              { label: "Countries covered", value: "12+", sub: "And expanding across Africa" },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-[2rem] p-8 border border-white/60 text-center">
                <p className="text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA — unified role toggle */}
        <section className="glass rounded-[3rem] p-8 sm:p-14 text-center relative overflow-hidden border border-white/60">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-emerald-50/40 -z-10" />

          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Ready to get started?</h2>
            <p className="text-slate-500 font-medium mb-10">Join thousands of Africans taking control of their health.</p>

            {/* Role toggle */}
            <div className="flex bg-white/80 rounded-2xl p-1 mb-6 border border-slate-100 shadow-sm">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
                  role === "patient" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Users size={15} />
                Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("provider")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
                  role === "provider" ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <Building2 size={15} />
                Provider
              </button>
            </div>

            <div className="space-y-3">
              {role === "patient" ? (
                <>
                  <Link href="/patient/register" className="flex w-full items-center justify-center gap-2 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all">
                    Create Patient Account <ArrowRight size={18} />
                  </Link>
                  <Link href="/patient/login" className="flex w-full items-center justify-center py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all">
                    Sign In
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/provider/register" className="flex w-full items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all">
                    Register Your Practice <ArrowRight size={18} />
                  </Link>
                  <Link href="/provider/login" className="flex w-full items-center justify-center py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-5 mt-8 text-xs text-slate-400 font-medium flex-wrap">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Free to sign up</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> Cancel anytime</span>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
