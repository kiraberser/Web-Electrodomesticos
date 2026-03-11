import Link from 'next/link'
import { Wrench, Wind, Zap, ShieldCheck, Truck, Users, ArrowRight } from 'lucide-react'

const SERVICIOS = [
  {
    icon: Wrench,
    title: 'Reparación de Electrodomésticos',
    frase: 'Lavadoras, refrigeradores, estufas y más — con garantía en cada trabajo.',
  },
  {
    icon: Wind,
    title: 'Instalación de Minisplit',
    frase: 'Técnicos certificados. Materiales incluidos. Garantía de 12 meses.',
    highlight: true,
  },
  {
    icon: Zap,
    title: 'Venta de Refacciones',
    frase: '+5,000 refacciones originales y genéricas para las mejores marcas.',
  },
  {
    icon: ShieldCheck,
    title: 'Mantenimiento Preventivo',
    frase: 'Prolonga la vida de tus equipos con revisiones y limpieza profunda.',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo México',
    frase: 'Enviamos con seguimiento en línea a los 32 estados del país.',
  },
  {
    icon: Users,
    title: 'Asesoría Técnica',
    frase: 'Diagnóstico sin costo. Presupuesto transparente. Sin compromiso.',
  },
]

// Duplicamos para el efecto de carousel infinito
const ITEMS = [...SERVICIOS, ...SERVICIOS]

export default function ServiciosStrip() {
  return (
    <section className="bg-white py-14 overflow-hidden">
      {/* Header */}
      <div className="container mx-auto px-4 sm:px-6 mb-10 flex items-end justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#E38E49] mb-2 block">
            Lo que hacemos
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0A3981] leading-tight">
            Nuestros Servicios
          </h2>
        </div>
        <Link
          href="/servicios"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A3981] hover:text-[#E38E49] transition-colors"
        >
          Ver todos
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Carousel infinito */}
      <div className="relative">
        {/* Fade izquierda */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        {/* Fade derecha */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div
          className="flex gap-4 w-max"
          style={{ animation: 'servicios-scroll 32s linear infinite' }}
        >
          {ITEMS.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={i}
                className={`flex-shrink-0 w-72 rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-200 ${
                  s.highlight
                    ? 'bg-[#061829] border-white/10'
                    : 'bg-white border-slate-100 hover:border-[#0A3981]/20 hover:shadow-sm'
                }`}
              >
                {/* Ícono */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    s.highlight ? 'bg-[#E38E49]' : 'bg-[#0A3981]'
                  }`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Texto */}
                <div>
                  <p className={`text-sm font-bold leading-tight mb-1.5 ${s.highlight ? 'text-white' : 'text-[#0A3981]'}`}>
                    {s.title}
                    {s.highlight && (
                      <span className="ml-2 text-[9px] font-bold text-[#E38E49] bg-[#E38E49]/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider align-middle">
                        Destacado
                      </span>
                    )}
                  </p>
                  <p className={`text-xs leading-relaxed ${s.highlight ? 'text-white/55' : 'text-slate-500'}`}>
                    {s.frase}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA móvil */}
      <div className="sm:hidden mt-8 flex justify-center">
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A3981] border border-[#0A3981]/20 px-5 py-2.5 rounded-xl hover:bg-[#0A3981]/5 transition-colors"
        >
          Ver todos los servicios
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Keyframe de animación */}
      <style>{`
        @keyframes servicios-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="servicios-scroll"] { animation: none; }
        }
      `}</style>
    </section>
  )
}
