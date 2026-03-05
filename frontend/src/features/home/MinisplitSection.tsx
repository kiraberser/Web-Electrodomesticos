import Image from 'next/image'
import Link from 'next/link'
import { Phone, ArrowRight } from 'lucide-react'
import { company } from '@/shared/data/company'

const beneficios = [
  'Técnicos certificados con amplia experiencia',
  'Garantía de instalación por 12 meses',
  'Servicio el mismo día a tu conveniencia',
  'Martínez de la Torre y zona conurbada',
]

// Snowflakes: static data (Server Component safe)
const flakes = [
  { s: 13, l: '4%',  d: '0s',     t: '13s', o: 0.20, r: 1  },
  { s: 8,  l: '11%', d: '-4.5s',  t: '10s', o: 0.13, r: -1 },
  { s: 19, l: '21%', d: '-8s',    t: '16s', o: 0.16, r: 1  },
  { s: 7,  l: '33%', d: '-2s',    t: '11s', o: 0.24, r: -1 },
  { s: 14, l: '44%', d: '-6.5s',  t: '14s', o: 0.14, r: 1  },
  { s: 10, l: '55%', d: '-1.5s',  t: '12s', o: 0.22, r: -1 },
  { s: 17, l: '63%', d: '-9s',    t: '17s', o: 0.11, r: 1  },
  { s: 11, l: '74%', d: '-3.5s',  t: '13s', o: 0.18, r: -1 },
  { s: 8,  l: '82%', d: '-5s',    t: '11s', o: 0.23, r: 1  },
  { s: 22, l: '91%', d: '-7s',    t: '19s', o: 0.09, r: -1 },
  { s: 12, l: '28%', d: '-11s',   t: '15s', o: 0.17, r: 1  },
  { s: 15, l: '70%', d: '-12.5s', t: '14s', o: 0.15, r: -1 },
  { s: 9,  l: '48%', d: '-2.5s',  t: '16s', o: 0.13, r: 1  },
  { s: 11, l: '88%', d: '-10s',   t: '13s', o: 0.20, r: -1 },
  { s: 7,  l: '17%', d: '-13s',   t: '11s', o: 0.18, r: 1  },
  { s: 16, l: '59%', d: '-15s',   t: '18s', o: 0.12, r: -1 },
]

export default function MinisplitSection() {
  return (
    <section className="relative bg-[#061829] overflow-hidden">
      {/* ── Snowflake keyframes ── */}
      <style>{`
        @keyframes sf-r {
          0%   { transform: translateY(-40px) translateX(0)    rotate(0deg);   opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 0.12; }
          100% { transform: translateY(680px) translateX(28px)  rotate(360deg); opacity: 0; }
        }
        @keyframes sf-l {
          0%   { transform: translateY(-40px) translateX(0)    rotate(0deg);   opacity: 0; }
          6%   { opacity: 1; }
          94%  { opacity: 0.12; }
          100% { transform: translateY(680px) translateX(-28px) rotate(-360deg);opacity: 0; }
        }
      `}</style>

      {/* ── Snowflakes ── */}
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
              animation: `${f.r === 1 ? 'sf-r' : 'sf-l'} ${f.t} linear ${f.d} infinite`,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* ── Ambient glows ── */}
      <div aria-hidden className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-[#0e4a8a]/20 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#1a6fb5]/10 blur-3xl pointer-events-none" />

      {/* ── Desktop: full-height image (right half, absolute) ── */}
      <div className="hidden md:block absolute inset-y-0 right-0 w-[52%]">
        <Image
          src="/images/hero/minisplit-tecnico.webp"
          alt="Técnico certificado instalando minisplit — Refaccionaria Vega"
          fill
          priority
          className="object-cover object-center"
          sizes="52vw"
        />
        {/* Blend from left → transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061829] via-[#061829]/25 to-transparent" />
        {/* Darken bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061829]/70 via-transparent to-transparent" />

        {/* ── Frosted price badge ── */}
        <div className="absolute bottom-7 right-7 bg-black/30 backdrop-blur-md border border-white/15 rounded-2xl px-6 py-5">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-1">Instalación desde</p>
          <p className="text-white font-black text-3xl leading-none">$1,600</p>
          <p className="text-white/45 text-xs mt-1.5">MXN · garantía incluida</p>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 max-w-screen-xl mx-auto px-5 md:px-10 lg:px-16">

        {/* Content column (constrained to left on desktop) */}
        <div className="py-14 md:py-20 lg:py-24 max-w-lg">

          {/* Label */}
          <p className="text-[10px] font-bold text-[#E38E49]/60 uppercase tracking-[0.28em] mb-5">
            Servicio profesional · Martínez de la Torre
          </p>

          {/* Headline — editorial typographic treatment */}
          <h2 className="mb-7">
            <span className="block text-white/20 text-xl md:text-2xl font-light tracking-widest uppercase mb-2">
              Instalación de
            </span>
            <span className="block text-white text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight">
              MINISPLIT
            </span>
            <span className="block text-[#E38E49] text-2xl md:text-3xl font-bold mt-3">
              Profesional
            </span>
          </h2>

          {/* Thin rule */}
          <div className="w-16 h-px bg-white/15 mb-7" />

          {/* Body copy */}
          <p className="text-white/50 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
            Equipo certificado, materiales de primera y un proceso de instalación limpio y eficiente.
            Tu hogar más fresco, sin complicaciones.
          </p>

          {/* Benefits list — snowflake bullets */}
          <ul className="space-y-3 mb-10">
            {beneficios.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-white/65">
                <span className="text-[#c8e8ff] text-xs mt-0.5 flex-shrink-0">❄</span>
                {b}
              </li>
            ))}
          </ul>

          {/* CTAs */}
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

        {/* ── Mobile: image below text ── */}
        <div className="md:hidden relative h-64 rounded-2xl overflow-hidden mb-12 border border-white/10">
          <Image
            src="/images/hero/minisplit-tecnico.webp"
            alt="Técnico certificado instalando minisplit"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061829]/80 via-transparent to-transparent" />

          {/* Mobile price badge */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="bg-black/40 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-3">
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Instalación desde</p>
              <p className="text-white font-black text-xl">$1,600 <span className="text-xs font-normal text-white/40">MXN</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
