"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    console.log("Creating account...", { fullName, email });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#FFFFFF] p-4 font-sans text-slate-600 antialiased overflow-hidden">

      {/* Dot grid background */}
      <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#94A3B8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-lg space-y-6 text-center">

        {/* Brand */}
        <div className="space-y-1">
          <Link href="/" className="inline-block text-3xl font-black tracking-tight text-[#4F46E5]">
            Pulsara
          </Link>
          <p className="text-xs font-medium text-slate-400">
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl text-left">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-300 focus:border-[#4F46E5] focus:outline-none focus:ring-1 focus:ring-[#4F46E5] transition-colors font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 tracking-wide">
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-11 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 transition-colors font-mono tracking-wider ${
                    passwordsMatch
                      ? "border-slate-200 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                      : "border-rose-300 focus:border-rose-400 focus:ring-rose-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!passwordsMatch && (
                <p className="text-[11px] font-semibold text-rose-500">Passwords do not match.</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3 pt-1">
              <button
                type="button"
                onClick={() => setAgreed(!agreed)}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  agreed ? "bg-[#4F46E5]" : "bg-slate-200"
                }`}
                role="switch"
                aria-checked={agreed}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    agreed ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs font-medium text-slate-500 leading-relaxed select-none">
                I agree to the{" "}
                <button type="button" className="font-bold text-[#4F46E5] hover:underline">Terms of Service</button>
                {" "}and{" "}
                <button type="button" className="font-bold text-[#4F46E5] hover:underline">Privacy Policy</button>
              </span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!agreed || !passwordsMatch}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4F46E5] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#4338CA] transition-all hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4F46E5] disabled:active:scale-100"
              >
                <span>Create Account</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

          </form>

          <hr className="my-6 border-slate-100" />

          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <div className="flex items-center space-x-1.5 text-slate-500">
              <ShieldCheck className="h-4 w-4 text-slate-400 stroke-[2]" />
              <span>256-bit SSL Encryption</span>
            </div>
            <button type="button" className="text-slate-500 hover:text-slate-700 transition-colors">
              Support Center
            </button>
          </div>
        </div>

        {/* Login link */}
        <p className="text-xs font-medium text-slate-400">
          Already have an account?{" "}
          <Link href="/admin/login" className="font-bold text-[#4F46E5] hover:text-[#4338CA] transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
