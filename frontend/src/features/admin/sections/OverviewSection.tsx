"use client"

import React, { useMemo, useState, useEffect, useRef } from "react"
import {
    LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis,
    CartesianGrid, Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { formatCurrency, formatDate } from "@/features/admin/utils/format"
import {
    DollarSign, Store, Wrench, RotateCcw,
    ShoppingCart, Package, Clock, AlertTriangle,
    ArrowRight,
} from "lucide-react"
import { Card } from "@/features/admin/ui/Card"
import { Button } from "@/features/admin/ui/Button"
import { EmptyState } from "@/features/admin/sections/common/EmptyState"
import { getGraficoVentas, type EstadisticasVentas, type GraficoVentasData } from "@/features/admin/ventas-api"
import type { PedidosStats, Pedido } from "@/features/orders/api"
import type { ServiciosEstadisticas } from "@/features/services/api"
import type { Refaccion } from "@/features/catalog/api"

// ── Helpers ───────────────────────────────────────────────────────────────────

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const fmtCurrencyCompact = (v: number) => {
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
    if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`
    return `$${v}`
}

// Extrae "YYYY-MM-DD" desde cualquier formato ISO (con o sin timezone offset)
const extractDateKey = (d: GraficoVentasData): string => {
    for (const raw of [d.fecha, d.mes]) {
        if (!raw || typeof raw !== 'string') continue
        const key = raw.substring(0, 10)
        if (/^\d{4}-\d{2}-\d{2}$/.test(key)) return key
    }
    return ''
}

// Formatea "YYYY-MM-DD" a "27 Feb"
const fmtDateLabel = (dateStr: string): string => {
    const d = new Date(dateStr + 'T12:00:00')
    return `${d.getDate()} ${MESES[d.getMonth()]}`
}

// ── Estado maps ───────────────────────────────────────────────────────────────

const ESTADO_STYLES: Record<string, { dark: string; light: string }> = {
    CRE: { dark: "bg-slate-500/15 text-slate-300", light: "bg-slate-100 text-slate-700" },
    PAG: { dark: "bg-emerald-500/15 text-emerald-400", light: "bg-emerald-50 text-emerald-700" },
    ENV: { dark: "bg-blue-500/15 text-blue-400", light: "bg-blue-50 text-blue-700" },
    ENT: { dark: "bg-violet-500/15 text-violet-400", light: "bg-violet-50 text-violet-700" },
    CAN: { dark: "bg-red-500/15 text-red-400", light: "bg-red-50 text-red-700" },
}

const ESTADO_LABELS: Record<string, string> = {
    CRE: "Creado",
    PAG: "Pagado",
    ENV: "Enviado",
    ENT: "Entregado",
    CAN: "Cancelado",
}

const DONUT_COLORS: Record<string, string> = {
    CRE: "#64748B",
    PAG: "#10B981",
    ENV: "#3B82F6",
    ENT: "#8B5CF6",
    CAN: "#EF4444",
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
    estadisticasVentas: EstadisticasVentas | null
    grafico: GraficoVentasData[]
    pedidosStats: PedidosStats | null
    pedidos: Pedido[]
    pedidosCount: number
    serviciosEstadisticas: ServiciosEstadisticas | null
    refacciones: Refaccion[]
}

// ── KpiCard ───────────────────────────────────────────────────────────────────

interface KpiCardProps {
    label: string
    value: string | number
    sub?: string
    icon: React.ElementType
    iconBg: string
    numberColor: string
    dark: boolean
}

function KpiCard({ label, value, sub, icon: Icon, iconBg, numberColor, dark }: KpiCardProps) {
    return (
        <div className={`rounded-xl border p-5 flex flex-col gap-3 min-h-[110px] ${
            dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
        }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon className="h-4 w-4 text-white" />
            </div>
            <div className={`text-3xl font-bold tracking-tight ${numberColor}`}>{value}</div>
            <div>
                <p className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{label}</p>
                {sub && <p className={`text-xs ${dark ? 'text-slate-600' : 'text-gray-400'}`}>{sub}</p>}
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function OverviewSection({
    estadisticasVentas,
    grafico,
    pedidosStats,
    pedidos,
    serviciosEstadisticas,
    refacciones,
}: Props) {
    const { dark } = useAdminTheme()

    // ── Chart state — rango de fechas personalizable ───────────────────────────

    const todayStr = useMemo(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    }, [])

    const [dateFrom, setDateFrom] = useState(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
    })
    const [dateTo, setDateTo] = useState(() => {
        const d = new Date()
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })
    const [chartData, setChartData] = useState<GraficoVentasData[]>(grafico)
    const [chartLoading, setChartLoading] = useState(false)
    const isFirstRender = useRef(true)

    useEffect(() => {
        // En el primer render usar datos SSR si existen
        if (isFirstRender.current) {
            isFirstRender.current = false
            if (grafico.length > 0) return
        }
        const from = new Date(dateFrom + 'T12:00:00')
        const to = new Date(dateTo + 'T12:00:00')
        if (from > to) return

        // Recolectar todos los año/mes involucrados en el rango
        const months: { year: number; month: number }[] = []
        const cursor = new Date(from.getFullYear(), from.getMonth(), 1)
        const endMonth = new Date(to.getFullYear(), to.getMonth(), 1)
        while (cursor <= endMonth) {
            months.push({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 })
            cursor.setMonth(cursor.getMonth() + 1)
        }

        let cancelled = false
        setChartLoading(true)
        Promise.all(
            months.map(({ year, month }) =>
                getGraficoVentas('dia', year, month).catch(() => ({ datos: [] as GraficoVentasData[], tipo: 'dia', año: year }))
            )
        )
            .then(results => { if (!cancelled) setChartData(results.flatMap(r => r.datos ?? [])) })
            .catch(() => {})
            .finally(() => { if (!cancelled) setChartLoading(false) })
        return () => { cancelled = true }
    }, [dateFrom, dateTo])

    // Theme helpers
    const gridColor   = dark ? '#1e293b' : '#e5e7eb'
    const textColor   = dark ? '#94a3b8' : '#6b7280'
    const legendColor = dark ? '#cbd5e1' : '#4b5563'

    const tooltipStyle = {
        contentStyle: {
            background: dark ? '#1e293b' : '#ffffff',
            border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
            borderRadius: '6px',
            fontSize: '12px',
            color: dark ? '#f1f5f9' : '#374151',
        },
        itemStyle: { color: dark ? '#f1f5f9' : '#374151' },
        labelStyle: { color: textColor, fontWeight: 600 as const },
    }

    // ── Computed values ────────────────────────────────────────────────────────

    const ref = estadisticasVentas?.ventas_refacciones
    const svc = estadisticasVentas?.ventas_servicios
    const dev = estadisticasVentas?.devoluciones

    const ingresosMes   = (ref?.total ?? 0) + (svc?.total ?? 0)
    const refVendidas   = ref?.cantidad ?? 0
    const svcFacturados = svc?.cantidad ?? 0
    const devTotal      = dev?.total ?? 0

    const totalPedidos    = pedidosStats?.total ?? 0
    const pedidosActivos  = (pedidosStats?.por_estado?.CRE ?? 0) + (pedidosStats?.por_estado?.PAG ?? 0)
    const svcPendientes   = serviciosEstadisticas?.pendientes ?? 0

    const sinStock = useMemo(() => refacciones.filter(r => r.existencias === 0), [refacciones])
    const stockBajo = useMemo(() => refacciones.filter(r => r.existencias <= 3 && r.existencias > 0), [refacciones])
    const ultimosPedidos = useMemo(() => pedidos.slice(0, 5), [pedidos])

    // ── Chart data — rango completo dateFrom → dateTo, 0 en días sin ventas ─────

    const areaData = useMemo(() => {
        const from = new Date(dateFrom + 'T12:00:00')
        const to   = new Date(dateTo   + 'T12:00:00')
        if (from > to) return []

        // Lookup por "YYYY-MM-DD"
        const byDate: Record<string, { refacciones: number; servicios: number }> = {}
        for (const d of chartData) {
            const key = extractDateKey(d)
            if (key) {
                byDate[key] = {
                    refacciones: d.ventas_refacciones ?? 0,
                    servicios:   d.ventas_servicios   ?? 0,
                }
            }
        }

        // Generar todos los días del rango
        const result: { _idx: number; _label: string; refacciones: number; servicios: number }[] = []
        const cursor = new Date(from)
        let idx = 0
        while (cursor <= to) {
            const y = cursor.getFullYear()
            const m = String(cursor.getMonth() + 1).padStart(2, '0')
            const day = String(cursor.getDate()).padStart(2, '0')
            const key = `${y}-${m}-${day}`
            result.push({
                _idx:        idx,
                _label:      fmtDateLabel(key),
                refacciones: byDate[key]?.refacciones ?? 0,
                servicios:   byDate[key]?.servicios   ?? 0,
            })
            cursor.setDate(cursor.getDate() + 1)
            idx++
        }
        return result
    }, [chartData, dateFrom, dateTo])

    // Ticks inteligentes: ~10 etiquetas sin importar el rango
    const xTicks = useMemo(() => {
        const n = areaData.length
        if (n === 0) return []
        const step = n <= 10 ? 1 : n <= 20 ? 2 : n <= 62 ? 7 : 14
        const ticks = areaData.filter(d => d._idx % step === 0).map(d => d._idx)
        if (n > 1 && (n - 1) % step !== 0) ticks.push(n - 1)
        return ticks
    }, [areaData])

    const xTickFormatter = (idx: number) => areaData[idx]?._label ?? ''

    // ── Donut data ─────────────────────────────────────────────────────────────

    const donutData = useMemo(() => {
        if (!pedidosStats?.por_estado) return []
        return Object.entries(pedidosStats.por_estado)
            .filter(([, v]) => v > 0)
            .map(([key, value]) => ({
                name: ESTADO_LABELS[key] ?? key,
                value,
                color: DONUT_COLORS[key] ?? '#64748B',
            }))
    }, [pedidosStats])

    // ── KPI rows ───────────────────────────────────────────────────────────────

    const kpisRow1 = [
        {
            label: 'Ingresos del Mes',
            value: formatCurrency(ingresosMes),
            sub: 'refacciones + servicios',
            icon: DollarSign,
            iconBg: 'bg-emerald-500',
            numberColor: dark ? 'text-emerald-300' : 'text-emerald-700',
        },
        {
            label: 'Refacciones Vendidas',
            value: refVendidas,
            sub: 'este mes',
            icon: Store,
            iconBg: 'bg-blue-500',
            numberColor: dark ? 'text-blue-300' : 'text-blue-700',
        },
        {
            label: 'Servicios Facturados',
            value: svcFacturados,
            sub: 'este mes',
            icon: Wrench,
            iconBg: 'bg-violet-500',
            numberColor: dark ? 'text-violet-300' : 'text-violet-700',
        },
        {
            label: 'Devoluciones',
            value: formatCurrency(devTotal),
            sub: 'este mes',
            icon: RotateCcw,
            iconBg: 'bg-red-500',
            numberColor: dark ? 'text-red-300' : 'text-red-700',
        },
    ]

    const kpisRow2 = [
        {
            label: 'Total Pedidos',
            value: totalPedidos,
            sub: 'todos los tiempos',
            icon: ShoppingCart,
            iconBg: 'bg-slate-500',
            numberColor: dark ? 'text-slate-100' : 'text-gray-900',
        },
        {
            label: 'Pedidos Activos',
            value: pedidosActivos,
            sub: 'creados + pagados',
            icon: Package,
            iconBg: 'bg-amber-500',
            numberColor: dark ? 'text-amber-300' : 'text-amber-700',
        },
        {
            label: 'Servicios Pendientes',
            value: svcPendientes,
            sub: 'en cola',
            icon: Clock,
            iconBg: 'bg-orange-500',
            numberColor: dark ? 'text-orange-300' : 'text-orange-700',
        },
        {
            label: 'Sin Stock',
            value: sinStock.length,
            sub: `${stockBajo.length} con stock bajo`,
            icon: AlertTriangle,
            iconBg: 'bg-rose-500',
            numberColor: dark ? 'text-rose-300' : 'text-rose-700',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className={`text-xl font-bold tracking-tight ${dark ? 'text-slate-50' : 'text-slate-900'}`}>
                    Dashboard
                </h1>
                <p className={`mt-0.5 text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Resumen general de tu negocio
                </p>
            </div>

            {/* KPIs Row 1 — Ventas */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {kpisRow1.map((k, i) => (
                    <KpiCard key={i} {...k} dark={dark} />
                ))}
            </div>

            {/* KPIs Row 2 — Operaciones */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {kpisRow2.map((k, i) => (
                    <KpiCard key={i} {...k} dark={dark} />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {/* AreaChart — Ventas del mes por día */}
                <div className={`relative overflow-hidden rounded-xl border p-5 xl:col-span-2 ${
                    dark ? 'border-slate-700/60 bg-slate-900' : 'border-gray-200 bg-white'
                }`}>
                    {/* Ambient glow behind chart */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-30"
                        style={{
                            background: dark
                                ? 'radial-gradient(ellipse 80% 60% at 30% 100%, #3B82F640, transparent), radial-gradient(ellipse 60% 50% at 70% 100%, #8B5CF630, transparent)'
                                : 'radial-gradient(ellipse 80% 60% at 30% 100%, #3B82F618, transparent), radial-gradient(ellipse 60% 50% at 70% 100%, #8B5CF614, transparent)',
                        }}
                    />

                    {/* Header */}
                    <div className="relative mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h3 className={`text-sm font-semibold tracking-tight ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                                Ventas por Día
                            </h3>
                            <p className={`mt-0.5 text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                {fmtDateLabel(dateFrom)} — {fmtDateLabel(dateTo)}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Leyenda */}
                            <span className="flex items-center gap-1.5 mr-1">
                                <span className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className={`text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Refacciones</span>
                            </span>
                            <span className="flex items-center gap-1.5 mr-2">
                                <span className="h-2 w-2 rounded-full bg-violet-500" />
                                <span className={`text-[11px] font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Servicios</span>
                            </span>
                            {/* Selector de rango */}
                            <input
                                type="date"
                                value={dateFrom}
                                max={dateTo}
                                onChange={e => e.target.value && setDateFrom(e.target.value)}
                                className={`rounded-md border px-2 py-1 text-xs outline-none transition-colors ${
                                    dark
                                        ? 'border-slate-700 bg-slate-800 text-slate-300 focus:border-slate-500'
                                        : 'border-gray-200 bg-white text-gray-700 focus:border-gray-400'
                                }`}
                            />
                            <span className={`text-xs ${dark ? 'text-slate-600' : 'text-gray-300'}`}>→</span>
                            <input
                                type="date"
                                value={dateTo}
                                min={dateFrom}
                                max={todayStr}
                                onChange={e => e.target.value && setDateTo(e.target.value)}
                                className={`rounded-md border px-2 py-1 text-xs outline-none transition-colors ${
                                    dark
                                        ? 'border-slate-700 bg-slate-800 text-slate-300 focus:border-slate-500'
                                        : 'border-gray-200 bg-white text-gray-700 focus:border-gray-400'
                                }`}
                            />
                        </div>
                    </div>

                    {chartLoading ? (
                        <div className="flex h-[210px] items-center justify-center">
                            <div className={`h-6 w-6 animate-spin rounded-full border-2 ${
                                dark ? 'border-slate-700 border-t-blue-400' : 'border-slate-200 border-t-blue-500'
                            }`} />
                        </div>
                    ) : areaData.length === 0 ? (
                        <div className={`flex h-[210px] items-center justify-center text-sm ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                            Sin datos para este período
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={210}>
                            <LineChart
                                data={areaData}
                                margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke={dark ? '#334155' : '#e2e8f0'}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="_idx"
                                    type="number"
                                    domain={[0, Math.max(areaData.length - 1, 0)]}
                                    ticks={xTicks}
                                    tickFormatter={xTickFormatter}
                                    tick={{ fontSize: 11, fill: textColor }}
                                    axisLine={{ stroke: dark ? '#334155' : '#e2e8f0' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={fmtCurrencyCompact}
                                    tick={{ fontSize: 10, fill: textColor }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={48}
                                />
                                <Tooltip
                                    cursor={{ stroke: dark ? '#475569' : '#cbd5e1', strokeWidth: 1 }}
                                    content={({ active, payload }) => {
                                        if (!active || !payload?.length) return null
                                        const idx = payload[0]?.payload?._idx as number
                                        const xLabel = xTickFormatter(idx)
                                        const refVal = payload.find(p => p.dataKey === 'refacciones')
                                        const svcVal = payload.find(p => p.dataKey === 'servicios')
                                        return (
                                            <div style={{
                                                background: dark ? '#1e293b' : '#ffffff',
                                                border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
                                                borderRadius: 8,
                                                padding: '10px 14px',
                                                fontSize: 12,
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                                minWidth: 170,
                                            }}>
                                                <p style={{
                                                    fontWeight: 700,
                                                    marginBottom: 8,
                                                    fontSize: 11,
                                                    color: dark ? '#64748b' : '#94a3b8',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                }}>
                                                    {xLabel}
                                                </p>
                                                {refVal && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 4 }}>
                                                        <span style={{ color: dark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <span style={{ width: 8, height: 2, background: '#3B82F6', display: 'inline-block', borderRadius: 2 }} />
                                                            Refacciones
                                                        </span>
                                                        <strong style={{ color: '#3B82F6' }}>{formatCurrency(Number(refVal.value))}</strong>
                                                    </div>
                                                )}
                                                {svcVal && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20 }}>
                                                        <span style={{ color: dark ? '#94a3b8' : '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                                                            <span style={{ width: 8, height: 2, background: '#8B5CF6', display: 'inline-block', borderRadius: 2 }} />
                                                            Servicios
                                                        </span>
                                                        <strong style={{ color: '#8B5CF6' }}>{formatCurrency(Number(svcVal.value))}</strong>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="refacciones"
                                    name="Refacciones"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={(props: { cx: number; cy: number; payload: { refacciones: number } }) =>
                                        props.payload.refacciones > 0
                                            ? <circle key={`ref-${props.cx}`} cx={props.cx} cy={props.cy} r={3} fill="#3B82F6" stroke={dark ? '#0f172a' : '#fff'} strokeWidth={1.5} />
                                            : <circle key={`ref0-${props.cx}`} cx={props.cx} cy={props.cy} r={2} fill="none" stroke="#3B82F6" strokeWidth={1} opacity={0.4} />
                                    }
                                    activeDot={{ r: 5, fill: '#3B82F6', stroke: dark ? '#0f172a' : '#fff', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="servicios"
                                    name="Servicios"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    dot={(props: { cx: number; cy: number; payload: { servicios: number } }) =>
                                        props.payload.servicios > 0
                                            ? <circle key={`svc-${props.cx}`} cx={props.cx} cy={props.cy} r={3} fill="#8B5CF6" stroke={dark ? '#0f172a' : '#fff'} strokeWidth={1.5} />
                                            : <circle key={`svc0-${props.cx}`} cx={props.cx} cy={props.cy} r={2} fill="none" stroke="#8B5CF6" strokeWidth={1} opacity={0.4} />
                                    }
                                    activeDot={{ r: 5, fill: '#8B5CF6', stroke: dark ? '#0f172a' : '#fff', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Donut — Pedidos por Estado */}
                <div className={`rounded-xl border p-5 ${
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                }`}>
                    <div className="mb-4">
                        <h3 className={`text-sm font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                            Pedidos por Estado
                        </h3>
                        <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Distribución actual
                        </p>
                    </div>
                    {donutData.length === 0 ? (
                        <div className={`flex h-44 items-center justify-center text-sm ${
                            dark ? 'text-slate-500' : 'text-gray-400'
                        }`}>
                            Sin datos
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={donutData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={48}
                                    outerRadius={74}
                                    paddingAngle={3}
                                    dataKey="value"
                                    strokeWidth={0}
                                >
                                    {donutData.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    {...tooltipStyle}
                                    formatter={(v: number, name: string) => [v, name]}
                                />
                                <Legend
                                    formatter={(value) => (
                                        <span style={{ color: legendColor, fontSize: 11 }}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Lists Row */}
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {/* Pedidos Recientes */}
                <Card
                    title="Pedidos recientes"
                    description={`${pedidosActivos} pendiente${pedidosActivos !== 1 ? 's' : ''}`}
                    right={
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1 ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => window.location.assign('/admin/pedidos')}
                        >
                            Ver todos <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    }
                    className="xl:col-span-2"
                >
                    {ultimosPedidos.length === 0 ? (
                        <EmptyState
                            icon={<ShoppingCart className="h-6 w-6" />}
                            title="Sin pedidos"
                            description="Los pedidos nuevos aparecerán aquí"
                        />
                    ) : (
                        <div className="space-y-0.5">
                            {ultimosPedidos.map((pedido) => {
                                const estilo = ESTADO_STYLES[pedido.estado] ?? ESTADO_STYLES.CRE
                                return (
                                    <div
                                        key={pedido.id}
                                        className={`flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors ${
                                            dark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-medium tabular-nums ${dark ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    #{pedido.id}
                                                </span>
                                                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${dark ? estilo.dark : estilo.light}`}>
                                                    {ESTADO_LABELS[pedido.estado] ?? pedido.estado}
                                                </span>
                                            </div>
                                            <p className={`mt-0.5 text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                {pedido.usuario_nombre || pedido.usuario_email}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-semibold tabular-nums ${dark ? 'text-slate-100' : 'text-slate-900'}`}>
                                                {formatCurrency(Number(pedido.total))}
                                            </p>
                                            <p className={`mt-0.5 flex items-center justify-end gap-1 text-[11px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
                                                <Clock className="h-3 w-3" />
                                                {formatDate(pedido.fecha_creacion)}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </Card>

                {/* Alertas de Stock */}
                <Card
                    title="Alertas de stock"
                    description={`${stockBajo.length + sinStock.length} producto${stockBajo.length + sinStock.length !== 1 ? 's' : ''}`}
                    right={
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1 ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => window.location.assign('/admin/inventario')}
                        >
                            Inventario <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                    }
                >
                    {stockBajo.length === 0 && sinStock.length === 0 ? (
                        <EmptyState
                            icon={<Package className="h-6 w-6" />}
                            title="Stock saludable"
                            description="Todos los productos tienen stock suficiente"
                        />
                    ) : (
                        <div className="space-y-0.5">
                            {sinStock.slice(0, 3).map((r) => (
                                <div
                                    key={r.id}
                                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
                                        dark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${dark ? 'bg-red-500/15' : 'bg-red-50'}`}>
                                        <AlertTriangle className={`h-3.5 w-3.5 ${dark ? 'text-red-400' : 'text-red-600'}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`truncate text-sm ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{r.nombre}</p>
                                        <p className={`text-[11px] ${dark ? 'text-red-400' : 'text-red-600'}`}>Sin stock</p>
                                    </div>
                                </div>
                            ))}
                            {stockBajo.slice(0, 3).map((r) => (
                                <div
                                    key={r.id}
                                    className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${
                                        dark ? 'hover:bg-slate-700/30' : 'hover:bg-slate-50'
                                    }`}
                                >
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${dark ? 'bg-amber-500/15' : 'bg-amber-50'}`}>
                                        <AlertTriangle className={`h-3.5 w-3.5 ${dark ? 'text-amber-400' : 'text-amber-600'}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className={`truncate text-sm ${dark ? 'text-slate-200' : 'text-slate-800'}`}>{r.nombre}</p>
                                        <p className={`text-[11px] ${dark ? 'text-amber-400' : 'text-amber-600'}`}>
                                            {r.existencias} unidad{r.existencias !== 1 ? 'es' : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
