"use client"; // Add this line to indicate the component is client-side

import type { Metadata } from "next";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname(); // Get current pathname

  // Define routes where the navbar should be hidden
  const hideNavbarRoutes = ["/dashboard", "/admin"];

  const isNavbarHidden = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en" data-theme="light">
      <body>
        {!isNavbarHidden && <Navbar />} {/* Conditionally render Navbar */}
        <div className="min-h-screen w-[100%] mx-auto">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
