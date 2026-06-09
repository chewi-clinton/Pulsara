"use client";

import React, { useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import {
  Globe,
  Search,
  Phone,
  Radio,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface OTPService {
  id: string;
  country: string;
  flag: string;
  apps: string[];
  provider: string;
  price: string;
  status: "Available" | "High Demand" | "Limited";
}

const appFilters = ["All", "WhatsApp", "Telegram", "Google", "Facebook", "Instagram", "Tinder"];

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
  "High Demand": "bg-amber-50 text-amber-600 border-amber-100",
  Limited: "bg-rose-50 text-rose-500 border-rose-100",
};

const statusIcon = {
  Available: <Radio className="h-3 w-3 text-emerald-500" />,
  "High Demand": <AlertTriangle className="h-3 w-3 text-amber-500" />,
  Limited: <AlertTriangle className="h-3 w-3 text-rose-400" />,
};

const services: OTPService[] = [
  { id: "o1", country: "United States", flag: "🇺🇸", apps: ["WhatsApp", "Telegram", "Google", "Facebook"], provider: "SMSPool", price: "$0.15", status: "Available" },
  { id: "o2", country: "United Kingdom", flag: "🇬🇧", apps: ["WhatsApp", "Telegram", "Instagram"], provider: "SMSPool", price: "$0.18", status: "Available" },
  { id: "o3", country: "India", flag: "🇮🇳", apps: ["WhatsApp", "Telegram", "Google"], provider: "5sim", price: "$0.08", status: "High Demand" },
  { id: "o4", country: "Russia", flag: "🇷🇺", apps: ["Telegram", "WhatsApp", "Tinder"], provider: "5sim", price: "$0.06", status: "Available" },
  { id: "o5", country: "Brazil", flag: "🇧🇷", apps: ["WhatsApp", "Instagram", "Facebook"], provider: "SMSPool", price: "$0.10", status: "High Demand" },
  { id: "o6", country: "Germany", flag: "🇩🇪", apps: ["WhatsApp", "Telegram", "Google"], provider: "SMSPool", price: "$0.20", status: "Available" },
  { id: "o7", country: "France", flag: "🇫🇷", apps: ["WhatsApp", "Telegram", "Instagram"], provider: "5sim", price: "$0.18", status: "Limited" },
  { id: "o8", country: "Canada", flag: "🇨🇦", apps: ["WhatsApp", "Google", "Facebook", "Tinder"], provider: "SMSPool", price: "$0.16", status: "Available" },
  { id: "o9", country: "Indonesia", flag: "🇮🇩", apps: ["WhatsApp", "Telegram"], provider: "5sim", price: "$0.07", status: "Available" },
  { id: "o10", country: "Nigeria", flag: "🇳🇬", apps: ["WhatsApp", "Telegram", "Facebook"], provider: "SMSPool", price: "$0.09", status: "High Demand" },
  { id: "o11", country: "Pakistan", flag: "🇵🇰", apps: ["WhatsApp", "Telegram"], provider: "5sim", price: "$0.07", status: "Limited" },
  { id: "o12", country: "Philippines", flag: "🇵🇭", apps: ["WhatsApp", "Facebook", "Instagram"], provider: "SMSPool", price: "$0.10", status: "Available" },
];

export default function OTPPage() {
  const [activeApp, setActiveApp] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = services.filter((s) => {
    const matchApp = activeApp === "All" || s.apps.includes(activeApp);
    const matchSearch = s.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchApp && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-[#4F46E5]">Nexora</span>
        <nav className="flex items-center space-x-8 text-xs font-bold text-slate-500 tracking-wide">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <a href="/smm" className="hover:text-slate-900 transition-colors">SMM Services</a>
          <a href="/otp" className="text-[#4F46E5] underline decoration-2 underline-offset-4">OTP Numbers</a>
          <a href="/track" className="hover:text-slate-900 transition-colors">Track Order</a>
          <a href="/faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</button>
          <button className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">Sign Up</button>
          <Globe className="h-4 w-4 text-slate-400" />
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-slate-100 px-6 py-14 text-center space-y-5">
        <div className="inline-flex items-center space-x-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-[10px] font-bold tracking-wide text-emerald-600 uppercase">
          <Zap className="h-3 w-3 fill-emerald-600" />
          <span>Instant Virtual Number Provisioning</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Virtual Numbers for Global Verification
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
          Get a temporary phone number from any country to receive SMS verification codes. No SIM required. Numbers provisioned in under 3 seconds.
        </p>

        <div className="flex items-center justify-center space-x-6 pt-2 text-[11px] font-bold text-slate-500">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4 text-[#10B981]" />
            <span>100% Anonymous</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Phone className="h-4 w-4 text-[#4F46E5]" />
            <span>50+ Countries</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="h-4 w-4 text-emerald-500" />
            <span>Real-time SMS</span>
          </div>
        </div>

        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
          />
        </div>
      </section>

      {/* APP FILTER TABS */}
      <div className="bg-white border-b border-slate-100 px-6 lg:px-16">
        <div className="flex items-center space-x-1 overflow-x-auto py-3">
          {appFilters.map((app) => (
            <button
              key={app}
              onClick={() => setActiveApp(app)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeApp === app
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {app}
            </button>
          ))}
        </div>
      </div>

      {/* NUMBERS GRID */}
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((svc) => (
              <div
                key={svc.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all space-y-4 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl leading-none">{svc.flag}</span>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">{svc.country}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">via {svc.provider}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center space-x-1 rounded-md border px-2 py-0.5 text-[9px] font-bold ${statusStyles[svc.status]}`}>
                    {statusIcon[svc.status]}
                    <span>{svc.status}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {svc.apps.map((app) => (
                    <span key={app} className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {app}
                    </span>
                  ))}
                </div>

                <div className="flex items-end justify-between border-t border-slate-50 pt-3 mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Price</p>
                    <p className="text-xl font-extrabold text-[#4F46E5] font-mono">{svc.price}</p>
                  </div>
                  <button className="inline-flex items-center space-x-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
                    <span>Get Number</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400">No numbers available for this filter.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveApp("All"); }}
              className="mt-2 text-xs font-bold text-[#4F46E5] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
