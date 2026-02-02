import Link from "next/link";
import Image from "next/image";
import { Check, Users, Globe, Building2 } from "lucide-react";

export default function AboutPage() {
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
        <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wide uppercase mb-6">
                <span>Our Mission</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-6 tracking-tight">
                Empowering <br className="sm:hidden" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">Pan-African Health.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                We are building the digital infrastructure to connect patients with quality care across the continent, making healthcare accessible, transparent, and efficient.
            </p>
        </div>

        {/* Stats / Impact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {[
                { number: "50k+", label: "Active Patients", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                { number: "100+", label: "Partner Clinics", icon: Building2, color: "text-emerald-600", bg: "bg-emerald-50" },
                { number: "5+", label: "Countries Served", icon: Globe, color: "text-purple-600", bg: "bg-purple-50" }
            ].map((stat, i) => (
                <div key={i} className="glass p-8 rounded-[2rem] border border-white/50 text-center hover:-translate-y-1 transition-transform duration-300">
                    <div className={`w-12 h-12 mx-auto ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <stat.icon size={24} />
                    </div>
                    <div className="text-4xl font-black text-slate-900 mb-2">{stat.number}</div>
                    <div className="font-medium text-slate-500">{stat.label}</div>
                </div>
            ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-slate-200">
                {/* Placeholder for Team/Office Image - Using abstract gradient for now */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-emerald-600 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center text-white/20">
                    <Globe size={120} />
                </div>
            </div>
            <div className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900">Bridging the Gap</h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                    <p>
                        Healthcare in Africa has long faced challenges of fragmentation and access. Records are lost, payments are opaque, and finding a specialist can be a daunting task.
                    </p>
                    <p>
                        <strong className="text-slate-900">MoreLife</strong> was born from a simple desire: to use technology to bridge these gaps. We created a unified ecosystem where your health history travels with you, and quality care is just a click away.
                    </p>
                </div>
                <div className="space-y-3">
                    {[" unified health records", "Digital payments", "Verified providers", "Telemedicine support"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <Check size={14} strokeWidth={3} />
                            </div>
                            <span className="font-medium text-slate-700">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* CTA */}
        <div className="glass rounded-[3rem] p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/50 to-emerald-50/50 -z-10" />
             <h2 className="text-3xl font-black text-slate-900 mb-6">Join the Revolution</h2>
             <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
                Whether you are a patient looking for better care or a provider wanting to expand your reach, MoreLife is your partner in health.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/patient/register" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                    Join as Patient
                </Link>
                <Link href="/provider/register" className="px-8 py-4 bg-white text-emerald-700 border border-emerald-100 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-sm">
                    Join as Provider
                </Link>
             </div>
        </div>

      </main>
    </div>
  );
}
