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
  Search,
  ChevronDown,
  Calendar,
  Download,
  MoreVertical,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Phone,
  Play
} from "lucide-react";

interface OrderItem {
  id: string;
  serviceType: string;
  serviceDetail: string;
  serviceIcon: React.ReactNode;
  customer: string;
  status: "Completed" | "Pending" | "Failed";
  amount: string;
  date: string;
  time: string;
}

export default function OrdersManagement() {
  const [activeTab, setActiveTab] = useState("Orders");
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Marketplace", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Orders", icon: <Receipt className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Customers", icon: <Users2 className="h-4 w-4" /> },
    { name: "Payouts", icon: <CreditCard className="h-4 w-4" /> },
  ];

  const ordersData: OrderItem[] = [
    {
      id: "#ORD-8921",
      serviceType: "Instagram Likes",
      serviceDetail: "(10k)",
      serviceIcon: <ThumbsUp className="h-3.5 w-3.5 text-blue-600" />,
      customer: "alex.chen@example.com",
      status: "Completed",
      amount: "$45.00",
      date: "Oct 24,",
      time: "14:32"
    },
    {
      id: "#OTP-4432",
      serviceType: "WhatsApp OTP",
      serviceDetail: "(IN)",
      serviceIcon: <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />,
      customer: "api_user_99@vendor.io",
      status: "Pending",
      amount: "$0.08",
      date: "Oct 24,",
      time: "14:30"
    },
    {
      id: "#ORD-8920",
      serviceType: "TikTok Followers",
      serviceDetail: "(5k)",
      serviceIcon: <UserPlus className="h-3.5 w-3.5 text-indigo-600" />,
      customer: "sarah.j@marketing.co",
      status: "Failed",
      amount: "$22.50",
      date: "Oct 24,",
      time: "13:15"
    },
    {
      id: "#OTP-4431",
      serviceType: "Voice OTP",
      serviceDetail: "(US)",
      serviceIcon: <Phone className="h-3.5 w-3.5 text-sky-600" />,
      customer: "system@secure-auth.net",
      status: "Completed",
      amount: "$0.12",
      date: "Oct 24,",
      time: "12:45"
    },
    {
      id: "#ORD-8919",
      serviceType: "YouTube Views",
      serviceDetail: "(50k)",
      serviceIcon: <Play className="h-3.5 w-3.5 text-red-600" />,
      customer: "content_creator@gmail.com",
      status: "Completed",
      amount: "$120.00",
      date: "Oct 24,",
      time: "10:05"
    }
  ];

  const getStatusStyles = (status: OrderItem["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]";
      case "Pending":
        return "bg-[#FFF7ED] text-[#F59E0B] border border-[#FFEDD5]";
      case "Failed":
        return "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

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
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Nexora Admin</h2>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 pl-64">
        <main className="p-8 space-y-6 max-w-[1400px] mx-auto">

          {/* PAGE HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
                Orders Management
              </h1>
              <p className="text-xs text-slate-400 font-medium">
                View, track, and manage all platform transactions.
              </p>
            </div>
            <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors self-start sm:self-auto">
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* DATA TABLE CARD */}
          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">

            {/* TOOLBAR */}
            <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-3 justify-between items-center bg-white">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Order ID or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <span>All Statuses</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <span>All Types</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>

                <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Date Range</span>
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Service Type</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  {ordersData.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900 tracking-tight">
                        {order.id}
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2.5">
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                            {order.serviceIcon}
                          </div>
                          <span className="font-bold text-slate-800">
                            {order.serviceType}{" "}
                            <span className="font-normal text-slate-400 text-[11px]">
                              {order.serviceDetail}
                            </span>
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 font-medium break-all max-w-[220px]">
                        {order.customer}
                      </td>

                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${getStatusStyles(order.status)}`}>
                          <span className={`h-1 w-1 rounded-full ${
                            order.status === "Completed" ? "bg-[#10B981]" : order.status === "Pending" ? "bg-[#F59E0B]" : "bg-[#EF4444]"
                          }`} />
                          <span>{order.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 font-bold font-mono text-slate-900 text-[13px]">
                        {order.amount}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="text-slate-700 font-semibold">{order.date}</div>
                        <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{order.time}</div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="p-4 border-t border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white text-xs font-semibold text-slate-400">
              <div>
                Showing <span className="text-slate-800 font-bold">1</span> to{" "}
                <span className="text-slate-800 font-bold">5</span> of{" "}
                <span className="text-slate-800 font-bold">12,403</span> results
              </div>

              <div className="flex items-center space-x-1">
                <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-300 font-bold cursor-not-allowed bg-slate-50/50">
                  Previous
                </button>

                <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F46E5] text-xs font-bold text-white shadow-sm">
                  1
                </button>

                <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs text-slate-600 hover:bg-slate-50 font-bold">
                  2
                </button>

                <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs text-slate-600 hover:bg-slate-50 font-bold">
                  3
                </button>

                <span className="text-slate-300 font-bold px-1">...</span>

                <button className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs text-slate-600 hover:bg-slate-50 font-bold">
                  248
                </button>

                <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                  Next
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
