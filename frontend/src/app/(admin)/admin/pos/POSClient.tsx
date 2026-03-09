'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
    Search, Plus, Minus, X, ShoppingBag,
    CheckCircle, AlertCircle, Package, Printer,
    Clock, Hash, SlidersHorizontal, Tag,
} from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { useAdminTheme } from '@/features/admin/hooks/useAdminTheme'
import {
    searchRefaccionesAction,
    createVentasAction,
    getMarcasPOSAction,
    getCategoriasPOSAction,
    type CartItem,
    type Refaccion,
    type Marca,
    type Categoria,
    type POSSearchFilters,
} from '@/features/admin/pos-actions'
import type { TicketData } from './TicketPrint'

const TicketPrint = dynamic(() => import('./TicketPrint'), { ssr: false })

const ESTADO_LABEL: Record<string, string> = {
    NVO: 'Nuevo',
    UBS: 'Usado B/S',
    REC: 'Recon.',
}
const ESTADO_DOT: Record<string, string> = {
    NVO: 'bg-emerald-500',
    UBS: 'bg-amber-400',
    REC: 'bg-sky-400',
}

function fmx(n: number) {
    return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

function LiveClock({ dark }: { dark: boolean }) {
    const [now, setNow] = useState<Date | null>(null)
    useEffect(() => {
        setNow(new Date())
        const id = setInterval(() => setNow(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    if (!now) return null
    return (
        <div className={`hidden sm:flex items-center gap-2 tabular-nums ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="font-mono text-sm">
                {now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={`text-xs ${dark ? 'text-slate-600' : 'text-slate-300'}`}>·</span>
            <span className="text-xs capitalize">
                {now.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
        </div>
    )
}

function SkeletonCard({ dark }: { dark: boolean }) {
    return (
        <div className={`rounded-xl border p-4 space-y-3 animate-pulse ${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`h-40 rounded-lg ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            <div className={`h-3 rounded-full w-1/3 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            <div className={`h-4 rounded-full w-3/4 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            <div className={`h-3 rounded-full w-1/2 ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
            <div className={`h-8 rounded-lg ${dark ? 'bg-slate-800' : 'bg-slate-100'}`} />
        </div>
    )
}

export default function POSClient() {
    const { dark } = useAdminTheme()

    // ── Filter state ─────────────────────────────────────────────────────────
    const [sku, setSku] = useState('')
    const [nombre, setNombre] = useState('')
    const [selectedMarca, setSelectedMarca] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState('')
    const [selectedEstado, setSelectedEstado] = useState('')

    // ── Catalog data ─────────────────────────────────────────────────────────
    const [marcas, setMarcas] = useState<Marca[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])

    // ── Search ───────────────────────────────────────────────────────────────
    const [results, setResults] = useState<Refaccion[]>([])
    const [hasSearched, setHasSearched] = useState(false)
    const [searching, setSearching] = useState(false)

    // ── Cart ─────────────────────────────────────────────────────────────────
    const [cart, setCart] = useState<CartItem[]>([])
    const [pago, setPago] = useState('')

    // ── Submit ───────────────────────────────────────────────────────────────
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [receipt, setReceipt] = useState<TicketData | null>(null)

    // ── Print ────────────────────────────────────────────────────────────────
    const ticketRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: ticketRef,
        pageStyle: '@page { size: 58mm auto; margin: 2mm; } body { margin: 0; }',
    })

    // Load marcas + categorías once on mount
    useEffect(() => {
        Promise.all([getMarcasPOSAction(), getCategoriasPOSAction()]).then(([m, c]) => {
            setMarcas(m)
            setCategorias(c)
        })
    }, [])

    // ── Search handler ───────────────────────────────────────────────────────
    const hasActiveFilters = !!(sku.trim() || nombre.trim() || selectedMarca || selectedCategoria || selectedEstado)

    const handleSearch = useCallback(async () => {
        if (!hasActiveFilters) return
        setSearching(true)
        setHasSearched(true)
        const filters: POSSearchFilters = {}
        if (sku.trim()) filters.sku = sku.trim()
        if (nombre.trim()) filters.nombre = nombre.trim()
        if (selectedMarca) filters.marca = selectedMarca
        if (selectedCategoria) filters.categoria = selectedCategoria
        if (selectedEstado) filters.estado = selectedEstado
        const data = await searchRefaccionesAction(filters)
        setResults(data)
        setSearching(false)
    }, [sku, nombre, selectedMarca, selectedCategoria, selectedEstado, hasActiveFilters])

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }

    const clearFilters = () => {
        setSku('')
        setNombre('')
        setSelectedMarca('')
        setSelectedCategoria('')
        setSelectedEstado('')
        setResults([])
        setHasSearched(false)
    }

    // ── Cart ops ─────────────────────────────────────────────────────────────
    const addToCart = useCallback((r: Refaccion) => {
        setCart((prev) => {
            const hit = prev.find((i) => i.refaccion.id === r.id)
            if (hit) return prev.map((i) => i.refaccion.id === r.id ? { ...i, cantidad: i.cantidad + 1 } : i)
            return [...prev, { refaccion: r, cantidad: 1, precio_unitario: Number(r.precio) }]
        })
    }, [])

    const updateQty = useCallback((id: number, delta: number) => {
        setCart((prev) =>
            prev.map((i) => i.refaccion.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
                .filter((i) => i.cantidad > 0),
        )
    }, [])

    const removeItem = useCallback((id: number) => {
        setCart((prev) => prev.filter((i) => i.refaccion.id !== id))
    }, [])

    const cartTotal = cart.reduce((s, i) => s + i.cantidad * i.precio_unitario, 0)
    const subtotalSinIva = cartTotal / 1.16
    const ivaAmount = cartTotal - subtotalSinIva
    const pagoNum = parseFloat(pago) || 0
    const pagoInsuficiente = pagoNum > 0 && pagoNum < cartTotal
    const cambioPreview = pagoNum > 0 ? pagoNum - cartTotal : null
    const totalPiezas = cart.reduce((s, i) => s + i.cantidad, 0)

    // ── Confirm sale ─────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        if (cart.length === 0) return
        if (!pago.trim()) {
            setError('Ingresa el monto recibido para calcular el cambio.')
            return
        }
        if (pagoInsuficiente) {
            setError(`El pago recibido (${fmx(pagoNum)}) es menor al total (${fmx(cartTotal)}).`)
            return
        }
        setError(null)
        setLoading(true)
        const result = await createVentasAction(cart)
        setLoading(false)
        if (!result.success) {
            setError(result.error ?? 'Error desconocido')
            return
        }
        const pN = parseFloat(pago) || undefined
        const cN = pN != null ? Math.max(0, pN - result.total!) : undefined
        setReceipt({
            items: cart.map((i) => ({
                nombre: i.refaccion.nombre,
                cantidad: i.cantidad,
                precio_unitario: i.precio_unitario,
                subtotal: i.cantidad * i.precio_unitario,
            })),
            total: result.total!,
            ids: result.ids!,
            fecha: new Date(),
            pago: pN,
            cambio: cN,
        })
        setCart([])
        clearFilters()
        setPago('')
    }

    // ── Theme tokens ─────────────────────────────────────────────────────────
    const bg     = dark ? 'bg-slate-950'  : 'bg-slate-50'
    const panel  = dark ? 'bg-slate-900 border-slate-800'  : 'bg-white border-slate-200'
    const inner  = dark ? 'bg-slate-800/70 border-slate-700/60' : 'bg-slate-50 border-slate-200'
    const inp    = dark
        ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/20'
        : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/15'
    const sel    = dark
        ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/20'
        : 'bg-white border-slate-200 text-slate-900 focus:border-[#0A3981] focus:ring-2 focus:ring-[#0A3981]/15'
    const muted  = dark ? 'text-slate-500' : 'text-slate-400'
    const body   = dark ? 'text-slate-100' : 'text-slate-900'
    const div    = dark ? 'border-slate-800' : 'border-slate-100'

    // ── Receipt screen ───────────────────────────────────────────────────────
    if (receipt) {
        const rSub = receipt.total / 1.16
        const rIva = receipt.total - rSub
        return (
            <div className={`min-h-[60vh] flex items-center justify-center py-10 ${bg}`}>
                <div className="hidden"><TicketPrint ref={ticketRef} data={receipt} /></div>

                <div className={`w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden ${panel}`}>
                    {/* Success banner */}
                    <div className={`px-6 py-8 text-center ${dark ? 'bg-emerald-950/40' : 'bg-emerald-50'} border-b ${dark ? 'border-emerald-900/50' : 'border-emerald-100'}`}>
                        <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${dark ? 'bg-emerald-900/60 ring-4 ring-emerald-900/30' : 'bg-emerald-100 ring-4 ring-emerald-50'}`}>
                            <CheckCircle className="h-9 w-9 text-emerald-500" />
                        </div>
                        <h2 className={`text-xl font-bold ${dark ? 'text-emerald-300' : 'text-emerald-800'}`}>¡Venta registrada!</h2>
                        <p className={`text-sm mt-1.5 ${muted}`}>
                            Folio{receipt.ids.length > 1 ? 's' : ''}{' '}
                            <span className="font-mono font-bold">#{receipt.ids.join(', #')}</span>
                        </p>
                    </div>

                    {/* Items list */}
                    <div className="px-5 pt-4 pb-2 space-y-2">
                        <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${muted}`}>Artículos vendidos</p>
                        {receipt.items.map((item, i) => (
                            <div key={i} className={`flex justify-between items-center text-sm rounded-lg px-3 py-2.5 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="flex-1 min-w-0 pr-3">
                                    <p className={`font-semibold truncate ${body}`}>{item.nombre}</p>
                                    <p className={`text-xs font-mono mt-0.5 ${muted}`}>{item.cantidad} × {fmx(item.precio_unitario)}</p>
                                </div>
                                <span className={`font-bold font-mono shrink-0 ${body}`}>{fmx(item.subtotal)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className={`mx-5 mt-2 pt-3 pb-4 border-t ${div} space-y-1.5`}>
                        <div className={`flex justify-between text-sm ${muted}`}>
                            <span>Subtotal (sin IVA)</span><span className="font-mono">{fmx(rSub)}</span>
                        </div>
                        <div className={`flex justify-between text-sm ${muted}`}>
                            <span>IVA 16%</span><span className="font-mono">{fmx(rIva)}</span>
                        </div>
                        <div className={`flex justify-between font-bold text-base pt-2 border-t ${div}`}>
                            <span className={body}>Total</span>
                            <span className="font-mono text-emerald-500">{fmx(receipt.total)}</span>
                        </div>
                        {receipt.pago != null && (
                            <>
                                <div className={`flex justify-between text-sm pt-1 border-t ${div} ${muted}`}>
                                    <span>Pago recibido</span><span className="font-mono">{fmx(receipt.pago)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-emerald-500">
                                    <span>Cambio</span><span className="font-mono">{fmx(receipt.cambio ?? 0)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 space-y-2.5">
                        <button
                            onClick={handlePrint}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                            <Printer className="h-4 w-4" /> Imprimir ticket
                        </button>
                        <button
                            onClick={() => setReceipt(null)}
                            className="w-full rounded-xl bg-[#0A3981] py-3 text-sm font-bold text-white hover:bg-[#0A3981]/90 transition-colors"
                        >
                            Nueva venta
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Main POS ─────────────────────────────────────────────────────────────
    return (
        <div className={`space-y-5 ${bg}`}>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-bold tracking-tight ${body}`}>Punto de Venta</h1>
                    <p className={`text-sm mt-0.5 ${muted}`}>Filtra y busca productos — sin peticiones innecesarias al servidor</p>
                </div>
                <LiveClock dark={dark} />
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

                {/* ── Left: filters + results ──────────────────────────── */}
                <div className="space-y-4 min-w-0">

                    {/* Filter panel */}
                    <div className={`rounded-2xl border p-4 space-y-3 ${panel}`}>
                        <div className={`flex items-center gap-2 ${muted}`}>
                            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Filtros de búsqueda</span>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className={`ml-auto flex items-center gap-1 text-[11px] font-medium rounded-full px-2.5 py-0.5 transition-colors ${dark ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                                >
                                    <X className="h-3 w-3" /> Limpiar
                                </button>
                            )}
                        </div>

                        {/* Row 1: SKU + Nombre */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div className="relative">
                                <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${muted}`} />
                                <input
                                    type="text"
                                    value={sku}
                                    onChange={(e) => setSku(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="SKU / Código de parte"
                                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm font-mono transition-colors outline-none ${inp}`}
                                />
                            </div>
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${muted}`} />
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nombre de refacción"
                                    className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm transition-colors outline-none ${inp}`}
                                />
                            </div>
                        </div>

                        {/* Row 2: Selects + Button */}
                        <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_auto_auto] gap-2.5 items-center">
                            <select
                                value={selectedMarca}
                                onChange={(e) => setSelectedMarca(e.target.value)}
                                className={`rounded-xl border py-2.5 px-3 text-sm outline-none transition-colors ${sel}`}
                            >
                                <option value="">Todas las marcas</option>
                                {marcas.map((m) => (
                                    <option key={m.id ?? m.nombre} value={m.nombre}>{m.nombre}</option>
                                ))}
                            </select>

                            <select
                                value={selectedCategoria}
                                onChange={(e) => setSelectedCategoria(e.target.value)}
                                className={`rounded-xl border py-2.5 px-3 text-sm outline-none transition-colors ${sel}`}
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map((c) => (
                                    <option key={c.id ?? c.nombre} value={String(c.id)}>{c.nombre}</option>
                                ))}
                            </select>

                            <select
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                                className={`rounded-xl border py-2.5 px-3 text-sm outline-none transition-colors col-span-1 ${sel}`}
                            >
                                <option value="">Estado</option>
                                <option value="NVO">Nuevo</option>
                                <option value="UBS">Usado B/S</option>
                                <option value="REC">Recon.</option>
                            </select>

                            <button
                                onClick={handleSearch}
                                disabled={searching || !hasActiveFilters}
                                className="col-span-1 flex items-center justify-center gap-2 rounded-xl bg-[#0A3981] py-2.5 px-5 text-sm font-bold text-white hover:bg-[#0A3981]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                {searching
                                    ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    : <Search className="h-4 w-4" />
                                }
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* Results area */}
                    {searching && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} dark={dark} />)}
                        </div>
                    )}

                    {!searching && !hasSearched && (
                        <div className={`rounded-2xl border-2 border-dashed py-14 text-center ${dark ? 'border-slate-800' : 'border-slate-200'}`}>
                            <Search className={`mx-auto mb-3 h-9 w-9 ${dark ? 'text-slate-700' : 'text-slate-300'}`} />
                            <p className={`font-semibold text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Usa los filtros para encontrar productos</p>
                            <p className={`text-xs mt-1.5 ${dark ? 'text-slate-700' : 'text-slate-300'}`}>Busca por SKU exacto, nombre, marca o categoría y presiona <kbd className={`font-mono px-1.5 py-0.5 rounded text-[10px] border ${dark ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-500'}`}>Enter</kbd></p>
                        </div>
                    )}

                    {!searching && hasSearched && results.length === 0 && (
                        <div className={`rounded-2xl border py-14 text-center ${panel}`}>
                            <Package className={`mx-auto mb-3 h-9 w-9 ${dark ? 'text-slate-700' : 'text-slate-300'}`} />
                            <p className={`font-semibold text-sm ${dark ? 'text-slate-400' : 'text-slate-600'}`}>Sin resultados</p>
                            <p className={`text-xs mt-1 ${muted}`}>Prueba con otros filtros</p>
                        </div>
                    )}

                    {!searching && results.length > 0 && (
                        <>
                            <p className={`text-xs ${muted}`}>
                                <span className="font-semibold">{results.length}</span> resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                {results.map((r) => {
                                    const inCart = cart.some((i) => i.refaccion.id === r.id)
                                    const sinStock = r.existencias === 0
                                    return (
                                        <div
                                            key={r.id}
                                            className={`group rounded-xl border flex flex-col transition-all duration-200 overflow-hidden ${panel} ${inCart ? `ring-2 ${dark ? 'ring-[#E38E49]/40' : 'ring-[#E38E49]/30'}` : `hover:shadow-md ${dark ? 'hover:border-slate-700' : 'hover:border-slate-300'}`}`}
                                        >
                                            {/* Image */}
                                            <div className={`relative h-40 shrink-0 ${dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                                {r.imagen ? (
                                                    <Image
                                                        src={r.imagen}
                                                        alt={r.nombre}
                                                        fill
                                                        sizes="220px"
                                                        className="object-contain p-3"
                                                    />
                                                ) : (
                                                    <div className="h-full flex items-center justify-center">
                                                        <Package className={`h-10 w-10 ${dark ? 'text-slate-700' : 'text-slate-300'}`} />
                                                    </div>
                                                )}
                                                {/* Stock badge overlay */}
                                                <div className="absolute top-2 right-2">
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${sinStock ? (dark ? 'bg-red-900/80 text-red-300' : 'bg-red-100 text-red-600') : (dark ? 'bg-emerald-900/80 text-emerald-300' : 'bg-emerald-100 text-emerald-700')}`}>
                                                        {sinStock ? 'Sin stock' : `${r.existencias} pzs`}
                                                    </span>
                                                </div>
                                                {inCart && (
                                                    <div className="absolute top-2 left-2">
                                                        <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-[#E38E49] text-white">En carrito</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="p-3.5 flex flex-col gap-2 flex-1">
                                                {/* Marca + Estado */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {r.marca && (
                                                        <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${muted}`}>
                                                            <Tag className="h-2.5 w-2.5" />{r.marca}
                                                        </span>
                                                    )}
                                                    {r.estado && (
                                                        <span className={`ml-auto flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 ${dark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                                                            <span className={`h-1.5 w-1.5 rounded-full ${ESTADO_DOT[r.estado] ?? 'bg-slate-400'}`} />
                                                            {ESTADO_LABEL[r.estado]}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Name */}
                                                <p className={`text-sm font-semibold leading-snug line-clamp-2 ${body}`}>{r.nombre}</p>

                                                {/* SKU */}
                                                {r.codigo_parte && (
                                                    <p className={`text-[11px] font-mono ${muted}`}>#{r.codigo_parte}</p>
                                                )}

                                                {/* Price */}
                                                <p className="text-base font-bold font-mono text-[#0A3981] mt-auto">{fmx(Number(r.precio))}</p>
                                            </div>

                                            {/* Add button */}
                                            <div className="px-3.5 pb-3.5">
                                                <button
                                                    onClick={() => addToCart(r)}
                                                    disabled={sinStock}
                                                    className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                                                        inCart
                                                            ? 'bg-[#E38E49] text-white hover:bg-[#d07d3a]'
                                                            : dark
                                                                ? 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-[#0A3981] hover:border-[#0A3981] hover:text-white'
                                                                : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-[#0A3981] hover:border-[#0A3981] hover:text-white'
                                                    }`}
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    {inCart ? 'Agregar otra' : 'Agregar al carrito'}
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* ── Right: Cart ──────────────────────────────────────── */}
                <div className={`rounded-2xl border sticky top-4 overflow-hidden ${panel}`}>
                    {/* Cart header */}
                    <div className={`flex items-center justify-between px-4 py-3.5 border-b ${div}`}>
                        <div className="flex items-center gap-2">
                            <ShoppingBag className={`h-4 w-4 ${muted}`} />
                            <span className={`font-bold text-sm ${body}`}>Carrito</span>
                        </div>
                        {cart.length > 0 && (
                            <span className="rounded-full bg-[#0A3981] px-2.5 py-0.5 text-xs font-bold text-white">
                                {totalPiezas} pz{totalPiezas !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div className={`py-14 text-center px-5 ${muted}`}>
                            <ShoppingBag className="mx-auto mb-3 h-10 w-10 opacity-15" />
                            <p className="text-sm font-semibold">Carrito vacío</p>
                            <p className={`text-xs mt-1 ${dark ? 'text-slate-700' : 'text-slate-300'}`}>Agrega productos desde el panel izquierdo</p>
                        </div>
                    ) : (
                        <>
                            {/* Items */}
                            <div className="max-h-[320px] overflow-y-auto px-3.5 py-3 space-y-2">
                                {cart.map((item) => (
                                    <div key={item.refaccion.id} className={`rounded-xl p-3 ${inner}`}>
                                        <div className="flex items-start gap-2 mb-2.5">
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-semibold line-clamp-1 ${body}`}>{item.refaccion.nombre}</p>
                                                <p className={`text-xs font-mono mt-0.5 ${muted}`}>{fmx(item.precio_unitario)} c/u</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.refaccion.id!)}
                                                className={`shrink-0 rounded-lg p-1 transition-colors ${dark ? 'text-slate-600 hover:text-red-400 hover:bg-red-900/20' : 'text-slate-300 hover:text-red-500 hover:bg-red-50'}`}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className={`flex items-center rounded-lg border overflow-hidden ${dark ? 'border-slate-600' : 'border-slate-200'}`}>
                                                <button
                                                    onClick={() => updateQty(item.refaccion.id!, -1)}
                                                    className={`px-2.5 py-1.5 text-sm transition-colors ${dark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className={`w-8 text-center text-sm font-bold font-mono ${body}`}>{item.cantidad}</span>
                                                <button
                                                    onClick={() => updateQty(item.refaccion.id!, +1)}
                                                    className={`px-2.5 py-1.5 text-sm transition-colors ${dark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-bold font-mono text-[#0A3981]">{fmx(item.cantidad * item.precio_unitario)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Subtotals */}
                            <div className={`px-4 pt-3 pb-2 border-t space-y-1.5 ${div}`}>
                                <div className={`flex justify-between text-xs ${muted}`}>
                                    <span>Subtotal (sin IVA)</span>
                                    <span className="font-mono">{fmx(subtotalSinIva)}</span>
                                </div>
                                <div className={`flex justify-between text-xs ${muted}`}>
                                    <span>IVA 16%</span>
                                    <span className="font-mono">{fmx(ivaAmount)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className={`px-4 py-3 border-t ${div}`}>
                                <div className="flex justify-between items-baseline">
                                    <span className={`text-xs font-bold uppercase tracking-widest ${muted}`}>Total</span>
                                    <span className="text-2xl font-black font-mono text-[#0A3981]">{fmx(cartTotal)}</span>
                                </div>
                            </div>

                            {/* Pago recibido */}
                            <div className={`px-4 pb-4 border-t pt-3 space-y-2 ${div}`}>
                                <label className={`block text-[11px] font-bold uppercase tracking-widest ${muted}`}>
                                    Pago recibido <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono pointer-events-none ${muted}`}>$</span>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={pago}
                                        onChange={(e) => setPago(e.target.value)}
                                        placeholder={cartTotal.toFixed(2)}
                                        className={`w-full rounded-xl border py-2.5 pl-7 pr-3 text-sm font-mono outline-none transition-colors ${pagoInsuficiente ? 'border-red-400 ring-2 ring-red-400/20 text-red-500' : inp}`}
                                    />
                                </div>
                                {cambioPreview !== null && (
                                    <div className={`flex justify-between items-center rounded-xl px-3 py-2.5 text-sm font-bold ${cambioPreview >= 0 ? (dark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700') : (dark ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600')}`}>
                                        <span>{cambioPreview >= 0 ? 'Cambio' : 'Falta'}</span>
                                        <span className="font-mono">{fmx(Math.abs(cambioPreview))}</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mx-4 mb-3 flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-600">
                                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="px-4 pb-4">
                                <button
                                    onClick={handleConfirm}
                                    disabled={loading}
                                    className="w-full rounded-xl bg-[#0A3981] py-3 text-sm font-bold text-white hover:bg-[#0A3981]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                            Registrando...
                                        </span>
                                    ) : 'Confirmar venta'}
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
        </div>
    )
}
