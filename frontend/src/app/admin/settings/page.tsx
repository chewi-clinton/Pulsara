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
  Globe,
  Cpu,
  Wallet,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Save,
  XCircle,
  Info
} from "lucide-react";

export default function SystemSettings() {
  const [platformName, setPlatformName] = useState("Pulsara Enterprise");
  const [supportEmail, setSupportEmail] = useState("support@pulsara.io");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const [smmKey, setSmmKey] = useState("sk_smm_live_89324792384723984723948");
  const [showSmmKey, setShowSmmKey] = useState(false);
  const [smsKey, setSmsKey] = useState("");
  const [showSmsKey, setShowSmsKey] = useState(false);

  const [cryptoMerchantId, setCryptoMerchantId] = useState("MERCH-99281-XYZ");
  const [cryptoApiKey, setCryptoApiKey] = useState("api_crypto_secret_998234982374");
  const [showCryptoKey, setShowCryptoKey] = useState(false);
  const [flutterwaveKey, setFlutterwaveKey] = useState("flw_live_secret_48239084023948230");
  const [showFlutterwaveKey, setShowFlutterwaveKey] = useState(false);

  const sidebarLinks = [
    { name: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { name: "Marketplace", icon: <ShoppingBag className="h-4 w-4" /> },
    { name: "Orders", icon: <Receipt className="h-4 w-4" /> },
    { name: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Customers", icon: <Users2 className="h-4 w-4" /> },
    { name: "Payouts", icon: <CreditCard className="h-4 w-4" /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 pb-24">

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
            {sidebarLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                className="flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
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
        <main className="p-8 space-y-6 max-w-4xl mx-auto">

          {/* PAGE HEADER */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">
              System Settings
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Configure global application parameters and external integrations.
            </p>
          </div>

          {/* SECTION 1: GENERAL SETTINGS */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4 flex items-center space-x-2">
              <Globe className="h-4 w-4 text-[#4F46E5]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                General Site Settings
              </h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <label className="block text-xs font-bold text-slate-500 tracking-wide">
                      Platform Name
                    </label>
                    <Info className="h-3 w-3 text-slate-300" title="Visible platform title brand name." />
                  </div>
                  <input
                    type="text"
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-500 tracking-wide">
                    Support Contact Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
                  />
                </div>
              </div>

              {/* Maintenance Mode Toggle */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-800">Maintenance Mode</h4>
                  <p className="text-[11px] font-medium text-slate-400">
                    Restrict access to administrators only while performing updates.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    maintenanceMode ? "bg-[#4F46E5]" : "bg-slate-200"
                  }`}
                  role="switch"
                  aria-checked={maintenanceMode}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      maintenanceMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 2: PROVIDER API CONFIGURATION */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4 flex items-center space-x-2">
              <Cpu className="h-4 w-4 text-[#4F46E5]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Provider API Configuration
              </h3>
            </div>

            <div className="p-5 space-y-6 divide-y divide-slate-50">

              {/* SMMFollowers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">SMMFollowers Connection</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Primary provider for social media metrics.</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 rounded-md bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3 stroke-[2.5]" />
                    <span>Connected</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showSmmKey ? "text" : "password"}
                      value={smmKey}
                      onChange={(e) => setSmmKey(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 tracking-wider focus:outline-none focus:border-[#4F46E5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmmKey(!showSmmKey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      {showSmmKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button type="button" className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Test Connection</span>
                  </button>
                </div>
              </div>

              {/* SMSPool */}
              <div className="space-y-4 pt-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">SMSPool Connection</h4>
                    <p className="text-[11px] font-medium text-slate-400 mt-0.5">Provider for OTP and transactional messaging.</p>
                  </div>
                  <span className="inline-flex items-center space-x-1 rounded-md bg-amber-50 border border-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                    <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
                    <span>Needs Attention</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showSmsKey ? "text" : "password"}
                      value={smsKey}
                      onChange={(e) => setSmsKey(e.target.value)}
                      placeholder="Enter SMSPool API Key"
                      className="w-full pl-4 pr-10 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 tracking-wider focus:outline-none focus:border-[#4F46E5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmsKey(!showSmsKey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      {showSmsKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <button type="button" className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                    <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Test Connection</span>
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: PAYMENT GATEWAYS */}
          <section className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-50 bg-slate-50/50 px-5 py-4 flex items-center space-x-2">
              <Wallet className="h-4 w-4 text-[#4F46E5]" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Payment Gateway Configuration
              </h3>
            </div>

            <div className="p-5 space-y-6">

              {/* CryptoMus */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800">CryptoMus Integration</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Merchant ID</label>
                    <input
                      type="text"
                      value={cryptoMerchantId}
                      onChange={(e) => setCryptoMerchantId(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Payment API Key</label>
                    <div className="relative">
                      <input
                        type={showCryptoKey ? "text" : "password"}
                        value={cryptoApiKey}
                        onChange={(e) => setCryptoApiKey(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 tracking-wider focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCryptoKey(!showCryptoKey)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      >
                        {showCryptoKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button type="button" className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Verify Webhook & Key</span>
                </button>
              </div>

              <hr className="border-slate-50" />

              {/* Flutterwave */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-800">Flutterwave Integration</h4>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 tracking-wide uppercase">Secret Key (Live)</label>
                  <div className="relative w-full max-w-xl">
                    <input
                      type={showFlutterwaveKey ? "text" : "password"}
                      value={flutterwaveKey}
                      onChange={(e) => setFlutterwaveKey(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 text-xs font-mono bg-white rounded-xl border border-slate-200 text-slate-800 tracking-wider focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFlutterwaveKey(!showFlutterwaveKey)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      {showFlutterwaveKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="button" className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
                  <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
                  <span>Test Connection</span>
                </button>
              </div>

            </div>
          </section>

        </main>
      </div>

      {/* STICKY SAVE BAR */}
      <footer className="fixed bottom-0 right-0 left-64 z-30 border-t border-slate-100 bg-white/80 backdrop-blur-md px-8 py-4 flex items-center justify-end space-x-3 shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
        <button
          type="button"
          className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <XCircle className="h-4 w-4 text-slate-400" />
          <span>Discard Changes</span>
        </button>
        <button
          type="button"
          className="inline-flex items-center space-x-1.5 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors"
        >
          <Save className="h-4 w-4 stroke-[2.5]" />
          <span>Save Configuration</span>
        </button>
      </footer>

    </div>
  );
}
