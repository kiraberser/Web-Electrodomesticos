"use client";
import React from "react";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";

export const Modal: React.FC<{ open: boolean; title?: string; onClose: () => void; children: React.ReactNode; wide?: boolean }>
  = ({ open, title, onClose, children, wide = false }) => {
  const { dark } = useAdminTheme();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative z-10 max-h-[85vh] w-[92vw] ${wide ? "max-w-5xl" : "max-w-xl"} overflow-auto rounded-2xl border p-4 shadow-xl ${dark ? "border-white/10 bg-[#0F172A]" : "border-black/10 bg-white"}`}
        role="dialog" aria-modal="true">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={`text-sm font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
};
