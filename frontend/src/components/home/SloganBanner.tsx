'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const slogans = [
  'Más de 20 años cuidando tu hogar',
  'Calidad que se nota, servicio que se siente',
  'Tu refaccionaria de confianza',
  'Reparamos lo que no se ve, pero es necesario',
  'Envíos a toda la república mexicana',
  'Atención personalizada para cada cliente',
  'Repuestos originales con garantía',
]

export default function SloganBanner() {
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const start = () => {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % slogans.length)
      }, 3500)
    }
    const stop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    const handleVisibility = () => {
      if (document.hidden) { stop() } else { start() }
    }

    start()
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      stop()
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <section className="bg-[#0A3981] overflow-hidden">
      <div className="container mx-auto px-0 md:px-4">
        <div className="grid md:grid-cols-2 min-h-[280px] md:min-h-[320px]">
          {/* Image half */}
          <div className="relative hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1920"
              alt="Taller de refacciones"
              fill
              sizes="50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0A3981]/80" />
          </div>

          {/* Text half */}
          <div className="flex items-center justify-center px-8 py-12 md:py-0">
            <div className="text-center md:text-left max-w-md">
              <p className="text-[#E38E49] text-sm font-semibold uppercase tracking-widest mb-4">
                Refaccionaria Vega
              </p>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
                >
                  {slogans[current]}
                </motion.h2>
              </AnimatePresence>
              <div className="mt-6 flex items-center gap-2 justify-center md:justify-start">
                {slogans.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      i === current ? 'bg-[#E38E49] w-4' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Frase ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
