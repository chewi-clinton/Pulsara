"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  Phone,
  Radio,
} from "lucide-react";

export default function OTPOrderStatus() {
  const [copied, setCopied] = useState(false);
  const number = "+1 (415) 882-7734";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* MINIMAL NAVBAR */}
      <header className="border-b border-slate-100 bg-white px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</span>
        <Link href="/track" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Track Another Order</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">

        {/* ORDER HEADER */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OTP Order</p>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] font-mono">#OTP-4432</h1>
            </div>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600">
              <Radio className="h-3 w-3 animate-ping" />
              <span>Awaiting SMS</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
            {[
              { label: "Country", value: "United States 🇺🇸" },
              { label: "Service", value: "WhatsApp" },
              { label: "Amount Paid", value: "$0.15" },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-xs font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PROVISIONED NUMBER */}
        <div className="rounded-2xl border border-[#4F46E5]/20 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
            <Phone className="h-4 w-4 text-[#4F46E5]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Provisioned Number</h2>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-slate-200 px-4 py-3">
            <span className="font-mono text-base font-extrabold tracking-wider text-[#0F172A]">{number}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-400 hover:text-[#4F46E5] transition-colors"
              title="Copy number"
            >
              {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
            Enter this number in WhatsApp to receive your verification code. The number will remain active for <span className="font-bold text-slate-700">20 minutes</span>.
          </p>
        </div>

        {/* COUNTDOWN */}
        <div className="rounded-2xl border border-slate-100 bg-[#0F172A] p-6 shadow-sm space-y-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Remaining</p>
          <div className="flex items-center space-x-3">
            <div className="grid grid-cols-4 gap-2 font-mono font-extrabold text-2xl tracking-widest">
              {["1", "8", "4", "2"].map((d, i) => (
                <div key={i} className="flex h-12 w-10 items-center justify-center rounded-xl bg-slate-800 text-white text-xl border border-slate-700">
                  {d}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">min : sec</span>
          </div>
        </div>

        {/* MESSAGE CONSOLE */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Message Console</h2>
            <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-slate-400">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
              <span>Listening</span>
            </span>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 px-5 py-8 text-center space-y-2">
            <Clock className="h-6 w-6 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-400">No messages received yet</p>
            <p className="text-[10px] font-medium text-slate-300">SMS will appear here automatically</p>
          </div>

          <div className="space-y-2">
            {[
              { step: "Number provisioned", done: true },
              { step: "Waiting for SMS from WhatsApp", done: false, active: true },
              { step: "Code extraction complete", done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center space-x-3 text-xs font-semibold">
                {s.done ? (
                  <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                ) : s.active ? (
                  <Radio className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span className={s.done ? "text-slate-900" : s.active ? "text-amber-600" : "text-slate-300"}>
                  {s.step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400">
          Didn&apos;t receive a code?{" "}
          <Link href="/faq" className="font-bold text-[#4F46E5] hover:underline">See troubleshooting tips</Link>
        </p>
      </main>
    </div>
  );
}
