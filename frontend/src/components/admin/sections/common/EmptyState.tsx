"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const EmptyState: React.FC<{ icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }>
  = ({ icon, title, description, action }) => {
  const { dark } = useAdminTheme();
  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-8 text-center ${dark ? "border-white/10" : "border-black/10"}`}>
      <div className={`${dark ? "text-gray-400" : "text-gray-500"}`}>{icon ?? <span className={`inline-block h-8 w-8 rounded ${dark ? "bg-white/10" : "bg-black/5"}`} />}</div>
      <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-900"}`}>{title}</p>
      {description && <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{description}</p>}
      {action}
    </div>
  );
};
