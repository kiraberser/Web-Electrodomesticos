"use client"

import { Button } from "@/components/admin/ui/Button"
import { Badge } from "@/components/ui/feedback/Badge"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Venta, VentaRefaccion, VentaServicio, Devolucion } from "@/api/ventas"
import { X, Store, Wrench, Calendar, DollarSign, Package, User, FileText } from "lucide-react"

interface VentaDrawerProps {
    venta: Venta | null
    open: boolean
    onClose: () => void
}

const TIPO_LABELS: Record<string, string> = {
    'refaccion': 'Venta de Refacción',
    'servicio': 'Venta de Servicio',
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

export default function VentaDrawer({ venta, open, onClose }: VentaDrawerProps) {
    const { dark } = useAdminTheme()
    
    if (!open || !venta) return null

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

    const formatCurrency = (amount: string | number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(Number(amount))
    }

    const fecha = venta.tipo === 'devolucion' 
        ? (venta as Devolucion).fecha_devolucion 
        : (venta as VentaRefaccion | VentaServicio).fecha_venta

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-xl border-l shadow-xl overflow-y-auto ${
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                }`}
                role="dialog"
                aria-label="Detalle de venta"
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 flex items-center justify-between border-b p-4 ${
                    dark ? 'border-slate-800 bg-slate-900' : 'bg-white'
                }`}>
                    <div>
                        <div className={`text-sm font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                            {TIPO_LABELS[venta.tipo]} #{venta.id}
                        </div>
                        <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                            Detalles de la venta
                        </h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-4 space-y-4">
                    {/* Tipo badge */}
                    <div className="flex items-center gap-2">
                        <Badge className={dark ? TIPO_COLORS[venta.tipo]?.dark : TIPO_COLORS[venta.tipo]?.light}>
                            {TIPO_LABELS[venta.tipo]}
                        </Badge>
                        {venta.tipo === 'servicio' && (venta as VentaServicio).estado_pago && (
                            <Badge className={
                                dark 
                                    ? ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.dark
                                    : ESTADO_PAGO_COLORS[(venta as VentaServicio).estado_pago]?.light
                            }>
                                {(venta as VentaServicio).estado_pago}
                            </Badge>
                        )}
                    </div>

                    {/* Venta de Refacción */}
                    {venta.tipo === 'refaccion' && (
                        <>
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    <Package className="h-4 w-4" />
                                    Producto
                                </div>
                                <div className={`text-sm font-medium ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                    {(venta as VentaRefaccion).refaccion_nombre}
                                </div>
                                <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Marca: {(venta as VentaRefaccion).marca_nombre}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <Package className="h-4 w-4" />
                                        Cantidad
                                    </div>
                                    <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {(venta as VentaRefaccion).cantidad}
                                    </div>
                                </div>
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <DollarSign className="h-4 w-4" />
                                        Precio Unitario
                                    </div>
                                    <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency((venta as VentaRefaccion).precio_unitario)}
                                    </div>
                                </div>
                            </div>

                            {(venta as VentaRefaccion).usuario_username && (
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        <User className="h-4 w-4" />
                                        Usuario
                                    </div>
                                    <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {(venta as VentaRefaccion).usuario_username}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Venta de Servicio */}
                    {venta.tipo === 'servicio' && (
                        <>
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    <Wrench className="h-4 w-4" />
                                    Servicio
                                </div>
                                <div className={`text-sm font-medium ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                    {(venta as VentaServicio).servicio_aparato || `Servicio #${(venta as VentaServicio).servicio}`}
                                </div>
                                {(venta as VentaServicio).tecnico && (
                                    <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                        Técnico: {(venta as VentaServicio).tecnico}
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <DollarSign className="h-4 w-4" />
                                        Mano de Obra
                                    </div>
                                    <div className={`mt-1 text-xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency((venta as VentaServicio).mano_obra)}
                                    </div>
                                </div>
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <Package className="h-4 w-4" />
                                        Refacciones
                                    </div>
                                    <div className={`mt-1 text-xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency((venta as VentaServicio).refacciones_total)}
                                    </div>
                                </div>
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <DollarSign className="h-4 w-4" />
                                        Total
                                    </div>
                                    <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency((venta as VentaServicio).total)}
                                    </div>
                                </div>
                            </div>

                            {(venta as VentaServicio).garantia_dias && (
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        <Calendar className="h-4 w-4" />
                                        Garantía
                                    </div>
                                    <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {(venta as VentaServicio).garantia_dias} días
                                    </div>
                                </div>
                            )}

                            {(venta as VentaServicio).observaciones && (
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        <FileText className="h-4 w-4" />
                                        Observaciones
                                    </div>
                                    <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {(venta as VentaServicio).observaciones}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Devolución */}
                    {venta.tipo === 'devolucion' && (
                        <>
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    <Package className="h-4 w-4" />
                                    Producto
                                </div>
                                <div className={`text-sm font-medium ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                    {(venta as Devolucion).refaccion_nombre}
                                </div>
                                <div className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                    Marca: {(venta as Devolucion).marca_nombre}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <Package className="h-4 w-4" />
                                        Cantidad
                                    </div>
                                    <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {(venta as Devolucion).cantidad}
                                    </div>
                                </div>
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                        <DollarSign className="h-4 w-4" />
                                        Precio Unitario
                                    </div>
                                    <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                        {formatCurrency((venta as Devolucion).precio_unitario)}
                                    </div>
                                </div>
                            </div>

                            {(venta as Devolucion).venta_id && (
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        <Store className="h-4 w-4" />
                                        Venta Relacionada
                                    </div>
                                    <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Venta #{(venta as Devolucion).venta_id}
                                    </div>
                                </div>
                            )}

                            {(venta as Devolucion).motivo && (
                                <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className={`mb-2 flex items-center gap-2 text-sm font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                        <FileText className="h-4 w-4" />
                                        Motivo
                                    </div>
                                    <div className={`text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        {(venta as Devolucion).motivo}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Información común */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <DollarSign className="h-4 w-4" />
                                Total
                            </div>
                            <div className={`mt-1 text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                {formatCurrency(venta.total)}
                            </div>
                        </div>
                        <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                            <div className={`flex items-center gap-2 text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                <Calendar className="h-4 w-4" />
                                Fecha
                            </div>
                            <div className={`mt-1 text-sm ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                {formatDate(fecha)}
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}

