"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Link2,
  Minus,
  Plus,
  ShieldCheck,
  Zap,
  CreditCard,
  Bitcoin,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "../../../../lib/api";
import { useCurrency } from "../../../../lib/currency";

const paymentMethods = [
  { id: "cryptomus", label: "Crypto", sub: "BTC, ETH, USDT, LTC", icon: Bitcoin },
  { id: "notchpay", label: "Card / Mobile Money", sub: "Visa, MTN MoMo, Orange Money", icon: CreditCard },
];

export default function SMMCheckout() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(Array.isArray(params.id) ? params.id[0] : params.id);

  const { format } = useCurrency();
  const [service, setService] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [payment, setPayment] = useState("cryptomus");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    api.services.smmDetail(serviceId)
      .then((svc) => {
        setService(svc);
        setQuantity(svc.min_quantity);
      })
      .catch(() => setLoadError("Service not found."));
  }, [serviceId]);

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-slate-500">{loadError}</p>
          <Link href="/smm" className="text-xs font-bold text-[#4F46E5] hover:underline">← Back to services</Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  const pricePerK = parseFloat(service.sell_per_1000);
  const step = service.min_quantity >= 1000 ? 1000 : service.min_quantity >= 100 ? 100 : 50;
  const clamp = (v) => Math.min(service.max_quantity, Math.max(service.min_quantity, v));
  const total = ((quantity / 1000) * pricePerK).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const result = await api.orders.createSmm({
        service_id: service.id,
        target_url: targetUrl,
        quantity,
        payment_method: payment,
        customer_email: email || undefined,
      });

      if (result.payment_method === "notchpay" && result.redirect_url) {
        window.location.href = result.redirect_url;
        return;
      }

      // Cryptomus: go to our payment page
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        <Link href="/smm" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Services</span>
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* LEFT */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {service.platform.charAt(0).toUpperCase() + service.platform.slice(1)} · {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                </p>
                <p className="text-sm font-extrabold text-[#0F172A] mt-0.5">{service.name}</p>
              </div>
              <p className="text-sm font-extrabold text-[#4F46E5] shrink-0">{format(pricePerK)} / 1K</p>
            </div>

            <form id="smm-checkout" onSubmit={handleSubmit} className="space-y-6">

              {/* Target URL */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Target</h2>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Link2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Make sure your profile is <span className="font-bold text-slate-600">public</span> before placing the order.
                </p>
              </div>

              {/* Quantity */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Quantity</h2>
                <div className="flex items-center space-x-4">
                  <button type="button" onClick={() => setQuantity((q) => clamp(q - step))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={service.min_quantity}
                    max={service.max_quantity}
                    step={step}
                    onChange={(e) => setQuantity(clamp(Number(e.target.value)))}
                    className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-center text-sm font-extrabold text-slate-800 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                  />
                  <button type="button" onClick={() => setQuantity((q) => clamp(q + step))}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                  <span>Min: {service.min_quantity.toLocaleString()}</span>
                  <span>Max: {service.max_quantity.toLocaleString()}</span>
                </div>
              </div>

              {/* Email (optional) */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-3">
                <h2 className="text-sm font-extrabold text-[#0F172A]">Email <span className="font-medium text-slate-400 text-xs">(optional — for order updates)</span></h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                />
              </div>

              {/* Payment Method */}
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
                  <span>{submitting ? "Processing…" : `Place Order · ${format(total)}`}</span>
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
                  <span className="text-slate-400">Service</span>
                  <span className="text-slate-700 text-right max-w-[160px] truncate">{service.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity</span>
                  <span className="text-slate-700">{quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rate</span>
                  <span className="text-slate-700">{format(pricePerK)} / 1K</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">Total</span>
                <span className="text-2xl font-extrabold text-[#4F46E5] font-mono">{format(total)}</span>
              </div>
              <button type="submit" form="smm-checkout" disabled={submitting}
                className="hidden lg:flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99] disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 fill-white" />}
                <span>{submitting ? "Processing…" : `Place Order · ${format(total)}`}</span>
              </button>
            </div>
            <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Secured · No password required · Instant processing</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
