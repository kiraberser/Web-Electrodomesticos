'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@/shared/data/carouselData'

interface HeroCarouselProps {
  slides: HeroSlide[]
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1)
      setCurrent(index)
    },
    [current],
  )

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // Auto-advance with visibility API (no setInterval when tab hidden)
  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(next, 5000)
    }
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    const handleVisibility = () => {
      if (document.hidden) {
        stop()
      } else {
        start()
      }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [next])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  }

  const slide = slides[current]

  return (
    <section className="relative w-full h-[350px] md:h-[420px] lg:h-[calc(80vh-80px)] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Background image */}
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <div className="max-w-lg">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                {slide.title}
              </h1>
              <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed">
                {slide.subtitle}
              </p>
              <Link
                href={slide.ctaHref}
                className="inline-flex items-center gap-2 bg-[#E38E49] hover:bg-[#d07d3a] text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200"
              >
                {slide.ctaText}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              i === current ? 'bg-[#E38E49] w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
