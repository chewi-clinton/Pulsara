"use client";

import React, { useState } from "react";
import { Search, SlidersHorizontal, Radio, AlertTriangle } from "lucide-react";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");

  const tags = ["WhatsApp", "Telegram", "Google"];

  const regions = [
    {
      country: "United States",
      flag: "🇺🇸",
      status: "High Capacity",
      statusType: "success",
      successRate: "98.5%",
      price: "$0.45",
    },
    {
      country: "United Kingdom",
      flag: "🇬🇧",
      status: "High Capacity",
      statusType: "success",
      successRate: "97.2%",
      price: "$0.60",
    },
    {
      country: "India",
      flag: "🇮🇳",
      status: "Moderate Delay",
      statusType: "warning",
      successRate: "92.0%",
      price: "$0.15",
    },
    {
      country: "Brazil",
      flag: "🇧🇷",
      status: "High Capacity",
      statusType: "success",
      successRate: "95.4%",
      price: "$0.25",
    },
  ];

  return (
    <section className="w-full bg-[#FFFFFF] py-16 text-slate-950 font-sans">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            Global Number Marketplace
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Provision high-quality, temporary virtual numbers for seamless verification. <br />
            Search by platform to find instant availability.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mt-8 max-w-2xl mx-auto space-y-4">
          <div className="relative rounded-2xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search platforms (e.g., WhatsApp, Telegram, Tinder)..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
            />
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="rounded-full bg-[#EEF2F6] px-4 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* REGIONS HEADER */}
        <div className="mt-16 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
            Available Regions
          </h2>
          <button className="flex items-center space-x-2 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* REGION CARDS */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                {/* Identity Header */}
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-xl border border-slate-100 shadow-sm select-none">
                    {region.flag}
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold tracking-tight text-[#0F172A]">
                      {region.country}
                    </h3>
                    {region.statusType === "success" ? (
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-[#10B981]">
                        <Radio className="h-3 w-3 stroke-[2.5]" />
                        <span>{region.status}</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-[#D97706]">
                        <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
                        <span>{region.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="mt-6 space-y-3 border-b border-slate-50 pb-5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Success Rate</span>
                    <span className="font-bold text-[#0F172A]">{region.successRate}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">Price per SMS</span>
                    <span className="font-bold text-[#0F172A]">{region.price}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-4">
                <button className="w-full rounded-xl bg-[#F5F3FF] py-2.5 text-xs font-bold text-[#4F46E5] hover:bg-[#EDE9FE] transition-colors">
                  Get Number
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
