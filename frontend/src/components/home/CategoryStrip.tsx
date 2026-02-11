'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '@/data/category'

const VISIBLE = 5

export default function CategoryStrip() {
  const [startIndex, setStartIndex] = useState(0)

  const prev = useCallback(() => {
    setStartIndex((i) => (i - 1 + categories.length) % categories.length)
  }, [])

  const next = useCallback(() => {
    setStartIndex((i) => (i + 1) % categories.length)
  }, [])

  // Build visible items with wrap-around
  const visible = Array.from({ length: VISIBLE }, (_, offset) => {
    const idx = (startIndex + offset) % categories.length
    return categories[idx]
  })

  return (
    <section className="py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Categorías</h2>
        <div className="relative flex items-center">
          {/* Left arrow — always visible for infinite */}
          <button
            onClick={prev}
            className="absolute -left-2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0A3981] hover:shadow-lg transition-all"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories grid */}
          <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-4 px-6">
            {visible.map((cat, i) => (
              <Link
                key={`${cat.id}-${i}`}
                href={`/categorias/${cat.key}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200"
              >
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white shadow-sm">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0A3981] transition-colors text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right arrow — always visible for infinite */}
          <button
            onClick={next}
            className="absolute -right-2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0A3981] hover:shadow-lg transition-all"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
