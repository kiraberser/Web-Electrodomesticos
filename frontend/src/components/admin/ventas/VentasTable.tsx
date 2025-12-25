"use client"

import { useState } from "react"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Venta, VentaRefaccion, VentaServicio, Devolucion } from "@/api/ventas"
import { Badge } from "@/components/ui"
import { Button } from "@/components/admin/ui"
import { Store, Wrench, RotateCcw, Eye, ChevronDown, ChevronUp } from "lucide-react"

interface VentasTableProps {
    ventas: Venta[]
    loading?: boolean
    onView?: (venta: Venta) => void
}

const TIPO_LABELS: Record<string, string> = {
    'refaccion': 'Refacción',
    'servicio': 'Servicio',
    'devolucion': 'Devolución',
}

const TIPO_COLORS: Record<string, { light: string; dark: string }> = {
    'refaccion': { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
    'servicio': { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-500/20 text-blue-400' },
    'devolucion': { light: 'bg-red-100 text-red-800', dark: 'bg-red-500/20 text-red-400' },
}

const ESTADO_PAGO_COLORS: Record<string, { light: string; dark: string }> = {
    'Pendiente': { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-500/20 text-yellow-400' },
    'Parcial': { light: 'bg-orange-100 text-orange-800', dark: 'bg-orange-500/20 text-orange-400' },
    'Pagado': { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
}

export default function VentasTable({ ventas, loading = false, onView }: VentasTableProps) {
    const { dark } = useAdminTheme()
    const [expandedRow, setExpandedRow] = useState<string | null>(null)

    const handleIdClick = (id: number, tipo: string) => {
        const rowKey = `${tipo}-${id}`
        if (expandedRow === rowKey) {
            setExpandedRow(null) // Cerrar si ya está expandida
        } else {
            setExpandedRow(rowKey) // Expandir la fila
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(Number(amount))
    }

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'refaccion':
                return Store
            case 'servicio':
                return Wrench
            case 'devolucion':
                return RotateCcw
            default:
                return Store
        }
    }

    if (loading) {
        return (
            <div className="p-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className={`mt-3 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Cargando ventas...</p>
            </div>
        )
    }

    if (ventas.length === 0) {
        return (
            <div className="p-10 text-center">
                <Store className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                <h3 className={`mb-1 text-lg font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                    Sin ventas
                </h3>
                <p className={dark ? 'text-slate-400' : 'text-gray-600'}>
                    No hay ventas registradas aún.
                </p>
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
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Tipo</th>
                            <th className="px-6 py-3">Detalle</th>
                            <th className="px-6 py-3">Cantidad</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3">Estado</th>
                            {onView && <th className="px-6 py-3 text-center">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${dark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {ventas.map((venta) => {
                            const TipoIcon = getTipoIcon(venta.tipo)
                            const fecha = venta.tipo === 'devolucion' 
                                ? (venta as Devolucion).fecha_devolucion 
                                : (venta as VentaRefaccion | VentaServicio).fecha_venta

                            return (
                                <tr
                                    key={`${venta.tipo}-${venta.id}`}
                                    className={`hover:bg-opacity-50 ${
                                        dark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleIdClick(venta.id, venta.tipo)}
                                            className={`flex items-center gap-1 font-mono text-sm font-medium transition-colors ${
                                                dark
                                                    ? 'text-blue-400 hover:text-blue-300'
                                                    : 'text-blue-600 hover:text-blue-700'
                                            }`}
                                            title={`Ver detalles de ${TIPO_LABELS[venta.tipo]} #${venta.id}`}
                                        >
                                            #{venta.id}
                                            {expandedRow === `${venta.tipo}-${venta.id}` ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            className={
                                                dark
                                                    ? TIPO_COLORS[venta.tipo]?.dark
                                                    : TIPO_COLORS[venta.tipo]?.light
                                            }
                                        >
                                            <TipoIcon className="mr-1 h-3 w-3" />
                                            {TIPO_LABELS[venta.tipo]}
                                        </Badge>
                                    </td>
                                    <td className={`px-6 py-4 ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {venta.tipo === 'refaccion' && (
                                            <div>
                                                <div className="font-medium">
                                                    {(venta as VentaRefaccion | Devolucion).refaccion_nombre}
                                                </div>
                                                <div className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    {(venta as VentaRefaccion | Devolucion).marca_nombre}
                                                </div>
                                            </div>
                                        )}
                                        {venta.tipo === 'servicio' && (
                                            <div>
                                                <div className="font-medium">
                                                    {(venta as VentaServicio).servicio_aparato || `Servicio #${(venta as VentaServicio).servicio}`}
                                                </div>
                                                {(venta as VentaServicio).tecnico && (
                                                    <div className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                        Técnico: {(venta as VentaServicio).tecnico}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {venta.tipo === 'devolucion' && (
                                            <div>
                                                <div className="font-medium">
                                                    {(venta as VentaRefaccion | Devolucion).refaccion_nombre}
                                                </div>
                                                <div className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                    {(venta as VentaRefaccion | Devolucion).marca_nombre}
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className={`px-6 py-4 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {venta.tipo === 'refaccion' && (venta as VentaRefaccion).cantidad}
                                        {venta.tipo === 'servicio' && '-'}
                                        {venta.tipo === 'devolucion' && (venta as Devolucion).cantidad}
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency(venta.total)}
                                    </td>
                                    <td className={`px-6 py-4 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                        {formatDate(fecha)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {venta.tipo === 'servicio' && (venta as VentaServicio).estado_pago && (
                                            <Badge
                                                className={
                                                    dark
                                                        ? ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.dark
                                                        : ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.light
                                                }
                                            >
                                                {(venta as VentaServicio).estado_pago}
                                            </Badge>
                                        )}
                                        {venta.tipo !== 'servicio' && (
                                            <span className={dark ? 'text-slate-500' : 'text-gray-400'}>-</span>
                                        )}
                                    </td>
                                    {onView && (
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onView(venta)}
                                                className={`cursor-pointer ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                <Eye className={`mr-2 h-4 w-4 ${dark ? 'text-slate-400' : 'text-gray-600'}`} />
                                                Ver
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
                {ventas.map((venta) => {
                    const TipoIcon = getTipoIcon(venta.tipo)
                    const fecha = venta.tipo === 'devolucion' 
                        ? (venta as Devolucion).fecha_devolucion 
                        : (venta as VentaRefaccion | VentaServicio).fecha_venta

                    return (
                        <div
                            key={`${venta.tipo}-${venta.id}`}
                            className={`rounded-lg border p-4 ${
                                dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'
                            }`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <button
                                    onClick={() => handleIdClick(venta.id, venta.tipo)}
                                    className={`font-mono text-sm font-medium transition-colors ${
                                        dark
                                            ? 'text-blue-400 hover:text-blue-300 hover:underline'
                                            : 'text-blue-600 hover:text-blue-700 hover:underline'
                                    }`}
                                    title={`Buscar ${TIPO_LABELS[venta.tipo]} #${venta.id}`}
                                >
                                    ID: #{venta.id}
                                </button>
                            </div>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="mb-2">
                                        <Badge
                                            className={
                                                dark
                                                    ? TIPO_COLORS[venta.tipo]?.dark
                                                    : TIPO_COLORS[venta.tipo]?.light
                                            }
                                        >
                                            <TipoIcon className="mr-1 h-3 w-3" />
                                            {TIPO_LABELS[venta.tipo]}
                                        </Badge>
                                    </div>
                                    <div className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        {venta.tipo === 'refaccion' && (venta as VentaRefaccion).refaccion_nombre}
                                        {venta.tipo === 'servicio' && 
                                            ((venta as VentaServicio).servicio_aparato || `Servicio #${(venta as VentaServicio).servicio}`)}
                                        {venta.tipo === 'devolucion' && (venta as Devolucion).refaccion_nombre}
                                    </div>
                                    <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                        {venta.tipo === 'refaccion' && (venta as VentaRefaccion).marca_nombre}
                                        {venta.tipo === 'servicio' && (venta as VentaServicio).tecnico && 
                                            `Técnico: ${(venta as VentaServicio).tecnico}`}
                                        {venta.tipo === 'devolucion' && (venta as Devolucion).marca_nombre}
                                    </div>
                                    <div className={`mt-2 text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                        {formatDate(fecha)}
                                    </div>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className={`text-lg font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency(venta.total)}
                                    </div>
                                    {venta.tipo === 'servicio' && (venta as VentaServicio).estado_pago && (
                                        <Badge
                                            className={`mt-1 ${
                                                dark
                                                    ? ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.dark
                                                    : ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.light
                                            }`}
                                        >
                                            {(venta as VentaServicio).estado_pago}
                                        </Badge>
                                    )}
                                    {onView && (
                                        <div className="mt-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onView(venta)}
                                                className={`w-full cursor-pointer ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-800'}`}
                                            >
                                                <Eye className={`mr-2 h-4 w-4 ${dark ? 'text-slate-400' : 'text-gray-600'}`} />
                                                Ver detalles
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

