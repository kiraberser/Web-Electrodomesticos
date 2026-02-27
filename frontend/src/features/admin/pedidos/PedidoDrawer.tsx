"use client"

import { useState, useEffect } from "react"
import { Button } from "@/features/admin/ui/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { Pedido } from "@/features/orders/api"
import { patchPedidoFields } from "@/features/orders/api"
import { X, ShoppingCart, DollarSign, Calendar, Package, User, CreditCard, MapPin, Truck } from "lucide-react"

interface PedidoDrawerProps {
    pedido: Pedido | null
    open: boolean
    onClose: () => void
    onEstadoUpdated?: (pedido: Pedido) => void
}

const ESTADO_LABELS: Record<string, string> = {
    CRE: 'Creado',
    PAG: 'Pagado',
    ENV: 'Enviado',
    ENT: 'Entregado',
    CAN: 'Cancelado',
}

const ESTADO_COLORS: Record<string, { light: string; dark: string }> = {
    CRE: { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-500/20 text-yellow-400' },
    PAG: { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
    ENV: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-500/20 text-blue-400' },
    ENT: { light: 'bg-emerald-100 text-emerald-800', dark: 'bg-emerald-500/20 text-emerald-400' },
    CAN: { light: 'bg-red-100 text-red-800', dark: 'bg-red-500/20 text-red-400' },
}

export default function PedidoDrawer({ pedido: initialPedido, open, onClose, onEstadoUpdated }: PedidoDrawerProps) {
    const { dark } = useAdminTheme()
    const [pedido, setPedido] = useState<Pedido | null>(initialPedido)
    const [localEstado, setLocalEstado] = useState("")
    const [localTracking, setLocalTracking] = useState("")
    const [updating, setUpdating] = useState(false)
    const [saveError, setSaveError] = useState("")

    useEffect(() => {
        setPedido(initialPedido)
        setLocalEstado(initialPedido?.estado ?? "")
        setLocalTracking(initialPedido?.numero_seguimiento ?? "")
        setSaveError("")
    }, [initialPedido])

    if (!open || !pedido) return null

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(amount))
    }

    const handleSave = async () => {
        setSaveError("")
        const fields: Record<string, unknown> = {}
        if (localEstado !== pedido.estado) fields.estado = localEstado
        if (localTracking !== (pedido.numero_seguimiento ?? '')) fields.numero_seguimiento = localTracking
        if (!Object.keys(fields).length) return

        setUpdating(true)
        try {
            const updated = await patchPedidoFields(pedido.id, fields)
            setPedido(updated)
            setLocalEstado(updated.estado)
            setLocalTracking(updated.numero_seguimiento ?? "")
            onEstadoUpdated?.(updated)
        } catch {
            setSaveError("Error al guardar los cambios. Intenta de nuevo.")
        } finally {
            setUpdating(false)
        }
    }

    const hasChanges =
        localEstado !== pedido.estado ||
        localTracking !== (pedido.numero_seguimiento ?? '')

    const trackingRequerido = (localEstado === 'ENV' || localEstado === 'ENT') && !localTracking.trim()
    const canSave = hasChanges && !trackingRequerido

    const inputClass = `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
        dark
            ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500'
            : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
    }`

    const selectClass = `w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
        dark
            ? 'border-slate-700 bg-slate-800 text-slate-200'
            : 'border-gray-300 bg-white text-gray-900'
    }`

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
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
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

                    {/* Status badge */}
                    <div className="flex items-center gap-2">
                        <Badge className={dark ? ESTADO_COLORS[pedido.estado]?.dark : ESTADO_COLORS[pedido.estado]?.light}>
                            {ESTADO_LABELS[pedido.estado] ?? pedido.estado}
                        </Badge>
                    </div>

                    {/* Edición de estado + tracking */}
                    <div className={`rounded-lg border p-4 space-y-3 ${dark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Actualizar pedido
                        </p>

                        {/* Selector de estado */}
                        <div>
                            <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Estado
                            </label>
                            <select value={localEstado} onChange={e => setLocalEstado(e.target.value)} className={selectClass}>
                                {Object.entries(ESTADO_LABELS).map(([val, label]) => (
                                    <option key={val} value={val}>{label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Número de seguimiento */}
                        <div>
                            <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Número de seguimiento
                            </label>
                            <div className="relative">
                                <Truck className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                <input
                                    type="text"
                                    placeholder="Ej. 1Z999AA10123456784"
                                    value={localTracking}
                                    onChange={e => setLocalTracking(e.target.value)}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                            {(localEstado === 'ENV' || localEstado === 'ENT') && !localTracking.trim() && (
                                <p className={`text-xs mt-1 ${dark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    ⚠ El número de seguimiento es requerido para marcar como {localEstado === 'ENV' ? 'Enviado' : 'Entregado'}
                                </p>
                            )}
                        </div>

                        {saveError && (
                            <p className={`text-xs ${dark ? 'text-red-400' : 'text-red-600'}`}>{saveError}</p>
                        )}

                        <Button
                            onClick={handleSave}
                            disabled={updating || !canSave}
                            className={`w-full cursor-pointer ${
                                dark
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40'
                            }`}
                        >
                            {updating ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>

                    {/* Cliente */}
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

                    {/* Dirección de envío */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <MapPin className="h-4 w-4" />
                            Dirección de Envío
                        </div>
                        {pedido.direccion_envio ? (
                            <div className={`text-sm space-y-0.5 ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                <p className="font-medium">{pedido.direccion_envio.nombre}</p>
                                <p>{pedido.direccion_envio.street}</p>
                                <p>{pedido.direccion_envio.colony}, {pedido.direccion_envio.city}</p>
                                <p>{pedido.direccion_envio.state} CP {pedido.direccion_envio.postal_code}</p>
                                {pedido.direccion_envio.references && (
                                    <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        Ref: {pedido.direccion_envio.references}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className={`text-sm italic ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                Sin dirección registrada
                            </p>
                        )}
                    </div>

                    {/* Método de pago */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <CreditCard className="h-4 w-4" />
                            Pago
                        </div>
                        <div className={`space-y-1 text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                            <div>Método: {pedido.metodo_pago || 'No especificado'}</div>
                            <div>Estado: {pedido.pago_status_display || 'Sin pago'}</div>
                            {pedido.pago_fecha_aprobacion && (
                                <div className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Aprobado: {formatDate(pedido.pago_fecha_aprobacion)}
                                </div>
                            )}
                            {pedido.pago_payment_id && (
                                <div className={`font-mono text-xs break-all ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                    ID MP: {pedido.pago_payment_id}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Total e items count */}
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

                    {/* Fecha de creación */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                            <Calendar className="h-4 w-4" />
                            Fecha de creación
                        </div>
                        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-700'}`}>
                            {formatDate(pedido.fecha_creacion)}
                        </p>
                    </div>

                    {/* Productos */}
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
                                                {item.cantidad} × {formatCurrency(item.precio_unitario)}
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
