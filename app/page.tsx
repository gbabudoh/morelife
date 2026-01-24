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
  Smartphone,
  Menu,
  X,
  ChevronRight,
  Zap,
  Star
} from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

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

  // Auto-rotate features for mobile carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "Fixed-price packages with no hidden costs",
      gradient: "from-blue-500 to-blue-600",
      color: "blue"
    },
    {
      icon: Network,
      title: "Wide Network",
      description: "Access quality healthcare providers",
      gradient: "from-purple-500 to-purple-600",
      color: "purple"
    },
    {
      icon: Smartphone,
      title: "Digital Health Card",
      description: "Your MH-Number and QR code access",
      gradient: "from-emerald-500 to-emerald-600",
      color: "emerald"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden">
      {/* Header - Sticky with Blur */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/40 shadow-sm">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          {/* Mobile Header */}
          <div className="flex sm:hidden items-center justify-between">
            {/* Only show hamburger menu when NOT logged in */}
            {!isLoggedIn ? (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl cursor-pointer active:scale-95 transition-transform"
              >
                {mobileMenuOpen ? <X size={20} className="cursor-pointer" /> : <Menu size={20} className="cursor-pointer" />}
              </button>
            ) : (
              <div className="w-10"></div>
            )}
            <Link href="/" className="cursor-pointer">
              <Image
                src="/logo.png"
                alt="MoreLife Healthcare Logo"
                width={140}
                height={56}
                className="object-contain cursor-pointer"
                priority
                unoptimized
              />
            </Link>
            <div className="w-10"></div>
          </div>

          {/* Desktop Header - Logo Centered */}
          <div className="hidden sm:flex flex-col items-center">
            <Link href="/" className="cursor-pointer mb-3">
              <Image
                src="/logo.png"
                alt="MoreLife Healthcare Logo"
                width={180}
                height={72}
                className="object-contain cursor-pointer"
                priority
                unoptimized
              />
            </Link>
            
            {/* Desktop Navigation - Below Logo */}
            {isLoggedIn && (
              <div className="flex gap-3">
                <Link
                  href="/patient/dashboard"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  Dashboard
                  <ArrowRight size={16} className="cursor-pointer" />
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("patientId");
                    setIsLoggedIn(false);
                  }}
                  className="px-5 py-2.5 bg-white/80 backdrop-blur-xl text-slate-700 hover:text-slate-900 font-bold rounded-full hover:bg-white transition-all duration-300 shadow-md cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && !isLoggedIn && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/40 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/patient/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl font-bold text-blue-600 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Users size={20} className="cursor-pointer" />
                  Patient Login
                </span>
                <ChevronRight size={20} className="cursor-pointer" />
              </Link>
              <Link
                href="/provider/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl font-bold text-emerald-600 active:scale-95 transition-transform cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <Building2 size={20} className="cursor-pointer" />
                  Provider Login
                </span>
                <ChevronRight size={20} className="cursor-pointer" />
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Logged In Actions */}
        {isLoggedIn && (
          <div className="sm:hidden container mx-auto px-4 pb-3 flex gap-2">
            <Link
              href="/patient/dashboard"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
            >
              Dashboard
              <ArrowRight size={14} className="cursor-pointer" />
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("patientId");
                setIsLoggedIn(false);
              }}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full text-sm active:scale-95 transition-transform cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-10 relative z-10">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100/80 backdrop-blur-xl px-4 py-2 rounded-full mb-4 border border-emerald-200/50">
            <Zap size={14} className="text-emerald-600 cursor-pointer" />
            <span className="text-emerald-700 font-bold text-xs sm:text-sm tracking-wide uppercase">Africa Healthcare Ecosystem</span>
          </div>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed px-4">
            Providing transparent access to healthcare for a better tomorrow
          </p>
        </div>

        {/* Conditional Content */}
        {isLoggedIn ? (
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-3xl sm:rounded-[3rem] shadow-2xl p-8 sm:p-12 border border-white/50 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="text-white cursor-pointer" size={32} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Welcome Back! 👋</h2>
              <p className="text-base sm:text-lg text-slate-600 mb-8 font-medium">
                You&apos;re logged in to your MoreLife Healthcare account.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/patient/dashboard"
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-2xl font-black shadow-2xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
                >
                  View Dashboard
                  <ArrowRight size={20} className="cursor-pointer" />
                </Link>
                <Link
                  href="/patient/marketplace"
                  className="w-full px-6 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-2xl font-black hover:border-slate-300 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95 cursor-pointer"
                >
                  Browse Marketplace
                  <Sparkles size={18} className="cursor-pointer" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile-First Access Cards */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-12 sm:mb-20">
              {/* Patient Access Card - Mobile Optimized */}
              <Link
                href="/patient/login"
                className="group relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-3xl sm:rounded-[3rem] shadow-xl sm:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-6 sm:p-10 border border-white/50 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Mobile: Horizontal Layout for Icon + Title */}
                  <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 w-full sm:w-auto mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-blue-500/30 flex-shrink-0">
                      <Users className="text-white cursor-pointer" size={32} />
                    </div>
                    
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        Patient Access
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base font-medium mt-1 sm:mt-3">
                        Access your healthcare account
                      </p>
                    </div>
                  </div>
                  
                  {/* Features List - Compact on Mobile */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left w-full">
                    {[
                      { icon: Shield, text: "Digital Health Card" },
                      { icon: Heart, text: "Healthcare Packages" },
                      { icon: Sparkles, text: "Browse Marketplace" },
                      { icon: TrendingUp, text: "Manage Subscription" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 text-slate-700">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Check className="text-blue-600 cursor-pointer" size={12} strokeWidth={3} />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black group-hover:from-blue-700 group-hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    Get Started
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform cursor-pointer" />
                  </div>
                </div>
              </Link>

              {/* Provider Access Card - Mobile Optimized */}
              <Link
                href="/provider/login"
                className="group relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-3xl sm:rounded-[3rem] shadow-xl sm:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-6 sm:p-10 border border-white/50 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Mobile: Horizontal Layout for Icon + Title */}
                  <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0 w-full sm:w-auto mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-emerald-500/30 flex-shrink-0">
                      <Building2 className="text-white cursor-pointer" size={32} />
                    </div>
                    
                    <div className="text-left sm:text-center flex-1 sm:flex-none">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                        Provider Access
                      </h2>
                      <p className="text-slate-600 text-sm sm:text-base font-medium mt-1 sm:mt-3">
                        Manage your healthcare services
                      </p>
                    </div>
                  </div>
                  
                  {/* Features List - Compact on Mobile */}
                  <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-left w-full">
                    {[
                      { icon: Building2, text: "Manage Practice" },
                      { icon: Heart, text: "Create Packages" },
                      { icon: Network, text: "Patient Network" },
                      { icon: TrendingUp, text: "View Analytics" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 text-slate-700">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="text-emerald-600 cursor-pointer" size={12} strokeWidth={3} />
                        </div>
                        <span className="font-semibold text-xs sm:text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="w-full py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-2xl font-black group-hover:from-emerald-700 group-hover:to-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                    Get Started
                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform cursor-pointer" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section - Mobile Carousel */}
            <div className="max-w-6xl mx-auto mb-12">
              <div className="text-center mb-8 sm:mb-12 px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-3 sm:mb-4">
                  Why Choose MoreLife?
                </h2>
                <p className="text-base sm:text-lg text-slate-600 font-medium">
                  Transforming healthcare access across Africa
                </p>
              </div>
              
              {/* Mobile: Swipeable Carousel */}
              <div className="sm:hidden relative px-4">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeFeature * 100}%)` }}
                  >
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="w-full flex-shrink-0 px-2"
                      >
                        <div className="bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-3xl p-8 border border-white/50 shadow-xl">
                          <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto`}>
                            <feature.icon className="text-white cursor-pointer" size={32} />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-3 text-center">
                            {feature.title}
                          </h3>
                          <p className="text-slate-600 font-medium leading-relaxed text-center">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        activeFeature === index 
                          ? 'w-8 bg-blue-600' 
                          : 'w-2 bg-slate-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop: Grid Layout */}
              <div className="hidden sm:grid md:grid-cols-3 gap-6 sm:gap-8 px-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/50 shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.2)] transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                  >
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 shadow-lg`}>
                      <feature.icon className="text-white cursor-pointer" size={32} />
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

            {/* Trust Indicators - Mobile Optimized */}
            <div className="max-w-4xl mx-auto px-4 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-blue-100">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="text-yellow-500 fill-yellow-500 cursor-pointer" size={20} />
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">4.8/5</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Patient Rating</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">50K+</div>
                    <p className="text-sm text-slate-600 font-medium">Active Members</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-slate-300"></div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">200+</div>
                    <p className="text-sm text-slate-600 font-medium">Healthcare Providers</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer - Mobile Optimized */}
        <footer className="text-center mt-16 sm:mt-24 pb-6 sm:pb-8 px-4">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl px-4 sm:px-6 py-3 rounded-full border border-white/50 shadow-md">
            <Heart className="text-emerald-500 cursor-pointer" size={16} fill="currentColor" />
            <p className="text-slate-600 font-bold text-xs sm:text-sm">
              MoreLife: Providing access to healthcare for a better tomorrow
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
