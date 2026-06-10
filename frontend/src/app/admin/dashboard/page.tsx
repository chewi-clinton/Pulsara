"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  BarChart3,
  Settings,
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { api, type AdminDashboardData, type AdminOrderItem } from "../../../lib/api";

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  paid: "bg-emerald-50 text-emerald-600 border-emerald-100",
  processing: "bg-amber-50 text-amber-600 border-amber-100",
  in_progress: "bg-amber-50 text-amber-600 border-amber-100",
  pending_payment: "bg-slate-50 text-slate-500 border-slate-100",
  waiting_sms: "bg-indigo-50 text-indigo-600 border-indigo-100",
  received: "bg-emerald-50 text-emerald-600 border-emerald-100",
  failed: "bg-rose-50 text-rose-600 border-rose-100",
  cancelled: "bg-rose-50 text-rose-600 border-rose-100",
  expired: "bg-rose-50 text-rose-600 border-rose-100",
  refunded: "bg-slate-50 text-slate-500 border-slate-100",
};

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "Orders", href: "/admin/orders", icon: <Receipt className="h-4 w-4" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.admin.dashboard()
      .then(setData)
      .catch((e: Error) => {
        if (e.message.includes("401") || e.message.toLowerCase().includes("session")) {
          router.push("/admin/login");
        } else {
          setError(e.message);
        }
      });
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/admin/login");
  };

  const stats = data ? [
    {
      title: "Total Revenue",
      value: `$${parseFloat(data.total_revenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <Coins className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Total Orders",
      value: data.total_orders.toLocaleString(),
      icon: <ShoppingCart className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Active OTP Sessions",
      value: String(data.active_otp_sessions),
      badge: "Live",
      icon: <Smartphone className="h-4 w-4 text-slate-400" />,
    },
    {
      title: "Gross Profit",
      value: `$${parseFloat(data.gross_profit).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <CreditCard className="h-4 w-4 text-slate-400" />,
    },
  ] : [];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between border-r border-slate-100 bg-white p-5">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">P</div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Pulsara Admin</h2>
              <p className="text-[10px] font-medium text-slate-400">Enterprise Tier</p>
            </div>
          </div>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide bg-[#EEF2F6] text-[#4F46E5]"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="space-y-4">
          <hr className="border-slate-100" />
          <div className="space-y-1">
            <button className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <HelpCircle className="h-4 w-4" />
              <span>Support</span>
            </button>
            <button onClick={handleSignOut} className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 pl-64">
        <div className="mx-auto max-w-7xl p-8 space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Dashboard</h1>
              <p className="text-xs text-slate-500 font-medium">Overview of your business metrics.</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>All Time</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-600">{error}</div>
          )}

          {!data && !error && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
            </div>
          )}

          {data && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">{stat.title}</span>
                      {stat.icon}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-extrabold tracking-tight text-[#0F172A]">{stat.value}</span>
                      {stat.badge && (
                        <span className="inline-flex items-center space-x-1 rounded-full bg-[#E0E7FF] px-2 py-0.5 text-[10px] font-bold text-[#4F46E5]">
                          <span className="h-1 w-1 rounded-full bg-[#4F46E5] animate-pulse" />
                          <span>{stat.badge}</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                  <h3 className="text-sm font-bold text-[#0F172A]">Recent Orders</h3>
                  <Link href="/admin/orders" className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors">View All</Link>
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
                      {data.recent_orders.map((order: AdminOrderItem) => (
                        <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-400">{order.order_id}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{order.service_name}</td>
                          <td className="px-6 py-4 font-normal text-slate-500">{order.customer_email || "—"}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold capitalize ${STATUS_STYLE[order.status] ?? "bg-slate-50 text-slate-500 border-slate-100"}`}>
                              {order.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">${parseFloat(order.amount).toFixed(2)}</td>
                          <td className="px-6 py-4 text-slate-400">{new Date(order.created_at).toLocaleString()}</td>
                          <td className="px-6 py-4 text-center">
                            <Link href={`/admin/orders/${order.order_id}`} className="text-slate-400 hover:text-[#4F46E5] transition-colors">
                              <Eye className="h-4 w-4 mx-auto" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {data.recent_orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-8 text-center text-slate-400 text-xs">No orders yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
