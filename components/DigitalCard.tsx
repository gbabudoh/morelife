"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { CheckCircle2, CreditCard, AlertCircle, Gift } from "lucide-react";

interface DigitalCardProps {
  mhNumber: string;
  name: string;
  subscriptionType: string;
  isActive?: boolean;
  isGFP?: boolean;
}

export default function DigitalCard({ mhNumber, name, subscriptionType, isActive = true, isGFP = false }: DigitalCardProps) {
  const qrValue = useMemo(() => JSON.stringify({
    mhNumber,
    name,
    timestamp: new Date().toISOString(),
  }), [mhNumber, name]);

  return (
    <div className="relative group/digital-card overflow-hidden rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] transition-all duration-700 hover:shadow-[0_20px_80px_rgba(37,99,235,0.25)]">
      {/* Dynamic Background Blend */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1e40af] via-[#7c3aed] to-[#059669] opacity-95 group-hover/digital-card:scale-105 transition-transform duration-1000"></div>
      
      {/* Decorative Overlays */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-5 sm:p-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.2)] group-hover/digital-card:rotate-6 transition-transform duration-500 flex-shrink-0">
              <Image
                src="/icon.png"
                alt="MoreLife Icon"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-base sm:text-lg font-black tracking-tight leading-none mb-0.5">MoreLife</p>
              <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] opacity-80">Health Passport</p>
            </div>
          </div>
          <div className="w-8 h-8 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md flex-shrink-0">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Card Content - Glass Inlay */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-[1.5rem] p-4 sm:p-5 border border-white/20 shadow-inner group-hover/digital-card:bg-white/15 transition-all duration-500">
          {/* QR Code Section */}
          <div className="flex justify-center mb-5">
            <div className="relative group/qr">
              <div className="absolute -inset-2 bg-gradient-to-tr from-white/20 to-white/0 rounded-xl blur opacity-0 group-hover/qr:opacity-100 transition duration-500"></div>
              <div className="bg-white p-3 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover/qr:scale-105">
                <QRCodeSVG
                  value={qrValue}
                  size={110}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Identification Details */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5 text-white/70">
                <CreditCard size={12} className="animate-pulse flex-shrink-0" />
                <p className="text-[9px] font-black uppercase tracking-[0.1em]">Health ID Number</p>
              </div>
              <p className="text-xl sm:text-2xl font-black tracking-[0.05em] text-white tabular-nums drop-shadow-md">{mhNumber}</p>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Card Holder:</p>
                <p className="text-sm sm:text-base font-bold tracking-tight truncate capitalize">{name}</p>
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-wider text-white/50 mb-1">Plan Tier:</p>
                <p className="text-sm sm:text-base font-bold tracking-tight capitalize truncate">
                  {subscriptionType.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className={`mt-5 text-center rounded-lg py-2 px-3 backdrop-blur-sm border border-white/5 ${
          isActive 
            ? isGFP 
              ? "bg-green-500/20" 
              : "bg-black/10"
            : "bg-red-500/20"
        }`}>
          <p className="text-[9px] font-bold flex items-center justify-center gap-1.5 opacity-90">
            {isActive ? (
              isGFP ? (
                <>
                  <Gift size={10} className="text-green-300 flex-shrink-0" />
                  GFP Active - Free Healthcare Access
                </>
              ) : (
                <>
                  <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                  Blockchain Verified & Active
                </>
              )
            ) : (
              <>
                <AlertCircle size={10} className="text-red-300 flex-shrink-0" />
                Subscription Inactive
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
