"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Button } from "@/components/admin/ui"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Pedido } from "@/api/pedidos"
import { getAllPedidos } from "@/api/pedidos"
import PedidosTable from "@/components/admin/pedidos/PedidosTable"
import PedidoDrawer from "@/components/admin/pedidos/PedidoDrawer"
import Pagination from "@/components/ui/navigation/Pagination"
import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui"

interface PedidosClientProps {
    initialPedidos?: Pedido[]
    initialTotalCount?: number
    initialTotalPages?: number
}

const ESTADO_LABELS: Record<string, string> = {
    'CRE': 'Creado',
    'PAG': 'Pagado',
    'ENV': 'Enviado',
    'ENT': 'Entregado',
    'CAN': 'Cancelado',
}

const ESTADO_COLORS: Record<string, { light: string; dark: string }> = {
    'CRE': { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-500/20 text-yellow-400' },
    'PAG': { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
    'ENV': { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-500/20 text-blue-400' },
    'ENT': { light: 'bg-emerald-100 text-emerald-800', dark: 'bg-emerald-500/20 text-emerald-400' },
    'CAN': { light: 'bg-red-100 text-red-800', dark: 'bg-red-500/20 text-red-400' },
}

export default function PedidosClient({ 
    initialPedidos = [], 
    initialTotalCount = 0,
    initialTotalPages = 1 
}: PedidosClientProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos)
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("Todos")
    
    // Pagination state - inicializar con datos del servidor
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [totalCount, setTotalCount] = useState(initialTotalCount)
    
    // Drawer state
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    
    // Ref para evitar múltiples llamadas en Strict Mode
    const hasLoadedRef = useRef(false)

    const filteredPedidos = useMemo(() => {
        let filtered = pedidos

        // Filtrar por estado
        if (statusFilter !== "Todos") {
            filtered = filtered.filter(p => p.estado === statusFilter)
        }

        // Filtrar por búsqueda
        if (search.trim()) {
            const q = search.toLowerCase()
            filtered = filtered.filter(p => 
                p.id.toString().includes(q) ||
                p.usuario_nombre.toLowerCase().includes(q) ||
                p.usuario_email.toLowerCase().includes(q) ||
                p.items.some(item => item.refaccion_nombre.toLowerCase().includes(q))
            )
        }

        return filtered
    }, [pedidos, search, statusFilter])

    const loadData = async (page: number = 1) => {
        setLoading(true)
        try {
            const response = await getAllPedidos(page)
            setPedidos(response.results)
            setTotalCount(response.count)
            // Calcular total de páginas (20 pedidos por página)
            setTotalPages(Math.ceil(response.count / 20))
            setCurrentPage(page)
        } catch (err) {
            console.error("Error loading pedidos:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Solo cargar datos si no tenemos datos iniciales del servidor
        // El ref previene múltiples llamadas en React Strict Mode
        if (initialPedidos.length === 0) {
            if (!hasLoadedRef.current) {
                hasLoadedRef.current = true
                loadData(1)
            }
        } else {
            // Si tenemos datos iniciales, marcar como cargado para evitar llamadas adicionales
            hasLoadedRef.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePageChange = (page: number) => {
        loadData(page)
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleViewPedido = (pedido: Pedido) => {
        setSelectedPedido(pedido)
        setDrawerOpen(true)
    }

    const estadosUnicos = useMemo(() => {
        const estados = new Set(pedidos.map(p => p.estado))
        return Array.from(estados)
    }, [pedidos])

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <section className={`border-b ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="w-full mx-auto px-4 md:px-6 lg:px-8 py-6">
                    <div className="flex items-start gap-3">
                        <div className={`hidden sm:block rounded-lg p-2 ${dark ? 'bg-blue-500/10' : 'bg-blue-100'}`}>
                            <ShoppingCart className={`h-5 w-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                Gestión de Pedidos
                            </h1>
                            <p className={dark ? 'text-slate-400' : 'text-gray-600'}>
                                Administra y visualiza todos los pedidos del sistema
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filters */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 py-4">
                <div className={`rounded-xl border p-4 ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                <Input
                                    placeholder="Buscar por ID de pedido o producto..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Badge variant="secondary" className={dark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}>
                            {totalCount} pedido{totalCount !== 1 ? 's' : ''} en total
                        </Badge>
                    </div>

                    {/* Status Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setStatusFilter("Todos")}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                statusFilter === "Todos"
                                    ? dark
                                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                        : "bg-blue-100 text-blue-700 border border-blue-300"
                                    : dark
                                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Todos
                        </button>
                        {estadosUnicos.map(estado => (
                            <button
                                key={estado}
                                onClick={() => setStatusFilter(estado)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                    statusFilter === estado
                                        ? dark
                                            ? ESTADO_COLORS[estado]?.dark + " border border-current/30"
                                            : ESTADO_COLORS[estado]?.light + " border border-current/30"
                                        : dark
                                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {ESTADO_LABELS[estado] || estado}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-6">
                <div className={`overflow-hidden rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    {loading ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                            <p className={`mt-3 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Cargando...</p>
                        </div>
                    ) : (
                        <>
                            <PedidosTable
                                pedidos={filteredPedidos}
                                onView={handleViewPedido}
                                onDataChange={() => loadData(currentPage)}
                            />
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    count={totalCount}
                                    pageSize={20}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Drawer */}
            <PedidoDrawer
                pedido={selectedPedido}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                    setSelectedPedido(null)
                }}
            />
        </main>
    )
}

