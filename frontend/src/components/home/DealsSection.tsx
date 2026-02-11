'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCardMini from '@/components/home/ProductCardMini'
import type { Product } from '@/data/products'

const CountdownTimer = dynamic(
  () => import('@/components/home/CountdownTimer'),
  { loading: () => <div className="h-6 w-40 animate-pulse bg-gray-100 rounded" /> },
)

const VISIBLE = 4

interface DealsSectionProps {
  products: Product[]
}

function getDealEndTime(): string {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end.toISOString()
}

export default function DealsSection({ products }: DealsSectionProps) {
  const [startIndex, setStartIndex] = useState(0)

  if (products.length === 0) return null

  const maxStart = Math.max(0, products.length - VISIBLE)
  const prev = () => setStartIndex((i) => Math.max(0, i - 1))
  const next = () => setStartIndex((i) => Math.min(maxStart, i + 1))
  const visible = products.slice(startIndex, startIndex + VISIBLE)
  const dealEnd = getDealEndTime()

  return (
    <section className="py-10 bg-[#FAFBFC]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#E38E49]" />
            <h2 className="text-2xl font-bold text-[#0A3981] uppercase tracking-wide">Ofertas del Día</h2>
          </div>
          <CountdownTimer targetDate={dealEnd} />
        </div>

        {/* Carousel with arrows */}
        <div className="relative">
          {startIndex > 0 ? (
            <button
              onClick={prev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-lg transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : null}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {visible.map((product) => (
              <ProductCardMini
                key={product.id}
                product={product}
                showDiscount
              />
            ))}
          </div>

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
