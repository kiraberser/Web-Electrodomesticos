"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/shared/layout/Navbar";
import Footer from "@/shared/layout/Footer";

export function AppChrome({ children, username }: { children: React.ReactNode; username?: string }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  if (isAdmin) return <>{children}</>;
  return (
    <>
      <Navbar username={username} />
      {children}
      <Footer username={username} />
    </>
  );
}
