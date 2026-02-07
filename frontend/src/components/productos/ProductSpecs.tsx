"use client"

import { Wrench } from "lucide-react"
import type { Product } from "@/data/products"

interface ProductSpecsProps {
    product: Product
    description?: string
}

export default function ProductSpecs({ product, description }: ProductSpecsProps) {
    return (
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-[#0A3981] mb-4 flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Descripción del Producto
                </h2>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                    <p>
                        {description ||
                            product.shortDescription ||
                            "Este producto cuenta con los más altos estándares de calidad..."}
                    </p>
                    <p className="mt-4">
                        Ideal para mantenimiento preventivo y correctivo. 
                        Fabricado con materiales resistentes que aseguran una larga vida útil. 
                        Compatible con los modelos especificados en la ficha técnica.
                    </p>
                </div>
            </div>

            {/* Ficha Técnica Completa */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-[#0A3981] mb-4">
                    Especificaciones Técnicas
                </h3>
                <div className="divide-y divide-gray-100">
                    {product.specs.map((s, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-3 py-3"
                        >
                            <span className="text-gray-500 font-medium">
                                {s.label}
                            </span>
                            <span className="col-span-2 text-gray-900">
                                {s.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
