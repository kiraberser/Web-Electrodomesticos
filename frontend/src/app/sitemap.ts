import { MetadataRoute } from 'next'
import { categories } from '@/shared/data/category'

const BASE_URL = 'https://refaccionariavega.com'

async function getBlogSlugs(): Promise<{ slug: string; lastmod: string }[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/blog/posts/`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const data = await res.json()
    const posts = data.results ?? data
    return posts.map((p: { slug: string; updated_at?: string; created_at?: string }) => ({
      slug: p.slug,
      lastmod: p.updated_at ?? p.created_at ?? new Date().toISOString(),
    }))
  } catch { return [] }
}

async function getProductsByCategory(id: number, key: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL_API}/productos/categorias/${id}/refacciones/`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return []
    const data = await res.json()
    const items = data.refacciones ?? data.results ?? data
    return items.map((r: { nombre: string; ultima_actualizacion?: string }) => ({
      url: `${BASE_URL}/categorias/${key}/${encodeURIComponent(r.nombre)}`,
      lastmod: r.ultima_actualizacion ?? new Date().toISOString(),
    }))
  } catch { return [] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/` },
    { url: `${BASE_URL}/categorias` },
    { url: `${BASE_URL}/nosotros` },
    { url: `${BASE_URL}/contacto` },
    { url: `${BASE_URL}/blog` },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categorias/${cat.key}`,
  }))

  const [blogSlugs, ...productArrays] = await Promise.all([
    getBlogSlugs(),
    ...categories.map((cat) => getProductsByCategory(cat.id_category, cat.key)),
  ])

  const blogPages = blogSlugs.map(({ slug, lastmod }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastmod,
  }))

  const productPages = productArrays.flat().map(({ url, lastmod }) => ({ url, lastmod }))

  return [...staticPages, ...categoryPages, ...blogPages, ...productPages]
}
