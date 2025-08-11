"use client"

import Image from "next/image"
import { Button } from "../ui/forms/Button"
import { Badge } from "../ui"
import type { Product } from "@/data/products"
import { X, Shield, Truck, Zap, Wrench, Pencil } from "lucide-react"
import Link from "next/link"

type Props = {
    product: Product | null
    open: boolean
    onClose: () => void
}

export default function ProductDetailsDrawer({ product, open, onClose }: Props) {
    if (!open || !product) return null

    const totalSpecs = product.specs?.length || 0

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <aside
                className="absolute right-0 top-0 h-full w-full max-w-xl border-l border-gray-200 bg-white shadow-xl"
                role="dialog"
                aria-label="Ficha de producto"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div>
                        <div className="text-sm font-mono text-gray-500">{product.id}</div>
                        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex h-[calc(100%-64px)] flex-col overflow-y-auto">
                    {/* Image and badges */}
                    <div className="p-4">
                        <div className="relative h-56 w-full overflow-hidden rounded-lg border bg-gray-50">
                            <Image
                                src={product.image || "/placeholder.svg?height=320&width=640&query=product"}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 640px"
                            />
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge className="bg-blue-600 text-white">{product.brand}</Badge>
                            <Badge variant="secondary">{product.type}</Badge>
                            <Badge variant="secondary">/{product.slug}</Badge>
                            {product.inStock ? (
                                <Badge className="bg-green-600 text-white">En stock</Badge>
                            ) : (
                                <Badge className="bg-red-600 text-white">Agotado</Badge>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid gap-4 p-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                            <div className="text-xs font-medium text-gray-500">Precio</div>
                            <div className="text-2xl font-bold text-gray-900">${product.price.toFixed(0)} MXN</div>
                        </div>
                        <div className="rounded-lg border p-4">
                            <div className="text-xs font-medium text-gray-500">Categoría</div>
                            <div className="text-base font-semibold text-gray-900 capitalize">{product.category}</div>
                        </div>
                    </div>

                    {/* Short description */}
                    <div className="px-4">
                        <div className="rounded-lg border bg-gray-50 p-4">
                            <div className="mb-1 text-sm font-semibold text-gray-900">Descripción corta</div>
                            <p className="text-sm text-gray-700">{product.shortDescription}</p>
                        </div>
                    </div>

                    {/* Specs */}
                    <div className="p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900">Especificaciones</h4>
                            <Badge variant="secondary">{totalSpecs} items</Badge>
                        </div>
                        {totalSpecs > 0 ? (
                            <div className="overflow-hidden rounded-lg border">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                        <tr className="text-left text-gray-600">
                                            <th className="px-4 py-2">Etiqueta</th>
                                            <th className="px-4 py-2">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {product.specs.map((s, idx) => (
                                            <tr key={`${s.label}-${idx}`}>
                                                <td className="px-4 py-2 font-medium text-gray-900">{s.label}</td>
                                                <td className="px-4 py-2 text-gray-700">{s.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-600">
                                No hay especificaciones registradas.
                            </div>
                        )}
                    </div>

                    {/* Selling points */}
                    <div className="grid gap-3 p-4 md:grid-cols-2">
                        <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
                            <Truck className="h-4 w-4 text-blue-600" />
                            Envío a todo México
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Garantía disponible
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
                            <Zap className="h-4 w-4 text-blue-600" />
                            Bajo consumo
                        </div>
                        <div className="flex items-center gap-2 rounded-lg border p-3 text-sm text-gray-700">
                            <Wrench className="h-4 w-4 text-blue-600" />
                            Refacciones disponibles
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto border-t p-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">Administrar producto</div>
                            <Link href="/admin/productos/crear">
                                <Button variant="outline" className="bg-transparent cursor-pointer">
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Editar / Duplicar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    )
}
