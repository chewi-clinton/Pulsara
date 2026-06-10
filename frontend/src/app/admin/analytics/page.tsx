"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  ShoppingCart,
  Activity,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api, type AdminAnalyticsData } from "../../../lib/api";

type Period = "7d" | "30d" | "90d" | "all";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "Orders", href: "/admin/orders", icon: <Receipt className="h-4 w-4" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  "all": "All Time",
};

export default function AdminAnalytics() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("30d");
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.admin.analytics(period)
      .then(setData)
      .catch((e: Error) => {
        if (e.message.includes("401") || e.message.toLowerCase().includes("session")) router.push("/admin/login");
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [period, router]);

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/admin/login");
  };

  const stats = data ? [
    {
      label: "Total Revenue",
      value: `$${parseFloat(data.stats.total_revenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: null,
      up: true,
      icon: <DollarSign className="h-4 w-4 text-[#4F46E5]" />,
      bg: "bg-indigo-50",
    },
    {
      label: "Total Orders",
      value: data.stats.total_orders.toLocaleString(),
      change: null,
      up: true,
      icon: <ShoppingCart className="h-4 w-4 text-emerald-500" />,
      bg: "bg-emerald-50",
    },
    {
      label: "Avg. Order Value",
      value: `$${parseFloat(data.stats.avg_order_value).toFixed(2)}`,
      change: null,
      up: true,
      icon: <Activity className="h-4 w-4 text-amber-500" />,
      bg: "bg-amber-50",
    },
    {
      label: "SMM Revenue",
      value: `$${parseFloat(data.stats.smm_revenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: null,
      up: true,
      icon: <TrendingUp className="h-4 w-4 text-sky-500" />,
      bg: "bg-sky-50",
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
            {sidebarLinks.map((link) => {
              const active = link.href === "/admin/analytics";
              return (
                <Link key={link.name} href={link.href}
                  className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${active ? "bg-[#EEF2F6] text-[#4F46E5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  {link.icon}<span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="space-y-4">
          <hr className="border-slate-100" />
          <div className="space-y-1">
            <button className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <HelpCircle className="h-4 w-4" /><span>Support</span>
            </button>
            <button onClick={handleSignOut} className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900">
              <LogOut className="h-4 w-4" /><span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 pl-64">
        <main className="p-8 space-y-6 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Analytics</h1>
              <p className="text-xs text-slate-400 font-medium">Revenue, orders, and platform performance overview.</p>
            </div>
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div className="flex items-center rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-2 text-[11px] font-bold transition-all ${period === p ? "bg-[#4F46E5] text-white" : "text-slate-500 hover:bg-slate-50"}`}
                  >
                    {PERIOD_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-600">{error}</div>
          )}

          {loading && (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" /></div>
          )}

          {!loading && data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.bg}`}>{stat.icon}</div>
                    </div>
                    <p className="text-2xl font-extrabold tracking-tight text-[#0F172A] font-mono">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-extrabold text-[#0F172A]">Revenue Over Time</h2>
                    <p className="text-[11px] font-medium text-slate-400">SMM vs OTP revenue breakdown</p>
                  </div>
                  <div className="flex items-center space-x-4 text-[10px] font-bold">
                    <div className="flex items-center space-x-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" /><span className="text-slate-500">SMM</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#10B981]" /><span className="text-slate-500">OTP</span>
                    </div>
                  </div>
                </div>
                <div className="h-56">
                  {data.daily.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.daily} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
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
                        <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          contentStyle={{ fontSize: 11, fontWeight: 700, borderRadius: 12, border: "1px solid #E2E8F0" }}
                          formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === "smm" ? "SMM" : "OTP"]}
                        />
                        <Area type="monotone" dataKey="smm" stroke="#4F46E5" strokeWidth={2} fill="url(#smmGrad)" dot={false} activeDot={{ r: 4, fill: "#4F46E5" }} />
                        <Area type="monotone" dataKey="otp" stroke="#10B981" strokeWidth={2} fill="url(#otpGrad)" dot={false} activeDot={{ r: 4, fill: "#10B981" }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-slate-400">No revenue data for this period.</div>
                  )}
                </div>
              </div>

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
                        <th className="py-3 px-6 text-center">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                      {data.top_services.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-slate-400">No data.</td></tr>
                      )}
                      {data.top_services.map((svc, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-slate-400 text-[11px]">{String(i + 1).padStart(2, "0")}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">{svc.name}</td>
                          <td className="py-4 px-6 font-mono font-bold text-slate-700">{svc.orders.toLocaleString()}</td>
                          <td className="py-4 px-6 font-mono font-extrabold text-[#4F46E5]">{svc.revenue}</td>
                          <td className="py-4 px-6 text-center">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500 mx-auto" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
