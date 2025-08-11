import Link from "next/link"
import { categories as CATEGORIES } from "@/data/category"
import { Wrench } from 'lucide-react'
import Image from "next/image"

export default function CategoriasPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Encabezado principal */}
            <section className="border-b border-gray-200 bg-white">
                <div className="container mx-auto grid gap-6 px-4 py-12 md:grid-cols-2">
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-blue-700">
                            <Wrench className="h-4 w-4" />
                            Ecosistema de Ventilación y Refacciones
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">Categorías</h1>
                        <p className="mt-2 max-w-prose text-gray-600">
                            Explora nuestra línea de ventiladores y refacciones con un enfoque técnico y un diseño limpio que resalta
                            la calidad de cada producto.
                        </p>
                    </div>
                </div>
            </section>

            {/* Grid de categorías */}
            <section className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {CATEGORIES.map((cat, index) => (
                        <Link
                            key={index}
                            href={`/categorias/${cat.key}`}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <Image
                                src={cat.image || "/placeholder.svg"}
                                alt={cat.description}
                                width={600} // tamaño base para mantener proporción
                                height={208} // 208px ≈ h-52
                                className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                                <p className="mt-1 line-clamp-2 text-sm text-white/80">{cat.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    )
}
