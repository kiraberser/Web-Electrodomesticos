"use client"

import { useEffect, useRef, useMemo } from "react"
import { createChart, IChartApi, ISeriesApi, LineData, Time, LineSeries } from "lightweight-charts"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { MovimientoInventario } from "@/api/inventario"
import { Activity } from "lucide-react"

const CATEGORY_COLORS = [
    '#10B981', // emerald
    '#3B82F6', // blue
    '#F59E0B', // amber
    '#EF4444', // red
    '#8B5CF6', // violet
]

interface MovimientosChartProps {
    movimientos: MovimientoInventario[]
    loading?: boolean
}

export default function MovimientosChart({ movimientos, loading = false }: MovimientosChartProps) {
    const { dark } = useAdminTheme()
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRefs = useRef<ISeriesApi<"Line">[]>([])
    const chartInitializedRef = useRef(false)

    // Determine top 5 categories by total volume
    const topCategories = useMemo(() => {
        const catVolume: Record<string, number> = {}
        for (const mov of movimientos) {
            const cat = mov.categoria || 'Sin categoría'
            catVolume[cat] = (catVolume[cat] || 0) + mov.cantidad
        }
        return Object.entries(catVolume)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name]) => name)
    }, [movimientos])

    // Process data: group by date and category
    const processedData = useMemo(() => {
        if (movimientos.length === 0 || topCategories.length === 0) return []

        const seriesDataMap: Record<string, Map<number, number>> = {}
        for (const cat of topCategories) {
            seriesDataMap[cat] = new Map()
        }

        for (const mov of movimientos) {
            const cat = mov.categoria || 'Sin categoría'
            if (!seriesDataMap[cat]) continue

            const date = new Date(mov.fecha)
            if (isNaN(date.getTime())) continue
            // Normalize to day start
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
            const timeKey = dayStart.getTime() / 1000

            const current = seriesDataMap[cat].get(timeKey) || 0
            seriesDataMap[cat].set(timeKey, current + mov.cantidad)
        }

        return topCategories.map((cat) => {
            const dataMap = seriesDataMap[cat]
            const lineData: LineData[] = Array.from(dataMap.entries())
                .map(([time, value]) => ({ time: time as Time, value }))
                .sort((a, b) => (a.time as number) - (b.time as number))
            return { category: cat, data: lineData }
        })
    }, [movimientos, topCategories])

    // Chart initialization and theme updates
    useEffect(() => {
        if (!chartContainerRef.current || loading) return

        // If chart exists, just update theme options
        if (chartRef.current && chartInitializedRef.current) {
            chartRef.current.applyOptions({
                layout: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    background: { type: 'solid', color: dark ? '#0F172A' : '#FFFFFF' } as any,
                    textColor: dark ? '#E2E8F0' : '#1F2937',
                },
                grid: {
                    vertLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                    horzLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                },
                rightPriceScale: { borderColor: dark ? '#334155' : '#D1D5DB' },
                timeScale: { borderColor: dark ? '#334155' : '#D1D5DB' },
            })
            return
        }

        if (chartRef.current) {
            chartRef.current.remove()
        }

        const isMobile = window.innerWidth < 1024
        const chartHeight = isMobile ? 200 : 300

        const chart = createChart(chartContainerRef.current, {
            layout: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                background: { type: 'solid', color: dark ? '#0F172A' : '#FFFFFF' } as any,
                textColor: dark ? '#E2E8F0' : '#1F2937',
            },
            width: chartContainerRef.current.clientWidth,
            height: chartHeight,
            grid: {
                vertLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                horzLines: { color: dark ? '#1E293B' : '#E5E7EB' },
            },
            rightPriceScale: { borderColor: dark ? '#334155' : '#D1D5DB' },
            timeScale: {
                borderColor: dark ? '#334155' : '#D1D5DB',
                timeVisible: false,
            },
        })

        // Create a line series per top category
        const series: ISeriesApi<"Line">[] = []
        for (let i = 0; i < topCategories.length; i++) {
            const s = chart.addSeries(LineSeries, {
                color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                lineWidth: 2,
            }) as ISeriesApi<'Line'>
            series.push(s)
        }

        chartRef.current = chart
        seriesRefs.current = series
        chartInitializedRef.current = true

        const handleResize = () => {
            if (chartContainerRef.current) {
                const mobile = window.innerWidth < 1024
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: mobile ? 200 : 300,
                })
            }
        }
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (chartRef.current) {
                chartRef.current.remove()
            }
            chartRef.current = null
            seriesRefs.current = []
            chartInitializedRef.current = false
        }
    }, [loading, dark, topCategories])

    // Update data when processedData changes
    useEffect(() => {
        if (!chartRef.current || seriesRefs.current.length === 0 || processedData.length === 0) return

        for (let i = 0; i < processedData.length; i++) {
            if (seriesRefs.current[i] && processedData[i].data.length > 0) {
                seriesRefs.current[i].setData(processedData[i].data)
            }
        }

        chartRef.current.timeScale().fitContent()
    }, [processedData])

    if (loading) {
        return (
            <div className={`rounded-xl border p-6 block ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="flex h-72 items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                        <p className={`mt-3 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Cargando grafico...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (movimientos.length === 0) {
        return (
            <div className={`rounded-xl border p-6 block ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                <div className="flex h-72 items-center justify-center">
                    <div className="text-center">
                        <Activity className={`mx-auto mb-3 h-10 w-10 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>No hay datos para mostrar</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`rounded-xl border p-6 block ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
            <div className="mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    Movimientos por Categoria
                </h3>
                <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                    Volumen de movimientos agrupados por categoria (top 5)
                </p>
            </div>
            <div ref={chartContainerRef} className="w-full h-[200px] lg:h-[300px]" />
            <div className={`mt-4 flex items-center gap-4 text-xs overflow-x-auto ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                {topCategories.map((cat, i) => (
                    <div key={cat} className="flex items-center gap-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                        />
                        <span>{cat}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
