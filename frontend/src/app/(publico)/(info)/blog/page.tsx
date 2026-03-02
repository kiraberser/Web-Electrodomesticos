import type { Metadata } from 'next'
import { Input } from '@/shared/ui/forms/InputField'
import { Search, BookOpen } from 'lucide-react'
import Link from 'next/link'
import BlogFilters from './BlogFilters'
import { getBlogPosts } from '@/features/blog/api'

export const metadata: Metadata = {
    title: 'Blog — Consejos y Guías',
    description: 'Artículos sobre mantenimiento de electrodomésticos, guías de compra y consejos para el hogar.',
    alternates: {
        canonical: 'https://www.refaccionariavega.com.mx/blog',
    },
}

function BlogEmptyState() {
    return (
        <div className="py-20 text-center max-w-lg mx-auto px-4">
            <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-5 rounded-full">
                    <BookOpen className="w-12 h-12 text-[#0A3981]" />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-[#0A3981] mb-3">Próximamente</h2>
            <p className="text-gray-600 mb-2">
                Estamos preparando artículos con consejos prácticos sobre mantenimiento de electrodomésticos, guías de compra y más.
            </p>
            <p className="text-gray-500 text-sm mb-8">
                Vuelve pronto — el contenido está en camino.
            </p>
            <Link
                href="/categorias"
                className="inline-flex items-center gap-2 bg-[#0A3981] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1F509A] transition-colors"
            >
                Ver catálogo de refacciones
            </Link>
        </div>
    )
}

export default async function BlogPage() {
    const apiPosts = await getBlogPosts()
    return (
        <div className="min-h-screen">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Blog Refaccionaria &apos;Vega&apos;
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Descubre consejos, guías y las últimas tendencias en electrodomésticos y tecnología para el hogar
                        </p>
                        {apiPosts.length > 0 && (
                            <div className="relative max-w-md mx-auto">
                                <Input
                                    type="text"
                                    placeholder="Buscar artículos..."
                                    className="pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                                    readOnly
                                />
                                <Search className="absolute left-3 top-3 w-5 h-5 text-white/70" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {apiPosts.length === 0 ? (
                <BlogEmptyState />
            ) : (
                <BlogFilters apiPosts={apiPosts} />
            )}
        </div>
    )
}
