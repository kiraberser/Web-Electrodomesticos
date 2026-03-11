import Link from 'next/link'
import { Wrench, Package, Zap, ArrowRight, Phone } from 'lucide-react'

const STATS = [
  { number: '+20', label: 'Años de experiencia' },
  { number: '+500', label: 'Refacciones disponibles' },
  { number: '1', label: 'Sucursal en Mtz. de la Torre' },
]

export default function CatalogComingSoon() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#071e4a] via-[#0A3981] to-[#0d2d6b] py-20 sm:py-28">

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(227,142,73,0.08),transparent)]" />

      {/* Floating decorative icons */}
      <Wrench className="absolute top-10 left-[6%] w-16 h-16 text-[#E38E49] opacity-[0.08] rotate-12" />
      <Package className="absolute top-16 right-[10%] w-12 h-12 text-white opacity-[0.06] -rotate-6" />
      <Zap className="absolute bottom-14 left-[14%] w-10 h-10 text-[#E38E49] opacity-[0.07] rotate-45" />
      <Wrench className="absolute bottom-10 right-[8%] w-8 h-8 text-white opacity-[0.05] -rotate-30" />

      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#E38E49]/40 bg-[#E38E49]/10 px-4 py-1.5 mb-8">
          <span className="h-2 w-2 rounded-full bg-[#E38E49] animate-pulse" />
          <span className="text-xs font-bold text-[#E38E49] tracking-widest uppercase">
            Catálogo en línea — Próximamente
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black text-white leading-[1.1] mb-6 tracking-tight">
          Miles de refacciones,<br />
          <span className="text-[#E38E49]">a un clic de distancia</span>
        </h2>

        {/* Sub */}
        <p className="text-base sm:text-lg text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
          Estamos cargando nuestro inventario completo. Pronto podrás buscar,
          comparar y comprar todas las refacciones que necesitas directamente en línea.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/categorias"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E38E49] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#E38E49]/20 hover:bg-[#d47a35] transition-colors"
          >
            Explorar categorías
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <Phone className="w-4 h-4" />
            Contáctanos
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-[#E38E49]">
                {stat.number}
              </div>
              <div className="text-[11px] sm:text-xs text-white/45 mt-1 leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
