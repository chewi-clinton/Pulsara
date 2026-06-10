"use client";

import React, { useState } from "react";
import {
  Clock,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  Wallet2,
} from "lucide-react";

export default function CryptoCheckout() {
  const [selectedNetwork, setSelectedNetwork] = useState<"btc" | "eth" | "usdt" | "ltc">("btc");
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const amountCrypto = "0.02415800";
  const btcAddress = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";

  const networks = [
    { id: "btc", name: "Bitcoin", short: "BTC", logoBg: "bg-[#F7931A]" },
    { id: "eth", name: "Ethereum", short: "ETH (ERC-20)", logoBg: "bg-[#627EEA]" },
    { id: "usdt", name: "Tether", short: "USDT (TRC-20)", logoBg: "bg-[#26A17B]" },
    { id: "ltc", name: "Litecoin", short: "LTC", logoBg: "bg-[#345D9D]" },
  ] as const;

  const handleCopy = async (text: string, type: "amount" | "address") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "amount") {
        setCopiedAmount(true);
        setTimeout(() => setCopiedAmount(false), 2000);
      } else {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy string context:", err);
    }
  };

  return (
    <div className="w-full max-w-5xl rounded-3xl border border-slate-100 bg-white overflow-hidden shadow-2xl font-sans text-slate-900">
      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* LEFT: PAYMENT SUMMARY */}
        <div className="lg:col-span-5 bg-[#EEF2F6]/60 p-8 flex flex-col justify-between min-h-[620px] border-b lg:border-b-0 lg:border-r border-slate-100">
          <div className="space-y-8">

            {/* Brand */}
            <div className="flex items-center space-x-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
                <Wallet2 className="h-4 w-4" />
              </div>
              <h2 className="text-sm font-bold tracking-tight text-[#0F172A]">
                Pulsara Checkout
              </h2>
            </div>

            {/* Amount Due */}
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Amount Due
              </span>
              <p className="text-4xl font-extrabold tracking-tight text-[#0F172A]">$1,499.00</p>
            </div>

            {/* Invoice Rows */}
            <div className="space-y-3.5 border-t border-b border-slate-200/60 py-5 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-800">Enterprise SLA Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-800">NX-8820-XCV</span>
              </div>
            </div>

            {/* Network Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Select Network
                </label>
                <button className="text-xs font-bold text-[#4F46E5] hover:underline">
                  View all
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {networks.map((net) => {
                  const isSelected = selectedNetwork === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedNetwork(net.id)}
                      className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                        isSelected
                          ? "border-[#4F46E5] bg-[#E0E7FF]/40 ring-1 ring-[#4F46E5]"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`h-4 w-4 rounded-full ${net.logoBg}`} />
                        <span className="text-xs font-bold text-slate-900">{net.name}</span>
                      </div>
                      <span className="mt-1 text-[10px] font-semibold text-slate-400">
                        {net.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cancel */}
          <div className="pt-6">
            <button className="inline-flex items-center space-x-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel and return to merchant</span>
            </button>
          </div>
        </div>

        {/* RIGHT: TRANSACTION VIEW */}
        <div className="lg:col-span-7 p-8 flex flex-col justify-between space-y-10">
          <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-slate-900">Pay with Bitcoin</h3>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold font-mono text-slate-500">
                  BTC
                </span>
              </div>
              <div className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold font-mono text-slate-700 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>13:52</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* QR Display */}
            <div className="flex flex-col items-center space-y-4 pt-2">
              <div className="inline-flex items-center space-x-1.5 rounded-full bg-[#FEF3C7] px-4 py-1 text-[10px] font-bold text-[#D97706] uppercase tracking-wide">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#D97706]" />
                <span>Waiting for Payment</span>
              </div>

              <div className="rounded-2xl border border-slate-200 p-3 bg-white shadow-sm max-w-[200px]">
                <div className="aspect-square w-44 rounded-xl bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  <div className="w-28 h-40 bg-white rounded-2xl transform rotate-12 flex flex-col justify-center items-center p-2 shadow-lg">
                    <div className="w-full aspect-square border-2 border-dashed border-slate-300 rounded flex items-center justify-center">
                      <span className="text-[8px] font-mono font-bold text-slate-400 tracking-tighter">
                        QR CONTENT
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Fields */}
            <div className="space-y-4 pt-4">

              {/* Amount */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  <span>Send exactly</span>
                  <span className="italic font-normal lowercase">Includes network fee</span>
                </div>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex items-center justify-between">
                  <span className="text-base font-bold font-mono text-slate-900">{amountCrypto}</span>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold font-mono text-slate-400">BTC</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(amountCrypto, "amount")}
                      className="text-slate-400 hover:text-[#4F46E5] transition-colors"
                      title="Copy Amount"
                    >
                      {copiedAmount ? (
                        <Check className="h-4 w-4 text-[#10B981]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  To Bitcoin Address
                </label>
                <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 flex items-center justify-between">
                  <span className="text-xs font-semibold font-mono text-slate-800 break-all pr-4 line-clamp-1">
                    {btcAddress}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(btcAddress, "address")}
                    className="text-slate-400 hover:text-[#4F46E5] shrink-0 transition-colors"
                    title="Copy Address"
                  >
                    {copiedAddress ? (
                      <Check className="h-4 w-4 text-[#10B981]" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Security Ribbon */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
            <div className="flex items-center space-x-1.5 text-[#10B981]">
              <Lock className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="text-slate-400 normal-case font-medium">
              Powered by <span className="font-bold text-slate-700">Pulsara Pay</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
