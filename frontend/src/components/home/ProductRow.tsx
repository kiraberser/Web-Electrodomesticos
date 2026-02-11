'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/feedback/Badge'
import ProductCardMini from '@/components/home/ProductCardMini'
import type { Product } from '@/data/products'

const VISIBLE = 4

interface ProductRowProps {
  title: string
  products: Product[]
  viewAllHref?: string
  badge?: string
  showDiscount?: boolean
}

export default function ProductRow({
  title,
  products,
  viewAllHref,
  badge,
  showDiscount = false,
}: ProductRowProps) {
  const [startIndex, setStartIndex] = useState(0)
  const maxStart = Math.max(0, products.length - VISIBLE)

  const prev = () => setStartIndex((i) => Math.max(0, i - 1))
  const next = () => setStartIndex((i) => Math.min(maxStart, i + 1))

  const visible = products.slice(startIndex, startIndex + VISIBLE)

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#0A3981] uppercase tracking-wide">{title}</h2>
            {badge ? (
              <Badge className="bg-blue-50 text-[#0A3981] border-0 text-xs font-medium">
                {badge}
              </Badge>
            ) : null}
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

        {/* Carousel with arrows */}
        <div className="relative">
          {/* Left arrow */}
          {startIndex > 0 ? (
            <button
              onClick={prev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-lg transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visible.map((product) => (
              <ProductCardMini
                key={product.id}
                product={product}
                showDiscount={showDiscount}
              />
            ))}
          </div>

          {/* Right arrow */}
          {startIndex < maxStart ? (
            <button
              onClick={next}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-lg transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  )
}
