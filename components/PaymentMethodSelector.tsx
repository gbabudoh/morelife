"use client";

import { useState } from "react";
import { Check, CreditCard, Smartphone, Building2, Info } from "lucide-react";
import { PAYMENT_CONFIGS, PaymentGateway, calculatePaymentFee, getTotalWithFees } from "@/lib/payment-config";

interface PaymentMethodSelectorProps {
  amount: number;
  currency: string;
  isFree: boolean;
  onSelect: (gateway: PaymentGateway | null) => void;
  selectedGateway: PaymentGateway | null;
}

export default function PaymentMethodSelector({
  amount,
  currency,
  isFree,
  onSelect,
  selectedGateway,
}: PaymentMethodSelectorProps) {
  if (isFree) {
    return (
      <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-green-900">Free Package</h3>
        </div>
        <p className="text-sm text-green-700">
          No payment required. Click "Complete Purchase" to activate this package.
        </p>
      </div>
    );
  }

  const getIcon = (gateway: PaymentGateway) => {
    switch (gateway) {
      case 'flutterwave':
      case 'paystack':
        return <CreditCard size={20} />;
      case 'mobile_money':
        return <Smartphone size={20} />;
      case 'bank_transfer':
        return <Building2 size={20} />;
      default:
        return <CreditCard size={20} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">Select Payment Method</h3>
        <div className="group relative">
          <Info size={16} className="text-gray-400 cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            Choose your preferred payment method. Fees may apply depending on the gateway.
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.values(PAYMENT_CONFIGS)
          .filter((config) => config.enabled && (config.id === 'flutterwave' || config.id === 'paystack'))
          .map((config) => {
            const fee = calculatePaymentFee(amount, config.id);
            const total = getTotalWithFees(amount, config.id);
            const isSelected = selectedGateway === config.id;

            return (
              <button
                key={config.id}
                onClick={() => onSelect(config.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {getIcon(config.id)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">{config.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{config.description}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Package Cost:</span>
                    <span className="font-semibold text-gray-900">
                      {currency} {amount.toLocaleString()}
                    </span>
                  </div>
                  {fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Gateway Fee:</span>
                      <span className="font-semibold text-orange-600">
                        +{currency} {fee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-700">Total:</span>
                    <span className="font-bold text-blue-600">
                      {currency} {total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      {/* Additional Payment Methods Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4">
        <h4 className="text-xs sm:text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
          <Info size={14} />
          Other Payment Options
        </h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>Mobile Money:</strong> M-Pesa, MTN Money, Airtel Money (Coming Soon)</li>
          <li>• <strong>Bank Transfer:</strong> Direct transfer to provider account (Coming Soon)</li>
          <li>• <strong>USSD:</strong> Pay via USSD code on your phone (Available via gateways)</li>
        </ul>
      </div>
    </div>
  );
}
