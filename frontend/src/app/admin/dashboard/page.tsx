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
  Calendar,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Coins,
  ShoppingCart,
  Smartphone,
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

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
      title: "Total Revenue",
      value: "$24,500.00",
      change: "+12.5%",
      isPositive: true,
      icon: <Coins className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Total Orders",
      value: "1,284",
      change: "+8.2%",
      isPositive: true,
      icon: <ShoppingCart className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Active OTP Sessions",
      value: "42",
      badge: "Live",
      isLive: true,
      subtext: "Real-time authentication load",
      icon: <Smartphone className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Gross Profit",
      value: "$8,940.00",
      change: "+15.1%",
      isPositive: true,
      icon: <CreditCard className="h-4 w-4 text-slate-400" />,
    },
  ];

  const orders = [
    {
      id: "#NX-8902",
      service: "Instagram Followers (1k)",
      customer: "alex.chen@example.com",
      status: "Completed",
      statusStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      amount: "$12.50",
      date: "Oct 24, 14:32",
    },
    {
      id: "#NX-8901",
      service: "OTP Verification API",
      customer: "dev@fintechcorp.io",
      status: "Processing",
      statusStyle: "bg-amber-50 text-amber-600 border-amber-100",
      amount: "$450.00",
      date: "Oct 24, 14:15",
    },
    {
      id: "#NX-8899",
      service: "Telegram Members (5k)",
      customer: "crypto.promo@gmail.com",
      status: "Failed",
      statusStyle: "bg-rose-50 text-rose-600 border-rose-100",
      amount: "$35.00",
      date: "Oct 24, 13:40",
    },
    {
      id: "#NX-8898",
      service: "Twitter Retweets (500)",
      customer: "marketing@brand.co",
      status: "Completed",
      statusStyle: "bg-emerald-50 text-emerald-600 border-emerald-100",
      amount: "$8.00",
      date: "Oct 24, 12:10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between border-r border-slate-100 bg-white p-5">
        <div className="space-y-6">

          {/* Brand */}
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">
              N
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Pulsara Admin</h2>
              <p className="text-[10px] font-medium text-slate-400">Enterprise Tier</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = activeTab === link.name;
              return (
                <button
                  key={link.name}
                  onClick={() => setActiveTab(link.name)}
                  className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-[#EEF2F6] text-[#4F46E5]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utilities */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 pl-64">
        <div className="mx-auto max-w-7xl p-8 space-y-8">

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">Overview of your business metrics.</p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Last 30 Days</span>
              </div>
              <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <Download className="h-3.5 w-3.5 text-slate-500" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                    {stat.title}
                  </span>
                  {stat.icon}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                    {stat.value}
                  </span>
                  {stat.change && (
                    <span
                      className={`inline-flex items-center text-[10px] font-bold ${
                        stat.isPositive ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {stat.isPositive ? (
                        <TrendingUp className="h-3 w-3 mr-0.5" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-0.5" />
                      )}
                      {stat.change}
                    </span>
                  )}
                  {stat.badge && (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-[#E0E7FF] px-2 py-0.5 text-[10px] font-bold text-[#4F46E5]">
                      <span className="h-1 w-1 rounded-full bg-[#4F46E5] animate-pulse" />
                      <span>{stat.badge}</span>
                    </span>
                  )}
                </div>
                {stat.change && (
                  <p className="text-[10px] font-medium text-slate-400">from last month</p>
                )}
                {stat.subtext && (
                  <p className="text-[10px] font-medium text-slate-400">{stat.subtext}</p>
                )}
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Revenue Spline Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-[#0F172A]">Revenue Over Time</h3>
                  <p className="text-[10px] font-medium text-slate-400">
                    Daily breakdown for the last 30 days
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-[10px] font-bold">
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded bg-[#4F46E5]" />
                    <span className="text-slate-600">SMM</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="h-2 w-2 rounded bg-[#C7D2FE]" />
                    <span className="text-slate-600">OTP</span>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 h-48 w-full flex items-end">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 600 160"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#F1F5F9" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#F1F5F9" strokeDasharray="4" />
                  <path
                    d="M 0 110 Q 75 110 150 140 T 300 80 T 450 130 T 600 40 L 600 160 L 0 160 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0 110 Q 75 110 150 140 T 300 80 T 450 130 T 600 40"
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] font-medium text-slate-400 px-1 pt-2 bg-white">
                  <span>Oct 1</span>
                  <span>Oct 10</span>
                  <span>Oct 20</span>
                  <span>Oct 30</span>
                </div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="border-b border-slate-50 pb-4">
                <h3 className="text-sm font-bold text-[#0F172A]">Revenue by Method</h3>
              </div>

              <div className="flex justify-center items-center my-4 relative">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle cx="72" cy="72" r="54" stroke="#EEF2F6" strokeWidth="16" fill="none" />
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#4F46E5"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray="339.3"
                    strokeDashoffset="118.7"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="54"
                    stroke="#C7D2FE"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray="339.3"
                    strokeDashoffset="339.3"
                  />
                </svg>
                <div className="absolute text-center">
                  <p className="text-lg font-extrabold tracking-tight text-[#0F172A]">$24.5k</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-[#4F46E5]" />
                    <span className="text-slate-600">CryptoMus</span>
                  </div>
                  <span className="text-[#0F172A]">65%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-[#C7D2FE]" />
                    <span className="text-slate-600">Flutterwave</span>
                  </div>
                  <span className="text-[#0F172A]">35%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Orders Table */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-sm font-bold text-[#0F172A]">Recent Orders</h3>
              <button className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs font-medium text-slate-500">
                <thead className="bg-[#F8FAFC] border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Order ID</th>
                    <th className="px-6 py-3.5">Service</th>
                    <th className="px-6 py-3.5">Customer</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Amount</th>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                  {orders.map((order, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-slate-400">{order.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{order.service}</td>
                      <td className="px-6 py-4 font-normal text-slate-500">{order.customer}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${order.statusStyle}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">{order.amount}</td>
                      <td className="px-6 py-4 text-slate-400">{order.date}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          className="text-slate-400 hover:text-[#4F46E5] transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
