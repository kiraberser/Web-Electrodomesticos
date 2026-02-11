'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/feedback/Badge'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/data/products'
import toast from 'react-hot-toast'

interface FeaturedGridProps {
  title: string
  products: Product[]
  viewAllHref?: string
}

function FeaturedCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    toast.success(`${product.name} agregado al carrito`)
  }

  if (featured) {
    return (
      <div className="relative rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full group">
        <Link
          href={`/categorias/${product.category}/${product.slug}`}
          className="relative aspect-[4/3] bg-gray-50 overflow-hidden block"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-200"
          />
          <button
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Agregar a favoritos"
          >
            <Heart className="w-5 h-5" />
          </button>
          {product.rating ? (
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="text-yellow-400 text-sm">★</span>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
            </div>
          ) : null}
        </Link>
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
          <Link href={`/categorias/${product.category}/${product.slug}`}>
            <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-3 hover:text-[#0A3981] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.shortDescription}</p>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-2xl font-bold text-[#E38E49]">
              ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
            <button
              onClick={handleAddToCart}
              className="px-5 py-2.5 bg-[#E38E49] hover:bg-[#d07d3a] text-white text-sm font-bold rounded-lg transition-colors uppercase tracking-wide"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-row h-full group">
      <Link
        href={`/categorias/${product.category}/${product.slug}`}
        className="relative w-28 flex-shrink-0 bg-gray-50 overflow-hidden"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="112px"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
        />
      </Link>
      <div className="p-3 flex flex-col flex-1 justify-center min-w-0">
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{product.brand}</p>
        <Link href={`/categorias/${product.category}/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight hover:text-[#0A3981] transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.rating ? (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-yellow-400 text-xs">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="text-[10px] text-gray-400">({product.rating})</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between mt-2">
          <span className="text-base font-bold text-[#E38E49]">
            ${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-xs font-bold text-[#0A3981] hover:text-[#E38E49] transition-colors"
          >
            + Carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedGrid({ title, products, viewAllHref }: FeaturedGridProps) {
  const [featured, ...rest] = products

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0A3981] uppercase tracking-wide">{title}</h2>
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

        <div className="grid md:grid-cols-2 gap-4">
          {/* Featured large card */}
          <FeaturedCard product={featured} featured />

          {/* Side stack of smaller cards */}
          <div className="flex flex-col gap-4">
            {rest.slice(0, 3).map((product) => (
              <FeaturedCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
