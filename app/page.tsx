"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { 
  Heart, 
  Shield, 
  TrendingUp, 
  Users, 
  Building2, 
  Check, 
  ArrowRight,
  Sparkles,
  CreditCard,
  Network,
  Smartphone
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Only run on client-side after mount
    const checkLoginStatus = () => {
      const patientId = localStorage.getItem("patientId");
      if (patientId && !isLoggedIn) {
        setIsLoggedIn(true);
      } else if (!patientId && isLoggedIn) {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative">
      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 sm:mb-20">
          <Image
            src="/logo.png"
            alt="MoreLife Healthcare Logo"
            width={200}
            height={80}
            className="object-contain"
            priority
            unoptimized
          />
          
          {isLoggedIn && (
            <div className="flex gap-3">
              <Link
                href="/patient/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Dashboard
                <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("patientId");
                  setIsLoggedIn(false);
                }}
                className="px-6 py-3 bg-white/80 backdrop-blur-xl text-slate-700 hover:text-slate-900 font-bold rounded-full hover:bg-white transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl px-6 py-2 rounded-full mb-6 border border-emerald-200/50">
            <span className="text-emerald-700 font-bold text-sm tracking-wide uppercase">Africa Healthcare Ecosystem</span>
          </div>
          

          
          <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Providing transparent access to healthcare for a better tomorrow
          </p>
        </div>

        {/* Conditional Content */}
        {isLoggedIn ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 sm:p-12 border border-white/50 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="text-white" size={40} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Welcome Back! 👋</h2>
              <p className="text-lg text-slate-600 mb-8 font-medium">
                You&apos;re logged in to your MoreLife Healthcare account.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/patient/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-[2rem] font-black shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3"
                >
                  View Dashboard
                  <ArrowRight size={22} />
                </Link>
                <Link
                  href="/patient/marketplace"
                  className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-[2rem] font-black hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  Browse Marketplace
                  <Sparkles size={20} />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Access Cards */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-20">
              {/* Patient Access Card */}
              <Link
                href="/patient/login"
                className="group relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 border border-white/50 hover:shadow-[0_50px_100px_-25px_rgba(59,130,246,0.3)] transition-all duration-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-xl shadow-blue-500/30">
                    <Users className="text-white" size={48} />
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-900 mb-3">
                    Patient Access
                  </h2>
                  
                  <p className="text-slate-600 mb-6 font-medium">
                    Login to access your healthcare account and services
                  </p>
                  
                  <div className="space-y-3 mb-8 text-left w-full">
                    {[
                      { icon: Shield, text: "View Your Digital Health Card" },
                      { icon: Heart, text: "Access Healthcare Packages" },
                      { icon: Sparkles, text: "Browse Marketplace" },
                      { icon: TrendingUp, text: "Manage Your Subscription" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Check className="text-blue-600" size={14} strokeWidth={3} />
                        </div>
                        <span className="font-semibold text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-[2rem] font-black group-hover:from-blue-700 group-hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>

              {/* Provider Access Card */}
              <Link
                href="/provider/login"
                className="group relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 border border-white/50 hover:shadow-[0_50px_100px_-25px_rgba(16,185,129,0.3)] transition-all duration-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 shadow-xl shadow-emerald-500/30">
                    <Building2 className="text-white" size={48} />
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-900 mb-3">
                    Provider Access
                  </h2>
                  
                  <p className="text-slate-600 mb-6 font-medium">
                    Login to manage your healthcare services and patients
                  </p>
                  
                  <div className="space-y-3 mb-8 text-left w-full">
                    {[
                      { icon: Building2, text: "Manage Your Practice" },
                      { icon: Heart, text: "Create Healthcare Packages" },
                      { icon: Network, text: "Access Patient Network" },
                      { icon: TrendingUp, text: "View Analytics & Insights" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-slate-700">
                        <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="text-emerald-600" size={14} strokeWidth={3} />
                        </div>
                        <span className="font-semibold text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-[2rem] font-black group-hover:from-emerald-700 group-hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2">
                    Get Started
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">
                  Why Choose MoreLife?
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Transforming healthcare access across Africa
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: CreditCard,
                    title: "Transparent Pricing",
                    description: "Fixed-price, all-inclusive packages with no hidden costs",
                    gradient: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: Network,
                    title: "Wide Network",
                    description: "Access to a curated network of quality healthcare providers",
                    gradient: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: Smartphone,
                    title: "Digital Health Card",
                    description: "Your unique MH-Number and QR code for seamless access",
                    gradient: "from-emerald-500 to-emerald-600"
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/50 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)] transition-all duration-500"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-24 pb-8">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl px-6 py-3 rounded-full border border-white/50 shadow-md">
            <Heart className="text-emerald-500" size={18} fill="currentColor" />
            <p className="text-slate-600 font-bold text-sm">
              MoreLife: Providing access to healthcare for a better tomorrow
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
