"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  CreditCard,
  Smartphone,
  ChevronDown,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Radio,
} from "lucide-react";

/* ─── types ───────────────────────────────────────────────────── */
type CryptoStatus = "awaiting" | "detected" | "confirming" | "confirmed" | "expired";
type CardStatus   = "form" | "processing" | "confirmed";

/* ─── constants ───────────────────────────────────────────────── */
const cryptoOptions = [
  { symbol: "USDT", name: "Tether (TRC-20)", rate: 1,        network: "TRC-20" },
  { symbol: "BTC",  name: "Bitcoin",          rate: 0.000016, network: "Bitcoin" },
  { symbol: "ETH",  name: "Ethereum",         rate: 0.00052,  network: "ERC-20" },
  { symbol: "LTC",  name: "Litecoin",         rate: 0.013,    network: "Litecoin" },
];

const mobileNetworks = ["MTN MoMo", "Orange Money", "Airtel Money", "M-Pesa"];
const PAYMENT_WINDOW = 15 * 60;

function pad(n: number) { return String(n).padStart(2, "0"); }

/* ─── polling stub ────────────────────────────────────────────────
   Replace this with:  fetch(`/api/orders/${orderId}/payment-status`)
   Backend sets status via CryptoMus webhook when tx is confirmed.
─────────────────────────────────────────────────────────────────── */
async function pollPaymentStatus(_orderId: string): Promise<CryptoStatus> {
  return "awaiting"; // backend not connected yet
}

export default function PaymentPage() {
  const router  = useRouter();
  const params  = useSearchParams();

  const method   = params.get("method") ?? "crypto";
  const amount   = params.get("amount") ?? "0.00";
  const orderId  = params.get("orderId") ?? "";
  const redirect = params.get("redirect") ?? "/";

  /* ── crypto state ─────────────────────────────────────────── */
  const [coin,          setCoin]          = useState(cryptoOptions[0]);
  const [copied,        setCopied]        = useState(false);
  const [timeLeft,      setTimeLeft]      = useState(PAYMENT_WINDOW);
  const [cryptoStatus,  setCryptoStatus]  = useState<CryptoStatus>("awaiting");
  const [confirmations, setConfirmations] = useState(0);

  /* ── card / mobile state ──────────────────────────────────── */
  const [payTab,     setPayTab]     = useState<"card" | "mobile">("card");
  const [cardNum,    setCardNum]    = useState("");
  const [cardName,   setCardName]   = useState("");
  const [expiry,     setExpiry]     = useState("");
  const [cvv,        setCvv]        = useState("");
  const [phone,      setPhone]      = useState("");
  const [network,    setNetwork]    = useState(mobileNetworks[0]);
  const [netOpen,    setNetOpen]    = useState(false);
  const [cardStatus, setCardStatus] = useState<CardStatus>("form");

  /* ── countdown ────────────────────────────────────────────── */
  useEffect(() => {
    if (method !== "crypto" || cryptoStatus === "confirmed") return;
    if (timeLeft <= 0) { setCryptoStatus("expired"); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [method, timeLeft, cryptoStatus]);

  /* ── polling loop (crypto only) ───────────────────────────── */
  useEffect(() => {
    if (method !== "crypto") return;
    if (cryptoStatus === "confirmed" || cryptoStatus === "expired") return;

    const id = setInterval(async () => {
      const status = await pollPaymentStatus(orderId);
      if (status === "detected" || status === "confirming") {
        setCryptoStatus("confirming");
        setConfirmations((c) => Math.min(c + 1, 3));
      }
      if (status === "confirmed") {
        setCryptoStatus("confirmed");
        clearInterval(id);
        setTimeout(() => router.push(redirect), 2500);
      }
    }, 5000); // polls every 5 seconds

    return () => clearInterval(id);
  }, [method, cryptoStatus, orderId, redirect, router]);

  /* ── helpers ──────────────────────────────────────────────── */
  /* In production this address comes from the backend (unique per order via CryptoMus).
     Static addresses here are placeholders only — never share the same address across orders. */
  const walletAddress = coin.symbol === "USDT"
    ? "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
    : coin.symbol === "BTC"
    ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
    : coin.symbol === "ETH"
    ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    : "LX2cSqmDMurFSFVdHUBR7nkQEJvCgBDHnF";

  const cryptoAmount = (parseFloat(amount) * coin.rate).toFixed(
    coin.symbol === "BTC" ? 6 : coin.symbol === "ETH" ? 5 : 2
  );

  const copyAddress = useCallback(async () => {
    try { await navigator.clipboard.writeText(walletAddress); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [walletAddress]);

  const formatCard   = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => v.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardStatus("processing");
    /* In production: call backend → backend calls Flutterwave API → Flutterwave
       redirects user to hosted checkout or sends mobile money push.
       Backend receives webhook when payment succeeds and flips order status. */
    setTimeout(() => {
      setCardStatus("confirmed");
      setTimeout(() => router.push(redirect), 2000);
    }, 3000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const pct     = (timeLeft / PAYMENT_WINDOW) * 100;

  /* ── render ───────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</Link>
        {cryptoStatus !== "confirmed" && cardStatus !== "confirmed" && (
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto px-6 py-12 space-y-6">

        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-[#0F172A]">Complete Payment</h1>
          <p className="text-xs font-medium text-slate-400">
            Amount due:{" "}
            <span className="font-extrabold text-[#4F46E5]">${parseFloat(amount).toFixed(2)} USD</span>
          </p>
        </div>

        {/* ════════════════ CRYPTO FLOW ════════════════ */}
        {method === "crypto" && (
          <>
            {/* Expired */}
            {cryptoStatus === "expired" && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center space-y-3">
                <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto" />
                <p className="text-sm font-extrabold text-rose-700">Payment Window Expired</p>
                <p className="text-xs font-medium text-rose-500">The 15-minute payment session has closed. Please start a new order.</p>
                <Link href="/smm" className="inline-block mt-2 text-xs font-bold text-[#4F46E5] hover:underline">
                  Back to Services
                </Link>
              </div>
            )}

            {/* Confirmed */}
            {cryptoStatus === "confirmed" && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-extrabold text-emerald-700">Payment Confirmed</p>
                <p className="text-xs font-medium text-emerald-600">Transaction verified on-chain. Redirecting to your order...</p>
                <Loader2 className="h-4 w-4 text-emerald-500 mx-auto animate-spin mt-2" />
              </div>
            )}

            {/* Awaiting / Confirming */}
            {(cryptoStatus === "awaiting" || cryptoStatus === "confirming") && (
              <>
                {/* Countdown */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <Clock className="h-3.5 w-3.5 text-[#4F46E5]" />
                      <span>Session expires in</span>
                    </div>
                    <span className={`font-mono text-sm ${timeLeft < 120 ? "text-rose-500" : "text-[#4F46E5]"}`}>
                      {pad(minutes)}:{pad(seconds)}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${timeLeft < 120 ? "bg-rose-400" : "bg-[#4F46E5]"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {timeLeft < 120 && (
                    <p className="flex items-center space-x-1.5 text-[11px] font-semibold text-rose-500">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      <span>Session expiring — complete your transfer now.</span>
                    </p>
                  )}
                </div>

                {/* Coin selector */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                  <h2 className="text-sm font-extrabold text-[#0F172A]">Select Cryptocurrency</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {cryptoOptions.map((c) => (
                      <button
                        key={c.symbol}
                        type="button"
                        onClick={() => setCoin(c)}
                        className={`flex flex-col items-start rounded-xl border p-3 text-left transition-all ${
                          coin.symbol === c.symbol
                            ? "border-[#4F46E5] bg-indigo-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span className={`text-xs font-extrabold ${coin.symbol === c.symbol ? "text-[#4F46E5]" : "text-slate-700"}`}>
                          {c.symbol}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address + amount */}
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                  <div className="rounded-xl bg-slate-50 p-4 text-center space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Send exactly</p>
                    <p className="text-2xl font-extrabold text-[#0F172A] font-mono">
                      {cryptoAmount} <span className="text-[#4F46E5]">{coin.symbol}</span>
                    </p>
                    <p className="text-[11px] font-medium text-slate-400">≈ ${parseFloat(amount).toFixed(2)} USD · {coin.network}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500 tracking-wide">Wallet Address</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-[11px] text-slate-700 break-all select-all">
                        {walletAddress}
                      </div>
                      <button
                        type="button"
                        onClick={copyAddress}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
                      </button>
                    </div>
                    <p className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Send only <strong>{coin.symbol}</strong> on the <strong>{coin.network}</strong> network. Wrong asset or network = permanent loss.
                    </p>
                  </div>
                </div>

                {/* Polling status */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  {cryptoStatus === "awaiting" ? (
                    <div className="flex items-center space-x-3">
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
                        <Radio className="h-4 w-4 text-[#4F46E5] animate-pulse" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-700">Waiting for your transfer</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Monitoring the blockchain automatically — this page will update when your transaction is detected. Do not close this tab.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">Confirmations</span>
                        <span className="text-[#4F46E5]">{confirmations} / 3</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#4F46E5] transition-all duration-700"
                          style={{ width: `${(confirmations / 3) * 100}%` }}
                        />
                      </div>
                      <p className="text-[11px] font-medium text-slate-400">Transaction detected. Waiting for network confirmations...</p>
                    </div>
                  )}
                </div>

                <p className="text-center text-[11px] font-medium text-slate-400">
                  Confirmation is fully automatic. You do not need to do anything else.
                </p>
              </>
            )}
          </>
        )}

        {/* ════════════════ CARD / MOBILE FLOW ════════════════ */}
        {method === "card" && (
          <>
            {/* Confirmed */}
            {cardStatus === "confirmed" && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-extrabold text-emerald-700">Payment Approved</p>
                <p className="text-xs font-medium text-emerald-600">Redirecting to your order...</p>
                <Loader2 className="h-4 w-4 text-emerald-500 mx-auto animate-spin mt-2" />
              </div>
            )}

            {/* Processing */}
            {cardStatus === "processing" && (
              <div className="rounded-2xl border border-slate-100 bg-white p-10 shadow-sm text-center space-y-4">
                <Loader2 className="h-8 w-8 text-[#4F46E5] mx-auto animate-spin" />
                <p className="text-sm font-extrabold text-[#0F172A]">Processing Payment</p>
                <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto">
                  {payTab === "mobile"
                    ? "A push notification has been sent to your phone. Approve it to complete the payment."
                    : "Verifying your card with the payment processor. Please wait."}
                </p>
              </div>
            )}

            {/* Form */}
            {cardStatus === "form" && (
              <>
                <div className="rounded-2xl border border-slate-100 bg-white p-1.5 shadow-sm flex">
                  <button
                    type="button"
                    onClick={() => setPayTab("card")}
                    className={`flex flex-1 items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      payTab === "card" ? "bg-[#4F46E5] text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Debit / Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayTab("mobile")}
                    className={`flex flex-1 items-center justify-center space-x-2 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      payTab === "mobile" ? "bg-[#4F46E5] text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile Money</span>
                  </button>
                </div>

                <form onSubmit={handleCardSubmit} className="space-y-6">

                  {payTab === "card" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h2 className="text-sm font-extrabold text-[#0F172A]">Card Details</h2>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 tracking-wide">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 tracking-wide">Card Number</label>
                        <div className="relative">
                          <CreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            value={cardNum}
                            onChange={(e) => setCardNum(formatCard(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            required
                            maxLength={19}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-mono text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors tracking-wider"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 tracking-wide">Expiry</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/YY"
                            required
                            maxLength={5}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-500 tracking-wide">CVV</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                            placeholder="•••"
                            required
                            maxLength={4}
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {payTab === "mobile" && (
                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                      <h2 className="text-sm font-extrabold text-[#0F172A]">Mobile Money</h2>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 tracking-wide">Network</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setNetOpen((o) => !o)}
                            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                          >
                            <span>{network}</span>
                            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${netOpen ? "rotate-180" : ""}`} />
                          </button>
                          {netOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border border-slate-100 bg-white shadow-lg overflow-hidden">
                              {mobileNetworks.map((n) => (
                                <button
                                  key={n}
                                  type="button"
                                  onClick={() => { setNetwork(n); setNetOpen(false); }}
                                  className={`w-full px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-slate-50 ${
                                    network === n ? "text-[#4F46E5] bg-indigo-50" : "text-slate-700"
                                  }`}
                                >
                                  {n}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500 tracking-wide">Mobile Number</label>
                        <div className="relative">
                          <Smartphone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 12))}
                            placeholder="6XXXXXXXXX"
                            required
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-mono text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                          />
                        </div>
                        <p className="text-[11px] font-medium text-slate-400">
                          A push notification will be sent to approve the payment.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all active:scale-[0.99]"
                  >
                    <span>Pay ${parseFloat(amount).toFixed(2)}</span>
                  </button>
                </form>
              </>
            )}
          </>
        )}

        <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
          <span>256-bit SSL · Payments processed securely</span>
        </div>

      </main>
    </div>
  );
}
