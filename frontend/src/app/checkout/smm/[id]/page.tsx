"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Link2,
  Minus,
  Plus,
  ShieldCheck,
  Zap,
  CreditCard,
  Bitcoin,
} from "lucide-react";

const serviceMap: Record<string, { name: string; platform: string; category: string; pricePerK: number; min: number; max: number; speed: string }> = {
  s1: { name: "Instagram Real Followers", platform: "Instagram", category: "Followers", pricePerK: 2.50, min: 100, max: 50000, speed: "0–24h" },
  s2: { name: "Instagram Post Likes",     platform: "Instagram", category: "Likes",     pricePerK: 1.20, min: 50,  max: 100000, speed: "Instant" },
  s3: { name: "TikTok Followers",         platform: "TikTok",    category: "Followers", pricePerK: 4.50, min: 100, max: 30000,  speed: "1–48h" },
  s4: { name: "TikTok Video Views",       platform: "TikTok",    category: "Views",     pricePerK: 0.40, min: 1000,max: 1000000,speed: "Instant" },
  s5: { name: "YouTube Views — HQ",       platform: "YouTube",   category: "Views",     pricePerK: 2.40, min: 500, max: 500000, speed: "Gradual" },
  s6: { name: "YouTube Likes",            platform: "YouTube",   category: "Likes",     pricePerK: 3.00, min: 100, max: 50000,  speed: "0–12h" },
  s7: { name: "Twitter Followers",        platform: "Twitter",   category: "Followers", pricePerK: 5.00, min: 100, max: 20000,  speed: "1–72h" },
  s8: { name: "Facebook Page Likes",      platform: "Facebook",  category: "Likes",     pricePerK: 3.50, min: 100, max: 50000,  speed: "0–48h" },
  s9: { name: "Instagram Story Views",    platform: "Instagram", category: "Views",     pricePerK: 0.90, min: 100, max: 200000, speed: "Instant" },
  s10:{ name: "TikTok Comments — Custom", platform: "TikTok",    category: "Comments",  pricePerK: 12.00,min: 10,  max: 5000,   speed: "1–24h" },
};

const paymentMethods = [
  { id: "crypto",      label: "Crypto",      sub: "BTC, ETH, USDT, LTC",  icon: Bitcoin },
  { id: "card",        label: "Card / Mobile Money", sub: "Visa, Mastercard, MTN, Orange", icon: CreditCard },
];

export default function SMMCheckout() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Array.isArray(params.id) ? params.id[0] : params.id ?? "s1";
  const service = serviceMap[serviceId] ?? serviceMap["s1"];

  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState(service.min);
  const [payment, setPayment] = useState("crypto");

  const clamp = (v: number) => Math.min(service.max, Math.max(service.min, v));
  const total = ((quantity / 1000) * service.pricePerK).toFixed(2);

  const step = service.min >= 1000 ? 1000 : service.min >= 100 ? 100 : 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = "PS-" + Math.floor(Math.random() * 90000 + 10000);
    const redirect = encodeURIComponent(`/order/smm/${orderId}`);
    router.push(`/payment?method=${payment}&amount=${total}&redirect=${redirect}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        <Link href="/smm" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Services</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT — Form */}
          <div className="lg:col-span-3 space-y-6">

            {/* Service summary strip */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{service.platform} · {service.category}</p>
                <p className="text-sm font-extrabold text-[#0F172A] mt-0.5">{service.name}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold text-slate-400">Delivery</p>
                <p className="text-xs font-extrabold text-[#4F46E5]">{service.speed}</p>
              </div>
            </div>

            <form id="smm-checkout" onSubmit={handleSubmit} className="space-y-6">

              {/* Target URL */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Target</h2>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 tracking-wide">
                    Profile / Post URL
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Link2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Make sure your profile is set to <span className="font-bold text-slate-600">public</span> before placing the order.
                  </p>
                </div>
              </div>

              {/* Quantity */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Quantity</h2>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => clamp(q - step))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={service.min}
                    max={service.max}
                    step={step}
                    onChange={(e) => setQuantity(clamp(Number(e.target.value)))}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-extrabold text-slate-800 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => clamp(q + step))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Min: {service.min.toLocaleString()}</span>
                  <span>Max: {service.max.toLocaleString()}</span>
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
                  <span>Place Order · ${total}</span>
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
                  <span className="text-slate-400">Service</span>
                  <span className="text-slate-700 text-right max-w-[160px] truncate">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-slate-700">{quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate</span>
                  <span className="text-slate-700">${service.pricePerK} / 1K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery</span>
                  <span className="text-[#4F46E5] font-bold">{service.speed}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-2xl font-extrabold text-[#4F46E5] font-mono">${total}</span>
              </div>

              <button
                type="submit"
                form="smm-checkout"
                className="hidden lg:flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99]"
              >
                <Zap className="h-4 w-4 fill-white" />
                <span>Place Order · ${total}</span>
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Secured · No password required · Instant processing</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
