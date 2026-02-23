"use client"

import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { MovimientoInventario } from "@/features/admin/inventario-api"
import { PackageOpen, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { formatCurrency, formatDate } from "@/features/admin/utils/format"

interface MovimientosTableProps {
    movimientos: MovimientoInventario[]
    ordering?: string
    onSort?: (field: string) => void
}

const TIPO_CONFIG = {
    ENT: {
        label: "Entrada",
        dark: "bg-emerald-500/15 text-emerald-400",
        light: "bg-emerald-100 text-emerald-700",
    },
    SAL: {
        label: "Salida",
        dark: "bg-red-500/15 text-red-400",
        light: "bg-red-100 text-red-700",
    },
}

const SORTABLE_COLUMNS: { field: string; label: string }[] = [
    { field: "fecha", label: "Fecha" },
    { field: "cantidad", label: "Cantidad" },
    { field: "precio_unitario", label: "Precio Unit." },
]

function SortIcon({ field, ordering }: { field: string; ordering?: string }) {
    if (ordering === field) return <ChevronUp className="h-3.5 w-3.5 inline ml-1" />
    if (ordering === `-${field}`) return <ChevronDown className="h-3.5 w-3.5 inline ml-1" />
    return <ChevronsUpDown className="h-3.5 w-3.5 inline ml-1 opacity-40" />
}

export default function MovimientosTable({ movimientos, ordering, onSort }: MovimientosTableProps) {
    const { dark } = useAdminTheme()

    const handleSort = (field: string) => {
        if (!onSort) return
        if (ordering === `-${field}`) {
            onSort(field)
        } else if (ordering === field) {
            onSort(`-${field}`)
        } else {
            onSort(`-${field}`)
        }
    }

    if (movimientos.length === 0) {
        return (
            <div className="p-10 text-center">
                <PackageOpen className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                <h3 className={`mb-1 text-lg font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Sin movimientos</h3>
                <p className={dark ? 'text-slate-400' : 'text-gray-600'}>No hay movimientos de inventario registrados.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className={dark ? 'bg-slate-800/50' : 'bg-gray-50'}>
                        <tr className={`text-left text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {SORTABLE_COLUMNS.map((col) => {
                                const isSortable = !!onSort
                                if (col.field === "fecha") {
                                    return (
                                        <th
                                            key={col.field}
                                            className={`px-6 py-3 ${isSortable ? 'cursor-pointer select-none hover:text-blue-500' : ''}`}
                                            onClick={() => handleSort(col.field)}
                                        >
                                            {col.label}
                                            {isSortable && <SortIcon field={col.field} ordering={ordering} />}
                                        </th>
                                    )
                                }
                                return null
                            })}
                            <th className="px-6 py-3">Refaccion</th>
                            <th className="px-6 py-3">Tipo</th>
                            {SORTABLE_COLUMNS.filter(c => c.field !== "fecha").map((col) => {
                                const isSortable = !!onSort
                                return (
                                    <th
                                        key={col.field}
                                        className={`px-6 py-3 ${isSortable ? 'cursor-pointer select-none hover:text-blue-500' : ''}`}
                                        onClick={() => handleSort(col.field)}
                                    >
                                        {col.label}
                                        {isSortable && <SortIcon field={col.field} ordering={ordering} />}
                                    </th>
                                )
                            })}
                            <th className="px-6 py-3">Marca</th>
                            <th className="px-6 py-3">Categoria</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${dark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {movimientos.map((mov) => {
                            const tipo = TIPO_CONFIG[mov.tipo_movimiento]
                            return (
                                <tr
                                    key={mov.id}
                                    className={dark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}
                                >
                                    <td className={`px-6 py-3 ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                                        {formatDate(mov.fecha)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span className={`font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                            {mov.refaccion_nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <Badge className={dark ? tipo.dark : tipo.light}>
                                            {tipo.label}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {mov.tipo_movimiento === 'ENT' ? '+' : '-'}{mov.cantidad}
                                    </td>
                                    <td className={`px-6 py-3 ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                                        {Number(mov.precio_unitario) > 0 ? formatCurrency(Number(mov.precio_unitario)) : '-'}
                                    </td>
                                    <td className={`px-6 py-3 ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                                        {mov.marca || '-'}
                                    </td>
                                    <td className={`px-6 py-3 ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                                        {mov.categoria || '-'}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 p-3 lg:hidden">
                {movimientos.map((mov) => {
                    const tipo = TIPO_CONFIG[mov.tipo_movimiento]
                    return (
                        <div
                            key={mov.id}
                            className={`rounded-lg border p-4 shadow-sm ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                    {formatDate(mov.fecha)}
                                </span>
                                <Badge className={dark ? tipo.dark : tipo.light}>
                                    {tipo.label}
                                </Badge>
                            </div>
                            <div className={`text-base font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                {mov.refaccion_nombre}
                            </div>
                            <div className={`mt-2 flex items-center justify-between text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                <span>
                                    Cantidad: <strong className={dark ? 'text-slate-200' : 'text-gray-900'}>
                                        {mov.tipo_movimiento === 'ENT' ? '+' : '-'}{mov.cantidad}
                                    </strong>
                                </span>
                                <span>
                                    {Number(mov.precio_unitario) > 0 ? formatCurrency(Number(mov.precio_unitario)) : ''}
                                </span>
                            </div>
                            {(mov.marca || mov.categoria) && (
                                <div className={`mt-1 text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                    {[mov.marca, mov.categoria].filter(Boolean).join(' / ')}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
