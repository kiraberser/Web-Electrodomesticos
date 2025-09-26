"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/admin/ui"
import { Badge } from "../ui"
import type { Product } from "@/data/products"
import { ChevronDown, ChevronUp, Eye, Package, Tag } from "lucide-react"

type Props = {
    products: Product[]
    onViewAction: (p: Product) => void
}

export default function InventoryTable({ products, onViewAction }: Props) {
    const [sortField, setSortField] = useState<keyof Product>("name")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

    const sorted = useMemo(() => {
        const copy = [...products]
        copy.sort((a, b) => {
            const A = a[sortField]
            const B = b[sortField]
            if (typeof A === "number" && typeof B === "number") {
                return sortDir === "asc" ? A - B : B - A
            }
            const sA = String(A).toLowerCase()
            const sB = String(B).toLowerCase()
            return sortDir === "asc" ? sA.localeCompare(sB) : sB.localeCompare(sA)
        })
        return copy
    }, [products, sortField, sortDir])

    const handleSort = (f: keyof Product) => {
        if (f === sortField) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        else {
            setSortField(f)
            setSortDir("asc")
        }
    }

    if (products.length === 0) {
        return (
            <div className="p-10 text-center">
                <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                <h3 className="mb-1 text-lg font-semibold text-gray-900">Sin productos</h3>
                <p className="text-gray-600">No hay productos con los filtros actuales.</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr className="text-left text-sm text-gray-600">
                            <Th button onClick={() => handleSort("id")} active={sortField === "id"} dir={sortDir}>
                                ID
                            </Th>
                            <Th button onClick={() => handleSort("name")} active={sortField === "name"} dir={sortDir}>
                                Producto
                            </Th>
                            <th className="px-6 py-3">Marca</th>
                            <th className="px-6 py-3">Tipo</th>
                            <Th button onClick={() => handleSort("price")} active={sortField === "price"} dir={sortDir}>
                                Precio
                            </Th>
                            <th className="px-6 py-3">Disponibilidad</th>
                            <th className="px-6 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {sorted.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onViewAction(p)}>
                                <td className="px-6 py-3 font-mono text-gray-700">{p.id}</td>
                                <td className="px-6 py-3">
                                    <div className="font-medium text-gray-900">{p.name}</div>
                                    <div className="text-xs text-gray-500">/{p.slug}</div>
                                </td>
                                <td className="px-6 py-3">{p.brand}</td>
                                <td className="px-6 py-3">{p.type}</td>
                                <td className="px-6 py-3 font-semibold text-gray-900">${p.price.toFixed(0)}</td>
                                <td className="px-6 py-3">
                                    {p.inStock ? (
                                        <Badge className="bg-green-100 text-green-800">En stock</Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800">Agotado</Badge>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onViewAction(p)
                                            }}
                                            className="bg-transparent cursor-pointer"
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="grid gap-3 p-3 lg:hidden">
                {sorted.map((p) => (
                    <div
                        key={p.id}
                        className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow cursor-pointer"
                        onClick={() => onViewAction(p)}
                    >
                        <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-mono text-gray-500">{p.id}</div>
                            <Badge className={p.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                {p.inStock ? "En stock" : "Agotado"}
                            </Badge>
                        </div>
                        <div className="text-base font-semibold text-gray-900">{p.name}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                            <span className="inline-flex items-center gap-1">
                                <Tag className="h-3.5 w-3.5 text-blue-600" />
                                {p.brand}
                            </span>
                            <span className="rounded-full border border-gray-200 px-2 py-0.5">{p.type}</span>
                            <span className="font-semibold text-gray-900">${p.price.toFixed(0)}</span>
                        </div>
                        <div className="mt-3">
                            <Button variant="outline" size="sm" className="bg-transparent cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function Th({
    children,
    button = false,
    active,
    dir,
    onClick,
}: {
    children: React.ReactNode
    button?: boolean
    active?: boolean
    dir?: "asc" | "desc"
    onClick?: () => void
}) {
    if (!button) return <th className="px-6 py-3">{children}</th>
    return (
        <th className="px-6 py-3">
            <Button
                variant="ghost"
                size="sm"
                onClick={onClick}
                className="cursor-pointer bg-transparent text-gray-700 hover:text-gray-900"
            >
                {children}
                {active ? (
                    dir === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )
                ) : null}
            </Button>
        </th>
    )
}
