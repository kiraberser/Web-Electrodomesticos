'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Badge } from '@/components/ui/feedback/Badge'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/data/products'
import toast from 'react-hot-toast'

interface ProductCardMiniProps {
  product: Product
  showDiscount?: boolean
}

export default function ProductCardMini({ product, showDiscount = false }: ProductCardMiniProps) {
  const { addItem } = useCart()
  const hasDiscount = showDiscount && product.discount && product.original_price

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
    toast.success(`${product.name} agregado al carrito`)
  }

  return (
    <div className="flex-shrink-0 w-[260px] snap-start group">
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md overflow-hidden flex flex-col h-full">
        {/* Image */}
        <Link
          href={`/categorias/${product.category}/${product.slug}`}
          className="relative aspect-square bg-gray-50 overflow-hidden block"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="260px"
            className="object-contain p-4 transition-transform duration-200 group-hover:scale-105"
          />
          {hasDiscount ? (
            <Badge className="absolute top-2 left-2 bg-[#E38E49] text-white border-0 text-xs font-bold">
              -{product.discount}%
            </Badge>
          ) : null}
          <button
            className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Agregar a favoritos"
          >
            <Heart className="w-5 h-5" />
          </button>
        </Link>

        {/* Info */}
        <div className="p-4 flex flex-col flex-1">
          <Link href={`/categorias/${product.category}/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-3 leading-snug mb-3 hover:text-[#0A3981] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price */}
          <div className="mb-1">
            <span className="text-xl font-bold text-[#E38E49]">
              ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          </div>
          {hasDiscount ? (
            <span className="text-sm text-gray-400 line-through mb-2">
              ${product.original_price!.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
          ) : null}

          {/* Rating */}
          {product.rating ? (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="text-xs text-gray-400">({product.rating})</span>
            </div>
          ) : null}

          {/* Add to cart button */}
          <button
            onClick={handleAddToCart}
            className="mt-auto w-full py-2.5 bg-[#E38E49] hover:bg-[#d07d3a] text-white text-sm font-bold rounded-lg transition-colors duration-200 uppercase tracking-wide"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}
