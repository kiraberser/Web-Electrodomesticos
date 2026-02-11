'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, TrendingUp } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/data/products'
import toast from 'react-hot-toast'

interface FeaturedGridProps {
  title: string
  products: Product[]
  viewAllHref?: string
}

function RankedCard({ product, rank }: { product: Product; rank: number }) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    toast.success(`${product.name} agregado al carrito`)
  }

  const isFirst = rank === 1

  return (
    <Link
      href={`/categorias/${product.category}/${product.slug}`}
      className="group relative flex flex-col"
    >
      <div
        className={`relative rounded-2xl overflow-hidden bg-white transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${
          isFirst ? 'ring-2 ring-[#E38E49]/30' : 'border border-gray-100'
        }`}
      >
        {/* Rank number watermark */}
        <span className="absolute top-3 left-4 text-[64px] font-black leading-none text-gray-100 select-none z-0">
          {String(rank).padStart(2, '0')}
        </span>

        {/* Top accent for #1 */}
        {isFirst ? (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E38E49] to-[#E38E49]/40" />
        ) : null}

        {/* Product image */}
        <div className="relative z-10 flex items-center justify-center pt-6 pb-2 px-4">
          <div className="relative w-32 h-32 md:w-36 md:h-36">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="144px"
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Info */}
        <div className="relative z-10 px-4 pb-4 pt-2">
          {/* Brand + Rating */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
              {product.brand}
            </span>
            {product.rating ? (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400 text-xs">★</span>
                <span className="text-[11px] font-semibold text-gray-500">{product.rating}</span>
              </div>
            ) : null}
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug mb-3 group-hover:text-[#0A3981] transition-colors">
            {product.name}
          </h3>

          {/* Price + Cart */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#0A3981]">
              ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-[#E38E49] flex items-center justify-center text-white hover:bg-[#d07d3a] transition-colors duration-200"
              aria-label="Agregar al carrito"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedGrid({ title, products, viewAllHref }: FeaturedGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <TrendingUp className="w-5 h-5 text-[#E38E49]" />
            <h2 className="text-2xl font-bold text-[#0A3981] uppercase tracking-wide">{title}</h2>
          </div>
          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="flex items-center gap-1 text-sm font-medium text-[#0A3981] hover:text-[#E38E49] transition-colors"
            >
              Ver todo
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : null}
        </div>

        {/* Ranked grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product, i) => (
            <RankedCard key={product.id} product={product} rank={i + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
