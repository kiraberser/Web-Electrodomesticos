'use client'

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'

export interface ShippingData {
    // Guest fields
    guestName: string
    guestEmail: string
    guestPhone: string
    // Address (all users)
    savedDireccionId?: number
    calle: string
    ciudad: string
    estado: string
    codigoPostal: string
    notas: string
}

export interface CheckoutState {
    step: 1 | 2 | 3
    isGuest: boolean
    shippingData: ShippingData
    couponCode: string
    couponDiscount: number
    // Populated after order creation (Step 1 → Step 2)
    pedidoId?: number
    pedidoTotal?: string
    // Populated after payment (Step 2 → Step 3)
    paymentStatus?: 'approved' | 'rejected' | 'pending'
    paymentMethod?: 'card' | 'cash'
    voucherUrl?: string
    expiresAt?: string
}

const DEFAULT_SHIPPING: ShippingData = {
    guestName: '', guestEmail: '', guestPhone: '',
    calle: '', ciudad: '', estado: '', codigoPostal: '', notas: '',
}

interface CheckoutContextType {
    state: CheckoutState
    setStep: (step: 1 | 2 | 3) => void
    setShippingData: (data: Partial<ShippingData>) => void
    setPedidoCreado: (pedidoId: number, total: string) => void
    setCoupon: (code: string, discount: number) => void
    setPaymentResult: (result: {
        status: 'approved' | 'rejected' | 'pending'
        method: 'card' | 'cash'
        pedidoId?: number
        total?: string
        voucherUrl?: string
        expiresAt?: string
    }) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function CheckoutProvider({
    children,
    isGuest,
    initialEmail,
}: {
    children: ReactNode
    isGuest: boolean
    initialEmail?: string
}) {
    const [state, setState] = useState<CheckoutState>({
        step: 1,
        isGuest,
        shippingData: { ...DEFAULT_SHIPPING, guestEmail: initialEmail ?? '' },
        couponCode: '',
        couponDiscount: 0,
    })

    const setStep = useCallback((step: 1 | 2 | 3) => {
        setState(prev => ({ ...prev, step }))
    }, [])

    const setShippingData = useCallback((data: Partial<ShippingData>) => {
        setState(prev => ({ ...prev, shippingData: { ...prev.shippingData, ...data } }))
    }, [])

    const setPedidoCreado = useCallback((pedidoId: number, total: string) => {
        setState(prev => ({ ...prev, pedidoId, pedidoTotal: total }))
    }, [])

    const setCoupon = useCallback((code: string, discount: number) => {
        setState(prev => ({ ...prev, couponCode: code, couponDiscount: discount }))
    }, [])

    const setPaymentResult = useCallback((result: {
        status: 'approved' | 'rejected' | 'pending'
        method: 'card' | 'cash'
        pedidoId?: number
        total?: string
        voucherUrl?: string
        expiresAt?: string
    }) => {
        setState(prev => ({
            ...prev,
            paymentStatus: result.status,
            paymentMethod: result.method,
            pedidoId: result.pedidoId ?? prev.pedidoId,
            pedidoTotal: result.total ?? prev.pedidoTotal,
            voucherUrl: result.voucherUrl,
            expiresAt: result.expiresAt,
        }))
    }, [])

    const value = useMemo(
        () => ({ state, setStep, setShippingData, setPedidoCreado, setCoupon, setPaymentResult }),
        [state, setStep, setShippingData, setPedidoCreado, setCoupon, setPaymentResult],
    )

    return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckoutContext() {
    const ctx = useContext(CheckoutContext)
    if (!ctx) throw new Error('useCheckoutContext must be used within CheckoutProvider')
    return ctx
}
