"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { api } from "../../../../lib/api";

const STATUS_STEPS = {
  pending_payment: 0,
  paid: 1,
  processing: 2,
  in_progress: 2,
  completed: 3,
  failed: 3,
  refunded: 3,
};

const STATUS_LABEL = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  processing: "Processing",
  in_progress: "In Progress",
  completed: "Completed",
  failed: "Failed",
  refunded: "Refunded",
};

const STATUS_BADGE = {
  pending_payment: "bg-slate-50 text-slate-500 border-slate-200",
  paid: "bg-indigo-50 text-[#4F46E5] border-indigo-100",
  processing: "bg-amber-50 text-amber-600 border-amber-100",
  in_progress: "bg-amber-50 text-amber-600 border-amber-100",
  completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
  failed: "bg-rose-50 text-rose-500 border-rose-100",
  refunded: "bg-slate-50 text-slate-500 border-slate-200",
};

export default function SMMOrderStatus() {
  const params = useParams();
  const orderId = Array.isArray(params.id) ? params.id[0] : params.id ?? "";

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    api.orders.getSmm(orderId)
      .then(setOrder)
      .catch(() => setError("Order not found."));

    const interval = setInterval(() => {
      api.orders.getSmm(orderId)
        .then((data) => {
          setOrder(data);
          if (["completed", "failed", "refunded"].includes(data.status)) {
            clearInterval(interval);
          }
        })
        .catch(() => {});
    }, 8000);

    return () => clearInterval(interval);
  }, [orderId]);

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

  const step = STATUS_STEPS[order.status] ?? 0;
  const badgeClass = STATUS_BADGE[order.status] ?? STATUS_BADGE.processing;

  const steps = [
    { label: "Payment Confirmed", done: step >= 1 },
    { label: "Order Submitted to Provider", done: step >= 2 },
    { label: "Delivery In Progress", done: step >= 3, active: step === 2 },
    { label: "Order Completed", done: order.status === "completed" },
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

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-6">

        {/* Header */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">SMM Order</p>
              <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] font-mono">{order.order_id}</h1>
            </div>
            <span className={`inline-flex items-center space-x-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${badgeClass}`}>
              <Clock className="h-3 w-3" />
              <span>{STATUS_LABEL[order.status] ?? order.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-50 pt-4">
            {[
              { label: "Service", value: order.service_name },
              { label: "Quantity", value: Number(order.quantity).toLocaleString() },
              { label: "Amount Paid", value: `$${parseFloat(order.sell_price).toFixed(2)}` },
              { label: "Placed On", value: new Date(order.created_at).toLocaleDateString() },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="text-xs font-extrabold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service details */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-50 pb-3">
            <ThumbsUp className="h-4 w-4 text-[#4F46E5]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Service Details</h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Service</span>
              <span className="font-bold text-slate-900">{order.service_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Target URL</span>
              <span className="font-bold text-[#4F46E5] truncate max-w-[200px]">{order.target_url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Quantity</span>
              <span className="font-bold font-mono text-slate-900">{Number(order.quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Payment</span>
              <span className="font-bold text-slate-900 capitalize">{order.payment_method}</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 border-b border-slate-50 pb-3">
            Order Timeline
          </h2>
          <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-[2px] before:bg-slate-100">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[23px] top-0.5 flex h-4 w-4 items-center justify-center bg-white rounded-full">
                  {s.done ? (
                    <CheckCircle2 className="h-4 w-4 text-[#4F46E5]" />
                  ) : s.active ? (
                    <Clock className="h-4 w-4 text-amber-400 animate-spin [animation-duration:6s]" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-slate-200" />
                  )}
                </span>
                <p className={`text-xs font-bold pt-0.5 ${s.done ? "text-slate-900" : s.active ? "text-amber-600" : "text-slate-300"}`}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] font-medium text-slate-400">
          Need help?{" "}
          <Link href="/faq" className="font-bold text-[#4F46E5] hover:underline">Visit our FAQ</Link>{" "}
          or contact support.
        </p>
      </main>
    </div>
  );
}
