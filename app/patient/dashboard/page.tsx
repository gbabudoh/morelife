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
import VideoConsultation from "@/components/VideoConsultation";

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
  isVideoConsultation?: boolean;
  videoRoomId?: string;
  package: {
    id: string;
    name: string;
    description: string;
    duration: string;
    treatmentType: string;
    provider: { providerName: string; location: string; providerType: string; };
  };
}

const SUBSCRIPTION_PRICES = { SINGLE: 1000, FAMILY: 10000, CORPORATE: 100000 };

const statusLabel = (status: string) => {
  switch (status) {
    case "PENDING":   return "Ready to Use";
    case "REDEEMED":  return "Used";
    case "EXPIRED":   return "Expired";
    case "CANCELLED": return "Cancelled";
    default:          return status;
  }
};

const statusStyle = (status: string) => {
  switch (status) {
    case "PENDING":   return "bg-emerald-500 text-white";
    case "REDEEMED":  return "bg-slate-400 text-white";
    case "EXPIRED":   return "bg-red-400 text-white";
    case "CANCELLED": return "bg-slate-300 text-slate-700";
    default:          return "bg-slate-200 text-slate-600";
  }
};

// Static profile field configs — dynamic class names break Tailwind JIT
const getProfileFields = (patient: PatientData) => [
  { icon: User,     label: "Full Name",    value: patient.name,         rowBg: "bg-blue-50/60",    iconBg: "bg-blue-100",    iconText: "text-blue-600",    labelText: "text-blue-500" },
  { icon: Mail,     label: "Email",        value: patient.email,        rowBg: "bg-emerald-50/60", iconBg: "bg-emerald-100", iconText: "text-emerald-600", labelText: "text-emerald-500" },
  { icon: Calendar, label: "Date of Birth",value: new Date(patient.dateOfBirth).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), rowBg: "bg-indigo-50/60", iconBg: "bg-indigo-100", iconText: "text-indigo-600", labelText: "text-indigo-500" },
  { icon: MapPin,   label: "Location",     value: patient.location,     rowBg: "bg-amber-50/60",   iconBg: "bg-amber-100",   iconText: "text-amber-600",   labelText: "text-amber-500" },
  { icon: Phone,    label: "Mobile",       value: patient.mobileNumber, rowBg: "bg-teal-50/60",    iconBg: "bg-teal-100",    iconText: "text-teal-600",    labelText: "text-teal-500" },
  { icon: Gem,      label: "Plan Type",    value: patient.subscriptionType.toLowerCase().replace("_", " "), rowBg: "bg-slate-50/60", iconBg: "bg-slate-100", iconText: "text-slate-600", labelText: "text-slate-500" },
];

export default function PatientDashboard() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [patient,               setPatient]               = useState<PatientData | null>(null);
  const [purchases,             setPurchases]             = useState<PurchasedPackage[]>([]);
  const [loading,               setLoading]               = useState(true);
  const [fetchError,            setFetchError]            = useState<string | null>(null);
  const [selectedQR,            setSelectedQR]            = useState<string | null>(null);
  const [isQRModalOpen,         setIsQRModalOpen]         = useState(false);
  const [activeTab,             setActiveTab]             = useState<"ACTIVE" | "USED">("ACTIVE");
  const [showMobileMenu,        setShowMobileMenu]        = useState(false);
  const [showCardModal,         setShowCardModal]         = useState(false);
  const [showActivationModal,   setShowActivationModal]   = useState(false);
  const [activationType,        setActivationType]        = useState<"PAID" | "GFP">("PAID");
  const [gfpCode,               setGfpCode]               = useState("");
  const [activating,            setActivating]            = useState(false);
  const [activationError,       setActivationError]       = useState("");
  const [selectedGateway,       setSelectedGateway]       = useState<"flutterwave" | "paystack">("flutterwave");
  const [activeVideoCall,       setActiveVideoCall]       = useState<{ room: string; username: string } | null>(null);
  const [token,                 setToken]                 = useState<string | null>(null);

  const authHeader = (t?: string | null) => ({
    "Content-Type": "application/json",
    ...((t ?? token) ? { Authorization: `Bearer ${t ?? token}` } : {}),
  });

  useEffect(() => {
    const handlePaymentCallback = async (patientId: string, reference: string, t: string) => {
      try {
        const res = await fetch("/api/patient/activate-subscription", {
          method: "POST",
          headers: authHeader(t),
          body: JSON.stringify({ patientId, activationType: "PAID", paymentReference: reference }),
        });
        if (res.ok) {
          const data = await res.json();
          setPatient(prev => prev ? { ...prev, ...data.patient } : null);
          router.replace("/patient/dashboard");
        }
      } catch (error) { console.error("Payment callback error:", error); }
    };

    const fetchPatient = async () => {
      try {
        const patientId = localStorage.getItem("patientId");
        const storedToken = localStorage.getItem("patientToken");
        if (!patientId || !storedToken) { router.push("/patient/login"); return; }
        setToken(storedToken);

        const response = await fetch(`/api/patient/me?id=${patientId}`, {
          headers: authHeader(storedToken),
        });
        const data     = await response.json();

        if (response.ok) {
          setPatient(data);
          const paymentType = searchParams.get("payment");
          const reference   = searchParams.get("reference");
          if (paymentType === "subscription" && reference) {
            handlePaymentCallback(patientId, reference, storedToken);
          }
          const purchasesRes = await fetch(`/api/patient/purchases?patientId=${patientId}`, {
            headers: authHeader(storedToken),
          });
          if (purchasesRes.ok) { setPurchases(await purchasesRes.json()); }
        } else if (response.status === 404 || response.status === 401) {
          localStorage.removeItem("patientId");
          localStorage.removeItem("patientToken");
          router.push("/patient/login");
        } else {
          setFetchError(data.error || "Failed to load patient data");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setFetchError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [router, searchParams]);

  const handleLogout = async () => {
    const t = localStorage.getItem("patientToken");
    if (t) {
      await fetch("/api/patient/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${t}` },
      }).catch(() => {});
    }
    localStorage.removeItem("patientId");
    localStorage.removeItem("patientToken");
    router.push("/patient/login");
  };

  const handleActivation = async () => {
    setActivating(true);
    setActivationError("");
    const patientId = localStorage.getItem("patientId");

    if (activationType === "GFP") {
      if (!gfpCode.trim()) { setActivationError("Please enter a GFP code"); setActivating(false); return; }
      try {
        const res  = await fetch("/api/patient/activate-subscription", {
          method: "POST",
          headers: authHeader(),
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
        const res  = await fetch("/api/patient/subscription-payment", {
          method: "POST",
          headers: authHeader(),
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
  const isGFP                = patient?.subscriptionPlanType === "GFP";
  const subscriptionPrice    = SUBSCRIPTION_PRICES[patient?.subscriptionType as keyof typeof SUBSCRIPTION_PRICES] || 2000;

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ── No patient ────────────────────────────────────────────────────────────
  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <div className="text-center">
          <p className="text-slate-600 font-medium mb-4">{fetchError || "Please log in to access your dashboard"}</p>
          <Link href="/patient/login" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const profileFields = getProfileFields(patient);

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">

      {/* Background blobs */}
      <div className="hidden lg:block fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/25 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-emerald-200/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">

            {/* Mobile: hamburger */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Menu size={20} className="text-slate-700" />
            </button>

            {/* Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Image src="/logo.png" alt="MoreLife" width={120} height={35} className="object-contain h-auto lg:w-35" priority unoptimized />
            </div>

            {/* Mobile spacer */}
            <div className="w-10 lg:hidden" />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-3">
              {isSubscriptionActive && (
                <Link
                  href="/patient/marketplace"
                  className="px-5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-bold rounded-full transition-all flex items-center gap-2 text-sm"
                >
                  <ShoppingCart size={16} /> Marketplace
                </Link>
              )}
              <Link
                href="/"
                className="px-5 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-bold rounded-full transition-all flex items-center gap-2 text-sm"
              >
                <Home size={16} /> Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 font-bold rounded-full transition-all flex items-center gap-2 text-sm cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </div>

          {/* Mobile menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
              <div className="px-4 py-3 space-y-2">
                {isSubscriptionActive && (
                  <Link href="/patient/marketplace" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-blue-50 rounded-xl font-bold text-blue-600 cursor-pointer">
                    <span className="flex items-center gap-3"><ShoppingCart size={18} /> Marketplace</span><ChevronRight size={18} />
                  </Link>
                )}
                <Link href="/" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl font-bold text-slate-700 cursor-pointer">
                  <span className="flex items-center gap-3"><Home size={18} /> Home</span><ChevronRight size={18} />
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-3 bg-red-50 rounded-xl font-bold text-red-600 cursor-pointer">
                  <span className="flex items-center gap-3"><LogOut size={18} /> Logout</span><ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </header>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-24 lg:pt-32 pb-6 lg:py-10">

          {/* Welcome */}
          <div className="mb-8 lg:mb-12">
            <h1 className="text-2xl lg:text-5xl font-black text-slate-900 mb-1">
              Welcome back,{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-emerald-500">
                {patient.name.split(" ")[0]}!
              </span>
            </h1>
            <p className="text-sm lg:text-lg text-slate-500 font-medium">Your personalized health dashboard</p>
          </div>

          {/* Activation banner */}
          {!isSubscriptionActive && (
            <div className="mb-8 p-6 bg-linear-to-r from-amber-500 to-orange-500 rounded-4xl shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white mb-1">Activate Your Subscription</h3>
                    <p className="text-amber-100 font-medium text-sm">Your account is not yet active. Activate now to access the healthcare marketplace.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowActivationModal(true)}
                  className="px-8 py-4 bg-white text-amber-600 rounded-xl font-black hover:bg-amber-50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Zap size={20} /> Activate Now
                </button>
              </div>
            </div>
          )}

          {/* ── Stats cards ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 mb-8 lg:mb-12">

            {/* MH Number — clickable to open digital card */}
            <button
              onClick={() => setShowCardModal(true)}
              className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl lg:rounded-4xl p-5 lg:p-8 shadow-lg hover:-translate-y-1 transition-all text-left cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <CreditCard size={20} className="text-white" />
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Health ID</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1 font-mono">{patient.mhNumber}</p>
              <p className="text-blue-100/80 text-xs lg:text-sm font-medium group-hover:text-white/90 transition-colors">Tap to view digital card →</p>
            </button>

            {/* Subscription plan */}
            <div className="bg-linear-to-br from-slate-700 to-slate-900 rounded-2xl lg:rounded-4xl p-5 lg:p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  <Gem size={20} className="text-white" />
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Plan</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1 capitalize">{patient.subscriptionType.toLowerCase()}</p>
              <p className="text-slate-300 text-xs lg:text-sm font-medium">
                {isGFP ? "Government Free Programme" : `₦${subscriptionPrice.toLocaleString()}/year`}
              </p>
            </div>

            {/* Status — clickable to activate if inactive */}
            <div
              onClick={() => !isSubscriptionActive && setShowActivationModal(true)}
              className={`rounded-2xl lg:rounded-4xl p-5 lg:p-8 shadow-lg transition-all ${
                isSubscriptionActive
                  ? "bg-linear-to-br from-emerald-500 to-teal-700"
                  : "bg-linear-to-br from-slate-400 to-slate-600 cursor-pointer hover:-translate-y-1"
              }`}
            >
              <div className="flex items-center justify-between mb-4 lg:mb-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
                  {isSubscriptionActive
                    ? <ShieldCheck size={20} className="text-white" />
                    : <Lock size={20} className="text-white" />
                  }
                </div>
                <span className="bg-white/10 px-2 lg:px-3 py-1 rounded-full text-white/80 text-[10px] lg:text-xs font-bold uppercase">Status</span>
              </div>
              <p className="text-2xl lg:text-4xl font-black text-white mb-1">{isSubscriptionActive ? "Active" : "Inactive"}</p>
              <p className="text-white/70 text-xs lg:text-sm font-medium">
                {isSubscriptionActive
                  ? isGFP
                    ? "GFP Activated"
                    : patient.subscriptionExpiresAt
                      ? `Expires ${new Date(patient.subscriptionExpiresAt).toLocaleDateString()}`
                      : "Verified"
                  : "Tap to activate →"
                }
              </p>
            </div>
          </div>

          {/* ── Two-column layout ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">

            {/* Account Profile */}
            <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] p-5 lg:p-10 border border-white/40 shadow-lg">
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-md">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-lg lg:text-2xl font-black text-slate-900">Account Profile</h2>
                  <p className="text-[11px] lg:text-sm text-slate-500 font-medium">Your personal details</p>
                </div>
              </div>

              <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                {profileFields.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 lg:p-4 ${item.rowBg} rounded-xl lg:rounded-2xl`}>
                    <div className={`w-9 h-9 lg:w-10 lg:h-10 ${item.iconBg} rounded-lg lg:rounded-xl flex items-center justify-center shrink-0`}>
                      <item.icon size={16} className={item.iconText} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-[10px] lg:text-xs font-bold ${item.labelText} uppercase tracking-wide`}>{item.label}</p>
                      <p className="text-sm lg:text-base font-bold text-slate-900 truncate capitalize">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Card column */}
            <div className="lg:col-span-1">
              {/* Mobile: compact tap target */}
              <button
                onClick={() => setShowCardModal(true)}
                className="w-full lg:hidden bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-lg active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${isSubscriptionActive ? "bg-linear-to-br from-emerald-500 to-teal-600" : "bg-linear-to-br from-slate-400 to-slate-500"}`}>
                      <Hospital size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-base font-black text-slate-900">Digital Health Card</h3>
                      <p className="text-xs text-slate-500 font-medium">{isSubscriptionActive ? "Tap to view" : "Inactive"}</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-400" />
                </div>
              </button>

              {/* Desktop: full card */}
              <div className="hidden lg:block bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-lg sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${isSubscriptionActive ? "bg-linear-to-tr from-emerald-500 to-teal-600" : "bg-linear-to-tr from-slate-400 to-slate-500"}`}>
                    <Hospital size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Digital Health Card</h2>
                    <p className="text-slate-500 text-sm font-medium">{isSubscriptionActive ? "Scan for verification" : "Activate to enable"}</p>
                  </div>
                </div>
                <div className="relative group">
                  {!isSubscriptionActive && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-4xl z-10 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Lock size={28} className="mx-auto mb-2" />
                        <p className="font-bold text-sm">Activate to unlock</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-emerald-500 rounded-4xl blur opacity-20 group-hover:opacity-35 transition" />
                  <div className="relative">
                    <DigitalCard mhNumber={patient.mhNumber} name={patient.name} subscriptionType={patient.subscriptionType} isActive={isSubscriptionActive} isGFP={isGFP} />
                  </div>
                </div>
                {isGFP && (
                  <div className="mt-5 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <Gift size={18} className="text-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-700 text-sm">Government Free Programme</p>
                        <p className="text-xs text-emerald-600">Access to free healthcare packages only</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── My Benefits ───────────────────────────────────────────── */}
          {isSubscriptionActive ? (
            <div className="mb-12">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8 mb-6 lg:mb-8">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-linear-to-br from-blue-600 to-indigo-700 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <ClipboardList size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-black text-slate-900">My Benefits</h2>
                    <p className="text-sm text-slate-500 font-medium">Manage your packages</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-white/60 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 shadow-sm w-full sm:w-auto">
                    <button
                      onClick={() => setActiveTab("ACTIVE")}
                      className={`flex-1 sm:flex-none px-4 lg:px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${activeTab === "ACTIVE" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-white/50"}`}
                    >
                      <Activity size={16} />
                      Active
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-black ${activeTab === "ACTIVE" ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>
                        {purchases.filter(p => p.redemptionStatus === "PENDING").length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab("USED")}
                      className={`flex-1 sm:flex-none px-4 lg:px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${activeTab === "USED" ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-white/50"}`}
                    >
                      <CheckCircle2 size={16} />
                      Used
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-black ${activeTab === "USED" ? "bg-white/20" : "bg-slate-100 text-slate-600"}`}>
                        {purchases.filter(p => p.redemptionStatus === "REDEEMED").length}
                      </span>
                    </button>
                  </div>
                  <Link
                    href="/patient/marketplace"
                    className="hidden sm:flex px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all items-center gap-2 cursor-pointer text-sm shadow-md"
                  >
                    <ShoppingCart size={18} /> Explore More
                  </Link>
                </div>
              </div>

              {purchases.filter(p => activeTab === "ACTIVE" ? p.redemptionStatus === "PENDING" : p.redemptionStatus === "REDEEMED").length === 0 ? (
                <div className="bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 lg:p-20 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                    {activeTab === "ACTIVE" ? <ShoppingCart size={28} className="text-slate-300" /> : <ClipboardList size={28} className="text-slate-300" />}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    {activeTab === "ACTIVE" ? "No active packages" : "No used packages yet"}
                  </h3>
                  <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium text-sm">
                    {activeTab === "ACTIVE" ? "Start your health journey by exploring our packages" : "Your wellness history will appear here"}
                  </p>
                  {activeTab === "ACTIVE" && (
                    <Link href="/patient/marketplace" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg cursor-pointer">
                      <ShoppingCart size={18} /> Start Exploring
                    </Link>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {purchases
                    .filter(p => activeTab === "ACTIVE" ? p.redemptionStatus === "PENDING" : p.redemptionStatus === "REDEEMED")
                    .map((purchase) => (
                      <div key={purchase.id} className="bg-white/60 backdrop-blur-xl rounded-2xl lg:rounded-4xl shadow-md overflow-hidden border border-white/40 hover:shadow-xl lg:hover:-translate-y-1 transition-all">
                        <div className={`p-5 lg:p-6 border-b border-white/40 ${purchase.redemptionStatus === "REDEEMED" ? "bg-slate-50/50" : "bg-blue-50/30"}`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${statusStyle(purchase.redemptionStatus)}`}>
                              {statusLabel(purchase.redemptionStatus)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono font-bold bg-white/70 px-2 py-1 rounded-lg">{purchase.serialNumber}</span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 mb-1.5">{purchase.package.name}</h3>
                          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                            <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                              <Hospital size={11} className="text-blue-600" />
                            </div>
                            {purchase.package.provider.providerName}
                          </div>
                        </div>
                        <div className="p-5 lg:p-6">
                          <div className="space-y-2.5 mb-5">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Validity</span>
                              <span className="font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-xl text-xs">{purchase.package.duration}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Category</span>
                              <span className="font-bold text-slate-800 bg-slate-50 px-3 py-1 rounded-xl text-xs">{purchase.package.treatmentType}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {purchase.isVideoConsultation ? (
                              <button
                                onClick={() => setActiveVideoCall({ room: purchase.videoRoomId || purchase.id, username: patient.name })}
                                disabled={purchase.redemptionStatus !== "PENDING"}
                                className="flex-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <Activity size={16} /> Join Video Call
                              </button>
                            ) : (
                              <button
                                onClick={() => { setSelectedQR(purchase.qrCodeData); setIsQRModalOpen(true); }}
                                disabled={purchase.redemptionStatus !== "PENDING"}
                                className="flex-3 px-4 py-3 bg-blue-600 text-white rounded-xl font-black text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:bg-slate-200 disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
                              >
                                <QrCode size={16} />
                                {purchase.package.provider.providerType === "MEDICAL_CHARITY" ? "View Access Code" : "Redeem"}
                              </button>
                            )}
                            <button
                              onClick={() => router.push(`/patient/marketplace?repurchase=${purchase.package.id}`)}
                              className="flex-1 px-3 py-3 bg-white text-blue-600 rounded-xl font-black text-xs hover:bg-blue-600 hover:text-white transition-all border-2 border-blue-100 hover:border-blue-600 flex items-center justify-center cursor-pointer"
                              title="Repurchase"
                            >
                              <RefreshCcw size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-12 bg-white/40 backdrop-blur-xl rounded-2xl lg:rounded-[2.5rem] border-2 border-dashed border-slate-200 p-12 lg:p-20 text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Lock size={28} className="text-amber-600" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Marketplace Locked</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium text-sm">Activate your subscription to access healthcare packages</p>
              <button
                onClick={() => setShowActivationModal(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-black hover:shadow-xl transition-all cursor-pointer"
              >
                <Zap size={18} /> Activate Subscription
              </button>
            </div>
          )}
        </div>

        {/* Mobile FAB */}
        {isSubscriptionActive && (
          <Link
            href="/patient/marketplace"
            className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer z-40 hover:bg-blue-700 transition-all"
          >
            <ShoppingCart size={22} />
          </Link>
        )}
      </div>

      {/* ── Activation Modal ─────────────────────────────────────────────── */}
      {showActivationModal && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowActivationModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 p-4 flex items-center justify-between z-10">
              <h3 className="text-xl font-black text-slate-900">Activate Subscription</h3>
              <button onClick={() => setShowActivationModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {activationError && (
                <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-3">
                  <AlertCircle size={18} />
                  <p className="text-sm font-bold">{activationError}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Choose Activation Method</p>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setActivationType("PAID")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activationType === "PAID" ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <CreditCard size={22} className={`mx-auto mb-2 ${activationType === "PAID" ? "text-blue-600" : "text-slate-400"}`} />
                    <p className={`font-black text-center text-sm ${activationType === "PAID" ? "text-blue-600" : "text-slate-600"}`}>Pay Now</p>
                    <p className="text-xs text-slate-500 text-center mt-0.5">Full access</p>
                  </button>
                  <button onClick={() => setActivationType("GFP")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activationType === "GFP" ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-slate-300"}`}>
                    <Gift size={22} className={`mx-auto mb-2 ${activationType === "GFP" ? "text-emerald-600" : "text-slate-400"}`} />
                    <p className={`font-black text-center text-sm ${activationType === "GFP" ? "text-emerald-600" : "text-slate-600"}`}>GFP Code</p>
                    <p className="text-xs text-slate-500 text-center mt-0.5">Free packages only</p>
                  </button>
                </div>
              </div>

              {activationType === "PAID" ? (
                <div className="space-y-5">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-slate-600 text-sm">Plan</span>
                      <span className="font-black text-slate-900 capitalize">{patient.subscriptionType.toLowerCase()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600 text-sm">Annual Fee</span>
                      <span className="text-2xl font-black text-blue-600">₦{subscriptionPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Payment Method</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setSelectedGateway("flutterwave")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGateway === "flutterwave" ? "border-orange-500 bg-orange-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <p className={`font-black text-center text-sm ${selectedGateway === "flutterwave" ? "text-orange-600" : "text-slate-600"}`}>Flutterwave</p>
                      </button>
                      <button onClick={() => setSelectedGateway("paystack")} className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedGateway === "paystack" ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                        <p className={`font-black text-center text-sm ${selectedGateway === "paystack" ? "text-teal-600" : "text-slate-600"}`}>Paystack</p>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-start gap-3 mb-3">
                      <Gift size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-emerald-700 text-sm">Government Free Programme</p>
                        <p className="text-xs text-emerald-600 mt-0.5">For citizens who cannot afford subscription fees</p>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700 bg-emerald-100 p-3 rounded-xl">
                      GFP accounts can only access FREE healthcare packages. Paid packages will not be visible in your marketplace.
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-600">Enter GFP Activation Code</label>
                    <input
                      type="text"
                      value={gfpCode}
                      onChange={(e) => setGfpCode(e.target.value.toUpperCase())}
                      placeholder="GFP-XXXX-XXX"
                      className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl font-mono font-bold text-center text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                    <p className="text-xs text-slate-400 text-center">Contact your local government health office for a code</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleActivation}
                disabled={activating}
                className={`w-full mt-6 py-4 rounded-2xl font-black text-white transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${activationType === "PAID" ? "bg-blue-600 hover:bg-blue-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                {activating ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : activationType === "PAID" ? (
                  <><CreditCard size={18} /> Pay ₦{subscriptionPrice.toLocaleString()}</>
                ) : (
                  <><Gift size={18} /> Activate with GFP Code</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Digital Card Modal ───────────────────────────────────────────── */}
      {showCardModal && (
        <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCardModal(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-slate-100 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-black text-slate-900">Digital Health Card</h3>
              <button onClick={() => setShowCardModal(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <div className="relative mb-5">
                {!isSubscriptionActive && (
                  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock size={28} className="mx-auto mb-2" />
                      <p className="font-bold text-sm">Activate to unlock</p>
                    </div>
                  </div>
                )}
                <div className="absolute -inset-2 bg-linear-to-tr from-blue-600 to-emerald-500 rounded-3xl blur-xl opacity-15" />
                <div className="relative">
                  <DigitalCard mhNumber={patient.mhNumber} name={patient.name} subscriptionType={patient.subscriptionType} isActive={isSubscriptionActive} isGFP={isGFP} />
                </div>
              </div>
              {isGFP && (
                <div className="bg-emerald-50 rounded-2xl p-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Gift size={18} className="text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-700 text-sm">GFP Account</p>
                      <p className="text-xs text-emerald-600">Free packages only</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Lightbulb size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-blue-700 mb-0.5">Quick Tip</p>
                    <p className="text-xs text-blue-600">Present this card at any partner facility for instant verification.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── QR Code Modal ────────────────────────────────────────────────── */}
      {isQRModalOpen && selectedQR && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsQRModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">Redemption QR</h3>
              <button onClick={() => setIsQRModalOpen(false)} className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 flex items-center justify-center">
              <QRCodeSVG value={selectedQR} size={200} level="H" />
            </div>
            <p className="text-center text-sm text-slate-500 mt-4 font-medium">Show this QR code to the healthcare provider for redemption</p>
          </div>
        </div>
      )}

      {/* ── Video Consultation ───────────────────────────────────────────── */}
      {activeVideoCall && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-slate-950 p-4 lg:p-8 animate-in fade-in duration-500">
          <div className="w-full max-w-6xl h-full max-h-200 relative">
            <VideoConsultation
              room={activeVideoCall.room}
              username={activeVideoCall.username}
              onLeave={() => setActiveVideoCall(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
