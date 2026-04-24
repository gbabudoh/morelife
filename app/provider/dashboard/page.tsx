"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ProviderPaymentSettings from "@/components/ProviderPaymentSettings";
import StaffManagement, { Doctor } from "@/components/StaffManagement";
import { formatMHPNumber } from "@/lib/mhp-generator";
import { 
  Building2, 
  User, 
  FileText, 
  Hospital, 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  QrCode,
  Plus,
  LogOut,
  Home,
  Calendar,
  Stethoscope,
  Tag,
  AlertTriangle,
  Trash2,
  TrendingUp,
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  ShieldAlert,
  X,
  Eye,
  Edit,
  CreditCard,
  IdCard
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
  
  // Document existence
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
  
  // Expiry Dates
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

export default function ProviderDashboard() {
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [packages, setPackages] = useState<HealthcarePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [packageForm, setPackageForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    treatmentType: "",
    isFree: false,
    validFrom: "",
    validUntil: "",
    termsAndConditions: "",
    mhpId: "",
    isVideoConsultation: false,
    sessionCount: "1",
    validityDays: "180",
  });

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentSettings, setShowPaymentSettings] = useState(false);
  const [showStaffManagement, setShowStaffManagement] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<HealthcarePackage | null>(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    treatmentType: "",
    isFree: false,
    validFrom: "",
    validUntil: "",
    termsAndConditions: "",
    mhpId: "",
    isVideoConsultation: false,
    sessionCount: "1",
    validityDays: "180",
  });

  const getDocStatus = (doc?: string, expiry?: string) => {
    if (!doc) return { label: "Action Required", color: "text-red-500", bg: "bg-red-50", icon: ShieldAlert };
    if (expiry) {
      const expiryDate = new Date(expiry);
      const today = new Date();
      const diff = expiryDate.getTime() - today.getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      if (days < 0) return { label: "Expired", color: "text-red-600", bg: "bg-red-100", icon: AlertCircle };
      if (days < 30) return { label: "Expiring Soon", color: "text-amber-600", bg: "bg-amber-50", icon: Clock };
    }
    return { label: "Verified", color: "text-emerald-500", bg: "bg-emerald-50", icon: CheckCircle2 };
  };

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const providerId = localStorage.getItem('providerId');
        if (!providerId) {
          router.replace('/provider/login');
          return;
        }

        const response = await fetch(`/api/provider/profile?providerId=${providerId}`);
        const data = await response.json();

        if (response.ok) {
          setProvider(data.provider);
          setPackages(data.packages);
          setDoctors(data.doctors || []);
        } else {
          console.error("Failed to fetch profile:", data.error);
          if (response.status === 401 || response.status === 404) {
            router.replace('/provider/login');
          }
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderProfile();
  }, [router]);

  const handlePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const providerId = localStorage.getItem('providerId');
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
        setPackageForm({
          name: "",
          description: "",
          price: "",
          duration: "",
          treatmentType: "",
          isFree: false,
          validFrom: "",
          validUntil: "",
          termsAndConditions: "",
          mhpId: "",
          isVideoConsultation: false,
          sessionCount: "1",
          validityDays: "180",
        });
        setShowPackageForm(false);
      } else {
        alert("Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const handleReview = (pkg: HealthcarePackage) => {
    setSelectedPackage(pkg);
    setShowReviewModal(true);
  };

  const handleUpdate = (pkg: HealthcarePackage) => {
    setSelectedPackage(pkg);
    setUpdateForm({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price.toString(),
      duration: pkg.duration,
      treatmentType: pkg.treatmentType,
      isFree: pkg.isFree,
      validFrom: pkg.validFrom || "",
      validUntil: pkg.validUntil || "",
      termsAndConditions: pkg.termsAndConditions || "",
      mhpId: pkg.mhpId || "",
      isVideoConsultation: pkg.isVideoConsultation || false,
      sessionCount: (pkg.sessionCount || 1).toString(),
      validityDays: (pkg.validityDays || 180).toString(),
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    
    try {
      const response = await fetch("/api/provider/packages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updateForm, id: selectedPackage.id }),
      });

      if (response.ok) {
        const updatedPkg = await response.json();
        setPackages(packages.map(pkg => pkg.id === selectedPackage.id ? updatedPkg : pkg));
        setShowUpdateModal(false);
        setSelectedPackage(null);
      } else {
        alert("Failed to update package");
      }
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedPackage) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/provider/packages?id=${selectedPackage.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPackages(packages.filter(pkg => pkg.id !== selectedPackage.id));
        setShowDeleteModal(false);
        setSelectedPackage(null);
      } else {
        alert("Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (pkg: HealthcarePackage) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem('providerId');
    router.replace('/provider/login');
  };

  const handleSavePaymentSettings = async (settings: {
    flutterwaveEnabled?: boolean;
    flutterwavePublicKey?: string;
    flutterwaveSecretKey?: string;
    flutterwaveAccountId?: string;
    paystackEnabled?: boolean;
    paystackPublicKey?: string;
    paystackSecretKey?: string;
    paystackAccountId?: string;
  }) => {
    try {
      const providerId = localStorage.getItem('providerId');
      const response = await fetch('/api/provider/payment-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ providerId, settings }),
      });

      if (response.ok) {
        alert('Payment settings saved successfully!');
        setShowPaymentSettings(false);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error saving payment settings:', error);
      alert('Failed to save payment settings');
    }
  };

  const currency = provider ? getCurrencyByLocation(provider.location) : { symbol: "₦", code: "NGN" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">Please login to access your dashboard</p>
          <Link href="/provider/login" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Premium Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-emerald-100/40 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Modern Header with Enhanced Glassmorphism */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="MoreLife Healthcare"
                  width={160}
                  height={50}
                  className="object-contain h-auto"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xl font-black text-gray-900 tracking-tight">{provider.providerName}</span>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-widest leading-none mt-1">{provider.contactPerson}</span>
                </div>
                <nav className="flex items-center gap-3">
                  <button
                    onClick={() => setShowPaymentSettings(true)}
                    className="px-6 py-2.5 bg-green-600/10 text-green-600 hover:bg-green-600 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-green-600/10 hover:border-green-600 hover:shadow-lg hover:shadow-green-600/20 cursor-pointer"
                  >
                    <CreditCard size={18} className="cursor-pointer" />
                    <span className="hidden sm:inline">Payments</span>
                  </button>
                  <Link
                    href="/provider/dashboard/redemptions"
                    className="px-6 py-2.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-blue-600/10 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20 cursor-pointer"
                  >
                    <QrCode size={18} className="cursor-pointer" />
                    <span className="hidden sm:inline">Redemptions</span>
                  </Link>
                  <button
                    onClick={() => setShowStaffManagement(true)}
                    className="px-6 py-2.5 bg-purple-600/10 text-purple-600 hover:bg-purple-600 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-purple-600/10 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-600/20 cursor-pointer"
                  >
                    <User size={18} className="cursor-pointer" />
                    <span className="hidden sm:inline">Staff</span>
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-2.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Home size={18} />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-gray-500/10 text-gray-700 hover:bg-gray-700 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-gray-500/10 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-700/20 cursor-pointer"
                  >
                    <LogOut size={18} className="cursor-pointer" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>

      <div className="container mx-auto px-6 pt-32 pb-12">
        {/* Welcome Section with Micro-interaction */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
                  Partner Portal, 
                  <span className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                    {provider.providerName}!
                  </span>
                </h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl">
                  Empowering your facility with next-generation healthcare management. Monitor redemptions, manage your packages, and scale your impact.
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Status Update</div>
                <div className="text-xl font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
                  System Online
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards - Enhanced with Glow and Depth */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.25rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Package size={28} className="text-white cursor-pointer" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Inventory</span>
              </div>
              <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">{packages.length}</p>
              <p className="text-emerald-100/80 text-sm font-medium relative z-10">Total Healthcare Packages</p>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.25rem] p-8 shadow-[0_20px_50px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <Activity size={28} className="text-white cursor-pointer" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Active</span>
              </div>
              <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">{packages.filter(p => p.isActive).length}</p>
              <p className="text-blue-100/80 text-sm font-medium relative z-10">Currently Listed & Verified</p>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-700 rounded-[2.25rem] p-8 shadow-[0_20px_50px_rgba(147,51,234,0.2)] hover:shadow-[0_20px_60px_rgba(147,51,234,0.4)] transition-all duration-500 hover:-translate-y-2">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                  <TrendingUp size={28} className="text-white cursor-pointer" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Impact</span>
              </div>
              <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">Redeem</p>
              <p className="text-purple-100/80 text-sm font-medium relative z-10">Ready for instant verification</p>
            </div>
          </div>

          {/* Verification & Compliance - New Tiered System */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 mb-12">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <ShieldCheck size={24} className="cursor-pointer" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Compliance & Verification</h2>
                  <p className="text-gray-500 font-medium">Pan-African Regulatory Documentation Status</p>
                </div>
              </div>
              <div className={`px-6 py-2 rounded-2xl font-black text-sm flex items-center gap-2 border ${
                provider.verificationStatus === 'APPROVED' 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {provider.verificationStatus === 'APPROVED' ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                {provider.verificationStatus}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {[
                {
                  title: "1. Core Business Verification",
                  docs: [
                    { name: "Certificate of Incorporation", status: getDocStatus(provider.businessRegistrationDoc) },
                    { name: "Tax Identification (TIN)", status: getDocStatus(provider.taxIdNumber) },
                    { name: "Proof of Business Address", status: getDocStatus(provider.proofOfAddressDoc) },
                    { name: "Director Identification", status: getDocStatus(provider.directorIdDoc) },
                  ]
                },
                {
                  title: "2. Facility Operational Licensing",
                  docs: [
                    { name: "Annual Operating License", status: getDocStatus(provider.medicalLicenseDoc, provider.medicalLicenseExpiry) },
                    { name: "Accreditation Certificate", status: getDocStatus(provider.accreditationCert) },
                    { name: "Health & Safety Permits", status: getDocStatus(provider.fireSafetyCert, provider.fireSafetyExpiry) },
                  ]
                },
                {
                  title: "3. Professional Practitioner Verification",
                  docs: [
                    { name: "Practicing Licenses", status: getDocStatus(provider.professionalLicenseDocs, provider.professionalLicenseExpiry) },
                    { name: "Certificate of Good Standing", status: getDocStatus(provider.goodStandingCert) },
                    { name: "Indemnity Insurance", status: getDocStatus(provider.liabilityInsurance, provider.liabilityInsuranceExpiry) },
                  ]
                },
                {
                  title: "4. Digital Service Requirements",
                  docs: [
                    { name: "Data Protection Registration", status: getDocStatus(provider.dataProtectionRegDoc) },
                  ]
                }
              ].map((category, idx) => (
                <div key={idx} className="p-8 rounded-4xl bg-white/50 border border-white/60 space-y-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{category.title}</h3>
                  <div className="space-y-4">
                    {category.docs.map((doc, dIdx) => (
                      <div key={dIdx} className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${doc.status.bg}`}>
                            <FileCheck size={18} className={doc.status.color} />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">{doc.name}</span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.status.bg} ${doc.status.color}`}>
                          <doc.status.icon size={12} />
                          {doc.status.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Facility Identity Section */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 mb-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <Building2 size={24} className="cursor-pointer" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Facility Identity</h2>
                <p className="text-gray-500 font-medium">Verified provider credentials and reach</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: "Provider Name", value: provider.providerName, icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Contact Person", value: provider.contactPerson, icon: User, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Category", value: provider.category.toLowerCase().replace("_", " "), icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Type", value: provider.providerType.toLowerCase().replace("_", " "), icon: Hospital, color: "text-cyan-600", bg: "bg-cyan-50" },
                { label: "Location", value: provider.location, icon: MapPin, color: "text-rose-600", bg: "bg-rose-50" },
                { label: "Phone", value: provider.contactTelephone, icon: Phone, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Email", value: provider.email, icon: Mail, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "MHP ID", value: provider.mhpNumber ? formatMHPNumber(provider.mhpNumber) : "Pending Migration", icon: IdCard, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "System Rank", value: "Verified Partner", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
              ].map((item, index) => (
                <div key={index} className="group p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/60 hover:border-blue-300 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-8 h-8 ${item.bg} rounded-xl flex items-center justify-center`}>
                      <item.icon size={16} className={item.color} />
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                  <p className="text-lg font-black text-gray-900 capitalize tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

        {/* Healthcare Packages Section - Premium Glass */}
        <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 mb-12">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
                <Package size={24} className="cursor-pointer" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Healthcare Inventory</h2>
                <p className="text-gray-500 font-medium">Manage and publish your medical offerings</p>
              </div>
            </div>
            <button
              onClick={() => setShowPackageForm(!showPackageForm)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg border cursor-pointer ${
                showPackageForm 
                  ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95"
              }`}
            >
              {showPackageForm ? <X size={20} className="cursor-pointer" /> : <Plus size={20} className="cursor-pointer" />}
              {showPackageForm ? "Cancel" : "Create Package"}
            </button>
          </div>

          {showPackageForm && (
            <form onSubmit={handlePackageSubmit} className="mb-12 p-10 rounded-[2rem] bg-white/60 backdrop-blur-md border border-emerald-200/50 shadow-xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Plus size={20} className="cursor-pointer" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">New Offering Details</h3>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={packageForm.name}
                    onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                    placeholder="e.g., Comprehensive Cardiac Check"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Treatment Category</label>
                  <input
                    type="text"
                    required
                    value={packageForm.treatmentType}
                    onChange={(e) => setPackageForm({ ...packageForm, treatmentType: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                    placeholder="e.g., Cardiology, General Medicine"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Validity Period</label>
                  <input
                    type="text"
                    required
                    value={packageForm.duration}
                    onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-gray-300"
                    placeholder="e.g., 1 Year, 6 Months"
                  />
                </div>

                {/* Validity Date Range */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Valid From Date</label>
                  <input
                    type="date"
                    required
                    value={packageForm.validFrom}
                    onChange={(e) => setPackageForm({ ...packageForm, validFrom: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Valid Until Date</label>
                  <input
                    type="date"
                    required
                    value={packageForm.validUntil}
                    onChange={(e) => setPackageForm({ ...packageForm, validUntil: e.target.value })}
                    min={packageForm.validFrom}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium cursor-pointer"
                  />
                </div>

                {/* MHP ID */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">MHP ID (Provider ID)</label>
                  <input
                    type="text"
                    required
                    value={packageForm.mhpId}
                    onChange={(e) => setPackageForm({ ...packageForm, mhpId: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-mono font-bold placeholder:text-gray-300"
                    placeholder="MHP1234567890"
                    pattern="MHP\d{10}"
                    title="Format: MHP followed by 10 digits"
                  />
                </div>

                <div className="space-y-2 lg:col-span-1">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Market Price ({currency.symbol})</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">{currency.symbol}</span>
                    <input
                      type="number"
                      required={!packageForm.isFree}
                      value={packageForm.price}
                      onChange={(e) => setPackageForm({ ...packageForm, price: e.target.value })}
                      className="w-full pl-12 pr-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold disabled:bg-gray-50 disabled:text-gray-400"
                      placeholder="0.00"
                      disabled={packageForm.isFree}
                    />
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Key Features & Inclusions</label>
                  <textarea
                    required
                    value={packageForm.description}
                    onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium resize-none placeholder:text-gray-300"
                    rows={2}
                    placeholder="Briefly list the primary benefits..."
                  />
                </div>

                {/* Terms and Conditions */}
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Terms & Conditions of Use</label>
                  <textarea
                    required
                    value={packageForm.termsAndConditions}
                    onChange={(e) => setPackageForm({ ...packageForm, termsAndConditions: e.target.value })}
                    className="w-full px-6 py-4 bg-white/80 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-medium resize-none placeholder:text-gray-300"
                    rows={4}
                    placeholder="Enter terms and conditions, usage restrictions, exclusions, etc..."
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-3 grid md:grid-cols-3 gap-8 p-8 rounded-[2rem] bg-slate-50 border border-slate-100 mb-4">
                  <div className="space-y-4">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={packageForm.isVideoConsultation}
                          onChange={(e) => setPackageForm({ ...packageForm, isVideoConsultation: e.target.checked })}
                          className="peer hidden"
                        />
                        <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-blue-500 transition-colors duration-300 shadow-inner"></div>
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </div>
                      <span className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors uppercase tracking-widest">Video Consultation</span>
                    </label>
                  </div>

                  {packageForm.isVideoConsultation && (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sessions Count</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={packageForm.sessionCount}
                          onChange={(e) => setPackageForm({ ...packageForm, sessionCount: e.target.value })}
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Validity (Days)</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={packageForm.validityDays}
                          onChange={(e) => setPackageForm({ ...packageForm, validityDays: e.target.value })}
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-black"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="flex items-center gap-4 cursor-pointer group w-fit">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={packageForm.isFree}
                        onChange={(e) => setPackageForm({ ...packageForm, isFree: e.target.checked, price: "" })}
                        className="peer hidden"
                      />
                      <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-emerald-500 transition-colors duration-300 shadow-inner"></div>
                      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors uppercase tracking-widest">Mark as Complimentary / CSR Service</span>
                  </label>
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button
                  type="submit"
                  className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  Publish Package
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-8">
            {packages.length === 0 ? (
              <div className="text-center py-24 bg-white/30 rounded-[2rem] border-2 border-dashed border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-gray-400">
                  <Package size={48} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">Inventory is Empty</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto">Upload your healthcare packages today to reach new patients through the MoreLife ecosystem.</p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="group relative bg-white/60 backdrop-blur-md rounded-[2.25rem] border border-white/60 p-8 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:border-blue-200 transition-all duration-500"
                >
                  <div className="absolute -right-4 -top-4 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                      <div className="flex-1 space-y-6">
                        <div className="flex items-center flex-wrap gap-4">
                          <h3 className="text-3xl font-black text-gray-900 tracking-tight">{pkg.name}</h3>
                          <div className="flex gap-2">
                            {pkg.isFree && (
                              <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 uppercase tracking-widest">
                                Free
                              </span>
                            )}
                            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                              pkg.isActive 
                                ? "bg-blue-50 text-blue-600 border border-blue-100" 
                                : "bg-gray-100 text-gray-500 border border-gray-200"
                            }`}>
                              {pkg.isActive ? "Live" : "Archived"}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-lg text-gray-600 font-medium leading-relaxed line-clamp-2 max-w-3xl">
                          {pkg.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                              <Stethoscope size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Type</p>
                              <p className="text-sm font-bold text-gray-900 leading-none">{pkg.treatmentType}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Period</p>
                              <p className="text-sm font-bold text-gray-900 leading-none">{pkg.duration}</p>
                            </div>
                          </div>

                          {pkg.validFrom && pkg.validUntil && (
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                                <Calendar size={18} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Valid Dates</p>
                                <p className="text-sm font-bold text-gray-900 leading-none">
                                  {new Date(pkg.validFrom).toLocaleDateString()} - {new Date(pkg.validUntil).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          )}

                          {pkg.mhpId && (
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <IdCard size={18} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">MHP ID</p>
                                <p className="text-sm font-bold text-gray-900 leading-none font-mono">{pkg.mhpId}</p>
                              </div>
                            </div>
                          )}

                          {!pkg.isFree && (
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/80 rounded-2xl border border-gray-100 shadow-sm">
                              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Tag size={18} />
                              </div>
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Pricing</p>
                                <p className="text-sm font-black text-gray-900 leading-none">{currency.symbol}{pkg.price.toLocaleString()}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Unified Actions - Vertical Group on Mobile, Horizontal on Desktop */}
                      <div className="flex flex-row lg:flex-col gap-3 shrink-0">
                        <button
                          onClick={() => handleReview(pkg)}
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-blue-600/10 hover:border-blue-600 flex items-center justify-center gap-2 group/btn cursor-pointer"
                        >
                          <Eye size={20} className="group-hover/btn:scale-110 transition-transform cursor-pointer" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                        <button
                          onClick={() => handleUpdate(pkg)}
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-purple-600 text-purple-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-purple-600/10 hover:border-purple-600 flex items-center justify-center gap-2 group/btn cursor-pointer"
                        >
                          <Edit size={20} className="group-hover/btn:scale-110 transition-transform cursor-pointer" />
                          <span className="hidden sm:inline">Modify</span>
                        </button>
                        <button
                          onClick={() => handleDelete(pkg)}
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-rose-600 text-rose-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-rose-600/10 hover:border-rose-600 flex items-center justify-center gap-2 group/btn cursor-pointer"
                        >
                          <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform cursor-pointer" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Review Modal - Premium Glass */}
      {showReviewModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] max-w-2xl w-full max-h-[90vh] overflow-hidden border border-white relative z-10 animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                    <Eye size={24} className="cursor-pointer" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Offering Intelligence</h2>
                    <p className="text-gray-500 font-medium">Detailed configuration analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <div className="space-y-10">
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Primary Descriptor</p>
                  <p className="text-4xl font-black text-gray-900 leading-tight">{selectedPackage.name}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Category</p>
                    <p className="text-lg font-black text-gray-900">{selectedPackage.treatmentType}</p>
                  </div>
                  <div className="p-6 bg-purple-50/50 rounded-[2rem] border border-purple-100">
                    <p className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-2">Validity</p>
                    <p className="text-lg font-black text-gray-900">{selectedPackage.duration}</p>
                  </div>
                  <div className="p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">Market Price</p>
                    <p className="text-lg font-black text-gray-900">
                      {selectedPackage.isFree ? "Complimentary" : `${currency.symbol}${selectedPackage.price.toLocaleString()}`}
                    </p>
                  </div>
                </div>

                {/* Validity Date Range */}
                {(selectedPackage.validFrom || selectedPackage.validUntil) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedPackage.validFrom && (
                      <div className="p-6 bg-cyan-50/50 rounded-[2rem] border border-cyan-100">
                        <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2">Valid From</p>
                        <p className="text-lg font-black text-gray-900">{new Date(selectedPackage.validFrom).toLocaleDateString()}</p>
                      </div>
                    )}
                    {selectedPackage.validUntil && (
                      <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100">
                        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Valid Until</p>
                        <p className="text-lg font-black text-gray-900">{new Date(selectedPackage.validUntil).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* MHP ID */}
                {selectedPackage.mhpId && (
                  <div className="p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">Provider MHP ID</p>
                    <p className="text-lg font-black text-gray-900 font-mono">{selectedPackage.mhpId}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Defined Value & Benefits</p>
                  <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">{selectedPackage.description}</p>
                  </div>
                </div>

                {/* Terms and Conditions */}
                {selectedPackage.termsAndConditions && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Terms & Conditions</p>
                    <div className="p-8 bg-amber-50/50 rounded-[2rem] border border-amber-100">
                      <p className="text-base text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{selectedPackage.termsAndConditions}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                    selectedPackage.isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.isActive ? "bg-emerald-500" : "bg-gray-400"}`}></div>
                    Current Status: {selectedPackage.isActive ? "Live" : "Inactive"}
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal - Premium Glass */}
      {showUpdateModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white relative z-10 animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600">
                    <Edit size={24} className="cursor-pointer" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Refine Offering</h2>
                    <p className="text-gray-500 font-medium">Apply structural updates to package</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X size={20} className="cursor-pointer" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Name</label>
                    <input
                      type="text"
                      required
                      value={updateForm.name}
                      onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Category</label>
                    <input
                      type="text"
                      required
                      value={updateForm.treatmentType}
                      onChange={(e) => setUpdateForm({ ...updateForm, treatmentType: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-bold placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Validity</label>
                    <input
                      type="text"
                      required
                      value={updateForm.duration}
                      onChange={(e) => setUpdateForm({ ...updateForm, duration: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-bold placeholder:text-gray-300"
                    />
                  </div>

                  {/* Validity Date Range */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Valid From Date</label>
                    <input
                      type="date"
                      required
                      value={updateForm.validFrom}
                      onChange={(e) => setUpdateForm({ ...updateForm, validFrom: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-medium cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Valid Until Date</label>
                    <input
                      type="date"
                      required
                      value={updateForm.validUntil}
                      onChange={(e) => setUpdateForm({ ...updateForm, validUntil: e.target.value })}
                      min={updateForm.validFrom}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-medium cursor-pointer"
                    />
                  </div>

                  {/* Video Consultation Settings in Update Modal */}
                  <div className="md:col-span-2 grid md:grid-cols-3 gap-8 p-8 rounded-[2rem] bg-purple-50/50 border border-purple-100 mb-4">
                    <div className="space-y-4">
                      <label className="flex items-center gap-4 cursor-pointer group w-fit">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={updateForm.isVideoConsultation}
                            onChange={(e) => setUpdateForm({ ...updateForm, isVideoConsultation: e.target.checked })}
                            className="peer hidden"
                          />
                          <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-purple-500 transition-colors duration-300 shadow-inner"></div>
                          <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
                        </div>
                        <span className="text-sm font-black text-slate-700 group-hover:text-purple-600 transition-colors uppercase tracking-widest">Video Consult</span>
                      </label>
                    </div>

                    {updateForm.isVideoConsultation && (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest pl-1">Sessions</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={updateForm.sessionCount}
                            onChange={(e) => setUpdateForm({ ...updateForm, sessionCount: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-black"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-purple-400 uppercase tracking-widest pl-1">Validity (Days)</label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={updateForm.validityDays}
                            onChange={(e) => setUpdateForm({ ...updateForm, validityDays: e.target.value })}
                            className="w-full px-5 py-3 bg-white border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-black"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* MHP ID */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">MHP ID (Provider ID)</label>
                    <input
                      type="text"
                      required
                      value={updateForm.mhpId}
                      onChange={(e) => setUpdateForm({ ...updateForm, mhpId: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-mono font-bold placeholder:text-gray-300"
                      placeholder="MHP1234567890"
                      pattern="MHP\d{10}"
                      title="Format: MHP followed by 10 digits"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Price ({currency.symbol})</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">{currency.symbol}</span>
                      <input
                        type="number"
                        required={!updateForm.isFree}
                        value={updateForm.price}
                        onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-black disabled:bg-gray-50 disabled:text-gray-400"
                        disabled={updateForm.isFree}
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Descriptor</label>
                    <textarea
                      required
                      value={updateForm.description}
                      onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-medium resize-none min-h-[120px]"
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Terms & Conditions of Use</label>
                    <textarea
                      required
                      value={updateForm.termsAndConditions}
                      onChange={(e) => setUpdateForm({ ...updateForm, termsAndConditions: e.target.value })}
                      className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all outline-none font-medium resize-none placeholder:text-gray-300"
                      rows={4}
                      placeholder="Enter terms and conditions, usage restrictions, exclusions, etc..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-4 cursor-pointer group w-fit">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={updateForm.isFree}
                          onChange={(e) => setUpdateForm({ ...updateForm, isFree: e.target.checked, price: "" })}
                          className="peer hidden"
                        />
                        <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-purple-500 transition-colors duration-300 shadow-inner"></div>
                        <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Complimentary Tier</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-2 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    Commit Structural Updates
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal - Premium Glass */}
      {showDeleteModal && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] max-w-md w-full border border-white relative z-10 animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-rose-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-rose-600">
                  <AlertTriangle size={40} className="cursor-pointer" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Archive Offering?</h2>
                <p className="text-gray-500 font-medium">This structural removal is irreversible and will delist this service immediately.</p>
              </div>
              
              <div className="bg-rose-50/50 border border-rose-100 rounded-[2rem] p-6 mb-10 text-center">
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mb-1">Target Offering</p>
                <p className="text-xl font-black text-gray-900">{selectedPackage.name}</p>
              </div>
              
              <div className="grid gap-4">
                <button
                  onClick={confirmDelete}
                  className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-600/20 hover:bg-rose-700 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-5 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  Cancel & Retain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings Modal */}
      {showPaymentSettings && (
        <ProviderPaymentSettings
          settings={{
            flutterwaveEnabled: false,
            flutterwavePublicKey: "",
            flutterwaveSecretKey: "",
            paystackEnabled: false,
            paystackPublicKey: "",
            paystackSecretKey: "",
            mobileMoneyEnabled: false,
            bankTransferEnabled: false,
            defaultGateway: "flutterwave",
          }}
          onSave={handleSavePaymentSettings}
          onClose={() => setShowPaymentSettings(false)}
        />
      )}
        {showStaffManagement && provider && (
          <StaffManagement
            doctors={doctors}
            providerId={provider.id}
            onClose={() => setShowStaffManagement(false)}
            onRefresh={() => {
              // Trigger a re-fetch of provider data to get updated doctor list
              const providerId = localStorage.getItem('providerId');
              if (providerId) {
                fetch(`/api/provider/profile?providerId=${providerId}`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.doctors) setDoctors(data.doctors);
                  });
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
