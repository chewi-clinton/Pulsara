"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { api } from "../../lib/api";

const TERMINAL = ["paid", "processing", "failed"];

function orderPageUrl(orderId) {
  if (orderId.startsWith("smm_")) return `/order/smm/${orderId}`;
  if (orderId.startsWith("otp_")) return `/order/otp/${orderId}`;
  return "/track";
}

async function fetchStatus(orderId) {
  try {
    let status;
    if (orderId.startsWith("smm_")) {
      const data = await api.orders.getSmm(orderId);
      status = data.status;
    } else {
      const data = await api.orders.getOtp(orderId);
      status = data.status;
    }
    if (status === "pending_payment") return "pending";
    if (["paid", "waiting_sms"].includes(status)) return "paid";
    if (["processing", "in_progress", "received"].includes(status)) return "processing";
    if (["failed", "expired", "cancelled"].includes(status)) return "failed";
    return "pending";
  } catch {
    return "pending";
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const params = useSearchParams();

  const orderId = params.get("order_id") ?? "";
  const method = params.get("method") ?? "cryptomus";
  const paymentUrl = params.get("payment_url") ?? "";
  const amount = params.get("amount") ?? "";
  const expiresAt = Number(params.get("expires") ?? 0);
  const verifying = params.get("verifying") === "1";

  const [pollStatus, setPollStatus] = useState("pending");
  const [secondsLeft, setSecondsLeft] = useState(() =>
    expiresAt ? Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) : 900
  );
  const pollRef = useRef(null);
  const timerRef = useRef(null);

  // Countdown
  useEffect(() => {
    timerRef.current = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Poll order status every 5 s
  useEffect(() => {
    if (!orderId) return;
    const poll = async () => {
      const st = await fetchStatus(orderId);
      setPollStatus(st);
      if (TERMINAL.includes(st) && pollRef.current) clearInterval(pollRef.current);
    };
    poll();
    pollRef.current = setInterval(poll, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [orderId]);

  // Auto-redirect on confirmation
  useEffect(() => {
    if (pollStatus === "paid" || pollStatus === "processing") {
      const t = setTimeout(() => router.push(orderPageUrl(orderId)), 2000);
      return () => clearTimeout(t);
    }
  }, [pollStatus, orderId, router]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const expired = secondsLeft === 0;

  // Confirmed
  if (pollStatus === "paid" || pollStatus === "processing") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-sans antialiased px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-[#10B981]" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0F172A]">Payment Confirmed</h1>
          <p className="text-xs text-slate-400 font-medium">Redirecting you to your order…</p>
          <Loader2 className="h-5 w-5 animate-spin text-[#4F46E5] mx-auto" />
        </div>
      </div>
    );
  }

  // Failed
  if (pollStatus === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-sans antialiased px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mx-auto">
            <XCircle className="h-8 w-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-extrabold text-[#0F172A]">Payment Failed</h1>
          <p className="text-xs text-slate-400 font-medium">
            Something went wrong. Please try again or contact support.
          </p>
          <Link href="/track"
            className="inline-block rounded-xl bg-[#4F46E5] px-6 py-3 text-sm font-bold text-white hover:bg-[#4338CA] transition-colors">
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  // NotchPay verifying
  if (method === "notchpay" && verifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-sans antialiased px-4">
        <div className="w-full max-w-sm text-center space-y-5">
          <Loader2 className="h-10 w-10 animate-spin text-[#4F46E5] mx-auto" />
          <h1 className="text-lg font-extrabold text-[#0F172A]">Verifying Payment</h1>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Please wait while we confirm your payment with NotchPay.
            This usually takes a few seconds.
          </p>
          <p className="text-[10px] font-semibold text-slate-300">Order: {orderId}</p>
        </div>
      </div>
    );
  }

  // Cryptomus awaiting
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] font-sans antialiased px-4 py-12">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <Link href="/" className="text-2xl font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
          <p className="text-xs font-medium text-slate-400 mt-1">Complete your payment</p>
        </div>

        {/* Amount */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount Due</p>
          <p className="text-4xl font-extrabold text-[#0F172A] font-mono">${amount}</p>
          <p className="text-[10px] font-semibold text-slate-400">Order: {orderId}</p>
        </div>

        {/* Countdown */}
        {!expired ? (
          <div className="rounded-2xl border border-slate-100 bg-[#0F172A] p-5 text-center space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Payment Window</p>
            <p className="text-3xl font-extrabold font-mono text-white tracking-widest">{mins}:{secs}</p>
            <p className="text-[10px] font-semibold text-slate-500">Complete payment before the timer expires</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-center space-y-1">
            <p className="text-sm font-extrabold text-rose-600">Payment window expired</p>
            <p className="text-[11px] font-medium text-rose-400">Please start a new order.</p>
            <Link href="/smm" className="inline-block mt-2 text-xs font-bold text-[#4F46E5] hover:underline">
              Back to services
            </Link>
          </div>
        )}

        {/* Pay button */}
        {!expired && paymentUrl && (
          <a
            href={paymentUrl}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-4 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all"
          >
            <span>Pay Now via Cryptomus</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        )}

        {/* Polling indicator */}
        <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-[#4F46E5]" />
          <span>Listening for payment confirmation…</span>
        </div>

        <p className="text-center text-[10px] font-medium text-slate-300">
          This page updates automatically. Do not close this tab.
        </p>
      </div>
    </div>
  );
}
