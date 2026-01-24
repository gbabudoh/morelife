"use client";

import { useState } from "react";
import { CreditCard, Smartphone, Building2, Check, X, Info, Lock, Eye, EyeOff } from "lucide-react";

interface PaymentSettings {
  flutterwaveEnabled: boolean;
  flutterwavePublicKey: string;
  flutterwaveSecretKey: string;
  paystackEnabled: boolean;
  paystackPublicKey: string;
  paystackSecretKey: string;
  mobileMoneyEnabled: boolean;
  bankTransferEnabled: boolean;
  defaultGateway: string;
}

interface ProviderPaymentSettingsProps {
  settings: PaymentSettings;
  onSave: (settings: PaymentSettings) => Promise<void>;
  onClose: () => void;
}

export default function ProviderPaymentSettings({
  settings: initialSettings,
  onSave,
  onClose,
}: ProviderPaymentSettingsProps) {
  const [settings, setSettings] = useState<PaymentSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [showFlutterwaveSecret, setShowFlutterwaveSecret] = useState(false);
  const [showPaystackSecret, setShowPaystackSecret] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(settings);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <CreditCard size={24} className="text-white cursor-pointer" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Payment Gateway Settings</h2>
                <p className="text-blue-100 text-sm font-medium">Configure how you receive payments</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} className="text-white cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 flex items-start gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5 cursor-pointer" />
            <div className="text-sm text-blue-900">
              <p className="font-bold mb-1">Secure Payment Integration</p>
              <p>Connect your payment gateway accounts to receive payments directly. Your API keys are encrypted and stored securely.</p>
            </div>
          </div>

          {/* Flutterwave Section */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={24} className="text-orange-600 cursor-pointer" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Flutterwave</h3>
                  <p className="text-sm text-gray-500">Cards, Bank Transfer, Mobile Money, USSD</p>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.flutterwaveEnabled}
                  onChange={(e) => setSettings({ ...settings, flutterwaveEnabled: e.target.checked })}
                  className="peer hidden"
                />
                <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors shadow-inner"></div>
                <div className="absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>

            {settings.flutterwaveEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={settings.flutterwavePublicKey}
                    onChange={(e) => setSettings({ ...settings, flutterwavePublicKey: e.target.value })}
                    placeholder="FLWPUBK-xxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showFlutterwaveSecret ? "text" : "password"}
                      value={settings.flutterwaveSecretKey}
                      onChange={(e) => setSettings({ ...settings, flutterwaveSecretKey: e.target.value })}
                      placeholder="FLWSECK-xxxxxxxxxxxxx"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFlutterwaveSecret(!showFlutterwaveSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showFlutterwaveSecret ? <EyeOff size={18} className="cursor-pointer" /> : <Eye size={18} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Lock size={14} className="cursor-pointer" />
                  <span>Get your API keys from <a href="https://dashboard.flutterwave.com/settings/apis" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold cursor-pointer">Flutterwave Dashboard</a></span>
                </div>
              </div>
            )}
          </div>

          {/* Paystack Section */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard size={24} className="text-blue-600 cursor-pointer" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Paystack</h3>
                  <p className="text-sm text-gray-500">Cards, Bank Transfer, USSD, QR</p>
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.paystackEnabled}
                  onChange={(e) => setSettings({ ...settings, paystackEnabled: e.target.checked })}
                  className="peer hidden"
                />
                <div className="w-14 h-8 bg-gray-200 rounded-full peer-checked:bg-blue-600 transition-colors shadow-inner"></div>
                <div className="absolute w-6 h-6 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-6"></div>
              </label>
            </div>

            {settings.paystackEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Public Key
                  </label>
                  <input
                    type="text"
                    value={settings.paystackPublicKey}
                    onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
                    placeholder="pk_live_xxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPaystackSecret ? "text" : "password"}
                      value={settings.paystackSecretKey}
                      onChange={(e) => setSettings({ ...settings, paystackSecretKey: e.target.value })}
                      placeholder="sk_live_xxxxxxxxxxxxx"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPaystackSecret(!showPaystackSecret)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPaystackSecret ? <EyeOff size={18} className="cursor-pointer" /> : <Eye size={18} className="cursor-pointer" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Lock size={14} className="cursor-pointer" />
                  <span>Get your API keys from <a href="https://dashboard.paystack.com/#/settings/developers" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold cursor-pointer">Paystack Dashboard</a></span>
                </div>
              </div>
            )}
          </div>

          {/* Coming Soon Sections */}
          <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Smartphone size={24} className="text-green-600 cursor-pointer" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Mobile Money</h3>
                  <p className="text-sm text-gray-500">M-Pesa, MTN Money, Airtel Money</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Building2 size={24} className="text-purple-600 cursor-pointer" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Bank Transfer</h3>
                  <p className="text-sm text-gray-500">Direct bank account transfers</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Default Gateway */}
          {(settings.flutterwaveEnabled || settings.paystackEnabled) && (
            <div className="border-2 border-blue-200 rounded-2xl p-6 bg-blue-50">
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Default Payment Gateway
              </label>
              <select
                value={settings.defaultGateway}
                onChange={(e) => setSettings({ ...settings, defaultGateway: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold cursor-pointer"
              >
                {settings.flutterwaveEnabled && <option value="flutterwave">Flutterwave</option>}
                {settings.paystackEnabled && <option value="paystack">Paystack</option>}
              </select>
              <p className="text-xs text-gray-500 mt-2">This gateway will be used by default for your packages</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-3xl flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={20} className="cursor-pointer" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
