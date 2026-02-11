import Image from 'next/image'
import { Truck, Shield, Wrench, Headphones } from 'lucide-react'
import { brands_data as brands } from '@/data/brands'

const features = [
  { icon: Truck, title: 'Envío Gratis', desc: 'En compras mayores a $800' },
  { icon: Shield, title: 'Garantía', desc: 'En la mayoría de productos' },
  { icon: Wrench, title: 'Servicio Técnico', desc: 'Soporte de Lun a Sáb' },
  { icon: Headphones, title: 'Asesoría', desc: 'Te ayudamos a encontrar tu refacción' },
]

const stats = [
  { value: '20+', label: 'Años de experiencia' },
  { value: '500+', label: 'Productos disponibles' },
  { value: '5,000+', label: 'Clientes satisfechos' },
  { value: '4.8', label: 'Calificación promedio' },
]

export default function TrustBar() {
  return (
    <section className="py-12 bg-slate-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#0A3981]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-gray-200">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#0A3981]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Brands row */}
        <div className="pt-10">
          <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Marcas de confianza
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center">
            {brands.map((brand, i) => (
              <div
                key={i}
                className="relative h-16 flex items-center justify-center grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  loading="lazy"
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
