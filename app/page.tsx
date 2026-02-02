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
  Lock,
  Users,
  Building2
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const patientId = localStorage.getItem("patientId");
      if (patientId && !isLoggedIn) setIsLoggedIn(true);
      else if (!patientId && isLoggedIn) setIsLoggedIn(false);
    };
    checkLoginStatus();
  }, [isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "Fixed-price packages. No surprises.",
      className: "md:col-span-2 bg-blue-50/50"
    },
    {
      icon: Network,
      title: "Wide Network",
      description: "Access quality healthcare providers across the continent.",
      className: "md:col-span-1 bg-emerald-50/50"
    },
    {
      icon: Smartphone,
      title: "Digital Health Card",
      description: "Your MH-Number and QR code access in your pocket.",
      className: "md:col-span-1 bg-purple-50/50"
    },
    {
      icon: Shield,
      title: "Secure Records",
      description: "Your health data, encrypted and safe.",
      className: "md:col-span-2 bg-indigo-50/50"
    }
  ];

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Floating Navbar */}
      <header className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'px-4' : 'px-4 sm:px-8'}`}>
        <div className={`mx-auto max-w-5xl rounded-full border ${scrolled ? 'bg-white/80 backdrop-blur-md border-white/40 shadow-lg' : 'bg-transparent border-transparent'} transition-all duration-300`}>
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
            <nav className="hidden md:flex items-center gap-8 ml-auto">
              {!isLoggedIn ? (
                <>
                  <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</Link>
                  <Link href="/how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How it Works</Link>
                </>
              ) : (
                <div className="flex items-center gap-6">
                  <Link href="/patient/dashboard" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
                  <Link href="/patient/marketplace" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Marketplace</Link>
                </div>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isLoggedIn && (
                <button
                  onClick={() => {
                    localStorage.removeItem("patientId");
                    setIsLoggedIn(false);
                  }}
                  className="px-5 py-2 rounded-full text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
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
                  <Link href="/patient/login" className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                    <span>Patient Login</span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link href="/provider/login" className="p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold flex items-center justify-between">
                    <span>Provider Login</span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              ) : (
                 <Link href="/patient/dashboard" className="p-3 rounded-xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-between">
                    <span>Go to Dashboard</span>
                    <ArrowRight size={16} />
                  </Link>
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
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
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

            {/* Choose Your Path Cards - Hero Implementation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto text-left">
              {/* Patient Card */}
              <div className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-blue-100 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-[2.5rem] -z-10" />
                
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Users size={40} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2">For Patients</h3>
                  <p className="text-slate-600 font-medium mb-8">
                    Access your health records, find specialists, and manage your care plan.
                  </p>

                  <div className="w-full space-y-3">
                    <Link href="/patient/login" className="block w-full py-4 rounded-xl border-2 border-blue-100 text-blue-700 font-bold hover:border-blue-200 hover:bg-blue-50 transition-all text-center">
                      Log In
                    </Link>
                    <Link href="/patient/register" className="block w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all text-center flex items-center justify-center gap-2">
                       Create Account
                       <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Provider Card */}
              <div className="group relative bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-emerald-100 hover:border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                 <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent rounded-[2.5rem] -z-10" />

                 <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Building2 size={40} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-2">For Providers</h3>
                  <p className="text-slate-600 font-medium mb-8">
                    Manage your practice, connect with patients, and streamline your workflow.
                  </p>

                  <div className="w-full space-y-3">
                    <Link href="/provider/login" className="block w-full py-4 rounded-xl border-2 border-emerald-100 text-emerald-700 font-bold hover:border-emerald-200 hover:bg-emerald-50 transition-all text-center">
                      Log In
                    </Link>
                    <Link href="/provider/register" className="block w-full py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all text-center flex items-center justify-center gap-2">
                       Register Practice
                       <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
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
                className={`${feature.className} glass rounded-[2rem] p-8 border border-white/50 hover:border-blue-200/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-slate-900" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
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
           <div className="text-sm font-medium text-slate-500">
             © 2026 MoreLife Healthcare. Built for the future.
           </div>
           <div className="flex gap-6">
             <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Globe size={20} /></Link>
             <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Shield size={20} /></Link>
             <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors"><Lock size={20} /></Link>
           </div>
        </footer>

      </main>
    </div>
  );
}

