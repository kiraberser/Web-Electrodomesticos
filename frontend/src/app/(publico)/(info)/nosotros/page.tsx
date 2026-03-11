import type { Metadata } from 'next'
import Link from 'next/link'
import { company } from '@/shared/data/company'
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Zap,
  Shield,
  Star,
  Truck,
  Wrench,
  CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Nosotros — Refaccionaria Vega',
  description:
    'Más de 40 años en Martínez de la Torre, Veracruz. Conoce la historia, misión, visión y valores de Refaccionaria Vega, tu especialista en refacciones y reparación de electrodomésticos.',
  alternates: {
    canonical: 'https://www.refaccionariavega.com.mx/nosotros',
  },
}

const valores = [
  {
    icon: Heart,
    title: 'Compromiso',
    desc: 'Cada cliente es nuestra prioridad. Nos comprometemos a brindar el mejor servicio en cada visita.',
    dark: true,
  },
  {
    icon: Shield,
    title: 'Confianza',
    desc: 'Transparencia en precios y tiempos de entrega. Tu confianza es nuestro mayor activo.',
    dark: false,
  },
  {
    icon: Award,
    title: 'Calidad',
    desc: 'Solo trabajamos con refacciones originales y de alta calidad para garantizar durabilidad.',
    dark: true,
  },
  {
    icon: Zap,
    title: 'Rapidez',
    desc: 'Diagnóstico ágil y reparaciones eficientes para que tu hogar funcione sin demoras.',
    dark: false,
  },
  {
    icon: Users,
    title: 'Cercanía',
    desc: 'Somos parte de la comunidad de Martínez de la Torre. Tu empresa de confianza desde 1980.',
    dark: true,
  },
  {
    icon: Star,
    title: 'Experiencia',
    desc: 'Más de 40 años en el ramo nos dan el conocimiento para resolver cualquier falla.',
    dark: false,
  },
]

const servicios = [
  {
    icon: Wrench,
    title: 'Reparación de Electrodomésticos',
    desc: 'Diagnosticamos y reparamos lavadoras, refrigeradores, licuadoras, ventiladores y más con garantía de servicio.',
  },
  {
    icon: Zap,
    title: 'Embobinado de Motores Industriales',
    desc: 'Servicio especializado en embobinado de motores para herramientas eléctricas y equipos de alto rendimiento. Una solución fundamental para garantizar el óptimo funcionamiento de la maquinaria.',
  },
  {
    icon: Zap,
    title: 'Venta de Refacciones',
    desc: 'Amplio inventario de piezas originales y genéricas, incluyendo refacciones Koblenz y otras marcas líderes del mercado.',
  },
  {
    icon: Shield,
    title: 'Mantenimiento Preventivo',
    desc: 'Evita fallas costosas con nuestros servicios de limpieza y mantenimiento programado para electrodomésticos y herramientas eléctricas.',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo México',
    desc: 'Enviamos refacciones a cualquier punto de la república con los mejores carriers del país.',
  },
  {
    icon: CheckCircle,
    title: 'Instalación de Minisplits',
    desc: 'Instalación profesional de equipos de aire acondicionado tipo minisplit para hogar y negocio en la región.',
  },
]

const historia = [
  {
    year: '1980',
    title: 'Los inicios',
    desc: 'Refaccionaria Vega abre sus puertas en Martínez de la Torre, Veracruz, atendiendo la necesidad local de refacciones accesibles y reparación confiable de electrodomésticos, herramientas eléctricas y motores industriales.',
  },
  {
    year: '1990s',
    title: 'Especialización en motores',
    desc: 'La empresa se posiciona como referente regional en el embobinado de motores industriales, ofreciendo una solución esencial para talleres y empresas que dependen de herramientas eléctricas y equipos de alto rendimiento.',
  },
  {
    year: '2000s',
    title: 'Alianzas estratégicas',
    desc: 'Consolidamos alianzas con proveedores reconocidos como Koblenz y comenzamos a colaborar con empresas de prestigio: Farmacias Similares, Empacadoras de Limón, Cruz Roja y escuelas de la región.',
  },
  {
    year: '2013',
    title: 'Instalación de minisplits',
    desc: 'Incorporamos el servicio de instalación profesional de equipos de aire acondicionado tipo minisplit para hogar y negocio, ampliando nuestra oferta técnica en la región norte de Veracruz.',
  },
  {
    year: '2020',
    title: 'Nueva administración',
    desc: 'En medio de la pandemia, Refaccionaria Vega inicia una nueva etapa bajo una nueva administración. Lejos de frenar operaciones, la empresa se adapta, moderniza procesos y refuerza su compromiso con la comunidad.',
  },
  {
    year: '2026',
    title: 'Envíos nacionales y plataforma digital',
    desc: 'Damos un paso hacia el futuro: implementamos envíos a toda la república mexicana y lanzamos nuestra plataforma en línea para que clientes de cualquier estado puedan adquirir refacciones originales desde casa.',
  },
]

export default function NosotrosPage() {
  return (
    <main className="overflow-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-[#0A3981] py-20 md:py-28 overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E38E49]/10" />
          <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/5" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#E38E49]/20 rounded-full px-4 py-1.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-[#E38E49]" />
            <span className="text-[#E38E49] text-sm font-semibold uppercase tracking-widest">
              Nuestra historia
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Más de 40 años{' '}
            <span className="text-[#E38E49]">reparando lo que importa</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Somos una refaccionaria familiar en Martínez de la Torre, Veracruz.
            Desde 1980 ayudamos a familias y empresas a mantener sus electrodomésticos,
            herramientas y motores funcionando.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-xl mx-auto">
            {[
              { num: '40+', label: 'Años de experiencia' },
              { num: '1980', label: 'Año de fundación' },
              { num: '32', label: 'Estados con envío' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#E38E49]">{stat.num}</div>
                <div className="text-xs md:text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISIÓN & VISIÓN ── */}
      <section id="mision" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-[#E38E49] font-semibold text-sm uppercase tracking-widest">
              Por qué existimos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3981] mt-2">
              Misión y Visión
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Misión */}
            <div className="relative bg-[#0A3981] rounded-2xl p-8 md:p-10 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#E38E49] flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Misión</h3>
                <p className="text-white/80 text-base md:text-lg leading-relaxed">
                  Brindar soluciones técnicas accesibles, rápidas y confiables para los
                  electrodomésticos del hogar, usando refacciones de calidad y un servicio cercano
                  que genere tranquilidad en cada familia que atendemos.
                </p>
              </div>
            </div>

            {/* Visión */}
            <div id="vision" className="relative bg-[#E38E49] rounded-2xl p-8 md:p-10 overflow-hidden scroll-mt-20">
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-[#E38E49]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Visión</h3>
                <p className="text-white/90 text-base md:text-lg leading-relaxed">
                  Ser la refaccionaria de referencia en el norte de Veracruz y el principal destino
                  en línea para técnicos y familias que buscan refacciones originales con envío
                  rápido a toda la república mexicana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HISTORIA ── */}
      <section id="historia" className="py-16 md:py-24 bg-[#D4EBF8] scroll-mt-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <span className="text-[#E38E49] font-semibold text-sm uppercase tracking-widest">
              Nuestra trayectoria
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3981] mt-2">Historia</h2>
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line — desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#0A3981]/20 -translate-x-1/2" />

            <div className="space-y-10">
              {historia.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-0 ${
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`w-full md:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? 'md:pr-10' : 'md:pl-10'
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-[#0A3981]/5">
                      <div className="text-[#E38E49] font-bold text-xl md:text-2xl mb-1">
                        {item.year}
                      </div>
                      <h3 className="text-base font-bold text-[#0A3981] mb-2">{item.title}</h3>
                      <p className="text-[#1F509A] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  {/* Dot — desktop */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-[#0A3981] border-4 border-[#D4EBF8]" />

                  {/* Mobile dot + spacer */}
                  <div className="md:hidden flex items-center gap-3 order-first">
                    <div className="w-3 h-3 rounded-full bg-[#0A3981] flex-shrink-0" />
                    <div className="h-px flex-1 bg-[#0A3981]/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ── */}
      <section id="valores" className="py-16 md:py-24 bg-white scroll-mt-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-[#E38E49] font-semibold text-sm uppercase tracking-widest">
              Lo que nos define
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3981] mt-2">
              Nuestros Valores
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {valores.map((valor) => {
              const Icon = valor.icon
              return (
                <div
                  key={valor.title}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-[#0A3981]/20 hover:shadow-md transition-all duration-200"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      valor.dark ? 'bg-[#0A3981]' : 'bg-[#E38E49]'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0A3981] mb-2">{valor.title}</h3>
                  <p className="text-[#1F509A] text-sm leading-relaxed">{valor.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SERVICIOS COMUNES ── */}
      <section id="servicios" className="py-16 md:py-24 bg-[#0A3981] scroll-mt-20">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <span className="text-[#E38E49] font-semibold text-sm uppercase tracking-widest">
              Lo que ofrecemos
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
              Servicios Comunes
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicios.map((servicio) => {
              const Icon = servicio.icon
              return (
                <div
                  key={servicio.title}
                  className="bg-white/10 rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors duration-200"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#E38E49] flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{servicio.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{servicio.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0A3981] mb-3">
            ¿Listo para trabajar con nosotros?
          </h2>
          <p className="text-[#1F509A] mb-8">
            Encuentra tu refacción o agenda tu reparación. Estamos aquí para ayudarte.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/categorias"
              className="inline-flex items-center gap-2 bg-[#E38E49] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#d47a35] transition-colors"
            >
              Ver Refacciones
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 border-2 border-[#0A3981] text-[#0A3981] font-semibold px-6 py-3 rounded-xl hover:bg-[#0A3981] hover:text-white transition-colors"
            >
              Contáctanos
            </Link>
          </div>

          {/* Contact info */}
          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-[#1F509A]">
            <a
              href={`tel:${company.phone}`}
              className="flex items-center gap-2 hover:text-[#0A3981] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#E38E49]" />
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-2 hover:text-[#0A3981] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#E38E49]" />
              {company.email}
            </a>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#E38E49] mt-0.5 flex-shrink-0" />
              <span>{company.address}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
