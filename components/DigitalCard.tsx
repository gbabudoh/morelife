"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import Image from "next/image";
import { CheckCircle2, CreditCard } from "lucide-react";

interface DigitalCardProps {
  mhNumber: string;
  name: string;
  subscriptionType: string;
}

export default function DigitalCard({ mhNumber, name, subscriptionType }: DigitalCardProps) {
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

      <div className="relative z-10 p-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.2)] group-hover/digital-card:rotate-6 transition-transform duration-500">
              <Image
                src="/icon.png"
                alt="MoreLife Icon"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-xl font-black tracking-tight leading-none mb-1">MoreLife</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Health Passport</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Card Content - Glass Inlay */}
        <div className="bg-white/10 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/20 shadow-inner group-hover/digital-card:bg-white/15 transition-all duration-500">
          {/* QR Code Section */}
          <div className="flex justify-center mb-8">
            <div className="relative group/qr">
              <div className="absolute -inset-2 bg-gradient-to-tr from-white/20 to-white/0 rounded-2xl blur opacity-0 group-hover/qr:opacity-100 transition duration-500"></div>
              <div className="bg-white p-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] transition-transform duration-500 group-hover/qr:scale-105">
                <QRCodeSVG
                  value={qrValue}
                  size={140}
                  level="H"
                  includeMargin={false}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
            </div>
          </div>

          {/* Identification Details */}
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-white/70">
                <CreditCard size={14} className="animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.15em]">Health ID Number</p>
              </div>
              <p className="text-3xl font-black tracking-[0.1em] text-white tabular-nums drop-shadow-md">{mhNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1.5">Card Holder</p>
                <p className="text-xl font-black tracking-tight truncate pr-2">{name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1.5">Plan Tier</p>
                <p className="text-xl font-black tracking-tight capitalize truncate">
                  {subscriptionType.toLowerCase().replace("_", " ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center bg-black/10 rounded-xl py-3 px-4 backdrop-blur-sm border border-white/5">
          <p className="text-[10px] font-bold flex items-center justify-center gap-2 opacity-90">
            <CheckCircle2 size={12} className="text-emerald-400" />
            Blockchain Verified & Active
          </p>
        </div>
      </div>
    </div>
  );
}
