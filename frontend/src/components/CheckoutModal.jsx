"use client";

import React, { useState } from "react";
import {
  X,
  Link2,
  Mail,
  Lock,
  Zap,
  ArrowRight,
  Bitcoin,
  CreditCard,
  BadgeCheck,
} from "lucide-react";

export default function CheckoutModal() {
  const [profileUrl, setProfileUrl] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState("cryptomus");

  const ratePer1k = 2.5;
  const calculatedTotal = ((quantity / 1000) * ratePer1k).toFixed(2);

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-2xl font-sans text-slate-900">
      <div className="grid grid-cols-1 md:grid-cols-12">

        {/* LEFT: CONFIGURATION FORM */}
        <div className="md:col-span-7 p-8 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
                Premium Followers
              </h2>
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                <BadgeCheck className="h-4 w-4 text-[#4F46E5] fill-white" />
                <span>High Quality</span>
                <span className="text-slate-300">•</span>
                <span>Fast Delivery</span>
              </div>
            </div>
            <button className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Target Profile URL */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Target Profile URL
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Link2 className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="url"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Email Address (For Receipt)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
              />
            </div>
          </div>

          {/* Quantity Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quantity
              </label>
              <span className="rounded bg-[#EEF2F6] px-2.5 py-1 text-xs font-bold font-mono text-[#4F46E5]">
                {quantity.toLocaleString()}
              </span>
            </div>
            <div className="relative w-full">
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-[#4F46E5] transition-all"
              />
              <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-400 font-mono">
                <span>MIN: 100</span>
                <span>MAX: 10K</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("cryptomus")}
                className={`flex items-center justify-center space-x-2 rounded-xl border py-3 text-xs font-bold transition-all ${
                  paymentMethod === "cryptomus"
                    ? "border-[#4F46E5] bg-[#F5F3FF] text-slate-900 ring-1 ring-[#4F46E5]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Bitcoin className="h-4 w-4 stroke-[2.5]" />
                <span>CryptoMus</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("notchpay")}
                className={`flex items-center justify-center space-x-2 rounded-xl border py-3 text-xs font-bold transition-all ${
                  paymentMethod === "notchpay"
                    ? "border-[#4F46E5] bg-[#F5F3FF] text-slate-900 ring-1 ring-[#4F46E5]"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <CreditCard className="h-4 w-4 stroke-[2.5]" />
                <span>NotchPay</span>
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="md:col-span-5 bg-[#F8FAFC] border-t md:border-t-0 md:border-l border-slate-100 p-8 flex flex-col justify-between space-y-12">

          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Order Summary
            </h3>

            <div className="space-y-3.5 border-b border-slate-200/60 pb-6 text-sm font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-800">IG Followers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rate per 1k</span>
                <span className="font-bold text-slate-800">$2.50</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity</span>
                <span className="font-bold text-slate-800">{quantity.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-2">
              <span className="text-base font-bold text-slate-900">Total</span>
              <span className="text-5xl font-extrabold tracking-tight text-[#4F46E5] font-mono">
                ${calculatedTotal}
              </span>
            </div>
          </div>

          {/* Security Seals + CTA */}
          <div className="space-y-4">
            <div className="space-y-2 text-xs font-semibold">
              <div className="flex items-center space-x-2 text-slate-600">
                <Lock className="h-4 w-4 text-[#10B981] stroke-[2.5]" />
                <span>Secure Encrypted Payment</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Zap className="h-4 w-4 text-[#4F46E5] fill-[#4F46E5]" />
                <span>Instant Processing</span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all hover:shadow-lg active:scale-[0.99]"
            >
              <span>Proceed to Payment</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
