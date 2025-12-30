import { notFound } from "next/navigation"
import { getRefaccionByCodigoParte, type Refaccion } from "@/api/productos"
import ProductDetailClient from "./ProductDetailClient"
import type { Metadata } from "next"

// generateMetadata removed to fix Next.js 16 build issue
// Using static metadata instead
export const metadata: Metadata = {
    title: 'Producto - Refaccionaria Vega',
    description: 'Detalles del producto',
}

export default async function ProductoPage({
    params,
}: {
    params: Promise<{ categoria: string; producto: string }>
}) {
    const { categoria, producto } = await params
    const categoriaParam = decodeURIComponent(categoria ?? "")
    const productoSlug = decodeURIComponent(producto ?? "")

    // Obtener la refacción del backend (Server Component)
    // Solo una petición al servidor
    let refaccion: Refaccion
    try {
        refaccion = await getRefaccionByCodigoParte(productoSlug)
    } catch (error) {
        console.error('Error fetching refaccion:', error)
        notFound()
    }

    return (
        <ProductDetailClient
            categoria={categoriaParam}
            refaccion={refaccion}
        />
    )
}
