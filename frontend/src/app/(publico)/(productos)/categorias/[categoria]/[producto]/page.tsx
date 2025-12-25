import { notFound } from "next/navigation"
import { getRefaccionByCodigoParte, type Refaccion } from "@/api/productos"
import ProductDetailClient from "./ProductDetailClient"
import type { Metadata } from "next"

export async function generateMetadata({
    params,
}: {
    params: Promise<{ categoria: string; producto: string }>
}): Promise<Metadata> {
    const { producto } = await params
    const productoSlug = decodeURIComponent(producto ?? "")
    
    try {
        const refaccion = await getRefaccionByCodigoParte(productoSlug)
        return {
            title: `${refaccion.nombre} - Refaccionaria Vega`,
            description: refaccion.descripcion || `Refacción ${refaccion.marca} - ${refaccion.codigo_parte}`,
        }
    } catch {
        return {
            title: 'Producto no encontrado',
        }
    }
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
