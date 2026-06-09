"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "OTP Numbers", href: "#otp" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-12">

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#4F46E5]">
            Nexora
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-[#4F46E5]"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-900 transition-colors hover:text-[#4F46E5]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#4F46E5] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4338CA] hover:shadow-md"
          >
            Sign Up
          </Link>
          <button
            aria-label="Language / Region Selector"
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Globe className="h-5 w-5 stroke-[1.75]" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          <button
            aria-label="Language / Region Selector"
            className="text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Globe className="h-5 w-5 stroke-[1.75]" />
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-b border-slate-100 bg-white md:hidden"
          >
            <div className="space-y-1 px-6 pb-6 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#4F46E5]"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="my-4 border-slate-100" />
              <div className="flex flex-col space-y-3">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-md py-2.5 text-base font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center rounded-md bg-[#4F46E5] py-2.5 text-base font-semibold text-white shadow-sm hover:bg-[#4338CA]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
