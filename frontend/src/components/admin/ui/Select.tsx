"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export const Select: React.FC<SelectProps> = ({ label, className = "", children, id, ...props }) => {
  const { dark } = useAdminTheme();
  const selectId = id || `select_${Math.random().toString(36).slice(2)}`;
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={selectId} className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>{label}</label>}
      <select
        id={selectId}
        className={`h-10 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "border-white/10 bg-white/5 text-gray-100 focus:border-white/20" : "border-black/10 bg-white text-gray-800 focus:border-black/20"} ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};
