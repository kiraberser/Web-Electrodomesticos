"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Modal } from "@/components/admin/ui/Modal"
import { Chip } from "@/components/admin/ui/Chip"
import { KPI } from "@/components/admin/sections/common/KPI"
import { ArrowDownToLine, ArrowUpFromLine, Activity, DollarSign, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react"
import type { MovimientoInventario, PaginatedMovimientos } from "@/api/inventario"
import { getMovimientos } from "@/api/inventario"
import type { Refaccion, Categoria } from "@/api/productos"
import { formatNumber, formatCurrency } from "@/components/admin/utils/format"
import InventarioHeader, { type InventarioTab } from "@/components/admin/inventario/InventarioHeader"
import MovimientosTable from "@/components/admin/inventario/MovimientosTable"
import Pagination from "@/components/ui/navigation/Pagination"
import EntradaForm from "@/components/admin/inventario/EntradaForm"
import SalidaForm from "@/components/admin/inventario/SalidaForm"
import DevolucionForm from "@/components/admin/inventario/DevolucionForm"
import RefaccionSearchDrawer from "@/components/admin/inventario/RefaccionSearchDrawer"

const MovimientosChart = dynamic(
    () => import("@/components/admin/inventario/MovimientosChart"),
    { ssr: false }
)

const PAGE_SIZE = 10
const STOCK_BAJO_UMBRAL = 5

interface InventarioClientProps {
    initialMovimientos: MovimientoInventario[]
    initialCount: number
    refacciones: Refaccion[]
    categorias: Categoria[]
}

export default function InventarioClient({ initialMovimientos, initialCount, refacciones, categorias }: InventarioClientProps) {
    const { dark } = useAdminTheme()
    const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(initialMovimientos)
    const [totalCount, setTotalCount] = useState(initialCount)
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = Math.ceil(totalCount / PAGE_SIZE)

    const [search, setSearch] = useState("")
    const [activeTab, setActiveTab] = useState<InventarioTab>("movimientos")
    const [tipoFilter, setTipoFilter] = useState<'ENT' | 'SAL' | null>(null)
    const [ordering, setOrdering] = useState("-fecha")
    const [fechaDesde, setFechaDesde] = useState("")
    const [fechaHasta, setFechaHasta] = useState("")
    const [loading, setLoading] = useState(false)

    // Stock alerts
    const [showAlerts, setShowAlerts] = useState(false)

    // Modal states
    const [showEntradaModal, setShowEntradaModal] = useState(false)
    const [showSalidaModal, setShowSalidaModal] = useState(false)
    const [showDevolucionModal, setShowDevolucionModal] = useState(false)

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false)

    // Prevent double-fetching on mount
    const isInitialMount = useRef(true)

    const loadData = useCallback(async (page: number) => {
        setLoading(true)
        try {
            const data: PaginatedMovimientos = await getMovimientos({
                page,
                tipo_movimiento: tipoFilter || undefined,
                ordering,
                fecha_gte: fechaDesde || undefined,
                fecha_lte: fechaHasta || undefined,
                search: search.trim() || undefined,
            })
            setMovimientos(data.results)
            setTotalCount(data.count)
            setCurrentPage(page)
        } catch (err) {
            console.error("Error loading movimientos:", err)
        } finally {
            setLoading(false)
        }
    }, [tipoFilter, ordering, fechaDesde, fechaHasta, search])

    // Re-fetch when filters change (reset to page 1)
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        loadData(1)
    }, [loadData])

    // KPI calculations (based on refacciones, not paginated movimientos)
    const kpis = useMemo(() => {
        const valorInventario = refacciones.reduce((acc, r) => acc + (Number(r.precio) * r.existencias), 0)
        return {
            total: totalCount,
            valorInventario,
        }
    }, [totalCount, refacciones])

    // Stock bajo alerts
    const refaccionesStockBajo = useMemo(() =>
        refacciones.filter(r => r.existencias <= STOCK_BAJO_UMBRAL)
            .sort((a, b) => a.existencias - b.existencias),
        [refacciones]
    )

    // Tab change handler
    const handleTabChange = (tab: InventarioTab) => {
        if (tab === "entrada") {
            setShowEntradaModal(true)
            return
        }
        if (tab === "salida") {
            setShowSalidaModal(true)
            return
        }
        if (tab === "devolucion") {
            setShowDevolucionModal(true)
            return
        }
        setActiveTab(tab)
    }

    const handleSuccess = useCallback(() => {
        setShowEntradaModal(false)
        setShowSalidaModal(false)
        setShowDevolucionModal(false)
        loadData(currentPage)
    }, [loadData, currentPage])

    const handleSort = useCallback((field: string) => {
        setOrdering(field)
    }, [])

    const handlePageChange = useCallback((page: number) => {
        loadData(page)
    }, [loadData])

    const handleTipoFilter = useCallback((tipo: 'ENT' | 'SAL' | null) => {
        setTipoFilter(prev => prev === tipo ? null : tipo)
    }, [])

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <InventarioHeader
                activeTab={activeTab}
                onTabChange={handleTabChange}
                searchPlaceholder="Buscar por observaciones..."
                resultsCount={totalCount}
                onSearchChange={setSearch}
                searchValue={search}
                onOpenSearchDrawer={() => setDrawerOpen(true)}
            />

            {/* KPIs */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 py-4">
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                    <KPI
                        label="Total movimientos"
                        value={formatNumber(kpis.total)}
                        icon={<Activity className="h-5 w-5" />}
                        accentColor="blue"
                        hint="filtrados"
                    />
                    <KPI
                        label="Refacciones"
                        value={formatNumber(refacciones.length)}
                        icon={<ArrowDownToLine className="h-5 w-5" />}
                        accentColor="emerald"
                        hint="registradas"
                    />
                    <KPI
                        label="Stock bajo"
                        value={formatNumber(refaccionesStockBajo.length)}
                        icon={<AlertTriangle className="h-5 w-5" />}
                        accentColor="red"
                        hint={`<= ${STOCK_BAJO_UMBRAL} uds`}
                    />
                    <KPI
                        label="Valor inventario"
                        value={formatCurrency(kpis.valorInventario)}
                        icon={<DollarSign className="h-5 w-5" />}
                        accentColor="amber"
                        hint="estimado"
                    />
                </div>
            </section>

            {/* Stock bajo alerts */}
            {refaccionesStockBajo.length > 0 && (
                <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-4">
                    <button
                        type="button"
                        onClick={() => setShowAlerts(!showAlerts)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            dark
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-50 text-red-700 hover:bg-red-100'
                        }`}
                    >
                        <AlertTriangle className="h-4 w-4" />
                        Alertas stock bajo ({refaccionesStockBajo.length})
                        {showAlerts ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {showAlerts && (
                        <div className={`mt-2 rounded-xl border p-4 ${dark ? 'border-slate-800 bg-slate-900/50' : 'border-gray-200 bg-white'}`}>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {refaccionesStockBajo.map((r) => (
                                    <div
                                        key={r.id}
                                        className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                                            dark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-gray-50'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium truncate ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                {r.nombre}
                                            </p>
                                            <p className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                                {r.codigo_parte}
                                            </p>
                                        </div>
                                        <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                                            r.existencias === 0
                                                ? dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                                                : dark ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {r.existencias}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Filters: Chips + Date range */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <Chip
                        selected={tipoFilter === null}
                        onClick={() => setTipoFilter(null)}
                    >
                        Todos
                    </Chip>
                    <Chip
                        selected={tipoFilter === 'ENT'}
                        onClick={() => handleTipoFilter('ENT')}
                        color="success"
                    >
                        Entradas
                    </Chip>
                    <Chip
                        selected={tipoFilter === 'SAL'}
                        onClick={() => handleTipoFilter('SAL')}
                        color="danger"
                    >
                        Salidas
                    </Chip>

                    <div className="flex items-center gap-2 ml-auto">
                        <label className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Desde</label>
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className={`h-8 rounded-lg border px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 ${
                                dark
                                    ? 'border-slate-700 bg-slate-800 text-slate-200'
                                    : 'border-gray-300 bg-white text-gray-800'
                            }`}
                        />
                        <label className={`text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Hasta</label>
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className={`h-8 rounded-lg border px-2 text-xs outline-none focus:ring-2 focus:ring-blue-500 ${
                                dark
                                    ? 'border-slate-700 bg-slate-800 text-slate-200'
                                    : 'border-gray-300 bg-white text-gray-800'
                            }`}
                        />
                        {(fechaDesde || fechaHasta) && (
                            <button
                                type="button"
                                onClick={() => { setFechaDesde(""); setFechaHasta("") }}
                                className={`h-8 rounded-lg px-2 text-xs ${
                                    dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Chart */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-4">
                <MovimientosChart movimientos={movimientos} />
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
                        <MovimientosTable
                            movimientos={movimientos}
                            ordering={ordering}
                            onSort={handleSort}
                        />
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        count={totalCount}
                        pageSize={PAGE_SIZE}
                        onPageChange={handlePageChange}
                    />
                </div>
            </section>

            {/* Modals */}
            <Modal open={showEntradaModal} onClose={() => setShowEntradaModal(false)}>
                <EntradaForm
                    refacciones={refacciones}
                    categorias={categorias}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowEntradaModal(false)}
                />
            </Modal>

            <Modal open={showSalidaModal} onClose={() => setShowSalidaModal(false)}>
                <SalidaForm
                    refacciones={refacciones}
                    categorias={categorias}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowSalidaModal(false)}
                />
            </Modal>

            <Modal open={showDevolucionModal} onClose={() => setShowDevolucionModal(false)}>
                <DevolucionForm
                    refacciones={refacciones}
                    categorias={categorias}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowDevolucionModal(false)}
                />
            </Modal>

            {/* Search Drawer */}
            <RefaccionSearchDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                refacciones={refacciones}
                movimientos={movimientos}
            />
        </main>
    )
}
