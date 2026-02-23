"use client"

import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { Box, Search, ArrowDownToLine, ArrowUpFromLine, RotateCcw, List, PackageSearch } from "lucide-react"
import { Input } from "@/features/admin/ui/Input"
import { Button } from "@/features/admin/ui/Button"

export type InventarioTab = "movimientos" | "entrada" | "salida" | "devolucion"

interface InventarioHeaderProps {
    activeTab: InventarioTab
    onTabChange: (tab: InventarioTab) => void
    searchPlaceholder: string
    resultsCount: number
    onSearchChange: (value: string) => void
    searchValue: string
    onOpenSearchDrawer?: () => void
}

const TABS: { key: InventarioTab; label: string; icon: typeof Box }[] = [
    { key: "movimientos", label: "Movimientos", icon: List },
    { key: "entrada", label: "Registrar Entrada", icon: ArrowDownToLine },
    { key: "salida", label: "Registrar Salida", icon: ArrowUpFromLine },
    { key: "devolucion", label: "Devoluciones", icon: RotateCcw },
]

export default function InventarioHeader({
    activeTab,
    onTabChange,
    searchPlaceholder,
    resultsCount,
    onSearchChange,
    searchValue,
    onOpenSearchDrawer,
}: InventarioHeaderProps) {
    const { dark } = useAdminTheme()

    return (
        <>
            {/* Header */}
            <section className={`border-b ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <div className="flex items-start gap-3">
                        <div className={`hidden sm:block rounded-lg p-2 ${dark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                            <Box className={`h-5 w-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>Inventario</h1>
                            <p className={dark ? 'text-slate-400' : 'text-gray-600'}>
                                Gestiona movimientos de entrada, salida y devoluciones de refacciones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8">
                <div className="overflow-x-auto">
                    <div className={`flex items-center gap-2 border-b ${dark ? 'border-slate-800' : 'border-gray-200'}`}>
                        {TABS.map((tab) => {
                            const Icon = tab.icon
                            const active = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => onTabChange(tab.key)}
                                    className={`flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                                        active
                                            ? "border-blue-600 text-blue-600"
                                            : dark
                                                ? "border-transparent text-slate-400 hover:text-slate-200"
                                                : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.key === "movimientos" ? "Todos" : tab.label.split(" ").pop()}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Search bar */}
            {activeTab === "movimientos" && (
                <section className="w-full mx-auto px-4 md:px-6 lg:px-8 py-4">
                    <div className={`rounded-xl border p-4 ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                    <Input
                                        placeholder={searchPlaceholder}
                                        value={searchValue}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className={dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}>
                                    {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
                                </Badge>
                                {onOpenSearchDrawer && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onOpenSearchDrawer}
                                        className={`cursor-pointer ${dark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        <PackageSearch className="h-4 w-4 mr-1.5" />
                                        Buscar refaccion
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
