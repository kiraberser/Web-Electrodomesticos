"use client"

import { useState, useEffect } from "react"
import ComprasList from "@/components/compras/ComprasList"
import ComprasPagination from "@/components/compras/ComprasPagination"
import { obtenerMisComprasAction } from "@/actions/compras"
import type { Pedido } from "@/api/pedidos"
import { Package, Loader2 } from "lucide-react"

interface MisComprasClientProps {
    initialData: {
        results: Pedido[]
        count: number
        next: string | null
        previous: string | null
    } | null
    initialPage: number
}

export default function MisComprasClient({ initialData, initialPage }: MisComprasClientProps) {
    const [compras, setCompras] = useState<Pedido[]>(initialData?.results || [])
    const [currentPage, setCurrentPage] = useState(initialPage)
    const [totalCount, setTotalCount] = useState(initialData?.count || 0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const pageSize = 10
    const totalPages = Math.ceil(totalCount / pageSize)

    const loadCompras = async (page: number) => {
        try {
            setLoading(true)
            setError(null)
            
            const result = await obtenerMisComprasAction(page)
            
            if (result.success && result.data) {
                setCompras(result.data.results || [])
                setTotalCount(result.data.count || 0)
                setCurrentPage(page)
                // Scroll to top when page changes
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else {
                setError(result.error || 'Error al cargar tus compras')
            }
        } catch (err) {
            console.error('Error cargando compras:', err)
            setError('Error al cargar tus compras. Por favor, intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        loadCompras(page)
    }

    if (error && compras.length === 0) {
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
            {loading && compras.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0A3981] mx-auto mb-4" />
                    <p className="text-gray-600">Cargando tus compras...</p>
                </div>
            ) : (
                <>
                    <ComprasList compras={compras} />
                    
                    {totalPages > 1 && (
                        <ComprasPagination
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

