"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Footer from "../../components/Footer";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  Truck,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Globe
} from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: FAQItem[];
}

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "otp-2": true,
  });

  const categories: FAQCategory[] = useMemo(() => [
    {
      id: "orders",
      title: "Orders & Delivery",
      icon: <Truck className="h-4 w-4 text-[#4F46E5]" />,
      items: [
        {
          id: "ord-1",
          question: "How long does it take to process an order?",
          answer: "Orders process automatically upon payment verification. SMM allocations begin dropping instantly into the pipeline, while virtual numbers are generated on-demand with real-time provisioning logs."
        },
        {
          id: "ord-2",
          question: "Can I cancel or modify my order after placement?",
          answer: "Because our automation layer hooks directly into upstream providers immediately upon payment success, orders that have entered processing status cannot be changed or recalled."
        }
      ]
    },
    {
      id: "otp",
      title: "OTP Numbers",
      icon: <Smartphone className="h-4 w-4 text-[#4F46E5]" />,
      items: [
        {
          id: "otp-1",
          question: "How long are OTP numbers valid for?",
          answer: "Provisioned temporary virtual numbers remain open and active for a baseline window of 15 to 20 minutes to receive verification payloads before returning to the carrier pool."
        },
        {
          id: "otp-2",
          question: "Why didn't I receive my verification code?",
          answer: (
            <div className="space-y-3">
              <p>There are a few reasons this might happen:</p>
              <ul className="list-disc pl-5 space-y-1 text-slate-500">
                <li>The service you are trying to verify with may be experiencing delays.</li>
                <li>The specific number you were assigned may be blocked by the service.</li>
                <li>You may have selected the wrong service or country.</li>
              </ul>
              <p className="pt-1">If you don&apos;t receive a code within 5 minutes, we recommend cancelling the current number and requesting a new one.</p>
            </div>
          )
        }
      ]
    },
    {
      id: "payments",
      title: "Payments",
      icon: <CreditCard className="h-4 w-4 text-[#4F46E5]" />,
      items: [
        {
          id: "pay-1",
          question: "What payment methods do you accept?",
          answer: "We support decentralized transactions via CryptoMus (Bitcoin, Tether, Ethereum, Litecoin) as well as global card and regional mobile money frameworks via Flutterwave."
        }
      ]
    },
    {
      id: "security",
      title: "Account Security",
      icon: <ShieldCheck className="h-4 w-4 text-[#4F46E5]" />,
      items: [
        {
          id: "sec-1",
          question: "How are my platform API access tokens secured?",
          answer: "All generated enterprise connection strings are hashed client-side before transmission and locked behind multi-tenant isolated relational layers using 256-bit SSL encryption standards."
        }
      ]
    }
  ], []);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        if (selectedCategory !== "all" && cat.id !== selectedCategory) {
          return { ...cat, items: [] };
        }

        const items = cat.items.filter((item) => {
          const matchQuery =
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof item.answer === "string" &&
              item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchQuery;
        });

        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-black tracking-tight text-[#4F46E5]">Pulsara</span>
        </div>
        <nav className="flex items-center space-x-8 text-xs font-bold text-slate-500 tracking-wide">
          <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link href="/smm" className="hover:text-slate-900 transition-colors">SMM Services</Link>
          <Link href="/otp" className="hover:text-slate-900 transition-colors">OTP Numbers</Link>
          <Link href="/track" className="hover:text-slate-900 transition-colors">Track Order</Link>
          <Link href="/faq" className="text-[#4F46E5] underline decoration-2 underline-offset-4">FAQ</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/admin/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Login
          </Link>
          <Link href="/register" className="rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
            Sign Up
          </Link>
          <button type="button" className="text-slate-400 hover:text-slate-600">
            <Globe className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* HERO SEARCH */}
      <section className="bg-white border-b border-slate-100 px-6 py-16 text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#0F172A]">
            How can we help?
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Search our knowledge base or browse categories below to find answers to common questions about Pulsara services.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-xs font-medium bg-white rounded-xl border border-slate-200 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
              selectedCategory === "all"
                ? "bg-[#4F46E5] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            All Questions
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#4F46E5] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-6xl mx-auto px-6 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* SIDEBAR CATEGORIES */}
          <aside className="hidden lg:block space-y-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
              Categories
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                  selectedCategory === "all"
                    ? "bg-slate-100 text-[#4F46E5]"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>All Framework Categories</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? "bg-slate-100 text-[#4F46E5]"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{cat.title}</span>
                  <span className="text-[10px] opacity-60">({cat.items.length})</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ACCORDION CONTENT */}
          <div className="lg:col-span-3 space-y-10">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div key={category.id} className="space-y-4">

                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-100">
                    <div className="p-1.5 bg-slate-100 rounded-lg">
                      {category.icon}
                    </div>
                    <h2 className="text-sm font-extrabold tracking-tight text-slate-800">
                      {category.title}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {category.items.map((item) => {
                      const isOpen = !!expandedItems[item.id];
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                          >
                            <span>{item.question}</span>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-5 pb-5 pt-1 text-xs font-medium text-slate-500 border-t border-slate-50 leading-relaxed bg-white">
                              {item.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-6">
                <p className="text-xs font-bold text-slate-400">No matching help articles found.</p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="mt-2 text-xs font-bold text-[#4F46E5] hover:underline"
                >
                  Reset all selection parameters
                </button>
              </div>
            )}

            {/* SUPPORT CTA */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 text-center space-y-5 shadow-sm">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#0F172A]">Still need help?</h3>
                <p className="text-xs text-slate-400 font-medium max-w-md mx-auto leading-normal">
                  Can&apos;t find the answer you&apos;re looking for? Our support team is available 24/7 to assist you with any technical issues.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl bg-[#4F46E5] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#4338CA] transition-colors">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Contact Support</span>
                </button>
                <button type="button" className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Read API Docs</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
