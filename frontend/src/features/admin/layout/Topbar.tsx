"use client"

import { useState, useEffect } from "react"
import { Menu, Moon, Sun, Bell, Search, User, Calendar } from "lucide-react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { getCookieValue } from "@/shared/lib/cookies"
import type { DateRange } from "@/features/admin/utils/types"

type TopbarProps = {
  onOpenSidebarAction: () => void
  dateRange: DateRange
  setDateRangeAction: (range: DateRange) => void
  onQuickAction?: (key: string) => void
}

export default function Topbar({ onOpenSidebarAction, dateRange, setDateRangeAction, onQuickAction }: TopbarProps) {
  const { dark, toggle } = useAdminTheme()
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    const user = getCookieValue("username")
    setUsername(user ?? "Admin")
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 transition-all duration-200 ${
        dark
          ? "border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/20"
          : "border-slate-100 bg-white/95 backdrop-blur-xl shadow-sm"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          className={`rounded-xl p-2.5 transition-all duration-150 lg:hidden ${
            dark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={onOpenSidebarAction}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search — oculto en móvil */}
        <div className="hidden md:flex items-center relative">
          <Search className={`absolute left-3 h-4 w-4 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="text"
            placeholder="Buscar..."
            className={`pl-9 pr-4 py-2 w-56 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:w-72 ${
              dark
                ? "border-slate-700/60 bg-slate-800/60 text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:ring-slate-600/20"
                : "border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-slate-300 focus:ring-slate-200/60"
            }`}
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">

        {/* Date range — oculto en móvil */}
        <div className={`hidden sm:flex items-center gap-2 mr-2 px-3 py-2 rounded-xl border text-sm transition-all ${
          dark ? "border-slate-700/60 bg-slate-800/40" : "border-slate-200 bg-slate-50/80"
        }`}>
          <Calendar className={`h-3.5 w-3.5 flex-shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`} />
          <input
            type="date"
            value={dateRange.from?.slice(0, 10) || ""}
            onChange={(e) => setDateRangeAction({ ...dateRange, from: new Date(e.target.value).toISOString() })}
            className={`bg-transparent outline-none cursor-pointer text-xs ${
              dark ? "text-slate-300 [color-scheme:dark]" : "text-slate-600 [color-scheme:light]"
            }`}
          />
          <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-300"}`}>–</span>
          <input
            type="date"
            value={dateRange.to?.slice(0, 10) || ""}
            onChange={(e) => setDateRangeAction({ ...dateRange, to: new Date(e.target.value).toISOString() })}
            className={`bg-transparent outline-none cursor-pointer text-xs ${
              dark ? "text-slate-300 [color-scheme:dark]" : "text-slate-600 [color-scheme:light]"
            }`}
          />
        </div>

        {/* Notifications */}
        <button
          className={`relative rounded-xl p-2.5 transition-all duration-150 ${
            dark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={() => onQuickAction?.("notifications")}
          aria-label="Notificaciones"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-current" />
        </button>

        {/* Theme toggle */}
        <button
          className={`rounded-xl p-2.5 transition-all duration-150 ${
            dark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={() => { toggle(); onQuickAction?.("toggle-theme"); }}
          aria-label="Cambiar tema"
        >
          {dark
            ? <Sun className="h-4.5 w-4.5" />
            : <Moon className="h-4.5 w-4.5" />
          }
        </button>

        {/* Divider */}
        <div className={`mx-1 h-6 w-px ${dark ? "bg-slate-700" : "bg-slate-200"}`} />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ring-2 flex-shrink-0 ${
            dark ? "bg-blue-500/20 ring-blue-500/20 text-blue-400" : "bg-[#0A3981]/10 ring-[#0A3981]/10 text-[#0A3981]"
          }`}>
            <User className="h-4 w-4" />
          </div>
          <div className="hidden lg:block min-w-0">
            <p className={`text-sm font-semibold leading-tight truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>
              {username}
            </p>
            <p className={`text-[11px] leading-tight ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Administrador
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
