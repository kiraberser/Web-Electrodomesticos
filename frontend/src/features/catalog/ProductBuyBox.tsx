"use client"

import { memo, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { CreditCard, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { useCart } from "@/features/cart/CartContext"
import { addCartItemAction } from "@/features/cart/actions"
import { checkAuthentication } from "@/shared/lib/cookies"
import type { Product } from "@/shared/data/products"
import type { Refaccion } from "@/features/catalog/api"

// Hoisted static JSX — never re-renders (Vercel: rendering-hoist-jsx)
const TRUST_BADGES = (
  <div className="flex flex-col gap-3 mt-4 text-sm text-gray-500 bg-[#f8fafc] p-4 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      <span className="text-lg">🚚</span>
      <span>Envío asegurado a todo el país</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-lg">🛡️</span>
      <span>Garantía de compra protegida</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-lg">⚡</span>
      <span>Despacho en 24 horas hábiles</span>
    </div>
  </div>
)

interface Props {
  product: Product
  refaccion: Refaccion
  isFavorite: boolean
  isFavoriteLoading: boolean
  toggleFavorite: () => void
}

// memo() — only re-renders when product data or favorite state changes (Vercel: rerender-memo)
const ProductBuyBox = memo(function ProductBuyBox({
  product,
  refaccion,
  isFavorite,
  isFavoriteLoading,
  toggleFavorite,
}: Props) {
  const router = useRouter()
  const { addItem, items, updateQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)

  const cartItemQuantity = items.find((i) => i.id === product.id)?.quantity ?? 0

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1) return
    if (newQty > refaccion.existencias) {
      toast.error(`Solo hay ${refaccion.existencias} unidades disponibles`, {
        style: { background: "#dc2626", color: "#fff" },
      })
      return
    }
    setQuantity(newQty)
  }

  // Shared validation — de-duplicates addToCart + buyNow logic
  const validateAndAddToCart = async (qty: number): Promise<boolean> => {
    if (!product.inStock) {
      toast.error("Este producto no está disponible", { style: { background: "#dc2626", color: "#fff" } })
      return false
    }
    // Sync to backend only when authenticated
    if (checkAuthentication()) {
      const refaccionId = Number(product.id) || refaccion.id
      try {
        await addCartItemAction(refaccionId, qty)
      } catch {
        toast.error("No se pudo agregar al carrito", { style: { background: "#dc2626", color: "#fff" } })
        return false
      }
    }
    const stockDisponible = refaccion.existencias
    const existingItem = items.find((i) => i.id === product.id)
    if (existingItem) {
      const cantidadTotal = existingItem.quantity + qty
      if (cantidadTotal > stockDisponible) {
        const cantidadDisponible = stockDisponible - existingItem.quantity
        toast.error(
          cantidadDisponible <= 0
            ? `Ya tienes ${existingItem.quantity} en el carrito. Stock máximo: ${stockDisponible}`
            : `Solo puedes agregar ${cantidadDisponible} más (stock disponible: ${stockDisponible})`,
          { style: { background: "#dc2626", color: "#fff" } },
        )
        return false
      }
      updateQuantity(product.id, cantidadTotal)
    } else {
      if (qty > stockDisponible) {
        toast.error(`Solo hay ${stockDisponible} unidades disponibles`, {
          style: { background: "#dc2626", color: "#fff" },
        })
        return false
      }
      addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty })
    }
    return true
  }

  const handleAddToCart = async () => {
    const ok = await validateAndAddToCart(quantity)
    if (ok) {
      toast.success(
        `${quantity} ${quantity === 1 ? "unidad" : "unidades"} agregada${quantity > 1 ? "s" : ""} al carrito`,
        { style: { background: "#0A3981", color: "#fff" }, icon: "🛒" },
      )
      setQuantity(1)
    }
  }

  const handleBuyNow = async () => {
    const ok = await validateAndAddToCart(quantity)
    if (ok) router.push("/checkout")
  }

  return (
    <div className="lg:col-span-5 flex flex-col gap-6">
      {/* Header — brand, name, rating */}
      <div>
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[#1F509A] tracking-widest uppercase">
            {product.brand}
          </span>
          <div className="flex gap-2">
            <button
              onClick={toggleFavorite}
              disabled={isFavoriteLoading}
              className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
              aria-busy={isFavoriteLoading}
            >
              <Heart
                className={`h-6 w-6 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""} ${isFavoriteLoading ? "animate-pulse" : ""}`}
              />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-[#1F509A]"
              aria-label="Compartir"
            >
              <Share2 className="h-6 w-6" />
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0A3981] leading-tight mt-1">
          {product.name}
        </h1>

        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                className={s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">(24 opiniones)</span>
        </div>
      </div>

      {/* Price */}
      <div className="border-t border-b border-gray-100 py-4">
        <div className="text-4xl font-extrabold text-[#0A3981]">
          ${product.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
          <span className="text-lg text-gray-400 font-normal ml-1">MXN</span>
        </div>
        <p className="text-sm text-green-600 font-medium mt-1">✓ Precio disponible online</p>
      </div>

      {/* Quick specs */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        {product.specs.slice(0, 4).map((s, idx) => (
          <div key={idx} className="bg-[#D4EBF8]/20 p-2.5 rounded-lg border border-[#D4EBF8]/40">
            <span className="block text-gray-400 text-xs">{s.label}</span>
            <span className="block font-semibold text-[#0A3981] truncate">{s.value}</span>
          </div>
        ))}
      </div>

      {/* Quantity selector */}
      {product.inStock && (
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-600">Cantidad:</label>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max={refaccion.existencias}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-14 text-center border-0 focus:ring-0 focus:outline-none text-sm font-semibold"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= refaccion.existencias}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {refaccion.existencias > 0 && (
            <span className="text-xs text-green-700 font-medium bg-green-50 px-2.5 py-0.5 rounded-full">
              {refaccion.existencias} disp.
            </span>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        {product.inStock ? (
          <>
            <Button
              onClick={handleBuyNow}
              className="w-full bg-[#E38E49] hover:bg-[#cf7d3c] text-white text-lg py-6 shadow-lg shadow-orange-100 transition-all hover:shadow-orange-200 active:scale-[0.98]"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Comprar Ahora
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="outline"
              className="w-full border-2 border-[#E38E49] text-[#E38E49] hover:bg-[#FFF8F3] text-lg py-6 transition-all active:scale-[0.98]"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al Carrito
              {cartItemQuantity > 0 && (
                <Badge className="ml-2 bg-[#E38E49] text-white">{cartItemQuantity}</Badge>
              )}
            </Button>
          </>
        ) : (
          <Button disabled className="w-full bg-gray-100 text-gray-400 py-6 cursor-not-allowed">
            No disponible temporalmente
          </Button>
        )}
        <p className="text-xs text-center text-gray-400">
          Vendido y enviado por{" "}
          <span className="font-bold text-[#0A3981]">Refaccionaria Vega</span>
        </p>
      </div>

      {/* Trust badges — hoisted static JSX, never triggers re-render */}
      {TRUST_BADGES}
    </div>
  )
})

export default ProductBuyBox
