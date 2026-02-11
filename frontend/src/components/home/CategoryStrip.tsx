'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '@/data/category'

function useVisibleCount() {
  const [count, setCount] = useState(3)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setCount(mq.matches ? 5 : 3)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return count
}

export default function CategoryStrip() {
  const [startIndex, setStartIndex] = useState(0)
  const visibleCount = useVisibleCount()

  const prev = useCallback(() => {
    setStartIndex((i) => (i - 1 + categories.length) % categories.length)
  }, [])

  const next = useCallback(() => {
    setStartIndex((i) => (i + 1) % categories.length)
  }, [])

  // Build visible items with wrap-around
  const visible = Array.from({ length: visibleCount }, (_, offset) => {
    const idx = (startIndex + offset) % categories.length
    return categories[idx]
  })

  return (
    <section className="py-10 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Categorías</h2>
        <div className="relative flex items-center">
          {/* Left arrow */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-[#E38E49] focus-visible:outline-none"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Categories grid */}
          <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 px-10 md:px-12">
            {visible.map((cat, i) => (
              <Link
                key={`${cat.id}-${i}`}
                href={`/categorias/${cat.key}`}
                className="group flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#E38E49] focus-visible:outline-none"
              >
                <div className="relative w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-white shadow-sm">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 56px, 80px"
                    className="object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-700 group-hover:text-[#0A3981] transition-colors text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="absolute right-0 md:-right-2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-[#E38E49] focus-visible:outline-none"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}
