import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nexora — SMM Growth & Virtual OTP Numbers",
  description: "The all-in-one platform for social media growth services and instant virtual OTP number provisioning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
