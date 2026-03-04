'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { CreditCard, Store, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/ui/forms/Button'
import { useCart } from '@/features/cart/CartContext'
import { useCheckoutFlow } from '@/features/checkout/hooks/useCheckoutFlow'
import {
    procesarCheckoutCardAction,
    procesarCheckoutEfectivoAction,
} from '@/features/checkout/actions'
import type { CheckoutItem } from '@/features/payments/api'

// Hoisted statics (Vercel: rendering-hoist-jsx)
const PAYMENT_METHODS_MAP = {
    oxxo: 'OXXO',
    paycash: '7-Eleven / Farmacias',
} as const

const MSI_OPTIONS = [1, 3, 6, 9, 12] as const

const FREE_SHIPPING_THRESHOLD = 600

// Lazy-load Card Brick — heavy SDK, only mounts when Step 2 active (Vercel: bundle-dynamic-imports)
const CardPaymentBrick = dynamic(
    () => import('@mercadopago/sdk-react').then(m => ({ default: m.CardPayment })),
    { ssr: false, loading: () => <PaymentSkeleton /> },
)

function PaymentSkeleton() {
    return (
        <div className="animate-pulse space-y-3 py-4">
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-100 rounded-lg" />
                <div className="h-12 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-12 bg-gray-100 rounded-lg" />
            <div className="h-12 bg-gray-200 rounded-lg mt-2" />
        </div>
    )
}

export default function Step2Payment() {
    const { state, handlePaymentResult, goToStep } = useCheckoutFlow()
    const { items } = useCart()

    // Compute total from cart (same logic as CartSummaryPanel)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150
    const discount = state.couponDiscount
    const total = Math.max(0, subtotal + shipping - discount)

    const [tab, setTab] = useState<'card' | 'cash'>('card')
    const [installments, setInstallments] = useState(1)
    const [cashMethod, setCashMethod] = useState<'oxxo' | 'paycash'>('oxxo')
    const [cashEmail, setCashEmail] = useState(state.shippingData.guestEmail || '')
    const [isProcessing, setIsProcessing] = useState(false)
    const [cardError, setCardError] = useState<string | null>(null)
    const [cashError, setCashError] = useState<string | null>(null)
    const isProcessingRef = useRef(false)

    // Initialize Mercado Pago SDK when component mounts
    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
        if (!publicKey) return
        import('@mercadopago/sdk-react').then(({ initMercadoPago }) => {
            initMercadoPago(publicKey, { locale: 'es-MX' })
        })
    }, [])

    // Build shipping payload from context (resolved in Step 1)
    const shippingPayload = {
        calle: state.shippingData.calle,
        ciudad: state.shippingData.ciudad,
        estado_envio: state.shippingData.estado,
        codigo_postal: state.shippingData.codigoPostal,
        notas: state.shippingData.notas,
        ...(state.isGuest && {
            guest_name: state.shippingData.guestName,
            guest_email: state.shippingData.guestEmail,
            guest_phone: state.shippingData.guestPhone,
        }),
    }

    const cartItems: CheckoutItem[] = items.map(item => ({
        refaccion: Number(item.id),
        cantidad: item.quantity,
    }))

    // Card Brick submit handler
    const handleCardSubmit = async (formData: unknown) => {
        if (isProcessingRef.current) return
        isProcessingRef.current = true
        setIsProcessing(true)
        setCardError(null)

        const data = formData as {
            token: string
            payment_method_id: string
            issuer_id?: string
            installments?: number
            payer?: { email?: string }
        }

        const payerEmail =
            data.payer?.email ||
            state.shippingData.guestEmail ||
            'comprador@refaccionariavega.mx'

        const result = await procesarCheckoutCardAction({
            ...shippingPayload,
            items: cartItems,
            token: data.token,
            payment_method_id: data.payment_method_id,
            issuer_id: data.issuer_id,
            installments: installments,
            payer_email: payerEmail,
        })

        isProcessingRef.current = false
        setIsProcessing(false)

        if (!result.success) {
            setCardError(result.error ?? 'Error al procesar el pago')
            return
        }

        if (result.status === 'rejected') {
            setCardError(
                result.detail
                    ? `Pago rechazado: ${result.detail.replace(/_/g, ' ')}`
                    : 'Pago rechazado. Verifica los datos de tu tarjeta e intenta de nuevo.',
            )
            return
        }

        handlePaymentResult({
            status: result.status!,
            method: 'card',
            pedidoId: result.pedidoId,
            total: result.total,
        })
    }

    const handleCashSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isProcessingRef.current || !cashEmail) return
        isProcessingRef.current = true
        setIsProcessing(true)
        setCashError(null)

        const result = await procesarCheckoutEfectivoAction({
            ...shippingPayload,
            items: cartItems,
            payment_method_id: cashMethod,
            payer_email: cashEmail,
        })

        isProcessingRef.current = false
        setIsProcessing(false)

        if (!result.success) {
            setCashError(result.error ?? 'Error al generar la referencia')
            return
        }

        handlePaymentResult({
            status: 'pending',
            method: 'cash',
            pedidoId: result.pedidoId,
            total: result.total,
            voucherUrl: result.voucher_url,
            expiresAt: result.expires_at,
        })
    }

    return (
        <div className="space-y-6">
            {/* Order summary strip */}
            <div className="rounded-xl bg-[#D4EBF8]/30 border border-[#D4EBF8] px-4 py-3 text-sm flex items-center justify-between">
                <span className="text-gray-600">{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
                <span className="font-bold text-[#0A3981]">
                    Total: ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
            </div>

            {/* Payment method tabs */}
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 border-b border-gray-100">
                    <button
                        type="button"
                        onClick={() => setTab('card')}
                        className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                            tab === 'card'
                                ? 'text-[#0A3981] border-b-2 border-[#0A3981] bg-[#D4EBF8]/20'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <CreditCard className="h-4 w-4" />
                        Tarjeta
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('cash')}
                        className={`flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-colors ${
                            tab === 'cash'
                                ? 'text-[#0A3981] border-b-2 border-[#0A3981] bg-[#D4EBF8]/20'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Store className="h-4 w-4" />
                        Efectivo (OXXO)
                    </button>
                </div>

                <div className="p-6">
                    {/* ─── TAB: TARJETA ─── */}
                    {tab === 'card' && (
                        <div className="space-y-4">
                            {/* MSI selector */}
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    Meses sin intereses
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {MSI_OPTIONS.map(msi => (
                                        <button
                                            key={msi}
                                            type="button"
                                            onClick={() => setInstallments(msi)}
                                            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                                                installments === msi
                                                    ? 'border-[#0A3981] bg-[#0A3981] text-white'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                            }`}
                                        >
                                            {msi === 1 ? '1 pago' : `${msi} MSI`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card error */}
                            {cardError && (
                                <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{cardError}</span>
                                </div>
                            )}

                            {/* Card Brick */}
                            {isProcessing ? (
                                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#0A3981] border-t-transparent mr-3" />
                                    Procesando pago...
                                </div>
                            ) : (
                                <CardPaymentBrick
                                    initialization={{ amount: total }}
                                    customization={{
                                        paymentMethods: {
                                            maxInstallments: 12,
                                            minInstallments: 1,
                                        },
                                    }}
                                    onSubmit={handleCardSubmit}
                                    onError={(err: unknown) => {
                                        console.error('CardBrick error:', err)
                                        toast.error('Error en el formulario de pago', {
                                            style: { background: '#dc2626', color: '#fff' },
                                        })
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {/* ─── TAB: EFECTIVO ─── */}
                    {tab === 'cash' && (
                        <form onSubmit={handleCashSubmit} className="space-y-5">
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                                <p className="font-semibold mb-1">¿Cómo funciona?</p>
                                <ol className="list-decimal list-inside space-y-1 text-amber-700">
                                    <li>Genera tu referencia de pago aquí</li>
                                    <li>Ve a la tienda que elijas y muestra el código</li>
                                    <li>Paga el monto exacto antes de la fecha límite</li>
                                    <li>Recibirás confirmación por correo</li>
                                </ol>
                            </div>

                            {/* Store selector */}
                            <div>
                                <p className="text-xs font-medium text-gray-600 mb-2">
                                    ¿Dónde vas a pagar?
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    {(Object.entries(PAYMENT_METHODS_MAP) as [keyof typeof PAYMENT_METHODS_MAP, string][]).map(
                                        ([key, label]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setCashMethod(key)}
                                                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                                                    cashMethod === key
                                                        ? 'border-[#0A3981] bg-[#D4EBF8]/30 text-[#0A3981]'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                                                }`}
                                            >
                                                {label}
                                            </button>
                                        ),
                                    )}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Correo para recibir el voucher *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={cashEmail}
                                    onChange={e => setCashEmail(e.target.value)}
                                    placeholder="tu@correo.com"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                                />
                            </div>

                            {cashError && (
                                <div className="flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>{cashError}</span>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isProcessing || !cashEmail}
                                className="w-full h-12 bg-[#E38E49] hover:bg-[#cf7d3c] text-white text-base font-semibold disabled:opacity-60"
                            >
                                {isProcessing
                                    ? 'Generando referencia...'
                                    : `Generar referencia ${PAYMENT_METHODS_MAP[cashMethod]}`}
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            {/* Back button */}
            <button
                type="button"
                onClick={() => goToStep(1)}
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
                ← Volver a datos de envío
            </button>
        </div>
    )
}
