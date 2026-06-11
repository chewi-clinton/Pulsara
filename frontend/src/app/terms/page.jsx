"use client";

import React from "react";
import Navbar from "../../components/NavbarDynamic";
import Footer from "../../components/Footer";

const sections = [
  {
    title: "Acceptance",
    content:
      "By accessing or using Pulsara (pulsara.app), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the platform. We reserve the right to update these terms at any time; continued use of the service following any changes constitutes your acceptance of the revised terms.",
  },
  {
    title: "Services",
    content:
      "Pulsara provides automated social media growth services and virtual OTP numbers sourced from third-party providers. We act as an intermediary and do not guarantee specific delivery timelines beyond stated estimates. Service availability may vary by region and provider capacity. We reserve the right to substitute an equivalent service if a specific provider becomes unavailable.",
  },
  {
    title: "Payments & Refunds",
    content:
      "All prices are displayed in your selected currency and payment is required before order fulfillment. We accept cryptocurrency via Cryptomus and card/mobile money via NotchPay. Refunds are not available for completed orders as services are fulfilled instantly and costs are incurred with upstream providers immediately upon payment. If a technical failure prevents delivery entirely, contact support within 24 hours for review.",
  },
  {
    title: "Prohibited Use",
    content:
      "You may not use Pulsara to engage in illegal activity, impersonate others, or violate the terms of service of any third-party platform in ways that go beyond incidental use of our services. You may not attempt to reverse-engineer, scrape, or abuse the platform's APIs. Accounts found engaging in fraudulent transactions, chargebacks without merit, or abuse of refund requests may be permanently banned.",
  },
  {
    title: "Limitation of Liability",
    content:
      "Pulsara is provided on an as-is basis. We are not liable for any indirect, incidental, or consequential damages arising from use of the platform, including but not limited to account actions by third-party social media platforms, failed verifications, or service delays beyond our control. Our maximum liability to any user is limited to the amount paid for the specific order in dispute.",
  },
  {
    title: "Governing Law",
    content:
      "These terms are governed by the laws of Cameroon. Any disputes arising from the use of this platform shall first be attempted to be resolved through our support team. If unresolved, disputes shall be subject to the jurisdiction of the competent courts of Cameroon.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Navbar activePage="" />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-6 py-16 text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 font-medium">Last updated: June 2026</p>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-14 space-y-8">
        {sections.map((s, i) => (
          <div key={i} className="space-y-3">
            <h2 className="text-sm font-extrabold text-[#0F172A]">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
