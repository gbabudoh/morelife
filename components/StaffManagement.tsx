"use client";

import { useState } from "react";
import { X, Plus, User } from "lucide-react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  email?: string | null;
  phone?: string | null;
  licenseNumber?: string | null;
  isOnline: boolean;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffManagementProps {
  doctors: Doctor[];
  providerId: string;
  onClose: () => void;
  onRefresh: () => void;
}

export default function StaffManagement({ doctors, providerId, onClose, onRefresh }: StaffManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/provider/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, providerId }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setForm({ name: "", specialty: "", email: "", phone: "", licenseNumber: "", password: "" });
        onRefresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add doctor");
      }
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleOnline = async (doctorId: string, currentStatus: boolean) => {
    try {
      await fetch("/api/provider/doctors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, isOnline: !currentStatus }),
      });
      onRefresh();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Staff Management</h2>
            <p className="text-slate-500 font-medium mt-1">Manage your medical team and live availability</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors cursor-pointer">
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats & Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
                Total: {doctors.length}
              </div>
              <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-sm">
                Online: {doctors.filter(d => d.isOnline).length}
              </div>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              {showAddForm ? <X size={18} /> : <Plus size={18} />}
              {showAddForm ? "Cancel" : "Add Staff Member"}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-10 p-8 rounded-3xl bg-slate-50 border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Specialty</label>
                  <input
                    type="text"
                    required
                    value={form.specialty}
                    onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="General Medicine"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Email (Login)</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="+234..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">License No.</label>
                  <input
                    type="text"
                    value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                    className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold"
                    placeholder="MDCN-12345"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Adding Staff..." : "Register Staff Member"}
              </button>
            </form>
          )}

          <div className="grid gap-4">
            {doctors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-bold italic">No staff members added yet.</p>
              </div>
            ) : (
              doctors.map((doctor) => (
                <div key={doctor.id} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all flex items-center justify-between group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-tr from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                      <User size={28} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 leading-none">{doctor.name}</h4>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-bold uppercase tracking-widest">
                        <span>{doctor.specialty}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{doctor.licenseNumber}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                      <button 
                        onClick={() => toggleOnline(doctor.id, doctor.isOnline)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          doctor.isOnline 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${doctor.isOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                        {doctor.isOnline ? "ONLINE" : "OFFLINE"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
