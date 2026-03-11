'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

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
  const [state, setState] = useState<'visible' | 'exit' | 'enter'>('visible')
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const advance = useCallback((next?: number) => {
    setState('exit')
    setTimeout(() => {
      setCurrent((prev) => next !== undefined ? next : (prev + 1) % slogans.length)
      setState('enter')
      setTimeout(() => setState('visible'), 50)
    }, 300)
  }, [])

  useEffect(() => {
    const start = () => { intervalRef.current = setInterval(() => advance(), 4000) }
    const stop = () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    const onVis = () => document.hidden ? stop() : start()
    start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [advance])

  const textStyle = {
    visible: 'opacity-100 translate-y-0',
    exit: 'opacity-0 -translate-y-4',
    enter: 'opacity-0 translate-y-4',
  }[state]

  return (
    <section className="relative bg-[#0A3981] overflow-hidden">

      {/* ── Geometric background ── */}
      {/* Large diagonal stripe */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `
            linear-gradient(135deg,
              transparent 0%, transparent 38%,
              rgba(227,142,73,0.06) 38%, rgba(227,142,73,0.06) 62%,
              transparent 62%, transparent 100%
            )
          `,
        }}
      />

      {/* Top-left corner accent block */}
      <div
        aria-hidden
        className="absolute -top-6 -left-6 w-40 h-40 rounded-3xl border-2 border-[#E38E49]/15 rotate-12 pointer-events-none"
      />

      {/* Bottom-right large circle */}
      <div
        aria-hidden
        className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-white/5 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-[#E38E49]/10 pointer-events-none"
      />

      {/* Horizontal rule accent */}
      <div aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E38E49]/40 to-transparent" />

      {/* ── Content ── */}
      <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 justify-center">
            <span className="h-px w-8 bg-[#E38E49]/50" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E38E49]">
              Refaccionaria Vega
            </span>
            <span className="h-px w-8 bg-[#E38E49]/50" />
          </div>

          {/* Animated slogan */}
          <div className="relative min-h-[5rem] sm:min-h-[4rem] flex items-center justify-center mb-8">
            <h2
              className={`text-center text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight transition-all duration-300 ease-in-out ${textStyle}`}
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Orange accent on first word */}
              {(() => {
                const words = slogans[current].split(' ')
                return (
                  <>
                    <span className="text-[#E38E49]">{words[0]}</span>
                    {' '}
                    <span>{words.slice(1).join(' ')}</span>
                  </>
                )
              })()}
            </h2>
          </div>

          {/* Dot nav */}
          <div className="flex items-center justify-center gap-2">
            {slogans.map((_, i) => (
              <button
                key={i}
                onClick={() => advance(i)}
                aria-label={`Frase ${i + 1}`}
                className={`rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none ${
                  i === current
                    ? 'w-6 h-2 bg-[#E38E49]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* ── Bottom accent ── */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E38E49]/30 to-transparent" />

    </section>
  )
}
