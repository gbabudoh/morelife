"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  QrCode, 
  Hash, 
  Search, 
  ArrowLeft, 
  Camera, 
  Clock, 
  CheckCircle2,
  X,
  Activity,
  User,
  Package,
  ShieldCheck,
} from "lucide-react";
import { getCurrencyByLocation } from "@/lib/african-currencies";

interface PackagePurchase {
  id: string;
  serialNumber: string;
  patientName: string;
  patientMH: string;
  packageName: string;
  price: number;
  purchaseDate: string;
  redemptionStatus: "PENDING" | "REDEEMED" | "EXPIRED" | "CANCELLED";
  redeemedAt?: string;
  redeemedBy?: string;
}

export default function RedemptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"qr" | "mh" | "manual">("qr");
  const [mhNumber, setMhNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState<PackagePurchase | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState({ symbol: "₦", code: "NGN" });

  // Mock data - will be replaced with API calls
  const [purchases, setPurchases] = useState<PackagePurchase[]>([
    {
      id: "1",
      serialNumber: "PKG-2025-000123",
      patientName: "John Doe",
      patientMH: "MH-2025-000456",
      packageName: "General Health Check-up Package",
      price: 15000,
      purchaseDate: "2025-12-29",
      redemptionStatus: "PENDING",
    },
    {
      id: "2",
      serialNumber: "PKG-2025-000124",
      patientName: "Jane Smith",
      patientMH: "MH-2025-000457",
      packageName: "Maternity Care Package",
      price: 150000,
      purchaseDate: "2025-12-28",
      redemptionStatus: "PENDING",
    },
  ]);

  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        const providerId = localStorage.getItem('providerId');
        if (!providerId) {
          router.push('/provider/login');
          return;
        }

        const response = await fetch(`/api/provider/profile?providerId=${providerId}`);
        const data = await response.json();

        if (response.ok) {
          setCurrency(getCurrencyByLocation(data.provider.location));
        }
      } catch (error) {
        console.error("Error fetching provider data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProviderData();
  }, [router]);

  const handleQRScan = (data: string) => {
    console.log("QR Scanned:", data);
    // Logic to select purchase based on scanned data would go here
  };

  const handleMHLookup = () => {
    console.log("Looking up MH:", mhNumber);
  };

  const handleSearch = () => {
    console.log("Searching:", searchQuery);
  };

  const handleConfirmRedemption = () => {
    if (!selectedPurchase || !staffName) return;
    
    // Update state locally for demonstration
    setPurchases(prev => prev.map(p => 
      p.id === selectedPurchase.id 
        ? { ...p, redemptionStatus: "REDEEMED", redeemedAt: new Date().toISOString(), redeemedBy: staffName } 
        : p
    ));
    
    setShowConfirmModal(false);
    setSelectedPurchase(null);
    setStaffName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">Initializing Redemption Vault...</p>
        </div>
      </div>
    );
  }

  const pendingPurchases = purchases.filter(p => p.redemptionStatus === "PENDING");

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Premium Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-200/30 rounded-full blur-[100px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-teal-100/40 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Modern Header with Enhanced Glassmorphism */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/40 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/provider/dashboard" className="flex items-center group">
                <Image
                  src="/logo.png"
                  alt="MoreLife Healthcare"
                  width={160}
                  height={64}
                  className="object-contain transition-all duration-500 group-hover:scale-105 group-hover:drop-shadow-lg"
                />
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/provider/dashboard"
                  className="px-6 py-2.5 bg-gray-900 text-white hover:bg-black font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 shadow-xl shadow-gray-900/10 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={18} />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">
              Service <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Verification</span>
            </h1>
            <p className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
              Confirm patient eligibility and redeem healthcare packages through secure multi-channel verification.
            </p>
          </div>

          {/* Verification Methods - Premium Tabs */}
          <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-2 border border-white/40 mb-12 flex flex-wrap gap-2 w-fit">
            {[
              { id: "qr", label: "QR Intelligence", icon: QrCode, color: "from-blue-500 to-indigo-600" },
              { id: "mh", label: "Patient Identity", icon: Hash, color: "from-purple-500 to-pink-600" },
              { id: "manual", label: "Manual Lookup", icon: Search, color: "from-teal-500 to-emerald-600" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "qr" | "mh" | "manual")}
                className={`px-8 py-4 rounded-3xl font-black transition-all duration-500 flex items-center gap-3 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-xl shadow-indigo-500/20`
                    : "text-gray-500 hover:bg-white/60 hover:text-gray-900"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Action Area */}
            <div className="lg:col-span-2 space-y-12">
              <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                {activeTab === "qr" && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                        <Camera size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Optical Scan</h2>
                        <p className="text-gray-500 font-medium">Point camera at patient&apos;s digital HealthCard</p>
                      </div>
                    </div>
                    
                    <div className="aspect-video bg-gray-950 rounded-[3rem] overflow-hidden relative group border-4 border-white shadow-2xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 border-2 border-blue-500/50 rounded-[2rem] animate-pulse flex items-center justify-center">
                          <div className="w-48 h-1 bg-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] animate-bounce"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                      <div className="absolute bottom-8 left-8 right-8 text-center">
                        <p className="text-white/80 font-bold text-sm uppercase tracking-widest">Waiting for hardware interface...</p>
                      </div>
                    </div>
                    
                    <div className="mt-10">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Manual Data Override</label>
                      <div className="mt-2 flex gap-4">
                        <input
                          type="text"
                          placeholder="Paste secure QR payload..."
                          className="flex-1 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold"
                          onKeyPress={(e) => e.key === "Enter" && handleQRScan(e.currentTarget.value)}
                        />
                        <button 
                          onClick={() => handleQRScan("MANUAL_TRIGGER")}
                          className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "mh" && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600">
                        <Hash size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">System Identity</h2>
                        <p className="text-gray-500 font-medium">Lookup subscriptions via MoreLife Number</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Patient Number (MH-XXXX)</label>
                      <input
                        type="text"
                        value={mhNumber}
                        onChange={(e) => setMhNumber(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleMHLookup()}
                        placeholder="MH-2025-000000"
                        className="w-full px-8 py-6 bg-white border-2 border-gray-100 rounded-[2rem] focus:ring-8 focus:ring-purple-500/5 focus:border-purple-500 transition-all outline-none text-2xl font-black placeholder:text-gray-200"
                      />
                      <button 
                        onClick={handleMHLookup}
                        className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all"
                      >
                        Execute Lookup
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "manual" && (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-600">
                        <User size={24} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Record Search</h2>
                        <p className="text-gray-500 font-medium">Find patient by name, phonetics, or metrics</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Search directories..."
                        className="flex-1 px-8 py-5 bg-white border border-gray-200 rounded-[2rem] focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 transition-all outline-none font-bold"
                      />
                      <button 
                        onClick={handleSearch}
                        className="px-10 py-5 bg-teal-600 text-white rounded-[2rem] font-black hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
                      >
                        Deep Search
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Pending Queue */}
              <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Processing Queue</h2>
                      <p className="text-gray-500 font-medium">{pendingPurchases.length} items awaiting confirmation</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6">
                  {pendingPurchases.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-400">
                        <ShieldCheck size={32} />
                      </div>
                      <p className="text-xl font-bold text-gray-400">Queue is Clear</p>
                    </div>
                  ) : (
                    pendingPurchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="group bg-white/60 p-8 rounded-[2.5rem] border border-white hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <h3 className="text-2xl font-black text-gray-900">{purchase.patientName}</h3>
                              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">
                                {purchase.patientMH}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 font-bold">
                              <Package size={18} className="text-gray-400" />
                              {purchase.packageName}
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <div className="px-4 py-2 bg-gray-100/50 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                                ID: {purchase.serialNumber}
                              </div>
                              <div className="px-4 py-2 bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-tighter">
                                Valor: {currency.symbol}{purchase.price.toLocaleString()}
                              </div>
                              <div className="px-4 py-2 bg-purple-50 rounded-xl text-[10px] font-black text-purple-600 uppercase tracking-tighter">
                                {purchase.purchaseDate}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPurchase(purchase);
                              setShowConfirmModal(true);
                            }}
                            className="px-8 py-5 bg-gray-900 text-white rounded-2xl font-black shadow-xl shadow-gray-900/10 hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                          >
                            <CheckCircle2 size={20} />
                            Verify Treatment
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                <div className="absolute top--10 right--10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                <Activity size={40} className="mb-6 opacity-80" />
                <h3 className="text-sm font-black uppercase tracking-widest mb-2 opacity-60">Session Velocity</h3>
                <p className="text-5xl font-black tracking-tighter mb-4">{purchases.filter(p => p.redemptionStatus === "REDEEMED").length}</p>
                <p className="text-blue-100/80 font-medium">Packages confirmed successfully in this deployment session.</p>
              </div>

              <div className="bg-white/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.05)] p-10 border border-white/40">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 leading-none">Intelligence Feed</h4>
                <div className="space-y-6">
                  {purchases.filter(p => p.redemptionStatus === "REDEEMED").slice(0, 3).map((p, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2"></div>
                      <div>
                        <p className="text-sm font-black text-gray-900">{p.packageName}</p>
                        <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{p.redeemedBy} • Just now</p>
                      </div>
                    </div>
                  ))}
                  {purchases.filter(p => p.redemptionStatus === "REDEEMED").length === 0 && (
                    <p className="text-sm font-bold text-gray-400 italic">No recent activity detected.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Premium Glass */}
      {showConfirmModal && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-300"></div>
          <div className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(0,0,0,0.15)] max-w-md w-full border border-white relative z-10 animate-in zoom-in-95 duration-500">
            <div className="p-10 text-center relative">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedPurchase(null);
                  setStaffName("");
                }}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
              <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-600">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Deployment</h2>
              <p className="text-gray-500 font-medium mb-10">Attest that the following protocol has been completed for the patient.</p>
              
              <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-8 mb-10 text-left">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2">Subject • Package</p>
                <p className="text-xl font-black text-gray-900 mb-1">{selectedPurchase.patientName}</p>
                <p className="text-gray-600 font-medium">{selectedPurchase.packageName}</p>
              </div>

              <div className="mb-10 text-left">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Attesting Officer Name</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="Enter credential name..."
                  className="w-full mt-2 px-6 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all outline-none font-bold placeholder:text-gray-300"
                />
              </div>

              <div className="grid gap-4">
                <button
                  onClick={handleConfirmRedemption}
                  disabled={!staffName}
                  className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all disabled:grayscale disabled:opacity-50"
                >
                  Confirm & Finalize
                </button>
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setSelectedPurchase(null);
                    setStaffName("");
                  }}
                  className="w-full py-5 bg-gray-100 text-gray-700 rounded-2xl font-black hover:bg-gray-200 transition-all"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
