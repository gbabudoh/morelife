"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { africanCountries } from "@/lib/african-locations";
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

  // Purchase flow state
  const [selectedPackage, setSelectedPackage] = useState<HealthcarePackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "success" | "error">("idle");

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

    setIsPurchasing(true);
    setPurchaseStatus("idle");

    try {
      const patientId = localStorage.getItem("patientId");
      if (!patientId) {
        router.push("/patient/login");
        return;
      }

      const response = await fetch("/api/patient/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          packageId: selectedPackage.id,
        }),
      });

      if (response.ok) {
        setPurchaseStatus("success");
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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="MoreLife Healthcare"
              width={150}
              height={60}
              className="object-contain"
            />
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/patient/dashboard"
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-2"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("patientId");
                router.push("/patient/login");
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white">
            <ShoppingCart size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Healthcare Marketplace
          </h1>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <div className="flex items-center gap-2 mb-6 text-gray-900">
            <Filter size={20} />
            <h2 className="text-xl font-bold">Filter Packages</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  placeholder="Search packages..."
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Treatment Type / Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Treatment Category
              </label>
              <select
                value={filter.treatmentType}
                onChange={(e) => setFilter({ ...filter, treatmentType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {countryObj.name === "Nigeria" ? "State" : "Province/Region"}
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Type
              </label>
              <select
                value={filter.providerType}
                onChange={(e) => setFilter({ ...filter, providerType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subscription Type
              </label>
              <select
                value={filter.subscriptionType}
                onChange={(e) => setFilter({ ...filter, subscriptionType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Subscriptions</option>
                <option value="single">Single</option>
                <option value="family">Family</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>

            {/* Package Type (Free/Paid) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                value={filter.isFree}
                onChange={(e) => setFilter({ ...filter, isFree: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Packages</option>
                <option value="false">Paid Packages</option>
                <option value="true">Free Packages</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-6">
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
              className="px-6 py-2.5 text-sm bg-gray-50 border-2 border-gray-100 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-all font-semibold flex items-center gap-2"
            >
              <Zap size={16} />
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-xl">No packages found matching your criteria.</p>
            </div>
          ) : (
            filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">{pkg.name}</h3>
                  {pkg.isFree && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold ml-2">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">{pkg.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600 gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white transition-colors">
                      <Hospital size={14} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Provider</span>
                      <span className="font-semibold text-gray-900">{pkg.providerName}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover/item:bg-purple-600 group-hover/item:text-white transition-colors">
                      <Stethoscope size={14} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Type</span>
                      <span className="font-semibold text-gray-900">{pkg.treatmentType}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover/item:bg-green-600 group-hover/item:text-white transition-colors">
                      <Clock size={14} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Duration</span>
                      <span className="font-semibold text-gray-900">{pkg.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600 group-hover/item:bg-red-600 group-hover/item:text-white transition-colors">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400">Location</span>
                      <span className="font-semibold text-gray-900">{pkg.location}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                  {pkg.isFree ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Cost</span>
                      <span className="text-2xl font-bold text-green-600">FREE</span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-gray-400">Cost</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ₦{pkg.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedPackage(pkg);
                      setIsModalOpen(true);
                      setPurchaseStatus("idle");
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
                  >
                    View Details
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Package Details Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in border border-white/20">
            {/* Modal Header */}
            <div className="relative h-48 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex flex-col justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <div className="space-y-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md">
                  {selectedPackage.treatmentType}
                </span>
                <h2 className="text-3xl font-bold text-white">{selectedPackage.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8">
              {purchaseStatus === "success" ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle2 size={48} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Purchase Successful!</h3>
                    <p className="text-gray-600 mt-2">
                      Your package has been activated. You can now view it in your dashboard and present your QR code for redemption.
                    </p>
                  </div>
                  <div className="pt-4 flex gap-4">
                    <button 
                      onClick={() => router.push("/patient/dashboard")}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    {selectedPackage.description}
                  </p>

                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Hospital size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Provider</p>
                          <p className="font-semibold text-gray-900">{selectedPackage.providerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                          <Clock size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Validity</p>
                          <p className="font-semibold text-gray-900">{selectedPackage.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Location</p>
                          <p className="font-semibold text-gray-900">{selectedPackage.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                          <PaymentIcon size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Cost</p>
                          <p className="font-bold text-gray-900">
                            {selectedPackage.isFree ? "FREE" : `₦${selectedPackage.price.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {purchaseStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl flex items-center gap-3 text-red-700 animate-shake">
                      <AlertCircle size={20} />
                      <p className="text-sm font-medium">Failed to complete purchase. Please try again.</p>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex gap-4 pt-4">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="flex-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Complete Purchase
                          <ChevronRight size={20} />
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

