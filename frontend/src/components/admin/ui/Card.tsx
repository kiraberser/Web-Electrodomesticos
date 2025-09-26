"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const Card: React.FC<{ title?: string; description?: string; right?: React.ReactNode; className?: string; children: React.ReactNode }>
  = ({ title, description, right, className = "", children }) => {
  const { dark } = useAdminTheme();
  return (
    <div className={`rounded-2xl border p-4 shadow-sm shadow-black/10 ${dark ? "border-white/10 bg-[#0F172A]" : "border-black/10 bg-white"} ${className}`}>
      {(title || description || right) && (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            {title && <h3 className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>{title}</h3>}
            {description && <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{description}</p>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
};
