// Async Server Component — streams when API resolves (Vercel: async-suspense-boundaries)
import { getRefaccionesByCategoria, type Refaccion } from '@/features/catalog/api'
import type { Product, Brand, ProductType } from '@/shared/data/products'
import CategoryView from './CategoryView'

const BASE = 'https://www.refaccionariavega.com.mx'

function transformRefaccion(refaccion: Refaccion, categoryKey: string): Product {
  return {
    id: String(refaccion.id),
    slug: refaccion.codigo_parte || `product-${refaccion.id}`,
    name: refaccion.nombre,
    price: Number(refaccion.precio),
    brand: refaccion.marca as Brand,
    type: (refaccion.categoria_nombre || 'Pedestal') as ProductType,
    category: categoryKey,
    image: refaccion.imagen || '/placeholder.svg',
    shortDescription: refaccion.descripcion || '',
    specs: [
      { label: 'Marca', value: refaccion.marca },
      { label: 'Código de parte', value: refaccion.codigo_parte },
      { label: 'Estado', value: refaccion.estado },
    ],
    inStock: refaccion.existencias > 0,
  }
}

interface Props {
  category: {
    key: string
    label: string
    description?: string
    id_category: number
  }
}

export default async function ProductsSection({ category }: Props) {
  const data = await getRefaccionesByCategoria(category.id_category).catch(() => ({
    refacciones: [],
    total: 0,
  }))

  const products = (data.refacciones || []).map((r) => transformRefaccion(r, category.key))

  // ItemList schema lives here since it depends on products data
  const itemListSchema =
    products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: `${category.label} — Refacciones`,
          numberOfItems: products.length,
          itemListElement: products.slice(0, 20).map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              '@id': `${BASE}/categorias/${category.key}/${encodeURIComponent(p.name)}`,
              name: p.name,
            },
          })),
        }
      : null

  return (
    <>
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      <CategoryView categoryKey={category.key} products={products} />
    </>
  )
}
