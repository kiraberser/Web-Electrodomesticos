import type { Metadata } from "next"
import { obtenerMisComprasAction } from "@/actions/compras"
import MisComprasClient from "./MisComprasClient"
import { Package } from "lucide-react"
import { Suspense } from "react"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Mis Compras - Refaccionaria Vega',
    description: 'Historial de tus compras',
}

export default async function MisComprasPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams
    const page = parseInt(params.page || '1', 10)
    const result = await obtenerMisComprasAction(page)

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#0A3981] rounded-lg">
                            <Package className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">Mis Compras</h1>
                    </div>
                    <p className="text-gray-600">
                        Aquí puedes ver el historial de todas tus compras realizadas
                    </p>
                </div>

                {/* Content */}
                <Suspense fallback={
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <p className="text-gray-600">Cargando tus compras...</p>
                    </div>
                }>
                    {result.success && result.data ? (
                        <MisComprasClient 
                            initialData={result.data} 
                            initialPage={page}
                        />
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="text-center py-8">
                                <p className="text-red-600 mb-4">
                                    {result.error || 'Error al cargar tus compras'}
                                </p>
                                <p className="text-gray-600">
                                    Por favor, intenta recargar la página.
                                </p>
                            </div>
                        </div>
                    )}
                </Suspense>
            </div>
        </div>
    )
}

