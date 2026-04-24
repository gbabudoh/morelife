"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Shield,
  ArrowRight,
  CreditCard,
  Network,
  Smartphone,
  Menu,
  X,
  ChevronRight,
  Star,
  Globe,
  Users,
  Building2,
  Heart,
  FileText,
  Video,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const [loggedInAs, setLoggedInAs] = useState<"patient" | "provider" | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState<"patient" | "provider">("patient");

  useEffect(() => {
    if (localStorage.getItem("patientId")) setLoggedInAs("patient");
    else if (localStorage.getItem("providerId")) setLoggedInAs("provider");
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = loggedInAs !== null;
  const dashboardHref = loggedInAs === "provider" ? "/provider/dashboard" : "/patient/dashboard";
  const dashboardLabel = loggedInAs === "provider" ? "Provider Dashboard" : "Patient Dashboard";
  const dashboardColor = loggedInAs === "provider" ? "emerald" : "blue";

  const handleLogout = () => {
    localStorage.removeItem("patientId");
    localStorage.removeItem("providerId");
    setLoggedInAs(null);
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: CreditCard,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Transparent Pricing",
      description: "Fixed-price healthcare packages with zero hidden fees. Know exactly what you pay before you book.",
      stat: "No surprise bills",
      className: "md:col-span-1 bg-gradient-to-br from-blue-50/70 to-white"
    },
    {
      icon: Network,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "Wide Network",
      description: "Verified providers across multiple African countries, covering hospitals, clinics, labs and pharmacies.",
      stat: "500+ providers",
      className: "md:col-span-1 bg-gradient-to-br from-emerald-50/70 to-white"
    },
    {
      icon: Video,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Video Consultations",
      description: "HD video calls with specialists from home. No waiting rooms, no travel, no wasted time.",
      stat: "HD Quality",
      className: "md:col-span-1 bg-gradient-to-br from-purple-50/70 to-white"
    },
    {
      icon: Smartphone,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Digital Health Card",
      description: "Your MH-Number, QR code, and complete medical history always in your pocket. Accepted at all MoreLife partner facilities across Africa.",
      stat: "Instant access",
      className: "md:col-span-2 bg-gradient-to-br from-indigo-50/70 to-white"
    },
    {
      icon: Shield,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-700",
      title: "Secure Records",
      description: "256-bit encrypted health data, locally compliant, accessible only by you and your chosen providers.",
      stat: "256-bit AES",
      className: "md:col-span-1 bg-gradient-to-br from-slate-50/70 to-white"
    }
  ];

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Floating Navbar */}
      <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'px-4' : 'px-4 sm:px-8'}`}>
        <div className={`mx-auto max-w-5xl rounded-full border ${scrolled ? 'bg-white/80 backdrop-blur-md border-white/40 shadow-lg' : 'bg-white/60 backdrop-blur-sm border-white/30 shadow-sm'} transition-all duration-300`}>
          <div className="flex items-center px-4 py-3 sm:px-6">

            {/* Logo */}
            <Link href="/" className="flex-shrink-0 cursor-pointer">
               <Image
                src="/logo.png"
                alt="MoreLife"
                width={120}
                height={40}
                className="object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 ml-auto mr-4">
              {!isLoggedIn ? (
                <>
                  <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                  <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</Link>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  {loggedInAs === "patient" && (
                    <Link href="/patient/marketplace" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Marketplace</Link>
                  )}
                </div>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    href={dashboardHref}
                    className={`px-5 py-2 rounded-full text-sm font-black text-white flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5 ${dashboardColor === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"}`}
                  >
                    {dashboardLabel} <ArrowRight size={15} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/patient/login" className="px-4 py-2 rounded-full text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all">
                    Sign In
                  </Link>
                  <Link href="/patient/register" className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors ml-auto"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full mt-2 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-2xl p-4 flex flex-col gap-2 md:hidden animate-in slide-in-from-top-4 fade-in duration-200">
            {!isLoggedIn ? (
              <>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-between">
                  <span>About</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-between">
                  <span>How it Works</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <div className="h-px bg-slate-100 my-1" />
                <Link href="/patient/login" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                  <span>Patient Sign In</span>
                  <ChevronRight size={16} />
                </Link>
                <Link href="/provider/login" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-between">
                  <span>Provider Sign In</span>
                  <ChevronRight size={16} />
                </Link>
                <Link href="/patient/register" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl bg-slate-900 text-white font-semibold flex items-center justify-between">
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)} className={`p-3 rounded-xl font-black flex items-center justify-between ${dashboardColor === "emerald" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"}`}>
                  <span>{dashboardLabel}</span>
                  <ArrowRight size={16} />
                </Link>
                {loggedInAs === "patient" && (
                  <Link href="/patient/marketplace" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-xl text-slate-700 font-medium hover:bg-slate-50 flex items-center justify-between">
                    <span>Marketplace</span>
                    <ChevronRight size={16} className="text-slate-400" />
                  </Link>
                )}
                <div className="h-px bg-slate-100 my-1" />
                <button onClick={handleLogout} className="p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-left flex items-center justify-between w-full">
                  <span>Logout</span>
                  <X size={16} />
                </button>
              </>
            )}
          </div>
        )}
      </header>

      <main className="pt-24 pb-16 px-4 sm:px-6">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto mb-24 text-center">

            <div className="space-y-4 mb-6">

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
                Healthcare <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Reimagined.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
                The Healthcare Ecosystem Tailored for Africa
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-8 opacity-80 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["bg-blue-400", "bg-emerald-400", "bg-purple-400", "bg-orange-400"].map((color, i) => (
                      <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-white flex items-center justify-center`}>
                        <Heart size={12} className="text-white fill-white" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-bold text-slate-600 text-left">
                    <span className="block text-slate-900">50k+</span>
                    Active Patients
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex items-center gap-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={16} />
                  <span className="font-bold text-slate-900">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Unified Role Card */}
            <div className="max-w-md mx-auto w-full">
              <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl">
              {isLoggedIn ? (
                <div className="text-center py-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${dashboardColor === "emerald" ? "bg-emerald-100" : "bg-blue-100"}`}>
                    {loggedInAs === "provider" ? <Building2 size={32} className="text-emerald-600" /> : <Users size={32} className="text-blue-600" />}
                  </div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Logged in as</p>
                  <h3 className="text-xl font-black text-slate-900 mb-6 capitalize">{loggedInAs}</h3>
                  <Link
                    href={dashboardHref}
                    className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black text-white shadow-lg hover:-translate-y-0.5 transition-all ${dashboardColor === "emerald" ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25" : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25"}`}
                  >
                    Return to {dashboardLabel}
                    <ArrowRight size={20} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex bg-slate-100 rounded-2xl p-1 mb-8">
                    <button
                      onClick={() => setRole("patient")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
                        role === "patient" ? "bg-white text-blue-600 shadow-md" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Users size={16} />
                      Patient
                    </button>
                    <button
                      onClick={() => setRole("provider")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-black transition-all duration-300 cursor-pointer ${
                        role === "provider" ? "bg-white text-emerald-600 shadow-md" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      <Building2 size={16} />
                      Provider
                    </button>
                  </div>

                  <div className="text-center mb-8 min-h-25">
                    {role === "patient" ? (
                      <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4">
                          <Users size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">For Patients</h3>
                        <p className="text-slate-500 text-sm font-medium">
                          Access your health records, find specialists, and manage your care plan.
                        </p>
                      </div>
                    ) : (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                          <Building2 size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">For Providers</h3>
                        <p className="text-slate-500 text-sm font-medium">
                          Manage your practice, connect with patients, and streamline your workflow.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {role === "patient" ? (
                      <>
                        <Link href="/patient/register" className="flex w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-lg shadow-blue-500/25 transition-all text-center items-center justify-center gap-2 hover:-translate-y-0.5">
                          Create Account <ArrowRight size={18} />
                        </Link>
                        <Link href="/patient/login" className="block w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all text-center">
                          Sign In
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link href="/provider/register" className="block w-full py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-lg shadow-emerald-500/25 transition-all text-center flex items-center justify-center gap-2 hover:-translate-y-0.5">
                          Register Practice <ArrowRight size={18} />
                        </Link>
                        <Link href="/provider/login" className="block w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 transition-all text-center">
                          Sign In
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
              </div>
            </div>
        </section>



        {/* Bento Grid Features */}
        <section className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Everything you need.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our platform brings together all aspects of your healthcare journey into one cohesive, accessible experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${feature.className} glass rounded-[2rem] p-8 border border-white/60 hover:border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group relative overflow-hidden`}
              >
                {/* Stat badge */}
                <div className="absolute top-6 right-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/80 px-2.5 py-1 rounded-full border border-slate-100">
                    {feature.stat}
                  </span>
                </div>

                <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={feature.iconColor} size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3 pr-16">{feature.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Features CTA */}
          <div className="mt-14 text-center">
            <Link
              href="/patient/register"
              className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-black rounded-full shadow-lg hover:bg-slate-700 hover:-translate-y-0.5 transition-all"
            >
              Start Your Healthcare Journey
              <ArrowRight size={18} />
            </Link>
            <div className="flex items-center justify-center gap-6 mt-5 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Free to sign up</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> No credit card needed</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-500" /> Cancel anytime</span>
            </div>
          </div>
        </section>

        {/* Minimal Footer */}
        <footer className="max-w-7xl mx-auto border-t border-slate-200 pt-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-opacity">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
              <Image
                src="/logo.png"
                alt="MoreLife"
                width={100}
                height={35}
                className="object-contain"
                unoptimized
              />
            </Link>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-sm font-medium text-slate-500">
              © 2026 MoreLife Healthcare. Built for the future.
            </div>
            <div className="flex gap-4 text-xs text-slate-400">
              <Link href="/about" className="hover:text-slate-700 transition-colors">About</Link>
              <span>·</span>
              <Link href="/how-it-works" className="hover:text-slate-700 transition-colors">How it Works</Link>
              <span>·</span>
              <Link href="/patient/register" className="hover:text-slate-700 transition-colors">Get Started</Link>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <Link href="/about" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium">
              <Globe size={16} />
              <span>Africa</span>
            </Link>
            <Link href="/how-it-works" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium">
              <Shield size={16} />
              <span>Privacy</span>
            </Link>
            <Link href="/how-it-works" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-xs font-medium">
              <FileText size={16} />
              <span>Terms</span>
            </Link>
          </div>
        </footer>

      </main>
    </div>
  );
}
