import { Truck, Shield, Wrench, Headphones } from 'lucide-react'

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
    <section className="py-10 bg-slate-50 border-t border-b border-gray-100">
      <div className="container mx-auto px-4">
        {/* Features row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-[#0A3981]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
