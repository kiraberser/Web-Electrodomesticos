"use client"

import { useState, useMemo } from "react"
import {
    ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { GraficoVentasData } from "@/features/admin/ventas-api"
import { TrendingUp } from "lucide-react"

interface VentasChartProps {
    data: GraficoVentasData[]
    loading?: boolean
    tipo?: 'dia' | 'mes'
}

type ChartView = 'donut' | 'column' | 'radar'

const PALETTE = ['#10B981', '#3B82F6', '#EF4444']

const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(v)

const TABS: { key: ChartView; label: string }[] = [
    { key: 'donut', label: 'Distribución' },
    { key: 'column', label: 'Histograma' },
    { key: 'radar', label: 'Radar' },
]

const CHART_META: Record<ChartView, { title: string; desc: (tipo: string) => string }> = {
    donut: {
        title: 'Distribución de Ingresos',
        desc: (tipo) => `Proporción de ventas por categoría en el ${tipo === 'dia' ? 'mes' : 'año'} seleccionado`,
    },
    column: {
        title: 'Ventas por Período',
        desc: (tipo) => tipo === 'dia' ? 'Comparativo diario de Refacciones, Servicios y Devoluciones' : 'Comparativo mensual de Refacciones, Servicios y Devoluciones',
    },
    radar: {
        title: 'Rendimiento Relativo',
        desc: () => 'Período actual vs período anterior — índice normalizado por categoría',
    },
}

// ── Date formatter for X axis ─────────────────────────────────────────────────
const formatXLabel = (val: string, tipo: 'dia' | 'mes'): string => {
    if (!val) return val
    try {
        // Remove timezone offset to avoid day shifting: "2026-01-15T00:00:00-06:00" → "2026-01-15"
        const datePart = val.includes('T') ? val.split('T')[0] : val

        // Month-only: "2026-01" → "ene '26"
        if (/^\d{4}-\d{2}$/.test(datePart)) {
            const [y, m] = datePart.split('-').map(Number)
            return new Date(y, m - 1, 1)
                .toLocaleDateString('es-MX', { month: 'short', year: '2-digit' })
                .replace(/\./g, '')
        }

        // Full date: "2026-01-15" → día view "15 ene" | mes view "ene '26"
        if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
            const [y, m, d] = datePart.split('-').map(Number)
            const date = new Date(y, m - 1, d)
            if (tipo === 'mes') {
                return date.toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }).replace(/\./g, '')
            }
            return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace(/\./g, '')
        }

        return val
    } catch {
        return val
    }
}

export default function VentasChart({ data, loading = false, tipo = 'dia' }: VentasChartProps) {
    const { dark } = useAdminTheme()
    const [view, setView] = useState<ChartView>('donut')
    const [activeBarKey, setActiveBarKey] = useState<string | null>(null)

    const gridColor   = dark ? '#1e293b' : '#e5e7eb'
    const textColor   = dark ? '#94a3b8' : '#6b7280'
    const legendColor = dark ? '#cbd5e1' : '#4b5563'

    const tooltipProps = {
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

    // ── Donut: aggregate totals from all periods ──────────────────────────────
    const donutData = useMemo(() => {
        const r  = data.reduce((s, d) => s + (d.ventas_refacciones || 0), 0)
        const sv = data.reduce((s, d) => s + (d.ventas_servicios   || 0), 0)
        const dv = data.reduce((s, d) => s + (d.devoluciones        || 0), 0)
        return [
            { name: 'Refacciones', value: r  },
            { name: 'Servicios',   value: sv },
            { name: 'Devoluciones',value: dv },
        ]
    }, [data])

    // ── Column: format date labels for X axis ────────────────────────────────
    const columnData = useMemo(() =>
        data.map(d => ({ ...d, label: formatXLabel(d.mes ?? d.fecha ?? '', tipo) })),
    [data, tipo])

    // ── Radar: last 2 periods, per-metric normalized to 0-100 ─────────────────
    const radarData = useMemo(() => {
        if (data.length === 0) return []
        const last = data[data.length - 1]
        const prev = data.length >= 2 ? data[data.length - 2] : null

        const norm = (a: number, b: number) => {
            const mx = Math.max(a, b, 1)
            return { actual: Math.round((a / mx) * 100), anterior: Math.round((b / mx) * 100) }
        }

        return [
            { metric: 'Refacciones', ...norm(last.ventas_refacciones, prev?.ventas_refacciones ?? 0) },
            { metric: 'Servicios',   ...norm(last.ventas_servicios,   prev?.ventas_servicios   ?? 0) },
            { metric: 'Devoluciones',...norm(last.devoluciones,        prev?.devoluciones        ?? 0) },
            { metric: 'Total',       ...norm(last.total,               prev?.total               ?? 0) },
        ]
    }, [data])

    const xInterval = data.length > 20 ? 4 : 0
    const meta = CHART_META[view]

    // ── Shared legend formatter ───────────────────────────────────────────────
    const legendFormatter = (value: string) => (
        <span style={{ color: legendColor, fontSize: 12 }}>{value}</span>
    )

    if (loading) {
        return (
            <div className={`rounded-xl border p-6 ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="flex h-72 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className={`mt-3 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            Cargando gráfico...
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className={`rounded-xl border p-6 ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="flex h-72 items-center justify-center">
                    <div className="text-center">
                        <TrendingUp className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            No hay datos para mostrar
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`rounded-xl border p-6 ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                    <h3 className={`text-base font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                        {meta.title}
                    </h3>
                    <p className={`mt-0.5 text-xs ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {meta.desc(tipo)}
                    </p>
                </div>

                {/* View toggle */}
                <div className={`flex rounded-lg p-0.5 text-xs font-medium shrink-0 ${dark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                    {TABS.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setView(key)}
                            className={`px-3 py-1.5 rounded-md transition-colors ${
                                view === key
                                    ? dark
                                        ? 'bg-slate-700 text-slate-100'
                                        : 'bg-white text-gray-900 shadow-sm'
                                    : dark
                                        ? 'text-slate-400 hover:text-slate-200'
                                        : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Donut ──────────────────────────────────────────────────────── */}
            {view === 'donut' && (
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={72}
                            outerRadius={112}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {donutData.map((_, i) => (
                                <Cell key={i} fill={PALETTE[i]} />
                            ))}
                        </Pie>
                        <Tooltip
                            {...tooltipProps}
                            formatter={(value: number) => [formatCurrency(value), '']}
                        />
                        <Legend formatter={legendFormatter} />
                    </PieChart>
                </ResponsiveContainer>
            )}

            {/* ── Column / Histograma ────────────────────────────────────────── */}
            {view === 'column' && (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                        data={columnData}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                        barCategoryGap="12%"
                        barGap={2}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: textColor }}
                            axisLine={{ stroke: gridColor }}
                            tickLine={false}
                            interval={xInterval}
                        />
                        <YAxis
                            tickFormatter={formatCurrency}
                            tick={{ fontSize: 10, fill: textColor }}
                            axisLine={false}
                            tickLine={false}
                            width={72}
                        />
                        {/* Tooltip: muestra únicamente la barra sobre la que está el cursor */}
                        <Tooltip
                            cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null
                                const entry = activeBarKey
                                    ? (payload.find(p => p.dataKey === activeBarKey) ?? payload[0])
                                    : payload[0]
                                if (!entry) return null
                                return (
                                    <div style={{
                                        background: dark ? '#1e293b' : '#ffffff',
                                        border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                        fontSize: 12,
                                    }}>
                                        <p style={{ color: textColor, fontWeight: 600, marginBottom: 4 }}>{label}</p>
                                        <p style={{ color: entry.color as string }}>
                                            {entry.name}:{' '}
                                            <strong style={{ color: dark ? '#f1f5f9' : '#111827' }}>
                                                {formatCurrency(entry.value as number)}
                                            </strong>
                                        </p>
                                    </div>
                                )
                            }}
                        />
                        <Legend formatter={legendFormatter} />
                        <Bar
                            dataKey="ventas_refacciones"
                            name="Refacciones"
                            fill={PALETTE[0]}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={56}
                            onMouseEnter={() => setActiveBarKey('ventas_refacciones')}
                            onMouseLeave={() => setActiveBarKey(null)}
                        />
                        <Bar
                            dataKey="ventas_servicios"
                            name="Servicios"
                            fill={PALETTE[1]}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={56}
                            onMouseEnter={() => setActiveBarKey('ventas_servicios')}
                            onMouseLeave={() => setActiveBarKey(null)}
                        />
                        <Bar
                            dataKey="devoluciones"
                            name="Devoluciones"
                            fill={PALETTE[2]}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={56}
                            onMouseEnter={() => setActiveBarKey('devoluciones')}
                            onMouseLeave={() => setActiveBarKey(null)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}

            {/* ── Radar ──────────────────────────────────────────────────────── */}
            {view === 'radar' && (
                <>
                    {radarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <RadarChart data={radarData} margin={{ top: 8, right: 20, left: 20, bottom: 8 }}>
                                <PolarGrid stroke={gridColor} />
                                <PolarAngleAxis
                                    dataKey="metric"
                                    tick={{ fill: textColor, fontSize: 11 }}
                                />
                                <PolarRadiusAxis
                                    angle={90}
                                    domain={[0, 100]}
                                    tick={false}
                                    axisLine={false}
                                />
                                <Radar
                                    name="Período actual"
                                    dataKey="actual"
                                    stroke="#6366F1"
                                    fill="#6366F1"
                                    fillOpacity={0.25}
                                    strokeWidth={2}
                                />
                                <Radar
                                    name="Período anterior"
                                    dataKey="anterior"
                                    stroke="#94A3B8"
                                    fill="#94A3B8"
                                    fillOpacity={0.12}
                                    strokeWidth={1.5}
                                    strokeDasharray="4 2"
                                />
                                <Tooltip
                                    {...tooltipProps}
                                    formatter={(value: number) => [`${value}%`, '']}
                                />
                                <Legend formatter={legendFormatter} />
                            </RadarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-72 items-center justify-center">
                            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Se necesitan al menos 2 períodos para el radar
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
