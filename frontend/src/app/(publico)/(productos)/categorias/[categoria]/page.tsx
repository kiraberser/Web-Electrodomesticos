import { notFound } from "next/navigation"
import { categories as CATEGORIES } from "@/data/category"
import { getRefaccionesByCategoria, type Refaccion } from "@/api/productos"
import { type Product, ProductType } from "@/data/products"
import CategoryView from "@/components/product/CategoryView"
import type { Metadata } from "next"

/**
 * Transforma una refacción del backend a un Product del frontend
 */

export async function generateMetadata({
    params,
}: {
    params: Promise<{ categoria: string }>
}): Promise<Metadata> {
    const { categoria } = await params
    const categoryParam = decodeURIComponent(categoria ?? "")
    const category = CATEGORIES.find((c) => c.key === categoryParam)
    
    if (!category) {
        return {
            title: 'Categoría no encontrada',
        }
    }

    return {
        title: `${category.label} - Refaccionaria Vega`,
        description: category.description,
    }
}

function transformRefaccionToProduct(refaccion: Refaccion, categoryKey: string): Product {
    return {
        id: String(refaccion.id),
        slug: refaccion.codigo_parte || `product-${refaccion.id}`,
        name: refaccion.nombre,
        price: Number(refaccion.precio),
        brand: refaccion.marca as any,
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
