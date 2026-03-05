import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, ArrowRight, ShieldCheck, Clock, Wrench, CheckCircle, Star, Zap } from 'lucide-react'
import { company } from '@/shared/data/company'

export const metadata: Metadata = {
  title: 'Instalación de Minisplit Profesional — Refaccionaria Vega',
  description:
    'Instalación profesional de minisplit en Martínez de la Torre y zona conurbada. Técnicos certificados, garantía de 12 meses, servicio el mismo día. Desde $1,600 MXN.',
  alternates: {
    canonical: 'https://www.refaccionariavega.com.mx/minisplit',
  },
}

const proceso = [
  {
    num: '01',
    title: 'Solicita tu cotización',
    desc: 'Contáctanos por teléfono o formulario. Te damos precio fijo sin sorpresas antes de agendar.',
  },
  {
    num: '02',
    title: 'Agendamos la visita',
    desc: 'Elegimos juntos el día y hora que mejor te convenga. Llegamos puntuales.',
  },
  {
    num: '03',
    title: 'Instalación profesional',
    desc: 'Nuestro técnico realiza la instalación limpia, segura y con materiales de primera.',
  },
  {
    num: '04',
    title: 'Prueba y garantía',
    desc: 'Verificamos el funcionamiento contigo y te entregamos garantía por escrito de 12 meses.',
  },
]

const incluye = [
  'Mano de obra de instalación',
  'Soporte y soportería del equipo',
  'Tubería de cobre para refrigerante',
  'Cable eléctrico del equipo',
  'Drenaje y perforación de pared',
  'Prueba de funcionamiento',
  'Garantía de instalación 12 meses',
  'Asesoría sobre uso y mantenimiento',
]

const marcas = ['Mabe', 'Mirage', 'Hisense', 'LG', 'Samsung', 'Carrier', 'Trane', 'Daikin']

const preguntas = [
  {
    q: '¿Cuánto tiempo tarda la instalación?',
    a: 'Una instalación estándar toma entre 2 y 4 horas, dependiendo del tipo de equipo y las condiciones del lugar.',
  },
  {
    q: '¿El equipo lo traigo yo o lo venden?',
    a: 'Puedes traer tu propio equipo. También podemos asesorarte para elegir el modelo correcto según el espacio.',
  },
  {
    q: '¿Instalan en comunidades cercanas?',
    a: 'Atendemos Martínez de la Torre y comunidades cercanas. Consúltanos disponibilidad para tu zona.',
  },
  {
    q: '¿Qué pasa si hay algún problema después de la instalación?',
    a: 'Tienes 12 meses de garantía en la instalación. Regresa o llámanos y lo resolvemos sin costo.',
  },
]

// Snowflakes for the hero (same static pattern as homepage section)
const flakes = [
  { s: 12, l: '5%',  d: '0s',   t: '13s', o: 0.18, r: 1  },
  { s: 8,  l: '18%', d: '-4s',  t: '10s', o: 0.13, r: -1 },
  { s: 17, l: '32%', d: '-8s',  t: '16s', o: 0.15, r: 1  },
  { s: 10, l: '50%', d: '-2s',  t: '12s', o: 0.20, r: -1 },
  { s: 14, l: '65%', d: '-6s',  t: '14s', o: 0.13, r: 1  },
  { s: 9,  l: '78%', d: '-9s',  t: '11s', o: 0.18, r: -1 },
  { s: 20, l: '90%', d: '-3s',  t: '18s', o: 0.10, r: 1  },
  { s: 11, l: '43%', d: '-11s', t: '15s', o: 0.16, r: -1 },
]

export default function MinisplitPage() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="relative bg-[#061829] overflow-hidden">
        <style>{`
          @keyframes sf-r2 {
            0%   { transform:translateY(-40px) translateX(0)    rotate(0deg);   opacity:0; }
            6%   { opacity:1; }
            94%  { opacity:0.12; }
            100% { transform:translateY(720px) translateX(28px)  rotate(360deg); opacity:0; }
          }
          @keyframes sf-l2 {
            0%   { transform:translateY(-40px) translateX(0)    rotate(0deg);   opacity:0; }
            6%   { opacity:1; }
            94%  { opacity:0.12; }
            100% { transform:translateY(720px) translateX(-28px) rotate(-360deg);opacity:0; }
          }
        `}</style>

        {/* Snowflakes */}
        <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden z-10">
          {flakes.map((f, i) => (
            <div
              key={i}
              className="absolute top-0 select-none"
              style={{
                left: f.l,
                fontSize: f.s,
                opacity: f.o,
                color: '#c8e8ff',
                animation: `${f.r === 1 ? 'sf-r2' : 'sf-l2'} ${f.t} linear ${f.d} infinite`,
              }}
            >
              ❄
            </div>
          ))}
        </div>

        <div aria-hidden className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-[#0e4a8a]/20 blur-3xl pointer-events-none" />

        {/* Desktop image (right half, absolute) */}
        <div className="hidden md:block absolute inset-y-0 right-0 w-[50%]">
          <Image
            src="/images/hero/minisplit-tecnico.webp"
            alt="Técnico instalando minisplit profesionalmente"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061829] via-[#061829]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061829]/60 to-transparent" />
        </div>

        <div className="relative z-20 max-w-screen-xl mx-auto px-5 md:px-10 lg:px-16">
          <div className="py-16 md:py-24 max-w-lg">
            <p className="text-[10px] font-bold text-[#E38E49]/60 uppercase tracking-[0.28em] mb-5">
              Servicio profesional · Martínez de la Torre
            </p>
            <h1 className="mb-7">
              <span className="block text-white/20 text-xl md:text-2xl font-light tracking-widest uppercase mb-2">
                Instalación de
              </span>
              <span className="block text-white text-5xl md:text-6xl font-black leading-none tracking-tight">
                MINISPLIT
              </span>
              <span className="block text-[#E38E49] text-2xl md:text-3xl font-bold mt-3">
                Profesional
              </span>
            </h1>
            <div className="w-16 h-px bg-white/15 mb-7" />
            <p className="text-white/55 text-base leading-relaxed mb-8 max-w-sm">
              Técnicos certificados, materiales de primera y proceso limpio. Tu hogar más fresco con garantía de 12 meses.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${company.phone}`}
                className="inline-flex items-center gap-2.5 bg-[#E38E49] hover:bg-[#d47a35] text-white font-bold px-6 py-3.5 rounded-xl transition-colors shadow-lg shadow-[#E38E49]/20 text-sm"
              >
                <Phone className="w-4 h-4" />
                Llamar ahora
              </a>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/30 hover:bg-white/5 text-white/80 hover:text-white font-semibold px-6 py-3.5 rounded-xl transition-colors text-sm"
              >
                Solicitar cotización
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Mobile image */}
          <div className="md:hidden relative h-56 rounded-2xl overflow-hidden mb-12 border border-white/10">
            <Image src="/images/hero/minisplit-tecnico.webp" alt="Instalación de minisplit" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061829]/70 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5">
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Desde</p>
              <p className="text-white font-black text-lg">$1,600 <span className="text-xs font-normal text-white/40">MXN</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#E38E49] font-semibold text-xs uppercase tracking-widest">Sin sorpresas</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0A3981] mt-2 mb-4">
                ¿Qué incluye la instalación?
              </h2>
              <p className="text-[#1F509A] text-sm leading-relaxed mb-8">
                Precio fijo desde <strong>$1,600 MXN</strong>. Sin costos ocultos. Todo lo que necesitas para tener tu minisplit funcionando.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#1F509A]">
                    <CheckCircle className="w-4 h-4 text-[#E38E49] mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price card */}
            <div className="bg-[#0A3981] rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
              <div className="relative z-10">
                <p className="text-white/50 text-xs uppercase tracking-widest mb-2">Instalación desde</p>
                <p className="text-white font-black text-5xl mb-1">$1,600</p>
                <p className="text-white/50 text-sm mb-6">MXN · IVA incluido</p>
                <div className="space-y-2.5 text-left mb-8">
                  {[
                    { icon: ShieldCheck, text: 'Garantía 12 meses' },
                    { icon: Clock, text: 'Servicio el mismo día' },
                    { icon: Wrench, text: 'Técnico certificado' },
                    { icon: Star, text: 'Materiales incluidos' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2.5 text-sm text-white/75">
                      <Icon className="w-4 h-4 text-[#E38E49] flex-shrink-0" />
                      {text}
                    </div>
                  ))}
                </div>
                <a
                  href={`tel:${company.phone}`}
                  className="inline-flex items-center gap-2 bg-[#E38E49] hover:bg-[#d47a35] text-white font-bold px-6 py-3 rounded-xl transition-colors w-full justify-center text-sm"
                >
                  <Phone className="w-4 h-4" />
                  Llamar: {company.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESO ── */}
      <section className="py-14 md:py-20 bg-[#D4EBF8]">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <span className="text-[#E38E49] font-semibold text-xs uppercase tracking-widest">Simple y transparente</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A3981] mt-2">Cómo funciona</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {proceso.map((paso) => (
              <div key={paso.num} className="bg-white rounded-2xl p-6 border border-[#0A3981]/5 shadow-sm">
                <div className="text-[#E38E49] font-black text-3xl mb-4">{paso.num}</div>
                <h3 className="text-base font-bold text-[#0A3981] mb-2">{paso.title}</h3>
                <p className="text-[#1F509A] text-sm leading-relaxed">{paso.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARCAS ── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-5 md:px-10">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-7">
            Instalamos todas las marcas
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {marcas.map((marca) => (
              <span
                key={marca}
                className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm font-semibold text-[#1F509A]"
              >
                {marca}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREGUNTAS FRECUENTES ── */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-5 md:px-10">
          <div className="text-center mb-10">
            <span className="text-[#E38E49] font-semibold text-xs uppercase tracking-widest">Resolvemos tus dudas</span>
            <h2 className="text-3xl font-bold text-[#0A3981] mt-2">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-4">
            {preguntas.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-[#E38E49] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-[#0A3981] mb-1.5">{faq.q}</h3>
                    <p className="text-sm text-[#1F509A] leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-14 md:py-16 bg-[#0A3981]">
        <div className="max-w-xl mx-auto px-5 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            ¿Listo para tu instalación?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Llámanos hoy y agenda tu instalación. Atendemos de lunes a sábado.
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
              className="inline-flex items-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Formulario de contacto
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
