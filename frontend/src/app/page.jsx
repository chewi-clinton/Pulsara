"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "../components/Footer";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  ShoppingCart,
  Globe2,
  Globe,
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("social");

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
  ];

  const socialSteps = [
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

  const otpSteps = [
    {
      number: "1",
      title: "Pick a Country & App",
      description:
        "Select the country and the platform you need to verify — WhatsApp, Telegram, Google, and more.",
      bgClass: "bg-[#E0E7FF] text-[#4F46E5]",
    },
    {
      number: "2",
      title: "Get Your Number",
      description:
        "A real, non-VoIP virtual number is provisioned instantly. No SIM card or personal info required.",
      bgClass: "bg-[#E0E7FF] text-[#4F46E5]",
    },
    {
      number: "3",
      title: "Receive the Code",
      description:
        "Enter the number in the target app and watch the verification code appear in your dashboard in seconds.",
      bgClass: "bg-[#4F46E5] text-white",
    },
  ];

  const activeSteps = activeTab === "social" ? socialSteps : otpSteps;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFFFFF] font-sans text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</span>
        <nav className="flex items-center space-x-8 text-xs font-bold text-slate-500 tracking-wide">
          <Link href="/" className="text-[#4F46E5] underline decoration-2 underline-offset-4">Home</Link>
          <Link href="/smm" className="hover:text-slate-900 transition-colors">SMM Services</Link>
          <Link href="/otp" className="hover:text-slate-900 transition-colors">OTP Numbers</Link>
          <Link href="/track" className="hover:text-slate-900 transition-colors">Track Order</Link>
          <Link href="/faq" className="hover:text-slate-900 transition-colors">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
          <Link href="/smm" className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            Get Started
          </Link>
          <Globe className="h-4 w-4 text-slate-400" />
        </div>
      </header>

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
              <Link href="/smm" className="flex items-center space-x-2 rounded-lg bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4338CA]">
                <span>Explore Marketplace</span>
                <ShoppingCart className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right Column — Hero Image */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <Image
              src="/socials.png"
              alt="Pulsara platform preview"
              width={600}
              height={420}
              className="w-full max-w-lg h-auto object-contain"
              priority
            />
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

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* HOW PULSARA WORKS */}
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">
            How Pulsara Works
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
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
            {activeSteps.map((step, idx) => (
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
      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
