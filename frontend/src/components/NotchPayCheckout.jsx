"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building2,
  User,
  Lock,
  HelpCircle,
  ShieldCheck,
} from "lucide-react";

export default function NotchPayCheckout() {
  const [activeTab, setActiveTab] = useState("card");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const totalAmount = "1,249.00";
  const orderId = "#NX-8924A";

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-2xl font-sans text-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* LEFT: SUMMARY */}
        <div className="lg:col-span-5 bg-[#EEF2F6]/60 p-8 flex flex-col justify-between min-h-[580px] border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="space-y-8">

            {/* Brand */}
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F46E5] text-white shadow-sm">
                <CreditCard className="h-4 w-4" />
              </div>
              <h2 className="text-base font-bold tracking-tight text-[#0F172A]">Pulsara</h2>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Total to pay
              </span>
              <p className="text-4xl font-extrabold tracking-tight text-[#0F172A]">
                <span className="text-2xl font-bold mr-1 text-slate-600">$</span>
                {totalAmount}
              </p>
            </div>

            {/* Invoice Rows */}
            <div className="space-y-4 border-t border-slate-200/60 pt-6 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-800">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan</span>
                <span className="font-bold text-slate-800">Enterprise Annual</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800">admin@acmecorp.com</span>
              </div>
            </div>
          </div>

          {/* Compliance Badge */}
          <div className="pt-6 flex items-start space-x-3 text-[10px] font-bold tracking-wide text-slate-400 uppercase">
            <Lock className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
            <div className="space-y-0.5 normal-case font-medium">
              <p className="text-slate-500 font-semibold uppercase text-[9px] tracking-wider">
                256-bit SSL Encryption.
              </p>
              <p className="text-slate-400">PCI-DSS Level 1 Compliant.</p>
            </div>
          </div>
        </div>

        {/* RIGHT: PAYMENT FORM */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-10">
          <div className="space-y-6">

            {/* Tab Switcher */}
            <div className="flex items-center space-x-6 border-b border-slate-100 pb-px text-xs font-bold tracking-wide text-slate-500">
              {[
                { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
                { id: "momo", label: "Mobile Money", icon: <Smartphone className="h-4 w-4" /> },
                { id: "bank", label: "Bank Transfer", icon: <Building2 className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 pb-3 transition-all border-b-2 ${
                    activeTab === tab.id
                      ? "border-[#4F46E5] text-[#4F46E5]"
                      : "border-transparent hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Card Form */}
            {activeTab === "card" && (
              <div className="space-y-4 pt-2">

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 tracking-wide">
                    Cardholder Name
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 tracking-wide">
                    Card Number
                  </label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-14 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors font-mono"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-500 border border-slate-200 uppercase">
                        Visa
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 tracking-wide">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 tracking-wide">
                      CVV
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <input
                        type="password"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors font-mono"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <HelpCircle className="h-4 w-4 text-slate-300 hover:text-slate-400 cursor-help" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Mobile Money */}
            {activeTab === "momo" && (
              <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Smartphone className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Mobile Money Carrier Integration Ready
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports MTN MoMo & Orange Money processing.
                </p>
              </div>
            )}

            {/* Bank Transfer */}
            {activeTab === "bank" && (
              <div className="py-8 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <Building2 className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Direct Financial Wire Gateway Active
                </p>
                <p className="text-[10px] text-slate-400">
                  Generates instant unique transit routing tokens.
                </p>
              </div>
            )}

          </div>

          {/* Submit */}
          <div className="space-y-4">
            <button
              type="button"
              className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all hover:shadow-lg active:scale-[0.99]"
            >
              <Lock className="h-4 w-4 stroke-[2.5]" />
              <span>Pay ${totalAmount}</span>
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-[10px] font-bold text-slate-400 tracking-wide">
              <span>Secured by</span>
              <div className="flex items-center space-x-0.5 text-slate-800">
                <ShieldCheck className="h-3.5 w-3.5 text-[#4F46E5]" />
                <span className="font-extrabold tracking-tight">NotchPay</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
