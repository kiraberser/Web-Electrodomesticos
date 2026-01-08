import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getRefaccionByNombre, type Refaccion } from "@/api/productos"
import { checkFavoritoAction } from "@/actions/favoritos"
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
    const productoNombre = decodeURIComponent(producto ?? "")

    // Obtener la refacción del backend (Server Component)
    // Solo una petición al servidor - buscar por nombre del producto
    let refaccion: Refaccion
    try {
        refaccion = await getRefaccionByNombre(productoNombre)
    } catch (error) {
        console.error('Error fetching refaccion:', error)
        notFound()
    }

    // Verificar si está en favoritos en el servidor (solo si hay ID y usuario autenticado)
    let isFavorite = false
    if (refaccion.id) {
        try {
            // Verificar autenticación antes de hacer la petición
            const cookieStore = await cookies()
            const username = cookieStore.get('username')?.value
            const token = cookieStore.get('access_cookie')?.value
            
            // Solo verificar favoritos si el usuario está autenticado
            if (username && token) {
                const favoritoResult = await checkFavoritoAction(refaccion.id)
                isFavorite = favoritoResult.success ? favoritoResult.isFavorite : false
            }
        } catch (error) {
            // Silenciar errores, por defecto no está en favoritos
            isFavorite = false
        }
    }

    return (
        <ProductDetailClient
            categoria={categoriaParam}
            refaccion={refaccion}
            initialIsFavorite={isFavorite}
        />
    )
}
