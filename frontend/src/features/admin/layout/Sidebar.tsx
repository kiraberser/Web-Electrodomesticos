"use client";

import React from "react";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";
import type { NavItem, SectionKey } from "@/features/admin/utils/types";
import { Wrench, X } from "lucide-react";

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
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onCloseAction}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r transition-transform duration-200 lg:static lg:translate-x-0 ${
          dark
            ? "border-slate-700/50 bg-slate-900 text-slate-200"
            : "border-slate-200 bg-slate-50 text-slate-800"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Barra lateral"
      >
        {/* Branding */}
        <div className={`flex items-center gap-3 border-b px-5 py-4 ${dark ? "border-slate-700/50" : "border-slate-200"}`}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${dark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
            <Wrench className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>
              Refaccionaria Vega
            </p>
            <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Panel de administración
            </p>
          </div>
          <button
            className={`rounded-lg p-1.5 lg:hidden ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}
            onClick={onCloseAction}
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5 p-3">
          {items.map((it) => {
            const isActive = it.key === active;
            return (
              <button
                key={it.key}
                onClick={() => onNavigateAction(it.key)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? dark
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-blue-50 text-blue-700"
                    : dark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {it.icon ? <it.icon className="h-4 w-4" /> : null}
                <span>{it.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
