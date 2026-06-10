"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ArrowLeft,
  Phone,
  Radio,
  Loader2,
} from "lucide-react";
import { api, type OTPOrderStatus } from "../../../../lib/api";

export default function OTPOrderPage() {
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

  const [order, setOrder] = useState<OTPOrderStatus | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const load = () =>
      api.orders.getOtp(orderId)
        .then(setOrder)
        .catch(() => setError("Order not found."));

    load();
    const interval = setInterval(() => {
      api.orders.getOtp(orderId)
        .then((data) => {
          setOrder(data);
          if (["received", "expired", "cancelled"].includes(data.status)) {
            clearInterval(interval);
          }
        })
        .catch(() => {});
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  const handleCopy = async () => {
    if (!order?.phone_number) return;
    try {
      await navigator.clipboard.writeText(order.phone_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <p className="text-sm font-bold text-slate-500">{error}</p>
          <Link href="/track" className="text-xs font-bold text-[#4F46E5] hover:underline">← Track another order</Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="h-6 w-6 animate-spin text-[#4F46E5]" />
      </div>
    );
  }

  const seconds = order.seconds_remaining ?? 0;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  const STATUS_STEPS = [
    { step: "Payment Confirmed", done: order.status !== "pending_payment" },
    { step: "Number Provisioned", done: !!order.phone_number },
    { step: `Waiting for SMS from ${order.platform}`, done: order.status === "received", active: order.status === "waiting_sms" },
    { step: "Code Received", done: order.status === "received" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <header className="border-b border-slate-100 bg-white px-6 lg:px-16 py-4 flex items-center justify-between">
        <span className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</span>
        <Link href="/track" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Track Another Order</span>
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">OTP Order</p>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] font-mono">{order.order_id}</h1>
            </div>
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-600">
              <Radio className="h-3 w-3 animate-ping" />
              <span>{order.status === "received" ? "Code Received" : "Awaiting SMS"}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-50 pt-4">
            {[
              { label: "Country", value: order.country },
              { label: "App", value: order.platform.charAt(0).toUpperCase() + order.platform.slice(1) },
              { label: "Amount Paid", value: `$${parseFloat("0").toFixed(2)}` },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-xs font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* OTP code — visible once received */}
        {order.otp_code && (
          <div className="rounded-2xl border border-[#4F46E5]/20 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-[#10B981]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Your OTP Code</h2>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-slate-200 px-4 py-3">
              <span className="font-mono text-2xl font-extrabold tracking-widest text-[#0F172A]">{order.otp_code}</span>
              <button onClick={handleCopy} className="text-slate-400 hover:text-[#4F46E5] transition-colors" title="Copy code">
                {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Provisioned number */}
        {order.phone_number && (
          <div className="rounded-2xl border border-[#4F46E5]/20 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
              <Phone className="h-4 w-4 text-[#4F46E5]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Provisioned Number</h2>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] border border-slate-200 px-4 py-3">
              <span className="font-mono text-base font-extrabold tracking-wider text-[#0F172A]">{order.phone_number}</span>
              <button onClick={handleCopy} className="text-slate-400 hover:text-[#4F46E5] transition-colors" title="Copy number">
                {copied ? <Check className="h-4 w-4 text-[#10B981]" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
              Enter this number in {order.platform} to receive your verification code.
              {order.status === "waiting_sms" && " The number will remain active for the duration shown below."}
            </p>
          </div>
        )}

        {/* Countdown — only while waiting */}
        {order.status === "waiting_sms" && seconds > 0 && (
          <div className="rounded-2xl border border-slate-100 bg-[#0F172A] p-6 shadow-sm space-y-3 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Time Remaining</p>
            <p className="text-4xl font-extrabold font-mono tracking-widest">{mins}:{secs}</p>
            <p className="text-[10px] font-semibold text-slate-500">Number expires when timer reaches 0:00</p>
          </div>
        )}

        {/* Message console */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Status</h2>
            {order.status === "waiting_sms" && (
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-slate-400">
                <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-400" />
                <span>Listening</span>
              </span>
            )}
          </div>
          <div className="space-y-2">
            {STATUS_STEPS.map((s, i) => (
              <div key={i} className="flex items-center space-x-3 text-xs font-semibold">
                {s.done ? (
                  <CheckCircle2 className="h-4 w-4 text-[#4F46E5] shrink-0" />
                ) : s.active ? (
                  <Radio className="h-4 w-4 text-amber-400 shrink-0 animate-pulse" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-slate-200 shrink-0" />
                )}
                <span className={s.done ? "text-slate-900" : s.active ? "text-amber-600" : "text-slate-300"}>
                  {s.step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400">
          Didn&apos;t receive a code?{" "}
          <Link href="/faq" className="font-bold text-[#4F46E5] hover:underline">See troubleshooting tips</Link>
        </p>
      </main>
    </div>
  );
}
