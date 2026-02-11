import Image from 'next/image'
import { brands_data as brands } from '@/data/brands'

export default function BrandsBar() {
  return (
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-[#0A3981] uppercase tracking-wide mb-10">
          Marcas de Confianza
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {brands.map((brand, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-300"
            >
              <div className="relative h-16 md:h-20 w-full">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 33vw, 16vw"
                  loading="lazy"
                  className="object-contain p-2"
                />
              </div>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
