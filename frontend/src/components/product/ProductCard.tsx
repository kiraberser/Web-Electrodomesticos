"use client"

import Image from "next/image"
import { Button } from "../ui/forms/Button"
import { Badge } from "../ui"

import { ShoppingCart, Shield, Zap } from 'lucide-react'
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hook/use-toast"
import type { Product } from "@/data/products"

interface Props {
    product?: Product
    href?: string
}

export default function ProductCard({
    product = {
        id: "sample-1",
        slug: "producto-ejemplo",
        name: "Ventilador Azteca 3 Velocidades",
        price: 1299,
        brand: "Azteca",
        type: "Pedestal",
        category: "ventiladores",
        image:
            "/placeholder.svg?height=640&width=640",
        shortDescription: "Potente y silencioso, ideal para tu hogar.",
        specs: [
            { label: "Velocidades", value: "3" },
            { label: "Diámetro", value: "18”" },
        ],
        inStock: true,
    },
    href,
}: Props) {
    const { addItem } = useCart()
    const { toast } = useToast()

    const handleAdd = () => {
        try {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            })
            toast({
                title: "Agregado al carrito",
                description: `${product.name} fue agregado correctamente.`,
            })
        } catch {
            toast({
                title: "No se pudo agregar",
                description: "Ocurrió un problema al agregar el producto.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
            <Link
                href={
                    href ||
                    `/categorias/${encodeURIComponent(product.category)}/${encodeURIComponent(product.slug)}`
                }
                className="block"
                aria-label={`Ver ${product.name}`}
            >
                <div className="relative aspect-square w-full bg-gray-50">
                    <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {!product.inStock && (
                        <Badge className="absolute left-3 top-3 bg-red-600 hover:bg-red-700 text-white">Agotado</Badge>
                    )}
                    <Badge className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {product.brand}
                    </Badge>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <Link
                    href={`/categorias/${encodeURIComponent(product.category)}/${encodeURIComponent(product.slug)}`}
                    className="line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                    {product.name}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{product.shortDescription}</p>

                <div className="mt-3 flex items-center justify-between">
                    <div className="text-xl font-bold text-gray-900">${product.price.toFixed(0)} MXN</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Shield className="h-3.5 w-3.5 text-blue-600" />
                        Garantía
                    </div>
                </div>

                <Button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Agregar al carrito
                </Button>
            </div>
        </div>
    )
}
