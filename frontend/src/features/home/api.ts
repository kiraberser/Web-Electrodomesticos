'use server'

import { cache } from 'react'
import type { Refaccion } from '@/features/catalog/api'
import type { Product } from '@/shared/data/products'

const URL = process.env.NEXT_PUBLIC_BASE_URL_API

/** Fetch refacciones from API without auth (public endpoint) */
const fetchRefacciones = cache(async (): Promise<Refaccion[]> => {
  try {
    const response = await fetch(`${URL}/productos/refacciones/`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 },
    })

    if (!response.ok) return []
    const data = await response.json()
    return data.results || data
  } catch {
    return []
  }
})

/** Fetch all categories for name resolution */
const fetchCategorias = cache(async (): Promise<Array<{ id: number; nombre: string }>> => {
  try {
    const response = await fetch(`${URL}/productos/categorias/`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })

    if (!response.ok) return []
    const data = await response.json()
    return data.results || data
  } catch {
    return []
  }
})

/** Map a Refaccion from API to the Product shape used by homepage components */
function mapRefaccionToProduct(
  refaccion: Refaccion,
  categoriaNombre: string,
): Product {
  return {
    id: String(refaccion.id ?? 0),
    slug: refaccion.nombre,
    name: refaccion.nombre,
    price: Number(refaccion.precio),
    brand: (refaccion.marca || 'Sin marca') as Product['brand'],
    type: 'Pedestal' as Product['type'],
    category: categoriaNombre,
    image: refaccion.imagen || '/placeholder.svg?height=300&width=300',
    shortDescription: refaccion.descripcion || '',
    specs: [],
    inStock: (refaccion.existencias ?? 0) > 0,
    rating: undefined,
    original_price: undefined,
    discount: undefined,
    tag: undefined,
  }
}

/** Get products for homepage, mapped and split by section */
export async function getHomepageProducts(): Promise<{
  deals: Product[]
  bestSellers: Product[]
  newArrivals: Product[]
}> {
  const [refacciones, categorias] = await Promise.all([
    fetchRefacciones(),
    fetchCategorias(),
  ])

  // Build category id → name map
  const catMap = new Map<number, string>()
  for (const cat of categorias) {
    catMap.set(cat.id, cat.nombre)
  }

  // Map all to Product
  const mapped = refacciones.map((r) =>
    mapRefaccionToProduct(r, catMap.get(r.categoria) || 'General')
  )

  // Split: first 4 = deals, next 4 = best sellers, next 4 = new arrivals
  // If not enough products, sections may have fewer items
  const deals = mapped.slice(0, 4)
  const bestSellers = mapped.slice(4, 8)
  const newArrivals = mapped.slice(8, 12)

  return { deals, bestSellers, newArrivals }
}
