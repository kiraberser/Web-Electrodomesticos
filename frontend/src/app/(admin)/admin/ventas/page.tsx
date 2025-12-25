"use client"

import { useState, useEffect, useRef } from "react"
import { getAllVentas, getEstadisticasVentas, getGraficoVentas } from "@/api/ventas"
import type { Venta, EstadisticasVentas, GraficoVentasData } from "@/api/ventas"
import VentasStats from "@/components/admin/ventas/VentasStats"
import VentasTable from "@/components/admin/ventas/VentasTable"
import VentaDrawer from "@/components/admin/ventas/VentaDrawer"
import VentasChart from "@/components/admin/ventas/VentasChart"
import { exportToCSV, exportToExcel, exportAllVentas } from "@/components/admin/ventas/exportVentas"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Button } from "@/components/admin/ui"
import { Input } from "@/components/ui/forms/InputField"
import Pagination from "@/components/ui/navigation/Pagination"
import { X, Download, FileSpreadsheet, Search } from "lucide-react"

export default function VentasPage() {
    const { dark } = useAdminTheme()
    const [ventas, setVentas] = useState<Venta[]>([])
    const [estadisticas, setEstadisticas] = useState<EstadisticasVentas | null>(null)
    const [graficoData, setGraficoData] = useState<GraficoVentasData[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingGrafico, setLoadingGrafico] = useState(true)
    
    // Controles del gráfico
    const [graficoTipo, setGraficoTipo] = useState<'dia' | 'mes'>('dia')
    const [graficoAño, setGraficoAño] = useState<number>(new Date().getFullYear())
    const [graficoMes, setGraficoMes] = useState<number>(new Date().getMonth() + 1)
    
    // Controles de estadísticas
    const [statsTipo, setStatsTipo] = useState<'dia' | 'mes' | 'año'>('mes')
    const [statsAño, setStatsAño] = useState<number>(new Date().getFullYear())
    const [statsMes, setStatsMes] = useState<number>(new Date().getMonth() + 1)
    const [statsDia, setStatsDia] = useState<number>(new Date().getDate())
    const [exporting, setExporting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    // Filtros y búsqueda
    const [search, setSearch] = useState("")
    const [tipoFilter, setTipoFilter] = useState<string>("Todos")
    
    // Búsqueda manual por ID
    const [searchId, setSearchId] = useState("")
    const [searchTipo, setSearchTipo] = useState<string>("refaccion") // Tipo por defecto para búsqueda
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    
    // Drawer state
    const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    
    // Refs para evitar múltiples llamadas en React Strict Mode
    const hasLoadedRef = useRef(false)
    const isLoadingStatsRef = useRef(false)
    const isLoadingGraficoRef = useRef(false)
    const lastFiltersRef = useRef({ tipoFilter: "Todos", search: "" })
    type StatsParams = { tipo: string; año: number; mes: number; dia: number }
    type GraficoParams = { tipo: string; año: number; mes?: number }
    const lastStatsParamsRef = useRef<StatsParams>({ tipo: 'mes', año: new Date().getFullYear(), mes: new Date().getMonth() + 1, dia: new Date().getDate() })
    const lastGraficoParamsRef = useRef<GraficoParams>({ tipo: 'dia', año: new Date().getFullYear(), mes: new Date().getMonth() + 1 })

    // Cargar datos iniciales solo una vez
    useEffect(() => {
        if (!hasLoadedRef.current) {
            hasLoadedRef.current = true
            loadData(1)
            loadEstadisticas()
            loadGrafico()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Recargar cuando cambien los filtros (con debounce implícito)
    useEffect(() => {
        if (!hasLoadedRef.current) return
        
        const currentFilters = { tipoFilter, search }
        const lastFilters = lastFiltersRef.current
        
        // Solo recargar si realmente cambiaron los filtros
        if (currentFilters.tipoFilter !== lastFilters.tipoFilter || currentFilters.search !== lastFilters.search) {
            lastFiltersRef.current = currentFilters
            setCurrentPage(1)
            loadData(1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tipoFilter, search])

    const loadEstadisticas = async () => {
        // Prevenir llamadas simultáneas
        if (isLoadingStatsRef.current) return
        
        const currentParams = {
            tipo: statsTipo,
            año: statsAño,
            mes: statsTipo !== 'año' ? statsMes : undefined,
            dia: statsTipo === 'dia' ? statsDia : undefined
        }
        
        // Solo cargar si los parámetros cambiaron
        const lastParams = lastStatsParamsRef.current
        if (
            currentParams.tipo === lastParams.tipo &&
            currentParams.año === lastParams.año &&
            currentParams.mes === lastParams.mes &&
            currentParams.dia === lastParams.dia
        ) {
            return
        }
        
        lastStatsParamsRef.current = currentParams as StatsParams
        isLoadingStatsRef.current = true
        
        try {
            const estadisticasData = await getEstadisticasVentas(
                currentParams.tipo,
                currentParams.año,
                currentParams.mes,
                currentParams.dia
            )
            setEstadisticas(estadisticasData)
        } catch (err) {
            console.error("Error al cargar estadísticas:", err)
        } finally {
            isLoadingStatsRef.current = false
        }
    }
    
    // Recargar estadísticas cuando cambien los controles
    useEffect(() => {
        if (!hasLoadedRef.current) return
        loadEstadisticas()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statsTipo, statsAño, statsMes, statsDia])

    const loadGrafico = async () => {
        // Prevenir llamadas simultáneas
        if (isLoadingGraficoRef.current) return
        
        const currentParams = {
            tipo: graficoTipo,
            año: graficoAño,
            mes: graficoTipo === 'dia' ? graficoMes : undefined
        }
        
        // Solo cargar si los parámetros cambiaron
        const lastParams = lastGraficoParamsRef.current
        if (
            currentParams.tipo === lastParams.tipo &&
            currentParams.año === lastParams.año &&
            currentParams.mes === lastParams.mes
        ) {
            return
        }
        
        lastGraficoParamsRef.current = currentParams as GraficoParams
        isLoadingGraficoRef.current = true
        setLoadingGrafico(true)
        
        try {
            const graficoResponse = await getGraficoVentas(
                currentParams.tipo,
                currentParams.año,
                currentParams.mes
            )
            setGraficoData(graficoResponse.datos)
        } catch (err) {
            console.error("Error al cargar datos del gráfico:", err)
        } finally {
            setLoadingGrafico(false)
            isLoadingGraficoRef.current = false
        }
    }
    
    // Recargar gráfico cuando cambien los controles
    useEffect(() => {
        if (!hasLoadedRef.current) return
        loadGrafico()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [graficoTipo, graficoAño, graficoMes])

    const loadData = async (page: number = 1) => {
        try {
            setLoading(true)
            setError(null)
            
            const ventasData = await getAllVentas(
                page,
                tipoFilter !== "Todos" ? tipoFilter : undefined,
                search.trim() || undefined
            )
            
            setVentas(ventasData.results)
            setTotalCount(ventasData.count)
            setTotalPages(Math.ceil(ventasData.count / 20))
            setCurrentPage(page)
        } catch (err) {
            console.error("Error al cargar ventas:", err)
            setError("Error al cargar las ventas. Por favor, intenta de nuevo.")
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (page: number) => {
        loadData(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleManualSearch = () => {
        if (!searchId.trim()) {
            return // No buscar si el ID está vacío
        }
        setTipoFilter(searchTipo)
        setSearch(searchId.trim())
        setCurrentPage(1)
        // La búsqueda se ejecutará automáticamente por el useEffect que escucha cambios en tipoFilter y search
    }

    const handleClearSearch = () => {
        setSearch("")
        setSearchId("")
        setTipoFilter("Todos")
        setCurrentPage(1)
    }

    const handleExportCSV = async () => {
        try {
            setExporting(true)
            const allVentas = await exportAllVentas(
                getAllVentas,
                tipoFilter !== "Todos" ? tipoFilter : undefined,
                search.trim() || undefined
            )
            exportToCSV(allVentas, `ventas_${new Date().toISOString().split('T')[0]}.csv`)
        } catch (err) {
            console.error("Error al exportar:", err)
            alert("Error al exportar las ventas. Por favor, intenta de nuevo.")
        } finally {
            setExporting(false)
        }
    }

    const handleExportExcel = async () => {
        try {
            setExporting(true)
            const allVentas = await exportAllVentas(
                getAllVentas,
                tipoFilter !== "Todos" ? tipoFilter : undefined,
                search.trim() || undefined
            )
            exportToExcel(allVentas, `ventas_${new Date().toISOString().split('T')[0]}.xlsx`)
        } catch (err) {
            console.error("Error al exportar:", err)
            alert("Error al exportar las ventas. Por favor, intenta de nuevo.")
        } finally {
            setExporting(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    Ventas
                </h1>
                <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Gestiona todas las ventas, servicios y devoluciones
                </p>
            </div>

            {/* Estadísticas */}
            <div className={`rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                {/* Controles de estadísticas */}
                <div className={`border-b p-4 ${dark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Período:
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setStatsTipo('dia')}
                                    variant={statsTipo === 'dia' ? 'primary' : 'outline'}
                                    size="sm"
                                    className={`cursor-pointer ${
                                        statsTipo === 'dia'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Día
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setStatsTipo('mes')}
                                    variant={statsTipo === 'mes' ? 'primary' : 'outline'}
                                    size="sm"
                                    className={`cursor-pointer ${
                                        statsTipo === 'mes'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Mes
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setStatsTipo('año')}
                                    variant={statsTipo === 'año' ? 'primary' : 'outline'}
                                    size="sm"
                                    className={`cursor-pointer ${
                                        statsTipo === 'año'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Año
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {statsTipo === 'dia' && (
                                <>
                                    <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Día:
                                    </label>
                                    <select
                                        value={statsDia}
                                        onChange={(e) => setStatsDia(Number(e.target.value))}
                                        className={`rounded-md border px-3 py-1.5 text-sm ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-slate-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                            <option key={d} value={d}>
                                                {d}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                            {statsTipo !== 'año' && (
                                <>
                                    <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Mes:
                                    </label>
                                    <select
                                        value={statsMes}
                                        onChange={(e) => setStatsMes(Number(e.target.value))}
                                        className={`rounded-md border px-3 py-1.5 text-sm ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-slate-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>
                                                {new Date(2000, m - 1).toLocaleDateString('es-MX', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                            <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Año:
                            </label>
                            <select
                                value={statsAño}
                                onChange={(e) => setStatsAño(Number(e.target.value))}
                                className={`rounded-md border px-3 py-1.5 text-sm ${
                                    dark
                                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((año) => (
                                    <option key={año} value={año}>
                                        {año}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                {estadisticas && (
                    <div className="p-4">
                        <VentasStats estadisticas={estadisticas} loading={loading} />
                    </div>
                )}
            </div>

            {/* Gráfico */}
            <div className={`rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                {/* Controles del gráfico */}
                <div className={`border-b p-4 ${dark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Vista:
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setGraficoTipo('dia')}
                                    variant={graficoTipo === 'dia' ? 'primary' : 'outline'}
                                    size="sm"
                                    className={`cursor-pointer ${
                                        graficoTipo === 'dia'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Por Día
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setGraficoTipo('mes')}
                                    variant={graficoTipo === 'mes' ? 'primary' : 'outline'}
                                    size="sm"
                                    className={`cursor-pointer ${
                                        graficoTipo === 'mes'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Por Mes
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {graficoTipo === 'dia' && (
                                <>
                                    <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Mes:
                                    </label>
                                    <select
                                        value={graficoMes}
                                        onChange={(e) => setGraficoMes(Number(e.target.value))}
                                        className={`rounded-md border px-3 py-1.5 text-sm ${
                                            dark
                                                ? 'bg-slate-800 border-slate-700 text-slate-200'
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                            <option key={m} value={m}>
                                                {new Date(2000, m - 1).toLocaleDateString('es-MX', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                            <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Año:
                            </label>
                            <select
                                value={graficoAño}
                                onChange={(e) => setGraficoAño(Number(e.target.value))}
                                className={`rounded-md border px-3 py-1.5 text-sm ${
                                    dark
                                        ? 'bg-slate-800 border-slate-700 text-slate-200'
                                        : 'bg-white border-gray-300 text-gray-900'
                                }`}
                            >
                                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((año) => (
                                    <option key={año} value={año}>
                                        {año}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <VentasChart data={graficoData} loading={loadingGrafico} tipo={graficoTipo} />
            </div>

            {/* Filtros y búsqueda */}
            <div className={`rounded-xl border p-4 ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    {/* Filtros por tipo */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setTipoFilter("Todos")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                tipoFilter === "Todos"
                                    ? dark
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-600 text-white"
                                    : dark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setTipoFilter("refaccion")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                tipoFilter === "refaccion"
                                    ? dark
                                        ? "bg-green-600 text-white"
                                        : "bg-green-600 text-white"
                                    : dark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Refacciones
                        </button>
                        <button
                            onClick={() => setTipoFilter("servicio")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                tipoFilter === "servicio"
                                    ? dark
                                        ? "bg-blue-600 text-white"
                                        : "bg-blue-600 text-white"
                                    : dark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Servicios
                        </button>
                        <button
                            onClick={() => setTipoFilter("devolucion")}
                            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                                tipoFilter === "devolucion"
                                    ? dark
                                        ? "bg-red-600 text-white"
                                        : "bg-red-600 text-white"
                                    : dark
                                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            Devoluciones
                        </button>
                    </div>

                    {/* Búsqueda por ID */}
                    <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                        <div className="mb-2">
                            <label className={`text-sm font-medium ${dark ? 'text-slate-300' : 'text-gray-700'}`}>
                                Buscar por ID
                            </label>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            {/* Input de ID */}
                            <div className="flex-1">
                                <Input
                                    type="number"
                                    placeholder="Ingresa el ID de la venta"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleManualSearch()
                                        }
                                    }}
                                    className={dark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-gray-300 text-gray-900'}
                                    dark={dark}
                                />
                            </div>
                            
                            {/* Botones de tipo */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => setSearchTipo('refaccion')}
                                    variant={searchTipo === 'refaccion' ? 'primary' : 'outline'}
                                    className={`cursor-pointer ${
                                        searchTipo === 'refaccion'
                                            ? dark ? 'bg-green-600 text-white' : 'bg-green-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Refacción
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setSearchTipo('servicio')}
                                    variant={searchTipo === 'servicio' ? 'primary' : 'outline'}
                                    className={`cursor-pointer ${
                                        searchTipo === 'servicio'
                                            ? dark ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Servicio
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => setSearchTipo('devolucion')}
                                    variant={searchTipo === 'devolucion' ? 'primary' : 'outline'}
                                    className={`cursor-pointer ${
                                        searchTipo === 'devolucion'
                                            ? dark ? 'bg-red-600 text-white' : 'bg-red-600 text-white'
                                            : dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'
                                    }`}
                                >
                                    Devolución
                                </Button>
                            </div>
                            
                            {/* Botón Buscar */}
                            <Button
                                type="button"
                                onClick={handleManualSearch}
                                disabled={!searchId.trim()}
                                className={`cursor-pointer ${dark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Buscar
                            </Button>
                            
                            {/* Botón Limpiar (solo si hay búsqueda activa) */}
                            {search && (
                                <Button
                                    type="button"
                                    onClick={handleClearSearch}
                                    variant="outline"
                                    className={`cursor-pointer ${dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}`}
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </Button>
                            )}
                        </div>
                        
                        {/* Mostrar búsqueda activa */}
                        {search && (
                            <div className={`mt-3 flex items-center gap-2 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                <span>Buscando ID: <span className="font-mono font-medium">{search}</span> en <span className="font-medium">{tipoFilter === 'refaccion' ? 'Refacciones' : tipoFilter === 'servicio' ? 'Servicios' : 'Devoluciones'}</span></span>
                            </div>
                        )}
                    </div>

                    {/* Botones de exportación */}
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={handleExportCSV}
                            disabled={exporting}
                            variant="outline"
                            className={`cursor-pointer ${dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}`}
                        >
                            <Download className={`mr-2 h-4 w-4 ${dark ? 'text-slate-300' : 'text-gray-700'}`} />
                            {exporting ? 'Exportando...' : 'CSV'}
                        </Button>
                        <Button
                            onClick={handleExportExcel}
                            disabled={exporting}
                            variant="outline"
                            className={`cursor-pointer ${dark ? 'border-slate-700 text-slate-300' : 'border-gray-300 text-gray-700'}`}
                        >
                            <FileSpreadsheet className={`mr-2 h-4 w-4 ${dark ? 'text-slate-300' : 'text-gray-700'}`} />
                            {exporting ? 'Exportando...' : 'Excel'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className={`rounded-lg border p-4 ${
                    dark ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'
                }`}>
                    <p className={dark ? 'text-red-400' : 'text-red-600'}>{error}</p>
                </div>
            )}

            {/* Tabla de ventas */}
            <div className={`rounded-xl border ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <VentasTable 
                    ventas={ventas} 
                    loading={loading}
                    onView={(venta) => {
                        setSelectedVenta(venta)
                        setDrawerOpen(true)
                    }}
                />
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    count={totalCount}
                    pageSize={20}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Drawer */}
            <VentaDrawer
                venta={selectedVenta}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                    setSelectedVenta(null)
                }}
            />
        </div>
    )
}

