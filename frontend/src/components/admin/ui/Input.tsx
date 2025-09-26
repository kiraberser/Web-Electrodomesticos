"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
  error?: string;
};

export const Input: React.FC<InputProps> = ({ label, description, error, className = "", id, ...props }) => {
  const { dark } = useAdminTheme();
  const inputId = id || `input_${Math.random().toString(36).slice(2)}`;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-10 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-blue-500 ${dark ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 focus:border-white/20" : "border-black/10 bg-white text-gray-800 placeholder-gray-500 focus:border-black/20"} ${className}`}
        {...props}
      />
      {description && !error && <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{description}</p>}
      {error && <p className="text-xs text-[#EF4444]">{error}</p>}
    </div>
  );
};
