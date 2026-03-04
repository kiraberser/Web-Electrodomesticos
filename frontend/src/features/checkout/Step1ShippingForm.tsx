'use client'

import { useState, useRef } from 'react'
import { MapPin, Tag, Truck } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/shared/ui/forms/Button'
import { useCart } from '@/features/cart/CartContext'
import { validarCuponAction } from '@/features/checkout/actions'
import { useCheckoutFlow } from '@/features/checkout/hooks/useCheckoutFlow'
import type { ShippingData } from '@/features/checkout/CheckoutProvider'
import type { Direccion } from '@/shared/types/user'

const FREE_SHIPPING_THRESHOLD = 600

interface Props {
    initialAddresses: Direccion[]
}

export default function Step1ShippingForm({ initialAddresses }: Props) {
    const { state, submitShipping } = useCheckoutFlow()
    const { getTotalPrice } = useCart()
    const subtotal = getTotalPrice()
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150

    // Guest fields
    const [guestName, setGuestName] = useState(state.shippingData.guestName)
    const [guestEmail, setGuestEmail] = useState(state.shippingData.guestEmail)
    const [guestPhone, setGuestPhone] = useState(state.shippingData.guestPhone)

    // Address fields (guest) or selected address (registered)
    const [selectedDireccionId, setSelectedDireccionId] = useState<number | undefined>(
        state.shippingData.savedDireccionId ?? initialAddresses.find(d => d.is_primary)?.id,
    )
    const [showNewAddressForm, setShowNewAddressForm] = useState(initialAddresses.length === 0)
    const [calle, setCalle] = useState(state.shippingData.calle)
    const [ciudad, setCiudad] = useState(state.shippingData.ciudad)
    const [estadoEnvio, setEstadoEnvio] = useState(state.shippingData.estado)
    const [codigoPostal, setCodigoPostal] = useState(state.shippingData.codigoPostal)
    const [notas, setNotas] = useState(state.shippingData.notas)

    // Coupon
    const [couponInput, setCouponInput] = useState('')
    const [couponApplied, setCouponApplied] = useState(false)
    const [couponLoading, setCouponLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const submitRef = useRef(false)

    const handleApplyCoupon = async () => {
        if (!couponInput.trim() || couponLoading) return
        setCouponLoading(true)
        const result = await validarCuponAction(couponInput.trim())
        setCouponLoading(false)
        if (result.success) {
            setCouponApplied(true)
            toast.success(`Cupón aplicado: -$${result.discount}`, {
                style: { background: '#059669', color: '#fff' },
            })
        } else {
            toast.error(result.message ?? 'Cupón inválido', {
                style: { background: '#dc2626', color: '#fff' },
            })
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (submitRef.current || isLoading) return
        submitRef.current = true
        setIsLoading(true)

        // Build shipping data
        let resolvedCalle = calle
        let resolvedCiudad = ciudad
        let resolvedEstado = estadoEnvio
        let resolvedCP = codigoPostal

        if (!state.isGuest && selectedDireccionId && !showNewAddressForm) {
            const addr = initialAddresses.find(d => d.id === selectedDireccionId)
            if (addr) {
                resolvedCalle = addr.street
                resolvedCiudad = addr.city
                resolvedEstado = addr.state
                resolvedCP = addr.postal_code
            }
        }

        const data: ShippingData = {
            guestName: state.isGuest ? guestName : '',
            guestEmail: state.isGuest ? guestEmail : '',
            guestPhone: state.isGuest ? guestPhone : '',
            savedDireccionId: !state.isGuest && !showNewAddressForm ? selectedDireccionId : undefined,
            calle: resolvedCalle,
            ciudad: resolvedCiudad,
            estado: resolvedEstado,
            codigoPostal: resolvedCP,
            notas,
        }

        const error = await submitShipping(data)
        submitRef.current = false
        setIsLoading(false)

        if (error) {
            toast.error(error, { style: { background: '#dc2626', color: '#fff' } })
        }
    }

    const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Free shipping progress */}
            <div className="rounded-xl bg-[#D4EBF8]/30 border border-[#D4EBF8] p-4">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        ¡Tienes <strong>envío GRATIS</strong>!
                    </p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-2">
                            Agrega{' '}
                            <span className="font-bold text-[#0A3981]">
                                ${(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                            </span>{' '}
                            más para obtener envío gratis
                        </p>
                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#1F509A] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Envío: ${shippingCost} MXN</p>
                    </>
                )}
            </div>

            {/* Guest info fields */}
            {state.isGuest && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-[#0A3981] flex items-center gap-2">
                        Tus datos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                required
                                value={guestName}
                                onChange={e => setGuestName(e.target.value)}
                                placeholder="Ej. Juan García"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                required
                                value={guestPhone}
                                onChange={e => setGuestPhone(e.target.value)}
                                placeholder="Ej. 7641234567"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                Correo electrónico * (para confirmación)
                            </label>
                            <input
                                type="email"
                                required
                                value={guestEmail}
                                onChange={e => setGuestEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Address section */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                <h2 className="font-semibold text-[#0A3981] flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección de entrega
                </h2>

                {/* Registered user: address picker */}
                {!state.isGuest && initialAddresses.length > 0 && !showNewAddressForm && (
                    <div className="space-y-3">
                        {initialAddresses.map(addr => (
                            <label
                                key={addr.id}
                                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedDireccionId === addr.id
                                        ? 'border-[#1F509A] bg-[#D4EBF8]/20'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="direccion"
                                    value={addr.id}
                                    checked={selectedDireccionId === addr.id}
                                    onChange={() => setSelectedDireccionId(addr.id)}
                                    className="mt-1 accent-[#1F509A]"
                                />
                                <div className="text-sm">
                                    <p className="font-semibold text-gray-900">
                                        {addr.nombre}
                                        {addr.is_primary && (
                                            <span className="ml-2 text-xs font-medium text-[#1F509A] bg-[#D4EBF8] px-2 py-0.5 rounded-full">
                                                Principal
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-gray-500 mt-0.5">
                                        {addr.street}, {addr.colony && `${addr.colony},`} {addr.city},{' '}
                                        {addr.state} CP {addr.postal_code}
                                    </p>
                                </div>
                            </label>
                        ))}
                        {initialAddresses.length < 3 && (
                            <button
                                type="button"
                                onClick={() => setShowNewAddressForm(true)}
                                className="text-sm text-[#1F509A] font-medium hover:underline"
                            >
                                + Agregar otra dirección
                            </button>
                        )}
                    </div>
                )}

                {/* Address form (guests + registered who click "add new") */}
                {(state.isGuest || showNewAddressForm || initialAddresses.length === 0) && (
                    <div className="space-y-4">
                        {!state.isGuest && showNewAddressForm && (
                            <button
                                type="button"
                                onClick={() => setShowNewAddressForm(false)}
                                className="text-xs text-gray-500 hover:underline"
                            >
                                ← Usar dirección guardada
                            </button>
                        )}
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Calle y número *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={calle}
                                    onChange={e => setCalle(e.target.value)}
                                    placeholder="Ej. Av. Hidalgo 123"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Ciudad *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={ciudad}
                                        onChange={e => setCiudad(e.target.value)}
                                        placeholder="Martínez de la Torre"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Estado *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={estadoEnvio}
                                        onChange={e => setEstadoEnvio(e.target.value)}
                                        placeholder="Veracruz"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Código postal *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={5}
                                        value={codigoPostal}
                                        onChange={e => setCodigoPostal(e.target.value)}
                                        placeholder="93600"
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Notas */}
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                        Notas de entrega (opcional)
                    </label>
                    <textarea
                        rows={2}
                        value={notas}
                        onChange={e => setNotas(e.target.value)}
                        placeholder="Ej. Dejar con portero, tocar timbre..."
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F509A] resize-none"
                    />
                </div>
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-[#0A3981] flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5" />
                    Cupón de descuento
                </h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="CÓDIGO"
                        disabled={couponApplied}
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1F509A] disabled:bg-gray-50 disabled:text-gray-400"
                    />
                    <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || couponLoading || !couponInput.trim()}
                        className="bg-[#0A3981] hover:bg-[#1F509A] text-white disabled:opacity-50"
                    >
                        {couponApplied ? '✓' : couponLoading ? '...' : 'Aplicar'}
                    </Button>
                </div>
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#E38E49] hover:bg-[#cf7d3c] text-white text-base font-semibold shadow-lg shadow-orange-100 disabled:opacity-60"
            >
                {isLoading ? 'Continuando...' : 'Continuar al Pago →'}
            </Button>
        </form>
    )
}
