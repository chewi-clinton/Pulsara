"use client";

import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";

const steps = [
  { label: "Payment Confirmed", time: "14:32:01", done: true },
  { label: "Order Submitted to Provider", time: "14:32:08", done: true },
  { label: "Delivery In Progress", time: "Est. 24h", done: false, active: true },
  { label: "Order Completed", time: "Pending", done: false },
];

export default function SMMOrderStatus() {
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

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">

        {/* ORDER HEADER */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SMM Order</p>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] font-mono">#ORD-2024-8921</h1>
            </div>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-[10px] font-bold text-amber-600">
              <Clock className="h-3 w-3" />
              <span>In Progress</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-50 pt-4">
            {[
              { label: "Service", value: "Instagram Followers" },
              { label: "Quantity", value: "10,000" },
              { label: "Amount Paid", value: "$25.00" },
              { label: "Placed On", value: "Oct 24, 14:32" },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-xs font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SERVICE DETAILS */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
            <ThumbsUp className="h-4 w-4 text-[#4F46E5]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Service Details</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Platform</span>
              <span className="font-bold text-slate-900">Instagram</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Category</span>
              <span className="font-bold text-slate-900">Real Followers — HQ</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-semibold">Target URL</span>
              <span className="font-bold text-[#4F46E5] inline-flex items-center space-x-1">
                <span>instagram.com/user</span>
                <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Start Count</span>
              <span className="font-bold font-mono text-slate-900">2,481</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Delivered So Far</span>
              <span className="font-bold font-mono text-[#10B981]">3,720</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>Delivery Progress</span>
              <span className="text-[#4F46E5]">37%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[37%] rounded-full bg-[#4F46E5] transition-all" />
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-50 pb-3">
            Order Timeline
          </h2>
          <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-[2px] before:bg-slate-100">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 text-[#4F46E5]" />
                  ) : step.active ? (
                    <Clock className="h-4 w-4 text-amber-400 animate-spin [animation-duration:6s]" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-slate-200" />
                  )}
                </span>
                <div className="space-y-0.5 text-xs">
                  <span className="font-mono text-[10px] text-slate-400">{step.time}</span>
                  <p className={`font-bold ${step.done ? "text-slate-900" : step.active ? "text-amber-600" : "text-slate-300"}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400">
          Need help?{" "}
          <Link href="/faq" className="font-bold text-[#4F46E5] hover:underline">Visit our FAQ</Link>{" "}
          or contact support.
        </p>
      </main>
    </div>
  );
}
