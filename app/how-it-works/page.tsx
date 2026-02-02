"use client";

import Link from "next/link";
import Image from "next/image";
import { UserPlus, Search, Stethoscope, FileText, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Profile",
      description: "Sign up as a patient to manage your health, or as a provider to expand your practice. It takes less than 2 minutes.",
      color: "blue"
    },
    {
      icon: Search,
      title: "Connect & Schedule",
      description: "Browse verified specialists, view real-time availability, and book appointments that fit your schedule.",
      color: "emerald"
    },
    {
      icon: Stethoscope,
      title: "Receive Quality Care",
      description: "Consult via high-quality video or in-person. Your care plan is automatically updated in your dashboard.",
      color: "purple"
    },
    {
      icon: FileText,
      title: "Unified Records",
      description: "Access your medical history, prescriptions, and lab results anywhere. One account, total control.",
      color: "indigo"
    }
  ];

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-100 selection:text-blue-900 pb-20">
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 px-4 py-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex-shrink-0 cursor-pointer">
               <Image
                src="/logo.png"
                alt="MoreLife"
                width={120}
                height={40}
                className="object-contain"
                priority
                unoptimized
              />
            </Link>
             <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2 group">
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Home
            </Link>
        </div>
      </nav>

      <main className="pt-32 px-4 sm:px-6 max-w-7xl mx-auto">
        
        {/* Hero */}
        <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase mb-6">
                <span>Simple & Transparent</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                Healthcare made <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Effortless.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                No more confusing paperwork or fragmented records. We&apos;ve streamlined the entire healthcare journey into four simple steps.
            </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-100 via-emerald-100 to-transparent -translate-x-1/2" />

            {steps.map((step, i) => (
                <div key={i} className={`relative group ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    
                    {/* Center Node */}
                    <div className="hidden md:flex absolute top-8 left-0 right-0 justify-center w-full pointer-events-none">
                        <div className={`w-4 h-4 rounded-full bg-white border-4 border-${step.color}-100 shadow-sm relative z-10`} >
                             <div className={`absolute inset-0 rounded-full bg-${step.color}-500 w-1.5 h-1.5 m-auto`} />
                        </div>
                    </div>

                    <div className="glass p-8 rounded-[2.5rem] border border-white/60 hover:border-blue-200 transaction-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className={`w-14 h-14 ${i % 2 === 0 ? 'md:ml-auto' : ''} bg-${step.color}-50 text-${step.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                            <step.icon size={28} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-3">{step.title}</h3>
                        <p className="text-slate-600 font-medium leading-relaxed">
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>

        {/* CTA */}
        <div className="glass rounded-[3rem] p-8 sm:p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-emerald-50/50 -z-10" />
             
             <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-black text-slate-900 mb-6">Ready to get started?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    <Link href="/patient/register" className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-blue-50 hover:border-blue-200">
                        <div className="text-left">
                            <div className="font-bold text-slate-900">For Patients</div>
                            <div className="text-xs text-slate-500">Find care</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <ArrowRight size={14} />
                        </div>
                    </Link>
                    <Link href="/provider/register" className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-emerald-50 hover:border-emerald-200">
                        <div className="text-left">
                            <div className="font-bold text-slate-900">For Providers</div>
                            <div className="text-xs text-slate-500">Join network</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <ArrowRight size={14} />
                        </div>
                    </Link>
                </div>
             </div>
        </div>

      </main>
    </div>
  );
}
