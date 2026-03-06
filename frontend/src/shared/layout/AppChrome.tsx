import React from "react";
import Navbar from "@/shared/layout/Navbar";
import Footer from "@/shared/layout/Footer";

interface AppChromeProps {
  children: React.ReactNode;
  username?: string;
  isAdmin?: boolean;
}

export function AppChrome({ children, username, isAdmin = false }: AppChromeProps) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-[#0A3981] focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:shadow-lg focus:outline-none"
      >
        Saltar al contenido
      </a>
      <Navbar username={username} isAdmin={isAdmin} />
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
      <Footer username={username} />
    </>
  );
}
