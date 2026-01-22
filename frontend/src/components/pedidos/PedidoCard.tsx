"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../ui/forms/Button"
import PedidoStatusBadge from "./PedidoStatusBadge"
import PedidoItem from "./PedidoItem"
import { 
    Calendar, 
    CreditCard, 
    Package, 
    ChevronDown, 
    ChevronUp,
    ShoppingCart,
    MapPin,
    Clock,
    AlertTriangle
} from "lucide-react"
import type { Pedido } from "@/api/pedidos"
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'
import { addCartItemAction } from "@/actions/cart"

interface PedidoCardProps {
    pedido: Pedido
    isRecent?: boolean
}

export default function PedidoCard({ pedido, isRecent = false }: PedidoCardProps) {
    const [isExpanded, setIsExpanded] = useState(isRecent)
    const { addItem } = useCart()

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

    const getEstimatedDeliveryDate = (fechaCreacion: string, estado: string) => {
        if (estado === 'ENT') {
            return 'Entregado'
        }
        if (estado === 'ENV') {
            const date = new Date(fechaCreacion)
            date.setDate(date.getDate() + 3) // 3 días después del envío
            return date.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
        if (estado === 'PAG') {
            const date = new Date(fechaCreacion)
            date.setDate(date.getDate() + 5) // 5 días después del pago
            return date.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        }
        return null
    }

    const handleRecomprar = async () => {
        let addedCount = 0
        let failedCount = 0

        for (const item of pedido.items) {
            try {
                await addCartItemAction(Number(item.refaccion), item.cantidad)
                addItem({
                    id: String(item.refaccion),
                    name: item.refaccion_nombre,
                    price: Number(item.precio_unitario),
                    image: "/placeholder.svg",
                    quantity: item.cantidad,
                })
                addedCount++
            } catch (error) {
                failedCount++
            }
        }

        if (addedCount > 0) {
            toast.success(
                `${addedCount} producto${addedCount > 1 ? 's' : ''} agregado${addedCount > 1 ? 's' : ''} al carrito`,
                {
                    duration: 3000,
                    icon: '🛒',
                    style: {
                        background: '#0A3981',
                        color: '#fff',
                    },
                }
            )
        }

        if (failedCount > 0) {
            toast.error(
                `No se pudieron agregar ${failedCount} producto${failedCount > 1 ? 's' : ''}`,
                {
                    style: {
                        background: '#dc2626',
                        color: '#fff',
                    },
                }
            )
        }
    }

    const estimatedDelivery = getEstimatedDeliveryDate(pedido.fecha_creacion, pedido.estado)
    const canReorder = pedido.estado !== 'CAN' && pedido.pago_status === 'APR'
    
    // Verificar si el pedido está pendiente de pago
    const isPendingPayment = pedido.estado === 'CRE' && pedido.pago_status !== 'APR'
    const daysSinceCreation = Math.floor(
        (new Date().getTime() - new Date(pedido.fecha_creacion).getTime()) / (1000 * 60 * 60 * 24)
    )

    return (
        <div className={`bg-white rounded-lg shadow-sm border ${isRecent ? 'border-[#0A3981] border-2' : 'border-gray-200'} overflow-hidden transition-shadow hover:shadow-md`}>
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                {/* Advertencia de pago pendiente */}
                {isPendingPayment && daysSinceCreation < 3 && (
                    <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-yellow-900 mb-1">
                                    Pago pendiente
                                </h4>
                                <p className="text-xs sm:text-sm text-yellow-800 break-words">
                                    Este pedido está pendiente de pago. Por favor, realiza el pago en sucursal para completar tu compra. 
                                    Tienes {3 - daysSinceCreation} día{(3 - daysSinceCreation) !== 1 ? 's' : ''} restante{(3 - daysSinceCreation) !== 1 ? 's' : ''}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{pedido.id}
                            </h3>
                            {isRecent && (
                                <span className="text-xs font-medium text-[#0A3981] bg-blue-50 px-2 py-1 rounded whitespace-nowrap">
                                    Más reciente
                                </span>
                            )}
                            <PedidoStatusBadge estado={pedido.estado} />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="break-words">{formatDate(pedido.fecha_creacion)}</span>
                            </div>
                            {pedido.metodo_pago_display && (
                                <div className="flex items-center gap-1.5">
                                    <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <span className="break-words">{pedido.metodo_pago_display}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}</span>
                            </div>
                            {estimatedDelivery && (
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    <span className="break-words">Entrega: {estimatedDelivery}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(pedido.total)}
                        </div>
                        {pedido.pago_id && (
                            <div className="text-xs text-gray-500">
                                Pago #{pedido.pago_id}
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="outline"
                        className="flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="h-4 w-4" />
                                <span className="hidden sm:inline">Ocultar detalles</span>
                                <span className="sm:hidden">Ocultar</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="h-4 w-4" />
                                <span className="hidden sm:inline">Ver detalles</span>
                                <span className="sm:hidden">Detalles</span>
                            </>
                        )}
                    </Button>
                    {canReorder && (
                        <Button
                            onClick={handleRecomprar}
                            className="flex items-center justify-center gap-2 bg-[#0A3981] hover:bg-[#1F509A] text-white text-sm w-full sm:w-auto"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            <span className="hidden sm:inline">Volver a comprar</span>
                            <span className="sm:hidden">Recomprar</span>
                        </Button>
                    )}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Productos del pedido
                    </h4>
                    <div className="space-y-2 mb-6">
                        {pedido.items.map((item) => (
                            <PedidoItem key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Información de pago */}
                        {pedido.pago_payment_id && (
                            <div className="p-3 bg-white rounded-lg border border-gray-200">
                                <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                                    Información de pago
                                </h5>
                                <div className="space-y-1 text-xs text-gray-600">
                                    <div className="break-words">
                                        <span className="font-medium">ID de pago:</span> {pedido.pago_payment_id}
                                    </div>
                                    {pedido.pago_status_display && (
                                        <div className="break-words">
                                            <span className="font-medium">Estado:</span> {pedido.pago_status_display}
                                        </div>
                                    )}
                                    {pedido.pago_fecha_aprobacion && (
                                        <div className="break-words">
                                            <span className="font-medium">Fecha de aprobación:</span> {formatDate(pedido.pago_fecha_aprobacion)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dirección de envío placeholder */}
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                Dirección de envío
                            </h5>
                            <p className="text-xs text-gray-600 break-words">
                                Se utilizará tu dirección principal registrada
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

