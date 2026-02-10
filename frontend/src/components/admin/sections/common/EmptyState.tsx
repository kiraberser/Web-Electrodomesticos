"use client";
import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import { Inbox } from "lucide-react";

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ icon, title, description, action }) => {
  const { dark } = useAdminTheme();
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center ${
        dark ? "border-slate-700/50" : "border-slate-200"
      }`}
    >
      <div className={`${dark ? "text-slate-500" : "text-slate-400"}`}>
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <p className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>{title}</p>
      {description && (
        <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-500"}`}>{description}</p>
      )}
      {action}
    </div>
  );
};
