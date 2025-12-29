"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Calendar,
  Stethoscope,
  Tag,
  AlertTriangle,
  Trash2,
  TrendingUp,
  Activity,
  ShieldCheck,
  X,
  Eye,
  Edit
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
  });

  // Modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<HealthcarePackage | null>(null);
  const [updateForm, setUpdateForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    treatmentType: "",
    isFree: false,
  });

  useEffect(() => {
    const fetchProviderProfile = async () => {
      try {
        const providerId = localStorage.getItem('providerId');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`/api/provider/profile?providerId=${providerId}`);
        const data = await response.json();

        if (response.ok) {
          setProvider(data.provider);
          setPackages(data.packages);
        } else {
          console.error("Failed to fetch profile:", data.error);
          if (response.status === 401 || response.status === 404) {
            router.push('/provider/login');
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
    const newPackage: HealthcarePackage = {
      id: Date.now().toString(),
      name: packageForm.name,
      description: packageForm.description,
      price: parseFloat(packageForm.price) || 0,
      duration: packageForm.duration,
      treatmentType: packageForm.treatmentType,
      isFree: packageForm.isFree,
      isActive: true,
    };
    setPackages([...packages, newPackage]);
    setPackageForm({
      name: "",
      description: "",
      price: "",
      duration: "",
      treatmentType: "",
      isFree: false,
    });
    setShowPackageForm(false);
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
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;
    
    const updatedPackages = packages.map(pkg =>
      pkg.id === selectedPackage.id
        ? {
            ...pkg,
            name: updateForm.name,
            description: updateForm.description,
            price: parseFloat(updateForm.price) || 0,
            duration: updateForm.duration,
            treatmentType: updateForm.treatmentType,
            isFree: updateForm.isFree,
          }
        : pkg
    );
    setPackages(updatedPackages);
    setShowUpdateModal(false);
    setSelectedPackage(null);
  };

  const handleDelete = (pkg: HealthcarePackage) => {
    setSelectedPackage(pkg);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedPackage) return;
    setPackages(packages.filter(p => p.id !== selectedPackage.id));
    setShowDeleteModal(false);
    setSelectedPackage(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('providerId');
    router.push('/provider/login');
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
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/logo.png"
                  alt="MoreLife Healthcare"
                  width={160}
                  height={64}
                  className="object-contain transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-lg"
                />
              </Link>
              <div className="flex items-center gap-6">
                <div className="hidden lg:flex flex-col items-end">
                  <span className="text-xl font-black text-gray-900 tracking-tight">{provider.providerName}</span>
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-widest leading-none mt-1">{provider.contactPerson}</span>
                </div>
                <nav className="flex items-center gap-3">
                  <Link
                    href="/provider/dashboard/redemptions"
                    className="px-6 py-2.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-blue-600/10 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    <QrCode size={18} />
                    <span className="hidden sm:inline">Redemptions</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-gray-500/10 text-gray-700 hover:bg-gray-700 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-gray-500/10 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-700/20"
                  >
                    <LogOut size={18} />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>

      <div className="container mx-auto px-6 py-12">
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
                  <Package size={28} className="text-white" />
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
                  <Activity size={28} className="text-white" />
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
                  <TrendingUp size={28} className="text-white" />
                </div>
                <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Impact</span>
              </div>
              <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">Redeem</p>
              <p className="text-purple-100/80 text-sm font-medium relative z-10">Ready for instant verification</p>
            </div>
          </div>

          {/* Provider Information Card - Premium Glass */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 mb-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <Building2 size={24} />
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
                <Package size={24} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Healthcare Inventory</h2>
                <p className="text-gray-500 font-medium">Manage and publish your medical offerings</p>
              </div>
            </div>
            <button
              onClick={() => setShowPackageForm(!showPackageForm)}
              className={`px-8 py-3 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2 shadow-lg border ${
                showPackageForm 
                  ? "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200" 
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-400 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95"
              }`}
            >
              {showPackageForm ? <X size={20} /> : <Plus size={20} />}
              {showPackageForm ? "Cancel" : "Create Package"}
            </button>
          </div>

          {showPackageForm && (
            <form onSubmit={handlePackageSubmit} className="mb-12 p-10 rounded-[2rem] bg-white/60 backdrop-blur-md border border-emerald-200/50 shadow-xl shadow-emerald-500/5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Plus size={20} />
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
                    rows={1}
                    placeholder="Briefly list the primary benefits..."
                  />
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
                  className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 active:scale-95"
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
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-blue-600/10 hover:border-blue-600 flex items-center justify-center gap-2 group/btn"
                        >
                          <Eye size={20} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Details</span>
                        </button>
                        <button
                          onClick={() => handleUpdate(pkg)}
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-purple-600 text-purple-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-purple-600/10 hover:border-purple-600 flex items-center justify-center gap-2 group/btn"
                        >
                          <Edit size={20} className="group-hover/btn:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Modify</span>
                        </button>
                        <button
                          onClick={() => handleDelete(pkg)}
                          className="flex-1 lg:flex-none p-4 bg-white hover:bg-rose-600 text-rose-600 hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-sm border border-rose-600/10 hover:border-rose-600 flex items-center justify-center gap-2 group/btn"
                        >
                          <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
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
                    <Eye size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Offering Intelligence</h2>
                    <p className="text-gray-500 font-medium">Detailed configuration analysis</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} />
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

                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Defined Value & Benefits</p>
                  <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100">
                    <p className="text-lg text-gray-600 font-medium leading-relaxed">{selectedPackage.description}</p>
                  </div>
                </div>

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
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl hover:bg-black hover:-translate-y-1 transition-all duration-300"
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
                    <Edit size={24} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Refine Offering</h2>
                    <p className="text-gray-500 font-medium">Apply structural updates to package</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors"
                >
                  <X size={20} />
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
                    className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all duration-300"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    className="flex-2 px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300"
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
                  <AlertTriangle size={40} />
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
                  className="w-full py-5 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-600/20 hover:bg-rose-700 hover:-translate-y-1 transition-all duration-300"
                >
                  Confirm Deletion
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full py-5 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel & Retain
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
