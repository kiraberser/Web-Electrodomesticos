"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/admin/ui"
import { Badge } from "@/components/ui"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Pedido } from "@/api/pedidos"
import { updatePedidoEstado } from "@/api/pedidos"
import { X, ShoppingCart, DollarSign, Calendar, Package, User, CreditCard, CheckCircle } from "lucide-react"

interface PedidoDrawerProps {
    pedido: Pedido | null
    open: boolean
    onClose: () => void
    onEstadoUpdated?: (pedido: Pedido) => void
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

export default function PedidoDrawer({ pedido: initialPedido, open, onClose, onEstadoUpdated }: PedidoDrawerProps) {
    const { dark } = useAdminTheme()
    const [pedido, setPedido] = useState<Pedido | null>(initialPedido)
    const [updating, setUpdating] = useState(false)
    
    // Actualizar pedido cuando cambia el prop
    useEffect(() => {
        setPedido(initialPedido)
    }, [initialPedido])
    
    if (!open || !pedido) return null

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
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

    const handleMarcarEntregado = async () => {
        if (!pedido || pedido.estado === 'ENT') return
        
        if (!confirm('¿Estás seguro de marcar este pedido como entregado?')) return
        
        setUpdating(true)
        try {
            const updatedPedido = await updatePedidoEstado(pedido.id, 'ENT')
            setPedido(updatedPedido)
            if (onEstadoUpdated) {
                onEstadoUpdated(updatedPedido)
            }
        } catch (error) {
            alert('Error al actualizar el estado del pedido')
            console.error(error)
        } finally {
            setUpdating(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-xl border-l shadow-xl overflow-y-auto ${
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                }`}
                role="dialog"
                aria-label="Detalle de pedido"
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between border-b p-4 ${
                    dark ? 'border-slate-800 bg-slate-900' : 'bg-white'
                }`}>
                    <div>
                        <div className={`text-sm font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                            Pedido #{pedido.id}
                        </div>
                        <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                            Detalles del pedido
                        </h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-4 space-y-4">
                    {/* Status badge y botón de entregado */}
                    <div className="flex items-center justify-between gap-2">
                        <Badge className={dark ? ESTADO_COLORS[pedido.estado]?.dark : ESTADO_COLORS[pedido.estado]?.light}>
                            {ESTADO_LABELS[pedido.estado] || pedido.estado}
                        </Badge>
                        {pedido.estado !== 'ENT' && pedido.estado !== 'CAN' && (
                            <Button
                                onClick={handleMarcarEntregado}
                                disabled={updating}
                                className={`cursor-pointer ${dark ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {updating ? 'Marcando...' : 'Marcar como entregado'}
                            </Button>
                        )}
                    </div>

                    {/* Customer info */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <User className="h-4 w-4" />
                            Cliente
                        </div>
                        <div className={`text-sm font-medium ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                            {pedido.usuario_nombre}
                        </div>
                        <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {pedido.usuario_email}
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <CreditCard className="h-4 w-4" />
                            Método de Pago
                        </div>
                        <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                            {pedido.metodo_pago || 'No especificado'}
                        </div>
                    </div>

                    {/* Main info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <DollarSign className="h-4 w-4" />
                                Total
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                {formatCurrency(pedido.total)}
                            </div>
                        </div>
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <Package className="h-4 w-4" />
                                Items
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                {pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}
                            </div>
                        </div>
                    </div>

                    {/* Date */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <Calendar className="h-4 w-4" />
                            Fecha de creación
                        </div>
                        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                            {formatDate(pedido.fecha_creacion)}
                        </p>
                    </div>

                    {/* Items list */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-4 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <ShoppingCart className="h-4 w-4" />
                            Productos del pedido
                        </div>
                        <div className="space-y-3">
                            {pedido.items.map((item) => (
                                <div
                                    key={item.id}
                                    className={`rounded-lg border p-3 ${dark ? 'border-slate-700 bg-slate-800/30' : 'border-gray-200 bg-white'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className={`font-medium ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                {item.refaccion_nombre}
                                            </div>
                                            <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                                Cantidad: {item.cantidad} × {formatCurrency(item.precio_unitario)}
                                            </div>
                                        </div>
                                        <div className={`ml-4 text-right font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                            {formatCurrency(item.subtotal)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`mt-4 flex items-center justify-between border-t pt-3 ${dark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <span className={`text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>Total:</span>
                            <span className={`text-lg font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                {formatCurrency(pedido.total)}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

