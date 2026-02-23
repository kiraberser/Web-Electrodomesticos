"use client"

import { useMemo, useState, useEffect } from "react"
import { Product, Brand, ProductType } from "@/shared/data/products"
import Filters from "@/shared/ui/product/filter"
import { PackageSearch } from 'lucide-react'
import dynamic from "next/dynamic"

// Lazy load ProductCard para reducir el bundle inicial
const ProductCard = dynamic(() => import("./ProductCard"), {
    loading: () => <div className="h-[400px] animate-pulse bg-gray-200 rounded-xl" />,
})

interface Props {
    categoryKey: string
    products: Product[]
}

export default function CategoryView({
    products,
}: Props) {
    const [filters, setFilters] = useState<{ brands: Brand[]; types?: ProductType[]; min: number; max: number }>({
        brands: [],
        types: [],
        min: 0,
        max: 50000, // Aumentado para productos de alto precio
    })
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12

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

    // Paginar productos
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage
        return filtered.slice(startIndex, startIndex + productsPerPage)
    }, [filtered, currentPage])

    const totalPages = Math.ceil(filtered.length / productsPerPage)

    // Resetear a página 1 cuando cambien los filtros
    useEffect(() => {
        setCurrentPage(1)
    }, [filters.brands, filters.types, filters.min, filters.max])

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
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-4">
                                {paginatedProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Anterior
                                    </button>
                                    
                                    {[...Array(totalPages)].slice(0, 5).map((_, index) => {
                                        const page = index + 1
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 text-sm font-medium rounded-md ${
                                                    currentPage === page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    })}
                                    
                                    {totalPages > 5 && (
                                        <>
                                            <span className="text-gray-500">...</span>
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-10 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                    
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    )
}
