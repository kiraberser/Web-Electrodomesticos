import { notFound } from "next/navigation"
import CategoryView from "@/components/product/CategoryView"
import { products as PRODUCTS, CATEGORIES } from "@/data/products"

export default function CategoriaPage({
    params,
}: {
    params: Promise<{ categoria: string }>
}) {
    // Next.js 15: params is a Promise in Server Components
    const categoryParam = decodeURIComponent((params as any).categoria ?? "")
    const category = CATEGORIES.find((c) => c.key === categoryParam)
    if (!category) return notFound()

    const products = PRODUCTS.filter((p) => p.category === category.key)

    return (
        <CategoryView
            categoryKey={category.key}
            products={products}
            heroTitle={category.label}
            heroDescription={category.description}
            coverImage={category.cover}
        />
    )
}
