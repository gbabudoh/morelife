"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { africanCountries, type Country } from "@/lib/african-locations";
import { africanCountryCodes } from "@/lib/african-country-codes";
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
  Minus
} from "lucide-react";

export default function PatientRegister() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    country: "",
    state: "",
    countryCode: "+234",
    mobileNumber: "",
    subscriptionType: "SINGLE",
    memberCount: 1,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCountryChange = (countryName: string) => {
    const country = africanCountries.find((c) => c.name === countryName);
    setSelectedCountry(country || null);
    setFormData({
      ...formData,
      country: countryName,
      state: "",
    });
  };

  const handleStateChange = (subdivisionName: string) => {
    if (!selectedCountry) return;
    setFormData({
      ...formData,
      state: subdivisionName,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const mhNumber = `MH${Date.now().toString().slice(-8)}`;
      const location = `${formData.state}, ${formData.country}`;
      const fullMobileNumber = `${formData.countryCode}${formData.mobileNumber}`;

      const response = await fetch("/api/patient/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          mobileNumber: fullMobileNumber,
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
          mhNumber,
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
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError("Please fill in all identity fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.dateOfBirth || !formData.country || !formData.state || !formData.mobileNumber) {
        setError("Please complete all profile information");
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Premium Mesh Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-emerald-100/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] bg-indigo-100/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-gradient-to-b from-white/95 to-white/80 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 sm:p-12 border border-white/50">
          <div className="text-center mb-10">
            <Link href="/" className="inline-block mb-10 group transition-all duration-500 hover:scale-110">
              <Image
                src="/logo.png"
                alt="MoreLife Healthcare"
                width={200}
                height={80}
                className="object-contain mx-auto"
                unoptimized
              />
            </Link>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-[10px]">Start your medical journey with us</p>
          </div>

          {/* High-Visibility Progress Indicator */}
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
                  <div className={`h-1.5 flex-1 mx-4 rounded-full transition-all duration-700 ${
                    step < currentStep ? "bg-emerald-500 shadow-sm" : "bg-slate-200"
                  }`}></div>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-10 p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-sm font-black">!</div>
              <p className="text-sm font-bold tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Personal Identity</label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Communication Channel</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Secure Pass</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Verification</label>
                    <div className="relative group">
                      <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Birth Record</label>
                  <div className="relative group">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full pl-16 pr-8 py-5 bg-white border border-slate-300 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold [color-scheme:light] shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Territory</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <select
                        required
                        value={formData.country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                      className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
                      >
                        <option value="" className="bg-white">Country</option>
                        {africanCountries.map((country) => (
                          <option key={country.code} value={country.name} className="bg-white">
                            {country.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Regional Unit</label>
                    <div className="relative group">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                      <select
                        required
                        disabled={!selectedCountry}
                        value={formData.state}
                        onChange={(e) => handleStateChange(e.target.value)}
                        className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold appearance-none cursor-pointer disabled:opacity-30 shadow-sm"
                      >
                        <option value="" className="bg-white">
                          {selectedCountry ? (selectedCountry.name === "Nigeria" ? "State" : "Province") : "Region"}
                        </option>
                        {selectedCountry?.subdivisions.map((subdivision) => (
                          <option key={subdivision.code} value={subdivision.name} className="bg-white">
                            {subdivision.name}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Mobile Uplink</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative shrink-0 sm:w-36 overflow-hidden">
                      <select
                        required
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        className="w-full h-full pl-6 pr-10 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black appearance-none cursor-pointer shadow-sm"
                      >
                        {africanCountryCodes.map((country) => (
                          <option key={country.code} value={country.dialCode} className="bg-white">
                            {country.flag} {country.dialCode}
                          </option>
                        ))}
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
                    </div>
                    <div className="relative group flex-1">
                      <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        type="tel"
                        required
                        placeholder="800 000 0000"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, "") })}
                        className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Membership Allocation</label>
                  <div className="grid gap-5">
                    {[
                      { id: "SINGLE", label: "Solo Patient", icon: User, desc: "Personal care roadmap" },
                      { id: "FAMILY", label: "Family Circle", icon: Users, desc: "Inclusive unit protection" },
                      { id: "CORPORATE", label: "Entity Admin", icon: Briefcase, desc: "Organization-wide health" },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, subscriptionType: tier.id })}
                        className={`p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex items-center gap-6 text-left relative overflow-hidden group ${
                          formData.subscriptionType === tier.id
                            ? "bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/20"
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          formData.subscriptionType === tier.id ? "bg-white text-blue-600 rotate-12" : "bg-slate-100 text-slate-400"
                        }`}>
                          <tier.icon size={28} />
                        </div>
                        <div className="relative z-10 flex-1">
                          <p className={`font-black text-xl mb-1 ${formData.subscriptionType === tier.id ? "text-white" : "text-slate-900"}`}>{tier.label}</p>
                          <p className={`text-sm font-medium ${formData.subscriptionType === tier.id ? "text-blue-100" : "text-slate-500"}`}>{tier.desc}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.subscriptionType === tier.id ? "bg-white text-blue-600 scale-100 opacity-100" : "bg-slate-100 opacity-0 scale-50"
                        }`}>
                          <Check size={18} strokeWidth={4} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {formData.subscriptionType !== "SINGLE" && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">
                      {formData.subscriptionType === "FAMILY" ? "Family Group Size" : "Corporate Headcount"}
                    </label>
                    <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-4 flex items-center justify-between shadow-sm focus-within:border-blue-500 transition-all">
                      <div className="flex items-center gap-4 pl-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          {formData.subscriptionType === "FAMILY" ? <Users size={20} /> : <Briefcase size={20} />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">Total Members</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Multi-member activation</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, memberCount: Math.max(1, formData.memberCount - 1) })}
                          className="w-12 h-12 rounded-2xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-600 active:scale-95"
                        >
                          <Minus size={20} />
                        </button>
                        <div className="w-16 text-center">
                          <span className="text-2xl font-black text-slate-900">{formData.memberCount}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, memberCount: formData.memberCount + 1 })}
                          className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition-all text-white shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-blue-600/70 text-center tracking-tight">
                      * Discounts are automatically applied based on membership volume.
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-5 pt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded-[2rem] font-black transition-all flex items-center justify-center gap-3 group shadow-md hover:shadow-lg active:scale-95"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                  Back
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-[2] py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2.5rem] font-black shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-2 transition-all flex items-center justify-center gap-3 group"
                >
                  Continue Flow
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-[2.5rem] font-black shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-2 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Activating...
                    </div>
                  ) : (
                    <>
                      Complete Activation
                      <Check size={24} strokeWidth={3} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-12 text-center text-slate-400 font-bold tracking-tight">
            Already registered?{" "}
            <Link href="/patient/login" className="text-emerald-600 hover:text-emerald-500 ml-2 transition-colors border-b-2 border-emerald-600/20 hover:border-emerald-500">
              Enter Vault
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
