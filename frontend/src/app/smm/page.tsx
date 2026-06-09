"use client";

import React, { useState } from "react";
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
} from "lucide-react";

interface Service {
  id: string;
  platform: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  pricePerK: string;
  min: string;
  max: string;
  quality: "High Quality" | "Standard" | "Premium";
  speed: string;
}

const platformTabs = ["All", "Instagram", "TikTok", "YouTube", "Twitter", "Facebook"];

const qualityColor = {
  "High Quality": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Standard": "bg-slate-100 text-slate-600 border-slate-200",
  "Premium": "bg-indigo-50 text-[#4F46E5] border-indigo-100",
};

const services: Service[] = [
  {
    id: "s1",
    platform: "Instagram",
    name: "Instagram Real Followers",
    category: "Followers",
    icon: <UserPlus className="h-4 w-4 text-pink-500" />,
    pricePerK: "$2.50",
    min: "100",
    max: "50,000",
    quality: "High Quality",
    speed: "0–24h",
  },
  {
    id: "s2",
    platform: "Instagram",
    name: "Instagram Post Likes",
    category: "Likes",
    icon: <ThumbsUp className="h-4 w-4 text-pink-500" />,
    pricePerK: "$1.20",
    min: "50",
    max: "100,000",
    quality: "Standard",
    speed: "Instant",
  },
  {
    id: "s3",
    platform: "TikTok",
    name: "TikTok Followers",
    category: "Followers",
    icon: <UserPlus className="h-4 w-4 text-slate-800" />,
    pricePerK: "$4.50",
    min: "100",
    max: "30,000",
    quality: "High Quality",
    speed: "1–48h",
  },
  {
    id: "s4",
    platform: "TikTok",
    name: "TikTok Video Views",
    category: "Views",
    icon: <Eye className="h-4 w-4 text-slate-800" />,
    pricePerK: "$0.40",
    min: "1,000",
    max: "1,000,000",
    quality: "Standard",
    speed: "Instant",
  },
  {
    id: "s5",
    platform: "YouTube",
    name: "YouTube Views — HQ",
    category: "Views",
    icon: <Play className="h-4 w-4 text-red-500" />,
    pricePerK: "$2.40",
    min: "500",
    max: "500,000",
    quality: "Premium",
    speed: "Gradual",
  },
  {
    id: "s6",
    platform: "YouTube",
    name: "YouTube Likes",
    category: "Likes",
    icon: <ThumbsUp className="h-4 w-4 text-red-500" />,
    pricePerK: "$3.00",
    min: "100",
    max: "50,000",
    quality: "High Quality",
    speed: "0–12h",
  },
  {
    id: "s7",
    platform: "Twitter",
    name: "Twitter Followers",
    category: "Followers",
    icon: <UserPlus className="h-4 w-4 text-sky-500" />,
    pricePerK: "$5.00",
    min: "100",
    max: "20,000",
    quality: "High Quality",
    speed: "1–72h",
  },
  {
    id: "s8",
    platform: "Facebook",
    name: "Facebook Page Likes",
    category: "Likes",
    icon: <ThumbsUp className="h-4 w-4 text-blue-600" />,
    pricePerK: "$3.50",
    min: "100",
    max: "50,000",
    quality: "Standard",
    speed: "0–48h",
  },
  {
    id: "s9",
    platform: "Instagram",
    name: "Instagram Story Views",
    category: "Views",
    icon: <Eye className="h-4 w-4 text-pink-500" />,
    pricePerK: "$0.90",
    min: "100",
    max: "200,000",
    quality: "Standard",
    speed: "Instant",
  },
  {
    id: "s10",
    platform: "TikTok",
    name: "TikTok Comments — Custom",
    category: "Comments",
    icon: <MessageCircle className="h-4 w-4 text-slate-800" />,
    pricePerK: "$12.00",
    min: "10",
    max: "5,000",
    quality: "Premium",
    speed: "1–24h",
  },
];

export default function SMMPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = services.filter((s) => {
    const matchTab = activeTab === "All" || s.platform === activeTab;
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-[#4F46E5]">Nexora</span>
        <nav className="flex items-center space-x-8 text-xs font-bold text-slate-500 tracking-wide">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <a href="/smm" className="text-[#4F46E5] underline decoration-2 underline-offset-4">SMM Services</a>
          <a href="/otp" className="hover:text-slate-900 transition-colors">OTP Numbers</a>
          <a href="/track" className="hover:text-slate-900 transition-colors">Track Order</a>
          <a href="/faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</button>
          <button className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            Sign Up
          </button>
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
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all space-y-4 flex flex-col"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100">
                      {service.icon}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900 leading-tight">{service.name}</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{service.platform} · {service.category}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase ${qualityColor[service.quality]}`}>
                    {service.quality}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Per 1K</p>
                    <p className="text-sm font-extrabold text-[#4F46E5] font-mono">{service.pricePerK}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Min</p>
                    <p className="text-xs font-bold text-slate-800 font-mono">{service.min}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-2 py-2 space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Speed</p>
                    <p className="text-xs font-bold text-slate-800">{service.speed}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[10px] font-semibold text-slate-400 pt-1">
                  <BadgeCheck className="h-3.5 w-3.5 text-[#10B981]" />
                  <span>No password required</span>
                  <span className="text-slate-200">·</span>
                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span>Guaranteed delivery</span>
                </div>

                <button className="mt-auto flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
                  <span>Order Now</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400">No services match your search.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveTab("All"); }}
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
