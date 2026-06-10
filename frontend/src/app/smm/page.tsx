"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import {
  Globe,
  Search,
  ThumbsUp,
  UserPlus,
  Eye,
  MessageCircle,
  Play,
  ArrowRight,
  BadgeCheck,
  Zap,
  Star,
  Loader2,
} from "lucide-react";
import { api, type SMMService } from "../../lib/api";

const platformTabs = ["All", "Instagram", "TikTok", "YouTube", "Twitter", "Facebook"];

const qualityColor = {
  "High Quality": "bg-emerald-50 text-emerald-600 border-emerald-100",
  Standard: "bg-slate-100 text-slate-600 border-slate-200",
  Premium: "bg-indigo-50 text-[#4F46E5] border-indigo-100",
};

function platformIcon(platform: string, category: string) {
  const p = platform.toLowerCase();
  const c = category.toLowerCase();
  const colorMap: Record<string, string> = {
    instagram: "text-pink-500",
    tiktok: "text-slate-800",
    youtube: "text-red-500",
    twitter: "text-sky-500",
    facebook: "text-blue-600",
  };
  const color = colorMap[p] ?? "text-slate-500";
  if (c === "followers") return <UserPlus className={`h-4 w-4 ${color}`} />;
  if (c === "likes") return <ThumbsUp className={`h-4 w-4 ${color}`} />;
  if (c === "views") return <Eye className={`h-4 w-4 ${color}`} />;
  if (c === "comments") return <MessageCircle className={`h-4 w-4 ${color}`} />;
  return <Play className={`h-4 w-4 ${color}`} />;
}

function qualityLabel(pricePerK: number): "High Quality" | "Standard" | "Premium" {
  if (pricePerK >= 4) return "Premium";
  if (pricePerK >= 2) return "High Quality";
  return "Standard";
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function SMMPage() {
  const [services, setServices] = useState<SMMService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    api.services.smm()
      .then(setServices)
      .catch(() => {/* keep empty, show no-results state */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter((s) => {
    const matchTab =
      activeTab === "All" ||
      s.platform.toLowerCase() === activeTab.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchSearch =
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.platform.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold text-slate-500 tracking-wide">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/smm" className="text-[#4F46E5] underline decoration-2 underline-offset-4">SMM Services</Link>
          <Link href="/otp" className="hover:text-slate-900 transition-colors">OTP Numbers</Link>
          <Link href="/track" className="hover:text-slate-900 transition-colors">Track Order</Link>
          <Link href="/faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
          <Link href="/register" className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            Sign Up
          </Link>
          <Globe className="h-4 w-4 text-slate-400" />
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white border-b border-slate-100 px-6 py-14 text-center space-y-5">
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-[10px] font-bold tracking-wide text-[#4F46E5] uppercase">
          <Zap className="h-3 w-3 fill-[#4F46E5]" />
          <span>Powered by SMMFollowers API</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Social Media Growth, Delivered
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
          Real followers, likes, views and comments across every major platform. Fast delivery, transparent pricing, no password required.
        </p>
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search services — e.g. Instagram followers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
          />
        </div>
      </section>

      {/* PLATFORM FILTER TABS */}
      <div className="bg-white border-b border-slate-100 px-6 lg:px-16">
        <div className="flex items-center space-x-1 overflow-x-auto py-3">
          {platformTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SERVICES GRID */}
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service) => {
              const pricePerK = parseFloat(service.sell_per_1000);
              const quality = qualityLabel(pricePerK);
              return (
                <div
                  key={service.id}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all space-y-4 flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                        {platformIcon(service.platform, service.category)}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 leading-tight">{service.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                          {cap(service.platform)} · {cap(service.category)}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${qualityColor[quality]}`}>
                      {quality}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Per 1K</p>
                      <p className="text-sm font-extrabold text-[#4F46E5] font-mono">${pricePerK.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Min</p>
                      <p className="text-xs font-bold text-slate-800 font-mono">{service.min_quantity.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Max</p>
                      <p className="text-xs font-bold text-slate-800 font-mono">{service.max_quantity.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 pt-1">
                    <BadgeCheck className="h-3.5 w-3.5 text-[#10B981]" />
                    <span>No password required</span>
                    <span className="text-slate-200">·</span>
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                    <span>Guaranteed delivery</span>
                  </div>

                  <Link
                    href={`/checkout/smm/${service.id}`}
                    className="mt-auto flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors"
                  >
                    <span>Order Now</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400">No services found.</p>
            {(searchQuery || activeTab !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
                className="mt-2 text-xs font-bold text-[#4F46E5] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
