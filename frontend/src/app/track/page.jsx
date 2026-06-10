"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ArrowRight, Hash } from "lucide-react";
import Footer from "../../components/Footer";

export default function TrackOrder() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = orderId.trim();
    if (!id) return;
    const type = id.toLowerCase().includes("otp") ? "otp" : "smm";
    router.push(`/order/${type}/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-3xl text-center space-y-8">

        {/* HEADER */}
        <div className="flex flex-col items-center space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF2F6] text-[#4F46E5] shadow-sm">
            <Truck className="h-6 w-6 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
              Track Your Order
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              Enter your Order ID to see real-time updates on your service provisioning.
            </p>
          </div>
        </div>

        {/* TRACKING INPUT */}
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">

            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Hash className="h-4 w-4 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. NX-8492-771"
                className="w-full pl-10 pr-4 py-3 text-xs font-semibold bg-[#F8FAFC] rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-inner focus:outline-none focus:border-[#4F46E5] focus:bg-white focus:ring-1 focus:ring-[#4F46E5] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-[#312ECB] px-6 py-3 text-xs font-bold text-white shadow-sm hover:bg-[#2522A6] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <span>Track Order</span>
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>

          </form>
        </div>

      </div>
      </div>
      <Footer />
    </div>
  );
}
