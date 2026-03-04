"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { useCart } from "@/features/cart/CartContext"
import CartItemRow from "./CartItemRow"
import CartSummaryPanel from "./CartSummaryPanel"

export default function CartClient() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCart()
  const subtotal = getTotalPrice()

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc]">
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D4EBF8] bg-white p-12 text-center">
            <div className="bg-[#D4EBF8]/30 p-5 rounded-full mb-5">
              <ShoppingCart className="h-10 w-10 text-[#0A3981]" />
            </div>
            <h2 className="text-xl font-bold text-[#0A3981]">Tu carrito está vacío</h2>
            <p className="mt-2 text-sm text-gray-500">Agrega productos para comenzar a comprar</p>
            <Link href="/categorias">
              <Button className="mt-6 bg-[#1F509A] hover:bg-[#0A3981] text-white">
                Ver productos
              </Button>
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0A3981]">Tu carrito</h1>
            <p className="text-sm text-gray-500">
              Revisa tus productos antes de finalizar la compra
            </p>
          </div>
          <Link
            href="/categorias"
            className="text-sm font-medium text-[#1F509A] hover:text-[#0A3981] transition-colors"
          >
            Seguir comprando →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />
            ))}
          </div>

          <CartSummaryPanel
            subtotal={subtotal}
            onClearCart={clearCart}
          />
        </div>
      </section>
    </main>
  )
}
