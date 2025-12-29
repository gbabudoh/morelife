"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Only run on client-side after mount
    const checkLoginStatus = () => {
      const patientId = localStorage.getItem("patientId");
      if (patientId && !isLoggedIn) {
        setIsLoggedIn(true);
      } else if (!patientId && isLoggedIn) {
        setIsLoggedIn(false);
      }
    };
    
    checkLoginStatus();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header with conditional navigation */}
        <header className="flex items-center justify-between mb-16">
          <Image
            src="/logo.png"
            alt="MoreLife Healthcare Logo"
            width={200}
            height={80}
            className="object-contain"
            priority
            unoptimized
          />
          
          {isLoggedIn && (
            <div className="flex gap-4">
              <Link
                href="/patient/dashboard"
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("patientId");
                  setIsLoggedIn(false);
                }}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            MoreLife Healthcare
          </h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">
            Africa Healthcare Ecosystem
          </p>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Providing transparent access to healthcare for a better tomorrow
          </p>
        </div>

        {/* Show different content based on login status */}
        {isLoggedIn ? (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back! 👋</h2>
              <p className="text-lg text-gray-600 mb-6">
                You&apos;re logged in to your MoreLife Healthcare account.
              </p>
              <Link
                href="/patient/dashboard"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View Your Dashboard
              </Link>
            </div>
            <Link
              href="/patient/marketplace"
              className="inline-block px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <>
            {/* Access Options */}
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mb-16">
              {/* Patient Access */}
              <Link
                href="/patient/login"
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 transition-colors">
                    <svg
                      className="w-10 h-10 text-blue-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Patient Access
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Login to access your healthcare account and services
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>✓ View Your Digital Health Card</p>
                    <p>✓ Access Healthcare Packages</p>
                    <p>✓ Browse Marketplace</p>
                    <p>✓ Manage Your Subscription</p>
                  </div>
                  <div className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
                    Patient Access
                  </div>
                </div>
              </Link>

              {/* Healthcare Provider Access */}
              <Link
                href="/provider/login"
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-500"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-500 transition-colors">
                    <svg
                      className="w-10 h-10 text-green-600 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Provider Access
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Login to manage your healthcare services and patients
                  </p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>✓ Manage Your Practice</p>
                    <p>✓ Create Healthcare Packages</p>
                    <p>✓ Access Patient Network</p>
                    <p>✓ View Analytics & Insights</p>
                  </div>
                  <div className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold group-hover:bg-green-700 transition-colors">
                    Provider Access
                  </div>
                </div>
              </Link>
            </div>

            {/* Features Section */}
            <div className="max-w-6xl mx-auto mt-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose MoreLife Healthcare?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-4xl mb-4">💳</div>
                  <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                  <p className="text-gray-600">
                    Fixed-price, all-inclusive packages with no hidden costs
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-4xl mb-4">🏥</div>
                  <h3 className="text-xl font-semibold mb-2">Wide Network</h3>
                  <p className="text-gray-600">
                    Access to a curated network of quality healthcare providers
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold mb-2">Digital Health Card</h3>
                  <p className="text-gray-600">
                    Your unique MH-Number and QR code for seamless access
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="text-center mt-20 text-gray-600">
          <p>MoreLife: Providing access to healthcare for a better tomorrow</p>
        </footer>
      </div>
    </div>
  );
}
