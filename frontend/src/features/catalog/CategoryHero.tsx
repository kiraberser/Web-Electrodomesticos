import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Props {
  category: { key: string; label: string; description?: string }
}

// Server Component — no "use client" needed, renders immediately without API call
export default function CategoryHero({ category }: Props) {
  return (
    <div className="bg-white border-b border-[#D4EBF8]">
      <div className="container mx-auto px-4 py-10">
        <nav className="flex items-center gap-1 text-sm text-gray-400 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#1F509A] transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <Link href="/categorias" className="hover:text-[#1F509A] transition-colors">
            Categorías
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          <span className="text-[#0A3981] font-medium">{category.label}</span>
        </nav>

        <h1 className="text-4xl font-extrabold text-[#0A3981] leading-tight">
          {category.label}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-prose text-gray-500 text-base leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </div>
  )
}
