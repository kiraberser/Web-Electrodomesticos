"use client";

import { useState, useEffect, useRef } from "react";
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

function MobileCarousel() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const advance = () => {
      setCurrent((prev) => (prev + 1) % features.length);
    };
    timeoutRef.current = setInterval(advance, 3500);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  const f = features[current];

  return (
    <div className="relative h-14 flex items-center justify-center px-6">
      {features.map((feat, i) => (
        <div
          key={feat.title}
          className={`absolute inset-0 flex items-center justify-center gap-3 px-6 transition-opacity duration-700 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== current}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E38E49]/30 bg-[#E38E49]/10">
            <feat.icon className="h-4 w-4 text-[#E38E49]" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight text-white">
              {feat.title}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-blue-200/60">
              {feat.desc}
            </p>
          </div>
        </div>
      ))}

    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="w-full bg-[#0A3981]">
      {/* Mobile: fade carousel */}
      <div className="sm:hidden">
        <MobileCarousel />
      </div>

      {/* Desktop: horizontal row */}
      <div className="hidden sm:flex mx-auto max-w-7xl divide-x divide-white/10 px-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="group flex flex-1 items-center gap-3.5 justify-center px-5 py-5"
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
