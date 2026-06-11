"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const sections = [
  {
    id: "collect",
    title: "Information We Collect",
    content:
      "When you place an order we collect your email address (if provided), the target URL or platform you are ordering for, and payment transaction references. We do not collect passwords, government IDs, or any sensitive personal data. IP addresses and basic browser information are logged for security and fraud prevention purposes.",
  },
  {
    id: "use",
    title: "How We Use It",
    content:
      "Your information is used solely to process and fulfill your order, send order status updates if you provided an email, and detect fraudulent activity. We do not sell, rent, or share your personal information with third parties except as required to process your payment (via Cryptomus or NotchPay) or comply with legal obligations.",
  },
  {
    id: "retention",
    title: "Data Retention",
    content:
      "Order records are retained for a minimum of 90 days to allow for dispute resolution and support enquiries. Email addresses are retained for up to 12 months unless you request deletion. You may request deletion of your data at any time by emailing support@pulsara.app.",
  },
  {
    id: "cookies",
    title: "Cookies",
    content:
      "We use a single localStorage key to remember your preferred display currency (FCFA or USD). No tracking cookies, advertising pixels, or third-party analytics scripts are used on this platform. Your browser preferences are respected and no persistent identifiers are stored without your knowledge.",
  },
  {
    id: "third-party",
    title: "Third-Party Services",
    content:
      "Payments are processed by Cryptomus and NotchPay, each operating under their own privacy policies. Our SMM services are fulfilled via SMMFollowers, and OTP services are fulfilled via verified virtual number providers. These services receive only the minimum data required to deliver your order.",
  },
  {
    id: "contact",
    title: "Contact",
    content:
      "For any privacy-related requests including data access, correction, or deletion, contact us at support@pulsara.app. We will respond within 5 business days.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Navbar activePage="" />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-6 py-16 text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-medium">Last updated: June 2026</p>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 py-14 space-y-8">
        {sections.map((s) => (
          <div key={s.id} id={s.id} className="space-y-3">
            <h2 className="text-sm font-extrabold text-[#0F172A]">{s.title}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{s.content}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
