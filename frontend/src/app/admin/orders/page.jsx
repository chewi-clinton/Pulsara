"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  Loader2,
  Eye,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../../lib/api";

const STATUS_STYLE = {
  completed: "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]",
  paid: "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]",
  received: "bg-[#ECFDF5] text-[#10B981] border border-[#D1FAE5]",
  processing: "bg-[#FFF7ED] text-[#F59E0B] border border-[#FFEDD5]",
  in_progress: "bg-[#FFF7ED] text-[#F59E0B] border border-[#FFEDD5]",
  waiting_sms: "bg-[#EEF2FF] text-[#4F46E5] border border-[#E0E7FF]",
  pending_payment: "bg-slate-50 text-slate-400 border border-slate-100",
  failed: "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]",
  cancelled: "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]",
  expired: "bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]",
  refunded: "bg-slate-50 text-slate-400 border border-slate-100",
};

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "Orders", href: "/admin/orders", icon: <Receipt className="h-4 w-4" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const ALL_STATUSES = ["", "pending_payment", "paid", "processing", "in_progress", "completed", "waiting_sms", "received", "failed", "cancelled", "expired", "refunded"];
const ALL_TYPES = [{ value: "all", label: "All Types" }, { value: "smm", label: "SMM" }, { value: "otp", label: "OTP" }];

export default function OrdersManagement() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const pageSize = 20;
  const totalPages = Math.ceil(count / pageSize);

  const load = useCallback((p = page) => {
    setLoading(true);
    const params = { page: String(p) };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (typeFilter !== "all") params.type = typeFilter;
    api.admin.orders(params)
      .then((res) => { setOrders(res.results); setCount(res.count); })
      .catch((e) => {
        if (e.message.includes("401") || e.message.toLowerCase().includes("session")) router.push("/admin/login");
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [page, search, statusFilter, typeFilter, router]);

  useEffect(() => { load(1); setPage(1); }, [search, statusFilter, typeFilter]); // eslint-disable-line
  useEffect(() => { load(page); }, [page]); // eslint-disable-line

  const handleRefund = async (orderId) => {
    setActionLoading(orderId);
    try {
      await api.admin.refundOrder(orderId);
      load(page);
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRetry = async (orderId) => {
    setActionLoading(orderId);
    try {
      await api.admin.retryOrder(orderId);
      load(page);
    } catch (e) {
      alert(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/admin/login");
  };

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
              const active = link.href === "/admin/orders";
              return (
                <Link key={link.name} href={link.href}
                  className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${active ? "bg-[#EEF2F6] text-[#4F46E5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
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
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Orders Management</h1>
              <p className="text-xs text-slate-400 font-medium">View, track, and manage all platform transactions.</p>
            </div>
            <button className="inline-flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 self-start sm:self-auto">
              <Download className="h-3.5 w-3.5 text-slate-500" /><span>Export CSV</span>
            </button>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-600">{error}</div>
          )}

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-3 justify-between items-center bg-white">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search email, service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#4F46E5]"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s ? s.replace(/_/g, " ") : "All Statuses"}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#4F46E5]"
                >
                  {ALL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Service</th>
                    <th className="py-3 px-6">Customer</th>
                    <th className="py-3 px-6 text-center">Status</th>
                    <th className="py-3 px-6">Amount</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                  {loading && (
                    <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="h-5 w-5 animate-spin text-[#4F46E5] mx-auto" /></td></tr>
                  )}
                  {!loading && orders.length === 0 && (
                    <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-xs">No orders found.</td></tr>
                  )}
                  {!loading && orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">{order.order_id}</td>
                      <td className="py-4 px-6 font-bold text-slate-800 max-w-[200px] truncate">{order.service_name}</td>
                      <td className="py-4 px-6 text-slate-500 break-all max-w-[200px]">{order.customer_email || "—"}</td>
                      <td className="py-4 px-6 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${STATUS_STYLE[order.status] ?? "bg-slate-50 text-slate-400 border border-slate-100"}`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold font-mono text-slate-900">${parseFloat(order.amount).toFixed(2)}</td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-400">{new Date(order.created_at).toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1">
                          <Link href={`/admin/orders/${order.order_id}`} className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#4F46E5]">
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          {order.status === "failed" && order.type === "smm" && (
                            <button
                              onClick={() => handleRetry(order.order_id)}
                              disabled={actionLoading === order.order_id}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-40"
                              title="Retry"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {!["pending_payment", "refunded"].includes(order.status) && (
                            <button
                              onClick={() => handleRefund(order.order_id)}
                              disabled={actionLoading === order.order_id}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 disabled:opacity-40"
                              title="Refund"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-50 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white text-xs font-semibold text-slate-400">
              <div>
                Showing <span className="text-slate-800 font-bold">{(page - 1) * pageSize + 1}</span>–
                <span className="text-slate-800 font-bold">{Math.min(page * pageSize, count)}</span> of{" "}
                <span className="text-slate-800 font-bold">{count.toLocaleString()}</span> results
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold disabled:text-slate-300 disabled:bg-slate-50 hover:bg-slate-50"
                >Previous</button>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F46E5] text-xs font-bold text-white">{page}</span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold disabled:text-slate-300 disabled:bg-slate-50 hover:bg-slate-50"
                >Next</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
