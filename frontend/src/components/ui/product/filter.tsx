"use client"

import { useState, useEffect } from "react"
import { Badge } from "../feedback"
import { Input } from "../forms/InputField"
import { Button } from "../forms/Button"
import type { Brand } from "@/data/products"
import { Tag, DollarSign, X } from "@/components/icons"


interface Props {
    brands: Brand[]
    types?: string[]
    onChangeAction: (filters: { brands: Brand[]; types?: any[]; min: number; max: number }) => void
    defaultMin?: number
    defaultMax?: number
}

export default function Filters({
    brands,
    types = [],
    onChangeAction,
    defaultMin = 0,
    defaultMax = 5000,
}: Props) {
    const [selectedBrands, setSelectedBrands] = useState<Brand[]>([])
    const [minPrice, setMinPrice] = useState<number>(defaultMin)
    const [maxPrice, setMaxPrice] = useState<number>(defaultMax)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        onChangeAction({ brands: selectedBrands, types, min: minPrice, max: maxPrice })
    }, [selectedBrands, types, minPrice, maxPrice, onChangeAction])

    const toggleBrand = (b: Brand) =>
        setSelectedBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))


    const clearAll = () => {
        setSelectedBrands([])

        setMinPrice(defaultMin)
        setMaxPrice(defaultMax)
    }

    return (
        <>
            {/* Mobile filters toggle */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
                <Button variant="outline" onClick={() => setOpen(true)} className="cursor-pointer bg-transparent">
                    <span>Filtros</span>
                </Button>
                {(selectedBrands.length > 0 || minPrice !== defaultMin || maxPrice !== defaultMax) && (
                    <Button variant="ghost" onClick={clearAll} className="text-gray-600 hover:text-gray-900 cursor-pointer">
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Sidebar (desktop) */}
            <aside className="sticky top-24 hidden h-fit w-full max-w-[280px] shrink-0 rounded-xl border border-gray-200 bg-white p-4 lg:block">
                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-700">
                    Filtros
                </h3>

                <div className="space-y-6">
                    <div>
                        <div className="mb-2 flex items-center text-sm font-medium text-gray-900">
                            <Tag className="mr-2 h-4 w-4 text-blue-600" />
                            Marca
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {brands.map((b, index) => {
                                const active = selectedBrands.includes(b)
                                return (
                                    <button
                                        key={`${b}-${index}`}
                                        onClick={() => toggleBrand(b)}
                                        className={`rounded-full border px-3 py-1 text-sm transition ${active
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                            } cursor-pointer`}
                                    >
                                        {b}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    
                    <div>
                        <div className="mb-2 flex items-center text-sm font-medium text-gray-900">
                            <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                            Precio
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min={0}
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-24"
                                aria-label="Precio mínimo"
                            />
                            <span className="text-gray-400">—</span>
                            <Input
                                type="number"
                                min={0}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-24"
                                aria-label="Precio máximo"
                            />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {[{ l: "≤ $1,000", min: 0, max: 1000 }, { l: "$1,000–$2,000", min: 1000, max: 2000 }, { l: "≥ $2,000", min: 2000, max: 100000 }].map(
                                (p) => (
                                    <Badge
                                        key={p.l}
                                        onClick={() => {
                                            setMinPrice(p.min)
                                            setMaxPrice(p.max)
                                        }}
                                        className="cursor-pointer bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                                    >
                                        {p.l}
                                    </Badge>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button variant="outline" onClick={clearAll} className="w-full cursor-pointer bg-transparent">
                            Limpiar filtros
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Drawer (mobile) */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setOpen(false)}>
                    <div
                        className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl bg-white p-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">Filtros</h3>
                            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="cursor-pointer">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-6 overflow-y-auto">
                            {/* Reutilizamos los mismos controles con diseño vertical */}
                            <div>
                                <div className="mb-2 flex items-center text-sm font-medium text-gray-900">
                                    <Tag className="mr-2 h-4 w-4 text-blue-600" />
                                    Marca
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {brands.map((b) => {
                                        const active = selectedBrands.includes(b)
                                        return (
                                            <button
                                                key={b}
                                                onClick={() => toggleBrand(b)}
                                                className={`rounded-full border px-3 py-1 text-sm transition ${active
                                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                                    } cursor-pointer`}
                                            >
                                                {b}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center text-sm font-medium text-gray-900">
                                    <DollarSign className="mr-2 h-4 w-4 text-blue-600" />
                                    <span>Precio</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="number"
                                        min={0}
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(Number(e.target.value))}
                                        className="w-24"
                                    />
                                    <span className="text-gray-400">—</span>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                                        className="w-24"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button variant="outline" onClick={clearAll} className="w-full cursor-pointer bg-transparent">
                                    Limpiar filtros
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
