"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Code2,
  ShoppingCart,
  FileCode2,
  Globe2,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"social" | "otp">("social");

  const platforms = ["TikTok", "Instagram", "WhatsApp", "Telegram", "Discord"];

  const features = [
    {
      icon: <Zap className="h-5 w-5 text-[#4F46E5]" />,
      title: "Instant Execution",
      description:
        "Orders process automatically upon payment. No waiting, no manual intervention required.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />,
      title: "Private Numbers",
      description:
        "Non-VoIP, dedicated numbers from real mobile carriers ensuring high success rates for verification.",
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-[#4F46E5]" />,
      title: "Real-time Tracking",
      description:
        "Monitor your growth metrics and OTP delivery statuses through our intuitive dashboard.",
    },
    {
      icon: <Code2 className="h-5 w-5 text-[#4F46E5]" />,
      title: "Developer API",
      description:
        "Integrate our services directly into your own applications with our robust, documented REST API.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Select Service",
      description:
        "Choose the platform and specific metric (followers, likes, views) you want to enhance.",
      bgClass: "bg-[#E0E7FF] text-[#4F46E5]",
    },
    {
      number: "2",
      title: "Provide Link",
      description:
        "Enter the target URL. No passwords or account access are ever required.",
      bgClass: "bg-[#E0E7FF] text-[#4F46E5]",
    },
    {
      number: "3",
      title: "Watch it Grow",
      description:
        "Our system immediately begins processing your order with real-time progress updates.",
      bgClass: "bg-[#4F46E5] text-white",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFFFF] font-sans text-slate-900">

      {/* Background SVG Dot Matrix Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#94A3B8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* HERO SECTION */}
        <section className="grid grid-cols-1 gap-12 pt-16 lg:grid-cols-12 lg:pt-24 items-center">

          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 rounded-full bg-[#E0E7FF] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#4F46E5]">
              <Globe2 className="h-3 w-3 stroke-[3]" />
              <span>Premium Infrastructure</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl leading-[1.1]">
              The Infrastructure for <br />
              <span className="text-[#4F46E5]">Digital Growth.</span>
            </h1>

            {/* Description */}
            <p className="text-base text-slate-600 max-w-lg leading-relaxed">
              Purchase social media growth services and instant OTP numbers from one secure
              platform. Designed for professionals who demand scale.
            </p>

            {/* Inline Badges */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#0F172A]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E0E7FF]">
                  <Zap className="h-3 w-3 text-[#4F46E5] fill-[#4F46E5]" />
                </div>
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center space-x-2 text-sm font-semibold text-[#0F172A]">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#CCFBF1]">
                  <Globe2 className="h-3 w-3 text-[#0D9488]" />
                </div>
                <span>Global Coverage</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button className="flex items-center space-x-2 rounded-lg bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]">
                <span>Explore Marketplace</span>
                <ShoppingCart className="h-4 w-4" />
              </button>
              <button className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
                <span>View API Docs</span>
                <FileCode2 className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Column — Visualization Card */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-100 bg-[#F8FAFC]/90 p-6 shadow-xl backdrop-blur-sm min-h-[480px] flex flex-col justify-between">

              {/* Dashboard Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]"></span>
                  <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">
                    Live Global Provisioning
                  </span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="h-2 w-8 rounded-full bg-slate-200"></span>
                  <span className="h-2 w-4 rounded-full bg-slate-200"></span>
                </div>
              </div>

              {/* Map Graphic */}
              <div className="relative flex-1 my-6 rounded-xl bg-white border border-slate-100 shadow-inner flex items-center justify-center overflow-hidden">
                <div className="absolute top-[25%] left-[30%] h-2 w-2 rounded-full bg-[#4F46E5] ring-4 ring-[#4F46E5]/20" />
                <div className="absolute top-[40%] right-[30%] h-2 w-2 rounded-full bg-[#4F46E5] ring-4 ring-[#4F46E5]/20" />
                <div className="absolute bottom-[35%] left-[55%] h-2 w-2 rounded-full bg-[#4F46E5] ring-4 ring-[#4F46E5]/20" />
                <div className="absolute bottom-[20%] right-[20%] h-2 w-2 rounded-full bg-[#4F46E5] ring-4 ring-[#4F46E5]/20" />
                <span className="text-xs text-slate-400 select-none">
                  Global System Monitor Mapping
                </span>
              </div>

              {/* Metrics Panel */}
              <div className="grid grid-cols-3 rounded-xl bg-[#0F172A] p-4 text-white">
                <div className="col-span-2 space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Active Nodes
                  </span>
                  <p className="text-2xl font-bold tracking-tight text-white">1,284</p>
                </div>
                <div className="border-l border-slate-800 pl-4 space-y-1 text-right">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Latency
                  </span>
                  <p className="text-2xl font-bold tracking-tight text-[#10B981]">14ms</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* PLATFORMS TICKER */}
        <section className="py-16 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Trusted For Top Tier Platforms
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="text-xl font-bold tracking-tight text-slate-400 transition-colors hover:text-slate-600 select-none"
              >
                {platform}
              </span>
            ))}
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              Built for Scale and Precision
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our infrastructure handles millions of requests daily, ensuring your growth and
              verification tasks never miss a beat.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start rounded-2xl border border-slate-100 bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F2FE]">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">{feature.title}</h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW NEXORA WORKS */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            How Nexora Works
          </h2>

          {/* Tab Switcher */}
          <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("social")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "social"
                  ? "bg-white text-[#4F46E5] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Social Growth
            </button>
            <button
              onClick={() => setActiveTab("otp")}
              className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                activeTab === "otp"
                  ? "bg-white text-[#4F46E5] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              OTP Verification
            </button>
          </div>

          {/* Steps */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center max-w-sm mx-auto text-center space-y-4"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold shadow-sm ${step.bgClass}`}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-[#0F172A]">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
