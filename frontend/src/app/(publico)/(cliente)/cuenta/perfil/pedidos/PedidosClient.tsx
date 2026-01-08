"use client"

import { useState, useEffect } from "react"
import PedidosList from "@/components/pedidos/PedidosList"
import PedidosPagination from "@/components/pedidos/PedidosPagination"
import { obtenerMisPedidosAction } from "@/actions/pedidos"
import type { Pedido } from "@/api/pedidos"
import { Package, Loader2 } from "lucide-react"

interface PedidosClientProps {
    initialData: {
        results: Pedido[]
        count: number
        next: string | null
        previous: string | null
    } | null
    initialPage: number
}

export default function PedidosClient({ initialData, initialPage }: PedidosClientProps) {
    const [pedidos, setPedidos] = useState<Pedido[]>(initialData?.results || [])
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalCount, setTotalCount] = useState(initialData?.count || 0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const pageSize = 20
    const totalPages = Math.ceil(totalCount / pageSize)

    const loadPedidos = async (page: number) => {
        try {
            setLoading(true)
            setError(null)
            
            const result = await obtenerMisPedidosAction(page)
            
            if (result.success && result.data) {
                setPedidos(result.data.results || [])
                setTotalCount(result.data.count || 0)
                setCurrentPage(page)
                // Scroll to top when page changes
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setError(result.error || 'Error al cargar tus pedidos')
            }
        } catch (err) {
            console.error('Error cargando pedidos:', err)
            setError('Error al cargar tus pedidos. Por favor, intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        loadPedidos(page)
    }

    if (error && pedidos.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-gray-600">
                        Por favor, intenta recargar la página.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {loading && pedidos.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0A3981] mx-auto mb-4" />
                    <p className="text-gray-600">Cargando tus pedidos...</p>
                </div>
            ) : (
                <>
                    <PedidosList pedidos={pedidos} />
                    
                    {totalPages > 1 && (
                        <PedidosPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            count={totalCount}
                            pageSize={pageSize}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    )
}

