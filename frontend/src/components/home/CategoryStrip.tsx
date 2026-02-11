import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/category'

export default function CategoryStrip() {
  return (
    <section className="py-6 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.key}`}
              className="flex-shrink-0 snap-start flex flex-col items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors duration-200 group"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="40px"
                  className="object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-[#0A3981] whitespace-nowrap transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
