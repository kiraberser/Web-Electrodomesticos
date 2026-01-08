"use client"

import Link from "next/link"
import Image from "next/image"
import type { PedidoItem as PedidoItemType } from "@/api/pedidos"

interface PedidoItemProps {
    item: PedidoItemType
}

export default function PedidoItem({ item }: PedidoItemProps) {
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(Number(amount))
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
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
    )
}

