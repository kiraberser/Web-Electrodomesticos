"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui/feedback/Badge"
import { CATEGORIES, products as PRODUCTS, type Product, BRANDS, TYPES } from "@/data/products"
import { Layers, Plus, Search, Filter } from "lucide-react"
import InventoryTable from "@/components/admin/InventoryTable"
import ProductDetailsDrawer from "@/components/admin/ProductDetailsDrawer"

type CategoryKey = "todos" | (typeof CATEGORIES)[number]["key"]

export default function InventarioPage() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("todos")
    const [search, setSearch] = useState("")
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const categoriesWithAll: Array<{ key: CategoryKey; label: string; description?: string }> = [
        { key: "todos", label: "Todos" },
        ...CATEGORIES.map((c) => ({ key: c.key as CategoryKey, label: c.label, description: c.description })),
    ]

    const filtered = useMemo(() => {
        let list = PRODUCTS
        if (selectedCategory !== "todos") {
            list = list.filter((p) => p.category === selectedCategory)
        }
        if (search.trim()) {
            const q = search.toLowerCase()
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.brand.toLowerCase().includes(q) ||
                    p.type.toLowerCase().includes(q) ||
                    p.shortDescription.toLowerCase().includes(q) ||
                    p.id.toLowerCase().includes(q),
            )
        }
        return list
    }, [selectedCategory, search])

    const countsByCategory = useMemo(() => {
        const map = new Map<CategoryKey, number>()
        map.set("todos", PRODUCTS.length)
        for (const c of CATEGORIES) {
            map.set(c.key as CategoryKey, PRODUCTS.filter((p) => p.category === c.key).length)
        }
        return map
    }, [])

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="hidden sm:block rounded-lg bg-blue-100 p-2">
                                <Layers className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
                                <p className="text-gray-600">
                                    Administra tus productos por categoría. Busca, filtra y revisa detalles.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link href="/admin/inventario/crear-refaccion">
                                <Button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Agregar producto
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[280px_1fr]">
                {/* Sidebar Categories */}
                <aside className="hidden h-fit rounded-xl border border-gray-200 bg-white p-4 lg:block">
                    <h3 className="mb-3 text-sm font-semibold text-gray-900">Categorías</h3>
                    <div className="space-y-1">
                        {categoriesWithAll.map((c) => {
                            const active = selectedCategory === c.key
                            const count = countsByCategory.get(c.key) || 0
                            return (
                                <button
                                    key={c.key}
                                    onClick={() => setSelectedCategory(c.key)}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${active ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
                                        } cursor-pointer`}
                                >
                                    <span>{c.label}</span>
                                    <Badge className={active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}>{count}</Badge>
                                </button>
                            )
                        })}
                    </div>

                    {/* Quick filters (opcional) */}
                    <div className="mt-6">
                        <h4 className="mb-2 text-xs font-semibold uppercase text-gray-500">Atajos</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                                {BRANDS.length} marcas
                            </span>
                            <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600">
                                {TYPES.length} tipos
                            </span>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <div>
                    {/* Mobile categories pills */}
                    <div className="mb-4 flex items-center gap-2 overflow-x-auto lg:hidden">
                        {categoriesWithAll.map((c) => {
                            const active = selectedCategory === c.key
                            const count = countsByCategory.get(c.key) || 0
                            return (
                                <button
                                    key={c.key}
                                    onClick={() => setSelectedCategory(c.key)}
                                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-sm transition ${active
                                            ? "border-blue-600 bg-blue-50 text-blue-700"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        } cursor-pointer`}
                                >
                                    {c.label} ({count})
                                </button>
                            )
                        })}
                    </div>

                    {/* Search and summary */}
                    <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Buscar por nombre, marca, tipo, ID..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                    {filtered.length} resultados
                                </Badge>
                                <Button variant="outline" className="cursor-pointer bg-transparent">
                                    <Filter className="mr-2 h-4 w-4" />
                                    Filtros
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                        <InventoryTable
                            products={filtered}
                            onViewAction={(p: Product) => {
                                setSelectedProduct(p)
                                setDrawerOpen(true)
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Drawer details */}
            <ProductDetailsDrawer product={selectedProduct} open={drawerOpen} onCloseAction={() => setDrawerOpen(false)} />
        </main>
    )
}
