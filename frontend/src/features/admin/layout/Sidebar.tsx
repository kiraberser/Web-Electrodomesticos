"use client";

import React from "react";
import Link from "next/link";
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme";
import type { NavItem, SectionKey } from "@/features/admin/utils/types";
import { Wrench, X, Home, ExternalLink } from "lucide-react";

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
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onCloseAction}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r transition-transform duration-200 lg:static lg:translate-x-0 ${
          dark
            ? "border-slate-700/50 bg-slate-900 text-slate-200"
            : "border-slate-200 bg-white text-slate-800"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Barra lateral"
      >

        {/* Branding */}
        <div className={`flex items-center gap-3 border-b px-5 py-4 flex-shrink-0 ${dark ? "border-slate-700/50" : "border-slate-100"}`}>
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${dark ? "bg-blue-500/15 text-blue-400" : "bg-[#0A3981]/10 text-[#0A3981]"}`}>
            <Wrench className="h-[18px] w-[18px]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className={`text-sm font-bold tracking-tight truncate ${dark ? "text-slate-100" : "text-slate-900"}`}>
              Refaccionaria Vega
            </p>
            <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Panel de administración
            </p>
          </div>
          <button
            className={`rounded-lg p-1.5 lg:hidden flex-shrink-0 ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-400"}`}
            onClick={onCloseAction}
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation — flex-1 para ocupar espacio disponible */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {items.map((it) => {
            const isActive = it.key === active;
            return (
              <button
                key={it.key}
                onClick={() => onNavigateAction(it.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? dark
                      ? "bg-blue-500/12 text-blue-400 shadow-[inset_0_0_0_1px_rgba(96,165,250,0.12)]"
                      : "bg-[#0A3981]/8 text-[#0A3981] shadow-[inset_0_0_0_1px_rgba(10,57,129,0.1)]"
                    : dark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {it.icon && (
                  <it.icon
                    className={`h-[17px] w-[17px] flex-shrink-0 ${
                      isActive
                        ? dark ? "text-blue-400" : "text-[#0A3981]"
                        : dark ? "text-slate-500" : "text-slate-400"
                    }`}
                  />
                )}
                <span className="truncate">{it.label}</span>
                {isActive && (
                  <span className={`ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0 ${dark ? "bg-blue-400" : "bg-[#0A3981]"}`} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className={`mx-3 border-t ${dark ? "border-slate-700/50" : "border-slate-100"}`} />

        {/* Volver al sitio */}
        <div className="p-3 flex-shrink-0">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 group ${
              dark
                ? "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <Home className="h-[17px] w-[17px] flex-shrink-0" />
            <span className="flex-1">Volver al sitio</span>
            <ExternalLink className={`h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        </div>

      </aside>
    </>
  );
}
