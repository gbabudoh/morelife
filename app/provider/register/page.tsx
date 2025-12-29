"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  Phone, 
  Upload, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  History, 
  FileText,
  Briefcase,
  FlaskConical,
  Activity,
  Scissors,
  ChevronRight
} from "lucide-react";
import { africanCountries, type Country, type Subdivision } from "@/lib/african-locations";
import { africanCountryCodes } from "@/lib/african-country-codes";

export default function ProviderRegister() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    providerName: "",
    contactPerson: "",
    email: "",
    password: "",
    confirmPassword: "",
    category: "CLINIC",
    providerType: "GENERAL_HOSPITAL",
    country: "",
    state: "",
    city: "",
    countryCode: "+234",
    contactTelephone: "",
    
    // Step 2: Business Details
    yearStarted: "",
    businessRegistrationNumber: "",
    
    // Step 3: Specialized Services
    hasPharmacy: false,
    hasLaboratory: false,
    hasRadiology: false,
    hasSurgicalTheater: false,
  });

  // File uploads state
  const [files, setFiles] = useState({
    businessRegistrationDoc: null as File | null,
    medicalLicenseDoc: null as File | null,
    pharmacyPermit: null as File | null,
    laboratoryPermit: null as File | null,
    radiologyPermit: null as File | null,
    surgicalTheaterPermit: null as File | null,
    wasteManagementCert: null as File | null,
    fireSafetyCert: null as File | null,
    environmentalImpactCert: null as File | null,
    malpracticeInsurance: null as File | null,
    liabilityInsurance: null as File | null,
  });

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedSubdivision, setSelectedSubdivision] = useState<Subdivision | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCountryChange = (countryName: string) => {
    const country = africanCountries.find((c) => c.name === countryName);
    setSelectedCountry(country || null);
    setSelectedSubdivision(null);
    setFormData({
      ...formData,
      country: countryName,
      state: "",
      city: "",
    });
  };

  const handleStateChange = (subdivisionName: string) => {
    if (!selectedCountry) return;
    const subdivision = selectedCountry.subdivisions.find((s) => s.name === subdivisionName);
    setSelectedSubdivision(subdivision || null);
    setFormData({
      ...formData,
      state: subdivisionName,
      city: "",
    });
  };

  const handleFileChange = (fieldName: keyof typeof files, file: File | null) => {
    setFiles({ ...files, [fieldName]: file });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.providerName || !formData.contactPerson || !formData.email || !formData.password) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (!formData.country || !formData.state || !formData.city) {
          setError("Please select your location");
          return false;
        }
        break;
      case 2:
        if (!formData.yearStarted || !formData.businessRegistrationNumber) {
          setError("Please fill in business details");
          return false;
        }
        if (!files.businessRegistrationDoc || !files.medicalLicenseDoc) {
          setError("Please upload required documents");
          return false;
        }
        break;
      case 3:
        // Check if specialized services require permits
        if (formData.hasPharmacy && !files.pharmacyPermit) {
          setError("Please upload pharmacy permit");
          return false;
        }
        if (formData.hasLaboratory && !files.laboratoryPermit) {
          setError("Please upload laboratory permit");
          return false;
        }
        if (formData.hasRadiology && !files.radiologyPermit) {
          setError("Please upload radiology permit");
          return false;
        }
        if (formData.hasSurgicalTheater && !files.surgicalTheaterPermit) {
          setError("Please upload surgical theater permit");
          return false;
        }
        break;
    }
    setError("");
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setError("");
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const location = `${formData.city}, ${formData.state}, ${formData.country}`;
      const fullContactTelephone = `${formData.countryCode}${formData.contactTelephone}`;

      // For now, we'll store file names as placeholders
      // In production, you'd upload files to cloud storage first
      const response = await fetch("/api/provider/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          location,
          contactTelephone: fullContactTelephone,
          yearStarted: parseInt(formData.yearStarted),
          // Document file names (in production, these would be URLs from cloud storage)
          businessRegistrationDoc: files.businessRegistrationDoc?.name || null,
          medicalLicenseDoc: files.medicalLicenseDoc?.name || null,
          pharmacyPermit: files.pharmacyPermit?.name || null,
          laboratoryPermit: files.laboratoryPermit?.name || null,
          radiologyPermit: files.radiologyPermit?.name || null,
          surgicalTheaterPermit: files.surgicalTheaterPermit?.name || null,
          wasteManagementCert: files.wasteManagementCert?.name || null,
          fireSafetyCert: files.fireSafetyCert?.name || null,
          environmentalImpactCert: files.environmentalImpactCert?.name || null,
          malpracticeInsurance: files.malpracticeInsurance?.name || null,
          liabilityInsurance: files.liabilityInsurance?.name || null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("providerId", data.providerId);
        router.push("/provider/dashboard");
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

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 px-2 sm:px-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 border-2 ${
            step === currentStep 
              ? "bg-emerald-600 border-emerald-400 shadow-[0_15px_30px_-5px_rgba(16,185,129,0.4)] text-white scale-110" 
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
  );

  const renderStep1 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <Building2 size={24} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Basic Information</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Provider Entity</label>
          <div className="relative group">
            <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="text"
              required
              placeholder="Business Name"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Contact Person</label>
          <div className="relative group">
            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="text"
              required
              placeholder="Admin Name"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Communication</label>
          <div className="relative group">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="email"
              required
              placeholder="name@organization.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Security Pass</label>
          <div className="relative group">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Verification</label>
        <div className="relative group">
          <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Category</label>
          <div className="relative group">
            <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
            >
              <option value="CLINIC">Clinic</option>
              <option value="HOSPITAL">Hospital</option>
              <option value="HEALTH_CENTRE">Health Centre</option>
              <option value="MEDICAL_CENTRE">Medical Centre</option>
              <option value="DENTAL_CLINIC">Dental Clinic</option>
              <option value="EYE_CLINIC">Eye Clinic</option>
              <option value="PLASTIC_SURGERY_CLINIC">Plastic Surgery Clinic</option>
              <option value="MEDICAL_CHARITY">Medical Charity</option>
              <option value="PHARMACY">Pharmacy</option>
              <option value="LABORATORY">Laboratory</option>
              <option value="DIAGNOSTIC_CENTER">Diagnostic Center</option>
            </select>
            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Facility Type</label>
          <div className="relative group">
            <Activity className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              value={formData.providerType}
              onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
              className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
            >
              <option value="GENERAL_HOSPITAL">General Hospital</option>
              <option value="SPECIALIST_HOSPITAL">Specialist Hospital</option>
              <option value="DENTAL">Dental</option>
              <option value="COSMETICS">Cosmetics</option>
              <option value="OPTICIAN">Optician</option>
              <option value="MEDICAL_CENTRE">Medical Centre</option>
              <option value="MEDICAL_CHARITY">Medical Charity</option>
              <option value="PRIMARY_HEALTH_CENTRE">Primary Health Centre</option>
              <option value="COMMUNITY_HEALTH_CENTRE">Community Health Centre</option>
              <option value="MATERNITY_CLINIC">Maternity Clinic</option>
              <option value="PEDIATRIC_CLINIC">Pediatric Clinic</option>
            </select>
            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Territory</label>
        <div className="relative group">
          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            required
            value={formData.country}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
          >
            <option value="">Country</option>
            {africanCountries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
        </div>
      </div>

      {selectedCountry && (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">{selectedCountry.name === "Nigeria" ? "State" : "Province"}</label>
          <div className="relative group">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <select
              required
              value={formData.state}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
            >
              <option value="">{selectedCountry.name === "Nigeria" ? "State" : "Province/Region"}</option>
              {selectedCountry.subdivisions.map((subdivision) => (
                <option key={subdivision.code} value={subdivision.name}>
                  {subdivision.name}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
          </div>
        </div>
      )}

      {selectedSubdivision && (
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">City</label>
          <div className="relative group">
            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            {selectedSubdivision.cities && selectedSubdivision.cities.length > 0 ? (
              <>
                <select
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-16 pr-12 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold appearance-none cursor-pointer shadow-sm"
                >
                  <option value="">Select City</option>
                  {selectedSubdivision.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
              </>
            ) : (
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Enter city name"
                className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
              />
            )}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Mobile Uplink</label>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative shrink-0 sm:w-36 overflow-hidden">
            <select
              required
              value={formData.countryCode}
              onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
              className="w-full h-full pl-6 pr-10 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-black appearance-none cursor-pointer shadow-sm"
            >
              {africanCountryCodes.map((country) => (
                <option key={country.code} value={country.dialCode}>
                  {country.flag} {country.dialCode}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={16} />
          </div>
          <div className="relative group flex-1">
            <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="tel"
              required
              placeholder="800 000 0000"
              value={formData.contactTelephone}
              onChange={(e) => setFormData({ ...formData, contactTelephone: e.target.value.replace(/\D/g, "") })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <History size={24} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Business Heritage</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Inception Year</label>
          <div className="relative group">
            <History className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="number"
              required
              min="1900"
              max={new Date().getFullYear()}
              placeholder="e.g., 2015"
              value={formData.yearStarted}
              onChange={(e) => setFormData({ ...formData, yearStarted: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Registry Code</label>
          <div className="relative group">
            <FileText className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
            <input
              type="text"
              required
              placeholder="CAC / Registration #"
              value={formData.businessRegistrationNumber}
              onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
              className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-200 rounded-3xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold shadow-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Incorporation Proof</label>
          <div className="relative group overflow-hidden">
            <input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange("businessRegistrationDoc", e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className={`w-full flex items-center gap-4 pl-6 pr-8 py-5 bg-white border-2 border-dashed rounded-3xl transition-all ${files.businessRegistrationDoc ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 group-hover:border-emerald-500 group-hover:bg-slate-50"}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${files.businessRegistrationDoc ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
                <Upload size={22} className={files.businessRegistrationDoc ? "animate-bounce" : ""} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`font-bold text-sm truncate ${files.businessRegistrationDoc ? "text-emerald-700" : "text-slate-400"}`}>
                  {files.businessRegistrationDoc ? files.businessRegistrationDoc.name : "Select CAC Certificate"}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{files.businessRegistrationDoc ? "Replacement ready" : "PDF or Image allowed"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">Operating License</label>
          <div className="relative group overflow-hidden">
            <input
              type="file"
              required
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileChange("medicalLicenseDoc", e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className={`w-full flex items-center gap-4 pl-6 pr-8 py-5 bg-white border-2 border-dashed rounded-3xl transition-all ${files.medicalLicenseDoc ? "border-emerald-500 bg-emerald-50/30" : "border-slate-200 group-hover:border-emerald-500 group-hover:bg-slate-50"}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${files.medicalLicenseDoc ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
                <FileText size={22} className={files.medicalLicenseDoc ? "animate-pulse" : ""} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`font-bold text-sm truncate ${files.medicalLicenseDoc ? "text-emerald-700" : "text-slate-400"}`}>
                  {files.medicalLicenseDoc ? files.medicalLicenseDoc.name : "Select Facility License"}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{files.medicalLicenseDoc ? "Replacement ready" : "Ministry of Health permit"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <FlaskConical size={24} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Specialized Units</h3>
      </div>
      
      <p className="text-slate-500 font-medium -mt-4 pl-1">Enable units and upload mandatory operating permits</p>

      <div className="grid gap-4">
        {[
          { id: "hasPharmacy", label: "Pharmacy Unit", icon: Briefcase, permitKey: "pharmacyPermit", description: "Dispensing & medication management" },
          { id: "hasLaboratory", label: "Diagnostic Lab", icon: FlaskConical, permitKey: "laboratoryPermit", description: "Pathology & blood analysis" },
          { id: "hasRadiology", label: "Radiology Center", icon: Activity, permitKey: "radiologyPermit", description: "X-ray, MRI & imaging services" },
          { id: "hasSurgicalTheater", label: "Surgical Suite", icon: Scissors, permitKey: "surgicalTheaterPermit", description: "Operation & procedure rooms" },
        ].map((service) => (
          <div key={service.id} className={`group relative bg-white border-2 rounded-[2.5rem] p-6 transition-all duration-300 ${formData[service.id as keyof typeof formData] ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-md" : "border-slate-100 hover:border-emerald-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${formData[service.id as keyof typeof formData] ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500"}`}>
                  <service.icon size={24} />
                </div>
                <div>
                  <h4 className={`font-black tracking-tight ${formData[service.id as keyof typeof formData] ? "text-emerald-900" : "text-slate-900"}`}>{service.label}</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{service.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData[service.id as keyof typeof formData] as boolean}
                  onChange={(e) => setFormData({ ...formData, [service.id]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {formData[service.id as keyof typeof formData] && (
              <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in zoom-in-95 duration-400">
                <div className="relative group overflow-hidden">
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(service.permitKey as keyof typeof files, e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                  />
                  <div className={`w-full flex items-center gap-4 pl-6 pr-8 py-4 bg-slate-50 border-2 border-dashed rounded-2xl transition-all ${files[service.permitKey as keyof typeof files] ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 group-hover:border-emerald-400"}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${files[service.permitKey as keyof typeof files] ? "bg-emerald-500 text-white shadow-md" : "bg-white text-slate-400 shadow-sm"}`}>
                      <Upload size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className={`font-bold text-xs truncate ${files[service.permitKey as keyof typeof files] ? "text-emerald-700" : "text-slate-400"}`}>
                        {files[service.permitKey as keyof typeof files] ? files[service.permitKey as keyof typeof files]!.name : `Select Unit Permit`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-12 duration-700 ease-out">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
          <ShieldCheck size={24} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Trust & Safety</h3>
      </div>
      
      <p className="text-slate-500 font-medium -mt-4 pl-1">Optional certifications to accelerate your verification process</p>

      <div className="grid gap-4">
        {[
          { id: "wasteManagementCert", label: "Waste Management Cert", icon: FileText, description: "Biohazard handling & disposal" },
          { id: "fireSafetyCert", label: "Fire Safety Certificate", icon: FileText, description: "Compliance with local fire codes" },
          { id: "environmentalImpactCert", label: "Environmental Impact", icon: FileText, description: "Sustainability & impact assessment" },
          { id: "malpracticeInsurance", label: "Malpractice Insurance", icon: ShieldCheck, description: "Medical professional liability" },
          { id: "liabilityInsurance", label: "General Liability", icon: ShieldCheck, description: "Business operations insurance" },
        ].map((doc) => (
          <div key={doc.id} className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-1">{doc.label}</label>
            <div className="relative group overflow-hidden">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(doc.id as keyof typeof files, e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />
              <div className={`w-full flex items-center gap-4 pl-6 pr-8 py-5 bg-white border-2 border-slate-100 rounded-3xl transition-all ${files[doc.id as keyof typeof files] ? "border-emerald-500 bg-emerald-50/30" : "group-hover:border-emerald-200 group-hover:bg-slate-50"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${files[doc.id as keyof typeof files] ? "bg-emerald-500 text-white shadow-lg" : "bg-slate-50 text-slate-300"}`}>
                  <doc.icon size={22} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className={`font-bold text-sm truncate ${files[doc.id as keyof typeof files] ? "text-emerald-700" : "text-slate-400"}`}>
                    {files[doc.id as keyof typeof files] ? files[doc.id as keyof typeof files]!.name : doc.label}
                  </p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{doc.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-emerald-900/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
              <ShieldCheck size={24} className="text-emerald-300" />
            </div>
            <h4 className="text-xl font-black tracking-tight">System Integrity Check</h4>
          </div>
          <p className="text-emerald-100/80 font-medium leading-relaxed">
            By submitting this application, you authorize MoreLife Healthcare to verify these credentials with respective governing bodies.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative flex flex-col items-center justify-center py-20 px-4 overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] animate-pulse duration-10000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 transition-all duration-500">
        <div className="bg-white/90 backdrop-blur-3xl rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] p-10 sm:p-20 border border-white/50 relative overflow-hidden">
          {/* Subtle top decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500"></div>

          <div className="text-center mb-16">
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
            
            <div className="inline-flex items-center gap-3 bg-emerald-100/50 px-6 py-2 rounded-full mb-6 border border-emerald-200/50">
              <Building2 size={18} className="text-emerald-600" />
              <span className="text-emerald-700 font-black text-xs uppercase tracking-[0.15em]">Provider Registration</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter mb-4">Partner with MoreLife</h2>
            <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto">Join Africa&apos;s most advanced healthcare ecosystem. Onboarding takes less than 5 minutes.</p>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="mb-10 p-5 bg-red-50 border-2 border-red-100 text-red-600 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg font-black flex-shrink-0 shadow-sm shadow-red-200">!</div>
              <p className="font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <div className="min-h-[400px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-16 pt-12 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-400 rounded-[2rem] font-black hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95 group"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
                  Previous
                </button>
              ) : (
                <div className="hidden sm:block w-40"></div>
              )}
              
              <div className="flex items-center gap-3 text-slate-400 font-black text-xs uppercase tracking-widest bg-slate-50 px-6 py-3 rounded-full">
                Step <span className="text-emerald-600 text-lg">{currentStep}</span> <span className="text-slate-300">/</span> {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                >
                  Continue
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 group"
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Encrypting...
                    </div>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <footer className="mt-16 text-center">
            <p className="text-slate-400 font-bold tracking-tight">
              Already verified by MoreLife?{" "}
              <Link href="/provider/login" className="text-emerald-600 hover:text-emerald-700 font-black ml-1 transition-all border-b-2 border-emerald-600/10 hover:border-emerald-600">
                Log in and Access Portal
              </Link>
            </p>
          </footer>
        </div>
        
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex items-center gap-2 text-slate-900 group">
            <ShieldCheck size={20} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.25em] transition-all">End-to-End Encrypted</span>
          </div>
          <div className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></div>
          <div className="flex items-center gap-2 text-slate-900 group">
            <Lock size={18} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-[0.1em] group-hover:tracking-[0.15em] transition-all">ISO 27001 COMPLIANT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
