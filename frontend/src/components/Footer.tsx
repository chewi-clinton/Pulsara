"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Platform",
      links: [
        { label: "Services", href: "#services" },
        { label: "OTP Numbers", href: "#otp" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "FAQ", href: "#faq" },
        { label: "Support Center", href: "#support" },
        { label: "API Docs", href: "#docs" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-slate-100 py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">

          {/* Brand Column */}
          <div className="col-span-2 flex flex-col justify-between md:col-span-1">
            <div className="space-y-4">
              <Link href="/" className="text-xl font-bold tracking-tight text-[#0F172A]">
                Nexora
              </Link>
              <p className="text-xs leading-relaxed text-slate-500 max-w-[200px]">
                © {currentYear} Nexora Digital. All rights reserved.
              </p>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="flex flex-col space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-600 transition-colors hover:text-[#4F46E5]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>
    </footer>
  );
}
