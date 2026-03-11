import Link from 'next/link'
import { Wrench, Wind, Zap, ShieldCheck, Truck, Users, ArrowRight, ArrowUpRight } from 'lucide-react'

const SERVICIOS = [
  {
    icon: Wrench,
    title: 'Reparación de Electrodomésticos',
    desc: 'Lavadoras, refrigeradores, estufas y más con garantía en cada trabajo.',
    href: '/contacto',
    featured: false,
  },
  {
    icon: Wind,
    title: 'Instalación de Minisplit',
    desc: 'Técnicos certificados. Materiales incluidos. Garantía de 12 meses.',
    href: '/minisplit',
    featured: true,
  },
  {
    icon: Zap,
    title: 'Venta de Refacciones',
    desc: '+5,000 refacciones originales y genéricas para las mejores marcas.',
    href: '/categorias',
    featured: false,
  },
  {
    icon: ShieldCheck,
    title: 'Mantenimiento Preventivo',
    desc: 'Prolonga la vida de tus equipos con revisiones y limpieza profunda.',
    href: '/contacto',
    featured: false,
  },
  {
    icon: Truck,
    title: 'Envíos a Todo México',
    desc: 'Enviamos con seguimiento en línea a los 32 estados del país.',
    href: '/envios',
    featured: false,
  },
  {
    icon: Users,
    title: 'Asesoría Técnica',
    desc: 'Diagnóstico sin costo. Presupuesto transparente. Sin compromiso.',
    href: '/contacto',
    featured: false,
  },
]

export default function ServiciosStrip() {
  return (
    <section className="bg-[#f8f9fc] py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#E38E49] mb-3">
              Lo que hacemos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0A3981] leading-tight">
              Nuestros Servicios
            </h2>
          </div>
          <Link
            href="/servicios"
            className="self-start sm:self-auto inline-flex items-center gap-2 text-sm font-semibold text-[#0A3981] border border-[#0A3981]/20 px-4 py-2 rounded-xl hover:bg-[#0A3981] hover:text-white transition-all duration-200"
          >
            Ver todos los servicios
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid — bento layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICIOS.map((s, i) => {
            const Icon = s.icon
            const isBig = i === 0 // primera card más destacada en móvil
            return (
              <Link
                key={s.title}
                href={s.href}
                className={`group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-200 overflow-hidden ${
                  s.featured
                    ? 'bg-[#061829] text-white'
                    : 'bg-white border border-slate-100 hover:border-[#0A3981]/15 hover:shadow-md'
                } ${isBig ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Glow decoration on featured card */}
                {s.featured && (
                  <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#E38E49]/10 pointer-events-none" />
                )}

                <div>
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                    s.featured ? 'bg-[#E38E49]' : 'bg-[#0A3981]/8 group-hover:bg-[#0A3981] transition-colors duration-200'
                  }`}>
                    <Icon className={`w-5 h-5 ${s.featured ? 'text-white' : 'text-[#0A3981] group-hover:text-white transition-colors duration-200'}`} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-bold leading-snug mb-2 ${s.featured ? 'text-white' : 'text-[#0A3981]'}`}>
                    {s.title}
                    {s.featured && (
                      <span className="ml-2 text-[9px] font-bold text-[#E38E49] bg-[#E38E49]/15 px-1.5 py-0.5 rounded-full uppercase tracking-wider align-middle">
                        Destacado
                      </span>
                    )}
                  </h3>

                  {/* Desc */}
                  <p className={`text-sm leading-relaxed ${s.featured ? 'text-white/55' : 'text-slate-500'}`}>
                    {s.desc}
                  </p>
                </div>

                {/* Arrow */}
                <div className={`mt-5 flex items-center gap-1 text-xs font-semibold ${
                  s.featured ? 'text-[#E38E49]' : 'text-[#0A3981]/50 group-hover:text-[#0A3981] transition-colors'
                }`}>
                  Ver más
                  <ArrowUpRight className="w-3.5 h-3.5 translate-x-0 translate-y-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Stats strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { num: '20+', label: 'Años de experiencia' },
            { num: '5k+', label: 'Refacciones en catálogo' },
            { num: '12m', label: 'Garantía en instalación' },
            { num: '32', label: 'Estados con envío' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 px-5 py-4 text-center">
              <div className="text-2xl font-black text-[#0A3981]">{stat.num}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
