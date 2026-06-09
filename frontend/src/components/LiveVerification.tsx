"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Clock,
  Terminal,
  Radio,
  CheckCircle2,
  CircleDot,
  Circle,
  FlaskConical,
} from "lucide-react";

export default function LiveVerification() {
  const [copied, setCopied] = useState(false);
  const orderId = "#NXR-8934-ALX";
  const phoneNumber = "+1 (555) 019-8372";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section className="w-full bg-[#FFFFFF] py-12 text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* TOP STATUS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Order ID
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
                {orderId}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Live Verification
            </h1>
          </div>

          <div className="flex items-center self-start sm:self-auto">
            <div className="inline-flex items-center space-x-2 rounded-full bg-[#FEF3C7] px-4 py-1.5 text-xs font-bold text-[#D97706]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#D97706]" />
              <span>Awaiting Incoming SMS</span>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* LEFT: CONSOLE + NUMBER CARD */}
          <div className="lg:col-span-2 space-y-6">

            {/* Provisioned Number Card */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm gap-6">
              <div className="space-y-2">
                <span className="flex items-center space-x-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  <Terminal className="h-3.5 w-3.5 text-slate-400" />
                  <span>Provisioned Number</span>
                </span>
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl font-mono">
                    {phoneNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-[#4F46E5] transition-colors border border-transparent hover:border-slate-100"
                    title="Copy Number"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-[#10B981]" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Service:{" "}
                  <span className="font-semibold text-slate-700">Telegram</span> • Region:{" "}
                  <span className="font-semibold text-slate-700">USA</span>
                </p>
              </div>

              {/* Countdown */}
              <div className="rounded-xl bg-[#0F172A] px-6 py-4 text-white min-w-[140px] flex flex-col items-center justify-center space-y-1 shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Time Remaining
                </span>
                <div className="flex items-center space-x-2 text-xl font-bold tracking-tight font-mono">
                  <Clock className="h-4 w-4 text-[#F59E0B]" />
                  <span>16:54</span>
                </div>
              </div>
            </div>

            {/* Message Console */}
            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between bg-[#F8FAFC] px-6 py-4 border-b border-slate-100">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 tracking-wide uppercase">
                  <Terminal className="h-4 w-4 text-[#4F46E5]" />
                  <span>Message Console</span>
                </div>
                <div className="flex space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-200"></span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-12 text-center min-h-[260px] space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF2F6] text-[#4F46E5] relative">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#4F46E5]/10" />
                  <Radio className="h-6 w-6 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F172A]">Listening for SMS</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                    Keep this page open. The verification code will appear here instantly once
                    received by the network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: TRANSACTION LOG */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-base font-bold text-[#0F172A] border-b border-slate-100 pb-4">
                Transaction Log
              </h2>

              {/* Stepper */}
              <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-[2px] before:bg-slate-100">

                {/* Step 1 — Complete */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] fill-white" />
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-slate-800">Order Initialized</h4>
                    <p className="font-mono text-[10px] text-slate-400">10:42:15 AM</p>
                  </div>
                </div>

                {/* Step 2 — Complete */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                    <CheckCircle2 className="h-4 w-4 text-[#10B981] fill-white" />
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-slate-800">Carrier Provisioned</h4>
                    <p className="font-mono text-[10px] text-slate-400">10:42:18 AM</p>
                  </div>
                </div>

                {/* Step 3 — Active */}
                <div className="relative">
                  <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                    <CircleDot className="h-4 w-4 text-[#4F46E5] fill-white" />
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-[#4F46E5]">Awaiting Payload</h4>
                    <p className="font-mono text-[10px] text-slate-400 animate-pulse">
                      Listening...
                    </p>
                  </div>
                </div>

                {/* Step 4 — Pending */}
                <div className="relative opacity-40">
                  <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                    <Circle className="h-4 w-4 text-slate-300 fill-white" />
                  </span>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-slate-700">Verification Complete</h4>
                    <p className="font-mono text-[10px] text-slate-400">--:--:--</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulator Utility */}
            <div className="pt-6 border-t border-slate-50 flex justify-end">
              <button className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Simulate Inbound SMS</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
