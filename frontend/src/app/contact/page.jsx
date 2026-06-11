"use client";

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Mail, Clock, Hash } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <Navbar activePage="" />

      {/* Hero */}
      <section className="bg-white border-b border-slate-100 px-6 py-20 text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Get in Touch
        </h1>
        <p className="text-sm text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
          Have a question or need help with an order? Our support team is here to help.
        </p>
      </section>

      {/* Contact Info */}
      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6">

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Mail className="h-5 w-5 text-[#4F46E5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Email Support</h3>
            <a
              href="mailto:support@pulsara.app"
              className="text-sm font-semibold text-[#4F46E5] hover:underline"
            >
              support@pulsara.app
            </a>
            <p className="text-xs text-slate-400 font-medium">
              We respond to all enquiries within 24 hours.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <Clock className="h-5 w-5 text-[#4F46E5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-[#0F172A]">Response Time</h3>
            <p className="text-sm font-semibold text-slate-700">Within 24 hours</p>
            <p className="text-xs text-slate-400 font-medium">
              Our team is available seven days a week. Most tickets are resolved same day.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-50 bg-amber-50 p-5 flex items-start space-x-3">
          <Hash className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs font-semibold text-amber-700 leading-relaxed">
            For urgent order issues, please include your <span className="font-extrabold">Order ID</span> in the subject line of your email. This helps us locate your order instantly and resolve the issue faster.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-extrabold text-[#0F172A]">Before Contacting Us</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Many common questions are answered in our{" "}
            <a href="/faq" className="font-bold text-[#4F46E5] hover:underline">FAQ page</a>.
            Check there first — you may find an instant answer without waiting for a reply.
          </p>
        </div>

      </section>

      <Footer />
    </div>
  );
}
