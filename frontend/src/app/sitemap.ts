import { MetadataRoute } from 'next'
import { categories } from '@/shared/data/category'

const BASE_URL = 'https://www.refaccionariavega.com.mx'

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
    return items.map((r: { nombre: string; slug?: string | null; ultima_actualizacion?: string }) => ({
      url: `${BASE_URL}/categorias/${key}/${r.slug ?? encodeURIComponent(r.nombre)}`,
      lastmod: r.ultima_actualizacion ?? new Date().toISOString(),
    }))
  } catch { return [] }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/categorias`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-conditions`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/envios`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/devoluciones`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/cookie-policy`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/categorias/${cat.key}`,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const [blogSlugs, ...productArrays] = await Promise.all([
    getBlogSlugs(),
    ...categories.map((cat) => getProductsByCategory(cat.id_category, cat.key)),
  ])

  const blogPages = blogSlugs.map(({ slug, lastmod }) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastmod,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const productPages = productArrays.flat().map(({ url, lastmod }) => ({
    url,
    lastmod,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...blogPages, ...productPages]
}
