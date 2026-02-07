"use client";

import React from "react";
import { Card } from "@/components/admin/ui/Card";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";

export const KPI: React.FC<{
  label: string;
  value: string;
  deltaPct?: number;
  hint?: string;
}> = ({ label, value, deltaPct = 0, hint }) => {
  const { dark } = useAdminTheme();
  const positive = deltaPct >= 0;

  const badgeClass = positive
    ? dark
      ? "bg-emerald-600/20 text-emerald-300"
      : "bg-emerald-100 text-emerald-700"
    : dark
    ? "bg-red-600/20 text-red-300"
    : "bg-red-100 text-red-700";

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>{label}</p>
          <p className={`mt-1 text-lg font-semibold ${dark ? "text-gray-100" : "text-gray-900"}`}>{value}</p>
        </div>
        <div className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${badgeClass}`}>
          <span>{positive ? "+" : "-"}{Math.abs(deltaPct).toFixed(1)}%</span>
        </div>
      </div>
      {hint && <p className={`mt-2 text-[11px] ${dark ? "text-gray-400" : "text-gray-600"}`}>{hint}</p>}
    </Card>
  );
};


