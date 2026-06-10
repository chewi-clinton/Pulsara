"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  BarChart3,
  Users2,
  CreditCard,
  Plus,
  HelpCircle,
  LogOut,
  RefreshCw,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Radio,
  AlertTriangle,
} from "lucide-react";

interface OTPService {
  id: string;
  country: string;
  flag: string;
  apps: string[];
  provider: "SMSPool" | "5sim";
  price: string;
  availability: "High" | "Medium" | "Low";
  status: "Active" | "Inactive";
}

const services: OTPService[] = [
  { id: "o1", country: "United States", flag: "🇺🇸", apps: ["WhatsApp", "Telegram", "Google"], provider: "SMSPool", price: "$0.15", availability: "High", status: "Active" },
  { id: "o2", country: "United Kingdom", flag: "🇬🇧", apps: ["WhatsApp", "Telegram"], provider: "SMSPool", price: "$0.18", availability: "High", status: "Active" },
  { id: "o3", country: "India", flag: "🇮🇳", apps: ["WhatsApp", "Google"], provider: "5sim", price: "$0.08", availability: "Medium", status: "Active" },
  { id: "o4", country: "Russia", flag: "🇷🇺", apps: ["Telegram", "WhatsApp"], provider: "5sim", price: "$0.06", availability: "High", status: "Active" },
  { id: "o5", country: "Brazil", flag: "🇧🇷", apps: ["WhatsApp", "Instagram"], provider: "SMSPool", price: "$0.10", availability: "Medium", status: "Active" },
  { id: "o6", country: "Germany", flag: "🇩🇪", apps: ["WhatsApp", "Telegram"], provider: "SMSPool", price: "$0.20", availability: "High", status: "Active" },
  { id: "o7", country: "France", flag: "🇫🇷", apps: ["WhatsApp", "Telegram"], provider: "5sim", price: "$0.18", availability: "Low", status: "Inactive" },
  { id: "o8", country: "Nigeria", flag: "🇳🇬", apps: ["WhatsApp", "Facebook"], provider: "SMSPool", price: "$0.09", availability: "Medium", status: "Active" },
];

const availabilityStyles = {
  High: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Medium: "bg-amber-50 text-amber-600 border-amber-100",
  Low: "bg-rose-50 text-rose-500 border-rose-100",
};

export default function AdminOTPServices() {
  const [activeTab, setActiveTab] = useState("Marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncing, setSyncing] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Marketplace", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Orders", icon: <Receipt className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Customers", icon: <Users2 className="h-4 w-4" /> },
    { name: "Payouts", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const filtered = services.filter(
    (s) => s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between border-r border-slate-100 bg-white p-5">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">N</div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Pulsara Admin</h2>
              <p className="text-[10px] font-medium text-slate-400">Enterprise Tier</p>
            </div>
          </div>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                    isActive ? "bg-[#EEF2F6] text-[#4F46E5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="space-y-4">
          <button className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>New Service</span>
          </button>
          <hr className="border-slate-100" />
          <div className="space-y-1">
            <button className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </button>
            <button className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 pl-64">
        <main className="p-8 space-y-6 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">OTP Services</h1>
              <p className="text-xs text-slate-400 font-medium">Manage virtual number availability across SMSPool and 5sim providers.</p>
            </div>
            <div className="flex items-center space-x-3 self-start sm:self-auto">
              <div className="flex items-center space-x-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600">
                <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                <span>SMSPool: Online</span>
              </div>
              <div className="flex items-center space-x-2 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-[10px] font-bold text-slate-600">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                <span>5sim: Degraded</span>
              </div>
              <button
                onClick={handleSync}
                className="inline-flex items-center space-x-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors"
              >
                <RefreshCw className={`h-3.5 w-3.5 stroke-[2.5] ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing..." : "Sync Providers"}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center gap-3 bg-white">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-5">Country</th>
                    <th className="py-3 px-5">Supported Apps</th>
                    <th className="py-3 px-5">Provider</th>
                    <th className="py-3 px-5">Price</th>
                    <th className="py-3 px-5 text-center">Availability</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  {filtered.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2.5">
                          <span className="text-xl leading-none">{svc.flag}</span>
                          <span className="font-bold text-slate-900">{svc.country}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-wrap gap-1">
                          {svc.apps.map((app) => (
                            <span key={app} className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                              {app}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          svc.provider === "SMSPool"
                            ? "bg-indigo-50 text-[#4F46E5] border border-indigo-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {svc.provider}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-mono font-extrabold text-[#4F46E5]">{svc.price}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${availabilityStyles[svc.availability]}`}>
                          {svc.availability}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          svc.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {svc.status === "Active" ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>{svc.status}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-50 bg-white text-xs font-semibold text-slate-400">
              Showing <span className="text-slate-800 font-bold">{filtered.length}</span> of{" "}
              <span className="text-slate-800 font-bold">{services.length}</span> services
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
