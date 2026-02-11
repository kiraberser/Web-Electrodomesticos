import { Truck, Shield, Wrench, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Envío Gratis", desc: "En compras mayores a $800" },
  { icon: Shield, title: "Garantía", desc: "En la mayoría de productos" },
  { icon: Wrench, title: "Servicio Técnico", desc: "Soporte de Lun a Sáb" },
  {
    icon: Headphones,
    title: "Asesoría",
    desc: "Te ayudamos a encontrar tu refacción",
  },
];

export default function TrustBar() {
  return (
    <section className="w-full bg-[#0A3981]">
      <div className="mx-auto flex max-w-7xl flex-col divide-y divide-white/10 px-6 sm:flex-row sm:divide-x sm:divide-y-0">
        {features.map((f) => (
          <div
            key={f.title}
            className="group flex flex-1 items-center gap-3.5 py-4 sm:justify-center sm:px-5 sm:py-5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E38E49]/30 bg-[#E38E49]/10 transition-colors group-hover:bg-[#E38E49]/20">
              <f.icon className="h-[18px] w-[18px] text-[#E38E49]" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight text-white">
                {f.title}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-blue-200/60">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}