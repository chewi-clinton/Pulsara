"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowLeftRight } from "lucide-react";

const USD_TO_FCFA = 655;

function getCurrency() {
  if (typeof window === "undefined") return "FCFA";
  return localStorage.getItem("pulsara_currency") || "FCFA";
}

function setCurrencyStore(c) {
  localStorage.setItem("pulsara_currency", c);
  window.dispatchEvent(new CustomEvent("currencychange", { detail: c }));
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "SMM Services", href: "/smm" },
  { label: "OTP Numbers", href: "/otp" },
  { label: "Track Order", href: "/track" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar({ activePage = "" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currency, setCurrencyState] = useState("FCFA");

  useEffect(() => {
    setCurrencyState(getCurrency());
    const handler = (e) => setCurrencyState(e.detail);
    window.addEventListener("currencychange", handler);
    return () => window.removeEventListener("currencychange", handler);
  }, []);

  const toggleCurrency = () => {
    const next = currency === "FCFA" ? "USD" : "FCFA";
    setCurrencyStore(next);
    setCurrencyState(next);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/" className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</a>

        <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-500 tracking-wide">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              activePage === label.toLowerCase().replace(" ", "-") ||
              activePage === href.replace("/", "") ||
              (href === "/" && activePage === "home");
            return (
              /* eslint-disable-next-line @next/next/no-html-link-for-pages */
              <a
                key={href}
                href={href}
                className={`transition-colors hover:text-slate-900 ${active ? "text-[#4F46E5] underline decoration-2 underline-offset-4" : ""}`}
              >
                {label}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={toggleCurrency}
            className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
          >
            <ArrowLeftRight className="h-3 w-3" />
            <span>{currency}</span>
          </button>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </a>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/smm" className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            Get Started
          </a>
        </div>

        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={toggleCurrency}
            className="inline-flex items-center space-x-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600"
          >
            <ArrowLeftRight className="h-3 w-3" />
            <span>{currency}</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pb-5 pt-2 space-y-1">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              activePage === label.toLowerCase().replace(" ", "-") ||
              (href === "/" && activePage === "home");
            return (
              /* eslint-disable-next-line @next/next/no-html-link-for-pages */
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                  active ? "bg-indigo-50 text-[#4F46E5]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {label}
              </a>
            );
          })}
          <div className="pt-3 pb-1 flex flex-col gap-2 border-t border-slate-100 mt-2">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/admin/login"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center rounded-xl border border-slate-200 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Login
            </a>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/smm"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center rounded-xl bg-[#4F46E5] py-2.5 text-sm font-bold text-white hover:bg-[#4338CA] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
