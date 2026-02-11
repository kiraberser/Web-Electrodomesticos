'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PHONE = '522323216694'
const DEFAULT_MESSAGE = 'Hola, me gustaría obtener información sobre sus productos y refacciones en electromesticos.'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className}>
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.1l5.904-1.96A15.87 15.87 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.312 22.594c-.39 1.1-1.932 2.014-3.182 2.28-.854.18-1.97.324-5.726-1.232-4.808-1.99-7.904-6.876-8.144-7.194-.23-.318-1.932-2.574-1.932-4.908s1.222-3.48 1.656-3.958c.434-.478.95-.598 1.264-.598.314 0 .63.002.904.016.29.014.68-.11 1.064.812.39.94 1.33 3.248 1.448 3.484.118.236.196.51.04.826-.158.318-.236.514-.472.794-.236.278-.496.622-.71.834-.236.236-.482.492-.208.966.274.472 1.218 2.01 2.616 3.256 1.796 1.6 3.31 2.096 3.782 2.332.472.236.748.196 1.022-.118.274-.316 1.182-1.378 1.496-1.852.314-.472.63-.39 1.064-.236.434.158 2.746 1.296 3.218 1.532.472.236.788.354.904.55.118.196.118 1.132-.272 2.234z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true)
  

  // Auto-show tooltip after 4s, once per session
  useEffect(() => {
    const key = 'wa_tooltip_shown'
    if (sessionStorage.getItem(key)) return

    const timer = setTimeout(() => {
      setShowTooltip(true)
      sessionStorage.setItem(key, '1')
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const waUrl = `https://wa.me/${PHONE}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-[9990] flex items-end gap-2 sm:gap-3">
      {/* Tooltip */}
      {showTooltip ? (
        <div className="relative bg-white rounded-xl shadow-lg px-3 py-2.5 sm:px-4 sm:py-3 max-w-[180px] sm:max-w-[220px]">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="text-xs sm:text-sm text-gray-700 leading-snug">
            ¿Necesitas ayuda? Escríbenos por <span className="font-semibold text-[#25D366]">WhatsApp</span>
          </p>
        </div>
      ) : null}

      {/* Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowTooltip(false)}
        className="group flex-shrink-0 w-[60px] h-[60px] sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] rounded-full bg-[#25D366] hover:bg-[#1ebe57] shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 text-white group-hover:scale-110 transition-transform duration-200" />
      </a>
    </div>
  )
}
