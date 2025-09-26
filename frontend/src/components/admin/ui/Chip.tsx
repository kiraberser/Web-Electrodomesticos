"use client";
import React from "react";

export const Chip: React.FC<{
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  color?: "default" | "success" | "warning" | "danger" | "info";
}> = ({ selected = false, children, onClick, color = "default" }) => {
  const colorMap: Record<string, string> = {
    default: selected ? "bg-white/20 text-white" : "bg-white/10 text-gray-200 hover:bg-white/15",
    success: selected ? "bg-emerald-600/30 text-emerald-300" : "bg-emerald-600/15 text-emerald-300/80 hover:bg-emerald-600/20",
    warning: selected ? "bg-amber-600/30 text-amber-300" : "bg-amber-600/15 text-amber-300/80 hover:bg-amber-600/20",
    danger: selected ? "bg-red-600/30 text-red-300" : "bg-red-600/15 text-red-300/80 hover:bg-red-600/20",
    info: selected ? "bg-sky-600/30 text-sky-300" : "bg-sky-600/15 text-sky-300/80 hover:bg-sky-600/20",
  };
  return (
    <button
      type="button"
      className={`h-8 rounded-full px-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${colorMap[color]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
