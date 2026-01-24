"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { africanCountries } from "@/lib/african-locations";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { PaymentGateway } from "@/lib/payment-config";
import {
  Search,
  Filter,
  MapPin,
  Stethoscope,
  Clock,
  Hospital,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  ChevronRight,
  ChevronLeft,
  Zap,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard as PaymentIcon
} from "lucide-react";

interface HealthcarePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  treatmentType: string;
  isFree: boolean;
  providerName: string;
  providerType: string;
  location: string;
}

export default function Marketplace() {
  const router = useRouter();
  const [packages, setPackages] = useState<HealthcarePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    treatmentType: "",
    isFree: "",
    search: "",
    location: "",
    providerType: "",
    subscriptionType: "",
  });

  // Patient subscription state
  const [isGFPUser, setIsGFPUser] = useState(false);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(false);

  // Purchase flow state
  const [selectedPackage, setSelectedPackage] = useState<HealthcarePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "success" | "error">("idle");
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway | null>(null);

  // Cascading location filters
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // Get selected country object
  const countryObj = africanCountries.find(c => c.name === selectedCountry);

  // Get selected state/subdivision object
  const stateObj = countryObj?.subdivisions.find(s => s.name === selectedState);

  // Handle country change
  const handleCountryChange = (countryName: string) => {
    setSelectedCountry(countryName);
    setSelectedState("");
    setSelectedCity("");
    // Update filter with just country if no state selected
    setFilter({ ...filter, location: countryName });
  };

  // Handle state change
  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    setSelectedCity("");
    // Update filter with country and state
    setFilter({ ...filter, location: `${stateName}, ${selectedCountry}` });
  };

  // Handle city change
  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    // Update filter with full location
    setFilter({ ...filter, location: `${cityName}, ${selectedState}, ${selectedCountry}` });
  };

  // Fetch patient data to check subscription status
  useEffect(() => {
    const checkPatientSubscription = async () => {
      try {
        const patientId = localStorage.getItem("patientId");
        if (!patientId) {
          router.push("/patient/login");
          return;
        }
        
        const response = await fetch(`/api/patient/me?id=${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setIsGFPUser(data.subscriptionPlanType === "GFP");
          setIsSubscriptionActive(data.subscriptionStatus === "ACTIVE");
          
          // Redirect to dashboard if subscription is not active
          if (data.subscriptionStatus !== "ACTIVE") {
            router.push("/patient/dashboard");
          }
        } else if (response.status === 404 || response.status === 401) {
          localStorage.removeItem("patientId");
          router.push("/patient/login");
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };
    
    checkPatientSubscription();
  }, [router]);

  useEffect(() => {
    // Mock data for demonstration
    const mockPackages: HealthcarePackage[] = [
      {
        id: "1",
        name: "Maternity Care Package",
        description: "Complete antenatal care, delivery, and post-natal care for expecting mothers",
        price: 150000,
        duration: "9 months",
        treatmentType: "Maternity",
        isFree: false,
        providerName: "City General Hospital",
        providerType: "General Hospital",
        location: "Lagos, Nigeria",
      },
      {
        id: "2",
        name: "Malaria Treatment Package",
        description: "Complete malaria treatment including consultation, tests, and medication",
        price: 5000,
        duration: "2 weeks",
        treatmentType: "Malaria",
        isFree: false,
        providerName: "Community Health Centre",
        providerType: "Health Centre",
        location: "Abuja, Nigeria",
      },
      {
        id: "3",
        name: "Dental Check-up Package",
        description: "Comprehensive dental examination, cleaning, and X-rays",
        price: 15000,
        duration: "1 day",
        treatmentType: "Dental",
        isFree: false,
        providerName: "Bright Smile Dental Clinic",
        providerType: "Dental",
        location: "Lagos, Nigeria",
      },
      {
        id: "4",
        name: "Eye Treatment Package",
        description: "Complete eye examination, vision test, and consultation",
        price: 20000,
        duration: "1 day",
        treatmentType: "Eye Treatment",
        isFree: false,
        providerName: "Vision Care Optician",
        providerType: "Optician",
        location: "Port Harcourt, Nigeria",
      },
      {
        id: "5",
        name: "General Health Check-up Package",
        description: "Complete health screening including blood tests, vitals, and consultation",
        price: 15000,
        duration: "1 day",
        treatmentType: "General Check-up",
        isFree: false,
        providerName: "City General Hospital",
        providerType: "General Hospital",
        location: "Lagos, Nigeria",
      },
      {
        id: "6",
        name: "Free Vaccination Drive",
        description: "Free vaccination program for children and adults",
        price: 0,
        duration: "1 day",
        treatmentType: "Vaccination",
        isFree: true,
        providerName: "Public Health Initiative",
        providerType: "Medical Charity",
        location: "Multiple Locations",
      },
    ];

    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      setPackages(mockPackages);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    // GFP users can only see free packages
    if (isGFPUser && !pkg.isFree) {
      return false;
    }
    
    const matchesType = !filter.treatmentType || pkg.treatmentType === filter.treatmentType;
    const matchesFree =
      filter.isFree === "" ||
      (filter.isFree === "true" && pkg.isFree) ||
      (filter.isFree === "false" && !pkg.isFree);
    const matchesSearch =
      !filter.search ||
      pkg.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      pkg.providerName.toLowerCase().includes(filter.search.toLowerCase());
    const matchesLocation = !filter.location || pkg.location.includes(filter.location);
    const matchesProviderType = !filter.providerType || pkg.providerType === filter.providerType;

    return matchesType && matchesFree && matchesSearch && matchesLocation && matchesProviderType;
  });

  const treatmentTypes = Array.from(new Set(packages.map((p) => p.treatmentType)));
  const providerTypes = Array.from(new Set(packages.map((p) => p.providerType)));

  const handlePurchase = async () => {
    if (!selectedPackage) return;

    // For paid packages, require payment gateway selection
    if (!selectedPackage.isFree && !selectedGateway) {
      alert("Please select a payment method");
      return;
    }

    setIsPurchasing(true);
    setPurchaseStatus("idle");

    try {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        router.push("/patient/login");
        return;
      }

      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          packageId: selectedPackage.id,
          gateway: selectedGateway,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.isFree) {
          // Free package - show success immediately
          setPurchaseStatus("success");
        } else if (data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = data.paymentUrl;
        }
      } else {
        setPurchaseStatus("error");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      setPurchaseStatus("error");
    } finally {
      setIsPurchasing(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          {/* Mobile: Back button + Logo centered */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={() => router.push("/patient/dashboard")}
              className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl active:scale-95 transition-all"
            >
              <ChevronLeft size={20} className="text-gray-700" />
            </button>
          </div>
          
          <Link href="/" className="flex items-center absolute left-1/2 transform -translate-x-1/2 sm:static sm:transform-none">
            <Image
              src="/logo.png"
              alt="MoreLife Healthcare"
              width={100}
              height={40}
              className="object-contain sm:w-[150px]"
            />
          </Link>
          
          {/* Mobile: Spacer for centering */}
          <div className="w-10 sm:hidden"></div>
          
          <nav className="hidden sm:flex gap-2 sm:gap-4">
            <Link
              href="/patient/dashboard"
              className="p-2 sm:px-4 sm:py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1 sm:gap-2 text-sm"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("patientId");
                router.push("/patient/login");
              }}
              className="p-2 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-1 sm:gap-2 text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
            <ShoppingCart size={20} className="sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Healthcare Marketplace
          </h1>
        </div>

        {/* Filters - Mobile Optimized */}
        <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8 mb-4 sm:mb-8 border border-white/20">
          <div className="flex items-center gap-2 mb-4 sm:mb-6 text-gray-900">
            <Filter size={18} />
            <h2 className="text-base sm:text-xl font-bold">Filter Packages</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  placeholder="Search packages..."
                  className="w-full pl-9 pr-3 py-2 sm:py-2.5 text-sm border-2 border-gray-100 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Treatment Type / Category */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Treatment Category
              </label>
              <select
                value={filter.treatmentType}
                onChange={(e) => setFilter({ ...filter, treatmentType: e.target.value })}
                className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Categories</option>
                {treatmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Countries</option>
                {africanCountries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* State/Province Selection - Only show if country is selected */}
            {selectedCountry && countryObj && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {countryObj.name === "Nigeria" ? "State" : "Province/Region"}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">All {countryObj.name === "Nigeria" ? "States" : "Provinces"}</option>
                  {countryObj.subdivisions.map((subdivision) => (
                    <option key={subdivision.code} value={subdivision.name}>
                      {subdivision.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* City Selection - Only show if state is selected and has cities */}
            {selectedState && stateObj && stateObj.cities && stateObj.cities.length > 0 && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">All Cities</option>
                  {stateObj.cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Provider Type */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Provider Type
              </label>
              <select
                value={filter.providerType}
                onChange={(e) => setFilter({ ...filter, providerType: e.target.value })}
                className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Provider Types</option>
                {providerTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Subscription Options */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Subscription Type
              </label>
              <select
                value={filter.subscriptionType}
                onChange={(e) => setFilter({ ...filter, subscriptionType: e.target.value })}
                className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">All Subscriptions</option>
                <option value="single">Single</option>
                <option value="family">Family</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>

            {/* Package Type (Free/Paid) - Hide for GFP users */}
            {!isGFPUser && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Package Type
                </label>
                <select
                  value={filter.isFree}
                  onChange={(e) => setFilter({ ...filter, isFree: e.target.value })}
                  className="w-full px-3 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="">All Packages</option>
                  <option value="false">Paid Packages</option>
                  <option value="true">Free Packages</option>
                </select>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => {
                setFilter({
                  treatmentType: "",
                  isFree: "",
                  search: "",
                  location: "",
                  providerType: "",
                  subscriptionType: "",
                });
                setSelectedCountry("");
                setSelectedState("");
                setSelectedCity("");
              }}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-100 text-gray-600 rounded-lg sm:rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all font-semibold flex items-center justify-center sm:justify-start gap-2 cursor-pointer"
            >
              <Zap size={14} />
              Clear All Filters
            </button>
          </div>
        </div>

        {/* GFP User Notice Banner */}
        {isGFPUser && (
          <div className="mb-4 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 size={20} className="text-white sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Government Free Programme (GFP)</h3>
                <p className="text-green-100 text-xs sm:text-sm">You have access to all free healthcare packages. Browse and redeem available services below.</p>
              </div>
            </div>
          </div>
        )}

        {/* Packages Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPackages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No packages found matching your criteria.</p>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Card Header with Badge */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-2 flex-1">
                      {pkg.name}
                    </h3>
                    {pkg.isFree && (
                      <span className="px-2 py-0.5 bg-green-400 text-green-900 rounded-full text-[10px] font-bold uppercase tracking-wide flex-shrink-0">
                        FREE
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
                    {pkg.description}
                  </p>

                  {/* Info Grid - 2x2 compact layout */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Hospital size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-semibold text-gray-400 leading-none">Provider</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{pkg.providerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <Stethoscope size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-semibold text-gray-400 leading-none">Type</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{pkg.treatmentType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <Clock size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-semibold text-gray-400 leading-none">Duration</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{pkg.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                        <MapPin size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-semibold text-gray-400 leading-none">Location</p>
                        <p className="text-xs font-semibold text-gray-800 truncate">{pkg.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-[9px] uppercase font-semibold text-gray-400">Cost</p>
                      {pkg.isFree ? (
                        <p className="text-lg sm:text-xl font-bold text-green-600">FREE</p>
                      ) : (
                        <p className="text-lg sm:text-xl font-bold text-blue-600">
                          ₦{pkg.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedPackage(pkg);
                        setIsModalOpen(true);
                        setPurchaseStatus("idle");
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center gap-1.5"
                    >
                      View Details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Package Details Modal - Mobile Optimized */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up sm:animate-scale-in border border-white/20">
            {/* Modal Header */}
            <div className="relative h-36 sm:h-48 bg-gradient-to-br from-blue-600 to-indigo-700 p-4 sm:p-8 flex flex-col justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="space-y-1.5 sm:space-y-2">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/20 rounded-full text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md">
                  {selectedPackage.treatmentType}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-white leading-tight">{selectedPackage.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-8">
              {purchaseStatus === "success" ? (
                <div className="py-6 sm:py-8 text-center space-y-3 sm:space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 size={40} className="sm:w-12 sm:h-12" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Purchase Successful!</h3>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">
                      Your package has been activated. You can now view it in your dashboard and present your QR code for redemption.
                    </p>
                  </div>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button 
                      onClick={() => router.push("/patient/dashboard")}
                      className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md text-sm sm:text-base"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm sm:text-base"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8">
                    {selectedPackage.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <Hospital size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Provider</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{selectedPackage.providerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <Clock size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Validity</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{selectedPackage.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-50 flex items-center justify-center text-red-600 flex-shrink-0">
                        <MapPin size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Location</p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{selectedPackage.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                        <PaymentIcon size={16} className="sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase">Cost</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900">
                          {selectedPackage.isFree ? "FREE" : `₦${selectedPackage.price.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {purchaseStatus === "error" && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-2 sm:gap-3 text-red-700 animate-shake">
                      <AlertCircle size={18} />
                      <p className="text-xs sm:text-sm font-medium">Failed to complete purchase. Please try again.</p>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="mb-6 sm:mb-8">
                    <PaymentMethodSelector
                      amount={selectedPackage.price}
                      currency="₦"
                      isFree={selectedPackage.isFree}
                      onSelect={setSelectedGateway}
                      selectedGateway={selectedGateway}
                    />
                  </div>

                  {/* Modal Footer */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="order-2 sm:order-1 sm:flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-100 text-gray-600 rounded-xl sm:rounded-2xl font-bold hover:bg-gray-50 transition-all text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="order-1 sm:order-2 flex-1 sm:flex-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Purchase
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

