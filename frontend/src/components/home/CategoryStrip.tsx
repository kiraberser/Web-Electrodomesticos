'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '@/data/category'

function useVisibleCount() {
  const [count, setCount] = useState(2)

  useEffect(() => {
    const breakpoints = [
      window.matchMedia('(min-width: 1280px)'),  // xl: 6
      window.matchMedia('(min-width: 1024px)'),  // lg: 5
      window.matchMedia('(min-width: 768px)'),   // md: 4
      window.matchMedia('(min-width: 640px)'),   // sm: 3
    ]

    const update = () => {
      if (breakpoints[0].matches) setCount(6)
      else if (breakpoints[1].matches) setCount(5)
      else if (breakpoints[2].matches) setCount(4)
      else if (breakpoints[3].matches) setCount(3)
      else setCount(2)
    }

    update()
    breakpoints.forEach((mq) => mq.addEventListener('change', update))
    return () => breakpoints.forEach((mq) => mq.removeEventListener('change', update))
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

  const visible = Array.from({ length: visibleCount }, (_, offset) => {
    const idx = (startIndex + offset) % categories.length
    return categories[idx]
  })

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 md:mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold  text-[#0A3981] tracking-tight">
              Categorías más buscadas
            </h2>
            <p className="text-gray-500 text-sm mt-1 hidden sm:block">
              Encuentra refacciones por tipo de electrodoméstico
            </p>
          </div>
          <Link
            href="/categorias"
            className="text-sm font-medium text-[#0A3981] hover:text-[#0A3981]/70 transition-colors whitespace-nowrap ml-4"
          >
            Ver todas
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Arrows */}
          <button
            onClick={prev}
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-lg hover:border-[#0A3981]/20 transition-all duration-150 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#0A3981] hover:shadow-lg hover:border-[#0A3981]/20 transition-all duration-150 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Cards grid */}
          <div
            className="grid gap-3 sm:gap-4 px-6 sm:px-8"
            style={{ gridTemplateColumns: `repeat(${visibleCount}, minmax(0, 1fr))` }}
          >
            {visible.map((cat, i) => (
              <Link
                key={`${cat.id}-${i}`}
                href={`/categorias/${cat.key}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:border-[#0A3981]/30 group-hover:shadow-lg transition-all duration-150">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    sizes={`(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw`}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A3981]/80 via-[#0A3981]/10 to-transparent" />

                  {/* Label */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4">
                    <span className="text-sm sm:text-base font-semibold text-white leading-tight drop-shadow-sm">
                      {cat.label}
                    </span>
                    <p className="text-[11px] text-white/60 mt-0.5 hidden sm:block line-clamp-1">
                      {cat.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-1.5 mt-6">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => setStartIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                  i === startIndex
                    ? 'w-6 bg-[#0A3981]'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a categoría ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
