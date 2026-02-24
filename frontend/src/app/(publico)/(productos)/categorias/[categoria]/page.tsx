import { notFound } from "next/navigation"
import { categories as CATEGORIES } from "@/shared/data/category"
import { getRefaccionesByCategoria, type Refaccion } from "@/features/catalog/api"
import { type Product, ProductType, type Brand } from "@/shared/data/products"
import CategoryView from "@/features/catalog/CategoryView"
import type { Metadata } from "next"

/**
 * Transforma una refacción del backend a un Product del frontend
 */

export async function generateMetadata(
  { params }: { params: Promise<{ categoria: string }> }
): Promise<Metadata> {
  const { categoria } = await params
  const cat = CATEGORIES.find((c) => c.key === categoria)
  return {
    title: cat ? `${cat.label} — Refacciones` : 'Categorías',
    description: cat?.description ?? 'Explora nuestras categorías de refacciones para electrodomésticos.',
  }
}

function transformRefaccionToProduct(refaccion: Refaccion, categoryKey: string): Product {
    return {
        id: String(refaccion.id),
        slug: refaccion.codigo_parte || `product-${refaccion.id}`,
        name: refaccion.nombre,
        price: Number(refaccion.precio),
        brand: refaccion.marca as Brand,
        type: (refaccion.categoria_nombre || "Pedestal") as ProductType,
        category: categoryKey,
        image: refaccion.imagen || '/placeholder.svg?height=640&width=640',
        shortDescription: refaccion.descripcion || '',
        specs: [
            { label: "Marca", value: refaccion.marca },
            { label: "Código de parte", value: refaccion.codigo_parte },
            { label: "Estado", value: refaccion.estado },
        ],
        inStock: refaccion.existencias > 0,
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

    // Obtener productos de la categoría desde el backend
    const refaccionesData = await getRefaccionesByCategoria(category.id_category)
        .catch(error => {
            console.error('Error fetching refacciones:', error)
            return { refacciones: [], total: 0 }
        })

    // Transformar refacciones a productos
    const products: Product[] = (refaccionesData.refacciones || [])
        .map(refaccion => transformRefaccionToProduct(refaccion, category.key))

    return (
        <CategoryView
            categoryKey={category.key}
            products={products}
        />
    )
}
