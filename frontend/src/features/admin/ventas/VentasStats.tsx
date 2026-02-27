"use client"

import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { EstadisticasVentas } from "@/features/admin/ventas-api"
import { Store, Wrench, RotateCcw, TrendingUp, Receipt, Percent } from "lucide-react"

interface VentasStatsProps {
    estadisticas: EstadisticasVentas
    loading?: boolean
}

export default function VentasStats({ estadisticas, loading = false }: VentasStatsProps) {
    const { dark } = useAdminTheme()

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className={`animate-pulse rounded-xl border p-5 min-h-[110px] ${
                            dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className={`h-8 w-8 rounded-lg mb-3 ${dark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                        <div className={`h-8 w-28 rounded mb-2 ${dark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                        <div className={`h-3 w-20 rounded ${dark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                    </div>
                ))}
            </div>
        )
    }

    const totalIngresos = estadisticas.ventas_servicios.total + estadisticas.ventas_refacciones.total
    const totalTransacciones = estadisticas.ventas_refacciones.cantidad + estadisticas.ventas_servicios.cantidad
    const ticketPromedio = totalTransacciones > 0 ? totalIngresos / totalTransacciones : 0
    const ratioSvcRef = estadisticas.ventas_refacciones.total > 0
        ? (estadisticas.ventas_servicios.total / estadisticas.ventas_refacciones.total) * 100
        : null

    const stats = [
        {
            label: 'Ventas Refacciones',
            value: formatCurrency(estadisticas.ventas_refacciones.total),
            sub: `${estadisticas.ventas_refacciones.cantidad} registro${estadisticas.ventas_refacciones.cantidad !== 1 ? 's' : ''}`,
            icon: Store,
            iconBg: 'bg-blue-500',
            numberColor: dark ? 'text-slate-100' : 'text-gray-900',
        },
        {
            label: 'Ventas Servicios',
            value: formatCurrency(estadisticas.ventas_servicios.total),
            sub: `${estadisticas.ventas_servicios.cantidad} registro${estadisticas.ventas_servicios.cantidad !== 1 ? 's' : ''}`,
            icon: Wrench,
            iconBg: 'bg-emerald-500',
            numberColor: dark ? 'text-slate-100' : 'text-gray-900',
        },
        {
            label: 'Ingreso Total',
            value: formatCurrency(totalIngresos),
            sub: `${estadisticas.ventas_refacciones.cantidad + estadisticas.ventas_servicios.cantidad} transacciones`,
            icon: TrendingUp,
            iconBg: 'bg-violet-500',
            numberColor: dark ? 'text-violet-300' : 'text-violet-700',
        },
        {
            label: 'Devoluciones',
            value: formatCurrency(estadisticas.devoluciones.total),
            sub: `${estadisticas.devoluciones.cantidad} registro${estadisticas.devoluciones.cantidad !== 1 ? 's' : ''}`,
            icon: RotateCcw,
            iconBg: 'bg-red-500',
            numberColor: dark ? 'text-red-400' : 'text-red-600',
        },
        {
            label: 'Ticket Promedio',
            value: formatCurrency(ticketPromedio),
            sub: `sobre ${totalTransacciones} transacciones`,
            icon: Receipt,
            iconBg: 'bg-amber-500',
            numberColor: dark ? 'text-amber-300' : 'text-amber-700',
        },
        {
            label: 'Ratio Svc / Ref',
            value: ratioSvcRef !== null ? `${ratioSvcRef.toFixed(1)}%` : '—',
            sub: ratioSvcRef !== null
                ? ratioSvcRef >= 100
                    ? 'Servicios supera refacciones'
                    : 'Servicios vs refacciones'
                : 'Sin datos de refacciones',
            icon: Percent,
            iconBg: 'bg-sky-500',
            numberColor: dark ? 'text-sky-300' : 'text-sky-700',
        },
    ]

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${
                        dark
                            ? 'border-slate-800 bg-slate-900'
                            : 'border-gray-200 bg-white'
                    }`}
                >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                        <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className={`text-3xl font-bold tracking-tight ${stat.numberColor}`}>
                        {stat.value}
                    </div>
                    <div>
                        <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            {stat.label}
                        </p>
                        <p className={`text-xs ${dark ? 'text-slate-600' : 'text-gray-400'}`}>
                            {stat.sub}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
