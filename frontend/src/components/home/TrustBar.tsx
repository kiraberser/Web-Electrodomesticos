import { Truck, Shield, Wrench, Headphones } from 'lucide-react'

const features = [
  { icon: Truck, title: 'Envío Gratis', desc: 'En compras mayores a $800' },
  { icon: Shield, title: 'Garantía', desc: 'En la mayoría de productos' },
  { icon: Wrench, title: 'Servicio Técnico', desc: 'Soporte de Lun a Sáb' },
  { icon: Headphones, title: 'Asesoría', desc: 'Te ayudamos a encontrar tu refacción' },
]

export default function TrustBar() {
  return (
    <section className="py-8 bg-[#0A3981] border-y border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-[#0A3981]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#E38E49]">{f.title}</p>
                <p className="text-xs text-gray-300">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
