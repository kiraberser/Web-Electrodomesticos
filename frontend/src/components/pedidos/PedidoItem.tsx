"use client"

import Link from "next/link"
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
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 min-w-0">
                <Link
                    href={`/categorias/productos/${encodeURIComponent(item.refaccion_nombre)}`}
                    className="text-sm font-medium text-gray-900 hover:text-[#0A3981] transition-colors block truncate"
                >
                    {item.refaccion_nombre}
                </Link>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>Cantidad: {item.cantidad}</span>
                    <span>Precio unitario: {formatCurrency(item.precio_unitario)}</span>
                </div>
            </div>
            <div className="text-right ml-4">
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

