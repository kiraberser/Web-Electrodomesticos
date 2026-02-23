"use client"
import { Menu, Moon, Sun, Bell, Search, User, Calendar } from "lucide-react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { DateRange } from "@/features/admin/utils/types"

type TopbarProps = {
  onOpenSidebarAction: () => void
  dateRange: DateRange
  setDateRangeAction: (range: DateRange) => void
  onQuickAction?: (key: string) => void
}

export default function Topbar({ onOpenSidebarAction, dateRange, setDateRangeAction, onQuickAction }: TopbarProps) {
  const { dark, toggle } = useAdminTheme()

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between border-b px-4 py-3 transition-all duration-200 ${
        dark
          ? "border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-slate-900/20"
          : "border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm"
      }`}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          className={`rounded-xl p-2.5 transition-all duration-200 lg:hidden ${
            dark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={onOpenSidebarAction}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex items-center relative">
          <Search className={`absolute left-3 h-4 w-4 ${dark ? "text-slate-400" : "text-slate-500"}`} />
          <input
            type="text"
            placeholder="Buscar..."
            className={`pl-10 pr-4 py-2.5 w-64 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
              dark
                ? "border-slate-700 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-slate-600 focus:ring-slate-600/20"
                : "border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-500 focus:border-slate-300 focus:ring-slate-300/20"
            }`}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Date Range Picker */}
        <div className="hidden sm:flex items-center gap-3 mr-2">
          <div className="flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 hover:shadow-sm">
            <Calendar className={`h-4 w-4 ${dark ? "text-slate-400" : "text-slate-500"}`} />
            <input
              type="date"
              value={dateRange.from?.slice(0, 10) || ""}
              onChange={(e) => setDateRangeAction({ ...dateRange, from: new Date(e.target.value).toISOString() })}
              className={`text-sm bg-transparent outline-none cursor-pointer ${
                dark ? "text-slate-200 [color-scheme:dark]" : "text-slate-700 [color-scheme:light]"
              }`}
            />
            <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>—</span>
            <input
              type="date"
              value={dateRange.to?.slice(0, 10) || ""}
              onChange={(e) => setDateRangeAction({ ...dateRange, to: new Date(e.target.value).toISOString() })}
              className={`text-sm bg-transparent outline-none cursor-pointer ${
                dark ? "text-slate-200 [color-scheme:dark]" : "text-slate-700 [color-scheme:light]"
              }`}
            />
          </div>
        </div>

        {/* Notifications */}
        <button
          className={`relative rounded-xl p-2.5 transition-all duration-200 ${
            dark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={() => onQuickAction?.("notifications")}
          aria-label="Notificaciones"
          title="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-current"></span>
        </button>

        {/* Theme Toggle */}
        <button
          className={`rounded-xl p-2.5 transition-all duration-200 ${
            dark
              ? "text-slate-300 hover:bg-slate-800 hover:text-white active:scale-95"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-95"
          }`}
          onClick={() => { toggle(); onQuickAction?.("toggle-theme"); }}
          aria-label="Cambiar tema"
          title="Cambiar tema"
        >
          <div className="relative">
            {dark ? (
              <Sun className="h-5 w-5 transition-transform duration-300 rotate-0" />
            ) : (
              <Moon className="h-5 w-5 transition-transform duration-300 rotate-0" />
            )}
          </div>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 ml-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <User className="h-4 w-4 text-white" />
          </div>
          <div className="hidden lg:block">
            <p className={`text-sm font-medium ${dark ? "text-slate-200" : "text-slate-800"}`}>Admin Vega</p>
            <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>vegaalfredo2021@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
