import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getRefaccionByNombre, type Refaccion } from "@/features/catalog/api"
import { checkFavoritoAction } from "@/features/favorites/actions"
import ProductDetailClient from "./ProductDetailClient"
import type { Metadata } from "next"

// generateMetadata removed to fix Next.js 16 build issue
// Using static metadata instead
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Producto - Refaccionaria Vega',
    description: 'Detalles del producto',
}

export default async function ProductoPage({
    params,
}: {
    params: Promise<{ categoria: string; producto: string }>
}) {
    const [{ categoria, producto }, cookieStore] = await Promise.all([
        params,
        cookies()
    ])
    const categoriaParam = decodeURIComponent(categoria ?? "")
    const productoNombre = decodeURIComponent(producto ?? "")

    // Fetch product — cookies already available from Promise.all above
    let refaccion: Refaccion
    try {
        refaccion = await getRefaccionByNombre(productoNombre)
    } catch (error) {
        console.error('Error fetching refaccion:', error)
        notFound()
    }

    // Check favorites only if authenticated (cookies already fetched in parallel)
    let isFavorite = false
    if (refaccion.id) {
        try {
            const username = cookieStore.get('username')?.value
            const token = cookieStore.get('access_cookie')?.value
            if (username && token) {
                const favoritoResult = await checkFavoritoAction(refaccion.id)
                isFavorite = favoritoResult.success ? favoritoResult.isFavorite : false
            }
        } catch {
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
