"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { africanCountries, type Country } from "@/lib/african-locations";
import { africanCountryCodes } from "@/lib/african-country-codes";
import { getCurrencyByCountry } from "@/lib/african-currencies";
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck,
  Users,
  Briefcase,
  ChevronRight,
  Plus,
  Minus,
  X,
  Upload,
  FileText,
  Building2
} from "lucide-react";

// Subscription pricing in NGN (base currency)
const SUBSCRIPTION_PRICES = {
  SINGLE: 2000,
  FAMILY: 10000,
  CORPORATE: 100000,
};

// Currency conversion rates (approximate, relative to NGN)
const CURRENCY_RATES: Record<string, number> = {
  NGN: 1,
  ZAR: 0.012,
  KES: 0.09,
  GHS: 0.008,
  EGP: 0.02,
  USD: 0.00065,
};

export default function PatientRegister() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    country: "",
    state: "",
    countryCode: "+234",
    mobileNumber: "",
    subscriptionType: "",
    memberCount: 1,
    // Family members (max 10)
    familyMembers: [] as string[],
    // Corporate fields
    businessName: "",
    corporateMembers: [] as string[],
    businessRegistrationDoc: null as File | null,
  });

  const [newMemberName, setNewMemberName] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get currency based on selected country
  const currency = formData.country ? getCurrencyByCountry(formData.country) : { symbol: "₦", code: "NGN", name: "Nigerian Naira" };
  
  // Calculate price in local currency
  const getLocalPrice = (basePrice: number) => {
    const rate = CURRENCY_RATES[currency.code] || CURRENCY_RATES["NGN"];
    return Math.round(basePrice * rate);
  };

  const subscriptionOptions = [
    { 
      id: "SINGLE", 
      label: "Single", 
      icon: User, 
      desc: "Personal healthcare access",
      price: SUBSCRIPTION_PRICES.SINGLE,
      maxMembers: 1,
      features: ["Personal health card", "Access to all packages", "Digital health passport"]
    },
    { 
      id: "FAMILY", 
      label: "Family", 
      icon: Users, 
      desc: "Cover up to 10 family members",
      price: SUBSCRIPTION_PRICES.FAMILY,
      maxMembers: 10,
      features: ["Up to 10 family members", "Shared family dashboard", "Family health tracking"]
    },
    { 
      id: "CORPORATE", 
      label: "Corporate / Business", 
      icon: Briefcase, 
      desc: "Organization-wide health coverage",
      price: SUBSCRIPTION_PRICES.CORPORATE,
      maxMembers: 500,
      features: ["Up to 500 employees", "Business verification required", "Corporate health analytics"]
    },
  ];

  const handleCountryChange = (countryName: string) => {
    const country = africanCountries.find((c) => c.name === countryName);
    setSelectedCountry(country || null);
    setFormData({ ...formData, country: countryName, state: "" });
  };

  const handleStateChange = (subdivisionName: string) => {
    if (!selectedCountry) return;
    setFormData({ ...formData, state: subdivisionName });
  };

  const addFamilyMember = () => {
    if (!newMemberName.trim()) return;
    if (formData.familyMembers.length >= 9) {
      setError("Maximum 10 family members allowed (including yourself)");
      return;
    }
    setFormData({ ...formData, familyMembers: [...formData.familyMembers, newMemberName.trim()] });
    setNewMemberName("");
    setError("");
  };

  const removeFamilyMember = (index: number) => {
    setFormData({ ...formData, familyMembers: formData.familyMembers.filter((_, i) => i !== index) });
  };

  const addCorporateMember = () => {
    if (!newMemberName.trim()) return;
    if (formData.corporateMembers.length >= 499) {
      setError("Maximum 500 members allowed. Contact us to increase limit.");
      return;
    }
    setFormData({ ...formData, corporateMembers: [...formData.corporateMembers, newMemberName.trim()] });
    setNewMemberName("");
    setError("");
  };

  const removeCorporateMember = (index: number) => {
    setFormData({ ...formData, corporateMembers: formData.corporateMembers.filter((_, i) => i !== index) });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFormData({ ...formData, businessRegistrationDoc: file });
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      setError("First Name is required (minimum 2 characters)");
      setLoading(false);
      return;
    }

    if (!formData.surname.trim() || formData.surname.trim().length < 2) {
      setError("Surname is required (minimum 2 characters)");
      setLoading(false);
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Date of Birth is required");
      setLoading(false);
      return;
    }

    const dob = new Date(formData.dateOfBirth);
    const today = new Date();
    if (dob >= today) {
      setError("Date of Birth must be in the past");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Corporate validation
    if (formData.subscriptionType === "CORPORATE") {
      if (!formData.businessName.trim()) {
        setError("Business name is required for corporate subscription");
        setLoading(false);
        return;
      }
      if (!formData.businessRegistrationDoc) {
        setError("Business registration document is required");
        setLoading(false);
        return;
      }
    }

    try {
      const mhNumber = `MH${Date.now().toString().slice(-8)}`;
      const location = `${formData.state}, ${formData.country}`;
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;
      const fullName = `${formData.firstName.trim()} ${formData.surname.trim()}`;

      const response = await fetch("/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          name: fullName,
          location,
          mobileNumber: fullMobileNumber,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          mhNumber,
          memberCount: formData.subscriptionType === "SINGLE" ? 1 : 
                       formData.subscriptionType === "FAMILY" ? formData.familyMembers.length + 1 :
                       formData.corporateMembers.length + 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("patientId", data.patientId);
        router.push("/patient/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
        setError("First Name is required (minimum 2 characters)");
        return;
      }
      if (!formData.surname.trim() || formData.surname.trim().length < 2) {
        setError("Surname is required (minimum 2 characters)");
        return;
      }
      if (!formData.email) {
        setError("Email is required");
        return;
      }
      if (!formData.password || !formData.confirmPassword) {
        setError("Password is required");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.dateOfBirth) {
        setError("Date of Birth is required");
        return;
      }
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        setError("Date of Birth must be in the past");
        return;
      }
      if (!formData.country) {
        setError("Country is required");
        return;
      }
      if (!formData.state) {
        setError("State/Province is required");
        return;
      }
      if (!formData.mobileNumber) {
        setError("Mobile number is required");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.subscriptionType) {
        setError("Please select a subscription plan");
        return;
      }
      if (formData.subscriptionType === "CORPORATE" && !formData.businessName.trim()) {
        setError("Business name is required for Corporate subscription");
        return;
      }
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const selectedPlan = subscriptionOptions.find(opt => opt.id === formData.subscriptionType);

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Premium Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-emerald-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-indigo-100/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-8 sm:p-12 border border-white/50">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-10 group transition-all duration-500 hover:scale-110 cursor-pointer">
              <Image src="/logo.png" alt="MoreLife Healthcare" width={200} height={80} className="object-contain mx-auto cursor-pointer" unoptimized />
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Start your medical journey with us</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 px-2 sm:px-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 border-2 ${
                  step === currentStep 
                    ? "bg-blue-600 border-blue-400 shadow-[0_15px_30px_-5px_rgba(37,99,235,0.4)] text-white scale-110" 
                    : step < currentStep 
                    ? "bg-emerald-500 border-emerald-400 shadow-lg text-white" 
                    : "bg-white border-slate-200 text-slate-400"
                }`}>
                  {step < currentStep ? <Check size={24} strokeWidth={3} /> : <span className="font-black text-xl">{step}</span>}
                </div>
                {step < totalSteps && (
                  <div className={`h-1.5 flex-1 mx-4 rounded-full transition-all duration-700 ${step < currentStep ? "bg-emerald-500 shadow-sm" : "bg-slate-200"}`}></div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-sm font-black">!</div>
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Step 1: Personal Identity */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">First Name <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                      <input type="text" required minLength={2} placeholder="First Name" value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Surname <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                      <input type="text" required minLength={2} placeholder="Surname" value={formData.surname}
                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                    <input type="email" required placeholder="Email Address" value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                      <input type="password" required minLength={6} placeholder="••••••••" value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Confirm Password</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                      <input type="password" required minLength={6} placeholder="••••••••" value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Contact */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Date of Birth <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                    <input type="date" required max={new Date().toISOString().split('T')[0]} value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold [color-scheme:light] shadow-sm cursor-pointer" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 pl-1">Required for identity verification</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Country</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" size={20} />
                      <select required value={formData.country} onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm">
                        <option value="">Select Country</option>
                        {africanCountries.map((country) => (
                          <option key={country.code} value={country.name}>{country.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">State / Province</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" size={20} />
                      <select required disabled={!selectedCountry} value={formData.state} onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold appearance-none cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-sm">
                        <option value="">{selectedCountry ? "Select State/Province" : "Select Country First"}</option>
                        {selectedCountry?.subdivisions.map((sub) => (
                          <option key={sub.code} value={sub.name}>{sub.name}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Mobile Number</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative shrink-0 sm:w-36">
                      <select required value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="w-full h-full pl-6 pr-10 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black appearance-none cursor-pointer shadow-sm">
                        {africanCountryCodes.map((country) => (
                          <option key={country.code} value={country.dialCode}>{country.flag} {country.dialCode}</option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                    <div className="relative group flex-1">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors cursor-pointer" size={20} />
                      <input type="tel" required placeholder="800 000 0000" value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, "") })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm cursor-text" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Subscription Selection */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Select Subscription Plan <span className="text-red-500">*</span></label>
                  <div className="grid gap-4">
                    {subscriptionOptions.map((tier) => (
                      <button key={tier.id} type="button"
                        onClick={() => setFormData({ ...formData, subscriptionType: tier.id, familyMembers: [], corporateMembers: [], businessName: "", businessRegistrationDoc: null })}
                        className={`p-5 rounded-[2rem] border-2 transition-all duration-500 text-left relative overflow-hidden cursor-pointer ${
                          formData.subscriptionType === tier.id
                            ? "bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/20"
                            : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-md shadow-sm"
                        }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                            formData.subscriptionType === tier.id ? "bg-white text-blue-600" : "bg-slate-100 text-slate-400"
                          }`}>
                            <tier.icon size={24} className="cursor-pointer" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className={`font-black text-lg ${formData.subscriptionType === tier.id ? "text-white" : "text-slate-900"}`}>{tier.label}</p>
                              <p className={`font-black text-xl ${formData.subscriptionType === tier.id ? "text-white" : "text-blue-600"}`}>
                                {currency.symbol}{getLocalPrice(tier.price).toLocaleString()}<span className="text-xs font-bold opacity-70">/year</span>
                              </p>
                            </div>
                            <p className={`text-sm font-medium ${formData.subscriptionType === tier.id ? "text-blue-100" : "text-slate-500"}`}>{tier.desc}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                            formData.subscriptionType === tier.id ? "bg-white text-blue-600 scale-100" : "bg-slate-100 scale-0"
                          }`}>
                            <Check size={14} strokeWidth={4} />
                          </div>
                        </div>
                        {formData.subscriptionType === tier.id && (
                          <div className="mt-4 pt-4 border-t border-white/20">
                            <div className="flex flex-wrap gap-2">
                              {tier.features.map((feature, i) => (
                                <span key={i} className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">{feature}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Family Members Section */}
                {formData.subscriptionType === "FAMILY" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-slate-900">Family Members</p>
                        <p className="text-xs text-slate-500">Add up to 9 additional family members (10 total including you)</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                        {formData.familyMembers.length + 1}/10
                      </span>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" placeholder="Enter family member name" value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFamilyMember())}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium cursor-text" />
                      </div>
                      <button type="button" onClick={addFamilyMember} disabled={formData.familyMembers.length >= 9}
                        className="px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        <Plus size={20} />
                      </button>
                    </div>

                    {formData.familyMembers.length > 0 && (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {formData.familyMembers.map((member, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">{index + 2}</div>
                              <span className="font-medium text-slate-900">{member}</span>
                            </div>
                            <button type="button" onClick={() => removeFamilyMember(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Corporate Section */}
                {formData.subscriptionType === "CORPORATE" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                    {/* Business Name */}
                    <div className="p-6 bg-purple-50/50 rounded-[2rem] border border-purple-100 space-y-4">
                      <p className="font-black text-slate-900">Business Information <span className="text-red-500">*</span></p>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input type="text" required placeholder="Business / Company Name" value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none font-bold cursor-text" />
                      </div>
                      
                      {/* File Upload */}
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-slate-600">Business Registration Document <span className="text-red-500">*</span></p>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.jpg,.jpeg,.png" className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()}
                          className="w-full p-4 border-2 border-dashed border-purple-200 rounded-2xl hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer">
                          {formData.businessRegistrationDoc ? (
                            <div className="flex items-center justify-center gap-3 text-purple-600">
                              <FileText size={20} />
                              <span className="font-bold">{formData.businessRegistrationDoc.name}</span>
                              <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, businessRegistrationDoc: null }); }}
                                className="p-1 hover:bg-purple-100 rounded-lg cursor-pointer">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                              <Upload size={24} />
                              <span className="font-bold">Click to upload (PDF, JPG, PNG - Max 5MB)</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Corporate Members */}
                    <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-black text-slate-900">Employee / Member Names</p>
                          <p className="text-xs text-slate-500">Add up to 500 members. Contact us to increase limit.</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-bold">
                          {formData.corporateMembers.length + 1}/500
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input type="text" placeholder="Enter employee name" value={newMemberName}
                            onChange={(e) => setNewMemberName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCorporateMember())}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium cursor-text" />
                        </div>
                        <button type="button" onClick={addCorporateMember} disabled={formData.corporateMembers.length >= 499}
                          className="px-4 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                          <Plus size={20} />
                        </button>
                      </div>

                      {formData.corporateMembers.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {formData.corporateMembers.map((member, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">{index + 2}</div>
                                <span className="font-medium text-slate-900">{member}</span>
                              </div>
                              <button type="button" onClick={() => removeCorporateMember(index)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-[2rem] border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Annual Subscription</p>
                      <p className="text-2xl font-black text-slate-900">{selectedPlan?.label} Plan</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-emerald-600">{currency.symbol}{getLocalPrice(selectedPlan?.price || 0).toLocaleString()}</p>
                      <p className="text-sm font-bold text-slate-500">per year</p>
                    </div>
                  </div>
                  {formData.subscriptionType !== "SINGLE" && (
                    <div className="mt-4 pt-4 border-t border-emerald-200/50">
                      <p className="text-sm text-slate-600">
                        <span className="font-bold">Total Members:</span> {formData.subscriptionType === "FAMILY" ? formData.familyMembers.length + 1 : formData.corporateMembers.length + 1}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-8">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep}
                  className="flex-1 py-5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 group shadow-md hover:shadow-lg active:scale-95 cursor-pointer">
                  <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform cursor-pointer" />
                  Back
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button type="button" onClick={nextStep}
                  className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-2 transition-all flex items-center justify-center gap-3 group cursor-pointer">
                  Continue
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform cursor-pointer" />
                </button>
              ) : (
                <button type="submit" disabled={loading}
                  className="flex-[2] py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-2 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale cursor-pointer">
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    <>
                      Complete Registration
                      <Check size={24} strokeWidth={3} className="cursor-pointer" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-12 text-center text-slate-400 font-bold tracking-tight">
            Already registered?{" "}
            <Link href="/patient/login" className="text-emerald-600 hover:text-emerald-500 ml-2 transition-colors border-b-2 border-emerald-600/20 hover:border-emerald-500 cursor-pointer">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
