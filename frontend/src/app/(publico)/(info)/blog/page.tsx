import type { Metadata } from 'next'
import { Input } from '@/shared/ui/forms/InputField'
import { Search } from 'lucide-react'
import BlogFilters from './BlogFilters'

export const metadata: Metadata = {
    title: 'Blog — Consejos y Guías',
    description: 'Artículos sobre mantenimiento de electrodomésticos, guías de compra y consejos para el hogar.',
}

export default function BlogPage() {
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
                        {/* Static search bar placeholder — interactivity handled in BlogFilters */}
                        <div className="relative max-w-md mx-auto">
                            <Input
                                type="text"
                                placeholder="Buscar artículos..."
                                className="pl-10 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder-white/70 focus:bg-white/20"
                                readOnly
                            />
                            <Search className="absolute left-3 top-3 w-5 h-5 text-white/70" />
                        </div>
                    </div>
                </div>
            </div>

            <BlogFilters />
        </div>
    )
}
