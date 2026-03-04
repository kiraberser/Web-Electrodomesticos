"use client"

import { memo } from "react"
import Link from "next/link"
import { CreditCard, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"

// Hoisted outside component — never re-creates (Vercel: rendering-hoist-jsx)
const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price)

const FREE_SHIPPING_THRESHOLD = 600

interface Props {
  subtotal: number
  onClearCart: () => void
}

const CartSummaryPanel = memo(function CartSummaryPanel({ subtotal, onClearCart }: Props) {
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150

  return (
    <aside className="sticky top-24 h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[#0A3981]">Resumen del pedido</h2>

      <div className="mt-5 space-y-3 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Envío estimado</span>
          <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : "text-gray-500"}`}>
            {shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#D4EBF8] pt-4">
        <span className="font-semibold text-gray-700">Total estimado</span>
        <span className="text-2xl font-extrabold text-[#0A3981]">
          {formatPrice(subtotal + shippingCost)}
        </span>
      </div>

      <div className="mt-6 space-y-3">
        <Link href="/checkout" className="block">
          <Button className="w-full bg-[#E38E49] hover:bg-[#d68340] text-white shadow-lg shadow-orange-100">
            <CreditCard className="mr-2 h-5 w-5" />
            Finalizar Compra
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={onClearCart}
          className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Vaciar carrito
        </Button>
      </div>

      <p className="mt-4 text-xs text-center text-gray-400">
        Envío gratis en pedidos mayores a {formatPrice(FREE_SHIPPING_THRESHOLD)}.
      </p>
    </aside>
  )
})

export default CartSummaryPanel
