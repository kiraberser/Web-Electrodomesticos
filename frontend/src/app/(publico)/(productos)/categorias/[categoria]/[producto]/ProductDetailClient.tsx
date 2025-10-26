"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/forms/Button"
import { Badge } from "@/components/ui"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hook/use-toast"
import Link from "next/link"
import { type Refaccion } from "@/api/productos"
import { ProductType, type Product } from "@/data/products"
import { ArrowLeft, Truck, Shield, Zap, Wrench } from "@/components/icons"

interface Props {
    categoria: string
    refaccion: Refaccion
}

export default function ProductDetailClient({ categoria, refaccion }: Props) {
    const router = useRouter()
    const { addItem } = useCart()
    const { toast } = useToast()

    // Transformar Refaccion a Product
    const product: Product = useMemo(() => ({
        id: String(refaccion.id),
        slug: refaccion.codigo_parte,
        name: refaccion.nombre,
        price: Number(refaccion.precio),
        brand: refaccion.marca as any,
        type: refaccion.categoria_nombre as ProductType,
        category: categoria,
        image: refaccion.imagen || '/placeholder.svg?height=640&width=640',
        shortDescription: refaccion.descripcion || '',
        specs: [
            { label: "Marca", value: refaccion.marca },
            { label: "Código de parte", value: refaccion.codigo_parte },
            { label: "Estado", value: refaccion.estado },
            ...(refaccion.compatibilidad ? [{ label: "Compatibilidad", value: refaccion.compatibilidad }] : []),
        ],
        inStock: refaccion.existencias > 0,
    }), [refaccion, categoria])

    const handleAdd = () => {
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
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="border-b border-gray-200 bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.back()} className="cursor-pointer">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                        <nav className="text-xs text-gray-500">
                            <Link href="/categorias" className="hover:text-gray-700">
                                Categorías
                            </Link>{" "}
                            /{" "}
                            <Link href={`/categorias/${categoria}`} className="hover:text-gray-700">
                                {categoria}
                            </Link>{" "}
                            / <span className="text-gray-700">{product.name}</span>
                        </nav>
                    </div>
                </div>
            </section>

            <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2">
                {/* Imagen */}
                <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="relative aspect-square w-full">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority={true} />
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                        <Badge className="bg-blue-600 text-white">{product.brand}</Badge>
                        <Badge variant="secondary">{product.type}</Badge>
                        {product.inStock ? (
                            <Badge className="bg-green-600 text-white">En stock</Badge>
                        ) : (
                            <Badge className="bg-red-600 text-white">Agotado</Badge>
                        )}
                    </div>
                </div>

                {/* Info */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                    <p className="mt-2 text-gray-600">{product.shortDescription}</p>

                    <div className="mt-4 flex items-center gap-4">
                        <div className="text-3xl font-bold text-gray-900">${product.price.toFixed(0)} MXN</div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {product.specs.map((s) => (
                            <div key={s.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                                <div className="text-xs font-medium text-gray-500">{s.label}</div>
                                <div className="text-sm text-gray-900">{s.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-2">
                            <Truck className="h-4 w-4 text-blue-600" />
                            Envío a todo México
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            Garantía 12 meses
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-600" />
                            Bajo consumo
                        </span>
                        <span className="inline-flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-blue-600" />
                            Refacciones disponibles
                        </span>
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button
                            onClick={handleAdd}
                            disabled={!product.inStock}
                            className="w-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                        >
                            Agregar al carrito
                        </Button>
                        <Link
                            href={`/categorias/${encodeURIComponent(product.category)}`}
                            className="w-full rounded-md border border-gray-300 bg-transparent px-4 py-2 text-center text-gray-700 transition hover:bg-gray-50"
                        >
                            Ver más en {product.category}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    )
}

