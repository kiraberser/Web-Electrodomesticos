"use client"

import { useMemo, useState } from "react"
import { Product, Brand, ProductType } from "@/data/products"
import Filters from "@/components/ui/product/filter"
import { Sparkles, PackageSearch } from 'lucide-react'
import ProductCard from "./ProductCard"

interface Props {
    categoryKey: string
    products: Product[]
}

export default function CategoryView({
    categoryKey,
    products,
}: Props) {
    const [filters, setFilters] = useState<{ brands: Brand[]; types?: any[]; min: number; max: number }>({
        brands: [],
        types: [],
        min: 0,
        max: 50000, // Aumentado para productos de alto precio
    })

    // Memoizar marcas únicas de los productos
    const availableBrands = useMemo(() => {
        const uniqueBrands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean) as Brand[]
        return uniqueBrands
    }, [products])

    // Memoizar tipos únicos de los productos
    const availableTypes = useMemo(() => {
        const uniqueTypes = Array.from(new Set(products.map(p => p.type))).filter(Boolean) as ProductType[]
        return uniqueTypes
    }, [products])

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const brandOk = filters.brands.length === 0 || filters.brands.includes(p.brand)
            const typeOk = !filters.types || filters.types.length === 0 || filters.types.includes(p.type)
            const priceOk = p.price >= filters.min && p.price <= filters.max
            return brandOk && typeOk && priceOk
        })
    }, [products, filters])

    return (
        <div className="bg-gray-50">

            {/* Content with sidebar filters + grid */}
            <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
                <Filters brands={availableBrands} types={availableTypes} onChangeAction={setFilters} defaultMin={0} defaultMax={50000} />

                <div>
                    {/* Results header */}
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Resultados
                            <span className="ml-2 text-sm font-normal text-gray-500">({filtered.length} productos)</span>
                        </h2>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
                            <PackageSearch className="h-10 w-10 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">No encontramos productos con estos filtros.</p>
                            <p className="text-xs text-gray-500">Intenta ajustarlos o limpiar todos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
                            {filtered.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
