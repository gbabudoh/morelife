"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DigitalCard from "@/components/DigitalCard";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  LogOut, ShoppingCart, User, Mail, Calendar, MapPin, Phone, CreditCard, ShieldCheck, Gem,
  Hospital, Activity, Lightbulb, CheckCircle2, RefreshCcw, QrCode, X, ClipboardList, Home,
  Menu, ChevronRight, AlertCircle, Zap, Gift, Lock
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
  subscriptionStatus: string;
  subscriptionPlanType: string;
  subscriptionExpiresAt: string | null;
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
    provider: { providerName: string; location: string; providerType: string; };
  };
}

const SUBSCRIPTION_PRICES = { SINGLE: 2000, FAMILY: 10000, CORPORATE: 100000 };

export default function PatientDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [patient, setPatient] = useState<PatientData | null>(null);
  const [purchases, setPurchases] = useState<PurchasedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "USED">("ACTIVE");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [activationType, setActivationType] = useState<"PAID" | "GFP">("PAID");
  const [gfpCode, setGfpCode] = useState("");
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState("");
  const [selectedGateway, setSelectedGateway] = useState<"flutterwave" | "paystack">("flutterwave");

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientId = localStorage.getItem("patientId");
        console.log("Dashboard: patientId from localStorage:", patientId);
        
        if (!patientId) { 
          console.log("Dashboard: No patientId found, redirecting to login");
          router.push("/patient/login"); 
          return; 
        }
        
        const response = await fetch(`/api/patient/me?id=${patientId}`);
        const data = await response.json();
        console.log("Dashboard: API response status:", response.status, "data:", data);
        
        if (response.ok) {
          setPatient(data);
          
          // Check for payment callback
          const paymentType = searchParams.get("payment");
          const reference = searchParams.get("reference");
          if (paymentType === "subscription" && reference) {
            handlePaymentCallback(patientId, reference);
          }
          
          const purchasesRes = await fetch(`/api/patient/purchases?patientId=${patientId}`);
          if (purchasesRes.ok) { setPurchases(await purchasesRes.json()); }
        } else if (response.status === 404 || response.status === 401) {
          console.log("Dashboard: Patient not found or unauthorized, clearing localStorage");
          localStorage.removeItem("patientId");
          router.push("/patient/login");
        } else {
          console.log("Dashboard: Other error:", data.error);
          setFetchError(data.error || "Failed to load patient data");
        }
      } catch (error) { 
        console.error("Dashboard: Fetch error:", error); 
        setFetchError("Network error. Please try again.");
      }
      finally { setLoading(false); }
    };
    fetchPatient();
  }, [router, searchParams]);

  const handlePaymentCallback = async (patientId: string, reference: string) => {
    try {
      const res = await fetch("/api/patient/activate-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, activationType: "PAID", paymentReference: reference }),
      });
      if (res.ok) {
        const data = await res.json();
        setPatient(prev => prev ? { ...prev, ...data.patient } : null);
        router.replace("/patient/dashboard");
      }
    } catch (error) { console.error("Payment callback error:", error); }
  };

  const handleActivation = async () => {
    setActivating(true);
    setActivationError("");
    const patientId = localStorage.getItem("patientId");

    if (activationType === "GFP") {
      if (!gfpCode.trim()) { setActivationError("Please enter a GFP code"); setActivating(false); return; }
      try {
        const res = await fetch("/api/patient/activate-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, activationType: "GFP", gfpCode: gfpCode.trim() }),
        });
        const data = await res.json();
        if (res.ok) {
          setPatient(prev => prev ? { ...prev, subscriptionStatus: "ACTIVE", subscriptionPlanType: "GFP" } : null);
          setShowActivationModal(false);
        } else { setActivationError(data.error || "Activation failed"); }
      } catch { setActivationError("An error occurred"); }
    } else {
      try {
        const res = await fetch("/api/patient/subscription-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ patientId, gateway: selectedGateway }),
        });
        const data = await res.json();
        if (res.ok && data.paymentUrl) { window.location.href = data.paymentUrl; }
        else { setActivationError(data.error || "Payment initialization failed"); }
      } catch { setActivationError("An error occurred"); }
    }
    setActivating(false);
  };

  const isSubscriptionActive = patient?.subscriptionStatus === "ACTIVE";
  const isGFP = patient?.subscriptionPlanType === "GFP";
  const subscriptionPrice = SUBSCRIPTION_PRICES[patient?.subscriptionType as keyof typeof SUBSCRIPTION_PRICES] || 2000;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-base font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 px-4">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-700 mb-4">
            {fetchError || "Please login to access your dashboard"}
          </div>
          <Link 
            href="/patient/login" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all cursor-pointer"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-200/30 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 lg:bg-white/40 border-b border-white/40 shadow-sm">
          <div className="container mx-auto px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 lg:hidden">
                <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-xl cursor-pointer active:scale-95">
                  <Menu size={20} className="text-gray-700" />
                </button>
              </div>
              <Link href="/" className="cursor-pointer absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none">
                <Image src="/logo.png" alt="MoreLife" width={120} height={48} className="object-contain cursor-pointer lg:w-[160px]" />
              </Link>
              <div className="w-10 lg:hidden"></div>
              <nav className="hidden lg:flex items-center gap-4">
                {isSubscriptionActive && (
                  <Link href="/patient/marketplace" className="px-6 py-2.5 bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer">
                    <ShoppingCart size={18} />Marketplace
                  </Link>
                )}
                <button onClick={() => { localStorage.removeItem("patientId"); router.push("/patient/login"); }} className="px-6 py-2.5 bg-gray-500/10 text-gray-700 hover:bg-gray-700 hover:text-white font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer">
                  <LogOut size={18} />Logout
                </button>
              </nav>
            </div>
          </div>
          {showMobileMenu && (
            <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
              <div className="px-4 py-3 space-y-2">
                {isSubscriptionActive && (
                  <Link href="/patient/marketplace" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl font-bold text-blue-600 active:scale-95 cursor-pointer">
                    <span className="flex items-center gap-3"><ShoppingCart size={18} />Marketplace</span><ChevronRight size={18} />
                  </Link>
                )}
                <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl font-bold text-gray-700 active:scale-95 cursor-pointer">
                  <span className="flex items-center gap-3"><Home size={18} />Home</span><ChevronRight size={18} />
                </Link>
                <button onClick={() => { localStorage.removeItem("patientId"); router.push("/patient/login"); }} className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl font-bold text-red-600 active:scale-95 cursor-pointer">
                  <span className="flex items-center gap-3"><LogOut size={18} />Logout</span><ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </header>

        <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-10">
          {/* Welcome */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-2xl lg:text-5xl font-black text-gray-900 mb-2">Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{patient.name.split(' ')[0]}!</span></h1>
            <p className="text-sm lg:text-xl text-gray-500 font-medium">Your personalized health dashboard</p>
          </div>

          {/* Subscription Activation Banner */}
          {!isSubscriptionActive && (
            <div className="mb-8 p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl lg:rounded-[2rem] shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">Activate Your Subscription</h3>
                    <p className="text-amber-100 font-medium">Your account is not yet active. Activate now to access the healthcare marketplace.</p>
                  </div>
                </div>
                <button onClick={() => setShowActivationModal(true)} className="px-8 py-4 bg-white text-amber-600 rounded-xl font-black hover:bg-amber-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95">
                  <Zap size={20} />Activate Now
                </button>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-lg cursor-pointer active:scale-95 lg:active:scale-100 lg:hover:-translate-y-2 transition-all">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <CreditCard size={20} className="text-white lg:w-7 lg:h-7" />
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Health ID</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1">{patient.mhNumber}</p>
              <p className="text-blue-100/80 text-xs lg:text-sm font-medium">Primary ID Number</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600 to-pink-700 rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-lg cursor-pointer active:scale-95 lg:active:scale-100 lg:hover:-translate-y-2 transition-all">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Gem size={20} className="text-white lg:w-7 lg:h-7" />
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Plan</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1 capitalize">{patient.subscriptionType.toLowerCase()}</p>
              <p className="text-purple-100/80 text-xs lg:text-sm font-medium">
                {isGFP ? "Government Free Programme" : `₦${subscriptionPrice.toLocaleString()}/year`}
              </p>
            </div>
            
            <div className={`rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-lg cursor-pointer active:scale-95 lg:active:scale-100 lg:hover:-translate-y-2 transition-all ${
              isSubscriptionActive ? "bg-gradient-to-br from-emerald-500 to-teal-700" : "bg-gradient-to-br from-gray-400 to-gray-600"
            }`}>
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  {isSubscriptionActive ? <ShieldCheck size={20} className="text-white lg:w-7 lg:h-7" /> : <Lock size={20} className="text-white lg:w-7 lg:h-7" />}
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Status</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1">{isSubscriptionActive ? "Active" : "Inactive"}</p>
              <p className="text-white/80 text-xs lg:text-sm font-medium">
                {isSubscriptionActive ? (isGFP ? "GFP Activated" : patient.subscriptionExpiresAt ? `Expires ${new Date(patient.subscriptionExpiresAt).toLocaleDateString()}` : "Verified") : "Pending Activation"}
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div className="lg:col-span-2 space-y-6">
              {/* Account Profile */}
              <div className="bg-white/60 lg:bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] p-4 lg:p-10 border border-white/40 shadow-lg">
                <div className="flex items-center gap-3 mb-5 lg:mb-10">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <User size={20} className="lg:w-6 lg:h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg lg:text-3xl font-black text-gray-900">Account Profile</h2>
                    <p className="text-[11px] lg:text-base text-gray-500 font-medium">Your personal details</p>
                  </div>
                </div>
                
                <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
                  {[
                    { icon: User, label: "Full Name", value: patient.name, color: "blue" },
                    { icon: Mail, label: "Email", value: patient.email, color: "purple" },
                    { icon: Calendar, label: "Date of Birth", value: new Date(patient.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), color: "pink" },
                    { icon: MapPin, label: "Location", value: patient.location, color: "red" },
                    { icon: Phone, label: "Mobile", value: patient.mobileNumber, color: "green" },
                    { icon: Gem, label: "Plan Type", value: patient.subscriptionType.toLowerCase().replace("_", " "), color: "indigo" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 lg:p-4 bg-gradient-to-r from-${item.color}-50 to-${item.color}-50/50 rounded-xl lg:rounded-2xl`}>
                      <div className={`w-9 h-9 lg:w-10 lg:h-10 bg-${item.color}-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon size={16} className={`text-${item.color}-600 lg:w-[18px] lg:h-[18px]`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-[10px] lg:text-xs font-semibold text-${item.color}-600 uppercase tracking-wide`}>{item.label}</p>
                        <p className="text-sm lg:text-base font-bold text-gray-900 truncate capitalize">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Digital Card Column */}
            <div className="lg:col-span-1">
              <button onClick={() => setShowCardModal(true)} className="w-full lg:hidden bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-lg active:scale-[0.98] cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${isSubscriptionActive ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-gray-400 to-gray-500"}`}>
                      <Hospital size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-gray-900">Digital Health Card</h3>
                      <p className="text-xs text-gray-500 font-medium">{isSubscriptionActive ? "Tap to view" : "Inactive"}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-gray-400" />
                </div>
              </button>
              <div className="hidden lg:block bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/40 shadow-lg sticky top-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${isSubscriptionActive ? "bg-gradient-to-tr from-emerald-500 to-teal-600" : "bg-gradient-to-tr from-gray-400 to-gray-500"}`}>
                    <Hospital size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Digital Health Card</h2>
                    <p className="text-gray-500 text-sm font-medium">{isSubscriptionActive ? "Scan for verification" : "Activate to enable"}</p>
                  </div>
                </div>
                <div className="relative group">
                  {!isSubscriptionActive && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-[2rem] z-10 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock size={32} className="mx-auto mb-2" />
                        <p className="font-bold">Activate to unlock</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition"></div>
                  <div className="relative">
                    <DigitalCard mhNumber={patient.mhNumber} name={patient.name} subscriptionType={patient.subscriptionType} isActive={isSubscriptionActive} isGFP={isGFP} />
                  </div>
                </div>
                {isGFP && (
                  <div className="mt-6 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <div className="flex items-center gap-3">
                      <Gift size={20} className="text-green-600" />
                      <div>
                        <p className="font-bold text-green-700">Government Free Programme</p>
                        <p className="text-xs text-green-600">Access to free healthcare packages only</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Benefits Section - Only show if active */}
          {isSubscriptionActive ? (
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8 mb-6 lg:mb-10">
                <div className="flex items-center gap-3 lg:gap-5">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl lg:rounded-[1.5rem] flex items-center justify-center text-white shadow-xl">
                    <ClipboardList size={24} className="lg:w-8 lg:h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-4xl font-black text-gray-900">My Benefits</h2>
                    <p className="text-sm lg:text-lg text-gray-500 font-medium">Manage your packages</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                  <div className="flex bg-white/60 lg:bg-white/40 backdrop-blur-xl p-1.5 lg:p-2 rounded-2xl border border-white/40 shadow-sm lg:shadow-lg w-full sm:w-auto">
                    <button onClick={() => setActiveTab("ACTIVE")} className={`flex-1 sm:flex-none px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm lg:text-base ${activeTab === "ACTIVE" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-white/50"}`}>
                      <Activity size={18} /><span>Active</span><span className={`px-2 py-0.5 rounded-lg text-xs font-black ${activeTab === "ACTIVE" ? "bg-white/20" : "bg-gray-100"}`}>{purchases.filter(p => p.redemptionStatus === 'PENDING').length}</span>
                    </button>
                    <button onClick={() => setActiveTab("USED")} className={`flex-1 sm:flex-none px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm lg:text-base ${activeTab === "USED" ? "bg-blue-600 text-white shadow-lg" : "text-gray-500 hover:bg-white/50"}`}>
                      <CheckCircle2 size={18} /><span>Used</span><span className={`px-2 py-0.5 rounded-lg text-xs font-black ${activeTab === "USED" ? "bg-white/20" : "bg-gray-100"}`}>{purchases.filter(p => p.redemptionStatus === 'REDEEMED').length}</span>
                    </button>
                  </div>
                  <Link href="/patient/marketplace" className="hidden sm:flex px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all items-center gap-2 active:scale-95 cursor-pointer">
                    <ShoppingCart size={20} />Explore More
                  </Link>
                </div>
              </div>

              {purchases.filter(p => activeTab === 'ACTIVE' ? p.redemptionStatus === 'PENDING' : p.redemptionStatus === 'REDEEMED').length === 0 ? (
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[3rem] border-2 border-dashed border-gray-200 p-12 lg:p-24 text-center">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8 text-gray-200 shadow-inner">
                    {activeTab === 'ACTIVE' ? <ShoppingCart size={32} className="lg:w-12 lg:h-12" /> : <ClipboardList size={32} className="lg:w-12 lg:h-12" />}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">{activeTab === 'ACTIVE' ? 'No active packages' : 'No used packages yet'}</h3>
                  <p className="text-base lg:text-xl text-gray-500 mb-6 lg:mb-10 max-w-md mx-auto font-medium">{activeTab === 'ACTIVE' ? 'Start your health journey by exploring our packages' : 'Your wellness history will appear here'}</p>
                  {activeTab === 'ACTIVE' && <Link href="/patient/marketplace" className="inline-flex items-center gap-2 px-8 lg:px-10 py-4 lg:py-5 bg-white text-blue-600 rounded-2xl font-black hover:bg-blue-600 hover:text-white transition-all shadow-xl border border-blue-600 cursor-pointer"><ShoppingCart size={20} />Start Exploring</Link>}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                  {purchases.filter(p => activeTab === 'ACTIVE' ? p.redemptionStatus === 'PENDING' : p.redemptionStatus === 'REDEEMED').map((purchase) => (
                    <div key={purchase.id} className="bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] shadow-lg overflow-hidden border border-white/40 hover:shadow-xl lg:hover:-translate-y-2 transition-all cursor-pointer">
                      <div className={`p-5 lg:p-8 border-b border-white/40 ${purchase.redemptionStatus === 'REDEEMED' ? 'bg-gray-500/5' : 'bg-gradient-to-br from-blue-600/5 to-indigo-600/5'}`}>
                        <div className="flex justify-between items-start mb-4 lg:mb-6">
                          <span className={`px-3 lg:px-4 py-1 rounded-full text-[10px] font-black uppercase ${purchase.redemptionStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>{purchase.redemptionStatus}</span>
                          <span className="text-[10px] text-gray-400 font-mono font-bold bg-white/50 px-2 py-1 rounded-lg">{purchase.serialNumber}</span>
                        </div>
                        <h3 className="text-lg lg:text-2xl font-black text-gray-900 mb-2">{purchase.package.name}</h3>
                        <div className="text-xs lg:text-sm text-gray-500 font-bold flex items-center gap-2"><div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-100 rounded-lg flex items-center justify-center"><Hospital size={12} className="text-blue-600" /></div>{purchase.package.provider.providerName}</div>
                      </div>
                      <div className="p-5 lg:p-8">
                        <div className="space-y-3 lg:space-y-4 mb-5 lg:mb-8">
                          <div className="flex justify-between items-center"><span className="text-xs lg:text-sm font-bold text-gray-400 uppercase">Validity</span><span className="font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl text-sm">{purchase.package.duration}</span></div>
                          <div className="flex justify-between items-center"><span className="text-xs lg:text-sm font-bold text-gray-400 uppercase">Category</span><span className="font-black text-gray-800 bg-gray-50 px-3 py-1 rounded-xl text-sm">{purchase.package.treatmentType}</span></div>
                        </div>
                        <div className="flex gap-2 lg:gap-4">
                          <button onClick={() => { setSelectedQR(purchase.qrCodeData); setIsQRModalOpen(true); }} disabled={purchase.redemptionStatus !== 'PENDING'} className="flex-[3] px-4 lg:px-6 py-3 lg:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl lg:rounded-[1.25rem] font-black text-xs lg:text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 cursor-pointer disabled:cursor-not-allowed"><QrCode size={18} />Redeem</button>
                          <button onClick={() => router.push(`/patient/marketplace?repurchase=${purchase.package.id}`)} className="flex-1 px-3 lg:px-4 py-3 lg:py-4 bg-white text-blue-600 rounded-xl lg:rounded-[1.25rem] font-black text-xs lg:text-sm hover:bg-blue-600 hover:text-white transition-all border-2 border-blue-600 active:scale-95 flex items-center justify-center cursor-pointer"><RefreshCcw size={18} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-12 bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[3rem] border-2 border-dashed border-gray-200 p-12 lg:p-24 text-center">
              <div className="w-16 h-16 lg:w-24 lg:h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8">
                <Lock size={32} className="text-amber-600 lg:w-12 lg:h-12" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">Marketplace Locked</h3>
              <p className="text-base lg:text-xl text-gray-500 mb-6 lg:mb-10 max-w-md mx-auto font-medium">Activate your subscription to access healthcare packages</p>
              <button onClick={() => setShowActivationModal(true)} className="inline-flex items-center gap-2 px-8 lg:px-10 py-4 lg:py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black hover:shadow-2xl transition-all cursor-pointer active:scale-95">
                <Zap size={20} />Activate Subscription
              </button>
            </div>
          )}
        </div>

        {/* Mobile FAB */}
        {isSubscriptionActive && (
          <Link href="/patient/marketplace" className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 cursor-pointer z-40">
            <ShoppingCart size={24} />
          </Link>
        )}
      </div>

      {/* Activation Modal */}
      {showActivationModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowActivationModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-black text-gray-900">Activate Subscription</h3>
              <button onClick={() => setShowActivationModal(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer active:scale-95"><X size={20} /></button>
            </div>
            <div className="p-6">
              {activationError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{activationError}</p>
                </div>
              )}

              {/* Activation Type Selection */}
              <div className="space-y-4 mb-6">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Choose Activation Method</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActivationType("PAID")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activationType === "PAID" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <CreditCard size={24} className={activationType === "PAID" ? "text-blue-600 mx-auto mb-2" : "text-gray-400 mx-auto mb-2"} />
                    <p className={`font-black text-center ${activationType === "PAID" ? "text-blue-600" : "text-gray-600"}`}>Pay Now</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Full access</p>
                  </button>
                  <button onClick={() => setActivationType("GFP")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activationType === "GFP" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <Gift size={24} className={activationType === "GFP" ? "text-green-600 mx-auto mb-2" : "text-gray-400 mx-auto mb-2"} />
                    <p className={`font-black text-center ${activationType === "GFP" ? "text-green-600" : "text-gray-600"}`}>GFP Code</p>
                    <p className="text-xs text-gray-500 text-center mt-1">Free packages only</p>
                  </button>
                </div>
              </div>

              {activationType === "PAID" ? (
                <div className="space-y-6">
                  {/* Plan Summary */}
                  <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-gray-600">Plan</span>
                      <span className="font-black text-gray-900 capitalize">{patient.subscriptionType.toLowerCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-600">Annual Fee</span>
                      <span className="text-2xl font-black text-blue-600">₦{subscriptionPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Gateway Selection */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setSelectedGateway("flutterwave")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGateway === "flutterwave" ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <p className={`font-black text-center ${selectedGateway === "flutterwave" ? "text-orange-600" : "text-gray-600"}`}>Flutterwave</p>
                      </button>
                      <button onClick={() => setSelectedGateway("paystack")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGateway === "paystack" ? "border-teal-500 bg-teal-50" : "border-gray-200 hover:border-gray-300"}`}>
                        <p className={`font-black text-center ${selectedGateway === "paystack" ? "text-teal-600" : "text-gray-600"}`}>Paystack</p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <div className="flex items-start gap-3 mb-4">
                      <Gift size={24} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-black text-green-700">Government Free Programme</p>
                        <p className="text-sm text-green-600">For underprivileged citizens who cannot afford subscription fees</p>
                      </div>
                    </div>
                    <div className="text-xs text-green-600 bg-green-100 p-3 rounded-xl">
                      <p className="font-bold mb-1">Note:</p>
                      <p>GFP accounts can only access FREE healthcare packages. Paid packages will not be visible in your marketplace.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600">Enter GFP Activation Code</label>
                    <input type="text" value={gfpCode} onChange={(e) => setGfpCode(e.target.value.toUpperCase())} placeholder="GFP-XXXX-XXX" className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl font-mono font-bold text-center text-lg focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all" />
                    <p className="text-xs text-gray-500 text-center">Contact your local government health office for a code</p>
                  </div>
                </div>
              )}

              <button onClick={handleActivation} disabled={activating} className={`w-full mt-6 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${activationType === "PAID" ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-xl" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-xl"}`}>
                {activating ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Processing...</>
                ) : activationType === "PAID" ? (
                  <><CreditCard size={20} />Pay ₦{subscriptionPrice.toLocaleString()}</>
                ) : (
                  <><Gift size={20} />Activate with GFP Code</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Card Modal */}
      {showCardModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/60 backdrop-blur-sm" onClick={() => setShowCardModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-black text-gray-900">Digital Health Card</h3>
              <button onClick={() => setShowCardModal(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer active:scale-95"><X size={20} /></button>
            </div>
            <div className="p-5">
              <div className="relative mb-6">
                {!isSubscriptionActive && (
                  <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock size={32} className="mx-auto mb-2" />
                      <p className="font-bold">Activate to unlock</p>
                    </div>
                  </div>
                )}
                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-20"></div>
                <div className="relative"><DigitalCard mhNumber={patient.mhNumber} name={patient.name} subscriptionType={patient.subscriptionType} isActive={isSubscriptionActive} isGFP={isGFP} /></div>
              </div>
              {isGFP && (
                <div className="bg-green-50 rounded-2xl p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Gift size={20} className="text-green-600" />
                    <div>
                      <p className="font-bold text-green-700">GFP Account</p>
                      <p className="text-xs text-green-600">Free packages only</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0"><Lightbulb size={16} className="text-blue-600" /></div>
                  <div><p className="text-sm font-bold text-blue-700 mb-1">Quick Tip</p><p className="text-xs text-blue-600">Present this card at any partner facility for instant verification.</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {isQRModalOpen && selectedQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm" onClick={() => setIsQRModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900">Redemption QR</h3>
              <button onClick={() => setIsQRModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"><X size={20} /></button>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 flex items-center justify-center">
              <QRCodeSVG value={selectedQR} size={200} level="H" />
            </div>
            <p className="text-center text-sm text-gray-500 mt-4 font-medium">Show this QR code to the healthcare provider for redemption</p>
          </div>
        </div>
      )}
    </div>
  );
}
