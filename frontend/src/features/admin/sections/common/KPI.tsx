"use client";

import React from "react";
import { Card } from "@/features/admin/ui/Card";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";
import { TrendingUp, TrendingDown } from "lucide-react";

export const KPI: React.FC<{
  label: string;
  value: string;
  deltaPct?: number;
  hint?: string;
  icon?: React.ReactNode;
  accentColor?: "blue" | "emerald" | "amber" | "red" | "slate";
}> = ({ label, value, deltaPct, hint, icon, accentColor = "slate" }) => {
  const { dark } = useAdminTheme();
  const positive = deltaPct !== undefined && deltaPct >= 0;
  const hasDelta = deltaPct !== undefined;

  const accentMap = {
    blue: dark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600",
    emerald: dark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600",
    amber: dark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600",
    red: dark ? "bg-red-500/10 text-red-400" : "bg-red-50 text-red-600",
    slate: dark ? "bg-slate-500/10 text-slate-400" : "bg-slate-100 text-slate-600",
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start gap-3">
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${accentMap[accentColor]}`}>
            {icon}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-xs font-medium tracking-wide uppercase ${dark ? "text-slate-400" : "text-slate-500"}`}>
            {label}
          </p>
          <p className={`mt-1 text-xl font-bold tabular-nums tracking-tight ${dark ? "text-slate-50" : "text-slate-900"}`}>
            {value}
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            {hasDelta && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                  positive
                    ? dark ? "text-emerald-400" : "text-emerald-600"
                    : dark ? "text-red-400" : "text-red-600"
                }`}
              >
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {positive ? "+" : ""}{deltaPct.toFixed(1)}%
              </span>
            )}
            {hint && (
              <span className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                {hint}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
