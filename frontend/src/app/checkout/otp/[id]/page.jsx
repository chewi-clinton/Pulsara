"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  CreditCard,
  Bitcoin,
  Phone,
  Radio,
  AlertTriangle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useCurrency } from "../../../../lib/currency";

const FLAGS = {
  US: "🇺🇸", GB: "🇬🇧", IN: "🇮🇳", RU: "🇷🇺", BR: "🇧🇷",
  DE: "🇩🇪", FR: "🇫🇷", CA: "🇨🇦", ID: "🇮🇩", NG: "🇳🇬",
  PK: "🇵🇰", PH: "🇵🇭", MX: "🇲🇽", AU: "🇦🇺", JP: "🇯🇵",
};

const paymentMethods = [
  { id: "cryptomus", label: "Crypto", sub: "BTC, ETH, USDT, LTC", icon: Bitcoin },
  { id: "notchpay", label: "Card / Mobile Money", sub: "Visa, MTN MoMo, Orange Money", icon: CreditCard },
];

export default function OTPCheckout() {
  const router = useRouter();
  const params = useParams();
  const countryCode = (Array.isArray(params.id) ? params.id[0] : params.id ?? "").toUpperCase();
  const { format } = useCurrency();

  const [services, setServices] = useState([]);
  const [loadError, setLoadError] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [payment, setPayment] = useState("cryptomus");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api.services.otp({ country_code: countryCode })
      .then((data) => {
        if (data.length === 0) { setLoadError("No services available for this country."); return; }
        setServices(data);
        setSelectedServiceId(data[0].id);
      })
      .catch(() => setLoadError("Failed to load services."));
  }, [countryCode]);

  const selectedService = services.find((s) => s.id === selectedServiceId) ?? null;
  const flag = FLAGS[countryCode] ?? "🌐";
  const countryName = selectedService?.country_name ?? countryCode;

  const numServices = services.length;
  const statusLabel = numServices <= 1 ? "Limited" : numServices <= 2 ? "High Demand" : "Available";
  const statusStyle = {
    Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
    "High Demand": "bg-amber-50 text-amber-600 border-amber-100",
    Limited: "bg-rose-50 text-rose-500 border-rose-100",
  }[statusLabel];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    setSubmitError("");
    setSubmitting(true);
    try {
      const result = await api.orders.createOtp({
        service_id: selectedServiceId,
        platform: selectedService?.platform,
        payment_method: payment,
        customer_email: email || undefined,
      });

      if (result.payment_method === "notchpay" && result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }

      const p = result.payment;
      router.push(
        `/payment?order_id=${result.order_id}&method=cryptomus` +
        `&payment_url=${encodeURIComponent(p.url)}&amount=${result.amount}` +
        `&expires=${p.expires_at}`
      );
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-slate-500">{loadError}</p>
          <Link href="/otp" className="text-xs font-bold text-[#4F46E5] hover:underline">← Back to numbers</Link>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        <Link href="/otp" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Numbers</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-3xl leading-none">{flag}</span>
                <div>
                  <p className="text-sm font-extrabold text-[#0F172A]">{countryName}</p>
                  <p className="text-[10px] font-semibold text-slate-400">Virtual number</p>
                </div>
              </div>
              <span className={`inline-flex items-center space-x-1 rounded-md border px-2 py-0.5 text-[9px] font-bold ${statusStyle}`}>
                {statusLabel === "Available"
                  ? <Radio className="h-3 w-3 text-emerald-500" />
                  : <AlertTriangle className="h-3 w-3" />}
                <span>{statusLabel}</span>
              </span>
            </div>

            <form id="otp-checkout" onSubmit={handleSubmit} className="space-y-6">

              {/* App / Platform */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-sm font-extrabold text-[#0F172A]">Select App</h2>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Choose which app you need to verify with this number.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((svc) => {
                    const appName = svc.platform.charAt(0).toUpperCase() + svc.platform.slice(1);
                    return (
                      <button key={svc.id} type="button" onClick={() => setSelectedServiceId(svc.id)}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          selectedServiceId === svc.id
                            ? "bg-[#4F46E5] text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}>
                        {appName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 flex items-start space-x-3">
                <Phone className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-[11px] font-semibold text-emerald-700 space-y-0.5">
                  <p>A real {countryName} number will be provisioned instantly after payment.</p>
                  <p className="font-medium text-emerald-600">The number remains active for 15–20 minutes to receive your code.</p>
                </div>
              </div>

              {/* Email */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Email <span className="font-medium text-slate-400 text-xs">(optional)</span></h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                />
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button key={m.id} type="button" onClick={() => setPayment(m.id)}
                        className={`flex items-center space-x-3 rounded-xl border p-4 text-left transition-all ${
                          payment === m.id ? "border-[#4F46E5] bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}>
                        <Icon className={`h-5 w-5 shrink-0 ${payment === m.id ? "text-[#4F46E5]" : "text-slate-400"}`} />
                        <div>
                          <p className={`text-xs font-extrabold ${payment === m.id ? "text-[#4F46E5]" : "text-slate-700"}`}>{m.label}</p>
                          <p className="text-[10px] font-medium text-slate-400">{m.sub}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {submitError && (
                <div className="flex items-center space-x-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="lg:hidden">
                <button type="submit" disabled={submitting}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99] disabled:opacity-60">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-white" />}
                  <span>{submitting ? "Processing…" : `Get Number · ${selectedService ? format(selectedService.sell_price) : "—"}`}</span>
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT — Summary */}
          <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-extrabold text-[#0F172A]">Order Summary</h2>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Country</span>
                  <span className="text-slate-700">{flag} {countryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">App</span>
                  <span className="text-slate-700">
                    {selectedService ? selectedService.platform.charAt(0).toUpperCase() + selectedService.platform.slice(1) : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Window</span>
                  <span className="text-[#4F46E5] font-bold">15–20 min</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-2xl font-extrabold text-[#4F46E5] font-mono">
                  {selectedService ? format(selectedService.sell_price) : "—"}
                </span>
              </div>
              <button type="submit" form="otp-checkout" disabled={submitting}
                className="hidden lg:flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99] disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-white" />}
                <span>{submitting ? "Processing…" : `Get Number · ${selectedService ? format(selectedService.sell_price) : "—"}`}</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>100% anonymous · Real carrier numbers · Instant</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
