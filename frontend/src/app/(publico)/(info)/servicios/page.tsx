import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Wrench, Phone, ArrowRight, ShieldCheck, Clock,
  Zap, Truck, Users, CheckCircle, Wind,
} from 'lucide-react'
import { company } from '@/shared/data/company'

export const metadata: Metadata = {
  title: 'Servicios — Refaccionaria Vega',
  description:
    'Reparación de electrodomésticos, instalación de minisplit, venta de refacciones y mantenimiento preventivo en Martínez de la Torre, Veracruz.',
  alternates: {
    canonical: 'https://www.refaccionariavega.com.mx/servicios',
  },
}

const servicios = [
  {
    icon: Wrench,
    title: 'Reparación de Electrodomésticos',
    desc: 'Diagnosticamos y reparamos lavadoras, refrigeradores, estufas, licuadoras, ventiladores y más. Trabajamos con refacciones originales y garantizamos cada reparación.',
    items: ['Lavadoras y secadoras', 'Refrigeradores', 'Estufas y hornos', 'Licuadoras y extractores', 'Ventiladores'],
    cta: { label: 'Solicitar reparación', href: '/contacto' },
    accent: true,
  },
  {
    icon: Wind,
    title: 'Instalación de Minisplit',
    desc: 'Instalación profesional de equipos de aire acondicionado tipo minisplit. Técnicos certificados, materiales incluidos y garantía de 12 meses.',
    items: ['Técnicos certificados', 'Materiales de primera', 'Garantía 12 meses', 'Servicio el mismo día', 'Todas las marcas'],
    cta: { label: 'Ver este servicio', href: '/minisplit' },
    highlight: true,
  },
  {
    icon: Zap,
    title: 'Venta de Refacciones',
    desc: 'Amplio catálogo de refacciones originales y genéricas para las principales marcas del mercado. Encuentra la pieza que necesitas para tu electrodoméstico.',
    items: ['Mabe, Oster, Koblenz', 'Mirage, Siemens, NTN', 'Piezas originales y genéricas', 'Catálogo de +5,000 refacciones'],
    cta: { label: 'Ver catálogo', href: '/categorias' },
    accent: false,
  },
  {
    icon: ShieldCheck,
    title: 'Mantenimiento Preventivo',
    desc: 'Evita fallas costosas con nuestros servicios de limpieza y mantenimiento programado. Prolonga la vida útil de tus equipos.',
    items: ['Limpieza profunda', 'Revisión de componentes', 'Lubricación y ajuste', 'Reporte de estado del equipo'],
    cta: { label: 'Agendar mantenimiento', href: '/contacto' },
    accent: true,
  },
  {
    icon: Truck,
    title: 'Envíos a Todo México',
    desc: 'Enviamos refacciones a cualquier punto de la república con los mejores carriers. Embalaje seguro y seguimiento de tu pedido.',
    items: ['Envío express disponible', 'Embalaje especializado', 'Seguimiento en línea', 'Cobertura nacional'],
    cta: { label: 'Ver políticas de envío', href: '/envios' },
    accent: false,
  },
  {
    icon: Users,
    title: 'Asesoría Técnica',
    desc: 'Te orientamos para elegir la refacción correcta, decidir si conviene reparar o reemplazar, y sacar el máximo provecho a tus equipos.',
    items: ['Diagnóstico sin costo', 'Presupuesto transparente', 'Sin compromiso de compra', 'Atención personalizada'],
    cta: { label: 'Contáctanos', href: '/contacto' },
    accent: true,
  },
]

export default function ServiciosPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative bg-[#0A3981] py-16 md:py-24 overflow-hidden">
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#E38E49]/10 pointer-events-none" />
        <div aria-hidden className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-5 md:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E38E49]/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E38E49]" />
            <span className="text-[#E38E49] text-xs font-bold uppercase tracking-widest">
              Lo que hacemos
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Nuestros Servicios
          </h1>
          <p className="text-white/65 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Más de 20 años resolviendo problemas de electrodomésticos en Martínez de la Torre.
            Reparamos, instalamos y asesoramos con garantía.
          </p>
        </div>
      </section>

      {/* ── SERVICIOS GRID ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((servicio) => {
              const Icon = servicio.icon
              return (
                <div
                  key={servicio.title}
                  className={`rounded-2xl p-6 flex flex-col border ${
                    servicio.highlight
                      ? 'bg-[#061829] border-white/10'
                      : 'bg-white border-gray-100 hover:border-[#0A3981]/20 hover:shadow-md'
                  } transition-all duration-200`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                      servicio.highlight
                        ? 'bg-[#E38E49]'
                        : servicio.accent
                        ? 'bg-[#0A3981]'
                        : 'bg-[#E38E49]'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <h2
                    className={`text-lg font-bold mb-2 ${
                      servicio.highlight ? 'text-white' : 'text-[#0A3981]'
                    }`}
                  >
                    {servicio.title}
                    {servicio.highlight && (
                      <span className="ml-2 text-[10px] font-bold text-[#E38E49] bg-[#E38E49]/15 px-2 py-0.5 rounded-full uppercase tracking-wider align-middle">
                        Destacado
                      </span>
                    )}
                  </h2>

                  <p
                    className={`text-sm leading-relaxed mb-5 ${
                      servicio.highlight ? 'text-white/60' : 'text-[#1F509A]'
                    }`}
                  >
                    {servicio.desc}
                  </p>

                  <ul className="space-y-1.5 mb-6 flex-1">
                    {servicio.items.map((item) => (
                      <li
                        key={item}
                        className={`flex items-center gap-2 text-xs ${
                          servicio.highlight ? 'text-white/60' : 'text-[#1F509A]'
                        }`}
                      >
                        <CheckCircle
                          className={`w-3.5 h-3.5 flex-shrink-0 ${
                            servicio.highlight ? 'text-[#E38E49]' : 'text-[#E38E49]'
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={servicio.cta.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                      servicio.highlight
                        ? 'bg-[#E38E49] hover:bg-[#d47a35] text-white'
                        : 'border border-[#0A3981]/20 text-[#0A3981] hover:bg-[#0A3981]/5'
                    }`}
                  >
                    {servicio.cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CONFIANZA ── */}
      <section className="py-10 bg-[#D4EBF8]">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { num: '20+', label: 'Años de experiencia' },
              { num: '5k+', label: 'Refacciones en catálogo' },
              { num: '12m',  label: 'Garantía en instalación' },
              { num: '32',  label: 'Estados con envío' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-[#0A3981]">{stat.num}</div>
                <div className="text-xs text-[#1F509A] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 md:py-16 bg-white">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A3981] mb-3">
            ¿Necesitas alguno de estos servicios?
          </h2>
          <p className="text-[#1F509A] text-sm mb-8">
            Llámanos o escríbenos. Te atendemos de lunes a viernes de 9:00 a 19:00 y sábados de 9:00 a 14:00.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${company.phone}`}
              className="inline-flex items-center gap-2 bg-[#E38E49] hover:bg-[#d47a35] text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#E38E49]/20"
            >
              <Phone className="w-4 h-4" />
              {company.phone}
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-[#0A3981] text-[#0A3981] hover:bg-[#0A3981] hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Ir a Contacto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
