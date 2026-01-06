"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "../ui/forms/Button"
import { Badge } from "../ui"
import { 
    Calendar, 
    CreditCard, 
    Package, 
    ChevronDown, 
    ChevronUp,
    ShoppingCart,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle
} from "lucide-react"
import type { Pedido } from "@/api/pedidos"
import { useCart } from '@/context/CartContext'
import toast from 'react-hot-toast'

interface CompraCardProps {
    compra: Pedido
}

const PAGO_ESTADO_COLORS: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
    'APR': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
    'PEN': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'REC': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    'CAN': { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle },
    'REE': { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle },
}

const PAGO_ESTADO_LABELS: Record<string, string> = {
    'APR': 'Aprobado',
    'PEN': 'Pendiente',
    'REC': 'Rechazado',
    'CAN': 'Cancelado',
    'REE': 'Reembolsado',
}

const PEDIDO_ESTADO_COLORS: Record<string, { bg: string; text: string }> = {
    'CRE': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'PAG': { bg: 'bg-green-100', text: 'text-green-800' },
    'ENV': { bg: 'bg-blue-100', text: 'text-blue-800' },
    'ENT': { bg: 'bg-emerald-100', text: 'text-emerald-800' },
    'CAN': { bg: 'bg-red-100', text: 'text-red-800' },
}

const PEDIDO_ESTADO_LABELS: Record<string, string> = {
    'CRE': 'Creado',
    'PAG': 'Pagado',
    'ENV': 'Enviado',
    'ENT': 'Entregado',
    'CAN': 'Cancelado',
}

export default function CompraCard({ compra }: CompraCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
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

    const handleRecomprar = () => {
        let addedCount = 0
        let failedCount = 0

        compra.items.forEach((item) => {
            try {
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
        })

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

    const pagoEstadoInfo = compra.pago_status 
        ? (PAGO_ESTADO_COLORS[compra.pago_status] || PAGO_ESTADO_COLORS['PEN'])
        : { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle }
    const PagoEstadoIcon = pagoEstadoInfo.icon
    const pedidoEstadoInfo = PEDIDO_ESTADO_COLORS[compra.estado] || PEDIDO_ESTADO_COLORS['CRE']

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-shadow hover:shadow-md">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Pedido #{compra.id}
                            </h3>
                            {compra.pago_status && (
                                <Badge className={`${pagoEstadoInfo.bg} ${pagoEstadoInfo.text} flex items-center gap-1 whitespace-nowrap`}>
                                    <PagoEstadoIcon className="h-3 w-3" />
                                    {PAGO_ESTADO_LABELS[compra.pago_status] || compra.pago_status_display || compra.pago_status}
                                </Badge>
                            )}
                            <Badge className={`${pedidoEstadoInfo.bg} ${pedidoEstadoInfo.text} whitespace-nowrap`}>
                                {PEDIDO_ESTADO_LABELS[compra.estado] || compra.estado}
                            </Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="break-words">{formatDate(compra.fecha_creacion)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <CreditCard className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="break-words">{compra.metodo_pago_display || compra.metodo_pago || 'No especificado'}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{compra.items.length} producto{compra.items.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                            {formatCurrency(compra.total)}
                        </div>
                        {compra.pago_id && (
                            <div className="text-xs text-gray-500">
                                Pago #{compra.pago_id}
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
                    {compra.pago_status === 'APR' && (
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
                        Productos comprados
                    </h4>
                    <div className="space-y-3">
                        {compra.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-white rounded-lg border border-gray-200"
                            >
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    {item.refaccion_imagen && (
                                        <Link
                                            href={`/categorias/productos/${encodeURIComponent(item.refaccion_nombre)}`}
                                            className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-white"
                                        >
                                            <Image
                                                src={item.refaccion_imagen}
                                                alt={item.refaccion_nombre}
                                                fill
                                                sizes="(max-width: 640px) 64px, 80px"
                                                className="object-cover"
                                            />
                                        </Link>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/categorias/productos/${encodeURIComponent(item.refaccion_nombre)}`}
                                            className="text-sm font-medium text-gray-900 hover:text-[#0A3981] transition-colors block break-words"
                                        >
                                            {item.refaccion_nombre}
                                        </Link>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs text-gray-500">
                                            <span>Cantidad: {item.cantidad}</span>
                                            <span>Precio unitario: {formatCurrency(item.precio_unitario)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left sm:text-right flex-shrink-0">
                                    <div className="text-sm font-semibold text-gray-900">
                                        {formatCurrency(item.subtotal)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Subtotal
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment Details */}
                    {compra.pago_payment_id && (
                        <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                            <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                Información de pago
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="break-words">
                                    <span className="font-medium">ID de pago:</span> {compra.pago_payment_id}
                                </div>
                                {compra.pago_status_detail && (
                                    <div className="break-words">
                                        <span className="font-medium">Detalle:</span> {compra.pago_status_detail}
                                    </div>
                                )}
                                {compra.pago_fecha_aprobacion && (
                                    <div className="col-span-1 sm:col-span-2 break-words">
                                        <span className="font-medium">Fecha de aprobación:</span> {formatDate(compra.pago_fecha_aprobacion)}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

