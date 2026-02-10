"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const Card: React.FC<{
  title?: string;
  description?: string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, description, right, className = "", children }) => {
  const { dark } = useAdminTheme();
  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        dark
          ? "border-slate-700/50 bg-slate-800/50"
          : "border-slate-200 bg-white shadow-sm shadow-slate-900/5"
      } ${className}`}
    >
      {(title || description || right) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && (
              <h3 className={`text-sm font-semibold ${dark ? "text-slate-100" : "text-slate-900"}`}>
                {title}
              </h3>
            )}
            {description && (
              <p className={`mt-0.5 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                {description}
              </p>
            )}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
};
