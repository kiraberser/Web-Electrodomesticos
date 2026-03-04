"use client"

import { memo } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2 } from "lucide-react"

// Hoisted outside component — never re-creates (Vercel: rendering-hoist-jsx)
const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)

type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  [key: string]: unknown
}

interface Props {
  item: CartItem
  onUpdateQuantity: (id: string, qty: number) => void
  onRemoveItem: (id: string) => void
}

const CartItemRow = memo(function CartItemRow({ item, onUpdateQuantity, onRemoveItem }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow sm:flex-row sm:items-center">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[#D4EBF8] bg-[#f8fafc]">
        <Image
          src={String(item.image || "/placeholder.svg")}
          alt={String(item.name)}
          fill
          className="object-contain p-2"
          sizes="112px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{String(item.name)}</h3>
        {"category" in item && (
          <p className="text-xs text-gray-400 mt-0.5">{String(item.category)}</p>
        )}
        <p className="mt-1.5 text-sm font-bold text-[#0A3981]">{formatPrice(Number(item.price))}</p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        {/* Stepper as single pill — overflow-hidden clips borders cleanly */}
        <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Disminuir cantidad"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-gray-900 select-none">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="px-3 py-2 text-gray-500 hover:bg-gray-50 transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            {formatPrice(Number(item.price) * item.quantity)}
          </p>
          <button
            type="button"
            onClick={() => onRemoveItem(item.id)}
            className="mt-1 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Quitar
          </button>
        </div>
      </div>
    </div>
  )
})

export default CartItemRow
