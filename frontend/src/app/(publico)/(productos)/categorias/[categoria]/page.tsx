import { Suspense } from "react"
import { notFound } from "next/navigation"
import { categories as CATEGORIES } from "@/shared/data/category"
import CategoryHero from "@/features/catalog/CategoryHero"
import ProductsSection from "@/features/catalog/ProductsSection"
import ProductGridSkeleton from "@/features/catalog/ProductGridSkeleton"
import type { Metadata } from "next"

const BASE = 'https://www.refaccionariavega.com.mx'

export async function generateMetadata(
  { params }: { params: Promise<{ categoria: string }> }
): Promise<Metadata> {
  const { categoria } = await params
  const cat = CATEGORIES.find((c) => c.key === categoria)
  return {
    title: cat ? `${cat.label} — Refacciones` : 'Categorías',
    description: cat?.description ?? 'Explora nuestras categorías de refacciones para electrodomésticos.',
    alternates: {
      canonical: `${BASE}/categorias/${categoria}`,
    },
  }
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const categoryParam = decodeURIComponent(categoria ?? "")
  const category = CATEGORIES.find((c) => c.key === categoryParam)

  if (!category) return notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
      { '@type': 'ListItem', position: 2, name: 'Categorías', item: `${BASE}/categorias` },
      { '@type': 'ListItem', position: 3, name: category.label, item: `${BASE}/categorias/${category.key}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Renders immediately — no API dependency (Vercel: async-suspense-boundaries) */}
      <CategoryHero category={category} />

      {/* Streams in when API resolves */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsSection category={category} />
      </Suspense>
    </>
  )
}
