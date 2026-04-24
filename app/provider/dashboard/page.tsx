"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProviderPaymentSettings from "@/components/ProviderPaymentSettings";
import StaffManagement, { Doctor } from "@/components/StaffManagement";
import { formatMHPNumber } from "@/lib/mhp-generator";
import {
  Building2, User, FileText, Hospital, MapPin, Phone, Mail, Package, QrCode,
  Plus, LogOut, Home, Calendar, Stethoscope, Tag, AlertTriangle, Trash2,
  Activity, ShieldCheck, CheckCircle2, AlertCircle, Clock, FileCheck, ShieldAlert,
  X, Eye, Edit, CreditCard, IdCard, Menu, ChevronRight, Users, CheckCircle
} from "lucide-react";
import { getCurrencyByLocation } from "@/lib/african-currencies";

interface ProviderData {
  id: string;
  providerName: string;
  contactPerson: string;
  category: string;
  providerType: string;
  location: string;
  contactTelephone: string;
  email: string;
  mhpNumber: string;
  isActive: boolean;
  isRevoked: boolean;
  verificationStatus: string;
  businessRegistrationDoc?: string;
  medicalLicenseDoc?: string;
  fireSafetyCert?: string;
  liabilityInsurance?: string;
  professionalLicenseDocs?: string;
  taxIdNumber?: string;
  proofOfAddressDoc?: string;
  directorIdDoc?: string;
  accreditationCert?: string;
  goodStandingCert?: string;
  dataProtectionRegDoc?: string;
  medicalLicenseExpiry?: string;
  fireSafetyExpiry?: string;
  liabilityInsuranceExpiry?: string;
  professionalLicenseExpiry?: string;
}

interface HealthcarePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  treatmentType: string;
  isFree: boolean;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  termsAndConditions?: string;
  mhpId?: string;
  isVideoConsultation?: boolean;
  sessionCount?: number;
  validityDays?: number;
}

const emptyForm = {
  name: "", description: "", price: "", duration: "", treatmentType: "",
  isFree: false, validFrom: "", validUntil: "", termsAndConditions: "",
  mhpId: "", isVideoConsultation: false, sessionCount: "1", validityDays: "180",
};

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider,             setProvider]             = useState<ProviderData | null>(null);
  const [packages,             setPackages]             = useState<HealthcarePackage[]>([]);
  const [loading,              setLoading]              = useState(true);
  const [showPackageForm,      setShowPackageForm]      = useState(false);
  const [packageForm,          setPackageForm]          = useState(emptyForm);
  const [showReviewModal,      setShowReviewModal]      = useState(false);
  const [showUpdateModal,      setShowUpdateModal]      = useState(false);
  const [showDeleteModal,      setShowDeleteModal]      = useState(false);
  const [showPaymentSettings,  setShowPaymentSettings]  = useState(false);
  const [showStaffManagement,  setShowStaffManagement]  = useState(false);
  const [showMobileMenu,       setShowMobileMenu]       = useState(false);
  const [doctors,              setDoctors]              = useState<Doctor[]>([]);
  const [selectedPackage,      setSelectedPackage]      = useState<HealthcarePackage | null>(null);
  const [updateForm,           setUpdateForm]           = useState(emptyForm);
  const [toast,                setToast]                = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getDocStatus = (doc?: string, expiry?: string) => {
    if (!doc) return { label: "Action Required", color: "text-red-500", bg: "bg-red-50", icon: ShieldAlert };
    if (expiry) {
      const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / 86400000);
      if (days < 0)  return { label: "Expired",       color: "text-red-600",   bg: "bg-red-100",   icon: AlertCircle };
      if (days < 30) return { label: "Expiring Soon", color: "text-amber-600", bg: "bg-amber-50",  icon: Clock };
    }
    return { label: "Verified", color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 };
  };

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const providerId = localStorage.getItem("providerId");
        if (!providerId) { router.replace("/provider/login"); return; }

        const response = await fetch(`/api/provider/profile?providerId=${providerId}`);
        const data = await response.json();

        if (response.ok) {
          setProvider(data.provider);
          setPackages(data.packages);
          setDoctors(data.doctors || []);
        } else {
          if (response.status === 401 || response.status === 404) router.replace("/provider/login");
        }
      } catch {
        // network error — stay on page
      } finally {
        setLoading(false);
      }
    };
    fetchProviderProfile();
  }, [router]);

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const providerId = localStorage.getItem("providerId");
    if (!providerId) return;
    try {
      const response = await fetch("/api/provider/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...packageForm, providerId }),
      });
      if (response.ok) {
        const newPkg = await response.json();
        setPackages([newPkg, ...packages]);
        setPackageForm(emptyForm);
        setShowPackageForm(false);
        showToast("Package published successfully");
      } else {
        showToast("Failed to create package", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    try {
      const response = await fetch("/api/provider/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateForm, id: selectedPackage.id, providerId: localStorage.getItem("providerId") }),
      });
      if (response.ok) {
        const updated = await response.json();
        setPackages(packages.map(p => p.id === selectedPackage.id ? updated : p));
        setShowUpdateModal(false);
        setSelectedPackage(null);
        showToast("Package updated successfully");
      } else {
        showToast("Failed to update package", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  const confirmDelete = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    try {
      const providerId = localStorage.getItem("providerId");
      const response = await fetch(`/api/provider/packages?id=${selectedPackage.id}&providerId=${providerId}`, { method: "DELETE" });
      if (response.ok) {
        setPackages(packages.filter(p => p.id !== selectedPackage.id));
        setShowDeleteModal(false);
        setSelectedPackage(null);
        showToast("Package removed");
      } else {
        showToast("Failed to delete package", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentSettings = async (settings: {
    flutterwaveEnabled?: boolean; flutterwavePublicKey?: string; flutterwaveSecretKey?: string; flutterwaveAccountId?: string;
    paystackEnabled?: boolean; paystackPublicKey?: string; paystackSecretKey?: string; paystackAccountId?: string;
  }) => {
    try {
      const providerId = localStorage.getItem("providerId");
      const response = await fetch("/api/provider/payment-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId, settings }),
      });
      if (response.ok) {
        showToast("Payment settings saved");
        setShowPaymentSettings(false);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to save settings", "error");
      }
    } catch {
      showToast("An error occurred", "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("providerId");
    router.replace("/provider/login");
  };

  const currency = provider ? getCurrencyByLocation(provider.location) : { symbol: "₦", code: "NGN" };
  const freeCount   = packages.filter(p => p.isFree).length;
  const activeCount = packages.filter(p => p.isActive).length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading && !provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-4">Please log in to access your dashboard</p>
          <Link href="/provider/login" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">

      {/* Background blobs */}
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-200/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-200/20 rounded-full blur-[100px]" />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-300 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm animate-in slide-in-from-top-4 fade-in duration-300 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      <div className="relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">

            {/* Mobile hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Menu size={20} className="text-slate-700" />
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Image src="/logo.png" alt="MoreLife Healthcare" width={140} height={50} className="object-contain" priority unoptimized />
            </div>

            {/* Mobile spacer */}
            <div className="w-10 lg:hidden" />

            {/* Desktop right: provider name + nav */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex flex-col items-end mr-2">
                <span className="text-base font-black text-slate-900 tracking-tight">{provider.providerName}</span>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{provider.contactPerson}</span>
              </div>
              <nav className="flex items-center gap-2">
                <button onClick={() => setShowPaymentSettings(true)} className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white font-bold rounded-full transition-all flex items-center gap-2 text-sm cursor-pointer">
                  <CreditCard size={15} /> Payments
                </button>
                <Link href="/provider/dashboard/redemptions" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-full transition-all flex items-center gap-2 text-sm">
                  <QrCode size={15} /> Redemptions
                </Link>
                <button onClick={() => setShowStaffManagement(true)} className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-full transition-all flex items-center gap-2 text-sm cursor-pointer">
                  <Users size={15} /> Staff
                </button>
                <Link href="/" className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-full transition-all flex items-center gap-2 text-sm">
                  <Home size={15} /> Home
                </Link>
                <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 font-bold rounded-full transition-all flex items-center gap-2 text-sm cursor-pointer">
                  <LogOut size={15} /> Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile drawer */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
              <div className="px-4 py-3 space-y-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-2">
                  <p className="font-black text-slate-900 text-sm">{provider.providerName}</p>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">{provider.contactPerson}</p>
                </div>
                <button onClick={() => { setShowPaymentSettings(true); setShowMobileMenu(false); }} className="w-full flex items-center justify-between p-3 bg-emerald-50 rounded-xl font-bold text-emerald-600 cursor-pointer">
                  <span className="flex items-center gap-3"><CreditCard size={18} /> Payments</span><ChevronRight size={18} />
                </button>
                <Link href="/provider/dashboard/redemptions" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl font-bold text-blue-600">
                  <span className="flex items-center gap-3"><QrCode size={18} /> Redemptions</span><ChevronRight size={18} />
                </Link>
                <button onClick={() => { setShowStaffManagement(true); setShowMobileMenu(false); }} className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-xl font-bold text-slate-700 cursor-pointer">
                  <span className="flex items-center gap-3"><Users size={18} /> Staff</span><ChevronRight size={18} />
                </button>
                <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl font-bold text-slate-700">
                  <span className="flex items-center gap-3"><Home size={18} /> Home</span><ChevronRight size={18} />
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl font-bold text-red-600 cursor-pointer">
                  <span className="flex items-center gap-3"><LogOut size={18} /> Logout</span><ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ── Main ────────────────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 lg:py-12">

          {/* Welcome */}
          <div className="mb-10 lg:mb-14 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3">
                  Partner Portal,{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-blue-600">
                    {provider.providerName}
                  </span>
                </h1>
                <p className="text-base lg:text-lg text-slate-500 font-medium max-w-2xl">
                  Monitor redemptions, manage your packages, and scale your impact across Africa.
                </p>
              </div>
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-sm font-black text-emerald-600 uppercase tracking-wider">System Online</span>
              </div>
            </div>
          </div>

          {/* ── Stats cards ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8 mb-10 lg:mb-14">

            <div className="group relative overflow-hidden bg-linear-to-br from-emerald-600 to-teal-700 rounded-4xl p-7 lg:p-8 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Package size={24} className="text-white" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-wider">Inventory</span>
              </div>
              <p className="text-4xl font-black text-white mb-1 relative z-10">{packages.length}</p>
              <p className="text-emerald-100/80 text-sm font-medium relative z-10">Total Healthcare Packages</p>
            </div>

            <div className="group relative overflow-hidden bg-linear-to-br from-blue-600 to-indigo-700 rounded-4xl p-7 lg:p-8 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Activity size={24} className="text-white" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-4xl font-black text-white mb-1 relative z-10">{activeCount}</p>
              <p className="text-blue-100/80 text-sm font-medium relative z-10">Currently Live & Listed</p>
            </div>

            <div className="group relative overflow-hidden bg-linear-to-br from-slate-700 to-slate-900 rounded-4xl p-7 lg:p-8 shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-white" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-wider">Free</span>
              </div>
              <p className="text-4xl font-black text-white mb-1 relative z-10">{freeCount}</p>
              <p className="text-slate-300 text-sm font-medium relative z-10">Complimentary / CSR Packages</p>
            </div>
          </div>

          {/* ── Compliance & Verification ───────────────────────────────── */}
          <div className="bg-white/60 backdrop-blur-xl rounded-4xl shadow-sm p-7 lg:p-10 border border-white/40 mb-10 lg:mb-14">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 lg:w-12 lg:h-12 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Compliance & Verification</h2>
                  <p className="text-slate-500 font-medium text-sm">Pan-African Regulatory Documentation Status</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-2 border ${
                provider.verificationStatus === "APPROVED"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {provider.verificationStatus === "APPROVED" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {provider.verificationStatus}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {[
                { title: "1. Core Business Verification", docs: [
                  { name: "Certificate of Incorporation",   status: getDocStatus(provider.businessRegistrationDoc) },
                  { name: "Tax Identification (TIN)",       status: getDocStatus(provider.taxIdNumber) },
                  { name: "Proof of Business Address",      status: getDocStatus(provider.proofOfAddressDoc) },
                  { name: "Director Identification",        status: getDocStatus(provider.directorIdDoc) },
                ]},
                { title: "2. Facility Operational Licensing", docs: [
                  { name: "Annual Operating License",       status: getDocStatus(provider.medicalLicenseDoc, provider.medicalLicenseExpiry) },
                  { name: "Accreditation Certificate",      status: getDocStatus(provider.accreditationCert) },
                  { name: "Health & Safety Permits",        status: getDocStatus(provider.fireSafetyCert, provider.fireSafetyExpiry) },
                ]},
                { title: "3. Professional Practitioner Verification", docs: [
                  { name: "Practicing Licenses",            status: getDocStatus(provider.professionalLicenseDocs, provider.professionalLicenseExpiry) },
                  { name: "Certificate of Good Standing",   status: getDocStatus(provider.goodStandingCert) },
                  { name: "Indemnity Insurance",            status: getDocStatus(provider.liabilityInsurance, provider.liabilityInsuranceExpiry) },
                ]},
                { title: "4. Digital Service Requirements", docs: [
                  { name: "Data Protection Registration",   status: getDocStatus(provider.dataProtectionRegDoc) },
                ]},
              ].map((category, idx) => (
                <div key={idx} className="p-6 lg:p-8 rounded-4xl bg-white/50 border border-slate-100 space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{category.title}</h3>
                  <div className="space-y-3">
                    {category.docs.map((doc, dIdx) => (
                      <div key={dIdx} className="flex items-center justify-between p-3 lg:p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${doc.status.bg}`}>
                            <FileCheck size={16} className={doc.status.color} />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{doc.name}</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.status.bg} ${doc.status.color}`}>
                          <doc.status.icon size={11} />
                          {doc.status.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Facility Identity ────────────────────────────────────────── */}
          <div className="bg-white/60 backdrop-blur-xl rounded-4xl shadow-sm p-7 lg:p-10 border border-white/40 mb-10 lg:mb-14">
            <div className="flex items-center gap-4 mb-8 lg:mb-10">
              <div className="w-11 h-11 lg:w-12 lg:h-12 bg-linear-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                <Building2 size={22} />
              </div>
              <div>
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Facility Identity</h2>
                <p className="text-slate-500 font-medium text-sm">Verified provider credentials and reach</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[
                { label: "Provider Name",   value: provider.providerName,                                                              icon: Building2,   bg: "bg-blue-50",    color: "text-blue-600" },
                { label: "Contact Person",  value: provider.contactPerson,                                                             icon: User,        bg: "bg-emerald-50", color: "text-emerald-600" },
                { label: "Category",        value: provider.category.toLowerCase().replace(/_/g, " "),                                 icon: FileText,    bg: "bg-indigo-50",  color: "text-indigo-600" },
                { label: "Type",            value: provider.providerType.toLowerCase().replace(/_/g, " "),                             icon: Hospital,    bg: "bg-teal-50",    color: "text-teal-600" },
                { label: "Location",        value: provider.location,                                                                  icon: MapPin,      bg: "bg-amber-50",   color: "text-amber-600" },
                { label: "Phone",           value: provider.contactTelephone,                                                          icon: Phone,       bg: "bg-emerald-50", color: "text-emerald-600" },
                { label: "Email",           value: provider.email,                                                                     icon: Mail,        bg: "bg-blue-50",    color: "text-blue-600" },
                { label: "MHP ID",          value: provider.mhpNumber ? formatMHPNumber(provider.mhpNumber) : "Pending Migration",     icon: IdCard,      bg: "bg-slate-100",  color: "text-slate-600" },
                { label: "System Rank",     value: "Verified Partner",                                                                 icon: ShieldCheck, bg: "bg-emerald-50", color: "text-emerald-600" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-3xl bg-white/60 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center`}>
                      <item.icon size={15} className={item.color} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                  <p className="text-base font-black text-slate-900 capitalize truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Healthcare Inventory ─────────────────────────────────────── */}
          <div className="bg-white/60 backdrop-blur-xl rounded-4xl shadow-sm p-7 lg:p-10 border border-white/40 mb-10 lg:mb-14">
            <div className="flex items-center justify-between mb-8 lg:mb-10">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 lg:w-12 lg:h-12 bg-linear-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                  <Package size={22} />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">Healthcare Inventory</h2>
                  <p className="text-slate-500 font-medium text-sm">Manage and publish your medical offerings</p>
                </div>
              </div>
              <button
                onClick={() => setShowPackageForm(!showPackageForm)}
                className={`px-5 lg:px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  showPackageForm
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-emerald-500/25 hover:-translate-y-0.5 active:scale-95"
                }`}
              >
                {showPackageForm ? <X size={18} /> : <Plus size={18} />}
                <span className="hidden sm:inline">{showPackageForm ? "Cancel" : "Create Package"}</span>
              </button>
            </div>

            {/* Create Package Form */}
            {showPackageForm && (
              <form onSubmit={handlePackageSubmit} className="mb-10 p-6 lg:p-10 rounded-4xl bg-emerald-50/40 border border-emerald-200/50 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">New Package Details</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: "Package Name",       key: "name",          type: "text",   placeholder: "e.g., Comprehensive Cardiac Check",     required: true },
                    { label: "Treatment Category", key: "treatmentType", type: "text",   placeholder: "e.g., Cardiology, General Medicine",     required: true },
                    { label: "Validity Period",    key: "duration",      type: "text",   placeholder: "e.g., 1 Year, 6 Months",                 required: true },
                    { label: "Valid From Date",    key: "validFrom",     type: "date",   placeholder: "",                                       required: true },
                    { label: "Valid Until Date",   key: "validUntil",    type: "date",   placeholder: "",                                       required: true },
                    { label: "MHP ID",             key: "mhpId",         type: "text",   placeholder: "MHP1234567890",                          required: true },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={(packageForm as any)[field.key]}
                        min={field.key === "validUntil" ? packageForm.validFrom : undefined}
                        onChange={(e) => setPackageForm({ ...packageForm, [field.key]: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-slate-300"
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Market Price ({currency.symbol})</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency.symbol}</span>
                      <input
                        type="number"
                        required={!packageForm.isFree}
                        value={packageForm.price}
                        onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                        disabled={packageForm.isFree}
                        className="w-full pl-10 pr-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold disabled:bg-slate-50 disabled:text-slate-400"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Key Features & Inclusions</label>
                    <textarea required value={packageForm.description} onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium resize-none placeholder:text-slate-300" rows={2} placeholder="Briefly list the primary benefits..." />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Terms & Conditions of Use</label>
                    <textarea required value={packageForm.termsAndConditions} onChange={(e) => setPackageForm({ ...packageForm, termsAndConditions: e.target.value })}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium resize-none placeholder:text-slate-300" rows={3} placeholder="Enter terms, restrictions, exclusions..." />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-3 gap-6 p-6 rounded-4xl bg-slate-50 border border-slate-100">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input type="checkbox" checked={packageForm.isVideoConsultation} onChange={(e) => setPackageForm({ ...packageForm, isVideoConsultation: e.target.checked })} className="peer hidden" />
                        <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-colors shadow-inner" />
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Video Consultation</span>
                    </label>
                    {packageForm.isVideoConsultation && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sessions Count</label>
                          <input type="number" min="1" required value={packageForm.sessionCount} onChange={(e) => setPackageForm({ ...packageForm, sessionCount: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Validity (Days)</label>
                          <input type="number" min="1" required value={packageForm.validityDays} onChange={(e) => setPackageForm({ ...packageForm, validityDays: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input type="checkbox" checked={packageForm.isFree} onChange={(e) => setPackageForm({ ...packageForm, isFree: e.target.checked, price: "" })} className="peer hidden" />
                        <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition-colors shadow-inner" />
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Mark as Complimentary / CSR Service</span>
                    </label>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button type="submit" className="px-10 py-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all cursor-pointer">
                    Publish Package
                  </button>
                </div>
              </form>
            )}

            {/* Package list */}
            <div className="grid gap-6">
              {packages.length === 0 ? (
                <div className="text-center py-20 lg:py-24 bg-white/30 rounded-4xl border-2 border-dashed border-slate-200">
                  <div className="w-20 h-20 bg-slate-100 rounded-4xl flex items-center justify-center mx-auto mb-5 text-slate-400">
                    <Package size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Inventory is Empty</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">Upload your healthcare packages today to reach new patients through the MoreLife ecosystem.</p>
                </div>
              ) : (
                packages.map((pkg) => (
                  <div key={pkg.id} className="group bg-white/60 backdrop-blur-md rounded-4xl border border-white/60 p-6 lg:p-8 hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
                      <div className="flex-1 space-y-5">
                        <div className="flex items-center flex-wrap gap-3">
                          <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{pkg.name}</h3>
                          <div className="flex gap-2">
                            {pkg.isFree && (
                              <span className="px-3 py-1 bg-linear-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-[10px] font-black shadow-sm uppercase tracking-widest">Free</span>
                            )}
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                              pkg.isActive ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                              {pkg.isActive ? "Live" : "Archived"}
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-500 font-medium leading-relaxed line-clamp-2 max-w-3xl text-sm lg:text-base">{pkg.description}</p>

                        <div className="flex flex-wrap gap-3">
                          {[
                            { icon: Stethoscope, bg: "bg-blue-50",    color: "text-blue-600",    label: "Type",    value: pkg.treatmentType },
                            { icon: Calendar,    bg: "bg-indigo-50",  color: "text-indigo-600",  label: "Period",  value: pkg.duration },
                            ...(pkg.mhpId ? [{ icon: IdCard, bg: "bg-slate-100", color: "text-slate-600", label: "MHP ID", value: pkg.mhpId }] : []),
                            ...(!pkg.isFree ? [{ icon: Tag, bg: "bg-emerald-50", color: "text-emerald-600", label: "Price", value: `${currency.symbol}${pkg.price.toLocaleString()}` }] : []),
                          ].map((chip, ci) => (
                            <div key={ci} className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                              <div className={`w-7 h-7 rounded-lg ${chip.bg} flex items-center justify-center`}>
                                <chip.icon size={14} className={chip.color} />
                              </div>
                              <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">{chip.label}</p>
                                <p className="text-xs font-black text-slate-900 leading-none">{chip.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                        <button onClick={() => { setSelectedPackage(pkg); setShowReviewModal(true); }}
                          className="flex-1 lg:flex-none px-4 py-3 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl font-bold transition-all border border-blue-100 hover:border-blue-600 flex items-center justify-center gap-2 cursor-pointer text-sm">
                          <Eye size={16} /><span className="hidden sm:inline">Details</span>
                        </button>
                        <button onClick={() => { setSelectedPackage(pkg); setUpdateForm({ name: pkg.name, description: pkg.description, price: pkg.price.toString(), duration: pkg.duration, treatmentType: pkg.treatmentType, isFree: pkg.isFree, validFrom: pkg.validFrom || "", validUntil: pkg.validUntil || "", termsAndConditions: pkg.termsAndConditions || "", mhpId: pkg.mhpId || "", isVideoConsultation: pkg.isVideoConsultation || false, sessionCount: (pkg.sessionCount || 1).toString(), validityDays: (pkg.validityDays || 180).toString() }); setShowUpdateModal(true); }}
                          className="flex-1 lg:flex-none px-4 py-3 bg-white hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-2xl font-bold transition-all border border-emerald-100 hover:border-emerald-600 flex items-center justify-center gap-2 cursor-pointer text-sm">
                          <Edit size={16} /><span className="hidden sm:inline">Edit</span>
                        </button>
                        <button onClick={() => { setSelectedPackage(pkg); setShowDeleteModal(true); }}
                          className="flex-1 lg:flex-none px-4 py-3 bg-white hover:bg-red-600 text-red-500 hover:text-white rounded-2xl font-bold transition-all border border-red-100 hover:border-red-600 flex items-center justify-center gap-2 cursor-pointer text-sm">
                          <Trash2 size={16} /><span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Review Modal ────────────────────────────────────────────────────── */}
      {showReviewModal && selectedPackage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowReviewModal(false)}>
          <div className="bg-white rounded-4xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center"><Eye size={20} className="text-blue-600" /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Package Details</h2>
                  <p className="text-xs text-slate-500 font-medium">Full configuration review</p>
                </div>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-8 space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Package Name</p>
                <p className="text-3xl font-black text-slate-900">{selectedPackage.name}</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Category</p>
                  <p className="text-base font-black text-slate-900">{selectedPackage.treatmentType}</p>
                </div>
                <div className="p-5 bg-indigo-50/50 rounded-3xl border border-indigo-100">
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Validity</p>
                  <p className="text-base font-black text-slate-900">{selectedPackage.duration}</p>
                </div>
                <div className="p-5 bg-emerald-50/50 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Price</p>
                  <p className="text-base font-black text-slate-900">{selectedPackage.isFree ? "Complimentary" : `${currency.symbol}${selectedPackage.price.toLocaleString()}`}</p>
                </div>
              </div>
              {(selectedPackage.validFrom || selectedPackage.validUntil) && (
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedPackage.validFrom && (
                    <div className="p-5 bg-teal-50/50 rounded-3xl border border-teal-100">
                      <p className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">Valid From</p>
                      <p className="text-base font-black text-slate-900">{new Date(selectedPackage.validFrom).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedPackage.validUntil && (
                    <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Valid Until</p>
                      <p className="text-base font-black text-slate-900">{new Date(selectedPackage.validUntil).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              )}
              {selectedPackage.mhpId && (
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider MHP ID</p>
                  <p className="text-base font-black text-slate-900 font-mono">{selectedPackage.mhpId}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</p>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-600 font-medium leading-relaxed">{selectedPackage.description}</p>
                </div>
              </div>
              {selectedPackage.termsAndConditions && (
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Terms & Conditions</p>
                  <div className="p-5 bg-amber-50/50 rounded-3xl border border-amber-100">
                    <p className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-sm">{selectedPackage.termsAndConditions}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${selectedPackage.isActive ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  <div className={`w-2 h-2 rounded-full ${selectedPackage.isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                  {selectedPackage.isActive ? "Live" : "Inactive"}
                </span>
              </div>
              <button onClick={() => setShowReviewModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 hover:-translate-y-0.5 transition-all cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Update Modal ─────────────────────────────────────────────────────── */}
      {showUpdateModal && selectedPackage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowUpdateModal(false)}>
          <div className="bg-white rounded-4xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center"><Edit size={20} className="text-emerald-600" /></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Edit Package</h2>
                  <p className="text-xs text-slate-500 font-medium">Apply updates to this package</p>
                </div>
              </div>
              <button onClick={() => setShowUpdateModal(false)} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-8">
              <form onSubmit={handleUpdateSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { label: "Name",             key: "name",          type: "text" },
                    { label: "Category",         key: "treatmentType", type: "text" },
                    { label: "Validity",         key: "duration",      type: "text" },
                    { label: "Valid From Date",  key: "validFrom",     type: "date" },
                    { label: "Valid Until Date", key: "validUntil",    type: "date" },
                    { label: "MHP ID",           key: "mhpId",         type: "text" },
                  ].map((field) => (
                    <div key={field.key} className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{field.label}</label>
                      <input type={field.type} required value={(updateForm as any)[field.key]}
                        min={field.key === "validUntil" ? updateForm.validFrom : undefined}
                        onChange={(e) => setUpdateForm({ ...updateForm, [field.key]: e.target.value })}
                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold" />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price ({currency.symbol})</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">{currency.symbol}</span>
                      <input type="number" required={!updateForm.isFree} value={updateForm.price} onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })} disabled={updateForm.isFree}
                        className="w-full pl-10 pr-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-black disabled:bg-slate-50 disabled:text-slate-400" />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description</label>
                    <textarea required value={updateForm.description} onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium resize-none min-h-28" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Terms & Conditions</label>
                    <textarea required value={updateForm.termsAndConditions} onChange={(e) => setUpdateForm({ ...updateForm, termsAndConditions: e.target.value })}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none font-medium resize-none placeholder:text-slate-300" rows={3} />
                  </div>

                  <div className="md:col-span-2 grid md:grid-cols-3 gap-5 p-6 rounded-4xl bg-slate-50 border border-slate-100">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input type="checkbox" checked={updateForm.isVideoConsultation} onChange={(e) => setUpdateForm({ ...updateForm, isVideoConsultation: e.target.checked })} className="peer hidden" />
                        <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-blue-500 transition-colors shadow-inner" />
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Video Consult</span>
                    </label>
                    {updateForm.isVideoConsultation && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sessions</label>
                          <input type="number" min="1" required value={updateForm.sessionCount} onChange={(e) => setUpdateForm({ ...updateForm, sessionCount: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Validity (Days)</label>
                          <input type="number" min="1" required value={updateForm.validityDays} onChange={(e) => setUpdateForm({ ...updateForm, validityDays: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-black" />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input type="checkbox" checked={updateForm.isFree} onChange={(e) => setUpdateForm({ ...updateForm, isFree: e.target.checked, price: "" })} className="peer hidden" />
                        <div className="w-14 h-8 bg-slate-200 rounded-full peer-checked:bg-emerald-500 transition-colors shadow-inner" />
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6" />
                      </div>
                      <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Complimentary Tier</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setShowUpdateModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-4 bg-linear-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all cursor-pointer">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ─────────────────────────────────────────────────────── */}
      {showDeleteModal && selectedPackage && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}>
          <div className="bg-white rounded-4xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 rounded-4xl flex items-center justify-center mx-auto mb-5">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Remove Package?</h2>
                <p className="text-slate-500 font-medium text-sm">This will permanently delist this package from the marketplace.</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-3xl p-5 mb-7 text-center">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Package</p>
                <p className="text-lg font-black text-slate-900">{selectedPackage.name}</p>
              </div>
              <div className="grid gap-3">
                <button onClick={confirmDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 hover:-translate-y-0.5 transition-all cursor-pointer">
                  Yes, Remove It
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Settings ─────────────────────────────────────────────────── */}
      {showPaymentSettings && (
        <ProviderPaymentSettings
          settings={{ flutterwaveEnabled: false, flutterwavePublicKey: "", flutterwaveSecretKey: "", paystackEnabled: false, paystackPublicKey: "", paystackSecretKey: "", mobileMoneyEnabled: false, bankTransferEnabled: false, defaultGateway: "flutterwave" }}
          onSave={handleSavePaymentSettings}
          onClose={() => setShowPaymentSettings(false)}
        />
      )}

      {/* ── Staff Management ─────────────────────────────────────────────────── */}
      {showStaffManagement && provider && (
        <StaffManagement
          doctors={doctors}
          providerId={provider.id}
          onClose={() => setShowStaffManagement(false)}
          onRefresh={() => {
            const providerId = localStorage.getItem("providerId");
            if (providerId) {
              fetch(`/api/provider/profile?providerId=${providerId}`)
                .then(res => res.json())
                .then(data => { if (data.doctors) setDoctors(data.doctors); });
            }
          }}
        />
      )}
    </div>
  );
}
