import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import { getRefaccionByNombre, type Refaccion } from "@/features/catalog/api"
import { categories as CATEGORIES } from "@/shared/data/category"
import { checkFavoritoAction } from "@/features/favorites/actions"
import ProductDetailClient from "./ProductDetailClient"
import type { Metadata } from "next"

const BASE = 'https://www.refaccionariavega.com.mx'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  { params }: { params: Promise<{ categoria: string; producto: string }> }
): Promise<Metadata> {
  const { producto, categoria } = await params
  const nombre = decodeURIComponent(producto)
  return {
    title: nombre,
    description: `Refacción ${nombre} disponible en Refaccionaria Vega, Martínez de la Torre. Envío a toda la república.`,
    alternates: {
      canonical: `${BASE}/categorias/${categoria}/${producto}`,
    },
    openGraph: {
      title: nombre,
      url: `${BASE}/categorias/${categoria}/${producto}`,
    },
  }
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

    const categoryLabel = CATEGORIES.find((c) => c.key === categoriaParam)?.label ?? categoriaParam

    const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: refaccion.nombre,
        sku: refaccion.codigo_parte,
        brand: { '@type': 'Brand', name: refaccion.marca },
        ...(refaccion.imagen ? { image: refaccion.imagen } : {}),
        offers: {
            '@type': 'Offer',
            priceCurrency: 'MXN',
            price: Number(refaccion.precio).toString(),
            availability: refaccion.existencias > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            itemCondition: refaccion.estado === 'NVO'
                ? 'https://schema.org/NewCondition'
                : refaccion.estado === 'UBS'
                ? 'https://schema.org/UsedCondition'
                : 'https://schema.org/RefurbishedCondition',
            seller: { '@type': 'Organization', name: 'Refaccionaria Vega' },
            url: `${BASE}/categorias/${categoriaParam}/${encodeURIComponent(refaccion.nombre)}`,
        },
    }

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: categoryLabel, item: `${BASE}/categorias/${categoriaParam}` },
            { '@type': 'ListItem', position: 3, name: refaccion.nombre },
        ],
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <ProductDetailClient
                categoria={categoriaParam}
                refaccion={refaccion}
                initialIsFavorite={isFavorite}
            />
        </>
    )
}
