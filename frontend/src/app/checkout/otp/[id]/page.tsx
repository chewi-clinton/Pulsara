"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  CreditCard,
  Bitcoin,
  Phone,
  Radio,
  AlertTriangle,
} from "lucide-react";

const serviceMap: Record<string, { country: string; flag: string; apps: string[]; provider: string; price: number; status: "Available" | "High Demand" | "Limited" }> = {
  o1:  { country: "United States",  flag: "🇺🇸", apps: ["WhatsApp", "Telegram", "Google", "Facebook"], provider: "SMSPool", price: 0.15, status: "Available" },
  o2:  { country: "United Kingdom", flag: "🇬🇧", apps: ["WhatsApp", "Telegram", "Instagram"],           provider: "SMSPool", price: 0.18, status: "Available" },
  o3:  { country: "India",          flag: "🇮🇳", apps: ["WhatsApp", "Telegram", "Google"],              provider: "5sim",    price: 0.08, status: "High Demand" },
  o4:  { country: "Russia",         flag: "🇷🇺", apps: ["Telegram", "WhatsApp", "Tinder"],              provider: "5sim",    price: 0.06, status: "Available" },
  o5:  { country: "Brazil",         flag: "🇧🇷", apps: ["WhatsApp", "Instagram", "Facebook"],           provider: "SMSPool", price: 0.10, status: "High Demand" },
  o6:  { country: "Germany",        flag: "🇩🇪", apps: ["WhatsApp", "Telegram", "Google"],              provider: "SMSPool", price: 0.20, status: "Available" },
  o7:  { country: "France",         flag: "🇫🇷", apps: ["WhatsApp", "Telegram", "Instagram"],           provider: "5sim",    price: 0.18, status: "Limited" },
  o8:  { country: "Canada",         flag: "🇨🇦", apps: ["WhatsApp", "Google", "Facebook", "Tinder"],   provider: "SMSPool", price: 0.16, status: "Available" },
  o9:  { country: "Indonesia",      flag: "🇮🇩", apps: ["WhatsApp", "Telegram"],                        provider: "5sim",    price: 0.07, status: "Available" },
  o10: { country: "Nigeria",        flag: "🇳🇬", apps: ["WhatsApp", "Telegram", "Facebook"],            provider: "SMSPool", price: 0.09, status: "High Demand" },
  o11: { country: "Pakistan",       flag: "🇵🇰", apps: ["WhatsApp", "Telegram"],                        provider: "5sim",    price: 0.07, status: "Limited" },
  o12: { country: "Philippines",    flag: "🇵🇭", apps: ["WhatsApp", "Facebook", "Instagram"],           provider: "SMSPool", price: 0.10, status: "Available" },
};

const statusStyles = {
  Available:    { badge: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: <Radio className="h-3 w-3 text-emerald-500" /> },
  "High Demand":{ badge: "bg-amber-50 text-amber-600 border-amber-100",       icon: <AlertTriangle className="h-3 w-3 text-amber-500" /> },
  Limited:      { badge: "bg-rose-50 text-rose-500 border-rose-100",           icon: <AlertTriangle className="h-3 w-3 text-rose-400" /> },
};

const paymentMethods = [
  { id: "crypto", label: "Crypto",             sub: "BTC, ETH, USDT, LTC",           icon: Bitcoin },
  { id: "card",   label: "Card / Mobile Money", sub: "Visa, Mastercard, MTN, Orange", icon: CreditCard },
];

export default function OTPCheckout() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id ?? "o1";
  const svc = serviceMap[serviceId] ?? serviceMap["o1"];

  const [selectedApp, setSelectedApp] = useState(svc.apps[0]);
  const [payment, setPayment] = useState("crypto");

  const statusStyle = statusStyles[svc.status];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = "PS-OTP-" + Math.floor(Math.random() * 90000 + 10000);
    const redirect = encodeURIComponent(`/order/otp/${orderId}`);
    router.push(`/payment?method=${payment}&amount=${svc.price.toFixed(2)}&redirect=${redirect}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        <Link href="/otp" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Numbers</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT — Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Number summary strip */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl leading-none">{svc.flag}</span>
                <div>
                  <p className="text-sm font-extrabold text-[#0F172A]">{svc.country}</p>
                  <p className="text-[10px] font-semibold text-slate-400">via {svc.provider}</p>
                </div>
              </div>
              <span className={`inline-flex items-center space-x-1 rounded-md border px-2 py-0.5 text-[9px] font-bold ${statusStyle.badge}`}>
                {statusStyle.icon}
                <span>{svc.status}</span>
              </span>
            </div>

            <form id="otp-checkout" onSubmit={handleSubmit} className="space-y-6">

              {/* App Selection */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0F172A]">Select App</h2>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Choose which app you need to verify with this number.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {svc.apps.map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        selectedApp === app
                          ? "bg-[#4F46E5] text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info strip */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-start space-x-3">
                <Phone className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-[11px] font-semibold text-emerald-700 space-y-0.5">
                  <p>A real {svc.country} number will be provisioned instantly after payment.</p>
                  <p className="font-medium text-emerald-600">The number remains active for 15–20 minutes to receive your code.</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPayment(m.id)}
                        className={`flex items-center space-x-3 rounded-xl border p-4 text-left transition-all ${
                          payment === m.id
                            ? "border-[#4F46E5] bg-indigo-50 shadow-sm"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`h-5 w-5 shrink-0 ${payment === m.id ? "text-[#4F46E5]" : "text-slate-400"}`} />
                        <div>
                          <p className={`text-xs font-extrabold ${payment === m.id ? "text-[#4F46E5]" : "text-slate-700"}`}>{m.label}</p>
                          <p className="text-[10px] font-medium text-slate-400">{m.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile submit */}
              <div className="lg:hidden">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99]"
                >
                  <Zap className="h-4 w-4 fill-white" />
                  <span>Get Number · ${svc.price.toFixed(2)}</span>
                </button>
              </div>

            </form>
          </div>

          {/* RIGHT — Order summary */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A]">Order Summary</h2>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Country</span>
                  <span className="text-slate-700">{svc.flag} {svc.country}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">App</span>
                  <span className="text-slate-700">{selectedApp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provider</span>
                  <span className="text-slate-700">{svc.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Window</span>
                  <span className="text-[#4F46E5] font-bold">15–20 min</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-2xl font-extrabold text-[#4F46E5] font-mono">${svc.price.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                form="otp-checkout"
                className="hidden lg:flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99]"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>Get Number · ${svc.price.toFixed(2)}</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>100% anonymous · Real carrier numbers · Instant</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
