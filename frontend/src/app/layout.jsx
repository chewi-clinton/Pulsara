import "./globals.css";

export const metadata = {
  title: "Pulsara — SMM Growth & Virtual OTP Numbers",
  description: "The all-in-one platform for social media growth services and instant virtual OTP number provisioning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
