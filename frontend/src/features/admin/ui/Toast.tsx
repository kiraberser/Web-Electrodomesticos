"use client";
import React from "react";

export const Toast: React.FC<{ type?: "success" | "error" | "info"; title: string; description?: string }>
  = ({ type = "info", title, description }) => {
  const map: Record<string, string> = {
    success: "bg-emerald-600/20 text-emerald-200 border-emerald-600/30",
    error: "bg-red-600/20 text-red-200 border-red-600/30",
    info: "bg-sky-600/20 text-sky-200 border-sky-600/30",
  };
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${map[type]}`}>
      <div className="mt-0.5 h-4 w-4 rounded-full bg-current" />
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs opacity-80">{description}</p>}
      </div>
    </div>
  );
};
