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
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingCart,
  Activity,
  Users,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const revenueData = [
  { month: "May", smm: 4200, otp: 820 },
  { month: "Jun", smm: 5800, otp: 1050 },
  { month: "Jul", smm: 4900, otp: 930 },
  { month: "Aug", smm: 7100, otp: 1240 },
  { month: "Sep", smm: 6400, otp: 1180 },
  { month: "Oct", smm: 8900, otp: 1520 },
];

const topServices = [
  { name: "Instagram Real Followers", orders: 1842, revenue: "$4,605.00", change: "+12%" },
  { name: "YouTube Views — HQ", orders: 934, revenue: "$2,241.60", change: "+8%" },
  { name: "TikTok Followers", orders: 728, revenue: "$3,276.00", change: "+21%" },
  { name: "WhatsApp OTP — US", orders: 6201, revenue: "$930.15", change: "+5%" },
  { name: "Instagram Post Likes", orders: 2103, revenue: "$2,523.60", change: "-3%" },
];

const dateRanges = ["Last 7 Days", "Last 30 Days", "Last 6 Months", "This Year"];

export default function AdminAnalytics() {
  const [activeTab, setActiveTab] = useState("Analytics");
  const [dateRange, setDateRange] = useState("Last 6 Months");

  const sidebarLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Marketplace", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Orders", icon: <Receipt className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Customers", icon: <Users2 className="h-4 w-4" /> },
    { name: "Payouts", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const stats = [
    {
      label: "Total Revenue",
      value: "$32,841",
      change: "+18.4%",
      up: true,
      icon: <DollarSign className="h-4 w-4 text-[#4F46E5]" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Total Orders",
      value: "12,403",
      change: "+9.2%",
      up: true,
      icon: <ShoppingCart className="h-4 w-4 text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Avg. Order Value",
      value: "$2.65",
      change: "-1.8%",
      up: false,
      icon: <Activity className="h-4 w-4 text-amber-500" />,
      bg: "bg-amber-50",
    },
    {
      label: "Active Customers",
      value: "4,291",
      change: "+22.1%",
      up: true,
      icon: <Users className="h-4 w-4 text-sky-500" />,
      bg: "bg-sky-50",
    },
  ];

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

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Analytics</h1>
              <p className="text-xs text-slate-400 font-medium">Revenue, orders, and platform performance overview.</p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {dateRanges.map((r) => (
                  <button
                    key={r}
                    onClick={() => setDateRange(r)}
                    className={`px-3 py-2 text-[11px] font-bold transition-all ${
                      dateRange === r
                        ? "bg-[#4F46E5] text-white"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono">{stat.value}</p>
                <div className={`inline-flex items-center space-x-1 text-[10px] font-bold ${stat.up ? "text-[#10B981]" : "text-rose-500"}`}>
                  {stat.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                  <span>{stat.change} vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* REVENUE CHART */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Revenue Over Time</h2>
                <p className="text-[11px] font-medium text-slate-400">SMM vs OTP revenue breakdown</p>
              </div>
              <div className="flex items-center space-x-4 text-[10px] font-bold">
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" />
                  <span className="text-slate-500">SMM</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-slate-500">OTP</span>
                </div>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="smmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="otpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 12, border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "smm" ? "SMM" : "OTP"]}
                  />
                  <Area type="monotone" dataKey="smm" stroke="#4F46E5" strokeWidth={2} fill="url(#smmGrad)" dot={false} activeDot={{ r: 4, fill: "#4F46E5" }} />
                  <Area type="monotone" dataKey="otp" stroke="#10B981" strokeWidth={2} fill="url(#otpGrad)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TOP SERVICES */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <h2 className="text-sm font-extrabold text-[#0F172A]">Top Performing Services</h2>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">By total revenue this period</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-6">#</th>
                    <th className="py-3 px-6">Service Name</th>
                    <th className="py-3 px-6">Total Orders</th>
                    <th className="py-3 px-6">Revenue</th>
                    <th className="py-3 px-6 text-center">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  {topServices.map((svc, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-400 text-[11px]">{String(i + 1).padStart(2, "0")}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{svc.name}</td>
                      <td className="py-4 px-6 font-mono font-bold text-slate-700">{svc.orders.toLocaleString()}</td>
                      <td className="py-4 px-6 font-mono font-extrabold text-[#4F46E5]">{svc.revenue}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-flex items-center space-x-1 text-[10px] font-bold ${svc.change.startsWith("+") ? "text-[#10B981]" : "text-rose-500"}`}>
                          {svc.change.startsWith("+")
                            ? <TrendingUp className="h-3 w-3" />
                            : <TrendingDown className="h-3 w-3" />}
                          <span>{svc.change}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
