"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import Navbar from "../../components/NavbarDynamic";
import { useCurrency } from "../../lib/currency";
import {
  Search,
  Radio,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import { api } from "../../lib/api";

const appFilters = ["All", "WhatsApp", "Telegram", "Google", "Facebook", "Instagram", "Tinder"];

// country_code → flag emoji
const FLAGS = {
  US: "🇺🇸", GB: "🇬🇧", IN: "🇮🇳", RU: "🇷🇺", BR: "🇧🇷",
  DE: "🇩🇪", FR: "🇫🇷", CA: "🇨🇦", ID: "🇮🇩", NG: "🇳🇬",
  PK: "🇵🇰", PH: "🇵🇭", MX: "🇲🇽", AU: "🇦🇺", JP: "🇯🇵",
  KR: "🇰🇷", TH: "🇹🇭", VN: "🇻🇳", EG: "🇪🇬", ZA: "🇿🇦",
};

function groupByCountry(services) {
  const map = new Map();
  for (const svc of services) {
    const key = svc.country_code;
    if (!map.has(key)) {
      map.set(key, {
        country_code: svc.country_code,
        country_name: svc.country_name,
        flag: FLAGS[svc.country_code] ?? "🌐",
        apps: [],
        provider: svc.platform,
        min_price: parseFloat(svc.sell_price),
        services: [],
      });
    }
    const g = map.get(key);
    const appName = svc.platform.charAt(0).toUpperCase() + svc.platform.slice(1);
    if (!g.apps.includes(appName)) g.apps.push(appName);
    const price = parseFloat(svc.sell_price);
    if (price < g.min_price) g.min_price = price;
    g.services.push(svc);
  }
  return Array.from(map.values());
}

export default function OTPPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeApp, setActiveApp] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { format } = useCurrency();

  useEffect(() => {
    api.services.otp()
      .then((data) => setGroups(groupByCountry(data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = groups.filter((g) => {
    const matchApp =
      activeApp === "All" ||
      g.apps.some((a) => a.toLowerCase() === activeApp.toLowerCase());
    const q = searchQuery.toLowerCase();
    const matchSearch =
      g.country_name.toLowerCase().includes(q) ||
      g.apps.some((a) => a.toLowerCase().includes(q));
    return matchApp && matchSearch;
  });

  function statusFor(g) {
    if (g.services.length <= 1) return "Limited";
    if (g.services.length <= 2) return "High Demand";
    return "Available";
  }

  const statusStyles = {
    Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "High Demand": "bg-amber-50 text-amber-600 border-amber-100",
    Limited: "bg-rose-50 text-rose-500 border-rose-100",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <Navbar activePage="otp" />

      {/* HERO */}
      <section className="bg-white border-b border-slate-100 px-6 py-14 text-center space-y-5">
        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-50 border border-indigo-100 px-4 py-1.5 text-[10px] font-bold tracking-wide text-[#4F46E5] uppercase">
          <Zap className="h-3 w-3 fill-[#4F46E5]" />
          <span>Real Numbers · Instant Delivery</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
          Virtual OTP Numbers
        </h1>
        <p className="text-xs md:text-sm text-slate-400 font-medium max-w-xl mx-auto leading-relaxed">
          Receive verification codes from WhatsApp, Telegram, Google and more. Numbers provisioned in seconds from real carrier lines worldwide.
        </p>
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by country or app — e.g. Nigeria, WhatsApp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
          />
        </div>
      </section>

      {/* APP FILTER */}
      <div className="bg-white border-b border-slate-100 px-6 lg:px-16">
        <div className="flex items-center space-x-1 overflow-x-auto py-3">
          {appFilters.map((app) => (
            <button
              key={app}
              onClick={() => setActiveApp(app)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeApp === app
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {app}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <main className="max-w-7xl mx-auto px-6 lg:px-16 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((g) => {
              const st = statusFor(g);
              return (
                <div
                  key={g.country_code}
                  className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all space-y-4 flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl leading-none">{g.flag}</span>
                      <div>
                        <p className="text-xs font-extrabold text-slate-900 leading-tight">{g.country_name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5">via {g.provider.toUpperCase()}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center space-x-1 rounded-md border px-2 py-0.5 text-[9px] font-bold shrink-0 ${statusStyles[st]}`}>
                      {st === "Available"
                        ? <Radio className="h-3 w-3 text-emerald-500" />
                        : <AlertTriangle className="h-3 w-3" />}
                      <span>{st}</span>
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {g.apps.slice(0, 5).map((app) => (
                      <span
                        key={app}
                        className="rounded-lg bg-slate-50 border border-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600"
                      >
                        {app}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">From</p>
                      <p className="text-lg font-extrabold text-[#4F46E5] font-mono">{format(g.min_price)}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] font-semibold text-slate-400">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
                      <span>Anonymous</span>
                    </div>
                  </div>

                  <Link
                    href={`/checkout/otp/${g.country_code}`}
                    className="mt-auto flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors"
                  >
                    <span>Get Number</span>
                    <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <p className="text-xs font-bold text-slate-400">No numbers found.</p>
            {(searchQuery || activeApp !== "All") && (
              <button
                onClick={() => { setSearchQuery(""); setActiveApp("All"); }}
                className="mt-2 text-xs font-bold text-[#4F46E5] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
