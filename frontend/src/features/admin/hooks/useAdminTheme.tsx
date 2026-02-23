"use client";

import React, { createContext, useContext } from "react";

type AdminTheme = {
  dark: boolean;
  setDark: (v: boolean) => void;
  toggle: () => void;
};

const AdminThemeContext = createContext<AdminTheme | undefined>(undefined);

export function useAdminTheme(): AdminTheme {
  const ctx = useContext(AdminThemeContext);
  if (!ctx) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return ctx;
}

export function AdminThemeProvider({
  value,
  children,
}: {
  value: AdminTheme;
  children: React.ReactNode;
}) {
  return <AdminThemeContext.Provider value={value}>{children}</AdminThemeContext.Provider>;
}


