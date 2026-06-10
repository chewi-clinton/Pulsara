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
  ThumbsUp,
  UserPlus,
  Eye,
  Play,
} from "lucide-react";

const services = [
  { id: "s1", providerServiceId: "45229", name: "Instagram Real Followers — Global HQ", category: "Followers", platform: "Instagram", icon: <UserPlus className="h-3.5 w-3.5 text-pink-500" />, ratePerK: "$2.50", minOrder: "100", maxOrder: "50,000", status: "Active" },
  { id: "s2", providerServiceId: "45301", name: "Instagram Post Likes — Fast Delivery", category: "Likes", platform: "Instagram", icon: <ThumbsUp className="h-3.5 w-3.5 text-pink-500" />, ratePerK: "$1.20", minOrder: "50", maxOrder: "100,000", status: "Active" },
  { id: "s3", providerServiceId: "48812", name: "TikTok Followers — Real & Active", category: "Followers", platform: "TikTok", icon: <UserPlus className="h-3.5 w-3.5 text-slate-700" />, ratePerK: "$4.50", minOrder: "100", maxOrder: "30,000", status: "Active" },
  { id: "s4", providerServiceId: "49103", name: "TikTok Video Views", category: "Views", platform: "TikTok", icon: <Eye className="h-3.5 w-3.5 text-slate-700" />, ratePerK: "$0.40", minOrder: "1,000", maxOrder: "1,000,000", status: "Inactive" },
  { id: "s5", providerServiceId: "51002", name: "YouTube Views — High Retention", category: "Views", platform: "YouTube", icon: <Play className="h-3.5 w-3.5 text-red-500" />, ratePerK: "$2.40", minOrder: "500", maxOrder: "500,000", status: "Active" },
  { id: "s6", providerServiceId: "51204", name: "YouTube Likes — Genuine", category: "Likes", platform: "YouTube", icon: <ThumbsUp className="h-3.5 w-3.5 text-red-500" />, ratePerK: "$3.00", minOrder: "100", maxOrder: "50,000", status: "Active" },
];

export default function AdminSMMServices() {
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
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.platform.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">SMM Services</h1>
              <p className="text-xs text-slate-400 font-medium">Manage and sync social media services from SMMFollowers.</p>
            </div>
            <button
              onClick={handleSync}
              className="inline-flex items-center space-x-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors self-start sm:self-auto"
            >
              <RefreshCw className={`h-3.5 w-3.5 stroke-[2.5] ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync from Provider"}</span>
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex items-center gap-3 bg-white">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search services..."
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
                    <th className="py-3 px-5">Service</th>
                    <th className="py-3 px-5">Provider ID</th>
                    <th className="py-3 px-5">Rate / 1K</th>
                    <th className="py-3 px-5">Min</th>
                    <th className="py-3 px-5">Max</th>
                    <th className="py-3 px-5 text-center">Status</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  {filtered.map((svc) => (
                    <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2.5">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                            {svc.icon}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{svc.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{svc.platform} · {svc.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-slate-500 text-[11px]">
                        #{svc.providerServiceId}
                      </td>
                      <td className="py-4 px-5 font-mono font-extrabold text-[#4F46E5]">{svc.ratePerK}</td>
                      <td className="py-4 px-5 font-mono text-slate-700">{svc.minOrder}</td>
                      <td className="py-4 px-5 font-mono text-slate-700">{svc.maxOrder}</td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          svc.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                        }`}>
                          {svc.status === "Active"
                            ? <CheckCircle2 className="h-3 w-3" />
                            : <XCircle className="h-3 w-3" />}
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
