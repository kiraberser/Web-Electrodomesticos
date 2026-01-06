import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getFavoritosAction } from "@/actions/favoritos"
import FavoritosList from "@/components/favoritos/FavoritosList"
import FavoritosSync from "@/components/favoritos/FavoritosSync"
import { Heart } from "lucide-react"

export const metadata: Metadata = {
    title: 'Mis Favoritos - Refaccionaria Vega',
    description: 'Productos que te gustan',
}

export default async function FavoritosPage() {
    // Verificar autenticación
    const cookieStore = await cookies()
    const username = cookieStore.get('username')?.value
    
    if (!username) {
        redirect('/cuenta')
    }

    // Obtener favoritos del servidor
    const result = await getFavoritosAction()
    
    if (!result.success) {
        redirect('/cuenta')
    }

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Componente para sincronizar favoritos pendientes */}
            <FavoritosSync />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#0A3981]/10 rounded-lg">
                                <Heart className="h-6 w-6 text-[#0A3981]" fill="currentColor" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Mis Favoritos
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {result.total} {result.total === 1 ? 'producto' : 'productos'} guardado{result.total === 1 ? '' : 's'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Lista de favoritos */}
                    <FavoritosList favoritos={result.data || []} />
                </div>
            </div>
        </main>
    )
}

