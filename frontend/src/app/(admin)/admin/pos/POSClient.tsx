'use client'

import { useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import {
    Search, Plus, Minus, Trash2, ShoppingBag,
    CheckCircle, AlertCircle, Package, X, Printer,
} from 'lucide-react'
import { useReactToPrint } from 'react-to-print'
import { useAdminTheme } from '@/features/admin/hooks/useAdminTheme'
import {
    searchRefaccionesAction,
    createVentasAction,
    type CartItem,
    type Refaccion,
} from '@/features/admin/pos-actions'
import type { TicketData } from './TicketPrint'

const TicketPrint = dynamic(() => import('./TicketPrint'), { ssr: false })

const ESTADO_LABEL: Record<string, string> = {
    NVO: 'Nuevo',
    UBS: 'Usado B/S',
    REC: 'Recon.',
}

const ESTADO_COLOR: Record<string, string> = {
    NVO: 'bg-emerald-100 text-emerald-700',
    UBS: 'bg-amber-100 text-amber-700',
    REC: 'bg-blue-100 text-blue-700',
}

function formatMXN(amount: number) {
    return amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
}

export default function POSClient() {
    const { dark } = useAdminTheme()

    // search
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Refaccion[]>([])
    const [searching, setSearching] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // cart
    const [cart, setCart] = useState<CartItem[]>([])

    // pago
    const [pago, setPago] = useState('')

    // submit
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [receipt, setReceipt] = useState<TicketData | null>(null)

    // print
    const ticketRef = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        contentRef: ticketRef,
        pageStyle: '@page { size: 58mm auto; margin: 2mm; } body { margin: 0; }',
    })

    // ── search ──────────────────────────────────────────────────────────────
    const handleQueryChange = useCallback((value: string) => {
        setQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        if (value.trim().length < 2) {
            setResults([])
            return
        }
        setSearching(true)
        debounceRef.current = setTimeout(async () => {
            const data = await searchRefaccionesAction(value)
            setResults(data)
            setSearching(false)
        }, 350)
    }, [])

    // ── cart operations ─────────────────────────────────────────────────────
    const addToCart = useCallback((refaccion: Refaccion) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.refaccion.id === refaccion.id)
            if (existing) {
                return prev.map((i) =>
                    i.refaccion.id === refaccion.id
                        ? { ...i, cantidad: i.cantidad + 1 }
                        : i,
                )
            }
            return [...prev, { refaccion, cantidad: 1, precio_unitario: Number(refaccion.precio) }]
        })
    }, [])

    const updateQty = useCallback((id: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((i) =>
                    i.refaccion.id === id ? { ...i, cantidad: i.cantidad + delta } : i,
                )
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
    const cambioPreview = pagoNum > 0 ? pagoNum - cartTotal : null

    // ── confirm sale ────────────────────────────────────────────────────────
    const handleConfirm = async () => {
        if (cart.length === 0) return
        setError(null)
        setLoading(true)
        const result = await createVentasAction(cart)
        setLoading(false)
        if (!result.success) {
            setError(result.error ?? 'Error desconocido')
            return
        }
        const ticketItems = cart.map((i) => ({
            nombre: i.refaccion.nombre,
            cantidad: i.cantidad,
            precio_unitario: i.precio_unitario,
            subtotal: i.cantidad * i.precio_unitario,
        }))
        const pagoNum = parseFloat(pago) || undefined
        const cambioNum = pagoNum != null ? Math.max(0, pagoNum - result.total!) : undefined
        setReceipt({
            items: ticketItems,
            total: result.total!,
            ids: result.ids!,
            fecha: new Date(),
            pago: pagoNum,
            cambio: cambioNum,
        })
        setCart([])
        setQuery('')
        setResults([])
        setPago('')
    }

    const resetPOS = () => setReceipt(null)

    // ── UI ──────────────────────────────────────────────────────────────────
    const base = dark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
    const card = dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
    const input = dark
        ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500'
        : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'

    // ── receipt screen ──────────────────────────────────────────────────────
    if (receipt) {
        const receiptSubtotal = receipt.total / 1.16
        const receiptIva = receipt.total - receiptSubtotal
        const divider = `border-t ${dark ? 'border-slate-700' : 'border-gray-200'}`

        return (
            <div className={`min-h-[60vh] flex items-center justify-center py-8 ${base}`}>
                {/* Hidden ticket — printed only */}
                <div className="hidden">
                    <TicketPrint ref={ticketRef} data={receipt} />
                </div>

                <div className={`w-full max-w-md rounded-2xl border shadow-lg ${card}`}>
                    {/* Header */}
                    <div className="p-6 text-center border-b" style={{ borderColor: dark ? '#1e293b' : '#e5e7eb' }}>
                        <div className="flex justify-center mb-3">
                            <CheckCircle className="h-12 w-12 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold">¡Venta registrada!</h2>
                        <p className={`text-sm mt-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            Folio{receipt.ids.length > 1 ? 's' : ''}{' '}
                            <span className="font-mono font-semibold">#{receipt.ids.join(', #')}</span>
                        </p>
                    </div>

                    {/* Product list */}
                    <div className="px-6 pt-4 pb-2">
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
                            Artículos vendidos
                        </p>
                        <div className="space-y-2">
                            {receipt.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                    <div className="flex-1 min-w-0 pr-3">
                                        <p className="font-medium truncate">{item.nombre}</p>
                                        <p className={`text-xs ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {item.cantidad} × {formatMXN(item.precio_unitario)}
                                        </p>
                                    </div>
                                    <span className="font-semibold shrink-0">{formatMXN(item.subtotal)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className={`mx-6 mt-3 pt-3 pb-4 ${divider} space-y-1.5`}>
                        <div className={`flex justify-between text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            <span>Subtotal (sin IVA)</span>
                            <span>{formatMXN(receiptSubtotal)}</span>
                        </div>
                        <div className={`flex justify-between text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                            <span>IVA (16%)</span>
                            <span>{formatMXN(receiptIva)}</span>
                        </div>
                        <div className={`flex justify-between text-base font-bold pt-1 border-t ${dark ? 'border-slate-700' : 'border-gray-200'}`}>
                            <span>Total</span>
                            <span className="text-emerald-500">{formatMXN(receipt.total)}</span>
                        </div>
                        {receipt.pago != null && (
                            <>
                                <div className={`flex justify-between text-sm pt-1 border-t ${dark ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'}`}>
                                    <span>Pago recibido</span>
                                    <span>{formatMXN(receipt.pago)}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-emerald-500">
                                    <span>Cambio</span>
                                    <span>{formatMXN(receipt.cambio ?? 0)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 space-y-3">
                        <button
                            onClick={handlePrint}
                            className={`w-full flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${dark ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                        >
                            <Printer className="h-4 w-4" />
                            Imprimir ticket
                        </button>
                        <button
                            onClick={resetPOS}
                            className="w-full rounded-xl bg-[#0A3981] py-3 text-sm font-semibold text-white hover:bg-[#0A3981]/90 transition-colors"
                        >
                            Nueva venta
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`space-y-4 ${base}`}>
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${dark ? 'text-slate-100' : 'text-gray-900'}`}>
                    Punto de Venta
                </h1>
                <p className={`mt-0.5 text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                    Busca una refacción y agrégala al carrito para registrar la venta
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 items-start">

                {/* ── Left: search + results ─────────────────────────────── */}
                <div className="space-y-3">
                    {/* Search input */}
                    <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? 'text-slate-400' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            placeholder="Buscar por nombre de refacción o código..."
                            className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3981]/30 ${input}`}
                        />
                        {query && (
                            <button
                                onClick={() => { setQuery(''); setResults([]) }}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Results */}
                    {searching && (
                        <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>Buscando...</p>
                    )}

                    {!searching && results.length === 0 && query.trim().length >= 2 && (
                        <div className={`rounded-xl border p-8 text-center ${card}`}>
                            <Package className={`mx-auto mb-2 h-8 w-8 ${dark ? 'text-slate-600' : 'text-gray-300'}`} />
                            <p className={`text-sm ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                Sin resultados para &ldquo;{query}&rdquo;
                            </p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {results.map((r) => {
                                const inCart = cart.some((i) => i.refaccion.id === r.id)
                                return (
                                    <div
                                        key={r.id}
                                        className={`rounded-xl border p-4 flex flex-col gap-3 transition-shadow hover:shadow-md ${card} ${inCart ? (dark ? 'ring-1 ring-emerald-500/40' : 'ring-1 ring-emerald-400/40') : ''}`}
                                    >
                                        {/* Image */}
                                        {r.imagen ? (
                                            <div className="relative h-24 w-full rounded-lg overflow-hidden bg-gray-100">
                                                <Image
                                                    src={r.imagen}
                                                    alt={r.nombre}
                                                    fill
                                                    sizes="200px"
                                                    className="object-contain p-2"
                                                />
                                            </div>
                                        ) : (
                                            <div className={`h-24 rounded-lg flex items-center justify-center ${dark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                                                <Package className={`h-8 w-8 ${dark ? 'text-slate-600' : 'text-gray-300'}`} />
                                            </div>
                                        )}

                                        {/* Info */}
                                        <div className="flex-1">
                                            <p className={`text-[11px] font-medium uppercase tracking-wider mb-0.5 ${dark ? 'text-slate-400' : 'text-gray-400'}`}>
                                                {r.marca}
                                            </p>
                                            <p className="text-sm font-semibold line-clamp-2 leading-snug mb-2">
                                                {r.nombre}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-[#0A3981]">
                                                    {formatMXN(Number(r.precio))}
                                                </span>
                                                <div className="flex items-center gap-1.5">
                                                    {r.estado && (
                                                        <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${ESTADO_COLOR[r.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                                                            {ESTADO_LABEL[r.estado] ?? r.estado}
                                                        </span>
                                                    )}
                                                    <span className={`text-[11px] ${r.existencias > 0 ? (dark ? 'text-emerald-400' : 'text-emerald-600') : 'text-red-400'}`}>
                                                        {r.existencias > 0 ? `${r.existencias} pzs` : 'Sin stock'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addToCart(r)}
                                            disabled={r.existencias === 0}
                                            className={`w-full rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                                                inCart
                                                    ? dark ? 'bg-emerald-700 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                                    : 'bg-[#0A3981] text-white hover:bg-[#0A3981]/90'
                                            }`}
                                        >
                                            {inCart ? '+ Agregar otra' : 'Agregar al carrito'}
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* ── Right: cart ────────────────────────────────────────── */}
                <div className={`rounded-xl border p-4 sticky top-4 ${card}`}>
                    <div className="flex items-center gap-2 mb-4">
                        <ShoppingBag className={`h-5 w-5 ${dark ? 'text-slate-300' : 'text-gray-700'}`} />
                        <h2 className="font-semibold text-base">Carrito</h2>
                        {cart.length > 0 && (
                            <span className="ml-auto rounded-full bg-[#0A3981] px-2 py-0.5 text-xs font-bold text-white">
                                {cart.reduce((s, i) => s + i.cantidad, 0)}
                            </span>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div className={`py-10 text-center ${dark ? 'text-slate-500' : 'text-gray-400'}`}>
                            <ShoppingBag className="mx-auto mb-2 h-8 w-8 opacity-30" />
                            <p className="text-sm">El carrito está vacío</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 mb-4 max-h-[360px] overflow-y-auto pr-1">
                                {cart.map((item) => (
                                    <div
                                        key={item.refaccion.id}
                                        className={`rounded-lg p-3 ${dark ? 'bg-slate-800' : 'bg-gray-50'}`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <p className="text-sm font-medium line-clamp-2 leading-snug flex-1">
                                                {item.refaccion.nombre}
                                            </p>
                                            <button
                                                onClick={() => removeItem(item.refaccion.id!)}
                                                className={`shrink-0 rounded p-0.5 transition-colors ${dark ? 'text-slate-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            {/* Qty controls */}
                                            <div className={`flex items-center gap-1 rounded-lg border ${dark ? 'border-slate-700' : 'border-gray-200'}`}>
                                                <button
                                                    onClick={() => updateQty(item.refaccion.id!, -1)}
                                                    className={`rounded-l-lg p-1.5 transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="w-7 text-center text-sm font-semibold">
                                                    {item.cantidad}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item.refaccion.id!, +1)}
                                                    className={`rounded-r-lg p-1.5 transition-colors ${dark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <span className="text-sm font-bold text-[#0A3981]">
                                                {formatMXN(item.cantidad * item.precio_unitario)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* IVA desglose */}
                            <div className={`space-y-1 py-3 border-t text-sm ${dark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <div className={`flex justify-between ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    <span>Subtotal (sin IVA)</span>
                                    <span>{formatMXN(subtotalSinIva)}</span>
                                </div>
                                <div className={`flex justify-between ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    <span>IVA (16%)</span>
                                    <span>{formatMXN(ivaAmount)}</span>
                                </div>
                                <div className={`flex justify-between items-center pt-2 border-t text-base font-bold ${dark ? 'border-slate-800' : 'border-gray-100'}`}>
                                    <span>Total</span>
                                    <span className="text-[#0A3981] text-lg">{formatMXN(cartTotal)}</span>
                                </div>
                            </div>

                            {/* Pago recibido */}
                            <div className={`pt-3 border-t ${dark ? 'border-slate-800' : 'border-gray-100'}`}>
                                <label className={`block text-xs font-medium mb-1 ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
                                    Pago recibido (opcional)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={pago}
                                    onChange={(e) => setPago(e.target.value)}
                                    placeholder={cartTotal.toFixed(2)}
                                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3981]/30 ${dark ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400'}`}
                                />
                                {cambioPreview !== null && (
                                    <div className={`flex justify-between items-center mt-2 text-sm font-semibold ${cambioPreview >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        <span>{cambioPreview >= 0 ? 'Cambio' : 'Falta'}</span>
                                        <span>{formatMXN(Math.abs(cambioPreview))}</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600 mb-3 mt-3">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full rounded-xl mt-5 bg-[#0A3981] py-3 text-sm font-semibold text-white hover:bg-[#0A3981]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        Registrando...
                                    </span>
                                ) : (
                                    'Confirmar venta'
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
