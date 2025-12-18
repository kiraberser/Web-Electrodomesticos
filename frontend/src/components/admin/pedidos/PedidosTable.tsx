"use client"

import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Pedido } from "@/api/pedidos"
import { Badge } from "@/components/ui"
import { Button } from "@/components/admin/ui"
import { Eye, ShoppingCart } from "lucide-react"

interface PedidosTableProps {
    pedidos: Pedido[]
    onView: (pedido: Pedido) => void
    onDataChange: () => void
}

const ESTADO_LABELS: Record<string, string> = {
    'CRE': 'Creado',
    'PAG': 'Pagado',
    'ENV': 'Enviado',
    'ENT': 'Entregado',
    'CAN': 'Cancelado',
}

const ESTADO_COLORS: Record<string, { light: string; dark: string }> = {
    'CRE': { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-500/20 text-yellow-400' },
    'PAG': { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
    'ENV': { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-500/20 text-blue-400' },
    'ENT': { light: 'bg-emerald-100 text-emerald-800', dark: 'bg-emerald-500/20 text-emerald-400' },
    'CAN': { light: 'bg-red-100 text-red-800', dark: 'bg-red-500/20 text-red-400' },
}

export default function PedidosTable({ pedidos, onView, onDataChange }: PedidosTableProps) {
    const { dark } = useAdminTheme()

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

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(Number(amount))
    }

    if (pedidos.length === 0) {
        return (
            <div className="p-10 text-center">
                <ShoppingCart className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                <h3 className={`mb-1 text-lg font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Sin pedidos</h3>
                <p className={dark ? 'text-slate-400' : 'text-gray-600'}>No hay pedidos registrados aún.</p>
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
                            <th className="px-6 py-3">Cliente</th>
                            <th className="px-6 py-3">Estado</th>
                            <th className="px-6 py-3">Items</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Fecha</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y text-sm ${dark ? 'divide-slate-800' : 'divide-gray-100'}`}>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id} className={dark ? 'hover:bg-slate-800/50' : 'hover:bg-gray-50'}>
                                <td className={`px-6 py-3 font-mono font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    #{pedido.id}
                                </td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>
                                    <div>
                                        <div className="font-medium">{pedido.usuario_nombre}</div>
                                        <div className="text-xs text-gray-500">{pedido.usuario_email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <Badge className={dark ? ESTADO_COLORS[pedido.estado]?.dark : ESTADO_COLORS[pedido.estado]?.light}>
                                        {ESTADO_LABELS[pedido.estado] || pedido.estado}
                                    </Badge>
                                </td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>
                                    <div>
                                        <div className="font-medium">{pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}</div>
                                        <div className="text-xs text-gray-500">
                                            {pedido.items.slice(0, 2).map(item => item.refaccion_nombre).join(', ')}
                                            {pedido.items.length > 2 && '...'}
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-6 py-3 font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    {formatCurrency(pedido.total)}
                                </td>
                                <td className={dark ? 'px-6 py-3 text-slate-400' : 'px-6 py-3 text-gray-700'}>
                                    {formatDate(pedido.fecha_creacion)}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(pedido)}
                                            className="bg-transparent cursor-pointer"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 p-3 lg:hidden">
                {pedidos.map((pedido) => (
                    <div
                        key={pedido.id}
                        className={`rounded-lg border p-4 shadow-sm ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <div className={`text-sm font-mono font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                #{pedido.id}
                            </div>
                            <Badge className={dark ? ESTADO_COLORS[pedido.estado]?.dark : ESTADO_COLORS[pedido.estado]?.light}>
                                {ESTADO_LABELS[pedido.estado] || pedido.estado}
                            </Badge>
                        </div>
                        <div className={`mt-2 space-y-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            <div>
                                <div className="font-medium">{pedido.usuario_nombre}</div>
                                <div className="text-xs text-gray-500">{pedido.usuario_email}</div>
                            </div>
                            <div>{pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}</div>
                            <div className={`font-semibold text-lg ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                {formatCurrency(pedido.total)}
                            </div>
                            <div className="text-xs">{formatDate(pedido.fecha_creacion)}</div>
                        </div>
                        <div className="mt-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onView(pedido)}
                                className="w-full bg-transparent cursor-pointer"
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

