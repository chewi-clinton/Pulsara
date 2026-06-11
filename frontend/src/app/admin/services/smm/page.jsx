"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  UserPlus,
  Eye,
  Play,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { api } from "../../../../lib/api";
import { formatFcfa } from "../../../../lib/currency";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "SMM Services", href: "/admin/services/smm", icon: ShoppingBag },
  { label: "OTP Services", href: "/admin/services/otp", icon: Receipt },
  { label: "Orders", href: "/admin/orders", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function platformIcon(platform, category) {
  const p = (platform || "").toLowerCase();
  const c = (category || "").toLowerCase();
  const colors = { instagram: "text-pink-500", tiktok: "text-slate-800", youtube: "text-red-500", twitter: "text-sky-500", facebook: "text-blue-600" };
  const color = colors[p] ?? "text-slate-500";
  if (c === "followers") return <UserPlus className={`h-3.5 w-3.5 ${color}`} />;
  if (c === "likes") return <ThumbsUp className={`h-3.5 w-3.5 ${color}`} />;
  if (c === "views") return <Eye className={`h-3.5 w-3.5 ${color}`} />;
  if (c === "comments") return <MessageCircle className={`h-3.5 w-3.5 ${color}`} />;
  return <Play className={`h-3.5 w-3.5 ${color}`} />;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ""; }

export default function AdminSMMServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = () => {
    setLoading(true);
    api.admin.smmServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await api.admin.syncSmmServices();
      setSyncMsg(res.detail || "Sync complete.");
      load();
    } catch {
      setSyncMsg("Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.platform || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col justify-between border-r border-slate-100 bg-white p-5">
        <div className="space-y-6">
          <Link href="/admin/dashboard" className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F46E5] text-sm font-bold text-white shadow-sm">P</div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">Pulsara Admin</h2>
            </div>
          </Link>
          <nav className="space-y-1">
            {NAV.map(({ label, href, icon: Icon }) => {
              const active = href === "/admin/services/smm";
              return (
                <Link key={label} href={href}
                  className={`flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                    active ? "bg-[#EEF2F6] text-[#4F46E5]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}>
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => { localStorage.removeItem("access_token"); localStorage.removeItem("refresh_token"); window.location.href = "/admin/login"; }}
          className="flex w-full items-center space-x-3 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 pl-60">
        <main className="p-8 space-y-6 max-w-[1400px] mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">SMM Services</h1>
              <p className="text-xs text-slate-400 font-medium">
                {services.length.toLocaleString()} services loaded from SMMFollowers.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="inline-flex items-center space-x-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors disabled:opacity-60"
              >
                {syncing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5 stroke-[2.5]" />}
                <span>{syncing ? "Syncing…" : "Sync from Provider"}</span>
              </button>
              {syncMsg && <p className="text-[11px] font-semibold text-emerald-600">{syncMsg}</p>}
            </div>
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

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
              </div>
            ) : (
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                    {filtered.map((svc) => (
                      <tr key={svc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="flex items-center space-x-2.5">
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 border border-slate-100">
                              {platformIcon(svc.platform, svc.category)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{svc.name}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{cap(svc.platform)} · {cap(svc.category)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5 font-mono font-bold text-slate-500 text-[11px]">#{svc.provider_service_id}</td>
                        <td className="py-4 px-5 font-mono font-extrabold text-[#4F46E5]">{formatFcfa(svc.sell_per_1000)}</td>
                        <td className="py-4 px-5 font-mono text-slate-700">{Number(svc.min_quantity).toLocaleString()}</td>
                        <td className="py-4 px-5 font-mono text-slate-700">{Number(svc.max_quantity).toLocaleString()}</td>
                        <td className="py-4 px-5 text-center">
                          <span className={`inline-flex items-center space-x-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            svc.is_active
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {svc.is_active ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>{svc.is_active ? "Active" : "Inactive"}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

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
