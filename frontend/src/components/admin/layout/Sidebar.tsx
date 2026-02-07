"use client";

import React from "react";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";
import type { NavItem, SectionKey } from "@/components/admin/utils/types";

type SidebarProps = {
  open: boolean;
  active: SectionKey;
  items: NavItem[];
  onCloseAction: () => void;
  onNavigateAction: (key: SectionKey) => void;
};

export default function Sidebar({ open, active, items, onCloseAction, onNavigateAction }: SidebarProps) {
  const { dark } = useAdminTheme();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r transition-transform duration-200 lg:static lg:translate-x-0 ${
        dark ? "border-white/10 bg-[#0F172A] text-gray-200" : "border-black/10 bg-white text-gray-800"
      } ${open ? "translate-x-0" : "-translate-x-full"}`}
      aria-label="Barra lateral"
    >
      <div className="flex items-center justify-between px-4 py-3 lg:hidden">
        <span className="text-sm font-semibold">Menú</span>
        <button className={`rounded-lg p-1 ${dark ? "hover:bg-white/10" : "hover:bg-black/5"}`} onClick={onCloseAction} aria-label="Cerrar menú">
          ✕
        </button>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((it) => {
          const isActive = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onNavigateAction(it.key)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                isActive
                  ? dark
                    ? "bg-white/10 text-white"
                    : "bg-black/5 text-gray-900"
                  : dark
                  ? "text-gray-300 hover:bg-white/5"
                  : "text-gray-700 hover:bg-black/5"
              }`}
            >
              {it.icon ? <it.icon className="h-4 w-4" /> : null}
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}


