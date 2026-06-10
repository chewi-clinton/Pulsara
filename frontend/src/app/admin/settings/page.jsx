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
  Globe,
  Cpu,
  Wallet,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Save,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../../lib/api";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "Orders", href: "/admin/orders", icon: <Receipt className="h-4 w-4" /> },
  { name: "Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "Settings", href: "/admin/settings", icon: <Settings className="h-4 w-4" /> },
];

const INITIAL_KEY = { value: "", show: false, configured: false };

export default function SystemSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [keys, setKeys] = useState({
    smmfollowers_api_key: { ...INITIAL_KEY },
    smspool_api_key: { ...INITIAL_KEY },
    fivesim_api_key: { ...INITIAL_KEY },
    cryptomus_merchant_id: { ...INITIAL_KEY },
    cryptomus_payment_key: { ...INITIAL_KEY },
    notchpay_public_key: { ...INITIAL_KEY },
    notchpay_secret_key: { ...INITIAL_KEY },
  });

  useEffect(() => {
    api.admin.getSettings()
      .then((data) => {
        setKeys((prev) => {
          const next = { ...prev };
          Object.keys(data).forEach((k) => {
            next[k] = { ...next[k], configured: data[k] };
          });
          return next;
        });
      })
      .catch((e) => {
        if (e.message.includes("401") || e.message.toLowerCase().includes("session")) router.push("/admin/login");
        else setError(e.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const setKey = (field, patch) =>
    setKeys((prev) => ({ ...prev, [field]: { ...prev[field], ...patch } }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = {};
    Object.keys(keys).forEach((k) => {
      if (keys[k].value) payload[k] = keys[k].value;
    });
    try {
      await api.admin.saveSettings(payload);
      setSuccess("Settings saved successfully.");
      setKeys((prev) => {
        const next = { ...prev };
        Object.keys(payload).forEach((k) => {
          next[k] = { value: "", show: false, configured: true };
        });
        return next;
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setKeys((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        next[k] = { ...next[k], value: "" };
      });
      return next;
    });
    setError("");
    setSuccess("");
  };

  const handleSignOut = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/admin/login");
  };

  const KeyInput = ({ field, placeholder }) => {
    const k = keys[field];
    return (
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={k.show ? "text" : "password"}
            value={k.value}
            onChange={(e) => setKey(field, { value: e.target.value })}
            placeholder={k.configured ? "••••••••••••• (configured — enter new value to update)" : placeholder}
            className="w-full pl-4 pr-10 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 tracking-wider focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]"
          />
          <button type="button" onClick={() => setKey(field, { show: !k.show })} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
            {k.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex items-center">
          {k.configured ? (
            <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 whitespace-nowrap">
              <CheckCircle2 className="h-3 w-3 stroke-[2.5]" /><span>Set</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 rounded-md bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600 whitespace-nowrap">
              <AlertTriangle className="h-3 w-3 stroke-[2.5]" /><span>Not set</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 pb-24">

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
              const active = link.href === "/admin/settings";
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
        <main className="p-8 space-y-6 max-w-4xl mx-auto">

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">System Settings</h1>
            <p className="text-xs text-slate-400 font-medium">Configure provider API keys and payment gateway credentials.</p>
          </div>

          {error && <div className="rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-xs font-semibold text-rose-600">{error}</div>}
          {success && <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs font-semibold text-emerald-600">{success}</div>}

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" /></div>
          ) : (
            <>
              <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4 flex items-center space-x-2">
                  <Cpu className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Provider API Configuration</h3>
                </div>
                <div className="p-5 space-y-6 divide-y divide-slate-50">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">SMMFollowers API Key</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Primary provider for social media metrics.</p>
                    </div>
                    <KeyInput field="smmfollowers_api_key" placeholder="Enter SMMFollowers API Key" />
                  </div>
                  <div className="space-y-3 pt-5">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">SMSPool API Key</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Provider for OTP and transactional messaging.</p>
                    </div>
                    <KeyInput field="smspool_api_key" placeholder="Enter SMSPool API Key" />
                  </div>
                  <div className="space-y-3 pt-5">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800">5sim API Key</h4>
                      <p className="text-[11px] font-medium text-slate-400 mt-0.5">Secondary OTP provider.</p>
                    </div>
                    <KeyInput field="fivesim_api_key" placeholder="Enter 5sim API Key" />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4 flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-[#4F46E5]" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Payment Gateway Configuration</h3>
                </div>
                <div className="p-5 space-y-6 divide-y divide-slate-50">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-800">CryptoMus</h4>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Merchant ID</label>
                        <KeyInput field="cryptomus_merchant_id" placeholder="Enter Merchant ID" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Payment API Key</label>
                        <KeyInput field="cryptomus_payment_key" placeholder="Enter Payment API Key" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 pt-5">
                    <h4 className="text-xs font-extrabold text-slate-800">NotchPay</h4>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Public Key</label>
                        <KeyInput field="notchpay_public_key" placeholder="Enter NotchPay Public Key" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Secret Key</label>
                        <KeyInput field="notchpay_secret_key" placeholder="Enter NotchPay Secret Key" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>

      <footer className="fixed bottom-0 right-0 left-64 z-30 border-t border-slate-100 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-end space-x-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <button type="button" onClick={handleDiscard} className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
          <XCircle className="h-4 w-4 text-slate-400" /><span>Discard Changes</span>
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="inline-flex items-center space-x-1.5 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] disabled:opacity-60 transition-colors">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 stroke-[2.5]" />}
          <span>{saving ? "Saving..." : "Save Configuration"}</span>
        </button>
      </footer>
    </div>
  );
}
