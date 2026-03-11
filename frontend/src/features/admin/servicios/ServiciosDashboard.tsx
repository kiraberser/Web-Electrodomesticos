"use client"

import { useMemo, useState, useTransition } from "react"
import {
    ResponsiveContainer,
    PieChart, Pie, Cell,
    BarChart, Bar,
    XAxis, YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import type { ServiciosEstadisticas } from "@/features/services/api"
import { getEstadisticasAction } from "@/features/services/actions"
import { Wrench, Clock, CheckCircle2, Percent, CalendarDays, RotateCcw } from "lucide-react"

// ── Paletas ───────────────────────────────────────────────────────────────────

const ESTADO_COLORS: Record<string, string> = {
    Pendiente:   '#F59E0B',
    Reparado:    '#3B82F6',
    Entregado:   '#10B981',
    Revision:    '#8B5CF6',
    'En Bodega': '#64748B',
}

const CHART_PALETTE = [
    '#0EA5E9', '#F97316', '#8B5CF6', '#EC4899',
    '#14B8A6', '#F59E0B', '#64748B',
]

const MESES = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const ANIO_INICIO = 2025
const ANIO_ACTUAL = new Date().getFullYear()
const YEARS = Array.from({ length: ANIO_ACTUAL - ANIO_INICIO + 1 }, (_, i) => ANIO_INICIO + i)

// ── Helpers ───────────────────────────────────────────────────────────────────

const fmtPct = (v: number) => `${v.toFixed(1)}%`

// ── Sub-components ────────────────────────────────────────────────────────────

interface KpiCardProps {
    label: string
    value: string | number
    sub: string
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
                <p className={`text-xs ${dark ? 'text-slate-600' : 'text-gray-400'}`}>{sub}</p>
            </div>
        </div>
    )
}

interface DonutCardProps {
    title: string
    data: { name: string; value: number }[]
    colors: string[]
    dark: boolean
    tooltipProps: object
    legendColor: string
}

function DonutCard({ title, data, colors, dark, tooltipProps, legendColor }: DonutCardProps) {
    return (
        <div className={`rounded-xl border p-5 ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <h3 className={`mb-4 text-sm font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{title}</h3>
            {data.length === 0 ? (
                <div className={`flex h-44 items-center justify-center text-sm ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                    Sin datos
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={48}
                            outerRadius={74}
                            paddingAngle={3}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((_, i) => (
                                <Cell key={i} fill={colors[i % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip {...tooltipProps} formatter={(v: number, name: string) => [v, name]} />
                        <Legend
                            formatter={(value) => (
                                <span style={{ color: legendColor, fontSize: 11 }}>{value}</span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
    estadisticas: ServiciosEstadisticas
}

export default function ServiciosDashboard({ estadisticas: initialEstadisticas }: Props) {
    const { dark } = useAdminTheme()
    const [activeBar, setActiveBar] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    // Filtro mes/año
    const [selectedAnio, setSelectedAnio] = useState<number | null>(null)
    const [selectedMes, setSelectedMes] = useState<number | null>(null)
    const [stats, setStats] = useState<ServiciosEstadisticas>(initialEstadisticas)

    const fetchStats = (anio: number | null, mes: number | null) => {
        startTransition(async () => {
            const params: { mes?: number; anio?: number } = {}
            if (anio) params.anio = anio
            if (mes)  params.mes  = mes
            const result = await getEstadisticasAction(Object.keys(params).length ? params : undefined)
            if (result.success && result.data) {
                setStats(result.data as ServiciosEstadisticas)
            }
        })
    }

    const handleAnioChange = (anio: number | null) => {
        setSelectedAnio(anio)
        setSelectedMes(null)
        fetchStats(anio, null)
    }

    const handleMesChange = (mes: number | null) => {
        setSelectedMes(mes)
        fetchStats(selectedAnio, mes)
    }

    const handleReset = () => {
        setSelectedAnio(null)
        setSelectedMes(null)
        fetchStats(null, null)
    }

    const isFiltered = selectedAnio !== null || selectedMes !== null

    const labelPeriodo = isFiltered
        ? [selectedMes ? MESES[selectedMes - 1] : null, selectedAnio].filter(Boolean).join(' ')
        : 'Todo el historial'

    // ── Colors ────────────────────────────────────────────────────────────────
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

    // ── Derived data ──────────────────────────────────────────────────────────
    const estadoData = useMemo(() =>
        Object.entries(stats.por_estado).map(([name, value]) => ({ name, value })),
    [stats.por_estado])

    const estadoColors = useMemo(() =>
        estadoData.map(d => ESTADO_COLORS[d.name] ?? '#64748B'),
    [estadoData])

    const aparatoData = useMemo(() =>
        stats.por_aparato.map(a => ({ name: a.aparato, value: a.count })),
    [stats.por_aparato])

    const marcaData = useMemo(() =>
        stats.por_marca.map(m => ({ name: m.marca, value: m.count })),
    [stats.por_marca])

    // ── KPI cards ─────────────────────────────────────────────────────────────
    const kpis = [
        {
            label: 'Total Servicios',
            value: stats.total,
            sub: labelPeriodo,
            icon: Wrench,
            iconBg: 'bg-blue-500',
            numberColor: dark ? 'text-slate-100' : 'text-gray-900',
        },
        {
            label: 'Pendientes',
            value: stats.pendientes,
            sub: `${stats.total > 0 ? ((stats.pendientes / stats.total) * 100).toFixed(0) : 0}% del periodo`,
            icon: Clock,
            iconBg: 'bg-amber-500',
            numberColor: dark ? 'text-amber-300' : 'text-amber-700',
        },
        {
            label: 'Completados',
            value: stats.completados,
            sub: 'Reparados + Entregados',
            icon: CheckCircle2,
            iconBg: 'bg-emerald-500',
            numberColor: dark ? 'text-emerald-300' : 'text-emerald-700',
        },
        {
            label: 'Tasa de Completado',
            value: fmtPct(stats.tasa_completado),
            sub: 'completados / total',
            icon: Percent,
            iconBg: 'bg-violet-500',
            numberColor: dark ? 'text-violet-300' : 'text-violet-700',
        },
    ]

    const selectCls = `rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
        dark
            ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
    }`

    return (
        <div className="mb-8 space-y-6">
            {/* ── Filtro mes / año ──────────────────────────────────────────── */}
            <div className={`flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <CalendarDays className={`w-4 h-4 shrink-0 ${dark ? 'text-slate-400' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Periodo:
                </span>

                {/* Año */}
                <select
                    value={selectedAnio ?? ''}
                    onChange={e => handleAnioChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectCls}
                    disabled={isPending}
                >
                    <option value="">Todos los años</option>
                    {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {/* Mes */}
                <select
                    value={selectedMes ?? ''}
                    onChange={e => handleMesChange(e.target.value ? Number(e.target.value) : null)}
                    className={selectCls}
                    disabled={isPending}
                >
                    <option value="">Todos los meses</option>
                    {MESES.map((m, i) => (
                        <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                </select>

                {/* Badge periodo activo */}
                {isFiltered && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        dark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                    }`}>
                        {labelPeriodo}
                    </span>
                )}

                {/* Reset */}
                {isFiltered && (
                    <button
                        onClick={handleReset}
                        disabled={isPending}
                        className={`ml-auto flex items-center gap-1.5 text-xs font-medium transition-colors ${
                            dark
                                ? 'text-slate-400 hover:text-slate-200'
                                : 'text-gray-500 hover:text-gray-700'
                        } disabled:opacity-40`}
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Limpiar
                    </button>
                )}

                {isPending && (
                    <span className={`ml-auto text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                        Cargando…
                    </span>
                )}
            </div>

            {/* ── KPI Cards ─────────────────────────────────────────────────── */}
            <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                {kpis.map((k, i) => (
                    <KpiCard key={i} {...k} dark={dark} />
                ))}
            </div>

            {/* ── Donuts ────────────────────────────────────────────────────── */}
            <div className={`grid gap-4 md:grid-cols-3 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
                <DonutCard
                    title="Por Estado"
                    data={estadoData}
                    colors={estadoColors}
                    dark={dark}
                    tooltipProps={tooltipProps}
                    legendColor={legendColor}
                />
                <DonutCard
                    title="Por Aparato"
                    data={aparatoData}
                    colors={CHART_PALETTE}
                    dark={dark}
                    tooltipProps={tooltipProps}
                    legendColor={legendColor}
                />
                <DonutCard
                    title="Por Marca"
                    data={marcaData}
                    colors={CHART_PALETTE}
                    dark={dark}
                    tooltipProps={tooltipProps}
                    legendColor={legendColor}
                />
            </div>

            {/* ── Tendencia semanal ─────────────────────────────────────────── */}
            <div className={`rounded-xl border p-5 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'} ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <div className="mb-4">
                    <h3 className={`text-sm font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                        Tendencia Semanal
                    </h3>
                    <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                        {isFiltered
                            ? `Servicios por semana — ${labelPeriodo}`
                            : 'Servicios ingresados por semana — últimas 8 semanas'}
                    </p>
                </div>

                {stats.tendencia_semanal.length === 0 ? (
                    <div className={`flex h-44 items-center justify-center text-sm ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                        Sin datos para este periodo
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={stats.tendencia_semanal}
                            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="semana"
                                tick={{ fontSize: 11, fill: textColor }}
                                axisLine={{ stroke: gridColor }}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 10, fill: textColor }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip
                                cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                                content={({ active, payload, label }) => {
                                    if (!active || !payload?.length) return null
                                    const entry = activeBar
                                        ? (payload.find(p => p.dataKey === activeBar) ?? payload[0])
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
                                            <p style={{ color: '#6366F1' }}>
                                                Servicios:{' '}
                                                <strong style={{ color: dark ? '#f1f5f9' : '#111827' }}>
                                                    {entry.value}
                                                </strong>
                                            </p>
                                        </div>
                                    )
                                }}
                            />
                            <Bar
                                dataKey="count"
                                name="Servicios"
                                fill="#6366F1"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={56}
                                onMouseEnter={() => setActiveBar('count')}
                                onMouseLeave={() => setActiveBar(null)}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    )
}
