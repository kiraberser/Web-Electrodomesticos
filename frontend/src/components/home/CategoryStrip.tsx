'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categories } from '@/data/category'

const VISIBLE = 5

export default function CategoryStrip() {
  const [startIndex, setStartIndex] = useState(0)
  const maxStart = Math.max(0, categories.length - VISIBLE)

  const prev = () => setStartIndex((i) => Math.max(0, i - 1))
  const next = () => setStartIndex((i) => Math.min(maxStart, i + 1))

  const visible = categories.slice(startIndex, startIndex + VISIBLE)

  return (
    <section className="py-8 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Categorías</h2>
        <div className="relative flex items-center">
          {/* Left arrow */}
          {startIndex > 0 ? (
            <button
              onClick={prev}
              className="absolute -left-2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0A3981] hover:shadow-lg transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* Categories grid */}
          <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-4 px-6">
            {visible.map((cat) => (
              <Link
                key={cat.id}
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

          {/* Right arrow */}
          {startIndex < maxStart ? (
            <button
              onClick={next}
              className="absolute -right-2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-[#0A3981] hover:shadow-lg transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : null}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: maxStart + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => setStartIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === startIndex ? 'bg-[#0A3981] w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Página ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
