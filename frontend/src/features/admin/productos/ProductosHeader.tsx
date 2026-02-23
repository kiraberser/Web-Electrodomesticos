"use client"

import { usePathname, useRouter } from "next/navigation"
import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { Package, Tag, Layers, Truck, Box, Search } from "lucide-react"
import { Input } from "@/shared/ui/forms/InputField"

interface ProductosHeaderProps {
    title: string
    description: string
    searchPlaceholder: string
    resultsCount: number
    onSearchChange: (value: string) => void
    searchValue: string
}

const TABS = [
    { key: "refacciones", label: "Refacciones", icon: Box, path: "/admin/productos" },
    { key: "marcas", label: "Marcas", icon: Tag, path: "/admin/productos/marcas" },
    { key: "categorias", label: "Categorías", icon: Layers, path: "/admin/productos/categorias" },
    { key: "proveedores", label: "Proveedores", icon: Truck, path: "/admin/productos/proveedores" },
]

export default function ProductosHeader({
    title,
    description,
    searchPlaceholder,
    resultsCount,
    onSearchChange,
    searchValue
}: ProductosHeaderProps) {
    const { dark } = useAdminTheme()
    const pathname = usePathname()
    const router = useRouter()

    return (
        <>
            {/* Header */}
            <section className={`border-b ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <div className="flex items-start gap-3">
                        <div className={`hidden sm:block rounded-lg p-2 ${dark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                            <Package className={`h-5 w-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{title}</h1>
                            <p className={dark ? 'text-slate-400' : 'text-gray-600'}>
                                {description}
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
                            const active = pathname === tab.path
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => router.push(tab.path)}
                                    className={`flex cursor-pointer items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                                        active
                                            ? "border-blue-600 text-blue-600"
                                            : dark 
                                                ? "border-transparent text-slate-400 hover:text-slate-200"
                                                : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Search bar */}
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
                        <Badge variant="secondary" className={dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}>
                            {resultsCount} resultado{resultsCount !== 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>
            </section>
        </>
    )
}

