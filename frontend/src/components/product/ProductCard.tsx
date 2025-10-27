"use client"

import Image from "next/image"
import { Button } from "../ui/forms/Button"
import { Badge } from "../ui"
import { Zap, Shield } from "@/components/icons"
import Link from "next/link"
import type { Product } from "@/data/products"

const ShoppingCartIcon = () => (
    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
)

interface Props {
    product?: Product
    key?: string | undefined
}

export default function ProductCard({
    product
}: Props) {

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            <Link
                href={
                    `/categorias/${product?.category}/${product?.name}`
                }
                className="block"
                aria-label={`Ver ${product?.name || ""}`}
            >
                <div className="relative aspect-square w-full bg-gray-50">
                    <Image
                        src={product?.image || "/placeholder.svg"}
                        alt={product?.name || ""}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                    {!product?.inStock && (
                        <Badge className="absolute left-3 top-3 bg-red-600 hover:bg-red-700 text-white">Agotado</Badge>
                    )}
                    <Badge className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span>{product?.brand}</span>
                    </Badge>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={
                        `/categorias/${product?.category}/${product?.name}`
                    }
                    className="line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                    {product?.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product?.shortDescription}</p>

                <div className="mt-3 flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">${product?.price.toFixed(0)} MXN</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="h-3.5 w-3.5 text-blue-600" />
                        <span>Garantía</span>
                    </div>
                </div>

                <Button
                    onClick={() => {}}
                    disabled={!product?.inStock}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                    <ShoppingCartIcon />
                    Agregar al carrito
                </Button>
            </div>
        </div>
    )
}
