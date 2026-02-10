"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { dark } = useAdminTheme();
  return (
    <div
      className={`animate-pulse rounded-lg ${
        dark ? "bg-slate-700/40" : "bg-slate-200/60"
      } ${className}`}
    />
  );
};
