"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step === currentStep
                ? "bg-green-600 text-white"
                : step < currentStep
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 ${
                step < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Name (Business Name) *
          </label>
          <input
            type="text"
            required
            value={formData.providerName}
            onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person *
          </label>
          <input
            type="text"
            required
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password *
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provider Type *
          </label>
          <select
            value={formData.providerType}
            onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
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
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country *
        </label>
        <select
          required
          value={formData.country}
          onChange={(e) => handleCountryChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="">Select Country</option>
          {africanCountries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {selectedCountry.name === "Nigeria" ? "State" : "Province/Region"} *
          </label>
          <select
            required
            value={formData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select {selectedCountry.name === "Nigeria" ? "State" : "Province/Region"}</option>
            {selectedCountry.subdivisions.map((subdivision) => (
              <option key={subdivision.code} value={subdivision.name}>
                {subdivision.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubdivision && selectedSubdivision.cities && selectedSubdivision.cities.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <select
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select City</option>
            {selectedSubdivision.cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubdivision && (!selectedSubdivision.cities || selectedSubdivision.cities.length === 0) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Telephone *
        </label>
        <div className="flex gap-2">
          <select
            required
            value={formData.countryCode}
            onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
          >
            {africanCountryCodes.map((country) => (
              <option key={country.code} value={country.dialCode}>
                {country.flag} {country.dialCode}
              </option>
            ))}
          </select>
          <input
            type="tel"
            required
            value={formData.contactTelephone}
            onChange={(e) => setFormData({ ...formData, contactTelephone: e.target.value.replace(/\D/g, "") })}
            placeholder="800 111 2222"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Details & Documents</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Started *
          </label>
          <input
            type="number"
            required
            min="1900"
            max={new Date().getFullYear()}
            value={formData.yearStarted}
            onChange={(e) => setFormData({ ...formData, yearStarted: e.target.value })}
            placeholder="e.g., 2015"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Registration Number *
          </label>
          <input
            type="text"
            required
            value={formData.businessRegistrationNumber}
            onChange={(e) => setFormData({ ...formData, businessRegistrationNumber: e.target.value })}
            placeholder="CAC or equivalent"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Registration Document * (PDF/Image)
        </label>
        <input
          type="file"
          required
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("businessRegistrationDoc", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">Upload your CAC certificate or equivalent business registration</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medical/Health Facility License * (PDF/Image)
        </label>
        <input
          type="file"
          required
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("medicalLicenseDoc", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
        <p className="text-xs text-gray-500 mt-1">Upload your health facility operating license from Ministry of Health</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialized Services & Permits</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Select the specialized services your facility offers and upload the required permits
      </p>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasPharmacy}
              onChange={(e) => setFormData({ ...formData, hasPharmacy: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-medium">Pharmacy Services</span>
          </label>
          {formData.hasPharmacy && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy Permit * (PDF/Image)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("pharmacyPermit", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasLaboratory}
              onChange={(e) => setFormData({ ...formData, hasLaboratory: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-medium">Laboratory Services</span>
          </label>
          {formData.hasLaboratory && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Laboratory Permit * (PDF/Image)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("laboratoryPermit", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasRadiology}
              onChange={(e) => setFormData({ ...formData, hasRadiology: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-medium">Radiology/X-Ray Services</span>
          </label>
          {formData.hasRadiology && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Radiology Permit * (PDF/Image)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("radiologyPermit", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.hasSurgicalTheater}
              onChange={(e) => setFormData({ ...formData, hasSurgicalTheater: e.target.checked })}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <span className="font-medium">Surgical Theater</span>
          </label>
          {formData.hasSurgicalTheater && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surgical Theater Permit * (PDF/Image)
              </label>
              <input
                type="file"
                required
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange("surgicalTheaterPermit", e.target.files?.[0] || null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Certifications & Insurance</h3>
      
      <p className="text-sm text-gray-600 mb-4">
        Upload facility certifications and insurance documents (Optional but recommended)
      </p>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Waste Management Certificate (PDF/Image)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("wasteManagementCert", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fire Safety Certificate (PDF/Image)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("fireSafetyCert", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Environmental Impact Assessment (PDF/Image)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("environmentalImpactCert", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medical Malpractice Insurance (PDF/Image)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("malpracticeInsurance", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          General Liability Insurance (PDF/Image)
        </label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange("liabilityInsurance", e.target.files?.[0] || null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-blue-900 mb-2">📋 Review Before Submission</h4>
        <p className="text-sm text-blue-800">
          Your application will be reviewed by our team. You&apos;ll receive an email notification once your account is verified and approved.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="MoreLife Healthcare"
                width={150}
                height={60}
                className="object-contain mx-auto"
              />
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">Healthcare Provider Registration</h2>
            <p className="text-gray-600 mt-2">Join the MoreLife Healthcare network</p>
          </div>

          {renderStepIndicator()}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/provider/login" className="text-green-600 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
