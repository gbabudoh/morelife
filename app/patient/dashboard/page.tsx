"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DigitalCard from "@/components/DigitalCard";
import { useRouter } from "next/navigation";
import { 
  LogOut, 
  ShoppingCart, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  CreditCard, 
  ShieldCheck, 
  Gem,
  Hospital,
  Activity,
  Lightbulb,
  CheckCircle2,
  RefreshCcw,
  QrCode,
  X,
  ClipboardList
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface PatientData {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  mhNumber: string;
  location: string;
  mobileNumber: string;
  subscriptionType: string;
}

interface PurchasedPackage {
  id: string;
  serialNumber: string;
  purchaseDate: string;
  redemptionStatus: "PENDING" | "REDEEMED" | "EXPIRED" | "CANCELLED";
  qrCodeData: string;
  price: number;
  package: {
    id: string;
    name: string;
    description: string;
    duration: string;
    treatmentType: string;
    provider: {
      providerName: string;
      location: string;
      providerType: string;
    };
  };
}

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [purchases, setPurchases] = useState<PurchasedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "USED">("ACTIVE");

  useEffect(() => {
    const fetchPatient = async () => {
      console.log("Dashboard: Starting fetchPatient");
      try {
        const patientId = localStorage.getItem("patientId");
        console.log("Dashboard: patientId from localStorage:", patientId);
        
        if (!patientId) {
          console.log("Dashboard: No patientId, redirecting to login");
          router.push("/patient/login");
          return;
        }

        const response = await fetch(`/api/patient/me?id=${patientId}`);
        console.log("Dashboard: API response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Dashboard: Patient data received:", data.name);
          setPatient(data);
          
          // Fetch purchases
          const purchasesRes = await fetch(`/api/patient/purchases?patientId=${patientId}`);
          if (purchasesRes.ok) {
            const purchasesData = await purchasesRes.json();
            setPurchases(purchasesData);
          }
        } else if (response.status === 404 || response.status === 401) {
          console.log("Dashboard: Auth failure or not found, clearing session");
          localStorage.removeItem("patientId");
          router.push("/patient/login");
        } else {
          console.error("Dashboard: Non-ok response from API", response.status);
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard: Error in fetchPatient:", error);
        setLoading(false);
      } finally {
        console.log("Dashboard: fetchPatient finally block");
        setLoading(false);
      }
    };

    fetchPatient();
    
    // Safety timeout: If still loading after 8 seconds, force stop loading
    const timer = setTimeout(() => {
      setLoading(currentLoading => {
        if (currentLoading) {
          console.warn("Dashboard: Loading safety timeout reached");
          return false;
        }
        return currentLoading;
      });
    }, 8000);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="text-xl font-medium text-gray-700">Please login to access your dashboard</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Premium Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-green-100/40 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
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
              <nav className="flex items-center gap-4">
                <Link
                  href="/patient/marketplace"
                  className="px-6 py-2.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-blue-600/10 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <ShoppingCart size={18} />
                  Marketplace
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("patientId");
                    router.push("/patient/login");
                  }}
                  className="px-6 py-2.5 bg-gray-500/10 text-gray-700 hover:bg-gray-700 hover:text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 border border-gray-500/10 hover:border-gray-700 hover:shadow-lg hover:shadow-gray-700/20"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-10">
          {/* Welcome Section with Micro-interaction */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end gap-4 justify-between">
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
                  Welcome back, 
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {patient.name.split(' ')[0]}!
                  </span>
                </h1>
                <p className="text-xl text-gray-500 font-medium max-w-2xl">
                  Your personalized health oasis. Monitor your subscriptions, manage benefits, and explore exclusive healthcare packages.
                </p>
              </div>
              <div className="hidden md:flex flex-col items-end">
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Today&apos;s Date</div>
                <div className="text-xl font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

        {/* Stats Cards - Enhanced with Glow and Depth */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(37,99,235,0.2)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <CreditCard size={28} className="text-white" />
              </div>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Health ID</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">{patient.mhNumber}</p>
            <p className="text-blue-100/80 text-sm font-medium relative z-10">Primary Identification Number</p>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-700 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(147,51,234,0.2)] hover:shadow-[0_20px_60px_rgba(147,51,234,0.4)] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <Gem size={28} className="text-white" />
              </div>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Plan</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight capitalize">
              {patient.subscriptionType.toLowerCase().replace("_", " ")}
            </p>
            <p className="text-purple-100/80 text-sm font-medium relative z-10">Premium Active Subscription</p>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.4)] transition-all duration-500 hover:-translate-y-2">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <span className="bg-white/10 px-3 py-1 rounded-full text-white/80 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">Verified</span>
            </div>
            <p className="text-4xl font-black text-white mb-2 relative z-10 tracking-tight">Active</p>
            <p className="text-emerald-100/80 text-sm font-medium relative z-10">Compliance & Trust Status</p>
          </div>
        </div>

          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Account Details - Premium Glass */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Account Profile</h2>
                  <p className="text-gray-500 font-medium">Your personal verification details</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-blue-600">
                    <User size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Full Name</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7">{patient.name}</p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-purple-600">
                    <Mail size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7 break-all">{patient.email}</p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-pink-600">
                    <Calendar size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Date of Birth</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7">
                    {new Date(patient.dateOfBirth).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-red-600">
                    <MapPin size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Location</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7">{patient.location}</p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-green-600">
                    <Phone size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Mobile Number</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7">{patient.mobileNumber}</p>
                </div>

                <div className="group">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <Gem size={18} />
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Plan Type</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900 pl-7 capitalize">
                    {patient.subscriptionType.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>

            {/* Subscription Overview - Premium Glass */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                  <Activity size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Subscription Overview</h2>
                  <p className="text-gray-500 font-medium">Plan usage and financial status</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:border-blue-300 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Plan Type</p>
                  <p className="text-3xl font-black bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent capitalize tracking-tight">
                    {patient.subscriptionType.toLowerCase().replace("_", " ")}
                  </p>
                </div>
                
                <div className="group bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:border-green-300 transition-all duration-500 hover:shadow-xl hover:shadow-green-500/5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Annual Fee</p>
                  <p className="text-3xl font-black text-gray-900 tracking-tight">₦5,000</p>
                </div>
                
                <div className="group bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/60 hover:border-emerald-300 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Account Status</p>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-40"></div>
                      <div className="w-4 h-4 bg-emerald-500 rounded-full relative"></div>
                    </div>
                    <p className="text-3xl font-black text-emerald-600 flex items-center gap-2 tracking-tight">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Card - Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500 sticky top-24 mb-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                  <Hospital size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Digital Health Card</h2>
                  <p className="text-gray-500 text-sm font-medium">Scan for instant verification</p>
                </div>
              </div>
              
              <div className="relative group/card">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover/card:opacity-40 transition duration-1000 group-hover/card:duration-200"></div>
                <div className="relative">
                  <DigitalCard
                    mhNumber={patient.mhNumber}
                    name={patient.name}
                    subscriptionType={patient.subscriptionType}
                  />
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-600/5 rounded-3xl border border-blue-600/10 relative overflow-hidden group/tip">
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600/5 rounded-full blur-xl group-hover/tip:scale-150 transition-transform duration-700"></div>
                <div className="text-sm text-gray-700 leading-relaxed flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb size={20} className="text-blue-600" />
                  </div>
                  <span>
                    <span className="font-bold text-blue-700 block mb-1">Quick Tip</span>
                    Present this card at any partner facility. The QR code confirms your status instantly.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Purchased Packages Section - Mobile First UI optimized */}
        <div className="mt-16 mb-20 max-w-7xl mx-auto px-4 md:px-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-600/20 flex-shrink-0 animate-bounce-subtle">
                <ClipboardList size={32} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Benefits</h2>
                <p className="text-gray-500 font-medium text-lg">Manage and redeem your healthcare packages</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-white/40 backdrop-blur-xl p-2 rounded-[1.5rem] border border-white/40 shadow-lg w-full sm:w-auto overflow-hidden">
                <button
                  onClick={() => setActiveTab("ACTIVE")}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
                    activeTab === "ACTIVE" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Activity size={20} />
                  <span>Active</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-lg text-xs font-black ${
                    activeTab === "ACTIVE" ? "bg-white/20" : "bg-gray-100"
                  }`}>
                    {purchases.filter(p => p.redemptionStatus === 'PENDING').length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("USED")}
                  className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-bold transition-all duration-500 flex items-center justify-center gap-2 ${
                    activeTab === "USED" 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105" 
                      : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <CheckCircle2 size={20} />
                  <span>Used</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-lg text-xs font-black ${
                    activeTab === "USED" ? "bg-white/20" : "bg-gray-100"
                  }`}>
                    {purchases.filter(p => p.redemptionStatus === 'REDEEMED').length}
                  </span>
                </button>
              </div>
              <Link 
                href="/patient/marketplace"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart size={22} />
                Explore More
              </Link>
            </div>
          </div>

          {purchases.filter(p => activeTab === 'ACTIVE' ? p.redemptionStatus === 'PENDING' : p.redemptionStatus === 'REDEEMED').length === 0 ? (
            <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-200 p-16 md:p-24 text-center group/empty transition-all duration-500 hover:border-blue-400/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-gray-200 shadow-inner group-hover/empty:scale-110 transition-transform duration-700 group-hover/empty:text-blue-400">
                {activeTab === 'ACTIVE' ? <ShoppingCart size={48} /> : <ClipboardList size={48} />}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                {activeTab === 'ACTIVE' ? 'No active packages' : 'No used packages yet'}
              </h3>
              <p className="text-xl text-gray-500 mb-10 max-w-md mx-auto font-medium">
                {activeTab === 'ACTIVE' 
                  ? 'Your digital health journey starts here. Explore our premium healthcare tiers.'
                  : 'Your history of wellness will be chronicled here.'}
              </p>
              {activeTab === 'ACTIVE' && (
                <Link
                  href="/patient/marketplace"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-xl shadow-blue-600/5 border border-blue-600 hover:scale-105"
                >
                  Start Exploring
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {purchases
                .filter(p => activeTab === 'ACTIVE' ? p.redemptionStatus === 'PENDING' : p.redemptionStatus === 'REDEEMED')
                .map((purchase) => (
                <div key={purchase.id} className="group relative bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] overflow-hidden border border-white/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2">
                  <div className={`p-8 border-b border-white/40 ${purchase.redemptionStatus === 'REDEEMED' ? 'bg-gray-500/5' : 'bg-gradient-to-br from-blue-600/5 to-indigo-600/5'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] shadow-sm ${
                        purchase.redemptionStatus === 'PENDING' ? 'bg-amber-500 text-white shadow-amber-500/20' :
                        purchase.redemptionStatus === 'REDEEMED' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                        'bg-rose-500 text-white shadow-rose-500/20'
                      }`}>
                        {purchase.redemptionStatus}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono font-bold bg-white/50 px-3 py-1 rounded-lg">
                        {purchase.serialNumber}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-300">{purchase.package.name}</h3>
                    <div className="text-sm text-gray-500 font-bold flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Hospital size={14} className="text-blue-600" />
                      </div>
                      {purchase.package.provider.providerName}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between items-center group/item">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Validity</span>
                        <span className="font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl group-hover/item:bg-blue-50 group-hover/item:text-blue-600 transition-colors">{purchase.package.duration}</span>
                      </div>
                      <div className="flex justify-between items-center group/item">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Category</span>
                        <span className="font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl group-hover/item:bg-purple-50 group-hover/item:text-purple-600 transition-colors">{purchase.package.treatmentType}</span>
                      </div>
                      <div className="flex justify-between items-center group/item">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Purchased</span>
                        <span className="font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setSelectedQR(purchase.qrCodeData);
                          setIsQRModalOpen(true);
                        }}
                        disabled={purchase.redemptionStatus !== 'PENDING'}
                        className="flex-[3] px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.25rem] font-black text-sm hover:shadow-xl hover:shadow-blue-600/30 transition-all flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-95"
                      >
                        <QrCode size={20} />
                        Redeem
                      </button>
                      <button 
                         onClick={() => {
                           router.push(`/patient/marketplace?repurchase=${purchase.package.id}`);
                         }}
                         className="flex-1 px-4 py-4 bg-white text-blue-600 rounded-[1.25rem] font-black text-sm hover:bg-blue-600 hover:text-white transition-all border-2 border-blue-600 active:scale-95 flex items-center justify-center"
                      >
                        <RefreshCcw size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* QR Code Modal for Redemption - Premium Glass Redesign */}
      {isQRModalOpen && selectedQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.3)] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500 border border-white/40">
            <div className="p-10 text-center">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <QrCode size={24} />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight text-left">Redeem Now</h3>
                </div>
                <button 
                  onClick={() => setIsQRModalOpen(false)} 
                  className="w-12 h-12 flex items-center justify-center bg-gray-100 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-300 active:scale-95 shadow-inner"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative group inline-block mb-10">
                <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="bg-white p-8 rounded-[2.5rem] border-[12px] border-gray-50 relative shadow-2xl">
                  <QRCodeSVG value={selectedQR || ""} size={240} level="H" includeMargin={false} />
                </div>
              </div>
              
              <div className="bg-blue-600/5 rounded-3xl p-8 mb-10 border border-blue-600/10">
                <p className="text-gray-700 font-bold leading-relaxed">
                  Present this secure QR code to the healthcare provider. They will scan it to verify and fulfill your treatment package.
                </p>
              </div>
              
              <button 
                onClick={() => setIsQRModalOpen(false)}
                className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-[1.5rem] font-black hover:shadow-2xl hover:shadow-gray-900/20 transition-all duration-300 active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
