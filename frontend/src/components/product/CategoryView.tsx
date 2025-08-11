"use client"

import { useMemo, useState } from "react"
import { Product, Brand, ProductType } from "@/data/products"
import Filters from "../ui/product/filter"
import ProductCard from "./ProductCard"
import { BRANDS, TYPES } from "@/data/products"
import { Sparkles, PackageSearch } from 'lucide-react'

interface Props {
    categoryKey?: string
    products?: Product[]
    heroTitle?: string
    heroDescription?: string
    coverImage?: string
}

export default function CategoryView({
    categoryKey = "ventiladores",
    products = [],
    heroTitle = "Ventiladores y Refacciones",
    heroDescription = "Componentes confiables y ventilación eficiente con una estética técnica y moderna.",
    coverImage = "/placeholder.svg?height=520&width=1400",
}: Props) {
    const [filters, setFilters] = useState<{ brands: Brand[]; types: ProductType[]; min: number; max: number }>({
        brands: [],
        types: [],
        min: 0,
        max: 5000,
    })

    const filtered = useMemo(() => {
        return products.filter((p) => {
            const brandOk = filters.brands.length === 0 || filters.brands.includes(p.brand)
            const typeOk = filters.types.length === 0 || filters.types.includes(p.type)
            const priceOk = p.price >= filters.min && p.price <= filters.max
            return brandOk && typeOk && priceOk
        })
    }, [products, filters])

    return (
        <div className="bg-gray-50">
            {/* Modern hero */}
            <section className="relative overflow-hidden border-b border-gray-200 bg-white">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-50 via-white to-blue-50 opacity-70"
                    aria-hidden="true"
                />
                <div className="container relative mx-auto grid gap-6 px-4 py-10 md:grid-cols-2 md:py-14">
                    <div className="flex flex-col justify-center">
                        <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 md:text-4xl">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                            {heroTitle}
                        </h1>
                        <p className="mt-2 max-w-prose text-gray-600">{heroDescription}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-blue-700">Tecnología</span>
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Reparación</span>
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1">Refacciones</span>
                        </div>
                    </div>
                    <div className="relative hidden aspect-[3/1.8] w-full md:block">
                        {/* Imagen decorativa del hero */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={coverImage || "/placeholder.svg"}
                            alt="Categoría destacada"
                            className="absolute inset-0 h-full w-full rounded-xl object-cover shadow-sm"
                        />
                    </div>
                </div>
            </section>

            {/* Content with sidebar filters + grid */}
            <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
                <Filters brands={BRANDS} types={TYPES} onChange={setFilters} defaultMin={0} defaultMax={5000} />

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
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
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
