"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/admin/ui/Button"
import { Input } from "@/components/admin/ui/Input"
import { Badge } from "@/components/ui/feedback/Badge"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import type { Refaccion } from "@/api/productos"
import type { MovimientoInventario } from "@/api/inventario"
import { X, Search, Package, ArrowDownToLine, ArrowUpFromLine, MapPin } from "lucide-react"
import { formatCurrency, formatDate, formatNumber } from "@/components/admin/utils/format"

interface RefaccionSearchDrawerProps {
    open: boolean
    onClose: () => void
    refacciones: Refaccion[]
    movimientos: MovimientoInventario[]
}

export default function RefaccionSearchDrawer({
    open,
    onClose,
    refacciones,
    movimientos,
}: RefaccionSearchDrawerProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [selectedId, setSelectedId] = useState<number | null>(null)

    const filteredRefacciones = useMemo(() => {
        if (!search.trim()) return refacciones.slice(0, 20)
        const q = search.toLowerCase()
        return refacciones.filter(r =>
            r.nombre.toLowerCase().includes(q) ||
            r.codigo_parte.toLowerCase().includes(q) ||
            r.marca.toLowerCase().includes(q) ||
            String(r.id).includes(q)
        ).slice(0, 20)
    }, [refacciones, search])

    const selectedRef = refacciones.find(r => r.id === selectedId)

    const refMovimientos = useMemo(() => {
        if (!selectedId) return []
        return movimientos.filter(m => m.refaccion === selectedId)
    }, [movimientos, selectedId])

    const totalEntradas = refMovimientos.filter(m => m.tipo_movimiento === 'ENT').reduce((acc, m) => acc + m.cantidad, 0)
    const totalSalidas = refMovimientos.filter(m => m.tipo_movimiento === 'SAL').reduce((acc, m) => acc + m.cantidad, 0)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <aside
                className={`absolute right-0 top-0 h-full w-full max-w-xl border-l shadow-xl overflow-y-auto ${
                    dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'
                }`}
                role="dialog"
                aria-label="Buscar refaccion"
            >
                {/* Header */}
                <div className={`sticky top-0 z-10 border-b p-4 ${dark ? 'border-slate-800 bg-slate-900' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                            Buscar Refaccion
                        </h3>
                        <Button variant="ghost" size="sm" onClick={onClose} className="cursor-pointer">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                        <Input
                            placeholder="Buscar por ID, nombre, codigo, marca..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setSelectedId(null) }}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="p-4">
                    {/* Selected refaccion detail */}
                    {selectedRef ? (
                        <div className="space-y-4">
                            <button
                                onClick={() => setSelectedId(null)}
                                className={`text-sm cursor-pointer ${dark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                            >
                                &larr; Volver a la lista
                            </button>

                            {/* Product image */}
                            {selectedRef.imagen && (
                                <div className={`relative w-full aspect-video rounded-lg overflow-hidden border ${dark ? 'border-slate-800' : 'border-gray-200'}`}>
                                    <Image
                                        src={selectedRef.imagen}
                                        alt={selectedRef.nombre}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 576px) 100vw, 576px"
                                    />
                                </div>
                            )}

                            {/* Refaccion info */}
                            <div className={`rounded-lg border p-4 ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>{selectedRef.codigo_parte}</div>
                                <div className={`text-lg font-semibold mt-1 ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{selectedRef.nombre}</div>
                                <div className={`mt-2 space-y-1 text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                                    <div>Marca: {selectedRef.marca}</div>
                                    <div>Precio: {formatCurrency(Number(selectedRef.precio))}</div>
                                    {selectedRef.ubicacion_estante && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            Estante: {selectedRef.ubicacion_estante}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        Stock actual:
                                        <Badge className={selectedRef.existencias > 0
                                            ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                                            : dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'
                                        }>
                                            {selectedRef.existencias} unidades
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Mini KPIs */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className={`rounded-lg border p-3 text-center ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <ArrowDownToLine className={`mx-auto h-4 w-4 mb-1 ${dark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                    <div className={`text-lg font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{formatNumber(totalEntradas)}</div>
                                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Entradas</div>
                                </div>
                                <div className={`rounded-lg border p-3 text-center ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <ArrowUpFromLine className={`mx-auto h-4 w-4 mb-1 ${dark ? 'text-red-400' : 'text-red-600'}`} />
                                    <div className={`text-lg font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{formatNumber(totalSalidas)}</div>
                                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Salidas</div>
                                </div>
                                <div className={`rounded-lg border p-3 text-center ${dark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200'}`}>
                                    <Package className={`mx-auto h-4 w-4 mb-1 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <div className={`text-lg font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>{formatNumber(selectedRef.existencias)}</div>
                                    <div className={`text-[10px] ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Stock</div>
                                </div>
                            </div>

                            {/* Movimientos list */}
                            <div>
                                <h4 className={`text-sm font-semibold mb-2 ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                    Historial de movimientos ({refMovimientos.length})
                                </h4>
                                {refMovimientos.length === 0 ? (
                                    <p className={`text-sm ${dark ? 'text-slate-500' : 'text-gray-500'}`}>Sin movimientos registrados.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {refMovimientos.map((mov) => (
                                            <div
                                                key={mov.id}
                                                className={`flex items-center justify-between rounded-lg border p-3 ${dark ? 'border-slate-800 bg-slate-800/30' : 'border-gray-200'}`}
                                            >
                                                <div>
                                                    <Badge className={
                                                        mov.tipo_movimiento === 'ENT'
                                                            ? dark ? 'bg-emerald-500/15 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                                            : dark ? 'bg-red-500/15 text-red-400' : 'bg-red-100 text-red-700'
                                                    }>
                                                        {mov.tipo_movimiento === 'ENT' ? 'Entrada' : 'Salida'}
                                                    </Badge>
                                                    <div className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                                        {formatDate(mov.fecha)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-semibold ${dark ? 'text-slate-200' : 'text-gray-900'}`}>
                                                        {mov.tipo_movimiento === 'ENT' ? '+' : '-'}{mov.cantidad}
                                                    </div>
                                                    {Number(mov.precio_unitario) > 0 && (
                                                        <div className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                                            {formatCurrency(Number(mov.precio_unitario))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Refacciones list */
                        <div className="space-y-2">
                            {filteredRefacciones.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Package className={`mx-auto mb-2 h-8 w-8 ${dark ? 'text-slate-600' : 'text-gray-400'}`} />
                                    <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-600'}`}>No se encontraron refacciones.</p>
                                </div>
                            ) : (
                                filteredRefacciones.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setSelectedId(r.id!)}
                                        className={`w-full text-left rounded-lg border p-3 transition cursor-pointer ${
                                            dark
                                                ? 'border-slate-800 bg-slate-800/30 hover:bg-slate-800/60'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {r.imagen ? (
                                                <Image
                                                    src={r.imagen}
                                                    alt={r.nombre}
                                                    width={32}
                                                    height={32}
                                                    className="rounded object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${dark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                                                    <Package className={`h-4 w-4 ${dark ? 'text-slate-500' : 'text-gray-400'}`} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="min-w-0">
                                                        <div className={`font-semibold text-sm truncate ${dark ? 'text-slate-200' : 'text-gray-900'}`}>{r.nombre}</div>
                                                        <div className={`text-xs font-mono ${dark ? 'text-slate-500' : 'text-gray-500'}`}>{r.codigo_parte}</div>
                                                    </div>
                                                    <Badge className={r.existencias > 0
                                                        ? dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800'
                                                        : dark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-800'
                                                    }>
                                                        {r.existencias}
                                                    </Badge>
                                                </div>
                                                <div className={`mt-1 text-xs ${dark ? 'text-slate-500' : 'text-gray-500'}`}>
                                                    {r.marca} &middot; {formatCurrency(Number(r.precio))}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    )
}
