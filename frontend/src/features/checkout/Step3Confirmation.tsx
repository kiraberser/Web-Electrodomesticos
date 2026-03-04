'use client'

import { memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, Clock, ExternalLink, MapPin, Package } from 'lucide-react'
import { Button } from '@/shared/ui/forms/Button'
import { useCheckoutContext } from '@/features/checkout/CheckoutProvider'
import { useCart } from '@/features/cart/CartContext'

// Hoisted static icons — never re-renders (Vercel: rendering-hoist-jsx)
const SUCCESS_ICON = (
    <div className="flex justify-center mb-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600 stroke-[1.5]" />
        </div>
    </div>
)

const VOUCHER_ICON = (
    <div className="flex justify-center mb-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Clock className="h-10 w-10 text-amber-600 stroke-[1.5]" />
        </div>
    </div>
)

// Memoized item row (Vercel: rerender-memo)
interface ItemRowProps {
    name: string
    price: number
    quantity: number
    image?: string
}

const ConfirmationItemRow = memo(function ConfirmationItemRow({
    name,
    price,
    quantity,
    image,
}: ItemRowProps) {
    return (
        <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
            {image && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                    <Image src={image} alt={name} fill className="object-contain p-1" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
                <p className="text-xs text-gray-500">
                    {quantity} × ${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
            </div>
            <span className="text-sm font-semibold text-gray-900">
                ${(price * quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </span>
        </div>
    )
})

const formatAddress = (s: { calle: string; ciudad: string; estado: string; codigoPostal: string }) =>
    `${s.calle}, ${s.ciudad}, ${s.estado} CP ${s.codigoPostal}`

export default function Step3Confirmation() {
    const { state } = useCheckoutContext()
    const { items } = useCart()
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
    const shipping = subtotal >= 600 ? 0 : 150
    const discount = state.couponDiscount
    const total = Math.max(0, subtotal + shipping - discount)

    const isCash = state.paymentMethod === 'cash'
    const isCard = state.paymentMethod === 'card'

    const expiresFormatted = state.expiresAt
        ? (() => {
              try {
                  return new Date(state.expiresAt).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                  })
              } catch {
                  return state.expiresAt
              }
          })()
        : null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                {isCash ? VOUCHER_ICON : SUCCESS_ICON}
                <h1 className="text-2xl font-bold text-[#0A3981]">
                    {isCash ? 'Referencia generada' : '¡Pedido confirmado!'}
                </h1>
                <p className="mt-1 text-gray-500 text-sm">
                    {isCash
                        ? 'Tu pedido está reservado. Paga antes de la fecha límite.'
                        : 'Tu pedido ha sido recibido y está en proceso.'}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-[#D4EBF8]/30 border border-[#D4EBF8] rounded-full px-4 py-1.5">
                    <Package className="h-4 w-4 text-[#1F509A]" />
                    <span className="text-sm font-semibold text-[#0A3981]">
                        Pedido #{state.pedidoId}
                    </span>
                </div>
            </div>

            {/* OXXO Voucher instructions */}
            {isCash && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-amber-900">Instrucciones de pago</h2>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-amber-800">
                        <li>
                            Ve a tu tienda{' '}
                            <strong>OXXO, 7-Eleven o Farmacia Guadalajara</strong>
                        </li>
                        <li>
                            Indica que deseas pagar en <strong>Mercado Pago</strong>
                        </li>
                        <li>
                            Muestra o proporciona el número de referencia del voucher
                        </li>
                        <li>
                            Paga el monto exactto:{' '}
                            <strong className="text-amber-900">
                                ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                            </strong>
                        </li>
                    </ol>
                    {expiresFormatted && (
                        <p className="text-sm text-amber-700 font-medium">
                            ⏰ Paga antes del: {expiresFormatted}
                        </p>
                    )}
                    {state.voucherUrl && (
                        <a
                            href={state.voucherUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Ver voucher de pago
                        </a>
                    )}
                </div>
            )}

            {/* Guest email banner */}
            {state.isGuest && state.shippingData.guestEmail && (
                <div className="rounded-xl bg-[#D4EBF8]/30 border border-[#D4EBF8] p-4 text-sm text-[#0A3981]">
                    📧 Recibirás confirmación en{' '}
                    <strong>{state.shippingData.guestEmail}</strong>
                </div>
            )}

            {/* Order summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-[#0A3981] mb-4">Resumen del pedido</h2>
                <div className="space-y-0">
                    {items.map(item => (
                        <ConfirmationItemRow
                            key={item.id}
                            name={String(item.name)}
                            price={item.price}
                            quantity={item.quantity}
                            image={item.image as string | undefined}
                        />
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Envío</span>
                        <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                            {shipping === 0 ? 'GRATIS' : `$${shipping} MXN`}
                        </span>
                    </div>
                    {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Descuento</span>
                            <span>-${discount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-dashed border-gray-200 font-bold text-base text-gray-900">
                        <span>Total</span>
                        <span>${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                    </div>
                </div>
            </div>

            {/* Delivery address */}
            {(state.shippingData.calle || state.shippingData.savedDireccionId) && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <h2 className="font-semibold text-[#0A3981] mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Dirección de entrega
                    </h2>
                    <p className="text-sm text-gray-600">
                        {formatAddress({
                            calle: state.shippingData.calle,
                            ciudad: state.shippingData.ciudad,
                            estado: state.shippingData.estado,
                            codigoPostal: state.shippingData.codigoPostal,
                        })}
                    </p>
                    {state.shippingData.notas && (
                        <p className="text-xs text-gray-400 mt-1">
                            Nota: {state.shippingData.notas}
                        </p>
                    )}
                </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
                <Link href="/categorias" className="block">
                    <Button className="w-full h-12 bg-[#0A3981] hover:bg-[#1F509A] text-white text-base font-semibold">
                        Seguir comprando
                    </Button>
                </Link>
                {!state.isGuest && (
                    <Link href="/cuenta/perfil/pedidos" className="block">
                        <Button
                            variant="outline"
                            className="w-full border-[#1F509A] text-[#1F509A] hover:bg-[#D4EBF8]/20"
                        >
                            Ver mis pedidos
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    )
}
