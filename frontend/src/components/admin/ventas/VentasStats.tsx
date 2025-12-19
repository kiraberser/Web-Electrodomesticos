"use client"

import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { EstadisticasVentas } from "@/api/ventas"
import { Store, Wrench, RotateCcw } from "lucide-react"

interface VentasStatsProps {
    estadisticas: EstadisticasVentas
    loading?: boolean
}

export default function VentasStats({ estadisticas, loading = false }: VentasStatsProps) {
    const { dark } = useAdminTheme()

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
    }

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className={`animate-pulse rounded-lg border p-6 ${
                            dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                        <div className={`h-4 w-24 rounded ${dark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                        <div className={`mt-4 h-8 w-32 rounded ${dark ? 'bg-slate-700' : 'bg-gray-300'}`} />
                    </div>
                ))}
            </div>
        )
    }

    const stats = [
        {
            label: 'Ventas de Servicios',
            value: formatCurrency(estadisticas.ventas_servicios.total),
            cantidad: estadisticas.ventas_servicios.cantidad,
            icon: Wrench,
            color: dark ? 'text-blue-400' : 'text-blue-600',
            bgColor: dark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200',
        },
        {
            label: 'Ventas de Refacciones',
            value: formatCurrency(estadisticas.ventas_refacciones.total),
            cantidad: estadisticas.ventas_refacciones.cantidad,
            icon: Store,
            color: dark ? 'text-green-400' : 'text-green-600',
            bgColor: dark ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200',
        },
        {
            label: 'Devoluciones',
            value: formatCurrency(estadisticas.devoluciones.total),
            cantidad: estadisticas.devoluciones.cantidad,
            icon: RotateCcw,
            color: dark ? 'text-red-400' : 'text-red-600',
            bgColor: dark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-200',
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className={`rounded-lg border p-6 ${stat.bgColor} ${
                        dark ? 'border-slate-800' : 'border-gray-200'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                {stat.label}
                            </p>
                            <p className={`mt-2 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`mt-1 text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                {stat.cantidad} registro{stat.cantidad !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

