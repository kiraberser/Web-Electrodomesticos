"use client"

import { useState, useMemo, useEffect, useRef, useTransition } from "react"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { Pedido, PedidosStats } from "@/features/orders/api"
import { getAllPedidos } from "@/features/orders/api"
import PedidosTable from "@/features/admin/pedidos/PedidosTable"
import PedidoDrawer from "@/features/admin/pedidos/PedidoDrawer"
import Pagination from "@/shared/ui/navigation/Pagination"
import { ShoppingCart, Search, TrendingUp, Package, CheckCircle, DollarSign } from "lucide-react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface PedidosClientProps {
    initialPedidos?: Pedido[]
    initialTotalCount?: number
    initialTotalPages?: number
    initialStats?: PedidosStats | null
}

const ESTADO_LABELS: Record<string, string> = {
    CRE: 'Creado',
    PAG: 'Pagado',
    ENV: 'Enviado',
    ENT: 'Entregado',
    CAN: 'Cancelado',
}

const ESTADO_COLORS: Record<string, { light: string; dark: string }> = {
    CRE: { light: 'bg-yellow-100 text-yellow-800', dark: 'bg-yellow-500/20 text-yellow-400' },
    PAG: { light: 'bg-green-100 text-green-800', dark: 'bg-green-500/20 text-green-400' },
    ENV: { light: 'bg-blue-100 text-blue-800', dark: 'bg-blue-500/20 text-blue-400' },
    ENT: { light: 'bg-emerald-100 text-emerald-800', dark: 'bg-emerald-500/20 text-emerald-400' },
    CAN: { light: 'bg-red-100 text-red-800', dark: 'bg-red-500/20 text-red-400' },
}

const ESTADO_CHART_COLORS: Record<string, string> = {
    CRE: '#EAB308',
    PAG: '#22C55E',
    ENV: '#3B82F6',
    ENT: '#10B981',
    CAN: '#EF4444',
}

const PAGO_LABELS: Record<string, string> = {
    APR: 'Aprobado',
    PEN: 'Pendiente',
    sin_pago: 'Sin pago',
}

export default function PedidosClient({
    initialPedidos = [],
    initialTotalCount = 0,
    initialTotalPages = 1,
    initialStats = null,
}: PedidosClientProps) {
    const { dark } = useAdminTheme()
    const [pedidos, setPedidos] = useState<Pedido[]>(initialPedidos)
    const [loading, setLoading] = useState(false)
    const [stats] = useState<PedidosStats | null>(initialStats)

    const [estadoFilter, setEstadoFilter] = useState<string | null>(null)
    const [pagoFilter, setPagoFilter] = useState<string | null>(null)

    const [lookupId, setLookupId] = useState("")
    const [lookedUpPedido, setLookedUpPedido] = useState<Pedido | null>(null)
    const [lookupError, setLookupError] = useState("")
    const [isPending, startTransition] = useTransition()

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(initialTotalPages)
    const [totalCount, setTotalCount] = useState(initialTotalCount)

    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const hasLoadedRef = useRef(false)

    const filteredPedidos = useMemo(() => {
        let list = pedidos
        if (estadoFilter) list = list.filter(p => p.estado === estadoFilter)
        if (pagoFilter === 'APR') list = list.filter(p => p.pago_status === 'APR')
        else if (pagoFilter === 'PEN') list = list.filter(p => p.pago_status === 'PEN')
        else if (pagoFilter === 'sin_pago') list = list.filter(p => !p.pago_status)
        return list
    }, [pedidos, estadoFilter, pagoFilter])

    const loadData = async (page: number = 1) => {
        setLoading(true)
        try {
            const response = await getAllPedidos(page)
            setPedidos(response.results)
            setTotalCount(response.count)
            setTotalPages(Math.ceil(response.count / 20))
            setCurrentPage(page)
        } catch (err) {
            console.error("Error loading pedidos:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (initialPedidos.length === 0) {
            if (!hasLoadedRef.current) {
                hasLoadedRef.current = true
                loadData(1)
            }
        } else {
            hasLoadedRef.current = true
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlePageChange = (page: number) => {
        loadData(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleViewPedido = (pedido: Pedido) => {
        setSelectedPedido(pedido)
        setDrawerOpen(true)
    }

    const handleLookup = () => {
        if (!lookupId.trim()) return
        setLookupError("")
        setLookedUpPedido(null)
        startTransition(() => {
            const found = pedidos.find(p => String(p.id) === lookupId.trim())
            if (found) {
                setLookedUpPedido(found)
            } else {
                setLookupError(`No se encontró el pedido #${lookupId} en la página actual`)
            }
        })
    }

    const chipClass = (active: boolean, activeStyle: string) =>
        `px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
            active
                ? activeStyle
                : dark
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`

    const activeChipLight = "bg-blue-100 text-blue-700 border border-blue-300"
    const activeChipDark = "bg-blue-500/20 text-blue-400 border border-blue-500/30"

    // Chart data
    const chartData = stats
        ? Object.entries(stats.por_estado)
            .filter(([, v]) => v > 0)
            .map(([key, count]) => ({ name: ESTADO_LABELS[key] ?? key, value: count, color: ESTADO_CHART_COLORS[key] ?? '#94A3B8' }))
        : []

    const kpiActivos = stats
        ? (stats.por_estado.CRE ?? 0) + (stats.por_estado.PAG ?? 0) + (stats.por_estado.ENV ?? 0)
        : 0

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

            {/* KPI + Chart */}
            {stats && (
                <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pt-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* KPI cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-3 flex-1">
                            {/* Total pedidos */}
                            <div className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <div className={`text-3xl font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                    {stats.total.toLocaleString('es-MX')}
                                </div>
                                <div className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Total Pedidos
                                </div>
                            </div>
                            {/* Revenue */}
                            <div className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <div className={`text-3xl font-bold tracking-tight ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                    ${stats.revenue.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                                <div className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Revenue Total
                                </div>
                            </div>
                            {/* Activos */}
                            <div className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-500">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <div className={`text-3xl font-bold tracking-tight ${dark ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {kpiActivos.toLocaleString('es-MX')}
                                </div>
                                <div className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Activos
                                </div>
                            </div>
                            {/* Entregados */}
                            <div className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-green-600">
                                    <CheckCircle className="h-4 w-4 text-white" />
                                </div>
                                <div className={`text-3xl font-bold tracking-tight ${dark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    {(stats.por_estado.ENT ?? 0).toLocaleString('es-MX')}
                                </div>
                                <div className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Entregados
                                </div>
                            </div>
                        </div>

                        {/* Donut chart */}
                        {chartData.length > 0 && (
                            <div className={`rounded-xl border p-4 flex items-center gap-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <ResponsiveContainer width={130} height={130}>
                                    <PieChart>
                                        <Pie data={chartData} innerRadius={38} outerRadius={58} dataKey="value" strokeWidth={0}>
                                            {chartData.map((entry, i) => (
                                                <Cell key={i} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: dark ? '#1e293b' : '#fff',
                                                border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                color: dark ? '#f1f5f9' : '#374151',
                                            }}
                                            itemStyle={{ color: dark ? '#f1f5f9' : '#374151' }}
                                            labelStyle={{ color: dark ? '#94a3b8' : '#6b7280' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-1.5 text-xs">
                                    {chartData.map(entry => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                                            <span className={dark ? 'text-slate-100' : 'text-gray-700'}>
                                                {entry.name}: <span className={`font-semibold ${dark ? 'text-slate-200' : ''}`}>{entry.value}</span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Lookup + Filters */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 py-4">
                <div className={`rounded-xl border p-4 space-y-4 ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>

                    {/* Lookup por ID */}
                    <div>
                        <p className={`text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Buscar por ID de pedido</p>
                        <div className="flex gap-2 max-w-xs">
                            <div className="relative flex-1">
                                <Search className={`absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                <input
                                    type="number"
                                    placeholder="Ej. 42"
                                    value={lookupId}
                                    onChange={e => { setLookupId(e.target.value); setLookupError(""); setLookedUpPedido(null) }}
                                    onKeyDown={e => e.key === 'Enter' && handleLookup()}
                                    className={`w-full rounded-md border pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                                        dark
                                            ? 'border-slate-700 bg-slate-800 text-slate-200 placeholder:text-slate-500'
                                            : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-400'
                                    }`}
                                />
                            </div>
                            <button
                                onClick={handleLookup}
                                disabled={isPending || !lookupId.trim()}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
                                    dark
                                        ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                Buscar
                            </button>
                        </div>

                        {/* Lookup result */}
                        {lookupError && (
                            <p className={`mt-2 text-xs ${dark ? 'text-red-400' : 'text-red-600'}`}>{lookupError}</p>
                        )}
                        {lookedUpPedido && (
                            <button
                                onClick={() => handleViewPedido(lookedUpPedido)}
                                className={`mt-2 flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition w-full text-left ${
                                    dark
                                        ? 'border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-slate-200'
                                        : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-gray-900'
                                }`}
                            >
                                <ShoppingCart className={`h-4 w-4 flex-shrink-0 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                                <span>
                                    <span className="font-mono font-semibold">#{lookedUpPedido.id}</span>
                                    {' — '}
                                    {lookedUpPedido.usuario_nombre}
                                    {' · '}
                                    <span className={dark ? 'text-slate-400' : 'text-gray-500'}>
                                        {ESTADO_LABELS[lookedUpPedido.estado] ?? lookedUpPedido.estado}
                                    </span>
                                </span>
                                <span className={`ml-auto text-xs ${dark ? 'text-blue-400' : 'text-blue-600'}`}>Ver →</span>
                            </button>
                        )}
                    </div>

                    {/* Estado chips */}
                    <div>
                        <p className={`text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Estado del pedido</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setEstadoFilter(null)}
                                className={chipClass(!estadoFilter, dark ? activeChipDark : activeChipLight)}
                            >
                                Todos
                            </button>
                            {Object.entries(ESTADO_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setEstadoFilter(estadoFilter === key ? null : key)}
                                    className={chipClass(
                                        estadoFilter === key,
                                        dark ? ESTADO_COLORS[key]?.dark + " border border-current/30" : ESTADO_COLORS[key]?.light + " border border-current/30"
                                    )}
                                >
                                    {label}
                                    {stats && (
                                        <span className="ml-1 opacity-60">({stats.por_estado[key] ?? 0})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pago chips */}
                    <div>
                        <p className={`text-xs font-medium mb-1.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Estado de pago</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setPagoFilter(null)}
                                className={chipClass(!pagoFilter, dark ? activeChipDark : activeChipLight)}
                            >
                                Todos
                            </button>
                            {Object.entries(PAGO_LABELS).map(([key, label]) => (
                                <button
                                    key={key}
                                    onClick={() => setPagoFilter(pagoFilter === key ? null : key)}
                                    className={chipClass(pagoFilter === key, dark ? activeChipDark : activeChipLight)}
                                >
                                    {label}
                                    {stats && (
                                        <span className="ml-1 opacity-60">({stats.por_pago[key] ?? 0})</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Count badge */}
                    <div className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                        Mostrando {filteredPedidos.length} de {totalCount} pedido{totalCount !== 1 ? 's' : ''}
                    </div>
                </div>
            </section>

            {/* Table */}
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
                            {totalPages > 1 && !estadoFilter && !pagoFilter && (
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
                onEstadoUpdated={(updatedPedido) => {
                    setPedidos(prev => prev.map(p => p.id === updatedPedido.id ? updatedPedido : p))
                    loadData(currentPage)
                }}
            />
        </main>
    )
}
