"use client";

import React from "react";
import Navbar from "../../components/NavbarDynamic";
import Footer from "../../components/Footer";
import { Zap, ShieldCheck, BarChart3 } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      Icon: Zap,
      title: "Instant Delivery",
      description:
        "From social media growth to virtual numbers, every service is processed automatically the moment payment is confirmed — no waiting, no manual handling.",
    },
    {
      Icon: ShieldCheck,
      title: "Privacy First",
      description:
        "We never ask for your social media passwords or personal information. OTP numbers are provisioned anonymously from real carrier lines worldwide.",
    },
    {
      Icon: BarChart3,
      title: "Transparent Pricing",
      description:
        "No hidden fees, no subscriptions. Every service is priced clearly upfront in your preferred currency. What you see is exactly what you pay.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Navbar activePage="" />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-6 py-20 text-center space-y-5">
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-[10px] font-bold tracking-wide text-[#4F46E5] uppercase">
          <span>About Pulsara</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A] max-w-2xl mx-auto">
          A Digital Growth Platform Built for Everyone
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
          Pulsara gives individuals and businesses instant access to social media growth services and virtual OTP numbers — all from one simple, anonymous, and affordable platform.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16 space-y-6">
        <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A]">Our Mission</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          We believe that powerful digital infrastructure should not be reserved for large enterprises. Pulsara was built to make instant, anonymous, and affordable digital services accessible to everyone — whether you are a creator growing your presence, a developer testing integrations, or a business verifying accounts at scale.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Our platform connects directly to verified providers and processes every order automatically. There are no intermediaries, no delays, and no unnecessary complexity. Just results.
        </p>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-xl font-extrabold tracking-tight text-[#0F172A] mb-8">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0F2FE]">
                <v.Icon className="h-5 w-5 text-[#4F46E5]" />
              </div>
              <h3 className="text-sm font-extrabold text-[#0F172A]">{v.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
