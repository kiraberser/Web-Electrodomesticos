"use client"

import { useEffect, useRef, useMemo } from "react"
import { createChart, IChartApi, ISeriesApi, LineData, Time, LineSeries } from "lightweight-charts"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { GraficoVentasData } from "@/api/ventas"
import { TrendingUp } from "lucide-react"

interface VentasChartProps {
    data: GraficoVentasData[]
    loading?: boolean
    tipo?: 'dia' | 'mes'
}

export default function VentasChart({ data, loading = false, tipo = 'dia' }: VentasChartProps) {
    const { dark } = useAdminTheme()
    const chartContainerRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<IChartApi | null>(null)
    const seriesRef = useRef<{
        refacciones: ISeriesApi<"Line"> | null
        servicios: ISeriesApi<"Line"> | null
    }>({
        refacciones: null,
        servicios: null
    })

    const chartInitializedRef = useRef(false)

    useEffect(() => {
        // 1. Validaciones iniciales
        if (!chartContainerRef.current || loading) return;
    
        // 2. Si ya existe un chart (por ejemplo, al cambiar de modo light a dark),
        // usar applyOptions en lugar de recrear para evitar múltiples inicializaciones
        if (chartRef.current && chartInitializedRef.current) {
            // Solo actualizar opciones si cambió el tema
            chartRef.current.applyOptions({
                layout: {
                    background: { type: 'solid', color: dark ? '#0F172A' : '#FFFFFF' } as any,
                    textColor: dark ? '#E2E8F0' : '#1F2937',
                },
                grid: {
                    vertLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                    horzLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                },
                rightPriceScale: {
                    borderColor: dark ? '#334155' : '#D1D5DB',
                },
                timeScale: {
                    borderColor: dark ? '#334155' : '#D1D5DB',
                },
            });
            return; // No recrear el gráfico, solo actualizar opciones
        }
        
        // Solo crear el gráfico si no existe
        if (chartRef.current) {
            chartRef.current.remove();
        }
    
        // 3. Crear el gráfico
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: 'solid', color: dark ? '#0F172A' : '#FFFFFF' } as any,
                textColor: dark ? '#E2E8F0' : '#1F2937',
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            grid: {
                vertLines: { color: dark ? '#1E293B' : '#E5E7EB' },
                horzLines: { color: dark ? '#1E293B' : '#E5E7EB' },
            },
            rightPriceScale: {
                borderColor: dark ? '#334155' : '#D1D5DB',
            },
            timeScale: {
                borderColor: dark ? '#334155' : '#D1D5DB',
                timeVisible: true,
            },
        });
    
        // 4. Crear series usando addSeries con LineSeries (sintaxis correcta según documentación)
        const refaccionesSeries = chart.addSeries(LineSeries, {
            color: '#10B981',
            lineWidth: 2,
        }) as ISeriesApi<'Line'>
    
        const serviciosSeries = chart.addSeries(LineSeries, {
            color: '#3B82F6',
            lineWidth: 2,
        }) as ISeriesApi<'Line'>
    
        // 5. Guardar referencias
        chartRef.current = chart;
        seriesRef.current = {
            refacciones: refaccionesSeries,
            servicios: serviciosSeries,
        };
        chartInitializedRef.current = true;
    
        // 6. Manejo del Resize (Importante para responsive)
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);
    
        // 7. CLEANUP FUNCTION (CRÍTICO)
        // Esto se ejecuta cuando el componente muere o antes de volver a ejecutar el efecto
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
            }
            chartRef.current = null;
            chartInitializedRef.current = false;
        };
    
    }, [loading, dark]); // Agregamos 'dark' para que se recree al cambiar el tema

    // Memoizar el procesamiento de datos para evitar recalcular innecesariamente
    const processedData = useMemo(() => {
        if (data.length === 0) return { refacciones: [], servicios: [] }

        const refaccionesData: LineData[] = []
        const serviciosData: LineData[] = []

        // Procesar y validar datos
        data.forEach((item) => {
            try {
                const date = new Date(item.fecha)
                if (isNaN(date.getTime())) {
                    console.warn('Fecha inválida:', item.fecha)
                    return
                }
                const time = (date.getTime() / 1000) as Time
                const refaccionesValue = Number(item.ventas_refacciones) || 0
                const serviciosValue = Number(item.ventas_servicios) || 0

                refaccionesData.push({ time, value: refaccionesValue })
                serviciosData.push({ time, value: serviciosValue })
            } catch (error) {
                console.error('Error procesando dato:', item, error)
            }
        })

        // Ordenar datos por tiempo (requerido por lightweight-charts)
        const sortByTime = (a: LineData, b: LineData) => (a.time as number) - (b.time as number)
        refaccionesData.sort(sortByTime)
        serviciosData.sort(sortByTime)

        // Eliminar duplicados por tiempo (mantener el último)
        const removeDuplicates = (arr: LineData[]) => {
            const seen = new Map<number, LineData>()
            arr.forEach(item => {
                const timeNum = item.time as number
                seen.set(timeNum, item)
            })
            return Array.from(seen.values()).sort(sortByTime)
        }

        return {
            refacciones: removeDuplicates(refaccionesData),
            servicios: removeDuplicates(serviciosData)
        }
    }, [data])

    // Efecto separado para actualizar datos cuando cambien
    useEffect(() => {
        if (!chartRef.current || !seriesRef.current.refacciones || !seriesRef.current.servicios || processedData.refacciones.length === 0) {
            return
        }

        // Actualizar series solo si hay datos válidos
        if (processedData.refacciones.length > 0) {
            seriesRef.current.refacciones.setData(processedData.refacciones)
        }
        if (processedData.servicios.length > 0) {
            seriesRef.current.servicios.setData(processedData.servicios)
        }

        if (chartRef.current && (processedData.refacciones.length > 0 || processedData.servicios.length > 0)) {
            chartRef.current.timeScale().fitContent()
        }
    }, [processedData])

    if (loading) {
        return (
            <div className={`rounded-lg border p-6 ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <div className="flex h-96 items-center justify-center">
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
            <div className={`rounded-lg border p-6 ${
                dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
            }`}>
                <div className="flex h-96 items-center justify-center">
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
        <div className={`rounded-lg border p-6 ${
            dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
        }`}>
            <div className="mb-4">
                <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {tipo === 'dia' ? 'Ventas por Día' : 'Ventas por Mes'}
                </h3>
                <p className={`mt-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                    {tipo === 'dia' 
                        ? 'Evolución diaria de ventas en el mes seleccionado'
                        : 'Evolución mensual de ventas en el año seleccionado'}
                </p>
            </div>
            <div ref={chartContainerRef} className="w-full" style={{ height: '400px' }} />
            <div className={`mt-4 flex flex-wrap items-center gap-4 text-xs ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span>Refacciones</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span>Servicios</span>
                </div>
            </div>
        </div>
    )
}

