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
  ChevronRight,
  RotateCcw,
  Undo2,
  User,
  Terminal,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Bell,
  Settings,
} from "lucide-react";

export default function OrderDetails() {
  const [activeTab, setActiveTab] = useState("Orders");

  const sidebarLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Marketplace", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Orders", icon: <Receipt className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Customers", icon: <Users2 className="h-4 w-4" /> },
    { name: "Payouts", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const terminalLogs = [
    {
      time: "[2024-10-24 14:32:01]",
      text: "Incoming request from alex.chen@example.com",
      color: "text-slate-400",
    },
    {
      time: "[2024-10-24 14:32:05]",
      text: "Validating payment txn_8273645091_alpha... OK",
      color: "text-emerald-400",
    },
    {
      time: "[2024-10-24 14:32:08]",
      text: "Relaying to SMMFollowers API endpoint /v2/orders",
      color: "text-blue-400",
    },
    {
      time: "[2024-10-24 14:32:10]",
      text: '{"id": "99281", "status": "processing", "charge": "104.00"}',
      color: "text-amber-400",
    },
    {
      time: "[2024-10-24 14:32:12]",
      text: "Database synchronized. Status set to Pending.",
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between border-r border-slate-100 bg-white p-5">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">
              N
            </div>
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

      {/* MAIN WORKSPACE */}
      <div className="flex-1 pl-64">

        {/* TOP NAV BAR */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-8">
          <div className="flex items-center space-x-6 text-xs font-bold text-slate-400">
            <span className="hover:text-slate-600 cursor-pointer">Pulsara</span>
            <Search className="h-4 w-4 text-slate-400 cursor-pointer" />
            <span className="text-slate-300">/</span>
            <span className="text-[#4F46E5] border-b-2 border-[#4F46E5] pb-5 pt-5">Orders</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <Bell className="h-4 w-4 cursor-pointer hover:text-slate-600" />
            <HelpCircle className="h-4 w-4 cursor-pointer hover:text-slate-600" />
            <Settings className="h-4 w-4 cursor-pointer hover:text-slate-600" />
            <span className="h-7 w-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center">
              <span className="text-[10px] font-bold text-slate-600">AD</span>
            </span>
          </div>
        </header>

        <main className="p-8 space-y-6 max-w-7xl mx-auto">

          {/* BREADCRUMB */}
          <div className="flex items-center space-x-2 text-[11px] font-bold tracking-wide text-slate-400 uppercase">
            <span>Orders</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-mono text-slate-500 font-bold">#ORD-2024-8842</span>
          </div>

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                  Order #ORD-2024-8842
                </h1>
                <span className="rounded bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-[#D97706] uppercase">
                  Pending
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Placed on Oct 24, 2024 at 14:32 UTC
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
                <span>Retry Order</span>
              </button>
              <button className="inline-flex items-center space-x-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
                <Undo2 className="h-3.5 w-3.5" />
                <span>Refund</span>
              </button>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 space-y-6">

              {/* Customer Info */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
                  <User className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Customer Info
                  </h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Email Address
                    </span>
                    <span className="font-bold text-slate-800 break-all">
                      alex.chen@example.com
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Account Tier
                    </span>
                    <span className="mt-0.5 inline-flex rounded bg-[#EEF2F6] px-2 py-0.5 text-[9px] font-extrabold text-[#4F46E5] uppercase">
                      Pro Member
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      IP Address
                    </span>
                    <span className="font-mono font-semibold text-slate-600">192.168.1.104</span>
                  </div>
                </div>
              </div>

              {/* Transaction */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Transaction
                  </h3>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Payment Reference
                    </span>
                    <span className="font-mono text-slate-500 font-bold break-all">
                      txn_8273645091_alpha
                    </span>
                  </div>
                  <div className="flex items-end justify-between border-t border-slate-50 pt-2">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                        Total Amount
                      </span>
                      <span className="text-xl font-extrabold text-[#0F172A] font-mono">$149.50</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        Method
                      </span>
                      <span className="inline-flex items-center space-x-1 font-bold text-slate-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                        <span>Stripe</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 space-y-6">

              {/* Service Details + Terminal */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-bold text-[#0F172A]">SMM Service Details</h3>
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    SMM-ID: 45229
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Service Name
                    </span>
                    <span className="font-bold text-slate-900">
                      Instagram HQ Real Likes - Global
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Quantity
                    </span>
                    <span className="font-bold text-slate-900 font-mono">10,000</span>
                  </div>
                  <div className="sm:col-span-2 space-y-0.5">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Target URL
                    </span>
                    <a
                      href="https://instagram.com/p/DB1x2y-Qz8/"
                      className="font-medium text-[#4F46E5] hover:underline break-all"
                    >
                      https://instagram.com/p/DB1x2y-Qz8/
                    </a>
                  </div>
                  <div className="sm:col-span-2 space-y-0.5 pt-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Provider ID
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-700 font-bold">
                        SMMFollowers #99281
                      </span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Terminal */}
                <div className="rounded-xl bg-[#0F172A] p-4 shadow-inner font-mono text-[11px] leading-relaxed">
                  <div className="flex items-center space-x-1.5 text-slate-500 border-b border-slate-800/60 pb-2 mb-2">
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      System Live Raw Payload Outputs
                    </span>
                  </div>
                  <div className="space-y-1 max-h-36 overflow-y-auto pr-2">
                    {terminalLogs.map((log, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:space-x-2">
                        <span className="text-slate-500 shrink-0">{log.time}</span>
                        <span className={`${log.color} break-all`}>{log.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Execution Timeline */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <h3 className="text-sm font-bold text-[#0F172A]">Execution Timeline</h3>

                <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-[2px] before:bg-slate-100">

                  <div className="relative">
                    <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-[#4F46E5] fill-white" />
                    </span>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-mono text-[10px] text-slate-400">14:32:01</span>
                      <h4 className="font-bold text-slate-900">Order Received</h4>
                      <p className="text-slate-400 font-medium">
                        Customer authorized payment via Stripe Gateway.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-[#4F46E5] fill-white" />
                    </span>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-mono text-[10px] text-slate-400">14:32:10</span>
                      <h4 className="font-bold text-slate-900">Provider Synced</h4>
                      <p className="text-slate-400 font-medium">
                        Successfully handshaked with SMMFollowers API.
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                      <Clock className="h-4 w-4 text-slate-300 fill-white animate-spin [animation-duration:8s]" />
                    </span>
                    <div className="space-y-0.5 text-xs">
                      <span className="font-mono text-[10px] text-slate-400">Estimated ~24h</span>
                      <h4 className="font-bold text-slate-500">In Progress</h4>
                      <p className="text-slate-400 font-medium">
                        Waiting for provider to complete the service delivery.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* FLOATING REFRESH WIDGET */}
          <div className="fixed bottom-6 right-6 z-30 rounded-xl bg-[#0F172A] p-4 text-white shadow-xl min-w-[240px] border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="text-[#4F46E5]">System Refresh</span>
              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 font-mono text-white bg-slate-800">
                4
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center font-mono font-extrabold text-base tracking-tight">
              <div className="bg-slate-800/80 rounded py-1">8</div>
              <div className="bg-slate-800/80 rounded py-1">2</div>
              <div className="bg-slate-800/80 rounded py-1">7</div>
              <div className="bg-slate-800/80 rounded py-1">3</div>
            </div>
            <p className="text-[9px] text-slate-400 font-medium text-center flex items-center justify-center space-x-1 pt-0.5">
              <RefreshCw className="h-2.5 w-2.5 animate-spin text-slate-500" />
              <span>Real-time status sync token valid for 5:00 min</span>
            </p>
          </div>

        </main>
      </div>
    </div>
  );
}
